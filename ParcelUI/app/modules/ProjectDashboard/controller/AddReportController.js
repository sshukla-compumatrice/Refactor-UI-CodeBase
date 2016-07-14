angular.module('ProjectDashboard').controller('AddReport', ['$state', '$stateParams', 'companyDataForAddingReports', '$scope', 'projectDashboardOperations', 'checkStatus', 'PhoneNumberValidator', '$state', 'checkStatus', 'reportGridDataOperations', 'getCountriesAPI', 'getStatesAPI', 'AuthFactory', function ($state, $stateParams, companyDataForAddingReports, $scope, projectDashboardOperations, checkStatus, PhoneNumberValidator, $state, checkStatus, reportGridDataOperations, getCountriesAPI, getStatesAPI, AuthFactory) {
 
    var self = this;
    self.grantAccesses = [];
    self.phoneCode = "+1";
 
    init();
 
    function init() {
        
        
        self.accountGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
        self.companyGuid = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');
        self.companyName = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYNAME');
 
        getUSCountryObject();
        getProjectName();
        fillReportTypes();
        fillTransactionTypes();
        fillPropertyTypes();
        fillGrantAccess();
        //getProjectName();
        //getDefaultLibrary();
        this.pid = $stateParams.PID;
        self.ifIsFromReportWriting = false;
        
        if ($stateParams.prevState === 'ReportWrite') {
            self.ifIsFromReportWriting = true;
            fillSiteDetails();
           
            //getAllcountries();
        }
 
 
    }
    
    function getProjectName (){
        projectDashboardOperations.getProjectData($stateParams.projectGuid).then(function (response) {
            self.projectName = response.projects[0].name;
                
            }, function (error) {
            
        })
    }
    
    function getDefaultLibrary(){
      angular.forEach(companyDataForAddingReports.libraries,function(library){
          if(library.default) self.defaultLibrary = library;
      })  
    }
 
    self.gotoReportWriting = function () {
        $state.go('ReportAuthoring.Write', {
            projectGuid: $stateParams.projectGuid,
            reportGuid: $stateParams.reportGuid
        });
    }
 
    function getAllcountries(siteDetails) {
        getCountriesAPI.get().then(function (result) {
            self.countries = result;
 
            setSelectedCountryAndState(siteDetails);
        })
    }
 
    function setSelectedCountryAndState(siteDetails) {
 
        var selectedCountry = _.filter(self.countries, function (element) {
            return element.code === siteDetails.location.country;
        })[0];
        self.selectedCountry = selectedCountry;
 
        if (selectedCountry && selectedCountry.isStateProvDataAvailable) {
            getStates(selectedCountry.code, siteDetails);
        } else {
            self.selectedStateText = siteDetails.location.state;
        }
    }
 
 
 
 
    function fillSiteDetails() {
        
        reportGridDataOperations.getSiteInformation($stateParams.reportGuid).then(function (result) {
            if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'GET')) {
                self.showAlert = true;
                self.serviceMessage = result.data.message.userMessage;
                addClassToAlertHtml("error");
            } else {
                //self.retainSiteInfo = angular.copy(result);
                console.log("site info " + JSON.stringify(result));
                self.propertyNumber = result.location.propertyNumber;
                self.siteName = result.location.propertyName;
                self.address = result.location.address1;
                self.city = result.location.city;
                self.county = result.location.county;
                self.zip = result.location.zip;
                self.latitude = result.location.latitude;
                self.longitude = result.location.longitude;
 
                self.contact = result.location.siteContact.name;
                self.phone = result.location.siteContact.phone === "null" ? "" : result.location.siteContact.phone;
                self.fax = result.location.siteContact.fax === "null" ? "" : result.location.siteContact.fax;
                self.email = result.location.siteContact.email;
                getAllcountries(result);
 
 
 
 
            }
 
        })
 
    }
 
 
    this.editCountry = function () {
        self.states = [];
        self.selectedState = undefined;
        self.selectedStateText = null;
 
        if (self.selectedCountry != null && self.selectedCountry.isStateProvDataAvailable)
            getStates(self.selectedCountry.code);
        else
            self.selectedStateText = null;
 
        $('#divState').find('#fieldValidationMsg').hide();
        $('#divState').removeClass('has-error');
    }
 
 
    function getStates(code, siteDetails) {
        getStatesAPI.get(code).then(function (result) {
            self.states = result;
 
            var filteredState = _.filter(self.states, function (element) {
                return element.code === siteDetails.location.state;
            })[0];
            if (filteredState)
                self.selectedState = filteredState;
            else
                self.selectedState = undefined;
        })
    }
 
    function getUSCountryObject() {
        projectDashboardOperations.getCountryObject('US').then(function (response) {
 
            self.defaultCountryObject = response;
        })
    }
 
   
 
    function fillReportTypes() {
        self.reportTypes = [];
        angular.forEach(companyDataForAddingReports.templates, function (template, index) {
            var obj = {};
            obj.templateGUID = template.templateGUID;
            obj.templateVersionGuid = template.templateVersionGUID;
            obj.templateName = template.name;
            obj.defaultLanguageLibraryGUID = template.defaultLanguageLibraryGUID;
            self.reportTypes.push(obj);
        })
    }
 
    function fillTransactionTypes() {
        self.transactionTypes = companyDataForAddingReports.transactionTypes;
    }
 
    function fillPropertyTypes() {
        self.propertyTypes = companyDataForAddingReports.propertyTypes;
    }
 
    function fillGrantAccess() {
        self.offices = companyDataForAddingReports.offices;
        self.teams = companyDataForAddingReports.teams;
 
        self.relatedCompanies = companyDataForAddingReports.relatedCompanies;

        angular.forEach(self.offices, function (office) {
            office.name = "Everyone in the " + office.name;
            office.accessType = "OFFICE";
            self.grantAccesses.push(office);
        });
        angular.forEach(self.teams, function (team) {
            team.name = "Everyone in the " + team.name;
            team.accessType = "TEAM";
            self.grantAccesses.push(team);
 
        });
        angular.forEach(self.relatedCompanies, function (company) {
            company.name = "Everyone in the " + company.name;
            company.accessType = "COMPANY";
            self.grantAccesses.push(company);
        });
 
        self.grantAccesses.push({
            "accessType": "USER",
            "userGUID": AuthFactory.getUserDetailsFromStorage('EFF_USERGUID'),
            "name": "Yourself only",
            "accessType": "USER"
        });

        self.grantAccesses.push({
            name: "Everyone in the " + AuthFactory.getUserDetailsFromStorage('EFF_COMPANYNAME'),
                    accessType: "COMPANY",
                    companyGUID: AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID')
        });

    }
 
    self.selectCompany = function () {
 
        var element = _.filter(self.grantAccesses, function (element) {
 
            return element.name == 'Everyone in the ' + AuthFactory.getUserDetailsFromStorage('EFF_COMPANYNAME');
 
        })[0];
 
        self.grantAccess = element;
 
 
    }
 
 
    this.gotoProjectDashboard = function () {
        $state.go('projectDashboard', {
            projectGuid: $stateParams.projectGuid,
            prevState: $stateParams.prevState
            
        });
 
    }
 
    this.formatPhone = function () {
        self.phone = PhoneNumberValidator.format(self.phone);
    }
 
    this.clearDetails = function () {
        if ($stateParams.prevState === 'ReportWrite') {
            $state.go('ReportAuthoring.Write', {
                projectGuid: $stateParams.projectGuid,
                reportGuid: $stateParams.reportGuid
            });
        } else {
            $state.go('projectDashboard', {
                projectGuid: $stateParams.projectGuid
                
            });
        }
 
 
 
 
 
    }
 
    this.mapAddress = function (obj) {
        self.showAlert = false;
        var addressObject = {
            sitename: this.siteName,
            address: this.address,
            city: this.city,
 
            zipcode: this.zip
        }
 
        if ($stateParams.prevState === 'ReportWrite') {
            addressObject.state = this.selectedState === undefined ? this.selectedStateText : this.selectedState.code;
           addressObject.country = this.selectedCountry.code;
        } else {
            addressObject.state = this.state.code;
            addressObject.country = this.country.code;
        }
 
        projectDashboardOperations.getLatLongFromGeocode(addressObject).then(function (response) {
 
            if (response.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'POST') || response.addressResults.addresses[0].length === 0) {
 
                addressMappingError(response.data.message.userMessage, obj);
 
            } else {
                self.invalidAddress = false;
                self.latitude = response.addressResults.addresses[0].latitude;
                self.longitude = response.addressResults.addresses[0].longitude;
                if (obj) {
                    obj.project.locations[0].latitude = self.latitude;
                    obj.project.locations[0].longitude = self.longitude;
                    callAddReportsService(obj);
                }
            }
 
        }, function (error) {
 
            addressMappingError("Invalid Adress", obj);
        })
 
    }
 
 
    function addressMappingError(text, obj) {
 
        self.showAlert = true;
        self.serviceMessage = text;
        self.latitude = "";
        self.longitude = "";
        addClassToAlertHtml("error");
 
 
        /*self.invalidAddress = true;
        self.googleErrorMessage = text;*/
 
 
    }
 
 
 
 
    this.saveReport = function (form) {
        self.showAlert = false;
        if (form.$invalid) {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input[required],multiselect[required]').trigger('blur');
            inputElements[0].querySelector('.ng-invalid').focus();
            return;
        } else {
            var obj = {};
            obj.project = {};
            obj.project.generalInfo = {};
            obj.project.locations = [];
            obj.project.accessParties = [];
            var locationObject = {};
            locationObject.projectGuid = $stateParams.projectGuid;
            locationObject.propertyGuid = "";
            locationObject.propertyNumber = this.propertyNumber;
 
            locationObject.name = this.siteName;
            locationObject.address = "";
            locationObject.address1 = this.address;
            locationObject.address2 = this.address2;
            locationObject.address2 = "";
            if ($stateParams.prevState === 'ReportWrite') {
                locationObject.country = this.selectedCountry.code;
                locationObject.state = this.selectedState === undefined ? this.selectedStateText : this.selectedState.code;
            } else {
                locationObject.country = this.country.code;
                locationObject.state = this.state.name === undefined ? this.state : this.state.name;
            }
            locationObject.acreage = "";
            locationObject.numBuildings = "";
            locationObject.city = this.city;
 
            locationObject.zip = this.zip;
            locationObject.county = this.county;
            locationObject.propertyType = this.propType;
            locationObject.transactionType = this.transType;
            locationObject.latitude = this.latitude;
            locationObject.longitude = this.longitude;
            locationObject.siteContact = {};
            locationObject.siteContact.name = this.contact;
            locationObject.siteContact.phone = this.phone;
            locationObject.siteContact.fax = this.fax;
            locationObject.siteContact.email = this.email;
            locationObject.reports = [];
            angular.forEach(this.reportType, function (reportType) {
                var locationReportsObject = {};
                locationReportsObject.reportGuid = "";
                locationReportsObject.templateID = "";
                locationReportsObject.fee = "";
                locationReportsObject.outToBid = "";
                locationReportsObject.poNumber = "";
                locationReportsObject.projectNumber = "";
                locationReportsObject.taskedCompanyID = "";
                locationReportsObject.languageLibraryGUID = reportType.defaultLanguageLibraryGUID ? reportType.defaultLanguageLibraryGUID : "";
                locationReportsObject.templateGUID = reportType.templateGUID;
                locationReportsObject.templateVersionGUID = reportType.templateVersionGuid;
                locationObject.reports.push(locationReportsObject);
            })
            obj.project.locations.push(locationObject);
            var grantAccessObj = angular.copy(self.grantAccess);
 
            if (grantAccessObj) {
                if (grantAccessObj.functions) delete grantAccessObj.functions;
                if (grantAccessObj.entityGUID == null || grantAccessObj.entityGUID) delete grantAccessObj.entityGUID;
                delete grantAccessObj.name;
                obj.project.accessParties.push(grantAccessObj);
            }
 
 
            if (typeof (this.latitude) === "undefined" || this.latitude === "" || typeof (this.longitude) === "undefined" || this.longitude === "") {
                this.mapAddress(obj);
            } else {
                callAddReportsService(obj);
            }
 
        }
    }
 
 
    function callAddReportsService(obj) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
            projectDashboardOperations.addReportsToProperty(obj).then(function (result) {
                if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'POST')) {
                    self.showAlert = true;
                    self.serviceMessage = result.data.message.userMessage;
                    addClassToAlertHtml("error");
 
                } else {
 
                    if ($stateParams.prevState === 'ReportWrite') {
                       
                        $state.go('ReportAuthoring.Write', {
                            projectGuid: $stateParams.projectGuid,
                            reportGuid: result.project.locations[0].reports[0].reportGuid
                        });
 
                    } else {
                        self.gotoProjectDashboard();
                    }
 
 
 
                }
            }, function (error) {
                self.showAlert = true;
 
                self.serviceMessage = "Something went wrong. Will be right back !!";
               addClassToAlertHtml("error");
            })
    }
 
 
 
    function addClassToAlertHtml(status) {
        if (status === "success") {
            angular.element('#alertAddReportsMsgDiv').addClass('alert-success');
            angular.element('#alertAddReportsMsgDiv').removeClass('alert-danger');
        } else {
            angular.element('#alertAddReportsMsgDiv').removeClass('alert-success');
            angular.element('#alertAddReportsMsgDiv').addClass('alert-danger');
        }
    }
 
    this.dismissAlert = function () {
        this.showAlert = false;
        this.serviceMessage = "";
    }
 
 
 
 
 
 
}])