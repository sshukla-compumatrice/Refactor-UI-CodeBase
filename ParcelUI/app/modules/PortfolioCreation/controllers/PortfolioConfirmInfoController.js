 angular.module('PortfolioCreation').controller('PortfolioConfirmInfoCtrl', ['$scope', '$modal', '$filter', '$timeout', function ($scope, $modal, $filter, $timeout) {

     $scope.portfolio.currentSection = $scope.portfolio.sectionCollection.ConfirmProjectInformation;
     var self = this;


     $("#ulnavigation .active").removeClass('active');
     $("#ulnavigation #ConfirmProjectInformation").addClass('active');

     self.projectInfo = {};
     self.editProjectInfo = {};
     self.tableArr = [];
     var loadData = function () {
         var portfolioObj = $scope.portfolio;
         var loadedData = portfolioObj.loadData;
         var data = angular.copy(portfolioObj.project);

         if (data) {
             self.projectInfo.name = data.name;
             self.projectInfo.draftDueDate = data.draftDueDate.split(' ')[0];
             self.projectInfo.finalDueDate = data.finalDueDate.split(' ')[0];
             self.projectInfo.comments = data.comments;
             self.projectInfo.client = data.client;
             self.editProjectInfo = angular.copy(self.projectInfo);

             var locations = data.locations;

             for (var i = 0; i < locations.length; i++) {
                 var loc = locations[i];
                 loc.reportsArray = [];
                 loc.contactObj = loc.siteContact;
                 loc.locationObj = {
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

                         loc.reportsArray.push(temp);
                     }
                     delete loc.reports;
                 }

                 self.tableArr.push(loc);
             }
         }
     };

     loadData();

     self.resetProjectInfo = function () {
         self.tableArr = [];
         loadData();
         //self.editProjectInfo = angular.copy(self.projectInfo);
     }

     self.updateProjectInfo = function () {
         var current = $scope.portfolio.getSubmitData;

         $scope.portfolio.getSubmitData = function () {
             return self.editProjectInfo;
         }
         $scope.portfolio.Submit();

         $scope.portfolio.getSubmitData = current;
     }


     self.deleteSite = function (siteRowIndex) {
         self.tableArr.splice(siteRowIndex, 1);
     }

     self.deleteReport = function (siteRowIndex, reportRowIndex) {
         /*var data = $scope.portfolio.project;
         data.locations[locationIndex].reportTemplates.splice(reportTemplateIndex, 1);*/

         angular.forEach(self.tableArr, function (site, siteIndex) {
             if (siteIndex == siteRowIndex) {
                 site.reportsArray.splice(reportRowIndex, 1);
             }
         });
     }


     //Site information edit 
     self.editSiteInfo = function (row, rowIndex) {
         openEditSiteInfoPopup(row, rowIndex);
     }

     function openEditSiteInfoPopup(data, rowIndex) {

         $scope.modalObjContainer = {
             data: angular.copy(data),
             rowIndex: rowIndex,
             filterByContains: $scope.portfolio.filterByContains,
             edited: false
         };

         var modalInstance = $modal.open({
             templateUrl: 'editSiteInfo.html',
             scope: $scope,
             controller: editSiteInfoCtrl,
             size: 0
         });

         modalInstance.result.then(function () {

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

     var editSiteInfoCtrl = function ($scope, $modalInstance) {
         var portfolio = $scope.portfolio;
         var loadedData = $scope.portfolio.loadData;
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

         $scope.Cancel = function () {
             $modalInstance.close();
         }

         $scope.showDisplayMsg = function (msg) {
             $scope.serviceResponseAlert = true;
             $scope.serviceResponseText = msg;
             $scope.msgType = 'alert-danger';
         }
         $scope.EditSiteInfo = function (form) {

             if (!form || form.$invalid) {
                 $scope.showDisplayMsg('Invalid Form Submission');
                 var inputElements = document.getElementsByName(form.$name);
                 angular.element(inputElements).find(':input').trigger('blur');

             } else {
                 $scope.modalObjContainer.edited = true;

                 // make service call
                 // and update model of parent
                 $modalInstance.close();
             }
         }
     }



     //Report information edit
     self.editReportInfo = function (row, siterowIndex, rowIndex) {
         openEditReportInfoPopup(row, siterowIndex, rowIndex);
     }

     function openEditReportInfoPopup(data, siterowIndex, rowIndex) {
         $scope.modalObjContainer = {
             data: angular.copy(data),
             rowIndex: rowIndex,
             siterowIndex: siterowIndex,
             filterByContains: $scope.portfolio.filterByContains,
             edited: false
         };

         var modalInstance = $modal.open({
             templateUrl: 'editReportInfo.html',
             scope: $scope,
             controller: editReportInfoCtrl,
             size: 0
         });

         modalInstance.result.then(function () {

             if ($scope.modalObjContainer && $scope.modalObjContainer.edited) {
                 /*// load fresh data
                 loadData();*/


                 var editedData = $scope.modalObjContainer.data;
                 var rowIndex = $scope.modalObjContainer.rowIndex;
                 var siterowIndex = $scope.modalObjContainer.siterowIndex;

                 self.tableArr[siterowIndex].reportsArray[rowIndex] = angular.copy(editedData);

                 /*var row = self.tableArr[rowIndex];
                
                 row.fee = editedData.fee;
                 row.locationObj = editedData.locationObj;
                 row.contactObj = editedData.contactObj;
                 row.templateObj = editedData.templateObj;
                 row.consultantObj = editedData.consultantObj;*/
             }
         });
     }

     var editReportInfoCtrl = function ($scope, $modalInstance) {
         var portfolio = $scope.portfolio;
         var loadedData = $scope.portfolio.loadData;
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

         $scope.Cancel = function () {
             $modalInstance.close();
         }

         $scope.EditReportInfo = function (form) {
             $scope.modalObjContainer.edited = true;

             // make service call
             // and update model of parent
             $modalInstance.close();
         }
     }



     var main = $scope.portfolio;
     main.getSubmitData = function () {
         var arr = self.tableArr;

         var toSubmitLocationsData = [];
         if (arr && arr.length) {
             for (var i = 0; i < arr.length; i++) {
                 var row = arr[i];
                 var site = row.locationObj;
                 var contact = row.contactObj;

                 // var toSubmitSite = null;
                 /*  for (var j = 0; j < toSubmitLocationsData.length; j++) {
                       var loc = toSubmitLocationsData[j];
                       if (loc.propertyNumber == site.propertyNumber) {
                           toSubmitSite = loc;
                           break;
                       }
                   }*/
                 //if (!toSubmitSite) {
                 var toSubmitSite = site;
                 toSubmitSite.siteContact = contact;
                 toSubmitSite.reports = [];
                 toSubmitLocationsData.push(toSubmitSite);
                 // }
                 for (var reportIndex = 0; reportIndex < row.reportsArray.length; reportIndex++) {


                     var template = row.reportsArray[reportIndex];
                     var report = angular.copy(template);

                     var consultant = report.consultantObj;
                     var library = report.libraryObj;
                     if (consultant && consultant.companyID) {
                         report.companyID = consultant.companyID;
                     }
                     if (library && library.libraryID) {
                         report.libraryID = library.libraryID;
                     }

                     var fee = report.fee;
                     var poNumber = report.poNumber;
                     var projectNo = report.projectNumber;
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
                     delete report.tableOfContent;

                     toSubmitSite.reports.push(report);
                 }
             }

             var data = angular.copy($scope.portfolio.project);

             // data.locations = toSubmitLocationsData;
             data.name = self.editProjectInfo.name;

             data.draftDueDate = $filter('date')(new Date(self.editProjectInfo.draftDueDate), "yyyy-MM-dd hh:mm:ss");
             data.finalDueDate = $filter('date')(new Date(self.editProjectInfo.finalDueDate), "yyyy-MM-dd hh:mm:ss");
             data.comments = self.editProjectInfo.comments;
             data.client = self.editProjectInfo.client;

             return data;
         }
     }
     main.clearErrorDisplay = function () {
         self.serviceResponseAlert = false;
         self.serviceResponseText = "";
     }
     main.showServiceError = function (errorMsg) {
         self.serviceResponseAlert = true;
         self.responseType = 'danger';
         self.serviceResponseText = errorMsg;
     }


     $scope.open = {
         draftDate: false,
         finalDate: false,
     };

     // Disable weekend selection
     $scope.disabled = function (date, mode) {
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

     $scope.openCalendar = function (e, date) {
         e.preventDefault();
         e.stopPropagation();

         $scope.open[date] = true;
     };

     // watch date4 and date5 to calculate difference
     $scope.$watch(function () {
         return $scope.dates;
     }, function () {

     }, true);






     $scope.dropDown_click = function () {

         var height = $('#prjConfirmDiv').prop("scrollHeight") + 40;
         $timeout(function () {
             $("body").animate({
                 scrollTop: height
             }, "slow");
             $("prjConfirmDiv").animate({
                 scrollTop: height
             }, "slow");
         }, 7000);
     };

 }]);
