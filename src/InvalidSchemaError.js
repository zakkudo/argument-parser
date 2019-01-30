

class InvalidSchemaError extends Error {
  toString() {
    return `InvalidSchemaError: ${this.message}`;
  }
}

module.exports = InvalidSchemaError;
