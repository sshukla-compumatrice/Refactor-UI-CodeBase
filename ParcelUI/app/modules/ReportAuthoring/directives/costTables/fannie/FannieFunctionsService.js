angular.module('ReportAuthoring').factory('fannieFunctionsService', ['$filter', function ($filter) {

    //Declare objects here
    var factory = {};
    var recommendationObject = {};


    //Start methods implementation here
    factory.fillPriorities = function ($scope, dataContainer) {
        if (dataContainer.completeRecommendationObject[0].lifesafety != undefined && dataContainer.completeRecommendationObject[0].lifesafety.include) {
            $scope.costSpread['lifesafety'] = dataContainer.completeRecommendationObject[0].lifesafety;
        }
        if (dataContainer.completeRecommendationObject[0].criticalitem != undefined && dataContainer.completeRecommendationObject[0].criticalitem.include) {
            $scope.costSpread['criticalitem'] = dataContainer.completeRecommendationObject[0].criticalitem;
        }
        if (dataContainer.completeRecommendationObject[0].deferredmaint != undefined && dataContainer.completeRecommendationObject[0].deferredmaint.include) {
            $scope.costSpread['deferredmaint'] = dataContainer.completeRecommendationObject[0].deferredmaint;
        }
    }

    factory.fillConstantValues = function (self, tableData) {

        self.evalPeriod = tableData.reserveTableConstantValues.evaluationPeriod;
        self.squareFootage = tableData.reserveTableConstantValues.totalSquareFootage;
        self.unInflated = tableData.reserveTableConstantValues.reservePerSFPerYearUninflated;
        self.inflated = tableData.reserveTableConstantValues.reservePerSFPerYearInflated;
        self.totalUninflatedYearWise = tableData.reserveTableConstantValues.totalUninflatedYearWise;
        self.inflationFactorYearWise = tableData.reserveTableConstantValues.inflationFactorYearWise;
        self.totalInflatedYearWise = tableData.reserveTableConstantValues.totalInflatedYearWise;
        self.totalInflated = tableData.reserveTableConstantValues.totalInflated;
        self.totalUninflated = tableData.reserveTableConstantValues.totalUninflated;
    }

    factory.createRecommendationObject = function (self, recommendationHeader) {

        var obj = {};
        obj.recommendationHeader = recommendationHeader;
        obj.recType = self.recommendation.recType.value == "other_" ? {
            value: self.recommendation.recType.value,
            name: self.recommendation.otherRecommendationType
        } : self.recommendation.recType;

        obj.name = self.recommendation.recType.value == "other_" ? self.recommendation.otherRecommendationType : self.recommendation.recType.name;
        obj.recType = obj.name;

        obj.eul = self.recommendation.eul;
        obj.eff = self.recommendation.eff;
        obj.rul = self.recommendation.rul;
        obj.quantity = self.recommendation.quantity;
        obj.unit = self.recommendation.unit;
        obj.unitCost = self.recommendation.unitCost;
        obj.cycleReplacement = self.recommendation.cycleReplacement;
        obj.replacePercent = self.recommendation.replacePercent;
        obj.totalCost = self.recommendation.totalCost;
        obj.unallocatedCost = self.recommendation.unallocatedCost;
        if (self.costSpread['lifesafety'].include != undefined && self.costSpread['lifesafety'].include) {
            obj.lifesafety = {};

            obj.lifesafety = self.costSpread['lifesafety'];
            obj.lifesafety.name = "lifesafety";
        }
        if (self.costSpread['criticalitem'].include != undefined && self.costSpread['criticalitem'].include) {
            obj.criticalitem = {};

            obj.criticalitem = self.costSpread['criticalitem'];
            obj.criticalitem.name = "criticalitem";
        }
        if (self.costSpread['deferredmaint'].include != undefined && self.costSpread['deferredmaint'].include) {
            obj.deferredmaint = {};

            obj.deferredmaint = self.costSpread['deferredmaint'];
            obj.deferredmaint.name = "deferredmaint";
        }

        obj.yearlyCostSpread = [];
        for (i = 1; i <= self.yearlyDistribution; i++) {
            var x = "yr" + "_" + i;
            if (self.costSpread[x].include != undefined && self.costSpread[x].include) {
                obj.yearlyCostSpread.push(self.costSpread[x]);
                obj.yearlyCostSpread[obj.yearlyCostSpread.length - 1].label = i;
            }
        }
        obj.criticalComments = self.recommendation.criticalComments;
        obj.source = self.recommendation.source;

        obj.condition = self.recommendation.condition;
        obj.action = self.recommendation.action;

        return obj;

    }

    factory.fillOtherDetails = function ($scope, dataContainer) {

        $scope.recommendation = dataContainer.completeRecommendationObject[0];
        // $scope.recommendation.recommendationTypes = dataContainer.recommendationTypes;

        var selectedRecomendationTypeArr = $filter('filter')(dataContainer.recommendationTypes, {
            name: dataContainer.completeRecommendationObject[0].name
        });


        if (selectedRecomendationTypeArr.length == 0) {
            $scope.recommendation.recType = {
                value: "other_"
            };
            $scope.recommendation.otherRecommendationType = dataContainer.completeRecommendationObject[0].name;
        } else {
            $scope.recommendation.recType = {
                value: selectedRecomendationTypeArr[0].value,
                name: selectedRecomendationTypeArr[0].name
            };

        }
    }

    return factory;
}])
