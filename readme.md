[![NPM version](https://img.shields.io/npm/v/metalsmith-concat.svg?style=flat-square&label=npm)](https://www.npmjs.com/package/metalsmith-concat)
[![Linux and OS X build status](https://img.shields.io/travis/aymericbeaumet/metalsmith-concat/master.svg?style=flat-square&label=linux|osx)](https://travis-ci.org/aymericbeaumet/metalsmith-concat)
[![Windows build status](https://img.shields.io/appveyor/ci/aymericbeaumet/metalsmith-concat/master.svg?style=flat-square&label=windows)](https://ci.appveyor.com/project/aymericbeaumet/metalsmith-concat)
[![Dependencies](https://img.shields.io/david/aymericbeaumet/metalsmith-concat.svg?style=flat-square&label=dependencies)](https://david-dm.org/aymericbeaumet/metalsmith-concat)

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
import MetalSmith from 'metalsmith';
import concat from 'metalsmith-concat';

new Metalsmith(__dirname)
  .use(concat({
    files: 'styles/**/*.css',
    output: 'styles/app.css',
  }));
```

#### files
Type: `String` / `String[]`
Default: `'**/*'`

This defines which files are concatenated. This string will be interpreted as a
[minimatch](https://github.com/isaacs/minimatch) pattern. An array of strings
will be interpreted as minimatch patterns, in this case the order of the
patterns matters (it will determine the order in which the files are
concatenated).

_Note: this is relative to the source path and the [search paths](
https://github.com/aymericbeaumet/metalsmith-concat#searchpaths) (if any)._

#### output
Type: `String`

It represents the filepath where the concatenated content will be outputted.
This option is **mandatory**.

_Note: this is relative to the destination path._

#### forceOutput
Type: `Boolean`
Default: `false`

By default metalsmith-concat return an error if the output file already exists.
You can force an existing output file to be overwritten by setting this option
to `true`.

#### insertNewLine
Type: `Boolean` | `String`
Default: `true`

Whether a trailing new line (`\n`) should be appended after each concatenated
file. Unless you face a problem, you should keep this option enabled as removing
it could cause invalid concatenated files (see [this
article](http://evanhahn.com/newline-necessary-at-the-end-of-javascript-files/)).
It is also possible to pass a string, in which case it will be used instead of
`\n`.

#### keepConcatenated
Type: `Boolean`
Default: `false`

Whether to keep the files which were concatenated. By default they are not kept
and deleted from the build (thus only keeping the newly created file at
`options.output`).

#### searchPaths
Type: `String` / `String[]`
Default: `[]`

The additional paths to search after the `src` directory given to Metalsmith.
The paths are resolved relatively to the metalsmith root directory. Absolute
paths can also been given. This feature is disabled by default. Example:

```js
{
  files: [
    'react/dist/react.min.js', // will be resolved from the node_modules
    'index.js' // will be resolved from the directory given to Metalsmith
  ],
  searchPaths: ['node_modules'],
}
```

## Changelog

* 6.0.0
  * Expect and produce a `Buffer` for the `contents` key

* 5.0.2
  * Simplify the path given in the pattern

* 5.0.1
  * Fix 100% code coverage on Node 4 (sandboxed-module -> proxyquire)

* 5.0.0
  * Add the `searchPaths` option
  * Switch test suite to nyc + ava

* 4.2.2
  * Lightweight npm-shrinkwrap

* 4.2.1
  * Update license to public domain

* 4.2.0
  * Require options.output to be a non-empty string

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

[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, [Aymeric Beaumet](https://aymericbeaumet.com)
has waived all copyright and related or neighboring rights to this work.
