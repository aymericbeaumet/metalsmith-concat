[![NPM version]
  (https://img.shields.io/npm/v/metalsmith-concat.svg?style=flat&label=npm)]
  (https://www.npmjs.com/package/metalsmith-concat)
[![Linux Build]
  (https://img.shields.io/travis/aymericbeaumet/metalsmith-concat/master.svg?style=flat&label=linux)]
  (https://travis-ci.org/aymericbeaumet/metalsmith-concat)
[![Windows Build]
  (https://img.shields.io/appveyor/ci/aymericbeaumet/metalsmith-concat/master.svg?style=flat&label=windows)]
  (https://ci.appveyor.com/project/aymericbeaumet/metalsmith-concat)
[![Coverage]
  (https://img.shields.io/codeclimate/coverage/github/aymericbeaumet/metalsmith-concat.svg?style=flat&label=coverage)]
  (https://codeclimate.com/github/aymericbeaumet/metalsmith-concat)
[![GPA]
  (https://img.shields.io/codeclimate/github/aymericbeaumet/metalsmith-concat.svg?style=flat&label=GPA)]
  (https://codeclimate.com/github/aymericbeaumet/metalsmith-concat)
[![Dependencies]
  (https://img.shields.io/david/aymericbeaumet/metalsmith-concat.svg?style=flat&label=dependencies)]
  (https://david-dm.org/aymericbeaumet/metalsmith-concat)

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
  }))
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

#### forceOutput
Type: `Boolean`
Default: `false`

By default metalsmith-concat return an error if the output file already exists.
You can force an existing output file to be overwritten by setting this option
to `true`.

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

* 4.1.1
  * Exclude test files from CodeClimate

* 4.1.0
  * It is possible to override existing output file check by setting `options.forceOutput` to true ([#19](https://github.com/aymericbeaumet/metalsmith-concat/issues/19))
  * Handle metalsmith errors gracefully as described [here](http://www.robinthrift.com/posts/metalsmith-part-3-refining-our-tools/)

* 4.0.1
  * Drop node 0.10 and 0.12 support as Metalsmith requires generators

* 4.0.0
  * Update dependencies
  * Remove `npm-shrinkwrap`
  * Fix linting
  * Add node 4 and 5 to Travis/AppVeyor

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

MIT © [Aymeric Beaumet](http://aymericbeaumet.com)
