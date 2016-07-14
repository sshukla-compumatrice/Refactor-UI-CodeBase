angular.module('LenderPortfolioCreation').controller('LenderPortfolioConfirmInfoCtrl', ['$scope', '$state', '$modal', '$filter', function($scope, $state, $modal, $filter) {

    var self = this;
    var main = $scope.lenderPortfolio;

    self.projectInfo = {};
    self.editProjectInfo = {};
    self.tableArr = [];

    var loadData = function() {
        var portfolioObj = main;
        var loadedData = portfolioObj.loadData;
        var data = portfolioObj.project;

        if (data) {
            self.projectInfo.name = data.name;
            self.projectInfo.draftDueDate = data.draftDueDate;
            self.projectInfo.finalDueDate = data.finalDueDate;
            self.projectInfo.comments = data.comments;
            self.projectInfo.client = data.client;
            self.editProjectInfo = angular.copy(self.projectInfo);

            var locations = data.locations;

            for (var i = 0; i < locations.length; i++) {
                var loc = locations[i];

                if (loc.reports) {
                    for (var j = 0; j < loc.reports.length; j++) {
                        var temp = loc.reports[j];

                        if (temp.templateID) {
                            var loadedTemplates = loadedData.templates;
                            for (var k = 0; k < loadedTemplates.length; k++) {
                                if (loadedTemplates[k].templateID == temp.templateID) {
                                    temp.templateObj = loadedTemplates[k];
                                    break;
                                }
                            }
                        }

                        if (temp.companyID) {
                            var loadedCompanies = loadedData.relatedCompanies;
                            for (var k = 0; k < loadedCompanies.length; k++) {
                                if (portfolioObj.filterCompanyBy(loadedCompanies[k], 'Consultant') && loadedCompanies[k].companyID == temp.companyID) {
                                    temp.consultantObj = loadedCompanies[k];
                                    break;
                                }
                            }
                        }

                        if (temp.libraryID) {
                            var loadedLibraries = loadedData.libraries;
                            for (var k = 0; k < loadedLibraries.length; k++) {
                                if (loadedLibraries[k].libraryID == temp.libraryID) {
                                    temp.libraryObj = loadedLibraries[k];
                                    break;
                                }
                            }
                        }

                        temp.contactObj = loc.siteContact;
                        temp.locationObj = {
                            name: loc.name,
                            propertyNumber: loc.propertyNumber,
                            address1: loc.address1,
                            address2: loc.address2,
                            city: loc.city,
                            state: loc.state,
                            zip: loc.zip,
                            propertyType: loc.propertyType,
                            county: loc.county,
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                            acreage: loc.acreage,
                            numBuildings: loc.numBuildings,
                            transactionType: loc.transactionType
                        };

                        self.tableArr.push(temp);
                    }
                }
            }
        }
    };

    loadData();


    self.resetProjectInfo = function() {
        self.editProjectInfo = angular.copy(self.projectInfo);
    }
    self.updateProjectInfo = function() {
        var current = main.getSubmitData;

        main.getSubmitData = function() {
            return self.editProjectInfo;
        }
        main.Submit();

        main.getSubmitData = current;
    }


    self.deleteReport = function(row, deleteSite) {
        var arr = self.tableArr;
        if (!deleteSite) {
            var pos = arr.indexOf(row);
            arr.splice(pos, 1);
        } else {
            var site = row.locationObj;
            var siteId = site.propertyNumber;

            var notToDeletRow = [];
            for (var i = 0; i < arr.length; i++) {
                var local = arr[i];
                var localSite = local.locationObj;
                var localSiteId = localSite.propertyNumber;
                if (localSiteId != siteId) {
                    notToDeletRow.push(local);
                }
            }
            self.tableArr = notToDeletRow;

        }
    }

    self.editSiteInfo = function(row, rowIndex) {
        openEditSiteInfoPopup(row, rowIndex);
    }

    function openEditSiteInfoPopup(data, rowIndex) {
        $scope.modalObjContainer = {
            data: angular.copy(data),
            rowIndex: rowIndex,
            filterByContains: main.filterByContains,
            edited: false
        };

        var modalInstance = $modal.open({
            templateUrl: 'editSiteInfo.html',
            scope: $scope,
            controller: editSiteInfoCtrl,
            size: 0
        });

        modalInstance.result.then(function() {

            if ($scope.modalObjContainer && $scope.modalObjContainer.edited) {
                /*// load fresh data
                loadData();*/

                var editedData = $scope.modalObjContainer.data;
                var rowIndex = $scope.modalObjContainer.rowIndex;

                self.tableArr[rowIndex] = angular.copy(editedData);
                /*var row = self.tableArr[rowIndex];
                
                row.fee = editedData.fee;
                row.locationObj = editedData.locationObj;
                row.contactObj = editedData.contactObj;
                row.templateObj = editedData.templateObj;
                row.consultantObj = editedData.consultantObj;*/
            }
        });
    }

    var editSiteInfoCtrl = function($scope, $modalInstance) {
        var portfolio = main;
        var loadedData = portfolio.loadData;
        var project = portfolio.project;

        if ($scope.modalObjContainer.data.templateObj)
            for (var i = 0; i < loadedData.templates.length; i++) {
                if ($scope.modalObjContainer.data.templateObj.templateID == loadedData.templates[i].templateID) {
                    $scope.modalObjContainer.data.templateObj = loadedData.templates[i];
                    break;
                }
            }


        if ($scope.modalObjContainer.data.libraryObj)
            for (var i = 0; i < loadedData.libraries.length; i++) {
                if ($scope.modalObjContainer.data.libraryObj.libraryID == loadedData.libraries[i].libraryID) {
                    $scope.modalObjContainer.data.libraryObj = loadedData.libraries[i];
                    break;
                }
            }
        if ($scope.modalObjContainer.data.consultantObj)
            for (var i = 0; i < loadedData.relatedCompanies.length; i++) {
                if ($scope.modalObjContainer.data.consultantObj.companyID == loadedData.relatedCompanies[i].companyID) {
                    $scope.modalObjContainer.data.consultantObj = loadedData.relatedCompanies[i];
                    break;
                }
            }

        $scope.cancel = function() {
            $modalInstance.close();
        }

        $scope.editSiteInfo = function() {
            $scope.modalObjContainer.edited = true;
            // make service call
            // and update model of parent
            $modalInstance.close();
        }
    }



    main.getSubmitData = function() {
        var arr = self.tableArr;

         var toSubmitLocationsData = [];
         if (arr && arr.length) {
             for (var i = 0; i < arr.length; i++) {
                 var row = arr[i];
                 var site = row.locationObj;
                 var contact = row.contactObj;
                 var consultant = row.consultantObj;
                 var template = row.templateObj;
                 var library = row.libraryObj;

                 var toSubmitSite = null;
                 for (var j = 0; j < toSubmitLocationsData.length; j++) {
                     var loc = toSubmitLocationsData[j];
                     if (loc.propertyNumber == site.propertyNumber) {
                         toSubmitSite = loc;
                         break;
                     }
                 }
                 if (!toSubmitSite) {
                     var toSubmitSite = site;
                     toSubmitSite.siteContact = contact;
                     toSubmitSite.reports = [];
                     toSubmitLocationsData.push(toSubmitSite);
                 }

                 var report = angular.copy(template);
                 if (consultant && consultant.companyID) {
                     report.companyID = consultant.companyID;
                 }
                 if (library && library.libraryID) {
                     report.libraryID = library.libraryID;
                 }

                 var fee = row.fee;
                 var poNumber = row.poNumber;
                 var projectNo = row.projectNumber;
                 report.fee = fee;
                 report.poNumber = poNumber;
                 report.projectNumber = projectNo;

                 report.taskedCompanyID = report.ownerCompanyID;
                 report.taskedCompanyGUID = report.ownerCompanyGUID;
                 // delete others properties
                 delete report.companyDefaultTemplate;
                 delete report.dashboard;
                 delete report.defaults;
                 delete report.description;
                 delete report.isMobile;
                 delete report.name;
                 delete report.ownerCompanyGUID;
                 delete report.ownerCompanyID;
                 delete report.reportType;
                 delete report.sections;
                 delete report.shortName;
                 delete report.templateVersion;
                 delete report.reportTypeValue;

                 toSubmitSite.reports.push(report);
             }

             var data = angular.copy(main.project);
             data.locations = toSubmitLocationsData;
             data.name = self.editProjectInfo.name;
             data.draftDueDate = $filter('date')(self.editProjectInfo.draftDueDate, "yyyy-mm-dd hh:mm:ss");
             data.finalDueDate = $filter('date')(self.editProjectInfo.finalDueDate, "yyyy-mm-dd hh:mm:ss");
             data.comments = self.editProjectInfo.comments;
             data.client = self.editProjectInfo.client;

             return data;
         }
    }
    main.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }


    $scope.open = {
        draftDate: false,
        finalDate: false,
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return (mode === 'day' && (new Date().toDateString() == date.toDateString()));
    };

    $scope.dateOptions = {
        showWeeks: false,
        startingDay: 1
    };

    $scope.timeOptions = {
        readonlyInput: true,
        showMeridian: false
    };

    $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
    };

    // watch date4 and date5 to calculate difference
    $scope.$watch(function() {
        return $scope.dates;
    }, function() {

    }, true);



}]);