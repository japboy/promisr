var mocha = require('mocha');
var expect = require('chai').expect;

var Promisr = require('../dist/promisr');

describe('Tests for instantiation of `Promisr` class', function () {
  'use strict';

  context('Promisr', function () {
    it('is instantiated with proper argument', function () {
      var promisr = new Promisr(global.Promise);
      expect(promisr).to.be.an.instanceof(Promisr);
    });

    it('throws an error without an argument', function () {
      try {
        var promisr = new Promisr();
      } catch (error) {
        expect(error).to.be.an.instanceof(global.Error);
      }
    });
  });

});

// Tests for class methods
require('./promisify');
require('./all');
require('./lazify');
require('./passed');
require('./promisified');
require('./attemptCounted');
require('./attemptTicked');
