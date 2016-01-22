var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `any` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function with some Promise arguments which may not resolve', function () {
    it('returns a Promise and the argument is an array containing the resolved and rejected results', function () {
      return promisr.any(promisr.throw(true), promisr.return(false), promisr.throw(false))
      .then(function (results) {
        expect(results).to.be.instanceof(global.Array);
        expect(results[0]).to.be.true;
        expect(results[1]).to.be.false;
        expect(results[2]).to.be.false;
      }, function (error) {
        expect(error).to.not.exist;
      });
    });
  });

});

