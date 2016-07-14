angular.module('PortfolioCreation').controller('LenderPortfolioAttachmentCtrl', ['$scope', '$log', 'Upload', function($scope, $log, Upload) {

    var self = this;
    var main = $scope.lenderPortfolio;

    self.attachmentFiles = [];
    self.UploadSuccessMsg = "";
    self.UploadErrorMsg = "";
    self.IncorrectFormat = "";
    self.isUploadErrorMsg = false;



    function loadData() {
        var project = angular.copy(main.project);
        if (!project.attachments || !project.attachments.length) return;

        self.formattedAttachments = angular.copy(project.attachments);
        var attachments = project.attachments;
        self.attachmentFiles = attachments;
        angular.forEach(self.attachmentFiles, function(file) {
            file.name = file.fileName;
        });
    }
    loadData();

    File.prototype.convertToBase64 = function(callback) {
        var file = this;
        var FR = new FileReader();
        FR.onload = function(e) {
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
            file.convertToBase64(function(base64, attachedFile) {
                var attach = angular.copy(attachedFile);
                attach.base64 = base64;
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

    $scope.$watchCollection("files", function() {
        convertAttachedFilesToBase64();
    });

    function setSubmitDataAttachmentsFromLocal() {
        self.formattedAttachments = [];
        angular.forEach(self.attachmentFiles, function(attachment) {
            var obj = {
                fileName: attachment.name,
                base64: attachment.base64,
                attachmentGUID: attachment.attachmentGUID
            }
            self.formattedAttachments.push(obj);
        });
    }


    //    $scope.$watch('files', function() {
    //        $scope.upload($scope.files);
    //    });
    // set default directive values
    // Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
    this.upload = function() {
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
            }).progress(function(evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function(data, status, headers, config) {
                //console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
                self.attachmentFiles.push({
                    name: data.result[0].name,
                    size: data.result[0].size
                });
            }).error(function(data, status, headers, config) {
                //console.log('error status: ' + status);
                self.isUploadErrorMsg = true;
                self.UploadErrorMsg += "Failed to upload file '" + config.file.name + "'. Status: " + status + ".\n";
            })
        }

    };

    this.removeAttachment = function(name) {
        removeFileFromCollection(name);
    };

    var removeFileFromCollection = function(name) {
        if (!self || !self.attachmentFiles) return;
        for (var i = 0; i < self.attachmentFiles.length; i++) {
            var file = self.attachmentFiles[i];
            if (file.name == name) {
                self.attachmentFiles.splice(i, 1);
            }
        }

        // update data modal
        setSubmitDataAttachmentsFromLocal();
    }

    // empty main getSubmitData
    // to need to submit data in this view    
    main.getSubmitData = function() {
        var data = angular.copy(main.project);
        data.attachments = self.formattedAttachments;
        return data;
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

}]);