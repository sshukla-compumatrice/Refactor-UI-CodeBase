angular.module('ProjectDashboard').controller('PortfolioSignatureTool', ['$scope','$state', '$window', 'projectDashboardOperations', '$stateParams', 'checkStatus', '$q', function ($scope, $state, $window, projectDashboardOperations, $stateParams, checkStatus, $q) {

    var self = this;


    init();

    function init() {
        self.showAlert = false;
        self.reportTypes = [];
        self.selectedReportType = {};
        getProjectSignOffData();
        self.templateCertificates = {};
        self.isSignedCert = [];
        self.isSignedSignature = [];
        self.certificatioText = [];
        self.currentUserGUID = "a0f5e294-b497-4c16-8fa4-526c9413530f";
        //replace (currentUserGUID) this by account guid
    }

    function getProjectSignOffData() {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
            projectDashboardOperations.getProjectSignOffData($stateParams.projectGuid, $stateParams.accountGuid).then(function (response) {
                if (response.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'GET')) {
                    self.serviceMessage = response.data.message === undefined ? "Unable to fetch records" : response.data.message.userMessage;
                    addClassToReportsAlerts("error", self.serviceMessage);
                    //self.displayIfRecords = false;
                } else if(response.reports.length==0){
                     self.serviceMessage = "No records found";
                    addClassToReportsAlerts("error", self.serviceMessage);
                } else {
                    self.showAlert = false;
                    if (self.selectedReportType && self.selectedReportType.hasOwnProperty("reportType"))
                        addClassToReportsAlerts("success", "Changes for report type: " + self.selectedReportType.reportType + " has been submited successfully");
                    fillReportTypes(response.reports);
                    self.reportSignoffData = response.reports;
                    fillReportDetails();
                }
            })
    }

    function fillReportTypes(reportTypesArray) {
        angular.forEach(reportTypesArray, function (report, index) {
            var reportTypeObj = {
                "reportType": report.reportType,
                "reportTypeGuid": report.reportTypeGuid
            }
            if (self.reportTypes.length > 0)
                var existReportType = self.reportTypes.filter(function (item, i) {
                    return item.reportTypeGuid == report.reportTypeGuid
                })[0];

            if (!existReportType) {
                self.reportTypes.push(reportTypeObj);
            }
        })
        if (self.reportTypes.length == 1) {
            self.selectedReportType = self.reportTypes[0];
            /*self.signatureHeaders = reportTypesArray[0].columns.filter(function(item,i){
                return item.type.toLowerCase=="signature"
            });*/
        }
    }

    self.setReportType = function () {
        //console.log(self.selectedReportType);
        if (self.selectedReportType) {
            fillReportDetails();
        }
    }

    function fillReportDetails() {
        if (self.selectedReportType.reportTypeGuid) {
            var reportTypeData = self.reportSignoffData.filter(function (reportItem, i) {
                return reportItem.reportTypeGuid == self.selectedReportType.reportTypeGuid;
            });
            self.portfolioSignatureDetails = angular.copy(reportTypeData);
            //Adding UserName
            angular.forEach(self.portfolioSignatureDetails, function (reportSignoff, index) {
                angular.forEach(reportSignoff.signatures, function (sign, signIndex) {
                    if (sign.signOffUser.userGUID && sign.signOffUser.userGUID == self.currentUserGUID)
                        sign.isChecked = true;
                    else
                        sign.isChecked = false;
                })
            })
            if (self.portfolioSignatureDetails.length > 0) {
                self.portfolioSignatureDetailsCopy = angular.copy(self.portfolioSignatureDetails);
                self.isSubmitSignoff = true;
            }
        } else
            self.isSubmitSignoff = false;
    }

    self.getCurrentCertificate = function (cert) {
        
        return cert.signatureType.toLowerCase()=="certification" && (cert.signOffUser.userGUID == self.currentUserGUID || !cert.signatureGuid)
       /* var currentSignature = reportSignatures.filter(function (item, i) {
            return (item.signatureType.toLowerCase() == "certification" && (item.signOffUser.userGUID == self.currentUserGUID || !item.signatureGuid))
        }) //|| !item.signOffUser.userGUID
        return currentSignature;*/
    }

    self.updateSignedCertificate = function (event, signOffUser) {
        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;        
        if (elem.checked) {
            signOffUser.userName = "LoggedIn User";
            signOffUser.title = "Manager";
            signOffUser.userGUID = self.currentUserGUID;
            //get filtered signatures by type = "certification"
            //var signedUserExistIndex = signatures.map(function(x) {return x.signOffUser.userGUID; }).indexOf(self.currentUserGUID);
        } else {
            signOffUser.userName = "";
            signOffUser.title = "";
            signOffUser.userGUID = "";
        }
    }

    self.updateSignedSignature = function (event, signOffUser) {

        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;
        //var signOffIndex = signatures.indexOf(sign);
        if (elem.checked) {
            signOffUser.userName = "LoggedIn User";
            signOffUser.title = "Manager";
            signOffUser.userGUID = self.currentUserGUID;
        } else {
            signOffUser.userName = "";
            signOffUser.title = "";
            signOffUser.userGUID = "";
        }
    }

    self.copyToAllSignatures = function (parentIndex, signIndex, currentSign) {
        angular.forEach(self.portfolioSignatureDetails, function (reportData, i) {
            if (!reportData.final) {
                var signOffIndex = reportData.signatures.map(function (x) {
                    return x.signOffType;
                }).indexOf(currentSign.signOffType);
                if (signOffIndex != undefined && signOffIndex >= 0) {
                    reportData.signatures[signOffIndex].signOffUser.userName = currentSign.signOffUser.userName;
                    reportData.signatures[signOffIndex].signOffUser.title = currentSign.signOffUser.title;
                    reportData.signatures[signOffIndex].signOffUser.userGUID = currentSign.signOffUser.userGUID;
                    reportData.signatures[signOffIndex].isChecked = currentSign.isChecked;
                }
            }
        })
    }

    self.copyToAllCertificates = function (parentIndex, currentCert) {
        if (currentCert) {
            angular.forEach(self.portfolioSignatureDetails, function (reportData, i) {
                /*var signOffIndex = reportData.signatures.findIndex(function (item) {
                        return (item.signatureType.toLowerCase() == currentCert.signatureType.toLowerCase() && (item.signOffUser.userGUID == self.currentUserGUID || (!item.signatureGuid && !item.signOffUser.userGUID)))
                    })*/
                
                var certifications = reportData.signatures.filter(function(certs){
                    return certs.signatureType == currentCert.signatureType &&(certs.signOffUser.userGUID == self.currentUserGUID || (!certs.signatureGuid && !certs.signOffUser.userGUID))
                })
                for(var j=0; j<certifications.length; j++){
                    var index = reportData.signatures.indexOf(certifications[j]);
                    if(index!=undefined && index>-1){
                        reportData.signatures[index].signOffUser.userName = currentCert.signOffUser.userName;
                        reportData.signatures[index].signOffUser.title = currentCert.signOffUser.title;
                        reportData.signatures[index].signOffUser.userGUID = currentCert.signOffUser.userGUID;
                        reportData.signatures[index].isChecked = currentCert.isChecked;
                    }
                }                                    
            })
        }
    }

    function compareKeys(objA, objB) {
        var aKeys = Object.keys(objA).sort();
        var bKeys = Object.keys(objB).sort();
        return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    }

    this.dismissAlert = function () {
        this.showAlert = false;
        this.serviceMessage = "";
    }

    function addClassToReportsAlerts(status, message) {
        self.showAlert = true;
        self.serviceMessage = message;
        if (status === "success") {
            angular.element('#alertMessageDiv').addClass('alert-success');
            angular.element('#alertMessageDiv').removeClass('alert-danger');
        } else {
            angular.element('#alertMessageDiv').removeClass('alert-success');
            angular.element('#alertMessageDiv').addClass('alert-danger');
        }
    }

    self.submitSignatures = function () {
        var arrPostSignOff = [];
        var arrPutSignOff = [];
        var arrDeleteSignOff = [];
        angular.forEach(self.portfolioSignatureDetails, function (report, index) {
                angular.forEach(report.signatures, function (sign, signIndex) {
                                            
                        //check if equal or not
                        var isEqual =  compareObjs(sign.signOffUser,self.portfolioSignatureDetailsCopy[index].signatures[signIndex].signOffUser);
                    
                    //Priviously Added SignOff(case of update)
                        if (self.portfolioSignatureDetailsCopy[index].signatures[signIndex] && self.portfolioSignatureDetailsCopy[index].signatures[signIndex].signatureGuid) {
                            //if previously exist update/delete Obj:
                            var delSignOff = {
                                "reportGUID": report.reportGuid,
                                "reportSignoffGUID": sign.reportSignoffGuid,
                            }                             

                            if (sign.signOffUser.userGUID) {
                                if(!isEqual){
                                    arrPutSignOff.push(getRequestObj(sign,'PUT'));
                                }
                                   
                                /*if (!angular.equals(sign.signOffUser, self.portfolioSignatureDetailsCopy[index].signatures[signIndex].signOffUser))
                                    arrPutSignOff.push(updateObj)*/
                                
                            } else {
                                if (self.currentUserGUID == self.portfolioSignatureDetailsCopy[index].signatures[signIndex].signOffUser.userGUID)
                                    arrDeleteSignOff.push(delSignOff);
                                else
                                if (!isEqual)
                                    arrPutSignOff.push(getRequestObj(sign,'PUT'));
                            }

                        } else {
                            //POST
                            if (sign.signOffUser.userGUID) {
                                if (sign.isChecked) {
                                    arrPostSignOff.push(getRequestObj(sign,'POST'));
                                }
                            }
                            //Else of above case applies when userGUID for a signoff comes empty that should not happen
                            else {
                                if (!isEqual)
                                    arrPutSignOff.push(getRequestObj(sign,'PUT'))
                            }

                        }
                    }) // end of foreach
            }) // end of foreach
        

        var requestDeleteObj = {
            "reportsignoffs": arrDeleteSignOff
        }
        var requestPostObj = {
            "signatures": arrPostSignOff
        }
        var requestPutObj = {
            "signatures": arrPutSignOff
        }

        var promises = [];
        if (arrDeleteSignOff.length > 0)
            promises.push(projectDashboardOperations.deleteProjectSignoffs(requestDeleteObj));

        if (arrPutSignOff.length > 0)
            promises.push(projectDashboardOperations.updateProjectSignoffs(requestPutObj));

        if (arrPostSignOff.length > 0)
            promises.push(projectDashboardOperations.createProjectSignoffs(requestPostObj));

        $q.all(promises).then(function (responses) {
            //case delete
            if (arrDeleteSignOff.length) {
                if (responses[0].status != undefined && checkStatus.checkCodeInStatusArray(responses[0].status, 'DELETE')) {
                    var erroMsg = responses[0].data.message ? responses[0].data.message.userMessage : "Sorry. We encountered a problem while processing your request."
                    addClassToReportsAlerts("error", erroMsg);
                } else
                    self.showAlert = false;

            }
            //case update
            if (arrPutSignOff.length) {
                var resp = responses[1] ? responses[1] : responses[0]
                if (resp.status != undefined && checkStatus.checkCodeInStatusArray(resp.status, 'PUT')) {
                    var erroMsg = resp.data.message ? resp.data.message.userMessage : "Sorry. We encountered a problem while processing your request."
                    addClassToReportsAlerts("error", erroMsg);
                } else {
                    self.showAlert = false;
                    //$state.reload();
                }
            }
            //case add
            if (arrPostSignOff.length) {
                var resp = responses[2] ? responses[2] : responses[1] ? responses[1] : responses[0];
                if (resp.status != undefined && checkStatus.checkCodeInStatusArray(resp.status, 'POST')) {
                    var erroMsg = resp.data.message ? resp.data.message.userMessage : "Sorry. We encountered a problem while processing your request."
                    addClassToReportsAlerts("error", erroMsg);
                } else {
                    self.showAlert = false;
                    //$state.reload();
                }
            }
            if (!self.showAlert) {
                getProjectSignOffData();
            }
        })

    }
    
    function getRequestObj(signOffObject, operation){
        var signObject = {};
        if (operation == 'POST') {
            signObject.templateSignatureGuid = signOffObject.templateSignatureGuid;
            signObject.reportGuid = signOffObject.reportGuid;
        } else if (operation == 'PUT')
            signObject.signatureGuid = signOffObject.signatureGuid;
        
        signObject.certificationText = signOffObject.certificationText;
        signObject.digitalSignatureInPrintedReport = signOffObject.digitalSignatureInPrintedReport;
        signObject.showInPrintedReport = signOffObject.showInPrintedReport;
        signObject.signOffUser = {};
        signObject.signedOnBehalfOfUser = {};
        signObject.signedForUser = {};
        //signObject.signOffUser.userID = "";
        signObject.signOffUser.userGUID = signOffObject.signOffUser.userGUID;
        signObject.signOffUser.userName = signOffObject.signOffUser.userName;
        signObject.signOffUser.title = signOffObject.signOffUser.title;
        signObject.signOffUser.email = signOffObject.signOffUser.email;
        signObject.signOffUser.cellPhone = signOffObject.signOffUser.cellPhone;

        signObject.signedOnBehalfOfUser.userGUID = signOffObject.signedOnBehalfOfUser.userGUID;
        signObject.signedOnBehalfOfUser.userName = signOffObject.signedOnBehalfOfUser.userName;
        signObject.signedOnBehalfOfUser.title = signOffObject.signedOnBehalfOfUser.title;
        signObject.signedOnBehalfOfUser.email = signOffObject.signedOnBehalfOfUser.email;
        signObject.signedOnBehalfOfUser.cellPhone = signOffObject.signedOnBehalfOfUser.cellPhone;

        signObject.signedForUser.userGUID = signOffObject.signedForUser.userGUID;
        signObject.signedForUser.userName = signOffObject.signedForUser.userName;
        signObject.signedForUser.title = signOffObject.signedForUser.title;
        signObject.signedForUser.email = signOffObject.signedForUser.email;
        signObject.signedForUser.cellPhone = signOffObject.signedForUser.cellPhone;

        return signObject;
    }
    
    function compareObjs(objA, objB){
        return angular.equals(objA,objB);
    }

    self.gotoProject = function () {
        $state.go('projectDashboard', {
            projectGuid: $stateParams.projectGuid,
            accountGuid: $stateParams.accountGuid,
            companyGuid: $stateParams.companyGuid
        })
        //$window.open("index.html#/selectProject", "_self", "width=800, height=1200,left=550");
    }
    
}]);