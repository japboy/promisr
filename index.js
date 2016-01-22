var _ = require('underscore');

var Promisr = (function () {
  'use strict';

  /**
   * The constructor to instantiate Promisr class
   *
   * ```javascript
   * var promisr = new Promisr(window.Promise || window.Q || window.jQuery)
   * ```
   *
   * @class Promisr
   * @param {Object} Subject `Promise`, `Q`, or `$` is acceptable.
   * @returns {Object} An instance of Promisr class associated with `Promise`,
   *     `Q`, or `$`
   */
  function Promisr (Subject) {

    // Expose Underscore
    this._ = _;

    // Expose Promise library used by this instance
    if (global['Promise'] && Subject === global.Promise) {
      // ES2015 Promise
      this.Promise = Subject;
    } else if (_.isFunction(Subject.defer)) {
      // Q Deferred
      this.Q = Subject;
    } else if (_.isObject(Subject.Deferred)) {
      // jQuery Deferred
      this.$ = Subject;
    } else {
      var message = 'No Promise modules found. ES2015 Promise, Q Deferred, or jQuery Deferred required.';
      throw new global.Error(message);
    }

    this.isPromise = (function (scope) {
      if (scope.Promise) {
        return scope.isESPromise;
      } else if (scope.Q) {
        return scope.isQPromise;
      } else if (scope.$) {
        return scope.is$Promise;
      }
    })(this);

    this.promisify = (function (scope) {
      if (scope.Promise) {
        return scope.callESPromiseFactory;
      } else if (scope.Q) {
        return scope.callQPromiseFactory;
      } else if (scope.$) {
        return scope.call$PromiseFactory;
      }
    })(this);

    this.all = (function (scope) {
      if (scope.Promise) {
        return scope.callESAll;
      } else if (scope.Q) {
        return scope.callQAll;
      } else if (scope.$) {
        return scope.call$All;
      }
    })(this);

  }

  var proto = Promisr.prototype;

  /**
   * @method isPromise
   */
  proto.isPromise = _.noop;

  proto.isESPromise = function (promise) {
    return promise instanceof this.Promise;
  };

  proto.isQPromise = function (promise) {
    return this.Q.isPromise(promise);
  };

  proto.is$Promise = function (promise) {
    return _.isObject(this.$.Deferred) && _.isFunction(promise.then);
  };

  /**
   * Create new asynchronous function which returns a Promise interface.
   * This is a higher-order function. The function `func` takes 2 parameters
   * `resolve` and `reject` at least.
   *
   * #### func(resolve, reject, [args...])
   *
   * `resolve` and `reject` are always there, and `args...` can be continued
   * if you want to put some arguments.
   *
   * Here is the example:
   *
   * ```javascript
   * var fn = promisify(function (resolve, reject, value) {
   *   if (value) return resolve(value);
   *   reject(value);
   * });
   *
   * fn(true)
   * .then(function (value) {
   *   console.log(value);  // true
   * });
   * ```
   *
   * @method promisify
   * @param {Function} func An immediate function having `resolve` and
   *     `reject` callbacks and being executed asynchronously
   * @returns {Function} A partial function will returns a Promise
   */
  proto.promisify = _.noop;

  proto.callESPromiseFactory = function (func) {
    return _.bind(function() {
      var args = _.toArray(arguments);
      var promise = new this.Promise(function (resolve, reject) {
        return func.apply(undefined, _.union([ resolve, reject ], args));
      })
      return promise;
    }, this);
  };

  proto.callQPromiseFactory = function (func) {
    return _.bind(function () {
      var args = _.toArray(arguments);
      var dfr = this.Q.defer(), promiseArgs = [ dfr.resolve, dfr.reject ];
      var timeoutId = global.setTimeout(function () {
        global.clearTimeout(timeoutId);
        func.apply(undefined, _.union(promiseArgs, args));
      }, 1);
      return dfr.promise;
    }, this);
  };

  proto.call$PromiseFactory = function (func) {
    return _.bind(function () {
      var args = _.toArray(arguments);
      var dfr = new this.$.Deferred(), promiseArgs = [ dfr.resolve, dfr.reject ];
      var timeoutId = global.setTimeout(function () {
        global.clearTimeout(timeoutId);
        func.apply(undefined, _.union(promiseArgs, args));
      }, 1);
      return dfr.promise();
    }, this);
  };

  /**
   * Create new asynchronous function which returns a Promise interface. This higher-order function, despite the function which is returned by `promisify` has `resolve` and `reject`, only has user defined arguments.
   *
   * #### func([args...])
   *
   * Once you `throw` a value from the inside of `fn`, `lazify` will call `reject` and pass the value:
   *
   * ```javascript
   * var fn = lazify(function (value) {
   *   if (value) return value;
   *   throw new Error('Falsy error');
   * });
   *
   * fn(false)
   * .then(function (value) {
   *   // Won't be called.
   * }, function (error) {
   *   console.error(error.message);  // Falsy error
   * });
   * ```
   *
   * @method lazify
   * @param {Function} func An immediate function being curried and lazy evaluated
   * @returns {Function|Object} A curried function or a Promise object
   */
  proto.lazify = function (func) {
    return _.bind(function () {
      var args = _.toArray(arguments);
      var done = this.promisify(function (resolve, reject) {
        try {
          var val = func.apply(undefined, args);
          resolve(val);
        } catch (err) {
          reject(err);
        }
      });
      return done();
    }, this);
  };

  /**
   * Return the `value` through a Promise interface. This function will
   * always `resolve` the `value`.
   *
   * ```javascript
   * promisr.return(true)
   * .then(function (value) {
   *   console.log(value);  // true
   * }, function () {
   *   // Never
   * });
   * ```
   *
   * @method return
   * @param {Object} value Anything
   * @returns {Promise} a Promise object
   */
  proto.return = function (value) {
    if (this.isPromise(value)) throw new global.Error('Argument must not be a Promise');
    return this.promisify(function (resolve, reject, value) {
      resolve(value);
    })(value);
  };

  /**
   * Alias to `return`
   */
  proto.just = proto.return;

  /**
   * Return the `value` through a Promise interface. This function will
   * always `reject` the `value`.
   *
   * ```javascript
   * promisr.throw(true)
   * .then(function () {
   *   // Never
   * }, function (value) {
   *   console.log(value);  // true
   * });
   * ```
   *
   * @method throw
   * @param {Object} value Anything
   * @returns {Promise} a Promise object
   */
  proto.throw = function (value) {
    if (this.isPromise(value)) throw new global.Error('Argument must not be a Promise');
    return this.promisify(function (resolve, reject, value) {
      reject(value);
    })(value);
  };

  /**
   * Return the `value` through a Promise interface. This function, despite
   * `just` always `resolve`, will `reject` if the `condition()` is falsy.
   *
   * ```javascript
   * promisr.if(function (value) {
   *   return !value instanceof Error;
   * }, new Error('An error'))
   * .then(function (value) {
   *   // Won't be called.
   * }, function (error) {
   *   console.error(error.message);  // An error
   * });
   * ```
   *
   * @method if
   * @param {Function} condition A predicate
   * @param {Object} value Anything
   * @returns {Promise} a Promise object
   */
  proto.if = function (condition, value) {
    return this.promisify(function (resolve, reject, condition, value) {
      if (condition(value)) return resolve(value);
      reject(value);
    })(condition, value);
  };

  /**
   * @method unlessFalsy
   * @param {Object} value Anything
   * @returns {Promise} a Promise object
   */
  proto.unlessFalsy = _.partial(proto.if, function (value) {
    return !!value;
  });

  /**
   * @method unlessError
   * @param {Object} value Anything
   * @returns {Promise} a Promise object
   */
  proto.unlessError = _.partial(proto.if, function (value) {
    return !value instanceof global.Error;
  });

  /**
   * Promise returns timer sleep
   * @method timer
   * @param {Number} millisec Milliseconds to wait
   * @returns {Promise} a Promise object
   */
  proto.timer = function (millisec) {
    return this.promisify(function (resolve, reject, millisec) {
      var id = global.setTimeout(function () {
        global.clearTimeout(id);
        resolve(millisec);
      }, millisec - 1);
    })(_.isNumber(millisec) ? millisec : 80);
  };

  /**
   * Shorthand for `Promise.all`, `Q.all`, or `$.when` to wait for multiple Promises
   *
   * ```javascript
   * promisr.all(promisr.timer(100), promisr.timer(200), promisr.timer(300))
   * .then(function (results) {
   *   console.log(results[0], results[1], results[2]);  // 100, 200, 300
   * });
   * ```
   *
   * @method all
   * @param {Array|...Promise} args Promise arguments
   * @returns {Promise} A Promise object
   */
  proto.all = _.noop;

  proto.callESAll = function () {
    var args = _.toArray(arguments);
    var promises = _.isArray(args[0]) ? args[0] : args;
    return this.Promise.all(promises);
  };

  proto.callQAll = function () {
    var args = _.toArray(arguments);
    var promises = _.isArray(args[0]) ? args[0] : args;
    return this.Q.all(promises);
  };

  proto.call$All = function () {
    var args = _.toArray(arguments);
    var promises = _.isArray(args[0]) ? args[0] : args;
    return this.$.when.apply(undefined, promises)
    .then(this.lazify(function () {
      return _.toArray(arguments);
    }));
  };

  /**
   * @method any
   * @param {Array|...Promise} args Promise arguments
   */
  proto.any = function () {
    var args = _.toArray(arguments);
    var promises = _.isArray(args[0]) ? args[0] : args;
    return this.map(promises, function (promise) {
      return promise.then(_.bind(this.return, this), _.bind(this.return, this));
    });
  };

  /**
   * @method some
   * @param {Array|...Promise} args Promise arguments
   */
  proto.some = function () {
    var args = _.toArray(arguments);
    var promises = _.isArray(args[0]) ? args[0] : args;
    return this.map(promises, function (promise) {
      return promise.then(_.bind(this.return, this), _.bind(this.return, this));
    })
    .then(this.lazify(function (results) {
      return _.filter(results, function (result) {
        if (result instanceof global.Error) return false;
        return true;
      });
    }));
  };

  /**
   * Promise concatenates array values as promises
   *
   * ```javascript
   * promisr.map(urls, promisr.promisify(function (resolve, reject, url) {
   *   var el = document.createElement('img');
   *   el.addEventListener('load', function (ev) {
   *     resolve(ev.target);
   *   }, false);
   *   el.addEventListener('error', function (ev) {
   *     reject(error);
   *   }, false);
   *   el.setAttribute('src', url);
   * }))
   * .then(function (els) {
   *   // Draw preloaded <img>'s
   *   els.forEach(function (el) {
   *     document.body.appendChild(el);
   *   });
   * });
   * ```
   *
   * @method map
   * @param {Array} items Array values will be tranformed to promises
   * @param {Function} func A function transforms `items` to promises
   * @returns {Object} a Promise object
   */
  proto.map = function (values, promisify) {
    return this.all(_.map(values, _.bind(promisify, this)));
  };

  /**
   * Return the `done` Promise interface which has been retried `times` with `interval`.
   *
   * ```javascript
   * var count = 0;
   *
   * var done = promisify(function (resolve, reject) {
   *   count += 1;
   *   if (5 < count) return resolve(count);
   *   reject(new Error('Not yet'));
   * });
   *
   * promisr.count(done, 10, 300)
   * .then(function (count) {
   *   console.log(count);  // 6
   * });
   * ```
   *
   * @method count
   * @see https://gist.github.com/briancavalier/842626
   * @see https://gist.github.com/kriskowal/593052
   * @param {Object} done A promisified function
   * @param {Number} times A number of retrying
   * @param {Number} interval An amount of millisecond interval
   * @returns {Object} A Promise returns success or failed status
   */
  proto.count = function (done, times, interval) {
    function success (dat) { return dat; }
    function fail (err) {
      if (1 >= times) throw err;
      return this.timer(interval)
      .then(_.bind(function () {
        return this.count(done, times - 1, interval);
      }, this));
    }
    return done().then(success, _.bind(fail, this));
  };

  /**
   * Return the `done` Promise interface which has been retried in the `duration`.
   *
   * ```javascript
   * var flag = false;
   * setTimeout(function () { flag = true; }, 2000);
   *
   * var done = promisify(function (resolve, reject) {
   *   if (flag) return resolve(flag);
   *   reject(new Error('Not yet'));
   * });
   *
   * promisr.tick(done, 3000)
   * .then(function (flag) {
   *   console.log(flag);  // true
   * });
   * ```
   *
   * @method tick
   * @see https://gist.github.com/briancavalier/842626
   * @param {Object} done A promisified function
   * @param {Number} times A number of millisecon duration
   * @returns {Object} A Promise returns success or failed status
   */
  proto.tick = function (done, duration, start) {
    var start = _.isNumber(start) ? start : +(new global.Date());
    function success (dat) { return dat; }
    function fail (err) {
      var stop = +(new global.Date());
      if (duration <= stop - start) throw err;
      return this.tick(done, duration, start);
    }
    return done().then(success, _.bind(fail, this));
  };

  return Promisr;

})();

module.exports = Promisr;
