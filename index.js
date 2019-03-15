'use strict'

const async = require('async')
const fs = require('fs')
const glob = require('glob')
const minimatch = require('minimatch')
const path = require('path')

/**
 * A Metalsmith plugin to concatenate files.
 * @param {Object} options
 * @param {String} options.output - the output file
 * @param {String|String[]=} options.files - a list of patterns to match the
 * files against
 * @param {Boolean=} options.forceOutput - whether the output file should be
 * overwritten if it already exists
 * @param {Boolean|String=} options.insertNewline - append this after each file.
 * If passed as a boolean, append `\n`. If passed as a string, append the given
 * string
 * @param {Boolean=} options.keepConcatenated - whether to keep the concatenated
 * files
 * @param {String|String[]=} options.searchPaths - the paths to search after the
 * src folder
 * @return {Function} - the Metalsmith plugin
 */
module.exports = (options) => {
  options =
    typeof options === 'object' && options ? options
      : {}

  options.output =
    typeof options.output === 'string' ? metalsmithifyPath(options.output)
      : undefined

  options.patterns = (
    Array.isArray(options.files) ? options.files
      : typeof options.files === 'string' ? [options.files]
        : ['**/*']
  ).map(metalsmithifyPath)

  options.forceOutput =
    typeof options.forceOutput === 'boolean' ? options.forceOutput
      : false

  options.insertNewline =
    typeof options.insertNewline === 'string' ? options.insertNewline
      : typeof options.insertNewline === 'undefined' || options.insertNewline === true ? '\n'
        : null
  options.keepConcatenated =
    typeof options.keepConcatenated === 'boolean' ? options.keepConcatenated
      : false

  options.searchPaths =
    Array.isArray(options.searchPaths) ? options.searchPaths
      : typeof options.searchPaths === 'string' ? [options.searchPaths]
        : []

  if (!(typeof options.output === 'string' && options.output.length > 0)) {
    throw new Error('`options.output` is mandatory and has to be a non-empty string')
  }

  return (files, metalsmith, done) => {
    if (!options.forceOutput && options.output in files) {
      return done(new Error(`The file "${options.output}" already exists`))
    }

    // options.patterns is an array containing all the patterns which
    // should be concatenated, we reduce it from an array of patterns to an
    // array of gatherers
    const gatherers = options.patterns.reduce((acc, pattern) => {
      acc.push(
        gathererFromSourceDirectory(files, pattern, options.keepConcatenated),
        gathererFromSearchPaths(metalsmith._directory, options.searchPaths, pattern)
      )
      return acc
    }, [])
    // gather all the files contents and generate the final concatenated file
    async.parallel(gatherers, (error, filesContents) => {
      if (error) {
        return done(error)
      }
      // shallow flatten an array of array
      filesContents = Array.prototype.concat.apply([], filesContents)
      // push an empty string so that the join includes a trailing new line
      filesContents.push('')
      const contents = Buffer.from(filesContents.join(options.insertNewline ? options.insertNewline : ''))
      files[options.output] = { contents }
      return done()
    })
  }
}

/**
 * Create a gatherer to look for the given pattern in the metalsmith files
 * object.
 * @param {Object} files - the files map to search in, this object will be
 * mutated
 * @param {String} pattern - the pattern to look for
 * @param {Boolean} keepConcatenated - whether to keep concatenated files in the
 * source `files` object
 * @return {Function} - a function which takes a single parameter, the callback
 * to execute when the work is done: `done(error, filesContents)`
 */
function gathererFromSourceDirectory (source, pattern, keepConcatenated) {
  return function gatherer (done) {
    // we loop over all the files Metalsmith knows of and return an array of all
    // the files contents matching the given pattern
    return done(null, Object.keys(source).reduce((acc, filepath) => {
      if (minimatch(filepath, pattern)) {
        acc.push(source[filepath].contents)
        if (keepConcatenated === false) {
          delete source[filepath]
        }
      }
      return acc
    }, []))
  }
}

/**
 * Create a gatherer to look for the given pattern in search paths.
 * @param {String} rootPath - the root path to search from
 * @param {String[]} searchPaths - the paths to search into
 * @param {String} pattern - the pattern to look for
 * @return {Function} - a function which takes a single parameter, the callback
 * to execute when the work is done: `done(error, filesContents)`
 */
function gathererFromSearchPaths (rootPath, searchPaths, pattern) {
  return function gatherer (done) {
    // we loop over the search paths and return an array of all the files
    // contents matching the given pattern
    async.map(searchPaths, (searchPath, callback) => {
      const globPattern = path.resolve(rootPath, searchPath, pattern)
      glob.glob(globPattern, {
        ignore: path.resolve(rootPath, 'src/**/*'),
        minimatch,
        nodir: true
      }, (error, filepaths) => {
        if (error) {
          return callback(error)
        }
        async.map(
          filepaths.map((filepath) => path.resolve(rootPath, filepath)),
          fs.readFile,
          callback
        )
      })
    }, (error, filesContents) => {
      if (error) {
        return done(error)
      }
      return done(null, Array.prototype.concat.apply([], filesContents))
    })
  }
}

/**
 * Convert a path in a way it is understandable by Metalsmith, and platform
 * agnostic.
 * @param {String} path - the path to be converted
 * @return {String} - the converted path
 */
function metalsmithifyPath (path) {
  return path.replace(/[\\/]+/g, '/')
}
