angular.module('ReportAuthoring').controller('FreddieMacRecommendationController', ['$scope', '$modalInstance', 'ReportAuthoringAPI', 'dataContainer', '$filter', '$rootScope', 'freddieMacFunctionsService', 'commonFunctionsService', function ($scope, $modalInstance, ReportAuthoringAPI, dataContainer, $filter, $rootScope, freddieMacFunctionsService, commonFunctionsService) {

    $scope.commonFunctionsService = commonFunctionsService;

    $scope.yearlyDistribution = 10;
    $scope.recommendation = {};
    $scope.costSpread = {};
    $scope.calculateObj = {};

    function init() {

        if (!$scope.recommendation) return;

        commonFunctionsService.fillOtherDetails($scope, dataContainer);
        freddieMacFunctionsService.fillPriorities($scope, dataContainer);
        commonFunctionsService.fillYearlyDistribution($scope, dataContainer);
        $scope.recommendation.groupTypes = dataContainer.groupTypes;

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

        updateRecommendationobj = freddieMacFunctionsService.createRecommendationObject($scope, '');
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




    /*$scope.$on('fill-recommendation-details',function(event,args){
        console.log("reached rrrr " + JSON.stringify(args));
    })*/
}]);
