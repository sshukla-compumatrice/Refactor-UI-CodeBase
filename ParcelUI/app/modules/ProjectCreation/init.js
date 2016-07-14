// define module
angular.module('ProjectCreation', ['ngFileUpload', 'ui.router.state', 'ui.bootstrap', 'countrySelect']);

// routers
angular.module('ProjectCreation').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('quickCreateProj', {
            'url': '/QuickProjectSetup',
            'controller': 'FormCtrl as main',
            'templateUrl': 'app/modules/ProjectCreation/views/form.html',
			'data': {
				pageTitle : "New Single Site Project / PARCEL"
			}
        });
        $stateProvider.state('projectSearch', {
            'url': '/projectSearch',
            'controller': 'ProjectSearchCtrl as ProjectSearchCtrl',
            'templateUrl': 'app/modules/ProjectCreation/views/ProjectSearch.html',
			'data': {
				pageTitle : "Project Management / PARCEL"
			}
        });
       
    }
]);
