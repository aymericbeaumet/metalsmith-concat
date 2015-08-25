'use strict'

var test = require('tape')

test('metalsmith-concat', function (t) {
  var concat = require('..')

  t.test('should concatenate all files by default', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n \nipsum\n' }
      })
    })
  })

  t.test('should only concatenate the specified files if options.files is passed as a string', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: 'first/*', output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should only concatenate the specified files if options.files is passed as a strings array', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: ['first/*', 'third/*'], output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\nipsum\n' },
        'second/file': { contents: ' ' }
      })
    })
  })

  t.test('should concatenate no files if the matching pattern is an empty string', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: '', output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: '' },
        'first/file': { contents: 'lorem' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should concatenate no files if the matching pattern is an empty array', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: [], output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: '' },
        'first/file': { contents: 'lorem' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should concatenate file in the order of the files keys', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n \nipsum\n' }
      })
    })
  })

  t.test('should concatenate file in the order of the files keys / options.files patterns', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: ['third/*', 'second/*', 'first/*'], output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'ipsum\n \nlorem\n' }
      })
    })
  })

  t.test('should insert the new line as `\\n` by default', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: 'first/*', output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should insert the new line as `\\n` if options.insertNewline is true', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: true })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should not insert the new line if options.insertNewline is false', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: false })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should support custom new line if options.insertNewline is a string', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: '\r\n' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\r\n' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should delete the concatenated original files by default', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ output: 'output/path' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n \nipsum\n' }
      })
    })
  })

  t.test('should delete the concatenated original files if options.keepConcatenated is false', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ output: 'output/path', keepConcatenated: false })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n \nipsum\n' }
      })
    })
  })

  t.test('should keep the concatenated original files if options.keepConcatenated is true', function (q) {
    q.plan(1)
    var files = testFiles()
    var plugin = concat({ output: 'output/path', keepConcatenated: true })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'output/path': { contents: 'lorem\n \nipsum\n' },
        'first/file': { contents: 'lorem' },
        'second/file': { contents: ' ' },
        'third/file': { contents: 'ipsum' }
      })
    })
  })

  t.test('should throw if options.output is not defined', function (q) {
    q.plan(2)
    try {
      concat({})
    } catch (error) {
      q.ok(error instanceof Error)
      q.deepEqual(error.message, '`options.output` is mandatory and has to be a string')
    }
  })

  t.test('should throw error if options.output is not a string', function (q) {
    q.plan(2)
    try {
      concat({ output: false })
    } catch (error) {
      q.ok(error instanceof Error)
      q.deepEqual(error.message, '`options.output` is mandatory and has to be a string')
    }
  })

  t.test('should throw an error if options.output already exists', function (q) {
    q.plan(2)
    var plugin = concat({ output: 'output/path' })
    try {
      plugin({ 'output/path': {} })
    } catch (error) {
      q.ok(error instanceof Error)
      q.deepEqual(error.message, 'The file "output/path" already exists')
    }
  })

  // https://github.com/aymericbeaumet/metalsmith-concat/issues/9
  t.test('should not concatenate already concatenated files by default', function (q) {
    q.plan(1)
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
    plugin(files, null, function () {
      q.deepEqual(files, {
        'js/app.js': { contents: 'jquery\nbootstrap1\nbootstrap2\nother1\nother2\n' }
      })
    })
  })

  // https://github.com/aymericbeaumet/metalsmith-concat/issues/8
  t.test('should normalize options.output and options.files to be cross-platform compatible', function (q) {
    q.plan(1)
    var files = {
      'js/jquery.js': { contents: 'jquery' }
    }
    var plugin = concat({ files: ['js\\jquery.js'], output: 'js\\app.js' })
    plugin(files, null, function () {
      q.deepEqual(files, {
        'js/app.js': { contents: 'jquery\n' }
      })
    })
  })
})

function testFiles () {
  return {
    'first/file': { contents: 'lorem' },
    'second/file': { contents: ' ' },
    'third/file': { contents: 'ipsum' }
  }
}
