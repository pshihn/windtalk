let t,e;const n={},r=e=>e.reduce((t,e)=>t?t[e]:t,t);async function a(e){const a=e.data;let s,o,c;if(s=a&&a.id)if((o=a.type)&&t){a.path=a.path||[];const t={id:s},n=r(a.path),c=r(a.path.slice(0,-1));switch(o){case"G":t.value=n;break;case"S":const e=a.path.length&&a.path.pop();e&&(c[e]=a.value);break;case"A":try{t.value=await n.apply(c,a.args||[])}catch(e){t.error=e.toString()}}e.source.postMessage(t,"*")}else(c=n[s])&&(delete n[s],a.error?c[1](new Error(a.error)):c[0](a.value))}function s(){e||(self.addEventListener("message",a),e=!0)}function o(t){return function t(e,n){return n=n||[],new Proxy(function(){},{get(r,a,s){if("then"===a){if(0===n.length)return{then:()=>s};const t=e({type:"G",path:n});return t.then.bind(t)}return t(e,n.concat(a))},set:(t,r,a)=>e({type:"S",path:n.concat(r),value:a}),apply:(t,r,a)=>e({type:"A",path:n,args:a})})}(function(t){const e=`${Date.now()}-${Math.floor(Math.random()*Number.MAX_SAFE_INTEGER)}`;let r=0;return s(),a=>{const s=a.args||[],o=`${e}-${++r}`;return new Promise((e,r)=>{n[o]=[e,r],t.postMessage(Object.assign({},a,{id:o,args:s}),"*")})}}(t))}function c(e){t=e,s()}export{c as expose,o as link};
