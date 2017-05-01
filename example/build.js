#!/usr/bin/env node
'use strict'

const Metalsmith = require('metalsmith')
const concat = require('..') // require('metalsmith-concat')

new Metalsmith(__dirname)
  .use(concat({ files: '**/*.css', output: 'main.css' }))
  .build((error) => {
    if (error) {
      throw error
    }
  })
