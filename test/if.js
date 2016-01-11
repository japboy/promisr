var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `if` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function', function () {
    it('takes true and resolves it through Promise interface.', function () {
      return promisr.if(function (value) { return value; }, true)
      .then(function (value) {
        expect(value).to.be.true;
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes nothing and resolves it through Promise interface.', function () {
      return promisr.if(function () {})
      .then(function (value) {
        expect(value).to.be.an('undefined');
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes an error and rejects it through Promise interface.', function () {
      return promisr.if(function (value) { return !value instanceof global.Error; }, new Error('Sample error'))
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (error) {
        expect(error).to.be.instanceof(Error);
      });
    });
  });

});
