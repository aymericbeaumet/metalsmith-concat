'use strict';

var minimatch = require('minimatch');

/**
 * A Metalsmith plugin to concatenate files.
 */
module.exports = function plugin(options) {
  options = options || {};
  options.files = (typeof options.files === 'string') ? options.files : '**/*';
  if (typeof options.output === 'undefined') { throw new Error('Missing `output` option'); }
  options.keepConcatenated = (typeof options.keepConcatenated === 'boolean') ? options.keepConcatenated : false;

  /**
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */
  return function(files, metalsmith, done) {
    var concatenated = '';

    Object.keys(files).forEach(function(filename) {
      if (!minimatch(filename, options.files)) { return; }

      concatenated += files[filename].contents;
      if (!options.keepConcatenated) {
        delete files[filename];
      }
    });

    files[options.output] = { contents: concatenated };

    return done();
  };
};
