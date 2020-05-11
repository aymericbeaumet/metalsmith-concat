#!/usr/bin/env node

const metalsmith = require('metalsmith');
const metalsmithConcat = require('..');

metalsmith(__dirname)
	.use(
		metalsmithConcat({
			files: '**/*.css',
			output: 'main.css'
		})
	)
	.build(error => {
		if (error) {
			throw error;
		}
	});
