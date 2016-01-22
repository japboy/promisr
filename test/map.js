var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for `map` method', function () {
  'use strict';

  var promisr = new Promisr(global.Promise);

  context('Function with an array and promisify function arguments', function () {
    it('returns a Promise and the argument is an array containing the results', function () {
      return promisr.map([ 100, 200, 300 ], promisr.timer)
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

