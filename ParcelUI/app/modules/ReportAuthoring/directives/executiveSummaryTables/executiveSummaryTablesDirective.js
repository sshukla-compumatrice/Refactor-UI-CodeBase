angular.module('ReportAuthoring').directive('executiveSummaryTable_old', [function () {
    return {
        restrict: 'E',
        transclude: false,
        replace: true,
        templateUrl: 'app/modules/ReportAuthoring/directives/executiveSummaryTables/executiveSummaryTableView.html',
        scope: {
            table: '='
        },
        controller: ['$scope', function ($scope) {

            if (!$scope.table) return;
            $scope.eEditable = -1;

            $scope.flatTable = [];
            var structure = $scope.table.structure;
            var sections = $scope.table.sections;

            var data = $scope.table.data;
            $scope.cols = [];


            for (var s = 0; s < structure.length; s++) {

                if (structure[s].options != undefined) {
                    for (var o = 0; o < structure[s].options.length; o++) {
                        $scope.cols.push(structure[s].options[o].label);



                    }
                }
                if (structure[s].label != "Results") {
                    $scope.cols.push(structure[s].label);
                }


            }
            // console.log("table columns are : " + JSON.stringify($scope.cols));


            // iteration for all values
            /*for (var i = 0; i < data.length; i++) {

                var single = data[i];
                console.log("single: " + JSON.stringify(single));
                var obj = {};
                // iteration for properties in a single value
                for (var prop in single) {

                    var val = single[prop];
                    if (val instanceof Object) {
                        for (var nestedProp in val) {

                            var nestedVal = val[nestedProp];

                            obj[nestedProp] = nestedVal;
                        }
                    } else {
                        obj[prop] = val;
                    }
                }

                console.log("final Object: " + JSON.stringify(obj));
                $scope.flatTable.push(obj);
            }*/

            /*var sectionObj = {};

            angular.forEach($scope.flatTable, function (secObj) {
             

                for (var sec in sections) {
                   
                    if (sections[sec].sectionId == secObj.sectionId) {
                        secObj["sectionTitle"] = sections[sec].sectionTitle;
                    }

                }


            });*/


            var cloned = angular.copy($scope.table.structure);
            var arr = [];
            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                var section_obj = {
                    sectionId: section.sectionId,
                    sectionTitle: section.sectionTitle,
                    estCol: angular.copy(cloned)
                }

                for (var j = 0; j < section_obj.estCol.length; j++) {
                    var col = section_obj.estCol[j];
                    if (col.options && col.options.length) {
                        for (var k = 0; k < col.options.length; k++) {
                            var option = col.options[k];
                            option.value = getSectionValue($scope.table.data, section_obj.sectionId, option.label);
                        }
                    } else {
                        col.value = getSectionValue($scope.table.data, section_obj.sectionId, col.label);
                    }
                }
                arr.push(section_obj);

            }



            function getSectionValue(dataList, sectionId, property) {
                for (var i = 0; i < dataList.length; i++) {
                    var data = dataList[i];
                    if (data.sectionId == sectionId) {
                        return getDataValue(data, property);
                    }
                }
            }

            function getDataValue(data, property) {
                for (var prop in data) {
                    var val = data[prop];
                    if (prop == property) {
                        return val;
                    }

                    if (val instanceof Object) {
                        for (var nestedProp in val) {
                            var nestedVal = val[nestedProp];
                            if (nestedProp == property) {
                                return nestedVal;
                            }
                        }
                    }
                }
            }


            // console.log("1111111: " + JSON.stringify($scope.flatTable));




            for (var i = 0; i < arr.length; i++) {
                var section = arr[i];
                var item = {
                    sectionTitle: section.sectionTitle,
                    cols: []
                };
                $scope.Results = [];
                $scope.checkboxCount = 0;
                var nestedArr = section.estCol;
                for (var j = 0; j < nestedArr.length; j++) {
                    var col = nestedArr[j];
                    switch (col.style) {
                        case "CHECKBOX":
                            var chkBoxArr = col.options;
                            for (var k = 0; k < chkBoxArr.length; k++) {
                                var option = chkBoxArr[k];

                                var optionItem = {
                                    style: col.style,
                                    label: option.label,
                                    value: option.value
                                };
                                item.cols.push(optionItem);
                                $scope.Results.push(optionItem);
                                $scope.checkboxCount = $scope.checkboxCount + 1;
                            }
                            break;
                        case "MEMO":
                            var optionItem = {
                                style: col.style,
                                label: col.label,
                                value: col.value
                            };
                            item.cols.push(optionItem);
                            $scope.Results.push(optionItem);
                            break;
                    }
                }


                $scope.flatTable.push(item);
            }

            $scope.saveUser = function (data, id) {
                //$scope.user not updated yet
                angular.extend(data, {
                    id: id
                });

            };

            // remove user
            $scope.removeUser = function (index) {
                $scope.users.splice(index, 1);
            };
            //    }

        }]
    }
}]);


angular.module('ReportAuthoring').directive('executiveSummaryTable', [function () {
    return {
        restrict: 'E',
        transclude: false,
        templateUrl: 'app/modules/ReportAuthoring/directives/executiveSummaryTables/executiveSummaryTableView.html',
        scope: {
            table: '='
        },

        controller: ['$scope', '$attrs', '$filter', 'tablesCommonFunctionsService', 'ParcelUI.Resources', 'scopeArray', 'ReportWriteService', function ($scope, $attrs, $filter, tablesCommonFunctionsService, ParcelUI_Resources, scopeArray, ReportWriteService) {
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
            var structure = $scope.table.colStructure;
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


            $scope.spellCheckTable = function (element) {
                window.sessionStorage.setItem('isTableSpellcheckRunning', true)
                spellCheckAllTables($(element).parent().parent().parent().find('.table-responsive'), $scope.$parent.resp.sectionID);
            }


            $scope.gotoSection = function (sectionId) {
                debugger;
                var sectionObj = ReportWriteService.findChildSectionById(sectionId);
                $scope.$parent.$parent.reportWrite.sectionClicked(sectionObj)
            }

        }]
    }
}]);
