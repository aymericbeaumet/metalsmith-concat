'use strict'

var minimatch = require('minimatch')

/**
 * A Metalsmith plugin to concatenate files.
 *
 * @param {Object} options
 * @param {String|String[]=} options.files - A list of patterns to match the
 * files against.
 * @param {Boolean|String=} options.insertNewline - Append this after each file.
 * If passed as a boolean, append `\n`. If passed as a string, append the given
 * string.
 * @param {Boolean=} options.keepConcatenated - Whether to keep the concatenated
 * files.
 * @param {String} options.output - The output files
 *
 * @return {Function} - The Metalsmith plugin, iterate over each of the
 * `options.files` and try to match in the corresponding `files`
 */
module.exports = function (options) {
  options.files = (
      Array.isArray(options.files) ? options.files :
      typeof options.files === 'string' ? [options.files] :
      ['**/*']
    ).map(function (pattern) { return metalsmithifyPath(pattern) })
  options.insertNewline =
    typeof options.insertNewline === 'string' ? options.insertNewline :
    typeof options.insertNewline === 'undefined' || options.insertNewline === true ? '\n' :
    null
  options.keepConcatenated =
    typeof options.keepConcatenated === 'boolean' ? options.keepConcatenated :
    false
  options.output = options.output && metalsmithifyPath(options.output)

  if (typeof options.output !== 'string') {
    throw new Error('`options.output` is mandatory and has to be a string')
  }

  return function (files, metalsmith, done) {
    if (files[options.output]) {
      throw new Error('The file "' + options.output + '" already exists')
    }

    files[options.output] = {
      contents: options.files.reduce(function (contents, pattern) {
        return contents + Object.keys(files).reduce(function (patternOutput, filepath) {
          if (minimatch(filepath, pattern)) {
            patternOutput += files[filepath].contents
            if (options.insertNewline !== null) {
              patternOutput += options.insertNewline
            }
            if (options.keepConcatenated === false) {
              delete files[filepath]
            }
          }
          return patternOutput
        }, '')
      }, '')
    }

    done()
  }
}

/**
 * Convert a path in a way it is understandable by Metalsmith, and platform
 * agnostic.
 *
 * @param {String} path - The path to be converted
 *
 * @return {String}
 */
function metalsmithifyPath (path) {
  return path.replace('\\', '/')
}
