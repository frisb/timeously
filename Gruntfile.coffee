module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'

    clean:
      default:
        src: ['lib']


    coffee:
      compile:
        options:
          bare: false
          join: true
        files:
          'lib/timeously.js': 'src/**/*.coffee'

  grunt.loadTasks('tasks')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.registerTask('default', ['clean', 'coffee'])
