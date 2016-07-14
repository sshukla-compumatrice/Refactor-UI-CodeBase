angular.module('LenderProjectCreation').controller('LenderGrantAccessCtrl', ['$scope', '$log', '$modal', function ($scope, $log, $modal) {

    var grantAccessControllerLogger = $log.getInstance('LenderGrantAccessCtrl');

    grantAccessControllerLogger.info("grantAccessController controller reached");

  
    this.ShowAccessHelp = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/LenderProjectCreation/views/lender_helpAccess.html',
            scope: $scope,
            controller: AccessHelpController,
            size: size

        })
    }

    var AccessHelpController = function($scope, $modalInstance) {
        $scope.CancelDelete = function() {
            $modalInstance.close()
        }
    }
}]);