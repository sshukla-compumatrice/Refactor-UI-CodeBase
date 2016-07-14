angular.module('LenderPortfolioCreation').controller('LenderPortfolioUploadPropertyCtrl', ['$scope', 'Upload', function($scope, Upload) {

    if ($scope.lenderPortfolio.project && $scope.lenderPortfolio.project.locations && $scope.lenderPortfolio.project.locations.length) {
        $state.go('LenderPortfolioCreation.UploadedSiteDetails');
    }

    //    $scope.$watch('files', function() {
    //        $scope.upload($scope.files);
    //    });
    // set default directive values
    // Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
    //this.Upload = function () {
    //    self.UploadErrorMsg = "";
    //    self.isUploadErrorMsg = false;

    //    var files = $scope.files;
    //    if (!files || files.length <= 0) {
    //        self.isUploadErrorMsg = true;
    //        self.UploadErrorMsg += "Please attach files before trying to upload.";
    //        return;
    //    }
    //    for (var i = 0; i < files.length; i++) {
    //        var file = files[i];
    //        Upload.upload({
    //            url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
    //            //                    fields: {
    //            //                        'username': $scope.username
    //            //                    },
    //            file: file
    //        }).progress(function (evt) {
    //            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
    //        }).success(function (data, status, headers, config) {
    //            //console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
    //            self.attachmentFiles.push({
    //                name: data.result[0].name,
    //                size: data.result[0].size
    //            });
    //        }).error(function (data, status, headers, config) {
    //            //console.log('error status: ' + status);
    //            self.isUploadErrorMsg = true;
    //            self.UploadErrorMsg += "Failed to upload file '" + config.file.name + "'. Status: " + status + ".\n";
    //        })
    //    }

    //};

    //this.RemoveAttachment = function (name) {
    //    removeFileFromCollection(name);
    //};

    //var removeFileFromCollection = function (name) {
    //    if (!self || !self.attachmentFiles) return;
    //    for (var i = 0; i < self.attachmentFiles.length; i++) {
    //        var file = self.attachmentFiles[i];
    //        if (file.name == name) {
    //            self.attachmentFiles.splice(i, 1);
    //        }
    //    }
    //}

    var main = $scope.lenderPortfolio;
    main.getSubmitData = function() {
        self.UploadErrorMsg = "";
        self.isUploadErrorMsg = false;

        var files = self.attachmentFiles;
        if (!files || files.length <= 0) {
            self.isUploadErrorMsg = true;
            self.UploadErrorMsg += "Please attach files before trying to upload.";
            return;
        }

        var file = files[0];
        var project = angular.copy(main.project);
        project.inputFile = file.base64;
        return project;
    };
    main.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }

    $scope.$watchCollection("files", function() {
        convertAttachedFilesToBase64();
    });

    self.attachmentFiles = [];

    function convertAttachedFilesToBase64() {
        if (!$scope.files || !$scope.files.length) {
            return;
        } else {
            self.uploadSpreadSheetExists = true;
        }

        var files = $scope.files;
        self.attachmentFiles = [];
        for (var i = 0, completedCount = 0; i < files.length; i++) {
            var file = files[i];
            file.convertToBase64(function(base64, attachedFile) {
                var attach = angular.copy(attachedFile);
                attach.base64 = base64;
                self.attachmentFiles.push(attach);
                /*completedCount++;
                if (completedCount == files.length) {
                    // callback invoked via non-angular code (FileReader.onload)
                    // need to apply changes to scope
                    $scope.$apply();
                    // set attachments to parent submit object
                    setSubmitDataAttachmentsFromLocal();
                }*/
            });
        }
    }

    // convert file to base64
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

}]);