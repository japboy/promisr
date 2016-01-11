var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `tick` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function', function () {
    it('returns a Promise and the result', function () {
      var flag = false;
      var done = promisr.promisify(function (resolve, reject) {
        if (flag) return resolve(flag);
        reject(new global.Error('Not yet'));
      });
      global.setTimeout(function () { flag = true; }, 500);

      promisr.tick(done, 600)
      .then(function (currentFlag) {
        expect(currentFlag).to.equal(flag);
      }, function (error) {
        expect(error).to.not.exist;
      });
    });

    it('returns a Promise and the error', function () {
      var flag = false;
      var done = promisr.promisify(function (resolve, reject) {
        if (flag) return resolve(flag);
        reject(new global.Error('Not yet'));
      });
      setTimeout(function () { flag = true; }, 600);

      promisr.tick(done, 600)
      .then(function (currentFlag) {
        expect(currentFlag).to.not.exist;
      }, function (error) {
        expect(error).to.be.instanceof(global.Error);
      });
    });
  });

});
