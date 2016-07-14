angular.module('ReportAuthoring').controller('DefaultRecommendationController', ['$scope', '$modalInstance', 'ReportAuthoringAPI', 'dataContainer', '$filter', '$rootScope', 'commonFunctionsService', 'defaultFunctionsService', function ($scope, $modalInstance, ReportAuthoringAPI, dataContainer, $filter, $rootScope, commonFunctionsService, defaultFunctionsService) {

    $scope.commonFunctionsService = commonFunctionsService;

    //Declare objects
    $scope.yearlyDistribution = 12;
    $scope.recommendation = {};
    $scope.costSpread = {};
    $scope.calculateObj = {};

    $scope.sectionId = dataContainer.sectionId;

    function init() {
        if (!$scope.recommendation) return;

        commonFunctionsService.fillOtherDetails($scope, dataContainer);
        defaultFunctionsService.fillPriorities($scope, dataContainer);
        commonFunctionsService.fillYearlyDistribution($scope, dataContainer);

    }

    init();

    $scope.addUpdateRecommendation = function () {
        var updateRecommendationobj = {};
        updateRecommendationobj = defaultFunctionsService.createRecommendationObject($scope, '');

        $scope.$emit('update-recommendationIn-List', {
            updateRecommendation: updateRecommendationobj
        });

        $scope.close();
    }

    $scope.showCalculator = function (element) {

        commonFunctionsService.showCalculator($scope);
    }


    $scope.close = function () {
        $modalInstance.close();
    }

    $scope.showSplitQtyUnit = function () {
        commonFunctionsService.showSplitQtyUnit($scope);
    }

    $scope.hideSplitQtyUnit = function () {
        commonFunctionsService.hideSplitQtyUnit();

    }
    $scope.splitsQtyUnits = function () {

        var unitCost = $scope.recommendation.unitCost;
        var immedCost = ($scope.costSpread['immed'] = $scope.costSpread['immed'] || {}).val
        var totalCost = $scope.recommendation.totalCost;

        if (isNaN(immedCost)) {
            immedCost = 0;

        }
        var reserveCost = totalCost - immedCost;

        if (unitCost > 0) {
            var immedQty = immedCost / unitCost;
            var reserveQty = reserveCost / unitCost;
            $scope.recommendation.immediateQty = immedQty;
            $scope.recommendation.reserveQty = reserveQty;
        }
        angular.element("a[rel=splitpopover]").popover('hide');
    }



            }]);
