const path = require('path')
const test = require('ava')
const sinon = require('sinon')
const metalsmithConcat = require('.')

function filesFixture() {
  return {
    'first/file': { contents: Buffer.from('lorem') },
    'second/file': { contents: Buffer.from(' ') },
    'third/file': { contents: Buffer.from('ipsum') },
  }
}

function metalsmithFixture() {
  return {
    _directory: path.resolve(__dirname, 'fixture'),
  }
}

test.afterEach.always(() => sinon.restore())

test.cb('metalsmith-concat should concatenate all files by default', t => {
  t.plan(2)
  const files = filesFixture()
  const plugin = metalsmithConcat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), error => {
    t.falsy(error)
    t.deepEqual(files, {
      'output/path': { contents: Buffer.from('lorem\n \nipsum\n') },
    })
    t.end()
  })
})

test.cb(
  'metalsmith-concat should only concatenate the specified files if options.files is passed as a string',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({ files: 'first/*', output: 'output/path' })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should only concatenate the specified files if options.files is passed as a strings array',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({
      files: ['first/*', 'third/*'],
      output: 'output/path',
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\nipsum\n') },
        'second/file': { contents: Buffer.from(' ') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should concatenate no files if the matching pattern is an empty string',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({ files: '', output: 'output/path' })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('') },
        'first/file': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should concatenate no files if the matching pattern is an empty array',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({ files: [], output: 'output/path' })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('') },
        'first/file': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should concatenate file in the order of the files keys',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({ output: 'output/path' })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should concatenate file in the order of the files keys / options.files patterns',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({
      files: ['third/*', 'second/*', 'first/*'],
      output: 'output/path',
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('ipsum\n \nlorem\n') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should insert the new line as `\\n` by default',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({ files: 'first/*', output: 'output/path' })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should insert the new line as `\\n` if options.insertNewline is true',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({
      files: 'first/*',
      output: 'output/path',
      insertNewline: true,
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should not insert the new line if options.insertNewline is false',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({
      files: 'first/*',
      output: 'output/path',
      insertNewline: false,
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should support custom new line if options.insertNewline is a string',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({
      files: 'first/*',
      output: 'output/path',
      insertNewline: '\r\n',
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\r\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb('metalsmith-concat should delete the source files by default', t => {
  t.plan(2)
  const files = filesFixture()
  const plugin = metalsmithConcat({ output: 'output/path' })
  plugin(files, metalsmithFixture(), error => {
    t.falsy(error)
    t.deepEqual(files, {
      'output/path': { contents: Buffer.from('lorem\n \nipsum\n') },
    })
    t.end()
  })
})

test.cb(
  'metalsmith-concat should delete the concatenated original files if options.keepConcatenated is false',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({
      output: 'output/path',
      keepConcatenated: false,
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should keep the concatenated original files if options.keepConcatenated is true',
  t => {
    t.plan(2)
    const files = filesFixture()
    const plugin = metalsmithConcat({
      output: 'output/path',
      keepConcatenated: true,
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') },
        'first/file': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') },
      })
      t.end()
    })
  }
)

test.cb('metalsmith-concat should throw if no options object is passed', t => {
  t.plan(2)
  try {
    metalsmithConcat()
  } catch (error) {
    t.true(error instanceof Error)
    t.is(
      error.message,
      '`options.output` is mandatory and has to be a non-empty string'
    )
    t.end()
  }
})

test.cb(
  'metalsmith-concat should throw if options.output is not defined',
  t => {
    t.plan(2)
    try {
      metalsmithConcat({})
    } catch (error) {
      t.true(error instanceof Error)
      t.is(
        error.message,
        '`options.output` is mandatory and has to be a non-empty string'
      )
      t.end()
    }
  }
)

test.cb(
  'metalsmith-concat should throw error if options.output is not a string',
  t => {
    t.plan(2)
    try {
      metalsmithConcat({ output: false })
    } catch (error) {
      t.true(error instanceof Error)
      t.is(
        error.message,
        '`options.output` is mandatory and has to be a non-empty string'
      )
      t.end()
    }
  }
)

test.cb(
  'metalsmith-concat should throw error if options.output is an empty string',
  t => {
    t.plan(2)
    try {
      metalsmithConcat({ output: '' })
    } catch (error) {
      t.true(error instanceof Error)
      t.is(
        error.message,
        '`options.output` is mandatory and has to be a non-empty string'
      )
      t.end()
    }
  }
)

test.cb(
  'metalsmith-concat should return an error if options.output already exists by default',
  t => {
    t.plan(2)
    const plugin = metalsmithConcat({ output: 'output/path' })
    plugin({ 'output/path': {} }, metalsmithFixture(), error => {
      t.true(error instanceof Error)
      t.is(
        error.message,
        'The file "output/path" already exists, see the documentation for \'options.forceOutput\''
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should return an error if options.output already exists when indicated as option',
  t => {
    t.plan(2)
    const plugin = metalsmithConcat({
      output: 'output/path',
      forceOutput: false,
    })
    plugin({ 'output/path': {} }, metalsmithFixture(), error => {
      t.true(error instanceof Error)
      t.is(
        error.message,
        'The file "output/path" already exists, see the documentation for \'options.forceOutput\''
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should override existing file check if forceOutput is enabled',
  t => {
    t.plan(2)
    const files = {
      'output/path1': { contents: Buffer.from('test123') },
      'output/path2': { contents: Buffer.from('456test') },
    }
    const plugin = metalsmithConcat({
      files: ['output/path1', 'output/path2'],
      output: 'output/path',
      forceOutput: true,
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('test123\n456test\n') },
      })
      t.end()
    })
  }
)

// https://github.com/aymericbeaumet/metalsmith-concat/issues/9
test.cb(
  'metalsmith-concat should not concatenate already concatenated files by default',
  t => {
    t.plan(2)
    const files = {
      'js/jquery.js': { contents: Buffer.from('jquery') },
      'js/bootstrap/1.js': { contents: Buffer.from('bootstrap1') },
      'js/bootstrap/2.js': { contents: Buffer.from('bootstrap2') },
      'js/other/1.js': { contents: Buffer.from('other1') },
      'js/other/2.js': { contents: Buffer.from('other2') },
    }
    const plugin = metalsmithConcat({
      files: ['js/jquery.js', 'js/bootstrap/*.js', 'js/**/*.js'],
      output: 'js/app.js',
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'js/app.js': {
          contents: Buffer.from(
            'jquery\nbootstrap1\nbootstrap2\nother1\nother2\n'
          ),
        },
      })
      t.end()
    })
  }
)

