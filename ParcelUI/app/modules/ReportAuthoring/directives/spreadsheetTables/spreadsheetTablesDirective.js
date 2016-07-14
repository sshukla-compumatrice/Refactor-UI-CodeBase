angular.module('ReportAuthoring').directive('spreadsheetTable', [function () {
    return {
        restrict: 'E',
        transclude: false,
        templateUrl: 'app/modules/ReportAuthoring/directives/spreadsheetTables/spreadsheetTableView.html',
        scope: {
            table: '='
        },

        controller: ['$scope', '$attrs', '$filter', 'tablesCommonFunctionsService', 'ParcelUI.Resources', 'scopeArray', function ($scope, $attrs, $filter, tablesCommonFunctionsService, ParcelUI_Resources, scopeArray) {
            if (!$scope.table) return;

            $scope.tocData = $scope.$parent.resp;
            $scope.sectionGuid = $scope.$parent.resp.sectionGUID;
            $scope.sectionNumber = $scope.$parent.resp.sectionNumber;
            $scope.sectionName = $scope.$parent.resp.sectionName;
            $scope.tablesCommonFunctionsService = tablesCommonFunctionsService;
            $scope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;

            $scope.tableName = $attrs.table.split('.')[1];

            $scope.alertData = {};
            $scope.identity = angular.identity;
            $scope.numberOfRowsAdd = 1;
            $scope.dataOperationMode = "EDIT";
            $scope.editmode = false;
            var structure = $scope.table.structure;
            var oldSectionData;


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
                $scope.editmode = false;
            });

            $scope.rowIndexColl = [];
            for (var i = 0; i < structure.length; i++) {
                var local = structure[i];
                var val = local.rowIndex;
                if ($scope.rowIndexColl.indexOf(val) < 0) {
                    $scope.rowIndexColl.push(val);
                }
            }


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
                $scope.saveChanges();
            }
            $scope.moveDown = function (rowIndex) {
                tablesCommonFunctionsService.moveDown($scope, rowIndex);
                $scope.saveChanges();
            }
            $scope.moveToEnd = function (rowIndex, destination, direction) {
                tablesCommonFunctionsService.moveToEnd($scope, rowIndex, destination, direction);
                $scope.saveChanges();
            }

            $scope.showHistory = function (editmode) {
                tablesCommonFunctionsService.showHistory($scope, 'spreadSheetTable', editmode);
            }
            $scope.rowEditClick = function () {
                tablesCommonFunctionsService.editTable($scope);
            }
            
            $scope.spreadsheetTableScope = $scope;

            $scope.spellCheckTable = function (element) {
                window.sessionStorage.setItem('isTableSpellcheckRunning', true)
                spellCheckAllTables($(element).parent().parent().parent().find('.table-responsive'), $scope.$parent.resp.sectionID);
            }

        }]
    }
}]);
