angular.module('ReportAuthoring').factory('emgFunctionsService', ['$filter', function ($filter) {

    //Declare objects here
    var factory = {};
    var recommendationObject = {};

    //Start methods implementation here
    factory.fillPriorities = function ($scope, dataContainer) {
        if (dataContainer.completeRecommendationObject[0].immed != undefined && dataContainer.completeRecommendationObject[0].immed.include) {
            $scope.costSpread['immed'] = dataContainer.completeRecommendationObject[0].immed;
        }
        if (dataContainer.completeRecommendationObject[0].shortTerm != undefined && dataContainer.completeRecommendationObject[0].shortTerm.include) {
            $scope.costSpread['shortTerm'] = dataContainer.completeRecommendationObject[0].shortTerm;
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
        if (self.costSpread['immed'].include != undefined && self.costSpread['immed'].include) {
            obj.immed = {};

            obj.immed = self.costSpread['immed'];
            obj.immed.name = "immed";
        }
        if (self.costSpread['shortTerm'].include != undefined && self.costSpread['shortTerm'].include) {
            obj.shortTerm = {};

            obj.shortTerm = self.costSpread['shortTerm'];
            obj.shortTerm.name = "shortTerm";
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
        obj.conditionComments = self.recommendation.conditionComments;

        obj.condition = ["E", "P"];
        obj.action = ["CR", "PR"];

        return obj;

    }

    return factory;
}])
