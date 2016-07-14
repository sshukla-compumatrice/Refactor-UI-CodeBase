angular.module('PortfolioCreation').controller('PortfolioAttachmentCtrl', ['$scope', '$log', 'Upload', '$timeout', '$window', function ($scope, $log, Upload, $timeout, $window) {

    $scope.portfolio.currentSection = $scope.portfolio.sectionCollection.AttachDocuments;

    var self = this;
    self.attachmentFiles = [];
    self.UploadSuccessMsg = "";
    self.UploadErrorMsg = "";
    self.IncorrectFormat = "";
    self.isUploadErrorMsg = false;
    self.serviceResponseAlert = false;
    /*var attachmentsControllerLogger = $log.getInstance('PortfolioCreation.portfolioAttachmentCtrl');

    attachmentsControllerLogger.info("attachments controller reached");*/

    $("#ulnavigation .active").removeClass('active');
    $("#ulnavigation #Attachments").addClass('active');

    $scope.fnconvertsize = function (sizeinbytes) {

        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (sizeinbytes == 0)
            var convertedsize = '0 Byte';
        var i = parseInt(Math.floor(Math.log(sizeinbytes) / Math.log(1024)));
        convertedsize = Math.round(sizeinbytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        return convertedsize;
    }

    function loadData() {
        var project = angular.copy($scope.portfolio.project);
        if (!project.attachments || !project.attachments.length) return;

        self.formattedAttachments = angular.copy(project.attachments);
        var attachments = project.attachments;

        self.attachmentFiles = attachments;
        angular.forEach(self.attachmentFiles, function (file) {
            file.name = file.fileName;
            if (file.base64) {
                var inputfilesize = window.localStorage.getItem("inputfilesize");
                file.size = $scope.fnconvertsize(inputfilesize);
            }

        });
    }
    loadData();

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

    function convertAttachedFilesToBase64() {
        if (!$scope.files || !$scope.files.length) {
            return;
        } else {
            self.attachmentFilesExists = true;
        }

        var files = $scope.files;
        for (var i = 0, completedCount = 0; i < files.length; i++) {
            var file = files[i];
            file.convertToBase64(function (base64, attachedFile) {

                var attach = angular.copy(attachedFile);
                attach.base64 = base64;
                attach.size = $scope.fnconvertsize(attach.size);
                self.attachmentFiles.push(attach);
                completedCount++;
                if (completedCount == files.length) {
                    // callback invoked via non-angular code (FileReader.onload)
                    // need to apply changes to scope
                    $scope.$apply();
                    // set attachments to parent submit object
                    setSubmitDataAttachmentsFromLocal();
                }
            });
        }

        // clear files after processing
        $scope.files = [];
    }

    $scope.$watchCollection("files", function () {
        convertAttachedFilesToBase64();
    });
    /*self.submitToAttachFiles = function () {
        convertAttachedFilesToBase64();
    }*/



    function setSubmitDataAttachmentsFromLocal() {
        self.formattedAttachments = [];
        angular.forEach(self.attachmentFiles, function (attachment) {
            var obj = {
                fileName: attachment.name,
                base64: attachment.base64,
                attachmentGUID: attachment.attachmentGUID,
                description: attachment.description
            }
            self.formattedAttachments.push(obj);
        });
    }

    //    $scope.$watch('files', function() {
    //        $scope.upload($scope.files);
    //    });
    // set default directive values
    // Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
    this.upload = function () {
        self.UploadErrorMsg = "";
        self.isUploadErrorMsg = false;

        var files = $scope.files;

        if (!files || files.length <= 0) {

            self.isUploadErrorMsg = true;
            self.UploadErrorMsg += "Please attach files before trying to upload.";
            return;
        }
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                //                    fields: {
                //                        'username': $scope.username
                //                    },
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                //console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
                self.attachmentFiles.push({
                    name: data.result[0].name,
                    size: data.result[0].size
                });

                console.log("successssssssssssssss");
                self.serviceResponseAlert = true;
                self.responseType = 'success';
                self.serviceResponseText = "File uploaded successfully.";
            }).error(function (data, status, headers, config) {
                //console.log('error status: ' + status);
                self.isUploadErrorMsg = true;
                self.UploadErrorMsg += "Failed to upload file '" + config.file.name + "'. Status: " + status + ".\n";
            })
        }

    };

    this.removeAttachment = function (index) {
        removeFileFromCollection(index);
    };

    var removeFileFromCollection = function (index) {
        if (!self || !self.attachmentFiles) return;
        self.attachmentFiles.splice(index, 1);
        /* for (var i = 0; i < self.attachmentFiles.length; i++) {
             var file = self.attachmentFiles[i];
             if (index == i) {
                
             }
         }
         */

        // update data modal
        setSubmitDataAttachmentsFromLocal();
    }


    self.enableAttachedFileEdit = function (file, index) {
        file.editDesc = true;
        $timeout(function () {
            var inputFieldId = "fileDesc_" + index;
            var element = $window.document.getElementById(inputFieldId);
            if (element)
                element.focus();
        });
    };

    // empty main getSubmitData
    // to need to submit data in this view
    var main = $scope.portfolio;
    main.getSubmitData = function () {
        var data = angular.copy($scope.portfolio.project);
        data.attachments = self.formattedAttachments;

        if (data.attachments && data.attachments.length)
            for (var i = 0; i < data.attachments.length; i++) {
                var item = data.attachments[i];
                delete item.description;
            }

        return data;
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

}]);
