angular.module("ReportAuthoring").directive("dynamicForm", [function() {
        return {
            restrict: "A",
            transclude: false,
            templateUrl: "app/modules/ReportAuthoring/directives/dynamicForm/dynamicForm.html",
            scope: {
                formData: '=dynamicFormData'
            },
            controller: ['$scope', '$modal', function($scope, $modal) {

                $scope.origianlCopy = angular.copy($scope.formData);

                this.displayForm = function() {
                    var modalInstance = $modal.open({
                        templateUrl: "formDisplay.html",
                        scope: $scope,
                        size: "lg",
                        controller: "displayFormController as displayFormCtrl"
                    });

                    modalInstance.result.then(function() {

                    });
                };

            }],
            controllerAs: "dynamicFormCtrl"
        }
    }])
    .controller("displayFormController", ["$scope", "$modalInstance", "$timeout", "$window", "APIFactory", "GeneralInformationAPI", function($scope, $modalInstance, $timeout, $window, APIFactory, GeneralInformationAPI) {

        var self = this;

        self.dataField = $scope.formData;

        // calendar controls
        self.open = {};

        self.disabled = function(date, mode) {
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

        self.openCalendar = function(e, date) {
            self.successMsg = false;
            e.preventDefault();
            e.stopPropagation();

            self.open[date] = true;
        };

        self.enableEdit = function(index) {
            self.siteGeoCodeError = false;
            self.successMsg = false;
            self.editMode = true;

            // focus on input field
            var inputFieldId = 'editDataField_' + $scope.formData.name + "_" + index;
            $timeout(function() {
                var element = $window.document.getElementById(inputFieldId);
                if (element)
                    element.focus();
            });

        };

        self.cancelEdit = function() {
            self.siteGeoCodeError = false;
            self.successMsg = false;
            self.editMode = false;
            //$scope.formData = angular.copy($scope.origianlCopy);
            reset();
        };

        self.save = function() {

            var objGI = {
                "reportID": 1110001001,
                "dataFields": []
            }

            var radioOptionVal = $('#radioDivOption input:radio:checked').val();
            //call below only after saving gi
            if (self.dataField.name == "Site" && radioOptionVal == "1") {
                var iflag = 0;
                for (i = 0; i < self.dataField.fields.length; i++) {

                    if (self.dataField.fields[i].mappedField == "address" || self.dataField.fields[i].mappedField == "city" || self.dataField.fields[i].mappedField == "state") {

                        if (self.dataField.fields[i].fieldValue != undefined && self.dataField.fields[i].fieldValue != null && self.dataField.fields[i].fieldValue != "") {

                        } else {
                            iflag = 1;
                            // break;
                        }
                    }
                    if (self.dataField.fields[i].mappedField == 'address') {
                        var addressVal = self.dataField.fields[i].fieldValue;
                    }
                    if (self.dataField.fields[i].mappedField == 'city') {
                        var cityVal = self.dataField.fields[i].fieldValue;
                    }
                    if (self.dataField.fields[i].mappedField == 'state') {
                        var stateVal = self.dataField.fields[i].fieldValue;
                    }
                    if (self.dataField.fields[i].mappedField == 'zip') {
                        var zipVal = self.dataField.fields[i].fieldValue;
                    }
                }

                if (iflag == 1) {
                    self.siteGeoCodeError = true;
                } else {
                    //save GI
                    objGI.dataFields.push(self.dataField);
                    APIFactory.putGI(self.dataField.url, objGI).then(function(resp) {
                        console.log("put gi response: " + JSON.stringify(resp));

                    });
                    //get geocode
                    GeneralInformationAPI.put(addressVal, cityVal, stateVal, zipVal).then(function(resp) {

                        for (i = 0; i < self.dataField.fields.length; i++) {

                            if (self.dataField.fields[i].mappedField == 'latitude') {
                                self.dataField.fields[i].fieldValue = resp.addressResults.addresses[0].latitude;
                            } else if (self.dataField.fields[i].mappedField == 'longitude') {
                                self.dataField.fields[i].fieldValue = resp.addressResults.addresses[0].longitude;
                            } else if (self.dataField.fields[i].mappedField == 'regeocode') {
                                self.dataField.fields[i].fieldValue = 0;
                            }
                        }
                        self.editMode = false;
                        self.siteGeoCodeError = false;
                        self.successMsg = true;
                    });
                }
            } else {
                //save GI
                if (self.dataField.name == "Summary Text") {

                    self.dataField.fields[0].fieldValue = self.ckVal;
                }
                objGI.dataFields.push(self.dataField);
                APIFactory.put(self.dataField.url, objGI).then(function(resp) {
                    self.editMode = false;
                    self.siteGeoCodeError = false;
                    self.successMsg = true;
                    for (i = 0; i < self.dataField.fields.length; i++) {

                        if (self.dataField.fields[i].mappedField == 'regeocode') {
                            self.dataField.fields[i].fieldValue = 0;
                        }
                    }
                });
            }
        };

        self.openFindContact = function() {
            self.successMsg = false;
            self.siteGeoCodeError = false;
            var modalInstance = $modal.open({
                templateUrl: 'app/modules/ProjectCreation/views/findContact.html',
                scope: $scope,
                controller: 'FindContactCtrl as findContact',
                size: 'lg',
                windowClass: 'app-modal-window',

                resolve: {
                    contactObj: function() {
                        return self.data;
                    }

                }
            });
            modalInstance.result.then(function() {


                if (self.dataField.name == 'Client') {
                    for (i = 0; i < self.dataField.fields.length; i++) {

                        if (self.dataField.fields[i].mappedField == 'name') {
                            self.dataField.fields[i].fieldValue = self.data.client.companyName;
                        } else if (self.dataField.fields[i].mappedField == 'contact') {
                            self.dataField.fields[i].fieldValue = self.data.client.contactName;
                        } else if (self.dataField.fields[i].mappedField == 'address') {
                            self.dataField.fields[i].fieldValue = self.data.client.address;
                        } else if (self.dataField.fields[i].mappedField == 'city') {
                            self.dataField.fields[i].fieldValue = self.data.client.city;
                        } else if (self.dataField.fields[i].mappedField == 'state') {
                            self.dataField.fields[i].fieldValue = self.data.client.state;
                        } else if (self.dataField.fields[i].mappedField == 'zip') {
                            self.dataField.fields[i].fieldValue = self.data.client.zip;
                        } else if (self.dataField.fields[i].mappedField == 'fax') {
                            self.dataField.fields[i].fieldValue = self.data.client.fax;
                        } else if (self.dataField.fields[i].mappedField == 'email') {
                            self.dataField.fields[i].fieldValue = self.data.client.email;
                        }
                    }

                }

            });

        }

        self.openManageCoverContacts = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/modules/ReportAuthoring/views/manageCoverContacts.html',
                scope: $scope,
                controller: 'ManageCoverContactsController as coverContact',
                size: 'lg',
                windowClass: 'app-modal-window'
            })
        }

        function reset() {
            angular.forEach($scope.origianlCopy.fields, function(field, index) {
                var dest = $scope.formData.fields[index];
                copyPropertyValues(field, dest);
            });
        }

        function copyPropertyValues(orignial, dest) {
            if (!orignial) return;

            dest = dest || {};
            for (var prop in orignial) {
                var val = orignial[prop];
                dest[prop] = val;
            }
        }

    }]);