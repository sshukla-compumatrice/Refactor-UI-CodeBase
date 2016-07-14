angular.module('ReportAuthoring').directive('addRecommendation', [function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: false,

        template: '<ng-include src="getTemplateUrl()"/>',
        scope: {
            costTable: '=',
            someCtrlFn: '&callbackFn'
        },

        link: function ($scope, element, attrs) {
            $scope.someCtrlFn({
                arg1: 22
            });
            $scope.getTemplateUrl = function () {
                var templateUrl = 'app/modules/ReportAuthoring/directives/costTables/addRecommendation/recommendationDefault.html';
                return templateUrl;

            }
        },
        controller: ['$scope', '$modal', '$attrs', 'commonFunctionsService', 'defaultFunctionsService', 'freddieMacFunctionsService', 'emgFunctionsService', 'fannieFunctionsService', 'atcFunctionsService', 'sharedService', function ($scope, $modal, $attrs, commonFunctionsService, defaultFunctionsService, freddieMacFunctionsService, emgFunctionsService, fannieFunctionsService, atcFunctionsService, sharedService) {

            $scope.commonFunctionsService = commonFunctionsService;
            init();

            function init() {
                var templateUrl = "";

                $scope.recommendationHeader = $scope.costTable.recommendationHeader;
                getTemplateUrl();
            }

            function getTemplateUrl() {
                templateUrl = sharedService.getTemplateUrl($scope.costTable.type);
            }
            $scope.addRecomendation = function () {

                var modalContainer = {
                    refreshAfter: false,
                    addRecommendationObject: $scope.costTable
                }

                var modalInstance = $modal.open({
                    templateUrl: templateUrl,
                    controller: recommendationPopUpController,
                    size: 'lg',

                    resolve: {
                        dataContainer: function () {
                            return modalContainer;
                        }
                    }
                });

                modalInstance.result.then(function () {

                });
            };

            var recommendationPopUpController = function ($rootScope, $scope, $modalInstance, dataContainer) {

                $scope.commonFunctionsService = commonFunctionsService;
                $scope.recommendation = {};
                $scope.yearlyDistribution = 12;
                $scope.costSpread = {};
                $scope.calculateObj = {};


                $scope.recommendation.recommendationTypes = dataContainer.addRecommendationObject.recommendationTypes;
                $scope.recommendation.groupTypes = dataContainer.addRecommendationObject.groupTypes;
                $scope.recommendation.units = dataContainer.addRecommendationObject.unit;
                $scope.recommendation.conditions = dataContainer.addRecommendationObject.condition;
                $scope.recommendation.actions = dataContainer.addRecommendationObject.action;
                $scope.sectionId = dataContainer.addRecommendationObject.sectionId;

                $scope.addUpdateRecommendation = function () {
                    var newRecommendationobj;

                    switch (dataContainer.addRecommendationObject.type) {
                        case 'displayATC':
                            newRecommendationobj = atcFunctionsService.createRecommendationObject($scope, dataContainer.addRecommendationObject.recommendationHeader);
                            break;
                        case 'displayDefault':
                            newRecommendationobj = defaultFunctionsService.createRecommendationObject($scope, dataContainer.addRecommendationObject.recommendationHeader);
                            break;
                        case 'displayEMG':
                            newRecommendationobj = emgFunctionsService.createRecommendationObject($scope, dataContainer.addRecommendationObject.recommendationHeader);
                            break;
                        case 'displayFannie':
                            newRecommendationobj = fannieFunctionsService.createRecommendationObject($scope, dataContainer.addRecommendationObject.recommendationHeader);
                            break;
                        case 'displayFreddie2015':
                            newRecommendationobj = freddieMacFunctionsService.createRecommendationObject($scope, dataContainer.addRecommendationObject.recommendationHeader);
                            break;
                        case 'displayHUD':

                            break;
                    }

                    $rootScope.$emit('add-recommendationIn-List', {
                        newRecommendation: newRecommendationobj
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


            }
        }]
    }
}]);
