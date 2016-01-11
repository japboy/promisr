API
===

index.js
---

- [`Promisr`](#Promisr)

- [`isPromise`](#isPromise)

- [`promisify`](#promisify)

- [`lazify`](#lazify)

- [`just`](#just)

- [`if`](#if)

- [`unlessFalsy`](#unlessFalsy)

- [`unlessError`](#unlessError)

- [`timer`](#timer)

- [`all`](#all)

- [`any`](#any)

- [`some`](#some)

- [`map`](#map)

- [`count`](#count)

- [`tick`](#tick)

### <a id="Promisr"></a> `Promisr`

The constructor to instantiate Promisr class

```javascript
var promisr = new Promisr(window.Promise || window.Q || window.jQuery)
```

#### Arguments:

- `Subject :: Object` `Promise`, `Q`, or `$` is acceptable.

#### Return:

*(Object)* An instance of Promisr class associated with `Promise`,     `Q`, or `$`

- - -

### <a id="isPromise"></a> `isPromise()`

- - -

### <a id="promisify"></a> `promisify(func)`

Create new asynchronous function which returns a Promise interface.
This is a higher-order function. The function `func` takes 2 parameters
`resolve` and `reject` at least.

#### func(resolve, reject, [args...])

`resolve` and `reject` are always there, and `args...` can be continued
if you want to put some arguments.

Here is the example:

```javascript
var fn = promisify(function (resolve, reject, value) {
  if (value) return resolve(value);
  reject(value);
});

fn(true)
.then(function (value) {
  console.log(value);  // true
});
```

#### Arguments:

- `func :: Function` An immediate function having `resolve` and     `reject` callbacks and being executed asynchronously

#### Return:

*(Function)* A partial function will returns a Promise

- - -

### <a id="lazify"></a> `lazify(func)`

Create new asynchronous function which returns a Promise interface. This higher-order function, despite the function which is returned by `promisify` has `resolve` and `reject`, only has user defined arguments.

#### func([args...])

Once you `throw` a value from the inside of `fn`, `lazify` will call `reject` and pass the value:

```javascript
var fn = lazify(function (value) {
  if (value) return value;
  throw new Error('Falsy error');
});

fn(false)
.then(function (value) {
  // Won't be called.
}, function (error) {
  console.error(error.message);  // Falsy error
});
```

#### Arguments:

- `func :: Function` An immediate function being curried and lazy evaluated

#### Return:

*(Function|Object)* A curried function or a Promise object

- - -

### <a id="just"></a> `just(value)`

Return the `value` through a Promise interface. This function will
always `resolve` the `value`.

```javascript
promisr.just(true)
.then(function (value) {
  console.log(value);  // true
});
```

#### Arguments:

- `value :: Object` Anything

#### Return:

*(Promise)* a Promise object

- - -

### <a id="if"></a> `if(condition, value)`

Return the `value` through a Promise interface. This function, despite
`just` always `resolve`, will `reject` if the `condition()` is falsy.

```javascript
promisr.if(function (value) {
  return !value instanceof Error;
}, new Error('An error'))
.then(function (value) {
  // Won't be called.
}, function (error) {
  console.error(error.message);  // An error
});
```

#### Arguments:

- `condition :: Function` A predicate
- `value :: Object` Anything

#### Return:

*(Promise)* a Promise object

- - -

### <a id="unlessFalsy"></a> `unlessFalsy(value)`

#### Arguments:

- `value :: Object` Anything

#### Return:

*(Promise)* a Promise object

- - -

### <a id="unlessError"></a> `unlessError(value)`

#### Arguments:

- `value :: Object` Anything

#### Return:

*(Promise)* a Promise object

- - -

### <a id="timer"></a> `timer(millisec)`

Promise returns timer sleep

#### Arguments:

- `millisec :: Number` Milliseconds to wait

#### Return:

*(Promise)* a Promise object

- - -

### <a id="all"></a> `all(args)`

Shorthand for `Promise.all`, `Q.all`, or `$.when` to wait for multiple Promises

```javascript
promisr.all(promisr.timer(100), promisr.timer(200), promisr.timer(300))
.then(function (results) {
  console.log(results[0], results[1], results[2]);  // 100, 200, 300
});
```

#### Arguments:

- `args :: Array|Promise` Promise arguments

#### Return:

*(Promise)* A Promise object

- - -

### <a id="any"></a> `any(args)`

#### Arguments:

- `args :: Array|Promise` Promise arguments

- - -

### <a id="some"></a> `some(args)`

#### Arguments:

- `args :: Array|Promise` Promise arguments

- - -

### <a id="map"></a> `map(items, func)`

Promise concatenates array values as promises

```javascript
promisr.map(urls, promisr.promisify(function (resolve, reject, url) {
  var el = document.createElement('img');
  el.addEventListener('load', function (ev) {
    resolve(ev.target);
  }, false);
  el.addEventListener('error', function (ev) {
    reject(error);
  }, false);
  el.setAttribute('src', url);
}))
.then(function (els) {
  // Draw preloaded <img>'s
  els.forEach(function (el) {
    document.body.appendChild(el);
  });
});
```

#### Arguments:

- `items :: Array` Array values will be tranformed to promises
- `func :: Function` A function transforms `items` to promises

#### Return:

*(Object)* a Promise object

- - -

### <a id="count"></a> `count(done, times, interval)`

Return the `done` Promise interface which has been retried `times` with `interval`.

```javascript
var count = 0;

var done = promisify(function (resolve, reject) {
  count += 1;
  if (5 < count) return resolve(count);
  reject(new Error('Not yet'));
});

promisr.count(done, 10, 300)
.then(function (count) {
  console.log(count);  // 6
});
```

See: https://gist.github.com/kriskowal/593052

#### Arguments:

- `done :: Object` A promisified function
- `times :: Number` A number of retrying
- `interval :: Number` An amount of millisecond interval

#### Return:

*(Object)* A Promise returns success or failed status

- - -

### <a id="tick"></a> `tick(done, times)`

Return the `done` Promise interface which has been retried in the `duration`.

```javascript
var flag = false;
setTimeout(function () { flag = true; }, 2000);

var done = promisify(function (resolve, reject) {
  if (flag) return resolve(flag);
  reject(new Error('Not yet'));
});

promisr.tick(done, 3000)
.then(function (flag) {
  console.log(flag);  // true
});
```

See: https://gist.github.com/briancavalier/842626

#### Arguments:

- `done :: Object` A promisified function
- `times :: Number` A number of millisecon duration

#### Return:

*(Object)* A Promise returns success or failed status

- - -

