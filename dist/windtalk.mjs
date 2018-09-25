let _target, _remoteWindow, _attached;
const _callbacks = {};

const _reduce = list => list.reduce((o, prop) => (o ? o[prop] : o), _target);

async function _handler(event) {
  const data = event.data;
  let id, type, cb;
  if (id = data && data.id) {
    if ((type = data.type) && _remoteWindow && _target) {
      data.path = data.path || [];
      const msg = { id };
      const ref = _reduce(data.path);
      const refParent = _reduce(data.path.slice(0, -1));
      switch (type) {
        case 'GET':
          msg.value = ref;
          break;
        case 'SET':
          const prop = data.path.length && data.path.pop();
          if (prop) {
            refParent[prop] = data.value;
          }
          break;
        case 'APPLY':
          try {
            msg.value = await ref.apply(refParent, data.args || []);
          } catch (err) {
            msg.error = err.toString();
          }
          break;
      }
      _remoteWindow.postMessage(msg, '*');
    } else if (cb = _callbacks[id]) {
      delete _callbacks[id];
      if (data.error) {
        cb[1](new Error(data.error));
      } else {
        cb[0](data.value);
      }
    }
  }
}

function _attach() {
  if (!_attached) {
    self.addEventListener('message', _handler);
    _attached = true;
  }
}

function createRmote(w) {
  const uid = `${Date.now()}-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
  let c = 0;
  _attach();
  return request => {
    const args = request.args || [];
    const id = `${uid}-${++c}`;
    return new Promise((resolve, reject) => {
      _callbacks[id] = [resolve, reject];
      w.postMessage(Object.assign({}, request, { id, args }), '*');
    });
  };
}

function proxy(remote, path) {
  path = path || [];
  return new Proxy(function () { }, {
    get(_, prop, rec) {
      if (prop === 'then') {
        if (path.length === 0) {
          return { then: () => rec };
        }
        const p = remote({ type: 'GET', path });
        return p.then.bind(p);
      }
      return proxy(remote, path.concat(prop));
    },
    set(_, prop, value) {
      return remote({ type: 'SET', path: path.concat(prop), value });
    },
    apply(_, thisArg, args) {
      return remote({ type: 'APPLY', path, args });
    }
  });
}

function link(endPoint) {
  return proxy(createRmote(endPoint));
}

function expose(target, endPoint) {
  _remoteWindow = endPoint || window.top;
  _target = target;
  _attach();
}

export { link, expose };
