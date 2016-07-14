angular.module("ReportAuthoring").controller('llpQuestionnaireController', ['$state', '$stateParams', function($state, $stateParams) {
    var self = this;
    var modalData = $stateParams.modalData;

    self.open = {
        date: false
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

    self.submit = function($event) {
        // do submit functionality here

        // invoke submit success callback
        modalData.refreshAfter = true;
        // close modal after
        closeModal();
    };

    self.submitPut = function() {

    };

    self.cancel = function() {
        closeModal();
    };

    /*function invokeCallback(event) {
        var target = event.target;
        var element = angular.element(target);
        var callbackExpression = element.attr('submit-success');
        eval(callbackExpression);
    }*/

    function closeModal() {
        $state.go("ReportAuthoring.Appendices");
    }

}]);