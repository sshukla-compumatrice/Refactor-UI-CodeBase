angular.module('AccountMgmtModule').controller('parcelViewCtrl', ['$rootScope', '$scope', 'CompanyServiceAPI', 'OfficeServiceAPI', '$window', '$modal', '$stateParams', '$window', '$state', '$location', 'companyData', '$timeout', 'ListingsAPI', '$filter', 'commonFactory', 'reportTypes', 'setupTypeList', 'companyTemplates', function ($rootScope, $scope, CompanyServiceAPI, OfficeServiceAPI, $window, $modal, $stateParams, $window, $state, $location, companyData, $timeout, ListingsAPI, $filter, commonFactory, reportTypes, setupTypeList, companyTemplates) {

    var self = this;
    self.cid = $stateParams.companyguid;
    self.reportTypes = [];
    self.setupTypeList = [];
    self.companyTemplates = [];
    self.reportTemplates = [];

    self.TsToDate = function (ts, separator) {
        var d = new Date(ts);
        var month = d.getMonth() + 1;
        month = (month / 10 < 1) ? "0" + month : month;
        var day = d.getDate();
        day = (day / 10 < 1) ? "0" + day : day;

        switch (separator) {
        case '-':
            return d.getFullYear() + '-' + month + '-' + day;
            break;
        case '/':
            return d.getFullYear() + '/' + month + '/' + day;
            break;
        default:
            return ts;
        }
    }

    var todayDate = new Date();
    var yyyyddmmDate = self.TsToDate(todayDate, '-');

    $scope.$watchCollection('[parcelCtrl.showAddNewSetupItem, parcelCtrl.showAddNewRate, parcelCtrl.showAddNewDiscount]', function (newValues, oldValues) {
        if (newValues[0] != oldValues[0] && !newValues[0])
            self.cancelAddNewSetupItem();
        if (newValues[1] != oldValues[1] && !newValues[1])
            self.cancelAddNewRate();
        if (newValues[2] != oldValues[2] && !newValues[2])
            self.cancelAddNewDiscount();
    });


    function init() {
        self.parentcompanyguid = "none";
        self.companyguid = $location.search().companyguid;
        $state.current.breadcrumb.skip = false;
        $state.current.breadcrumb.label = $rootScope.companyCrumbTitle;
        //Code to support Breadcrumb ends here

        //Code to view company Information. Author-SWalunj@edrnet.com
        if (!!companyData && !!companyData.companies) {
            self.companyData = companyData.companies[0];
            $rootScope.parentCompanyCrumbTitle = self.companyData.name;

            // Setting components of company
            var component = self.companyData.applicationComponentType ? self.companyData.applicationComponentType : "";
            var componentItems = " (";
            if (self.companyData.companyApplicationComponentItems) {
                componentItems += self.companyData.companyApplicationComponentItems.map(function (elem) {
                    return elem.applicationComponentItemName;
                }).join(", ");
            }
            componentItems += ')'
            self.companyData.component = component + componentItems;

            // Setting functions of company
            if (self.companyData.companyTypes) {
                self.companyData.function = self.companyData.companyTypes.map(function (elem) {
                    return elem.companyType;
                }).join(", ");
            }

            // Setting Headquarters of company
            if (self.companyData.headquarterCompanyOfficeGUID) {
                if (self.companyData.offices.length > 0) {
                    self.compHeadqtr = self.companyData.offices.filter(function (item) {
                        return item.companyOfficeGUID == self.companyData.headquarterCompanyOfficeGUID //compare type or guid
                    })[0];
                    if (self.compHeadqtr)
                        self.companyData.companyHeadquartersType = self.compHeadqtr.officeName;
                }
            }

            // Setting certificates of company
            if (self.companyData.certifications.length > 0) {
                self.compCertList = self.companyData.certifications.map(function (elemt) {
                    return elemt.certificationType;
                }).join(", ");
            }

            self.parentcompanyguid = self.companyData.parentCompanyGUID ? self.companyData.parentCompanyGUID : "none";
        }

        self.reportTypes = reportTypes;
        self.setupTypeList = setupTypeList;
        self.companyTemplates = companyTemplates;
    }

    init();

    //***************** Setup items section *****************//
    self.setupItemAdd = {
        companyGUID: self.cid,
        setupType: "",
        price: "",
        comments: ""
    }

    drawSetupItemTable();

    function drawSetupItemTable() {
        CompanyServiceAPI.getSetupFees(self.cid).then(function (resp) {
            self.setupItems = resp.setupFees;

            if (self.setupTypeList) {
                for (var i = 0; i < self.setupItems.length; i++) {
                    for (var j = 0; j < self.setupTypeList.length; j++) {
                        if (self.setupItems[i].setupType == self.setupTypeList[j].guid) {
                            self.setupItems[i].setupTypeName = self.setupTypeList[j].name;
                            break;
                        }
                    }
                }
            }

            self.setupItemsCopy = angular.copy(self.setupItems);
            self.editSetupItems = false;
            self.hideSetupItemsOptions = false;
        });
    }

    self.editSetupItemsTable = function () {
        self.editSetupItems = true;
        self.showSetupItemsMsg = false;
        self.hideSetupItemsOptions = true;
        self.showAddNewSetupItem = false;
		$('[data-toggle="tooltip"]').tooltip();
    }

    self.cancelEditSetupItems = function () {
        self.editSetupItems = false;
        self.showSetupItemsMsg = true;
        self.setupItemsMessage = "Editing was cancelled.";
        self.setupItemsAlertType = "alert-danger";
        self.setupItems = angular.copy(self.setupItemsCopy);
        self.hideSetupItemsOptions = false;
    }

    self.cancelAddNewSetupItem = function () {
        self.setupItemAdd = {
            companyGUID: self.cid,
            setupType: "",
            price: "",
            comments: ""
        }
        self.showAddNewSetupItem = false;
        commonFactory.clearFieldValidation('addSetupForm');
    }

    self.saveNewSetupItem = function (form) {
        if (form.$valid) {
            var newSetupItem = {
                setupFee: self.setupItemAdd
            };
            CompanyServiceAPI.addSetupItem(newSetupItem, self.cid).then(function (resp) {
                if (resp.data && resp.data.rates == null) {
                    self.showSetupItemsMsg = true;
                    self.setupItemsMessage = "Error: Could not add a new setup item. " + resp.data.message.userMessage;
                    self.setupItemsAlertType = "alert-danger";
                } else {
                    self.showSetupItemsMsg = true;
                    self.setupItemsMessage = "The new setup item was added successfully.";
                    self.setupItemsAlertType = "alert-success";
                    self.cancelAddNewSetupItem();
                }
                drawSetupItemTable();
            });
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.updateSetupItems = function (form) {
        if (form.$valid) {
            if (form.$dirty) {
                var items = [];
                var obj = {};
                for (var i = 0; i < self.setupItems.length; i++) {
                    obj = {};
                    obj.setupFeeGUID = self.setupItems[i].setupFeeGUID;
                    obj.setupType = self.setupItems[i].setupType;
                    obj.price = self.setupItems[i].price;
                    obj.comments = self.setupItems[i].comments;
                    items.push(obj);
                }
                CompanyServiceAPI.updateSetupItems({
                    "setupFees": items
                }, self.cid).then(function (resp) {
                    if (resp.data && resp.data.message) {
                        self.showSetupItemsMsg = true;
                        self.setupItemsMessage = "Error: Could not update setup items. " + resp.data.message.userMessage;
                        self.setupItemsAlertType = "alert-danger";
                    } else {
                        self.showSetupItemsMsg = true;
                        self.setupItemsMessage = "Setup items updated successfully.";
                        self.setupItemsAlertType = "alert-success";
                    }
                    drawSetupItemTable();
                });
            } else {
                self.showSetupItemsMsg = true;
                self.setupItemsMessage = "Nothing to update.";
                self.setupItemsAlertType = "alert-danger";
            }
        } else {
            var inputElements = document.getElementsByName('setupTableForm');
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }


    self.deleteSetupItem = function (setupType, setupFeeGUID) {
        setupType = self.setupTypeList.filter(function (item) {
            return item.name == setupType;
        })[0];
        var modalContainer = {
            enityName: setupType.name,
            enityType: 'setup item',
            setupFeeGUID: setupFeeGUID,
            cid: self.cid
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: setupItemDeleteCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });
    }

    var setupItemDeleteCtrl = function ($scope, $modalInstance, data) {
        $scope.toDelete = {
            enityName: data.enityName,
            enityType: data.enityType,
            showMsg: true
        };
        $scope.deleteEntity = function () {
            var name = $scope.toDelete.enityName;
            var promise = CompanyServiceAPI.deleteSetupFee(data.setupFeeGUID, data.cid);
            promise.then(function (resp) {
                if (resp.data && resp.data.message) {
                    $scope.$parent.parcelCtrl.showSetupItemsMsg = true;
                    $scope.$parent.parcelCtrl.setupItemsMessage = "Error: Could not delete the setup item. " + resp.data.message.userMessage;
                    $scope.$parent.parcelCtrl.setupItemsAlertType = "alert-danger";
                } else {
                    $scope.$parent.parcelCtrl.showSetupItemsMsg = true;
                    $scope.$parent.parcelCtrl.setupItemsMessage = "The setup item was deleted successfully.";
                    $scope.$parent.parcelCtrl.setupItemsAlertType = "alert-success";
                }
                $modalInstance.close();
                drawSetupItemTable();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.sendFeesToAbsCtrl = function ($scope, $modalInstance, companyHeadquarterOfficeData) {
        $scope.headquarterOfficeData = {};
        if (companyHeadquarterOfficeData && 'offices' in companyHeadquarterOfficeData) {
            $scope.sendToAbsFormData = angular.copy(companyHeadquarterOfficeData.offices[0]);
        }

        if (self.setupTypeList && self.setupItems) {
            $scope.charges = angular.copy(self.setupTypeList);
            var projectNo = [];
            for (var i = 0; i < $scope.charges.length; i++) {
                for (var j = 0; j < self.setupItems.length; j++) {
                    if ($scope.charges[i].name.localeCompare(self.setupItems[j].setupType) == 0) {
                        $scope.charges[i].isSelected = false;
                        $scope.charges[i].price = self.setupItems[j].price;

                        if (parseInt(self.setupItems[j].price) > 0) {
                            $scope.charges[i].isSelected = true;
                            projectNo.push($scope.charges[i].name);
                        }
                    }
                }
            }
            if (projectNo.length) {
                $scope.sendToAbsFormData.projectNumber = "PARCEL " + projectNo.join('/');
            }
        }

        $scope.submitFeesToAbs = function (form) {
            if (form.$valid) {
                var setupFeeCharges = [];
                var obj = {};
                var sendToAbsData = {};

                if ($scope.charges) {
                    for (var i = 0; i < $scope.charges.length; i++) {
                        obj = {};
                        if ($scope.charges[i].isSelected) {
                            obj.setupFeeGUID = $scope.charges[i].guid;
                            //obj.price = $scope.charges[i].price;
                            setupFeeCharges.push(obj);
                        }
                    }
                }

                if (setupFeeCharges.length) {
                    sendToAbsData.accountNumber = $scope.sendToAbsFormData.edrAccountNumber;
                    sendToAbsData.password = $scope.sendToAbsFormData.edrAccountPassword;
                    sendToAbsData.projectNumber = $scope.sendToAbsFormData.projectNumber;
                    sendToAbsData.poNumber = $scope.sendToAbsFormData.poNumber ? $scope.sendToAbsFormData.poNumber : "";
                    sendToAbsData.contactName = $scope.sendToAbsFormData.contactName;
                    sendToAbsData.contactPhone = $scope.sendToAbsFormData.contactPhone;
                    sendToAbsData.contactAddress = $scope.sendToAbsFormData.address;
                    sendToAbsData.contactCity = $scope.sendToAbsFormData.city;
                    sendToAbsData.contactState = $scope.sendToAbsFormData.state;
                    sendToAbsData.contactZip = $scope.sendToAbsFormData.zipCode;
                    sendToAbsData.setupFees = setupFeeCharges;

                    CompanyServiceAPI.sendInvoice(self.companyguid, sendToAbsData).then(function (response) {
                        $modalInstance.close();
                        if (response.data) {
                            $rootScope.alertClass = 'alert-danger';
                            $rootScope.userMessage = "Error: Unable to send setup fees to ABS. " + response.data.message.userMessage;
                            $rootScope.skipMsgClear = false;
                        } else {
                            $rootScope.alertClass = 'alert-success';
                            $rootScope.userMessage = "Setup Fees are successfully sent to ABS.";
                            $rootScope.skipMsgClear = false;
                        }
                        window.scroll(0, 0);
                    });
                } else {
                    $scope.showSendToAbsChargesMsg = true;
                    $scope.sendToAbsChargesClass = "alert-danger";
                    $scope.sendToAbsChargesMessage = "You must select at least one charge to send to ABS.";
                }
            } else {
                var inputElements = document.getElementsByName(form.$name);
                angular.element(inputElements).find('input, select').trigger('blur');
            }
        }

        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.sendFeesToABS = function () {
            $modal.open({
                templateUrl: 'sendFeesToABS.html',
                scope: $scope,
                controller: self.sendFeesToAbsCtrl,
                size: 'lg',
                resolve: {
                    companyHeadquarterOfficeData: function (OfficeServiceAPI) {
                        if (self.companyData.headquarterCompanyOfficeGUID) {
                            return OfficeServiceAPI.getOfficeData(self.companyData.companyGUID, self.companyData.headquarterCompanyOfficeGUID);
                        } else {
                            return false;
                        }
                    }
                }
            });
        }
        //***************** Setup items section end *****************//


    //***************** Current Pricing section *****************//
    self.currentPricingMessage = "";

    self.pricingAdd = {
        companyGUID: self.cid,
        reportType: "",
        templateID: "",
        templateGUID: "",
        name: "",
        amount: "",
        currencyType: "USD"
    }

    drawCurrentPricingTable();

    function drawCurrentPricingTable() {
        CompanyServiceAPI.getCompanyRates(self.cid).then(function (resp) {
            self.currentPricings = resp.rates;
            self.currentPricingsCopy = angular.copy(self.currentPricings);
            self.editCurrentPricing = false;
            self.hideCurrentPricingOptions = false;
        });
    }

    self.editCurrentPricingTab = function () {
        self.editCurrentPricing = true;
        self.showCurrentPricingMsg = false;
        self.hideCurrentPricingOptions = true;
        self.showAddNewRate = false;
		$('[data-toggle="tooltip"]').tooltip();
    }

    self.cancelCurrentPricingTab = function () {
        self.editCurrentPricing = false;
        self.showCurrentPricingMsg = true;
        self.currentPricingMessage = "Editing was cancelled.";
        self.currentPricingAlertType = "alert-danger";
        self.currentPricings = angular.copy(self.currentPricingsCopy);
        self.hideCurrentPricingOptions = false;
    }

    self.cancelAddNewRate = function () {
        self.pricingAdd = {
            companyGUID: self.cid,
            reportType: "",
            templateID: "",
            templateGUID: "",
            name: "",
            amount: "",
            currencyType: "USD"
        }
        self.showAddNewRate = false;
        self.reportTemplates = [];
        commonFactory.clearFieldValidation('currentPricingForm');
    }

    self.getReportTemplates = function (reportType) {
        self.pricingAdd.templateGUID = "";
        self.reportTemplates = [];
        if (reportType && self.companyTemplates && self.companyTemplates.length) {
            self.reportTemplates = $filter('filter')(self.companyTemplates, {
                reportTypeValue: reportType
            }, true);
        }
    }

    self.filterTemplateName = function (templateGuid) {
        var filteredTemplate = $filter('filter')(self.companyTemplates, {
            templateGUID: templateGuid
        }, true);

        if (filteredTemplate.length)
            return filteredTemplate[0].name;

        return;
    }

    self.saveNewCurrentPricing = function (form) {
        if (form.$valid) {
            var newRateData = {
                rates: [self.pricingAdd]
            };
            CompanyServiceAPI.addCompanyRate(newRateData, self.cid).then(function (resp) {
                if (resp.data && resp.data.rates == null) {
                    self.showCurrentPricingMsg = true;
                    self.currentPricingMessage = "Error: Could not add a new rate. " + resp.data.message.userMessage;
                    self.currentPricingAlertType = "alert-danger";
                } else {
                    self.showCurrentPricingMsg = true;
                    self.currentPricingMessage = "The new rate was added successfully.";
                    self.currentPricingAlertType = "alert-success";
                    self.cancelAddNewRate();
                }
                drawCurrentPricingTable();
            });
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.updateCurrentPricingTab = function (form) {
        if (form.$valid) {
            if (form.$dirty) {
                var rates = [];
                var obj = {};
                for (var i = 0; i < self.currentPricings.length; i++) {
                    obj = {};
                    obj.rateGUID = self.currentPricings[i].rateGUID;
                    obj.reportType = self.currentPricings[i].reportType;
                    obj.templateID = self.currentPricings[i].templateID;
                    obj.templateGUID = self.currentPricings[i].templateGUID;
                    obj.name = self.currentPricings[i].name;
                    obj.amount = self.currentPricings[i].amount;
                    obj.currencyType = self.currentPricings[i].currencyType;
                    rates.push(obj);
                }
                CompanyServiceAPI.updateCompanyRates({
                    "rates": rates
                }, self.cid).then(function (resp) {
                    if (resp.data && resp.data.message) {
                        self.showCurrentPricingMsg = true;
                        self.currentPricingMessage = "Error: Could not update pricing. " + resp.data.message.userMessage;
                        self.currentPricingAlertType = "alert-danger";
                    } else {
                        self.showCurrentPricingMsg = true;
                        self.currentPricingMessage = "Pricing updated successfully.";
                        self.currentPricingAlertType = "alert-success";
                    }
                    drawCurrentPricingTable();
                });
            } else {
                self.showCurrentPricingMsg = true;
                self.currentPricingMessage = "Nothing to update.";
                self.currentPricingAlertType = "alert-danger";
            }
        } else {
            var inputElements = document.getElementsByName('currentPricingTableForm');
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.deletePricing = function (pricingName, rateGUID) {
        var modalContainer = {
            enityName: pricingName,
            enityType: 'current Pricing item',
            rateGUID: rateGUID,
            cid: self.cid
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: pricingDeleteCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });
    }

    var pricingDeleteCtrl = function ($scope, $modalInstance, data) {
            $scope.toDelete = {
                enityName: data.enityName,
                enityType: data.enityType,
                showMsg: true
            };
            $scope.deleteEntity = function () {
                var name = $scope.toDelete.enityName;
                var promise = CompanyServiceAPI.deleteCompanyRate(data.rateGUID, data.cid);
                promise.then(function (resp) {
                    if (resp.data && resp.data.message) {
                        $scope.$parent.parcelCtrl.showCurrentPricingMsg = true;
                        $scope.$parent.parcelCtrl.currentPricingMessage = "Error: Could not delete the rate. " + resp.data.message.userMessage;
                        $scope.$parent.parcelCtrl.currentPricingAlertType = "alert-danger";
                    } else {
                        $scope.$parent.parcelCtrl.showCurrentPricingMsg = true;
                        $scope.$parent.parcelCtrl.currentPricingMessage = "The rate was deleted successfully.";
                        $scope.$parent.parcelCtrl.currentPricingAlertType = "alert-success";
                    }
                    $modalInstance.close();
                    drawCurrentPricingTable();
                });
            }
            $scope.closeModal = function () {
                $modalInstance.close();
            }
        }
        //***************** Current Pricing section End *****************//


    //***************** Discount section *****************//
    self.discountAdd = {
        "reportType": "",
        "templateID": "",
        "templateGUID": "",
        "name": "",
        "discountPercent": "",
        "discountType": "NUMREPORTS",
        "maxNumberOfReports": "",
        "maxNumberOfDays": "",
        "startDate": yyyyddmmDate,
        "expirationTS": ""
    }

    self.getExpirationDate = function (startDate, daysToExpire) {
        var effectiveDate = new Date(startDate);
        var expirationDate = new Date(effectiveDate.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
        return $filter('date')(expirationDate, 'yyyy-MM-dd hh:mm:ss a');
    }

    drawDiscountTable();

    function drawDiscountTable() {
        CompanyServiceAPI.getCompanyDiscount(self.cid).then(function (resp) {
            self.discountTableData = resp.discounts;

            for (var i = 0; i < self.discountTableData.length; i++)
                self.discountTableData[i].startDate = moment(self.discountTableData[i].effectiveTS).format('YYYY-MM-DD');

            self.discountTableDataCopy = angular.copy(self.discountTableData);
            self.editDiscounts = false;
            self.hideDiscountOptions = false;
        });
    }

    self.editDiscountsTable = function () {
        self.editDiscounts = true;
        self.showDiscountsMsg = false;
        self.hideDiscountOptions = true;
        self.showAddNewDiscount = false;
		$('[data-toggle="tooltip"]').tooltip();
    }

    self.cancelEditDiscountsTable = function () {
        self.editDiscounts = false;
        self.showDiscountsMsg = true;
        self.discountsMessage = "Editing was cancelled.";
        self.discountsAlertType = "alert-danger";
        self.discountTableData = angular.copy(self.discountTableDataCopy);
        self.hideDiscountOptions = false;
    }

    self.cancelAddNewDiscount = function () {
        self.discountAdd = {
            "reportType": "",
            "templateID": "",
            "templateGUID": "",
            "name": "",
            "discountPercent": "",
            "discountType": "NUMREPORTS",
            "maxNumberOfReports": "",
            "maxNumberOfDays": "",
            "startDate": yyyyddmmDate,
            "expirationTS": ""
        };
        self.showAddNewDiscount = false;
        commonFactory.clearFieldValidation('discountForm');
    }

    self.saveNewDiscount = function (form) {
        if (form.$valid) {
            if ((self.discountAdd.maxNumberOfReports < 1 || self.discountAdd.maxNumberOfReports > 1000) && self.discountAdd.discountType == 'NUMREPORTS') {
                self.showDiscountsMsg = true;
                self.discountsMessage = "Error: The number of reports must be between 1 and 1000.";
                self.discountsAlertType = "alert-danger";
                $('form[name=discountForm] #reports').parent().addClass('has-error');
                $('form[name=discountForm] #reports').trigger('focus');
            } else if ((self.discountAdd.days < 1 || self.discountAdd.days > 366) && self.discountAdd.discountType == 'TIME') {
                self.showDiscountsMsg = true;
                self.discountsMessage = "Error: The duration of the discount must be between 1 and 366 days.";
                self.discountsAlertType = "alert-danger";
                $('form[name=discountForm] #days').parent().addClass('has-error');
                $('form[name=discountForm] #days').trigger('focus');
            } else {
                if (self.discountAdd.discountType == 'TIME' && self.discountAdd.maxNumberOfDays && self.discountAdd.startDate) {
                    self.discountAdd.maxNumberOfReports = "";
                    var effectiveDt = new Date(self.discountAdd.startDate);
                    self.discountAdd.effectiveTS = $filter('date')(effectiveDt, 'yyyy-MM-dd hh:mm:ss a');
                    self.discountAdd.expirationTS = self.getExpirationDate(effectiveDt, self.discountAdd.maxNumberOfDays);
                } else {
                    self.discountAdd.effectiveTS = self.discountAdd.expirationTS = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss a');
                }
                delete self.discountAdd.startDate;

                var newDiscountData = {
                    discounts: [self.discountAdd]
                };

                CompanyServiceAPI.addCompanyDiscount(newDiscountData, self.cid).then(function (resp) {
                    if (resp.data && resp.data.rates == null) {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "Error: Could not add a new discount. " + resp.data.message.userMessage;
                        self.discountsAlertType = "alert-danger";
                    } else {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "The new discount was added successfully.";
                        self.discountsAlertType = "alert-success";
                        self.cancelAddNewDiscount();
                    }
                    drawDiscountTable();
                });
            }
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.updateDiscountsTable = function (form) {
        if (form.$valid) {
            if (form.$dirty) {
                var discounts = [];
                var obj = {};
                var effectiveDt;
                for (var i = 0; i < self.discountTableData.length; i++) {
                    obj = {};
                    obj.reportType = self.discountTableData[i].reportType;
                    obj.templateID = self.discountTableData[i].templateID;
                    obj.templateGUID = self.discountTableData[i].templateGUID;
                    obj.name = self.discountTableData[i].name;
                    obj.discountPercent = self.discountTableData[i].discountPercent;
                    obj.discountType = self.discountTableData[i].discountType;
                    obj.maxNumberOfReports = self.discountTableData[i].maxNumberOfReports;

                    if (self.discountTableData[i].discountType == 'TIME' && self.discountTableData[i].maxNumberOfDays && self.discountTableData[i].startDate) {
                        obj.maxNumberOfReports = "";
                        effectiveDt = new Date(self.discountTableData[i].startDate);
                        obj.effectiveTS = $filter('date')(effectiveDt, 'yyyy-MM-dd hh:mm:ss a');
                        obj.expirationTS = self.getExpirationDate(effectiveDt, self.discountTableData[i].maxNumberOfDays);
                    } else {
                        self.discountTableData[i].effectiveTS = self.discountTableData[i].expirationTS = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss a');
                    }
                    delete self.discountTableData[i].startDate;

                    discounts.push(obj);
                }
                CompanyServiceAPI.updateCompanyDiscounts({
                    "discounts": discounts
                }, self.cid).then(function (resp) {
                    if (resp.data && resp.data.message) {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "Error: Could not update discounts. " + resp.data.message.userMessage;
                        self.discountsAlertType = "alert-danger";
                    } else {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "Discounts updated successfully.";
                        self.discountsAlertType = "alert-success";
                    }
                    drawDiscountTable();
                });
            } else {
                self.showDiscountsMsg = true;
                self.discountsMessage = "Nothing to update.";
                self.discountsAlertType = "alert-danger";
            }
        } else {
            var inputElements = document.getElementsByName('discountTableForm');
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.deleteDiscount = function (discountName, discountGUID) {
        var modalContainer = {
            enityName: discountName,
            enityType: 'discount item',
            discountGUID: discountGUID,
            cid: self.cid
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: discountDeleteCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });
    }

    var discountDeleteCtrl = function ($scope, $modalInstance, data) {
        $scope.toDelete = {
            enityName: data.enityName,
            enityType: data.enityType,
            showMsg: true
        };
        $scope.deleteEntity = function () {
            var name = $scope.toDelete.enityName;
            var promise = CompanyServiceAPI.deleteCompanyDiscount(data.cid, data.discountGUID);
            promise.then(function (resp) {
                if (resp.data && resp.data.message) {
                    $scope.$parent.parcelCtrl.showDiscountsMsg = true;
                    $scope.$parent.parcelCtrl.discountsMessage = "Error: Could not delete the discount. " + resp.data.message.userMessage;
                    $scope.$parent.parcelCtrl.discountsAlertType = "alert-danger";
                } else {
                    $scope.$parent.parcelCtrl.showDiscountsMsg = true;
                    $scope.$parent.parcelCtrl.discountsMessage = "The discount was deleted successfully.";
                    $scope.$parent.parcelCtrl.discountsAlertType = "alert-success";
                }
                $modalInstance.close();
                drawDiscountTable();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.showCharges = function (discountName) {
        $modal.open({
            templateUrl: "discount-charges-modal.html",
            scope: $scope,
            controller: discountChargesCtrl,
            size: "lg",
            resolve: {
                discountName: function () {
                    return discountName;
                }
            }
        });
    }

    var discountChargesCtrl = function ($scope, $modalInstance, discountName) {
            /* Displaying charges is non-core functionality. Its being hold-off. Plz refer- https://edrnet.atlassian.net/browse/REFSHA-63?focusedCommentId=186453&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-186453 */
            // Need to call a service to GET charges which will be available in future
            $scope.charges = [];
            $scope.discountName = discountName;
            $scope.closeModal = function () {
                $modalInstance.close();
            }
        }
        //***************** Discount section end*****************//

    //currentYearStatus table
    drawCurrentYearStatusTable();

    function drawCurrentYearStatusTable() {
        CompanyServiceAPI.getCurrentYearStatusTable().then(function (resp) {
            self.currentYearStatus = resp;
        });
    }

    $timeout(function () {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });
        });
    });
}]);