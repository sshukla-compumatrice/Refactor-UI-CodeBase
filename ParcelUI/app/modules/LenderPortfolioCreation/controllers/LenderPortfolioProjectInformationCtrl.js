angular.module('LenderPortfolioCreation').controller('LenderPortfolioProjectInformationCtrl', ['$scope', '$filter', function($scope, $filter) {
    var self = this;

    var main = $scope.lenderPortfolio;
    self.data = main.project || {
        addSiteMethod: main.addSiteMethodTypes.manual,
        client: {},
        /*draftDueDate: new Date(),
        finalDueDate: new Date(),
        bidDeadline: new Date()*/
    };
    
    main.getSubmitData = function() {
        self.data.draftDueDate = $filter('date')(self.data.draftDueDate, "yyyy-MM-dd hh:mm:ss");
        self.data.finalDueDate = $filter('date')(self.data.finalDueDate, "yyyy-MM-dd hh:mm:ss");
        
        self.data.bidDeadline = $filter('date')(self.data.bidDeadline, "yyyy-MM-dd hh:mm:ss");
        
        // IMP: API does not support property
        // TODO: discuss if required
        delete self.data.outToBid;
        delete self.data.bidDeadline;
        
        return self.data;
    }
    main.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }


    self.open = {
        draftDate: false,
        finalDate: false,
        bidDeadline: false
    };

    // Disable weekend selection
    self.disabled = function(date, mode) {
        return (mode === 'day' && (new Date().toDateString() == date.toDateString()));
    };

    self.dateOptions = {
        showWeeks: false,
        startingDay: 1
    };

    self.timeOptions = {
        readonlyInput: true,
        showMeridian: false
    };

    self.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        self.open[date] = true;
    };
    
    self.closeCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        self.open[date] = false;
    };

    // watch date4 and date5 to calculate difference
    $scope.$watch(function() {
        return self.dates;
    }, function() {

    }, true);

    $(document).ready(function () {
        $("input[type='radio']:first").attr("tabindex", "8");
        $("input[type='radio']").focusin(function () {
            $("input[type='radio']").attr("tabindex", "0");
            $(this).attr("tabindex", "8");
        });
    });

}]);