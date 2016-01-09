Promisr
=======

An abstraction of Promise library and the utilities

[![Build Status](https://travis-ci.org/japboy/promisr.svg)](https://travis-ci.org/japboy/promisr)

## tl;dr

Install with NPM on Node.js:

```
npm install --save promisr
```

Load from CDN for web browsers:

```html
<script src="https://npmcdn.com/underscore@1.8.3/underscore-min.js"></script>
<script src="https://npmcdn.com/promisr@0.1.0/dist/promisr.min.js"></script>
```

Use this module like;

```javascript
var Promisr = require('promisr');

var promisr = new Promisr(window.Promise || window.Q || window.jQuery);

var proc = promisr.promisify(function (resolve, reject, value) {
  if (value) return resolve(value);
  reject(value);
});

proc(true)
.then(function (value) {
  console.log(value);  // true
});
```

Read [API doc](doc/api.md) for details.


License
-------

```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
```


Maintainer
----------

Yu Inao &lt;yu.inao@facebook.com&gt;
