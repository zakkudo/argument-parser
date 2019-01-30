function generateMessage(schema, key, value) {
  const prefix = (key || schema.long || schema.short || '').length > 1 ? '--' : '-';
  const actual = (value !== undefined) ? ` Actual: "${value}"` : '';

  if (schema && (schema.long || schema.short)) {
    return `Expected "${prefix}${key}" to receive a ${schema.type}.${actual}`;
  } else {
    return `"${value}" is not a valid option.`;
  }
}

class InvalidArgumentError extends Error {
  constructor(schema, key, value) {
    super(generateMessage(schema, key, value));

    this.schema = schema;
    this.key = key;
    this.value = value;
  }

  toString() {
    return `InvalidArgumentError: ${this.message}`;
  }
}

module.exports = InvalidArgumentError;
