angular.module('ReportAuthoring').controller('EmgRecommendationController', ['$scope', '$modalInstance', 'ReportAuthoringAPI', 'dataContainer', '$filter', '$rootScope', 'commonFunctionsService', 'emgFunctionsService', function ($scope, $modalInstance, ReportAuthoringAPI, dataContainer, $filter, $rootScope, commonFunctionsService, emgFunctionsService) {

    $scope.commonFunctionsService = commonFunctionsService;

    //Declare objects
    $scope.yearlyDistribution = 10;
    $scope.recommendation = {};
    $scope.costSpread = {};
    $scope.calculateObj = {};



    function init() {
        if (!$scope.recommendation) return;

        commonFunctionsService.fillOtherDetails($scope, dataContainer);
        emgFunctionsService.fillPriorities($scope, dataContainer);
        commonFunctionsService.fillYearlyDistribution($scope, dataContainer);
        $scope.recommendation.groupTypes = dataContainer.groupTypes;
        //  $scope.recommendation.group = dataContainer.group;
        var selectedGroupTypeArr = $filter('filter')(dataContainer.groupTypes, {
            value: dataContainer.group
        });

        $scope.recommendation.group = {
            value: selectedGroupTypeArr[0].value,
            name: selectedGroupTypeArr[0].name
        };

    }

    init();

    $scope.addUpdateRecommendation = function () {
        var updateRecommendationobj = {};
        updateRecommendationobj = emgFunctionsService.createRecommendationObject($scope, '');
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
