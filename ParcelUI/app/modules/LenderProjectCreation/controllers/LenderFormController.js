angular.module('LenderProjectCreation').controller('LenderFormCtrl', ['$scope', '$timeout', 'synchronousObj', 'PostDataFactory', '$log', '$location', 'ProjectStartupAPI', '$filter','BASEURL', 'globalValues', function($scope, $timeout, synchronousObj, postData_svc, $log, $location, ProjectStartupAPI, $filter,BASEURL, globalValues) {

    var companyId = globalValues.currentUserCompanyGuid;

    var self = this;

    // self.reports_requestBidsCompanyIDs=[];
    // self.reports_assignConsultantsCompanyID=[];

    self.loadData = {

        reportTypes: [],
        transactionTypes: {}, // string array
        propertyTypes: {}, // string array
        accessTo: {
            organizationOptions: [],
            mortgageBrokerOptions: [],
            thirdPartyOptions: []
        },
        consultants: []
    };

    self.submitData = {
        companyGUID: companyId,
       /* draftDueDate: new Date(),
        finalDueDate: new Date(),*/
        property: {},
        reports: [],
        mortgageBroker: {},
        siteContact: {},

        accessParties: [],
        // helper for accessParties
        accessCollector: {},

        notification: {}
    };

    ProjectStartupAPI.getInfo(companyId).then(function(result) {
        // simple parse
        self.loadData.transactionTypes = result.transactionTypes;
        self.loadData.propertyTypes = result.propertyTypes;


        // parse report types
        for (var i = 0; i < result.templates.length; i++) {
            var template = result.templates[i];

            var reportTypeVal = template.reportType;

            var reportType = null;
            for (var j = 0; j < self.loadData.reportTypes.length; j++) {
                var existing = self.loadData.reportTypes[j];
                if (existing.title == reportTypeVal) {
                    reportType = existing;
                    break;
                }
            }
            if (!reportType) {
                reportType = {
                    title: reportTypeVal,
                    templates: [],
                    libraries: []
                };
                self.loadData.reportTypes.push(reportType);
            }

            reportType.templates.push(template);
        }
        // parse report consultants
        if (result.relatedCompanies && result.relatedCompanies.length) {
            for (var i = 0; i < result.relatedCompanies.length; i++) {
                var related = result.relatedCompanies[i];

                var option = {
                    name: related.name,
                    accessType: "company",
                    companyID: related.companyID

                };

                if (related.functions && related.functions.length > 0 && related.functions.indexOf('Consultant') >= 0) {
                    self.loadData.consultants.push(option);
                }
            }
        }

        if (result.libraries && result.libraries.length) {
            for (var i = 0; i < result.libraries.length; i++) {
                var library = result.libraries[i];
                var reportTypeVal = library.reportType;
                var reportType = null;
                for (var j = 0; j < self.loadData.reportTypes.length; j++) {
                    var existing = self.loadData.reportTypes[j];
                    if (existing.title == reportTypeVal) {
                        reportType = existing;
                        break;
                    }
                }
                if (!reportType) continue;

                reportType.libraries.push(library);
            }
        }

        // parse access to options
        // 1. offices
        if (result.offices && result.offices.length) {
            for (var i = 0; i < result.offices.length; i++) {
                var office = result.offices[i];
                var option = {
                    name: 'Everyone in the ' + office.name + ' office',
                    accessType: "office",
                    officeID: office.officeID
                };
                self.loadData.accessTo.organizationOptions.push(option);
            }
        }
        // 2. teams
        if (result.teams && result.teams.length) {
            for (var i = 0; i < result.teams.length; i++) {
                var team = result.teams[i];
                var option = {
                    name: 'Everyone in the ' + team.name,
                    accessType: "team",
                    teamID: team.teamID
                };
                self.loadData.accessTo.organizationOptions.push(option);
            }
        }
        // 3. relatedCompanies
        if (result.relatedCompanies && result.relatedCompanies.length) {
            for (var i = 0; i < result.relatedCompanies.length; i++) {
                var related = result.relatedCompanies[i];

                var option = {
                    name: related.name,
                    accessType: "company",
                    companyID: related.companyID
                };

                if (related.functions && related.functions.length > 0 && related.functions.indexOf('Client') >= 0) {
                    self.loadData.accessTo.mortgageBrokerOptions.push(option);
                }
            }
        }
    });


    this.countries = ['Albania', 'Andorra',
        'Antarctica', 'Armenia', 'Azerbaijan'
    ];

    $scope.$on('showButtons', function() {

        self.lastDivLoaded = true;
    });

    self.showDisplayMsg = function(msg, type) {
        self.serviceResponseAlert = true;
        self.serviceResponseText = msg;
        self.msgType = 'alert-' + (type || 'danger');
    }

    self.CreateProject = function(form) {
        if (!form || form.$invalid) {
            self.showDisplayMsg('Invalid Form Submission');
            return;
        }


        var userInput = angular.copy(self.submitData);

        self.submitData.property.reports = [];

        for (var r in self.submitData.reports) {
            var val = self.submitData.reports[r];
            if (!val || !val.selected) continue;

            self.submitData.reports[r].bidCompanyIDs = [];

            if (self.submitData.reports[r].bidCompanys != undefined && self.submitData.reports[r].bidCompanys != "" && self.submitData.reports[r].bidCompanys != null) {


                for (var i = 0; i < self.submitData.reports[r].bidCompanys.length; i++) {


                    self.submitData.reports[r].bidCompanyIDs.push(self.submitData.reports[r].bidCompanys[i].companyID);
                }

            }

            console.log("final report content : " + JSON.stringify(self.submitData.reports[r].content));
            delete self.submitData.reports[r].bidCompanys;
            if (self.submitData.reports[r].content == "request") {
                delete self.submitData.reports[r].companyID;
                //self.submitData.reports[r].companyID="";
                self.submitData.reports[r].outToBid = 1;
            } else {
                delete self.submitData.reports[r].bidDeadline; //="";
                delete self.submitData.reports[r].bidCompanyIDs; //=[];
                self.submitData.reports[r].outToBid = 0;
            }
            self.submitData.reports[r].templateID = r;

            self.submitData.property.reports.push(self.submitData.reports[r]);
        }

        self.submitData.accessParties = [];
        for (var p in self.submitData.accessCollector) {
            var accessor = self.submitData.accessCollector[p];
            if (!accessor.selected) continue;

            self.submitData.accessParties.push(accessor.val);
        }

        //        self.submitData.bidCompanyIDs = [];
        //        if (self.reports_requestBidsCompanyIDs != null && self.reports_requestBidsCompanyIDs != undefined && self.reports_requestBidsCompanyIDs != "") {
        //            for (var i = 0; i < self.reports_requestBidsCompanyIDs.length; i++) {
        //                console.log("ccccc: " + JSON.stringify(self.reports_requestBidsCompanyIDs[i]));
        //
        //                self.submitData.bidCompanyIDs.push(self.reports_requestBidsCompanyIDs[i].companyID);
        //            }
        //        }


        self.submitData.property.siteContact = self.submitData.siteContact;
        var postData = angular.copy(self.submitData);
        postData.locations = [];
        postData.locations.push(self.submitData.property);

        if (postData && postData.mortgageBroker) {
            if (postData.mortgageBroker.state && postData.mortgageBroker.state.name) {
                postData.mortgageBroker.state = postData.mortgageBroker.state.name;
            }
            if (postData.mortgageBroker.country && postData.mortgageBroker.country.name) {
                postData.mortgageBroker.country = postData.mortgageBroker.country.name;
            }
        }
        if (postData && postData.locations && postData.locations.length) {
            var site = postData.locations[0];
            if (site.state && site.state.name) {
                site.state = site.state.name;
            }
            if (site.country && site.country.name) {
                site.country = site.country.name;
            }
        }
        
        angular.forEach(postData.locations[0].reports, function(r) {
            delete r.selected;
        });
        
        postData.draftDueDate = $filter('date')(postData.draftDueDate, "yyyy-MM-dd hh:mm:ss");
        postData.finalDueDate = $filter('date')(postData.finalDueDate, "yyyy-MM-dd hh:mm:ss");
        if (postData.notification) {
            if (postData.notification.sendEmailNotification) {
                postData.notification.sendEmailNotification = 1;
            } else {
                postData.notification.sendEmailNotification = 0;
            }
        }

        delete postData.accessCollector;
        delete postData.siteContact;
        delete postData.reports;
        delete postData.property;

        ProjectStartupAPI.postData(companyId, postData).then(function(result) {
            self.showDisplayMsg('Project created successfully', 'success');
            self.submitData = userInput;
        }, function(error) {
            self.showDisplayMsg(error);
            self.submitData = userInput;
        });

    }

    this.cancelCreateProject = function() {
        formControllerLogger.info("cancel button clicked");
        $scope.$broadcast('show-errors-reset');
        $location.path("app/modules/LandingPage/views/CreateProjectMenu.html");
    }



}]);