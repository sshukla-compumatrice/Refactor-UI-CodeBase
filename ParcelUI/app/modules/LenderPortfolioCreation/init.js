// define module
angular.module('LenderPortfolioCreation', ['ui.router.state', 'ui.multiselect']);

// routers
angular.module('LenderPortfolioCreation').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/LenderPortfolioCreation');
        $urlRouterProvider.when('/LenderPortfolioCreation', '/LenderPortfolioCreation/ProjectInformation');

        var baseViewsFolder = 'app/modules/LenderPortfolioCreation/views/';
        $stateProvider.state('LenderPortfolioCreation', {
            url: '/LenderPortfolioCreation',
            templateUrl: baseViewsFolder + 'LenderPortfolioCreation.html',
            controller: 'LenderPortfolioCreationCtrl as lenderPortfolio',
            abstract: true
        })
        .state('LenderPortfolioCreation.ProjectInformation', {
            url: '/ProjectInformation',
            templateUrl: baseViewsFolder + 'lenderportfolio.ProjectInformation.html'
        })
        .state('LenderPortfolioCreation.ReportInformation', {
            url: '/ReportInformation',
            templateUrl: baseViewsFolder + 'lenderportfolio.ReportInformation.html'
        })
        .state('LenderPortfolioCreation.UploadSiteSpreadSheet', {
            url: '/UploadSites',
            templateUrl: baseViewsFolder + 'lenderportfolio.UploadSites.html'
        })
        .state('LenderPortfolioCreation.UploadedSiteDetails', {
            url: '/UploadedSiteDetails',
            templateUrl: baseViewsFolder + 'lenderportfolio.UploadedSiteDetails.html'
        })
        .state('LenderPortfolioCreation.AddLocation', {
            url: '/AddLocation',
            templateUrl: baseViewsFolder + 'lenderportfolio.AddLocation.html'
        })
        .state('LenderPortfolioCreation.UploadedSitesReportSelection', {
            url: '/UploadedSitesReportSelection',
            templateUrl: baseViewsFolder + 'lenderportfolio.UploadedSitesReportSelection.html'
        })
        .state('LenderPortfolioCreation.SelectEnvironmentalConsultant', {
            url: '/SelectEnvironmentalConsultant',
            templateUrl: baseViewsFolder + 'lenderportfolio.SelectEnvConsultant.html'
        })
        .state('LenderPortfolioCreation.SelectConsultantWithFee', {
            url: '/SelectConsultantWithFee',
            templateUrl: baseViewsFolder + 'lenderportfolio.SelectConsultantWithFee.html'
        })
        .state('LenderPortfolioCreation.Attachments', {
            url: '/Attachments',
            templateUrl: baseViewsFolder + 'lenderportfolio.Attachments.html'
        })
        .state('LenderPortfolioCreation.GrantAccess', {
            url: '/GrantAccess',
            templateUrl: baseViewsFolder + 'lenderportfolio.GrantAccess.html'
        })
        .state('LenderPortfolioCreation.ConfirmProjectInfo', {
            url: '/ConfirmProjectInformation',            
            templateUrl: baseViewsFolder + 'lenderportfolio.ConfirmProjectInfo.html'
        })
        .state('LenderPortfolioCreation.Success', {
            url: '/Success',
            templateUrl: baseViewsFolder + 'lenderportfolio.successmessage.html'
        });
    }
]);