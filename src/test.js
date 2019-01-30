const ArgumentParser = require('.');
const InvalidArgumentError = require('./InvalidArgumentError');
const InvalidSchemaError = require('./InvalidSchemaError');
const console = require('console');

const mocks = {};

class Helper {
  static assert(parsed, asserts) {
    if (asserts.hasOwnProperty('parsed')) {
      expect(parsed).toEqual(asserts.parsed);
    }

    if (asserts.hasOwnProperty('log')) {
      expect(mocks.consoleLog.mock.calls).toEqual(asserts.log);
    }

    if (asserts.hasOwnProperty('exit')) {
      expect(mocks.processExit.mock.calls.length > 0).toEqual(asserts.exit);
    }
  }
}

describe('ArgumentParser', () => {
  beforeEach(() => {
    mocks.consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mocks.processExit = jest.spyOn(process, 'exit').mockImplementation(n => n);
  });

  afterEach(() => {
    Object.entries(mocks).forEach(([key, mock]) => {
      mock.mockRestore();
      delete mocks[key];
    });
  });

  describe('long', () => {
    it("throws an InvalidArgumentError when schema doesn't exist", () => {
      const parse = new ArgumentParser({
        schema: [{
          long: 'watch',
          short: 'w',
          type: 'boolean',
          description: 'Update the translations as the files change.',
        }]
      });

      expect(() => parse(['--invalid'])).toThrow(new InvalidArgumentError(null, 'invalid'));
    });

    it("throws an error schmea type doesn't exit", () => {
      const parse = new ArgumentParser({
        schema: [{
          long: 'watch',
          short: 'w',
          type: 'invalid-type',
          description: 'Update the translations as the files change.',
        }]
      });

      expect(() => parse(['--watch'])).toThrow(new InvalidSchemaError(`Invalid schema type invalid-type`));
    });


    describe('boolean', () => {
      it('sets the argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
          }]
        });

        Helper.assert(parse(['--watch']), {
          parsed: {
            'watch': true,
          },
          exit: false,
          log: []
        });
      });

      it('sets nothing when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
          }]
        });

        Helper.assert(parse([]), {
          parsed: {},
          exit: false,
          log: []
        });
      });

      it('sets the default when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
            default: false
          }]
        });

        Helper.assert(parse([]), {
          parsed: {
            'watch': false,
          },
          exit: false,
          log: []
        });
      });

      it('sets the argument and ignores the default', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
            default: false
          }]
        });

        Helper.assert(parse(['--watch']), {
          parsed: {
            'watch': true,
          },
          exit: false,
          log: []
        });
      });
    });

    describe('string', () => {
      it('sets the argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
          }]
        });

        Helper.assert(parse(['--target', '**/*.js']), {
          parsed: {
            target: '**/*.js'
          },
          exit: false,
          log: []
        });
      });

      it('parses a equal string argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'glob',
            short: 'g',
            type: 'string',
            description: 'A glob path.'
          }],
        });

        Helper.assert(parse(['--glob=src/**/*.js']), {
          parsed: {
            'glob': 'src/**/*.js'
          },
          exit: false,
          log: []
        });
      });

      it('sets nothing when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
          }]
        });

        Helper.assert(parse([]), {
          parsed: {
          },
          exit: false,
          log: []
        });
      });

      it('sets the default when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
            default: 'src'
          }]
        });

        Helper.assert(parse([]), {
          parsed: {
            target: 'src'
          },
          exit: false,
          log: []
        });
      });

      it('sets the argument and ignores the default', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
            default: 'src'
          }]
        });

        Helper.assert(parse(['--target', '**/*.js']), {
          parsed: {
            target: '**/*.js'
          },
          exit: false,
          log: []
        });
      });

      it('throws an exception when value is missing', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
            default: 'src'
          }]
        });

        expect(() => parse(['--target'])).toThrow(new InvalidArgumentError({
          long: 'target',
          type: 'string',
        }, 'target'));

        expect(mocks.consoleLog.mock.calls).toEqual([
          ['usage: command [--help] [--version] [--target=glob]'],
    [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-t/--target=glob     The output target of the developer centric translations.`]
        ]);
      });
    });

    describe('list', () => {
      it('parses a list argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'locales',
            short: 'l',
            type: 'list',
            description: 'The locales to generate translation templates for.',
            default: []
          }],
        });

        Helper.assert(parse(['--locales', 'fa,jp,en']), {
          parsed: {
            'locales': ['fa', 'jp', 'en']
          },
          exit: false,
          log: []
        });
      });

      it('parses a list argument using an alternative delimiter', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'locales',
            short: 'l',
            type: 'list',
            delimiter: ':',
            description: 'The locales to generate translation templates for.',
            default: []
          }],
        });

        Helper.assert(parse(['--locales', 'fa:jp:en']), {
          parsed: {
            'locales': ['fa', 'jp', 'en']
          },
          exit: false,
          log: []
        });
      });

      it('parses a equal list argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'locales',
            short: 'l',
            type: 'list',
            description: 'The locales to generate translation templates for.',
            default: []
          }],
        });

        Helper.assert(parse(['--locales=a,b,c']), {
          parsed: {
            'locales': ['a', 'b', 'c']
          },
          exit: false,
          log: []
        });
      });

      it('throws an exception when value is missing', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'locales',
            short: 'l',
            type: 'list',
            description: 'The locales to generate translation templates for.',
            default: []
          }]
        });

        expect(() => parse(['--locales'])).toThrow(new InvalidArgumentError({
          long: 'locales',
          type: 'list',
        }, 'locales'));

        expect(mocks.consoleLog.mock.calls).toEqual([
          ['usage: command [--help] [--version] [--locales=list]'],
    [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-l/--locales=list    The locales to generate translation templates for.`]
        ]);
      });
    });

    describe('integer', () => {
      it('parses a list argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'integer',
            description: 'The locales to generate translation templates for.'
          }],
        });

        Helper.assert(parse(['--number', '10']), {
          parsed: {
            'number': 10
          },
          exit: false,
          log: []
        });
      });

      it('throws an exception when value type is invalid', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'integer',
            description: 'The locales to generate translation templates for.'
          }],
        });

        expect(() => parse(['--number', 'invalid'])).toThrow(new InvalidArgumentError({
          long: 'number',
          type: 'integer',
        }, 'number', 'invalid'));

        expect(mocks.consoleLog.mock.calls).toEqual([
          ['usage: command [--help] [--version] [--number=integer]'],
    [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-n/--number=integer  The locales to generate translation templates for.`]
        ]);
      });

      it('throws an exception when value is missing', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'integer',
            description: 'The locales to generate translation templates for.'
          }],
        });

        expect(() => parse(['--number'])).toThrow(new InvalidArgumentError({
          long: 'number',
          type: 'integer',
        }, 'number'));

        expect(mocks.consoleLog.mock.calls).toEqual([
          ['usage: command [--help] [--version] [--number=integer]'],
    [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-n/--number=integer  The locales to generate translation templates for.`]
        ]);
      });
    });

    describe('float', () => {
      it('parses a list argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'float',
            description: 'The locales to generate translation templates for.',
          }],
        });
      });

      it('parses a equal float argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'float',
            description: 'The locales to generate translation templates for.',
          }],
        });

        Helper.assert(parse(['--number=10.4']), {
          parsed: {
            'number': 10.4
          },
          exit: false,
          log: []
        });
      });

      it('throws an exception when value type is invalid', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'float',
            description: 'The locales to generate translation templates for.',
          }],
        });

        expect(() => parse(['--number', 'invalid'])).toThrow(new InvalidArgumentError({
          long: 'number',
          type: 'float',
        }, 'number', 'invalid'));

        expect(mocks.consoleLog.mock.calls).toEqual([
          ['usage: command [--help] [--version] [--number=float]'],
    [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-n/--number=float    The locales to generate translation templates for.`]
        ]);
      });

      it('throws an exception when value is missing', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'float',
            description: 'The locales to generate translation templates for.',
          }],
        });

        expect(() => parse(['--number'])).toThrow(new InvalidArgumentError({
          long: 'number',
          type: 'float',
        }, 'number'));

        expect(mocks.consoleLog.mock.calls).toEqual([
          ['usage: command [--help] [--version] [--number=float]'],
    [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-n/--number=float    The locales to generate translation templates for.`]
        ]);
      });
    });
  });

  describe('short', () => {
    describe('boolean', () => {
      it('sets the argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
          }]
        });

        Helper.assert(parse(['-w']), {
          parsed: {
            'watch': true,
          },
          exit: false,
          log: []
        });
      });

      it('sets nothing when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
          }]
        });

        Helper.assert(parse([]), {
          parsed: {
          },
          exit: false,
          log: []
        });
      });

      it('sets the default when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
            default: false
          }]
        });

        Helper.assert(parse([]), {
          parsed: {
            'watch': false,
          },
          exit: false,
          log: []
        });
      });

      it('sets the argument and ignores the default', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'watch',
            short: 'w',
            type: 'boolean',
            description: 'Update the translations as the files change.',
            default: false
          }]
        });

        Helper.assert(parse(['-w']), {
          parsed: {
            'watch': true,
          },
          exit: false,
          log: []
        });
      });
    });

    describe('string', () => {
      it('sets the argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
          }]
        });

        Helper.assert(parse(['-t', '**/*.js']), {
          parsed: {
            target: '**/*.js'
          },
          exit: false,
          log: []
        });
      });

      it('sets nothing when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
          }]
        });

        Helper.assert(parse([]), {
          parsed: {
          },
          exit: false,
          log: []
        });
      });

      it('sets the default when no argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
            default: 'src'
          }]
        });

        Helper.assert(parse([]), {
          parsed: {
            target: 'src'
          },
          exit: false,
          log: []
        });
      });

      it('sets the argument and ignores the default', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
            default: 'src'
          }]
        });

        Helper.assert(parse(['-t', '**/*.js']), {
          parsed: {
            target: '**/*.js'
          },
          exit: false,
          log: []
        });
      });
    });

    describe('list', () => {
      it('parses a list argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'locales',
            short: 'l',
            type: 'list',
            description: 'The locales to generate translation templates for.',
            default: []
          }],
        });

        Helper.assert(parse(['-l', 'fa,jp,en']), {
          parsed: {
            'locales': ['fa', 'jp', 'en']
          },
          exit: false,
          log: []
        });
      });
    });

    describe('integer', () => {
      it('parses a integer argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'integer',
            description: 'The locales to generate translation templates for.'
          }],
        });

        Helper.assert(parse(['-n', '10']), {
          parsed: {
            'number': 10
          },
          exit: false,
          log: []
        });
      });

      it('parses a equal integer argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'integer',
            description: 'The locales to generate translation templates for.',
          }],
        });

        Helper.assert(parse(['--number=10.4']), {
          parsed: {
            'number': 10
          },
          exit: false,
          log: []
        });
      });
    });

    describe('float', () => {
      it('parses a float argument', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'number',
            short: 'n',
            type: 'float',
            description: 'The locales to generate translation templates for.',
          }],
        });

        Helper.assert(parse(['-n', "10.4"]), {
          parsed: {
            'number': 10.4
          },
          exit: false,
          log: []
        });
      });
    });
  });

  describe('leftover', () => {
    it('throws an *Error when there is no leftover aggregation name', () => {
      const parse = new ArgumentParser({
        schema: [{
          long: 'watch',
          short: 'w',
          type: 'boolean',
          description: 'Update the translations as the files change.',
        }]
      });

      expect(() => parse(['--watch', '**/src/*.js'])).toThrow(new InvalidArgumentError({}, 'leftover', '**/src/*.js'));
    });

    it('parses leftover even if there are no flags', () => {
      const parse = new ArgumentParser({
        leftover: 'files',
        schema: [{
          long: 'watch',
          short: 'w',
          type: 'boolean',
          description: 'Update the translations as the files change.',
        }]
      });

      Helper.assert(parse(['app']), {
          parsed: {
            'leftover': ['app'],
          },
          exit: false,
          log: []
        });
    });

    it('parses mixed leftover and flags', () => {
      const parse = new ArgumentParser({
        leftover: 'files',
        schema: [{
          long: 'watch',
          short: 'w',
          type: 'boolean',
          description: 'Update the translations as the files change.',
        }]
      });

      Helper.assert(parse(['app', '-w', 'src/**/*.js', '']), {
          parsed: {
            'leftover': ['app', 'src/**/*.js'],
            'watch': true,
          },
          exit: false,
          log: []
        });
    });
  });

  describe('version', () => {
    it('shows the version information and exits', () => {
      const parse = new ArgumentParser({
        name: 'test-name',
        version: 'test-version',
        schema: [{
          long: 'watch',
          short: 'w',
          type: 'boolean',
          description: 'Update the translations as the files change.',
        }]
      });

      Helper.assert(parse(['--version']), {
          parsed: {
            version: true
          },
          exit: true,
          log: [['test-name version test-version\n']]
        });
    });
  });

  describe('help', () => {
    it('shows the help information and exits', () => {
      const parse = new ArgumentParser({
        name: 'test-name',
        version: 'test-version',
        leftover: 'files',
        description: 'Test description.',
        schema: [{
          long: 'watch',
          short: 'w',
          type: 'boolean',
          description: 'Update the translations as the files change.',
        }, {
          long: 'target',
          short: 't',
          type: 'string',
          typeName: 'glob',
          description: 'Target path for file output.',
        }, {
          long: 'long',
          type: 'string',
          description: 'Test long-only swtich.',
        }, {
          short: 's',
          type: 'string',
          description: 'Test short-only switch.',
        }]
      });

      Helper.assert(parse(['--help']), {
          parsed: {
            help: true
          },
          exit: true,
        log: [
          [`usage: test-name [--help] [--version] [--watch] [--target=glob] [--long=string] [-s=string] ...files`],
          ['\nTest description.'],
          [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-w/--watch           Update the translations as the files change.
\t-t/--target=glob     Target path for file output.
\t--long=string        Test long-only swtich.
\t-s=string            Test short-only switch.`],
        ]
        });
    });

    it('displays correctly with no schemas', () => {
      const parse = new ArgumentParser({
        name: 'test-name',
        description: 'Test description.',
        version: 'test-version',
        schema: []
      });

      Helper.assert(parse(['--help']), {
          parsed: {
            help: true
          },
          exit: true,
        log: [
          [`usage: test-name [--help] [--version]`],
          ['\nTest description.'],
          [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.`]
        ]
        });
    });

  });

  describe('examples', () => {
    it('has a base working example', () => {
        const parse = new ArgumentParser({
          schema: [{
            long: 'target',
            short: 't',
            type: 'string',
            typeName: 'glob',
            description: 'The output target of the developer centric translations.',
          }]
        });

        Helper.assert(parse(['-t', '**/*.js']), {
          parsed: {
            target: '**/*.js'
          },
          exit: false,
          log: []
        });
      });

      it('sets nothing when no argument', () => {
        const parse = new ArgumentParser({
          name: 'download-program',
          version: 'v1.3.4',
          description: 'A program for downloading files very fastly.',
          leftover: 'files',
          schema: [{
            long: 'fast',
            short: 'f',
            type: 'boolean',
            description: 'Makes the download go very fast.',
          }, {
            long: 'token',
            short: 't',
            typeName: 'uuid',
            type: 'string',
            description: 'Token used for authentication.',
          }, {
            long: 'muliplier',
            short: 'm',
            type: 'float',
            description: 'How many times faster the download should be.',
          }, {
            long: 'servers',
            type: 'list',
            typeName: 's1,s2,s3',
            description: 'Servers to use for the fast downloading, separated by a comma.',
          }]
        });

        Helper.assert(parse(['--fast', '--token', '1234', 'src/**/*.js', ]), {
          parsed: {
            "fast": true,
            "leftover": [
              "src/**/*.js",
            ],
            "token": "1234",
          },
          exit: false,
          log: []
        });

        Helper.assert(parse(['--version', ]), {
          parsed: {
            version: true
          },
          exit: true,
          log: [["download-program version v1.3.4\n"]]
        });

        mocks.consoleLog.mockReset();

        Helper.assert(parse(['--help', ]), {
          parsed: {
            help: true
          },
          exit: true,
          log: [
                ["usage: download-program [--help] [--version] [--fast] [--token=uuid] [--muliplier=float] [--servers=s1,s2,s3] ...files"],
       ["\nA program for downloading files very fastly.",
       ],
            [`
\t-h/--help            Show this help information.
\t-V/--version         Show the program version.
\t-f/--fast            Makes the download go very fast.
\t-t/--token=uuid      Token used for authentication.
\t-m/--muliplier=float How many times faster the download should be.
\t--servers=s1,s2,s3   Servers to use for the fast downloading, separated by a comma.`]
          ]
        });
    });
  });
});
