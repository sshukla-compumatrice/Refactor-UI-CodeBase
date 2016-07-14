angular.module('ProjectDashboard').controller('ReportSignOffController', ['$scope', '$modalInstance', 'resolveObj', 'reportGridDataOperations','checkStatus', function ($scope, $modalInstance, resolveObj, reportGridDataOperations, checkStatus) {

    var self = this;
    init();

    function init() {

        self.signOffType = resolveObj.signerType;
        if (resolveObj.signatureObj.signerAccountGuid === null) self.alreadySigned = false;
        else {
            
            self.name =  resolveObj.signatureObj.signOffUser.userName;
            self.title = resolveObj.signatureObj.signOffUser.title;
            self.email = resolveObj.signatureObj.signOffUser.email;
            self.cellPhone = resolveObj.signatureObj.signOffUser.cellPhone;
            self.userGUID = resolveObj.signatureObj.signOffUser.userGUID;
            self.alreadySigned = true;
        }

    }

    this.close = function () {
        
        $modalInstance.close(true);
        
    }
    this.closeAndUpdate = function (form) {
        if (resolveObj.signatureObj.signerAccountGuid === null) createSignatures(form);
        else deleteUpdateSignatures(form);

    }
    
    function deleteUpdateSignatures (form){
        if (form.$invalid) {  
            
            return true;
        } else 
        {
            if(self.updateSignatures == "2"){
                deleteSignature();
            }
            else if(self.updateSignatures == "3"){
                overrideSignature();
            }
            
        }
    }

    function deleteSignature(){
        reportGridDataOperations.deleteSignature(resolveObj.reportGuid,resolveObj.signatureObj.signatureGuid).then(function (result) {
                if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'DELETE')) {
                    self.showAlert = true;
                    self.serviceMessage = result.data.message.userMessage;
                    addClassToAlertHtml("error");
                } else {
                    self.showAlert = false;
                    $modalInstance.close(true);
                }
            }, function (error) {
                self.showAlert = true;
                addClassToAlertHtml("error");
                self.serviceMessage = "Couldnot delete signatures";
            })
    }
    
    function createObjectForService(operation){
        var obj = {};
        obj.signatures = [];
        var signObject = {};
            
           
            signObject.digitalSignatureInPrintedReport = resolveObj.signatureObj.digitalSignatureInPrintedReport,
            signObject.showInPrintedReport = resolveObj.signatureObj.showInPrintedReport,    
            signObject.signOffUser = {};
            signObject.signOffUser.userID = "";
            signObject.signOffUser.userGUID = "06D73813-64D3-49CB-88DB-013E13F96F11";
            signObject.signOffUser.userName = self.name;
            signObject.signOffUser.title = self.title;
            signObject.signOffUser.email = self.email;
            signObject.signOffUser.cellPhone = self.cellPhone;
            signObject.signedOnBehalfOfUser = {};
            signObject.signedForUser = {};
            
        if(operation === "PUT"){
            
            signObject.signatureGuid = resolveObj.signatureObj.signatureGuid;

        }
        else if(operation === "POST"){
            signObject.reportGuid = resolveObj.reportGuid;
            signObject.templateSignatureGuid = resolveObj.signatureObj.templateSignatureGuid;
        }
            
            obj.signatures.push(signObject);
        return obj;
    }
    
    function overrideSignature(){
        
       var obj = createObjectForService("PUT");
        /*var obj = {};
            obj.reportsignoffs = [];
            var signObject = {};
            signObject.reportSignoffGUID = resolveObj.signatureObj.signatureGuid;
            signObject.signOffUser = {};
            signObject.signOffUser.userID = "";
            signObject.signOffUser.userGUID = self.userGUID;//"06D73813-64D3-49CB-88DB-013E13F96F11";
            signObject.signOffUser.userName = self.name;
            signObject.signOffUser.title = self.title;
            signObject.signOffUser.email = self.email;
            signObject.signOffUser.cellPhone = self.cellPhone;
            signObject.signedOnBehalfOfUser = {};
            signObject.signedForUser = {};
            obj.reportsignoffs.push(signObject);*/
           reportGridDataOperations.updateSignature(obj).then(function (result) {
                if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'PUT')) {
                    self.showAlert = true;
                    self.serviceMessage = result.data.message.userMessage;
                    addClassToAlertHtml("error");
                } else {
                    self.showAlert = false;
                    $modalInstance.close(true);
                }
            }, function (error) {
                self.showAlert = true;
                addClassToAlertHtml("error");
                self.serviceMessage = "Couldnot update signatures";
            })
    }


    function createSignatures(form) {
        
        if (form.$invalid) {           
            return true;
        } else {
            var obj = createObjectForService("POST");
            /*var obj = {};
            obj.signatures = [];
            var signObject = {};
            signObject.reportGuid = resolveObj.reportGuid;
            signObject.templateSignatureGuid = resolveObj.signatureObj.templateSignatureGuid,
            signObject.digitalSignatureInPrintedReport = resolveObj.signatureObj.digitalSignatureInPrintedReport,
            signObject.showInPrintedReport = resolveObj.signatureObj.showInPrintedReport,    
            signObject.signOffUser = {};
            signObject.signOffUser.userID = "";
            signObject.signOffUser.userGUID = "06D73813-64D3-49CB-88DB-013E13F96F11";
            signObject.signOffUser.userName = self.name;
            signObject.signOffUser.title = self.title;
            signObject.signOffUser.email = self.email;
            signObject.signOffUser.cellPhone = self.cellPhone;
            signObject.signedOnBehalfOfUser = {};
            signObject.signedForUser = {};
            obj.reportsignoffs.push(signObject);*/

            reportGridDataOperations.createSignature(obj).then(function (result) {
                if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'POST')) {
                    self.showAlert = true;
                    self.serviceMessage = result.data.message.userMessage;
                    addClassToAlertHtml("error");
                } else {
                    self.showAlert = false;
                    $modalInstance.close(true);
                }
            }, function (error) {
                self.showAlert = true;
                addClassToAlertHtml("error");
                self.serviceMessage = "Couldnot update signatures";
            })
        }
    }


}]);