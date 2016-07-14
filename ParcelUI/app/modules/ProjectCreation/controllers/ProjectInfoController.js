angular.module('ProjectCreation').controller('ProjectInfoCtrl', ['$scope', '$log', '$modal', function ($scope, $log, $modal) {

    var self = this;
    //self.isDraftDateOpen = false;
    //self.isFinalDateOpen = false;

    //self.DraftDatePickerFocus = function(){
    //    self.isDraftDateOpen = true;
    //}

    //self.FinalDatePickerFocus = function(){
    //    self.isFinalDateOpen = true;
    //}

    var projectinfoControllerLogger = $log.getInstance('projectinfoController');

    projectinfoControllerLogger.info("projectinfo controller reached");


    //this.draftDue = function() {
    //    //console.log("scope draft date ");
    //}

    //this.finalDue = function() {
    //    //console.log("scope final date ");
    //}

    $scope.ShowProjectTips = function (size) {


        var modalInstance = $modal.open({
            templateUrl: 'ProjectTips.html',
            scope: $scope,
            controller: ProjectTipsController,
            size: size

        })

    }


    var ProjectTipsController = function ($scope, $modalInstance) {

        $scope.CancelDelete = function () {

            $modalInstance.close()
        }

    }

    //$scope.dates = {
    //    date1: new Date(),
    //    date2: new Date()
    //};

    $scope.open = {
        date1: false,
        date2: false,
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

    $scope.closeCalendar = function (e, date) {
        //e.preventDefault();
        //e.stopPropagation();

        $scope.open[date] = false;
    };



    $scope.displayAsPerCompany = function (main) {
        var returnValue = false;
        if (main.companyName) {
            returnValue = main.companyName == 'Enercon' ? true : false;
        }
        return returnValue;
    }

    $scope.displayAsPerOtherCompany = function (main) {

        var returnValue = true;
        if (main.companyName) {
            returnValue = main.companyName != 'Enercon' ? true : false;
        }
        return returnValue;
    }

    // watch date4 and date5 to calculate difference
    $scope.$watch(function () {
        return $scope.dates;
    }, function () {

    }, true);


}]);


/*$('body').keydown(function (event) {

    if (event.keyCode == 9) {
        $('#draftDueDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').hide();
        $('#dateFinalDue').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').hide();
    }
});

$('body').mouseup(function (event) {
    var target = event.toElement || event.relatedTarget || event.originalEvent.target;
    switch (target.attributes.id.value) {
        case 'draftDueDate':
            $('#draftDueDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').show();
            if (event.keyCode == 46 || event.keyCode == 9 || event.keyCode == 8) {
                $('#draftDueDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').hide();
            }
            break;
        case 'dateFinalDue':
            $('#dateFinalDue').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').show();
            break;

        default:
    }
});*/
