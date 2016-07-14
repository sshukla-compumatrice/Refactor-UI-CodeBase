angular.module('LenderProjectCreation').controller('LenderMortgageBankerCtrl', ['$log', '$modal', '$scope', function ($log, $modal, $scope) {

    var self = this;
    $scope.$parent.$parent.main.submitData.mortgageBroker = $scope.$parent.$parent.main.submitData.mortgageBroker || {};
    self.data = $scope.$parent.$parent.main.submitData;

    var mortgageBankerControllerLogger = $log.getInstance('LenderMortgageBankerCtrl');

    mortgageBankerControllerLogger.info("mortgageBanker controller reached");

  



}]);