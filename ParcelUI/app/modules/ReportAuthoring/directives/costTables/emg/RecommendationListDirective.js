angular.module('ReportAuthoring').directive('emgRecommendationList', ['$rootScope', '$filter', '$timeout', function ($rootScope, $filter, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            costTable: '=',
            alertData: '='
        },

        templateUrl: 'app/modules/ReportAuthoring/directives/costTables/emg/recommendationListView.html',
        controller: ['$scope', '$timeout', '$modal', '$attrs', 'ParcelUI.Resources', 'commonFunctionsService', function ($scope, $timeout, $modal, $attrs, ParcelUI_Resources, commonFunctionsService) {
            $scope.sectionId = $scope.costTable.sectionId;
            $scope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;


            $scope.putBgColor = function (item, index, odd, even) {

                if (index == 0) {
                    item.bgColor = "grey";

                    return "grey";
                } else {
                    if (item.name == "") {
                        if ($scope.tableRows[index - 1].bgColor == "grey") {
                            item.bgColor = "grey";
                            return "grey";
                        }

                        if ($scope.tableRows[index - 1].bgColor == "white") {
                            item.bgColor = "white";
                            return "white";
                        }


                    } else {
                        if ($scope.tableRows[index - 1].bgColor == "grey") {
                            item.bgColor = "white";
                            return "white";
                        }

                        if ($scope.tableRows[index - 1].bgColor == "white") {
                            item.bgColor = "grey";
                            return "grey";
                        }

                    }
                }

            }

            init();

            function init() {
                $scope.emgHeaders = $scope.costTable.listHeaders;

                //create tables
                $scope.group = $scope.costTable.data[0].group;

                $scope.tableItems = [];
                if ($scope.costTable.data.length > 0) {
                    $scope.tableItems = $scope.costTable.data;
                }

                $scope.recommendationHeader = $scope.costTable.recommendationHeader;
                $scope.recommendationTypes = $scope.costTable.recommendationTypes;
                $scope.groupTypes = $scope.costTable.groupTypes;
                $scope.units = $scope.costTable.unit;
                $scope.group = $scope.costTable.data[0].group;
                fillListTable({}, "default");
            }

            function fillListTable(obj, operation) {
                $scope.tableRows = [];

                if (JSON.stringify(obj) === '{}' && operation === "default")
                    fillListView($scope.tableItems);
                else if (JSON.stringify(obj) !== '{}' && operation === "update")
                    fillListView($scope.tableItems);
                else if (JSON.stringify(obj) !== '{}' && operation === "insert") {

                    $scope.tableItems = [];
                    if ($scope.recommendationHeader === obj.recommendationHeader) {
                        $scope.tableItems = $scope.costTable.data[0].recommendation;
                        $scope.tableItems.push(obj);
                        fillListView($scope.tableItems);
                    } else {
                        $scope.tableItems = $scope.costTable.data[0].recommendation;
                        fillListView($scope.tableItems);
                    }
                }
            }

            function fillListView(tableItems) {
                angular.forEach(tableItems, function (tableItem, index) {
                    $scope.check = false;

                    if (tableItem.critical != undefined && tableItem.critical.include) {
                        var criticalObj = addColumnsToListView(tableItem, tableItem.critical);
                        $scope.check = true;
                        criticalObj.sectionId = tableItem.sectionId;
                        $scope.tableRows.push(criticalObj);


                    }

                    if (tableItem.priority90Days != undefined &&
                        tableItem.priority90Days.include) {
                        var priority90DaysObj =
                            addColumnsToListView(tableItem, tableItem.priority90Days);
                        $scope.check = true;
                        priority90DaysObj.sectionId = tableItem.sectionId;
                        $scope.tableRows.push(priority90DaysObj);

                    }

                    if (tableItem.priority != undefined && tableItem.priority.include) {
                        var priorityObj = addColumnsToListView(tableItem, tableItem.priority);
                        $scope.check = true;
                        priorityObj.sectionId = tableItem.sectionId;
                        $scope.tableRows.push(priorityObj);
                    }

                    if (tableItem.yearlyCostSpread.length > 0) {
                        angular.forEach(tableItem.yearlyCostSpread,
                            function (costSplitPerYear, index) {
                                var obj = addSplitCostColumnsToList(tableItem, costSplitPerYear);
                                $scope.check = true;
                                obj.sectionId = tableItem.sectionId;
                                $scope.tableRows.push(obj);
                                //$scope.count = $scope.count + 1;
                                //$scope.check = true;
                            })


                    }
                })
            }

            function addSplitCostColumnsToList(tableItem, costSplitPerYear) {

                var obj = {};

                obj.name = $scope.check ? "" : tableItem.name;
                obj.eul = $scope.check ? "" : tableItem.eul;
                obj.eff = $scope.check ? "" : tableItem.eff;
                obj.rul = $scope.check ? "" : tableItem.rul;
                obj.quantity = $scope.check ? "" : tableItem.quantity;
                obj.unit = $scope.check ? "" : tableItem.unit;
                obj.unitCost = $scope.check ? "" : tableItem.unitCost;
                obj.cycleReplacement = $scope.check ? "" : tableItem.cycleReplacement;
                obj.replacePercent = $scope.check ? "" : tableItem.replacePercent;
                obj.unallocatedCost = $scope.check ? "" : tableItem.unallocatedCost;
                obj.year = costSplitPerYear.label;
                obj.cost = costSplitPerYear.val;
                obj.criticalComments = $scope.check ? "" : tableItem.criticalComments;
                obj.conditionComments = $scope.check ? "" : tableItem.conditionComments;
                return obj;

            }

            function addColumnsToListView(tableItem, costObj) {
                var obj = {};
                //if($scope.check) obj.class = "same" + $scope.count;
                obj.name = $scope.check ? "" : tableItem.name;
                obj.eul = $scope.check ? "" : tableItem.eul;
                obj.eff = $scope.check ? "" : tableItem.eff;
                obj.rul = $scope.check ? "" : tableItem.rul;
                obj.unit = $scope.check ? "" : tableItem.unit;
                obj.unitCost = $scope.check ? "" : tableItem.unitCost;
                obj.cycleReplacement = $scope.check ? "" : tableItem.cycleReplacement;
                obj.replacePercent = $scope.check ? "" : tableItem.replacePercent;
                obj.unallocatedCost = $scope.check ? "" : tableItem.unallocatedCost;
                obj.year = costObj.name;
                obj.cost = costObj.val;
                return obj;
            }

            function getImmediateNotBlankName(index, event) {
                return $(event.target).parents('table tbody tr').eq(index).children().first().text();
            }

            function openPopUp() {

                var modalContainer = {
                    refreshAfter: false,
                    recommendationName: $scope.recommendationName,
                    completeRecommendationObject: $.grep($scope.tableItems, function (item) {
                        return item.name === $scope.recommendationName;
                    }),
                    group: $scope.group,
                    groupTypes: $scope.groupTypes,
                    recommendationTypes: $scope.recommendationTypes,
                    group: $scope.group
                }

                var modalInstance = $modal.open({
                    templateUrl: 'app/modules/ReportAuthoring/directives/costTables/emg/recommendationView.html',
                    controller: 'EmgRecommendationController',
                    size: 'lg',
                    resolve: {
                        dataContainer: function () {
                            return modalContainer;
                        }
                    }
                });

                modalInstance.result.then(function () {


                });
            }

            $scope.editRecommendation = function (recommendationData, index, firstClick, elem) {

                if (firstClick == 1) var elem = $(elem.target).parents('tr');


                var text = elem.children().first().text();
                if (text != "") {
                    $scope.recommendationName = text;
                    openPopUp();
                } else {
                    elem = elem.prev();

                    $scope.editRecommendation(recommendationData, index, 0, elem);
                }


            }


            $rootScope.$on('add-recommendationIn-List', function (event, args) {
                if ($scope.sectionId == args.newRecommendation.sectionId) {
                    var copyRecommendation = angular.copy(args.newRecommendation);

                    var tableName = $attrs.$$element.parent('div').attr('ng-repeat').split('.')[1]
                    var data = {
                        submitType: 'ADD',
                        propName: tableName,
                        data: copyRecommendation
                    }

                    var promise = commonFunctionsService.updateRecommedation($scope, data);

                    $scope.waitingProcessResources.promise = null;
                    $scope.waitingProcessResources.promise = promise;
                    promise.then(function () {
                        fillListTable(copyRecommendation, "insert");
                        $scope.alertData.status = 'show';
                        $scope.alertData.message = ParcelUI_Resources.messagesResources.saved_Success;
                        $scope.alertData.type = 'success';
                    });
                }
            });

            $rootScope.$on('update-recommendationIn-List', function (event, args) {

                if ($scope.sectionId == args.updateRecommendation.sectionId) {
                    var copyRecommendation = angular.copy(args.updateRecommendation);

                    var tableName = $attrs.$$element.parent('div').attr('ng-repeat').split('.')[1]

                    var data = {
                        submitType: 'UPDATE',
                        propName: tableName,
                        data: copyRecommendation
                    }

                    var promise = commonFunctionsService.updateRecommedation($scope, data);

                    $scope.waitingProcessResources.promise = null;
                    $scope.waitingProcessResources.promise = promise;
                    promise.then(function () {
                        updateListTable(copyRecommendation);

                        $scope.alertData.status = 'show';
                        $scope.alertData.message = ParcelUI_Resources.messagesResources.updated_Success;
                        $scope.alertData.type = 'success';
                    });
                }
            });


            function updateListTable(obj) {
                if (obj === undefined) return;
                else {
                    angular.forEach($scope.tableItems, function (item, index) {
                        console.log("compare while update " + item.name);
                        console.log("compare while update " + obj.name);
                        if (item.name == obj.name) {
                            $scope.tableItems[index] = obj;
                            fillListTable(obj, "update");
                        }
                    })

                }
            }



        }]
    }
}]);
