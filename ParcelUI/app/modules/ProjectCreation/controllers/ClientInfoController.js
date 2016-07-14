angular.module('ProjectCreation').controller('ClientInfoCtrl', ['$log', '$modal', '$scope', function ($log, $modal, $scope) {

    var self = this;
    $scope.$parent.$parent.main.submitData.client = $scope.$parent.$parent.main.submitData.client || {};
    self.data = $scope.$parent.$parent.main.submitData;

    var clientinfoControllerLogger = $log.getInstance('clientinfoController');

    clientinfoControllerLogger.info("clientinfo controller reached");

    this.ShowFindContact = function () {


        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/findContact.html',
            scope: $scope,
            controller: 'FindContactCtrl as findContact',
            size: 'lg',
            windowClass: 'app-modal-window',

            resolve: {
                contactObj: function () {
                    return self.data;

                }

            }
        })


    }



}]);
