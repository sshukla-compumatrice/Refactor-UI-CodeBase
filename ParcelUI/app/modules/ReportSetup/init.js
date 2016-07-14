// define module
angular.module('ReportSetup', ['ui.router.state', 'ui.bootstrap', 'colorpicker.module']);

// routers
angular.module('ReportSetup').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/ReportSetup/views/';
        $stateProvider.state('reportSetup', {
            url: '/ReportSetup',
            templateUrl: baseViewsFolder + 'ReportSetup.html',
			'data': {
					pageTitle : "Report Setup / PARCEL"
				}
        });
    }
]);