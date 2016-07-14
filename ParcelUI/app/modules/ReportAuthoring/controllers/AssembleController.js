angular.module('ReportAuthoring').controller('AssembleController', ['$scope', 'ReportAuthoringAPI', '$modal', '$timeout', 'Upload', '$stateParams', 'ReportOutputService', 'BASEURL', '$compile', 'ParcelUI.Resources', '$filter', 'AuthFactory', 'HelperService', function ($scope, ReportAuthoringAPI, $modal, $timeout, Upload, $stateParams, ReportOutputService, BASEURL, $compile, ParcelUI_Resources, $filter, AuthFactory, HelperService) {
    var self = this;
    self.isPhotographChecked = "";
    self.uploadError = "";
    self.reportGuid = $stateParams.reportGuid;
    self.prevGeneratedDownloadArr = [];
    self.prevGeneratedEmailedArr = [];
    self.assembleSectionsArr = [];
    self.appendicesSectionsArr = [];
    self.selectAllText = "Check All";
    self.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
    self.waitingProcessResources.message = "Please Wait...";
    self.ReorderLettering = false;
    self.actionButtons = true;
    $scope.btnText = "Upload";
    $scope.serviceResponseAlertDanger = false;
    self.serviceResponseAlert = true;


    var generationTypes = [];
    //angular.element(document).ready(function () {
    //$scope.$on('$viewContentLoaded', function(){
    init();

    function init() {

        ReportAuthoringAPI.getPrevGeneratedEmailedReports($stateParams.reportGuid).then(function (result) {

            for (var i = 0; i < result.length; i++) {
                if (result[i].deliveryType.toLowerCase() == "download") {
                    result[i].downloadURL = "";
                    result[i].downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + result[i].downloadFileGuid + '/stream';
                    self.prevGeneratedDownloadArr.push(result[i]);
                } else if (result[i].deliveryType.toLowerCase() == "email") {
                    $scope.filterObject = $filter('filter')(result[i].sentEmails, {
                        sentType: "TO"
                    })[0];
                    if ($scope.filterObject) {
                        result[i].sentTo = $scope.filterObject.sentEmail;
                    }

                    self.prevGeneratedEmailedArr.push(result[i]);
                }


            }

            $timeout(function () {
                $('[data-toggle="tooltip"]').tooltip();

            });
            $scope.setTooltipClass = function () {
                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();

                });
            }
        }, function (error) {

        });

        ReportAuthoringAPI.getAssembleSections($stateParams.reportGuid).then(function (sections) {

            for (var i = 0; i < sections.length; i++) {
                self.assembleSectionsArr.push(sections[i]);
            }

        }, function (error) {

        });

        var allAppendicesPromise = ReportAuthoringAPI.getAppendicesSections($stateParams.reportGuid);
        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = allAppendicesPromise;

        allAppendicesPromise.then(function (appendicesSections) {

            self.appendicesSectionsArr = appendicesSections;
        }, function (error) {

        });
        ReportAuthoringAPI.managePanelHeight();
    }

    self.checkAll = function (isDownloadPDF) {

        self.IsCommentChecked = true;
        if (!self.selectedAll || isDownloadPDF) {

            self.selectAllText = "Check All";
            self.selectedAll = false;

            angular.forEach(self.assembleSectionsArr, function (item) {

                $("#" + item.sectionGUID + "-portrait").prop('checked', false);
                $("#" + item.sectionGUID + "-landscape").prop('checked', false);
            });


        } else {
            self.selectAllText = "Uncheck All";
            self.selectedAll = true;
        }

        angular.forEach(self.assembleSectionsArr, function (item) {
            if (item.visibleOnUI)
                item.Selected = self.selectedAll;
            //  self.IsCommentChecked = item.Selected;
        });

        angular.forEach(self.appendicesSectionsArr, function (item) {
            item.Selected = self.selectedAll;

            if (item.hasPhotos && self.selectedAll) {
                $("#" + item.sectionGUID + "-portrait").prop('checked', true);
            } else {
                $("#" + item.sectionGUID + "-portrait").prop('checked', false);
            }

            //  self.IsCommentChecked = item.Selected;

        });

        EnableDisabledButtons();
    };

    function EnableDisabledButtons() {

        var appendicesArr = $filter('filter')(self.appendicesSectionsArr, {
            Selected: true
        }, true);

        var assembleArr = $filter('filter')(self.assembleSectionsArr, {
            Selected: true
        }, true);

        if (appendicesArr.length == 0 && assembleArr.length == 0)
            self.actionButtons = true;
        else
            self.actionButtons = false;
    }

    ///PDF Geneartion Section Start

    self.dowloadPDF = function () {
        createReportGenerationRequest(null);
        self.checkAll(true);
        $('#lblSelAll').removeClass('active');
    }

    self.appendicesSectionClick = function (appendicesData) {
        appendicesData.Selected = !appendicesData.Selected;
        angular.forEach(self.appendicesSectionsArr, function (item) {
            if (item.hasPhotos) {

                var sectionClickVal = $("#" + item.sectionGUID + "-sectionClick").prop('checked');
                if (sectionClickVal) {
                    $("#" + item.sectionGUID + "-portrait").prop('checked', true);
                } else {
                    $("#" + item.sectionGUID + "-sectionClick").prop('checked', false);
                    $("#" + item.sectionGUID + "-portrait").prop('checked', false);
                    $("#" + item.sectionGUID + "-landscape").prop('checked', false);
                    item.Selected = false;
                }
            }
        });

        EnableDisabledButtons();
    }

    self.assembleSectionClick = function (section) {
        section.Selected = !section.Selected;
        EnableDisabledButtons();
    }

    function createReportGenerationRequest(type) {
        var reqObj = getCreateReportGenerationRequestObj(type);

        var reportGenerationRequestPromise = ReportOutputService.createReportGenerationRequest(self.reportGuid, reqObj);
        self.waitingProcessResources.promise = reportGenerationRequestPromise;

        reportGenerationRequestPromise.then(function (result) {
            msg = 'Failed to create request for report generation.';
            if (result.reportGeneration && result.reportGeneration.constructedDocumentGUID) {
                console.log('ReportGenerationRequest created...!');
                getConstructedDocument(result.reportGeneration.constructedDocumentGUID);
            } else {
                if (result.message)
                    msg = result.message.userMessage;
                HelperService.showPNotifyMessage('',msg,'error');                
            }
        }, function (error) {
            msg = 'Failed to create request for report generation.';
            /*if(error)
                msg = error;*/
            HelperService.showPNotifyMessage('',msg,'error');           
        })
    }

    function getCreateReportGenerationRequestObj(type, sectionGuid) {
        generationTypes = [];
        var includedSectionsArr = [];

        if (type) {
            generationTypes.push(type);
        } else {
            angular.forEach(self.assembleSectionsArr, function (assembleSection) {
                if (assembleSection.Selected) {
                    generationTypes.push(assembleSection.generationType);
                }
            });

            angular.forEach(self.appendicesSectionsArr, function (appendicesSection) {
                if (appendicesSection.Selected) {
                    var reportGenerationObj = {
                        "reportGenerationSectionGUID": appendicesSection.sectionGUID,
                        "settingsValue": ""
                    };

                    includedSectionsArr.push(reportGenerationObj);
                    if (appendicesSection.hasPhotos) {
                        if ($("#" + appendicesSection.sectionGUID + "-portrait").prop('checked'))
                            generationTypes.push("PHOTOPDFPORTRAIT");
                        if ($("#" + appendicesSection.sectionGUID + "-landscape").prop('checked'))
                            generationTypes.push("PHOTOPDFLANDSCAPE");
                    }
                }
            });

            if (includedSectionsArr.length > 0) {
                generationTypes.push("APPENDIX");
            }
        }

        return obj = {
            "reportGeneration": {
                "generationType": generationTypes,
                "includedSections": includedSectionsArr,
                "reorderLetteringOfAppendices": self.ReorderLettering,
                "deliveryOption": "DOWNLOAD"
            }
        }
    }

    function getConstructedDocument(docGuid) {

        var promise = ReportOutputService.getConstructedDocument(docGuid);
        promise.then(function (response) {
            if (response.constructedDocument) {
                if (response.constructedDocument.status && response.constructedDocument.status.toLowerCase() == 'processing') {
                    $timeout(function () {
                        getConstructedDocument(docGuid);
                    }, 5000)
                } else {
                    //console.log('document constructed...!');
                    getGeneratedPDF(response.constructedDocument.constructedDocumentGUID);
                }
            } else {
                msg = 'Request failed to fetch constructed document.';
                if (response.message)
                    msg = result.message.userMessage;
                HelperService.showPNotifyMessage('',msg,'error');                
            }
            //handle error here
        }, function (error) {
            msg = 'Request failed to fetch constructed document.';
            /*if (error)
                msg = error;*/
            HelperService.showPNotifyMessage('',msg,'error');
        })
    }

    function getGeneratedPDF(coreFileGuid) {
        ReportOutputService.downloadGeneratedDocument(coreFileGuid);
    }
    // PFD Generation Section Ends.

    $scope.openEmailLinkToClientPopup = function () {
        var modal = $modal.open({
            templateUrl: 'orderEmailLinkToClient.html',
            controller: orderEmailLinkToClientController,
            scope: $scope,
            size: 0
        });
    }

    var orderEmailLinkToClientController = function ($scope, $modalInstance) {
        $scope.Cancel = function () {
            $modalInstance.close();
        }
    }

    $scope.openEditPopup = function (editVal,generationType) {
        $('.tooltip-hide').blur();
        var modal = $modal.open({
            templateUrl: 'editCoverPage.html',
            controller: editCoverPageController,
           // scope: $scope,
            size: 'lg',
            resolve: {
                generationType: function () {
                    return generationType;
                }
            }
        });

        //        if (editVal.toLowerCase() == "edittransmittal") {
        //                var modal = $modal.open({
        //                    templateUrl: 'editTransmittalLetter.html',
        //                    controller: editTransmittalLetterController,
        //                    scope: $scope,
        //                    size: 'lg'
        //                });
        //            } 
        //        else if (editVal.toLowerCase() == "/reporting/editCover.php") {
        //                var modal = $modal.open({
        //                    templateUrl: 'editCoverPage.html',
        //                    controller: editCoverPageController,
        //                    scope: $scope,
        //                    size: 'lg'
        //                });
        //            }        
    }

    var editTransmittalLetterController = function ($scope, $modalInstance,generationType) {
   
            var promise = ReportAuthoringAPI.getSectionDataToEdit($stateParams.reportGuid,'transmittalletter');
            promise.then(function (response) {             
               
 // below code is commented as the service sends response for cover page and not transmittal letter.     
 //                  $scope.obj={};
//                $scope.obj.date_check = response.includeDate;
//                $scope.obj.transmittalDate = response.date;                
//                $scope.obj.to_check = response.includeTo;
//                $scope.obj.to = response.to;
//                $scope.obj.salutation = response.salutation;
//                $scope.obj.body = response.body;
//                $scope.obj.closing = response.closing;
//                $scope.obj.signature1_check = response.includeSignature1;
//                $scope.obj.signature1 = response.signature1;
//                $scope.obj.signature2_check = response.includeSignature2;
//                $scope.obj.signature2 = response.signature2;
                
                 //binded with dummy data
                $scope.obj={};
                $scope.obj.transmittalDate = "8 June 2016";
                $scope.obj.date_check = true;
                $scope.obj.to_check = true;
                $scope.obj.to = "Anand Baghel";
                $scope.obj.salutation = "Dear Mr. Baghel,";
                $scope.obj.body = "Please find attached for your review, a Phase I Environmental Site Assessment.,";
                $scope.obj.closing = "Sincerely,Kevin Kozar";
                $scope.obj.signature1_check = true;
                $scope.obj.signature1 = "{digitally_signed}";
                $scope.obj.signature2_check = true;
                $scope.obj.signature2 = "";
                
                
            });
            
            $scope.saveTransmittalLetter = function ()
            {
                 var data = {
                            "generationType": generationType,
                            "date": $scope.obj.transmittalDate,
                            "to": $scope.obj.to,
                            "salutation": $scope.obj.salutation,
                            "body": $scope.obj.body,
                            "closing": $scope.obj.closing,
                            "signature1": $scope.obj.signature1,
                            "signature2": $scope.obj.signature2,
                            "includeDate": $scope.obj.date_check,
                            "includeTo": $scope.obj.to_check,
                            "includeSignature1": $scope.obj.signature1_check,
                            "includeSignature2": $scope.obj.signature2_check
                            }
                 var promise = ReportAuthoringAPI.updateSectionData($stateParams.reportGuid,'transmittalletter', data);
                 promise.then(function (resp) {
                     $modalInstance.close();
                 });
            }
            
            $scope.signClosing = function () {                
                if($scope.obj.closing.indexOf("{digitally_signed}") == -1)
                {
                    $scope.obj.closing = $scope.obj.closing + "{digitally_signed}";
                }
            }
            
            $scope.signSignature1 = function () {
               if($scope.obj.signature1.indexOf("{digitally_signed}") == -1)
                {
                    $scope.obj.signature1 = $scope.obj.signature1 + "{digitally_signed}";
                }
            }
            
            $scope.signSignature2 = function () {
                if($scope.obj.signature2.indexOf("{digitally_signed}") == -1)
                {
                    $scope.obj.signature2 = $scope.obj.signature2 + "{digitally_signed}";
                }
            }
            
            $scope.Cancel = function () {
                $modalInstance.close();
            }

        }
        //    $scope.openEditCoverPagePopup = function () {
        //        var modal = $modal.open({
        //            templateUrl: 'editCoverPage.html',
        //            controller: editCoverPageController,
        //            scope: $scope,
        //            size: 'lg'
        //        });
        //    }
    var editCoverPageController = function ($scope, $modalInstance,generationType) {

        var promise = ReportAuthoringAPI.getSectionDataToEdit($stateParams.reportGuid,'coverpage');
        promise.then(function (response) {
                $scope.obj={};
            
                $scope.obj.title1 = response.title1;
                $scope.obj.title2 = response.title2;
            
                $scope.obj.siteAddress = response.propertyAddress;
                $scope.obj.siteCity = response.propertyCity;
                $scope.obj.siteState = response.propertyState;
                $scope.obj.siteZip = response.propertyZip;
            
                $scope.obj.preparedFor= response.clientCompany;
                $scope.obj.preparedForAddress = response.clientAddress;
                $scope.obj.preparedForCity = response.clientCity;
                $scope.obj.preparedForState = response.clientState;
                $scope.obj.preparedForZip = response.clientZipCode;
            
                $scope.obj.preparedBy= response.consultantCompany;
                $scope.obj.preparedByAddress = response.consultantAddress;
                $scope.obj.preparedByCity = response.consultantCity;
                $scope.obj.preparedByState = response.consultantState;
                $scope.obj.preparedByZip = response.consultantZipCode;
            
                $scope.obj.jobNumber = response.projectNumber;
                $scope.obj.coverReportDate = response.reportDate;
            
          
                
        });
        
          $scope.saveCoverPage = function ()
            {
                 var data = {
                            "generationType": generationType,
                            "title1": $scope.obj.title1,
                            "title2": $scope.obj.title2,
                            "propertyAddress": $scope.obj.siteAddress,
                            "propertyCity":$scope.obj.siteCity ,
                            "propertyState":$scope.obj.siteState,
                            "propertyZip":$scope.obj.siteZip,
                            "clientCompany":$scope.obj.preparedFor,
                            "clientAddress":$scope.obj.preparedForAddress,
                            "clientCity":$scope.obj.preparedForCity,
                            "clientState":$scope.obj.preparedForState,
                            "clientZipCode":$scope.obj.preparedForZip,
                            "consultantCompany":$scope.obj.preparedBy,
                            "consultantAddress":$scope.obj.preparedByAddress,
                            "consultantCity":$scope.obj.preparedByCity,
                            "consultantState":$scope.obj.preparedByState,
                            "consultantZipCode":$scope.obj.preparedByZip,
                            "projectNumber":$scope.obj.jobNumber,
                            "reportDate":$scope.obj.coverReportDate
                           
                            }
                 var promise = ReportAuthoringAPI.updateSectionData($stateParams.reportGuid,'coverpage', data);
                 promise.then(function (resp) {
                     $modalInstance.close();
                 });
            }
            
        
        $scope.Cancel = function () {
            $modalInstance.close();
        }
    }

    $scope.viewSectionPDF = function (section) {
        $('.tooltip-hide').blur();
        if (section.viewURL != undefined && section.viewURL != null && section.viewURL != "")
        //getGeneratedPDF(section.uploadedFileGuid);
            self.openGeneratedPDF(section.viewURL);
        else
            createReportGenerationRequest(section.generationType);

        //handleTooltipOnmouseMove(section.deliverableSectionGuid);
    }

    /*function handleTooltipOnmouseMove(deliverableSectionGuid) {
        $('#' + deliverableSectionGuid + '_view').mousemove(function( event ) {
            $('[data-toggle="tooltip"]').tooltip('hide');
        });
    }*/

    self.openGeneratedPDF = function (fileUrl) {
        var url = fileUrl + ReportAuthoringAPI.getResponseType();
        var win = window.open(url, '_blank');
        win.focus();
    };

    $scope.openUpload = function (section) {
        $('.tooltip-hide').blur();
        self.uploadError = "";
        $scope.uploadLetter = section.label;
        var modal = $modal.open({
            templateUrl: 'upload.html',
            controller: uploadController,
            scope: $scope,
            size: 0,
            resolve: {
                sectionGuid: function () {
                    return section.deliverableSectionGuid;
                }
            }
        }).result.then(function (result) {
            if (result && result.data.deliverableSectionUpload.downloadURL) {
                var selectedSection = $filter('filter')(self.assembleSectionsArr, {
                    deliverableSectionGuid: section.deliverableSectionGuid
                }, true);

                if (selectedSection) {
                    selectedSection[0].viewURL = result.data.deliverableSectionUpload.downloadURL;
                    msg = (selectedSection[0].label ? selectedSection[0].label : "File") + " uploaded successfully";
                }

                $("#" + section.deliverableSectionGuid + "_upload").prop('disabled', true);
                $("#" + section.deliverableSectionGuid + "_edit").prop('disabled', true);
                $("#" + section.deliverableSectionGuid + "_delete").prop('disabled', false);
                $('[data-toggle="tooltip"]').tooltip('destroy');
                
                HelperService.showPNotifyMessage('', msg, 'success');
            }
            else {
                msg = "Failed to upload a file";
                HelperService.showPNotifyMessage('', msg, 'error');
            }
        });
    }

    var uploadController = function ($scope, $modalInstance, sectionGuid) {
        $scope.fileErrorDanger = false;
        $scope.fileErrorTextDanger = "";
        $scope.Cancel = function () {
            $modalInstance.close(false);
        }
        $scope.hideErrorMessage = function () {
            $scope.fileErrorDanger = false;
        }
        $scope.uploadFiles = function () {
            var isUploaded = false;
            if ($scope.file) {
                var fileExt = $scope.file.name.split('.').pop();
                if (fileExt == 'pdf') {
                    if ($scope.file.size > BASEURL.APPENDIX_FILE_UPLOAD_SIZE_LIMIT) {
                        $scope.fileErrorDanger = true;
                        $scope.btnText = "Upload";
                        $scope.fileErrorTextDanger = $scope.file.name + " file size is more than 25MB";
                    } else {
                        $scope.fileErrorDanger = false;
                        $scope.fileErrorTextDanger = "";
                        $scope.btnText = "Uploading Please Wait...";

                        //$scope.file.convertToBase64(function (base64, attachedFile) {
                        var data = {
                            "deliverableSectionUpload": {
                                "deliverableSectionGuid": sectionGuid,
                                "fileContents": "base64-encoded file"
                            }
                        }

                        var reqObj = JSON.stringify(data);
                        var promise = ReportAuthoringAPI.uploadDeliverableSectionFile(self.reportGuid, $scope.file, reqObj);
                        promise.then(function (result) {
                            isUploaded = true;
                            $scope.btnText = "Upload";
                            $modalInstance.close(result);
                        }, function (error) {
                            $scope.fileErrorDanger = true;
                            $scope.btnText = "Upload";
                            $scope.fileErrorTextDanger = "File upload failed for " + $scope.uploadLetter + error.data.message.userMessage;
                        });

                    }

                } else {
                    $scope.fileErrorDanger = true;
                    $scope.btnText = "Upload";
                    $scope.fileErrorTextDanger = "File is a " + fileExt + ", it needs to be PDF for " + $scope.uploadLetter + " upload.";
                    $scope.file = null;
                }
            } else {
                $scope.fileErrorDanger = true;
                $scope.btnText = "Upload";
                $scope.fileErrorTextDanger = "Please attach file in order to upload.";
            }
        };
    }

    $scope.openWhatsThis = function () {
        var modal = $modal.open({
            templateUrl: 'whatsThis.html',
            controller: openWhatsThisController,
            scope: $scope,
            size: 0
        });
    }

    var openWhatsThisController = function ($scope, $modalInstance) {
        $scope.Cancel = function () {
            $modalInstance.close();
        }
    }

    self.photographCheckChange = function (val, section) {
        $("#" + section.sectionGuid + "-sectionClick").prop('checked', true);
        section.Selected = true;
        EnableDisabledButtons();
    }

    $scope.open = {};


    self.openLeftPanel = function () {
        $(".leftContent").removeClass("report-menu-width");
        $(".leftContent").addClass("col-md-4");
        $("#rightContent").addClass("col-md-8");
        $("#section-toggle").removeClass("sidesection-icon");
    }

    self.disableReport = function (reportData) {

        var data = {
            "link": {
                "active": 0
            }
        };

        ReportAuthoringAPI.disableEmailedReports(reportData.reportDeliveryGuid, data).then(function (result) {
            reportData.deactivationUser = result.link.deactivationUser;
            reportData.deactivationDateTime = result.link.deactivationDateTime;
            reportData.active = false;
        }, function (error) {

        });
    }

    self.openDeletePopup = function (deliverableSectionGuid) {
        $('.tooltip-hide').blur();
        var modalInstance = $modal.open({
            templateUrl: "deleteDocument.html",
            scope: $scope,
            controller: deleteController,
            size: 0,
            resolve: {
                sectionGuid: function () {
                    return deliverableSectionGuid;
                }
            }
        }).result.then(function (result) {
            if (result) {
                var selectedSection = $filter('filter')(self.assembleSectionsArr, {
                    deliverableSectionGuid: deliverableSectionGuid
                }, true);

                if (selectedSection) {
                    selectedSection[0].viewURL = null;
                    msg = (selectedSection[0].label ? selectedSection[0].label : "File") + " deleted successfully";
                }

                $("#" + deliverableSectionGuid + "_upload").prop('disabled', false);
                $("#" + deliverableSectionGuid + "_edit").prop('disabled', false);
                $("#" + deliverableSectionGuid + "_delete").prop('disabled', true); 
				$('[data-toggle="tooltip"]').tooltip('destroy');
                
                HelperService.showPNotifyMessage('', msg, 'success');
            }
            else {
                msg = "Failed to delete a file";
                HelperService.showPNotifyMessage('', msg, 'error');
            }
        });
    }

    var deleteController = function ($scope, $modalInstance, sectionGuid) {

        $scope.deleteDocument = function () {
            var promise = ReportAuthoringAPI.deleteDeliverableSectionDocument($stateParams.reportGuid, sectionGuid);
            return promise.then(function (resp) {
                $modalInstance.close(true);
            });
        }

        $scope.CancelDelete = function () {
            $modalInstance.close(false);
        }
    }

    self.openEmailLink = function () {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ReportAuthoring/views/emailLink.html',
            scope: $scope,
            controller: 'EmailLinkController as emailLink',
            size: 'lg',
            windowClass: 'app-modal-window',
            resolve: {
                ReportGenerationRequestObj: function () {
                    return getCreateReportGenerationRequestObj();
                }
            }
        })
    }
}]);