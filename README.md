![windtalk banner](https://pshihn.github.io/windtalk/images/banner.png)

# WindTalk

A seamless way for two <b><i>WIND</i></b>ows to <b><i>TALK</i></b> to each other. 

Windtalk exports a function or an object from within an iFrame or Window. This can now be invoked from any other window.

* All calls are async. Works great with async/await
* Only 677 bytes gzipped

## Motivation

How does code in one window communicate with an iFrame or another window?

The traditional way to do this is by passing messages (See [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)). The host window will send a message to iFrame. iFrame will receive a message, parse the message and then call some code. The iFrame will then take the result of the code and then send a message to the host window with the result. The host window will now receive the message, parse it, and then call its own code. 

In theory, this is fine. One can wrap this boilerplate message parsing to make the life easier. But when you have new code to add, you have to add another `if` clause in message parsing and then call the new code. 

Wouldn't it be nice if we could just _call the code in the other window like **any other code!**_

```javascript
objectInIframe.name = 'Bilbo Baggins';
await objectInIframe.updateProfile();
objectInIframe.resize();
```

This is possible to achieve if all the message boilerplate code is tethered behind a [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

_This is where WindTalk comes in and provides you with that capability._


## Usage

WindTalk is essentially two methods:

_**expose**_ makes a function or object available to other windows. 

_**link**_ creates an interface for the exposed method/object in another winow

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

### Bidirectional

Code in an iFrame can be invoked from the parent Window, and vice versa. Any one can invoke the exposed object if they have a reference to the Window object.

## Install

Download the latest from [dist folder](https://github.com/pshihn/windtalk/tree/master/dist)

or from npm:
```
npm install --save windtalk
```

use it in ES6 modules:
```javascript
import { expose, link } from 'windtalk';
```

## License
[MIT License](https://github.com/pshihn/windtalk/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

### You may also be interested in
[Workly](https://github.com/pshihn/workly) - A really simple way to move a function or class to a web worker. Or, expose a function or object in a web worker to the main thread.
