
module.exports = function(grunt) {


grunt.initConfig({
    ngAnnotate: {
        options: {
            singleQuotes: true,
        },
        app1: {
            files: {
                'a.js': ['app.js']}}}});


grunt.loadNpmTasks('grunt-ng-annotate');};