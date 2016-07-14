angular.module('ReportAuthoring').controller('SetupController', ['$modal', '$timeout', '$scope', '$filter', '$modal', 'ReportOutputSetupAPI', 'DefaultLanguageLibraryAPI', 'ReportTemplatesAPI', 'BASEURL', 'ReportAuthoringAPI', '$stateParams', '$location', 'accountMgmtAPI', '$rootScope', '$state', 'GeneralInformationAPI','AuthFactory', 'globalValues', '$window', 'HelperService' , function ($modal, $timeout, $scope, $filter, $modal, ReportOutputSetupAPI, DefaultLanguageLibraryAPI, ReportTemplatesAPI, BASEURL, ReportAuthoringAPI, $stateParams, $location, accountMgmtAPI, $rootScope, $state, GeneralInformationAPI,AuthFactory, globalValues, $window, HelperService) {
    var self = this;
    self.reportID = 12;
    $scope.standardItemSuccess = "";
    $scope.standardItemDanger = "";
    $scope.showMessage = false;
    $scope.standardItemName = "";
    $scope.orderStatusUrl = "";
    $scope.projectGuid = "";
    $scope.accountGuid = "";
    $scope.projectName = "";
    $scope.isOrderAvailable = false;

    $scope.setupItemUpdateClass = "";
    $scope.setupItemUpdateStatus = false;
    $scope.setupItemUpdateText = "";

    $scope.standardItemUpdateClass = "";
    $scope.standardItemUpdateStatus = false;
    $scope.standardItemUpdateText = "";


    //setup items
    $scope.transmittalArr = [];
    $scope.reportCoverArr = [];
    $scope.tocArr = [];
    $scope.reportOutputSetupArr = [];


    //standard items
    $scope.dllArr = [];
    $scope.taskedCompanyArr = [];
    $scope.reportTemplateArr = [];


    $scope.setupBoard = {};
    $scope.standardBoard = {};
    $scope.projectNameLink = $scope.$parent.$parent.projectNameLink;
    
    $scope.standardItemsEdit = {
        taskedompany : true,
        reportTemplate : false,
        defaultLanguageLibrary : false,
        prepopulatedTableData : false
    };
    
    var flgupdateVersion = false;

    $scope.isDbOrder = false;
    $scope.portfolioOrderParamObj = {
        projectGuid: $state.params.projectGuid
    };

    init();

    function init() {
        var paramObj = {
            projectGuid: $state.params.projectGuid,
            reportGuid: $state.params.reportGuid,
            sectionGuid: $rootScope.giSectionGuid,
            siteID: $('#siteId').val()
        };
        $scope.GI_href = $state.href('generalInformation', paramObj);

        $scope.projectGuid = $stateParams.projectGuid;
        $scope.accountGuid = globalValues.currentUserGuid;
        $scope.projectName = "test proj";

        populateSetupStandardItemLists();
        setDefaults();
        getGeneralInfo();
    }

    function populateSetupStandardItemLists(companyId) {

        //get report transmittal list
        ReportAuthoringAPI.getReportOutputList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID'), 'TRANS_SET').then(function (transData) {
//            var transStructureSelect = {
//                value: "",
//                text: "-Select Transmittal Setup-"
//            }
//            $scope.transmittalArr.push(transStructureSelect);
            for (var i = 0; i < transData.length; i++) {
                var transStructure = {
                    value: transData[i].reportOutputSetupGUID,
                    text: transData[i].name
                }
                $scope.transmittalArr.push(transStructure);
            }


        }, function (error) {

        });

        //get report cover list
        ReportAuthoringAPI.getCoverPageList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID')).then(function (coverData) {
//            var coverStructureSelect = {
//                value: "",
//                text: "-Select Report Cover-"
//            }
//            $scope.reportCoverArr.push(coverStructureSelect);
            for (var i = 0; i < coverData.length; i++) {
                var coverStructure = {
                    value: coverData[i].coverPageGuid,
                    text: coverData[i].name
                }
                $scope.reportCoverArr.push(coverStructure);
            }


        }, function (error) {

        });

        //get report toc list
        ReportAuthoringAPI.getReportOutputList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID'), 'TOC_SET').then(function (tocData) {

//            var tocStructureSelect = {
//                value: "",
//                text: "-Select TOC Setup-"
//            }
//            $scope.tocArr.push(tocStructureSelect);
            for (var i = 0; i < tocData.length; i++) {
                var tocStructure = {
                    value: tocData[i].reportOutputSetupGUID,
                    text: tocData[i].name
                }
                $scope.tocArr.push(tocStructure);
            }


        }, function (error) {

        });

        //get report output setup list
        ReportAuthoringAPI.getReportOutputList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID'), 'ROS_SET').then(function (reportsData) {
