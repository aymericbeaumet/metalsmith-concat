'use strict';

var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var concat = require('../lib');

describe('metalsmith-concat', function() {

  var FILES = {
    'first/file': { contents: 'lorem' },
    'second/file': { contents: ' ' },
    'third/file': { contents: 'ipsum' }
  };
  var files;


  beforeEach(function() {
    files = _.cloneDeep(FILES);
  });


  it('should concat all files by default', function(done) {
    concat({
      output: 'output/file/path'
    })(files, null, function() {
      expect(files['output/file/path']).to.deep.equal({ contents: 'lorem\n \nipsum\n' });
      done();
    });
  });

  it('should not add newlines when options.insertNewline is false', function(done) {
    concat({
      output: 'output/file/path',
      insertNewline: false,
    })(files, null, function() {
      expect(files['output/file/path']).to.deep.equal({ contents: 'lorem ipsum' });
      done();
    });
  });

  it('should only concat files matching the given pattern', function(done) {
    concat({
      files: '*(first|third)/*',
      output: 'output/file/path'
    })(files, null, function() {
      expect(files['output/file/path']).to.deep.equal({ contents: 'lorem\nipsum\n' });
      done();
    });
  });


  it('should concat no files if the given matching pattern is empty', function(done) {
    concat({
      files: '',
      output: 'output/file/path'
    })(files, null, function() {
      expect(files['output/file/path']).to.deep.equal({ contents: '' });
      done();
    });
  });


  it('should delete concatenated files by default', function(done) {
    concat({
      output: 'output/file/path'
    })(files, null, function() {
      expect(Object.keys(files)).to.have.length(1);
      done();
    });
  });


  it('should keep concatenated files if asked to', function(done) {
    concat({
      output: 'output/file/path',
      keepConcatenated: true
    })(files, null, function() {
      expect(Object.keys(files)).to.have.length(Object.keys(FILES).length + 1);
      done();
    });
  });


  it('should throw an error if no output path is given', function(done) {
    expect(function() {
      concat()();
    }).to.throw();
    done();
  });


  it('should concat files passed as an Array', function(done) {
    concat({
      files: ['first/file', 'third/file'],
      output: 'output/file/path'
    })(files, null, function() {
      expect(files['output/file/path']).to.deep.equal({ contents: 'lorem\nipsum\n' });
      done();
    });
  });


  it('should concat files passed as an Array without inserting newline if options.insertNewline is set to false', function(done) {
    concat({
      files: ['first/file', 'third/file'],
      output: 'output/file/path',
      insertNewline: false,
    })(files, null, function() {
      expect(files['output/file/path']).to.deep.equal({ contents: 'loremipsum' });
      done();
    });
  });
});
