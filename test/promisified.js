import mocha from 'mocha'
import { expect } from 'chai'

import _ from 'underscore'
import Promisr from '../dist/promisr'

describe('promisified', function () {

  let promisr = new Promisr(global.Promise)

  var proc = promisr.promisified;

  context('Function', function () {
    it('takes true and resolves it through Promise interface.', function () {
      return proc(true)
      .then(function (value) {
        expect(value).to.be.true;
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes false and resolves it through Promise interface.', function () {
      return proc(false)
      .then(function (value) {
        expect(value).to.be.false;
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes nothing and resolves it through Promise interface.', function () {
      return proc()
      .then(function (value) {
        expect(value).to.be.an('undefined');
      }, function (value) {
        expect(value).to.not.exist;
      });
    });

    it('takes an error and rejects it through Promise interface.', function () {
      return proc(new Error('Sample error'))
      .then(function (value) {
        expect(value).to.not.exist;
      }, function (error) {
        expect(error).to.be.instanceof(Error);
      });
    });
  });

});
