(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Promisr = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promisr = function () {

  /**
   * The constructor to instantiate Promisr class
   *
   * ```javascript
   * let promisr = new Promisr(window.Promise || window.Q || window.jQuery)
   * ```
   *
   * @class Promisr
   * @param {Object} Subject `Promise`, `Q`, or `$` is acceptable.
   * @returns {Object} An instance of Promisr class associated with `Promise`,
   *     `Q`, or `$`
   */

  function Promisr(Subject) {
    _classCallCheck(this, Promisr);

    if (Subject === global.Promise) {
      // ES2015 Promise
      this.Promise = Subject;
    } else if (_underscore2.default.isFunction(Subject.defer)) {
      // Q Deferred
      this.Q = Subject;
    } else if (_underscore2.default.isObject(Subject.Deferred)) {
      // jQuery Deferred
      this.$ = Subject;
    } else {
      throw new global.Error('No Promise modules found. ES2015 Promise, Q Deferred, or jQuery Deferred required.');
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
    this.promisify = function (Promise, Q, $) {
      if (Promise) {
        // ES2015 Promise
        return function (func) {
          var partial = function partial() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var promise = new Promise(function (resolve, reject) {
              func.apply(undefined, _underscore2.default.union([resolve, reject], args));
            });
            return promise;
          };
          return partial;
        };
      } else if (Q) {
        // Q Deferred
        return function (func) {
          var partial = function partial() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            var dfr = Q.defer(),
                promiseArgs = [dfr.resolve, dfr.reject];
            var timeoutId = global.setTimeout(function () {
              global.clearTimeout(timeoutId);
              func.apply(undefined, _underscore2.default.union(promiseArgs, args));
            }, 1);
            return dfr.promise;
          };
          return partial;
        };
      } else if ($) {
        // jQuery Deferred
        return function (func) {
          var partial = function partial() {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }

            var dfr = new $.Deferred(),
                promiseArgs = [dfr.resolve, dfr.reject];
            var timeoutId = global.setTimeout(function () {
              global.clearTimeout(timeoutId);
              func.apply(undefined, _underscore2.default.union(promiseArgs, args));
            }, 1);
            return dfr.promise();
          };
          return partial;
        };
      }
    }(this.Promise, this.Q, this.$);

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
    this.sleep = this.promisify(function (resolve, reject) {
      var millisec = arguments.length <= 2 || arguments[2] === undefined ? 80 : arguments[2];

      var id = global.setTimeout(function () {
        global.clearTimeout(id);
        resolve(millisec);
      }, millisec - 1);
    });
  }

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

  _createClass(Promisr, [{
    key: 'lazify',
    value: function lazify(func) {
      var _this = this;

      var partial = function partial() {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        var done = _this.promisify(function (resolve, reject) {
          try {
            var val = func.apply(undefined, args);
            resolve(val);
          } catch (err) {
            reject(err);
          }
        });
        return done();
      };
      return partial;
    }

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

  }, {
    key: 'attemptCounted',
    value: function attemptCounted(done, times, interval) {
      var _this2 = this;

      var success = function success(dat) {
        return dat;
      };
      var fail = function fail(err) {
        if (1 >= times) return err;
        return _this2.sleep(interval).then(function () {
          return _this2.attemptCounted(done, times - 1, interval);
        });
      };
      return done().then(success, fail);
    }

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

  }, {
    key: 'attemptTicked',
    value: function attemptTicked(done, duration) {
      var _this3 = this;

      var start = arguments.length <= 2 || arguments[2] === undefined ? +new global.Date() : arguments[2];

      var success = function success(dat) {
        return dat;
      };
      var fail = function fail(err) {
        var stop = +new global.Date();
        if (duration > stop - start) return _this3.attemptTicked(done, duration, start);
        return err;
      };
      return done().then(success, fail);
    }

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

  }, {
    key: 'all',
    value: function all() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var promises = _underscore2.default.isArray(args[0]) ? args[0] : args;
      if (this.Promise) {
        return this.Promise.all.apply(undefined, promises);
      } else if (this.Q) {
        return this.Q.all(promises);
      } else if (this.$) {
        return this.$.when.apply(undefined, promises);
      }
    }

    /**
     * Promise concatenates array values as promises
     * @method map
     * @param {Array} items Array values will be tranformed to promises
     * @param {Function} promisified A function transforms `items` to promises
     * @returns {Object} a jQuery Deferred's Promise object
     */

  }, {
    key: 'map',
    value: function map(items, promisified) {
      return all(_underscore2.default.map(items, this.promisified));
    }
  }]);

  return Promisr;
}();

module.exports = Promisr;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"underscore":undefined}]},{},[1])(1)
});