const concat = require('..')
const path = require('path')

describe('metalsmith-concat', () => {
  it('should concatenate all files by default', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') }
      })
      done()
    })
  })

  it('should only concatenate the specified files if options.files is passed as a string', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: 'first/*', output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should only concatenate the specified files if options.files is passed as a strings array', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: ['first/*', 'third/*'], output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\nipsum\n') },
        'second/file': { contents: Buffer.from(' ') }
      })
      done()
    })
  })

  it('should concatenate no files if the matching pattern is an empty string', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: '', output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('') },
        'first/file': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should concatenate no files if the matching pattern is an empty array', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: [], output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('') },
        'first/file': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should concatenate file in the order of the files keys', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') }
      })
      done()
    })
  })

  it('should concatenate file in the order of the files keys / options.files patterns', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: ['third/*', 'second/*', 'first/*'], output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('ipsum\n \nlorem\n') }
      })
      done()
    })
  })

  it('should insert the new line as `\\n` by default', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: 'first/*', output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should insert the new line as `\\n` if options.insertNewline is true', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: true })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should not insert the new line if options.insertNewline is false', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: false })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should support custom new line if options.insertNewline is a string', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ files: 'first/*', output: 'output/path', insertNewline: '\r\n' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\r\n') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should delete the source files by default', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') }
      })
      done()
    })
  })

  it('should delete the concatenated original files if options.keepConcatenated is false', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ output: 'output/path', keepConcatenated: false })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') }
      })
      done()
    })
  })

  it('should keep the concatenated original files if options.keepConcatenated is true', (done) => {
    expect.assertions(2)
    const files = filesFixture()
    const plugin = concat({ output: 'output/path', keepConcatenated: true })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('lorem\n \nipsum\n') },
        'first/file': { contents: Buffer.from('lorem') },
        'second/file': { contents: Buffer.from(' ') },
        'third/file': { contents: Buffer.from('ipsum') }
      })
      done()
    })
  })

  it('should throw if no options object is passed', (done) => {
    expect.assertions(2)
    try {
      concat()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', '`options.output` is mandatory and has to be a non-empty string')
      done()
    }
  })

  it('should throw if options.output is not defined', (done) => {
    expect.assertions(2)
    try {
      concat({})
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', '`options.output` is mandatory and has to be a non-empty string')
      done()
    }
  })

  it('should throw error if options.output is not a string', (done) => {
    expect.assertions(2)
    try {
      concat({ output: false })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', '`options.output` is mandatory and has to be a non-empty string')
      done()
    }
  })

  it('should throw error if options.output is an empty string', (done) => {
    expect.assertions(2)
    try {
      concat({ output: '' })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', '`options.output` is mandatory and has to be a non-empty string')
      done()
    }
  })

  it('should return an error if options.output already exists by default', (done) => {
    expect.assertions(2)
    const plugin = concat({ output: 'output/path' })
    plugin({ 'output/path': {} }, metalsmithFixture(), (error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'The file "output/path" already exists')
      done()
    })
  })

  it('should return an error if options.output already exists when indicated as option', (done) => {
    expect.assertions(2)
    const plugin = concat({ output: 'output/path', forceOutput: false })
    plugin({ 'output/path': {} }, metalsmithFixture(), (error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'The file "output/path" already exists')
      done()
    })
  })

  it('should override existing file check if forceOutput is enabled', (done) => {
    expect.assertions(2)
    const files = {
      'output/path1': { contents: Buffer.from('test123') },
      'output/path2': { contents: Buffer.from('456test') }
    }
    const plugin = concat({ files: ['output/path1', 'output/path2'], output: 'output/path', forceOutput: true })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('test123\n456test\n') }
      })
      done()
    })
  })

  // https://github.com/aymericbeaumet/metalsmith-concat/issues/9
  it('should not concatenate already concatenated files by default', (done) => {
    expect.assertions(2)
    const files = {
      'js/jquery.js': { contents: Buffer.from('jquery') },
      'js/bootstrap/1.js': { contents: Buffer.from('bootstrap1') },
      'js/bootstrap/2.js': { contents: Buffer.from('bootstrap2') },
      'js/other/1.js': { contents: Buffer.from('other1') },
      'js/other/2.js': { contents: Buffer.from('other2') }
    }
    const plugin = concat({
      files: ['js/jquery.js', 'js/bootstrap/*.js', 'js/**/*.js'],
      output: 'js/app.js'
    })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'js/app.js': { contents: Buffer.from('jquery\nbootstrap1\nbootstrap2\nother1\nother2\n') }
      })
      done()
    })
  })

  // https://github.com/aymericbeaumet/metalsmith-concat/issues/8
  it('should normalize options.output and options.files to be cross-platform compatible', (done) => {
    expect.assertions(2)
    const files = {
      'js/jquery.js': { contents: Buffer.from('jquery') }
    }
    const plugin = concat({ files: ['js\\jquery.js'], output: 'js\\app.js' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'js/app.js': { contents: Buffer.from('jquery\n') }
      })
      done()
    })
  })

  it('should not include files from options.searchPaths by default', (done) => {
    expect.assertions(2)
    const files = {}
    const plugin = concat({ files: ['**/*.md'], output: 'output' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files.output.contents).toEqual(Buffer.from(''))
      done()
    })
  })

  it('should resolve relative searchPaths from the project root (as a string)', (done) => {
    expect.assertions(2)
    const files = {}
    const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: '.' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files.output.contents).toEqual(Buffer.from('anotherdir\n\nroot\n\n'))
      done()
    })
  })

  it('should resolve relative searchPaths from the project root (as an array of strings)', (done) => {
    expect.assertions(2)
    const files = {}
    const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files.output.contents).toEqual(Buffer.from('anotherdir\n\nroot\n\n'))
      done()
    })
  })

  it('should forward glob errors', (done) => {
    expect.assertions(2)
    jest.spyOn(require('glob'), 'glob').mockImplementationOnce(
      (pattern, options, callback) => callback(new Error('glob error'))
    )
    const files = {}
    const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'glob error')
      done()
    })
  })

  it('should forward fs.readFile errors', (done) => {
    expect.assertions(2)
    jest.spyOn(require('fs'), 'readFile').mockImplementationOnce(
      (filepath, callback) => callback(new Error('fs.readFile error'))
    )
    const files = {}
    const plugin = concat({ files: ['**/*.md'], output: 'output', searchPaths: ['.'] })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'fs.readFile error')
      done()
    })
  })

  // https://github.com/aymericbeaumet/metalsmith-concat/issues/25#issue-145523237
  it('should respect the order given by the metalsmith files object', (done) => {
    expect.assertions(2)
    const files = {
      '01_foo.css': { contents: Buffer.from('first') },
      '02_bar.css': { contents: Buffer.from('second') }
    }
    const plugin = concat({ output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('first\nsecond\n') }
      })
      done()
    })
  })

  // https://github.com/aymericbeaumet/metalsmith-concat/issues/26
  it('should simplify the given path in the pattern', (done) => {
    expect.assertions(2)
    const files = {
      'foo/bar/baz': { contents: Buffer.from('foobarbaz') }
    }
    const plugin = concat({ files: 'foo//\\\\bar\\\\//baz', output: 'output/path' })
    plugin(files, metalsmithFixture(), (error) => {
      expect(error).toBeFalsy()
      expect(files).toEqual({
        'output/path': { contents: Buffer.from('foobarbaz\n') }
      })
      done()
    })
  })
})

function filesFixture () {
  return {
    'first/file': { contents: Buffer.from('lorem') },
    'second/file': { contents: Buffer.from(' ') },
    'third/file': { contents: Buffer.from('ipsum') }
  }
}

function metalsmithFixture () {
  return {
    _directory: path.resolve(__dirname, 'fixture')
  }
}
