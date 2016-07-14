angular.module('ReportAuthoring').directive('photoLog', ['AppendixAPI', 'BASEURL', '$filter', '$rootScope', '$modal', '$timeout', function (AppendixAPI, BASEURL, $filter, $rootScope, $modal, $timeout) {
    return {
        restrict: 'A',
        templateUrl: 'app/modules/ReportAuthoring/directives/photoLog/photoLogView.html',
        replace: true,
        scope: {
            reportId: '=',
            section: '='
        },
        controller: ['$scope', function ($scope) {


            $scope.stack_bottomright = {
                "dir1": "up",
                "dir2": "left",
                "firstpos1": 50,
                "firstpos2": 25
            };
            $scope.zoomInAllFlag = true;

            function getPhotos(reportID, sectionGUID) {

                var promise = AppendixAPI.getAppendixPhotos(reportID, sectionGUID);
                return promise.then(function (photos) {
                    return photos;
                });
            }

            function init() {
                $scope.updateCaption = false;
                if (!$scope.section.images) {
                    var promise = getPhotos($scope.reportId, $scope.section.sectionGUID);
                    promise.then(function (photos) {
                        $scope.isCaptionSpellChecked = false;

                        $scope.section.images = $filter('orderBy')(photos, 'orderIndex');
                        separateImages($scope.section);

                    });
                }
            }


            $scope.changeText = function () {
                scope.text = 'New directive text';
            };
            $scope.$on('appendixUploadImage', function (event, data) {
                var promise = getPhotos($scope.reportId, $scope.section.sectionGUID);
                promise.then(function (photos) {
                    $scope.section.images = $filter('orderBy')(photos, 'orderIndex');
                    separateImages($scope.section);
                });
            });


            init();

            function separateImages(section) {
                section.includedImages = extractIncludedPhotos(section.images, true);
                section.excludedImages = extractIncludedPhotos(section.images, false);
            }

            function extractIncludedPhotos(photos, isIncluded) {
                var arr = [];
                angular.forEach(photos, function (photo) {
                    var time = new Date().getTime();
                    photo.thumbnailURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + photo.thumbnailGUID + '/stream' + '?cache=' + time;

                    if (photo.isIncluded === isIncluded) {
                        arr.push(photo);
                    }
                });
                return arr;
            }

            $scope.sortableOptions = {
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
                    //var photos = ui.item.sortable.sourceModel;

                    var photos = $scope.section.includedImages.concat($scope.section.excludedImages)
                    reorderPhotosInAppendix(photos, $scope.section.sectionGUID);
                }
            };

            function reorderPhotosInAppendix(photos, sectionGUID) {
                $rootScope.$broadcast('appendixClearmessage', {});
                var data = extractPutDataForReorderingPhotos(photos);
                var promise = AppendixAPI.putAppendixPhotos($scope.reportId, data, sectionGUID);
                promise.then(function (result) {
                    // no response in API
                });
            }

            function extractPutDataForReorderingPhotos(photos) {
                var data = [];
                angular.forEach(photos, function (photo) {
                    var obj = {
                        fileGuid: photo.fileGuid,
                        isIncluded: photo.isIncluded
                    };
                    data.push(obj);
                });
                return data;
            }

            $scope.enableRename = function (img) {
                if ($scope.isEditImage) {
                    img.renameAction = true;
                    img.oldCaption = img.renamed;
                    img.renamed = img.caption;
                }
            };
            $scope.cancelRename = function (img) {

                img.caption = img.renamed;
                img.renameAction = false;
                $scope.isEditImage = false;

                $rootScope.$broadcast('appendixClearmessage', {});
            };
            $scope.renameImg = function (img) {

                if (img.renameAction == undefined || img.renameAction == false)
                    return;
                var photo = angular.copy(img);
                photo.caption = img.renamed;
                photo.orderIndex = img.orderIndex;

                delete photo.renamed;
                delete photo.uploadedByAccountGuid;
                delete photo.uploadedByAccountID;
                delete photo.uploadedDateTime;
                delete photo.downloadURL;
                delete photo.uploadedByName;
                delete photo.renameAction;
                delete photo.thumbnailURL;
                var promise = AppendixAPI.putAppendixPhoto($scope.reportId, img.fileGuid, photo, img.sectionGUID);
                promise.then(function (photo) {
                    /*var arr = $scope.section.images;
                    var index = arr.indexOf(img);
                    arr[index] = photo;
                    img = arr[index];*/
                    img.caption = photo.caption;
                    img.renameAction = false;
                    $rootScope.$broadcast('appendixClearmessage', {});
                });
            };


            $scope.rotateCounterClockwise = function (img) {
                $rootScope.$broadcast('appendixClearmessage', {});
                var photo = {
                    caption: img.caption,
                    isIncluded: img.isIncluded,
                    orderIndex: img.orderIndex,
                    transform: {
                        rotation: -90
                    }
                }
                var promise = AppendixAPI.putAppendixPhoto($scope.reportId, img.fileGuid, photo, img.sectionGUID);
                promise.then(function (photo) {
                    var time = new Date().getTime();
                    img.thumbnailURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + photo.thumbnailGUID + '/stream' + '?cache=' + time;


                    img.renameAction = false;
                });
            };
            $scope.includePhoto = function (img) {
                $rootScope.$broadcast('appendixClearmessage', {});
                var photo = {
                    caption: img.caption,
                    orderIndex: img.orderIndex,
                    isIncluded: 1
                }
                var promise = AppendixAPI.putAppendixPhoto($scope.reportId, img.fileGuid, photo, img.sectionGUID);
                promise.then(function (photo) {
                    /*var arr = $scope.section.images;
                    var index = arr.indexOf(img);
                    arr[index] = photo;
                    img = arr[index];*/

                    // only for testing purposes
                    // mock API only returns true
                    var section = $scope.section;
                    img.isIncluded = 1;
                    var index = section.excludedImages.indexOf(img);
                    if (index >= 0) {
                        section.excludedImages.splice(index, 1);
                        section.includedImages.push(img);
                    }

                    img.renameAction = false;
                });

            };
            $scope.excludePhoto = function (img) {
                $rootScope.$broadcast('appendixClearmessage', {});
                var photo = {
                    caption: img.caption,
                    orderIndex: img.orderIndex,
                    isIncluded: 0
                }
                var promise = AppendixAPI.putAppendixPhoto($scope.reportId, img.fileGuid, photo, img.sectionGUID);
                promise.then(function (photo) {
                    /*var arr = $scope.section.images;
                    var index = arr.indexOf(img);
                    arr[index] = photo;
                    img = arr[index];*/

                    // only for testing purposes
                    // mock API only returns true
                    var section = $scope.section;
                    img.isIncluded = 0;
                    var index = section.includedImages.indexOf(img);
                    if (index >= 0) {
                        section.includedImages.splice(index, 1);
                        section.excludedImages.push(img);
                    }

                    img.renameAction = false;
                });

            };

            $scope.viewPDF = function (generationType) {
                $scope.$parent.appendices.viewPDF(generationType);
            }

            $scope.zoomPhoto = function (img) {
                $rootScope.$broadcast('appendixClearmessage', {});
                img.zoomIn = !img.zoomIn;
            };

            $scope.rotateClockwise = function (img) {
                $rootScope.$broadcast('appendixClearmessage', {});
                var photo = {
                    caption: img.caption,
                    isIncluded: img.isIncluded,
                    orderIndex: img.orderIndex,
                    transform: {
                        rotation: 90
                    }
                }
                var promise = AppendixAPI.putAppendixPhoto($scope.reportId, img.fileGuid, photo, img.sectionGUID);
                promise.then(function (photo) {
                    var time = new Date().getTime();


                    img.thumbnailURL = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + photo.thumbnailGUID + '/stream' + '?cache=' + time;

                    img.renameAction = false;
                });
            };

            $scope.editAllPhoto = function () {
                angular.forEach($scope.section.includedImages, function (photo) {
                    photo.renameAction = true;
                    photo.renamed = photo.caption;
                    $scope.isEditImage = true;
                    if ($scope.isCaptionSpellChecked) {
                        $('#imgCaptionId_' + photo.fileGuid).remove();                        
                        $('[name="imgCaptionId_' + photo.fileGuid + '"]').attr('type', 'text');
                    }

                });

                angular.forEach($scope.section.excludedImages, function (photo) {
                    photo.renameAction = true;
                    photo.renamed = photo.caption;
                    $scope.isEditImage = true;
                    if ($scope.isCaptionSpellChecked) {
                        $('#imgCaptionId_' + photo.fileGuid).remove();
                        $('[name="imgCaptionId_' + photo.fileGuid + '"]').attr('type', 'text');
                    }

                });                
            }

            $scope.cancelEditPhoto = function () {
               
                angular.forEach($scope.section.includedImages, function (photo) {
                    if (photo.oldCaption)
                        photo.caption = photo.oldCaption;

                    photo.renameAction = false;
                    $scope.isEditImage = false;
                    if ($scope.isCaptionSpellChecked) {
                        $('#imgCaptionId_' + photo.fileGuid).remove();
                        $('[name="imgCaptionId_' + photo.fileGuid + '"]').attr('type', 'text');
                        //$('[name="imgCaptionId_' + photo.fileGuid + '"]').val(photo.caption);                        
                        $('div[id*="imgCaptionId"]').remove();
                    }else{
                        $('div[id*="imgCaptionId"]').remove();
                        if($scope.updateCaption){
                            photo.caption = $('[name="imgCaptionId_' + photo.fileGuid + '"]').val(); 
                        }
                    }
                });
                angular.forEach($scope.section.excludedImages, function (photo) {
                    if (photo.oldCaption)
                        photo.caption = photo.oldCaption;

                    photo.renameAction = false;
                    $scope.isEditImage = false;
                    if ($scope.isCaptionSpellChecked) {
                        $('#imgCaptionId_' + photo.fileGuid).remove();
                        $('[name="imgCaptionId_' + photo.fileGuid + '"]').attr('type', 'text');
                        //$('[name="imgCaptionId_' + photo.fileGuid + '"]').val(photo.caption);
                        $('div[id*="imgCaptionId"]').remove();
                    }else{
                        $('div[id*="imgCaptionId"]').remove();
                        if($scope.updateCaption){
                            photo.caption = $('[name="imgCaptionId_' + photo.fileGuid + '"]').val(); 
                        }
                    }
                });
                $scope.btnSpellcheckorEdit = 'Check Spelling';
                $scope.updateCaption = false;
            }

            $scope.updateAllPhotos = function () {

                $scope.updateCaption = true;
                var allPhotos = [];
                angular.forEach($scope.section.images, function (photo) {

                    var photoCaption;
                    //if($scope.isCaptionSpellChecked){                                              
                    photoCaption = $('[name="imgCaptionId_' + photo.fileGuid + '"]').val();
                    /*}
                    else {                        
                      photoCaption = photo.caption;
                    }*/

                    var obj = {
                        fileGuid: photo.fileGuid,
                        "caption": photoCaption,
                        isIncluded: photo.isIncluded
                    };
                    allPhotos.push(obj);
                });

                if (allPhotos[0].caption != '') {
                    var promise = AppendixAPI.putAppendixPhotos($scope.reportId, allPhotos, $scope.section.sectionGUID);
                    promise.then(function (result) {
                        $scope.isEditImage = false;
                        showPNotifyMessage('Notice', 'All of the captions have been saved.', 'success', 'stack-bottomright');

                    });

                    angular.forEach($scope.section.images, function (photo) {

                        if ($scope.isCaptionSpellChecked) {                            
                            photo.renameAction = false;
                            $scope.isEditImage = false;
                            $('#imgCaptionId_' + photo.fileGuid).remove();
                            $('#AtD_sync_imgCaptionId_' + photo.fileGuid).attr('type', 'text');
                            photo.caption = $('[name="imgCaptionId_' + photo.fileGuid + '"]').val();

                        } else {
                            photo.renameAction = false;
                            $scope.isEditImage = false;
                            photo.caption = $('[name="imgCaptionId_' + photo.fileGuid + '"]').val();
                        }
                    });
                }                
                $scope.btnSpellcheckorEdit = 'Check Spelling';
                $('div[id*="imgCaptionId"]').remove();                
            }

            function showPNotifyMessage(title, text, type, position) {
                new PNotify({
                    title: title,
                    text: text,
                    type: type,
                    addclass: position,
                    stack: $scope.stack_bottomright
                });
            }

            $scope.spellCheckPhotoCaption = function (element) {
                $timeout(function () {
                    if ($scope.btnSpellcheckorEdit == 'Check Spelling') {
                        $scope.isCaptionSpellChecked = true;
                        spellCheckAllTables($(element).parent().parent().parent().find('.table-responsive'));
                    } else {

                        angular.forEach($scope.section.includedImages, function (photo) {
                            photo.renameAction = true;
                            photo.renamed = photo.caption;
                            $scope.isEditImage = true;
                            $('[name="imgCaptionId_' + photo.fileGuid + '"]').attr('type', 'text');
                            $('div[id*="imgCaptionId"]').remove();
                        });
                        angular.forEach($scope.section.excludedImages, function (photo) {
                            photo.renameAction = true;
                            photo.renamed = photo.caption;
                            $scope.isEditImage = true;
                            $('[name="imgCaptionId_' + photo.fileGuid + '"]').attr('type', 'text');
                            $('div[id*="imgCaptionId"]').remove();
                        });
                        $scope.isCaptionSpellChecked = false;
                    }
                    $scope.btnSpellcheckorEdit = $scope.btnSpellcheckorEdit == 'Edit Text' ? 'Check Spelling' : 'Edit Text';

                }, 50);

            };

            $scope.excludeAll = function () {

                excludeEncludeAllPhotos(0);
            };

            $scope.includeAll = function () {
                excludeEncludeAllPhotos(1);
            };

            //delete all files
            $scope.confirmDelete = function () {
                $rootScope.$broadcast('appendixClearmessage', {});
                var modalInstance = $modal.open({
                    template: function (elem, attr) {
                        var html = '';
                        html += "<div class='modal-header'>";
                        html += "<h4 class='modal-title'>Confirmation</div>";;
                        html += "</div>";
                        html += "<div class='modal-body'>";
                        html += "<p class='alert alert-danger'> Are you sure you want delete all the photos?";
                        html += "</div>";
                        html += "<div class='modal-footer'>";
                        html += "<button ng-click='ok()' class=' btn btn-primary'> Ok </button>";
                        html += "<button ng-click='cancel()' class='btn btn-default'> Cancel </button>";
                        html += "</div>";
                        return html;
                    },
                    controller: confirmDeleteController,
                    size: 0,
                    resolve: {

                    }
                });

                modalInstance.result.then(function (result) {
                    if (result) {
                        $scope.deleteAll();
                    }
                });
            }

            function confirmDeleteController($scope, $modalInstance) {

                $scope.ok = function () {
                    $modalInstance.close(true);
                }

                $scope.cancel = function () {
                    $modalInstance.close(false);
                }
            }

            $scope.deleteAll = function () {

                var allPhotos = [];
                angular.forEach($scope.section.images, function (photo) {
                    var obj = {
                        fileGuid: photo.fileGuid
                    };
                    allPhotos.push(obj);
                });

                var deletefiles = {
                    photos: allPhotos
                };

                var promise = AppendixAPI.deleteAppendixPhotos($scope.reportId, deletefiles, $scope.section.sectionGUID);
                promise.then(function (result) {

                    $scope.isEditImage = false;
                    $scope.section.includedImages = [];
                    $scope.section.excludedImages = [];
                    $scope.section.images = null;
//                    $scope.section.hasPhotos = false;
                    //$scope.section.photosUploaded = false;

                    showPNotifyMessage('Notice', 'All of the photo have been deleted', 'success', 'stack-bottomright');

                });


            };

            //delete Single file

            $scope.confirmFileDelete = function (img) {
                $rootScope.$broadcast('appendixClearmessage', {});
                var modalInstance = $modal.open({
                    template: function (elem, attr) {
                        var html = '';
                        html += "<div class='modal-header'>";
                        html += "<h4 class='modal-title'>Confirmation</div>";;
                        html += "</div>";
                        html += "<div class='modal-body'>";
                        html += "<p class='alert alert-danger'> Are you sure you want delete the photo?";
                        html += "</div>";
                        html += "<div class='modal-footer'>";
                        html += "<button ng-click='ok()' class=' btn btn-primary'> Ok </button>";
                        html += "<button ng-click='cancel()' class='btn btn-default'> Cancel </button>";
                        html += "</div>";
                        return html;
                    },
                    controller: confirmDeleteFileController,
                    size: 0,
                    resolve: {

                    }
                });

                modalInstance.result.then(function (result) {
                    if (result) {
                        $scope.deletePhoto(img);
                    }
                });
            }

            function confirmDeleteFileController($scope, $modalInstance) {

                $scope.ok = function () {
                    $modalInstance.close(true);
                }

                $scope.cancel = function () {
                    $modalInstance.close(false);
                }
            }

            $scope.deletePhoto = function (img) {


                var photo = {
                    caption: img.caption,
                    isIncluded: img.isIncluded,
                    transform: {
                        rotation: -90
                    }
                }
                var promise = AppendixAPI.deleteAppendixPhoto($scope.reportId, img.fileGuid);
                promise.then(function (photo) {

                    var arr = $scope.section.images;
                    var index = arr.indexOf(img);
                    arr.splice(index, 1);

                    if (img.isIncluded) {
                        var includedIndex = $scope.section.includedImages.indexOf(img);
                        $scope.section.includedImages.splice(includedIndex, 1);
                    } else {
                        var excludedIndex = $scope.section.excludedImages.indexOf(img);
                        $scope.section.excludedImages.splice(excludedIndex, 1);
                    }

                    // separateImages($scope.section);


                    img.renameAction = false;
                });
            };

            $scope.zoomInAll = function () {
                angular.forEach($scope.section.images, function (img) {
                    img.zoomIn = $scope.zoomInAllFlag;

                });
                if ($scope.zoomInAllFlag) {
                    $scope.zoomInAllFlag = false;
                } else {
                    $scope.zoomInAllFlag = true;
                }

            };

            function excludeEncludeAllPhotos(action) {

                var allPhotos = [];
                angular.forEach($scope.section.images, function (photo) {
                    var obj = {
                        fileGuid: photo.fileGuid,
                        "caption": photo.caption,
                        isIncluded: action
                    };
                    allPhotos.push(obj);
                });

                var promise = AppendixAPI.putAppendixPhotos($scope.reportId, allPhotos, $scope.section.sectionGUID);
                promise.then(function (result) {
                    var index;

                    angular.forEach($scope.section.images, function (img) {

                        img.isIncluded = action;
                        if (action == 0) {
                            index = $scope.section.includedImages.indexOf(img);
                            if (index >= 0) {
                                $scope.section.includedImages.splice(index, 1);
                                $scope.section.excludedImages.push(img);
                            }
                        } else {

                            index = $scope.section.excludedImages.indexOf(img);
                            if (index >= 0) {
                                $scope.section.excludedImages.splice(index, 1);
                                $scope.section.includedImages.push(img);
                            }
                        }
                    });
                    if (action) {
                        showPNotifyMessage('Notice', 'All the photos will be included in the photo log.', 'success', 'stack-bottomright');
                    } else {
                        showPNotifyMessage('Notice', 'All the photos will be excluded in the photo log.', 'success', 'stack-bottomright');
                    }
                });

            }
        }]
    }
}]);