angular.module('ReportAuthoring').controller('CostTablesListController', ['tableData', 'ReportAuthoringAPI', '$modal', '$rootScope', '$scope', '$filter', '$stateParams', 'freddieMacFunctionsService', 'emgFunctionsService', 'defaultFunctionsService', 'fannieFunctionsService', 'atcFunctionsService', 'commonFunctionsService', 'sharedService', function (tableData, ReportAuthoringAPI, $modal, $rootScope, $scope, $filter, $stateParams, freddieMacFunctionsService, emgFunctionsService, defaultFunctionsService, fannieFunctionsService, atcFunctionsService, commonFunctionsService, sharedService) {

    this.years = [];
    this.recommendations = [];
    this.yearlyDistribution = 10;
    this.sections = [];
    this.displayType = '';

    var self = this;

    function fillYearsInTableHeader() {
        commonFunctionsService.fillYearsInTableHeader(self, tableData);
    }

    function fillConstantValues() {
        switch (tableData.displayType) {

            case 'displayATC':
                atcFunctionsService.fillConstantValues(self, tableData);
                break;
            case 'displayDefault':
                defaultFunctionsService.fillConstantValues(self, tableData);
                break;
            case 'displayEMG':
                emgFunctionsService.fillConstantValues(self, tableData);
                break;
            case 'displayFannie':
                fannieFunctionsService.fillConstantValues(self, tableData);
                break;
            case 'displayFreddie2015':
                freddieMacFunctionsService.fillConstantValues(self, tableData);
                break;
            case 'displayHUD':

                break;


        }

    }

    function fillRecommendations() {
    
        commonFunctionsService.fillRecommendations(self, tableData);
 
    }

    this.getNumberArr = function (num) {
        var numArray = commonFunctionsService.getNumberArr(num);
        return numArray;
    }

    function init() {
          angular.element('.nav-tabs').hide();
        self.displayType = tableData.displayType;

        fillYearsInTableHeader();
        fillConstantValues();
        fillRecommendations();
 
        self.groupTypes = tableData.recommendations.groupTypes;
		//self.units = tableData.recommendations.unit;

    }

    init();

    this.editRecommendation = function (recomendation) {
  
        var templateUrl = getTemplateUrl();
        recomendation.recommendationTypes = tableData.recommendations.recommendationTypes;
        recomendation.groupTypes = tableData.recommendations.groupTypes;
		recomendation.units = tableData.recommendations.unit;
        openPopup(recomendation, templateUrl);
    }

    function getTemplateUrl() {
        var templateUrl = sharedService.getTemplateUrl(tableData.displayType);
        return templateUrl;
    }

    function openPopup(recommendationObject, templateUrl) {
        var modalContainer = {
            entireSectionRecommendation: recommendationObject,
            displayType: self.displayType
        }
        var modalInstance = $modal.open({
            templateUrl: templateUrl,
            controller: 'SectionRecommendation',
            size: 'lg',
            resolve: {
                dataContainer: function () {

                    return angular.copy(modalContainer);
                }
            }
        });
        modalInstance.result.then(function () {});
    }

    function updateListTable(obj) {
        if (obj === undefined) return;
        else {
            angular.forEach(self.recommendations, function (item, index) {
                console.log("compare while update " + item.name);
                console.log("compare while update " + obj.name);
                if (item.name == obj.name) {
                    var section = self.recommendations[index].section;
                    self.recommendations[index] = obj;
                    self.recommendations[index].componentDescription = obj.name;
                    self.recommendations[index].section = section;
                }
            })

        }
    }

    $rootScope.$on('update-recommendationIn-List', function (event, args) {
        updateListTable(args.updateRecommendation);

    });
}]);

