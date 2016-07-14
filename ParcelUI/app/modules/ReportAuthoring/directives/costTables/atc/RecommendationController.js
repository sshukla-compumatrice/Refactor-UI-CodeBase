angular.module('ReportAuthoring').controller('AtcRecommendationController', ['$scope', '$modalInstance', 'ReportAuthoringAPI', 'dataContainer', '$filter', '$rootScope', 'commonFunctionsService', 'atcFunctionsService', function ($scope, $modalInstance, ReportAuthoringAPI, dataContainer, $filter, $rootScope, commonFunctionsService, atcFunctionsService) {

    $scope.commonFunctionsService = commonFunctionsService;

    $scope.yearlyDistribution = 8;
    $scope.calculateObj = {};
    $scope.recommendation = {};
    $scope.costSpread = {};

    function init() {
        if (!$scope.recommendation) return;

        atcFunctionsService.fillPriorities($scope, dataContainer);
        commonFunctionsService.fillOtherDetails($scope, dataContainer);
        commonFunctionsService.fillYearlyDistribution($scope, dataContainer);
    }

    init();

    $scope.addUpdateRecommendation = function () {
        var updateRecommendationobj = {};
        updateRecommendationobj = atcFunctionsService.createRecommendationObject($scope, '');
        var result = ReportAuthoringAPI.addUpdateRecommendation(updateRecommendationobj);
        if (result) {
            $scope.$emit('update-recommendationIn-List', {
                updateRecommendation: updateRecommendationobj
            });
        }
        $scope.close();

    }

    $scope.showCalculator = function (element) {

        commonFunctionsService.showCalculator($scope);
    }

    $scope.close = function () {
        $modalInstance.close();
    }


}]);
