[![NPM version](https://img.shields.io/npm/v/metalsmith-concat.svg?style=flat)](https://www.npmjs.com/package/metalsmith-concat)
[![Linux Build Status](https://img.shields.io/travis/aymericbeaumet/metalsmith-concat/master.svg?style=flat&label=linux)](https://travis-ci.org/aymericbeaumet/metalsmith-concat)
[![Windows Build status](https://img.shields.io/appveyor/ci/aymericbeaumet/metalsmith-concat/master.svg?style=flat&label=windows)](https://ci.appveyor.com/project/aymericbeaumet/metalsmith-concat)
[![Coverage Status](https://img.shields.io/codeclimate/coverage/github/aymericbeaumet/metalsmith-concat.svg?style=flat)](https://codeclimate.com/github/aymericbeaumet/metalsmith-concat)
[![Dependency Status](https://img.shields.io/david/aymericbeaumet/metalsmith-concat.svg?style=flat)](https://david-dm.org/aymericbeaumet/metalsmith-concat)

# metalsmith-concat

A Metalsmith plugin to concatenate files.

## Installation

```javascript
$ npm install metalsmith-concat
```

## Usage

### CLI

```javascript
{
  "plugins": {
    "metalsmith-concat": {
      "files": "styles/**/*.css",
      "output": "styles/app.css"
    }
  }
}
```

### JavaScript

```javascript
var MetalSmith = require('metalsmith');
var concat = require('metalsmith-concat');

Metalsmith(__dirname)
  .use(concat({
    files: 'styles/**/*.css',
    output: 'styles/app.css'
  }));
  .build();
```

#### files
Type: `String` / `String[]`
Default: `'**/*'`

This defines which files are concatenated. This string will be interpreted as a
[minimatch](https://github.com/isaacs/minimatch) pattern. An array of strings
will be interpreted as minimatch patterns, in this case the order of the
patterns matters (it will determine the order in which the files are
concatenated).

#### output
Type: `String`

It represents the filepath where the concatenated content will be outputted.
This option is **mandatory**.

#### keepConcatenated
Type: `Boolean`
Default: `false`

Whether to keep the files which were concatenated. By default they are not kept
and deleted from the build (thus only keeping the newly created file at
`options.output`).

#### insertNewLine
Type: `Boolean` / `String`
Default: `true`

Whether a trailing new line (`\n`) should be appended after each concatenated
file. Unless you face a problem, you should keep this option on as removing it
could cause invalid concatenated files (see [this
article](http://evanhahn.com/newline-necessary-at-the-end-of-javascript-files/)).
It is also possible to pass a string, in which case it will be used instead of
`\n`.

## Changelog

* 3.0.0
  * An array of minimatch patterns can now be passed as `options.files` ([#6](https://github.com/aymericbeaumet/metalsmith-concat/issues/6), [#9](https://github.com/aymericbeaumet/metalsmith-concat/issues/9))
  * File paths are normalized, hence making this plugin working on Windows
    ([#8](https://github.com/aymericbeaumet/metalsmith-concat/issues/8))
  * It is possible to pass a custom `options.insertNewline` character

* 2.0.0
  * Add a newline at the end of each concatenated file by default
    ([#4](https://github.com/aymericbeaumet/metalsmith-concat/pull/4))

* 1.0.1
  * Add the possibility to pass an array of files instead of a matching pattern
    ([#2](https://github.com/aymericbeaumet/metalsmith-concat/pull/2))

* 1.0.0
  * Bump stable

* 0.0.2
  * Fix an issue with file content

* 0.0.1
  * Working plugin

## License

MIT © [Aymeric Beaumet](http://beaumet.me)
