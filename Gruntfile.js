module.exports = function(grunt) {
  grunt.initConfig({
      jshint: {
          options: {
              reporter: require('jshint-stylish')
          },
          target: ['realistic-pen.js']
      },

      uglify: {
        src: {
          files: {
            'realistic-pen.min.js': ['realistic-pen.js']
          }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('dist', ['jshint', 'uglify:src']);
};