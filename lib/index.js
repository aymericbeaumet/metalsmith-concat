'use strict'

var async = require('async')
var flattenDeep = require('lodash.flattendeep')
var fs = require('fs')
var glob = require('glob')
var minimatch = require('minimatch')
var path = require('path')

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
module.exports = function (options) {
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
  ).map(function (pattern) { return metalsmithifyPath(pattern) })

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

  return function (files, metalsmith, done) {
    if (!options.forceOutput && options.output in files) {
      return done(new Error('The file "' + options.output + '" already exists'))
    }

    // options.patterns is an array containing all the patterns which
    // should be concatenated, we reduce it from an array of patterns to an
    // array of gatherers
    var gatherers = options.patterns.reduce(function (acc, pattern) {
      acc.push(
        gathererFromSourceDirectory(files, pattern, options.keepConcatenated),
        gathererFromSearchPaths(metalsmith._directory, options.searchPaths, pattern)
      )
      return acc
    }, [])
    // gather all the files contents and generate the final concatenated file
    async.parallel(gatherers, function (error, filesContents) {
      if (error) {
        return done(error)
      }
      filesContents = flattenDeep(filesContents)
      filesContents.push('') // so that the join below includes the trailing new line
      var concatenated = filesContents.join(options.insertNewline ? options.insertNewline : '')
      files[options.output] = { contents: concatenated }
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
    return done(null, Object.keys(source).reduce(function (acc, filepath) {
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
    async.map(searchPaths, function (searchPath, callback) {
      glob(path.resolve(rootPath, searchPath, pattern), {
        cwd: rootPath,
        ignore: path.resolve(rootPath, 'src/**/*'),
        minimatch: minimatch,
        nodir: true
      }, function (error, filepaths) {
        if (error) {
          return callback(error)
        }
        async.map(filepaths, fs.readFile, callback)
      })
    }, done)
  }
}

/**
 * Convert a path in a way it is understandable by Metalsmith, and platform
 * agnostic.
 * @param {String} path - the path to be converted
 * @return {String} - the converted path
 */
function metalsmithifyPath (path) {
  return path.replace('\\', '/')
}
