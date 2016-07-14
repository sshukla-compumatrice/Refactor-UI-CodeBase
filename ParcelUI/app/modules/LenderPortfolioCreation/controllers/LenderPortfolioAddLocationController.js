angular.module('PortfolioCreation').controller('LenderPortfolioAddLocationCtrl', ['$scope', '$modalInstance', 'modalDataContainer', function($scope, $modalInstance, modalDataContainer) {

    var self = this;
    var main = $scope.lenderPortfolio;
    var existingProjectData = main.project;
    var loadedData = main.loadData;

    self.action = modalDataContainer.action;
    if (self.action == 'Add') {
        self.title = 'Add Location to Portfolio';
        self.location = {};
    } else {
        self.title = 'Edit Location';
        self.location = angular.copy(modalDataContainer.location);
    }

    self.from = null;

    self.addSite = function() {
        modalDataContainer.location = self.location;
        $modalInstance.close();
    }

    self.cancel = function() {
        $modalInstance.close();
    }

}]);