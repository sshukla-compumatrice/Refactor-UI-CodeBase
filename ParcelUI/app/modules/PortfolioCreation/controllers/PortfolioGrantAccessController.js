angular.module('PortfolioCreation').controller('PortfolioGrantAccessCtrl', ['$scope', '$log', 'Upload', function ($scope, $log, Upload) {

    $scope.portfolio.currentSection = $scope.portfolio.sectionCollection.grantAccess;
    var self = this;

    $("#ulnavigation .active").removeClass('active');
    $("#ulnavigation #grantAccessId").addClass('active');

    var loadData = function () {

        if (!$scope.portfolio.project || !$scope.portfolio.project.accessParties || !$scope.portfolio.project.accessParties[0]) {
            self.accessParty = $scope.portfolio.loadData.grantAccessGrps[0];

        } else {


            self.accessParty = $scope.portfolio.project.accessParties[0];
            var grps = $scope.portfolio.loadData.grantAccessGrps;
            for (var i = 0; i < grps.length; i++) {
                var group = grps[i];
                if ((self.accessParty.accessType == 'OFFICE' && self.accessParty.officeGUID == group.officeGUID) ||
                    (self.accessParty.accessType == 'TEAM' && self.accessParty.teamGUID == group.teamGUID) || (self.accessParty.accessType == 'COMPANY' && self.accessParty.companyGUID == group.companyGUID) || (self.accessParty.accessType == 'USER' && self.accessParty.userGUID == group.userGUID)) {
                    self.accessParty = group;
                    break;
                }
            }
            /*  var grps = $scope.portfolio.loadData.grantAccessGrps;
              for (var i = 0; i < grps.length; i++) {
                  var group = grps[i];
                  if (self.accessParty.accessType == group.accessType) {
                      // if ((self.accessParty.accessType == 'OFFICE' && self.accessParty.officeGUID == group.officeGUID) ||
                      //  (self.accessParty.accessType == 'TEAM' && self.accessParty.teamGUID == group.teamGUID)) {
                      self.accessParty = group;
                      break;
                      // }
                  }
              }*/
        }
    };

    loadData();

    var main = $scope.portfolio;
    main.getSubmitData = function () {

        var data = angular.copy($scope.portfolio.project);
        data.accessParties = [angular.copy(self.accessParty)];
        angular.forEach(data.accessParties, function (accessparty) {
            delete accessparty.name;
        });
        return data;
    }
    main.clearErrorDisplay = function () {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function (errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }

}]);
