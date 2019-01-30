/**
 * @module @zakkudo/argument-parser
 */

/**
 * Parse function
 * @typedef {Function} module:@zakkudo/argument-parser~ArgumentParser~ParseFunction
 * @throws InvalidArgumentError when and argument is malformed
 * @throws InvalidSchemaError when an invalid schema type is used for one of the actions and it's referenced
 * @param {Array} argv - The arguments you want to parse
 * @returns {Object} An object for the given schema configuration
 */

/**
 * The schema configuration for the paramters of the program
 * @typedef {Object} module:@zakkudo/argument-parser~ArgumentParser~Schema
 * @property {module:@zakkudo/Type~Type} type - The type of parameter.  One of string, interger, float, or list
 * @property {String} [typeName] - The type name used for display.  An example would
 * be a glob, filename, or other more concrete concept.
 * @property {String} description - The description of the
 * @property {String} [long] - The long form of the switch or nothing
 * @property {String} [short] - The short form of the switch or nothing
 */

/**
 * Argument parser configuration, controling how argumetns are parsed
 * and how they are shown in help documentation.  You must have at least a long
 * or short switch name set.
 * @typedef {Object} module:@zakkudo/argument-parser~ArgumentParser~Options
 * @property {String} name - The name of the executable this library is being used in;
 * @property {String} version - A version string that will be shown with the --version switch;
 * @property {String} description - A blurb of text explaining the how's and why's of the program.
 * @property {module:@zakkudo/argument-parser~ArgumentParser~Schema} schema - The configuration
 * @property {String} [leftover] - The name for the leftover parameters.  Without
 * this, leftover parameters will be disallowed.
 */

const InvalidArgumentError = require('./InvalidArgumentError');
const InvalidSchemaError = require('./InvalidSchemaError');
const Type = require('./Type');
const console = require('console');

function createOptions(schemas) {
  const options = {};

  schemas.forEach((s) => {
    if (s.hasOwnProperty('default')) {
      options[s.long] = s.default;
    }
  });

  return options;
}

function handleString(argv, index, schema, key, value) {
  if (!value) {
    index += 1;
    value = argv[index];
  }

  if (!value) {
    throw new InvalidArgumentError(schema, key, value);
  }

  return {
    index,
    value
  };
}

function handleInteger(argv, index, schema, key, value) {
  if (!value) {
    index += 1;
    value = argv[index];
  }

  const parsedValue = parseInt(value);

  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError(schema, key, value);
  }

  return {
    index,
    value: parsedValue
  };
}

function handleFloat(argv, index, schema, key, value) {
  if (!value) {
    index += 1;
    value = argv[index];
  }
  const parsedValue = parseFloat(value);

  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError(schema, key, value);
  }

  return {
    index,
    value: parsedValue
  };
}

function handleList(argv, index, schema, key, value) {
  if (!value) {
    index += 1;
    value = argv[index];
  }

  if (!value) {
    throw new InvalidArgumentError(schema, key, value);
  }

  return {
    index,
    value: value.split(schema.delimiter || ',')
  };
}

function handleBoolean(argv, index) {
  return {
    index,
    value: true
  };
}

/**
 * @private
 */
function toPairs(programSchema) {
  const builtInSchema = [{
    short: 'h',
    long: 'help',
    builtIn: true,
    description: 'Show this help information.',
    type: 'boolean'
  }, {
    short: 'V',
    long: 'version',
    builtIn: true,
    description: 'Show the program version.',
    type: 'boolean'
  }];

  const schema = builtInSchema.concat(programSchema);
  const longPairs = schema.map(s => [s.long, s]);
  const shortPairs = schema.map(s => [s.short, s]);

  return [].concat(longPairs).concat(shortPairs);
}

/**
 * @private
 */
function parseArgument(arg) {
  if (arg.startsWith('--')) {
    return arg.slice(2).split('=');
  } else if (arg.startsWith('-')) {
    return arg.slice(1).split('=');
  }

  return [null, null];
}

