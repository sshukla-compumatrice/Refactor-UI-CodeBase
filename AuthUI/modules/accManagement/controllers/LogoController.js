angular.module('AccountMgmtModule').controller('LogoController', ['$rootScope', '$scope', '$sce', 'Upload', 'commonFactory', 'CompanyServiceAPI', 'FileMgmtAPI', '$log', '$modal', function ($rootScope, $scope, $sce, Upload, commonFactory, CompanyServiceAPI, FileMgmtAPI, $log, $modal) {
    var self = this;
    var companyLogoFileBase64, updateCompanyObj;

    init();

    function init() {
        self.logoFilePathURL = "";
        self.companyRootFolderGuid = "";
        self.hideScreenContents = true;
        $rootScope.promise = CompanyServiceAPI.getCompany($rootScope.currentUserCompanyGuid, false, "").then(function (resp) {
            if (resp.companies && resp.companies.length) {
                createUpdateCompanyObj(resp.companies[0]);
                self.logoFilePathURL = resp.companies[0].logoCoreFileGUID ? FileMgmtAPI.getFileStream(resp.companies[0].logoCoreFileGUID) + "?" + new Date().getTime() : "";
                getFolderGuids();
            } else {
                $rootScope.alertClass = "alert-danger";
                $rootScope.userMessage = "<strong>Error:</strong> Problem in getting company details. Please try again.";
                self.hideScreenContents = false;
            }
        });
    }

    function createUpdateCompanyObj(companyObj) {
        if (companyObj) {
            var certificateObj = createCertificateAssignment(companyObj.certifications);
            var companyApplicationComponentItemsObj = companyApplicationComponentItemsAssignment(companyObj.companyApplicationComponentItems);
            updateCompanyObj = {
                "company": {
                    "name": companyObj.name,
                    "applicationComponentTypeGUID": companyObj.applicationComponentTypeGUID,
                    "applicationComponentType": companyObj.applicationComponentType,
                    "parentCompanyGUID": companyObj.parentCompanyGUID,
                    "isEnabled": true,
                    "webAddress": companyObj.webAddress,
                    "slogan": companyObj.slogan,
                    "edrDataVendorID": companyObj.edrDataVendorID,
                    "billLender": companyObj.billLender,
                    "headquarterCompanyOfficeGUID": companyObj.headquarterCompanyOfficeGUID,
                    "logoCoreFileGUID": companyObj.logoCoreFileGUID,
                    //"logoFileName": companyObj.logoFileName,
                    "companyTypes": companyObj.companyTypes,
                    "certifications": certificateObj,
                    "companyApplicationComponentItems": companyApplicationComponentItemsObj
                }
            }
        }
    }

    function createCertificateAssignment(certifications) {
        var requestObj = {
            "clearAll": false,
            "certificationsAssigned": [],
            "certificationsUnassigned": []
        }
        if (certifications && certifications.length) {
            for (var i = 0; i < certifications.length; i++) {
                requestObj.certificationsAssigned.push({
                    "certificationTypeGUID": certifications[i].certificationGUID,
                    "certificationType": certifications[i].certificationType
                });
            }
            return requestObj;
        }
        return {};
    }

    function companyApplicationComponentItemsAssignment(applicationComponentItem) {
        var requestObj = {
            "clearAll": false,
            "companyApplicationComponentItemsAssigned": [],
            "companyApplicationComponentItemsUnassigned": []
        }
        if (applicationComponentItem && applicationComponentItem.length) {
            for (var i = 0; i < applicationComponentItem.length; i++) {
                requestObj.companyApplicationComponentItemsAssigned.push({
                    "applicationComponentItemGUID": applicationComponentItem[i].applicationComponentItemGUID,
                    "applicationComponentItemName": applicationComponentItem[i].applicationComponentItemName
                });
            }
            return requestObj;
        }
        return {};
    }

    function getFolderGuids() {
        $rootScope.promise = FileMgmtAPI.getSharedFolder(false, "Root", $rootScope.currentUserCompanyGuid).then(function (resp) {
            if (resp && resp.folders && resp.folders.length) {
                for (i = 0; i < resp.folders.length; i++) {
                    if (resp.folders[i].folderType == "Root") {
                        self.companyRootFolderGuid = resp.folders[i].folderGUID;
                        break;
                    }
                }
            } else {
                $rootScope.alertClass = "alert-danger";
                $rootScope.userMessage = "<strong>Error:</strong> Cannot upload the company logo. Folder is not available to upload the company logo. Please contact to EDR support.";
                self.hideScreenContents = false;
            }
        });
    }

    function getGcd(val1, val2) {
        if (val2 == 0)
            return val1;
        return getGcd(val2, val1 % val2)
    }

    self.uploadCompanyLogo = function () {
        var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
        var fileguid = updateCompanyObj.company.logoCoreFileGUID ? updateCompanyObj.company.logoCoreFileGUID : "";
        var logoFile = self.logoImg;
        if (!logoFile || logoFile == null) {
            $rootScope.alertClass = "alert-danger";
            $rootScope.userMessage = "<strong>Error:</strong> Please attach file before trying to upload.";
            return;
        } else {
            var basePath = "/Accounts/Companies/" + $rootScope.currentUserCompanyGuid;
            var category = "Company Logo";
            $rootScope.promise = FileMgmtAPI.uploadFile(logoFile, 'DISABLE', self.companyRootFolderGuid, "TIER1", basePath, fileguid);
            $rootScope.promise.progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }),
                $rootScope.promise.success(function (data, status, headers, config) {
                    if (data && data.file) {
                        updateCompanyObj.company.logoCoreFileGUID = data.file.fileGUID;
                        //updateCompanyObj.company.logoFileName = data.file.fileName;

                        $rootScope.promise = CompanyServiceAPI.updateCompany($rootScope.currentUserCompanyGuid, updateCompanyObj).then(function (resp) {
                            if (resp.config) {
                                FileMgmtAPI.deleteFile(updateCompanyObj.company.logoCoreFileGUID);
                                var usrMsg = (data.data.message != undefined) ? data.data.message.userMessage : "";
                                $rootScope.alertClass = "alert-danger";
                                $rootScope.userMessage = "<strong>Error:</strong> Problem in uploading company logo. " + usrMsg;
                            } else {
                                self.logoFilePathURL = FileMgmtAPI.getFileStream(updateCompanyObj.company.logoCoreFileGUID) + "?" + new Date().getTime();

                                $rootScope.alertClass = "alert-success";
                                $rootScope.userMessage = "The logo has been updated.";
                                self.logoImg = null;
                            }
                        });
                    }
                }),
                $rootScope.promise.error(function (data, status, headers, config) {
                    accessMgmtFactoryLogger.error(config);
                });
        }
    }

    self.checkFile = function (file, invalidFiles, event) {
        var hwGcd;
        self.UploadErrorMsg = "";
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

    self.OpenDeleteLogoModal = function (fileGUID) {
        var modalInstance = $modal.open({
            templateUrl: "deleteCompanyLogo.html",
            scope: $scope,
            controller: deleteCompanyLogoController,
            size: 0,
            resolve: {
                currentScope: function () {
                    return self;
                }
            }
        });
    }

    function deleteCompanyLogoController($scope, $modalInstance, currentScope) {
        $scope.deleteCompanyLogo = function () {
            $rootScope.promise = FileMgmtAPI.deleteFile(updateCompanyObj.company.logoCoreFileGUID);
            $rootScope.promise.then(function (resp) {
                if (typeof resp === 'object') {
                    $modalInstance.close();
                    var usrMsg = (resp.data.message != undefined) ? resp.data.message.userMessage : "";
                    $rootScope.alertClass = 'alert-danger';
                    $rootScope.userMessage = "<strong>Error:</strong> Problem in deleting qualification file. " + usrMsg;
                } else {
                    $modalInstance.close();
                    updateCompanyObj.company.logoCoreFileGUID = "";
                    //updateCompanyObj.company.logoFileName = "";
                    CompanyServiceAPI.updateCompany($rootScope.currentUserCompanyGuid, updateCompanyObj).then(function (resp) {
                        if (resp.config) {
                            var usrMsg = (data.data.message != undefined) ? data.data.message.userMessage : "";
                            $rootScope.alertClass = 'alert-danger';
                            $rootScope.userMessage = "<strong>Error:</strong> Problem in deleting company logo. " + usrMsg;
                        } else {
                            self.logoFilePathURL = "";

                            $rootScope.alertClass = 'alert-success';
                            $rootScope.userMessage = "The logo has been deleted.";
                        }
                    });
                }
            });
        }

        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }
}]);