// https://github.com/aymericbeaumet/metalsmith-concat/issues/8
test.cb(
  'metalsmith-concat should normalize options.output and options.files to be cross-platform compatible',
  t => {
    t.plan(2)
    const files = {
      'js/jquery.js': { contents: Buffer.from('jquery') },
    }
    const plugin = metalsmithConcat({
      files: ['js\\jquery.js'],
      output: 'js\\app.js',
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'js/app.js': { contents: Buffer.from('jquery\n') },
      })
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should not include files from options.searchPaths by default',
  t => {
    t.plan(2)
    const files = {}
    const plugin = metalsmithConcat({ files: ['**/*.md'], output: 'output' })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.true(files.output.contents.equals(Buffer.from('')))
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should resolve relative searchPaths from the project root (as a string)',
  t => {
    t.plan(2)
    const files = {}
    const plugin = metalsmithConcat({
      files: ['**/*.md'],
      output: 'output',
      searchPaths: '.',
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.true(
        files.output.contents.equals(Buffer.from('anotherdir\n\nroot\n\n'))
      )
      t.end()
    })
  }
)

test.cb(
  'metalsmith-concat should resolve relative searchPaths from the project root (as an array of strings)',
  t => {
    t.plan(2)
    const files = {}
    const plugin = metalsmithConcat({
      files: ['**/*.md'],
      output: 'output',
      searchPaths: ['.'],
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.true(
        files.output.contents.equals(Buffer.from('anotherdir\n\nroot\n\n'))
      )
      t.end()
    })
  }
)

// Serial because of mocking
test.serial.cb('metalsmith-concat should forward glob errors', t => {
  t.plan(2)
  sinon.replace(require('glob'), 'glob', (_pattern, _options, callback) =>
    callback(new Error('glob.glob error'))
  )
  const files = {}
  const plugin = metalsmithConcat({
    files: ['**/*.md'],
    output: 'output',
    searchPaths: ['.'],
  })
  plugin(files, metalsmithFixture(), error => {
    t.true(error instanceof Error)
    t.is(error.message, 'glob.glob error')
    t.end()
  })
})

// Serial because of mocking
test.serial.cb('metalsmith-concat should forward fs.readFile errors', t => {
  t.plan(2)
  sinon.replace(require('fs'), 'readFile', (_filepath, callback) =>
    callback(new Error('fs.readFile error'))
  )
  const files = {}
  const plugin = metalsmithConcat({
    files: ['**/*.md'],
    output: 'output',
    searchPaths: ['.'],
  })
  plugin(files, metalsmithFixture(), error => {
    t.true(error instanceof Error)
    t.is(error.message, 'fs.readFile error')
    t.end()
  })
})

// https://github.com/aymericbeaumet/metalsmith-concat/issues/25#issue-145523237
test.cb(
  'metalsmith-concat should respect the order given by the metalsmith files object',
  t => {
    t.plan(2)
    const files = {
      '01_foo.css': { contents: Buffer.from('first') },
      '02_bar.css': { contents: Buffer.from('second') },
    }
    const plugin = metalsmithConcat({ output: 'output/path' })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('first\nsecond\n') },
      })
      t.end()
    })
  }
)

// https://github.com/aymericbeaumet/metalsmith-concat/issues/26
test.cb(
  'metalsmith-concat should simplify the given path in the pattern',
  t => {
    t.plan(2)
    const files = {
      'foo/bar/baz': { contents: Buffer.from('foobarbaz') },
    }
    const plugin = metalsmithConcat({
      files: 'foo//\\\\bar\\\\//baz',
      output: 'output/path',
    })
    plugin(files, metalsmithFixture(), error => {
      t.falsy(error)
      t.deepEqual(files, {
        'output/path': { contents: Buffer.from('foobarbaz\n') },
      })
      t.end()
    })
  }
)
