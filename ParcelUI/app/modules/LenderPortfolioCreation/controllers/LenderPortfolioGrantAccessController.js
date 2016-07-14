angular.module('PortfolioCreation').controller('LenderPortfolioGrantAccessCtrl', ['$scope', '$log', 'Upload', function($scope, $log, Upload) {

    var self = this;
    var main = $scope.lenderPortfolio;
    var projectData = main.project;
    var loadedData = main.loadData;

    var loadData = function() {
        if (!projectData || !projectData.accessParties || !projectData.accessParties.length || !projectData.accessParties[0]) return;

        self.accessParty = projectData.accessParties[0];
        var grps = loadedData.grantAccessGrps;
        for (var i = 0; i < grps.length; i++) {
            var group = grps[i];
            if (self.accessParty.accessType == group.accessType) {
                if ((self.accessParty.accessType == 'office' && self.accessParty.officeID == group.officeID) ||
                    (self.accessParty.accessType == 'team' && self.accessParty.teamID == group.teamID)) {
                    self.accessParty = group;
                    break;
                }
            }
        }
    };
    loadData();

    main.getSubmitData = function() {
        var data = angular.copy(main.project);
        data.accessParties = [self.accessParty];
        return data;
    }
    main.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }

}]);