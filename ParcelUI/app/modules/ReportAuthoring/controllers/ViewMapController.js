// view map tool controller 
angular.module('ReportAuthoring').controller('ViewMapController', ['$modalInstance', '$scope', 'mapLocation', function ($modalInstance, $scope, mapLocation) {

    var self = this;
    self.searchLocation = {};
    init();

    function init() {
        self.searchLocation.latitude = mapLocation.latitude;
        self.searchLocation.longitude = mapLocation.longitude;
    }

    self.CancelDelete = function () {
        $modalInstance.close();
    }
}]);