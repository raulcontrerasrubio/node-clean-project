const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
require('mocha');

const onListening = require('../../../src/modules/server/onListening');

describe('onListening test suite', function() {
  let spy;
  beforeEach(function() {
    spy = sinon.spy(console, 'log');
  });
  afterEach(function() {
    spy = spy.restore();
  });

  it('should return undefined', function() {
    const server = {
      address: () => '5000',
    };
    const sequelize = {
      authenticate: () => Promise.resolve(),
    };
    const result = onListening(server, sequelize);
    expect(result).to.be.undefined;
  });

  it('should call console.log including "pipe" if it is called with a string', function() {
    const server = {
      address: () => '5000',
    };
    const sequelize = {
      authenticate: () => Promise.resolve(),
    };
    onListening(server, sequelize);
    expect(spy.lastCall.lastArg.includes('pipe')).to.be.true;
  });

  it('should call console.log including "port" if it is called with anything but a string', function() {
    const server = {
      address: () => 5000,
    };
    const sequelize = {
      authenticate: () => Promise.resolve(),
    };
    onListening(server, sequelize);

    expect(spy.lastCall.lastArg.includes('port')).to.be.true;
  });
});
