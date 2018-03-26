const path = require('path');
const webpack = require('webpack');
// const webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    headline: '<%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("ddd, d mmm yyyy hh:MM:ss") %>)',
    license: grunt.file.read('LICENSE'),
    banner: '/*! <%= headline %>\n\
\n\
<%= pkg.description %>\n\
@module <%= pkg.name %>\n\
@author <%= pkg.contributors[0].name %> <<%= pkg.contributors[0].email %>>\n\
@license <%= pkg.license %>\n\
\n\
<%= license %>\n\
    */\n\n',

    clean: {
      default: {
        src: ['lib']
      }
    },

    ts: {
      compile : {
        tsconfig: true,
        options: {
          fast: 'never',
          outDir: 'lib'
        }
      }
    },

    webpack: {
      compile: {
        // webpack options
        entry  : './src/index.js',

        output : {
          path     : path.resolve(__dirname, 'lib'),
          filename : '<%= pkg.name %>.js',
          library: 'Timeously',
          libraryTarget: 'umd',
          sourceMapFilename: '[file].map',
          umdNamedDefine: true
        },

        devtool: 'source-map',

        externals: {
          'moment-timezone': 'moment-timezone'
        },

        module: {
          rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
          ]
        },

        // ts: {
        //   "compilerOptions": {
        //     "target": "es5",
        //     "sourceMap": true,
        //     "jsx": "react",
        //     "experimentalDecorators": true
        //   },
        //   "exclude": [
        //     "node_modules",
        //     "test"
        //   ]
        // },

        plugins: [
          new webpack.BannerPlugin({ banner: '<%= banner %>', raw: true })
        ]
      }
    },

    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    mochaTest: {
      run: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['clean', 'ts', 'webpack', 'mochaTest']);
};