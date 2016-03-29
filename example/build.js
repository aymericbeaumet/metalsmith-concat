#!/usr/bin/env node
'use strict'

var Metalsmith = require('metalsmith')
var concat = require('..') // require('metalsmith-concat')

Metalsmith(__dirname)
  .use(concat({ files: '**/*.css', output: 'main.css' }))
  .build(function (error) { if (error) { throw error } })
