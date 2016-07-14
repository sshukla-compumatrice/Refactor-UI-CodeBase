angular.module('ReportAuthoring').controller('ReportOutputPDFConvertController', ['AppendixAPI', 'FileUploader', '$modal', '$timeout', '$scope', 'ReportAuthoringAPI', 'AppendixTools', '$state', 'ReportOutputService', '$stateParams','$window', 'ParcelUI.Resources', 'HelperService', function (AppendixAPI, FileUploader, $modal, $timeout, $scope, ReportAuthoringAPI, AppendixTools, $state, ReportOutputService, $stateParams,$window, ParcelUI_Resources, HelperService) {
    var self = this;

    self.reportGuid = $stateParams.reportGuid;
    self.sectionid = 123;
    self.stack_bottomright = $scope.stack_bottomright;
    self.quickViewArr = [];
    self.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
    self.waitingProcessResources.message = "Please Wait...";
    
    self.GeneratePDF = function (type) {        
        createReportGenerationRequest(type);                
    }
    
      ReportAuthoringAPI.getAssembleSections($stateParams.reportGuid).then(function (sections) {
         
            for (var i = 0; i < sections.length; i++) {
                if(sections[i].showInQuickView)
                {
                    console.log("called");
                    self.quickViewArr.push(sections[i]);
                }
                
            }

        }, function (error) {

        });
    
    function createReportGenerationRequest(type){
        var reqObj = getCreateReportGenerationRequestObj(type);
        var promise = ReportOutputService.createReportGenerationRequest(self.reportGuid, reqObj);
        //$scope.ck.waitingProcessResources.pdfLoader.promise = null;
        //$scope.ck.waitingProcessResources.pdfLoader.promise = promise;
        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = promise;
        promise.then(function(result) {
            msg = 'Failed to create request for report generation.';
            if(result.reportGeneration && result.reportGeneration.constructedDocumentGUID){
                console.log('ReportGenerationRequest created...!');
                getConstructedDocument(result.reportGeneration.constructedDocumentGUID);
            }
            else{                
                if(result.message)
                    msg = result.message.userMessage;
                HelperService.showPNotifyMessage('Error', msg, 'error');                
            }
        }, function (error) {
            msg = 'Failed to create request for report generation.';
            HelperService.showPNotifyMessage('Error', msg, 'error');
        })
    }

    function getCreateReportGenerationRequestObj(type, sectionGuid) {
        var generationType = [];
        generationType.push(type);
        //type = "FullPDF",
        //includedSections not yet implemented both server side and UI side(Harcoded but not in use.)
        return obj = {
            "reportGeneration": {
                "generationType": generationType,
                "includedSections": [],
                "reorderLetteringOfAppendices": true,
                "deliveryOption": "DOWNLOAD"
            }
        }
    }
    
    function getConstructedDocument(docGuid){
        
        var promise = ReportOutputService.getConstructedDocument(docGuid);        
        promise.then(function(response){
            if(response.constructedDocument){
                    if(response.constructedDocument.status && response.constructedDocument.status.toLowerCase() =='processing'){
                        $timeout(function(){
                            getConstructedDocument(docGuid);
                        },5000)
                    }
                    else{
                        console.log('document constructed...!');
                        if(response.constructedDocument.documentURL)
                            //$window.open(response.constructedDocument.documentURL,'_blank')
                            getGeneratedPDF(response.constructedDocument.constructedDocumentGUID);
                    }
            }
            else{
                msg = 'Request failed to get document.';                    
                if(response.message)
                    msg = result.message.userMessage;                    
                HelperService.showPNotifyMessage('Error', msg, 'error');
            }
            //handle error here
        }, function(error){
            msg = 'Request failed to get document.';            
            if(response.message)
                msg = result.message.userMessage;            
            HelperService.showPNotifyMessage('Error', msg, 'error');
        })
        
    }
    
    
    
    function getGeneratedPDF(coreFileGuid){
        var generatedUrl = ReportOutputService.buidGeneratedDocUrl(coreFileGuid);
        generatedUrl = generatedUrl
        var win = window.open(generatedUrl,'_blank');
        //win.focus();
    };

}]);