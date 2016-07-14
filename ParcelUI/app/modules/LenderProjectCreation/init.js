// define module
angular.module('LenderProjectCreation', ['ngFileUpload', 'ui.router.state', 'ui.bootstrap']);

// routers
angular.module('LenderProjectCreation').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('quickCreateLenderProj', {
            'url': '/QuickLenderProjectSetup',
            'controller': 'LenderFormCtrl as main',
            'templateUrl': 'app/modules/LenderProjectCreation/views/lender_form.html',
            'resolve': {
                'synchronousObj': ['FetchDataFactory',
                    function (fetchData_svc) {

                        return fetchData_svc.getPreFormRenderData();
                    }
                ]

            }
        })
    }
]);