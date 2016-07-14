
angular.module('ReportAuthoring').controller('AppendicesController', ['AppendixAPI', 'FileUploader', '$modal', '$timeout', '$scope', 'ReportAuthoringAPI', 'AppendixTools', '$state', 'BASEURL', '$filter', 'AppendicesUrlCollection', '$rootScope', 'ParcelUI.Resources', '$stateParams','$window', 'ReportOutputService','$sce','$compile','scopeArray','AuthFactory', function (AppendixAPI, FileUploader, $modal, $timeout, $scope, ReportAuthoringAPI, AppendixTools, $state, BASEURL, $filter, AppendicesUrlCollection, $rootScope, ParcelUI_Resources, $stateParams,$window, ReportOutputService, $sce,$compile,scopeArray, AuthFactory) {

    var self = this;
    //self.reportGuid = 12;
    self.reportID = $stateParams.reportGuid;
    self.reportGuid = $stateParams.reportGuid;
    self.checkComments = false;
    self.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
     self.waitingProcessResources.message = "Please Wait...";
    self.waitingCommentsResources = ParcelUI_Resources.waitingCommentsResources;

    self.selectAllText = "Check All";
    self.IsCommentChecked = false;
    self.commentsErrorStatus = false;
    self.commentsErrorText = "";
    $scope.commentsArr = [];
    self.serviceResponseAlert = true;
    self.responseAlert = false;
    self.responseErrorAlert = false;
    self.sectionCompiledArray = [];
    self.uploadSucces = [];
    self.uploadfailed = [];
    ReportAuthoringAPI.managePanelHeight();
    self.statusClass = "";
    self.statusText = "";
    self.statusErrorText = "";
    self.saveNewCommBtn = false;
    self.reportAppendices = {
        sections: [],
        selectedSection: {},
        allSectionView: false
    };
    /*
        $(document).load(function(){
            
                if(localStorage.getItem("reportStatusAbbreviation") == 'FIN')
                   {
                    var inputsbuttons = $("#rightContent").find('.btn');
                    $timeout(function(){
                         $(inputsbuttons).each(function () {
                        $(this).attr('disabled', true);
                    });
                    },300);
                   
                       }
            
        });*/

    function init() {




        var sectionGUID = localStorage.getItem('sign_sectionGUID');
        if (sectionGUID) {

            $('#li_toc_appendices').removeClass('active');
            $('#li_comments_appendices').addClass('active');
            self.reportAuthoringWriteSelected = 'Comments';

            var getAllAppendicesPromise = AppendixAPI.getAllAppendices(self.reportGuid);
            self.waitingProcessResources.promise = getAllAppendicesPromise;
            getAllAppendicesPromise.then(function (sections) {

                addUploaderInstanceToEverySection(sections);
                self.reportAppendices.sections = sections;
                if (sections && sections.length) {
                    var selectedSectionAppendices = sections.filter(function (item) {
                        return item.sectionGUID.toLowerCase() == sectionGUID.toLowerCase()
                    })[0];
                    if (selectedSectionAppendices) {
                        self.sectionClick(selectedSectionAppendices);
                    } else {
                        self.sectionClick(sections[0]);
                    }
                    // load files for all sections
                    loadFileDetailsForAllSections(self.reportAppendices.sections);
                }

                //comment starts
                var section = {
                    "sectionGUID": sectionGUID
                }

                self.commentsErrorStatus = false;
                self.commentsErrorText = "";
                self.checkComments = false;
                self.newComm = false;
                self.serviceResponseAlert = true;

                var commentFilterSelected = localStorage.getItem('commentFilterSelected');
                if (commentFilterSelected) {
                    self.selSection_Comments = commentFilterSelected;
                    getCommentsByFilter(commentFilterSelected, section);
                } else {

                    self.selSection_Comments = 0;
                    getCommentsBySection(section);

                }

                //comment ends

            })


        } else {
            self.reportAuthoringWriteSelected = 'Appendices';
            var getAllAppendicesPromise = AppendixAPI.getAllAppendices(self.reportGuid);
            self.waitingProcessResources.promise = getAllAppendicesPromise;
            getAllAppendicesPromise.then(function (sections) {

                addUploaderInstanceToEverySection(sections);
                self.reportAppendices.sections = sections;
                if (sections && sections.length) {
                    // default behavior: first section view
                    self.sectionClick(sections[0]);
                    // load files for all sections
                    loadFileDetailsForAllSections(self.reportAppendices.sections);
                    /*	if(localStorage.getItem("reportStatusAbbreviation") == 'FIN')
               {
                var inputsbuttons = $("#rightContent").find('.btn');
                $timeout(function(){
                     $(inputsbuttons).each(function () {
                    $(this).attr('disabled', true);
                });
                },300);
               
                   }*/
                }
            })

        }

        ReportAuthoringAPI.managePanelHeight();


    }
    init();

    self.removeLocalStorage = function () {
        localStorage.removeItem('sign_sectionGUID');

    }

    self.showErrorMessage = function (messageText, messageType) {
        self.responseErrorAlert = true;
        self.statusErrorText = messageText;
    }
    self.showMessage = function (MessageText, MessageType) {
        self.responseAlert = true;
        self.statusClass = "alert-" + MessageType;
        self.statusText = MessageText;

    }
    self.sectionClick = function (section) {
        console.log("section val: "+section);
        self.reportAppendices.allSectionView = false;
        self.reportAppendices.selectedSection = section;
        self.responseAlert = false;
        self.responseErrorAlert = false;
        loadUploadedFilesForSelectedSection(self.reportAppendices.selectedSection);
    }

    self.allSectionViewClick = function () {
        self.reportAppendices.allSectionView = true;
        self.reportAppendices.selectedSection = null;
    }

    function loadUploadedFilesForSelectedSection(section, hardReload) {
        if (section && section.files && section.files.length && !hardReload) return;

        var sectionID = section.sectionID;
        var sectionGUID = section.sectionGUID;


        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise = null;
        $scope.promise = getUploadedFilesForSection(self.reportGuid, sectionGUID).then(function (files) {

            // for testing purposes only
            // mock api only returns one item
            /*for (var i = 5, first = files[0]; i < 10; i++) {
                var temp = angular.copy(first);
                temp.filename = temp.filename + '_' + i;
                temp.fileGuid = temp.fileGuid + '_' + i;
                files.push(temp);
            }*/

            //section.files = files;
            if (files != undefined) {
                section.files = $filter('orderBy')(files, 'orderIndex');
//                section.hasPhotos=true;
//                section.photosUploaded=true;
            } else {
                section.files = [];
            }

            angular.forEach(section.files, function (file) {
                file.sectionID = sectionID
                file.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + file.fileGUID + '/stream';
                //file.isPdfFile = checkIfUploadFilePdf(file.fileName);
                file.fileType = checkUploadedFileType(file.fileName);
            });
            if (section.files && section.files.length) {
                section.totalFileSize = section.files.sum('fileSize');
            } else {
                section.totalFileSize = "";
            }

            if ( window.sessionStorage.getItem("reportStatusAbbreviation") == 'FIN') {
                    var inputsbuttons = $("#rightContent").find('.btn');

                    $timeout(function(){
                         $(inputsbuttons).each(function () {
                        $(this).attr('disabled', true);
                             if($(this).find('[type=file]') != [])
                                  $(this).find('[type=file]').attr('disabled',true);
                             //Removing css class as disabling button on finalize
                                 //$(this).find('[type=file]').parent().css('display','none');
                                  //$(this).parent().prev().css('display','none');
                                //$(".appendixPhotoLogTableActions").css('display','none');        
                        $('.appendixPhotoLog *').attr('disabled', false);
                    });
                    },300);
               
            }
            /*if(self.reportAppendices.selectedSection.excludedImages && self.reportAppendices.selectedSection.includedImages && self.reportAppendices.selectedSection.files)
            {
                 if(self.reportAppendices.selectedSection.excludedImages.length > 0 || self.reportAppendices.selectedSection.includedImages.length > 0 || self.reportAppendices.selectedSection.files.length > 0)
                {
//                    self.reportAppendices.selectedSection.hasPhotos = true;
                    //self.reportAppendices.selectedSection.photosUploaded = true;
                }
            }*/
             
              

        })
    }


    function checkUploadedFileType(filename) {
        //var fileType= "";
        //if(filename.endsWith('.pdf'))
        if(filename)
        {
             /*return filename.endsWith('.pdf') ? 'pdf' : filename.endsWith('.html') ? 'html' : filename.endsWith('.htm') ? 'html' : filename.endsWith('.docx') ? 'docx' : filename.endsWith('.pptx') ? 'pptx' : filename.endsWith('.txt') ? 'txt' : filename.endsWith('.xlsx') ? 'xlsx' : filename.endsWith('.jpeg') ? 'img' : filename.endsWith('.jpg') ? 'img' : filename.endsWith('.png') ? 'img' : filename.endsWith('.gif') ? 'img' : filename.endsWith('.tif') ? 'img' : filename.endsWith('.bmp') ? 'img' : 'undefined';*/
            
            return filename.split('.').pop().toLowerCase() === 'pdf' ? 'pdf' : filename.split('.').pop().toLowerCase() === 'html' ? 'html' : filename.split('.').pop().toLowerCase() === 'htm' ? 'html' : filename.split('.').pop().toLowerCase() === 'docx' ? 'docx' : filename.split('.').pop().toLowerCase() === 'pptx' ? 'pptx' : filename.split('.').pop().toLowerCase() === 'txt' ? 'txt' : filename.split('.').pop().toLowerCase() === 'xlsx' ? 'xlsx' : filename.split('.').pop().toLowerCase() === 'jpeg' ? 'img' : filename.split('.').pop().toLowerCase() === 'jpg' ? 'img' : filename.split('.').pop().toLowerCase() === 'png' ? 'img' : filename.split('.').pop().toLowerCase() === 'gif' ? 'img' : filename.split('.').pop().toLowerCase() === 'tif' ? 'img' : filename.split('.').pop().toLowerCase() === 'bmp' ? 'img' : 'undefined';
        }
       
    }

    function checkIfUploadFilePdf(filename) {
        if(filename)
        {
            //return filename.endsWith('.pdf') ? true : false;
            return filename.split('.').pop().toLowerCase() === 'pdf' ? true : false;
        }
    }

    function getUploadedFilesForSection(reportID, sectionGUID) {
        var promise = AppendixAPI.getAppendixFiles(reportID, sectionGUID);
        return promise.then(function (files) {
            return files;
        }, function (error) {
            console.log("error");
            // self.commentsErrorText = error;
            // self.commentsErrorStatus = true;

        });
    }
    
    //-------------EDR Drawing tools

    self.openEDRDrawingTool = function () {
        
        //var reportGuid ='2E1BDBAF-EC04-4DB7-951A-37C7611970A2';
        var getAvailableDrawingToolOrdersPromise = AppendixAPI.getAvailableDrawingToolOrders(self.reportGuid);
        self.waitingProcessResources.promise = getAvailableDrawingToolOrdersPromise;
        getAvailableDrawingToolOrdersPromise.then(function (drawingToolOrders) {
            
            if(drawingToolOrders && drawingToolOrders.length){
                if (drawingToolOrders.length > 1) {

                    angular.forEach(drawingToolOrders, function (order, index) {

                        order.creationDate = new Date(order.creationDate);

                    })
                    selectDrawingToolOrders(drawingToolOrders);

                } else {

                    redirectToEDRDrawingTool(self.reportGuid, drawingToolOrders[0]);
                }
            }
            else{
                var defaultMessage = 'No EDR orders found for this report.'
                 openErrorMessagePopup(drawingToolOrders, defaultMessage);
            }
            

        })

    }

    function selectDrawingToolOrders(drawingToolOrders) {
        var modalContainer = {
            drawingToolOrders: drawingToolOrders
        }

        var modalInstance = $modal.open({
            templateUrl: 'SelectDrawingToolOrders.html',
            controller: selectDrawingToolOrdersController,
            size: 'lg',
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });

        modalInstance.result.then(function (result) {

        });
    }

    function selectDrawingToolOrdersController($scope, $modalInstance, data) {

        $scope.drawingToolOrders = data.drawingToolOrders;
        $scope.drawingToolOrders.selectedEdrPropertyGuid;
        
        $scope.continueToDrawingTool = function () {
            var selectedEdrPropertyGuid = $scope.drawingToolOrders.selectedEdrPropertyGuid;
            var selectedOrderDetails = $scope.drawingToolOrders.filter(function(order){
                return order.edrPropertyGuid == selectedEdrPropertyGuid;
            })[0];
            
            if (selectedOrderDetails && selectedOrderDetails.edrPropertyGuid) {
                //var reportGuid = "2E1BDBAF-EC04-4DB7-951A-37C7611970A2";
                redirectToEDRDrawingTool(self.reportGuid, selectedOrderDetails, $modalInstance, $scope);
            } else {
                $scope.showMessageEDROrder("Please select an order from the table.", "danger");
            }

        };

        $scope.cancelToDrawingTool = function () {
            $modalInstance.close();
        };

        $scope.showMessageEDROrder = function (MessageText, MessageType) {
            $scope.drawingToolOrders.ResponseAlert = true;
            $scope.drawingToolOrders.StatusClass = "alert-" + MessageType;
            $scope.drawingToolOrders.StatusText = MessageText;

        };
    }

    function redirectToEDRDrawingTool(reportGuid, selectedOrderDetails, $modalInstance, $scope) {
        self.selectedOrderDetails = selectedOrderDetails;
        var getDrawingToolUrlPromise = AppendixAPI.getDrawingToolUrl(reportGuid, selectedOrderDetails.edrPropertyGuid);
        self.waitingProcessResources.promise = getDrawingToolUrlPromise;
        getDrawingToolUrlPromise.then(function (response) {
            if($modalInstance) $modalInstance.close();
            if (response.drawingToolURL && response.drawingToolURL.url) {
                var newWindow = $window.open("", "_blank");
                newWindow.location.href = response.drawingToolURL.url;
                
            } else {
                var defaultMessage = 'EDR drawing tool url is not available.';
                openErrorMessagePopup(response, defaultMessage, self.selectedOrderDetails);
                //$scope.showMessageEDROrder("EDR drawing tool url is not available.", "danger");
            }

        },function (error) {
            var defaultMessage = 'Error occured while processing your request. Please try again.';
            openErrorMessagePopup(error, defaultMessage, self.selectedOrderDetails, true);
        });
    };
    
    function openErrorMessagePopup(data, defaultMessage, selectedOrderDetails){
        var modalContainer = {
            modalData: data,
            reportGuid: self.reportGuid,
            defaultMessage: defaultMessage,
            orderDetails: selectedOrderDetails
        };
        var modalInstance = $modal.open({
            templateUrl: 'errorMessageDrawingTool.html',
            controller: errorMessageCtrl,
            resolve: {
                errorMsgdata: function(){
                    return modalContainer;
                }
            }
        });
        modalInstance.result.then(function(){
            
        });
    };
    
    var errorMessageCtrl = function($scope, $modalInstance, errorMsgdata){
        $scope.errorMsg = errorMsgdata.defaultMessage;
        
        if(errorMsgdata.orderDetails){
            $scope.orderDetails = errorMsgdata.orderDetails;
            if(!$scope.orderDetails.edrOrderGuid){
                $scope.orderDetails.edrOrderGuid = "00000000-0000-0000-0000-000000000000";
            }
        }
                
        if(!$scope.errorMsg){
            $scope.errorMsg = "Error occured while processing your request. Please try again.";
        }
        if(errorMsgdata.modalData && errorMsgdata.modalData.drawingToolURL && errorMsgdata.modalData.drawingToolURL.message){
            $scope.errorMsg = errorMsgdata.modalData.drawingToolURL.message;
        }
        $scope.closeMessagePopup = function(){
            $modalInstance.close();
        };        
    };
    
    //----------------End of EDR Drawing Tool

    function loadFileDetailsForAllSections(sections) {
        var count = 0;
        angular.forEach(sections, function (section, index) {
            loadUploadedFilesForSelectedSection(section);
        });
    }

    // tool options for uploaded files
    self.deleteFile = function (file, section) {
        self.responseAlert = false;
        self.responseErrorAlert = false;
        var modalContainer = {
            file: file,
            section: section,
            refreshAfter: false
        }

        var modalInstance = $modal.open({
            templateUrl: 'DeleteAppendixFile.html',
            controller: deleteAppendixFileController,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (result) {
                loadUploadedFilesForSelectedSection(section, true);
               
            }
        });
    }

    function deleteAppendixFileController($scope, $modalInstance, data) {
        $scope.toDelete = {
            file: data.file,
            section: data.section
        };

        $scope.deleteAppendixFile = function () {
            var sectionGuid = $scope.toDelete.section.sectionGUID;
            var fileGuid = $scope.toDelete.file.fileGUID;
            var promise = AppendixAPI.deleteAppendixFile(self.reportGuid, sectionGuid, fileGuid);
            promise.then(function (data) {
              
                $scope.filterObject = $filter('filter')(self.reportAppendices.selectedSection.files, {
				    fileGUID: fileGuid
				})[0];
                  if ($scope.filterObject) {
                        var selectedIndex = self.reportAppendices.selectedSection.files.indexOf($scope.filterObject);
                        self.reportAppendices.selectedSection.files.splice(selectedIndex, 1);
                  }
                //if(self.reportAppendices.selectedSection.excludedImages.length < 1 && self.reportAppendices.selectedSection.includedImages.length < 1 && self.reportAppendices.selectedSection.files.length < 1)
                //{
                    //self.reportAppendices.selectedSection.hasPhotos = false;
                    //self.reportAppendices.selectedSection.photosUploaded = false;
                //}
                $modalInstance.close(true);
            });
        }

        $scope.cancelDelete = function () {
            $modalInstance.close();
        }
    }


    self.editFileDetails = function (file, section) {
        self.responseAlert = false;
        self.responseErrorAlert = false;
        var modalContainer = {
            file: file,
            section: section,
            refreshAfter: false,
            sections: self.reportAppendices.sections
        }

        var modalInstance = $modal.open({
            templateUrl: 'UpdateAppendixFile.html',
            controller: updateAppendixFileController,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });

        modalInstance.result.then(function (result) {
            /*console.log(result)
            console.log(data)
            console.log(modalContainer*/
            if (result.refreshAfter) {
                loadUploadedFilesForSelectedSection(section, true);
            }
        });
    }



    function updateAppendixFileController($scope, $modalInstance, data) {
        $scope.toUpdate = {
            file: angular.copy(data.file),
            section: data.section,
            sections: data.sections
        };

        $scope.toUpdate.file.sectionGUID = $scope.toUpdate.file.sectionGUID.toLowerCase();

        angular.forEach($scope.toUpdate.sections, function (section, index) {
            section.sectionGUID = section.sectionGUID.toLowerCase();
        });

        $scope.toUpdate.file.sectionID = $scope.toUpdate.section.sectionID;

        $scope.updateAppendixFile = function () {
            var sectionGUID = $scope.toUpdate.section.sectionGUID;
            var fileGuid = $scope.toUpdate.file.fileGUID;
            //var file = $scope.toUpdate.file;
            //file.targetSectionGuid = $scope.toUpdate.file.sectionGUID;
            //file.filename = 'Testname.pdf';

            var file = {};
            file.isIncluded = $scope.toUpdate.file.isIncluded;
            file.sectionGUID = $scope.toUpdate.file.sectionGUID;
            file.orderIndex = $scope.toUpdate.file.orderIndex;
            file.fileName = $scope.toUpdate.file.fileName;


            $scope.delay = 0;
            $scope.minDuration = 0;
            $scope.message = 'Please Wait...';
            $scope.backdrop = true;
            $scope.promise = AppendixAPI.putAppendixFile(self.reportGuid, sectionGUID, fileGuid, file).then(function (data) {
                data.refreshAfter = true;
                $modalInstance.close(data);
            });
        }

        $scope.cancelUpdate = function () {
            $modalInstance.close();
        }
    }



    self.moveUpFile = function (index, section) {
        self.responseAlert = false;
        self.responseErrorAlert = false;
        var files = section.files;
        if (!files || !files.length || index <= 0) return;

        // var sectionID = section.sectionID;
        var sectionGUID = section.sectionGUID;
        files.move(index, index - 1);
        reorderFilesInAppendix(sectionGUID, files);
    }
    self.moveDownFile = function (index, section) {
        self.responseAlert = false;
        self.responseErrorAlert = false;
        var files = section.files;
        if (!files || !files.length || index >= (files.length - 1)) return;

        // var sectionID = section.sectionID;
        var sectionGUID = section.sectionGUID;
        files.move(index, index + 1);
        reorderFilesInAppendix(sectionGUID, files);
    }





    var fixHelper = function (e, ui) {
        ui.children().each(function () {
            $(this).width($(this).width());
        });
        return ui;
    };
    self.sortableOptions = {
        helper: fixHelper,
        cancel: ".unsortable",
        items: "tr:not(.unsortable)",
        update: function (e, ui) {
            /*var logEntry = tmpList.map(function(i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Update: ' + logEntry);*/
        },
        stop: function (e, ui) {
            // this callback has the changed model
            /*var logEntry = tmpList.map(function(i) {
                return i.value;
            }).join(', ');
            $scope.sortingLog.push('Stop: ' + logEntry);*/
            var model = ui.item.sortable.model;
            var files = ui.item.sortable.sourceModel;
            //var sectionID = model.sectionID;
            var sectionGUID = model.sectionGUID;
            reorderFilesInAppendix(sectionGUID, files);
        }
    };

    function extractPutDataForReordering(files) {
        var data = [];
        angular.forEach(files, function (file) {
            var obj = {
                fileGUID: file.fileGUID
            };
            data.push(obj);
        });
        return data;
    }

    function reorderFilesInAppendix(sectionGUID, files) {
        var data = extractPutDataForReordering(files);
        AppendixAPI.reorderAppendixFiles(self.reportGuid, sectionGUID, data).then(function (result) {
            // no response in API
            //loadUploadedFilesForSelectedSection(section, true);
        });
    }



    // uploader section

    /*
        var uploadHelper = {
            types: {
                default: "default",
                photo: "photo"
            },
            uploadUrl: {
                photo: "http://private-33015-parcelappendixapi.apiary-mock.com/photos/{reportID}/{sectionID}/upload?filename={filename}&caption={caption}",
                default: "http://private-33015-parcelappendixapi.apiary-mock.com/appendices/{reportID}/{sectionID}/upload?filename={filename}"
            }
        };
    	*/


    var uploadHelper = {
        types: {
            default: "default",
            photo: "photo"
        },
        uploadUrl: {
            photo: BASEURL.appendicesPOC + AppendicesUrlCollection.POSTAPI_APPENDIXPHOTO,
            default: BASEURL.appendicesPOC + AppendicesUrlCollection.POSTAPI_APPENDIXFILE
        }
    };


    function checkIfUploadFileImage(filename) {
         
         if(filename)
         {
              //return filename.endsWith('.jpg') || filename.endsWith('.JPG') ? true : false;
             return filename.split('.').pop().toLowerCase() === "jpg" ? true : false;
         }
       
    }

    function getfilenamewithoutextension(filename) {
        return filename.substring(0, filename.lastIndexOf('.'));
    }

    function formatUrl(url, queryParams) {
        if (!queryParams) return url;
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    }

    function createUploaderInstance(section) {
        var sectionID = section.sectionID;
        var sectionGuid = section.sectionGUID;
        var hasPhotos = section.hasPhotos;
        var fileNameString = "";
        var url = uploadHelper.uploadUrl[uploadHelper.types.default];
        var uploader = self.uploader = new FileUploader({
            url: url,
            //removeAfterUpload: true,
            sectionGuid: sectionGuid,
            filters: [],
            autoUpload: true
        });

        // CALLBACKS
        uploader.onBeforeUploadItem = function (item) {
            console.log("inside onBeforeUploadItem");
            fileNameString = "";

            self.responseAlert = false;
            self.responseErrorAlert = false;
            var filename = item.file.name;
            var url = item.url;
            var params = {
                    reportID: self.reportGuid,
                    sectionGuid: sectionGuid,
                    filename: filename

                }
         
            if(hasPhotos) {
                if (checkIfUploadFileImage(filename)) {
                    url = uploadHelper.uploadUrl[uploadHelper.types.photo];
                    params.caption = getfilenamewithoutextension(filename);
                }
            }
         
            item.url = formatUrl(url, params);
			item.headers ={
				UserGuid: AuthFactory.getUserDetailsFromStorage('EFF_USERGUID')
			}
            
        };
        uploader.onCompleteAll = function () {
            // clear queue and reload from service
            console.log("inside onCompleteAll");
            fileNameString = "";
            loadUploadedFilesForSelectedSection(section, true);
            $rootScope.$broadcast('appendixUploadImage', {});

            if (self.uploadSucces != undefined && self.uploadSucces.length > 0) {
                self.showUploadMessage(self.uploadSucces, "success")
            }
            if (self.uploadfailed != undefined && self.uploadfailed.length > 0) {
                self.showUploadMessage(self.uploadfailed, "danger")
            }


            self.uploadSucces = [];
            self.uploadfailed = [];
            section.uploader.clearQueue();
        };

        uploader.onSuccessItem = function (item, response, status, headers) {

            var successMessage = {
                "message": item.file.name + "  uploaded successfully"
            };


            self.uploadSucces.push(successMessage);

        };

        self.showUploadMessage = function (messageArray, type) {
            var fileNameString = "";
            angular.forEach(messageArray, function (message, index) {
                if (fileNameString != "") {
                    fileNameString = fileNameString + " " + message.message + "<br>";
                } else {
                    fileNameString = message.message + "<br>";
                }

            })
            if (type == "success") {
                self.showMessage(fileNameString, type);

            } else {
                self.showErrorMessage(fileNameString, type);
            }



        };
        uploader.onErrorItem = function (item, response, status, headers) {

            var failedMessage = {
                "message": item.file.name + " " + response.message.userMessage
            };


            self.uploadfailed.push(failedMessage);


        };

        uploader.filters.push({
            name: 'sizeFilter',
            fn: function (item) {
                if (item.size > BASEURL.APPENDIX_FILE_UPLOAD_SIZE_LIMIT) {
                    if (fileNameString != "") {
                        fileNameString = fileNameString + ", " + item.name;
                    } else {
                        fileNameString = item.name;
                    }
                    self.showMessage(fileNameString + " file size is more than 25MB", "danger");
                }

                return item.size < BASEURL.APPENDIX_FILE_UPLOAD_SIZE_LIMIT;

            }
        });

        uploader.onAfterAddingAll = function () {
            //fileNameString = "";			
        }
        uploader.onWhenAddingFileFailed = function () {
            fileNameString = "";
        }

        return uploader;
    }
    $scope.$on('appendixClearmessage', function (event, data) {
        self.responseAlert = false;
        self.responseErrorAlert = false;
    });

    function addUploaderInstanceToEverySection(sections) {
        angular.forEach(sections, function (section, index) {
            section.uploader = createUploaderInstance(section)
        });
    }


    // appendix tools
    self.toolClicked = function (tool, section) {
        var modalData = {
            tool: tool,
            refreshAfter: false
        };



        var appendixTool = AppendixTools[tool.url];
        if (appendixTool.openAsPage) {
            /*$state.go(tool.name, {
                modalData: modalData
            });*/

            /* var href = $state.href(tool.name, {
                modalData: modalData
            });
			*/
            var name = '';
            if (tool.url === 'appendixtools/questionnaire') {
                name = 'llpQuestionnaire';
            } else if (tool.url === 'appendixtools/addADAChecklist') {
                name = 'adaChecklist';
            }

            var href = $state.href(name, {
                modalData: modalData
            });
            var appendixToolWindow = window.open(href, {
                absolute: true
            }, "self");
            // console.log(appendixToolWindow);
            appendixToolWindow.onbeforeunload = function () {
                //  console.log(modalData);
            }
            return;
        }

        var toolModalInstance = $modal.open({
            templateUrl: appendixTool.templateUrl, //"app/modules/ReportAuthoring/views/llpQuestionnaire.html",
            controller: appendixTool.controller, //"llpQuestionnaireController as appendixTool",
            size: "lg",
            resolve: {
                modalData: function () {
                    return modalData;
                }
            }
        });

        toolModalInstance.result.then(function () {
            if (modalData.refreshAfter) {
                loadUploadedFilesForSelectedSection(section, true);
            }
        });

    };


    // helper
    Array.prototype.sum = function (prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop];
        }
        return total;
    }

    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this; // for testing purposes
    };

    /* comments tab starts */

    self.getReportComments = function () {
          if (sessionStorage.getItem("reportStatusAbbreviation") != 'FIN') {
        self.saveNewCommBtn = false;
        self.commentsErrorStatus = false;
        self.commentsErrorText = "";
        self.checkComments = false;
        self.newComm = false;
        self.serviceResponseAlert = true;
        var commentFilterSelected_appendices = localStorage.getItem('commentFilterSelected_appendices');
        if (commentFilterSelected_appendices != undefined && commentFilterSelected_appendices != null && commentFilterSelected_appendices != "") {

            self.selSection_Comments = commentFilterSelected_appendices;
            getCommentsByFilter(commentFilterSelected_appendices);


        } else {

            self.selSection_Comments = 0;
            getCommentsBySection();

        }

          }

    }

    function getCommentsBySection(sectionData) {
   
        $scope.commentsArr = [];
        self.commentsErrorStatus = false;
        self.commentsErrorText = "";

        var promise;
        if (sectionData) {
            promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, sectionData.sectionGUID);
        } else {
            promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, self.reportAppendices.selectedSection.sectionGUID);
        }
        self.waitingCommentsResources.promise = promise;
        return promise.then(function (resp) {

            $scope.commentsArr = [];
            for (var i = 0; i < resp.length; i++) {

                var sectionObj = {
                    "sectionGUID": "",
                    "sectionNumber": "",
                    "sectionName": "",
                    comments: [],
                    "noCommentsErrVal": ""


                }
                if (self.reportAppendices.selectedSection.sectionGUID.toLowerCase() == resp[i].sectionGUID.toLowerCase()) {

                    //  $scope.commentsArr.push(resp[i]);

                    if (resp[i].comments.length > 0) {
                        sectionObj.sectionGUID = self.reportAppendices.selectedSection.sectionGUID;
                        sectionObj.sectionNumber = self.reportAppendices.selectedSection.sectionNumber;
                        sectionObj.sectionName = self.reportAppendices.selectedSection.sectionName;
                        for (var j = 0; j < resp[i].comments.length; j++) {
                            var commObj = {
                                "Id": "",
                                "addressed": false,
                                "commentVal": "",
                                "addressedVal": "",
                                "commentedBy": "",
                                "addressedBy": "",
                                "date": "",
                                "addressedDate": ""
                            }
                            commObj.Id = resp[i].comments[j].commentGUID;
                            commObj.addressed = resp[i].comments[j].addressed;
                            commObj.commentVal = resp[i].comments[j].commentText;
                            commObj.commentedBy = resp[i].comments[j].createdBy.firstName + ' ' + resp[i].comments[j].createdBy.lastName;
                            if (resp[i].comments[j].addressed) {
                                if (resp[i].comments[j].responseComments != null && resp[i].comments[j].responseComments != undefined && resp[i].comments[j].responseComments != "") {
                                    commObj.addressedBy = resp[i].comments[j].responseComments[0].createdBy.firstName + ' ' + resp[i].comments[j].responseComments[0].createdBy.lastName;
                                    commObj.addressedVal = resp[i].comments[j].responseComments[0].commentText;
                                    commObj.addressedDate = resp[i].comments[j].responseComments[0].commentDate;
                                    //$filter('date')(new Date(resp[i].comments[j].responseComments[0].commentDate), 'MM/dd/yyyy HH:mm:ss');
                                }

                            }
                            // commObj.date = resp[i].comments[j].commentDate;
                            if (resp[i].comments[j].commentUpdated) {
                                commObj.date = resp[i].comments[j].updatedDate;
                            } else {
                                commObj.date = resp[i].comments[j].commentDate;
                            }
                            //$filter('date')(new Date(resp[i].comments[j].commentDate), 'MM/dd/yyyy HH:mm:ss');
                            sectionObj.comments.push(commObj);
                        }
                    }
                    $scope.commentsArr.push(sectionObj);
                    break;
                }
                // $scope.commentsArr.push(sectionObj);

            }
            checkCommentsStatus();
            if ($scope.commentsArr.length > 0) {
                if ($scope.commentsArr[0].comments.length == 0) {

                    self.commentsErrorText = "No Comments Found";
                    self.commentsErrorStatus = true;


                }
            } else {

                self.commentsErrorText = "No Comments Found";
                self.commentsErrorStatus = true;
            }

            $timeout(function () {
                ReportAuthoringAPI.managePanelHeight();
            });
            $('[data-toggle="tooltip"]').tooltip();

        }, function (error) {
            console.log("error");
            self.commentsErrorText = error;
            self.commentsErrorStatus = true;

        });



    }
 function checkCommentsStatus() {
        self.IsCommentChecked = false;
        self.selectedAll = false;
        self.checkComments = false;
        self.commentsErrorText = "";
        self.commentsErrorStatus = false;
        if ($scope.commentsArr.length > 0) {
            for (var i = 0; i < $scope.commentsArr.length; i++) {
                if ($scope.commentsArr[i]) {
                    if ($scope.commentsArr[i].comments.length > 0) {
                        self.checkComments = true;
                    } else {
                        $scope.commentsArr[i].noCommentsErrVal = "No Comments Found";
                    }
                }

            }
        } else {
            self.checkComments = false;
        }

        ReportAuthoringAPI.managePanelHeight();
    }
