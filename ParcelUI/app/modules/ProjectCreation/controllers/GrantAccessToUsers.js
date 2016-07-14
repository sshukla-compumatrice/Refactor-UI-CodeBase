angular.module('ProjectCreation').controller('GrantAccessCtrl', ['$scope', '$log', '$modal', function($scope, $log, $modal) {

    var grantAccessControllerLogger = $log.getInstance('grantAccessController');

    grantAccessControllerLogger.info("grantAccessController controller reached");

  
    this.ShowAccessHelp = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/helpAccess.html',
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