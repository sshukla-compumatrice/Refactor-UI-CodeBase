angular.module('AccountMgmtModule').controller('UserController', ['$rootScope', '$scope', '$state', 'UserServiceAPI', 'Upload', '$modal', '$location', '$stateParams', 'FileMgmtAPI', '$log', 'roleList', 'roleServiceAPI', 'AuthFactory', function ($rootScope, $scope, $state, UserServiceAPI, Upload, $modal, $location, $stateParams, FileMgmtAPI, $log, roleList, roleServiceAPI, AuthFactory) {

    var self = this;
    var userGUID = $location.search().userguid;
    var userEditFields = ["email", "role", "employeeNumber", "cellNumber", "userTitle", "isEpRadioYes", "isEpRadioNo", "allowSignYes", "allowSignNo", "firstName", "middleInitial", "lastName", "emailClosing", "edrAccountNo", "edrPassword"];
    var updateUserSyncCnt = 0;

    init();

    function init() {
        self.isEditUser = false;
        // Query params
        self.companyguid = $location.search().companyguid;
        self.officeguid = $location.search().officeguid;
        self.userguid = $location.search().userguid;
        self.loggedInUserGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
        self.editNotAuthorized = false;
        self.qualificationFolderGuid = self.signatureFolderGuid = false;

        if ($state.current.name == 'accountMgmt.user.new') {
            self.headerText = "Creating Account";
            self.showUserEditForm = true;
            self.IsEnvProfessional = false;
        } else if ($state.current.name == 'accountMgmt.user.edit') {
            self.headerText = "Editing User";
            self.isEditUser = true;
            self.showUserEditForm = false;
            displayUserInfo();
        } else if ($state.current.name == 'accountMgmt.user.view') {
            var userguid = $stateParams.userguid;
            displayUserInfo();
        }

        self.roles = roleList.roles ? roleList.roles : [];
        $('[data-toggle="tooltip"]').tooltip();

        self.hideControls = {
            qualificationFileUpload: false,
            signatureFileUpload: false
        };
    }

    // Assign GUIDs to the variable as per folderType we requested
    function assignFolderGuids(folderType, folderGuid) {
        switch (folderType) {
        case "Qualifications":
            self.qualificationFolderGuid = folderGuid;
            break;
        case "Signatures":
            self.signatureFolderGuid = folderGuid;
        }
    }

    // Store folderGuids for Qualification & Signature file upload
    function getFolderGuids() {
        FileMgmtAPI.getSharedFolder(false, "Qualifications,Signatures", "", false, self.userguid).then(function (resp) {
            if (resp && resp.folders && resp.folders.length) {
                for (i = 0; i < resp.folders.length; i++) {
                    assignFolderGuids(resp.folders[i].folderType, resp.folders[i].folderGUID);
                    if (self.qualificationFolderGuid && self.signatureFolderGuid) break;
                }
            } else {
                self.qualificationAlertClass = "alert-danger";
                self.qualificationUserMessage = "<strong>Error:</strong> Cannot upload qualification file. Folder is not available to upload qualification file. Please contact to EDR support.";
                self.signatureAlertClass = "alert-danger";
                self.signatureUserMessage = "<strong>Error:</strong> Cannot upload signature file. Folder is not available to upload signature file. Please contact to EDR support.";
                self.hideControls.qualificationFileUpload = true;
                self.hideControls.signatureFileUpload = true;
            }
        });
    }

    // Init scope variables to be used on view
    function displayUserInfo() {
        var userguid = $stateParams.userguid;
        var promise = UserServiceAPI.getUserInfo(userguid, self.companyguid, self.officeguid, "defaultuserrole");
        promise.then(function (data) {
            if (data && data.users && data.users.length) {
                var users = data.users;
                self.showUserEditForm = true;

                getFolderGuids();

                for (var index = 0; index < users.length; index++) {
                    self.firstname = users[index].firstName != undefined ? users[index].firstName : "";
                    self.title = users[index].title != undefined ? users[index].title : "";
                    self.middlename = users[index].middleInitial != undefined ? users[index].middleInitial : "";
                    self.lastname = users[index].lastName != undefined ? users[index].lastName : "";
                    self.email = users[index].email != undefined ? users[index].email : "";
                    self.emailClosing = users[index].emailClosing != undefined ? users[index].emailClosing : "";

                    if (users[index].directPhone != "" && users[index].directPhone != undefined)
                        self.cell = users[index].directPhone;
                    else
                        self.cell = users[index].cellPhone;

                    self.IsEnvProfessional = users[index].isEnvProfessional != undefined &&
                        users[index].isEnvProfessional != "" ? users[index].isEnvProfessional : false;

                    self.IsAllowAdmintoSignIn = users[index].allowAdminsToSign != undefined &&
                        users[index].allowAdminsToSign != "" ? users[index].allowAdminsToSign : false;

                    self.username = users[index].userName != undefined ? users[index].userName : "";

                    self.qualificationsFileCoreFileGUID = users[index].qualificationsFileCoreFileGUID ? users[index].qualificationsFileCoreFileGUID : "";
                    self.qualificationsFileDisplayName = users[index].qualificationsFileDisplayName ? users[index].qualificationsFileDisplayName : "";

                    self.qualificationsFileCoreFileUrl = self.qualificationsFileCoreFileGUID ? FileMgmtAPI.getFileStream(self.qualificationsFileCoreFileGUID) + '?' + new Date().getTime() + "&responseType=inline" : "";

                    self.signatureFileCoreFileGUID = users[index].signatureFileCoreFileGUID ? users[index].signatureFileCoreFileGUID : "";
                    self.signatureFileDisplayName = users[index].signatureFileDisplayName ? users[index].signatureFileDisplayName : "";

                    self.signatureFileCoreFileUrl = self.signatureFileCoreFileGUID ? FileMgmtAPI.getFileStream(self.signatureFileCoreFileGUID) + '?' + new Date().getTime() : "";

                    self.userRoleGuid = users[index].edrDefaultUserRoleGUID;
                    self.edrDefaultUserRole = users[index].edrDefaultUserRole;

                    if (roleList.roles && roleList.roles.length) {
                        var matchedRoles = roleList.roles.filter(function (item) {
                            return item.roleGUID == users[index].edrDefaultUserRoleGUID;
                        });

                        if (matchedRoles && matchedRoles.length) {
                            self.editNotAuthorized = false;
                        } else {
                            self.editNotAuthorized = true;
                            self.showUserEditForm = false;
                        }
                    } else {
                        self.editNotAuthorized = true;
                        self.showUserEditForm = false;
                    }

                    self.employeeNumber = users[index].employeeNumber;

                    self.edrAccountNumber = users[index].edrAccountNumber ? users[index].edrAccountNumber : "";
                    self.edrAccountPassword = users[index].edrAccountPassword ? users[index].edrAccountPassword : "";
                }
            } else {
                self.showUserEditForm = false;
                usrMsg = (data.data.message != undefined) ? data.data.message.userMessage : "";
                $rootScope.alertClass = 'alert-danger';
                $rootScope.userMessage = "Error: Problem in getting user details. " + usrMsg;
                window.scrollTo(0, 0);
            }
        });
    }

    //Calculate GSD to be used for aspect ratio
    function getGcd(val1, val2) {
        if (val2 == 0)
            return val1;
        return getGcd(val2, val1 % val2)
    }

    function updateUser(userData) {
        if (updateUserSyncCnt == 0) {
            $rootScope.promise = UserServiceAPI.updateuser(self.userguid, userData);
            $rootScope.promise.then(function (data) {
                if (typeof data === 'string') {
                    if ($state.current.name == "accountMgmt.user.view") {
                        self.qualificationsFileCoreFileUrl = self.qualificationsFileCoreFileGUID ? FileMgmtAPI.getFileStream(self.qualificationsFileCoreFileGUID) + '?' + new Date().getTime() + "&responseType=inline" : "";

                        self.signatureFileCoreFileUrl = self.signatureFileCoreFileGUID ? FileMgmtAPI.getFileStream(self.signatureFileCoreFileGUID) + '?' + new Date().getTime() : "";
                    } else {
                        if (!self.grantAccessVal) {
                            $rootScope.skipMsgClear = true;
                            $rootScope.alertClass = 'alert-success';
                            $rootScope.userMessage = "The user <strong>" + self.lastname + ", " + self.firstname + "</strong> was updated successfully.";
                            $state.go('accountMgmt.user.view', {
                                companyguid: self.companyguid,
                                officeguid: self.officeguid,
                                userguid: self.userguid
                            });
                        }
                    }
                } else {
                    usrMsg = (data.data.message != undefined) ? data.data.message.userMessage : "";
                    $rootScope.alertClass = 'alert-danger';
                    $rootScope.userMessage = "Error: Problem in updating <strong>" + self.email + "</strong> user. " + usrMsg;
                    window.scrollTo(0, 0);
                    return;
                }
            });
        }
    }

    function getUserData() {
        return {
            "user": {
                "userName": self.email,
                "title": self.title != undefined ? self.title : "",
                "firstName": self.firstname,
                "middleInitial": self.middlename != undefined ? self.middlename : "",
                "lastName": self.lastname,
                "isEnabled": "",
                "email": self.email,
                "officeEmail": "",
                "emailClosing": self.emailClosing != undefined ? self.emailClosing : "",
                "directPhone": self.cell != undefined ? self.cell : "",
                "cellPhone": self.cell != undefined ? self.cell : "",
                "qualificationsFileDisplayName": self.qualificationsFileDisplayName,
                "qualificationsFileCoreFileGUID": self.qualificationsFileCoreFileGUID,
                "signatureFileDisplayName": self.signatureFileDisplayName,
                "signatureFileCoreFileGUID": self.signatureFileCoreFileGUID,
                "isEnvProfessional": self.IsEnvProfessional,
                "allowAdminsToSign": self.IsAllowAdmintoSignIn != undefined ? self.IsAllowAdmintoSignIn : false,
                "allowFeeAssignments": true,
                "allowAppraisalReviews": true,
                "allowEvaluations": true,
                "certifiedHUDFHA": true,
                "certifiedVA": true,
                "designations": [],
                "expertise": [],
                "edrDefaultUserRoleGUID": self.userRoleGuid,
                "edrDefaultUserRole": self.edrDefaultUserRole,
                "officeGUID": self.officeguid,
                "companyGUID": self.companyguid,
                "employeeNumber": self.employeeNumber,
                "edrAccountNumber": self.edrAccountNumber,
                "edrAccountPassword": self.edrAccountPassword
            }
        }
    }

    function grantAccessToReports(action) {
        var expirationTS = new Date();
        expirationTS.setFullYear(expirationTS.getFullYear() + 2);
        var obj = {
            "roleAccessEntityAssetsBulk": [{
                "sourceAccessEntityType": "User",
                "sourceAccessEntityGUID": self.loggedInUserGuid,
                "destinationAccessEntityType": "User",
                "destinationAccessEntityGUID": self.userguid,
                "assetType": "Report",
                "effectiveTS": formatDate(new Date()),
                "expirationTS": formatDate(expirationTS)
                }]
        };

        roleServiceAPI.grantAccessToAllMyReports(obj).then(function (resp) {
            $rootScope.skipMsgClear = true;
            if (resp && resp.status && resp.status != 201) {
                usrMsg = (resp.data.message != undefined) ? resp.data.message.userMessage : "";
                $rootScope.alertClass = 'alert-danger';
                $rootScope.userMessage = "Error: Problem in granting access of your reports to <strong>" + self.email + "</strong> user. " + usrMsg;
            }
            if (action == "adding") {
                if (resp && resp.status && resp.status == 201) {
                    $rootScope.alertClass = 'alert-success';
                    $rootScope.userMessage = "The new account for <strong>" + self.lastname + ", " + self.firstname + "</strong> was successfully created.";
                }
                $state.go('accountMgmt.user.list', {
                    companyguid: self.companyguid,
                    officeguid: self.officeguid
                });
            } else {
                if (resp && resp.status && resp.status == 201) {
                    $rootScope.alertClass = 'alert-success';
                    $rootScope.userMessage = "The user <strong>" + self.lastname + ", " + self.firstname + "</strong> was updated successfully.";
                }
                $state.go('accountMgmt.user.view', {
                    companyguid: self.companyguid,
                    officeguid: self.officeguid,
                    userguid: self.userguid
                });
            }
        }, function (error) {
            usrMsg = (resp.data.message != undefined) ? resp.data.message.userMessage : "";
            $rootScope.alertClass = 'alert-danger';
            $rootScope.userMessage = "Error: Problem in granting access of your reports to <strong>" + self.email + "</strong> user. " + usrMsg;
        });
    }

    self.saveUserData = function (form) {
        var usrMsg = "";
        updateUserSyncCnt = 0;

        if (form.$valid) {
            var userData = getUserData();
            if ($state.current.name == "accountMgmt.user.new") {
                $rootScope.promise = UserServiceAPI.createuser(userData);
                $rootScope.promise.then(function (data) {
                    if (data && data.user && data.user !== null) {
                        if (self.grantAccessVal) {
                            grantAccessToReports('adding');
                        } else {
                            $rootScope.skipMsgClear = true;
                            $rootScope.alertClass = 'alert-success';
                            $rootScope.userMessage = "The new account for <strong>" + self.lastname + ", " + self.firstname + "</strong> was successfully created.";
                            $state.go('accountMgmt.user.list', {
                                companyguid: self.companyguid,
                                officeguid: self.officeguid
                            });
                        }
                    } else {
                        usrMsg = (data.data.message != undefined) ? data.data.message.userMessage : "";
                        $rootScope.alertClass = 'alert-danger';
                        $rootScope.userMessage = "Error: Problem in adding <strong>" + self.email + "</strong> user. " + usrMsg;
                        window.scrollTo(0, 0);
                    }
                });
            } else if ($state.current.name == "accountMgmt.user.edit") {
                var userguid = self.userguid;
                var doUserUpdate = false;

                angular.forEach(form, function (value, key) {
                    if (key == "qualificationsFile" && form.qualificationsFile.$modelValue != null) {
                        updateUserSyncCnt++;
                        self.uploadFile('qualification');
                    } else if (key == "signatureFile" && form.signatureFile.$modelValue != null) {
                        updateUserSyncCnt++;
                        self.uploadFile('signature');
                    } else if (key[0] == '$' && doUserUpdate) return;
                    else if (userEditFields.indexOf(key) >= 0) {
                        if (value.$dirty) {
                            doUserUpdate = true;
                        }
                    } else {}
                });

                if (doUserUpdate)
                    updateUser(userData);

                if (self.grantAccessVal)
                    grantAccessToReports('updating');
            } else {}
        }
    }

    self.updateUserAfterFileDelete = function () {
        var userData = getUserData();
        updateUser(userData);
    }

    self.openHelpModal = function (targetModal) {
        $modal.open({
            templateUrl: targetModal,
            size: "lg",
            controller: function ($modalInstance, $scope) {
                $scope.closeHelpModal = function () {
                    $modalInstance.close();
                }
            }
        });
    }

    self.cancelUserCreation = function () {
        $state.go('accountMgmt.user.list', {
            companyguid: $state.params.companyguid,
            officeguid: $state.params.officeguid
        });
    }

    self.uploadFile = function (Type) {
        var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
        var userData;
        var isSignatureUploaded = false;
        var isQualificationUploaded = false;

        switch (Type) {
        case 'qualification':
            var qualificationfile = self.qualificationfile;
            self.isQualificationUpload = false;
            var basePath = "/Accounts/Users/" + self.userguid;
            if (self.qualificationFolderGuid) {
                $rootScope.promise = FileMgmtAPI.uploadFile(qualificationfile, 'DISABLE', self.qualificationFolderGuid, "TIER1", basePath, self.qualificationsFileCoreFileGUID);
                $rootScope.promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    $rootScope.promise.success(function (data, status, headers, config) {
                        if ((data && data.file) || typeof data === 'string') {                            
                            self.qualificationfile = null;

                            self.qualificationAlertClass = "alert-success";
                            self.qualificationUserMessage = "Qualification file is uploaded successfully.";

                            self.qualificationsFileCoreFileGUID = data.file ? data.file.fileGUID : self.qualificationsFileCoreFileGUID;

                            userData = getUserData();

                            userData.user.qualificationsFileDisplayName = self.qualificationsFileDisplayName = qualificationfile.name;
                            if (!userData.user.qualificationsFileCoreFileGUID) {
                                isQualificationUploaded = true;
                                userData.user.qualificationsFileCoreFileGUID = data.file ? data.file.fileGUID : self.qualificationsFileCoreFileGUID;                                
                            }

                            if (self.qualificationsFileCoreFileUrl) {
                                self.qualificationsFileCoreFileUrl = self.qualificationsFileCoreFileUrl.substring(0, self.qualificationsFileCoreFileUrl.lastIndexOf('?')) + '?' + new Date().getTime() + "&responseType=inline";
                            }
                            
                            updateUserSyncCnt = updateUserSyncCnt ? updateUserSyncCnt-1 : 0;
                            updateUser(userData);
                        }
                    }),
                    $rootScope.promise.error(function (data, status, headers, config) {
                        self.qualificationAlertClass = "alert-danger";
                        self.qualificationUserMessage = "<strong>Error:</strong> Problem in uploading qualification file. ";
                        if (data.message)
                            self.qualificationUserMessage += data.message.userMessage + ". Please try again.";
                        else
                            self.qualificationUserMessage += "Please try again.";
                        accessMgmtFactoryLogger.error(config);

                        if(isSignatureUploaded) FileMgmtAPI.deleteFile(self.signatureFileCoreFileGUID);
                        self.signatureUserMessage = "";
                    });
            } else {
                self.qualificationAlertClass = "alert-danger";
                self.qualificationUserMessage = "<strong>Error:</strong> Problem in uploading qualification file. Folder is not available to upload qualification file. Please contact to EDR support.";
                self.hideControls.qualificationFileUpload = true;
            }
            break;

        case 'signature':
            var signaturefile = self.signaturefile;
            self.isSignatureUpload = false;
            self.SignatureErrorMessage = "";
            var basePath = "/Accounts/Users/" + self.userguid;
            if (self.signatureFolderGuid) {
                $rootScope.promise = FileMgmtAPI.uploadFile(signaturefile, 'DISABLE', self.signatureFolderGuid, "TIER1", basePath, self.signatureFileCoreFileGUID);
                $rootScope.promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    $rootScope.promise.success(function (data, status, headers, config) {
                        if ((data && data.file) || typeof data === 'string') {                            
                            var userData = getUserData();
                            self.signaturefile = null;

                            self.signatureAlertClass = "alert-success";
                            self.signatureUserMessage = "Signature file is uploaded successfully.";

                            userData = getUserData();

                            self.signatureFileCoreFileGUID = data.file ? data.file.fileGUID : self.signatureFileCoreFileGUID;
                            userData.user.signatureFileDisplayName = self.signatureFileDisplayName = signaturefile.name;

                            if (!userData.user.signatureFileCoreFileGUID) {
                                isSignatureUploaded = true;
                                userData.user.signatureFileCoreFileGUID = data.file ? data.file.fileGUID : self.signatureFileCoreFileGUID;                                
                            }

                            if (self.signatureFileCoreFileUrl) {
                                self.signatureFileCoreFileUrl = self.signatureFileCoreFileUrl.substring(0, self.signatureFileCoreFileUrl.lastIndexOf('?')) + '?' + new Date().getTime();
                            }
                            
                            updateUserSyncCnt = updateUserSyncCnt ? updateUserSyncCnt-1 : 0;
                            updateUser(userData);
                        }
                    }),
                    $rootScope.promise.error(function (data, status, headers, config) {
                        self.signatureAlertClass = "alert-danger";
                        self.signatureUserMessage = "<strong>Error:</strong> Problem in uploading signature file. ";
                        if (data.message)
                            self.signatureUserMessage += data.message.userMessage + ". Please try again.";
                        else
                            self.signatureUserMessage += "Please try again.";
                        accessMgmtFactoryLogger.error(config);

                        if(isQualificationUploaded) FileMgmtAPI.deleteFile(self.qualificationsFileCoreFileGUID);
                        self.qualificationUserMessage = "";
                    });
            } else {
                self.signatureAlertClass = "alert-danger";
                self.signatureUserMessage = "<strong>Error:</strong> Cannot upload signature file. Folder is not available to upload signature file. Please contact to EDR support.";
                self.hideControls.signatureFileUpload = true;
            }
            break;
        }

    }

    function formatDate(dateVal) {
        var newDate = new Date(dateVal);
        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = padValue(newDate.getMinutes());
        var sSecond = newDate.getSeconds();
        return sYear + "-" + sMonth + "-" + sDay + " " + sHour + ":" + sMinute + ":" + sSecond;
    }

    function padValue(value) {
        return (value < 10) ? "0" + value : value;
    }

    self.checkFile = function (file, invalidFiles, uploadtype) {
        if (self.qualificationUserMessage && uploadtype == "qualification") self.qualificationUserMessage = "";
        if (self.signatureUserMessage && uploadtype == "signature") self.signatureUserMessage = "";

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
                if(uploadtype == "qualification") msg += "<br><strong>Error:</strong> File size is incorrect.";
                else if (uploadtype == "signature") msg += "<br><strong>Error:</strong> Image size is incorrect.";
                else {}
                break;
            case "ratio":
                hwGcd = getGcd(invalidFiles[0].$ngfWidth, invalidFiles[0].$ngfHeight);
                msg += "<br><strong>Aspect ratio:</strong> " + invalidFiles[0].$ngfWidth / hwGcd + ":" + invalidFiles[0].$ngfHeight / hwGcd;
                msg += "<br><strong>Error:</strong> Image aspect ratio is incorrect.";
                break;
            }

            if (uploadtype == "signature") {
                self.signatureAlertClass = "alert-danger";
                self.signatureUserMessage = msg;
            } else if (uploadtype == "qualification") {
                self.qualificationAlertClass = "alert-danger";
                self.qualificationUserMessage = msg;
            } else {}
        } else {
            if (uploadtype == "signature" && !self.signatureFolderGuid) {
                self.signatureAlertClass = "alert-danger";
                self.signatureUserMessage = "<strong>Error:</strong> Cannot upload signature file. Folder is not available to upload signature file. Please contact to EDR support.";
                self.hideControls.signatureFileUpload = true;
            } else if (uploadtype == "qualification" && !self.qualificationFolderGuid) {
                self.qualificationAlertClass = "alert-danger";
                self.qualificationUserMessage = "<strong>Error:</strong> Cannot upload qualification file. Folder is not available to upload qualification file. Please contact to EDR support.";
                self.hideControls.qualificationFileUpload = true;
            } else {}
        }
        return;
    }

    $scope.OpenDeleteQualificationFile = function (fileGUID) {
        var modalInstance = $modal.open({
            templateUrl: "DeleteQualificationTemplate.html",
            scope: $scope,
            controller: deleteQualificationFileController,
            size: 0,
            resolve: {
                currentScope: function () {
                    return self;
                }
            }
        });
    }

    function deleteQualificationFileController($scope, $modalInstance, currentScope) {
        $scope.deleteQualificationFile = function () {
            var QFFileGUID = $scope.QFFileGUID;
            $rootScope.promise = FileMgmtAPI.deleteFile(currentScope.qualificationsFileCoreFileGUID); //(QFFileGUID);
            $rootScope.promise.then(function (deleteQFdata) {
                if (typeof deleteQFdata === 'object') {
                    var usrMsg = (deleteQFdata.data.message != undefined) ? deleteQFdata.data.message.userMessage : "";
                    $rootScope.alertClass = 'alert-danger';
                    $rootScope.userMessage = "<strong>Error:</strong> Problem in deleting qualification file. " + usrMsg ? usrMsg + ". Please try again." : "Please try again."
                } else {
                    currentScope.qualificationsFileCoreFileGUID = "";
                    currentScope.qualificationsFileCoreFileUrl = "";
                    currentScope.qualificationsFileDisplayName = "";
                    currentScope.updateUserAfterFileDelete();
                    $rootScope.alertClass = 'alert-success';
                    $rootScope.userMessage = "Qualification file has been deleted.";
                    $modalInstance.close();
                }
                window.scroll(0, 0);
            });
        }

        $scope.CancelQualificationFileDelete = function () {
            $modalInstance.close();
        }
    }
}]);