# metalsmith-concat [![Build Status](https://travis-ci.org/aymericbeaumet/metalsmith-concat.svg?branch=master)](https://travis-ci.org/aymericbeaumet/metalsmith-concat)

> A Metalsmith plugin to concatenate files

## Install

```shell
npm install --save metalsmith-concat
```

## Usage

This plugin enables you to concatenate files together.

### CLI

**metalsmith.json**

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

### API

```javascript
import metalsmith from 'metalsmith'
import metalsmithConcat from 'metalsmith-concat'

metalsmith(__dirname).use(
  metalsmithConcat({
    files: 'styles/**/*.css',
    output: 'styles/app.css',
  })
)
```

**metalsmithConcat(options)**

#### options

Type: `Object`
Default: `{}`

#### options.files

Type: `string` / `string[]`
Default: `['**/*']`

This defines which files are concatenated. This string will be interpreted as a
[minimatch](https://github.com/isaacs/minimatch) pattern. An array of strings
will be interpreted as distinct minimatch patterns, in this case the order of
the patterns matters (it will determine the order in which the files are
concatenated).

_Note: this is relative to both the source path and the [search
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

By default metalsmith-concat return an error if the output file already exists.
You can force an existing output file to be overwritten by setting this option
to `true`.

#### options.insertNewLine

Type: `boolean` | `string`
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

Type: `string` / `string[]`
Default: `[]`

Specify additional paths to search. The paths are resolved relatively to
Metalsmith's root directory. Absolute paths are also supported. An ignore
pattern is applied on the results to make sure the `src` directory is not
matched twice from a custom search path.

Let's consider the example below:

```
src/
  index.js
node_modules/
  react/
    dist/
      react.min.js
```

It is possible to include _React_ from the _node_modules_ before your _index.js_
from _src_ by using the following configuration:

```javascript
{
  files: [
    'react/dist/react.min.js', // found in node_modules
    'index.js' // found in src
  ],
  searchPaths: ['node_modules'],
}
```
