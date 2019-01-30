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
