// define module
angular.module('ProjectDashboard', ['ui.router.state', 'ui.bootstrap', 'ui.select2', 'angularResizable']);

// routers

angular.module('ProjectDashboard').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $urlRouterProvider.when('/Portfolio', '/Portfolio/Select?accountGuid&companyGuid');
        $stateProvider.state('projectDashboard', {
                'url': '/projectDashboard?projectGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/projectDashboard.html',
                'controller': 'ProjectDashboardController as projectDashboard',
                'data': {
                    pageTitle: "Project Dashboard / PARCEL"
                }


            }).state('addProjectReport', {
                'url': '/addProjectReport?projectGuid&prevState&reportGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/addPropertyReport.html',
                'controller': 'AddReport as addReport',
                params: {
                    reportGuid: null,
                },
                'resolve': {
                    companyDataForAddingReports: ['$stateParams', 'projectDashboardOperations', 'AuthFactory',
                                function ($stateParams, projectDashboardOperations, AuthFactory) {
                            var userGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
                            var companyGuid = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');
                            return projectDashboardOperations.getDataForAddingReports(companyGuid, userGuid).
                            then(function (result) {
                                return result;
                            })

                    }]
                }

            }).state('grantAccess', {
                'url': '/grantAccess?projectGuid&prevState',
                'templateUrl': 'app/modules/ProjectDashboard/views/grantAccess.html',
                'controller': 'GrantAccess as grantAccess',
                'resolve': {
                    projectsList: ['$stateParams', 'projectDashboardOperations',
                                function ($stateParams, projectDashboardOperations) {

                            return projectDashboardOperations.getProjectListData().
                            then(function (result) {
                                return result;
                            })

                    }]
                }

            }).state('sendEmail', {
                'url': '/sendEmail?projectGuid&accountGuid&companyGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/sendEmail.html',
                'controller': 'SendEmail as sendEmail'


            }).state('projectMap', {
                'url': '/projectMap?projectGuid&accountGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/projectMap.html',
                'controller': 'ProjectMap as projectMap',
                'resolve': {
                    dashBoardData: ['$stateParams', 'projectDashboardOperations',
                                function ($stateParams, projectDashboardOperations) {
                            return projectDashboardOperations.getData($stateParams.projectGuid, $stateParams.accountGuid).
                            then(function (result) {
                                return result;
                            })
                    }]

                }
            }).state('showTOC', {
                'url': '/TOC?reportGuid&reportType',
                'templateUrl': 'app/modules/ProjectDashboard/views/dashboardTOC.html',
                'controller': 'DashoboardTOC as dashboardTOC'

            }).state('orderStatus', {
                'url': '/orderStatus?projectGuid&accountGuid&projectName',
                'templateUrl': 'app/modules/ProjectDashboard/views/orderStatus.html'

            }).state('appendixFileList', {
                'url': '/appendixFileList?reportGuid&sectionGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/appendixFileList.html',
                'controller': 'AppendixList as appendixList'
            }).state('portfolioSignatureTool', {
                'url': '/portfolioSignatureTool?projectGuid&accountGuid&companyGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/portfolioSignatureTool.html',
                'controller': 'PortfolioSignatureTool as portfolioSignatureTool'
            })
            .state('Portfolio', {
                'url': '/Portfolio',
                'abstract': true,
                'templateUrl': 'app/modules/ProjectDashboard/views/portfolio.navigation.html',
                'controller': 'PortfolioNavigation as portfolioNavigation',
                'resolve': {
                    accountGuid: ['$location', function ($location) {
                        var accountGuid = $location.search().accountGuid;
                        return accountGuid;
                }],
                    companyGuid: ['$location', function ($location) {
                        var companyGuid = $location.search().companyGuid;
                        return companyGuid;
                }],
                    projectGuid: ['$location', function ($location) {
                        var projectGuid = $location.search().projectGuid;
                        return projectGuid;

                }],
                    localStorageObject: ['projectDashboardOperations', function (projectDashboardOperations) {
                        if (localStorage.getItem('portfolioLocalStorageArray') == null || localStorage.getItem('portfolioLocalStorageArray') == undefined) {
                            return projectDashboardOperations.getLocalStorageObject().then(function (result) {
                                localStorage.setItem('portfolioLocalStorageArray',
                                    JSON.stringify(result.data));
                                return result.data;
                            })
                        } else {
                            return JSON.parse(localStorage.getItem('portfolioLocalStorageArray'));
                        }
                }]

                }
            }).state('Portfolio.Select', {
                'url': '/Select?projectGuid&accountGuid&companyGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/portfolio.steps.html',
                'controller': 'Portfolio as portfolio'
            }).state('Portfolio.SelectReports', {
                'url': '/Select/Reports?projectGuid&accountGuid&companyGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/portfolio.steps.html',
                'controller': 'Portfolio as portfolio'
            }).state('Portfolio.SelectReportsParts', {
                'url': '/Select/ReportsParts?projectGuid&accountGuid&companyGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/portfolio.steps.html',
                'controller': 'Portfolio as portfolio'
            }).state('Portfolio.Confirm', {
                'url': '/Confirm?projectGuid&accountGuid&companyGuid',
                'templateUrl': 'app/modules/ProjectDashboard/views/portfolio.steps.html',
                'controller': 'Portfolio as portfolio'
            })

    }
]);

angular.module('ProjectDashboard').run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {


    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, projectDashboardOperations) {

        if (fromState.controller != undefined && fromState.controller != "Portfolio as portfolio" && toState.controller === "Portfolio as portfolio") {
            var portfolioLocalStorageArray = JSON.parse(localStorage.getItem('portfolioLocalStorageArray'));
            if (portfolioLocalStorageArray != null) {
                portfolioLocalStorageArray[0].filterCriteria.value = "";
                portfolioLocalStorageArray[0].project = {};
                portfolioLocalStorageArray[1].selectionIndex.length = 0;
                portfolioLocalStorageArray[2].selectionIndex.length = 0;
                portfolioLocalStorageArray[3].text = "";
                localStorage.setItem('portfolioLocalStorageArray',
                    JSON.stringify(portfolioLocalStorageArray));
            }


        }

    });

}]);