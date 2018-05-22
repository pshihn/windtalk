![windtalk banner](https://pshihn.github.io/windtalk/images/banner.png)

# windtalk  🗣💨

Micro lib (764 bytes gzipped) that provides a seamless way for two <b><i>WIND</i></b>ows to <b><i>TALK</i></b> to each other. 

* Work with objects/functions defined in another window/iframe. 
* All calls are async. Works great with async/await.

## Usage
Let's consider a case where a parent window wants to interact with an object in an iframe.


In the iframe:
```javascript
const color = {
  red: 0,
  green: 0,
  blue: 0,
  update: function () {
    // update the ui
  }
};
windtalk.expose(color);
```
In parent window:
```javascript
const color = windtalk.link(iframe.contentWindow);
color.red = 200;
color.green = 150;
color.blue = 10;
color.update();
```

### Expose Functions (not just objects)
Consider a case where one window wants to invoke a function in another window (or iframe) and get the result back.

Window1:
```javascript
function doAdd(a, b) {
  return a + b;
}
windtalk.expose(doAdd);
```
Window2:

```javascript
const doAdd = windtalk.link(win1);
let result = await doAdd(2, 3);
console.log(result); // 5
```

## Install

Download the latest from [dist folder](https://github.com/pshihn/windtalk/tree/master/dist)

or from npm:
```
npm install --save windtalk
```

## Full API
[Windtalk API](https://github.com/pshihn/windtalk/wiki/Windtalk-API)

## Examples
[Examples page](https://github.com/pshihn/windtalk/wiki/Examples)

## License
[MIT License](https://github.com/pshihn/windtalk/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

### You may also be interested in
[Workly](https://github.com/pshihn/workly) - A really simple way to move a function or class to a web worker. Or, expose a function or object in a web worker to the main thread.
