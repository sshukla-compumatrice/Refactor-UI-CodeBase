angular.module('LenderProjectCreation').controller('LenderAddPropertyInfoCtrl', ['$scope', '$log', '$modal', function ($scope, $log, $modal) {

    var addpropertyinfoControllerLogger = $log.getInstance('LenderAddPropertyInfoCtrl');

    addpropertyinfoControllerLogger.info("addpropertyinfo controller reached");
    //this.propertyTypes = $scope.main.obj[2].propertyTypes;
    //this.transactionTypes = $scope.main.obj[6].transactionTypes;
    this.propTypeChanged = function (propTypeChanged) {

        console.log("option changed " + propTypeChanged);
        propTypeChanged === "Other..." ? this.showOption = true : this.showOption = false;
    }


    this.showLatLonHelp = function () {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/LenderProjectCreation/views/lender_helpLatLon.html',
            scope: $scope,
            controller: LatLonHelpController,
            size: 1

        })
    }

    var LatLonHelpController = function ($scope, $modalInstance) {
        $scope.CancelDelete = function () {
            $modalInstance.close()
        }
    }

}]);