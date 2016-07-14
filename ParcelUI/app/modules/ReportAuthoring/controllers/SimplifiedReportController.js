angular.module('ReportAuthoring').controller('SimplifiedReportController', ['$scope', '$http', '$modal', 'ReportAuthoringAPI', '$window', '$timeout', '$parse', 'DefaultLanguageLibraryAPI', '$sce', '$state', '$filter', '$location', '$anchorScroll', 'ParcelUI.Resources', 'BASEURL', '$modal', '$stateParams', '$localStorage', '$rootScope', 'AuthFactory', 'ReportAuthoringUrlCollection', 'VariableReplacerAPI', '$compile', 'scopeArray', 'getScopeService', 'globalValues', 'projectDashboardOperations', 'ReportWriteService', 'HelperService', '$q', function ($scope, $http, $modal, ReportAuthoringAPI, $window, $timeout, $parse, DefaultLanguageLibraryAPI, $sce, $state, $filter, $location, $anchorScroll, ParcelUI_Resources, BASEURL, $modal, $stateParams, $localStorage, $rootScope, AuthFactory, ReportAuthoringUrlCollection, VariableReplacerAPI, $compile, scopeArray, getScopeService, globalValues, projectDashboardOperations, ReportWriteService, HelperService, $q) {

    PNotify.prototype.options.styling = "fontawesome";
    $scope.currentUserName = AuthFactory.getUserDetailsFromStorage('EFF_FULLNAME');
    $scope.currentUserGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
    $("#loading").hide();

    //Clear session storage
    // window.sessionStorage.removeItem("currentSectionId");
    window.sessionStorage.removeItem('isSpellcheckClosed');
    window.sessionStorage.removeItem('isSpellcheckRunning');
    window.sessionStorage.removeItem('isFindreplaceRunning');
    window.sessionStorage.removeItem('isSpellcheckPause');
    window.sessionStorage.removeItem('isTableSpellcheckRunning');
    window.sessionStorage.removeItem('handleAfterScroll');

    var self = this;
    self.checkComments = false;
    var userDetails = JSON.parse(localStorage.getItem('userdetails'));
    self.showAllSections = false;
    self.otherViewModeMsg = "All Sections Mode";
    self.companyId = globalValues.currentUserCompanyGuid;

    self.waitingProcessResources = {};
    self.waitingHistoryResources = {};
    self.waitingLibraryResources = {};
    self.waitingCommentsResources = ParcelUI_Resources.waitingCommentsResources;
    self.waitingProcessResources.pdfLoader = ParcelUI_Resources.waitingPDFResources;

    self.reportDetails = {};
    self.saveNewCommBtn = false;
    self.selSection_Comments = 0;
    self.allsectionIdList = [];
    self.sectionIdList = [];
    self.isGISelected = true;
    self.isEditAllTables = false, self.SelectedMode;
    self.currentSection = {};

    $scope.historyArr = [];

    $localStorage.historyInstructionFlag;
    $localStorage.libraryInstructionFlag;

    self.checkComments = false;
    self.selectAllText = "Check All";
    self.IsCommentChecked = false;
    self.commentsErrorStatus = false;
    self.commentsErrorText = "";
    $scope.commentsArr = [];
    self.serviceResponseAlert = true;
    self.copyOfAllSections = [];
    self.isBusy = false;
    self.reportPhase = '';
    self.reportPhasesResourcesArray = ParcelUI_Resources.reportPhasesResources;

    this.resp = {
        sections: []
    }
    this.obj = {
        selectedSection: ''
    };
    self.reportId = $stateParams.reportGuid;

    // to get section by id


    self.getReportToc = function (reportId) {
        var promise = ReportAuthoringAPI.getToC(reportId);
        return promise.then(function (tocData) {
            self.toc = {};
            self.toc.sections = [];
            self.projectName = tocData.project.name;
            self.reportDetails = tocData.reportDetails;

            getReportPhase(tocData.reportDetails.reportStatusAbbreviation);
            if (!tocData.tableOfContent) return;


            if (!HelperService.isEmptyObject(tocData.tableOfContent.updatedBy)) {
                var updatedBy = tocData.tableOfContent.updatedBy;
                var updatedDate = "";
                updatedDate = tocData.tableOfContent.updatedDate ? (tocData.tableOfContent.updatedDate).replace(/-/g, '/') : updatedDate;
                var user = "";
                var uri = "";
                var userGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
                //var url = BASEURL.ACCOUNT_MGMT + ReportAuthoringUrlCollection.ACCT_USER;
                if (updatedBy) {
                    user = updatedBy.firstName + " " + updatedBy.lastName;
                    if (updatedBy.userGUID == userGuid)
                        user = "Me";

                    var params = {
                        companyguid: updatedBy.companyGUID,
                        officeguid: updatedBy.officeGUID,
                        userguid: updatedBy.userGUID
                    };
//                    uri = ReportAuthoringAPI.formatUrl(url, params);
                    uri = ReportAuthoringAPI.formatUrl(ReportAuthoringUrlCollection.ACCT_USER, params);
                    $('#lastUpdatedDetails').text('Last updated ' + updatedDate + " by ");
                    $("#lastUpdatedDetails").append('<a id="userLink" href="" class="pointer">' + user + '</a>');
                    $('#userLink').removeAttr('onclick');
                    $('#userLink').click({
                        url: uri
                    }, linkToAccountUser);
                }
            }

            var tocSections = tocData.tableOfContent.sections;

            angular.forEach(tocSections, function (tocsec) {
                if (tocsec.sectionNumber) {
                    tocsec.sectionNumber = tocsec.sectionNumber.trim();
                }
                if (!tocsec.isAppendix) {
                    self.toc.sections.push(tocsec);
                } else if (tocsec.isAppendix) {

                    var appendixsectionGuid = [];
                    angular.forEach(tocsec.sections, function (appendix) {
                        if (appendix.hasPhotos) {
                        //if (appendix.photosUploaded) {
                            appendixsectionGuid.push(appendix.sectionGUID);
                        }
                    });
                    var appendixTocPhotoSections = {
                        reportGuid: reportId,
                        appendixsectionGuidlist: appendixsectionGuid
                    };
                    $window.sessionStorage.setItem("appendixTocPhotoSections", JSON.stringify(appendixTocPhotoSections));
                }
                if (tocsec.isGeneralInfo) {
                    $rootScope.giSectionGuid = tocsec.sectionGUID;
                }
            });

            // Building link for Project Dashboard
            var projectDashParamObj = {
                projectGuid: $state.params.projectGuid,
                accountGuid: globalValues.currentUserGuid,
                companyGuid: globalValues.currentUserCompanyGuid
            };
            var linkToProjectDash = $state.href('projectDashboard', projectDashParamObj);

            $scope.projectDashLink = '<a title="Go to Project Dashboard for this Report" href="' + linkToProjectDash + '" class="pointer">' + tocData.project.name + '</a> /';

            // Building link for General Information
            var giParamObj = {
                projectGuid: $state.params.projectGuid,
                reportGuid: $state.params.reportGuid,
                sectionGuid: $rootScope.giSectionGuid,
                siteID: $('#siteId').val()
            };
            var linkToGI = $state.href('generalInformation', giParamObj);
            var propNoPart = tocData.location.propertyNumber ? tocData.location.propertyNumber + " " : "";
            var propNamePart = tocData.location.propertyName ? tocData.location.propertyName + " " : "";
            var addressPart = tocData.location.address1 ? tocData.location.address1 + ", " : "";
            var cityPart = tocData.location.city ? tocData.location.city + ", " : "";
            var statePart = tocData.location.state ? tocData.location.state + " " : "";

            var reportAuthTitle = propNoPart + propNamePart + addressPart + cityPart + statePart + tocData.location.zip;

            $scope.giLink = '<a target="_blank" title="Open General Information for this Report." href="' + linkToGI + '" class="pointer">' + reportAuthTitle + '</a>';
            $rootScope.title = reportAuthTitle + " / PARCEL";

            /*var first = tocSections[0];
            self.obj.selectedSection = first.sectionID;
            self.selectedSection = first;*/
        });
    }

    function init(reportId) {
        HelperService.checkActiveBrowser();
        getDefaultLibrary();
        self.resp = {
            sections: []
        }
        self.reportAuthoringWriteSelected = 'ToC';

        var promise = self.getReportToc(reportId);
        self.waitingProcessResources.promise = null;
        self.waitingProcessResources.promise = promise;
        promise.then(function () {
            self.createSectionIdListFromToC();
            var sectionid = -1;
            if (!self.sectionIdList || !self.sectionIdList.length) return;

            if (!window.sessionStorage.getItem("currentTocSectionId")) {
                self.selectedSection = self.resp.sections[0];
                self.currentSection = self.selectedSection;
            } else {
                sectionid = parseInt(window.sessionStorage.getItem("currentTocSectionId"));
                self.selectedSection = ReportWriteService.findChildSectionById(sectionid);
                self.currentSection = self.selectedSection;
                if (window.sessionStorage.getItem("currentSectionId") && parseInt(window.sessionStorage.getItem("currentSectionId")) != sectionid) {
                    sectionid = parseInt(window.sessionStorage.getItem("currentSectionId"));
                    self.currentSection = ReportWriteService.findChildSectionById(sectionid);
                }
            }

            // window.sessionStorage.setItem('currentSectionId', self.selectedSection.sectionID);

            self.selectedSectionGUID = self.selectedSection.sectionGUID;
            self.obj.selectedSection = self.selectedSection.sectionID;

            window.setTimeout(function () {
                ReportWriteService.setSelectedSection(self.selectedSection);
                HelperService.genericScrollTo(jQuery("#rightContent"), jQuery("#section_" + sectionid), jQuery("#rightContent"), 0);
                //$('#divsection_' + sectionid).bind('DOMNodeInserted', function (e) {
                // $('#divsection_' + sectionid).unbind('DOMNodeInserted');
                // });
            }, 1000);
            // enableDisableNavigation();
            ReportAuthoringAPI.managePanelHeight();

            self.getLibraries();
            window.setTimeout(function () {
                HelperService.showPNotifyMessage('Report Loaded', '', 'success');
            }, 250)

        });
        HelperService.windowResize();
    }

    init(self.reportId);

    self.writeTabClicked = function () {
        $("#loading").hide();
        ReportAuthoringAPI.managePanelHeight();
    }


    $scope.$on('set-last-updated-section-details', function (event, args) {
        if (args.updatedSections && args.updatedSections.length) {
            self.lastUpdatedSectionDetails(args.updatedSections, args.sectionID);
        }
        event.stopPropagation();
    });

    self.lastUpdatedSectionDetails = function (updatedSections, sectionID) {
        var userGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');

        //var url = BASEURL.ACCOUNT_MGMT + ReportAuthoringUrlCollection.ACCT_USER;

        angular.forEach(updatedSections, function (section) {
            var currentSection = null;
            if (!sectionID) {
                currentSection = ReportWriteService.findSectionByGUID(section.sectionGUID);
                if (currentSection) {
                    currentSectionID = currentSection.sectionID;
                    currentSection.updatedBy = section.createdBy;
                    currentSection.updatedDate = section.createDate;
                }
            }

            elementSectionID = sectionID ? sectionID : currentSectionID;
            var updatedBy = section.createdBy;
            var updatedDate = section.createDate;
            //var sectionID = sectionID;
            if (!HelperService.isEmptyObject(updatedBy)) {
                var updatedDate = updatedDate ? updatedDate.replace(/-/g, '/') : updatedDate;
                var user = updatedBy.firstName + " " + updatedBy.lastName;

                if (updatedBy.userGUID == userGuid) {
                    user = "Me";
                }
                var params = {
                    companyguid: updatedBy.companyGUID,
                    officeguid: updatedBy.officeGUID,
                    userguid: updatedBy.userGUID
                };

//                var uri = ReportAuthoringAPI.formatUrl(url, params);
                var uri = ReportAuthoringAPI.formatUrl(ReportAuthoringUrlCollection.ACCT_USER, params);

                $('#lastUpdatedDetails').text('Last updated ' + updatedDate + " by ");
                $("#lastUpdatedDetails").append('<a id="userLink" href="" class="pointer">' + user + '</a>');
                $('#userLink').removeAttr('onclick');
                $('#userLink').click({
                    url: uri
                }, linkToAccountUser);

                if (elementSectionID && angular.element('#divUpdatedSection_' + elementSectionID).length) {
                    $timeout(function () {
                        $('#divUpdatedSection_' + elementSectionID).removeClass('ng-hide');
                        $('#divUpdatedSection_' + elementSectionID).text('Last updated ' + updatedDate + " by ");
                        $('#divUpdatedSection_' + elementSectionID).append('<a id="aUpdatedSection_' + elementSectionID + '" href="' + uri + '" class="pointer">' + user + '</a>');
                    });
                }
            }
        });
    }



    /* comments tab starts */
    self.getReportComments = function () {

        if (sessionStorage.getItem("reportStatusAbbreviation") != 'FIN') {
            self.saveNewCommBtn = false;

            self.commentsErrorStatus = false;
            self.commentsErrorText = "";
            self.checkComments = false;
            self.newComm = false;
            self.serviceResponseAlert = true;
            var commentFilterSelected = localStorage.getItem('commentFilterSelected');
            var sectionGUID = localStorage.getItem('sign_sectionGUID');
            var section = {
                "sectionGUID": sectionGUID
            }

            if (section.sectionGUID == undefined || section.sectionGUID == null) {

                if (commentFilterSelected) {
                    self.selSection_Comments = commentFilterSelected;
                    self.getCommentsByFilter(commentFilterSelected);

                } else {

                    self.selSection_Comments = 0;
                    self.getCommentsBySection();
                }
            } else {

                if (commentFilterSelected) {
                    self.selSection_Comments = commentFilterSelected;
                    self.getCommentsByFilter(commentFilterSelected, section);

                } else {
                    self.selSection_Comments = 0;
                    self.getCommentsBySection(section);
                }
            }
        }

    }

    self.getCommentsBySection = function (sectionData) {

        $scope.commentsArr = [];
        self.commentsErrorStatus = false;
        self.commentsErrorText = "";
        //  if (self.otherViewModeMsg.toLowerCase() == "all sections mode") {
        var promise;
        var sectionGUID = localStorage.getItem('sign_sectionGUID');
        if (sectionGUID) {
            promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, self.selectedSectionGUID);
        } else {
            if (sectionData) {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, sectionData.sectionGUID);
            } else {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, self.selectedSectionGUID);
            }
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
                if (self.selectedSectionGUID.toLowerCase() == resp[i].sectionGUID.toLowerCase()) {

                    //  $scope.commentsArr.push(resp[i]);

                    if (resp[i].comments && resp[i].comments.length > 0) {

                        sectionObj.sectionGUID = resp[i].sectionGUID;
                        if (self.selectedSection.sectionGUID.toLowerCase() != self.currentSection.sectionGUID.toLowerCase()) {
                            sectionObj.sectionNumber = self.currentSection.sectionNumber;
                            sectionObj.sectionName = self.currentSection.sectionName;
                        } else {
                            sectionObj.sectionNumber = self.selectedSection.sectionNumber;
                            sectionObj.sectionName = self.selectedSection.sectionName;
                        }


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


                    //  break;
                }

            }

            checkCommentsStatus();
            $timeout(function () {
                ReportAuthoringAPI.managePanelHeight();

            });
            $timeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });

        }, function (error) {
            self.checkComments = false;
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

    self.checkAll = function () {
        var isCommentsDeleted_write = localStorage.getItem('isCommentsDeleted_write');

        if (isCommentsDeleted_write) {
            self.selectAllText = "Un Check";
            self.selectAllText = "Uncheck All";
            self.selectedAll = true;
        } else {
            self.IsCommentChecked = true;
            if (self.selectedAll) {
                self.selectAllText = "Un Check";
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
        localStorage.removeItem('isCommentsDeleted_write');
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
                                if ($scope.commentsArr[i].comments.length == 0) {

                                    if (self.selSection_Comments == 2 || self.selSection_Comments == 3) {
                                        self.commentsErrorText = "";
                                        self.commentsErrorStatus = false;
                                        $scope.commentsArr[i].noCommentsErrVal = "No Comments found";

                                    } else {
                                        $scope.commentsArr[i].noCommentsErrVal = "";
                                        $scope.commentsArr[i].sectionNumber = "";
                                        $scope.commentsArr[i].sectionName = "";

                                        self.commentsErrorText = "No comments found";
                                        self.commentsErrorStatus = true;
                                    }

                                }

                                break;
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
        if (self.newCommentVal) {} else {
            return;
        }

        $("#btnSaveNewComments").prop("disabled", true);


        if (userDetails) {
            var userName;
            for (var i = 0; i < userDetails.length; i++) {
                if (userDetails[i].key === "FULLNAME") {
                    userName = userDetails[i].value;
                    self.userName = userName;
                }
            }
        }

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

        var promise = ReportAuthoringAPI.add_update_Comments($stateParams.reportGuid, self.selectedSectionGUID, addCommentObj);

        return promise.then(function (resp) {

            self.commentsErrorStatus = false;
            self.commentsErrorText = "";

            var commObj = {
                "Id": resp.comment.commentGUID,
                "addressed": false,
                "commentVal": resp.comment.commentText,
                "addressedVal": "",
                "commentedBy": self.userName,
                "addressedBy": "",
                "date": "",
                "canEdit": ""
            }

            if (resp.comment.commentUpdated) {
                commObj.date = resp.comment.updatedDate;
            } else {
                commObj.date = resp.comment.commentDate;
            }
            commObj.canEdit = resp.comment.canEdit;


            if ($scope.commentsArr.length == 0) {

                if (self.selectedSection.sectionGUID.toLowerCase() != self.currentSection.sectionGUID.toLowerCase()) {
                    var sectionObj = {
                        "sectionGUID": self.selectedSectionGUID,
                        "sectionNumber": self.currentSection.sectionNumber,
                        "sectionName": self.currentSection.sectionName,
                        comments: [],
                        "noCommentsErrVal": ""

                    }
                } else {
                    var sectionObj = {
                        "sectionGUID": self.selectedSectionGUID,
                        "sectionNumber": self.selectedSection.sectionNumber,
                        "sectionName": self.selectedSection.sectionName,
                        comments: [],
                        "noCommentsErrVal": ""

                    }
                }
                sectionObj.comments.push(commObj);
                $scope.commentsArr.push(sectionObj);



            } else {
                for (var i = 0; i < $scope.commentsArr.length; i++) {
                    if ($scope.commentsArr[i].sectionGUID.toLowerCase() == self.selectedSectionGUID.toLowerCase()) {
                        $scope.commentsArr[i].noCommentsErrVal = "";
                        if (self.selectedSection.sectionGUID.toLowerCase() != self.currentSection.sectionGUID.toLowerCase()) {
                            $scope.commentsArr[i].sectionNumber = self.currentSection.sectionNumber;
                            $scope.commentsArr[i].sectionName = self.currentSection.sectionName;
                        } else {
                            $scope.commentsArr[i].sectionNumber = self.selectedSection.sectionNumber;
                            $scope.commentsArr[i].sectionName = self.selectedSection.sectionName;
                        }
                        // $scope.commentsArr[i].sectionNumber = self.selectedSection.sectionNumber;
                        //  
                        $scope.commentsArr[i].comments.unshift(commObj)
                        break;
                    }
                }
            }

            checkCommentsStatus();
            self.newComm = false;
            self.saveNewCommBtn = true;

        }, function (error) {

            self.commentsErrorText = error;
            self.commentsErrorStatus = true;

        });


    };

    self.getCommentsByFilter = function (filterVal, section) {
        $scope.commentsArr = [];
        self.commentsErrorStatus = false;
        self.commentsErrorText = "";
        self.checkComments = true;
        if (filterVal == 0) {
            var promise;
            if (section) {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, section.sectionGUID);
            } else {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, self.selectedSectionGUID);
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

                    if (self.selectedSectionGUID.toLowerCase() == resp[i].sectionGUID.toLowerCase()) {

                        //  $scope.commentsArr.push(resp[i]);

                        if (resp[i].comments.length > 0) {
                            sectionObj.sectionGUID = resp[i].sectionGUID;
                            if (self.selectedSection.sectionGUID.toLowerCase() != self.currentSection.sectionGUID.toLowerCase()) {
                                sectionObj.sectionNumber = self.currentSection.sectionNumber;
                                sectionObj.sectionName = self.currentSection.sectionName;
                            } else {
                                sectionObj.sectionNumber = self.selectedSection.sectionNumber;
                                sectionObj.sectionName = self.selectedSection.sectionName;
                            }

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
                        }
                        $scope.commentsArr.push(sectionObj);
                        break;
                    }

                }

                checkCommentsStatus();
                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                });

            }, function (error) {
                self.checkComments = false;

                self.commentsErrorText = error;
                self.commentsErrorStatus = true;

            });
        } else if (filterVal == 1) {
            var promise;
            if (section) {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, section.sectionGUID);
            } else {
                promise = ReportAuthoringAPI.getComments('DESC', $stateParams.reportGuid, self.selectedSectionGUID);
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
                    if (self.selectedSectionGUID.toLowerCase() == resp[i].sectionGUID.toLowerCase()) {

                        //  $scope.commentsArr.push(resp[i]);

                        if (resp[i].comments.length > 0) {
                            sectionObj.sectionGUID = resp[i].sectionGUID;
                            if (self.selectedSection.sectionGUID.toLowerCase() != self.currentSection.sectionGUID.toLowerCase()) {
                                sectionObj.sectionNumber = self.currentSection.sectionNumber;
                                sectionObj.sectionName = self.currentSection.sectionName;
                            } else {
                                sectionObj.sectionNumber = self.selectedSection.sectionNumber;
                                sectionObj.sectionName = self.selectedSection.sectionName;
                            }

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

                            }
                        }
                        $scope.commentsArr.push(sectionObj);
                        break;
                    }
                }

                checkCommentsStatus();
                $timeout(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                });
            }, function (error) {
                self.checkComments = false;
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
                    sectionObj.sectionGUID = resp[i].sectionGUID;
                    sectionObj.sectionNumber = resp[i].sectionNumber;
                    sectionObj.sectionName = resp[i].sectionTitle;

                    if (resp[i].hasComments) {
                        if (resp[i].comments.length > 0) {

                            if (!resp[i].isAppendix) {
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
                                //  break;
                            }

                        }

                    } else {
                        sectionObj.noCommentsErrVal = "No Comments Found";
                        $scope.commentsArr.push(sectionObj);
                    }



                }



                //code to place comments of selected section on top

                appendThisSectionsComments();

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
                    sectionObj.sectionGUID = resp[i].sectionGUID;
                    sectionObj.sectionNumber = resp[i].sectionNumber;
                    sectionObj.sectionName = resp[i].sectionTitle;

                    if (resp[i].hasComments) {
                        if (resp[i].comments.length > 0) {

                            if (!resp[i].isAppendix) {
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
                                //  break;
                            }

                        }

                    } else {
                        sectionObj.noCommentsErrVal = "No Comments Found";
                        $scope.commentsArr.push(sectionObj);
                    }



                }



                //code to place comments of selected section on top

                appendThisSectionsComments();

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

    }

    function appendThisSectionsComments() {
        self.checkComments = false;
        self.commentsErrorText = "";
        self.commentsErrorStatus = false;
        $scope.collectiveArray = [];
        $scope.filterObject = $filter('filter')($scope.commentsArr, {
            sectionGUID: self.selectedSectionGUID
        })[0];
        if ($scope.filterObject) {

            for (var i = 0; i < self.resp.sections.length; i++) {
                if (self.resp.sections[i].sectionGUID.toLowerCase() == $scope.filterObject.sectionGUID.toLowerCase()) {

                    var selectedSectionIndex = $scope.commentsArr.indexOf($scope.filterObject);
                    if (selectedSectionIndex > -1) {
                        $scope.collectiveArray.push($scope.commentsArr[selectedSectionIndex]);

                    }
                    if (self.resp.sections[i].sections.length > 0) {
                        for (var j = 0; j < self.resp.sections[i].sections.length; j++) {
                            for (var c = 0; c < $scope.commentsArr.length; c++) {
                                if ($scope.commentsArr[c].sectionGUID.toLowerCase() == self.resp.sections[i].sections[j].sectionGUID.toLowerCase()) {
                                    $scope.collectiveArray.push($scope.commentsArr[c]);
                                }
                            }
                        }
                    }


                    break;
                } else {
                    $scope.filterObject = $filter('filter')($scope.commentsArr, {
                        sectionGUID: self.currentSection.sectionGUID
                    })[0];
                    var selectedSectionIndex = $scope.commentsArr.indexOf($scope.filterObject);
                    if (selectedSectionIndex > -1) {
                        $scope.collectiveArray.push($scope.commentsArr[selectedSectionIndex]);
                    }
                }
            }

            for (var a = $scope.collectiveArray.length; a > 0; a--) {
                var index = a - 1;
                $scope.filterObj = $filter('filter')($scope.commentsArr, {
                    sectionGUID: $scope.collectiveArray[index].sectionGUID
                })[0];
                if ($scope.filterObj) {
                    var selectedSectionIndex = $scope.commentsArr.indexOf($scope.filterObj);
                    $scope.commentsArr.splice(selectedSectionIndex, 1);
                    $scope.commentsArr.unshift($scope.collectiveArray[index]);
                }

            }

        } else {

            for (var c = 0; c < $scope.commentsArr.length; c++) {

                for (var i = 0; i < self.resp.sections.length; i++) {
                    if (self.resp.sections[i].sectionGUID.toLowerCase() == self.selectedSectionGUID.toLowerCase()) {
                        for (var j = 0; j < self.resp.sections[i].sections.length; j++) {
                            if ($scope.commentsArr[c].sectionGUID.toLowerCase() == self.resp.sections[i].sections[j].sectionGUID.toLowerCase()) {
                                $scope.collectiveArray.push($scope.commentsArr[c]);
                            }
                        }
                    }
                }



            }
            for (var a = $scope.collectiveArray.length; a > 0; a--) {
                var index = a - 1;
                $scope.filterObj = $filter('filter')($scope.commentsArr, {
                    sectionGUID: $scope.collectiveArray[index].sectionGUID
                })[0];
                if ($scope.filterObj) {
                    var selectedSectionIndex = $scope.commentsArr.indexOf($scope.filterObj);
                    $scope.commentsArr.splice(selectedSectionIndex, 1);
                    $scope.commentsArr.unshift($scope.collectiveArray[index]);
                }

            }
        }
    }

    self.sectionChanged = function () {
        localStorage.setItem('commentFilterSelected', self.selSection_Comments);
        $('#divSelAll_write label.active').removeClass('active');
        self.selectAllText = "Check All";
        self.selectedAll = true;
        self.checkComments = false;
        $scope.commentsArr = [];
        if (self.selSection_Comments == 0) {
            self.getCommentsByFilter(0);
        } else if (self.selSection_Comments == 1) {
            self.getCommentsByFilter(1);
        } else if (self.selSection_Comments == 2) {
            self.getCommentsByFilter(2);
        } else if (self.selSection_Comments == 3) {
            self.getCommentsByFilter(3);
        }

    }

    self.refreshComments = function () {

        $timeout(function () {
            checkCommentsStatus();
            $('#divSelAll_write label.active').removeClass('active');
            self.selectAllText = "Check All";
            self.selectedAll = true;

            if (self.selSection_Comments == 0) {
                self.getCommentsBySection();
            } else if (self.selSection_Comments == 1) {
                self.getCommentsByFilter(1);
            } else if (self.selSection_Comments == 2) {
                self.getCommentsByFilter(2);
            } else if (self.selSection_Comments == 3) {
                self.getCommentsByFilter(3);
            }
        });
    }

    self.editAddressComment = function (commentObj) {

        if (commentObj.commentEditState) {
            //edit Comments
            if (commentObj.EditCommentVal) {

            } else {
                return;
            }
            var editCommentObj = {
                "comment": {
                    "commentGUID": commentObj.Id,
                    "commentText": commentObj.EditCommentVal.replace(/\n/g, '<br>'),
                    "commentUpdated": true
                }
            }



            var promise = ReportAuthoringAPI.add_update_Comments($stateParams.reportGuid, self.selectedSectionGUID, editCommentObj);

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
            // address comments
            if (commentObj.addressComment) {

            } else {
                return;
            }

            var addressCommentObj = {
                "comment": {
                    "commentGUID": commentObj.Id,
                    "commentResponse": true,
                    "responseComments": [{
                        "commentText": commentObj.addressComment.replace(/\n/g, '<br>')
 }]
                }
            }

            var promise = ReportAuthoringAPI.add_update_Comments($stateParams.reportGuid, self.selectedSectionGUID, addressCommentObj);

            return promise.then(function (resp) {


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

                                if ($scope.commentsArr[i].comments.length == 0) {

                                    if (self.selSection_Comments == 2 || self.selSection_Comments == 3) {
                                        self.commentsErrorText = "";
                                        self.commentsErrorStatus = false;
                                        $scope.commentsArr[i].noCommentsErrVal = "No Comments found";

                                    } else {
                                        $scope.commentsArr[i].noCommentsErrVal = "";
                                        $scope.commentsArr[i].sectionNumber = "";
                                        $scope.commentsArr[i].sectionName = "";

                                        $scope.commentsArr.length = 0;
                                        self.commentsErrorText = "No comments found";
                                        self.commentsErrorStatus = true;
                                    }

                                }

                                break;
                            }
                        }

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

    self.setCommentFlag = function (section, result) {
        section.hasComments = result.hasComments;
        section.isCommentsAddressed = result.isCommentsAddressed;
        for (var childSectionIndex = 0; section.sections.length > childSectionIndex; childSectionIndex++) {
            self.setCommentFlag(section.sections[childSectionIndex], result.sections[childSectionIndex]);
        }
    }

    self.editComment = function (commObj) {
            commObj.EditCommentVal = commObj.commentVal.replace(/<br>/g, '\n');
        }
        /* comments tab ends */




    /* history tab starts here */
    self.getHistoryForSections = function () {
        $scope.historyArr = [];
        ReportAuthoringAPI.putHistoryArray($scope.historyArr);
        self.showHistoryMsg = false;
        var promise = ReportAuthoringAPI.getHistory(self.reportId, self.selectedSectionGUID);
        self.waitingHistoryResources.promise = promise;

        return promise.then(function (resp) {
            self.showHistoryMsg = false;
            $scope.historyArr = [];
            if (resp.history.length == 0)
                self.showHistoryMsg = true;
            else
                self.showHistoryMsg = false;

            for (var i = 0; i < resp.history.length; i++) {
                $scope.historyArr.push(resp.history[i]);
                ReportAuthoringAPI.putHistoryArray($scope.historyArr);
            }

            ReportAuthoringAPI.managePanelHeight();

        }).catch(function (resp) {
            if (resp.history == undefined)
                self.showHistoryMsg = true;
        });
    }

    self.setAppendicesFlag = function (flag) {
        if (window.sessionStorage.getItem('isFindreplaceRunning') == "true") {
            FindReplace.reset();
            window.sessionStorage.setItem('isFindreplaceRunning', false);
        }

        if (window.sessionStorage.getItem('isSpellcheckRunning') == "true" && window.sessionStorage.getItem('isSpellcheckPause') != 'true') {
            //FindReplace.reset();
            Spellcheck.pause();

            window.sessionStorage.setItem('isSpellcheckPause', true);

            window.sessionStorage.setItem('isSpellcheckRunning', false);
        }
        if (flag == "appendices") {
            self.appendicesFlag = true;
            ReportWriteService.setReportStatus();
        } else
            self.appendicesFlag = false;
    }



    /* history tab ends */



    //Start Library
    self.libraries = [];

    function getDefaultLibrary() {
        var promise = ReportAuthoringAPI.getReportDefaulfLibrary(self.reportId);
        return promise.then(function (data) {

            self.defaultLibraryID = data.reports[0].languageLibraryGUID; //report.languageLibraryID;
            self.selectedLibraryID = self.defaultLibraryID;
            $('#siteId').val(data.reports[0].siteID);
        });
    }
    self.getLibraries = function () {
        var companyId = self.companyId;
        var promise = getLibraries_withPromise(companyId);
        promise.then(function (libraries) {

            self.libraries = libraries;
            // load language of default language library
            self.selectedLibraryChanged();
        });
    };

    self.selectedLibraryChanged = function (selectedLibraryChanged) {

        var libraryId = self.selectedLibraryID;
        ReportAuthoringAPI.putLibraryID(self.selectedLibraryID);
        var sectionId = self.selectedSectionGUID;
        //self.selectedSectionGUID;
        if (libraryId != null)
            loadLanguages(libraryId, sectionId, libraryId == self.defaultLibraryID);
    };

    function loadLanguages(libraryId, sectionId, isDefault) {
        var promise = getLanguages(libraryId, sectionId);
        promise.then(function (languages) {

            /*if (languages.length == 0)
                self.showLanguageMsg = false;
            else
                self.showLanguageMsg = true;*/
            // 1. instructions
            // 1.1 instructions to appear above narratives
            var filterResult = isDefault ? $filter("filter")(self.resp.sections, {
                sectionID: self.selectedSection.sectionID
            }, true) : null;
            if (filterResult && filterResult.length) {
                var linkedSectionObj = filterResult[0];
                linkedSectionObj.contentValues = $filter("filter")(languages, {
                    category: "Instructions",
                    showInPage: true
                });
            }

            // 2. language options to appear as selectable
            self.languages = $filter("selectableLanguages")(languages);

            if (self.languages == null || self.languages.length < 1)
                self.showLanguageMsg = true;
            else
                self.showLanguageMsg = false;


            if (self.languages)
                self.repeatData = self.resp.sections.map(function (value, index) {
                    return {
                        data: value,
                        value: self.languages[index]
                    }
                });
        });

    }

    function getLanguages(libraryId, sectionId) {
        var promise = getLanguageBySection_withPromise(libraryId, sectionId);
        self.waitingLibraryResources.promise = promise;
        return promise.then(function (languages) {

            return languages;
        });
    }

    function getLibraries_withPromise(companyId, reportGUID) {
        var promise = DefaultLanguageLibraryAPI.getDLLList(companyId);
        return promise.then(function (dllData) {
            return dllData.libraries;
        });
    }

    function getLanguageBySection_withPromise(libraryId, sectionId) {
        if (libraryId != null) {
            var promise = DefaultLanguageLibraryAPI.getLanguageBySection(libraryId, sectionId);
            return promise.then(function (languages) {
                ReportAuthoringAPI.putLanguageArray(languages);
                return languages;
            })
        }

    }


    //End Library

    //Start Report Status

    self.changeReportstatus = function (level) {
        //alert(self.appendicesFlag);
        self.isBusy = true;
        var promise = ReportAuthoringAPI.updateReportStatus($stateParams.reportGuid, level);

        promise.then(function (data) {
            self.isBusy = false;
            window.sessionStorage.setItem('reportStatusAbbreviation', data.reportStatusAbbreviation);
            if (data.reportStatusAbbreviation == 'FIN') {


                if (!self.appendicesFlag) {
                    for (var instance in CKEDITOR.instances) {
                        CKEDITOR.instances[instance].setReadOnly(true);
                    }
                    $('.cke_contents').css('border', '0px');
                    $('.boxCK .editCK').hide();
                }
                var inputsbuttons = $("#rightContent").find('.btn');

                $(inputsbuttons).each(function () {
                    $(this).attr('disabled', true);

                    if ($(this).find('[type=file]') != [])
                        $(this).find('[type=file]').attr('disabled', true);

                    $('.appendixPhotoLog *').attr('disabled', false);

                });


            } else {

                $('.cke_contents').css('border', '1px solid #ddd');
                $('.boxCK .editCK').show();
                if (!self.appendicesFlag)
                    for (var instance in CKEDITOR.instances) {
                        CKEDITOR.instances[instance].setReadOnly(false);
                    }
                var inputsbuttons = $("#rightContent").find('.btn');
                $(inputsbuttons).each(function () {
                    $(this).attr('disabled', false);

                    if ($(this).find('[type=file]') != [])
                        $(this).find('[type=file]').attr('disabled', false);
                    //$(this).find('[type=file]').parent().css('display', 'block');
                    //$(".appendixPhotoLogTableActions").css('display', 'block');
                    //$(this).parent().prev().css('display', 'block');

                });
                if (ReportWriteService.getSelectedReportTabName() == "Comments") {

                    self.getReportComments();
                }
            }
            var isReportFinalize = data.reportStatusAbbreviation == 'FIN' ? true : false;
            var GIscopeArray = getScopeService.getGIScope();
            for (var index = 0; GIscopeArray.length > index; index++) {
                GIscopeArray[index].isReportFinalize = isReportFinalize;
            }
            getReportPhase(data.reportStatusAbbreviation);

        }, function (error) {
            self.isBusy = false;
        });
    }

    function getReportPhase(reportStatusAbbreviation) {
        var reportStatusIndex = -1;
        for (var reportIndex = 0; ParcelUI_Resources.reportPhasesResources.length > reportIndex; reportIndex++) {
            if (ParcelUI_Resources.reportPhasesResources[reportIndex].key == reportStatusAbbreviation) {
                reportStatusIndex = reportIndex;
            }
        }
        $timeout(function () {
            if (reportStatusAbbreviation == "FIN") {
                $("#btntextblackId").attr('disabled', true);
                $("#btntextsaveId").attr('disabled', true);
                $(".addressedFlag").hide();
                $(".unAddressedFlag").hide();

            } else {
                $("#btntextblackId").attr('disabled', false);
                $("#btntextsaveId").attr('disabled', false);
                $(".addressedFlag").show();
                $(".unAddressedFlag").show();
            }
        });


        self.reportStatusAbbreviation = reportStatusAbbreviation;
        //scope.reportStatusAbbreviation = reportStatusAbbreviation;
        window.sessionStorage.setItem('reportStatusAbbreviation', reportStatusAbbreviation);
        self.displayReportbutton();


    }

    self.displayReportbutton = function () {
            self.showUPbutton = false;
            self.showDOWNbutton = false;
            self.showFINbutton = false;
            self.showUNFINbutton = false;

            if (self.reportStatusAbbreviation === "WO") {
                self.nextreportPhase = ParcelUI_Resources.reportPhases[1].value;
                self.reportPhase = ParcelUI_Resources.reportPhasesResources[0].value;
                self.prevreportPhase = '';
                self.showUPbutton = true;
                self.showDOWNbutton = false;
                self.showFINbutton = true;
                self.showUNFINbutton = false;
            } else if (self.reportStatusAbbreviation === "DE") {
                self.nextreportPhase = ParcelUI_Resources.reportPhases[2].value;
                self.reportPhase = ParcelUI_Resources.reportPhasesResources[1].value;
                self.prevreportPhase = ParcelUI_Resources.reportPhases[0].value;
                self.showUPbutton = true;
                self.showDOWNbutton = true;
                self.showFINbutton = true;
                self.showUNFINbutton = false;
            } else if (self.reportStatusAbbreviation === "SR") {
                self.nextreportPhase = ParcelUI_Resources.reportPhases[3].value;
                self.reportPhase = ParcelUI_Resources.reportPhasesResources[2].value;
                self.prevreportPhase = ParcelUI_Resources.reportPhases[1].value;
                self.showUPbutton = true;
                self.showDOWNbutton = true;
                self.showFINbutton = true;
                self.showUNFINbutton = false;
            } else if (self.reportStatusAbbreviation === "FIN") {
                self.reportPhase = ParcelUI_Resources.reportPhasesResources[5].value;

                self.showUPbutton = false;
                self.showDOWNbutton = false;
                self.showFINbutton = false;
                self.showUNFINbutton = true;
            } else if (self.reportStatusAbbreviation === "DR") {
                self.nextreportPhase = ParcelUI_Resources.reportPhases[4].value;
                self.reportPhase = ParcelUI_Resources.reportPhasesResources[3].value;
                self.prevreportPhase = ParcelUI_Resources.reportPhases[2].value;
                self.showUPbutton = true;
                self.showDOWNbutton = true;
                self.showFINbutton = true;
                self.showUNFINbutton = false;
            } else if (self.reportStatusAbbreviation === "EAI") {
                self.nextreportPhase = '';
                self.reportPhase = ParcelUI_Resources.reportPhasesResources[4].value;
                self.prevreportPhase = ParcelUI_Resources.reportPhases[3].value;
                self.showUPbutton = false;
                self.showDOWNbutton = true;
                self.showFINbutton = true;
                self.showUNFINbutton = false;
            }

        }
        //End Report Status


    $scope.openVariableReplacer = function () {
        var reportGuid = $stateParams.reportGuid;
        $scope.reportGuid = reportGuid;
        var promise = VariableReplacerAPI.getVariableReplacerKeywords(reportGuid);
        self.waitingProcessResources.promise = promise;
        promise.then(function (replacerResp) {
            $scope.VRContents = replacerResp;
            openVariablePopup();
        }, function (error) {
            console.log("error");
        });
    }

    function openVariablePopup() {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ReportAuthoring/views/VariableReplacer.html',
            scope: $scope,
            controller: 'VariableReplacerCtrl as VR',
            size: 'lg'
        });
    }


    //Start Report writing Helper method

    self.createSectionIdListFromToC = function () {
        self.resp.sections = [];
        self.sectionNameArray = [];
        var tocSections = self.toc.sections;
        self.resp.sections = self.toc.sections;
        ReportWriteService.setSectionsArray(self.resp.sections);
        if (!tocSections || !tocSections.length) return;

        for (var i = 0; i < tocSections.length; i++) {
            var local = tocSections[i];

            createSectionIdListOfVisibleSections(local);

        }

        window.sessionStorage.setItem('sectionNameArray', JSON.stringify(self.sectionNameArray));

    }

    var createSectionIdListOfVisibleSections = function (section) {

        var nameObj = {
            key: section.sectionID,
            sectionNumber: section.sectionNumber,
            sectionName: section.sectionName
        };

        self.sectionNameArray.push(nameObj);
        var sectionId = section.sectionID;
        //self.copyOfAllSections.push(section);
        self.allsectionIdList.push(sectionId);
        self.copyOfAllSections.push(angular.copy(section));

        if (section.isVisibleInToc && section.clickable)
            self.sectionIdList.push(sectionId);
        var nestedSectionArr = section.sections;
        if (!nestedSectionArr) return;
        for (var i = 0; i < nestedSectionArr.length; i++) {
            var nested = nestedSectionArr[i];
            createSectionIdListOfVisibleSections(nested, section);
        }
    }



    //End Report writing helper method




    var searchObject = $location.search();
    $scope.reportGuid = $stateParams.reportGuid;
    $scope.projectGuid = $stateParams.projectGuid;
    $scope.companyGuid = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');
    $scope.accountGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
    $scope.prevState = 'ReportWrite';


    $scope.projectDocumentRedirect = function () {
        $window.open($state.href('projectDocs', {
            projectGuid: $stateParams.projectGuid,
            companyGuid: globalValues.currentUserCompanyGuid
        }, {
            absolute: true
        }), '_blank');

    }

    $scope.reportsProvider = {
        readData: function (term, page, pageSize) {
            if (term != undefined) {

                if (self.readDataCount == 0) {
                    projectDashboardOperations.setTerm(term);
                    self.readDataCount = self.readDataCount + 1;
                    self.readDataPage = page - 1;
                } else {
                    if ($('.select2-input').val() == projectDashboardOperations.getTerm()) {
                        self.readDataPage = self.readDataPage + pageSize;
                    } else {
                        projectDashboardOperations.setTerm(term);
                        self.readDataPage = page - 1;
                    }

                }
            }
            var currentSiteID = $("#siteId").val();
            var deferred = $q.defer();
            if (term == "") {
                projectDashboardOperations.getProjectReportsWithPagination({
                        projectGuid: $stateParams.projectGuid,
                        limit: pageSize,
                        offset: (page * pageSize) - pageSize,
                        term: null
                    })
                    .then(function (result) {
                        var filteredResult = result.reports.filter(function (report) {
                            return (report.siteID != currentSiteID);
                        });

                        deferred.resolve(filteredResult);
                    }, function (reason) {

                        deferred.reject(reason);
                    });
            } else if (term != "") {

                projectDashboardOperations.getProjectReportsWithPagination({

                        projectGuid: $stateParams.projectGuid,
                        limit: pageSize,
                        offset: (page * pageSize) - pageSize,
                        term: term
                    })
                    .then(function (result) {

                        var filteredResult = result.reports.filter(function (report) {
                            return (report.siteID != currentSiteID);
                        });
                        deferred.resolve(filteredResult);
                    }, function (reason) {

                        deferred.reject(reason);
                    });
            }

            return deferred.promise;
        }
    }

    $scope.displayReports = function (result) {
        if (JSON.stringify(result) != "{}") {
            self.selectedProject = result;

            var property = result.property;
            var propNumber = (property.propertyNumber != null && property.propertyNumber != "") ? property.propertyNumber + " : " : property.propertyNumber;
            var filteredResult = propNumber + property.propertyName + " : " + property.address1 + " " + property.address2 + " - " + result.reportType;

            $('.select2-chosen').text(filteredResult);
            $state.go('ReportAuthoring.Write', {
                projectGuid: result.projectGuid,
                reportGuid: result.reportGuid,
                siteID: result.siteID
            }, {
                reload: true,
                inherit: false
            });
        } else {
            $('.goto-project').prop('disabled', true);

            $('.select2-chosen').text("Select a Different Report");
            $('.select2-search-choice-close').css("display", "none");
        }
    }

    $scope.reportsSearchGenerateMarkup = function (result, element, search) {
        if (result != undefined && result.property != undefined) {
            var property = result.property;

            var propNumber = (property.propertyNumber != null && property.propertyNumber != "") ? property.propertyNumber + " : " : property.propertyNumber;
            var filteredResult = propNumber + property.propertyName + " : " + property.address1 + " " + property.address2 + " - " + result.reportType;

            var n = filteredResult.toLowerCase().indexOf(search.term.toLowerCase());
            var matchText = filteredResult.substring(n, n + search.term.length);
            var markup = "";
            if (n >= 0) {
                markup += "<div>" + filteredResult.substring(0, n) + "<u>" + matchText + "</u>" + filteredResult.substring(n + search.term.length, filteredResult.length) + "</div>";
                markup += "</div>";
            } else {
                markup += "<div>" + filteredResult + "</div>";
            }

            return markup;
        }
    }




    function linkToAccountUser(event) {
        $window.location.href = event.data.url;
    }


    self.toggleReportwriteHead = function () {
        HelperService.toggleReportwriteHead();
    }

    self.renderHtml = function (html_asText) {
        var renderedHtml = $sce.trustAsHtml(html_asText);
        return renderedHtml;
    }

    self.showDots = function (language) {
        if (language)
            return false;
        else
            return true;
    }

    self.addFocus = function () {
        $timeout(function () {
            jQuery('.focusif').focus();
        });
    }

    self.closeAlertHeight = function () {
        if (window.sessionStorage.getItem('isFindreplaceRunning') == "true") {
            FindReplace.reset();
            window.sessionStorage.setItem('isFindreplaceRunning', false);
        }

        if (window.sessionStorage.getItem('isSpellcheckRunning') == "true" && window.sessionStorage.getItem('isSpellcheckPause') != 'true') {
            //FindReplace.reset();
            Spellcheck.pause();

            window.sessionStorage.setItem('isSpellcheckPause', true);

            window.sessionStorage.setItem('isSpellcheckRunning', false);
        }
        $("#btnSaveNewComments").removeAttr('disabled');
        ReportAuthoringAPI.managePanelHeight();

    }

    function beforeUnload(e) {
        for (var instance in CKEDITOR.instances) {
            var currentInstance = instance;
            var oEditor = CKEDITOR.instances[currentInstance];
            if (oEditor.checkDirty()) {
                return e.returnValue = "You will lose the changes made in the editor.";
            }
        }
    }

    if (window.addEventListener) window.addEventListener('beforeunload', beforeUnload, false);
    else window.attachEvent('onbeforeunload', beforeUnload);
            }]);
