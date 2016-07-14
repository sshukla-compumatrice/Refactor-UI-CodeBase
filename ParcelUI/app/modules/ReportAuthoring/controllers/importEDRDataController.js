angular.module('ReportAuthoring').controller('ImportEDRDataController', ['$scope', 'ReportAuthoringAPI', '$modal','BASEURL','tablesCommonFunctionsService','$rootScope','importEDRData','$modalInstance','ParcelUI.Resources', function ($scope, ReportAuthoringAPI, $modal, BASEURL, tablesCommonFunctionsService, $rootScope, importEDRData, $modalInstance,ParcelUI_Resources) {
   
	$scope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
	$scope.$parent.contentValues = importEDRData.contentValues;
	$scope.$parent.sectionGUID = importEDRData.sectionGUID;
	$scope.tableName = importEDRData.tableName;	
	$scope.importAction = importEDRData.importAction;
	$scope.errormsg = '';
	var pNotifyErrorTitle = '';
	var pNotifyErrorMsg = '';
	
	
	 function init() {

		 var promise = ReportAuthoringAPI.getEDRImportData(importEDRData.reportID, importEDRData.importAction);
		 promise.then(function (importData) {			 
			 $scope.importData = importData;			 
		 }).catch(function (error) {
						
            $scope.errormessage = error;            
               
         });
            
    }
	
    init();
	
	$scope.importSelectedEDRData = function(){
		
		var sectionData = $scope.$parent.contentValues;
        var copySectionData = angular.copy(sectionData);
		var isImportData = false;
		$scope.currentTableDatalength = copySectionData[$scope.tableName].data != undefined ? copySectionData[$scope.tableName].data.length : 0;
		angular.forEach($scope.importData.data, function (importItem) {
			
             if(importItem.importItemSelected != undefined && importItem.importItemSelected=='true'){
           		
				copySectionData[$scope.tableName].data.push(importItem);
				isImportData = true;
       		}	
        

        });
	  $scope.copyTable = {
		  data:{}
	  };
		
	 $scope.table = {
		  data:{}
	  };
		if(isImportData){
			
			$scope.copyTable.data = createTableMappingFieldObject(copySectionData[$scope.tableName].data);
			
				if($scope.copyTable.data.length > 0){			
					tablesCommonFunctionsService.importData($scope, importEDRData.sectionNumber, $modalInstance);
				}else{			
					 pNotifyErrorTitle = 'Data not match';
					 pNotifyErrorMsg = 'Import data not match with table.';
					tablesCommonFunctionsService.showPNotifyMessage(pNotifyErrorTitle, pNotifyErrorMsg, 'error');
				}
			
		}else{
			
			 pNotifyErrorTitle = 'Data not found';
             pNotifyErrorMsg = 'You must select at least one site to import to the data table or click "Cancel"';
            tablesCommonFunctionsService.showPNotifyMessage(pNotifyErrorTitle, pNotifyErrorMsg, 'error');
			
		}
	  
		
	}
	
	$scope.checkUncheckAll = function (action) {
       
        angular.forEach($scope.importData.data, function (item) {
            item.importItemSelected = action;
        });

    };
	
	$scope.closeImportEDRData = function(){
		
		$modalInstance.close();
	}
	
	function createTableMappingFieldObject(selectedItemToImport){
				
		
		var importDataObj = [];
						angular.forEach(selectedItemToImport, function(filterObj , filterIndex) {
							var importDataRowObj = {};
							angular.forEach(filterObj, function(value , key) {
								angular.forEach($scope.$parent.contentValues[$scope.tableName].structure, function(dataField , index) {
																	
									if(key.toLowerCase() == dataField.label.toLowerCase()){										
										importDataRowObj[dataField.label] = value;
									}
								})								
							})
							
							if(Object.keys(importDataRowObj).length){
								importDataObj.push(importDataRowObj);								
							}
						});
			
			if( importDataObj.length > $scope.currentTableDatalength){
				return importDataObj;
			}else{
				return importDataObj = [];
			}
			
			
	}

	$scope.selectSourceItem = function(sourceType){
		
		 angular.forEach($scope.importData.data, function (item) {
            
			 if(item.Source == sourceType){
				item.importItemSelected = 'true';	 
			 }
			 
        });
		
	}
	
	$(document).ready(function () {
            var table = $('#example').DataTable({
                "scrollY": 150,
                "scrollX": true,
                "filter": false,
                "bLengthChange": false,
                "info": false,
                "paging": false,
                "searching": false,
                "bSort": false
            });
        });
	
}]);