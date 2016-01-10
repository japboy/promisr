var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `attemptCounted` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function', function () {
    it('returns a Promise and the result', function () {
      var count = 0;
      var done = promisr.lazify(function () {
        count += 1;
        if (10 > count) throw new global.Error('Try again');
        return count;
      });

      return promisr.attemptCounted(done, 10, 100)
      .then(function (currentCount) {
        expect(currentCount).to.equal(count);
      }, function (error) {
        expect(error).to.not.exist;
      });
    });

    it('returns a Promise and the error', function () {
      var count = 0;
      var done = promisr.lazify(function () {
        count += 1;
        if (10 > count) throw new global.Error('Try again');
        console.log(count);
        return count;
      });

      return promisr.attemptCounted(done, 5, 100)
      .then(function (currentCount) {
        expect(currentCount).to.not.exist;
      }, function (error) {
        expect(error).to.be.instanceof(global.Error);
      });
    });
  });

});
