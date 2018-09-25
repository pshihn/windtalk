let _target, remoteWindow, _attached;
const callbacks = {};

const reducePath = list => list.reduce((o, prop) => (o ? o[prop] : o), _target);

async function messageHandler(event) {
  const data = event.data;
  let id, type, cb;
  if (id = data && data.id) {
    if ((type = data.type) && remoteWindow && _target) {
      data.path = data.path || [];
      const msg = { id };
      const ref = reducePath(data.path);
      const refParent = reducePath(data.path.slice(0, -1));
      switch (type) {
        case 'G': // Get
          msg.value = ref;
          break;
        case 'S': // Set
          const prop = data.path.length && data.path.pop();
          if (prop) {
            refParent[prop] = data.value;
          }
          break;
        case 'A': // Apply
          try {
            msg.value = await ref.apply(refParent, data.args || []);
          } catch (err) {
            msg.error = err.toString();
          }
          break;
      }
      remoteWindow.postMessage(msg, '*');
    } else if (cb = callbacks[id]) {
      delete callbacks[id];
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
    self.addEventListener('message', messageHandler);
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
      callbacks[id] = [resolve, reject];
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
        const p = remote({ type: 'G', path });
        return p.then.bind(p);
      }
      return proxy(remote, path.concat(prop));
    },
    set(_, prop, value) {
      return remote({ type: 'S', path: path.concat(prop), value });
    },
    apply(_, thisArg, args) {
      return remote({ type: 'A', path, args });
    }
  });
}

export function link(endPoint) {
  return proxy(createRmote(endPoint));
}

export function expose(target, endPoint) {
  remoteWindow = endPoint || window.top;
  _target = target;
  _attach();
}