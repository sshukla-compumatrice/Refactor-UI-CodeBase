angular.module('TransmittalLetterSetup').controller('TransmittalLetterSetupCtrl', ['$scope', '$modal', '$compile', 'ReportOutputSetupAPI', 'ReportOutputSetupAPIConstants', '$window', function ($scope, $modal, $compile, ReportOutputSetupAPI, ReportOutputSetupAPIConstants, $window) {

    // global controller var 
    var self = this;
    // parent object
    var setUpParent = self.setupProperties = {};

  
    self.ouputSetupType = ReportOutputSetupAPIConstants.OUTPUTSETUP_TYPE.TransmittalLetter;
    
    setUpParent.reportSection = {
        coll: [],
        selected: null
    };

    self.showDisplayMsg = function (msg, type) {
        self.serviceResponseAlert = true;
        self.serviceResponseText = msg;
        self.msgType = 'alert-' + (type || 'danger');
    }

    var repSetupToolsController = function ($scope, $modalInstance, selectedReportOutputSetupId, selectedReportOutputSetup, companyId, reportColl) {
        $scope.cloned = angular.copy(selectedReportOutputSetup);
        $scope.reportColl = reportColl;

        $scope.deleteReport = function () {
            var data = {
                "reportOutputSetup": $scope.cloned
            }
            var deleteReportPromise = ReportOutputSetupAPI.delete(selectedReportOutputSetupId, data);
            deleteReportPromise.then(function (resp) {
                // console.log("11111111111: "+JSON.stringify(setUpParent.reportSection.coll));
                for (var i = 0; i < setUpParent.reportSection.coll.length; i++) {

                    if (selectedReportOutputSetupId == setUpParent.reportSection.coll[i].transmittalSetupID) {

                        setUpParent.reportSection.coll.splice(i, 1);


                        setUpParent.reportSection.setupReady = false;
                    }
                }
                if (setUpParent.reportSection.coll.length < 1) {
                    self.showDisplayMsg('There are no transmittal letter for this company', 'danger');

                } else {
                    self.showDisplayMsg('Transmittal letter deleted successfully', 'success');
                }
                $modalInstance.close();
            }, function (error) {
                self.showDisplayMsg(error);
            });
        }

        $scope.renameReport = function (form) {
            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }
            var updateReportPromise = ReportOutputSetupAPI.put(selectedReportOutputSetupId, $scope.cloned);
            updateReportPromise.then(function (resp) {
                self.showDisplayMsg('Transmittal letter renamed successfully', 'success');
                $modalInstance.close();
            }, function (error) {
                self.showDisplayMsg(error);
            });
        }

        $scope.duplicate = function (form) {
            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }

            switch (this.copyToAction) {
            case "Existing":

                $scope.cloneReport.apply(this);
                //$scope.cloneReport();
                break;
            case "New":
                $scope.createReport.apply(this);
                break;
            }
        }

        $scope.createReport = function () {
            var post = {
                "transmittalSetupID": selectedReportOutputSetupId,
                "companyID": companyId,
                "name": this.toCreateReport
            }
            var updateReportPromise = ReportOutputSetupAPI.post(post)
            updateReportPromise.then(function (resp) {
                self.showDisplayMsg('Transmittal letter duplicated successfully', 'success');
                $modalInstance.close();
            }, function (error) {
                self.showDisplayMsg(error);
            });
        }

        $scope.cloneReport = function () {
            var copyToReport = this.copyToReport;
            var copyFrom = this.report;
            if (copyToReport.transmittalSetupID == copyFrom.transmittalSetupID) {
                this.duplicateError = "Copy from and copy to reports can't be same. Please select two different reports.";

                return;
            }
            var putData = {
                "fromTransmittalSetupID": copyFrom.transmittalSetupID,
                "name": copyToReport.name,
                "cssData": copyToReport.cssData,
                "cssJson": copyToReport.cssJson,
                "jsonData": copyToReport.jsonData
            };
            var updateReportPromise = ReportOutputSetupAPI.put(copyToReport.transmittalSetupID, putData);
            updateReportPromise.then(function (resp) {
                self.showDisplayMsg('Report output duplicated successfully', 'success');
                $modalInstance.close();
            }, function (error) {
                self.showDisplayMsg(error);
            });
        }


        $scope.CancelDelete = function () {

            $modalInstance.close()
        }

    }

    // general action
    var Action = function (name) {
        this.name = name;
        this.selected = false;
    };
    Action.prototype.cancel = function () {
        this.selected = false;
    }
    Action.prototype.controller = repSetupToolsController;

    /*var deleteReportController = function($scope, $modalInstance, selectedReportOutputSetupId, selectedReportOutputSetup) {
        $scope.deleteReport = function() {
            var deleteReportPromise = ReportOutputSetupAPI.delete(selectedReportOutputSetupId);
            deleteReportPromise.then(function(resp){
                $modalInstance.close();
            }, function(error){
                alert(error);
            })
        }
        $scope.CancelDelete = function() {
            $modalInstance.close()
        }
    }
    var renameReportController = function($scope, $modalInstance, selectedReportOutputSetupId, selectedReportOutputSetup) {
        $scope.renameReport = function() {
            var deleteReportPromise = ReportOutputSetupAPI.delete(selectedReportOutputSetupId);
            deleteReportPromise.then(function(resp){
                $modalInstance.close();
            }, function(error){
                alert(error);
            })
        }
        $scope.CancelDelete = function() {
            $modalInstance.close()
        }
    }
    var duplicateReportController = function($scope, $modalInstance, selectedReportOutputSetupId, selectedReportOutputSetup) {
        $scope.deleteReport = function() {
            var deleteReportPromise = ReportOutputSetupAPI.delete(selectedReportOutputSetupId);
            deleteReportPromise.then(function(resp){
                $modalInstance.close();
            }, function(error){
                alert(error);
            })
        }
        $scope.CancelDelete = function() {
            $modalInstance.close()
        }
    }*/




    var deleteAction = new Action('Delete');
  
    deleteAction.url = 'transDelete.html';
    //deleteAction.controller = deleteReportController;

    var renameAction = new Action('Rename');
    renameAction.url = 'transRename.html';
    //renameAction.controller = renameReportController;

    var duplicateAction = new Action('Duplicate');
    duplicateAction.url = 'transDuplicate.html';
    //duplicateAction.controller = duplicateReportController;

    var copyToAction = new Action('Copy TO');


    // specific actions if any operation overridden
    var CopyFromAction = function () {
        Action.call(this, 'Copy FROM');
        this.report = null;
    };
    CopyFromAction.prototype = Object.create(Action.prototype)
    CopyFromAction.prototype.constructor = copyFromAction;
    CopyFromAction.prototype.cancel = function () {
        // overridden functionality
        if (this.report) {
            this.report = null;
        }
        // base operation
        Action.prototype.cancel.apply(this);
    }
    var copyFromAction = new CopyFromAction();


    setUpParent.toolOptions = {
        actions: {
            delete: deleteAction,
            rename: renameAction,
            copyFrom: copyFromAction,
            copyTo: copyToAction,
            duplicate: duplicateAction
                /*delete: {
                    name: 'Delete',
                    selected: false
                },
                rename: {
                    name: 'Rename',
                    selected: false
                },
                copyFrom: {
                    name: 'Copy FROM',
                    selected: false,
                    report: null,
                    cancel: function() {
                        setUpParent.toolOptions.actions.copyFrom.report = null;
                        setUpParent.toolOptions.actions.copyFrom.selected = false;
                    }
                },
                copyTo: {
                    name: 'Copy TO',
                    selected: false
                }*/
        },
        currentSelected: null,
        selectAction: function (action) {

            var popupAction = setUpParent.toolOptions.actions[action];
            OpenPopup(popupAction);
            var actionColl = setUpParent.toolOptions.actions;
            //if (action && actionColl.hasOwnProperty(action)) {
            //    var actionProp = actionColl[action];
            //    var current = setUpParent.toolOptions.currentSelected;

            //    if (current) {
            //        current.selected = false;
            //    }

            //    actionProp.selected = true;
            //    setUpParent.toolOptions.currentSelected = actionProp;
            //}
        }
    };

    // tool options dependent on report selection
    setUpParent.reportSectionChanged = function () {
         
        console.log("selectionChanged");
        /*console.log("selectionChanged" + setUpParent.toolOptions.currentSelected);
        if (setUpParent.toolOptions.currentSelected) {
            setUpParent.toolOptions.currentSelected.selected = false;
        }*/

        //setUpParent.reportSection.selected

        var selectedReport = setUpParent.reportSection.selected;
        /*var selectedReportId = selectedReport.reportOutputSetupID;
        clearReportData();
        getReportOutputSetup(selectedReportId);*/
        setReportData(selectedReport);
       $scope.transmittalLetterSetupName=selectedReport.name;
    };

    var getReportOutputSetup = function (transmittalSetupID) {
        var getReportOutputSetupPromise = ReportOutputSetupAPI.get(transmittalSetupID);
        getReportOutputSetupPromise.then(function (report) {
            console.log("11111: "+report);
            setReportData(report);
            setUpParent.reportSection.setupReady = true;
        });
    }
    var setReportData = function (data) {
        if (data) {
            var cssVal = data.cssJson;
            var jsonVal = data.jsonData;
            self.cssData = JSON.parse(cssVal);
            self.jsonData = JSON.parse(jsonVal);
        } else {
            self.cssData = null;
            self.jsonData = null;
        }
        setUpParent.reportSection.setupReady = true;
    }
    var clearReportData = function () {
        setUpParent.reportSection.setupReady = false;
    }
    var clearReport = function () {
        self.serviceResponseAlert = false;
        setUpParent.reportSection.selected = null;
        setUpParent.reportSection.setupReady = false;
        setUpParent.reportSection.coll = null;
    }
    self.selectedCompanyChanged = function () {
        clearReport();
      
        var getListPromise = ReportOutputSetupAPI.getList(self.selectedCompanyId, self.ouputSetupType);
  

        getListPromise.then(function (reportOutputSetupList) {
          
            if (reportOutputSetupList.length < 1) {
                self.showDisplayMsg('There are no report setup for this company', 'danger');

            }
              console.log("111111: "+JSON.stringify(reportOutputSetupList));
            setUpParent.reportSection.coll = reportOutputSetupList;
        }, function (error) {

        });
    }

    function OpenPopup(popupAction) {
        /*if (action == 'delete') {
            var url = 'repSetupDelete.html';
        } else if (action == 'rename') {
            var url = 'repSetupRename.html';
        } else if (action == 'copyFrom') {
            var url = 'repSetupCopyFrom.html';
        } else if (action == 'copyTo') {
            var url = 'repSetupCopyTo.html';
        } else if (action == 'duplicate') {
            var url = 'repSetupDuplicate.html';
        }*/
        var url = popupAction.url;
        var controller = popupAction.controller;

        var modalInstance = $modal.open({
            templateUrl: url,
            scope: $scope,
            controller: controller,
            size: 0,
            resolve: {
                selectedReportOutputSetupId: function () {
                    var selectedReport = setUpParent.reportSection.selected;
                    return selectedReport.transmittalSetupID;
                },
                selectedReportOutputSetup: function () {
                    return setUpParent.reportSection.selected;
                },
                companyId: function () {
                    return self.selectedCompanyId
                },
                reportColl: function () {
                    return setUpParent.reportSection.coll;
                }
            }
        });

        modalInstance.result.then(function () {

        });
    }


    // data-model to bind
    self.cssData = {
        'global': {},
        'global-img-caption': {},

        'pca-cost-table-header': {},
        'pca-cost-table-header-text': {},

        'page-header-settings-left': {},
        'page-header-settings-center': {},
        'page-header-settings-right': {},

        'report-section-settings-section-header': {},
        'report-section-settings-section-header-below': {},
        'report-section-settings-sub-section-header': {},
        'report-section-settings-sub-section-header-below': {},
        'report-section-settings-sub-sub-section-header': {},
        'report-section-settings-sub-sub-section-header-below': {},
        'report-section-settings-narrative-section': {},

        'report-table-settings': {},
        'report-table-settings-table-header': {},
        'report-table-settings-table-col-header': {},
        'report-table-settings-table-data': {},

        'page-footer-settings-left': {},
        'page-footer-settings-center': {},
        'page-footer-settings-right': {}
    };
    self.jsonData = {
        'global': {},
        'pca': {},
        'pageHeaderSettings': {
            'left': {},
            'center': {},
            'right': {}
        },
        'reportSectionSettings': {
            'sectionHeader': {},
            'subSectionHeader': {},
            'subSubSectionHeader': {},
            'narrativeSection': {}
        },
        'reportTableSettings': {
            'tableHeader': {},
            'tableColHeader': {},
            'tableData': {}
        },
        'pageFooterSettings': {
            'left': {},
            'center': {},
            'right': {}
        }
    };

    self.submitData = {};
    self.save = function () {
        /*var global = self.global;
        var globalStrVal = '.global ' + JSON.stringify(global);
        var globalClass = globalStrVal.replace(/[\"\\]/g, "");
        var styleFormatted = "<style>" + globalClass + "</style>";*/

        var clStr = "";
        var allCls = "";
        for (var propCl in self.cssData) {
            // css class in json format
            var val = angular.copy(self.cssData[propCl]);

            /*if (propCl == 'page-header-settings-left' || propCl == 'page-header-settings-right' || propCl == 'page-header-settings-center') */
            if (val.style && val.style.length) {
                for (var props in val.style) {
                    var selected = val.style[props];
                    if (selected == 'B') {
                        val['font-weight'] = 'bold';
                    } else if (selected == 'I') {
                        val['font-style'] = 'italic';
                    } else if (selected == 'U') {
                        val['text-decoration'] = 'underline';
                    }
                }
                delete val.style;
            }

            // all css classes to be applied
            allCls = allCls + " " + propCl;

            // css class name
            var clName = "." + propCl;

            var formattedToCss = formatJsonToCss(val);
            var cssCl = clName + formattedToCss;
            var cssClassesSeparator = " ";
            clStr = clStr + cssCl + cssClassesSeparator;

        }

        self.submitData.jsonData = JSON.stringify(self.jsonData);
        self.submitData.cssJson = JSON.stringify(self.cssData);
        self.submitData.cssData = clStr;
        self.submitData.name = setUpParent.reportSection.selected.name;

        console.log(self.submitData);

        var transmittalSetupID = setUpParent.reportSection.selected.transmittalSetupID;
        ReportOutputSetupAPI.put(transmittalSetupID, self.submitData).then(function (result) {
            $window.scrollTo(0, 0);
            self.showDisplayMsg('Transmittal letter updated successfully', 'success');
        }, function (error) {
            self.showDisplayMsg(error);
        });

        var styleFormatted = "<style>" + clStr + "</style>";
        var compiled = $compile(styleFormatted)($scope);
        var element = angular.element('#applied');
        element.append(compiled);
        element.addClass(allCls);
    }

    function formatJsonToCss(jsonData) {
        // stringify json object
        var stringified = JSON.stringify(jsonData);
        // escape characters
        var escaped = stringified.replace(/[\"\\]/g, "");
        // replace comma (default json stringify property separator) with semicolon
        // NOTE: this is assuming that no property value will have comma
        var formatted = escaped.replace(/,/g, ';');

        return formatted;
    }

}])