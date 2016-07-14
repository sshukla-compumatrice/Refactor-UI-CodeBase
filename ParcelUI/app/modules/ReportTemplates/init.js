
// define module
var reportTemplatesModule = angular.module('ReportTemplates', ['ui.router.state', 'ui.bootstrap']);

// routers
reportTemplatesModule.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
         $stateProvider.state('templateDefaults', {
                'url': '/TemplateDefaults?companyGuid',               
                'templateUrl': 'app/modules/ReportTemplates/views/defaultTemplateSettings.html'
            })
       .state('editTemplate', {
            //'url': '/Templates/Edit/:SelectedTemplateID/:companyID',
            'url': '/Templates/Edit?templateGuid&companyGuid',
            'templateUrl': 'app/modules/ReportTemplates/views/editTemplate.html'

        })
    }
]);

reportTemplatesModule.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
