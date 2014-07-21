'use strict';

var Metalsmith = require('metalsmith');
var concat = require('../lib'); // require('metalsmith-concat');

Metalsmith(__dirname)
  .use(concat({ files: '**/*.css', output: 'main.css' }))
  .build(function(err) { if (err) { throw err; } })
;
