angular.module("ReportAuthoring").controller("EDRPortfolioOrderController", ["$scope", "$modal", "$state", "$filter", "GeneralInformationAPI", "edrOrderAPI", "portfolioData", "edrPackages", "accountMgmtAPI", function ($scope, $modal, $state, $filter, GeneralInformationAPI, edrOrderAPI, portfolioData, edrPackages, accountMgmtAPI) {

    var self = this;

    self.userMsgAlertClass = "";
    self.userMsg = "";
    self.isDeliveryTypeXML = false;
    self.projectGUID = $state.params.projectGuid;
    self.portfolioData = angular.copy(portfolioData);
    self.edrPackages = edrPackages;
    self.isEdrCredentialsAvailable = true;
    self.disableFormFields = false;
    self.continueBtnText = "Continue Order";

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;

    function getUserDetails() {
        self.user = {
            name: "",
            email: "",
            phone: ""
        }
        var userDetails = JSON.parse(localStorage.getItem('userdetails'));
        if (userDetails) {
            for (var i = 0; i < userDetails.length; i++) {
                switch (userDetails[i].key) {
                case "EFF_DISPLAYNAME":
                    self.user.name = userDetails[i].value;
                    break;
                case "EFF_EMAIL":
                    self.user.email = userDetails[i].value;
                    break;
                case "EFF_PHONE":
                    self.user.phone = userDetails[i].value;
                }
            }
        }
    }

    function getSearchDistances(obj) {
        var edrCredentialsData = {
            "edrCredentials": {
                "edrAccountNumber": obj.edrAccountNumber,
                "edrPassword": obj.edrPassword
            }
        }
        edrOrderAPI.searchDistances(edrCredentialsData).then(function (resp) {
            self.searchDistances = resp.searchDistancesSet;
        }, function (error) {
            self.userMsgAlertClass = "alert-danger";
            if (error == "Error while search distances Invalid username or password." || error == "Error while search distances Missing username and/or password in SOAP header." || error == "Invalid Account Number or Password") {
                self.isEdrCredentialsAvailable = false;
                self.edrCredentialsErrorMsg = "<strong>Error:</strong> Problem in getting search distances by using your available EDR Credentials. ";
            } else {
                self.userMsg = "<strong>Error:</strong> Problem in getting search distances. " + error + ". Please try again.";
            }
        });
    }

    function init() {
        self.edrCredentialObj = sessionStorage.getItem("edrCredential");        
        self.edrCredentialObj = self.edrCredentialObj ? JSON.parse(self.edrCredentialObj) : false;

        if (self.edrCredentialObj && self.edrCredentialObj.edrAccountNumber && self.edrCredentialObj.edrPassword) {
            if (portfolioData && portfolioData.reports && portfolioData.reports.length) {
                self.projectName = portfolioData.reports[0].projectName;
            }
            getUserDetails();
            getSearchDistances(self.edrCredentialObj);
        } else {
            self.isEdrCredentialsAvailable = false;
            self.edrCredentialsErrorMsg = "<strong>Error:</strong> Your EDR credentials are not available to place portfolio order. ";
        }
    }

    init();

    self.openEdrCredentialsModal = function () {
        $modal.open({
            templateUrl: 'orderDBReport.html',
            scope: $scope,
            controller: 'OrderDatabaseReportsController as OrderDbReportsCtrl',
            backdrop: 'static',
            resolve: {
                siteDetails: function () {
                    return false;
                },
                userDetails: function (globalValues, accountMgmtAPI) {
                    var companyGuid = globalValues.currentUserCompanyGuid;
                    var officeGuid = globalValues.currentUserOfficeGuid;
                    var userGuid = globalValues.currentUserGuid;
                    return accountMgmtAPI.getUser(userGuid, "", companyGuid, officeGuid, "", "", "", "", "office").then(function (resp) {
                        return resp;
                    });
                }
            }
        });
    }

    self.checkAll = function () {
        angular.forEach(self.portfolioData.reports, function (report) {
            report.selected = true;
        });
    };

    /*self.checkAllExact = function () {
        angular.forEach(self.portfolioData.reports, function (report) {
            report.selected = true;
        });
    };*/

    self.uncheckAll = function () {
        angular.forEach(self.portfolioData.reports, function (report) {
            report.selected = false;
        });
    };

    self.copyToOthers = function (type, value) {
        if (!angular.isArray(self.portfolioData.reports)) return;

        angular.forEach(self.portfolioData.reports, function (item, index) {
            self.portfolioData.reports[index][type] = value;
        });
    };

    self.createPortfolioOrders = function () {
        var orderObj = {};
        var orderArr = [];
        var portfolioProductName = "";

        if ($scope.contactForm.$valid) {
            if (self.portfolioData.reports != undefined) {
                for (var i = 0; i < self.portfolioData.reports.length; i++) {
                    orderObj = {};
                    portfolioProductName = "";
                    if ('selected' in self.portfolioData.reports[i]) {
                        if (self.portfolioData.reports[i].portfolioProductCode) {
                            if (self.portfolioData.reports[i].searchDistanceSetID) {
                                portfolioProductName = $filter('filter')(self.edrPackages, {
                                    portfolioProductCode: self.portfolioData.reports[i].portfolioProductCode
                                }, true)[0]["name"];
                                orderObj = {
                                    "edrAccountNumber": self.edrCredentialObj.edrAccountNumber,
                                    "edrPassword": self.edrCredentialObj.edrPassword,
                                    "contactName": self.user.name,
                                    "contactEmail": self.user.email,
                                    "contactPhone": self.user.phone,
                                    "reportGuid": self.portfolioData.reports[i].reportGuid,
                                    "poNumber": self.portfolioData.reports[i].poNumber,
                                    "projectNumber": self.portfolioData.reports[i].projectNumber,
                                    "portfolioProductCode": self.portfolioData.reports[i].portfolioProductCode,
                                    "portfolioProductName": portfolioProductName,
                                    "optionalHistoricalProduct": "",
                                    "includeFieldCheck": self.portfolioData.reports[i].fieldChk ? 1 : 0,
                                    "searchDistanceSetID": parseInt(self.portfolioData.reports[i].searchDistanceSetID),
                                    "deliveryType": (self.isDeliveryTypeXML) ? "XML" : "EMAIL",
                                    "notificationEmails": self.portfolioData.reports[i].emailNotificationsTo ? self.portfolioData.reports[i].emailNotificationsTo.replace(/ /g, '') : "",
                                    "comments": self.portfolioData.reports[i].siteComments
                                }
                                orderArr.push(orderObj);
                            } else {
                                self.userMsgAlertClass = "alert-danger";
                                self.userMsg = "At least one site does not have a <strong>Search Distance</strong> selected. You must enter a search distance for every site in the order. You can use the arrow icon to fill and entry into the rest of the sites.";
                                return;
                            }
                        } else {
                            self.userMsgAlertClass = "alert-danger";
                            self.userMsg = "At least one site does not have an <strong>EDR Package</strong> selected. You must enter an EDR Package for every site in the order. You can use the arrow icon to fill an entry into the rest of the sites.";
                            return;
                        }
                    }
                }
                var portfolioOrderData = {
                    "portfolioOrder": {
                        "orders": orderArr
                    }
                }

                if (orderArr.length) {
                    self.disableFormFields = true;
                    self.continueBtnText = "Placing Order...";
                    edrOrderAPI.createPortfolioOrder(portfolioOrderData).then(function (result) {
                            $state.go('portfolioOrderStatus', {
                                portfolioOrderGuid: result.portfolioOrderGuid,
                                projectName: self.projectName
                            });

                        }),
                        function (error) {
                            self.userMsgAlertClass = "alert-danger";
                            self.userMsg = "Error: Failed to place your orders. " + error;
                        };
                } else {
                    self.userMsgAlertClass = "alert-danger";
                    self.userMsg = "Please check the site you want to include in your EDR order."
                }
            }
        } else {
            self.userMsgAlertClass = "alert-danger";
            self.userMsg = "Please fill up contact details."
            var formElem = document.getElementsByName("contactForm");
            angular.element(formElem).find(':input').trigger('blur');
            formElem[0].querySelector('.ng-invalid').focus();
        }
    }

    self.mapClick = function (report, index) {
        var modalInstance = $modal.open({
            templateUrl: 'map.html',
            scope: $scope,
            controller: mapController,
            size: 'lg',
            windowClass: 'app-modal-window',
            resolve: {
                parameters: function () {
                    return report;
                },
                reportIndex: function () {
                    return index;
                }
            }
        });
    }

    var mapController = function ($scope, $modalInstance, parameters, reportIndex, $filter) {
        var mapCenter = {
            lat: 39.828212077334264,
            lon: -98.5795724196434
        };

        var propLocation = {
                lat: 39.828212077334264,
                lon: -98.5795724196434,
                name: "Geographic center of the contiguous United States"
            };        
        

        $scope.mapItFieldConfig = {
            "mapConfig": {
                "mapDraggable": true,
                "mapZoom": 4,
                "mapClasses": "google-map",
                "center": mapCenter,
                "marker": propLocation,
                "height": "250",
                "mapInstruction": "You can drag-drop marker to adjust the location."
            },
            "dataFields": [{
                    "fieldName": "clientLocationID",
                    "fieldAlias": "locationid",
                    "fieldLabel": "Client Location ID:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 1,
                    "required": false,
                    "viewStatus": false,
                    "editable": true,
                    "fieldValue": "",
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "siteName",
                    "fieldAlias": "sitename",
                    "fieldLabel": "Site Name:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 2,
                    "required": false,
                    "viewStatus": false,
                    "editable": true,
                    "fieldValue": "",
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "address1",
                    "fieldAlias": "address1",
                    "fieldLabel": "Address:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 3,
                    "required": true,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": parameters.address1,
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "address2",
                    "fieldAlias": "address2",
                    "fieldLabel": "",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 4,
                    "required": false,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": "",
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "city",
                    "fieldAlias": "city",
                    "fieldLabel": "City:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 5,
                    "required": false,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": parameters.city,
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "countryCode",
                    "fieldAlias": "countryCode",
                    "fieldLabel": "Country:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "dropdown",
                    "orderIndex": 6,
                    "required": true,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": {},
                    "options": [{
                        value: "",
                        name: "-- Select a country --"
                    }],
                    "tooltip": null
            },
                {
                    "fieldName": "state",
                    "fieldAlias": "state",
                    "fieldLabel": "State:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "dropdown",
                    "orderIndex": 7,
                    "required": true,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": {
                        value: parameters.state,
                        name: ""
                    },
                    "options": [{
                        value: "",
                        name: "-- Select a state --"
                    }],
                    "tooltip": null
            },
                {
                    "fieldName": "zipcode",
                    "fieldAlias": "zipcode",
                    "fieldLabel": "Zip:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 8,
                    "required": false,
                    "viewStatus": false,
                    "editable": true,
                    "fieldValue": parameters.zipCode,
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "mapItBtn",
                    "fieldAlias": "mapItBtn",
                    "fieldLabel": "Regeocode Location",
                    "fieldLabelClasses": "control-label col-sm-4",
                    "fieldDivClasses": "col-sm-3",
                    "fieldClasses": "btn btn-primary",
                    "fieldType": "button",
                    "orderIndex": 9,
                    "required": false,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": "",
                    "options": null,
                    "tooltip": null,
                    "btnType": "doGeocode"
            },
                {
                    "fieldName": "latitude",
                    "fieldAlias": "latitude",
                    "fieldLabel": "Latitude:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 10,
                    "required": true,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": parameters.latitude,
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "longitude",
                    "fieldAlias": "longitude",
                    "fieldLabel": "Longitude:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 11,
                    "required": true,
                    "viewStatus": true,
                    "editable": true,
                    "fieldValue": parameters.longitude,
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "distance",
                    "fieldAlias": "distance",
                    "fieldLabel": "Distance:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 12,
                    "required": false,
                    "viewStatus": false,
                    "editable": true,
                    "fieldValue": "",
                    "options": null,
                    "tooltip": null
            },
                {
                    "fieldName": "geoSettingsCode",
                    "fieldAlias": "geosettingscode",
                    "fieldLabel": "Geo Settings Code:",
                    "fieldLabelClasses": "control-label col-sm-4 align-left",
                    "fieldDivClasses": "col-sm-8",
                    "fieldClasses": "form-control",
                    "fieldType": "text",
                    "orderIndex": 12,
                    "required": false,
                    "viewStatus": false,
                    "editable": true,
                    "fieldValue": "",
                    "options": null,
                    "tooltip": null
            }]
        }
        
        if($scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property && $scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property.latitude && $scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property.longitude) {
            var propertyLatitude = $scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property.latitude;
            var propertyLongitude = $scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property.longitude;
            
            $scope.mapItFieldConfig.mapConfig.center.lat = $scope.mapItFieldConfig.mapConfig.marker.lat = propertyLatitude;
            $scope.mapItFieldConfig.mapConfig.center.lon = $scope.mapItFieldConfig.mapConfig.marker.lon = propertyLongitude;
            
            $scope.mapItFieldConfig.mapConfig.marker.name = "Property location";
            
            $scope.mapItFieldConfig.mapConfig.mapZoom = 15;
        }

        $scope.CancelDelete = function () {
            $modalInstance.close();
        }


        $scope.saveValues = function () {            
            var latToUpdate = $filter('filter')($scope.mapItFieldConfig.dataFields, {
                fieldName: 'latitude'
            }, true)[0]["fieldValue"];
            latToUpdate = typeof latToUpdate == "string" ?  parseFloat(latToUpdate) : latToUpdate;            
            latToUpdate = Number(latToUpdate.toFixed(6));

            var lonToUpdate = $filter('filter')($scope.mapItFieldConfig.dataFields, {
                fieldName: 'longitude'
            }, true)[0]["fieldValue"];
            lonToUpdate = typeof lonToUpdate == "string" ?  parseFloat(lonToUpdate) : lonToUpdate;            
            lonToUpdate = Number(lonToUpdate.toFixed(6));
            
            var propGuid = $scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property.propertyGuid;

            var data = {
                "latitude": latToUpdate,
                "longitude": lonToUpdate,
                "geocodeSource": "GOOGLE"
            };

            // Need call property service to update changed latitude/longitude

            GeneralInformationAPI.updateLatLong(propGuid, data).then(function (result) {
                $scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property.latitude = latToUpdate;
                $scope.$parent.portfolioOrderController.portfolioData.reports[reportIndex].property.longitude = lonToUpdate;

                $modalInstance.close();
            }, function (error) {
                self.latlongUserMsgAlertClass = "alert-danger";
                self.latlongUserMsg = "Could not update Latitude and Longitude.";
            });
        }
    }
}]);