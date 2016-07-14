// define module
angular.module('TransmittalLetterSetup', ['ui.router.state', 'ui.bootstrap', 'colorpicker.module']);

// routers
angular.module('TransmittalLetterSetup').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/TransmittalLetterSetup/views/';
        $stateProvider.state('transmittalLetterSetup', {
            url: '/TransmittalLetterSetup',
            templateUrl: baseViewsFolder + 'TransmittalLetterSetup.html',
			'data': {
					pageTitle : "Transmittal Letter Setup / PARCEL"
				}
        });
    }
]);