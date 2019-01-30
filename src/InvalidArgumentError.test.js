const InvalidArgumentError = require('./InvalidArgumentError');

describe('InvalidArgumentError', () => {
  it("displays a message with a long switch", () => {
    const error = new InvalidArgumentError({long: 'test-key', type: 'test-type'}, 'test-key', 'test-value');

    expect(String(error)).toEqual('InvalidArgumentError: Expected "--test-key" to receive a test-type. Actual: "test-value"');
  });

  it("displays a message with a short switch", () => {
    const error = new InvalidArgumentError({short: 't', type: 'test-type'}, 't', 'test-value');

    expect(String(error)).toEqual('InvalidArgumentError: Expected "-t" to receive a test-type. Actual: "test-value"');
  });

  it("displays error with no value", () => {
    const error = new InvalidArgumentError({short: 't', type: 'test-type'});

    expect(String(error)).toEqual('InvalidArgumentError: Expected "-undefined" to receive a test-type.');
  });

  it("gives an error for leftover values when no long or short", () => {
    const error = new InvalidArgumentError({}, '', 'value');

    expect(String(error)).toEqual('InvalidArgumentError: "value" is not a valid option.');
  });
});
