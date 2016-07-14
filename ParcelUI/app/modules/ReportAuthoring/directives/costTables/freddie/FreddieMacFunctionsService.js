angular.module('ReportAuthoring').factory('freddieMacFunctionsService', ['$filter', function ($filter) {
    var factory = {};
    var recommendationObject = {};
    factory.fillPriorities = function ($scope, dataContainer) {
        if (dataContainer.completeRecommendationObject[0].critical != undefined && dataContainer.completeRecommendationObject[0].critical.include) {
            $scope.costSpread['critical'] = dataContainer.completeRecommendationObject[0].critical;
        }
        if (dataContainer.completeRecommendationObject[0].priority90Days != undefined && dataContainer.completeRecommendationObject[0].priority90Days.include) {
            $scope.costSpread['priority90Days'] = dataContainer.completeRecommendationObject[0].priority90Days;
        }
        if (dataContainer.completeRecommendationObject[0].priority != undefined && dataContainer.completeRecommendationObject[0].priority.include) {
            $scope.costSpread['priority'] = dataContainer.completeRecommendationObject[0].priority;
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

    factory.fillRecommendations = function (self, tableData) {
        self.sections = [];
        angular.forEach(tableData.recommendations.sections, function (section, index) {
            var obj = {};
            obj.section = section.section;
            obj.sectionId = section.sectionId;
            obj.sectionName = section.sectionName;
            var sectionId = section.section;
            self.sections.push(obj);
            angular.forEach(section.components, function (component, index) {
                component.section = sectionId;
                component.name = component.componentDescription;
                for (var i = 0; i < self.yearlyDistribution; i++) {
                    if (component.yearlyCostSpread[i] == undefined) {
                        var obj = {};
                        obj.label = i + 1;
                        obj.val = "";
                        obj.include = false;
                        component.yearlyCostSpread.splice(i, 0, obj);
                    } else if (component.yearlyCostSpread[i].label != i + 1) {
                        var obj = {};
                        obj.label = i + 1;
                        obj.val = "";
                        obj.include = false;
                        component.yearlyCostSpread.splice(i, 0, obj);

                    }
                }
                self.recommendations = section.components;
            })

        });
    }



    factory.createRecommendationObject = function (self, recommendationHeader) {



        //$scope.freddieObject.costSpread = $scope.costSpread;


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
        if (self.costSpread['critical'].include != undefined && self.costSpread['critical'].include) {
            obj.critical = {};

            obj.critical = self.costSpread['critical'];
            obj.critical.name = "critical";
        }
        if (self.costSpread['priority90Days'].include != undefined && self.costSpread['priority90Days'].include) {
            obj.priority90Days = {};

            obj.priority90Days = self.costSpread['priority90Days'];
            obj.priority90Days.name = "priority90Days";
        }
        if (self.costSpread['priority'].include != undefined && self.costSpread['priority'].include) {
            obj.priority = {};

            obj.priority = self.costSpread['priority'];
            obj.priority.name = "priority";
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
