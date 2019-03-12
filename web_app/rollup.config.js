import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy-assets-to';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.js',
	output: {
		file: 'build/index.js',
        format: 'es',
		sourcemap: true
	},
	plugins: [
        copy({
            assets: [
                './images',
                './manifest.json'
            ],
            outputDir: 'build'
        }),
        resolve(),
        commonjs(),
        production && terser(), // minify, but only in production
        !production && livereload(),
        babel({
            exclude: 'node_modules/**',
        }),
    ]
};