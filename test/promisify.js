var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `promisify` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  var proc = promisr.promisify(function (resolve, reject, value) {
    if (true === value) return resolve(value);
    reject(value);
  });

  context('Function which is promisified', function () {
    it('takes true and resolves it through Promise interface.', function () {
      return proc(true)
      .then(function (value) {
        expect(value).to.be.true;
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes false and rejects it through Promise interface.', function () {
      return proc(false)
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (value) {
        expect(value).to.be.false;
      });
    });

    it('takes nothing and rejects it through Promise interface.', function () {
      return proc()
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (value) {
        expect(value).to.be.an('undefined');
      });
    });
  });

});
