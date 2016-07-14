angular.module('ReportAuthoring').controller('uploadSpreadsheetDataController', ['$scope', 'ReportAuthoringAPI', '$modal','tablesCommonFunctionsService','uploadSpreadsheetData','$modalInstance',  'PerformedOperation', '$window', 'HelperService', function ($scope, ReportAuthoringAPI, $modal, tablesCommonFunctionsService, uploadSpreadsheetData, $modalInstance, PerformedOperation, $window, HelperService) {
   
	$scope.$parent.contentValues = uploadSpreadsheetData.contentValues;
	$scope.$parent.sectionGUID = uploadSpreadsheetData.sectionGUID;
	$scope.tableName = uploadSpreadsheetData.tableName;	
	$scope.errormsg = '';
	var pNotifyErrorTitle = '';
	var pNotifyErrorMsg = '';
    var self = this;
    	self.waitingProcessResources = uploadSpreadsheetData.waitingProcessResources;

//	self.waitingProcessResources = $scope.waitingProcessResources;
	 function init() {
        self.isUpload = true;
        self.tableOperation = 1;
       self.fullSectionName = uploadSpreadsheetData.sectionNumber + ' '+ uploadSpreadsheetData.sectionName;            
    };
	
    init();
    
    self.dowloadExcelFile = function(){
        var promise  = ReportAuthoringAPI.getTableExcelFile(uploadSpreadsheetData.reportGuid, uploadSpreadsheetData.sectionGUID, uploadSpreadsheetData.tableName);
        promise.then(function(resp){
            if(resp){
                if(resp.excelFileGuid){
                    self.isDownloadErrorMsg = false;
                    var generatedUrl = ReportAuthoringAPI.buildSpreadsheetDownloadFileUrl(resp.excelFileGuid);
                    var win = window.open(generatedUrl,'_blank');
                }
                else{
                    var msg = 'Failed to download excel template.';
                    self.isDownloadErrorMsg = true;                    
                    if(resp.message)
                        msg = resp.message.userMessage;           
                    self.DownloadErrorMsg = msg;
                }
            }
        }, function(error){
            var msg = 'Error occured while downloading excel template. Please try again.';
            self.isDownloadErrorMsg = true;            
            if(error)
                msg = error;           
            self.DownloadErrorMsg = msg;
        });
    }
    
    self.checkFile = function(files,invalidFiles){
        self.showUserTbl = false;
        self.isUploadErrorMsg = false;
        if (invalidFiles && invalidFiles.length > 0) {
            self.isUploadErrorMsg = true; 
            self.UploadErrorMsg = 'File format is incorrect.';
            self.isUpload = true;
        }
        else if(!files)
            self.isUpload = true;
        else{
            self.isUpload = false;            
        }
    }
    
    self.uploadSpreadsheetFile =function(){
        self.isUpload = true;
        var file = self.files;
        var promise = ReportAuthoringAPI.uploadSpreadsheetFile(uploadSpreadsheetData.reportGuid, file, uploadSpreadsheetData.sectionGUID, uploadSpreadsheetData.tableName);
        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = promise;
        promise.then(function(response){
            if(response && response.data){
                appendOrOverwriteData(response.data)
            }
            else{
                var msg = 'Failed to upload file.';
                self.isUploadErrorMsg = true;
                self.isUpload = true;
                if(response.message)
                    msg = response.message.userMessage;           
                self.UploadErrorMsg = msg;
            }
        },function (error) {
            self.isUploadErrorMsg = true;
            self.isUpload = true;
            var msg =  'Something went wrong while uploading spreadsheet. Please try again.';
            if(error.data.message)
                msg = error.data.message.userMessage;
            self.UploadErrorMsg = msg;
        });
    }
    
    function showPnotifyMessage(obj){
        HelperService.showPNotifyMessage(obj.title, obj.alertMessage, obj.type);
    };
    
    function appendOrOverwriteData(data){
        self.operation = '';
        if(self.tableOperation == 1){
            for(var i=0; i< data.data.length; i++){
                uploadSpreadsheetData.table.data.push(data.data[i]);
                self.operation = PerformedOperation.APPENDTABLE;
                //$scope.$parent.table.data.push(data[i]);
            }           
        }else{
            self.operation = PerformedOperation.OVERWRITETABLE;
            uploadSpreadsheetData.table.data = data.data;
        }
        var resultObj ={
            'operation': self.operation,
            'type' : '',
            'alertMessage': '' 
        };
        var promise = updateTable();
        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = promise;
        promise.then(function(resp){
            if(resp){
                    if(resp.report.reportData && resp.report.reportData.formSectionData && resp.report.reportData.formSectionData.length){                        
                        resultObj.type = 'success';
                        resultObj.title = '';
                        resultObj.alertMessage = 'Table in section <strong>' + uploadSpreadsheetData.sectionNumber + ' ' + uploadSpreadsheetData.sectionName + '</strong> have been saved.';
                    }
                    else{
                        resultObj.type = 'error';
                        resultObj.title = 'Problem saving table';
                        resultObj.alertMessage = 'There was a problem saving the table. Please try again.';
                    }
                showPnotifyMessage(resultObj);
                $modalInstance.close(resultObj);                
            }
        }, function (error) {
                resultObj.type = 'error';
                resultObj.title = 'Problem saving table';
                resultObj.alertMessage = 'There was a problem saving the table. Please try again.';
                showPnotifyMessage(resultObj);
                $modalInstance.close(resultObj);
        });
        
    };
    
    self.closeUploadSpreadheetData = function(){
        $modalInstance.close();
    };
    
    function updateTable(){
        
        $scope.$parent.contentValues[uploadSpreadsheetData.tableName].data = uploadSpreadsheetData.table.data;

        var data = {
            "formSectionData": [
                {
                    "sectionGUID": uploadSpreadsheetData.sectionGUID,
                    "sectionData": {
                        "operationCode": self.operation,
                        "contentValues": $scope.$parent.contentValues

                    }
               }]
        };
        return ReportAuthoringAPI.updateSection(uploadSpreadsheetData.reportGuid, uploadSpreadsheetData.sectionGUID, data)
    };
    
    
	
	
}]);