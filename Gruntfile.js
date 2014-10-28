module.exports = function(grunt) {
  grunt.initConfig({
      jshint: {
          options: {
              reporter: require('jshint-stylish')
          },
          target: ['ribbon.js']
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint']);
};