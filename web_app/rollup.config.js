import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-copy-assets-to';
import cleaner from 'rollup-plugin-cleaner';

const production = !process.env.ROLLUP_WATCH;

function workbox(config) {
	return {
		name: 'workbox',
            async writeBundle() {
            let build = require('workbox-build');
            const { count, size } = await build.generateSW(config);
            console.log(count, size);
        }
	};
}

export default {
    input: 'src/index.js',
	output: {
		file: 'build/index.js',
        format: 'es',
		sourcemap: true
    },
    watch: {
        include: ['src/**','src/index.html']
    },
	plugins: [
        production && cleaner({  // Only remove ./build when building for production.
            targets: [
              './build/'
            ]
        }),
        copy({
            assets: [
                './images',
                './manifest.json',
                './src/index.html',
                'node_modules/@webcomponents/webcomponentsjs/bundles',
                'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
            ],
            outputDir: 'build'
        }),
        resolve(),
        commonjs(),
        production && terser(), // minify, but only in production
        babel({
            exclude: 'node_modules/**',
        }),
        workbox({
            swDest: './build/sw.js',
            globDirectory: './build',
            globPatterns: [
                "**/*.{js,html,json,png}"
            ],
            skipWaiting: true,
            // other workbox-build options depending on the mode
        }),
    ]
};