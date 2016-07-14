angular.module("ReportAuthoring").directive("generalInfoDataField", [function () {
    return {
        restrict: "A",
        replace: true,
        templateUrl: "app/modules/ReportAuthoring/directives/generalInformation/generalInfoDataFieldView.html",
        scope: {
            infoField: '=',
            companyInfo: '='
        },
        controller: ['$scope', '$timeout', '$modal', 'GeneralInformationAPI', '$location', '$state', 'getScopeService', function ($scope, $timeout, $modal, GeneralInformationAPI, $location, $state, getScopeService) {
            var self = this;
            self.isReportFinalize =  window.sessionStorage.getItem('reportStatusAbbreviation') == 'FIN' ? true : false;
            var reportGuid = $location.search().reportGuid;

            self.userMsg = false;
            $scope.$parent.client = $scope.$parent.client || {};
            self.data = $scope.$parent;
            self.dataField = angular.copy($scope.infoField);
            self.giFormId = self.dataField.name.replace(/ /g, "_");
            self.siteLocation = {};
            self.offices = angular.copy($scope.companyInfo.offices);

            fillCompanyOffices();

            if ($scope.infoField.name.toLowerCase() == "summary text") {
                self.ckVal = self.dataField.fields[0].fieldValue;
            }

            function fillCompanyOffices() {
                self.officesDataField = [];
                for (i = 0; i < self.dataField.fields.length; i++) {
                    if (self.dataField.fields[i].fieldType == "dropdown" && self.dataField.fields[i].mappedField == "companyOffices") {
                        for (var j = 0; j < self.offices.length; j++) {
                            var fieldOptionObj = {
                                "option_name": "",
                                "subOption": [],
                                "option_value": "",
                                "orderIndex": "",
                                "isDefault": 0
                            };
                            fieldOptionObj.option_name = self.offices[j].officeName;
                            fieldOptionObj.option_value = j;
                            fieldOptionObj.orderIndex = j;
                            self.officesDataField.push(fieldOptionObj);
                        }
                        self.dataField.fields[i].fieldOption = angular.copy(self.officesDataField);
                    } else if (self.dataField.fields[i].mappedField == 'latitude') {
                        self.siteLocation.latitude = self.dataField.fields[i].fieldValue;
                    } else if (self.dataField.fields[i].mappedField == 'longitude') {
                        self.siteLocation.longitude = self.dataField.fields[i].fieldValue;
                    } else {}
                }
            }

            self.enableEdit = function (index) {
                if (self.isReportFinalize) {
                    return false;
                }
                self.userMsg = false;
                self.editMode = true;

                // focus on input field
                var inputFieldId = 'editDataFieldGI_' + self.dataField.name + "_" + index;
                var element = document.getElementById(inputFieldId);
                $timeout(function () {
                    if (element) {
                        element.focus();
                    }
                });
            };

            self.dropdownChange = function (mappedField, selectedVal) {
                self.userMsg = false;
                if (mappedField == "companyOffices") {
                    if (selectedVal != undefined && selectedVal != null && selectedVal != "") {
                        for (j = 0; j < self.offices.length; j++) {
                            if (selectedVal == self.offices[j].officeName) {
                                var officeDetailObj = {
                                    "address": (self.offices[j].address != "" && self.offices[j].address != undefined && self.offices[j].address != null) ? self.offices[j].address : "",
                                    "city": (self.offices[j].city != "" && self.offices[j].city != undefined && self.offices[j].city != null) ? self.offices[j].city : "",
                                    "state": (self.offices[j].state != "" && self.offices[j].state != undefined && self.offices[j].state != null) ? self.offices[j].state : "",
                                    "zip": (self.offices[j].zipCode != "" && self.offices[j].zipCode != undefined && self.offices[j].zipCode != null) ? self.offices[j].zipCode : "",
                                    "phone": (self.offices[j].phone != "" && self.offices[j].phone != undefined && self.offices[j].phone != null) ? self.offices[j].phone : "",
                                    "fax": (self.offices[j].fax != "" && self.offices[j].fax != undefined && self.offices[j].fax != null) ? self.offices[j].fax : "",
                                    "email": (self.offices[j].email != "" && self.offices[j].email != undefined && self.offices[j].email != null) ? self.offices[j].email : ""

                                };

                                for (i = 0; i < self.dataField.fields.length; i++) {
                                    if (self.dataField.fields[i].mappedField == "address") {
                                        self.dataField.fields[i].fieldValue = officeDetailObj.address;
                                    } else if (self.dataField.fields[i].mappedField == "city") {
                                        self.dataField.fields[i].fieldValue = officeDetailObj.city;
                                    } else if (self.dataField.fields[i].mappedField == "state") {
                                        self.dataField.fields[i].fieldValue = officeDetailObj.state;
                                    } else if (self.dataField.fields[i].mappedField == "zip") {
                                        self.dataField.fields[i].fieldValue = officeDetailObj.zip;
                                    } else if (self.dataField.fields[i].mappedField == "phone") {
                                        self.dataField.fields[i].fieldValue = officeDetailObj.phone;
                                    } else if (self.dataField.fields[i].mappedField == "fax") {
                                        self.dataField.fields[i].fieldValue = officeDetailObj.fax;
                                    } else if (self.dataField.fields[i].mappedField == "email") {
                                        self.dataField.fields[i].fieldValue = officeDetailObj.email;
                                    }
                                }
                                break;
                            }
                        }
                    } else {
                        self.dataField = angular.copy($scope.infoField);
                        fillCompanyOffices();
                    }
                }
            }

            self.radioOption_yes = function (mappedField, index) {
                self.userMsg = false;
                if (mappedField == "fillOfficeInfo") {
                    for (i = 0; i < self.dataField.fields.length; i++) {
                        if (self.dataField.fields[i].mappedField == "companyOffices") {
                            self.dataField.fields[i].isEditable = 0;
                            self.dataField.fields[i].fieldValue = "";
                        }

                        if (self.dataField.fields[i].mappedField == "consultingFirm") {
                            self.dataField.fields[i].fieldValue = ($scope.companyInfo.name != "" && $scope.companyInfo.name != undefined && $scope.companyInfo.name != null) ? $scope.companyInfo.name : "";
                        } else if (self.dataField.fields[i].mappedField == "address") {
                            self.dataField.fields[i].fieldValue = (self.offices[0].address != "" && self.offices[0].address != undefined && self.offices[0].address != null) ? self.offices[0].address : "";
                        } else if (self.dataField.fields[i].mappedField == "city") {
                            self.dataField.fields[i].fieldValue = (self.offices[0].city != "" && self.offices[0].city != undefined && self.offices[0].city != null) ? self.offices[0].city : "";
                        } else if (self.dataField.fields[i].mappedField == "state") {
                            self.dataField.fields[i].fieldValue = (self.offices[0].state != "" && self.offices[0].state != undefined && self.offices[0].state != null) ? self.offices[0].state : "";
                        } else if (self.dataField.fields[i].mappedField == "zip") {
                            self.dataField.fields[i].fieldValue = (self.offices[0].zipCode != "" && self.offices[0].zipCode != undefined && self.offices[0].zipCode != null) ? self.offices[0].zipCode : "";
                        } else if (self.dataField.fields[i].mappedField == "phone") {
                            self.dataField.fields[i].fieldValue = (self.offices[0].phone != "" && self.offices[0].phone != undefined && self.offices[0].phone != null) ? self.offices[0].phone : "";
                        } else if (self.dataField.fields[i].mappedField == "fax") {
                            self.dataField.fields[i].fieldValue = (self.offices[0].fax != "" && self.offices[0].fax != undefined && self.offices[0].fax != null) ? self.offices[0].fax : "";
                        } else if (self.dataField.fields[i].mappedField == "email") {
                            var userDetails = JSON.parse(localStorage.getItem('userdetails'));
                            if (userDetails) {
                                for (var j = 0; j < userDetails.length; j++) {
                                    if (userDetails[j].key === "EMAIL") {
                                        self.dataField.fields[i].fieldValue = userDetails[j].value;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            self.radioOption_no = function (dataFieldName, index) {
                if (dataFieldName == "Consultant") {
                    self.dataField = angular.copy($scope.infoField);
                    fillCompanyOffices();
                }
            }

            self.open = {};

            self.doAppendToBody = function () {
                return ($state.current.name == "generalInformation") ? true : false;
            }

            self.toDate = function (date) {
                return (date) ? moment(date).toDate() : "";
            }

            // Disable weekend selection
            self.disabled = function (date, mode) {
                return (mode === 'day' && (new Date().toDateString() == date.toDateString()));
            };

            self.dateOptions = {
                showWeeks: false,
                startingDay: 1
            };

            self.timeOptions = {
                readonlyInput: true,
                showMeridian: false
            };

            self.openCalendar = function (e, date) {
				/*find all datepicker
				get name Array
				for loop on Array
				call closeCalendar*/
				
                self.userMsg = false;
                e.preventDefault();
                e.stopPropagation();
                self.open[date] = true;
				 
				$('#rightContent').animate({ 
						scrollTop: $('#rightContent')[0].scrollHeight 
					}, 100);
				$("html, body").animate({ scrollTop: $(document).height() }, "slow");
            };
		

            self.cancelEdit = function () {
                self.userMsg = false;
                self.editMode = false;

                if (self.dataField.name.toLowerCase() == "summary text") {
                    //self.dataField = angular.copy($scope.infoField);
                    self.ckVal = self.dataField.fields[0].fieldValue;
                }

                //Do not erase this comment, need to test for office dropdown
                /*else if (self.dataField.name == "Consultant") {
                                   self.dataField = angular.copy($scope.infoField);
                                   fillCompanyOffices();
                               } else {
                                   self.dataField = angular.copy($scope.infoField);
                               }*/

                self.dataField = angular.copy($scope.infoField);
                fillCompanyOffices();
            };

            self.saveGI = function (isFromSpellCheck) {
                if (!$scope["editDataFieldGI_" + self.giFormId + "_form"].$dirty) return;

                var isSpellcheckPause =  window.sessionStorage.getItem('isSpellcheckPause') == "true" ? true : false;
                var objGI = {
                    "dataFields": []
                }
                var siteLocationOnGeocode = {};

                var radioOptionVal = "0";
                var reGeoCodeStatus = $("input[type='radio'][name='regeocode']:checked");
                if (reGeoCodeStatus.length > 0) {
                    radioOptionVal = reGeoCodeStatus.val();
                }

                //var radioOptionVal = $('input[name="regeocode"]').val();
                //call below only after saving gi
                if (self.dataField.name == "Site" && radioOptionVal == "1") {
                    var iflag = false;
                    for (i = 0; i < self.dataField.fields.length; i++) {
                        if (self.dataField.fields[i].mappedField == "address" || self.dataField.fields[i].mappedField == "city" || self.dataField.fields[i].mappedField == "state") {
                            iflag = (self.dataField.fields[i].fieldValue != undefined && self.dataField.fields[i].fieldValue != null && self.dataField.fields[i].fieldValue != "") ? false : true;
                        }

                        if (self.dataField.fields[i].mappedField == 'address') {
                            var addressVal = self.dataField.fields[i].fieldValue;
                        } else if (self.dataField.fields[i].mappedField == 'city') {
                            var cityVal = self.dataField.fields[i].fieldValue;
                        } else if (self.dataField.fields[i].mappedField == 'state') {
                            var stateVal = self.dataField.fields[i].fieldValue;
                        } else if (self.dataField.fields[i].mappedField == 'zip') {
                            var zipVal = self.dataField.fields[i].fieldValue;
                        } else {}
                    }


                    if (iflag) {
                        self.userMsgAlertClass = "alert-danger";
                        self.userMsg = "Please enter Address, City and State if you want to <strong>Re-geocode on save</strong>.";
                    } else {
                        //get geocode
                        GeneralInformationAPI.getGeoCode(addressVal, cityVal, stateVal, zipVal).then(function (resp) {
                            for (i = 0; i < self.dataField.fields.length; i++) {
                                if (self.dataField.fields[i].mappedField == 'latitude') {
                                    self.dataField.fields[i].fieldValue = siteLocationOnGeocode.latitude = parseFloat(resp.addressResults.addresses[0].latitude);
                                } else if (self.dataField.fields[i].mappedField == 'longitude') {
                                    self.dataField.fields[i].fieldValue = siteLocationOnGeocode.longitude = parseFloat(resp.addressResults.addresses[0].longitude);
                                } else if (self.dataField.fields[i].mappedField == 'regeocode') {
                                    self.dataField.fields[i].fieldValue = 0;
                                } else if (self.dataField.fields[i].mappedField == 'address') {
                                    self.dataField.fields[i].fieldValue = resp.addressResults.addresses[0].address1;
                                } else if (self.dataField.fields[i].mappedField == 'city') {
                                    self.dataField.fields[i].fieldValue = resp.addressResults.addresses[0].city;
                                } else if (self.dataField.fields[i].mappedField == 'state') {
                                    self.dataField.fields[i].fieldValue = resp.addressResults.addresses[0].state;
                                } else if (self.dataField.fields[i].mappedField == 'zip') {
                                    self.dataField.fields[i].fieldValue = resp.addressResults.addresses[0].zipCode;
                                }
                            }
                            //save GI
                            objGI.dataFields.push(self.dataField);
                            GeneralInformationAPI.putGI(objGI, reportGuid).then(function (resp) {
                                    self.dataField = angular.copy(objGI.dataFields[0]);
                                    $scope.infoField = angular.copy(objGI.dataFields[0]);

                                    if (!isSpellcheckPause)
                                        self.editMode = false;

                                    if (!isFromSpellCheck)
                                        $scope.$parent.$parent.generalInformationForm.showPNotifyMessage(self.dataField.name + ' section saved', '', 'success');
                                    self.siteLocation.latitude = siteLocationOnGeocode.latitude;
                                    self.siteLocation.longitude = siteLocationOnGeocode.longitude;
                                    $scope["editDataFieldGI_" + self.giFormId + "_form"].$setPristine(false);
                                }),
                                function (error) {
                                    self.userMsgAlertClass = "alert-danger";
                                    self.userMsg = "Error: Failed to save information for <strong>" + self.dataField.name + "</strong> section. " + error;
                                };
                        }, function (error) {
                            self.userMsgAlertClass = "alert-danger";
                            self.userMsg = "Error: Failed to Re-geocode on save for your property. " + error;
                        });
                    }
                } else {
                    //save GI
                    if (self.dataField.name.toLowerCase() == "summary text") {
                        self.dataField.fields[0].fieldValue = self.ckVal;
                    }

                    for (i = 0; i < self.dataField.fields.length; i++) {
                        if ((self.dataField.fields[i].mappedField == 'latitude' || self.dataField.fields[i].mappedField == 'longitude') && $scope.infoField.fields[i].fieldValue != self.dataField.fields[i].fieldValue) {
                            self.dataField.fields[i].fieldValue = (self.dataField.fields[i].fieldValue.length) ? parseFloat(self.dataField.fields[i].fieldValue) : "0.000000";
                        }
                    }
                    objGI.dataFields.push(self.dataField);
                    GeneralInformationAPI.putGI(objGI, reportGuid).then(function (resp) {
                            self.dataField = angular.copy(objGI.dataFields[0]);
                            $scope.infoField = angular.copy(objGI.dataFields[0]);

                            if (!isSpellcheckPause)
                                self.editMode = false;

                            if (!isFromSpellCheck)
                                $scope.$parent.$parent.generalInformationForm.showPNotifyMessage(self.dataField.name + ' section saved', '', 'success');

                            for (i = 0; i < self.dataField.fields.length; i++) {
                                if (self.dataField.fields[i].mappedField == 'regeocode') {
                                    self.dataField.fields[i].fieldValue = 0;
                                }
                                if (self.dataField.name == "Summary Text") {
                                    self.dataField.fields[0].fieldValue = self.ckVal;
                                }
                            }
                            $scope["editDataFieldGI_" + self.giFormId + "_form"].$setPristine(false);
                        }),
                        function (error) {
                            self.userMsgAlertClass = "alert-danger";
                            self.userMsg = "Error: Failed to save information for <strong>" + self.dataField.name + "</strong> section. " + error;
                        };
                }
            }

            self.openFindContact = function () {
                self.userMsg = false;
                var modalInstance = $modal.open({
                    templateUrl: 'app/modules/ProjectCreation/views/findContact.html',
                    scope: $scope,
                    controller: 'FindContactCtrl as findContact',
                    size: 'lg',
                    windowClass: 'app-modal-window',

                    resolve: {
                        contactObj: function () {
                            return self.data;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    for (i = 0; i < self.dataField.fields.length; i++) {
                        if (self.dataField.fields[i].mappedField == 'companyName') {
                            self.dataField.fields[i].fieldValue = self.data.client.companyName;
                        } else if (self.dataField.fields[i].mappedField == 'contactName') {
                            self.dataField.fields[i].fieldValue = self.data.client.contactName;
                        } else if (self.dataField.fields[i].mappedField == 'address') {
                            self.dataField.fields[i].fieldValue = self.data.client.address;
                        } else if (self.dataField.fields[i].mappedField == 'city') {
                            self.dataField.fields[i].fieldValue = self.data.client.city;
                        } else if (self.dataField.fields[i].mappedField == 'state') {
                            self.dataField.fields[i].fieldValue = self.data.client.state;
                        } else if (self.dataField.fields[i].mappedField == 'zipCode') {
                            self.dataField.fields[i].fieldValue = self.data.client.zip;
                        } else if (self.dataField.fields[i].mappedField == 'fax') {
                            self.dataField.fields[i].fieldValue = self.data.client.fax;
                        } else if (self.dataField.fields[i].mappedField == 'email') {
                            self.dataField.fields[i].fieldValue = self.data.client.email;
                        }
                    }
                });
            }

            self.openManageCoverContacts = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'app/modules/ReportAuthoring/views/manageCoverContacts.html',
                    scope: $scope,
                    controller: 'ManageCoverContactsController as coverContact',
                    size: 'lg',
                    windowClass: 'app-modal-window',
                    resolve: {
                        siteLocation: function ($stateParams, reportGridDataOperations) {
                            return reportGridDataOperations.getSiteInformation($stateParams.reportGuid).then(function (resp) {
                                return resp;
                            });
                        }
                    }
                })
            }

            self.viewSiteMap = function () {
                if (self.siteLocation && self.siteLocation.latitude && self.siteLocation.longitude) {
                    var modalInstance = $modal.open({
                        templateUrl: 'app/modules/ReportAuthoring/views/viewMap.html',
                        scope: $scope,
                        controller: "ViewMapController as viewMap",
                        size: 'lg',
                        windowClass: 'app-modal-window',
                        resolve: {
                            mapLocation: function () {
                                return self.siteLocation;
                            }
                        }
                    })
                } else {
                    self.userMsgAlertClass = "alert-danger";
                    self.userMsg = "Site location is not available to view on Map.";
                }
            }

            getScopeService.setGIScope(self);
        }],
        controllerAs: "generalInfoDataField"
    }
}]);