process.env.DISABLE_NOTIFIER = true;

let elixir = require('laravel-elixir');

require("laravel-elixir-webpack-official");
require('laravel-elixir-vue');
require('laravel-elixir-remove');

elixir.config.sourcemaps = true;

let
    npmPath = './node_modules',
    srcPath = './src',
    examplePath = './example',
    assetsPath = examplePath + '/assets';

/**
 * Run elixir
 */
elixir(function(mix) {

    // Clear assets path
    //mix.remove(assetsPath);

    // Pack component

    // Pack component to js file
    mix.webpack(
        [
            srcPath + '/**/**/*.js',
            srcPath + '/**/**/*.vue',
            examplePath + '/example.js',
        ],
        assetsPath + '/js/app.js'
    );

    // Pack specified libs to lib.js
    mix.scripts(
        [
            npmPath + '/vue/dist/vue.js'
        ],
        assetsPath + '/js/lib.js'
    );

    // Pack CSS to lib.css
    mix.styles(
        [
            npmPath + '/font-awesome/css/font-awesome.css',
        ],
        assetsPath + '/css/lib.css'
    );

    // Copy fonts
    mix.copy(
        [
            npmPath + '/font-awesome/fonts/**'
        ],
        assetsPath + '/fonts'
    );
});