angular.module('LenderPortfolioCreation').controller('LenderPortfolioCreationCtrl', ['$scope', 'ProjectStartupAPI', 'LenderPortfolioCreationStateNavigation','BASEURL', 'globalValues', function ($scope, ProjectStartupAPI, LenderPortfolioCreationStateNavigation,BASEURL, globalValues) {

    var self = this;

    $scope.nextButtonText = "Next";
    self.stateNavigation = LenderPortfolioCreationStateNavigation;
    
    var companyId = globalValues.currentUserCompanyGuid;
    self.addSiteMethodTypes = {
        manual: 'manual',
        upload: 'upload'
    };
    self.addSiteMethod = self.addSiteMethodTypes.manual;
    
    self.loadData = {
        // obj definitions below
        //template -> {
        //"templateID" : 1,
        //    "reportType" : "PhaseI",
        //    "name" : "AAI/05 Phase I Template",
        //    "ownerCompanyID":1218,
        //    "shortName":"AAI/05",
        //    "description":"A template that I made one day.",
        //    "isMobile":0,
        //    "templateVersion":27
        //}
        //library -> {
        //    "libraryID":129,
        //    "name":"JP Morgan Phase I Language",
        //    "reportType":"PhaseI",
        //    "ownerCompanyID":1218,
        //    "description":"The default language to use for JP Morgan jobs.",
        //    "isMobile":0
        //}
        //reportTypes -> {
        //    title: '',
        //    templates: [],
        //    libraries: []
        //}
        reportTypes: [],
        transactionTypes: {}, // string array
        propertyTypes: {}, // string array
        accessTo: {
            organizationOptions: [],
            clientOptions: [],
            thirdPartyOptions: []
        },
        currentUser: {
            email: 'self@employer.com'
        }
    };
    function loadData(companyId) {
        ProjectStartupAPI.getInfo(companyId).then(function(result) {
            // simple parse
            self.loadData.transactionTypes = result.transactionTypes;
            self.loadData.propertyTypes = result.propertyTypes;

            self.loadData.templates = result.templates;
            self.loadData.libraries = result.libraries;

            self.loadData.teams = result.teams;
            self.loadData.offices = result.offices;
            self.loadData.relatedCompanies = result.relatedCompanies;

            // parse access to options
            self.loadData.grantAccessGrps = [];
            for (var i = 0; i < result.relatedCompanies.length; i++) {
                var relatedCompany = result.relatedCompanies[i];
                // only accept related companies with function as 'Client'
                if (!relatedCompany.functions || relatedCompany.functions.indexOf('Client') < 0) continue;

                var grp = {
                    name: relatedCompany.name,
                    companyID: relatedCompany.companyID,
                    accessType: 'company'
                }
                self.loadData.grantAccessGrps.push(grp);
            }
            for (var i = 0; i < result.offices.length; i++) {
                var office = result.offices[i];
                var grp = {
                    name: office.name,
                    officeID: office.officeID,
                    accessType: 'office'
                }
                self.loadData.grantAccessGrps.push(grp);
            }
            for (var i = 0; i < result.teams.length; i++) {
                var team = result.teams[i];
                var grp = {
                    name: team.name,
                    teamID: team.teamID,
                    accessType: 'team'
                }
                self.loadData.grantAccessGrps.push(grp);
            }

        });
    }
    loadData(companyId);
    
    self.filterByContains = function(prop, val) {
        return function(item) {
            return item[prop].indexOf(val) >= 0;
        }
    }
    self.filterCompanyBy = function(company, fnName) {
        return company && company.functions && company.functions.indexOf(fnName) >= 0;
    }
    
    // this is called on Submit
    // to be overridden by child state controllers to set data
    self.getSubmitData = function() {}
    self.getProjectData = function() {
        return self.getSubmitData();
    }
   
    self.setResponseProjectData = function(projectData) {
        self.project = projectData;
    }
    
    self.serviceResponseAlert = false;
    self.serviceResponseText = "";
    self.responseType = 'info'; //warning, info, success, danger
    self.closeWarning = function() {
        self.serviceResponseAlert = false;
    }
    self.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }
    self.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
	
}]);