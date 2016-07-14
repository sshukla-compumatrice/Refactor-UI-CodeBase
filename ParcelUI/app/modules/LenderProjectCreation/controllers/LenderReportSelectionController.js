angular.module('LenderProjectCreation').controller('LenderReportSelectionCtrl', ['$scope', '$log', '$modal', function ($scope, $log, $modal) {

    //var reportSelectionControllerLogger = $log.getInstance('reportSelectionController');

    //reportSelectionControllerLogger.info("reportSelection controller reached");

    //var templateReportTypes = [];
    //var outputArrayForReportTpes = [];
    //var x = {};
    //this.obj = {};
    //this.template = {};
    //$scope.object = {};
    ////this.templates = [];

    //this.langLibrary = $scope.main.obj[0].libraries;
    //$scope.templates = $scope.main.obj[5].templates;



    //$scope.dynamicarrObj = {};
    //$scope.globalarr = [];

    //$scope.globallangobj = {};


    //init();

    //function init() {

    //    getTemplates($scope.main.obj[5].templates, getUniqueReportTypes);

    //}

    //function getLangLib() {
    //    try {
    //        for (var i = 0; i < $scope.reportTypes.length; i++) {

    //            $scope.globallangobj[i] = [];
    //            for (var j = 0; j < $scope.main.obj[0].libraries.length; j++) {
    //                if ($scope.main.obj[0].libraries[j].reportType == $scope.reportTypes[i]) {
    //                    $scope.globallangobj[i].push($scope.main.obj[0].libraries[j]);
    //                }
    //            }
    //        }
    //    } catch (e) {
    //        reportSelectionoControllerLogger.error(e);
    //    }

    //}

    //function getUniqueReportTypes(inputArray) {
    //    try {
    //        for (var i = 0; i < inputArray.length; i++) {
    //            if ((jQuery.inArray(inputArray[i], outputArrayForReportTpes)) == -1) {
    //                outputArrayForReportTpes.push(inputArray[i]);
    //            }
    //        }
    //        return outputArrayForReportTpes;
    //    } catch (e) {
    //        reportSelectionoControllerLogger.error(e);
    //    }
    //}


    //function getTemplates() {
    //    try {

    //        for (var i = 0; i < $scope.main.obj[5].templates.length; i++) {
    //            templateReportTypes.push($scope.main.obj[5].templates[i].reportType);
    //        }
    //        $scope.reportTypes = getUniqueReportTypes(templateReportTypes);
    //        getLangLib();


    //        for (var i = 0; i < $scope.reportTypes.length; i++) {
    //            $scope.dynamicarrObj[i] = [];
    //            for (var j = 0; j < $scope.main.obj[5].templates.length; j++) {

    //                if ($scope.main.obj[5].templates[j].reportType == $scope.reportTypes[i]) {


    //                    $scope.dynamicarrObj[i].push($scope.main.obj[5].templates[j]);



    //                }


    //            }
    //            $scope.globalarr.push($scope.dynamicarrObj[i]);

    //        }

    //        addLangToTemplates();
    //    } catch (e) {
    //        reportSelectionoControllerLogger.error(e);
    //    }


    //}

    //function addLangToTemplates() {
    //    try {
    //        for (var i = 0; i < $scope.reportTypes.length; i++) {
    //            for (var j = 0; j < $scope.globalarr[i].length; j++) {
    //                $scope.globalarr[i][j].langarr = $scope.globallangobj[i];
    //            }
    //        }
    //    } catch (e) {
    //        reportSelectionoControllerLogger.error(e);
    //    }



    //}

    //this.chkboxName = [];

    //this.chkboxChecked = function (template, index) {
    //    try {
    //        if ($scope.main.parentReportSelection.template[template.templateID])
    //            $scope.main.parentReportSelection.indexArr.push(template.templateID);
    //        else {

    //            for (var i = 0; i < $scope.main.parentReportSelection.indexArr.length; i++) {

    //                if ($scope.main.parentReportSelection.indexArr[i] == template.templateID) {

    //                    $scope.main.parentReportSelection.indexArr.splice(i, 1);
    //                }
    //            }


    //        }
    //    } catch (e) {
    //        reportSelectionoControllerLogger.error(e);
    //    }



    //}

    //this.langChanged = function (value) {


    //}


    this.ShowFeeHelp = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/LenderProjectCreation/views/lender_helpFee.html',
            scope: $scope,
            controller: FeeHelpController,
            size: size

        })
    }

    var FeeHelpController = function ($scope, $modalInstance) {
        $scope.CancelDelete = function () {
            $modalInstance.close()
        }
    }


    /*date config*/
    $scope.dates = {
        today: new Date()
    };

    $scope.open = {
        date1: false
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (new Date().toDateString() == date.toDateString()));
    };

    $scope.dateOptions = {
        showWeeks: false,
        startingDay: 1
    };

    $scope.timeOptions = {
        readonlyInput: true,
        showMeridian: false
    };

    $scope.openCalendar = function (e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
    };

    // watch date4 and date5 to calculate difference
    $scope.$watch(function () {
        return $scope.dates;
    }, function () {

    }, true);

    /*ends here*/
}]);