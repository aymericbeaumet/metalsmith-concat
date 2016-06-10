'use strict'

const concat = require('..')
const path = require('path')
const proxyquire = require('proxyquire')
const test = require('ava')

test.cb('metalsmith-concat should concatenate all files by default', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n \nipsum\n') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\nipsum\n') },
      'second/file': { contents: new Buffer(' ') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('') },
      'first/file': { contents: new Buffer('lorem') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('') },
      'first/file': { contents: new Buffer('lorem') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n \nipsum\n') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('ipsum\n \nlorem\n') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\r\n') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should delete the source files by default', (t) => {
  t.plan(2)
  const files = filesFixture()
  const plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n \nipsum\n') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n \nipsum\n') }
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
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('lorem\n \nipsum\n') },
      'first/file': { contents: new Buffer('lorem') },
      'second/file': { contents: new Buffer(' ') },
      'third/file': { contents: new Buffer('ipsum') }
    })
    t.end()
  })
})

test.cb('metalsmith-concat should throw if no options object is passed', (t) => {
  t.plan(2)
  try {
    concat()
  } catch (error) {
    t.true(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should throw if options.output is not defined', (t) => {
  t.plan(2)
  try {
    concat({})
  } catch (error) {
    t.true(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should throw error if options.output is not a string', (t) => {
  t.plan(2)
  try {
    concat({ output: false })
  } catch (error) {
    t.true(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should throw error if options.output is an empty string', (t) => {
  t.plan(2)
  try {
    concat({ output: '' })
  } catch (error) {
    t.true(error instanceof Error)
    t.deepEqual(error.message, '`options.output` is mandatory and has to be a non-empty string')
    t.end()
  }
})

test.cb('metalsmith-concat should return an error if options.output already exists by default', (t) => {
  t.plan(2)
  const plugin = concat({ output: 'output/path' })
  plugin({ 'output/path': {} }, metalsmithFixture(), (error) => {
    t.true(error instanceof Error)
    t.deepEqual(error.message, 'The file "output/path" already exists')
    t.end()
  })
})

test.cb('metalsmith-concat should return an error if options.output already exists when indicated as option', (t) => {
  t.plan(2)
  const plugin = concat({ output: 'output/path', forceOutput: false })
  plugin({ 'output/path': {} }, metalsmithFixture(), (error) => {
    t.true(error instanceof Error)
    t.deepEqual(error.message, 'The file "output/path" already exists')
    t.end()
  })
})

test.cb('metalsmith-concat should override existing file check if forceOutput is enabled', (t) => {
  t.plan(2)
  const files = {
    'output/path1': { contents: new Buffer('test123') },
    'output/path2': { contents: new Buffer('456test') }
  }
  const plugin = concat({ files: ['output/path1', 'output/path2'], output: 'output/path', forceOutput: true })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('test123\n456test\n') }
    })
    t.end()
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/9
test.cb('metalsmith-concat should not concatenate already concatenated files by default', (t) => {
  t.plan(2)
  const files = {
    'js/jquery.js': { contents: new Buffer('jquery') },
    'js/bootstrap/1.js': { contents: new Buffer('bootstrap1') },
    'js/bootstrap/2.js': { contents: new Buffer('bootstrap2') },
    'js/other/1.js': { contents: new Buffer('other1') },
    'js/other/2.js': { contents: new Buffer('other2') }
  }
  const plugin = concat({
    files: ['js/jquery.js', 'js/bootstrap/*.js', 'js/**/*.js'],
    output: 'js/app.js'
  })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files, {
      'js/app.js': { contents: new Buffer('jquery\nbootstrap1\nbootstrap2\nother1\nother2\n') }
    })
    t.end()
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/8
test.cb('metalsmith-concat should normalize options.output and options.files to be cross-platform compatible', (t) => {
  t.plan(2)
  const files = {
    'js/jquery.js': { contents: new Buffer('jquery') }
  }
  const plugin = concat({ files: ['js\\jquery.js'], output: 'js\\app.js' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files, {
      'js/app.js': { contents: new Buffer('jquery\n') }
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
    t.deepEqual(files.output.contents, new Buffer(''))
    t.end()
  })
})

test.cb('metalsmith-concat should resolve relative searchPaths from the project root (as a string)', (t) => {
  t.plan(2)
  const files = {}
  const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: '.' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files.output.contents, new Buffer('anotherdir\n\nroot\n\n'))
    t.end()
  })
})

test.cb('metalsmith-concat should resolve relative searchPaths from the project root (as an array of strings)', (t) => {
  t.plan(2)
  const files = {}
  const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files.output.contents, new Buffer('anotherdir\n\nroot\n\n'))
    t.end()
  })
})

test.cb('metalsmith-concat should forward glob errors', (t) => {
  t.plan(1)
  const _concat = proxyquire('..', {
    glob (pattern, options, callback) {
      return callback(new Error('glob error'))
    }
  })
  const files = {}
  const plugin = _concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), (error) => {
    t.deepEqual(error.message, 'glob error')
    t.end()
  })
})

test.cb('metalsmith-concat should forward fs.readFile errors', (t) => {
  t.plan(1)
  const _concat = proxyquire('..', {
    fs: {
      readFile (filepath, callback) {
        return callback(new Error('fs.readFile error'))
      }
    }
  })
  const files = {}
  const plugin = _concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
  plugin(files, metalsmithFixture(), (error) => {
    t.deepEqual(error.message, 'fs.readFile error')
    t.end()
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/25#issue-145523237
test.cb('metalsmith-concat should respect the order given by the metalsmith files object', (t) => {
  t.plan(2)
  const files = {
    '01_foo.css': { contents: new Buffer('first') },
    '02_bar.css': { contents: new Buffer('second') }
  }
  const plugin = concat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('first\nsecond\n') }
    })
    t.end()
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/26
test.cb('metalsmith-concat should simplify the given path in the pattern', (t) => {
  t.plan(2)
  const files = {
    'foo/bar/baz': { contents: new Buffer('foobarbaz') }
  }
  const plugin = concat({ files: 'foo//\\\\bar\\\\//baz', output: 'output/path' })
  plugin(files, metalsmithFixture(), (error) => {
    t.ifError(error)
    t.deepEqual(files, {
      'output/path': { contents: new Buffer('foobarbaz\n') }
    })
    t.end()
  })
})

function filesFixture () {
  return {
    'first/file': { contents: new Buffer('lorem') },
    'second/file': { contents: new Buffer(' ') },
    'third/file': { contents: new Buffer('ipsum') }
  }
}

function metalsmithFixture () {
  return {
    _directory: path.resolve(__dirname, 'fixture')
  }
}
