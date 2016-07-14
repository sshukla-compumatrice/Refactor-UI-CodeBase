// define module
var reportAuthoringModule = angular.module('ReportAuthoring', ['ui.router.state', 'ui.bootstrap', 'ui.tinymce', 'xeditable', 'angularFileUpload', 'ui.sortable', 'ngSanitize', 'ngFileUpload']);

// routers
reportAuthoringModule.config(['$stateProvider', '$urlRouterProvider', 'AppendixTools',
    function ($stateProvider, $urlRouterProvider, AppendixTools) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/ReportAuthoring/views/';

        $stateProvider.state('edrPortfolioOrder', {
                url: '/EDRPortfolioOrder?projectGuid',
                templateUrl: baseViewsFolder + 'edrPortfolioOrder.html',
                controller: "EDRPortfolioOrderController as portfolioOrderController",
                data: {
                    pageTitle: "EDR Portfolio Order"
                },
                resolve: {
                    portfolioData: function ($stateParams, projectDashboardOperations) {
                        return projectDashboardOperations.getProjectReports($stateParams.projectGuid).then(function (response) {
                            return response;
                        });
                    },
                    edrPackages: function (BASEURL, edrOrderAPI, AuthFactory) {
                        var companyGuid = AuthFactory.getUserDetailsFromStorage("EFF_COMPANYGUID");
                        return edrOrderAPI.getPortfolioProducts(companyGuid).then(function (resp) {
                            return (resp.portfolioProducts != undefined) ? resp.portfolioProducts : [];
                        });
                    }
                }
            })
            .state('ReportAuthoring', {
                url: '/ReportAuthoring?projectGuid&reportGuid&siteID',
                templateUrl: baseViewsFolder + 'simplifiedReport.html'
            })
            .state('ReportAuthoring.Setup', {
                url: '/Setup',
                templateUrl: baseViewsFolder + 'setup.html'
            })
            .state('ReportAuthoring.Appendices', {
                url: '/Appendices',
                templateUrl: baseViewsFolder + 'appendices.html'
            })
            .state('ReportAuthoring.Sign', {
                url: '/Sign',
                templateUrl: baseViewsFolder + 'sign.html'
            })
            .state('ReportAuthoring.Assemble', {
                url: '/Assemble',
                templateUrl: baseViewsFolder + 'assemble.html'
            })
            .state('ReportAuthoring.Write', {
                url: '/Write?sectionGuid',
                // url: '/Write',
                templateUrl: baseViewsFolder + 'reportWrite.html'
                    //            ,
                    //                resolve: {
                    //
                    //                    reportingObject: function () {
                    //
                    //                        return ['', '']
                    //                    }
                    //                }

            })
            .state('generalInformation', {
                url: '/GeneralInformation?sectionGuid&projectGuid&reportGuid&siteID',
                templateUrl: baseViewsFolder + 'generalInformationForm.html',
                controller: "generalInformationFormController as generalInformationForm",
                data: {
                    pageTitle: "General Information / PARCEL"
                }
            })
            .state('llpQuestionnaire', {
                url: '/llpQuestionnaire',
                templateUrl: AppendixTools["appendixtools/questionnaire"].templateUrl,
                controller: AppendixTools["appendixtools/questionnaire"].controller,
                params: {
                    modalData: {
                        refreshAfter: false
                    }
                }
            })
            .state('adaChecklist', {
                url: '/adaChecklist',
                templateUrl: AppendixTools["appendixtools/addADAChecklist"].templateUrl,
                controller: AppendixTools["appendixtools/addADAChecklist"].controller,
                params: {
                    modalData: {
                        refreshAfter: false
                    }
                }
            })
            .state('ReportAuthoring.CostTable', {
                url: '/RecommendationSummary?SiteId&tableType&packageId&tableId',
                templateUrl: function ($stateParams) {
                    return 'app/modules/ReportAuthoring/directives/costTables/reports/' + $stateParams.tableType + '/' + $stateParams.tableType + 'TableView.html';
                },
                controller: 'CostTablesListController as recommendationSummary',
                'resolve': {
                    tableData: ['$http', '$stateParams', 'ReportAuthoringAPI', function ($http, $stateParams, ReportAuthoringAPI) {

                        return ReportAuthoringAPI.getCostTableData($stateParams.SiteId, $stateParams.packageId, $stateParams.tableId).then(function (result) {
                            console.log("result " + JSON.stringify(result));

                            return result;
                        })

                    }]
                }
            })
            .state('projectDocs', {
                'url': '/projectDocuments?projectGuid&companyGuid',
                'controller': 'ProjectDocumentsController',
                'templateUrl': 'app/modules/ProjectCreation/views/projectDocuments.html'
            })
          .state('portfolioOrderStatus', {
                url: '/portfolioOrderStatus?portfolioOrderGuid&projectName',
                templateUrl: baseViewsFolder + 'portfolioOrderStatus.html',
                controller: "PortfolioOrderStatusController as portfolioOrderStatus",
                data: {
                    pageTitle: "EDR Order Confirmation"
                }
            })
        .state('sendEmailLink', {
                'url': '/sendEmail',
                'templateUrl': 'app/modules/ReportAuthoring/views/emailLink.html',
                'controller': 'EmailLinkController as emailLink'


            })
        }]);
reportAuthoringModule.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
