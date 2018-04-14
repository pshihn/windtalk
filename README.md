![windtalk banner](https://pshihn.github.io/windtalk/images/banner.png)

# Windtalk

Micro lib (742 bytes gzipped) that provides a seamless way for two <b><i>wind</i></b>ows to <b><i>talk</i></b> to each other. 

* Work with objects/functions defined in another window/iframe. 
* All calls are async. Works great with async/await.

## Usage

In the iFrame:
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
Window1:
```javascript
function doAdd(a, b) {
  retudn a + b;
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

## Examples
See the [examples folder](https://github.com/pshihn/windtalk/tree/master/examples).

## License
[MIT License](https://github.com/pshihn/windtalk/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
