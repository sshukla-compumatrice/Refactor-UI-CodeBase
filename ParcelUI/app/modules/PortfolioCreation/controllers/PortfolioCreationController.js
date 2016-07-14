angular.module('PortfolioCreation').controller('PortfolioCreationCtrl', ['$scope', '$rootScope', 'ProjectStartupAPI', '$state', 'PortfolioCreationStateNavigation', 'BASEURL', 'ParcelUI.Resources', 'globalValues', function ($scope, $rootScope, ProjectStartupAPI, $state, PortfolioCreationStateNavigation, BASEURL, ParcelUI_Resources, globalValues) {

    $scope.nextButtonText = "Next";

    var self = this;
    self.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;

    var companyId = globalValues.currentUserCompanyGuid;
    var userId = globalValues.currentUserGuid;

    self.stateNavigation = PortfolioCreationStateNavigation;

    self.serviceResponseAlert = false;
    self.serviceResponseText = "";
    self.responseType = 'info'; //warning, info, success, danger
    self.closeWarning = function () {
        self.serviceResponseAlert = false;
    }
    self.showServiceError = function (errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }
    self.clearErrorDisplay = function () {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    self.getServiceReponseAlertClass = function () {
        return 'alert-' + self.responseType;
    }

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

    self.loadData.grantAccessGrps = [];
    self.loadData.accessParties = [];

    self.addSiteMethodTypes = {
        manual: 'manual',
        upload: 'upload'
    };

    self.addSiteMethod = self.addSiteMethodTypes.manual;

    var userId = globalValues.currentUserGuid;
    // var userDetailsArray = JSON.parse(localStorage.getItem("userdetails"));
    var userDetails = JSON.parse(localStorage.getItem('userdetails'));

    if (userDetails) {
        var userName;
        for (var i = 0; i < userDetails.length; i++) {

            if (userDetails[i].key === "EFF_USERGUID") {
                self.loadData.currentUser.userGuid = userDetails[i].value;
            }
            if (userDetails[i].key === "EFF_COMPANYNAME") {
                self.loadData.currentUser.companyName = userDetails[i].value;
            }
            if (userDetails[i].key === "EFF_COMPANYGUID") {
                self.loadData.currentUser.companyGuid = userDetails[i].value;
            }
            if (userDetails[i].key === "EFF_DISPLAYNAME") {
                self.loadData.currentUser.userName = userDetails[i].value;

            }
            if (userDetails[i].key === "EFF_EMAIL") {
                self.loadData.currentUser.email = userDetails[i].value;

            }

        }
    }

    var companyOption = {
        name: 'Everyone in the ' + self.loadData.currentUser.companyName + ' company',
        accessType: "COMPANY",
        companyGUID: self.loadData.currentUser.companyGuid
    };
    /* ProjectStartupAPI.getAccountUser(userId).then(function (userResult) {
         self.loadData.currentUser = userResult.users[0];

         var companyOption = {
             name: 'Everyone in the ' + self.loadData.currentUser.companyName + ' company',
             accessType: "COMPANY",
             companyGUID: self.loadData.currentUser.companyGUID
         };

         //self.loadData.grantAccessGrps.push(companyOption);
     });*/


    loadData(companyId);

    function loadData(companyId) {

        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = ProjectStartupAPI.getInfo(companyId, userId).then(function (result) {
            // simple parse
            self.loadData.transactionTypes = result.transactionTypes;
            self.loadData.propertyTypes = result.propertyTypes;

            self.loadData.templates = sortJSON(result.templates, 'name', 'ASC');
            self.loadData.libraries = result.libraries;

            self.loadData.teams = result.teams;
            self.loadData.offices = result.offices;
            self.loadData.relatedCompanies = result.relatedCompanies;

            // parse access to options



            if (result.relatedCompanies && result.relatedCompanies.length) {
                for (var i = 0; i < result.relatedCompanies.length; i++) {
                    var relatedCompany = result.relatedCompanies[i];
                    // only accept related companies with function as 'Client'
                    if (!relatedCompany.functions || relatedCompany.functions.indexOf('Client') < 0) continue;

                    var grp = {
                        name: 'Everyone in the ' + relatedCompany.name + ' company',
                        companyGUID: relatedCompany.companyGUID,
                        accessType: 'COMPANY'
                    }
                    self.loadData.grantAccessGrps.push(grp);
                }
            }

            if (result.offices && result.offices.length) {
                for (var i = 0; i < result.offices.length; i++) {
                    var office = result.offices[i];
                    var grp = {
                        name: 'Everyone in the ' + office.officeName + ' office',
                        officeGUID: office.companyOfficeGUID,
                        accessType: 'OFFICE'
                    }
                    self.loadData.grantAccessGrps.push(grp);
                }
            }

            if (result.teams && result.teams.length) {
                for (var i = 0; i < result.teams.length; i++) {
                    var team = result.teams[i];
                    var grp = {
                        name: 'Everyone in the ' + team.name + ' team',
                        teamGUID: team.teamGUID,
                        accessType: 'TEAM'
                    }
                    self.loadData.grantAccessGrps.push(grp);
                }
            }

            var userOption = {
                name: 'Yourself only',
                accessType: "USER",
                userGUID: userId
            };

            self.loadData.grantAccessGrps.push(userOption);


        });
    }


    function sortJSON(data, key, sort) {
        return data.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            if (sort === 'ASC') {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }
            if (sort === 'DESC') {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
        });
    }
    self.filterCompanyBy = function (company, fnName) {
        return company && company.functions && company.functions.indexOf(fnName) >= 0;
    }

    self.filterByContains = function (prop, val) {
        return function (item) {
            return item[prop].indexOf(val) >= 0;
        }
    }

    self.currentSection = '';
    self.sectionCollection = {
        projectInformation: "ProjectInformation",
        reportInformation: "ReportInformation",
        feeInformation: "FeeInformation",
        attachDocuments: "AttachDocuments",
        grantAccess: "GrantAccess",
        confirmProjectInformation: "ConfirmProjectInformation",
        emailProjectInformation: "EmailProjectInformation"
    };


    // this is called on Submit

    // to be overridden by child state controllers to set data
    self.getSubmitData = function () {}
    self.getProjectData = function () {
        return self.getSubmitData();
    }

    self.setResponseProjectData = function (projectData) {

            self.project = projectData;
            self.clearErrorDisplay();
        }
        /* self.submitData = function(myform) {
             if (myform && myform.$invalid) return;

             var submitData = self.getSubmitData();

             if (!submitData) return;

             var currentProject = self.project;
             if (self.currentSection == self.sectionCollection.projectInformation && !currentProject) {
                 PortfolioCreationAPI.post(companyId, submitData).then(function(responseData) {
                     self.project = responseData;
                 });
             } else {
                 // this is only for mock 
                 // TODO: delete below line when working with real service implementation
                 var projectID = submitData.projectID || 1;
                 PortfolioCreationAPI.put(projectID, submitData).then(function(data) {
                     self.project = data;
                 });
             }
         }*/

}]);
