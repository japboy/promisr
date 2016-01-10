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

    if (Subject === global.Promise) {
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
    this.promisify = (function (Promise, Q, $) {
      if (Promise) {
        // ES2015 Promise
        return function (func) {
          return function() {
            var args = _.toArray(arguments);
            var promise = new Promise(function (resolve, reject) {
              return func.apply(undefined, _.union([ resolve, reject ], args));
            })
            return promise;
          };
        }
      } else if (Q) {
        // Q Deferred
        return function (func) {
          return function () {
            var args = _.toArray(arguments);
            var dfr = Q.defer(), promiseArgs = [ dfr.resolve, dfr.reject ];
            var timeoutId = global.setTimeout(function () {
              global.clearTimeout(timeoutId);
              func.apply(undefined, _.union(promiseArgs, args));
            }, 1);
            return dfr.promise;
          };
        }
      } else if ($) {
        // jQuery Deferred
        return function (func) {
          return function () {
            var args = _.toArray(arguments);
            var dfr = new $.Deferred(), promiseArgs = [ dfr.resolve, dfr.reject ];
            var timeoutId = global.setTimeout(function () {
              global.clearTimeout(timeoutId);
              func.apply(undefined, _.union(promiseArgs, args));
            }, 1);
            return dfr.promise();
          };
        }
      }
    })(this.Promise, this.Q, this.$);

    /**
     * Return the `value` through a Promise interface. This function will
     * always `resolve` the `value`.
     *
     * ```javascript
     * passed(true)
     * .then(function (value) {
     *   console.log(value);  // true
     * });
     * ```
     *
     * @param {Object} val Any values
     * @returns {Object} a jQuery Deferred's Promise object
     */
    this.passed = this.promisify(function (resolve, reject, val) {
      resolve(val);
    });

    /**
     * Return the `value` through a Promise interface. This function, despite
     * `passed` always `resolve`, will `reject` if the `value` is an error.
     *
     * ```javascript
     * promisified(new Error('An error'))
     * .then(function (value) {
     *   // Won't be called.
     * }, function (error) {
     *   console.error(error.message);  // An error
     * });
     * ```
     *
     * @method promisified
     * @param {Object} val Any values
     * @returns {Object} a jQuery Deferred's Promise object
     */
    this.promisified = this.promisify(function (resolve, reject, val) {
      if (val instanceof global.Error) return reject(val);
      resolve(val);
    });

    /**
     * Promise returns timer sleep
     * @method sleep
     * @param {Number} millisec Milliseconds to wait
     * @returns {Object} a jQuery Deferred's Promise object
     */
    this.sleep = this.promisify(function (resolve, reject, millisec) {
      var millisec = _.isNumber(millisec) ? millisec : 80;
      var id = global.setTimeout(function () {
        global.clearTimeout(id);
        resolve(millisec);
      }, millisec - 1);
    });

  }

  var proto = Promisr.prototype;

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
   * @returns {Function|Object} A curried function or a jQuery Deferred's Promise object
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
   * attemptCounted(done, 10, 300)
   * .then(function (count) {
   *   console.log(count);  // 6
   * });
   * ```
   *
   * @method attemptCounted
   * @see https://gist.github.com/briancavalier/842626
   * @see https://gist.github.com/kriskowal/593052
   * @param {Object} done A promisified function
   * @param {Number} times A number of retrying
   * @param {Number} interval An amount of millisecond interval
   * @returns {Object} A Promise returns success or failed status
   */
  proto.attemptCounted = function (done, times, interval) {
    function success (dat) { return dat; }
    function fail (err) {
      if (1 >= times) return err;
      return this.sleep(interval)
      .then(function () {
        return this.attemptCounted(done, times - 1, interval);
      });
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
   * attemptTicked(done, 3000)
   * .then(function (flag) {
   *   console.log(flag);  // true
   * });
   * ```
   *
   * @method attemptTicked
   * @see https://gist.github.com/briancavalier/842626
   * @param {Object} done A promisified function
   * @param {Number} times A number of millisecon duration
   * @returns {Object} A Promise returns success or failed status
   */
  proto.attemptTicked = function (done, duration, start) {
    var start = _.isNumber(start) ? start : +(new global.Date());
    function success (dat) { return dat; }
    function fail (err) {
      var stop = +(new global.Date());
      if (duration > stop - start) return this.attemptTicked(done, duration, start);
      return err;
    }
    return done().then(success, _.bind(fail, this));
  };

  /**
   * Shorthand for `Promise.all`, `Q.all`, or `$.when` to wait for multiple Promises
   *
   * ```javascript
   * var sleep = promisify(function (resolve, reject, millisec) {
   *   setTimeout(function () {
   *     resolve(millisec);
   *   }, millisec);
   * });
   *
   * all(sleep(100), sleep(200), sleep(300))
   * .then(function (a, b, c) {
   *   console.log(a, b, c);  // 100, 200, 300
   * });
   * ```
   *
   * @method all
   * @param {Array|Object} Promise arguments
   * @returns {Object} A Promise object
   */
  proto.all = function () {
    var args = _.toArray(arguments);
    var promises = _.isArray(args[0]) ? args[0] : args;
    if (this.Promise) {
      return this.Promise.all.apply(undefined, promises);
    } else if (this.Q) {
      return this.Q.all(promises);
    } else if (this.$) {
      return this.$.when.apply(undefined, promises);
    }
  };

  /**
   * Promise concatenates array values as promises
   * @method map
   * @param {Array} items Array values will be tranformed to promises
   * @param {Function} promisified A function transforms `items` to promises
   * @returns {Object} a jQuery Deferred's Promise object
   */
  proto.map = function (items, promisified) {
    return this.all(_.map(items, this.promisified));
  };

  return Promisr;

})();

module.exports = Promisr;
