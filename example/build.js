'use strict';

var Metalsmith = require('metalsmith');
var concat = require('../lib'); // require('metalsmith-concat');

Metalsmith(__dirname)
  .use(concat())
  .build(function(err) { if (err) { throw err; } })
;
