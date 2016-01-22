var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `return` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function', function () {
    it('takes true and resolves it through Promise interface.', function () {
      return promisr.return(true)
      .then(function (value) {
        expect(value).to.be.true;
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes false and resolves it through Promise interface.', function () {
      return promisr.return(false)
      .then(function (value) {
        expect(value).to.be.false;
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes nothing and resolves it through Promise interface.', function () {
      return promisr.return()
      .then(function (value) {
        expect(value).to.be.undefined;
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes an error and resolves it through Promise interface.', function () {
      return promisr.return(new Error('Sample error'))
      .then(function (error) {
        expect(error).to.be.instanceof(global.Error);
      }, function (value) {
        expect(value).to.not.exist;
      });
    });
  });

});
