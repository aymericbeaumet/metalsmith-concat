# metalsmith-concat

[![travis](https://img.shields.io/travis/aymericbeaumet/metalsmith-concat?style=flat-square&logo=travis)](https://travis-ci.org/aymericbeaumet/metalsmith-concat)
[![github](https://img.shields.io/github/issues/aymericbeaumet/metalsmith-concat?style=flat-square&logo=github)](https://github.com/aymericbeaumet/metalsmith-concat/issues)
[![npm](https://img.shields.io/npm/v/metalsmith-concat?style=flat-square&logo=npm)](https://www.npmjs.com/package/metalsmith-concat)

This plugin enables you to concatenate files together.

## Install

```shell
npm install metalsmith-concat
```

## Usage

### CLI

_metalsmith.json_

```json
{
  "plugins": {
    "metalsmith-concat": {
      "files": "styles/**/*.css",
      "output": "styles/app.css"
    }
  }
}
```

### Node.js

```javascript
const metalsmith = require('metalsmith')
const metalsmithConcat = require('metalsmith-concat')

metalsmith(__dirname).use(
  metalsmithConcat({
    files: 'styles/**/*.css',
    output: 'styles/app.css',
  })
)
```

## API

### metalsmithConcat(options)

#### options

Type: `Object`
Default: `{}`

#### options.files

Type: `string | string[]`
Default: `['**/*']`

This defines which files are concatenated. This string will be interpreted as a
[minimatch](https://github.com/isaacs/minimatch) pattern. An array of strings
will be interpreted as distinct minimatch patterns, in this case the order of
the patterns matters (it will determine the order in which the files are
concatenated).

_Note: during the search, these patterns will be evaluated relativetly to
both the source path and the [search
paths](https://github.com/aymericbeaumet/metalsmith-concat#optionssearchpaths)
(if any)._

#### options.output

Type: `string`

It represents the filepath where the concatenated content will be outputted.
This option is **mandatory**.

_Note: this is relative to the destination path._

#### options.forceOutput

Type: `boolean`
Default: `false`

By default metalsmith-concat returns an error if the output file already
exists. When that happens, you can force the existing output file to be
overwritten by setting this option to `true`.

#### options.insertNewLine

Type: `boolean | string`
Default: `true`

Whether a trailing new line (`\n`) should be appended after each concatenated
file. Unless you face a problem, you should keep this option enabled as
removing it could cause invalid concatenated files (see [this
article](http://evanhahn.com/newline-necessary-at-the-end-of-javascript-files/)).
It is also possible to pass a string, in which case it will be used instead
of `\n` (e.g., `\r\n`).

#### options.keepConcatenated

Type: `boolean`
Default: `false`

Whether to keep the files which were concatenated. By default they are not kept
and deleted from the build (thus only keeping the newly created file at
`options.output`).

#### options.searchPaths

Type: `string | string[]`
Default: `[]`

Specify additional paths to search. The paths are resolved relatively to
Metalsmith's root directory. Absolute paths are also supported. An ignore
pattern is applied on the results to make sure the `src` directory is not
matched twice from a custom search path.

## FAQ

> I am developing a React application and want to include _react.min.js_
> before _index.js_ so I can use `React` in my code. What should I do?

Let's consider you have the following source code:

```
src/
  index.js
node_modules/
  react/
    dist/
      react.min.js
```

The easiest way to achieve what you want with this plugin is to simply match
_react.min.js_ before _index.js_ in the `files` array, this priority will be
respected by the plugin. Do not forget to add the `node_modules` search path
though, as this directory is not searched by default.

```javascript
{
  files: [
    'react/dist/react.min.js', // found in node_modules
    'index.js' // found in src
  ],
  searchPaths: ['node_modules'],
}
```
