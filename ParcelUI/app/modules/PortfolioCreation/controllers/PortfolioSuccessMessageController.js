angular.module('PortfolioCreation').controller('PortfolioSuccessMessageCtrl', ['$scope', '$state', '$location', 'BASEURL', 'globalValues', function ($scope, $state, $location, BASEURL, globalValues) {

    var self = this;
    var portfolio = $scope.portfolio;
    var project = portfolio.project;


    $scope.viewDashBoardURL = "#projectDashboard?projectGuid=" + project.projectGUID + "&accountGuid=" + globalValues.currentUserGuid + "&companyGuid=" + globalValues.currentUserCompanyGuid;

    $scope.addAnotherProject = function () {

        $scope.portfolio.project = {};
        $scope.portfolio.project.client = {};
        $state.go('PortfolioCreation.ProjectInformation');
        $("#projectInformationId").addClass('active');

    }




}])
