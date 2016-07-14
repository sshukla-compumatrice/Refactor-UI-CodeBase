angular.module('ProjectCreation').controller('ProjectDocumentsController', ['$scope', '$modal', 'ProjectSearchAPI', '$location', 'BASEURL', '$timeout', '$stateParams', '$window', function ($scope, $modal, ProjectSearchAPI, $location, BASEURL, $timeout, $stateParams, $window) {

    $scope.files = [];
    $scope.clientDocArr = [];
    $scope.generalDocArr = [];
    $scope.invoicesArr = [];
    $scope.reportsArr = [];


    $scope.fileErrorDanger = false;
    $scope.fileErrorTextDanger = "";
    $scope.fileErrorSuccess = false;
    $scope.fileErrorTextSuccess = "";
    $scope.fileErrorDangerFileType = false;
    $scope.fileErrorTextDangerFileType = "";
    $scope.fileErrorDangerFileSize = false;
    $scope.fileErrorTextDangerFileSize = "";

    $scope.clientFolderGUID = "";
    $scope.generalFolderGUID = "";
    $scope.invoiceFolderGUID = "";
    $scope.reportsFolderGUID = "";
    $scope.btnText = "Upload";
    $scope.serviceResponseAlertDanger = false;
    $scope.serviceResponseAlertSuccess = false;
    init();

    function init() {

        getFiles();

    }

	$scope.closeProjectdocumentwindow = function () {
        $window.close();
    }
	
    function getFiles() {

        var promise = ProjectSearchAPI.getFolders($stateParams.projectGuid)
        promise.then(function (result) {




            angular.forEach(result, function (document) {



                if (document.documentType.toLowerCase() == "client") {
                    $scope.clientFolderGUID = document.folderGUID;
                    angular.forEach(document.files, function (file) {
                        file.downloadURL = "";
                        file.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + file.fileGUID + '/stream';
                        $scope.clientDocArr.push(file);

                    });

                } else if (document.documentType.toLowerCase() == "general") {
                    $scope.generalFolderGUID = document.folderGUID;
                    angular.forEach(document.files, function (file) {
                        file.downloadURL = "";
                        file.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + file.fileGUID + '/stream';
                        $scope.generalDocArr.push(file);
                    });

                } else if (document.documentType.toLowerCase() == "invoices") {
                    $scope.invoiceFolderGUID = document.folderGUID;
                    angular.forEach(document.files, function (file) {
                        file.downloadURL = "";
                        file.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + file.fileGUID + '/stream';
                        $scope.invoicesArr.push(file);
                    });

                } else if (document.documentType.toLowerCase() == "reports") {
                    $scope.reportsFolderGUID = document.folderGUID;
                    angular.forEach(document.files, function (file) {

                        file.downloadURL = "";
                        file.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + file.fileGUID + '/stream';
                        $scope.reportsArr.push(file);
                    });

                }




            });
            $timeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
            })





            //            $scope.fileArr=result;
            //            angular.forEach($scope.fileArr, function (file) {
            //             
            //                file.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + file.fileGUID + '/stream';
            //                $scope.clientDocArr.push(file);
            //            });

        });

    }

    $scope.uploadFiles = function () {
        // console.log("no of files: " + files.length);

        if ($scope.file) {

            if ($scope.file.length <= BASEURL.maxNumberOfFile) {

                var docType = $scope.docType;
                if (docType && docType != 0) {
                    saveFile($scope.file, docType);
                } else {
                    $('#selProjectDocuments').trigger('blur');
                    $scope.fileErrorDanger = true;

                    $scope.fileErrorTextDanger = "Please select document type.";
                }

            } else {
                $scope.fileErrorDanger = true;

                $scope.fileErrorTextDanger = "Maximum number of files exceeded. You can upload upto " + BASEURL.maxNumberOfFile + " files only.";

            }

        } else {

            $('#selProjectDocuments').trigger('blur');
            $scope.fileErrorDanger = true;
            $scope.fileErrorTextDanger = "Please attach file in order to upload.";

        }
        // files =[];

    }


    function saveFile(files, docType) {

        $scope.fileError = false;
        $scope.fileErrorText = "";
        $scope.bigSizeFiles = [];
        $scope.invalidFileTypeFiles = [];
        
         $scope.originalFileUploadedArr = [];
          angular.forEach(files, function (singleFile) {
              $scope.originalFileUploadedArr.push(singleFile);
          });
        
        for (var i = 0; i < files.length; i++) {
            var fileObj = "";
            $scope.btnText = "Uploading.Please Wait...";
            var file = files[i];

            //   file.convertToBase64(function (base64, attachedFile) {
            //                var attach = angular.copy(attachedFile);
            //                attach.fileName = attachedFile.name;
            //               // attach.base64 = base64;
            //                attach.size = $scope.fnconvertsize(attach.size);
            //                // $scope.clientDocArr.push(attach);
            //                attach.folderGUID = $scope.clientFolderGUID;

            if (file.size > BASEURL.maxSizeOfFile) {
                var bigSizefileObj = {
                    "fileName": file.name,

                }
                $scope.bigSizeFiles.push(bigSizefileObj);
                checkFileSizeOrType();

            } else {

                //if (file.type == "application/vnd.ms-excel" || file.type == "application/pdf" || file.type == "image/jpeg" || file.type == "text/plain") {

                    var inputFile = file;
                    switch (docType) {
                    case '1':
                        var fileObj = {
                            "fileName": file.name,
                            "fileDescription": file.name + ', size:' + $scope.fnconvertsize(file.size),
                            "displayIndex": 0,
                            "retentionInDays": -1,
                            "deletionType": "DISABLE",
                            "folderGUID": $scope.clientFolderGUID,
                            "availabilityTier": "TIER1",
                            "physicalPathPreDate": "Accounts/Companies/535656ED-03A7-45F3-96EE-8AF9AC3CF0FE/GlobalFiles",
                            "physicalPathAddDate": false,
                            "physicalPathPostDate": ""
                        }

                        var fileRequestJson = {
                            "file": fileObj
                        };


                        var promise = ProjectSearchAPI.uploadFiles(inputFile, fileRequestJson);
                        promise.then(function (result) {
                            console.log("originally uploaded files details: " + JSON.stringify($scope.originalFileUploadedArr));
                            files = [];
                            $scope.btnText = "Upload";
                            var fileResult = result;
                            fileResult.fileGUID = result.fileGUID;
                            fileResult.fileName = fileObj.fileName;
                            fileResult.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + result.fileGUID + '/stream';
                            $scope.clientDocArr.push(fileResult);

                            $scope.fileErrorSuccess = true;
                            $scope.fileErrorTextSuccess = "File uploaded successfully.";
                            $scope.docType = 0;
                            checkFileSizeOrType();
                            $scope.file = null;

                        }, function (error) {

                            $scope.fileErrorDanger = true;

                            $scope.fileErrorTextDanger = "File upload failed for Client Documents. " + error.data.message.userMessage;
                            $scope.btnText = "Upload";

                        })


                        break;
                    case '2':
                        var fileObj = {
                            "fileName": file.name,
                            "fileDescription": file.name + ', size:' + $scope.fnconvertsize(file.size),
                            "displayIndex": 0,
                            "retentionInDays": -1,
                            "deletionType": "DISABLE",
                            "folderGUID": $scope.generalFolderGUID,
                            "availabilityTier": "TIER1",
                            "physicalPathPreDate": "Accounts/Companies/535656ED-03A7-45F3-96EE-8AF9AC3CF0FE/GlobalFiles",
                            "physicalPathAddDate": false,
                            "physicalPathPostDate": ""
                        }

                        var fileRequestJson = {
                            "file": fileObj
                        };


                        var promise = ProjectSearchAPI.uploadFiles(inputFile, fileRequestJson);
                        promise.then(function (result) {

                            $scope.btnText = "Upload";
                            var fileResult = result;
                            fileResult.fileGUID = result.fileGUID;
                            fileResult.fileName = fileObj.fileName;
                            fileResult.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + result.fileGUID + '/stream';
                            $scope.generalDocArr.push(fileResult);

                            $scope.fileErrorSuccess = true;

                            $scope.fileErrorTextSuccess = "File uploaded successfully.";
                            $scope.docType = 0;

                            checkFileSizeOrType();
                            $scope.file = null;

                        }, function (error) {
                            $scope.fileErrorDanger = true;

                            $scope.fileErrorTextDanger = "File upload failed for General Documents. " + error.data.message.userMessage;
                            $scope.btnText = "Upload";
                            //  $scope.docType = 0;
                        })

                        break;
                    case '3':
                        var fileObj = {
                            "fileName": file.name,
                            "fileDescription": file.name + ', size:' + $scope.fnconvertsize(file.size),
                            "displayIndex": 0,
                            "retentionInDays": -1,
                            "deletionType": "DISABLE",
                            "folderGUID": $scope.invoiceFolderGUID,
                            "availabilityTier": "TIER1",
                            "physicalPathPreDate": "Accounts/Companies/535656ED-03A7-45F3-96EE-8AF9AC3CF0FE/GlobalFiles",
                            "physicalPathAddDate": false,
                            "physicalPathPostDate": ""
                        }

                        var fileRequestJson = {
                            "file": fileObj
                        };


                        var promise = ProjectSearchAPI.uploadFiles(inputFile, fileRequestJson);
                        promise.then(function (result) {

                            $scope.btnText = "Upload";
                            var fileResult = result;
                            fileResult.fileGUID = result.fileGUID;
                            fileResult.fileName = fileObj.fileName;
                            fileResult.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + result.fileGUID + '/stream';
                            $scope.invoicesArr.push(fileResult);

                            $scope.fileErrorSuccess = true;

                            $scope.fileErrorTextSuccess = "File uploaded successfully.";
                            $scope.docType = 0;
                            checkFileSizeOrType();
                            $scope.file = null;

                        }, function (error) {
                            $scope.fileErrorDanger = true;

                            $scope.fileErrorTextDanger = "File upload failed for Invoices." + error.data.message.userMessage;
                            $scope.btnText = "Upload";
                            //  $scope.docType = 0;
                        })

                        break;
                    case '4':
                        var fileObj = {
                            "fileName": file.name,
                            "fileDescription": file.name + ', size:' + $scope.fnconvertsize(file.size),
                            "displayIndex": 0,
                            "retentionInDays": -1,
                            "deletionType": "DISABLE",
                            "folderGUID": $scope.reportsFolderGUID,
                            "availabilityTier": "TIER1",
                            "physicalPathPreDate": "Accounts/Companies/535656ED-03A7-45F3-96EE-8AF9AC3CF0FE/GlobalFiles",
                            "physicalPathAddDate": false,
                            "physicalPathPostDate": ""
                        }

                        var fileRequestJson = {
                            "file": fileObj
                        };


                        var promise = ProjectSearchAPI.uploadFiles(inputFile, fileRequestJson);
                        promise.then(function (result) {

                            $scope.btnText = "Upload";
                            var fileResult = result;
                            fileResult.fileGUID = result.fileGUID;
                            fileResult.fileName = fileObj.fileName;
                            fileResult.downloadURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + result.fileGUID + '/stream';
                            $scope.reportsArr.push(fileResult);


                            $scope.fileErrorSuccess = true;

                            $scope.fileErrorTextSuccess = "File uploaded successfully.";
                            $scope.docType = 0;
                            checkFileSizeOrType();
                            $scope.file = null;

                        }, function (error) {
                            $scope.fileErrorDanger = true;

                            $scope.fileErrorTextDanger = "File upload failed for Reports. " + error.data.message.userMessage;
                            $scope.btnText = "Upload";
                            //  $scope.docType = 0;
                        })

                        break;
                    default:
                        break;


                    }


                //} 
                /*else {


                    var invalidFileTypeObj = {
                        "fileName": file.name,

                    }
                    $scope.invalidFileTypeFiles.push(invalidFileTypeObj);
                    checkFileSizeOrType();
                }*/

            }

           

        }



    }


    function checkFileSizeOrType() {
        if ($scope.bigSizeFiles.length > 0) {
            var fileDesc = "";

            for (var j = 0; j < $scope.bigSizeFiles.length; j++) {
                fileDesc = $scope.bigSizeFiles[j].fileName + ", " + fileDesc;

            }

            $scope.fileErrorDangerFileSize = true;

            $scope.fileErrorTextDangerFileSize = "File upload failed. Maximum size limit exceeded for - " + fileDesc;



        }

        if ($scope.invalidFileTypeFiles.length > 0) {

            var fileDesc = "";

            for (var j = 0; j < $scope.invalidFileTypeFiles.length; j++) {
                fileDesc = $scope.invalidFileTypeFiles[j].fileName + ", " + fileDesc;

            }

            $scope.fileErrorDangerFileType = true;

            $scope.fileErrorTextDangerFileType = "File upload failed. File type is not allowed for - " + fileDesc;


        }
        $scope.docType = 0;
        $scope.btnText = "Upload";
    }

    function setSubmitDataAttachmentsFromLocal() {
        $scope.data.attachments = [];
        angular.forEach($scope.clientDocArr, function (attachment) {
            var obj = {
                fileName: attachment.name,
                base64: attachment.base64
            }
            $scope.data.attachments.push(obj);
        });
    }

    File.prototype.convertToBase64 = function (callback) {
        var file = this;
        var FR = new FileReader();
        FR.onload = function (e) {
            var base64 = removeNoiseFromDataUrlOfBase64(e.target.result);
            callback(base64, file);
        };
        FR.readAsDataURL(this);
    };

    function removeNoiseFromDataUrlOfBase64(dataUrl) {
        return dataUrl.indexOf("base64") >= 0 ? dataUrl.split("base64,")[1] : dataUrl;
    }

    $scope.fnconvertsize = function (sizeinbytes) {

        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (sizeinbytes == 0)
            var convertedsize = '0 Byte';
        var i = parseInt(Math.floor(Math.log(sizeinbytes) / Math.log(1024)));
        convertedsize = Math.round(sizeinbytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        return convertedsize;
    }

    $scope.openDeletePopup = function (fileGUID, folderType) {

        var modalInstance = $modal.open({
            templateUrl: "dllDelete.html",
            scope: $scope,
            controller: deleteFileController,
            size: 0
        });
        modalInstance.fileGuidToBeDeleted = fileGUID;
        modalInstance.folderType = folderType;
    }

    var deleteFileController = function ($scope, $modalInstance) {

        $scope.deleteFile = function () {
            var promise = ProjectSearchAPI.deleteFiles($modalInstance.fileGuidToBeDeleted)
            promise.then(function (result) {

                if ($modalInstance.folderType == 1) {
                    for (var i = 0; i < $scope.clientDocArr.length; i++) {
                        if ($scope.clientDocArr[i].fileGUID.toLowerCase() == $modalInstance.fileGuidToBeDeleted.toLowerCase()) {
                            $scope.clientDocArr.splice(i, 1);
                            $modalInstance.close();
                            break;
                        }
                    }

                } else if ($modalInstance.folderType == 2) {
                    for (var i = 0; i < $scope.invoicesArr.length; i++) {
                        if ($scope.invoicesArr[i].fileGUID.toLowerCase() == $modalInstance.fileGuidToBeDeleted.toLowerCase()) {
                            $scope.invoicesArr.splice(i, 1);
                            $modalInstance.close();
                            break;
                        }
                    }




                } else if ($modalInstance.folderType == 3) {
                    for (var i = 0; i < $scope.generalDocArr.length; i++) {
                        if ($scope.generalDocArr[i].fileGUID.toLowerCase() == $modalInstance.fileGuidToBeDeleted.toLowerCase()) {
                            $scope.generalDocArr.splice(i, 1);
                            $modalInstance.close();
                            break;
                        }
                    }
                } else if ($modalInstance.folderType == 4) {
                    for (var i = 0; i < $scope.reportsArr.length; i++) {
                        if ($scope.reportsArr[i].fileGUID.toLowerCase() == $modalInstance.fileGuidToBeDeleted.toLowerCase()) {
                            $scope.reportsArr.splice(i, 1);
                            $modalInstance.close();
                            break;
                        }
                    }

                }
                $scope.btnText = "Upload";
                $scope.docType = 0;
                $scope.fileError = true;
                $scope.fileStatusClass = "alert-success";
                $scope.fileErrorText = "File deleted successfully.";

            });

        }

        $scope.CancelDelete = function () {

            $modalInstance.close();
        }
    }



}]);