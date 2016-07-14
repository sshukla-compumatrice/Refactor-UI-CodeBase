angular.module('ReportAuthoring').directive('horizontalTable', [function () {
    return {
        restrict: 'E',
        transclude: false,
        templateUrl: 'app/modules/ReportAuthoring/directives/horizontalTables/horizontalTableView.html',
        scope: {
            table: '='
        },
        controller: ['$scope', '$attrs', '$filter', 'tablesCommonFunctionsService', 'ParcelUI.Resources', 'scopeArray', function ($scope, $attrs, $filter, tablesCommonFunctionsService, ParcelUI_Resources, scopeArray) {
            if (!$scope.table) return;

            $scope.tableName = $attrs.table.split('.')[1];
            $scope.tablesCommonFunctionsService = tablesCommonFunctionsService;
            $scope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
            $scope.sectionNumber = $scope.$parent.resp.sectionNumber;
            $scope.sectionName = $scope.$parent.resp.sectionName;
            $scope.sectionGuid = $scope.$parent.resp.sectionGUID;


            $scope.alertData = {};
            $scope.identity = angular.identity;
            var structure = $scope.table.structure;
            $scope.numberOfRowsAdd = 1;
            $scope.dataOperationMode = "EDIT";
            $scope.editmode = false;

            $scope.$on("handleEditTable", function handleEditTableEvent(event, isTableEdit) {
                $scope.editmode = isTableEdit;
            });

            $scope.$on('save-all-tables', function (event, args) {
                oldSectionData = $filter('filter')(args.copyOfTocData, {
                    sectionGUID: event.currentScope.sectionGuid
                }, true);

                if (oldSectionData && oldSectionData.length) {
                    var accessKey = $attrs.table.split(".");
                    var sectionTableData = angular.copy(oldSectionData[0].sectionData);
                    for (var i = 0; i < accessKey.length; i++) {
                        sectionTableData = angular.copy(sectionTableData[accessKey[i]]);
                    }

                    if (!angular.equals(sectionTableData, event.currentScope.table)) {
                        if (event.currentScope.editmode) {
                            if (event.targetScope.updatedTableSections.indexOf(event.currentScope.sectionGuid) == -1) {
                                event.targetScope.updatedTableSections.push(event.currentScope.sectionGuid);
                            }
                        }
                    }
                }
            });

            $scope.$on('set-editable-flag', function (event) {
                $scope.editmode = false
            });

            $scope.rowIndexColl = [];
            for (var i = 0; i < structure.length; i++) {
                var local = structure[i];
                var val = local.rowIndex;
                if ($scope.rowIndexColl.indexOf(val) < 0) {
                    $scope.rowIndexColl.push(val);
                }
            }

            $scope.filterbyRowIndex = function (rowIndex) {
                return function (col) {
                    return col.rowIndex === rowIndex;
                };
            };

            tablesCommonFunctionsService.checkReportStatus();
            $scope.saveChanges = function () {

                tablesCommonFunctionsService.saveChanges($scope);
            }

            $scope.cancelChanges = function () {
                tablesCommonFunctionsService.cancelChanges($scope);
            }

            $scope.addRow = function () {
                tablesCommonFunctionsService.addRow($scope);
            }

            $scope.editTable = function () {
                tablesCommonFunctionsService.editTable($scope);
            }

            $scope.duplicateRow = function (rowData) {
                tablesCommonFunctionsService.duplicateRow($scope, rowData)
            }

            $scope.deleteRow = function (rowIndex) {

                tablesCommonFunctionsService.deleteRow($scope, rowIndex);
            }
            $scope.deleteTable = function (rowIndex) {
                tablesCommonFunctionsService.deleteTable($scope, rowIndex);
            }
            $scope.moveUp = function (rowIndex) {
                tablesCommonFunctionsService.moveUp($scope, rowIndex);
            }
            $scope.moveDown = function (rowIndex) {
                tablesCommonFunctionsService.moveDown($scope, rowIndex);
            }
            $scope.moveToEnd = function (rowIndex, destination, direction) {
                tablesCommonFunctionsService.moveToEnd($scope, rowIndex, destination, direction);
                $scope.saveChanges();
            }

            $scope.showHistory = function (editmode) {
                tablesCommonFunctionsService.showHistory($scope, 'horizontalTable', editmode);
            }
            $scope.rowEditClick = function () {
                //$scope.editmode = true;
                tablesCommonFunctionsService.editTable($scope);
            }
            $scope.spellCheckTable = function (element) {
                window.sessionStorage.setItem('isTableSpellcheckRunning', true)
                spellCheckAllTables($(element).parent().parent().parent().find('.table-responsive'), $scope.$parent.resp.sectionID);
            }
            
            $scope.horizontalTableScope = $scope;

        }]
    }
}]);
