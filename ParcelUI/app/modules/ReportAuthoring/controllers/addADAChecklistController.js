angular.module("ReportAuthoring").controller("addADAChecklistController", ['$state', '$stateParams', function($state, $stateParams) {

    var self = this;
    // data container for input fields in view
    self.data = {};

    var modalData = $stateParams.modalData;

    self.cancel = function() {
        close();
    };

    /*function close() {
        //$state.go("ReportAuthoring.Appendices");
        //opener.location.href = '/redirect';
        close();
    }*/

    self.save = function() {
        modalData.refreshAfter = true;
        close();
    }
}]);