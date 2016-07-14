angular.module("ReportAuthoring").controller("addCommunicationRecordController", ['$modalInstance', 'modalData', function($modalInstance, modalData) {

    var self = this;
    // data container for input fields in view
    self.data = {};

    self.cancel = function() {
        close(false);
    };

    function close(refreshAfter) {
        modalData.refreshAfter = refreshAfter;
        $modalInstance.close();
    }


    self.open = {};

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

}]);