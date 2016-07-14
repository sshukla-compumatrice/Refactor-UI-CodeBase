// appendix tool controller 
angular.module('ReportAuthoring').controller('appendixToolController', ['$modalInstance', 'modalData', '$sce', '$rootScope', function($modalInstance, modalData, $sce, $rootScope) {
    var self = this;

    self.tool = modalData.tool;

    self.close = function() {
        $modalInstance.close();
    };

    self.getTrustedUrl = function(value) {
        return $sce.trustAsResourceUrl(value);
    };

    self.submitedSuccessfully = function() {
        alert('angular callback successfully invoked. Will refresh data now...');
        modalData.refreshAfter = true;
        $modalInstance.close();
    };

    $rootScope.$on('submit-success-callback-invoked', function() {
        self.submitedSuccessfully();
    });
 
}]);