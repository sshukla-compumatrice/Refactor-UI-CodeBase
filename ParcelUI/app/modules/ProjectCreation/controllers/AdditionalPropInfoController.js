angular.module('ProjectCreation').controller('AddPropertyInfoCtrl', ['$scope', '$log', '$modal', function ($scope, $log, $modal) {

    var addpropertyinfoControllerLogger = $log.getInstance('addpropertyinfoController');

    addpropertyinfoControllerLogger.info("addpropertyinfo controller reached");
    //this.propertyTypes = $scope.main.obj[2].propertyTypes;
    //this.transactionTypes = $scope.main.obj[6].transactionTypes;
    this.propTypeChanged = function (propTypeChanged) {

        console.log("option changed " + propTypeChanged);
        propTypeChanged === "Other..." ? this.showOption = true : this.showOption = false;
    }


    this.showLatLonHelp = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/helpLatLon.html',
            scope: $scope,
            controller: LatLonHelpController,
            size: size

        })
    }

    var LatLonHelpController = function ($scope, $modalInstance) {
        $scope.CancelDelete = function () {
            $modalInstance.close()
        }
    }

}]);