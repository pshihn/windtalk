(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.windtalk = {})));
}(this, (function (exports) { 'use strict';

  let _target, isAttached;
  const callbacks = {};

  const reducePath = list => list.reduce((o, prop) => (o ? o[prop] : o), _target);

  async function messageHandler(event) {
    const data = event.data;
    let id, type, cb;
    if (id = data && data.id) {
      if ((type = data.type) && _target) {
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
        event.source.postMessage(msg, '*');
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

  function attach() {
    if (!isAttached) {
      self.addEventListener('message', messageHandler);
      isAttached = true;
    }
  }

  function createRemote(w) {
    const uid = `${Date.now()}-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
    let c = 0;
    attach();
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
      apply(_, __, args) {
        return remote({ type: 'A', path, args });
      }
    });
  }

  function link(endPoint) {
    return proxy(createRemote(endPoint));
  }

  function expose(target) {
    _target = target;
    attach();
  }

  exports.link = link;
  exports.expose = expose;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
