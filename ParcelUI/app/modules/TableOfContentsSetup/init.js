// define module
angular.module('TOCSetup', ['ui.router.state', 'ui.bootstrap', 'colorpicker.module']);

// routers
angular.module('TOCSetup').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/TableOfContentsSetup/views/';
        $stateProvider.state('tocSetup', {
            url: '/TOCSetup',
            templateUrl: baseViewsFolder + 'TOCSetupForm.html',
			'data': {
					pageTitle : "Table of Contents Setup / PARCEL"
				}
        });
    }
]);