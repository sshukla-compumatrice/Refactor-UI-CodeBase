angular.module('ProjectCreation').controller('FormCtrl', ['$scope', '$timeout', '$log', '$location', 'ProjectStartupAPI', '$state', '$filter', '$anchorScroll', 'BASEURL', 'ParcelUI.Resources', 'globalValues', function ($scope, $timeout, $log, $location, ProjectStartupAPI, $state, $filter, $anchorScroll, BASEURL, ParcelUI_Resources, globalValues) {



    $anchorScroll.yOffset = 70;
    $anchorScroll("");
    var companyId = globalValues.currentUserCompanyGuid;
    var self = this;
    self.loggedUser = {};
    self.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;


    if (!localStorage.getItem('userdetails')) {
        self.loggedUser.userGuid = globalValues.currentUserGuid;
        self.loggedUser.companyGuid = companyId;
    }
    self.loadData = {
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
        }
    };

    self.submitData = {
        companyGUID: companyId,
        /*draftDueDate: new Date(),
        finalDueDate: new Date(),*/
        property: {},
        //{
        //	"templateID": 101,
        //    "libraryID": 102,
        //    "companyID": 153,
        //    "projectNumber": "",
        //    "poNumber": "",
        //    "fee": ""
        //}
        reports: [],
        client: {},
        siteContact: {},
        //{
        //	    "accessType": "company",
        //    "companyID": 102
        //}
        accessParties: [],
        // helper for accessParties
        accessCollector: {},

        notification: {}
    };



    /*

    ProjectStartupAPI.getAccountUser(userId).then(function (userResult) {
        self.loggedUser = userResult.users[0];
        var companyOption = {
            name: 'Everyone in the ' + self.loggedUser.companyName + ' company',
            accessType: "COMPANY",
            companyGUID: self.loggedUser.companyGUID
        };
        self.loadData.accessTo.organizationOptions.push(companyOption);

        self.submitData.accessCollector['organization'] = {
            val: companyOption,
            selected: true
        };
        // self.submitData.accessCollector.push(companyOption);
    });
*/

    var userDetails = JSON.parse(localStorage.getItem('userdetails'));

    if (userDetails) {
        var userName;
        for (var i = 0; i < userDetails.length; i++) {

            if (userDetails[i].key === "EFF_USERGUID") {
                self.loggedUser.userGuid = userDetails[i].value;
            }
            if (userDetails[i].key === "EFF_COMPANYNAME") {
                self.loggedUser.companyName = userDetails[i].value;
            }
            if (userDetails[i].key === "EFF_COMPANYGUID") {
                self.loggedUser.companyGuid = userDetails[i].value;
            }
            if (userDetails[i].key === "EFF_DISPLAYNAME") {
                self.loggedUser.userName = userDetails[i].value;

            }
            if (userDetails[i].key === "EFF_EMAIL") {
                self.loggedUser.email = userDetails[i].value;

            }

        }
    }

    var companyOption = {
        name: 'Everyone in the ' + self.loggedUser.companyName + ' company',
        accessType: "COMPANY",
        companyGUID: self.loggedUser.companyGuid
    };
    self.loadData.accessTo.organizationOptions.push(companyOption);

    self.submitData.accessCollector['organization'] = {
        val: companyOption,
        selected: true
    };

    self.waitingProcessResources.promise = null;
    self.waitingProcessResources.promise = ProjectStartupAPI.getInfo(companyId, self.loggedUser.userGuid).then(function (result) {

        // simple parse
        //  console.log("222222222222222222"+JSON.stringify(result));
        self.loadData.transactionTypes = result.transactionTypes;

        self.loadData.propertyTypes = result.propertyTypes;
        //self.loadData.teams = result.teams;
        //self.loadData.offices = result.offices;
        //self.loadData.relatedCompanies = result.relatedCompanies;


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
                    reportTypeName: template.reportTypeName,
                    templates: [],
                    libraries: []
                };
                self.loadData.reportTypes.push(reportType);
            }

            reportType.templates.push(template);
        }

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

        // parse access to options


        // 1. offices
        if (result.offices && result.offices.length) {
            for (var i = 0; i < result.offices.length; i++) {

                var office = result.offices[i];
                var option = {
                    name: 'Everyone in the ' + office.officeName + ' office',
                    accessType: "OFFICE",
                    officeGUID: office.companyOfficeGUID
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
                    accessType: "TEAM",
                    teamGUID: team.teamGUID
                };
                self.loadData.accessTo.organizationOptions.push(option);
            }
        }


        var userOption = {
            name: 'Yourself only',
            accessType: "USER",
            userGUID: self.loggedUser.userGuid
        };
        self.loadData.accessTo.organizationOptions.push(userOption);

        // 3. relatedCompanies

        //I 
        if (result.relatedCompanies && result.relatedCompanies.length) {
            for (var i = 0; i < result.relatedCompanies.length; i++) {
                var related = result.relatedCompanies[i];

                var option = {
                    name: related.name,
                    accessType: "COMPANY",
                    companyGUID: related.companyGUID
                };

                if (related.functions && related.functions.length > 0 && related.functions.indexOf('Client') >= 0) {
                    self.loadData.accessTo.clientOptions.push(option);
                }

                if (related.functions && related.functions.length > 0 && related.functions.indexOf('Vendor') >= 0) {
                    self.loadData.accessTo.thirdPartyOptions.push(option);
                }
            }
        }



        /*for (var reportTypeIndex = 0; self.loadData.reportTypes.length > reportTypeIndex; reportTypeIndex++) {

            for (var templateIndex = 0; self.loadData.reportTypes[reportTypeIndex].templates.length > templateIndex; templateIndex++) {

                var langlibObj = {
                    languageLibraryGUID: ''
                };
                self.submitData.reports.push(langlibObj);
                for (var reportlibIndex = 0; self.loadData.reportTypes[reportTypeIndex].libraries.length > reportlibIndex; reportlibIndex++) {

                    if (self.loadData.reportTypes[reportTypeIndex].libraries[reportlibIndex].default) {
                      
                        self.submitData.reports[reportTypeIndex].languageLibraryGUID = self.loadData.reportTypes[reportTypeIndex].libraries[reportlibIndex].libraryGUID;
                        break;
                    }
                }
            }
        }
*/




    });




    this.countries = ['Albania', 'Andorra',
        'Antarctica', 'Armenia', 'Azerbaijan'
    ];

    $scope.$on('showButtons', function () {

        self.lastDivLoaded = true;
    });

    self.showDisplayMsg = function (msg, type) {
        self.serviceResponseAlert = true;
        self.serviceResponseText = msg;
        self.msgType = 'alert-' + (type || 'danger');
    }

    function checkIfAnyReportSelected() {
        if (!self.submitData.reports || !self.submitData.reports.length) return false;
        for (var i = 0; i < self.submitData.reports.length; i++) {
            var report = self.submitData.reports[i];
            if (report && report.selected) {
                return true;
            }
        };

        return false;
    }

    function isValidEmailAddress() {
        var returnValue = true;
        if (self.submitData.notification.sendEmailNotification && $("#to").val() == '') {
            var html = '<span id="fieldValidationMsg" class="help-block error-text"></span>';
            $("#divEmailTo").append(html);
            $("#divEmailTo").find('span#fieldValidationMsg').first().html($("#divEmailTo").attr('field-validation') + ' cannot be blank.');
            $("#divEmailTo").find('span#fieldValidationMsg').show();
            $("#divEmailTo").addClass('has-error');
            returnValue = false;
        } else {
            $("#divEmailTo").removeClass('has-error');
            $("#divEmailTo").find('span#fieldValidationMsg').remove();
        }
        return returnValue;
    }
    this.createProject = function (form) {

        self.reportSelectionInvalid = false;
        if (!form || form.$invalid) {
            self.showDisplayMsg(ParcelUI_Resources.formInvalidMessage);
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');


            isValidEmailAddress();
            var reportVal = checkIfAnyReportSelected();
            if (!reportVal) {
                self.reportSelectionInvalid = true;
            }

            $anchorScroll();

            return;
        }
        if (!checkIfAnyReportSelected()) {
            self.showDisplayMsg(ParcelUI_Resources.formInvalidMessage);
            self.reportSelectionInvalid = true;
            isValidEmailAddress();
            $anchorScroll();
            return;
        }

        if (!isValidEmailAddress()) {
            return;
        }
        self.submitData.property.reports = [];
        for (var r in self.submitData.reports) {
            var val = self.submitData.reports[r];
            if (!val.selected) continue;

            self.submitData.reports[r].templateID = r;
            self.submitData.reports[r].taskedCompanyGUID = companyId;
            self.submitData.property.reports.push(self.submitData.reports[r]);
        }


        self.submitData.accessParties = [];
        for (var p in self.submitData.accessCollector) {
            var accessor = self.submitData.accessCollector[p];
            if (!accessor.selected) continue;

            self.submitData.accessParties.push(accessor.val);
        }

        self.submitData.property.siteContact = self.submitData.siteContact;
        var postData = angular.copy(self.submitData);

        postData.locations = [];
        postData.locations.push(angular.copy(self.submitData.property));

        angular.forEach(postData.locations[0].reports, function (r) {
            delete r.selected;
        });

        if (postData && postData.client) {
            postData.client.clientCompanyGUID = companyId;
            if (postData.client.state && postData.client.state.name) {
                postData.client.state = postData.client.state.code;
            }
            if (postData.client.country && postData.client.country.name) {
                postData.client.country = postData.client.country.code;
            }
        }
        if (postData && postData.locations && postData.locations.length) {
            var site = postData.locations[0];
            if (site.state && site.state.name) {
                site.state = site.state.code;
            }
            if (site.country && site.country.name) {
                site.country = site.country.code;
            }
        }

        postData.draftDueDate = $filter('date')(new Date(postData.draftDueDate), "yyyy-MM-dd hh:mm:ss");
        postData.finalDueDate = $filter('date')(new Date(postData.finalDueDate), "yyyy-MM-dd hh:mm:ss");

        if (postData.notification) {
            if (postData.notification.sendEmailNotification) {
                postData.notification.sendEmailNotification = 1;
            } else {
                postData.notification.sendEmailNotification = 0;
            }

            if (postData.notification.emailTo && angular.isArray(postData.notification.emailTo)) {
                postData.notification.emailTo = postData.notification.emailTo.toString();
            }
            if (postData.notification.emailCC && angular.isArray(postData.notification.emailCC)) {
                postData.notification.emailCC = postData.notification.emailCC.toString();
            }
        }

        delete postData.accessCollector;
        delete postData.siteContact;
        delete postData.reports;
        delete postData.property;
        if (postData.client && postData.client.country) {
            delete postData.client.country;
        }

        angular.forEach(postData.accessParties, function (accessParty) {
            if (accessParty) {
                delete accessParty.name;
            }
        });


        //delete postData.project.property;
        //delete postData.project.reports;
        //delete self.submitData.accessCollector;


        try {
            for (var locindex = 0; postData.locations.length > locindex; locindex++) {
                for (var reportindex = 0; postData.locations[locindex].reports.length > reportindex; reportindex++) {
                    if (!postData.locations[locindex].reports[reportindex].languageLibraryGUID) {
                        postData.locations[locindex].reports[reportindex].languageLibraryGUID = getDefaultLanguageLibray(postData.locations[locindex].reports[reportindex].templateGUID);
                    }
                }
            }
        } catch (e) {

        }

        //console.log(this.submitData);
        //console.log(postData);
        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = ProjectStartupAPI.postData(companyId, postData).then(function (result) {
            window.sessionStorage.removeItem("currentTocSectionId");
            window.sessionStorage.removeItem("currentSectionId");
            var locationlenght = result.locations.length - 1;
            var reportlenght = result.locations[locationlenght].reports.length - 1;
            var reportGuid = result.locations[locationlenght].reports[reportlenght].reportGuid;
            $state.go('ReportAuthoring.Write', {
                projectGuid: result.projectGUID,
                reportGuid: reportGuid
            });

            // self.showDisplayMsg('Project created successfully', 'success');
            $anchorScroll();
        }, function (error) {
            self.showDisplayMsg(error);
            $anchorScroll();
        });

    }


    this.cancelCreateProject = function (formCtrl) {
        /*formControllerLogger.info("cancel button clicked");
            $scope.$broadcast('show-errors-reset');
            $location.path("app/modules/LandingPage/views/CreateProjectMenu.html");*/
        var breakLoop = false;
        angular.forEach(formCtrl, function (value, key) {
            if (typeof value === 'object' && value.hasOwnProperty('$modelValue') && value.$viewValue) {
                if (!breakLoop) {
                    if (confirm("You have made changes that will be lost if you leave this page. Do you want to discard the changes?")) {
                        breakLoop = true;
                        $state.go('LandingPage');
                    } else {
                        breakLoop = true;
                        event.preventDefault();
                    }
                }
            }
        });
        if (!breakLoop) {
            $state.go('LandingPage');
        }
    }

    $(function () {
        $('#accordion').on('shown.bs.collapse', function (e) {
            var offset = $(e.target);
            //var offset = $(this).find('.panel-heading');
            if (offset) {
                $('html,body').animate({
                    scrollTop: $(offset).offset().top - 100
                }, 500);
            }
        });
    });



    function getDefaultLanguageLibray(templateGuid) {
        for (var reportTypeIndex = 0; self.loadData.reportTypes.length > reportTypeIndex; reportTypeIndex++) {
            for (var templateIndex = 0; self.loadData.reportTypes[reportTypeIndex].templates.length > templateIndex; templateIndex++) {
                if (self.loadData.reportTypes[reportTypeIndex].templates[templateIndex].templateGUID == templateGuid && self.loadData.reportTypes[reportTypeIndex].templates[templateIndex].defaultLanguageLibraryGUID) {
                    return self.loadData.reportTypes[reportTypeIndex].templates[templateIndex].defaultLanguageLibraryGUID;
                    break;
                }
            }
        }
    }


            }]);
