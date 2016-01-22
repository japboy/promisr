var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `some` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function with some Promise arguments which may throw errors.', function () {
    it('returns a Promise and the argument is an array containing the only resolved results', function () {
      return promisr.some(promisr.return(true), promisr.throw(new global.Error('Test Error')), promisr.return(false))
      .then(function (results) {
        expect(results).to.be.instanceof(global.Array);
        expect(results[0]).to.be.true;
        expect(results[1]).to.be.false;
      }, function (error) {
        expect(error).to.not.exist;
      });
    });
  });

});

