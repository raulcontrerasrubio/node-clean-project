const chai = require('chai');
const expect = chai.expect;
const normalizePort = require('../../../src/modules/server/normalizePort');

describe('normalizePort test suite', function() {
  it('should return the parameter passed to the function if it is NaN', function() {
    const val = 'Not a Number';
    const result = normalizePort(val);
    expect(result).to.equal(val);
  });

  it('should return the port if the parameter is above 0', function() {
    const val = 5000;
    const result = normalizePort(val);
    expect(result).to.equal(val);
  });

  it('should return false if the parameter is 0', function() {
    const val = -3;
    const result = normalizePort(val);
    expect(result).to.be.false;
  });
});
