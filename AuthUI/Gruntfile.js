module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        html2js: {
            dist: {
                src: ['modules/accManagement/views/*.html',
                    'modules/auth/views/*.html',
                    'modules/resetPassword/views/*.html',
                    ],
    dest: 'tmp/templates.js'
            }
        },

        clean: {
            temp: {
                src: ['tmp']
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['AuthUI/scripts/app.js',
                    
                    'AuthUI/scripts/app.urlResources.js',


                    'tmp/*.js',
                   

                    
                    
					



                    'modules/accManagement/*.js',
                    
                    'modules/accManagement/controllers/*.js',
                    'modules/accManagement/directives/*.js',
                    'modules/accManagement/services/*.js',
                    'modules/accManagement/utilities/*.js',
                    

                 

                    'modules/auth/*.js',
                     'modules/auth/controllers/*.js',
                     'modules/auth/directives/*.js',
                     'modules/auth/services/*.js',
                     'modules/auth/utilities/*.js',

                    'modules/resetPassword/*.js',
                    'modules/resetPassword/controllers/*.js',
                    'modules/resetPassword/services/*.js',
                    'modules/resetPassword/utilities/*.js',

                   

                   

                    

                    /*'app/modules/TableOfContentsSetup/*.js',
                     'app/modules/TableOfContentsSetup/controllers/*.js',*/

                    /*'app/modules/TransmittalLetterSetup/*.js',
                     'app/modules/TransmittalLetterSetup/controllers/*.js'   */

                    
                ],

                dest: 'dist/app.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/app.js': ['dist/app.js']
                },
                options: {
                    mangle: false
                }
            }
        },



        /*watch: {
         prod : {
         files: ['Gruntfile.js',
         'app/app.js',
         'app/modules/Bidding/!*.js',
         'app/modules/DefaultLanguageLibrary/!*.js',
         'app/modules/LandingPage/!*.js',
         'app/modules/LenderPortfolioCreation/!*.js',
         'app/modules/LenderProjectCreation/!*.js',
         'app/modules/OrderPlacedOnEDR/!*.js',
         'app/modules/PortfolioCreation/!*.js',
         'app/modules/ProjectCreation/!*.js',
         'app/modules/ProjectDashboard/!*.js',
         'app/modules/ReportAuthoring/!*.js',
         'app/modules/ReportOutput/!*.js',
         'app/modules/ReportSetup/!*.js',
         'app/modules/ReportTemplates/!*.js',
         'app/modules/TableOfContentsSetup/!*.js',
         'app/modules/TransmittalLetterSetup/!*.js',
         '*.html'],
         tasks: ['html2js:dist', 'concat:dist', 'clean:temp', 'uglify:dist'],
         options: {
         atBegin: true
         }
         },
         dev : {
         files : ['Gruntfile.js', 'app/app.js',
         'app/modules/Bidding/!*.js',
         'app/modules/DefaultLanguageLibrary/!*.js',
         'app/modules/LandingPage/!*.js',
         'app/modules/LenderPortfolioCreation/!*.js',
         'app/modules/LenderProjectCreation/!*.js',
         'app/modules/OrderPlacedOnEDR/!*.js',
         'app/modules/PortfolioCreation/!*.js',
         'app/modules/ProjectCreation/!*.js',
         'app/modules/ProjectDashboard/!*.js',
         'app/modules/ReportAuthoring/!*.js',
         'app/modules/ReportOutput/!*.js',
         'app/modules/ReportSetup/!*.js',
         'app/modules/ReportTemplates/!*.js',
         'app/modules/TableOfContentsSetup/!*.js',
         'app/modules/TransmittalLetterSetup/!*.js',
         '*.html'],
         tasks: ['html2js:dist', 'concat:dist', 'clean:temp'],
         options: {
         atBegin: true
         }
         }


         }*/


    });

    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* grunt.loadNpmTasks('grunt-contrib-watch');*/


    //grunt.registerTask('dev', ['watch:dev']);
    //grunt.registerTask('prod', ['watch:prod']);

    grunt.registerTask('dev', ['html2js','concat','clean']);
    grunt.registerTask('prod', ['html2js','concat','clean','uglify']);

}
