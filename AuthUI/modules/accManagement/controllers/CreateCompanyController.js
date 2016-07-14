angular.module('AccountMgmtModule').controller('CreateCompanyCtrl', ['$rootScope', '$scope', 'companyData', '$compile', '$state', '$location', '$timeout', '$log', 'Upload', 'CompanyServiceAPI', '$modal', '$q', '$filter', 'listingTypes', 'UserServiceAPI', 'companyTemplates', 'FileMgmtAPI', '$sce', 'commonFactory', function ($rootScope, $scope, existingCompanyData, $compile, $state, $location, $timeout, $log, Upload, CompanyServiceAPI, $modal, $q, $filter, listingTypes, UserServiceAPI, companyTemplates, FileMgmtAPI, $sce, commonFactory) {

    var scope = $scope;
    var self = this;

    var parentcompanyguid = $state.params.companyguid === "none" ? "" : $state.params.companyguid,
        companyGUID;
    var company = {};
    var selectedCert = [];
    var showAvailableComponents, showCompanyHeadqrts;

    var companyLogoFileBase64 = "";

    function init() {
        self.selectedAssoContact = {};
        self.attachmentFile = {
            "logoCoreFileGUID": "",
            "logoFilePathURL": "",
            "logoFileName": ""
        };
        self.UploadErrorMsg = "";
        self.selectedCompCertificates = {};
        self.compAssoUsers = {};
        self.selectedReportTemplate = [];
        self.checkedShowInPolicy = [];
        self.isEdit = false;
        self.billLender = false;

        self.companyguid = $location.search().companyguid;

        //Setting breadcrumb label on view and edit state
        /*if ($state.current.name == 'accountMgmt.company.view' || $state.current.name == 'accountMgmt.company.edit') {
            if (!self.hasParent) {
                $state.current.breadcrumb.skip = true;
            } else {
                $state.current.breadcrumb.skip = false;
                $state.current.breadcrumb.label = $rootScope.companyCrumbTitle;
            }
        } else {
            $state.current.breadcrumb.skip = false;
            if (existingCompanyData)
                $rootScope.parentCompanyCrumbTitle = existingCompanyData.companies[0].name;
        }*/

        self.companyTypes = listingTypes.companyTypes;
        //add new company
        if ($state.current.name == 'accountMgmt.company.new') {
            self.submitButtonText = "SUBMIT";
            self.showAvailableComponents = self.showCompanyHeadqrts = false;
            self.appComponentTypes = listingTypes.appcomponenttypes;
            self.certTypes = listingTypes.companycerttypes;
            if (existingCompanyData) {
                self.parentCompanyName = existingCompanyData.companies[0].name;
            }
        }
        //edit company
        else if ($state.current.name == 'accountMgmt.company.edit') {
            self.isEdit = true;
            self.submitButtonText = "UPDATE";
            self.appComponentTypes = listingTypes.appcomponenttypes;
            self.showAvailableComponents = self.showCompanyHeadqrts = false;
            self.existingCompanyData = existingCompanyData.companies[0];
            self.certTypes = listingTypes.companycerttypes;
            if (self.existingCompanyData != null && self.existingCompanyData != undefined) {
                assignExistingData();
                self.showCompanyHeadqrts = true;
                var selectedCompType = [];
                angular.forEach(self.existingCompanyData.companyTypes, function (compType, i) {
                    var x = self.companyTypes.filter(function (item) {
                        return item.companyType == compType.companyType
                    }, true)[0];
                    selectedCompType.push(x);
                })
                self.compType = selectedCompType;
                if (self.existingCompanyData.hasOwnProperty('certifications')) {
                    var selectedCertificates = {};
                    for (var i = 0; i < self.existingCompanyData.certifications.length; i++) {
                        selectedCertificates[self.existingCompanyData.certifications[i].certificationTypeGUID] = true;
                        selectedCert.push(self.existingCompanyData.certifications[i].certificationTypeGUID);
                    }
                    self.selectedCompCertificates = selectedCertificates;
                }

                self.applicationComponentType = self.appComponentTypes.filter(function (item) {
                    return item.guid == self.existingCompanyData.applicationComponentTypeGUID
                })[0];
                if (self.applicationComponentType) {
                    var promise = CompanyServiceAPI.getAppComponentItems(self.applicationComponentType.guid);
                    promise.then(function (resp) {
                        //getComponetItemsForComponentType and assign in self.appComponentItems
                        self.appComponentItems = resp.applicationComponentItems;
                        assignAppComponentItem();
                        self.showAvailableComponents = true;
                    })
                }
                $scope.companyNameCrumb = self.existingCompanyData.name;
            }
        }
        //View Company
        else if ($state.current.name == 'accountMgmt.company.view') {
            $scope.tab = 'companyDtls';
            var todayDate = new Date();
            var mmddyyyyDate = ("0" + (todayDate.getMonth() + 1)).slice(-2) + '/' + todayDate.getDate() + '/' + todayDate.getFullYear();
            self.effectiveDateStart = mmddyyyyDate;
            self.effectiveDate = mmddyyyyDate;
            self.expirationDate = ("0" + (todayDate.getMonth() + 1)).slice(-2) + '/' + todayDate.getDate() + '/' + (todayDate.getFullYear() + 1);
            $scope.lenderServiceTab = 'environmental';
            self.reportFee = [];
            self.existingCompanyData = existingCompanyData.companies[0];
            self.compAssoUsers = {};

            var component = self.existingCompanyData.applicationComponentType ? self.existingCompanyData.applicationComponentType : "";
            var componentItems = " (";
            if (self.existingCompanyData.companyApplicationComponentItems) {
                componentItems += self.existingCompanyData.companyApplicationComponentItems.map(function (elem) {
                    return elem.applicationComponentItemName;
                }).join(", ");
            }
            componentItems += ')'
            self.component = component + componentItems;

            self.companyHeadquartersType = '';
            self.function = self.existingCompanyData.companyTypes.map(function (elem) {
                return elem.companyType;
            }).join(",");
            if (self.existingCompanyData.logoFilePathURL) {
                self.isLogoExist = true;
            }
            if (self.existingCompanyData.certifications.length > 0)
                self.compCertList = self.existingCompanyData.certifications.map(function (elemt) {
                    return elemt.certificationType;
                }).join(", ");
            assignExistingData();
            //1.LENDER VENDORS
            self.companyAssociations = self.existingCompanyData.companyAssociations;
            modifyCompAssociationJSON();
            self.compFunctions = self.companyTypes;
            var promiseGetCompList = CompanyServiceAPI.getCompany();
            promiseGetCompList.then(function (data) {
                self.compList = data.companies;
            })

            //2.LENDER SETUP FEES
            self.setupFees = self.existingCompanyData.setupFees;
            self.lenderSetupFeeTypes = listingTypes.lenderSetupFeeTypes;

            //3.Lender Service Groups & Reports
            assignReportSettings();
        } else {}
    }

    init();

    function assignReportSettings() {
        var promises = [];
        self.compTemplates = companyTemplates;
        angular.forEach(self.existingCompanyData.reportSettings, function (report, i) {
            report['templateIndex'] = i;
            if (i % 2 == 0) //custom set, change after getting data from service
            //report.reportType = 'ASTMPCA' ;//'Phase I ESA'; //Environmental Questionnaire';//
                var tempCount = tempCount ? tempCount : 0;
            if (companyTemplates && companyTemplates.length > 0)
                tempCount = self.compTemplates.filter(function (item) {
                    return item.reportType == report.reportType
                }).length;
            if (tempCount > 0)
                report['hasTemplates'] = true;
            else
                report['hasTemplates'] = false;
        })
        self.reportSettings = self.existingCompanyData.reportSettings;
        try {
            self.reportCategory = self.reportSettings.filter(function (item) {
                return item.reportCategory.toLowerCase() == $scope.lenderServiceTab.toLowerCase()
            })[0].reportCategory;
        } catch (e) {
            self.reportCategory = null;
        }
    }

    function assignExistingData() {
        self.companyGUID = self.existingCompanyData.companyGUID;
        self.name = self.existingCompanyData.name;
        self.webAddress = self.existingCompanyData.webAddress;
        self.slogan = self.existingCompanyData.slogan;
        self.edrDataVendorId = self.existingCompanyData.edrDataVendorGUID;
        self.billLender = self.existingCompanyData.billLender;
        self.attachmentFile["logoCoreFileGUID"] = self.existingCompanyData.logoCoreFileGUID;
        self.attachmentFile["logoFileName"] = self.existingCompanyData.logoFileName;
        self.compOffices = self.existingCompanyData.offices;
        if (self.existingCompanyData.headquarterCompanyOfficeGUID) {
            if (self.compOffices.length > 0) {
                self.compHeadqtr = self.compOffices.filter(function (item) {
                    return item.companyOfficeGUID == self.existingCompanyData.headquarterCompanyOfficeGUID //compare type or guid
                })[0];

                if (self.compHeadqtr)
                    self.companyHeadquartersType = self.compHeadqtr.officeName;
            }
        }
    }

    function modifyCompAssociationJSON() {
        angular.forEach(self.companyAssociations, function (association, index) {
            if (association.companyAssociationUsers.length == 0) {
                association.companyAssociationUsers.push("");
            }
        })
    }

    self.getLenderServiceData = function () {
        //assign current tab report to reportSettings
        var currentLenderServiceTab = $scope.lenderServiceTab;
        try {
            self.reportCategory = self.reportSettings.filter(function (item) {
                return item.reportCategory.toLowerCase() == $scope.lenderServiceTab.toLowerCase()
            })[0].reportCategory;
        } catch (e) {
            self.reportCategory = null;
        }
    }

    self.setSetupType = function (e) {
        self.setupCost = 0;
    }

    self.setApplicationComponentType = function (e) {
        if (self.applicationComponentType) {
            //get appcomponetsItem for appcomponentType
            var promise = CompanyServiceAPI.getAppComponentItems(self.applicationComponentType.guid);
            promise.then(function (resp) {
                //getComponetItemsForComponentType and assign in self.appComponentItems
                if (resp.applicationComponentItems) {
                    self.appComponentItems = resp.applicationComponentItems;
                    assignAppComponentItem();
                } else {
                    self.appComponentItems = [];
                }
            })
        } else {
            self.showAvailableComponents = false;
        }
    }

    function assignAppComponentItem() {
        angular.forEach(self.appComponentItems, function (item, i) {
            if ($state.current.name == "accountMgmt.company.new") {
                item['isChecked'] = true;
            }
            if ($state.current.name == "accountMgmt.company.edit") {
                var checkedItem = self.existingCompanyData.companyApplicationComponentItems.filter(function (checkedItem) {
                    return item.guid == checkedItem.applicationComponentItemGUID
                });
                if (checkedItem.length > 0) {
                    item['isChecked'] = true;
                } else
                    item['isChecked'] = false;
            }
        })
        self.showAvailableComponents = true;
    }

    self.checkedAvailApplicationComponentTypeItem = function (e, value) {
        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;

        if (elem.checked) {
            angular.forEach(self.appComponentItems, function (item, i) {
                if (value.guid == item.guid) {
                    self.appComponentItems[i].isChecked = true;
                }
            })
        } else {
            angular.forEach(self.appComponentItems, function (item, i) {
                if (value.guid == item.guid) {
                    self.appComponentItems[i].isChecked = false;
                }
            })
        }
    }

    self.checkedcert = function (e, value) {
        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;

        if (elem.checked) {
            selectedCert.push(value)
        } else {
            for (var i = 0; i < selectedCert.length; i++) {
                if (selectedCert[i] == value) {
                    selectedCert.splice(i, 1);
                }
            }
        }
    }

    function getGcd(val1, val2) {
        if (val2 == 0)
            return val1;
        return getGcd(val2, val1 % val2)
    }

    self.checkFile = function (file, invalidFiles, form, event) {
        self.UploadErrorMsg = "";
        var hwGcd;
        if (invalidFiles.length > 0) {
            var msg = "<strong>File Name:</strong> " + invalidFiles[0].name;
            switch (invalidFiles[0].$error.toLowerCase()) {
            case "pattern":
                msg += "<br><strong>File type:</strong> " + invalidFiles[0].type;
                msg += "<br><strong>Error:</strong> File format is incorrect.";
                break;
            case "maxsize":
            case "maxtotalsize":
                msg += "<br><strong>File size:</strong> " + invalidFiles[0].size / 1000 + " KB";
                msg += "<br><strong>Error:</strong> Image size is incorrect.";
                break;
            case "ratio":
                hwGcd = getGcd(invalidFiles[0].$ngfWidth, invalidFiles[0].$ngfHeight);
                msg += "<br><strong>Aspect ratio:</strong> " + invalidFiles[0].$ngfWidth / hwGcd + ":" + invalidFiles[0].$ngfHeight / hwGcd;
                msg += "<br><strong>Error:</strong> Image aspect ratio is incorrect.";
                break;
            }
            self.UploadErrorMsg = $sce.trustAsHtml(msg);            
        } else {
            var input = event.target;
            if (input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    companyLogoFileBase64 = commonFactory.removeNoiseFromDataUrlOfBase64(e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }            
        }
    }

    self.uploadFile = function (companyGUID, companyData) {
        var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
        var fileguid = '';
        if ($state.$current.name == "accountMgmt.company.edit") {
            fileguid = self.attachmentFile.logoCoreFileGUID;
        }
        var logoFile = self.logoFile;
        if (!logoFile || logoFile == null) {
            self.UploadErrorMsg = "<strong>Error:</strong> Please attach files before trying to upload.";
            return;
        } else {
            var basePath = "/Accounts/Companies/" + companyGUID;
            var category = "Company Logo";
            var promise = FileMgmtAPI.uploadFile(logoFile, 'DISABLE', "", "TIER1", basePath, fileguid);
            promise.progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }),
                promise.success(function (data, status, headers, config) {
                    if (data) {
                        self.attachmentFile["logoCoreFileGUID"] = data.file.fileGUID;
                        self.attachmentFile["logoFileName"] = data.file.fileName;
                        companyData.company.logoCoreFileGUID = self.attachmentFile.logoCoreFileGUID;
                        companyData.company.logoFileName = self.attachmentFile.logoFileName;
                        companyData.company.certifications = updateCompCertificates();
                        companyData.company.companyApplicationComponentItems = updateCompAppComponentItems();

                        CompanyServiceAPI.updateCompany(companyGUID, companyData).then(function (resp) {
                            if (resp.config) {
                                FileMgmtAPI.deleteFile(self.attachmentFile["logoCoreFileGUID"]);
                            } else {
                                redirectAfterAddEdit(companyGUID, true);
                            }
                        });
                    }
                }),
                promise.error(function (data, status, headers, config) {
                    accessMgmtFactoryLogger.error(config);
                });
        }
    }

    self.saveCompanyData = function (form) {
        if (form.$valid) {
            addEditCompany();
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            inputElements[0].querySelector('.ng-invalid').focus();
            if (angular.element(inputElements[0].querySelector('.ng-invalid')).css("display") == "none") {
                angular.element(inputElements[0].querySelector('.ng-invalid').parentElement).find(':input').focus();
            }
        }
    }

    function addEditCompany() {
        var logoFileGUID = "";
        if (self.attachmentFile.logoCoreFileGUID)
            logoFileGUID = self.attachmentFile.logoCoreFileGUID;
        var compTypes = [];
        if (self.compType) {
            angular.forEach(self.compType, function (comptype, i) {
                var companyTp = {};
                companyTp["companyType"] = comptype.companyType;
                compTypes.push(companyTp);
            });
        }
        var certifications = getCompanyCertificationObj();
        var companyApplicationComponentItems = getCompanyApplicationCompItemsObj();

        var company = {
            "name": self.name,
            "applicationComponentTypeGUID": self.applicationComponentType.guid,
            "applicationComponentType": self.applicationComponentType.name,
            "isEnabled": true,
            "parentCompanyGUID": parentcompanyguid,
            "webAddress": self.webAddress ? self.webAddress : "",
            "slogan": self.slogan ? self.slogan : "",
            "edrDataVendorID": self.edrDataVendorId ? self.edrDataVendorId : "",
            "billLender": self.billLender ? true : false,
            "logoCoreFileGUID": logoFileGUID,
            "logoFileName": "",
            "companyTypes": compTypes,
            "certifications": certifications,
            "companyApplicationComponentItems": companyApplicationComponentItems
        };
        if (self.compHeadqtr && self.compHeadqtr.companyOfficeGUID) {
            company["headquarterCompanyOfficeGUID"] = self.compHeadqtr.companyOfficeGUID;
        }
        var companyData = {
            "company": company
        };
        var name = self.name;
        var detail = 'none';
        if ($state.current.name == "accountMgmt.company.new") {
            companyData.company.logoFile = companyLogoFileBase64 ? companyLogoFileBase64 : null;
            companyData.company.logoFileName = self.logoFile ? self.logoFile.name : "";
            var promise = CompanyServiceAPI.createCompany(companyData);
            promise.then(function (data) {
                if (data.company) {
                    $rootScope.skipMsgClear = true;
                    $rootScope.alertClass = "alert-success";
                    $rootScope.userMessage = "The <strong>" + companyData.company.name + "</strong> company is created successfully.";
                    redirectAfterAddEdit(data.company.companyGUID, true);
                    /*if (self.logoFile) {
                        self.uploadFile(data.company.companyGUID, companyData);
                    } else {
                        redirectAfterAddEdit(data.company.companyGUID, true);
                    }*/
                } else if (data.data.message) {
                    $rootScope.alertClass = "alert-danger";
                    $rootScope.userMessage = "Problem in creating new company. " + data.data.message.userMessage;
                    window.scrollTo(0, 0);
                } else {
                    $rootScope.alertClass = "alert-danger";
                    $rootScope.userMessage = "We encountered a problem while processing your request. Please try again.";
                    window.scrollTo(0, 0);
                }
            })
        } else {
            if (self.existingCompanyData) {
                addEditCompanyGUID = self.existingCompanyData.companyGUID;
            } else {
                return;
            }

            if (self.logoFile) {
                self.uploadFile(self.existingCompanyData.companyGUID, companyData);
            } else {
                var promise = CompanyServiceAPI.updateCompany(addEditCompanyGUID, companyData);
                promise.then(function (data) {
                    if (data.length == 0) {
                        $rootScope.skipMsgClear = true;
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "The <strong>" + self.existingCompanyData.name + "</strong> company is updated successfully.";
                        redirectAfterAddEdit(addEditCompanyGUID, true);
                    } else if (data.data.message) {
                        $rootScope.alertClass = 'alert-danger';
                        $rootScope.userMessage = "Problem in updating <strong>" + self.existingCompanyData.name + "</strong> company. " + data.data.message.userMessage;
                        window.scrollTo(0, 0);
                    } else {
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "We encountered a problem while processing your request. Please try again.";
                        window.scrollTo(0, 0);
                    }
                });
            }
        }
    }

    redirectAfterAddEdit = function (companyGUID, successState) {
        if (successState) {
            var view = 'viewParcel';
            var isLenderCompany = self.compType.filter(function (item) {
                return item.companyType == 'Lender';
            });
            if (isLenderCompany.length)
                view = 'view';
            $state.go('accountMgmt.company.' + view, {
                companyguid: companyGUID
            })
        } else {
            if (self.companyguid == 'none') {
                $state.go('accountMgmt.company.parentcompanieslist');
            } else {
                $state.go('accountMgmt.company.list', {
                    companyguid: self.companyguid,
                });
            }
        }
    }

    var getCompanyCertificationObj = function () {
        var objCertification;
        if ($state.current.name == "accountMgmt.company.new") {
            objCertification = createCompCertificates();
        } else {
            objCertification = updateCompCertificates();
        }
        return objCertification;
    }

    var getCompanyApplicationCompItemsObj = function () {
        var objCompanyApplicationCompItem;
        if ($state.current.name == "accountMgmt.company.new") {
            objCompanyApplicationCompItem = createCompAppComponentItems();
        } else {
            objCompanyApplicationCompItem = updateCompAppComponentItems();
        }
        return objCompanyApplicationCompItem;
    }

    var createCompAppComponentItems = function (companyGUID) {
        var companyApplicationComponentItems = [];
        angular.forEach(self.appComponentItems, function (appItem, i) {
            var appItemObj = {
                "applicationComponentItemGUID": appItem.guid,
                "applicationComponentItemName": appItem.name
            }
            if (appItem.isChecked) {
                companyApplicationComponentItems.push(appItemObj);
            }
        })

        return companyApplicationComponentItems;
    }

    var createCompCertificates = function (companyGUID) {
        var certifications = [];
        angular.forEach(selectedCert, function (item, i) {
            var certType = self.certTypes.filter(function (certtype) {
                return certtype.guid == item
            })[0];
            if (certType.name) {
                var cert = {
                    "certificationTypeGUID": item,
                    "certificationType": certType.name
                }
                certifications.push(cert);
            }
        })
        return certifications;
    }

    var updateCompAppComponentItems = function () {
        var companyApplicationComponentItemsAssigned = [];
        var companyApplicationComponentItemsUnassigned = [];
        var requestCompComponentItemObj = {};


        angular.forEach(self.appComponentItems, function (appItems, i) {
            var existItem = false;
            if (self.existingCompanyData && self.existingCompanyData.companyApplicationComponentItems && self.existingCompanyData.companyApplicationComponentItems.length) {
                existItem = self.existingCompanyData.companyApplicationComponentItems.filter(function (item) {
                    return item.applicationComponentItemGUID == appItems.guid
                })[0];
            }
            if (appItems.isChecked) {
                var addItemObj = {
                    "applicationComponentItemGUID": appItems.guid,
                    "applicationComponentItemName": appItems.name
                }
                if (existItem && existItem.companyApplicationComponentItemGUID) {} else
                    companyApplicationComponentItemsAssigned.push(addItemObj);
            } else {
                if (existItem && existItem.companyApplicationComponentItemGUID) {
                    var removeItemObj = {
                        "companyApplicationComponentItemGUID": existItem.companyApplicationComponentItemGUID
                    }
                    companyApplicationComponentItemsUnassigned.push(removeItemObj);
                }
            }
        });
        requestCompComponentItemObj = {
            "clearAll": false,
            "companyApplicationComponentItemsAssigned": companyApplicationComponentItemsAssigned,
            "companyApplicationComponentItemsUnassigned": companyApplicationComponentItemsUnassigned
        }
        if (!companyApplicationComponentItemsAssigned.length && companyApplicationComponentItemsUnassigned.length == self.existingCompanyData.companyApplicationComponentItems.length) {
            requestCompComponentItemObj = {
                "clearAll": true,
                "companyApplicationComponentItemsAssigned": [],
                "companyApplicationComponentItemsUnassigned": []
            }
        }
        return requestCompComponentItemObj;
    }

    var updateCompCertificates = function () {
        var certificationsAssigned = [];
        var certificationsUnassigned = [];
        var requestCertObj = {};

        if (selectedCert && selectedCert.length) {
            angular.forEach(self.certTypes, function (certType, i) {
                var checkedCert = selectedCert.filter(function (item) {
                    return item == certType.guid
                });
                var existCertificate = false;

                if (self.existingCompanyData) {
                    existCertificate = self.existingCompanyData.certifications.filter(function (item) {
                        return item.certificationTypeGUID == certType.guid
                    })[0];
                }

                if (checkedCert.length > 0 && !existCertificate) {
                    var cert = {
                        "certificationTypeGUID": certType.guid,
                        "certificationType": certType.name
                    }
                    certificationsAssigned.push(cert);
                } else if (checkedCert.length <= 0 && existCertificate) {
                    if (existCertificate && existCertificate.certificationTypeGUID) {
                        var cert = {
                            "certificationGUID": existCertificate.certificationGUID,
                            "certificationType": existCertificate.certificationType
                        }
                        certificationsUnassigned.push(cert)
                    }
                } else {}
            });

            requestCertObj = {
                "clearAll": false,
                "certificationsAssigned": certificationsAssigned,
                "certificationsUnassigned": certificationsUnassigned
            }
        } else {
            requestCertObj = {
                "clearAll": true,
                "certificationsAssigned": [],
                "certificationsUnassigned": []
            }
        }

        return requestCertObj;
    }

    self.cancelCompCreate = function () {
        if ($state.current.name == "accountMgmt.company.edit") {
            if (self.existingCompanyData.parentCompanyGUID && self.existingCompanyData.parentCompanyGUID != "" && self.existingCompanyData.parentCompanyGUID != null) {
                $state.go('accountMgmt.company.list', {
                    companyguid: self.existingCompanyData.parentCompanyGUID
                });
            } else {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        } else {
            if (self.companyguid && self.companyguid != "none") {
                $state.go('accountMgmt.company.list', {
                    companyguid: self.companyguid
                });
            } else {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        }
    }

    //C360 Company View: 1. Lender Vendors

    self.disableExpDate = function (form) {
        //self.disableExpDate = true;

        if ($('#expDate').data('datepicker')) {
            $('#expDate').data('datepicker').setDate(null);
            $('#expDate').data('datepicker').setStartDate(self.effectiveDate);
        }
        if (self.effectiveDate) {
            var expDate = new Date(self.effectiveDate);
            self.expirationDate = (expDate.getMonth() + 1) + '/' + expDate.getDate() + '/' + (expDate.getFullYear() + 1);
        }
    }

    function isValidDate(date) {
        var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
        if (matches == null) return false;
        var d = matches[2];
        var m = matches[1] - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;
    }

    self.addCompAssociation = function (form) {
        var detail = 'none';
        if (form.$valid) {
            var effectiveDate = new Date(self.effectiveDate);
            var expirationDate = new Date(self.expirationDate);
            var validEffectiveDate = isValidDate(self.effectiveDate);
            var validExpDate = isValidDate(self.expirationDate);
            if (!validEffectiveDate) {
                var todayDate = new Date();
                var mmddyyyyDate = ("0" + (todayDate.getMonth() + 1)).slice(-2) + '/' + todayDate.getDate() + '/' + todayDate.getFullYear();
                effectiveDate = mmddyyyyDate;
                expirationDate = ("0" + (todayDate.getMonth() + 1)).slice(-2) + '/' + todayDate.getDate() + '/' + (todayDate.getFullYear() + 1);
            }
            if (!validExpDate) {
                var exp_Date = new Date(expirationDate);
                expirationDate = (exp_Date.getMonth() + 1) + '/' + exp_Date.getDate() + '/' + (exp_Date.getFullYear() + 1);
            }
            var selectedCompFromList = self.selectedCompFromList;
            var selectedCompFunction = self.selectedCompFunction;
            var companyAssociation = {
                "companyGUID": self.existingCompanyData.companyGUID,
                "associatedCompanyGUID": selectedCompFromList.companyGUID,
                "associationType": selectedCompFunction.companyType,
                "effectiveTS": new Date(effectiveDate + " UTC").toISOString(), //datetime, //"07-22-2015 08:01:16 AM",
                "expirationTS": new Date(expirationDate + " UTC").toISOString(),
                "isEnabled": true
            }
            var data = {
                "companyAssociation": companyAssociation
            };
            var promise = CompanyServiceAPI.addCompanyAssociation(self.existingCompanyData.companyGUID, detail, data);
            promise.then(function (data) {
                self.showLenderVendorMsg = true;
                if (data.companyAssociation && data.companyAssociation.companyAssociationGUID) {
                    //refresh table or update model data(we are getting companyAssociationGUID to get single assocociation detail);
                    self.alertClassLenderVendors = 'alert-success';
                    self.lenderVendorMsg = 'The company: ' + self.selectedCompFromList.name + ' added successfully to lender group.';
                    var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations(self.existingCompanyData.companyGUID, detail);
                    promiseGetCompAssociations.then(function (resp) {
                        self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                        modifyCompAssociationJSON();
                    })
                } else {
                    self.lenderVendorMsg = "We encountered a problem while processing your request. Please try again.";
                    self.alertClassLenderVendors = 'alert-danger';
                    if (data.data.message)
                        self.lenderVendorMsg = data.data.message.userMessage;
                }
            })
            $scope.showAddCompany = false;
        } else {
            $scope.showAddCompany = true;
            var inputElements = document.getElementsByName(form.$name);
            //angular.element(inputElements).find(':input').trigger('blur');
            inputElements[0].querySelector('.ng-invalid').focus();
        }
    }

    self.resetCompAssociation = function (form) {
        self.selectedCompFunction = null;
        self.selectedCompFromList = null;
        self.effectiveDate = null;
        self.expirationDate = null;
        //form.$valid = true;
        var inputElements = document.getElementsByName(form.$name);
        angular.element(inputElements).find(':input').parent('div').removeClass('has-error');
        angular.element(inputElements).find('span').remove();

    }

    self.deleteCompAssocition = function (companyGUID, companyAssociationGUID, companyName, e) {
        var modalContainer = {
            enityType: 'company from vendor list',
            companyGUID: self.existingCompanyData.companyGUID,
            companyAssociationGUID: companyAssociationGUID,
            enityName: companyName
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: compAssocitionDelCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var compAssocitionDelCtrl = function ($scope, $modalInstance, data) {
        $scope.deleteTitle = 'Delete Company Vendor'
        $scope.toDelete = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            companyAssociationGUID: data.companyAssociationGUID,
            enityName: data.enityName,
            showMsg: true
        };
        $scope.afterDelete = {
            showMsg: false,
            msgAfterDelete: "Deleted",
        };
        $scope.deleteEntity = function () {
            var companyGUID = $scope.toDelete.companyGUID;
            var name = $scope.toDelete.enityName;
            var companyAssociationGUID = $scope.toDelete.companyAssociationGUID;
            var promise = CompanyServiceAPI.deleteCompAssociation(companyGUID, companyAssociationGUID);
            promise.then(function (resp) {
                self.showLenderVendorMsg = true;
                if (resp.length == 0) {
                    self.alertClassLenderVendors = 'alert-success';
                    self.lenderVendorMsg = "Deleted " + $scope.toDelete.enityName;
                    var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations(self.existingCompanyData.companyGUID);
                    promiseGetCompAssociations.then(function (resp) {
                        if (resp.companyAssociations) {
                            self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                            modifyCompAssociationJSON();
                        }
                    })
                } else {
                    self.alertClassLenderVendors = 'alert-danger';
                    self.lenderVendorMsg = 'We encountered a problem while processing your request. Please try again.';
                    if (resp.data.message)
                        self.lenderVendorMsg = resp.data.message.userMessage;
                }
                $modalInstance.close();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.getCompAssoUsers = function (companyGUID, index) {
        if (!self.compAssoUsers[companyGUID]) {
            var promise = UserServiceAPI.getUserInfo(null, companyGUID);
            promise.then(function (resp) {
                if (resp.users)
                    self.compAssoUsers[companyGUID] = resp.users;
            })
        }
    }

    self.addAssoContact = function (e, parentIndex, childIndex, companyGUID, companyAssociationGUID) {
        //console.log('P-index:' + parentIndex + ',C-index:' + childIndex);
        if (self.selectedAssoContact[parentIndex + '_' + childIndex]) {
            var selectedContactGUID = self.selectedAssoContact[parentIndex + '_' + childIndex].userGUID;
            var currentdate = new Date();
            var datetime = currentdate.getFullYear() + "-" + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-" + currentdate.getDate();
            var effectiveTs = new Date(datetime + " UTC").toISOString();
            var expDateTime = (currentdate.getFullYear() + 1) + "-" + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-" + currentdate.getDate();
            var expriationTs = new Date(expDateTime + " UTC").toISOString();
            var companyAssociationUserData = {
                "companyAssociationUser": {
                    "companyAssociationGUID": companyAssociationGUID,
                    "userGUID": selectedContactGUID,
                    "effectiveTS": effectiveTs,
                    "expirationTS": expriationTs,
                    "isEnabled": true
                }
            }
            var promise = CompanyServiceAPI.createCompAssociationUser(companyGUID, companyAssociationGUID, companyAssociationUserData);
            promise.then(function (resp) {
                self.showLenderVendorMsg = true;
                if (resp.companyAssociationUser && resp.companyAssociationUser.companyAssociationUserGUID) {
                    self.alertClassLenderVendors = 'alert-success';
                    self.lenderVendorMsg = 'The contact: ' + self.selectedAssoContact[parentIndex + '_' + childIndex].userName + ' added successfully to vendors group.';
                    var detail = 'none';
                    // get asso-users for particular association
                    var promiseGetCompAssoUsers = CompanyServiceAPI.getCompanyAssoUsers(companyGUID, companyAssociationGUID, detail);
                    promiseGetCompAssoUsers.then(function (resp) {
                        if (resp.companyAssociationUsers) {
                            self.companyAssociations[parentIndex].companyAssociationUsers = resp.companyAssociationUsers;
                            modifyCompAssociationJSON();
                        }
                    })
                } else {
                    self.alertClassLenderVendors = 'alert-danger';
                    self.lenderVendorMsg = 'Failed to add contact: ' + self.selectedAssoContact[parentIndex + '_' + childIndex].userName + ' to vendors group due to ' + resp.data.message.userMessage;
                }

            })
        }

    }

    self.deleteAssoContact = function (e, firstName, lastName, companyGUID, companyAssociationGUID, companyAssociationUserGUID, parentIndex) {
        var modalContainer = {
            enityType: 'contact from vendor list',
            companyGUID: companyGUID,
            companyAssociationGUID: companyAssociationGUID,
            companyAssociationUserGUID: companyAssociationUserGUID,
            enityName: firstName + ' ' + lastName,
            index: parentIndex
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: compAssocitionContactDelCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })

    }

    var compAssocitionContactDelCtrl = function ($scope, $modalInstance, data) {
        $scope.deleteTitle = 'Delete Contact'
        $scope.toDelete = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            companyAssociationGUID: data.companyAssociationGUID,
            companyAssociationUserGUID: data.companyAssociationUserGUID,
            enityName: data.enityName,
            index: data.index,
            showMsg: true
        };
        $scope.afterDelete = {
            showMsg: false,
            msgAfterDelete: "Deleted",
        };
        $scope.deleteEntity = function () {
            var companyGUID = $scope.toDelete.companyGUID;
            var name = $scope.toDelete.enityName;
            var companyAssociationGUID = $scope.toDelete.companyAssociationGUID;
            var companyAssociationUserGUID = $scope.toDelete.companyAssociationUserGUID;
            var promise = CompanyServiceAPI.deleteCompAssoUser(companyGUID, companyAssociationGUID, companyAssociationUserGUID);
            promise.then(function (resp) {
                self.showLenderVendorMsg = true;
                if (resp.length == 0) {
                    self.alertClassLenderVendors = 'alert-success';
                    self.lenderVendorMsg = "Deleted contact: " + $scope.toDelete.enityName;
                    var promiseGetCompAssoUsers = CompanyServiceAPI.getCompanyAssoUsers(companyGUID, companyAssociationGUID);
                    promiseGetCompAssoUsers.then(function (resp) {
                        if (resp.companyAssociationUsers) {
                            self.companyAssociations[$scope.toDelete.index].companyAssociationUsers = resp.companyAssociationUsers;
                            //self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                            modifyCompAssociationJSON();
                        }
                    })
                } else {
                    self.alertClassLenderVendors = 'alert-danger';
                    self.lenderVendorMsg = "We encountered a problem while processing your request. Please try again.";
                    if (resp.data.message)
                        self.lenderVendorMsg = resp.data.message.userMessage;
                }
                //var promiseGetcompAsso = CompanyServiceAPI.getCompanyAssociations(self.existingCompanyData.companyGUID);
                //promiseGetcompAsso.then(function (resp) {
                //self.companyAssociations = resp.companyAssociations;
                //modifyCompAssociationJSON();
                ////$modalInstance.close();
                //})
                $modalInstance.close();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    //C360 Company View: 2. Lender Setup Fees
    self.addSetupFees = function (form) {
        if (form.$valid) {
            var price = self.setupCost == "" ? 0 : self.setupCost;
            var currentdate = new Date();
            var datetime = currentdate.getFullYear() + "-" + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-" + currentdate.getDate();
            var orderGUId;
            var newSetupFees = {
                "setupFee": {
                    "companyGUID": self.existingCompanyData.companyGUID,
                    "setupType": self.selectedSetupItem.name,
                    "price": price,
                    "comments": self.setupComments,
                    "enteredBy": ""
                }
            }
            var promise = CompanyServiceAPI.addSetupFees(self.existingCompanyData.companyGUID, newSetupFees);
            promise.then(function (resp) {
                self.showSetupFeeMsg = true;
                if (resp.setupFee && resp.setupFee.setupFeeGUID) {
                    var promiseGetSetupfees = CompanyServiceAPI.getSetupFees(self.existingCompanyData.companyGUID);
                    self.alertClassSetupFee = 'alert-success';
                    self.setupFeeMsg = 'The Setup item: ' + self.selectedSetupItem.name + " is added successfully.";
                    promiseGetSetupfees.then(function (respSetupFees) {
                        if (respSetupFees.setupFees)
                            self.setupFees = respSetupFees.setupFees; //self.existingCompanyData.setupFees
                    })
                } else {
                    self.alertClassSetupFee = 'alert-danger';
                    self.setupFeeMsg = "We encountered a problem while processing your request. Please try again.";
                    if (resp.data.message)
                        self.setupFeeMsg = resp.data.message.userMessage;
                }
            })
            $scope.showAddSetupFees = false;
        } else {
            $scope.showAddSetupFees = true;
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.lenderDeleteSetupFees = function (companyGUID, setupFeeGUID, e, setupType) {

        var modalContainer = {
            enityType: 'Company SetupFee',
            companyGUID: companyGUID,
            setupFeeGUID: setupFeeGUID,
            enityName: setupType
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: lendercompSetupFeesDelCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var lendercompSetupFeesDelCtrl = function ($scope, $modalInstance, data) {
        $scope.deleteTitle = 'Delete Company'
        $scope.toDelete = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            setupFeeGUID: data.setupFeeGUID,
            enityName: data.enityName,
            showMsg: true
        };
        $scope.afterDelete = {
            showMsg: false,
            msgAfterDelete: "Deleted",
        };
        $scope.deleteEntity = function () {
            var companyGUID = $scope.toDelete.companyGUID;
            var name = $scope.toDelete.enityName;
            var setupFeeGUID = $scope.toDelete.setupFeeGUID;
            var promise = CompanyServiceAPI.lenderDeleteSetupFees(companyGUID, setupFeeGUID);
            promise.then(function (resp) {
                self.showSetupFeeMsg = true;
                if (resp.length == 0) {
                    self.alertClassSetupFee = 'alert-success';
                    self.setupFeeMsg = "Deleted " + $scope.toDelete.enityName;
                    var promiseGetSetupfees = CompanyServiceAPI.getSetupFees(self.existingCompanyData.companyGUID);
                    promiseGetSetupfees.then(function (resp) {
                        if (resp.setupFees)
                            self.setupFees = resp.setupFees;
                    })
                } else {
                    self.alertClassSetupFee = 'alert-danger';
                    self.setupFeeMsg = "We encountered a problem while processing your request. Please try again.";
                    if (resp.data.message)
                        self.setupFeeMsg = resp.data.message.userMessage;
                }
                $modalInstance.close();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.resetSetupFees = function (form) {
        self.setupCost = 0;
        self.selectedSetupItem = null;
        self.setupComments = "";
        var inputElements = document.getElementsByName(form.$name);
        angular.element(inputElements).find(':input').parent('div').removeClass('has-error');
        angular.element(inputElements).find('span').remove();
    }

    self.showSubmitInvoicePopup = function () {
        if (self.setupFees) {
            self.existingCompanyData.headquarterCompanyOfficeGUID = 'a1f5e294-b497-4c16-8fa4-526c9413530f';
            var lenderOfficeDetails = self.existingCompanyData.offices.filter(function (item) {
                return item.companyOfficeGUID == self.existingCompanyData.headquarterCompanyOfficeGUID
            })[0];

            var setupFeesInvoice = self.lenderSetupFeeTypes;
            var selectedSetupFees = self.setupFees;
            angular.forEach(setupFeesInvoice, function (setupInvoiceItem, i) {
                var checkedSetupFees = self.setupFees.filter(function (item) {
                    return item.setupType == setupInvoiceItem.name //filter by Id
                })[0];
                if (checkedSetupFees) {
                    setupInvoiceItem['price'] = checkedSetupFees.price;
                    setupInvoiceItem['setupFeeGUID'] = checkedSetupFees.setupFeeGUID;
                    setupInvoiceItem['companyGUID'] = checkedSetupFees.companyGUID;
                    if (checkedSetupFees.orderGUID && checkedSetupFees.orderGUID != null)
                        setupInvoiceItem['isChecked'] = false;
                    else
                        setupInvoiceItem['isChecked'] = true;
                } else {
                    setupInvoiceItem['isChecked'] = false;
                    setupInvoiceItem['price'] = null;
                    setupInvoiceItem['companyGUID'] = null;
                    setupInvoiceItem['setupFeeGUID'] = null;
                }
            })
            var selectedSetupInvoiceCount = setupFeesInvoice.filter(function (item) {
                return item.isChecked == true
            }).length;
            if (selectedSetupInvoiceCount <= 0) {
                self.checkSubmitInvoice = true;
            } else {
                self.checkSubmitInvoice = false;

                var modalContainer = {
                    enityType: 'report group and services',
                    companyGUID: self.existingCompanyData.companyGUID,
                    enityName: self.existingCompanyData.name,
                    lenderOfficeDetails: lenderOfficeDetails,
                    selectedSetupFees: setupFeesInvoice
                }
                var modalInstance = $modal.open({
                    templateUrl: "lender-submit-invoice-modal.html",
                    scope: $scope,
                    controller: submitInvoiceSaveCtrl,
                    size: 'lg',
                    resolve: {
                        data: function () {
                            return modalContainer;
                        }
                    }
                })
            }
        } else
            self.checkSubmitInvoice = true;

    }

    var submitInvoiceSaveCtrl = function ($scope, $modalInstance, data) {
        $scope.setupFees = data.selectedSetupFees;
        $scope.toSave = {};
        $scope.toSave.showMsg = true;
        if (data.lenderOfficeDetails) {
            $scope.toSave.officeName = data.lenderOfficeDetails.officeName;
            $scope.toSave.edrAccountNumber = data.lenderOfficeDetails.edrAccountNumber;
            $scope.toSave.edrAccountPassword = data.lenderOfficeDetails.edrAccountPassword;
            $scope.toSave.address = data.lenderOfficeDetails.address;
            $scope.toSave.state = data.lenderOfficeDetails.state;
            $scope.toSave.city = data.lenderOfficeDetails.city;
            $scope.toSave.zipCode = data.lenderOfficeDetails.zipCode;
            $scope.toSave.fax = data.lenderOfficeDetails.fax;
        }

        $scope.afterSave = {
            showMsg: false,
            msgAfterSave: "Order Submitted Successfully",
        };

        $scope.showPreviewInvoice = function (invoiceForm) {
            if (invoiceForm.$valid) {
                $scope.showInvoicePreview = true;
            } else {
                $scope.showInvoicePreview = false;
                var inputElements = document.getElementsByName(invoiceForm.$name);
                angular.element(inputElements).find(':input').trigger('blur');
                inputElements[0].querySelector('.ng-invalid').focus();
            }
        }

        $scope.closeModal = function () {
            $modalInstance.close();
        }

        $scope.setshowInvoicePreview = function () {
            $scope.showInvoicePreview = false;
        }

        $scope.total = function () {
            var total = 0;
            angular.forEach($scope.setupFees, function (item) {
                if (item.isChecked)
                    total += item.price;
            })
            return total;
        }

        $scope.submitFees = function () {
            var objSetupFees = [];
            angular.forEach($scope.setupFees, function (submitItem, i) {
                if (submitItem.isChecked && submitItem.setupFeeGUID) {
                    var obj = {
                        "setupFeeGUID": submitItem.setupFeeGUID
                    }
                    objSetupFees.push(obj);
                }
            })
            var requestInvoiceObj = {
                "accountNumber": $scope.toSave.edrAccountNumber,
                "password": $scope.toSave.edrAccountPassword,
                "projectNumber": $scope.toSave.projectNumber,
                "poNumber": $scope.toSave.poNumber,
                "contactName": $scope.toSave.contactName,
                "contactPhone": $scope.toSave.contactPhone,
                "contactFax": $scope.toSave.fax,
                "contactAddress": $scope.toSave.address,
                "contactCity": $scope.toSave.city,
                "contactState": $scope.toSave.state,
                "contactZip": $scope.toSave.zipCode,
                "setupFees": objSetupFees
            }
            var promise = CompanyServiceAPI.sendInvoice(self.existingCompanyData.companyGUID, requestInvoiceObj);
            promise.then(function (resp) {
                if (resp.length == 0) {
                    var promiseGetSetupfees = CompanyServiceAPI.getSetupFees(self.existingCompanyData.companyGUID);
                    promiseGetSetupfees.then(function (respSetupFees) {
                        if (respSetupFees.setupFees)
                            self.setupFees = resp.setupFees; //self.existingCompanyData.setupFees
                    })
                    $scope.toSave.showMsg = false;
                    $scope.afterSave.showMsg = true;
                    $scope.afterSave.msgAfterSave = "Order Submitted Successfully.";
                } else {
                    $scope.afterSave.msgAfterSave = "We encountered a problem while processing your request. Please try again.";
                    if (resp.message.userMessage) {
                        $scope.afterSave.msgAfterSave = "Failed to submit order due to " + resp.message.userMessage;
                    }
                    $scope.toSave.showMsg = false;
                    $scope.afterSave.showMsg = true;
                }
            })
        }
    }

    //C360 Company View: 3. Lender Service Groups & Reports
    self.saveServiceGroupReports = function () {
        var companyReportSettings = self.reportSettings;
        var modalContainer = {
            enityType: 'report group and services',
            companyGUID: self.existingCompanyData.companyGUID,
            companyReportSettings: companyReportSettings,
            enityName: self.existingCompanyData.name
        }
        var modalInstance = $modal.open({
            templateUrl: "company-reports-save-confirmation-modal.html",
            scope: $scope,
            controller: serviceGroupReportsSaveCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var serviceGroupReportsSaveCtrl = function ($scope, $modalInstance, data) {
        $scope.saveTitle = 'Save Reports'
        $scope.toSave = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            reportSettings: data.companyReportSettings,
            enityName: data.enityName,
            showMsg: true
        };
        $scope.afterSave = {
            showMsg: false,
            msgAfterDelete: "Saved",
        };
        $scope.saveEntity = function () {
            var requestReportSettings = [];
            var companyGUID = $scope.toSave.companyGUID;
            var name = $scope.toSave.enityName;
            var reportSettings = $scope.toSave.reportSettings;
            var promises = [];
            angular.forEach($scope.toSave.reportSettings, function (report, i) {
                var obj = {
                    "reportSettingsGUID": report.reportSettingsGUID,
                    "companyGUID": report.companyGUID,
                    "reportType": report.reportType,
                    "fee": report.fee, //self.reportFee[report.templateIndex],
                    "showInPolicy": report.showInPolicy ? report.showInPolicy : false,
                    "showInProcurement": report.showInProcurement ? report.showInProcurement : false,
                    "templateGUID": report.templateGUID ? report.templateGUID : null,
                    "isEnabled": report.isEnabled ? report.isEnabled : false
                }
                requestReportSettings.push(obj);
            })
            var requestReportObj = {
                "reportSettings": requestReportSettings
            };
            var promise = CompanyServiceAPI.updateReportSettings(companyGUID, requestReportObj);
            promise.then(function (resp) {
                self.showReportMsg = true;
                if (resp.length == 0) {
                    var promiseGetReportSettings = CompanyServiceAPI.getCompReportSettings(self.existingCompanyData.companyGUID, "vendors");
                    self.alertClassReports = 'alert-success';
                    self.reportMsg = "Service groups and reports updated successfully for company: '" + $scope.toSave.enityName + "'";
                    promiseGetReportSettings.then(function (respReportSettings) {
                        if (respReportSettings.reportSettings) {
                            self.existingCompanyData.reportSettings = respReportSettings.reportSettings;
                            assignReportSettings();
                        }
                    })
                } else {
                    self.alertClassReports = 'alert-danger';
                    self.showReportMsg = true;
                    self.reportMsg = "We encountered a problem while processing your request. Please try again.";
                    if (resp.data.message)
                        self.reportMsg = resp.data.message.userMessage;
                }
                $modalInstance.close();
            })
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.showReportVendors = function (reportSettingsGUID, templateIndex) {
        //modifyCompAssociationJSON();
        self.reportVendorsList = self.existingCompanyData.companyAssociations;
        var currentReportTypeData = self.reportSettings.filter(function (item) {
            return item.reportSettingsGUID == reportSettingsGUID
        })[0];
        var modalContainer = {
            enityType: 'report group and services',
            companyGUID: self.existingCompanyData.companyGUID,
            enityName: self.existingCompanyData.name,
            reportVendorsList: self.reportVendorsList,
            currentReportSettingsGUID: reportSettingsGUID,
            currentReportTypeData: currentReportTypeData,
            currentReportTemplateIndex: templateIndex
        }
        var modalInstance = $modal.open({
            templateUrl: "update-report-vendors-confirmation-modal.html",
            scope: $scope,
            controller: reportVendorsSaveCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var reportVendorsSaveCtrl = function ($scope, $modalInstance, data) {
        $scope.modalContent = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            enityName: data.enityName,
            reportVendorsList: data.reportVendorsList, //Comp-Associations
            currentReportSettingsGUID: data.currentReportSettingsGUID,
            currentReportTypeData: data.currentReportTypeData,
            currentReportTemplateIndex: data.currentReportTemplateIndex,
            showMsg: true
                //filterType: ['Environmental', 'Appraisal']
        };
        $scope.funFilterType = function (value, index) {
            //Only show for Environmental/Appraisal
            return value.associationType && ['Environmental', 'Appraisal'].indexOf(value.associationType) !== -1;
        }
        $scope.selectedReportVendor = {};
        angular.forEach($scope.modalContent.currentReportTypeData.vendors, function (vendor, i) {
            angular.forEach(vendor.reportSettingsVendorUsers, function (vendorUser, j) {
                $scope.selectedReportVendor[vendorUser.userGUID] = true;
            })
        })
        $scope.afterUpdate = {
            showMsg: false,
            msgAfterUpdate: "Saved",
        };
        $scope.updateEntity = function () {
                var assigned = [],
                    unassigned = [];

                var companyGUID = $scope.modalContent.companyGUID;
                var name = $scope.modalContent.enityName;
                var currentReportTypeData = $scope.modalContent.currentReportTypeData;

                var count = 0;
                angular.forEach($scope.modalContent.reportVendorsList, function (reportVendorAssoc, i) {
                        //iterating first vendor of company associations
                        var assignedVendorUsers = [],
                            unassignedVendorUsers = [];
                        if (count < Object.keys($scope.selectedReportVendor).length) {
                            angular.forEach(reportVendorAssoc.companyAssociationUsers, function (user) {
                                    var checkedVendorUser = $scope.selectedReportVendor[user.userGUID];
                                    var isExistUser = null;
                                    if (currentReportTypeData.vendors && currentReportTypeData.vendors.length > 0) {
                                        for (var j = 0; j < currentReportTypeData.vendors.length; j++) {
                                            isExistUser = currentReportTypeData.vendors[j].reportSettingsVendorUsers.filter(function (item) {
                                                return item.userGUID == user.userGUID
                                            })[0];
                                            if (isExistUser)
                                                break;
                                        }
                                    }

                                    if (checkedVendorUser != undefined) {
                                        if (checkedVendorUser) {
                                            if (!isExistUser) {
                                                var vendorUserObjAssigned = {
                                                    "userGUID": user.userGUID
                                                }
                                                assignedVendorUsers.push(vendorUserObjAssigned);
                                            }
                                        } else {
                                            if (isExistUser && isExistUser.companyReportVendorUserGUID) {
                                                var vendorUserObjUnassigned = {
                                                    "companyreportvendoruserguid": isExistUser.companyReportVendorUserGUID
                                                }
                                                unassignedVendorUsers.push(vendorUserObjUnassigned);
                                            }
                                        }
                                        count++;
                                    }
                                }) //end of forEach(companyAssociations-companyAssociationUsers)
                            var vendorObj = {
                                "vendorCompanyGUID": reportVendorAssoc.companyGUID,
                                "reportSettingsVendorUsers": assignedVendorUsers
                            }
                            if (assignedVendorUsers.length > 0) {
                                assigned.push(vendorObj);
                            }
                            if (unassignedVendorUsers.length > 0) {
                                //check for all users under same vendorcompanyguid are unassigned then only pass reportVendorGUID else-wise pass vendorCompanyGUID
                                var isAllUsersUnchecked = true;
                                for (var j = 0; j < currentReportTypeData.vendors.length; j++) {
                                    if (currentReportTypeData.vendors[j].vendorGUID == reportVendorAssoc.companyGUID) {
                                        for (var k = 0; k < currentReportTypeData.vendors[j].reportSettingsVendorUsers.length; k++) {
                                            var userIsUnchecked = unassignedVendorUsers.filter(function (item) {
                                                return item.userGUID == currentReportTypeData.vendors[j].reportSettingsVendorUsers[k].userGUID
                                            })[0];
                                            if (!userIsUnchecked) {
                                                isAllUsersUnchecked = false;
                                                break;
                                            }
                                        }
                                        var vendorObj = {
                                            "reportSettingsVendorUsers": unassignedVendorUsers
                                        }
                                        if (isAllUsersUnchecked) {
                                            vendorObj['reportVendorGUID'] = reportVendorAssoc.reportVendorGUID;
                                        } else {
                                            vendorObj['vendorCompanyGUID'] = reportVendorAssoc.companyGUID;
                                        }

                                    }
                                } //end of for
                                unassigned.push(vendorObj);
                            } //end of if(unassignedVendorUsers)
                        } // end of if(count < Object.keys($scope.selectedReportVendor).length)
                    }) // end of forEach(reportVendorList/companyAssociations)

                var requestVendorsObj = {
                    "vendors": {
                        "assigned": assigned,
                        "unassigned": unassigned
                    }
                }
                if (assigned.length > 0 || unassigned.length > 0) {

                    var promise = CompanyServiceAPI.updateReportVendors($scope.modalContent.companyGUID, $scope.modalContent.currentReportSettingsGUID, requestVendorsObj);
                    promise.then(function (respVendors) {
                        self.showReportVendorMsg = true;
                        if (respVendors.vendors) {
                            self.alertClassReportsVendor = "alert-success";
                            self.reportVendorMsg = "The vendor user list has been updated for report type: " + $scope.modalContent.currentReportTypeData.reportType;
                            var promiseGetRprtVendors = CompanyServiceAPI.getCompReportVendors($scope.modalContent.companyGUID, $scope.modalContent.currentReportSettingsGUID, "vendorusers");
                            promiseGetRprtVendors.then(function (respReportSettg) {
                                if (respReportSettg && !respReportSettg.message) {
                                    $scope.modalContent.currentReportTypeData.vendors = respReportSettg.vendors;
                                    self.reportSettings[$scope.modalContent.currentReportTemplateIndex].vendors = respReportSettg.vendors;
                                }
                            })
                        } else {
                            self.alertClassReportsVendor = "alert-danger";
                            self.reportVendorMsg = "We encountered a problem while processing your request. Please try again.";
                            if (respVendors.data.message)
                                self.reportVendorMsg = respVendors.data.message.userMessage;
                        }
                        $modalInstance.close();
                    })
                } else {
                    self.showReportVendorMsg = true;
                    self.alertClassReportsVendor = "alert-success";
                    self.reportVendorMsg = "The vendor user list has been updated for report type: " + $scope.modalContent.currentReportTypeData.reportType;
                    $modalInstance.close();
                }
            } //end of updateEntity function
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    $timeout(function () {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });
        });
    });
}]);