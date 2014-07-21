# metalsmith-concat [![Build Status](https://travis-ci.org/aymericbeaumet/metalsmith-concat.svg?branch=master)](https://travis-ci.org/aymericbeaumet/metalsmith-concat) [![NPM version](https://badge.fury.io/js/metalsmith-concat.svg)](http://badge.fury.io/js/metalsmith-concat)

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
Type: `String`
Default: `**/*`

This define which files pattern are concerned by the concatenation. It is
directly passed to [minimatch](https://github.com/isaacs/minimatch).

#### output
Type: `String`

It represents the file where the concatenated content will be outputted. This
option is **mandatory**.

#### keepConcatenated
Type: `Boolean` Default: `false`

Whether to keep the files which were concatenated. By default they are not kept
and deleted from the build.

## Changelog

* 0.0.2
  * Fix an issue with file content

* 0.0.1
  * Working plugin

## License

MIT © [Aymeric Beaumet](http://beaumet.me)