//            var reportOutputSetupStructureSelect = {
//                value: "",
//                text: "-Select Report Output Setup-"
//            }
//            $scope.reportOutputSetupArr.push(reportOutputSetupStructureSelect);
            for (var i = 0; i < reportsData.length; i++) {
                var reportOutputSetupStructure = {
                    value: reportsData[i].reportOutputSetupGUID,
                    text: reportsData[i].name
                }
                $scope.reportOutputSetupArr.push(reportOutputSetupStructure);
            }


        }, function (error) {

        });


        //get tasked companies

        accountMgmtAPI.getCompany().then(function (taskedCompanies) {
//            var companyStructureSelect = {
//                value: "",
//                text: "-Select Tasked Company-"
//            }
//            $scope.taskedCompanyArr.push(companyStructureSelect);
            for (var i = 0; i < taskedCompanies.companies.length; i++) {
                var companyStructure = {
                    value: taskedCompanies.companies[i].companyGUID,
                    text: taskedCompanies.companies[i].name
                }

                $scope.taskedCompanyArr.push(companyStructure);
            }

        }, function (error) {

        });

        //get report templates

        ReportTemplatesAPI.getTemplateList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID')).then(function (templates) {
//            var templateStructureSelect = {
//                value: "",
//                text: "-Select Report Template-"
//            }
//            $scope.reportTemplateArr.push(templateStructureSelect);
            for (var i = 0; i < templates.templates.length; i++) {
                var templateStructure = {
                    value: templates.templates[i].templateGUID,
                    text: templates.templates[i].name
                }

                $scope.reportTemplateArr.push(templateStructure);
            }

        }, function (error) {

        });

        //get report dll list
     
        DefaultLanguageLibraryAPI.getDLLList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID')).then(function (dllData) {
