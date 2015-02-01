'use strict';

var minimatch = require('minimatch');

/**
 * A Metalsmith plugin to concatenate files.
 */
module.exports = function plugin(options) {
  options = options || {};
  var validFileOption = (typeof options.files === 'string' || Array.isArray(options.files));
  options.files = (validFileOption) ? options.files : '**/*';

  if (typeof options.output === 'undefined') { throw new Error('Missing `output` option'); }
  options.keepConcatenated = (typeof options.keepConcatenated === 'boolean') ? options.keepConcatenated : false;
  options.insertNewLine = (typeof options.insertNewLine === 'boolean') ? options.insertNewLine : true;

  /**
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */
  return function(files, metalsmith, done) {
    if (Array.isArray(options.files))
      files[options.output] = { contents: concatArr(options, files) };
    else
      files[options.output] = { contents: concatObj(options, files) };
    return done();
  };
};

/**
 *  Concatinates file contents based on an Array of filepaths.
 */
function concatArr(options, files) {
  var concatenated = '';
  options.files.forEach(function(filename){
    if (!files[filename]) throw new Error(filename + ' does not exist');
    if (options.insertNewline !== false ) {
      concatenated += files[filename].contents + '\n';
    } else {
      concatenated += files[filename].contents;
    }
    if (!options.keepConcatenated) delete files[filename];
  });
  return concatenated;
}

/**
 *  Concatinates files that match a glob.
 */
function concatObj(options, files){
  var concatenated = '';
  Object.keys(files).forEach(function(filename) {
    if (!minimatch(filename, options.files)) { return; }
    if (options.insertNewline !== false ) {
      concatenated += files[filename].contents + '\n';
    } else {
      concatenated += files[filename].contents;
    }
    if (!options.keepConcatenated) delete files[filename];
  });
  return concatenated;
}
