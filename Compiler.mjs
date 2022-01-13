import fs from 'fs';
import path from 'path';
import webpack from "webpack";
import { fileURLToPath } from 'node:url';
import { CompilationErrors, CompileCommon } from '../toomanyproxies/WebpackUtil.mjs';
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'toomanyproxies', 'package.json')));

const frontend = webpack({
	...CompileCommon,
	entry: path.join(__dirname, 'assets', 'index.mjs'),
	context: __dirname,
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main.js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'assets', 'index.ejs'),
			templateParameters: {
				package: pkg,
			},
		}),
		new MiniCssExtractPlugin()
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
				],
			},
		],
	},
});

frontend.watch({}, (...args) => {
	if (!CompilationErrors(...args)) console.log('Successful build of frontend.');
	else console.error('Failure building frontend.');
});