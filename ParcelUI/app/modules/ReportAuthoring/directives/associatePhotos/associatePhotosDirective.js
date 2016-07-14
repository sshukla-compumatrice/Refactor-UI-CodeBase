angular.module('ReportAuthoring').directive('associatePhotos', ['associatePhotosAPI', '$rootScope', '$window', 'BASEURL', 'ReportAuthoringAPI', 'AppendixAPI', '$stateParams', function (associatePhotosAPI, $rootScope, $window, BASEURL, ReportAuthoringAPI, AppendixAPI, $stateParams) {
    return {
        restrict: 'A',
        replace: true,
        transclude: false,

        templateUrl: 'app/modules/ReportAuthoring/directives/associatePhotos/associatePhotosView.html',
        scope: {
            data: '=apData'
        },

        controller: ['$scope', '$modal', function ($scope, $modal) {
            $scope.associatePhotosEnabled = $scope.data ? $scope.data.enabled : false;
            $scope.associatedImages = $scope.data && $scope.data.associated ? $scope.data.associated : [];

            $scope.reportID = $stateParams.reportGuid;


            $scope.getImageCollection = function (reportID, sectionGUID) {
                var promise = associatePhotosAPI.getImageColl(reportID, sectionGUID);
                promise.then(function (collection) {
                    $scope.imageColl = collection;
                    createImageColl(collection);
                    setSelectedInColl($scope.associatedImages, $scope.imageColl);

                }, function (error) {
                    //alert('Error in getting images' + error);

                });
            }

            function createImageColl(collections) {
                var arrCollections = [];
                var collection = {};
                angular.forEach(collections, function (item, index) {

                    $scope.imageColl[index].url = BASEURL.REPORTAUTHORING_APPENDICES_COREFILES + '/files/' + item.fileGuid + '/stream';
                    $scope.imageColl[index].name = $scope.imageColl[index].caption;
                });
                //return arrCollections;
            }
            $scope.getAssociatedImages = function () {
                var promise = associatePhotosAPI.getImageColl();
                promise.then(function (collection) {
                    $scope.imageColl = collection;
                    setSelectedInColl($scope.associatedImages, $scope.imageColl);

                }, function (error) {
                    //alert('Error in getting images' + error);
                });
            }
            var setSelectedInColl = function (selectedList, coll) {
                if (!coll || !coll.length) return;
                if (!selectedList || !selectedList.length) return;

                for (var i = 0; i < coll.length; i++) {
                    var local = coll[i];
                    for (var j = 0; j < selectedList.length; j++) {
                        var selected = selectedList[j];
                        if (local.url == selected.url) {
                            coll[i] = selectedList[j];
                            coll[i].selected = true;
                            break;
                        }
                    }
                }
            }

            $scope.duplicateRow = function () {
                console.log("sd");
            }

            $scope.enableRename = function (associatedImg) {
                associatedImg.renameAction = true;
                associatedImg.renamed = associatedImg.name;
            }
            $scope.cancelRename = function (associatedImg) {
                associatedImg.renameAction = false;
            }


            $scope.renameImg = function (associatedImg, index) {
                console.log($scope.$parent);
                console.log($scope.$parent.contentValues.associatPhotos.associated)
                var breakLoop = false;
                $scope.$parent.contentValues.associatPhotos.associated[index].name = associatedImg.renamed;
                associatedImg.name = associatedImg.renamed;

                var data = {
                    "formSectionData": [
                        {
                            "sectionGUID": $scope.$parent.sectionGUID,
                            "sectionData": {
                                "contentValues": $scope.$parent.contentValues

                            }
							   }]
                };


                ReportAuthoringAPI.updateSection($scope.reportID, $scope.$parent.sectionGUID, data)


                associatedImg.renameAction = false;
            }

            $scope.getImageCollectionForAllSection = function () {


                var appendixTocPhotoSections = JSON.parse($window.sessionStorage.getItem("appendixTocPhotoSections"));
                angular.forEach(appendixTocPhotoSections.appendixsectionGuidlist, function (secGuid) {

                    $scope.getImageCollection($scope.reportID, secGuid);
                });
            }

            var init = function () {

                /*var appendixTocPhotoSections=JSON.parse($window.sessionStorage.getItem("appendixTocPhotoSections"));
                angular.forEach(appendixTocPhotoSections.appendixsectionGuidlist,function(secGuid)
                			   {
*/
                var appendixTocPhotoSections = JSON.parse($window.sessionStorage.getItem("appendixTocPhotoSections"));
                angular.forEach(appendixTocPhotoSections.appendixsectionGuidlist, function (secGuid) {


                    $scope.getImageCollection($scope.reportID, secGuid);
                });
            }

            var init = function () {
                $scope.getImageCollectionForAllSection();
            }
            init();

            $scope.selectImages = function () {
                $scope.selectImgAction = true;
                $scope.modalContainer = {
                    selectedImgs: $scope.associatedImages
                };

                var modalInstance = $modal.open({
                    templateUrl: 'associateImageAction.html',
                    scope: $scope,
                    controller: selectImagesController,
                    size: 'lg',
                    windowClass: 'app-modal-window',
                    resolve: {
                        selectedImages: function () {
                            return $scope.associatedImages;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    //$scope.associatedImages = result;
                })
            }

            var selectImagesController = function ($scope, $modalInstance, selectedImages) {
                console.log(selectedImages)
                $scope.refreshPhotos = function () {
                    //$scope.getImageCollection($scope.reportID, $scope.tempsectionGUID);
                    $scope.getImageCollectionForAllSection();

                };

				 $scope.close = function () {
					$modalInstance.close();
				}

                $scope.saveAssociations = function () {

                    var saveAssociatedImageColl = [];

                    selectedImages.splice(0, selectedImages.length);
                    angular.forEach($scope.imageColl, function (imgObject) {

                        if (imgObject.selected) {
                            var saveAssociatedImageObj = {};
                            saveAssociatedImageObj.name = imgObject.name;
                            saveAssociatedImageObj.url = imgObject.url;
                            saveAssociatedImageColl.push(saveAssociatedImageObj);
                            selectedImages.push(imgObject);
                        }

                    });

                    $scope.$parent.$parent.contentValues.associatPhotos.associated = saveAssociatedImageColl;
                    var data = {
                        "formSectionData": [
                            {
                                "sectionGUID": $scope.$parent.$parent.sectionGUID,
                                "sectionData": {
                                    "contentValues": $scope.$parent.$parent.contentValues

                                }
							   }]
                    };


                    ReportAuthoringAPI.updateSection($scope.reportID, $scope.$parent.$parent.sectionGUID, data)

                    $modalInstance.close();
                };

            }


        }]
    }
}]);

/*
angular.module('ReportAuthoring').directive('clInlineEdit', function() {
    return {
        restrict: 'A',
        scope: {
            clModelData: '=',
            clValPlaceholder: '@',
            clExpStyle: '@'
        },
        transclude: true,
        replace: true,
        template: '<div><style>.inline-edit {    border: 0px;    outline: 0px;    margin: 0px 0px 3px 0px;    background-color: transparent;    box-shadow: inset 0 0px 0px rgba(0,0,0,.075);}.inline-edit:hover {        background-color: #fff;    }.inline-edit:focus {        background-color: #fff;    box-shadow: inset 0px 1px 1px rgba(0,0,0,0.075), 0px 0px 8px rgba(102,175,233,0.6)}</style><input type="text" ng-model="clModelData" placeholder="{{clValPlaceholder}}" class="form-control inline-edit" ng-transclude /></div>',
        link: function(scope, elem, attr) {
            elem[0].style.cssText = attr.clExpStyle;
        }
    };
});*/
