const fs = require('fs');
const path = require('path');
const async = require('async');
const glob = require('glob');
const minimatch = require('minimatch');

// Must be called to convert the glob/minimatch inputs and patterns to the
// forward slash path notation (see:
// https://github.com/isaacs/node-glob#windows)
function backslashToSlash(s) {
	return s.replace(/\\/g, '/');
}

// Source and pattern are expected to be in the forward slash form
function gathererFromSourceDirectory(source, pattern, {keepConcatenated}) {
	// This gather loops over all the files Metalsmith knows of and return an
	// array of all the files contents matching the given pattern. Before the
	// filepaths are matched, they are normalized to the forward slash form.
	return function (done) {
		return done(
			null,
			Object.keys(source).reduce((acc, filepath) => {
				if (minimatch(backslashToSlash(filepath), pattern)) {
					acc.push(source[filepath].contents);
					if (!keepConcatenated) {
						delete source[filepath];
					}
				}

				return acc;
			}, [])
		);
	};
}

// RootPath, searchPaths and pattern are expected to be in the forward slash form
function gathererFromSearchPaths(rootPath, searchPaths, pattern) {
	// This gatherer loops over the search paths and return an array of all the files
	// contents matching the given pattern
	return function (done) {
		async.map(
			searchPaths,
			(searchPath, callback) => {
				const globPattern = `${rootPath}/${searchPath}/${pattern}`;
				glob.glob(
					globPattern,
					{
						ignore: `${rootPath}/src/**/*`,
						minimatch,
						nodir: true
					},
					(error, filepaths) => {
						if (error) {
							return callback(error);
						}

						async.map(
							filepaths.map(filepath => path.resolve(rootPath, filepath)),
							fs.readFile,
							callback
						);
					}
				);
			},
			(error, filesContents) => {
				if (error) {
					return done(error);
				}

				return done(null, [].concat(...filesContents)); // Flatten one level
			}
		);
	};
}

module.exports = (options = {}) => {
	if (!(typeof options.output === 'string' && options.output.length > 0)) {
		throw new Error(
			'`options.output` is mandatory and has to be a non-empty string'
		);
	}

	const output = options.output;

	const patterns = (Array.isArray(options.files) ?
		options.files :
		(typeof options.files === 'string' ?
			[options.files] :
			['**/*'])
	);

	const EOL = typeof options.insertNewline === 'string' ?
		options.insertNewline :
		(options.insertNewline === false ?
			'' :
			'\n');

	const searchPaths = Array.isArray(options.searchPaths) ?
		options.searchPaths :
		(typeof options.searchPaths === 'string' ?
			[options.searchPaths] :
			[]);

	const {forceOutput = false, keepConcatenated = false} = options;

	return (files, metalsmith, done) => {
		if (output in files && !forceOutput) {
			return done(
				new Error(
					`The file "${output}" already exists, see the documentation for 'options.forceOutput'`
				)
			);
		}

		// We reduce the array of patterns into an array of gatherers
		const gatherers = patterns.reduce(
			(acc, pattern) => [
				...acc,
				gathererFromSourceDirectory(files, pattern, {keepConcatenated}),
				gathererFromSearchPaths(
					backslashToSlash(metalsmith._directory),
					searchPaths.map(sp => backslashToSlash(sp)),
					pattern
				)
			],
			[]
		);

		// Gather all the files contents and generate the final concatenated file
		async.parallel(gatherers, (error, gatherersResults) => {
			if (error) {
				return done(error);
			}

			const filesContents = [
				...[].concat(...gatherersResults), // Shallow flatten the results from each gatherers [[a], [b]] -> [a, b]
				'' // Append an empty string so that the final join result includes a trailing newline
			];

			files[output] = {contents: Buffer.from(filesContents.join(EOL))};
			return done();
		});
	};
};
