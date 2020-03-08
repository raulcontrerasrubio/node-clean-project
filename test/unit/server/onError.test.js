const chai = require('chai');
const expect = chai.expect;
const onError = require('../../../src/modules/server/onError');

describe('onError test suite', function() {
  it('should throw an error if error.syscall is not listen', function() {
    const error = {
      syscall: 'notListen',
    };
    const result = () => onError(error);
    expect(result).to.throw;
  });

  it('should throw an error if the error code is not EACCES nor EADDRINUSE', function() {
    const error = {
      syscall: 'listen',
      code: 'ANOTHERERROR',
    };
    const result = () => onError(error);
    expect(result).to.throw;
  });
});
