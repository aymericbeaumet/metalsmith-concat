# metalsmith-concat [![Build Status](https://img.shields.io/travis/aymericbeaumet/metalsmith-concat.svg?style=flat)](https://travis-ci.org/aymericbeaumet/metalsmith-concat) [![NPM version](https://img.shields.io/npm/v/metalsmith-concat.svg?style=flat)](https://www.npmjs.com/metalsmith-concat)

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
  .use(concat{
    files: 'styles/**/*.css',
    output: 'styles/app.css'
  }));
  .build();
```

#### files
Type: `String` / `String[]`
Default: `'**/*'`

This defines which files are concatenated. A string will be considered as a
[minimatch](https://github.com/isaacs/minimatch) pattern and will concatenate the
files it matches. An array of string will concatenate files at the corresponding
filepaths (minimatch patterns will not work here).

#### output
Type: `String`

It represents the file where the concatenated content will be outputted. This
option is **mandatory**.

#### keepConcatenated
Type: `Boolean` Default: `false`

Whether to keep the files which were concatenated. By default they are not kept
and deleted from the build.

#### insertNewLine
Type `Boolean` Default: `true`

Whether a trailing new line should be added to each concatenated file. Unless
you face a problem, you should keep this option on as removing it could cause
invalid concatenated files (see [this
article](http://evanhahn.com/newline-necessary-at-the-end-of-javascript-files/)).

## Changelog

* 2.0.0
  * Add a newline at the end of each concatenated file by default ([#4](https://github.com/aymericbeaumet/metalsmith-concat/pull/4))

* 1.0.1
  * Add the possibility to pass an array of files instead of a matching pattern ([#2](https://github.com/aymericbeaumet/metalsmith-concat/pull/2))

* 1.0.0
  * Bump stable

* 0.0.2
  * Fix an issue with file content

* 0.0.1
  * Working plugin

## License

MIT © [Aymeric Beaumet](http://beaumet.me)
