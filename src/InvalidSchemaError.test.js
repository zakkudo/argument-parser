const InvalidSchemaError = require('./InvalidSchemaError');

describe('InvalidSchemaError', () => {
  it("works", () => {
    const error = new InvalidSchemaError('test message');

    expect(String(error)).toEqual('InvalidSchemaError: test message');
  });
});
