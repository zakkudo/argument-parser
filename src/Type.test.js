const Type = require('./Type');

describe('Type', () => {
  it("works", () => {
    expect(Type).toEqual({
      "BOOLEAN": "boolean",
      "FLOAT": "float",
      "INTEGER": "integer",
      "LIST": "list",
      "STRING": "string",
    });
  });
});