class ArgumentParser {
  /**
   * @param {module:@zakkudo/argument-parser~ArgumentParser~Options} options -
   * The configuration options for how parsing is done.
   * returns {module:@zakkudo/argument-parser~ArgumentParser~ParseFunction} A
   * function used to parse arguments given the configuration during construction.
   */
  constructor(options) {
    const name = options.name;
    const version = options.version;
    const description = options.description;
    const schema = options.schema;
    const leftover = options.leftover;

    this.leftover = leftover;
    this.name = name || 'command';
    this.version = version || 'no version';
    this.description =description;
    this.schema = schema;
    this.schemaByKey = new Map(toPairs(schema));

    return (argv) => this.parse(argv);
  }

  printHelp() {
    const schema = Array.from(new Set(this.schemaByKey.values()));
    const leftover = this.leftover ? ` ...${this.leftover}` : '';

    function toArgumentString(s) {
      const key = (s.long && `--${s.long}`)|| (s.short && `-${s.short}`);
      const value = s.typeName || s.type;

      if (value && s.type !== 'boolean') {
        return `[${key}=${value}]`;
      }

      return `[${key}]`
    }

    function toArgumentDescription(s) {
      const short = `-${s.short}`;
      const long = `--${s.long}`;
      const both = [];
      const type = s.typeName || s.type;

      if (s.short) {
        both.push(short);
      }

      if (s.long) {
        both.push(long);
      }

      const flagWithValue = [both.join('/')];

      if (type !== 'boolean') {
        flagWithValue.push(type);
      }

      return `\t${flagWithValue.join('=').padEnd(20, ' ')} ${s.description}`;
    }

    console.log(
      `usage: ${this.name} ${schema.map((s) => toArgumentString(s)).join(' ')}${leftover}`
    );

    if (this.description) {
      console.log('\n' + this.description);
    }

    console.log('\n' + schema.map((s) => toArgumentDescription(s)).join('\n'));
  }

  printVersion() {
    console.log(`${this.name} version ${this.version}\n`);
  }

  read(argv, index) {
    let arg = argv[index];
    let [key, value] = parseArgument(arg);
    let schema = this.schemaByKey.get(key);

    if (!key) {
      return {index, value: arg};
    }

    if (!schema) {
      this.printHelp();
      throw new InvalidArgumentError(schema, key, value);
    }

    switch(schema.type) {
      case 'boolean':
        ({index, value} = handleBoolean(argv, index, schema, key));

        if (schema.long === 'help' && schema.builtIn) {
          this.printHelp();
          process.exit(0);
        } else if (schema.long === 'version' && schema.builtIn) {
          this.printVersion();
          process.exit(0);
        }

        break;
      case Type.LIST:
        ({index, value} = handleList(argv, index, schema, key, value));
        break;
      case Type.INTEGER:
        ({index, value} = handleInteger(argv, index, schema, key, value));
        break;
      case Type.FLOAT:
        ({index, value} = handleFloat(argv, index, schema, key, value));
        break;
      case Type.STRING:
        ({index, value} = handleString(argv, index, schema, key, value));
        break;
      default:
        throw new InvalidSchemaError(`Invalid schema type ${schema.type}`);
    }

    return {
      index,
      key: schema.long,
      value
    };
  }

  parse(argv) {
    let length = argv.length;
    const options = createOptions(Array.from(this.schemaByKey.values()));

    try {
      for (let i = 0; i < length; i += 1) {
        let {index, key, value} = this.read(argv, i);

        if (key) {
          options[key] = value;
        } else if (value) {
          if (!this.leftover) {
            throw new InvalidArgumentError({}, 'leftover', value);
          }

          options.leftover = options.leftover || [];
          options.leftover.push(value);
        }

        i = index;
      }

      return options;
    } catch (e) {
      this.printHelp();
      throw e;
    }
  }
}

module.exports = ArgumentParser;
