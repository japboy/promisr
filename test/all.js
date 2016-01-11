var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `all` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function with sequencial arguments', function () {
    it('returns a Promise and the argument is an array containing the results', function () {
      return promisr.all(promisr.timer(100), promisr.timer(200), promisr.timer(300))
      .then(function (results) {
        expect(results).to.be.instanceof(global.Array);
        expect(results[0]).to.equal(100);
        expect(results[1]).to.equal(200);
        expect(results[2]).to.equal(300);
      }, function (error) {
        expect(error).to.not.exist;
      });
    });
  });

  context('Function with an array argument', function () {
    it('returns a Promise and the argument is an array containing the results', function () {
      return promisr.all([ promisr.timer(100), promisr.timer(200), promisr.timer(300) ])
      .then(function (results) {
        expect(results).to.be.instanceof(global.Array);
        expect(results[0]).to.equal(100);
        expect(results[1]).to.equal(200);
        expect(results[2]).to.equal(300);
      }, function (error) {
        expect(error).to.not.exist;
      });
    });
  });

});

