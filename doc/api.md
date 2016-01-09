API
===

index.js
---

- [`Promisr`](#Promisr)

- [`promisify`](#promisify)

- [`passed`](#passed)

- [`promisified`](#promisified)

- [`sleep`](#sleep)

- [`lazify`](#lazify)

- [`attemptCounted`](#attemptCounted)

- [`attemptTicked`](#attemptTicked)

- [`all`](#all)

- [`map`](#map)

### <a id="Promisr"></a> `Promisr`

The constructor to instantiate Promisr class

```javascript
let promisr = new Promisr(window.Promise || window.Q || window.jQuery)
```

#### Arguments:

- `Subject :: Object` `Promise`, `Q`, or `$` is acceptable.

#### Return:

*(Object)* An instance of Promisr class associated with `Promise`,     `Q`, or `$`

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

### <a id="passed"></a> `passed`

Return the `value` through a Promise interface. This function will
always `resolve` the `value`.

```javascript
passed(true)
.then(function (value) {
  console.log(value);  // true
});
```

#### Arguments:

- `val :: Object` Any values

#### Return:

*(Object)* a jQuery Deferred's Promise object

- - -

### <a id="promisified"></a> `promisified(val)`

Return the `value` through a Promise interface. This function, despite
`passed` always `resolve`, will `reject` if the `value` is an error.

```javascript
promisified(new Error('An error'))
.then(function (value) {
  // Won't be called.
}, function (error) {
  console.error(error.message);  // An error
});
```

#### Arguments:

- `val :: Object` Any values

#### Return:

*(Object)* a jQuery Deferred's Promise object

- - -

### <a id="sleep"></a> `sleep(millisec)`

Promise returns timer sleep

#### Arguments:

- `millisec :: Number` Milliseconds to wait

#### Return:

*(Object)* a jQuery Deferred's Promise object

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

*(Function|Object)* A curried function or a jQuery Deferred's Promise object

- - -

### <a id="attemptCounted"></a> `attemptCounted(done, times, interval)`

Return the `done` Promise interface which has been retried `times` with `interval`.

```javascript
var count = 0;

var done = promisify(function (resolve, reject) {
  count += 1;
  if (5 < count) return resolve(count);
  reject(new Error('Not yet'));
});

attemptCounted(done, 10, 300)
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

### <a id="attemptTicked"></a> `attemptTicked(done, times)`

Return the `done` Promise interface which has been retried in the `duration`.

```javascript
var flag = false;
setTimeout(function () { flag = true; }, 2000);

var done = promisify(function (resolve, reject) {
  if (flag) return resolve(flag);
  reject(new Error('Not yet'));
});

attemptTicked(done, 3000)
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

### <a id="all"></a> `all(Promise)`

Shorthand for `Promise.all`, `Q.all`, or `$.when` to wait for multiple Promises

```javascript
var sleep = promisify(function (resolve, reject, millisec) {
  setTimeout(function () {
    resolve(millisec);
  }, millisec);
});

all(sleep(100), sleep(200), sleep(300))
.then(function (a, b, c) {
  console.log(a, b, c);  // 100, 200, 300
});
```

#### Arguments:

- `Promise :: Array|Object` arguments

#### Return:

*(Object)* A Promise object

- - -

### <a id="map"></a> `map(items, promisified)`

Promise concatenates array values as promises

#### Arguments:

- `items :: Array` Array values will be tranformed to promises
- `promisified :: Function` A function transforms `items` to promises

#### Return:

*(Object)* a jQuery Deferred's Promise object

- - -

