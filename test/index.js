'use strict'

var concat = require('..')
var path = require('path')
var sandbox = require('sandboxed-module')
var test = require('tape')

sandbox.registerBuiltInSourceTransformer('istanbul')

test('metalsmith-concat should concatenate all files by default', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
  })
})

test('metalsmith-concat should only concatenate the specified files if options.files is passed as a string', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: 'first/*', output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should only concatenate the specified files if options.files is passed as a strings array', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: ['first/*', 'third/*'], output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\nipsum\n' },
      'second/file': { contents: ' ' }
    })
  })
})

test('metalsmith-concat should concatenate no files if the matching pattern is an empty string', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: '', output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: '' },
      'first/file': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should concatenate no files if the matching pattern is an empty array', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: [], output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: '' },
      'first/file': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should concatenate file in the order of the files keys', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
  })
})

test('metalsmith-concat should concatenate file in the order of the files keys / options.files patterns', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: ['third/*', 'second/*', 'first/*'], output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'ipsum\n \nlorem\n' }
    })
  })
})

test('metalsmith-concat should insert the new line as `\\n` by default', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: 'first/*', output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should insert the new line as `\\n` if options.insertNewline is true', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: true })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should not insert the new line if options.insertNewline is false', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: false })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should support custom new line if options.insertNewline is a string', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: '\r\n' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\r\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should delete the concatenated original files by default', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
  })
})

test('metalsmith-concat should delete the concatenated original files if options.keepConcatenated is false', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ output: 'output/path', keepConcatenated: false })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
  })
})

test('metalsmith-concat should keep the concatenated original files if options.keepConcatenated is true', function (t) {
  t.plan(2)
  var files = filesFixture()
  var plugin = concat({ output: 'output/path', keepConcatenated: true })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' },
      'first/file': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
  })
})

test('metalsmith-concat should throw if no options object is passed', function (t) {
  t.plan(2)
  try {
    concat()
  } catch (error) {
    t.ok(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
  }
})

test('metalsmith-concat should throw if options.output is not defined', function (t) {
  t.plan(2)
  try {
    concat({})
  } catch (error) {
    t.ok(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
  }
})

test('metalsmith-concat should throw error if options.output is not a string', function (t) {
  t.plan(2)
  try {
    concat({ output: false })
  } catch (error) {
    t.ok(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
  }
})

test('metalsmith-concat should throw error if options.output is an empty string', function (t) {
  t.plan(2)
  try {
    concat({ output: '' })
  } catch (error) {
    t.ok(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
  }
})

test('metalsmith-concat should return an error if options.output already exists by default', function (t) {
  t.plan(2)
  var plugin = concat({ output: 'output/path' })
  plugin({ 'output/path': {} }, metalsmithFixture(), function (error) {
    t.ok(error instanceof Error)
    t.deepEqual(error.message, 'The file "output/path" already exists')
  })
})

test('metalsmith-concat should return an error if options.output already exists when indicated as option', function (t) {
  t.plan(2)
  var plugin = concat({ output: 'output/path', forceOutput: false })
  plugin({ 'output/path': {} }, metalsmithFixture(), function (error) {
    t.ok(error instanceof Error)
    t.deepEqual(error.message, 'The file "output/path" already exists')
  })
})

test('metalsmith-concat should override existing file check if forceOutput is enabled', function (t) {
  t.plan(2)
  var files = {
    'output/path1': { contents: 'test123' },
    'output/path2': { contents: '456test' }
  }
  var plugin = concat({ files: ['output/path1', 'output/path2'], output: 'output/path', forceOutput: true })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'output/path': { contents: 'test123\n456test\n' }
    })
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/9
test('metalsmith-concat should not concatenate already concatenated files by default', function (t) {
  t.plan(2)
  var files = {
    'js/jquery.js': { contents: 'jquery' },
    'js/bootstrap/1.js': { contents: 'bootstrap1' },
    'js/bootstrap/2.js': { contents: 'bootstrap2' },
    'js/other/1.js': { contents: 'other1' },
    'js/other/2.js': { contents: 'other2' }
  }
  var plugin = concat({
    files: ['js/jquery.js', 'js/bootstrap/*.js', 'js/**/*.js'],
    output: 'js/app.js'
  })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'js/app.js': { contents: 'jquery\nbootstrap1\nbootstrap2\nother1\nother2\n' }
    })
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/8
test('metalsmith-concat should normalize options.output and options.files to be cross-platform compatible', function (t) {
  t.plan(2)
  var files = {
    'js/jquery.js': { contents: 'jquery' }
  }
  var plugin = concat({ files: ['js\\jquery.js'], output: 'js\\app.js' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files, {
      'js/app.js': { contents: 'jquery\n' }
    })
  })
})

test('metalsmith-concat should not include files from options.searchPaths by default', function (t) {
  t.plan(2)
  var files = {}
  var plugin = concat({ files: ['**/*.md'], output: 'output' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files.output.contents, '')
  })
})

test('metalsmith-concat should resolve relative searchPaths from the project root (as a string)', function (t) {
  t.plan(2)
  var files = {}
  var plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: '.' })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files.output.contents, 'anotherdir\n\nroot\n\n')
  })
})

test('metalsmith-concat should resolve relative searchPaths from the project root (as an array of strings)', function (t) {
  t.plan(2)
  var files = {}
  var plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), function (error) {
    t.error(error)
    t.deepEqual(files.output.contents, 'anotherdir\n\nroot\n\n')
  })
})

test('metalsmith-concat should forward glob errors', function (t) {
  t.plan(1)
  var _concat = sandbox.require('..', {
    requires: {
      glob: function (pattern, options, callback) {
        return callback(new Error('glob error'))
      }
    },
    singleOnly: true
  })
  var files = {}
  var plugin = _concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), function (error) {
    t.deepEqual(error.message, 'glob error')
  })
})

test('metalsmith-concat should forward fs.readFile errors', function (t) {
  t.plan(1)
  var _concat = sandbox.require('..', {
    requires: {
      fs: {
        readFile: function (filepath, callback) {
          return callback(new Error('fs.readFile error'))
        }
      }
    },
    singleOnly: true
  })
  var files = {}
  var plugin = _concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), function (error) {
    t.deepEqual(error.message, 'fs.readFile error')
  })
})

function filesFixture () {
  return {
    'first/file': { contents: 'lorem' },
    'second/file': { contents: ' ' },
    'third/file': { contents: 'ipsum' }
  }
}

function metalsmithFixture () {
  return {
    _directory: path.resolve(__dirname, 'fixture')
  }
}
