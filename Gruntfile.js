module.exports = function(grunt) {

    // auto load all npm tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Project configuration.
    grunt.initConfig({

        // read package.json file, this info may be used in these scripts
        pkg: grunt.file.readJSON('package.json'),

        // run js hint on following js fiels
        jshint: {
            lint: ['Gruntfile.js', 'source/scripts/**/*.js', 'tests/**/*.js']
        },

        // requirejs compilation
        requirejs: {
            options: {
                baseUrl: 'source/scripts',

                mainConfigFile:'source/scripts/main.js',

                name: 'main',
                dir: 'js/',

                // remove all combined scripts from compiled
                removeCombined: true,

                keepBuildDir:true
            },
            // concat       
            dev: {
                options: {
                    optimize: 'none'
                }
            },
            // concat and uglify
            dist: {
               options: {
                    optimize: 'uglify',
                    preserveLicenseComments: false
                } 
            } 
        },

         // copy tasks
        copy: {
            // copy require.js file to public
            requirejs: {
                src: ['source/components/requirejs/require.js'],
                dest: 'js/vendor/require.js'
            },
            // copy/rename normalize.css as sass can only inline import .scss files
            // NOTE: included as part of inuit
            normalize: {
                 src: ['source/components/normalize-css/normalize.css'],
                 dest: 'source/styles/vendor/_normalize.scss'
            }
        },

        // spritesmith
        // - create sprite.png
        // - create _sprite.scss
        // 
        // NOTE: After adding spritesmith, delete node_modules and run npm install again
        sprite: {
            all: {
                // Sprite files to read in
                src: ['source/images/sprites/*.png'],

                // Location to output spritesheet
                destImg: 'source/images/sprite.png',

                // SASS with variables under sprite names
                destCSS: 'source/styles/_sprite.scss',

                // OPTIONAL: Specify algorithm (top-down, left-right, diagonal [\ format],
                // alt-diagonal [/ format], binary-tree [best packing])
                algorithm: 'binary-tree',

                // OPTIONAL: Specify engine (auto, phantomjs, canvas, gm)
                engine: 'canvas',

                imgPath: '../images/sprite.png'
            }
        },

        // sass compliation
        sass: {             
            // concat
            dev: {
                files: {
                  'css/main.css': 'source/styles/main.scss'
                },  
                options: {
                    style: 'expanded'              
                }                
            },
            // concat and minify
            dist: {
                files: {
                  'css/main.css': 'source/styles/main.scss'
                },  
                options: {
                  style: 'compressed'
                }
            }
        },

        // optimize images
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,               // Enable dynamic expansion
                    cwd: 'source/images/',      // Src matches are relative to this path
                    src: ['*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'images/'             // Destination path prefix
                }]
            }
        },

        // run Philip Waltons' HTML Inspector on compiled HTML
        // disabled due to error: Warning: Timeout reached. Possible issue with page load or missing script.   
        // https://github.com/philipwalton/html-inspector
        // 'html-inspector': {            
        //     all: {
        //         src: ['_site/**/*.{html,htm}']
        //     }
        // },

        // watch for file changes
        watch : {
            options: {
              // prevent cpu overload resulting in "killed"
              // also try running:
              // $ killall -9 node                 
              interval: 5007,
              spawn:false
            },
            // js source files
            js: {
                
                files: ['source/scripts/**/*.js'],
                tasks: ['jshint', 'requirejs:dev']
            },
            // sprite files
            sprite: {
                 files: ['source/images/sprites/*.png'],
                 tasks: ['sprite', 'sass:dev', 'imagemin']
            },
            // sass files
            sass: {
                files: ['source/styles/**/*.scss'],
                tasks: ['sass:dev']
            },
            // optimize images
            imagemin: {
                files: ['source/images/*.{png,jpg,gif}'],
                tasks: ['imagemin']
            }
            // inspect html
            // 'html-inspector': {
            //     files: ['_site/**/*.{html,htm}'],
            //     tasks: ['html-inspector']
            // }       
        },

        // run dev server at http://localhost:4000/
        jekyll: {                       
            serve: {  
                options: {
                    src: '.',
                    dest: './_site',
                    watch: true,
                    serve: true
                }                    
            }
        }
    });
    
    // dev tasks
    grunt.registerTask('build:dev', [
        'jshint',
        'copy:requirejs',
        //'copy:normalize',
        'requirejs:dev',
        'sprite',
        'sass:dev',
        'imagemin',
        'watch'        
    ]);

    // dist tasks
    grunt.registerTask('build:dist', [
        'jshint',
        'copy:requirejs',
        'copy:normalize',
        'requirejs:dist',
        'sprite',
        'sass:dist',
        'imagemin',    
    ]);

    grunt.registerTask('serve', [
        'jekyll:serve'     
    ]);

    // Default task(s).
    grunt.registerTask('default', ['build:dev']);
};
