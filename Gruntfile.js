/*
 * lesscss.org
 * https://github.com/less/less-docs
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {


  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('_config.yml'),

    jshint: {
      options: {jshintrc: '.jshintrc'},
      all: [
        'Gruntfile.js',
        'templates/helpers/*.js'
      ]
    },

    // Pull down a JSON list of repos from the Less org, using
    // GitHub's API (to be passed as context into the templates)
    repos: {
      namespaced: {
        options: {username: 'less'},
        files: {
          '<%= site.data %>/less.json': ['repos?page=1&per_page=100']
        }
      }
    },

    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        production: false,
        assets: '<%= site.dest %>/public',

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>/*.{json,yml}', 'content_zh/**/*.json'],

        // Extensions
        plugins: '<%= site.plugins %>',
        helpers: ['<%= site.helpers %>/*.js'],

        // Helper options
        compose: {cwd: 'content_zh'},
        marked: {
          process: true,
          heading: '<%= site.markedtemplates %>/heading.tmpl',
          // highlight.js options
          prefix: 'lang-'
        },

        // Templates
        partials: '<%= site.includes %>/*.hbs',
        layoutdir: '<%= site.layouts %>',
        layoutext: '<%= site.layoutext %>',
        layout: '<%= site.layout %>'
      },
      site: {
        options: {
          partials: ['content_zh/**/*.md'],
          permalinks: {preset: 'pretty'}
        },
        src: '<%= site.pages %>/*.hbs',
        dest: '<%= site.dest %>/'
      },
      feed: {
        options: {
          ext: '.xml',
          layout: 'none'
        },
        src: '<%= site.pages %>/feed.xml',
        dest: '<%= site.dest %>/'
      }
    },

    prettify: {
      site: {
        files: [
          {expand: true, cwd: '<%= site.dest %>', src: '*.html', dest: '<%= site.dest %>/', ext: '.html'}
        ]
      }
    },

    connect: {
      options: {
        port: 3000,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: ['<%= site.dest %>']
        }
      }
    },

    // Compile Less to CSS
    less: {
      options: {
        paths: ['styles/bootstrap', 'styles/components']
      },
      site: {
        src: ['styles/index.less'],
        dest: '<%= assemble.options.assets %>/css/index.css'
      }
    },

    // Copy source assets to _gh_pages
    copy: {
      assets: {
        files: [
          {expand: true, cwd: '<%= site.assets %>/public', src: ['**'], dest: '<%= site.dest %>/public/'},
          {expand: true, cwd: '<%= site.assets %>/root', src: ['*'], dest: '<%= site.dest %>/', rename: function(dest, src) {
            dest = dest + src.replace(/^_/, '');
            return dest;
          }}
        ]
      }
    },

    clean: {
      example: ['<%= site.dest %>/*']
    },

    watch: {
      options: {livereload: true},
      site: {
        files: [
          '<%= site.helpers %>',
          '<%= site.styles %>/**/*.less',
          '<%= site.templates %>/**/*.hbs',
          '<%= site.content %>/**/*.md',
          '<%= site.content %>/_config.yml',
          '<%= site.data %>/*.yml',
          '<%= site.data %>/*.json'
        ],
        tasks: ['clean', 'copy', 'less:site', 'assemble']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-prettify');
  grunt.loadNpmTasks('grunt-repos');
  grunt.loadNpmTasks('grunt-sync-pkg');

  grunt.registerTask('update', ['repos', 'default']);
  grunt.registerTask('design', ['clean', 'copy', 'less:site', 'assemble:site', 'connect', 'watch']);

  // Default tasks to be run.
  grunt.registerTask('default', ['jshint', 'clean', 'copy', 'less:site', 'assemble:site']);
};