angular.module('ReportAuthoring').controller('SectionRecommendation', ['dataContainer', '$scope', '$compile', '$filter', '$modalInstance', 'ReportAuthoringAPI', 'commonFunctionsService', 'freddieMacFunctionsService', 'defaultFunctionsService', 'fannieFunctionsService', 'emgFunctionsService', 'atcFunctionsService', function (dataContainer, $scope, $compile, $filter, $modalInstance, ReportAuthoringAPI, commonFunctionsService, freddieMacFunctionsService, defaultFunctionsService, fannieFunctionsService, emgFunctionsService, atcFunctionsService) {

    $scope.commonFunctionsService = commonFunctionsService;

    $scope.yearlyDistribution = 12;
    $scope.costSpread = {};
    $scope.close = function () {
        $modalInstance.close();
    }


    $scope.showCalculator = function (element) {
        commonFunctionsService.showCalculator($scope);

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


    var listener = $scope.$watch(dataContainer, function () {
        commonFunctionsService.storeRecommendation(dataContainer);
    });


    listener();

    var tempdataContainer = {};
    tempdataContainer.completeRecommendationObject = [];
    tempdataContainer.completeRecommendationObject.
    push(dataContainer.entireSectionRecommendation);
    tempdataContainer.recommendationName = dataContainer.entireSectionRecommendation.
    componentDescription;
    tempdataContainer.recommendationTypes = dataContainer.entireSectionRecommendation.
    recommendationTypes;
	tempdataContainer.units = dataContainer.entireSectionRecommendation.
    units;

    switch (dataContainer.displayType) {

        case 'displayATC':
            atcFunctionsService.fillPriorities($scope, tempdataContainer);
            break;
        case 'displayDefault':
            defaultFunctionsService.fillPriorities($scope, tempdataContainer);
            break;
        case 'displayEMG':
            emgFunctionsService.fillPriorities($scope, tempdataContainer);
            break;
        case 'displayFannie':
            fannieFunctionsService.fillPriorities($scope, tempdataContainer);
            break;
        case 'displayFreddie2015':
            freddieMacFunctionsService.fillPriorities($scope, tempdataContainer);
            break;
        case 'displayHUD':

            break;
    }

    commonFunctionsService.fillOtherDetails($scope, tempdataContainer);

    commonFunctionsService.fillYearlyDistribution($scope, tempdataContainer);

    $scope.addUpdateRecommendation = function () {
        var updateRecommendationobj;

        switch (dataContainer.displayType) {
            case 'displayATC':
                updateRecommendationobj = atcFunctionsService.createRecommendationObject($scope, '');
                break;
            case 'displayDefault':
                updateRecommendationobj = defaultFunctionsService.createRecommendationObject($scope, '');
                break;
            case 'displayEMG':
                updateRecommendationobj = emgFunctionsService.createRecommendationObject($scope, '');
                break;
            case 'displayFannie':
                updateRecommendationobj = fannieFunctionsService.createRecommendationObject($scope, '');
                break;
            case 'displayFreddie2015':
                updateRecommendationobj = freddieMacFunctionsService.createRecommendationObject($scope, '');
                break;
            case 'displayHUD':

                break;
        }

        var result = ReportAuthoringAPI.addUpdateRecommendation(updateRecommendationobj);
        if (result) {
            $scope.$emit('update-recommendationIn-List', {
                updateRecommendation: updateRecommendationobj
            });
        }

        $scope.close();
    }

}]);


angular.module('ReportAuthoring').directive('costtablePdf', ['$state', '$window', '$stateParams', 'ReportAuthoringAPI', '$timeout', 'commonFunctionsService', 'freddieMacFunctionsService', 'defaultFunctionsService', 'fannieFunctionsService', 'emgFunctionsService', 'atcFunctionsService', function ($state, $window, $stateParams, ReportAuthoringAPI, $timeout, commonFunctionsService, freddieMacFunctionsService, defaultFunctionsService, fannieFunctionsService, emgFunctionsService, atcFunctionsService) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            scope.years = [];
            scope.recommendations = [];
            scope.yearlyDistribution = 10;
            scope.sections = [];
            scope.tableData = [];
            var self = scope;

            init();

            function init() {
                //angular.element('.nav-tabs').hide();
        
                getData(scope.packageId, scope.tableId);

            }


            function getData(packageId, tableId) {
                ReportAuthoringAPI.getCostTableData($stateParams.SiteId, packageId, tableId).then(function (result) {
            
                    self.tableData = result;
                    fillSections();
                    fillYearsInTableHeader();
                    fillConstantValues();
                    fillRecommendations();
                    self.groupTypes = self.tableData.recommendations.groupTypes;
                })
            }

            function fillSections() {
                angular.forEach(self.tableData.recommendations.sections, function (section, index) {
                        self.sections.push(section.sectionName);
                    })
                    //FreddieMacCommonFunctions.fillYearsInTableHeader(self, self.tableData);
            }

            function fillYearsInTableHeader() {
                commonFunctionsService.fillYearsInTableHeader(self, self.tableData);
            }

            function fillConstantValues() {
                switch (self.tableData.displayType) {

                    case 'displayATC':
                        atcFunctionsService.fillConstantValues(self, self.tableData);
                        break;
                    case 'displayDefault':
                        defaultFunctionsService.fillConstantValues(self, self.tableData);
                        break;
                    case 'displayEMG':
                        emgFunctionsService.fillConstantValues(self, self.tableData);
                        break;
                    case 'displayFannie':
                        fannieFunctionsService.fillConstantValues(self, self.tableData);
                        break;
                    case 'displayFreddie2015':
                        freddieMacFunctionsService.fillConstantValues(self, self.tableData);
                        break;
                    case 'displayHUD':

                        break;
                }
            }

            function fillRecommendations() {
          
                commonFunctionsService.fillRecommendations(self, self.tableData);
        
            }

            this.getNumberArr = function (num) {
                var numArray = commonFunctionsService.getNumberArr(num);
                return numArray;

            }


            $timeout(function () {
                //var x =  $element.parent().parent().html();

                scope.$broadcast('openpdf', {
                    html: elem.html()
                });

            });

        },
        controller: function ($scope, $element) {


        }
    }
}])
