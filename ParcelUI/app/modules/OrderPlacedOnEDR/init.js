// define module
angular.module('OrderPlacedOnEDR', ['ui.router.state', 'ui.bootstrap']);

// routers
angular.module('OrderPlacedOnEDR').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('orderPlacedOnEDR', {
            'url': '/OrderPlacedOnEDR',            
            'templateUrl': 'app/modules/OrderPlacedOnEDR/views/Order-placed.html',
			'data': {
				pageTitle : "Order placed on the EDR website / PARCEL"
			},
            'resolve': {
                'synchronousObj': ['FetchDataFactory',
                    function(fetchData_svc) {

                        return fetchData_svc.getPreFormRenderData();
                    }
                ]

            }
        })
    }
]);