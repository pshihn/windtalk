var windtalk = (function (exports) {
  'use strict';

  function proxy(remote, path) {
    path = path || [];
    return new Proxy(function () { }, {
      get(_, prop, receiver) {
        if (prop === 'then') {
          if (path.length === 0) {
            return { then: () => receiver };
          }
          const p = remote.post({ type: 'GET', path });
          return p.then.bind(p);
        }
        return proxy(remote, path.concat(prop));
      },
      set(_, prop, value) {
        return remote.post({ type: 'SET', path: path.concat(prop), value });
      },
      apply(_, thisArg, args) {
        return remote.post({ type: 'APPLY', path, args });
      }
    });
  }

  function randomInt() { return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); }

  class Remote {
    constructor(w) {
      this.w = w; // other window
      this.uid = `${Date.now()}-${randomInt()}`;
      this.c = 0; // counter
      this.cbs = {}; // callbacks
      self.addEventListener('message', event => {
        const id = event.data && event.data.windtalk && event.data.id;
        const cb = id && this.cbs[id];
        if (cb) {
          delete this.cbs[id];
          if (event.data.error) {
            cb[1](new Error(event.data.error));
          } else {
            cb[0](event.data.value);
          }
        }
      });
    }
    post(request) {
      const args = request.args || [];
      const id = `${this.uid}-${++this.c}`;
      return new Promise((resolve, reject) => {
        this.cbs[id] = [resolve, reject];
        this.w.postMessage(Object.assign({}, request, { id, args, target: this.uid, windtalk: true }), '*');
      });
    }
  }

  function link(endPoint) {
    return proxy(new Remote(endPoint));
  }

  function expose(target, endPoint) {
    const _target = target;
    const w = endPoint || window.top;
    self.addEventListener('message', async event => {
      if (event.data && event.data.id && event.data.type && event.data.windtalk) {
        const data = event.data;
        data.path = data.path || [];
        const id = data.id;
        const reduce = list => list.reduce((o, prop) => (o ? o[prop] : o), _target);
        const msg = { id, windtalk: true };
        const ref = reduce(data.path);
        const refParent = reduce(data.path.slice(0, -1));
        switch (data.type) {
          case 'GET':
            msg.value = ref;
            break;
          case 'SET':
            const prop = data.path.length && data.path[data.path.length - 1];
            if (prop) {
              refParent[prop] = data.value;
            }
            msg.value = prop ? true : false;
            break;
          case 'APPLY':
            try {
              msg.value = await ref.apply(refParent, data.args || []);
            } catch (err) {
              msg.error = err.toString();
            }
            break;
        }
        w.postMessage(msg, '*');
      }
    });
  }

  exports.link = link;
  exports.expose = expose;

  return exports;

}({}));
