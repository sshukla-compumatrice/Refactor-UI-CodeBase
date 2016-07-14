angular.module('ReportAuthoring').factory('atcFunctionsService',['$filter',function($filter){
    var factory = {};
    var recommendationObject = {};
    factory.fillPriorities = function($scope,dataContainer){
        if (dataContainer.completeRecommendationObject[0].immed != undefined && dataContainer.completeRecommendationObject[0].immed.include) {
            $scope.costSpread['immed'] = dataContainer.completeRecommendationObject[0].immed;
        }
        if (dataContainer.completeRecommendationObject[0].shortTerm != undefined && dataContainer.completeRecommendationObject[0].shortTerm.include) {
            $scope.costSpread['shortTerm'] = dataContainer.completeRecommendationObject[0].shortTerm;
        }
       
        if (dataContainer.completeRecommendationObject[0].immedRequired != undefined && dataContainer.completeRecommendationObject[0].immedRequired.include) {
            $scope.immedRequired = dataContainer.completeRecommendationObject[0].immedRequired;
        }
        if (dataContainer.completeRecommendationObject[0].immedRecommended != undefined && dataContainer.completeRecommendationObject[0].immedRecommended.include) {
            $scope.immedRecommended = dataContainer.completeRecommendationObject[0].immedRecommended;
        }
    }
    
    
    factory.fillConstantValues = function(self,tableData){
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
    
 factory.createRecommendationObject = function (self,recommendationHeader) {

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
                   if (self.recommendation.immedRequired != undefined && self.recommendation.immedRequired.include) {
                        obj.immedRequired = {};

                        obj.immedRequired = self.recommendation.immedRequired;
                        obj.immedRequired.name = "immedRequired";
                    }
                    if (self.recommendation.immedRecommended != undefined && self.recommendation.immedRecommended.include) {
                        obj.immedRecommended = {};

                        obj.immedRecommended = self.recommendation.immedRecommended;
                        obj.immedRecommended.name = "immedRecommended";
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
	 				obj.sectionId = self.sectionId;

                return obj;

                }
       
    
       
        
    /*
      
    factory.fillOtherDetails = function ($scope,dataContainer){
        $scope.recommendation = dataContainer.completeRecommendationObject[0];
        $scope.recommendation.recommendationTypes = dataContainer.recommendationTypes;

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
    
    factory.fillYearlyDistribution = function($scope,dataContainer){
        angular.forEach(dataContainer.completeRecommendationObject[0].yearlyCostSpread, function (yearWiseCost, index) {
            $scope.costSpread["yr_" + yearWiseCost.label] = yearWiseCost;
        });
    }
    
    factory.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    factory.getNumberArr = function (num) {
        var numVal = parseInt(num);
        return new Array(num);
    }

    
    
    factory.calculateTotalSpreadCost = function ($scope) {
        var valContainer = $scope.costSpread;
        var total = 0;
        for (var spreadFactorLabel in valContainer) {
            var spreadFactor = valContainer[spreadFactorLabel];
            var val = spreadFactor.val;
            var parsedIntVal = parseInt(val);
            if (!parsedIntVal) continue;
            total = total + parsedIntVal;
        }
        return total;
    }

    factory.checkAll = function ($scope) {
        var valContainer = $scope.costSpread;
        for (var spreadFactorLabel in valContainer) {
            if (checkIfSpreadLabelYearly(spreadFactorLabel)) {
                var spreadFactor = valContainer[spreadFactorLabel];
                spreadFactor.include = true;
            }
        }
    }
    factory.uncheckAll = function ($scope) {
        var valContainer = $scope.costSpread;
        for (var spreadFactorLabel in valContainer) {
            if (checkIfSpreadLabelYearly(spreadFactorLabel)) {
                var spreadFactor = valContainer[spreadFactorLabel];
                spreadFactor.include = false;
            }
        }
    }

    function checkIfSpreadLabelYearly(label) {
        return label.startsWith('yr_') // label.startsWith('yr_')
    }
    
     factory.spreadCost = function ($scope) {
        var valContainer = $scope.costSpread;
        var includedCount = 0;
        for (var spreadFactorLabel in valContainer) {
            var spreadFactor = valContainer[spreadFactorLabel];
            var isIncluded = spreadFactor.include;
            if (isIncluded) {
                includedCount++;
            }

            spreadFactor.val = "";
        }

        var totalCost = $scope.recommendation.totalCost;
        var spread = parseInt(totalCost / includedCount);
        var remainder = totalCost % includedCount;

        for (var spreadFactorLabel in valContainer) {
            var spreadFactor = valContainer[spreadFactorLabel];
            var isIncluded = spreadFactor.include;
            if (isIncluded) {
                var toAssign = spread;

                if (remainder) {
                    toAssign++;
                    remainder--;
                }
                spreadFactor.val = toAssign;
            } else {
                spreadFactor.val = "";
            }
        }
    }
    
      factory.fillYearsInTableHeader = function(self,tableData){
        var yearlySpread = tableData.recommendations.evaluationPeriod;
        for (var i = 0; i < yearlySpread; i++) {
            self.years.push(i + 1);
        }
  
    
  
    factory.storeRecommendation = function (obj){
        recommendationObject = obj;
    }
    
    factory.getRecommendation = function (){
        return recommendationObject;
    }
      */
    
    return factory;
}])