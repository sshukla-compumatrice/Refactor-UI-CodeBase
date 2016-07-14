angular.module('ProjectDashboard').controller('SiteDetailsController', ['$scope', '$modalInstance', 'siteObj', 'reportGridDataOperations', 'checkStatus', 'projectDashboardOperations', 'getCountriesAPI', '$filter', 'getStatesAPI', 'PhoneNumberValidator', '$location', '$state', 'BASEURL', 'globalValues', function ($scope, $modalInstance, siteObj, reportGridDataOperations, checkStatus, projectDashboardOperations, getCountriesAPI, $filter, getStatesAPI, PhoneNumberValidator, $location, $state, BASEURL, globalValues) {

    var self = this;
    self.defaultView = true;
    self.showAlert = false;
    init();

    function init() {
        

        if (siteObj.siteDetails)
            fillInformation(siteObj.siteDetails);
    }

    function setSelectedCountry(countries,mode) {

        
        var selectedCountry = _.filter(countries, function (element) {
            return element.code === siteObj.siteDetails.location.country;
        })[0];
        
        if(mode == 'non-edit'){
            self.country = selectedCountry ? selectedCountry.name : '';
        }
        else if(mode == 'edit'){
        self.selectedCountry = selectedCountry;
        }
    }

    function getCountries(mode) {
        getCountriesAPI.get().then(function (result) {
            self.countries = result;

            setSelectedCountry(self.countries,mode);
        })
    }

    this.formatPhone = function () {
        self.phone = PhoneNumberValidator.format(self.phone);
    }

    function fillInformation(obj) {
        if (obj.location) {
            self.propertyNumber = obj.location.propertyNumber;
            self.propertyName = obj.location.propertyName;
            self.address = obj.location.address1;
            self.city = obj.location.city;
            self.county = obj.location.county;
            //self.state = obj.location.state;
            self.zipCode = obj.location.zip;
            //self.country = obj.location.country;
            self.contactName = obj.location.siteContact.name;
            self.phone = obj.location.siteContact.phone;
            self.fax = obj.location.siteContact.fax;
            self.email = obj.location.siteContact.email;
            getCountries('non-edit');
            getStates(obj.location.country,'non-edit');
            //var countryName = retrieveCountryName(obj.location.country);
            
            //self.country = countryName ? countryName : '';
        }
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


    function getStates(code,mode) {
        getStatesAPI.get(code).then(function (result) {
            self.states = result;
            
            var filteredState = _.filter(self.states, function (element) {
                return element.code === siteObj.siteDetails.location.state;
            })[0];
            if(mode == 'non-edit'){
                self.state = filteredState ? filteredState.name : '';
            }
            else if(mode == 'edit'){
            self.selectedState = filteredState ? filteredState : undefined;
            }
            
        })
    }


    this.editSiteDetails = function () {
        self.showAlert = false;
        self.oldSiteDetails = angular.copy(siteObj.siteDetails);
        
        var filteredCountry = _.filter(self.countries, function (element) {
            return element.code === siteObj.siteDetails.location.country;
        })[0];
        self.selectedCountry = filteredCountry;
        if (filteredCountry && filteredCountry.isStateProvDataAvailable) {
            getStates(filteredCountry.code,"edit");
        } else {
            self.selectedStateText = self.oldSiteDetails.location.state;
        }
    }

    function addClassToAlertHtml(status) {
        if (status === "success") {
            angular.element('#alertSiteDetailsMsgDiv').addClass('alert-success');
            angular.element('#alertSiteDetailsMsgDiv').removeClass('alert-danger');
        } else {
            angular.element('#alertSiteDetailsMsgDiv').removeClass('alert-success');
            angular.element('#alertSiteDetailsMsgDiv').addClass('alert-danger');
        }
    }

    this.dismissAlert = function () {
        this.showAlert = false;
        this.serviceMessage = "";
    }

    this.submitChanges = function (form) {

        self.showAlert = false;
        if (!form || form.$invalid) {
            self.showAlert = true;
            self.defaultView = false;
            addClassToAlertHtml("error");
            self.serviceMessage = 'Invalid Form Submission';
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');

            return;
        }

        siteObj.siteDetails.location.propertyNumber = self.propertyNumber;
        siteObj.siteDetails.location.propertyName = self.propertyName;
        siteObj.siteDetails.location.address1 = self.address;
        siteObj.siteDetails.location.city = self.city;
        siteObj.siteDetails.location.county = self.county;
        siteObj.siteDetails.location.state = self.selectedState === undefined ? self.selectedStateText : self.selectedState.code;
        siteObj.siteDetails.location.zip = self.zipCode;
        siteObj.siteDetails.location.country = self.selectedCountry.code;
        siteObj.siteDetails.location.siteContact.name = self.contactName;
        siteObj.siteDetails.location.siteContact.phone = self.phone;
        siteObj.siteDetails.location.siteContact.fax = self.fax;
        siteObj.siteDetails.location.siteContact.email = self.email;
        delete siteObj.siteDetails.metadata;
        delete siteObj.siteDetails.message;

        mapAddress(siteObj);

    }

    this.cancelChanges = function () {
        $('.error-text').remove();
        $('.has-error').removeClass('has-error');
        self.showAlert = false;
        fillInformation(self.oldSiteDetails);
        self.defaultView = true;
    }

    this.closeSiteDetails = function () {

        if (self.serviceMessage === "Site Details Updated") {
            $modalInstance.close(true);

            $state.go('projectDashboard', {
                projectGuid: $location.search().projectGuid,
                accountGuid: globalValues.currentUserGuid,
                companyGuid: globalValues.currentUserCompanyGuid
            });
        } else {
            $modalInstance.close(false);
        }

    }


    function mapAddress(siteObj) {
        var addressObject = {
            sitename: siteObj.siteDetails.location.propertyName,
            address: siteObj.siteDetails.location.address1,
            city: siteObj.siteDetails.location.city,
            state: siteObj.siteDetails.location.state,
            country: siteObj.siteDetails.location.country,
            zipcode: siteObj.siteDetails.location.zip
        }
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
            projectDashboardOperations.getLatLongFromGeocode(addressObject).then(function (response) {

                if (response.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'POST') || response.addressResults.addresses[0].length === 0) {

                    addressMappingError(response.data.message.userMessage);

                } else {

                    siteObj.siteDetails.location.latitude = response.addressResults.addresses[0].latitude;
                    siteObj.siteDetails.location.longitude = response.addressResults.addresses[0].longitude;


                    callEditSiteService(siteObj);

                }

            }, function (error) {

                addressMappingError("Invalid Adress");
            })

    }

    function addressMappingError(text) {
        self.showAlert = true;
        self.defaultView = false;
        self.serviceMessage = text;
        addClassToAlertHtml("error");
    }

    function callEditSiteService(siteObj) {
        reportGridDataOperations.updateSiteInformation(siteObj.reportGuid, siteObj.siteDetails).then(function (result) {
            self.showAlert = true;

            if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'PUT')) {
                self.serviceMessage = result.data.message.userMessage;
                addClassToAlertHtml("error");
                self.defaultView = false;
            } else {

                self.defaultView = true;
                self.serviceMessage = "Site Details Updated";
                fillInformation(result);
                addClassToAlertHtml("success");

            }
        }, function (error) {
            self.defaultView = false;
            self.showAlert = true;
            addClassToAlertHtml("error");

            self.serviceMessage = "error";
        })
    }

    function retrieveCountryName(code) {
        var selectedCountry = _.filter(self.countries, function (element) {
            return element.code === siteObj.siteDetails.location.country;
        })[0];
    }
    
    function retrieveStateName(code) {
        var selectedCountry = _.filter(self.countries, function (element) {
            return element.code === siteObj.siteDetails.location.country;
        })[0];
    }


}]);