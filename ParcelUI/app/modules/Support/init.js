// define module
angular.module('Support', ['ui.router.state', 'ui.bootstrap', 'colorpicker.module']);

// routers
angular.module('Support').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/Support/views/';
        $stateProvider.state('Support', {
            url: '/Support',
            templateUrl: baseViewsFolder + 'Support.html'
        });
    }
]);