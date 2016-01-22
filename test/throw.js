var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `throw` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function', function () {
    it('takes true and rejects it through Promise interface.', function () {
      return promisr.throw(true)
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (value) {
        expect(value).to.be.true;
      });
    });

    it('takes false and rejects it through Promise interface.', function () {
      return promisr.throw(false)
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (value) {
        expect(value).to.be.false;
      });
    });

    it('takes nothing and rejects it through Promise interface.', function () {
      return promisr.throw()
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (value) {
        expect(value).to.be.undefined;
      });
    });

    it('takes an error and rejects it through Promise interface.', function () {
      return promisr.throw(new Error('Sample error'))
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (error) {
        expect(error).to.be.instanceof(global.Error);
      });
    });
  });

});
