// define module
angular.module('PortfolioCreation', ['ngFileUpload', 'ui.router.state', 'ui.multiselect']);

// routers
angular.module('PortfolioCreation').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/PortfolioCreation');
        $urlRouterProvider.when('/PortfolioCreation', '/PortfolioCreation/ProjectInformation');


        $stateProvider.state('PortfolioCreation', {
            'url': '/PortfolioCreation',
            //  abstract: true,
            'controller': 'PortfolioCreationCtrl as portfolio',
            'templateUrl': 'app/modules/PortfolioCreation/views/PortfolioCreation.html',
			'data': {
				pageTitle : "New Portfolio / PARCEL"
			}
        }).
        state('PortfolioCreation.ProjectInformation', {
            'url': '/ProjectInformation',
            'templateUrl': 'app/modules/PortfolioCreation/views/portfolio.ProjectInformation.html'
                // ,'controller': 'PortProjectInformation as policyparam'
        }).
        state('PortfolioCreation.ReportInformation', {
            'url': '/ReportInformation',
            'templateUrl': 'app/modules/PortfolioCreation/views/portfolio.ReportInformation.html'
                // ,'controller': 'PortProjectInformation as policyparam'
        }).
        state('PortfolioCreation.FeeInformation', {
            'url': '/FeeInformation',
            'templateUrl': 'app/modules/PortfolioCreation/views/portfolio.FeeInformation.html'
                // ,'controller': 'PortProjectInformation as policyparam'
        }).
        state('PortfolioCreation.GrantAccess', {
            'url': '/GrantAccess',
            'templateUrl': 'app/modules/PortfolioCreation/views/portfolio.GrantAccess.html'
                // ,'controller': 'PortProjectInformation as policyparam'
        }).
        state('PortfolioCreation.Email', {
            'url': '/Email',
            'templateUrl': 'app/modules/PortfolioCreation/views/portfolio.Email.html'
                // ,'controller': 'PortProjectInformation as policyparam'
        }).
        state('PortfolioCreation.ConfirmProjectInfo', {
            url: '/ConfirmProjectInformation',
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.ConfirmProjectInfo.html'
        }).
        state('PortfolioCreation.Attachments', {
            url: '/Attachments',
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.Attachments.html'
                // , 'controller': 'portfolioAttachmentCtrl as portfolioAttachments'
        }).
        state('PortfolioCreation.UploadSiteSpreadSheet', {
            url: '/UploadSites',
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.PropertyUpload.html'
        }).
        state('PortfolioCreation.AddLocation', {
            url: '/AddLocation',
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.AddLocation.html'
        }).
        state('PortfolioCreation.UploadedSitesReportSelection', {
            url: '/UploadedSitesReportSelection',
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.UploadedSitesReportSelection.html'
        }).
        state('PortfolioCreation.SetupSuccess', {
            url: '/SetupSuccess',
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.successmessage.html'
        }).
        state('PortfolioCreation.UploadedSiteDetails', {
                url: '/UploadedSiteDetails',
                templateUrl: 'app/modules/PortfolioCreation/views/portfolio.UploadedSiteDetails.html'
            })
            .
        state('PortfolioCreation.AddReport', {
            url: '/AddReport',
            templateUrl: 'app/modules/PortfolioCreation/views/AddReport.html'
        })
    }
]);
