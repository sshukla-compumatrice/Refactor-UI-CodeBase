angular.module('ReportAuthoring').directive('fannieRecommendationList', ['$rootScope', '$filter', '$timeout', 'ReportAuthoringAPI', function ($rootScope, $filter, $timeout, ReportAuthoringAPI) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            costTable: '=',
            alertData: '='

        },

        templateUrl: 'app/modules/ReportAuthoring/directives/costTables/Fannie/recommendationListView.html',


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
                $scope.fannieHeaders = $scope.costTable.listHeaders;

                //create tables

                console.log("$scope.costTable.condition")
                console.log($scope.costTable.condition)
				if ($scope.costTable.data.length > 0) {
                	$scope.tableItems = $scope.costTable.data;
					$scope.group = $scope.costTable.data[0].group;
				}
                $scope.recommendationHeader = $scope.costTable.recommendationHeader;
                $scope.recommendationTypes = $scope.costTable.recommendationTypes;
                $scope.groupTypes = $scope.costTable.groupTypes;
                
                $scope.units = $scope.costTable.unit;
                $scope.conditions = $scope.costTable.condition;
                $scope.actions = $scope.costTable.action;

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
                    if (tableItem.lifesafety != undefined && tableItem.lifesafety.include) {
                        var lifesafetyObj = addColumnsToListView(tableItem, tableItem.lifesafety);
                        $scope.check = true;
                        lifesafetyObj.sectionId = tableItem.sectionId;
                        $scope.tableRows.push(lifesafetyObj);


                    }
                    if (tableItem.criticalitem != undefined &&
                        tableItem.criticalitem.include) {
                        var criticalitemObj =
                            addColumnsToListView(tableItem, tableItem.criticalitem);
                        $scope.check = true;
                        criticalitemObj.sectionId = tableItem.sectionId;
                        $scope.tableRows.push(criticalitemObj);

                    }
                    if (tableItem.deferredmaint != undefined && tableItem.deferredmaint.include) {
                        var deferredmaintObj = addColumnsToListView(tableItem, tableItem.deferredmaint);
                        $scope.check = true;
                        deferredmaintObj.sectionId = tableItem.sectionId;
                        $scope.tableRows.push(deferredmaintObj);


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
                obj.source = $scope.check ? "" : tableItem.source;
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
                    groupTypes: $scope.groupTypes,
                    recommendationTypes: $scope.recommendationTypes,
                    group: $scope.group,
                    units: $scope.units,
                    conditions: $scope.conditions,
                    actions: $scope.actions
                }

                var modalInstance = $modal.open({
                    templateUrl: 'app/modules/ReportAuthoring/directives/costTables/Fannie/recommendationView.html',
                    controller: 'FannieRecommendationController',
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

                var text = elem.children().children().first().text();
                if (text != "") {
                    $scope.recommendationName = text; //recommendationData.name;
                    openPopUp();
                } else {
                    elem = elem.prev();

                    $scope.editRecommendation(recommendationData, index, 0, elem);
                }
            }


            $scope.deleteRecommendation = function (recommendationData, index, firstClick, elem) {

                var modalContainer = {
                    refreshAfter: false,
                    recommendationName: $scope.recommendationName,
                    completeRecommendationObject: $.grep($scope.tableItems, function (item) {
                        return item.name === $scope.recommendationName;
                    }),

                    recommendationTypes: $scope.recommendationTypes
                }

                var modalInstance = $modal.open({
                    template: "<div class='modal-header'>" + "<h4 class='modal-title'>Confirmation</div>" + "</div>" + "<div class='modal-body'>" + "<p class='alert alert-danger'>Do you want to delete this record?</p>" + "</div>" + "<div class='modal-footer'>" + "<button ng-click='yes_click()' class='btn btn-default'> Yes </button>" + "<button ng-click='no_click()' class='btn btn-primary'> No </button>" + "</div>",
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.yes_click = function () {
                            var isDelete = ReportAuthoringAPI.deleteRecommendation("14", "25", recommendationData.recommendationId);
                            $modalInstance.close(isDelete);
                        };

                        $scope.no_click = function () {

                            $modalInstance.close(false);
                        };
                    }],
                    size: 'md',
                    resolve: {

                    }
                });

                modalInstance.result.then(function (isSuccess) {
                    if (isSuccess) {
                        $scope.alertData.status = 'show';
                        $scope.alertData.message = ParcelUI_Resources.messagesResources.deleted_Success;
                        $scope.alertData.type = 'success';
                        var deleteRecommendationObject = $.grep($scope.costTable.data[0].recommendation, function (item) {
                            return item.name === recommendationData.name;
                        });
                        var recommendationIndex = $scope.costTable.data[0].recommendation.indexOf(deleteRecommendationObject);
                        $scope.costTable.data[0].recommendation.splice(recommendationIndex, 1);
                        fillListTable({}, "default");
                    }

                });
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
