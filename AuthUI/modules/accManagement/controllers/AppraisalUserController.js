angular.module('AccountMgmtModule').controller('AppraisalUserController', ['$rootScope', '$scope', '$state', 'UserServiceAPI', 'Upload', '$modal', 'LicenseServiceAPI', '$filter', '$stateParams', '$location', 'InsuranceServiceAPI', 'CoverageAreaServiceAPI', 'UserFormsServiceAPI', '$timeout', 'ListingsAPI', 'geocodeService', 'UsaStates', '$log', 'FileMgmtAPI', 'commonFactory', function ($rootScope, $scope, $state, UserServiceAPI, Upload, $modal, LicenseServiceAPI, $filter, $stateParams, $location, InsuranceServiceAPI, CoverageAreaServiceAPI, UserFormsServiceAPI, $timeout, ListingsAPI, geocodeService, UsaStates, $log, FileMgmtAPI, commonFactory) {
    var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
    var self = this;
    var AppraisalId = $stateParams.userguid;
    var signatureFolderGuid = "", licenseFolderGuid = "", insuranceFolderGuid = "", w9FolderGuid = "", additionalDocumentFolderGuid = "";
    
    self.AppraisalId = $stateParams.userguid;
    self.companyguid = $stateParams.companyguid;
    self.officeguid = $stateParams.officeguid;
    self.editAppraisalPersonalInfo = false;
    self.designationselected = {};
    self.residentialselected = {};
    self.commericialselected = {};
    self.AppraiserFilesSignature = [];
    self.editAppraiserSelected = {};
    self.InsuranceDetail = {};
    self.InsuranceFileGUID = "";
    self.Userw9FormsDetail = {};
    self.ShowW9Download = false;
    self.DeletelicenseStatus = false;
    self.DeleteAddDocStatus = false;
    self.UpdateAddDocStatus = false;

    self.datePicker = {
        opened: false
    };
    self.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        self.datePicker.opened = true;
    };
    self.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    self.formats = ['MM-dd-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate', 'EEE MMM dd yyyy'];
    self.format = self.formats[4];


    if ($state.current.name == 'accountMgmt.user.appraiserView') {
        displayAppraisal(AppraisalId);
    }

    self.tab = 'PersonalInfo';

    self.selectTab = function (setTab) {
        if (setTab != self.tab) {
            var previousTab = self.tab;
            self.tab = setTab;
            $rootScope.dismissUserMessage();
            $("#" + previousTab + " form").each(function () {
                if (this.name)
                    commonFactory.clearFieldValidation(this.name);
            });
        }
    }

    self.isSelected = function (checkTab) {
        return self.tab === checkTab;
    }

    self.states = UsaStates;
    self.coverageAreaState = "";

    function mapToStateName(stateCode) {
        var stateName = "";
        var mappedState = [];
        mappedState = self.states.filter(function (item) {
            return item.stateCode == stateCode;
        });

        return mappedState.length ? mappedState[0].stateName : "";
    }

    function displayAppraisal(AppraisalId) {
        var promise = UserServiceAPI.getUserInfo(AppraisalId, self.companyguid, self.officeguid, "defaultuserrole");
        promise.then(function (data) {
            var users = data.users;
            for (var index = 0; index < users.length; index++) {
                if (AppraisalId == users[index].userGUID) {
                    self.Appfirstname = users[index].firstName != undefined ? users[index].firstName : "";
                    self.Apptitle = users[index].title != undefined ? users[index].title : "";
                    self.Appmiddlename = users[index].middleInitial != undefined ? users[index].middleInitial : "";
                    self.Applastname = users[index].lastName != undefined ? users[index].lastName : "";

                    if (users[index].directPhone != "" && users[index].directPhone != undefined)
                        self.AppDirectPhone = users[index].directPhone;

                    if (users[index].cellPhone != "" && users[index].cellPhone != undefined)
                        self.AppCellPhone = users[index].cellPhone;

                    self.Appemail = users[index].email != undefined ? users[index].email : "";
                    self.AppofficeEmail = users[index].officeEmail != undefined ? users[index].officeEmail : "";
                    self.Appusername = users[index].userName != undefined ? users[index].userName : "";

                    var signatureFileGUID = users[index].signatureFileCoreFileGUID;
                    self.signatureFileCoreFileGUID = signatureFileGUID;
                    if (signatureFileGUID != "" && signatureFileGUID != undefined) {
                        var promise = FileMgmtAPI.getfiledetails(signatureFileGUID);
                        promise.then(function (DownloadResponse) {
                            if (DownloadResponse.files)
                                self.AppSignatureImage = DownloadResponse.files[0].currentVersionURL;
                        })
                    } else {
                        self.AppSignatureImage = "";
                    }

                    self.AppallowFeeAssignments = users[index].allowFeeAssignments != undefined ? users[index].allowFeeAssignments : "";
                    self.AppallowAppraisalReviews = users[index].allowAppraisalReviews != undefined ? users[index].allowAppraisalReviews : "";
                    self.AppallowEvaluations = users[index].allowEvaluations != undefined ? users[index].allowEvaluations : "";
                    self.AppcertifiedHUDFHA = users[index].certifiedHUDFHA != undefined ? users[index].certifiedHUDFHA : "";
                    self.AppcertifiedVA = users[index].certifiedVA != undefined ? users[index].certifiedVA : "";

                    self.Appdesignations = users[index].designations != undefined ? users[index].designations : "";
                    self.AppAltdesignations = users[index].altDesignations != undefined ? users[index].altDesignations : "";
                    if (self.AppAltdesignations != "") {
                        self.Appdesignations = self.Appdesignations.concat(self.AppAltdesignations);
                    }

                    self.Appexpertise = users[index].expertise != undefined ? users[index].expertise : "";
                }
            }
        });
    }


    self.editAppraisal = function () {
        self.residentialselected = {};
        self.commericialselected = {};
        self.designationselected = {};

        this.editAppraisalPersonalInfo = true;

        //START
        var tempCheckAppraisalDesignations = new Array();
        tempCheckAppraisalDesignations = self.Appdesignations.toString().split(",");

        var tempAppraisalDesignations = new Array();

        var promiseListing = ListingsAPI.getListings('appraisaldesignations,expertiseresidential,expertisecommercial');
        promiseListing.then(function (Listingdata) {

            var AppraisalDesignation = Listingdata.appraisalDesignations;
            for (var indexdesignation = 0; indexdesignation < AppraisalDesignation.length; indexdesignation++) {
                var designationelement = {};
                designationelement.id = AppraisalDesignation[indexdesignation].guid;
                designationelement.designation = AppraisalDesignation[indexdesignation].name;
                tempAppraisalDesignations.push(designationelement);
                designationelement = {};

                for (var indexcd = 0; indexcd < tempCheckAppraisalDesignations.length; indexcd++) {
                    if (AppraisalDesignation[indexdesignation].name == tempCheckAppraisalDesignations[indexcd]) {
                        self.designationselected[AppraisalDesignation[indexdesignation].name] = true;
                    }
                }
            }


            self.AppraisalDesignation = tempAppraisalDesignations;
            self.AlternateDesignations = self.AppAltdesignations;

            //Expertise

            var tempcheckAppraisalExeperise = new Array();
            var tempAppraisalCommercial = new Array();
            var tempAppraisalResidential = new Array();

            tempcheckAppraisalExeperise = self.Appexpertise.toString().split(",");
            for (var indexexpcheck = 0; indexexpcheck < tempcheckAppraisalExeperise.length; indexexpcheck++) {
                if (tempcheckAppraisalExeperise[indexexpcheck].match("Residential-")) {
                    var residentialelement = {};
                    residentialelement.expertise = tempcheckAppraisalExeperise[indexexpcheck].split("Residential-")[1];
                    tempAppraisalResidential.push(residentialelement);
                } else {
                    var commericalelement = {};
                    commericalelement.expertise = tempcheckAppraisalExeperise[indexexpcheck].split("Commercial-")[1];
                    tempAppraisalCommercial.push(commericalelement);
                }
            }


            var AppraisalResidential = [];
            var AppraisalCommercial = [];
            var AppraisalResidentialData = Listingdata.expertiseResidential;
            var AppraisalCommercialData = Listingdata.expertiseCommercial;

            for (var indexexpertiseres = 0; indexexpertiseres < AppraisalResidentialData.length; indexexpertiseres++) {
                var residentialelement = {};
                residentialelement.id = AppraisalResidentialData[indexexpertiseres].guid;
                residentialelement.expertise = AppraisalResidentialData[indexexpertiseres].name;
                AppraisalResidential.push(residentialelement);
                residentialelement = {};

                for (var indexr = 0; indexr < tempAppraisalResidential.length; indexr++) {
                    if (AppraisalResidential[indexexpertiseres].expertise == tempAppraisalResidential[indexr].expertise) {
                        self.residentialselected[AppraisalResidential[indexexpertiseres].expertise] = true;
                    }
                }
            }

            self.AppraisalResidential = AppraisalResidential;


            for (var indexexpertisecom = 0; indexexpertisecom < AppraisalCommercialData.length; indexexpertisecom++) {
                var commercialelement = {};
                commercialelement.id = AppraisalCommercialData[indexexpertisecom].guid;
                commercialelement.expertise = AppraisalCommercialData[indexexpertisecom].name;
                AppraisalCommercial.push(commercialelement);
                commercialelement = {};

                for (var indexc = 0; indexc < tempAppraisalCommercial.length; indexc++) {
                    if (AppraisalCommercial[indexexpertisecom].expertise == tempAppraisalCommercial[indexc].expertise) {
                        self.commericialselected[AppraisalCommercial[indexexpertisecom].expertise] = true;
                    }
                }

            }
            self.AppraisalCommercial = AppraisalCommercial;
            //Expertise End
        });

        //END 

        var promise = UserServiceAPI.getUserInfo(AppraisalId, self.companyguid, self.officeguid, "defaultuserrole");
        promise.then(function (viewdata) {

            var viewappraisal = viewdata.users;
            for (var index = 0; index < viewappraisal.length; index++) {
                if (AppraisalId == viewappraisal[index].userGUID) {

                    self.AppraiserFirstName = viewappraisal[index].firstName != undefined ? viewappraisal[index].firstName : "";

                    self.AppraiserMiddleName = viewappraisal[index].middleInitial != undefined ? viewappraisal[index].middleInitial : "";

                    self.AppraiserLastName = viewappraisal[index].lastName != undefined ? viewappraisal[index].lastName : "";

                    self.AppraiserTitle = viewappraisal[index].title != undefined ? viewappraisal[index].title : "";

                    self.AppraiserDirectPhone = viewappraisal[index].directPhone != undefined ? viewappraisal[index].directPhone : "";

                    self.AppraiserCellPhone = viewappraisal[index].cellPhone != undefined ? viewappraisal[index].cellPhone : "";

                    self.AppraiserEmail = viewappraisal[index].email != undefined ? viewappraisal[index].email : "";

                    self.AppraiserOfficeEmail = viewappraisal[index].officeEmail != undefined ? viewappraisal[index].officeEmail : "";

                    self.AppraiserUserName = viewappraisal[index].userName != undefined ? viewappraisal[index].userName : "";
                    self.AppraiserfeeAssignments = viewappraisal[index].allowFeeAssignments != undefined && viewappraisal[index].allowFeeAssignments != "" ? viewappraisal[index].allowFeeAssignments : false;

                    self.isAppraiserReview = viewappraisal[index].allowAppraisalReviews != undefined && viewappraisal[index].allowAppraisalReviews != "" ? viewappraisal[index].allowAppraisalReviews : false;

                    self.isAppraiserEvaluation = viewappraisal[index].allowEvaluations != undefined && viewappraisal[index].allowEvaluations != "" ? viewappraisal[index].allowEvaluations : false;

                    self.isAppraiserHUDFHACertified = viewappraisal[index].certifiedHUDFHA != undefined && viewappraisal[index].certifiedHUDFHA != "" ? viewappraisal[index].certifiedHUDFHA : false;

                    self.isAppraiserVACertified = viewappraisal[index].certifiedVA != undefined && viewappraisal[index].certifiedVA != "" ? viewappraisal[index].certifiedVA : false;

                }
            }
        });
    }

    self.selectAll = function (type) {
        switch (type) {
        case 'Residential':
            for (var resindex = 0; resindex < self.AppraisalResidential.length; resindex++) {
                var residentialItem = self.AppraisalResidential[resindex];
                self.residentialselected[residentialItem.expertise] = true;
            }
            break;
        case 'Commercial':
            for (var commercialindex = 0; commercialindex < self.AppraisalCommercial.length; commercialindex++) {
                var commericialItem = self.AppraisalCommercial[commercialindex];
                self.commericialselected[commericialItem.expertise] = true;
            }
            break;
        case 'Designation':
            for (var designationindex = 0; designationindex < self.AppraisalDesignation.length; designationindex++) {
                var designationItem = self.AppraisalDesignation[designationindex];
                self.designationselected[designationItem.designation] = true;
            }
            break;
        default:
            //default code block
        }
    }

    self.updateAppraiser = function () {
        if ($scope.formEditAppraiserProfile.$valid) {
            var selectedResidential = [];
            var selectedResidentialValues = [];
            selectedResidential = $.grep(self.AppraisalResidential, function (record) {
                return self.residentialselected[record.expertise];
            });
            for (var indexdres = 0; indexdres < selectedResidential.length; indexdres++) {
                selectedResidentialValues.push("Residential-" + selectedResidential[indexdres].expertise);
            }

            var selectedCommercial = [];
            var selectedCommercialValues = [];
            selectedCommercial = $.grep(self.AppraisalCommercial, function (recordCom) {
                return self.commericialselected[recordCom.expertise];
            });
            for (var indexdcom = 0; indexdcom < selectedCommercial.length; indexdcom++) {
                selectedCommercialValues.push("Commercial-" + selectedCommercial[indexdcom].expertise);
            }
            var expertise = selectedResidentialValues.concat(selectedCommercialValues);

            var selectedDesignations = [];
            var selectedDesignationsValues = [];
            selectedDesignations = $.grep(self.AppraisalDesignation, function (record) {
                return self.designationselected[record.designation];
            });
            for (var indexdesignate = 0; indexdesignate < selectedDesignations.length; indexdesignate++) {
                selectedDesignationsValues.push(selectedDesignations[indexdesignate].designation);
            }

            var user = {
                "user": {
                    "userGUID": AppraisalId,
                    "userName": this.AppraiserUserName != undefined ? this.AppraiserUserName : "",
                    "title": this.AppraiserTitle != undefined ? this.AppraiserTitle : "",
                    "firstName": this.AppraiserFirstName,
                    "middleInitial": this.AppraiserMiddleName != undefined ? this.AppraiserMiddleName : "",
                    "lastName": this.AppraiserLastName,
                    "isEnabled": "",
                    "email": this.AppraiserEmail,
                    "officeEmail": this.AppraiserOfficeEmail,
                    "emailClosing": "",
                    "directPhone": this.AppraiserDirectPhone != undefined ? this.AppraiserDirectPhone : "",
                    "cellPhone": this.AppraiserCellPhone != undefined ? this.AppraiserCellPhone : "",
                    "qualificationsFileDisplayName": "",
                    "qualificationsFileCoreFileGUID": "",
                    "signatureFileDisplayName": "",
                    "signatureFileCoreFileGUID": "",
                    "isEnvProfessional": true,
                    "allowAdminsToSign": true,
                    "allowFeeAssignments": this.AppraiserfeeAssignments,
                    "allowAppraisalReviews": this.isAppraiserReview,
                    "allowEvaluations": this.isAppraiserEvaluation,
                    "certifiedHUDFHA": this.isAppraiserHUDFHACertified,
                    "certifiedVA": this.isAppraiserVACertified,
                    "designations": selectedDesignationsValues,
                    "expertise": expertise,
                    /*"altDesignations": self.AlternateDesignations,*/
                    "office": {
                        "companyOfficeGUID": $stateParams.officeguid
                    }
                }
            }
            var promise = UserServiceAPI.updateuser(AppraisalId, user); //updateappraiseruser(AppraisalId, user);
            promise.then(function (data) {
                var params = {
                    companyguid: $stateParams.companyguid,
                    officeguid: $stateParams.officeguid
                };
                $state.go('accountMgmt.user.list', params);
            })

        } else {
            var inputElements = document.getElementsByName($scope.formEditAppraiserProfile.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.CancelAppraiserUpdate = function () {
        this.editAppraisalPersonalInfo = false;
    }


    self.IncorrectFormat = false;
    self.isSignatureUpload = false;

    self.uploadFile = function (name) {
        if (name == 'signature') {
            var file = self.Signaturefile;
            self.IncorrectFormat = "";
            self.isSignatureUpload = false;
            self.uploadSuccessMsgSignature = false;
            if (!file || file == null) {
                self.IncorrectFormat = "Please attach files before trying to upload.";
                return;
            } else {
                var basePath = "/Accounts/Users/" + self.AppraisalId;
                var promise = FileMgmtAPI.uploadFile(file, 'DISABLE', signatureFolderGuid, "TIER1", basePath, self.signatureFileCoreFileGUID);
                promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function (data, status, headers, config) {
                        if (data) {
                            self.uploadSuccessMsgSignature = true;
                            self.AppSignatureImage = data.file.currentVersionURL;
                            $timeout(function () {
                                self.callAtTimeout("uploadSuccessMsgSignature");
                            }, 3000);
                        }
                    }),
                    promise.error(function (data, status, headers, config) {
                        self.IncorrectFormat = "Sorry. We encountered a problem while processing your request. Please try again.";
                        self.isSignatureUpload = true;
                        if (data.message)
                            self.IncorrectFormat = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
        }
    }


    self.checkFile = function (file, invalidFiles, form) {
        if (invalidFiles.length > 0) {
            var msg = '';
            switch (invalidFiles[0].$error.toLowerCase()) {
            case "pattern":
                msg = 'File format is incorrect';
                break;
            case "maxsize":
            case "maxtotalsize":
                msg = 'Image size is incorrect';
                break;
            case "ratio":
                msg = 'Image aspect ratio is incorrect'
                break;
            }
            self.IncorrectFormat = msg;
            self.isSignatureUpload = true;
        } else {
            self.IncorrectFormat = "";
            self.isSignatureUpload = false;
            self.uploadSuccessMsgSignature = false;
        }
    }



    self.getAllAdditionalDocuments = function () {
        var AppraisalId = $stateParams.userguid;
        var promise = UserFormsServiceAPI.getUserAdditionalDocuments(AppraisalId);
        promise.then(function (RespAdditionalDocuments) {
            var tempAdditionDocArray = [];
            for (var index = 0; index < RespAdditionalDocuments.forms.length; index++) {
                if (RespAdditionalDocuments.forms[index].formType == "additionaldoc") {

                    var element = {};

                    element.AddDocFileName = RespAdditionalDocuments.forms[index].fileName;
                    element.AddDocFileDescription = RespAdditionalDocuments.forms[index].fileDescription;
                    element.AddDocformCoreFileGUID = RespAdditionalDocuments.forms[index].formCoreFileGUID;
                    element.userFormGUID = RespAdditionalDocuments.forms[index].userFormGUID;

                    element.AddDocformType = RespAdditionalDocuments.forms[index].formType;

                    var formCoreFileGUID = RespAdditionalDocuments.forms[index].formCoreFileGUID;
                    if (formCoreFileGUID != "" && formCoreFileGUID != undefined) {
                        var promise = FileMgmtAPI.getfiledetails(formCoreFileGUID);
                        promise.then(function (DownloadResponse) {
                            if (DownloadResponse.files)
                                element.filePath = DownloadResponse.files[0].currentVersionURL;
                        })
                    } else {
                        element.filePath = "";
                    }

                    //element.filePath = RespAdditionalDocuments.forms[index].filePath;

                    tempAdditionDocArray.push(element);
                    element = {};
                }
            }
            self.AdditionDocuments = tempAdditionDocArray;
        })

    }

    $scope.openDeleteAddDoc = function (userFormGUID, FileNameConfirmation) {
        //$scope.userFormAddDocDeleteFileName = FileNameConfirmation;
        $scope.DeleteAddDocuserFormGUID = userFormGUID;
        var modalInstance = $modal.open({
            templateUrl: "DeleteAddDocTemplate.html",
            scope: $scope,
            controller: deleteAddDocController,
            size: 0,
            resolve: {
                FileName: function () {
                    return FileNameConfirmation;
                }
            }
        });
    }

    function deleteAddDocController($scope, $modalInstance, FileName) {
        $scope.DeleteAddDocuserFormGUID;
        $scope.userFormAddDocDeleteFileName = FileName;

        $scope.deleteAdditionalDocument = function () {

            var userGUID = $stateParams.userguid;
            var formGUID = $scope.DeleteAddDocuserFormGUID;

            var promise = UserFormsServiceAPI.deleteadditionaldocument(userGUID, formGUID);
            promise.then(function (AddDocdata) {
                self.getAllAdditionalDocuments();
                $modalInstance.close();
                self.DeleteAddDocStatus = true;
                $timeout(function () {
                    self.callAtTimeout("DeleteAddDocStatus");
                }, 3000);
            });
        }

        $scope.CancelAdditionalDocumentDelete = function () {

            $modalInstance.close();
        }
    }


    self.SelectedAdditionDoc = {};

    self.getAddDocTemplate = function (AddDoc) {
        if (AddDoc.userFormGUID === self.SelectedAdditionDoc.userFormGUID) return 'edit';
        else return 'display';
    };

    self.editAditionalDocument = function (AddDocument) {
        self.SelectedAdditionDoc = angular.copy(AddDocument);
    };

    self.UpdateAdditionalDocument = function () {
        var dataObj = {
            "form": {
                "userFormGUID": self.SelectedAdditionDoc.userFormGUID,
                "userGUID": $stateParams.userguid,
                "formType": self.SelectedAdditionDoc.AddDocformType,
                "formCoreFileGUID": self.SelectedAdditionDoc.AddDocformCoreFileGUID,
                "isEnabled": true,
                "fileName": self.SelectedAdditionDoc.AddDocFileName,
                "fileDescription": self.SelectedAdditionDoc.AddDocFileDescription
            }
        }
        var promise = UserFormsServiceAPI.updateadditionaldocument($stateParams.userguid, self.SelectedAdditionDoc.userFormGUID, dataObj);
        promise.then(function (RespUpdateDoc) {
            self.getAllAdditionalDocuments();
            self.UpdateAddDocStatus = true;
            $timeout(function () {
                self.callAtTimeout("UpdateAddDocStatus");
            }, 3000);
        });
        self.SelectedAdditionDoc = {};
    }


    self.getUserw9Forms = function () {
        var AppraisalId = $stateParams.userguid;
        var promise = UserFormsServiceAPI.getuserw9form(AppraisalId);
        promise.then(function (RespW9Form) {

            for (var index = 0; index < RespW9Form.forms.length; index++) {

                var formtype = RespW9Form.forms[index].formType;
                if (formtype == "w9") {

                    var IsfileExist = RespW9Form.forms[index].filePath;
                    if (IsfileExist != "") {
                        self.ShowW9Download = true;
                    }

                    var userformCoreFileGUID = RespW9Form.forms[index].formCoreFileGUID;
                    if (userformCoreFileGUID != "" && userformCoreFileGUID != undefined) {
                        var promise = FileMgmtAPI.getfiledetails(userformCoreFileGUID);
                        promise.then(function (DownloadResponse) {
                            if (DownloadResponse.files)
                                self.W9DownloadUrl = DownloadResponse.files[0].currentVersionURL;
                        })
                    } else {
                        self.W9DownloadUrl = "";
                    }
                    //self.W9DownloadUrl = RespW9Form.forms[index].filePath;

                    self.Userw9FormsDetail = RespW9Form.forms[index];
                }
            }
        });
    }

    self.DeleteFile = function (type) {
        var AppraisalId = $stateParams.userguid;
        var w9formGuid = self.Userw9FormsDetail.userFormGUID;

        switch (type) {
        case 'w9':
            var promise = UserFormsServiceAPI.deleteuserw9form(AppraisalId, w9formGuid);
            promise.then(function (RespW3Form) {
                self.deletew9formStatus = true;
            });
            break;

        default:

        }
    }

    self.IncorrectLicenseFormat = '';
    self.uploadLicenseSuccessMsg = false;

    self.uploadFilesOneSelect = function (filetype, file, errFiles) {
        switch (filetype) {
        case 'license':
            self.IncorrectLicenseFormat = "";
            if (errFiles.length > 0) {
                switch (errFiles[0].$error.toLowerCase()) {
                case "pattern":
                    msg = 'File format is incorrect';
                    break;
                }
                self.IncorrectLicenseFormat = msg;
            }

            if (file) {
                var basePath = "/Accounts/Users/" + self.AppraisalId;
                var promise = FileMgmtAPI.uploadFile(file, 'DISABLE', licenseFolderGuid, "TIER1", basePath);
                promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {
                            /*self.uploadLicenseSuccessMsg = true;
                            $timeout(function () {
                                self.callAtTimeout("uploadLicenseSuccessMsg");
                            }, 3000);*/
                        }
                    }),
                    promise.error(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if (data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
            break;

        case 'insurance':
            if (file) {
                var basePath = "/Accounts/Users/" + self.AppraisalId;
                var promise = FileMgmtAPI.uploadFile(file, 'DISABLE', insuranceFolderGuid, "TIER1", basePath);
                promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {
                            /*self.UploadfileInsuranceStatus = true;
                            $timeout(function () {
                                self.callAtTimeout("UploadfileInsuranceStatus");
                            }, 3000);*/
                            self.InsuranceFileGUID = data.file.fileGUID;
                        }
                    }),
                    promise.error(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if (data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
            break;

        case 'w-9':
            if (file) {
                var basePath = "/Accounts/Users/" + self.AppraisalId;
                var promise = FileMgmtAPI.uploadFile(file, 'DISABLE', w9FolderGuid, "TIER1", basePath);
                promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {
                            self.W9DownloadUrl = data.file.currentVersionURL;
                            self.getUserw9Forms();
                        }
                        self.ShowW9Download = true;
                    }),
                    promise.error(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if (data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
            break;

        case 'AdditionalDocument':
            if (file) {
                var basePath = "/Accounts/Users/" + self.AppraisalId;
                var promise = FileMgmtAPI.uploadFile(file, 'DISABLE', additionalDocumentFolderGuid, "TIER1", basePath);
                promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {
                            var createAddDoc = {
                                "form": {
                                    "userGUID": $stateParams.userguid,
                                    "formType": "additionaldocs",
                                    "formCoreFileGUID": data.file.fileGUID,
                                    "isEnabled": true,
                                    "fileName": data.file.fileName,
                                    "fileDescription": data.file.fileDescription
                                }
                            }
                            var promiseForms = UserFormsServiceAPI.createuserform($stateParams.userguid, createAddDoc);
                            promiseForms.then(function (Formsdata) {
                                self.getAllAdditionalDocuments();
                            });
                        }
                    }),
                    promise.error(function (data, status, headers, config) {
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if (data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
            break;

        default:
            //default code block
        }
    }


    //********************** Appraisal Licenses **********************//

    $scope.$watchCollection('[AppraisalUserCtrl.DisplayAddLicense]', function (newValues, oldValues) {
        if (newValues[0] != oldValues[0] && !newValues[0])
            commonFactory.clearFieldValidation('AddLicenseForm');
    });

    self.getAppraiserLicense = function () {
        var AppraisalId = $stateParams.userguid;
        self.AppraisalLicenseInfo = null;
        var licenseElement = {};
        var licenseArray = [];

        var promise = LicenseServiceAPI.getuserlicense(AppraisalId);
        return promise.then(function (Licesdedata) {
            var viewlicense = Licesdedata.licenses;
            for (var index = 0; index < viewlicense.length; index++) {
                if (AppraisalId.toLowerCase() == viewlicense[index].userGUID.toLowerCase()) {
                    licenseElement.userGUID = viewlicense[index].userGUID;
                    licenseElement.licenseState = mapToStateName(viewlicense[index].licenseState);
                    licenseElement.licenseNumber = viewlicense[index].licenseNumber;
                    licenseElement.expirationDate = $filter('setDateFormat')(viewlicense[index].expirationDate, "MM-dd-yyyy");

                    var licensePath = viewlicense[index].licenseFilePath;
                    if (licensePath != "" && licensePath != undefined)
                        licenseElement.licenseFilePath = viewlicense[index].licenseFilePath;
                    else
                        licenseElement.licenseFilePath = false;

                    licenseElement.licenseType = viewlicense[index].licenseType;
                    licenseElement.status = viewlicense[index].status;
                    licenseElement.isVerified = viewlicense[index].isVerified;
                    licenseElement.userLicenseGUID = viewlicense[index].userLicenseGUID;
                    licenseArray.push(licenseElement);
                    licenseElement = {};
                }
            }
            self.AppraisalLicenseInfo = licenseArray;
        });
    }
    self.getAppraiserLicense();

    $scope.openDeleteLicense = function (license) {
        $scope.DeleteSpecificLicense = license;
        var modalInstance = $modal.open({
            templateUrl: "DeleteLicenseTemplate.html",
            scope: $scope,
            controller: deleteLicenseController,
            size: 0
        });
    }

    var deleteLicenseController = function ($scope, $modalInstance) {
        $scope.DeleteSpecificLicense;

        $scope.deleteLicense = function () {
            var userGUID = $scope.DeleteSpecificLicense.userGUID;
            var licenseGUID = $scope.DeleteSpecificLicense.userLicenseGUID;
            var promise = LicenseServiceAPI.deleteuserlicense(userGUID, licenseGUID);
            promise.then(function (response) {
                $modalInstance.close();
                if (response.data) {
                    $rootScope.alertClass = "alert-danger";
                    $rootScope.userMessage = "Error: Failed to delete License. " + response.data.message.userMessage;
                } else {
                    self.getAppraiserLicense();
                    $rootScope.alertClass = "alert-success";
                    $rootScope.userMessage = "The appraisal license has been deleted.";
                }
            });
        }

        $scope.CancelLicenseDelete = function () {
            $modalInstance.close();
        }
    }


    self.getTemplate = function (ApplicenseObj) {
        if (ApplicenseObj.userLicenseGUID === self.editAppraiserSelected.userLicenseGUID) {
            return 'editLicense';
        } else return 'displayLicense';

    };

    self.AppraiserLicenseReset = function () {
        self.editAppraiserSelected = {};
    }


    self.editAppraiserLicense = function (ApplicenseObj) {
        self.editAppraiserSelected = angular.copy(ApplicenseObj);
    }

    self.verifyAndSaveLicense = function (actionType, userLicenseGUID, form) {
        if (form.$valid) {
            var selectedLicenseState = self.selectStateUpdateLicense;
            var LicenseNumber = self.AddlicenseNumber;
            var AppraisalUserId = $stateParams.userguid;
            self.licenseVerifiedData = {};

            var VerifyLicenseData = {
                "licenseVerifications": [{
                    "userLicenseGUID": LicenseNumber
                }]
            };

            var promise = LicenseServiceAPI.verifyUserLicense(VerifyLicenseData, AppraisalUserId, LicenseNumber);
            promise.then(function (licenseVerifiedData) {
                if (licenseVerifiedData.data) {
                    if (licenseVerifiedData.data.licenseVerifications == null) {
                        $rootScope.userMessage = "Error: Failed to verify the Appraisal license. " + licenseVerifiedData.data.message.userMessage;
                        $rootScope.alertClass = "alert-danger";
                    }
                } else {
                    self.licenseVerifiedData = licenseVerifiedData.licenseVerifications[0];
                    var newLicenseData = {
                        "license": {
                            "userGUID": AppraisalUserId,
                            "licenseState": selectedLicenseState,
                            "licenseNumber": LicenseNumber,
                            "expirationDate": "2015-07-22",
                            "licenseType": "",
                            "status": "",
                            "licenseFileCoreFileGUID": "",
                            "isVerified": true
                        }
                    }

                    if (actionType) {
                        switch (actionType) {
                        case 'add':
                            var promise = LicenseServiceAPI.createUserLicense(AppraisalUserId, newLicenseData);
                            promise.then(function (licenseData) {
                                if (!self.licenseVerifiedData.isVerified) {
                                    $rootScope.userMessage = "Appraisal license could not be verified with the Appraisal Subcommittee (ASC.gov); please re-type your license number EXACTLY as it appears on your appraiser license.";
                                    $rootScope.alertClass = "alert-danger";
                                } else if (licenseVerifiedData.data) {
                                    if (licenseVerifiedData.data.license == null) {
                                        $rootScope.userMessage = "Error: Failed to add new Appraisal license. " + licenseVerifiedData.data.message.userMessage;
                                        $rootScope.alertClass = "alert-danger";
                                    }
                                } else {
                                    $rootScope.userMessage = "Appraisal license has been verified and saved.";
                                    $rootScope.alertClass = "alert-success";
                                }
                                self.getAppraiserLicense();
                                self.editAppraiserLicense({});
                                self.cancelAddLicense();
                            });
                            break;
                        case 'update':
                            var promise = LicenseServiceAPI.updateUserLicense(AppraisalUserId, userLicenseGUID, newLicenseData);
                            promise.then(function (Licensedata) {
                                if (!self.licenseVerifiedData.isVerified) {
                                    $rootScope.userMessage = "Appraisal license could not be verified with the Appraisal Subcommittee (ASC.gov); please re-type your license number EXACTLY as it appears on your appraiser license.";
                                    $rootScope.alertClass = "alert-danger";
                                } else if (licenseVerifiedData.data) {
                                    if (licenseVerifiedData.data.license == null) {
                                        $rootScope.userMessage = "Error: Failed to update Appraisal license. " + licenseVerifiedData.data.message.userMessage;
                                        $rootScope.alertClass = "alert-danger";
                                    }
                                } else {
                                    $rootScope.userMessage = "Appraisal license has been verified and saved.";
                                    $rootScope.alertClass = "alert-success";
                                }
                                self.getAppraiserLicense();
                                self.editAppraiserSelected = {};
                            });
                        }
                    }
                }
            });
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.cancelAddLicense = function () {
            self.DisplayAddLicense = false;
            self.selectStateUpdateLicense = "";
            self.AddlicenseNumber = "";
        }
        //********************** Appraisal Licenses End **********************//



    self.IsCreateInsurance = "";
    self.InsuranceDetail = {};
    self.InsuranceDetailUpdate = {};

    self.getuserInsurance = function () {
        var AppraiserID = $stateParams.userguid;

        var promise = InsuranceServiceAPI.getuserinsurance(AppraiserID);
        return promise.then(function (InsuranceResponseData) {
            if (InsuranceResponseData.insurances.length > 0) {
                self.IsCreateInsurance = false;
            } else {
                self.IsCreateInsurance = true;
            }

            var InsuranceData = InsuranceResponseData.insurances;

            if (InsuranceData.length > 0) {


                self.InsuranceDetail.amount = InsuranceData[0].amount !== undefined ? '$' + InsuranceData[0].amount : "";
                self.InsuranceDetail.carrier = InsuranceData[0].carrier != undefined ? InsuranceData[0].carrier : "";
                self.InsuranceDetail.expirationDate = InsuranceData[0].expirationDate != undefined ? $filter('setDateFormat')(InsuranceData[0].expirationDate, "MM/dd/yyyy") : "";

                if (InsuranceData[0].insuranceDocumentFilePath == "") {
                    self.InsuranceDetail.insuranceDocumentFilePath = "(Not Uploaded)";
                    self.InsuranceDetail.IsInsuranceFile = false;
                } else {
                    self.InsuranceDetail.insuranceDocumentFilePath = InsuranceData[0].insuranceDocumentFilePath;
                    self.InsuranceDetail.IsInsuranceFile = true;
                }

                self.InsuranceDetail.userInsuranceGUID = InsuranceData[0].userInsuranceGUID;
                self.InsuranceDetail.insuranceDocumentCoreFileGUID = InsuranceData[0].insuranceDocumentCoreFileGUID;

            }
        });
    }

    self.editInsurance = function () {

        /* self.InsuranceDetail.expirationDate = InsuranceDetail[0].expirationDate != undefined ?$filter('setDateFormat')(self.InsuranceDetail.expirationDate, "EEE MMM dd yyyy") : "";*/

        self.InsuranceDetailUpdate.carrier = self.InsuranceDetail.carrier;
        self.InsuranceDetailUpdate.amount = self.InsuranceDetail.amount;
        self.InsuranceDetailUpdate.expirationDate = self.InsuranceDetail.expirationDate !== undefined ? $filter('setDateFormat')(self.InsuranceDetail.expirationDate, "EEE MMM dd yyyy") : "";
    }

    self.InsuranceUpdateSuccessMsg = false;

    self.updateInsurance = function () {

        var AppraiserID = $stateParams.userguid;
        var isnuranceGUID = self.InsuranceDetail.userInsuranceGUID;

        var insuranceData = {
            "insurance": {
                "userInsuranceGUID": self.InsuranceDetail.userInsuranceGUID,
                "userGUID": AppraiserID,
                "carrier": self.InsuranceDetailUpdate.carrier,
                "amount": self.InsuranceDetailUpdate.amount,
                "expirationDate": self.InsuranceDetailUpdate.expirationDate,
                "insuranceDocumentCoreFileGUID": self.InsuranceFileGUID
            }
        }



        if (self.IsCreateInsurance) {

            var promiseCreate = InsuranceServiceAPI.createuserinsurance(AppraiserID, insuranceData);
            promiseCreate.then(function (insuranceResponse) {
                self.InsuranceUpdateSuccessMsg = true;
                self.InsuranceUpdateSuccessMsgText = "Insurance has been created Successfully";
                self.viewInsurancePolicy = true;
                self.InsuranceDetail.expirationDate = $filter('setDateFormat')(self.InsuranceDetail.expirationDate, "MM/dd/yyyy");
                self.getuserInsurance();
                $timeout(function () {
                    self.callAtTimeout("InsuranceUpdateSuccessMsg");
                }, 3000);
            })

        } else {

            var promise = InsuranceServiceAPI.updateuserinsurance(AppraiserID, isnuranceGUID, insuranceData);
            promise.then(function (insuranceResponse) {
                self.InsuranceUpdateSuccessMsg = true;
                self.InsuranceUpdateSuccessMsgText = "Insurance has been updated Successfully";
                self.viewInsurancePolicy = true;
                self.InsuranceDetail.expirationDate = $filter('setDateFormat')(self.InsuranceDetail.expirationDate, "MM/dd/yyyy");
                self.getuserInsurance();
                $timeout(function () {
                    self.callAtTimeout("InsuranceUpdateSuccessMsg");
                }, 3000);
            });
        }

    }

    self.resetInsurance = function () {

    }

    $scope.openDeleteInsurance = function () {

        var modalInstance = $modal.open({
            templateUrl: "DeleteInsuranceTemplate.html",
            scope: $scope,
            controller: deleteInsuranceController,
            size: 0
        })
    }

    var deleteInsuranceController = function ($scope, $modalInstance) {
        $scope.deleteInsurance = function () {
            var AppraiserID = $stateParams.userguid;
            var insuranceGUID = self.InsuranceDetail.userInsuranceGUID;

            /*var promise = InsuranceServiceAPI.deleteuserinsurance(AppraiserID,insuranceGUID);
               promise.then(function (deleteInsurancedata) {                                      
                   $modalInstance.close();
                   self.getuserInsurance();
                   self.DeleteInsuranceStatus = true;
                   $timeout( function(){ self.callAtTimeout("DeleteInsuranceStatus"); }, 3000);
               })  */

            var fileGUID = self.InsuranceDetail.insuranceDocumentCoreFileGUID;
            var promise = FileMgmtAPI.deleteFile(fileGUID);
            promise.then(function (deleteInsurancedata) {
                $modalInstance.close();
                self.getuserInsurance();
                self.DeleteInsuranceStatus = true;
                $timeout(function () {
                    self.callAtTimeout("DeleteInsuranceStatus");
                }, 3000);
            });
        }

        $scope.CancelInsuranceDelete = function () {

            $modalInstance.close();
        }
    }




    //********************** Coverage Area **********************//
    self.invalidCounty = false;
    self.isNationwide = false;
    $scope.$watchCollection('[AppraisalUserCtrl.AddToCoverageArea]', function (newValues, oldValues) {
        if (newValues[0] != oldValues[0] && !newValues[0])
            commonFactory.clearFieldValidation('formAppraiserAddCoverageArea');
    });

    function getSelectedStateCoverage() {
        var i = 0;
        return self.AllCoverageArea.filter(function (item) {
            return item.stateCode == self.coverageAreaState;
        });
    }

    self.countyOnSelect = function () {
        if (self.coverageAreaCountiesSelected) {
            $("#coverageAreaCounties_chosen").find(".chosen-choices").css('border-color', '');
            self.invalidCounty = false;
        }
    }

    self.getAllCoverageArea = function () {
        self.AllCoverageArea = [];
        var AppraiserID = $stateParams.userguid;
        var promise = CoverageAreaServiceAPI.getUserCoverageArea(AppraiserID);
        return promise.then(function (CAResponseData) {
            var CoverageAreaData = CAResponseData.coverageAreas;
            var elementCA = {};
            angular.forEach(CoverageAreaData, function (CAData) {
                elementCA = {};
                if (CAData.state == "ALL") {
                    elementCA.state = "Nationwide";
                    self.isNationwide = true;
                } else {
                    elementCA.state = mapToStateName(CAData.state);
                }
                elementCA.stateCode = (CAData.state == "ALL") ? "0" : CAData.state;
                elementCA.county = (CAData.state == "ALL" || CAData.county == "ALL") ? "All Counties" : CAData.county;
                elementCA.countyCode = (CAData.county == "ALL") ? "0" : CAData.county;
                elementCA.userCoverageAreaGUID = CAData.userCoverageAreaGUID;
                self.AllCoverageArea.push(elementCA);
            });
        });
    }


    $scope.openDeleteCoverageArea = function (userCoverageAreaGUID, stateCode) {
        $scope.userCoverageAreaGUIDDelete = userCoverageAreaGUID;
        $scope.coverageStateCodeToDelete = stateCode;

        var modalInstance = $modal.open({
            templateUrl: "DeleteCoverageAreaTemplate.html",
            scope: $scope,
            controller: deleteCoverageAreaController,
            size: 0
        });
    }

    var deleteCoverageAreaController = function ($scope, $modalInstance) {
        $scope.deleteCoverageArea = function () {
            var userGUID = $stateParams.userguid;
            var userCoverageAreaGUID = $scope.userCoverageAreaGUIDDelete;

            var promise = CoverageAreaServiceAPI.deleteCoverageArea(userGUID, userCoverageAreaGUID);
            promise.then(function (response) {
                $modalInstance.close();
                if (response.data) {
                    $rootScope.alertClass = "alert-danger";
                    $rootScope.userMessage = "Error: Failed to delete coverage area. " + response.data.message.userMessage;
                } else {
                    if ($scope.coverageStateCodeToDelete == "0")
                        self.isNationwide = false;

                    self.getAllCoverageArea();
                    $rootScope.alertClass = "alert-success";
                    $rootScope.userMessage = "The coverage entry was deleted.";
                }
            });
        }

        $scope.CancelCoverageAreaDelete = function () {
            $modalInstance.close();
        }
    }

    self.getCountiesByState = function () {
        document.getElementById("coverageAreaCounties").disabled = true;
        self.coverageAreaCountiesSelected = [];
        self.CountiesByState = [];
        if (self.coverageAreaState !== undefined && self.coverageAreaState !== "ALL") {
            var promise = geocodeService.getCounties('US', self.coverageAreaState);
            var allCountiesOption = {
                "countyName": "(All Counties)",
                "stateCode": "ALL",
                "fips": ""
            }
            promise.then(function (dataCounties) {
                document.getElementById("coverageAreaCounties").disabled = false;
                self.CountiesByState = dataCounties.counties;
                self.CountiesByState.push(allCountiesOption);

                // applying timeout to wait till counties gets append to view
                $timeout(function () {
                    var i = 0;
                    var selectedStateCounties = getSelectedStateCoverage();

                    $("#coverageAreaCounties").find("option").each(function () {
                        for (i = 0; i < selectedStateCounties.length; i++) {
                            if (selectedStateCounties[i].county.toLowerCase() == this.innerText.toLowerCase()) {
                                $(this).addClass('result-selected');
                                $(this).prop('disabled', true);
                                break;
                            }
                        }
                    });
                    $('#coverageAreaCounties').trigger('chosen:updated')
                });
            });
        }
    }

    self.AddCoverageArea = function () {
        if ($scope.formAppraiserAddCoverageArea.$valid) {
            var AppraiserID = $stateParams.userguid;
            var SelectedCovrageArea = [];
            var objCountyName = {};
            var selectedStateCounties = getSelectedStateCoverage();
            var i = 0;
            if (self.coverageAreaState == 'ALL') {
                objCountyName.state = self.coverageAreaState;
                objCountyName.county = "ALL";
                SelectedCovrageArea.push(objCountyName);
            } else {
                for (var index = 0; index < self.coverageAreaCountiesSelected.length; index++) {
                    objCountyName = {};
                    objCountyName.state = self.coverageAreaState;
                    objCountyName.county = (self.coverageAreaCountiesSelected[index].countyName.toLowerCase() == "(all counties)") ? "ALL" : self.coverageAreaCountiesSelected[index].countyName;
                    SelectedCovrageArea.push(objCountyName);

                    //Preventing coverage county to make duplicate entry if county is already added as coverage area for selected state.
                    for (i = 0; i < selectedStateCounties.length; i++) {
                        if (selectedStateCounties[i].county.toLowerCase() == self.coverageAreaCountiesSelected[index].countyName.toLowerCase()) {
                            SelectedCovrageArea.pop();
                            break;
                        }
                    }
                }
            }

            if (SelectedCovrageArea.length) {
                var promise = CoverageAreaServiceAPI.createUserCoverageArea(AppraiserID, {
                    "coverageAreas": SelectedCovrageArea
                });

                promise.then(function (coverageAreadata) {
                    if (coverageAreadata.coverageAreas == null) {
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Error: Failed to add new coverage area. " + coverageAreadata.data.message.userMessage;
                    } else {
                        self.getAllCoverageArea();
                        self.cancelAddCoverageArea();
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "New coverage area has been added successfully.";
                    }
                });
            } else {
                $rootScope.alertClass = "alert-danger";
                $rootScope.userMessage = "Error: Duplicate entry found.";
            }
        } else {
            if ($scope.formAppraiserAddCoverageArea.coverageAreaCounties) {
                $("#coverageAreaCounties_chosen").find(".chosen-choices").css('border-color', '#8e1d14');
                self.invalidCounty = true;
            }
            var inputElements = document.getElementsByName("formAppraiserAddCoverageArea");
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.cancelAddCoverageArea = function () {
        self.AddToCoverageArea = false;
        self.CountiesByState = [];
        self.coverageAreaState = "";
        document.getElementById("coverageAreaCounties").disabled = true;
        $("#coverageAreaCounties_chosen").find(".chosen-choices").css('border-color', '');
        self.invalidCounty = false;
    }

    //********************** Coverage Area End **********************//

    self.callAtTimeout = function (Type) {
        switch (Type) {
        case 'AddCAFail':
            if (self.AddCoverageAreaStatus == true) {
                self.AddCoverageAreaStatus = false;
            }
            break;

        case 'AddCASuccess':
            if (self.CreateCoverageAreaStatus == true) {
                self.CreateCoverageAreaStatus = false;
            }
            break;

        case 'DeleteInsuranceStatus':
            if (self.DeleteInsuranceStatus == true) {
                self.DeleteInsuranceStatus = false;
            }
            break;

        case 'UploadfileInsuranceStatus':
            if (self.UploadfileInsuranceStatus == true) {
                self.UploadfileInsuranceStatus = false;
            }
            break;

        case 'DeletelicenseStatus':
            if (self.DeletelicenseStatus == true) {
                self.DeletelicenseStatus = false;
            }
            break;

        case 'LicenseCreatedStatus':
            if (self.LicenseCreatedStatus == true) {
                self.LicenseCreatedStatus = false;
            }
            break;

        case 'uploadLicenseSuccessMsg':
            if (self.uploadLicenseSuccessMsg == true) {
                self.uploadLicenseSuccessMsg = false;
            }
            break;

        case 'UpdatelicenseStatus':
            if (self.UpdatelicenseStatus == true) {
                self.UpdatelicenseStatus = false;
            }
            break;
        case 'DeleteAddDocStatus':
            if (self.DeleteAddDocStatus == true) {
                self.DeleteAddDocStatus = false;
            }
            break;
        case 'UpdateAddDocStatus':
            if (self.UpdateAddDocStatus == true) {
                self.UpdateAddDocStatus = false;
            }
            break;

        case 'IsChangePasswordFailed':
            if (self.IsChangePasswordFailed == true) {
                self.IsChangePasswordFailed = false;
            }
            break;

        case 'uploadSuccessMsgSignature':
            if (self.uploadSuccessMsgSignature == true) {
                self.uploadSuccessMsgSignature = false;
            }
            break;

        case 'InsuranceUpdateSuccessMsg':
            if (self.InsuranceUpdateSuccessMsg == true) {
                self.InsuranceUpdateSuccessMsg = false;
            }
            break;

        default:
        }
    }

    self.ResetPassword = function () {

        var AppraiserID = $stateParams.userguid;
        var oldpassword = this.oldPassword;
        var newPassword = this.newPassword;
        var Retypepassword = this.retype;

        if ($scope.AppraiserChangePassword.$valid) {
            if (newPassword != Retypepassword) {
                self.IsChangePasswordFailed = true;
                self.ErrorMessage = "New Password and Repeat Password should be same";
                $timeout(function () {
                    self.callAtTimeout("IsChangePasswordFailed");
                }, 3000);
                return; // this.ErrorMessage;
            }

            var PasswordData = {
                "userAuthenitication": {
                    "password": newPassword
                }
            }
            var promise = UserServiceAPI.ChangePassword(AppraiserID, PasswordData);
            promise.then(function (data) {
                //$state.go('accountMgmt.user.list');
                console.log("Password changed successfully");
            });

        } else {
            var inputElements = document.getElementsByName($scope.AppraiserChangePassword.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.CancelAppraiserChangePassword = function () {
        var params = {
            companyguid: $stateParams.companyguid,
            officeguid: $stateParams.officeguid,
            userguid: $stateParams.userguid
        };
        $state.go('accountMgmt.user.appraiserView', params);
    }

    $timeout(function () {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    });
}]);

angular.module('AccountMgmtModule').filter('setDateFormat', function ($filter) {
    return function (input, format) {
        if (input == null) {
            return "";
        }
        var _date = $filter('date')(new Date(input), format);
        return _date.toUpperCase();

    };
});