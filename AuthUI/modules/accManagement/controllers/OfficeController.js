angular.module('AccountMgmtModule').controller('OfficeController', ['$rootScope', '$scope', '$state', '$location', '$timeout', 'officeData', 'getCountriesAPI', 'getStatesAPI', 'geocodeService', 'OfficeServiceAPI', function ($rootScope, $scope, $state, $location, $timeout, officeInfo, getCountriesAPI, getStatesAPI, geocodeService, OfficeServiceAPI) {
    var self = this;

    self.isEditOffice = false;
    self.submitBtnText = 'Create Office';
    self.officeLocation = {};
    self.mapZoom = 3;

    //Query Params
    self.companyguid = $location.search().companyguid;
    self.officeguid = $location.search().officeguid;

    var geocodeParams = {};


    function getBillingContactUser(officeInfo, userGuid) {
        if (officeInfo.users) {
            for (var i = 0; i < officeInfo.users.length; i++) {
                if (officeInfo.users[i].userGUID == userGuid)
                    return officeInfo.users[i];
            }
        }
        return {};
    }

    function setCountry(selectedContryCode, from) {
        var officeCountryPromise = getCountriesAPI.getCountryByCountryCode(selectedContryCode);
        officeCountryPromise.then(function (data) {
            $scope.selectedCountry = data;
            if (from == "fromWatch") {
                $timeout(function () {
                    angular.element('#countrySelect').trigger('change');
                });
            }
        }, function (error) {

        });
    }

    function setState(selectedContryCode, selectedStateCode) {
        var officeStatePromise = getStatesAPI.getStateByStateCode(selectedContryCode, selectedStateCode);
        officeStatePromise.then(function (data) {
            $scope.selectedState = data;
        }, function (error) {

        });
    }

    function setOfficeLocation(geocodeParams) {
        $rootScope.promise = geocodeService.geocode(geocodeParams).then(function (geocodeResult) {
            if (geocodeResult.addressResults !== undefined) {
                var countryCode = geocodeResult.addressResults.addresses[0].countryCode;
                $scope.officeCtrl.officeLocation.latitude = geocodeParams.latitude ? geocodeParams.latitude : geocodeResult.addressResults.addresses[0].latitude;
                $scope.officeCtrl.officeLocation.longitude = geocodeParams.longitude ? geocodeParams.longitude : geocodeResult.addressResults.addresses[0].longitude;
                $scope.officeCtrl.officeLocation.city = geocodeResult.addressResults.addresses[0].city;
                $scope.officeCtrl.officeLocation.zipCode = geocodeResult.addressResults.addresses[0].zipCode;

                $scope.officeCtrl.officeLocation.countryCode = (countryCode != null) ? countryCode : "US";
                $scope.officeCtrl.officeLocation.stateCode = geocodeResult.addressResults.addresses[0].state;

                var inputElements = document.getElementsByName("officeAddEditForm");
                $timeout(function () {
                    angular.element(inputElements).find(':input').trigger('change');
                });

            } else {
                alert("Sorry! We can't locate this place.");
            }
        });
    }

    function handleAddEditResponse(response, officeName) {
        if (response.office != null || response.office != undefined || response == "") {
            var redirectOfficeguid = (response == "") ? $state.params.officeguid : response.office.companyOfficeGUID;
            $rootScope.alertClass = 'alert-success';
            $rootScope.skipMsgClear = true;
            if (self.isEditOffice) {
                $rootScope.userMessage = "The <strong>" + officeName + "</strong> office was updated successfully.";
                $state.go('accountMgmt.office.view', {
                    companyguid: $scope.officeCtrl.companyguid,
                    officeguid: redirectOfficeguid
                });
            } else {
                $rootScope.userMessage = "The <strong>" + officeName + "</strong> office was added successfully.";
                $state.go('accountMgmt.office.list', {
                    companyguid: $scope.officeCtrl.companyguid
                });
            }
        } else {
            if (response.data.message != null || response.data.message != undefined) {
                $rootScope.alertClass = 'alert-danger';
                if (self.isEditOffice) {
                    $rootScope.userMessage = "Error: Problem in updating <strong>" + officeName + "</strong> office. " + response.data.message.userMessage;
                } else {
                    $rootScope.userMessage = "Error: Problem in adding <strong>" + officeName + "</strong> office. " + response.data.message.userMessage;
                }
                window.scrollTo(0, 0);
            } else {
                $rootScope.alertClass = 'alert-danger';
                $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
            }
        }
    }

    self.isLatLngSet = function () {
        if (self.officeLocation.latitude == "" || parseFloat(self.officeLocation.latitude) == 0)
            return false;

        else if (self.officeLocation.longitude == "" || parseFloat(self.officeLocation.longitude) == 0)
            return false;

        else
            return true;
    }

    if (!!officeInfo) {
        if (officeInfo == "" || officeInfo.data) {
            $rootScope.alertClass = "alert-danger";
            $rootScope.userMessage = "Problem in getting requested office details. Please try again.";
        }
        else {
            self.officeInfo = officeInfo.offices[0];
            self.billingContactUser = getBillingContactUser(self.officeInfo, self.officeInfo.billingContactUserGUID);

            self.officeLocation.address = self.officeInfo.address;
            self.officeLocation.addressLine2 = self.officeInfo.addressLine2;
            self.officeLocation.city = self.officeInfo.city;
            self.officeLocation.zipCode = self.officeInfo.zipCode;
            self.officeLocation.latitude = self.officeInfo.latitude;
            self.officeLocation.longitude = self.officeInfo.longitude;
            self.mapZoom = (self.isLatLngSet()) ? 15 : 3;
        }
    } else {
        self.officeInfo = {};
        self.billingContactUser = {};
        $scope.selectedCountryCode = self.officeLocation.countryCode = "US";
        $scope.selectedStateCode = self.officeLocation.stateCode = "";
    }

    if ($state.current.name == 'accountMgmt.office.edit') {
        self.isEditOffice = true;
        self.submitBtnText = 'Update';

        //Set country and state according to office detail
        if (officeInfo.offices) {
            $scope.selectedCountryCode = self.officeLocation.countryCode = officeInfo.offices[0].country;
            $scope.selectedStateCode = self.officeLocation.stateCode = officeInfo.offices[0].state;
        }

        setCountry($scope.selectedCountryCode, "fromInit");
        setState($scope.selectedCountryCode, $scope.selectedStateCode);

        //Setting breadcrumb label on view and edit state
        //$state.current.breadcrumb.label = $rootScope.officeCrumbTitle;
    } else if ($state.current.name == 'accountMgmt.office.new') {
        $scope.selectedCountry = {
            code: "US",
            name: "United States"
        }
    } else {
        if (officeInfo.offices) {
            $scope.selectedCountryCode = self.officeLocation.countryCode = officeInfo.offices[0].country;
            $scope.selectedStateCode = self.officeLocation.stateCode = officeInfo.offices[0].state;
            self.cityStateZip = self.officeInfo.city + ", " + $scope.selectedStateCode + ", " + self.officeInfo.zipCode;
        }
    }

    // Submitting data to edit or add
    self.submitOfficeData = function (form) {
        if (form.$valid) {
            var officeData = {
                "office": {
                    "officeName": self.officeInfo.officeName,
                    "companyGUID": self.companyguid,
                    "address": self.officeLocation.address,
                    "addressLine2": self.officeLocation.addressLine2,
                    "country": $scope.selectedCountry.code,
                    "city": self.officeLocation.city,
                    "state": $scope.selectedState.stateCode,
                    "zipCode": self.officeLocation.zipCode,
                    "latitude": self.officeLocation.latitude,
                    "longitude": self.officeLocation.longitude,
                    "phone": self.officeInfo.phone,
                    "fax": self.officeInfo.fax,
                    "edrAccountNumber": self.officeInfo.edrAccountNumber,
                    "edrAccountPassword": self.officeInfo.edrAccountPassword
                }
            }

            if (self.isEditOffice && self.billingContactUser)
                officeData.office.billingContactUserGUID = self.billingContactUser.userGUID;
            else
                officeData.office.billingContactUserGUID = "";

            if (self.isEditOffice) {
                OfficeServiceAPI.updateOffice(self.companyguid, self.officeguid, officeData).then(function (response) {
                    handleAddEditResponse(response, officeData.office.officeName);
                });
            } else {
                OfficeServiceAPI.createOffice(self.companyguid, officeData).then(function (response) {
                    handleAddEditResponse(response, officeData.office.officeName);
                });
            }
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            inputElements[0].querySelector('.ng-invalid').focus();
        }
    }

    self.cancelOfficeCreation = function () {
        if (self.isEditOffice) {
            $state.go('accountMgmt.office.view', {
                companyguid: $state.params.companyguid,
                officeguid: $state.params.officeguid
            });
        } else {
            $state.go('accountMgmt.office.list', {
                companyguid: $state.params.companyguid
            });
        }
    }

    //Geocoding office address
    self.gecodeOfficeLocation = function () {
        geocodeParams = {
            address1: self.officeLocation.address,
            address2: self.officeLocation.addressLine2,
            city: self.officeLocation.city,
            state: $scope.selectedState.stateCode
        };
        setOfficeLocation(geocodeParams);
    }

    // Watching country code to set select control and restict geocoding withing US & Canada
    $scope.$watch(function (scope) {
            return scope.officeCtrl.officeLocation.countryCode;
        },
        function (newValue, oldValue) {
            var availableCountries = ["US", "CA"]
            if (newValue != oldValue) {
                if (availableCountries.indexOf(newValue) == -1) {
                    $scope.officeCtrl.officeLocation.countryCode = "US";
                    $scope.officeCtrl.officeLocation.city = "";
                    $scope.officeCtrl.officeLocation.zipCode = "";
                    $scope.officeCtrl.officeLocation.latitude = "";
                    $scope.officeCtrl.officeLocation.longitude = "";
                    alert("Sorry! We can't help you outside United States and Canada.")
                } else {
                    setCountry(newValue, "fromWatch");
                }
            }
        }
    );

    //Watching state code to reflect value in state select control
    $scope.$watch(function (scope) {
            return scope.officeCtrl.officeLocation.stateCode;
        },
        function (newValue, oldValue) {
            if (newValue != oldValue) {
                setState($scope.officeCtrl.officeLocation.countryCode, newValue);
            }
        }
    );

    //Watching selectedContry if user manually select to set respective states
    $scope.$watch(function (scope) {
            return scope.selectedCountry;
        },
        function (newValue, oldValue) {
            if (newValue != oldValue && newValue)
                $scope.officeCtrl.officeLocation.countryCode = newValue.code;
        }
    );

    //Watching selectedState for manual selection
    $scope.$watch(function (scope) {
            return scope.selectedState;
        },
        function (newValue, oldValue) {
            if (newValue && oldValue)
                if (newValue.code != oldValue.code)
                    $scope.officeCtrl.officeLocation.stateCode = newValue.code;
        }
    );

    //Watching latitude longitude to call geocoding service    
    $scope.$watchCollection('[officeCtrl.officeLocation.dragendLat, officeCtrl.officeLocation.dragendLng]', function (newValues, oldValues) {
        geocodeParams = {
            latitude: parseFloat($scope.officeCtrl.officeLocation.dragendLat),
            longitude: parseFloat($scope.officeCtrl.officeLocation.dragendLng)
        };
        if (newValues[0] == oldValues[0]) {
            if (newValues[1] != oldValues[1]) {
                setOfficeLocation(geocodeParams);
            }
        } else {
            setOfficeLocation(geocodeParams);
        }
    });

}]);