var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');

var outputName = 'server-legacy.js';

/* helper function to get into build directory */
var distPath = function ( name ) {
  	return path.join(name);
};

module.exports = {
	mode: 'production',
  	entry: './src/main.ts',
	target: 'node',
	output: { filename: distPath(outputName) },
	resolve: {
		extensions: ['.ts', '.js'],
		modules: [ 'node_modules', 'src' ]
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				test: /\.ts$/,
				ts: {
					compiler: 'typescript',
					configFileName: 'tsconfig.json'
				},
				tslint: {
					emitErrors: true,
					failOnHint: true
				}
			}
		})
	],
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.ts$/,
			use: 'ts-loader'
		}]
	},
	externals: [ nodeExternals() ]
};
