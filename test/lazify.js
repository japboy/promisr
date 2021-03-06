var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `lazify` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  var proc = promisr.lazify(function (value) {
    if (undefined === value) throw new Error('Empty parameter error');
    return value;
  });

  context('Function which is lazified', function () {
    it('takes true and resolves it through Promise interface.', function () {
      return proc(true)
      .then(function (value) {
        expect(value).to.be.true;
      }, function (error) {
        expect(error).to.not.exist;
      });
    });

    it('takes false and resolves it through Promise interface.', function () {
      return proc(false)
      .then(function (value) {
        expect(value).to.be.false;
      }, function (error) {
        expect(error).to.not.exist;
      });
    });

    it('takes nothing and rejects it through Promise interface.', function () {
      return proc()
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (error) {
        expect(error).to.be.an.instanceof(global.Error);
      });
    });
  });

});

