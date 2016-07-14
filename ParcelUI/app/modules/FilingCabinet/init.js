// define module
angular.module('FilingCabinet', ['ui.router.state', 'ui.bootstrap', 'colorpicker.module']);

// routers
angular.module('FilingCabinet').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/FilingCabinet/views/';
        $stateProvider.state('filingCabinet', {
            url: '/filingCabinet',
            templateUrl: baseViewsFolder + 'FilingCabinet.html',
			'data': {
					pageTitle : "Filing Cabinet / PARCEL"
				}
        }),
        $stateProvider.state('relatedLinks', {
            url: '/companyProfile/links',
            templateUrl: baseViewsFolder + 'RelatedLinks.html',
			'data': {
					pageTitle : "Links / PARCEL"
				}
        });
    }
                                        
]);