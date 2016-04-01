'use strict'

const concat = require('..')
const path = require('path')
const sandbox = require('sandboxed-module')
const test = require('ava')

sandbox.registerBuiltInSourceTransformer('istanbul')

test.cb('metalsmith-concat should concatenate all files by default', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should only concatenate the specified files if options.files is passed as a string', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: 'first/*', output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should only concatenate the specified files if options.files is passed as a strings array', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: ['first/*', 'third/*'], output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\nipsum\n' },
      'second/file': { contents: ' ' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should concatenate no files if the matching pattern is an empty string', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: '', output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: '' },
      'first/file': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should concatenate no files if the matching pattern is an empty array', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: [], output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: '' },
      'first/file': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should concatenate file in the order of the files keys', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should concatenate file in the order of the files keys / options.files patterns', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: ['third/*', 'second/*', 'first/*'], output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'ipsum\n \nlorem\n' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should insert the new line as `\\n` by default', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: 'first/*', output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should insert the new line as `\\n` if options.insertNewline is true', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: true })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should not insert the new line if options.insertNewline is false', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: false })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should support custom new line if options.insertNewline is a string', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: '\r\n' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\r\n' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should delete the concatenated original files by default', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should delete the concatenated original files if options.keepConcatenated is false', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ output: 'output/path', keepConcatenated: false })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should keep the concatenated original files if options.keepConcatenated is true', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ output: 'output/path', keepConcatenated: true })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'lorem\n \nipsum\n' },
      'first/file': { contents: 'lorem' },
      'second/file': { contents: ' ' },
      'third/file': { contents: 'ipsum' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should throw if no options object is passed', (t) => {
  t.plan(2)
  try {
    concat()
  } catch (error) {
    t.ok(error instanceof Error)
    t.same(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should throw if options.output is not defined', (t) => {
  t.plan(2)
  try {
    concat({})
  } catch (error) {
    t.ok(error instanceof Error)
    t.same(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should throw error if options.output is not a string', (t) => {
  t.plan(2)
  try {
    concat({ output: false })
  } catch (error) {
    t.ok(error instanceof Error)
    t.same(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should throw error if options.output is an empty string', (t) => {
  t.plan(2)
  try {
    concat({ output: '' })
  } catch (error) {
    t.ok(error instanceof Error)
    t.same(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should return an error if options.output already exists by default', (t) => {
  t.plan(2)
  const plugin = concat({ output: 'output/path' })
  plugin({ 'output/path': {} }, metalsmithFixture(), (error) => {
    t.ok(error instanceof Error)
    t.same(error.message, 'The file "output/path" already exists')
    t.end()
  })
})

test.cb('metalsmith-concat should return an error if options.output already exists when indicated as option', (t) => {
  t.plan(2)
  const plugin = concat({ output: 'output/path', forceOutput: false })
  plugin({ 'output/path': {} }, metalsmithFixture(), (error) => {
    t.ok(error instanceof Error)
    t.same(error.message, 'The file "output/path" already exists')
    t.end()
  })
})

test.cb('metalsmith-concat should override existing file check if forceOutput is enabled', (t) => {
  t.plan(2)
  const files = {
    'output/path1': { contents: 'test123' },
    'output/path2': { contents: '456test' }
  }
  const plugin = concat({ files: ['output/path1', 'output/path2'], output: 'output/path', forceOutput: true })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'output/path': { contents: 'test123\n456test\n' }
    })
    t.end()
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/9
test.cb('metalsmith-concat should not concatenate already concatenated files by default', (t) => {
  t.plan(2)
  const files = {
    'js/jquery.js': { contents: 'jquery' },
    'js/bootstrap/1.js': { contents: 'bootstrap1' },
    'js/bootstrap/2.js': { contents: 'bootstrap2' },
    'js/other/1.js': { contents: 'other1' },
    'js/other/2.js': { contents: 'other2' }
  }
  const plugin = concat({
    files: ['js/jquery.js', 'js/bootstrap/*.js', 'js/**/*.js'],
    output: 'js/app.js'
  })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'js/app.js': { contents: 'jquery\nbootstrap1\nbootstrap2\nother1\nother2\n' }
    })
    t.end()
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/8
test.cb('metalsmith-concat should normalize options.output and options.files to be cross-platform compatible', (t) => {
  t.plan(2)
  const files = {
    'js/jquery.js': { contents: 'jquery' }
  }
  const plugin = concat({ files: ['js\\jquery.js'], output: 'js\\app.js' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files, {
      'js/app.js': { contents: 'jquery\n' }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should not include files from options.searchPaths by default', (t) => {
  t.plan(2)
  const files = {}
  const plugin = concat({ files: ['**/*.md'], output: 'output' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files.output.contents, '')
    t.end()
  })
})

test.cb('metalsmith-concat should resolve relative searchPaths from the project root (as a string)', (t) => {
  t.plan(2)
  const files = {}
  const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: '.' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files.output.contents, 'anotherdir\n\nroot\n\n')
    t.end()
  })
})

test.cb('metalsmith-concat should resolve relative searchPaths from the project root (as an array of strings)', (t) => {
  t.plan(2)
  const files = {}
  const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.same(files.output.contents, 'anotherdir\n\nroot\n\n')
    t.end()
  })
})

test.cb('metalsmith-concat should forward glob errors', (t) => {
  t.plan(1)
  const _concat = sandbox.require('..', {
    requires: {
      glob (pattern, options, callback) {
        return callback(new Error('glob error'))
      }
    },
    singleOnly: true
  })
  const files = {}
  const plugin = _concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), (error) => {
    t.same(error.message, 'glob error')
    t.end()
  })
})

test.cb('metalsmith-concat should forward fs.readFile errors', (t) => {
  t.plan(1)
  const _concat = sandbox.require('..', {
    requires: {
      fs: {
        readFile (filepath, callback) {
          return callback(new Error('fs.readFile error'))
        }
      }
    },
    singleOnly: true
  })
  const files = {}
  const plugin = _concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), (error) => {
    t.same(error.message, 'fs.readFile error')
    t.end()
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
