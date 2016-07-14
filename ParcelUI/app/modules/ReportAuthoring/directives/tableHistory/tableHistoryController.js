angular.module('ReportAuthoring').controller('tableHistoryController', ['$scope', '$modalInstance', 'tableHistoryObj', 'ReportAuthoringAPI', '$stateParams', 'ParcelUI.Resources', '$sce', 'PerformedOperation', 'ReportAuthoringAPI', function ($scope, $modalInstance, tableHistoryObj, ReportAuthoringAPI, $stateParams, ParcelUI_Resources, $sce, PerformedOperation, ReportAuthoringAPI) {

    var self = this;
    self.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
    init();
    console.log($stateParams);
    function init() {
        self.historyArr = [];
        self.tableName = tableHistoryObj.tableName;
        self.editMode = tableHistoryObj.editMode;
        self.showMsgTableOperation = false;
        self.msgTableOperation = '';
        self.copyOfTable = angular.copy($scope.table.data);
        //self.filteredHistoryArr = [];
        self.tableHistory = [];
        getTableHistory();
    }
    
    function getTableHistory(){
        
        var promise = ReportAuthoringAPI.getHistory($stateParams.reportGuid, tableHistoryObj.sectionGUID);
        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = promise;
        promise.then(function (resp) {
            self.tableHistory = resp.history;
            self.isTableHistoryLoaded = true;
        },function (error) {
            //return error;
            if(error){
                self.showMsgTableOperation = true;
                self.alertClass = 'alert-danger';
                self.msgTableOperation = error;
            }
        });
    }

    self.trustAsHtml = function (string) {
        if (string) {
            if (typeof string !== 'object') {
                return $sce.trustAsHtml(string.toString());
            } else {
                string.value;
            }
        }
        return string;
    }

    self.convertTime = function (value) {        
        var dateTimeArr = [];
        var time = '';
        dateTimeArr= value.split(' ');
        if(dateTimeArr.length){
            time = dateTimeArr[1]+' '+dateTimeArr[2]+ ' '+dateTimeArr[3];
        }
        return time;            
    }
	
    self.convertDate = function (value){
        //var dateTimeArr = []; 
        var date = '';
        var newvalue = value.replace(/-/g, '/');
        date = moment(newvalue).toDate();
        return date.toDateString();
        //updatedDate ? updatedDate.replace(/-/g, '/') : updatedDate;       
    }
	

    self.closeTableHistory = function () {
       $modalInstance.close();
    };
    
    self.setSelectedTable = function(data){
        self.showMsgTableOperation = false;
        self.selectedTableHist = angular.copy(data.section.sectionData.contentValues[self.tableName].data);
    };
    
    self.overwriteTableHistory = function(){
        if(self.selectedTableHist){
            $scope.table.data = self.selectedTableHist;        
            self.msgTableOperation = 'Table was successfully overwritten with history data.  You can close this window.';
            self.operationCode = PerformedOperation.OVERWRITETABLE;
            
            //$modalInstance.close(result);
            var promise = updateTable(PerformedOperation.OVERWRITETABLE);
            self.waitingProcessResources.promise = null;
            self.waitingProcessResources.promise = promise;
            promise.then(function(response){
                self.showMsgTableOperation = true;
                if(response){
                    if(response.report.reportData && response.report.reportData.formSectionData && response.report.reportData.formSectionData.length){
                        getTableHistory();
                        self.alertClass = 'alert-success'
                    }
                    else{
                        self.alertClass = 'alert-danger';
                        self.msgTableOperation = 'Failed to overwrite table with history data';
                    }
                }
            }, function (error) {
                self.alertClass = 'alert-danger';
                self.msgTableOperation = 'Failed to overwrite table with history data. Please try again.';
            });
        }
        else{
            self.showMsgTableOperation = true;
            self.alertClass = 'alert-danger';
            self.msgTableOperation = 'Please select history data to overwrite.';
        }
        //self.showMsgTableOperation = true;
    };
    
    self.appendTableHistory = function(){
        if(self.selectedTableHist && self.selectedTableHist.length){
            for(var i=0; i< self.selectedTableHist.length; i++){
                var pushObj = self.selectedTableHist[i];
                $scope.table.data.push(pushObj);
            }
            self.msgTableOperation = 'Table history data was successfully appended.  You can close this window.';
            self.operationCode = PerformedOperation.APPENDTABLE;
            
            //$modalInstance.close(result);
            //self.showMsgTableOperation = true;
            var promise = updateTable(PerformedOperation.APPENDTABLE);
            self.waitingProcessResources.promise = null;
            self.waitingProcessResources.promise = promise;
            promise.then(function(response){
                self.showMsgTableOperation = true;
                if(response){
                    if(response.report.reportData && response.report.reportData.formSectionData && response.report.reportData.formSectionData.length){
                        getTableHistory();
                        self.alertClass = 'alert-success'
                    }
                    else{
                        self.alertClass = 'alert-danger';
                        self.msgTableOperation = 'Failed to append history data to table.';
                    }
                }
            }, function (error) {
                self.alertClass = 'alert-danger';
                self.msgTableOperation = 'Failed to append history data to table. Please try again.';
            });
        }else{
            self.showMsgTableOperation = true;
            self.alertClass = 'alert-danger';
            self.msgTableOperation = 'Please select history data to append.';
        }
    };
    
    function updateTable(operation){
        
        $scope.$parent.$parent.contentValues[$scope.tableName].data = $scope.table.data;

        var data = {
            "formSectionData": [
                {
                    "sectionGUID": $scope.sectionGuid,
                    "sectionData": {
                        "operationCode": operation,
                        "contentValues": $scope.$parent.$parent.contentValues

                    }
               }]
        };
        return ReportAuthoringAPI.updateSection($stateParams.reportGuid, $scope.sectionGuid, data)
    }
    
    self.filterbyRowIndex = function (rowIndex) {
        return function (col) {
            return col.rowIndex === rowIndex;
        };
    };

    self.identity = angular.identity;
    //self.rowIndexColl = [];

    self.rowIndexCollection = function (structure) {
        var rowIndexColl = [];
        for (var i = 0; i < structure.length; i++) {
            var local = structure[i];
            var val = local.rowIndex;
            if (rowIndexColl.indexOf(val) < 0) {
                rowIndexColl.push(val);
            }
        }
        return rowIndexColl;
    }
    
}]);
