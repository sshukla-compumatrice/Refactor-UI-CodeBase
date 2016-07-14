angular.module('ReportAuthoring').controller('FannieRecommendationController', ['$scope', '$compile', '$modalInstance', 'ReportAuthoringAPI', 'dataContainer', '$filter', '$rootScope', 'commonFunctionsService', 'fannieFunctionsService', function ($scope, $compile, $modalInstance, ReportAuthoringAPI, dataContainer, $filter, $rootScope, commonFunctionsService, fannieFunctionsService) {

    $scope.commonFunctionsService = commonFunctionsService;

    //Declare objects
    $scope.yearlyDistribution = 10;
    $scope.recommendation = {};
    $scope.costSpread = {};
    $scope.calculateObj = {};

    init();

    function init() {
        
        if (!$scope.recommendation) return;
      
        commonFunctionsService.fillOtherDetails($scope, dataContainer);
        fannieFunctionsService.fillPriorities($scope, dataContainer);
        commonFunctionsService.fillYearlyDistribution($scope, dataContainer);
        $scope.recommendation.groupTypes = dataContainer.groupTypes;
		$scope.recommendation.conditions = dataContainer.conditions;
		$scope.recommendation.actions = dataContainer.actions;

        var selectedGroupTypeArr = $filter('filter')(dataContainer.groupTypes, {
            value: dataContainer.group
        });

        $scope.recommendation.group = {
            value: selectedGroupTypeArr[0].value,
            name: selectedGroupTypeArr[0].name
        };
        
       /*  var selectedUnitArr = $filter('filter')(dataContainer.units, {
            value: dataContainer.completeRecommendationObject[0].unit
        });

        $scope.recommendation.unit = {
            value: selectedUnitArr[0].value,
            name: selectedUnitArr[0].name
        };
        */
      /*  var selectedUnitArr = $filter('filter')(dataContainer.units, {
            value: dataContainer.unit
        });

        $scope.recommendation.unit = {
            value: selectedUnitArr[0].value,
            name: selectedUnitArr[0].name
        };*/
        
    }

    $scope.addUpdateRecommendation = function () {

        var updateRecommendationobj = {};
        updateRecommendationobj = fannieFunctionsService.createRecommendationObject($scope, '');

        var result = ReportAuthoringAPI.addUpdateRecommendation(updateRecommendationobj);
        if (result) {
            $scope.$emit('update-recommendationIn-List', {
                updateRecommendation: updateRecommendationobj
            });
        }
        $scope.close();

    }

    $scope.close = function () {
        $modalInstance.close();
    }

    $scope.showCalculator = function (element) {

        commonFunctionsService.showCalculator($scope);
    }


}]);
