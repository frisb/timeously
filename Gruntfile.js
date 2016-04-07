var path = require('path');
var webpack = require('webpack');

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

    jshint: {
      options: {
        jshintrc: true
      },
      es6: ['src/**/*.js']
    },

    webpack: {
      compile: {
        // webpack options
        entry  : './src/index.js',

        output : {
          path     : './lib',
          filename : '<%= pkg.name %>.js',
          libraryTarget: 'umd',
          sourceMapFilename: '[file].map',
          umdNamedDefine: true
        },

        devtool: 'source-map',

        module : {
          loaders: [
            {
              loader : 'json-loader',
              test: /\.json$/
            },
            {
              loader : 'babel-loader',
              test: /\.js$/,
              // Skip any files outside of your project's `src` directory
              exclude: [
                path.resolve(__dirname, 'node_modules')
              ]
            }
          ]
        },

        plugins: [
          new webpack.BannerPlugin('<%= banner %>', { raw: true })
        ]
      }
    },

    uglify: {
      compile: {
        options: {
          banner: '/*! <%= headline %> */',
          mangle: true,
          report: 'gzip',
          sourceMap: true,
          sourceMapIn: 'lib/<%= pkg.name %>.js.map'
        },
        files: { 'lib/<%= pkg.name %>.min.js': 'lib/<%= pkg.name %>.js' }
      }
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
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['clean', 'jshint', 'webpack', 'uglify', 'mochaTest']);
};