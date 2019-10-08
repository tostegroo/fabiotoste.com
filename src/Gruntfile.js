module.exports = function(grunt) 
{
    grunt.template.addDelimiters('handlebars-like-delimiters', '{{', '}}');
    
    var grunt_config = 
    {
        pkg : grunt.file.readJSON('package.json'),

        watch: 
        {
            compass: 
            {
                files: ['./sass/**/*.{scss,sass}'],
                tasks: ['compass:dev']
            },
            js: 
            {
                files: ['./js/**/*.js'],
                tasks: ['concat:dev']
            }
        },

        compass: 
        {
            options: 
            {
                require: ['sass-globbing', 'compass-h5bp', 'ceaser-easing'],
                outputStyle: 'compressed',
                noLineComments: true,
                sassDir: ['./sass'],
                cssDir: ['../public/css'],
                environment: 'production'
            },

            dev:
            {
                options: 
                {
                    outputStyle: 'compact',
                    environment: 'development'
                }
            },
            dist:
            {
                options: 
                {
                    outputStyle: 'compressed',
                    environment: 'production'
                }
            }
        },

        concat: 
        {
            options: 
            {
                separator: ';',
            },

            dist:
            {
                src: [
                    './js/libs/**/*.js',
                    './js/plugins/*.js',
                    './js/controllers/*.js',
                    './js/*.js',
                    './js/views/*.js'
                ],
                dest: './temp.js',
            },
            dev:
            {
                src: [
                    './js/libs/**/*.js',
                    './js/plugins/*.js',
                    './js/controllers/*.js',
                    './js/*.js',
                    './js/views/*.js'
                ],
                dest: '../public/js/scripts.js'
            }
        },

        uglify:
        {
            all: 
            {
                files: 
                {   
                    '../public/js/scripts.js' : ['./temp.js']
                }
            }
        }
    };

    grunt.initConfig(grunt_config);

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('dev', ['compass:dev' , 'concat:dev', 'watch']);
    grunt.registerTask('prod', ['compass:dist' , 'concat:dist', 'uglify']);
};
