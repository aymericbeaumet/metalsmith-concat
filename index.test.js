const rewire = require("rewire")
const index = rewire("./index")
const gathererFromSourceDirectory = index.__get__("gathererFromSourceDirectory")
const metalsmithifyPath = index.__get__("metalsmithifyPath")
// @ponicode
describe("gathererFromSourceDirectory", () => {
    test("0", () => {
        let callFunction = () => {
            gathererFromSourceDirectory({ key4: -5.48, 1: { contents: "libclang.dylib" } }, "(?P<ip>[^%]+)%(?P<route_domain>[0-9]+)[:.](?P<port>[0-9]+|any)", { keepConcatenated: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            gathererFromSourceDirectory({ key4: -100, 1: { contents: "libclang.dylib" } }, "(.*)-(.+)", { keepConcatenated: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            gathererFromSourceDirectory({ key4: -100, 1: { contents: "libclang.so" } }, "\\\\\\^\\$\\.\\|\\?\\*\\+\\(\\)\\[", { keepConcatenated: 7588892 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            gathererFromSourceDirectory({ key4: -5.48, 1: { contents: "navix376.py" } }, "^(?P<key>(Product|Build|Sequence|BaseBuild|Edition|Date|Built|Changelist|JobID))\\:(?P<value>.*)", { keepConcatenated: 0 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            gathererFromSourceDirectory({ key4: -5.48, 1: { contents: "decoder.hh" } }, "(?i)(?L)(?m)(?s)(?u)(?#)", { keepConcatenated: 9876 })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            gathererFromSourceDirectory(undefined, undefined, { keepConcatenated: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("metalsmithifyPath", () => {
    test("0", () => {
        let callFunction = () => {
            metalsmithifyPath("path/to/folder/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            metalsmithifyPath("C:\\\\path\\to\\folder\\")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            metalsmithifyPath("path/to/file.ext")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            metalsmithifyPath(".")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            metalsmithifyPath("/path/to/file")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            metalsmithifyPath(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