//            var dllStructureSelect = {
//                value: "",
//                text: "-Select Default Language Library-"
//            }
//            $scope.dllArr.push(dllStructureSelect);
            for (var i = 0; i < dllData.libraries.length; i++) {
                var dllStructure = {
                    value: dllData.libraries[i].libraryGUID,
                    text: dllData.libraries[i].name
                }
                $scope.dllArr.push(dllStructure);
            }


        }, function (error) {

        });






    }

    function setDefaults() {
        //change report GUID later,there is no data in db for other reports
        ReportAuthoringAPI.getSetupDefaults($stateParams.reportGuid).then(function (defaults) {

          

            $scope.prePopulatedDataText = defaults.prepopulatedTableData;
            $scope.setupBoard = {
                selTransmittalLetter: defaults.defaults.transmittalSetupGUID ? defaults.defaults.transmittalSetupGUID : "",
                selReportCover: defaults.defaults.coverPageGUID ? defaults.defaults.coverPageGUID : "",
                selTOC: defaults.defaults.tocSetupGUID ? defaults.defaults.tocSetupGUID : "",
                selReportOutputSetup: defaults.defaults.reportOutputSetupGUID ? defaults.defaults.reportOutputSetupGUID : ""
            };
            $scope.standardBoard = {
                selTaskedCompany: defaults.reportDetails.taskedCompanyGUID ? defaults.reportDetails.taskedCompanyGUID : "",
                selReportTemplate: defaults.reportTemplate.templateGUID ? defaults.reportTemplate.templateGUID : "",
                selDLL: defaults.defaults.languageLibraryGUID ? defaults.defaults.languageLibraryGUID : "",
                selPrepopulatedTableData: 1
            };
            
          setListValToDefault(defaults);
                     
            

        }, function (error) {

        });
    }

    function setListValToDefault(defaults)
    {
         // Transmittal Letter
            var selectedTL = $filter('filter')($scope.transmittalArr, {

                value: defaults.defaults.transmittalSetupGUID
            });
           if(selectedTL.length == 0)
           {
                $scope.setupBoard.selTransmittalLetter="";
           }
        // Transmittal Letter
        
        // Report Cover
            var selectedRC = $filter('filter')($scope.reportCoverArr, {

                value: defaults.defaults.coverPageGUID
            });
           if(selectedRC.length == 0)
           {
                $scope.setupBoard.selReportCover="";
           }
        // Report Cover
        
          // TOC
            var selectedTOC = $filter('filter')($scope.tocArr, {

                value: defaults.defaults.tocSetupGUID
            });
           if(selectedTOC.length == 0)
           {
                $scope.setupBoard.selTOC="";
           }
        // TOC
        
           // ROS
            var selectedROS = $filter('filter')($scope.reportOutputSetupArr, {

                value: defaults.defaults.reportOutputSetupGUID
            });
           if(selectedROS.length == 0)
           {
                $scope.setupBoard.selReportOutputSetup="";
           }
        // ROS
      
        
        // Tasked Company
        var selectedTC = $filter('filter')($scope.taskedCompanyArr, {

                value: defaults.reportDetails.taskedCompanyGUID
            });
           if(selectedTC.length == 0)
           {
                $scope.standardBoard.selTaskedCompany="";
           }
        // Tasked Company
        
        // Report Template
            var selectedReportTemplate = $filter('filter')($scope.reportTemplateArr, {

                value: defaults.reportTemplate.templateGUID
            });
           if(selectedReportTemplate.length == 0)
           {
                $scope.standardBoard.selReportTemplate="";
           }
        // Report Template
        
         // DLL
            var selectedLL = $filter('filter')($scope.dllArr, {

                value: defaults.defaults.languageLibraryGUID
            });
           if(selectedLL.length == 0)
           {
                $scope.standardBoard.selDLL="";
           }
        // DLL
        
        
        
    }
    
    function getGeneralInfo() {
        GeneralInformationAPI.get($state.params.reportGuid, $rootScope.giSectionGuid).then(function (data) {
            $scope.isDbOrder = data.generalInformation.isOrderDatabase;
        });
    }

    $scope.showTransmittalLetter = function () {
      
        var selected = $filter('filter')($scope.transmittalArr, {

            value: $scope.setupBoard.selTransmittalLetter
        });
        
        return ($scope.setupBoard.selTransmittalLetter && selected.length) ? selected[0].text : 'Not set';
        
    };

    $scope.showReportCover = function () {

        var selected = $filter('filter')($scope.reportCoverArr, {

            value: $scope.setupBoard.selReportCover
        });

        return ($scope.setupBoard.selReportCover && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showTOC = function () {

        var selected = $filter('filter')($scope.tocArr, {

            value: $scope.setupBoard.selTOC
        });

        return ($scope.setupBoard.selTOC && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showReportStructure = function () {

        var selected = $filter('filter')($scope.reportOutputSetupArr, {

            value: $scope.setupBoard.selReportOutputSetup
        });

        return ($scope.setupBoard.selReportOutputSetup && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showTaskedCompany = function () {

        var selected = $filter('filter')($scope.taskedCompanyArr, {

            value: $scope.standardBoard.selTaskedCompany
        });

        return ($scope.standardBoard.selTaskedCompany && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showReportTemplate = function () {

        var selected = $filter('filter')($scope.reportTemplateArr, {

            value: $scope.standardBoard.selReportTemplate
        });

        return ($scope.standardBoard.selReportTemplate && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showDLL = function () {

        var selected = $filter('filter')($scope.dllArr, {

            value: $scope.standardBoard.selDLL
        });

        return ($scope.standardBoard.selDLL && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.saveEditable = function (form) {
        // console.log("1111: " + $scope.setupBoard.selTransmittalLetter);
        //  console.log("2222: " + $scope.setupBoard.selTransmittalLetter);
        // form.$cancel();
    }

    /*$scope.cancelEditable = function (form) {
        $scope.standardItemSuccess = "";
        $scope.standardItemDanger = "";
        $scope.showMessage = false;
    }*/
    /*$scope.standardItemClick = function (standardItemVal) {
        $scope.showMessage = true;
        displayMessage(standardItemVal);


    }*/

   /* function displayMessage(standardItemVal) {

        if (standardItemVal == "taskedCompany") {
            $scope.standardItemSuccess = "The company tasked with this project.";
            $scope.standardItemName = "Tasked Company :";
        } else if (standardItemVal == "reportTemplate") {
            $scope.standardItemSuccess = "The template is the structure of the report. It includes the report sections and tables. If you choose to update, all report sections and tables will be deleted and then replaced with the structure from the selected template.";
            $scope.standardItemName = "Report Template :";
        } else if (standardItemVal == "defaultLanguageLibrary") {
            $scope.standardItemSuccess = "Default Language Library contains text to be inserted into report upon project setup and optional text for report writers. If you choose to update, text already written in sections will be overwritten by any default lang selected to populate upon project setup. (i.e. If the author has entered text in the Scope section and there is an auto-populate entry in the library for Scope, the text the author entered will be replaced if Default Language Library is updated.)";
            //            $scope.standardItemDanger = "You have chosen to update to a new template. The template you chose is associated with the Cardno ATC ASTM-13 Phase I Library Library. Do you want to update the Default Language?";
            $scope.standardItemName = "Default Language Library :";
        } else if (standardItemVal == "prepolulatedTableData") {
            $scope.standardItemSuccess = "Default Table Data is information that gets pre-populated into specific tables in the report upon project setup. Typical examples are the Adjoining Properties and Map Findings tables. If you choose to update, tables in the report that have Default Table Data will have all data overwritten by the template defaults. (i.e. If you have N,S,E,W rows in the Adjoining Properties table and the author has entered comments about the property and you choose to update this, the author's comments will be overwritten by blank N,S,E,W rows)";
            //            $scope.standardItemDanger = "You have chosen to update to a new template. Do you want to update the Default Table Data?";
            $scope.standardItemName = "Prepopulated Table Data :";
            $scope.prepopulatedText = "adad";
        }
    }*/
    
    //    $scope.setupItemClicked = function (standardItemVal) {
    //        $scope.showMessage = false;
    //        $scope.standardItemDanger = "";
    //        $scope.standardItemSuccess = "";
    //    }


    //    $('#standardItemsTable tbody tr').on('click', function (event) {
    //     
    //        event.stopPropagation();
    //        $('#data tr').removeClass('highlighted');
    //        $(this).toggleClass('highlighted');
    //        $('#alertMessageDiv').show();
    //
    //    });
    //
    //    $('html').click(function () {
    //     
    //        $('#standardItemsTable tr').removeClass('highlighted');
    //        $('#alertMessageDiv').hide();
    //
    //    })

    
    $scope.openOrderDBReports = function () {

        var modal = $modal.open({
            templateUrl: 'orderDBReports.html',
            controller: orderDBReportsController,
            scope: $scope,
            size: 0
        });
    }

    var orderDBReportsController = function ($scope, $modalInstance) {

        $scope.Cancel = function () {
            $modalInstance.close();
        }

        $scope.SaveOrderDBReports = function (form) {
            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }

            $modalInstance.close();

        }


    }
    
    $scope.saveDefaultItem = function (data, item, trans) {
       if(data){
           if (item.toLowerCase() == "setupBoard.selTransmittalLetter".toLowerCase()) {

                var defaultObj = {
                    "defaults": {
                        "transmittalSetupGUID": data
                    }

                };
                $scope.itemType = "setup";
                $scope.itemName = "Transmittal Letter Output Setup";


            } else if (item.toLowerCase() == "setupBoard.selReportCover".toLowerCase()) {
                var defaultObj = {
                    "defaults": {
                        "coverPageGUID": data
                    }

                };
                $scope.itemType = "setup";
                $scope.itemName = "Report Cover";

            } else if (item.toLowerCase() == "setupBoard.selTOC".toLowerCase()) {
                var defaultObj = {
                    "defaults": {
                        "tocSetupGUID": data
                    }

                };
                $scope.itemType = "setup";
                $scope.itemName = "Table of Contents Output Setup";

            } else if (item.toLowerCase() == "setupBoard.selReportOutputSetup".toLowerCase()) {
                var defaultObj = {
                    "defaults": {
                        "reportOutputSetupGUID": data
                    }

                };
                $scope.itemType = "setup";
                $scope.itemName = "Report Output Setup";

            } else if (item.toLowerCase() == "standardBoard.selTaskedCompany".toLowerCase()) {
                var defaultObj = {
                    "reportDetails": {
                        "taskedCompanyGUID": data
                    }

                };

                $scope.itemType = "standard";
                $scope.itemName = "Tasked Company";

            } else if (item.toLowerCase() == "standardBoard.selReportTemplate".toLowerCase()) {
                var defaultObj = {
                    "reportTemplate": {
                        "templateGUID": data
                    }

                };
                $scope.itemType = "standard";
                $scope.itemName = "Report Template";

            } else if (item.toLowerCase() == "standardBoard.selDLL".toLowerCase()) {
                var defaultObj = {
                    "defaults": {
                        "languageLibraryGUID": data
                    }

                };
                $scope.itemType = "standard";
                $scope.itemName = "Default Language Library";

            }


            ReportAuthoringAPI.updateSetupDefaults($state.params.reportGuid, defaultObj).then(function (defaults) {
                var msg ='<strong>'+ $scope.itemName+'</strong> was successfully updated.';
                HelperService.showPNotifyMessage('',msg, 'success');
            }, function (error) {
                var msg = 'Could not update <strong>'+$scope.itemName+'</strong>. Please try again.';
                HelperService.showPNotifyMessage('',msg, 'error');
            });
        }
        else{
             if (item.indexOf("setupBoard") > -1) {
                $scope.setupItemUpdateStatus = true;
                $scope.setupItemUpdateClass = "alert-danger";
                $scope.setupItemUpdateText = "Please select data in order to update the list.";
             } else if (item.indexOf("standardBoard") > -1) {
                $scope.standardItemUpdateStatus = true;
                $scope.standardItemUpdateClass = "alert-danger";
                $scope.standardItemUpdateText = "Please select data in order to update the list.";
             }
        }
    }
    $scope.clearMessages_Setup = function () {
        $scope.setupItemUpdateClass = "";
        $scope.setupItemUpdateStatus = false;
        $scope.setupItemUpdateText = "";
    }
    $scope.clearMessages_Standard = function () {
        $scope.standardItemUpdateClass = "";
        $scope.standardItemUpdateStatus = false;
        $scope.standardItemUpdateText = "";
    }

    $scope.openEdrCredentialsModal = function () {
        var modalInstance = $modal.open({
            templateUrl: 'orderDBReport.html',
            scope: $scope,
            controller: 'OrderDatabaseReportsController as OrderDbReportsCtrl',
            backdrop: 'static',
            resolve: {
                siteDetails: function (reportGridDataOperations) {
                    return reportGridDataOperations.getSiteInformation($state.params.reportGuid).then(function (response) {
                        return response;
                    });
                },
                userDetails: function (globalValues, accountMgmtAPI) {
                    var companyGuid = globalValues.currentUserCompanyGuid;
                    var officeGuid = globalValues.currentUserOfficeGuid;
                    var userGuid = globalValues.currentUserGuid;
                    return accountMgmtAPI.getUser(userGuid, "", companyGuid, officeGuid, "", "", "", "", "office").then(function (resp) {
                        return resp;
                    });
                }
            }
        });
    }
     
    $scope.updateVersion = function (data, type) {
        
        if (type == 0) {
            var defaultObj = {
                "reportTemplate": {
                    "templateGUID": data
                }

            };
             if (!confirm("Are you sure you want to update the template? \n This will delete all report sections, tables, table cells etc! \n click OK to continue")) {
            return;
        }else{  
            ReportAuthoringAPI.updateSetupDefaults($state.params.reportGuid, defaultObj).then(function (defaults) {
                HelperService.showPNotifyMessage('','<strong>Report Template version</strong> was successfully updated.', 'success'); 
                flgupdateVersion = true;
            }, function (error) {

                HelperService.showPNotifyMessage('','Could not update <strong>Report Template version</strong>. Please try again', 'error');                

            });
        }
            
        } else if (type == 1) {

        } else if (type == 2) {
             if (!confirm("Are you sure you want to update the default table data? \n This will delete all report table data! \n click OK to continue")) {
            return;
        }else{             
            ReportAuthoringAPI.updatePrepopulatedData($state.params.reportGuid).then(function (defaults) {             
                 HelperService.showPNotifyMessage('','<strong>Prepopulated Table Data version</strong> was successfully updated.', 'success'); 
                flgupdateVersion = true;
            }, function (error) {
                HelperService.showPNotifyMessage('','Could not update <strong>Prepopulated Table Data version</strong>. Please try again', 'error');
            });

        }
        }
    }
    
    $scope.editStandardItems = function(){
        $scope.isEditStandardItem = true;
    }
    
    $scope.cancelEditStandardItems = function(){
        $scope.isEditStandardItem = false;
    }
    
    $scope.updateStandardItems = function(){
                
        if($scope.standardItemsEdit.taskedompany)
        $scope.saveDefaultItem($scope.standardBoard.selTaskedCompany, 'standardBoard.selTaskedCompany');
        
        if($scope.standardItemsEdit.reportTemplate){
            $scope.saveDefaultItem($scope.standardBoard.selReportTemplate,'standardBoard.selReportTemplate');
            $scope.updateVersion($scope.standardBoard.selReportTemplate,0);
        }
        
        if($scope.standardItemsEdit.defaultLanguageLibrary){
            $scope.saveDefaultItem($scope.standardBoard.selDLL, 'standardBoard.selDLL');
            $scope.updateVersion($scope.standardBoard.selDLL,1);
        }
        
        if($scope.standardItemsEdit.prepopulatedTableData){
            $scope.updateVersion('',2);
        }
        
        $scope.isEditStandardItem = false;
        $timeout(function(){
            if(flgupdateVersion)
                $window.location.reload();            
        },2000);
        
    }

}]);
