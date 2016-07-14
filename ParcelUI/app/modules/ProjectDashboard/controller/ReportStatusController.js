angular.module('ProjectDashboard').controller('ReportStatusController', ['$scope', '$modalInstance', 'reportStatusObj', '$filter', 'reportGridDataOperations', function ($scope, $modalInstance, reportStatusObj, $filter, reportGridDataOperations) {

    var self = this;
    this.exception = false;
    init();
    function init(){
        self.reportStatusArray = reportStatusObj.reportStatusList;
        self.statusGUID = reportStatusObj.reportStatusGuid;
        changeStatusName();
        self.singleStatusObj = $filter('filter')(reportStatusObj.reportStatusList, {
            reportStatusShort: reportStatusObj.reportStatus
        });
        self.statusInLongForm = self.singleStatusObj[0].reportStatusLabel;
        buttonsShowHide();
    }

    function changeStatusName (){
        angular.forEach(self.reportStatusArray,function(status){
            if(status.reportStatusShort === "WO"){
                status.reportStatusLabel = "The work order has been created";
            }
            else if(status.reportStatusShort === "DE"){
                status.reportStatusLabel = "The report is currently undergoing data entry";
            }
            else if(status.reportStatusShort === "SR"){
                status.reportStatusLabel = "The report is currently in senior review";
            }
            else if(status.reportStatusShort === "DR"){
                status.reportStatusLabel = "The report is draft";
            }
            else if(status.reportStatusShort === "EAI"){
                status.reportStatusLabel = "The environmental analysis is incomplete";
            }
            else if(status.reportStatusShort === "FIN"){
                status.reportStatusLabel = "This report is final";
            }
        })
    }

    this.previousStep = function () {
        var currentStepIndex = self.singleStatusObj[0].reportStatusRank;
        self.singleStatusObj = $filter('filter')(reportStatusObj.reportStatusList, {
            reportStatusRank: Number(currentStepIndex) - 1
        });
        self.statusInLongForm = self.singleStatusObj[0].reportStatusLabel;
        self.statusGUID = self.singleStatusObj[0].reportStatusGuid;
        buttonsShowHide();

    }

    this.nextStep = function () {
        var currentStepIndex = self.singleStatusObj[0].reportStatusRank;
        self.singleStatusObj = $filter('filter')(reportStatusObj.reportStatusList, {
            reportStatusRank: Number(currentStepIndex) + 1
        });
        self.statusInLongForm = self.singleStatusObj[0].reportStatusLabel;
        self.statusGUID = self.singleStatusObj[0].reportStatusGuid;
        buttonsShowHide();

    }

    this.finalizeUnfinalizeStatus = function () {
        if (self.finalizeOrUnfinalize === "FINALIZE") {
            self.singleStatusObj = $filter('filter')(reportStatusObj.reportStatusList, {
                reportStatusShort: "FIN"

            })
            self.finalizeOrUnfinalize = "UNFINALIZE"
        } else if (self.finalizeOrUnfinalize === "UNFINALIZE") {
            self.singleStatusObj = $filter('filter')(reportStatusObj.reportStatusList, {
                reportStatusShort: "DR"
            })
            self.finalizeOrUnfinalize = "FINALIZE"

        }


        self.statusInLongForm = self.singleStatusObj[0].reportStatusLabel;
        self.statusGUID = self.singleStatusObj[0].reportStatusGuid;
        buttonsShowHide();

    }

    this.closeAndUpdate = function () {

        projectDashboardOperations.updateReportStatus(self.singleStatusObj, reportStatusObj.reportGuid).then(function (result) {
            $modalInstance.close();

        }, function (error) {



        })

    }

    this.close = function () {
        $modalInstance.close();
    }

    function buttonsShowHide() {

        if (self.singleStatusObj[0].reportStatusRank === "0") {
            self.onFirstStep = true;
            self.finalizeOrUnfinalize = "FINALIZE";
        } else if (self.singleStatusObj[0].reportStatusRank === "5") {
            self.onFirstStep = true;
            self.onLastStep = true;
            self.finalizeOrUnfinalize = "UNFINALIZE";
        } else {
            self.finalizeOrUnfinalize = "FINALIZE";
            self.onFirstStep = false;
            self.onLastStep = false;
        }
    }

    this.closeAndUpdate = function () {

        var obj = {
            status: [{
                reportGuid: reportStatusObj.reportGuid,
                statusGuid: self.statusGUID
            }]
        }
        reportGridDataOperations.updateReportStatus(obj).then(function (result) {

            if (result.status != undefined && result.status != 204 && result.status != 200) {
                self.serviceMessage = result.data.message.userMessage;
                self.exception = true;

            } else {

                self.exception = false;
                $modalInstance.close(true);


            }
        }, function (error) {
            self.serviceMessage = "report status updation failed";
            $modalInstance.close(false);
        })


    }



    this.close = function () {
        $modalInstance.close();
    }

    /*this.closeReportStatus = function () {

        if(self.serviceMessage === "Site Details Updated"){
            $modalInstance.close(true);
        }
        else{
            $modalInstance.close(false);
        }
        
    }*/
}]);