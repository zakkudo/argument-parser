/**
 * @module @zakkudo/Type
 */

/**
 * @readonly
 * @enum {String}
 */
const Type = {
  /**
   * Used for arguments that should be parsed with parseInt.
   * @throws InvalidArgumentError when parseInt returns NaN or a value doesn't exist.
   */
  INTEGER: 'integer',
  /**
   * Used for arguments that should be parsed with parseFloat.
   * @throws InvalidArgumentError when parseFloat returns NaN or a value doesn't exist.
   */
  FLOAT: 'float',
  /**
   * Used for arguments that should be used as raw string.
   * @throws InvalidArgumentError if a value doesn't exist.
  */
  STRING: 'string',
  /**
   * Used for arguments that should be assumed a true boolean when the flag exists.
   */
  BOOLEAN: 'boolean',
  /**
   * Used for arguments that should be split into an array, using ',' as the delimiter.
   * @throws InvalidArgumentError if a value doesn't exist.
  */
  LIST: 'list',
};

module.exports = Type;