//    function checkCommentsStatus() {
//        self.IsCommentChecked = false;
//        self.selectedAll = false;
//        self.checkComments = false;
//        self.commentsErrorText = "";
//        self.commentsErrorStatus = false;
//        if ($scope.commentsArr.length > 0) {
//            for (var i = 0; i < $scope.commentsArr.length; i++) {
//                if ($scope.commentsArr[i]) {
//                    if ($scope.commentsArr[i].comments.length > 0) {
//                        self.checkComments = true;
//
//                    }
//                }
//            }
//        } else {
//            self.checkComments = false;
//        }
//
//        if (!self.checkComments) {
//            self.commentsErrorText = "No Comments Found";
//            self.commentsErrorStatus = true;
//        } else {
//            self.commentsErrorText = "";
//            self.commentsErrorStatus = false;
//
//        }
//        ReportAuthoringAPI.managePanelHeight();
//    }

    self.checkAll = function () {
        var isCommentsDeleted = localStorage.getItem('isCommentsDeleted');

        if (isCommentsDeleted) {

            self.selectAllText = "Uncheck All";
            self.selectedAll = true;
        } else {
            self.IsCommentChecked = true;
            if (self.selectedAll) {

                self.selectAllText = "Uncheck All";
                self.selectedAll = true;
            } else {
                self.selectAllText = "Check All";
                self.selectedAll = false;
            }

        }


        angular.forEach($scope.commentsArr, function (item) {

            if (item.comments != undefined && item.comments != null && item.comments != "") {
                angular.forEach(item.comments, function (commObj) {

                    commObj.Selected = self.selectedAll;
                    self.IsCommentChecked = commObj.Selected;
                });

            }

        });
        localStorage.removeItem('isCommentsDeleted');
    };

    self.commentCheck = function () {
        var flag = false;

        angular.forEach($scope.commentsArr, function (item) {
            if (item.comments != undefined && item.comments != null && item.comments != "") {
                angular.forEach(item.comments, function (commObj) {

                    if (commObj.Selected) {
                        flag = true;
                        return;
                    }


                });

            }

        });
        self.IsCommentChecked = flag;
    }

    self.openDeletePopup = function () {
        var modalInstance = $modal.open({
            templateUrl: "dllDeleteAll.html",
            scope: $scope,
            controller: deleteCommentsController,
            size: 0
        })
    }

    var deleteCommentsController = function ($scope, $modalInstance) {

        $scope.deleteComments = function () {

            $scope.comments = [];

            var deleteCommentArrObj = {
                "comments": $scope.comments
            };


            angular.forEach($scope.commentsArr, function (item) {


                for (var i = 0; i < item.comments.length; i++) {
                    var deleteCommentObj = {
                        "commentGUID": ""
                    }
                    if (item.comments[i].Selected) {
                        deleteCommentObj.commentGUID = item.comments[i].Id;
                        $scope.comments.push(deleteCommentObj);
                    }
                }



            });

            var promise = ReportAuthoringAPI.deleteComments(deleteCommentArrObj);

            return promise.then(function (resp) {
                var iflag = 0;
                for (var k = 0; k < deleteCommentArrObj.comments.length; k++) {
                    for (var i = 0; i < $scope.commentsArr.length; i++) {
                        for (var j = 0; j < $scope.commentsArr[i].comments.length; j++) {

                            if (deleteCommentArrObj.comments[k].commentGUID.toLowerCase() == $scope.commentsArr[i].comments[j].Id.toLowerCase()) {
                                $scope.commentsArr[i].comments.splice(j, 1);

                            }
                        }



                    }
                }
                checkCommentsStatus();

              $('#divSelAll_write label.active').removeClass('active');
                self.selectAllText = "Check All";
                self.selectedAll = true;
                localStorage.setItem('isCommentsDeleted', true);
                $modalInstance.close();
            });





        }



        $scope.CancelDelete = function () {

            $modalInstance.close();
        }
    }


    self.saveNewComments = function () {
        self.saveNewCommBtn = true;
        self.IsCommentChecked = false;
        self.selectedAll = false;
        var addCommentObj = {
            "comment": {
                "commentText": self.newCommentVal.replace(/\n/g, '<br>'),
                "commentType": {
                    "commentTypeGUID": "726D034A-9791-11E5-8226-0E29ED3D2A45"
                }
            }
        }

        var promise = ReportAuthoringAPI.add_update_Comments($stateParams.reportGuid, self.reportAppendices.selectedSection.sectionGUID, addCommentObj);

        return promise.then(function (resp) {

            var userDetails = JSON.parse(localStorage.getItem('userdetails'));

            if (userDetails) {
                var userName;
                for (var i = 0; i < userDetails.length; i++) {
                    if (userDetails[i].key === "FULLNAME") {
                        userName = userDetails[i].value;
                        self.userName = userName;
                    }

                }
            }

            self.commentsErrorStatus = false;
            self.commentsErrorText = "";
            var commObj = {
                "Id": resp.comment.commentGUID,
                "addressed": false,
                "commentVal": resp.comment.commentText,
                "addressedVal": "",
                "commentedBy": self.userName,
                "addressedBy": "",
                "date": ""
            }
            if (resp.comment.commentUpdated) {
                commObj.date = resp.comment.updatedDate;
            } else {
                commObj.date = resp.comment.commentDate;
            }

            if ($scope.commentsArr.length == 0) {
                var sectionObj = {
                    "sectionGUID": self.reportAppendices.selectedSection.sectionGUID,
                    "sectionNumber": self.reportAppendices.selectedSection.sectionNumber,
                    "sectionName": self.reportAppendices.selectedSection.sectionName,
                    comments: [],
                    "noCommentsErrVal": ""

                }
                sectionObj.comments.push(commObj);
                $scope.commentsArr.push(sectionObj);



            } else {
                for (var i = 0; i < $scope.commentsArr.length; i++) {
                    if ($scope.commentsArr[i].sectionGUID.toLowerCase() == self.reportAppendices.selectedSection.sectionGUID.toLowerCase()) {
                        $scope.commentsArr[i].noCommentsErrVal = "";
                        $scope.commentsArr[i].comments.unshift(commObj)
                        break;
                    }
                }
            }
            checkCommentsStatus();
            self.newComm = false;
            self.saveNewCommBtn = true;

        });


    };

    function getCommentsByFilter(filterVal, section) {
        $scope.commentsArr = [];
        self.commentsErrorStatus = false;
        self.commentsErrorText = "";

        if (filterVal == 0) {
            var promise;
            if (section) {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, section.sectionGUID);
            } else {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, self.reportAppendices.selectedSection.sectionGUID);
            }

            self.waitingCommentsResources.promise = promise;

            return promise.then(function (resp) {

                $scope.commentsArr = [];
                for (var i = 0; i < resp.length; i++) {
                    var sectionObj = {
                        "sectionGUID": "",
                        "sectionNumber": "",
                        "sectionName": "",
                        comments: [],
                        "noCommentsErrVal": ""

                    }

                    if (self.reportAppendices.selectedSection.sectionGUID.toLowerCase() == resp[i].sectionGUID.toLowerCase()) {

                        //  $scope.commentsArr.push(resp[i]);

                        if (resp[i].comments.length > 0) {
                            sectionObj.sectionGUID = self.reportAppendices.selectedSection.sectionGUID;
                            sectionObj.sectionNumber = self.reportAppendices.selectedSection.sectionNumber;
                            sectionObj.sectionName = self.reportAppendices.selectedSection.sectionName;
                            for (var j = 0; j < resp[i].comments.length; j++) {
                                var commObj = {
                                    "Id": "",
                                    "addressed": false,
                                    "commentVal": "",
                                    "addressedVal": "",
                                    "commentedBy": "",
                                    "addressedBy": "",
                                    "date": "",
                                    "addressedDate": ""
                                }
                                commObj.Id = resp[i].comments[j].commentGUID;
                                commObj.addressed = resp[i].comments[j].addressed;
                                commObj.commentVal = resp[i].comments[j].commentText;
                                commObj.commentedBy = resp[i].comments[j].createdBy.firstName + ' ' + resp[i].comments[j].createdBy.lastName;
                                if (resp[i].comments[j].addressed) {
                                    if (resp[i].comments[j].responseComments != null && resp[i].comments[j].responseComments != undefined && resp[i].comments[j].responseComments != "") {
                                        commObj.addressedBy = resp[i].comments[j].responseComments[0].createdBy.firstName + ' ' + resp[i].comments[j].responseComments[0].createdBy.lastName;
                                        commObj.addressedVal = resp[i].comments[j].responseComments[0].commentText;
                                        commObj.addressedDate = resp[i].comments[j].responseComments[0].commentDate;
                                    }

                                }
                                // commObj.date = resp[i].comments[j].commentDate;
                                if (resp[i].comments[j].commentUpdated) {
                                    commObj.date = resp[i].comments[j].updatedDate;
                                } else {
                                    commObj.date = resp[i].comments[j].commentDate;
                                }
                                sectionObj.comments.push(commObj);
                            }
                        }
                        $scope.commentsArr.push(sectionObj);
                        break;
                    }

                }

                checkCommentsStatus();

            }, function (error) {
                console.log("error");
                self.commentsErrorText = error;
                self.commentsErrorStatus = true;

            });
        } else if (filterVal == 1) {
            var promise;
            if (section) {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, section.sectionGUID);
            } else {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, self.reportAppendices.selectedSection.sectionGUID);
            }
            self.waitingCommentsResources.promise = promise;
            return promise.then(function (resp) {
                $scope.commentsArr = [];
                for (var i = 0; i < resp.length; i++) {
                    var sectionObj = {
                        "sectionGUID": "",
                        "sectionNumber": "",
                        "sectionName": "",
                        comments: [],
                         "noCommentsErrVal": ""

                    }
                    if (self.reportAppendices.selectedSection.sectionGUID.toLowerCase() == resp[i].sectionGUID.toLowerCase()) {

                        //  $scope.commentsArr.push(resp[i]);

                        if (resp[i].comments.length > 0) {
                            sectionObj.sectionGUID = self.reportAppendices.selectedSection.sectionGUID;
                            sectionObj.sectionNumber = self.reportAppendices.selectedSection.sectionNumber;
                            sectionObj.sectionName = self.reportAppendices.selectedSection.sectionName;
                            for (var j = 0; j < resp[i].comments.length; j++) {
                                if (!resp[i].comments[j].addressed) {
                                    var commObj = {
                                        "Id": "",
                                        "addressed": false,
                                        "commentVal": "",
                                        "addressedVal": "",
                                        "commentedBy": "",
                                        "addressedBy": "",
                                        "date": "",
                                        "addressedDate": ""
                                    }
                                    commObj.Id = resp[i].comments[j].commentGUID;
                                    commObj.addressed = resp[i].comments[j].addressed;
                                    commObj.commentVal = resp[i].comments[j].commentText;
                                    commObj.commentedBy = resp[i].comments[j].createdBy.firstName + ' ' + resp[i].comments[j].createdBy.lastName;
                                    if (resp[i].comments[j].addressed) {
                                        if (resp[i].comments[j].responseComments != null && resp[i].comments[j].responseComments != undefined && resp[i].comments[j].responseComments != "") {
                                            commObj.addressedBy = resp[i].comments[j].responseComments[0].createdBy.firstName + ' ' + resp[i].comments[j].responseComments[0].createdBy.lastName;
                                            commObj.addressedVal = resp[i].comments[j].responseComments[0].commentText;
                                            commObj.addressedDate = resp[i].comments[j].responseComments[0].commentDate;
                                        }

                                    }
                                    // commObj.date = resp[i].comments[j].commentDate;
                                    if (resp[i].comments[j].commentUpdated) {
                                        commObj.date = resp[i].comments[j].updatedDate;
                                    } else {
                                        commObj.date = resp[i].comments[j].commentDate;
                                    }
                                    sectionObj.comments.push(commObj);
                                }

                            }
                        }
                        $scope.commentsArr.push(sectionObj);
                        break;
                    }



                }
                checkCommentsStatus();

            }, function (error) {
                console.log("error");
                self.commentsErrorText = error;
                self.commentsErrorStatus = true;

            });




        } else if (filterVal == 2) {
            var promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid);
            self.waitingCommentsResources.promise = promise;
            return promise.then(function (resp) {
                $scope.commentsArr = [];

                for (var i = 0; i < resp.length; i++) {

                    var sectionObj = {
                        "sectionGUID": "",
                        "sectionNumber": "",
                        "sectionName": "",
                        comments: [],
                        "noCommentsErrVal": ""
                    }
                

                
                     if (resp[i].isAppendix) {
                        sectionObj.sectionGUID = resp[i].sectionGUID;
                        sectionObj.sectionNumber = resp[i].sectionNumber;
                        sectionObj.sectionName = resp[i].sectionTitle;
                        if (resp[i].hasComments && resp[i].comments.length > 0) {
                          
                                for (var j = 0; j < resp[i].comments.length; j++) {


                                    var commObj = {
                                        "Id": "",
                                        "addressed": false,
                                        "commentVal": "",
                                        "addressedVal": "",
                                        "commentedBy": "",
                                        "addressedBy": "",
                                        "date": "",
                                        "addressedDate": "",
                                        "canEdit": ""
                                    }
                                    commObj.Id = resp[i].comments[j].commentGUID;
                                    commObj.addressed = resp[i].comments[j].addressed;
                                    commObj.commentVal = resp[i].comments[j].commentText;
                                    commObj.commentedBy = resp[i].comments[j].createdBy.firstName + ' ' + resp[i].comments[j].createdBy.lastName;
                                    if (resp[i].comments[j].addressed) {
                                        if (resp[i].comments[j].responseComments != null && resp[i].comments[j].responseComments != undefined && resp[i].comments[j].responseComments != "") {
                                            commObj.addressedBy = resp[i].comments[j].responseComments[0].createdBy.firstName + ' ' + resp[i].comments[j].responseComments[0].createdBy.lastName;
                                            commObj.addressedVal = resp[i].comments[j].responseComments[0].commentText;
                                            commObj.addressedDate = resp[i].comments[j].responseComments[0].commentDate;
                                        }

                                    }

                                    if (resp[i].comments[j].commentUpdated) {
                                        commObj.date = resp[i].comments[j].updatedDate;
                                    } else {
                                        commObj.date = resp[i].comments[j].commentDate;
                                    }
                                    commObj.canEdit = resp[i].comments[j].canEdit;
                                    sectionObj.comments.push(commObj);
                                }

                                $scope.commentsArr.push(sectionObj);
                               
                            }
                          else
                            {
                                sectionObj.noCommentsErrVal = "No Comments Found";
                                $scope.commentsArr.push(sectionObj);
                            }
                           

                        }

               


                }



                //code to place comments of selected section on top

             

                checkCommentsStatus();

                //ends
                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                });
            }, function (error) {
                self.checkComments = false;
                self.commentsErrorText = error;
                self.commentsErrorStatus = true;

            });

        } else if (filterVal == 3) {
            var promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid);
            self.waitingCommentsResources.promise = promise;
            return promise.then(function (resp) {
                $scope.commentsArr = [];

                for (var i = 0; i < resp.length; i++) {

                    var sectionObj = {
                        "sectionGUID": "",
                        "sectionNumber": "",
                        "sectionName": "",
                        comments: [],
                        "noCommentsErrVal": ""
                    }
                

                
                     if (resp[i].isAppendix) {
                        sectionObj.sectionGUID = resp[i].sectionGUID;
                        sectionObj.sectionNumber = resp[i].sectionNumber;
                        sectionObj.sectionName = resp[i].sectionTitle;
                        if (resp[i].hasComments && resp[i].comments.length > 0) {
                          
                                for (var j = 0; j < resp[i].comments.length; j++) {


                                    var commObj = {
                                        "Id": "",
                                        "addressed": false,
                                        "commentVal": "",
                                        "addressedVal": "",
                                        "commentedBy": "",
                                        "addressedBy": "",
                                        "date": "",
                                        "addressedDate": "",
                                        "canEdit": ""
                                    }
                                    commObj.Id = resp[i].comments[j].commentGUID;
                                    commObj.addressed = resp[i].comments[j].addressed;
                                    commObj.commentVal = resp[i].comments[j].commentText;
                                    commObj.commentedBy = resp[i].comments[j].createdBy.firstName + ' ' + resp[i].comments[j].createdBy.lastName;
                                    if (resp[i].comments[j].addressed) {
                                        if (resp[i].comments[j].responseComments != null && resp[i].comments[j].responseComments != undefined && resp[i].comments[j].responseComments != "") {
                                            commObj.addressedBy = resp[i].comments[j].responseComments[0].createdBy.firstName + ' ' + resp[i].comments[j].responseComments[0].createdBy.lastName;
                                            commObj.addressedVal = resp[i].comments[j].responseComments[0].commentText;
                                            commObj.addressedDate = resp[i].comments[j].responseComments[0].commentDate;
                                        }

                                    }

                                    if (resp[i].comments[j].commentUpdated) {
                                        commObj.date = resp[i].comments[j].updatedDate;
                                    } else {
                                        commObj.date = resp[i].comments[j].commentDate;
                                    }
                                    commObj.canEdit = resp[i].comments[j].canEdit;
                                    if (!resp[i].comments[j].addressed) {
                                        sectionObj.comments.push(commObj);
                                    }
                                 
                                }

                                $scope.commentsArr.push(sectionObj);
                               
                            }
                          else
                            {
                                sectionObj.noCommentsErrVal = "No Comments Found";
                                $scope.commentsArr.push(sectionObj);
                            }
                           

                        }

               


                }



                //code to place comments of selected section on top

             

                checkCommentsStatus();

                //ends
                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                });
            }, function (error) {
                self.checkComments = false;
                self.commentsErrorText = error;
                self.commentsErrorStatus = true;

            });

        }



        //check uncheck comments
        angular.forEach($scope.commentsArr, function (item) {

            if (item.comments != undefined && item.comments != null && item.comments != "") {
                angular.forEach(item.comments, function (commObj) {

                    commObj.Selected = self.selectedAll;

                });

            }

        });

        checkCommentsStatus();
    }

    self.sectionChanged = function () {
        localStorage.setItem('commentFilterSelected_appendices', self.selSection_Comments);
        $('#divSelAll_write label.active').removeClass('active');
        self.selectAllText = "Check All";
        self.selectedAll = true;
        $scope.commentsArr = [];

        if (self.selSection_Comments == 0) {


            getCommentsByFilter(0);


        } else if (self.selSection_Comments == 1) {
            getCommentsByFilter(1);


        } else if (self.selSection_Comments == 2) {
            getCommentsByFilter(2);

        } else if (self.selSection_Comments == 3) {
            getCommentsByFilter(3);



        }

    }

    self.refreshComments = function () {

        $timeout(function () {
            console.log('in appendices refresh comments.');
            checkCommentsStatus();
            $('#divSelAll_write label.active').removeClass('active');
            self.selectAllText = "Check All";
            self.selectedAll = true;
            if (self.selSection_Comments == 0) {
                getCommentsBySection();
            } else if (self.selSection_Comments == 1) {
                getCommentsByFilter(1);
            } else if (self.selSection_Comments == 2) {
                getCommentsByFilter(2);
            } else if (self.selSection_Comments == 3) {
                getCommentsByFilter(3);
            }
        });
    }

    self.editComment = function (commentObj) {
        commentObj.EditCommentVal = commentObj.commentVal.replace(/<br>/g, '\n');
    }

    self.editAddressComment = function (commentObj) {
        if (commentObj.commentEditState) {
            if (!commentObj.EditCommentVal) return;

            var editCommentObj = {
                "comment": {
                    "commentGUID": commentObj.Id,
                    "commentText": commentObj.EditCommentVal.replace(/\n/g, '<br>'),
                    "commentUpdated": true
                }
            }

            var promise = ReportAuthoringAPI.add_update_Comments($stateParams.reportGuid, self.reportAppendices.selectedSection.sectionGUID, editCommentObj);

            return promise.then(function (resp) {
                if (resp.comment.commentUpdated) {
                    commentObj.date = resp.comment.updatedDate;
                } else {
                    commentObj.date = resp.comment.commentDate;
                }
                commentObj.commentVal = resp.comment.commentText;
                commentObj.commentEditState = false;
            });
        } else {
            var addressCommentObj = {
                "comment": {
                    "commentGUID": commentObj.Id,
                    "commentResponse": true,
                    "responseComments": [{
                        "commentText": commentObj.addressComment.replace(/\n/g, '<br>')
                    }]
                }
            }

            var promise = ReportAuthoringAPI.add_update_Comments($stateParams.reportGuid, self.reportAppendices.selectedSection.sectionGUID, addressCommentObj);

            return promise.then(function (resp) {
                var userDetails = JSON.parse(localStorage.getItem('userdetails'));
                if (userDetails) {
                    var userName;
                    for (var i = 0; i < userDetails.length; i++) {
                        if (userDetails[i].key === "FULLNAME") {
                            userName = userDetails[i].value;
                            self.userName = userName;
                        }
                    }
                }

                commentObj.addressedBy = self.userName;
                commentObj.addressedDate = resp.comment.responseComments[0].commentDate;
                commentObj.addressedVal = resp.comment.responseComments[0].commentText;

                commentObj.addressState = false;
                commentObj.addressed = true;
                if (self.selSection_Comments == 3 || self.selSection_Comments == 1) {
                    var commLength = 0;
                    for (var i = 0; i < $scope.commentsArr.length; i++) {
                        for (var j = 0; j < $scope.commentsArr[i].comments.length; j++) {
                            if ($scope.commentsArr[i].comments[j].Id == commentObj.Id) {
                                $scope.commentsArr[i].comments.splice(j, 1);
                                break;
                            }
                        }

                        if ($scope.commentsArr[i].comments.length > 0) {
                            commLength = 1;
                        }
                    }

                    if (commLength == 0) {
                        self.commentsErrorText = "No Comments Found";
                        self.commentsErrorStatus = true;
                    }
                }

            });
        }
    }

    self.CloseAll = function () {

        for (var i = 0; i < $scope.commentsArr.length; i++) {
            for (var j = 0; j < $scope.commentsArr[i].comments.length; j++) {

                //comment
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").addClass('collapse');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").removeClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").removeClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment-span").hide();

                //address
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").addClass('collapse');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").removeClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").removeClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address-span").hide();
            }
        }


    }

    self.OpenAll = function () {

        for (var i = 0; i < $scope.commentsArr.length; i++) {
            for (var j = 0; j < $scope.commentsArr[i].comments.length; j++) {

                //comment
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").addClass('collapse in');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").addClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").addClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment-span").show();

                //address
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").addClass('collapse in');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").addClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").addClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address-span").show();
            }
        }


    }

    self.setIconComment = function (val, commentId) {
        console.log("class: " + val);
        $("#" + commentId + "-comment").removeClass();
        $("#" + commentId + "-comment").addClass(val);
        if (val == 'collapse') {
            $("#" + commentId + "-plus-comment").removeClass('ng-hide');
            $("#" + commentId + "-plus-comment-span").removeClass('ng-hide');
            $("#" + commentId + "-plus-comment").show();
            $("#" + commentId + "-plus-comment-span").show();
            $("#" + commentId + "-minus-comment").hide();
            $("#" + commentId + "-minus-comment-span").hide();

        } else {
            $("#" + commentId + "-plus-comment").hide();
            $("#" + commentId + "-plus-comment-span").hide();
            $("#" + commentId + "-minus-comment").show();
            $("#" + commentId + "-minus-comment-span").show();
        }
        //self.expanddivComment = val;
    }

    self.setIconAddress = function (val, commentId) {
        $("#" + commentId + "-address").removeClass();
        $("#" + commentId + "-address").addClass(val);
        if (val == 'collapse') {
            $("#" + commentId + "-plus-address").removeClass('ng-hide');
            $("#" + commentId + "-plus-address-span").removeClass('ng-hide');
            $("#" + commentId + "-plus-address").show();
            $("#" + commentId + "-plus-address-span").show();
            $("#" + commentId + "-minus-address").hide();
            $("#" + commentId + "-minus-address-span").hide();

        } else {
            $("#" + commentId + "-plus-address").hide();
            $("#" + commentId + "-plus-address-span").hide();
            $("#" + commentId + "-minus-address").show();
            $("#" + commentId + "-minus-address-span").show();
        }
    }

    /* comments tab ends */
    ReportAuthoringAPI.managePanelHeight();

    ///PDF Geneartion Section Start

    self.dismissAlertMsg = function () {
        self.downloadMsg = '';
    }

    self.viewPDF = function (generationType) {
        createPDFGenerationRequest(generationType);
    }

    function createPDFGenerationRequest(type) {
        var generationTypes = [];
        generationTypes.push('APPENDIX');
        generationTypes.push(type);
        var reqObj = getCreatePDFGenerationRequestObj(generationTypes, self.reportAppendices.selectedSection.sectionGUID);

        var createReportGenerationRequestPromise = ReportOutputService.createReportGenerationRequest(self.reportGuid, reqObj);
        self.waitingProcessResources.promise = createReportGenerationRequestPromise;

        createReportGenerationRequestPromise.then(function (result) {
            if (result.reportGeneration && result.reportGeneration.constructedDocumentGUID) {
                console.log('ReportGenerationRequest created...!');
                getConstructedDocument(result.reportGeneration.constructedDocumentGUID);
            } else {
                if (result.message)
                    self.showMessage(result.message.userMessage, "danger");
            }
        }, function (error) {
            self.showMessage("Failed to create pdf.", "danger");
        })

    }

    function getCreatePDFGenerationRequestObj(generationTypes, sectionguid) {
        return obj = {
            "reportGeneration": {
                "generationType": generationTypes,
                "includedSections": [
                    {
                        "reportGenerationSectionGUID": sectionguid,
                        "settingsValue": ""
                                }
                            ],
                "reorderLetteringOfAppendices": true,
                "deliveryOption": "DOWNLOAD"
                    /*"deliveryOption": "Download (default) or Email are the only options available at this time, value of Email will require the emailOptions JSON section below",
                    "emailOptions": {
                      "sendEmails": [
                        {
                          "sendEmail": "jdoe@test.com",
                          "sendUserGUID": "value here if user is a parcel user otherwise null",
                          "sendType": "To or CC or BCC"
                        }
                      ],
                      "sendFromEmailAddress": "from@edrnet.com",
                      "sendFromName": "EDR",
                      "sendFromUserGUID": "A0F5E294-B497-4C16-8FA4-526C9413530F",
                      "subject": "",
                      "body": ""
                    }*/
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
                if (response.message)
                    self.showMessage(result.message.userMessage, "danger");

            }
            //handle error here
        }, function (error) {
            if (response.message)
                self.showMessage(result.message.userMessage, "danger");
        })

    }

    function getGeneratedPDF(coreFileGuid) {
        var generatedUrl = ReportOutputService.buidGeneratedDocUrl(coreFileGuid);
        var win = window.open(generatedUrl, '_blank');
        win.focus();
    }
    // PFD Generation Section Ends.

}]);
