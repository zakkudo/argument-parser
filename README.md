# @zakkudo/argument-parser

Make parsing node command line arguments enjoyable.

[![Build Status](https://travis-ci.org/zakkudo/argument-parser.svg?branch=master)](https://travis-ci.org/zakkudo/argument-parser)
[![Coverage Status](https://coveralls.io/repos/github/zakkudo/argument-parser/badge.svg?branch=master)](https://coveralls.io/github/zakkudo/argument-parser?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/zakkudo/argument-parser/badge.svg)](https://snyk.io/test/github/zakkudo/argument-parser)
[![Node](https://img.shields.io/node/v/@zakkudo/argument-parser.svg)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/@zakkudo/argument-parser.svg)](https://opensource.org/licenses/BSD-3-Clause)

## Why use this?

- Straight forward configuration
- Reusability

## What does it do?

- Parses arguments using multiple configuration types

## Install

```console
# Install using npm
npm install @zakkudo/argument-parser
```

``` console
# Install using yarn
yarn add @zakkudo/argument-parser
```

## Examples

### Basic example
``` javascript
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

const parsed = parse(['--fast', '--token', '1234', 'src/**/*.js', ]
// Returns an object with the below:
// {
//     "fast": true,
//     "leftover": [
//         "src/**/*.js",
//     ],
//     "token": "1234",
// }

parse(['--version']
// Exits, printing: "download-program version v1.3.4"

parse(['--help'])
// Exits, printing:
// usage: download-program [--help] [--version] [--fast] [--token=uuid] [--muliplier=float] [--servers=s1,s2,s3] ...files
// A program for downloading files very fastly.
//
// -h/--help            Show this help information.
// -V/--version         Show the program version.
// -f/--fast            Makes the download go very fast.
// -t/--token=uuid      Token used for authentication.
// -m/--muliplier=float How many times faster the download should be.
// --servers=s1,s2,s3   Servers to use for the fast downloading, separated by a comma.
```

## API

<a name="module_@zakkudo/argument-parser"></a>

<a name="module_@zakkudo/argument-parser..ArgumentParser"></a>

### @zakkudo/argument-parser~ArgumentParser ⏏

**Kind**: Exported class

* [~ArgumentParser](#module_@zakkudo/argument-parser..ArgumentParser)
    * [new ArgumentParser(options)](#new_module_@zakkudo/argument-parser..ArgumentParser_new)
    * [~ParseFunction](#module_@zakkudo/argument-parser..ArgumentParser..ParseFunction) ⇒ <code>Object</code>
    * [~Schema](#module_@zakkudo/argument-parser..ArgumentParser..Schema) : <code>Object</code>
    * [~Options](#module_@zakkudo/argument-parser..ArgumentParser..Options) : <code>Object</code>

<a name="new_module_@zakkudo/argument-parser..ArgumentParser_new"></a>

#### new ArgumentParser(options)

| Param | Type | Description |
| --- | --- | --- |
| options | [<code>Options</code>](#module_@zakkudo/argument-parser..ArgumentParser..Options) | The configuration options for how parsing is done. returns {module:@zakkudo/argument-parser~ArgumentParser~ParseFunction} A function used to parse arguments given the configuration during construction. |

<a name="module_@zakkudo/argument-parser..ArgumentParser..ParseFunction"></a>

#### ArgumentParser~ParseFunction ⇒ <code>Object</code>
Parse function

**Kind**: inner typedef of [<code>ArgumentParser</code>](#module_@zakkudo/argument-parser..ArgumentParser)  
**Returns**: <code>Object</code> - An object for the given schema configuration  
**Throws**:

- InvalidArgumentError when and argument is malformed
- InvalidSchemaError when an invalid schema type is used for one of the actions and it's referenced

| Param | Type | Description |
| --- | --- | --- |
| argv | <code>Array</code> | The arguments you want to parse |

<a name="module_@zakkudo/argument-parser..ArgumentParser..Schema"></a>

#### ArgumentParser~Schema : <code>Object</code>
The schema configuration for the paramters of the program

**Kind**: inner typedef of [<code>ArgumentParser</code>](#module_@zakkudo/argument-parser..ArgumentParser)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [<code>Type</code>](#module_@zakkudo/Type..Type) | The type of parameter.  One of string, interger, float, or list |
| [typeName] | <code>String</code> | The type name used for display.  An example would be a glob, filename, or other more concrete concept. |
| description | <code>String</code> | The description of the |
| [long] | <code>String</code> | The long form of the switch or nothing |
| [short] | <code>String</code> | The short form of the switch or nothing |

<a name="module_@zakkudo/argument-parser..ArgumentParser..Options"></a>

#### ArgumentParser~Options : <code>Object</code>
Argument parser configuration, controling how argumetns are parsed
and how they are shown in help documentation.  You must have at least a long
or short switch name set.

**Kind**: inner typedef of [<code>ArgumentParser</code>](#module_@zakkudo/argument-parser..ArgumentParser)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name of the executable this library is being used in; |
| version | <code>String</code> | A version string that will be shown with the --version switch; |
| description | <code>String</code> | A blurb of text explaining the how's and why's of the program. |
| schema | [<code>Schema</code>](#module_@zakkudo/argument-parser..ArgumentParser..Schema) | The configuration |
| [leftover] | <code>String</code> | The name for the leftover parameters.  Without this, leftover parameters will be disallowed. |

<a name="module_@zakkudo/Type"></a>

<a name="module_@zakkudo/Type..Type"></a>

### @zakkudo/Type~Type : <code>enum</code> ⏏
**Kind**: inner enum of [<code>@zakkudo/Type</code>](#module_@zakkudo/Type)  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| INTEGER | <code>String</code> | <code>integer</code> | Used for arguments that should be parsed with parseInt. |
| FLOAT | <code>String</code> | <code>float</code> | Used for arguments that should be parsed with parseFloat. |
| STRING | <code>String</code> | <code>string</code> | Used for arguments that should be used as raw string. |
| BOOLEAN | <code>String</code> | <code>boolean</code> | Used for arguments that should be assumed a true boolean when the flag exists. |
| LIST | <code>String</code> | <code>list</code> | Used for arguments that should be split into an array, using ',' as the delimiter. |

