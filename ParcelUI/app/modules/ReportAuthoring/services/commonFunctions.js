angular.module('ReportAuthoring').factory('commonFunctionsService', ['$filter', '$compile', 'ReportAuthoringAPI', 'BASEURL', '$stateParams', function ($filter, $compile, ReportAuthoringAPI, BASEURL, $stateParams) {
    var factory = {};
    var recommendationObject = {};



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

    factory.fillOtherDetails = function (self, dataContainer) {

        self.recommendation = dataContainer.completeRecommendationObject[0];
        self.recommendation.recommendationTypes = dataContainer.recommendationTypes;
        self.recommendation.units = dataContainer.units;
        self.sectionId = dataContainer.sectionId;

        var selectedUnitArr = $filter('filter')(dataContainer.units, {
            name: dataContainer.completeRecommendationObject[0].unit
        });

        if (selectedUnitArr.length == 0) {

            self.recommendation.unit = dataContainer.completeRecommendationObject[0].unit;
        } else {
            self.recommendation.unit = {
                value: selectedUnitArr[0].value,
                name: selectedUnitArr[0].name
            };
        }

        var selectedRecomendationTypeArr = $filter('filter')(dataContainer.recommendationTypes, {
            name: dataContainer.completeRecommendationObject[0].name
        });


        if (selectedRecomendationTypeArr.length == 0) {
            self.recommendation.recType = {
                value: "other_"
            };
            self.recommendation.otherRecommendationType = dataContainer.completeRecommendationObject[0].name;
        } else {
            self.recommendation.recType = {
                value: selectedRecomendationTypeArr[0].value,
                name: selectedRecomendationTypeArr[0].name
            };
        }
    }

    factory.fillYearlyDistribution = function (self, dataContainer) {

        angular.forEach(dataContainer.completeRecommendationObject[0].yearlyCostSpread, function (yearWiseCost, index) {
            self.costSpread["yr_" + yearWiseCost.label] = yearWiseCost;
        });
    }

    factory.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    factory.getNumberArr = function (num) {
        var numVal = parseInt(num);
        return new Array(num);
    }



    factory.calculateTotalSpreadCost = function (costSpread) {
        var valContainer = costSpread;
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

    factory.checkAll = function (costSpread) {
        var valContainer = costSpread;
        for (var spreadFactorLabel in valContainer) {
            if (checkIfSpreadLabelYearly(spreadFactorLabel)) {
                var spreadFactor = valContainer[spreadFactorLabel];
                spreadFactor.include = true;
            }
        }
    }

    factory.uncheckAll = function (costSpread) {

        var valContainer = costSpread;
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

    factory.spreadCost = function (costSpread, totalCost) {
        var valContainer = costSpread;
        var includedCount = 0;
        for (var spreadFactorLabel in valContainer) {
            var spreadFactor = valContainer[spreadFactorLabel];
            var isIncluded = spreadFactor.include;
            if (isIncluded) {
                includedCount++;
            }

            spreadFactor.val = "";
        }


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

    factory.fillYearsInTableHeader = function (self, tableData) {
        var yearlySpread = tableData.recommendations.evaluationPeriod;
        for (var i = 0; i < yearlySpread; i++) {
            self.years.push(i + 1);
        }
    }



    factory.fillRecommendations = function (self, tableData) {
        self.sections = [];
        self.recommendations = [];
        angular.forEach(tableData.recommendations.sections, function (section, index) {

            var obj = {};
            obj.section = section.section;
            obj.sectionId = section.sectionId;
            obj.sectionName = section.sectionName;
            var sectionId = section.section;
            obj.sectionscomponents = [];
            angular.forEach(section.components, function (component, index) {

                component.section = sectionId;
                component.name = component.componentDescription;
                for (var i = 0; i < self.yearlyDistribution; i++) {

                    if (component.yearlyCostSpread[i] == undefined) {
                        var yearobj = {};
                        yearobj.label = i + 1;
                        yearobj.val = "";
                        yearobj.include = false;
                        component.yearlyCostSpread.splice(i, 0, yearobj);
                    } else if (component.yearlyCostSpread[i].label != i + 1) {
                        var yearobj = {};
                        yearobj.label = i + 1;
                        yearobj.val = "";
                        yearobj.include = false;
                        component.yearlyCostSpread.splice(i, 0, yearobj);

                    }
                }
                self.recommendations.push(component);
                obj.sectionscomponents.push(component);
            });

            self.sections.push(obj);
        });
    }


    factory.storeRecommendation = function (obj) {
        recommendationObject = obj;
    }

    factory.getRecommendation = function () {
        return recommendationObject;
    }



    factory.calculate = function (calculateObj) {

        var calculatedvalue = 0;
        var calculatevalue1 = 0;
        var calculatevalue2 = 0;

        if (!isNaN(calculateObj.calculatevalue1)) {
            calculatevalue1 = calculateObj.calculatevalue1;
        }

        if (!isNaN(calculateObj.calculatevalue2)) {
            calculatevalue2 = calculateObj.calculatevalue2;
        }

        switch (calculateObj.calculatesign) {
            case "-":
                calculatedvalue = parseFloat(calculatevalue1) - parseFloat(calculatevalue2);
                break;
            case "+":
                calculatedvalue = parseFloat(calculatevalue1) + parseFloat(calculatevalue2);
                break;
            case "/":
                calculatedvalue = parseFloat(calculatevalue1) / parseFloat(calculatevalue2)
                break;
            case "*":
                calculatedvalue = parseFloat(calculatevalue1) * parseFloat(calculatevalue2)
                break;

        }

        angular.element("a[rel=popover]").popover('hide')
        return calculatedvalue;
    }


    factory.showCalculator = function (self) {

        angular.element("a[rel=popover]").popover({
            placement: 'bottom',
            html: 'true',
            content: function () {
                var itemsTemplate = ' <div>' + '<div class="row">' + '<div class="col-lg-5 col-md-5">' + '<input type="text" class="form-control" id="calculatevalue1" ng-model="calculateObj.calculatevalue1"/></div>' + '<div class="col-lg-2 col-md-2 margin-padding-0">' + '<select class="form-control" id="calculatesign" ng-model="calculateObj.calculatesign" style="padding:0px;">' + '<option value="-">-</option>' + '<option value="+">+</option>' + '<option value="*">*</option>' + ' <option value="/">/</option>' + ' </select></div>' + ' <div class="col-lg-5 col-md-5">' + '<input type="text" class="form-control" id="calculatevalue2" ng-model="calculateObj.calculatevalue2">' + '</div>' + ' </div>' + ' <div class="row">' + ' <div class="col-lg-12 col-md-12 text-center">' + '<br> <button type="button" ng-click="commonFunctionsService.hideCalculator()" class="btn btn-default btn-sm">Close</button> <button type="button" class="btn btn-primary btn-sm" ng-click="recommendation.quantity=commonFunctionsService.calculate(calculateObj)">Calculate</button>' + '</div></div></div>'
                return $compile(itemsTemplate)(self);
            },
            template: '<div class="calculator popover popover-large"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
            trigger: 'manual'
        });
        angular.element("a[rel=popover]").popover('show');
        //$("#" + e.currentTarget.id).popover('show');

    }

    factory.hideCalculator = function () {
        angular.element("a[rel=popover]").popover('hide');
    }

    factory.showSplitQtyUnit = function (self) {

        angular.element("a[rel=splitpopover]").popover({
            placement: 'bottom',
            html: 'true',
            content: function () {
                var itemsTemplate = '<div>' + '<div class="row">' + ' <div class="col-lg-6 col-md-6">' + '<div class="form-group ">' + ' <label class="control-label col-lg-12 col-md-12 label-center" for="immediateQty">Immediate Qty</label>' + ' <div class="col-lg-12 col-md-12">' + ' <input type="text" class="form-control" id="immediateQty" ng-model="recommendation.immediateQty">' + '</div>' + '  </div>' + '  </div>' + '<div class="col-lg-6 col-md-6">' + '   <div class="form-group ">' + '  <label class="control-label col-lg-12 col-md-12 label-center" for="reserveQty">Reserve Qty</label>' + '   <div class="col-lg-12 col-md-12">' + '<input type="text" class="form-control" id="reserveQty" ng-model="recommendation.reserveQty">' + '  </div>' + ' </div>' + ' </div>' + '</div>' + ' <div class="row" style="padding-top:15px;">' + '<div class="col-lg-12 col-md-12 text-center">' + '<button type="button" ng-click="hideSplitQtyUnit()" class="btn btn-default btn-sm">Close</button>&nbsp;<button type="button" class="btn btn-primary btn-sm" ng-click="splitsQtyUnits()">Split</button></div> </div>' + '</div>'
                return $compile(itemsTemplate)(self);
            },
            template: '<div class="popover popover-large"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
            trigger: 'manual'
        });
        angular.element("a[rel=splitpopover]").popover('show');
    }

    factory.hideSplitQtyUnit = function () {
        angular.element("a[rel=splitpopover]").popover('hide');

    }


    factory.updateRecommedation = function (self, recommendationData) {

        var sectionTotalCost = 0;
        var sectionData = self.$parent.$parent.contentValues;
        if (recommendationData.submitType == "ADD") {

            if (!sectionData[recommendationData.propName][0].data) {
                sectionData[recommendationData.propName][0].data = [];
            }
            recommendationData.data.UniqueID = sectionData[recommendationData.propName][0].data.length;
            sectionData[recommendationData.propName][0].data.push(recommendationData.data);
            angular.forEach(sectionData[recommendationData.propName][0].data, function (dataObj, dataIndex) {

                sectionTotalCost = parseFloat(sectionTotalCost) + parseFloat(dataObj.totalCost);
            });
        } else {

            angular.forEach(sectionData[recommendationData.propName][0].data, function (dataObj, dataIndex) {

                sectionTotalCost = parseFloat(sectionTotalCost) + parseFloat(dataObj.totalCost);
                if (dataObj.UniqueID == sectionData[recommendationData.propName][0].data.length) {
                    recommendationData.data = dataObj.UniqueID;

                    sectionData[recommendationData.propName][0].data[dataIndex] = recommendationData.data;
                }
            });

        }

        var data = {
            "formSectionData": [
                {
                    "sectionGUID": self.$parent.$parent.sectionGUID,
                    "totalCost": sectionTotalCost,
                    "sectionData": {
                        "contentValues": sectionData

                    }
               }]
        };

        self.$parent.$parent.resp.totalCost = sectionTotalCost;
        return ReportAuthoringAPI.updateSection($stateParams.reportGuid, self.$parent.$parent.sectionGUID, data)

    }

    return factory;
}])


angular.module('ReportAuthoring').factory('tablesCommonFunctionsService', ['$filter', '$compile', '$modal', 'ParcelUI.Resources', 'ReportAuthoringAPI', 'BASEURL', '$stateParams', 'PerformedOperation', '$rootScope', 'HelperService', function ($filter, $compile, $modal, ParcelUI_Resources, ReportAuthoringAPI, BASEURL, $stateParams, PerformedOperation, $rootScope, HelperService) {

    var factory = {};
    var stack_bottomright = {
        "dir1": "up",
        "dir2": "left",
        "firstpos1": 50,
        "firstpos2": 25
    };

    factory.showPNotifyMessage = function (title, text, type) {
        new PNotify({
            title: title,
            text: text,
            type: type,
            addclass: "stack-bottomright",
            stack: stack_bottomright
        });
    }


    factory.saveChanges = function (self, msgTableOperation) {

        window.setTimeout(function () {
            $rootScope.$broadcast("set-is-editable",false);
            var data = {
                propName: self.tableName,
                data: self.table.data
            }

            promise = updateTable(self, data);
            window.sessionStorage.setItem('isTableSpellcheckRunning', false);
            var pNotifySuccessTitle = '';
            var pNotifyErrorTitle = 'Problem saving table';
            //var pNotifySuccessMsg = 'Table in section <strong>' + sectionNumber + '</strong> saved.';
            var pNotifySuccessMsg = 'Table in section <strong>' + self.sectionNumber + ' ' + self.sectionName + '</strong> have been saved.';
            var pNotifyErrorMsg = 'There was a problem saving the table. Please try again.';

            self.waitingProcessResources.promise = null;
            self.waitingProcessResources.promise = promise;

            promise.then(function (resp) {
                self.editmode = false;
                
                factory.showPNotifyMessage(pNotifySuccessTitle, pNotifySuccessMsg, 'success');
            }, function (error) {                
                factory.showPNotifyMessage(pNotifyErrorTitle, pNotifyErrorMsg, 'error');
            });
        }, 300);
    };


    factory.editTable = function (self) {
        if(!self.editmode){
            self.copytableData = angular.copy(self.table.data);
            self.editmode = true;
            self.dataOperationMode = 'EDIT';
            self.operationCode = PerformedOperation.EDIT;
            $rootScope.$broadcast("set-is-editable", true);
        }
        
    }

    factory.duplicateRow = function (self, data) {
        var duplicateData = {}
        angular.copy(data, duplicateData);

        self.table.data.push(duplicateData);
    }

    factory.checkReportStatus = function () {
        if (window.sessionStorage.getItem('reportStatusAbbreviation') == 'FIN') {

            var inputsbuttons = $("#rightContent").find('.btn');
            $(inputsbuttons).each(function () {
                $(this).attr('disabled', true);
            });

        }
    }
    factory.deleteRow = function (self, index) {

        var modalInstance = $modal.open({
            template: function (elem, attr) {
                var html = '';
                html += "<div class='modal-header'>";
                html += "<h4 class='modal-title'>Confirmation</div>";;
                html += "</div>";
                html += "<div class='modal-body'>";
                html += "<p class='alert alert-danger'>Do you want to delete this record?</p>";
                html += "</div>";
                html += "<div class='modal-footer'>";
                html += "<button ng-click='cancel()' class='btn btn-default'> No </button>";
                html += "<button ng-click='ok()' class='btn btn-primary'> Yes </button>";
                html += "</div>";
                return html;
            },
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.ok = function () {

                    var tablecopy = self.table.data;
                    tablecopy.splice(index, 1);

                    self.operationCode = PerformedOperation.DELETE;
                    var data = {
                        propName: self.tableName,
                        data: tablecopy
                    }
                    var promise = updateTable(self, data);
                    self.waitingProcessResources.promise = null;
                    self.waitingProcessResources.promise = promise;

                    $modalInstance.close(true, promise);
                };

                $scope.cancel = function () {

                    $modalInstance.close(false, null);
                };
                    }],
            size: 'md',
            resolve: {

            }
        });

        modalInstance.result.then(function (action, promise) {
            // console.log(action)
            if (action) {
                promise.then(function () {
                    self.table.data.splice(index, 1);
                    self.alertData.status = 'show';
                    self.alertData.message = ParcelUI_Resources.messagesResources.deleted_Success;
                    self.alertData.type = 'success';
                });
            }
        });
    }

    factory.deleteTable = function (self) {

        var modalInstance = $modal.open({
            template: function (elem, attr) {
                var html = '';
                html += "<div class='modal-header'>";
                html += "<button ng-click='cancel()' type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
                html += "<h4 class='modal-title'>Confirmation</h4>";
                html += "</div>";
                html += "<div class='modal-body'>";
                html += "<p class='alert alert-danger'>Do you want to delete this table?</p>";
                html += "</div>";
                html += "<div class='modal-footer'>";
                html += "<button ng-click='cancel()' class='btn btn-default'> No </button>";
                html += "<button ng-click='ok()' class='btn btn-primary'> Yes </button>";
                html += "</div>";
                return html;
            },
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.ok = function () {

                    var tablecopy = angular.copy(self.table.data);
                    tablecopy = []

                    self.operationCode = PerformedOperation.DELETETABLE;
                    var data = {
                        propName: self.tableName,
                        data: tablecopy
                    }
                    var promise = updateTable(self, data);
                    self.waitingProcessResources.promise = promise;

                    promise.then(function () {
                        self.table.data = [];
                        self.alertData.status = 'show';
                        self.alertData.message = ParcelUI_Resources.messagesResources.deleted_Success;
                        self.alertData.type = 'success';
                    });
                    $modalInstance.close(true);

                };

                $scope.cancel = function () {

                    $modalInstance.close(false);
                };
                    }],
            size: 'md',
            resolve: {

            }
        });

        modalInstance.result.then(function (action) {
            // console.log(action)
            if (action) {

            }
        });


    }

    factory.showHistory = function (self, tableType, editmode) {

        var modalInstance = $modal.open({
            templateUrl: getTemplate(tableType),
            controller: 'tableHistoryController as tableHistory',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            scope: self,
            resolve: {
                tableHistoryObj: function () {
                    var obj = {
                        sectionGUID: self.sectionGuid,
                        tableName: self.tableName,
                        editMode: editmode
                    }
                    return obj;
                }
            }
        });

        modalInstance.result.then(function (result) {
            self.editmode = false;
            $rootScope.$broadcast("set-is-editable",false);
        });
    };



    var moveRow = function (self, origin, destination, direction) {
        var temp = self.table.data[origin];
        if (temp != undefined && temp != null && temp != "" && destination < self.table.data.length && destination >= 0) {
            if (direction == "UP") {
                for (var i = origin; i > destination; i--) {
                    self.table.data[i] = self.table.data[i - 1];
                }
            } else {
                for (var i = origin; i < destination; i++) {
                    self.table.data[i] = self.table.data[i + 1];
                }
            }

            self.table.data[destination] = temp;

            self.operationCode = PerformedOperation.REORDER;
            var data = {
                propName: self.tableName,
                data: self.table.data
            }

            updateTable(self, data);
        }
    };

    factory.moveUp = function (self, index) {
        moveRow(self, index, index - 1, "UP");
    }

    factory.moveDown = function (self, index) {
        moveRow(self, index, index + 1, "DOWN");
    }

    factory.moveToEnd = function (self, index, destination, direction) {
        moveRow(self, index, destination, direction);
    }

    factory.addRow = function (self) {
        self.tempTableData = [];
        angular.copy(self.table.data, self.tempTableData);
        for (var index = 0; index < self.numberOfRowsAdd; index++) {
            var objString = '';
            objString += '{';
            angular.forEach(self.table.structure, function (item, itemkey) {
                objString += '"' + item.label + '":"",'
            });
            objString = objString.substring(0, objString.length - 1);
            objString += '}';

            var jsonObj = JSON.parse(objString);
            self.table.data.push(jsonObj);

        }
        self.dataOperationMode = "ADD";
        self.editmode = true;
        $rootScope.$broadcast("set-is-editable", true);
        self.operationCode = PerformedOperation.ADD;
    };

    factory.cancelChanges = function (self) {
        self.editmode = false;
        $rootScope.$broadcast("set-is-editable", false);
        if (self.dataOperationMode == "ADD") {
            self.table.data = self.tempTableData;
        } else {
            self.dataOperationMode = "EDIT";
            self.table.data = self.copytableData;
        }
    }

    function getTemplate(tableType) {
        switch (tableType) {
            case "spreadSheetTable":
                return 'app/modules/ReportAuthoring/directives/tableHistory/spreadSheetTableHistoryView.html';
                break;
            case "horizontalTable":
                return 'app/modules/ReportAuthoring/directives/tableHistory/horizontalTableHistoryView.html';
                break;
            case "verticalTable":
                return 'app/modules/ReportAuthoring/directives/tableHistory/verticalTableHistoryView.html';
                break;
        }
    }

    function updateTable(self, tableData) {

        self.$parent.contentValues[tableData.propName].data = tableData.data;

        var data = {
            "formSectionData": [
                {
                    "sectionGUID": self.$parent.sectionGUID,
                    "sectionData": {
                        "operationCode": self.operationCode,
                        "contentValues": self.$parent.contentValues

                    }
               }]
        };


        return ReportAuthoringAPI.updateSection($stateParams.reportGuid, self.$parent.sectionGUID, data)

    }

    factory.importData = function (self, sectionNumber, $modalInstance) {


        var data = {
            propName: self.tableName,
            data: self.copyTable.data
        }

        var promise = updateImportEDRData(self, data);

        var pNotifySuccessTitle = 'Import Data';
        var pNotifyErrorTitle = 'Problem import data';
        var pNotifySuccessMsg = 'The EDR XML Data has been successfully imported.</br>Table in section <strong>' + sectionNumber + '</strong> saved.';
        var pNotifyErrorMsg = 'There was a problem saving the table. Please try again.';

        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = promise;

        promise.then(function () {

            //self.editmode = false;
            self.table.data = self.copyTable.data


            factory.showPNotifyMessage(pNotifySuccessTitle, pNotifySuccessMsg, 'success');
            if ($modalInstance) {
                self.$parent.contentValues[self.tableName].data = self.copyTable.data;
                $modalInstance.close();
            }
            return true;
        }, function (error) {
            factory.showPNotifyMessage(pNotifyErrorTitle, pNotifyErrorMsg, 'error');
            return false;
        });


    };

    function updateImportEDRData(self, tableData) {

        // self.$parent.contentValues[tableData.propName].data = tableData.data;

        var copycontentValues = angular.copy(self.$parent.contentValues);

        copycontentValues[tableData.propName].data = tableData.data;

        var data = {
            "formSectionData": [
                {
                    "sectionGUID": self.$parent.sectionGUID,
                    "sectionData": {
                        "operationCode": self.operationCode,
                        "contentValues": copycontentValues

                    }
               }]
        };


        return ReportAuthoringAPI.updateSection($stateParams.reportGuid, self.$parent.sectionGUID, data)

    }


    factory.confirmImportData = function (scope) {
        //$scope.responseAlert = false;
        var modalInstance = $modal.open({
            //templateUrl: 'ConfirmImportData.html',
            template: function (elem, attr) {
                var html = '';
                html += "<div class='modal-header'>";
                html += "<h4 class='modal-title'>Confirmation</div>";;
                html += "</div>";
                html += "<div class='modal-body'>";
                html += "<p class='alert alert-danger'> Are you sure want to import the EDR data into your table?</br> Click 'Ok' to import it.</p>";
                html += "</div>";
                html += "<div class='modal-footer'>";
                html += "<button ng-click='ok()' class=' btn btn-primary'> Ok </button>";
                html += "<button ng-click='cancel()' class='btn btn-default'> Cancel </button>";
                html += "</div>";
                return html;
            },
            controller: confirmImportDataController,
            size: 0,
            resolve: {

            }
        });

        modalInstance.result.then(function (result) {
            if (result) {
                scope.importData();
            }
        });
    }

    function confirmImportDataController($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close(true);
        }

        $scope.cancel = function () {
            $modalInstance.close(false);
        }
    }

    function htmlToPlaintext(text) {
        var updatedObj = {};
        for (var key in text) {
            updatedObj[key] = text[key] ? String(text[key]).replace(/<[^>]+>/gm, '').trim() : text[key];
        }
        return updatedObj;
    }

    factory.importHistoricalSummaryData = function (copySectionData, data, tableName) {
              
        angular.forEach(data, function (tableRow, index) {
            var objectsAreSame = false;
            angular.forEach(copySectionData[tableName].data, function (copyTableRow, index) {
                if (HelperService.compareObjFunction(tableRow, htmlToPlaintext(copyTableRow))) {
                    objectsAreSame = true;
                }
            });
            
            if (!objectsAreSame) {
                copySectionData[tableName].data.push(tableRow);
            }
        });
    }

    return factory;
}])


angular.module('ReportAuthoring').factory('getScopeService', function () {
    var GIScopeArray = [];
    var GiFormScope;

    var factory = {};
    factory.setGIScope = function (self) {
        GIScopeArray.push(self);
    }

    factory.getGIScope = function () {
        return GIScopeArray;
    }

    factory.setGiFormScope = function (giFormScope) {
        GiFormScope = giFormScope;
    }

    factory.getGiFormScope = function () {
        return GiFormScope;
    }
    return factory;
});
