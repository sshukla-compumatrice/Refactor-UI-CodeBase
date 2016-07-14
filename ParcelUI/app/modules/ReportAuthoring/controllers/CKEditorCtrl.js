angular.module('ReportAuthoring').controller('ReportWriteController', ['$scope', '$http', '$modal', 'ReportAuthoringAPI', '$window', '$timeout', '$parse', 'DefaultLanguageLibraryAPI', '$sce', '$state', '$filter', '$location', '$anchorScroll', 'ParcelUI.Resources', 'BASEURL', '$modal', '$stateParams', '$localStorage', '$rootScope', 'AuthFactory', 'ReportAuthoringUrlCollection', 'VariableReplacerAPI', '$compile', 'scopeArray', 'getScopeService', 'globalValues', 'ReportWriteService', 'HelperService', function ($scope, $http, $modal, ReportAuthoringAPI, $window, $timeout, $parse, DefaultLanguageLibraryAPI, $sce, $state, $filter, $location, $anchorScroll, ParcelUI_Resources, BASEURL, $modal, $stateParams, $localStorage, $rootScope, AuthFactory, ReportAuthoringUrlCollection, VariableReplacerAPI, $compile, scopeArray, getScopeService, globalValues, ReportWriteService, HelperService) {

    var self = this;
    self.sectionCompiledArray = [];
    self.childSectionArray = [];
    self.currentCompliedsections = [];
    self.reportAuthoringWriteSelected = 'ToC';
    self.nextDisabled = false;
    self.prevDisabled = true;
    self.isCkDirty = false;
    self.GISelectedSectionId = -1;
    window.sessionStorage.setItem('isSpellcheckRunning', false);
    window.sessionStorage.setItem('isFindreplaceRunning', false);
    window.sessionStorage.setItem('handleAfterScroll', false);
    window.sessionStorage.setItem('isSpellcheckClosed', true);


    self.renderSectionsForAllSectionMode = function (section) {

        if (!section.isGeneralInfo && self.sectionCompiledArray.indexOf(section.sectionID) === -1) {
            var tempscope = scopeArray.getScope(section.sectionID);
            if (tempscope && tempscope.html) {

                var filteredHtml = tempscope.html.replace(/id='ckEdit'/g, "data-ck-editor");
                compiledElement = $compile(filteredHtml)(tempscope);
                self.sectionCompiledArray.push(tempscope.sectionID);
                var htmlElement = '#section_' + section.sectionID;
                var pageElement = $(htmlElement);
                pageElement.append(compiledElement);
                self.currentCompliedsections.push(section.sectionID);
                ReportWriteService.setReportStatus();
            }
        }

        for (var childsectionIndex = 0; section.sections.length > childsectionIndex; childsectionIndex++) {
            var childsection = section.sections[childsectionIndex];
            self.renderSectionsForAllSectionMode(childsection);
        }
    }

    self.callCommentsThroughSign = function () {

        var sectionGUID = localStorage.getItem('sign_sectionGUID');
        var section = {
            "sectionGUID": sectionGUID
        }
        if (section.sectionGUID) {
            var parentSection = null;
            self.selectedSectionNew = ReportWriteService.findSectionByGUID(sectionGUID);

            if (self.selectedSectionNew.isVisibleInToc) {
                parentSection = self.selectedSectionNew;
            } else {
                parentSection = ReportWriteService.findParentOrVisibleSection(self.selectedSectionNew.sectionID);
            }

            self.sectionClicked(parentSection, true);

            $scope.ck.currentSection = self.selectedSectionNew;
            window.setTimeout(function () {
                HelperService.genericScrollTo(jQuery("#rightContent"), jQuery("#section_" + self.selectedSectionNew.sectionID), jQuery("#rightContent"), 0);
            }, 200);


            //comments starts

            self.reportAuthoringWriteSelected = 'Comments';
            ReportWriteService.setSelectedReportTabName(self.reportAuthoringWriteSelected);//set tab name
            $('#li_toc').removeClass('active');
            $('#li_comments').addClass('active');
            $('#loading').hide();
            $scope.ck.commentsErrorStatus = false;
            $scope.ck.commentsErrorText = "";
            $scope.ck.checkComments = false;
            $scope.ck.newComm = false;
            $scope.ck.serviceResponseAlert = true;

            var commentFilterSelected = localStorage.getItem('commentFilterSelected');
            if (commentFilterSelected) {
                $scope.ck.selSection_Comments = commentFilterSelected;
                $scope.ck.getCommentsByFilter(commentFilterSelected, section);

            } else {

                $scope.ck.selSection_Comments = 0;
                $scope.ck.getCommentsBySection(section);

            }
        }
    }

    function init() {
        self.sectionCompiledArray = [];
 
        if ($scope.ck.showAllSections) {
            $("#loading").show();
            $timeout(function () {
                $scope.ck.currentCompliedsections = [];

                for (var sectionIndex = 0; $scope.ck.resp.sections.length > sectionIndex; sectionIndex++) {
                    var section = $scope.ck.resp.sections[sectionIndex];
                    self.renderSectionsForAllSectionMode(section);
                }
                if (self.currentCompliedsections.length > 0) {
                    window.sessionStorage.setItem('handleAfterScroll', true);

                }
                var lastSectionId = self.currentCompliedsections[self.currentCompliedsections.length - 1];
                var setTimeoutall = null;

                $('#divsection_' + lastSectionId).bind('DOMNodeInserted', function (e) {
                    window.clearTimeout(setTimeoutall);
                    setTimeoutall = window.setTimeout(function () {

                        window.sessionStorage.setItem('handleAfterScroll', false);
                        $("#loading").hide();
                        HelperService.windowResize();
                        self.scrollUp($scope.ck.selectedSection.sectionID);

                    }, 250);
                });
            }, 10)

        } else {
            $timeout(function () {
                if ($scope.ck.selectedSection) {
                    ReportWriteService.setSelectedSection($scope.ck.selectedSection);
                    if ($scope.ck.sectionIdList.indexOf($scope.ck.selectedSection.sectionID) > 0) {
                        self.nextDisabled = false;
                        self.prevDisabled = false;
                    }
                }
                HelperService.windowResize();
            }, 500);
        }

          ReportWriteService.setSelectedReportTabName(self.reportAuthoringWriteSelected);//set tab name
    }

    init();

    self.openLeftPanel = function (tabName) {

        self.reportAuthoringWriteSelected = tabName;
        ReportWriteService.setSelectedReportTabName(tabName);//set tab name
        if (window.sessionStorage.getItem('isFindreplaceRunning') == "true") {
            FindReplace.reset();
            window.sessionStorage.setItem('isFindreplaceRunning', false);
        }

        if (tabName != "Spellcheck") {

            if (window.sessionStorage.getItem('isSpellcheckRunning') == "true" && window.sessionStorage.getItem('isSpellcheckClosed') != "true") {
                if (window.sessionStorage.getItem('isSpellcheckPause') != 'true') {
                    Spellcheck.pause();
                    window.sessionStorage.setItem('isSpellcheckPause', true);
                }
            }
            window.sessionStorage.setItem('handleAfterScroll', false);
            window.sessionStorage.setItem('isSpellcheckRunning', false);
            window.sessionStorage.setItem('isSpellcheckClosed', true);
        }


        $(".leftContent").removeClass("report-menu-width");
        $(".leftContent").addClass("col-md-4");
        $("#rightContent").addClass("col-md-8");
        $("#section-toggle").removeClass("sidesection-icon");
        $timeout(function () {
            HelperService.windowResize();
        }, 300);
    }


    self.gotoNextSection = function () {
        if ($scope.ck.selectedSection) {

            //self.isGISelected = false;
            // setGIFlag();
            var nextSectionIndex = $scope.ck.sectionIdList.indexOf($scope.ck.selectedSection.sectionID) + 1;
            if (nextSectionIndex < $scope.ck.sectionIdList.length) {
                var nextSectionID = $scope.ck.sectionIdList[nextSectionIndex];
                //filter self.sectionGUIDList                                

                var nextSection = null;
                nextSection = ReportWriteService.filterParentSectionById(nextSectionID);
                if (!nextSection) {
                    ////if not parent then find child section.
                    if ($scope.ck.selectedSection.sections) {
                        nextSection = ReportWriteService.checkIfChildSectionExist($scope.ck.selectedSection, nextSectionID);
                    }
                    if (!nextSection) {
                        nextSection = ReportWriteService.findChildSectionById(nextSectionID);
                    }
                }

                if (self.reportAuthoringWriteSelected != 'Spellcheck') {
                    //Save previous section data if changed                
                    var changedSectionData = angular.copy($scope.ck.selectedSection);
                    // if (self.rigthSectionForm.$dirty || self.isCkDirty)
                    if (self.isCkDirty) {
                        self.saveSectionAfterNavigation(changedSectionData);
                    }
                } else {

                    if (window.sessionStorage.getItem('isSpellcheckPause') == "true") {
                        window.sessionStorage.setItem('isSpellcheckClosed', true);
                    }
                }

                self.sectionClicked(nextSection, true);

                if (self.reportAuthoringWriteSelected == 'Find/Replace') {
                    if ($scope.ck.SelectedMode == 'single') {
                        $timeout(function () {
                            FindReplace.reset();
                            FindReplace.displayFindAndReplacePanelActiveSection($scope.ck.obj.selectedSection, self.childSectionArray);
                        }, 50);
                    }
                }



                self.scrollToSectionAfterNavigation($scope.ck.selectedSection.sectionID);


                self.prevDisabled = false;
                if (nextSection.isGeneralInfo)
                    $scope.ck.isGISelected = true;

                if (nextSectionIndex == $scope.ck.sectionIdList.length - 1) {
                    self.nextDisabled = true;
                }
            }
        }
    }

    self.gotoPrevSection = function () {
        if ($scope.ck.selectedSection) {

            //self.isGISelected = false;
            //setGIFlag();
            var prevSectionIndex = $scope.ck.sectionIdList.indexOf($scope.ck.selectedSection.sectionID) - 1;
            if (prevSectionIndex >= 0) {
                var prevSectionID = $scope.ck.sectionIdList[prevSectionIndex];

                var prevSection = null;
                prevSection = ReportWriteService.filterParentSectionById(prevSectionID);
                if (!prevSection) {
                    ////if not parent then find child section.
                    if ($scope.ck.selectedSection.sections) {
                        prevSection = ReportWriteService.checkIfChildSectionExist($scope.ck.selectedSection, prevSectionID);
                    }
                    if (!prevSection) {
                        prevSection = ReportWriteService.findChildSectionById(prevSectionID);
                    }
                }

                if (prevSection.isGeneralInfo)
                    $scope.ck.isGISelected = true;


                if (self.reportAuthoringWriteSelected != 'Spellcheck') {
                    //Save previous section data if changed
                    var changedSectionData = angular.copy($scope.ck.selectedSection);
                    //if ($scope.rigthSectionForm.$dirty || self.isCkDirty)
                    if (self.isCkDirty) {
                        self.saveSectionAfterNavigation(changedSectionData);
                    }
                } else {

                    if (window.sessionStorage.getItem('isSpellcheckPause') == "true") {
                        window.sessionStorage.setItem('isSpellcheckClosed', true);
                    }
                }

                self.sectionClicked(prevSection, true);

                if (self.reportAuthoringWriteSelected == 'Find/Replace') {
                    if ($scope.ck.SelectedMode == 'single') {
                        $timeout(function () {
                            FindReplace.reset();
                            FindReplace.displayFindAndReplacePanelActiveSection($scope.ck.obj.selectedSection, self.childSectionArray);
                        }, 50);
                    }
                }

                self.nextDisabled = false;

                if (prevSection.sectionID == $scope.ck.sectionIdList[0]) {
                    self.prevDisabled = true;
                }

                self.scrollToSectionAfterNavigation($scope.ck.selectedSection.sectionID);
            }

        } else {
            self.prevDisabled = true;
        }
    }


    self.switchViewMode = function () {

        $scope.ck.showAllSections = !$scope.ck.showAllSections;

        setGIFlag();
        self.childSectionArray = [];
        if (!$scope.ck.showAllSections) {
            //single mode
            //filter and select first section while moving from all-section-mode to single-section-mode

            $scope.ck.selectedSection = $scope.ck.resp.sections[0];
            if (!(self.sectionCompiledArray.indexOf($scope.ck.selectedSection.sectionID) > 0)) {
                self.sectionCompiledArray.push($scope.ck.selectedSection.sectionID);

            }
            self.childSectionArray.push($scope.ck.selectedSection.sectionID);

            $scope.ck.currentSection = $scope.ck.resp.sections[0];
            window.sessionStorage.setItem('currentSectionId', $scope.ck.resp.sections[0].sectionID);
            var sectionName = $filter('limitTo')($scope.ck.currentSection.sectionName, 50, 0);
            if ($scope.ck.currentSection.sectionName.length > 50) {
                sectionName = sectionName + '...';
            }

            $("#topSectionNameId").html($scope.ck.currentSection.sectionNumber + '  ' + sectionName);
            // $("#spellcheckSectionInfo").html($scope.ck.currentSection.sectionNumber + '  ' + sectionName);

            self.scrollUp($scope.ck.selectedSection.sectionID);

            ReportWriteService.scrollToLeftSection($scope.ck.selectedSection.sectionID);
            setGIFlag();
            $scope.ck.otherViewModeMsg = "All Sections Mode";
            if (self.isEditAllTables) {
                self.saveAllTable('ALL_SECTIONS');
            }


        } else {

            var isSpellcheckRunning = window.sessionStorage.getItem('isSpellcheckRunning');
            var isFindreplaceRunning = window.sessionStorage.getItem('isFindreplaceRunning');


            self.currentCompliedsections = [];
            for (var sectionIndex = 0; $scope.ck.resp.sections.length > sectionIndex; sectionIndex++) {
                var section = $scope.ck.resp.sections[sectionIndex];
                self.renderSectionsForAllSectionMode(section);
            }

            if (self.currentCompliedsections.length > 0) {
                window.sessionStorage.setItem('handleAfterScroll', true);
                $("#loading").show();


                var lastSectionId = self.currentCompliedsections[self.currentCompliedsections.length - 1];
                var setTimeoutall = null;

                $('#divsection_' + lastSectionId).bind('DOMNodeInserted', function (e) {
                    window.clearTimeout(setTimeoutall);
                    setTimeoutall = window.setTimeout(function () {
                        window.sessionStorage.setItem('handleAfterScroll', false);
                        $("#loading").hide();
                        $('#divsection_' + lastSectionId).unbind('DOMNodeInserted');
                        if (isSpellcheckRunning == "true") {
                            window.setTimeout(function () {

                                if (!$("#chkNarrativeOnly").is(':checked')) {
                                    $scope.reportWrite.editAllTables(true);
                                }
                                // window.sessionStorage.setItem('handleAfterScroll', true);
                                $('.spellcheckbody').show();
                                $('.spellcheckButton').show();
                                $('#spellcheck-save').show();
                                $('#spellcheck-close').show();
                                $('#spellcheckStartupBtn').hide();
                                if (self.GISelectedSectionId == -1) {
                                    self.GISelectedSectionId = $scope.ck.allsectionIdList[0];
                                }
                                var sectionIdlist = angular.copy($scope.ck.allsectionIdList);
                                var gisectionIndex = sectionIdlist.indexOf(self.GISelectedSectionId);
                                sectionIdlist.splice(gisectionIndex, 1);

                                Spellcheck.displaySpellcheckPanelAllSections(sectionIdlist);
                            }, 500)
                        }
                        HelperService.windowResize();
                    }, 250);
                });
            } else {
                if (isSpellcheckRunning == "true") {
                    window.setTimeout(function () {
                        if (!$("#chkNarrativeOnly").is(':checked')) {
                            $scope.reportWrite.editAllTables(true);
                        }

                        // window.sessionStorage.setItem('handleAfterScroll', true);
                        $('.spellcheckbody').show();
                        $('.spellcheckButton').show();
                        $('#spellcheck-save').show();
                        $('#spellcheck-close').show();
                        $('#spellcheckStartupBtn').hide();
                        if (self.GISelectedSectionId == -1) {
                            self.GISelectedSectionId = $scope.ck.allsectionIdList[0];
                        }
                        var sectionIdlist = $scope.ck.allsectionIdList;
                        var gisectionIndex = sectionIdlist.indexOf(self.GISelectedSectionId);
                        sectionIdlist.splice(gisectionIndex, 1);

                        Spellcheck.displaySpellcheckPanelAllSections(sectionIdlist);
                    }, 500)
                }
            }
            // }

            // }
            $scope.ck.otherViewModeMsg = "Single Section Mode";
            self.scrollToSectionAfterNavigation($scope.ck.selectedSection.sectionID);
        }

        if ($scope.ck.selectedSection.isGeneralInfo) {
            angular.element("#ckeditorTopToolbar").hide();
            angular.element("#tableCkEditorTopToolbar").hide();
        }
        $timeout(function () {
            ReportWriteService.setSelectedSection($scope.ck.selectedSection);
        }, 100)
    }


    self.tocTabClicked = function () {
        $timeout(function () {
        if (sessionStorage.getItem("reportStatusAbbreviation") == 'FIN') {
          $(".addressedFlag").hide();
          $(".unAddressedFlag").hide();
        }
        else
        {
                    var promise = ReportAuthoringAPI.getToC($scope.ck.reportId);

            return promise.then(function (result) {
                for (var sectionIndex = 0; $scope.ck.resp.sections.length > sectionIndex; sectionIndex++) {
                    for (var i = 0; result.tableOfContent.sections.length > i; i++) {
                        if ($scope.ck.resp.sections[sectionIndex].isVisibleInToc && !$scope.ck.resp.sections[sectionIndex].isAppendix) {
                            if (result.tableOfContent.sections[i].sectionGUID) {
                                if (result.tableOfContent.sections[i].sectionGUID.toLowerCase() == $scope.ck.resp.sections[sectionIndex].sectionGUID.toLowerCase()) {

                                    $scope.ck.setCommentFlag($scope.ck.resp.sections[sectionIndex], result.tableOfContent.sections[i]);
                                }
                            }

                        }

                    }
                }

                $timeout(function () {

                    ReportWriteService.setSelectedSection($scope.ck.selectedSection);

                }, 20)
            }, function (error) {
                console.log("error");
            });


        }
        });
    }



    $scope.removeEmptyHistory = function (itm) {
        if (itm)
            return itm;
    }

    self.setHistoryInstructionFlag = function () {

        $localStorage.historyInstructionFlag = true;

    }

    self.getHistoryInstructionFlag = function () {
        return $localStorage.historyInstructionFlag;
    }

    self.setLibraryInstructionFlag = function () {

        $localStorage.libraryInstructionFlag = true;

    }
    self.getLibraryInstructionFlag = function () {
        return $localStorage.libraryInstructionFlag;
    }



    function setGIFlag() {
        if ($scope.ck.selectedSection.isGeneralInfo || $scope.ck.showAllSections) {
            $scope.ck.isGISelected = true;
        } else {
            $scope.ck.isGISelected = false;
        }
    }

    self.editAllTables = function (isEditAllTables) {
        $scope.$broadcast("editAllTables", isEditAllTables);
        self.isEditAllTables = isEditAllTables;

        //$rootScope.$broadcast("custom.event");
    }



    self.sectionClicked = function (section, avoidScroll) {
        angular.element("#ckeditorTopToolbar").show();
        angular.element("#tableCkEditorTopToolbar").hide();

        if (!section.clickable)
            return false;

        $scope.ck.selectedSection = section;
        $scope.ck.currentSection = section;
        $scope.ck.obj.selectedSection = section.sectionID;
        $scope.ck.selectedSectionGUID = section.sectionGUID;

        self.childSectionArray = [];
        window.sessionStorage.setItem('currentSectionId', section.sectionID);
        window.sessionStorage.setItem('currentTocSectionId', section.sectionID);
        window.sessionStorage.setItem('isSpellcheckPause', false);

        //Compile sections
        self.currentCompliedsections = [];
        compileSection(section);

        if (self.currentCompliedsections.length > 0) {
            window.sessionStorage.setItem('handleAfterScroll', true);
            $("#loading").show();

            var lastSectionId = self.currentCompliedsections[self.currentCompliedsections.length - 1];
            var setTimeout = null;
            $('#divsection_' + lastSectionId).bind('DOMNodeInserted', function (e) {
                window.clearTimeout(setTimeout);
                setTimeout = window.setTimeout(function () {
                    $('#divsection_' + lastSectionId).unbind('DOMNodeInserted');
                    window.sessionStorage.setItem('handleAfterScroll', false);
                    $("#loading").hide();

                    if (self.reportAuthoringWriteSelected == 'Spellcheck' && $("#spellcheckCont").css('display') != "none") {

                        $("#btn_addToDictionary").attr('disabled', false);
                        $("#btn_ignore").attr('disabled', false);
                        $("#btn_ignore_all").attr('disabled', false);
                        $("#btn_replace_sp").attr('disabled', false);
                        $("#btn_replace_sp_all").attr('disabled', false);
                        if (window.sessionStorage.getItem('isSpellcheckRunning') == "true" || window.sessionStorage.getItem('isSpellcheckClosed') == "true") {
                            jQuery('#spellcheckTypo').val('');
                            if (!$scope.ck.showAllSections) {
                                $timeout(function () {
                                    Spellcheck.reset();
                                    if ($scope.ck.selectedSection.isGeneralInfo) {
                                        var GIScopesArray = getScopeService.getGIScope();
                                        for (var index = 0; GIScopesArray.length > index; index++) {
                                            GIScopesArray[index].editMode = true;
                                        }
                                    } else {
                                        if (!$("#chkNarrativeOnly").is(':checked')) {
                                            $scope.reportWrite.editAllTables(true);
                                        }
                                    }
                                    Spellcheck.displaySpellcheckPanelActiveSection($scope.ck.obj.selectedSection, self.childSectionArray);
                                }, 200);

                            } else {

                                $timeout(function () {
                                    if (!$scope.ck.selectedSection.isGeneralInfo) {
                                        Spellcheck.resumeSection(section.sectionID);
                                    }
                                }, 200);
                            }
                        }
                    }

                }, 250);
                self.currentCompliedsections = [];
            });
        } else {
            if (self.reportAuthoringWriteSelected == 'Spellcheck' && $("#spellcheckCont").css('display') != "none") {
                $("#btn_addToDictionary").attr('disabled', false);
                $("#btn_ignore").attr('disabled', false);
                $("#btn_ignore_all").attr('disabled', false);
                $("#btn_replace_sp").attr('disabled', false);
                $("#btn_replace_sp_all").attr('disabled', false);
                if (window.sessionStorage.getItem('isSpellcheckRunning') == "true" || window.sessionStorage.getItem('isSpellcheckClosed') == "true") {

                    jQuery('#spellcheckTypo').val('');
                    if (!$scope.ck.showAllSections) {
                        $timeout(function () {
                            Spellcheck.reset();

                            if ($scope.ck.selectedSection.isGeneralInfo) {
                                var GIScopesArray = getScopeService.getGIScope();
                                for (var index = 0; GIScopesArray.length > index; index++) {
                                    GIScopesArray[index].editMode = true;
                                }
                            } else {
                                if (!$("#chkNarrativeOnly").is(':checked')) {
                                    $scope.reportWrite.editAllTables(true);
                                }
                            }
                            Spellcheck.displaySpellcheckPanelActiveSection($scope.ck.obj.selectedSection, self.childSectionArray);
                        }, 200);

                    } else {

                        $timeout(function () {
                            if (!$scope.ck.selectedSection.isGeneralInfo) {
                                Spellcheck.resumeSection(section.sectionID);
                            }
                        }, 200);
                    }
                }
            }

        }


        if (section.isGeneralInfo) {
            self.GISelectedSectionId = section.sectionID;
            $("#loading").hide();
        }
        $timeout(function () {
            HelperService.windowResize();
        }, 300);
        ReportWriteService.setReportStatus();

        ReportWriteService.setSelectedSection($scope.ck.selectedSection);
        var sectionName = $filter('limitTo')($scope.ck.currentSection.sectionName, 50, 0);
        if ($scope.ck.currentSection.sectionName.length > 50) {
            sectionName = sectionName + '...';
        }

        $("#topSectionNameId").html($scope.ck.currentSection.sectionNumber + ' ' + sectionName);

        self.nextDisabled = false;
        self.prevDisabled = false;
        var sectionIndex = $scope.ck.sectionIdList.indexOf(section.sectionID);
        if (sectionIndex == ($scope.ck.sectionIdList.length - 1))
            self.nextDisabled = true;
        if ($scope.ck.sectionIdList[0] == section.sectionID)
            self.prevDisabled = true;

        if (!section.isGeneralInfo) {
            $('#ckeditorTopToolbar').css('display', 'block');
            $scope.ck.isGISelected = false;
        } else {
            $('#ckeditorTopToolbar').css('display', 'none');
            $scope.ck.isGISelected = true;
        }

        /* if (!section.isGeneralInfo && !$scope.ck.showAllSections) {
             $scope.ck.isGISelected = false;
         } else if (section.isGeneralInfo) {
             $scope.ck.isGISelected = true;
              if (!section.isGeneralInfo && !$scope.ck.showAllSections)
             $scope.ck.isGISelected = false;
         else if (section.isGeneralInfo)
             $scope.ck.isGISelected = true;
         }*/

        if ($scope.ck.showAllSections && !avoidScroll) {

            $timeout(function () {
                // $location.hash('section_' + sectionId);
                $location.hash('divsection_' + section.sectionID);
                $anchorScroll();
                //The below is to avoid scrolling again after section click.
            })


        } else if (!$scope.ck.showAllSections) {
            self.scrollUp(section.sectionID);
        }

        loadSectionsOnScroll();

        //check if section has updated value 
        if (self.reportAuthoringWriteSelected != 'Spellcheck') {
            var promise = ReportAuthoringAPI.getSection($scope.ck.reportId, section.sectionID, section.sectionGUID);
            promise.then(function (result) {
                var oldDate = new Date(section.updatedDate);
                var newDate = new Date(result.createDate);

                if (oldDate < newDate) {
                    var promise = $scope.ck.getReportToc($scope.ck.reportId);
                    $scope.ck.waitingProcessResources.promise = promise;
                    $scope.ck.waitingProcessResources.message = "There is new data available for this section. Please wait while the report gets refreshed.";
                    promise.then(
                        function () {
                            $scope.ck.resp.sections = $scope.ck.toc.sections;
                            window.setTimeout(function () {
                                //if ($scope.ck.sectionIdList.indexOf(section.sectionID) > -1) {
                                // $scope.ck.tocsectionselected = section;
                                ReportWriteService.setSelectedSection($scope.ck.selectedSection)
                                    // }
                            }, 300)
                        });
                }
                /*else {
                                       if ($scope.ck.sectionIdList.indexOf(section.sectionID) > -1) {
                                           $scope.ck.tocsectionselected = section;

                                       }

                }*/

            });
        }
    }

    function loadSectionsOnScroll() {
        $scope.ck.commentsErrorText = "";
        $scope.ck.commentsErrorStatus = false;
        if (self.reportAuthoringWriteSelected == "Library")
            $scope.ck.selectedLibraryChanged();

        if (self.reportAuthoringWriteSelected == "History")
            $scope.ck.getHistoryForSections();

        if (self.reportAuthoringWriteSelected == "Comments")
            $scope.ck.getReportComments();
    }

    $scope.$on('set-selected-section', function (event, args) {

        if (args.sectionId) {
            // console.log(" args.sectionId" + args.sectionId);
            window.sessionStorage.setItem('currentSectionId', args.sectionId);

            var section = ReportWriteService.findChildSectionById(args.sectionId);
            if (!section) {
                return;
            }
            if (section.isGeneralInfo) {
                self.GISelectedSectionId = section.sectionID;
            }
            $scope.ck.currentSection = section;

            if ($scope.ck.currentSection && $scope.ck.currentSection.isVisibleInToc) {
                $scope.ck.selectedSection = $scope.ck.currentSection;
            } else {
                if (args.scrollType && args.scrollType == 'UP') {
                    var parentSection = ReportWriteService.filterParentSectionById(args.sectionId);
                    if (parentSection) {
                        $scope.ck.selectedSection = parentSection;
                    } else {

                        var visibleSection = ReportWriteService.findParentOrVisibleSection(args.sectionId);
                        if (visibleSection && visibleSection.sectionID) {
                            $scope.ck.selectedSection = visibleSection;
                        }
                    }
                }
            }
            var sectionName = $filter('limitTo')($scope.ck.currentSection.sectionName, 50, 0);
            if ($scope.ck.currentSection.sectionName.length > 50) {
                sectionName = sectionName + '...';
            }

            //  if (window.sessionStorage.getItem('isSpellcheckRunning') != "true") {
            $("#topSectionNameId").html($scope.ck.currentSection.sectionNumber + '  ' + sectionName);
            //}


            ReportWriteService.setSelectedSection($scope.ck.selectedSection)



            if (!section.isGeneralInfo) {                
                $scope.ck.selectedSectionGUID = section.sectionGUID;                
                loadSectionsOnScroll();            
            }
            if ($scope.ck.currentSection.sectionNumber != '') {
                jQuery('#FRSectionNumberId').text($scope.ck.currentSection.sectionNumber);
            }

            if ($scope.ck.sectionIdList.indexOf($scope.ck.selectedSection.sectionID) > 0) {

                self.nextDisabled = false;
                self.prevDisabled = false;
            }


            event.stopPropagation();
        }
    })

    function compileSection(section) {

        if (self.childSectionArray.indexOf(section.sectionID) === -1) {
            self.childSectionArray.push(section.sectionID);
        }
        if (self.sectionCompiledArray.indexOf(section.sectionID) === -1) {
            var childtempscope = scopeArray.getScope(section.sectionID);
            if (childtempscope && childtempscope.html) {
                var childfilteredHtml = childtempscope.html.replace(/id='ckEdit'/g, "data-ck-editor");
                compiledElement = $compile(childfilteredHtml)(childtempscope);
                self.sectionCompiledArray.push(childtempscope.sectionID);
                self.currentCompliedsections.push(section.sectionID);
                var htmlElement = '#section_' + section.sectionID;
                var pageElement = $(htmlElement);
                pageElement.append(compiledElement);

            }
        }
        for (var childsectionIndex = 0; section.sections.length > childsectionIndex; childsectionIndex++) {
            var childsection = section.sections[childsectionIndex];
            if (!childsection.isVisibleInToc) {
                compileSection(childsection);

            }
        }

        $timeout(function () {

            if (!$scope.ck.showAllSections)
                $("#rightContent").scrollTop(0);
        }, 300);

    }

    self.sectionVisible = function (section) {

        if ($scope.ck.selectedSection) {
            return $scope.ck.showAllSections || self.childSectionArray.indexOf(section.sectionID) > -1;
        } else return $scope.ck.showAllSections;

    }


    self.setSection_click = function (section) {
        if (window.sessionStorage.getItem('isSpellcheckRunning') == "true") {
            return false;
        }
        if (window.sessionStorage.getItem('isFindreplaceRunning') == "true") {
            return false;
        }
        var currentSectionId = parseInt(window.sessionStorage.getItem('currentSectionId'));
        if (currentSectionId != section.sectionID) {

            window.sessionStorage.setItem('currentSectionId', section.sectionID);

            //var section = ReportWriteService.findChildSectionById(sectionId);
            if (section.isGeneralInfo) {
                self.GISelectedSectionId = section.sectionID;
            }
            $scope.ck.currentSection = section;

            $scope.ck.selectedSectionGUID = section.sectionGUID;
            if ($scope.ck.currentSection.isVisibleInToc) {
                $scope.ck.selectedSection = $scope.ck.currentSection;
            } else {

                var parentSection = ReportWriteService.filterParentSectionById(section.sectionID);
                if (parentSection) {
                    $scope.ck.selectedSection = parentSection;
                } else {

                    var visibleSection = ReportWriteService.findParentOrVisibleSection(section.sectionID);
                    if (visibleSection && visibleSection.sectionID) {
                        $scope.ck.selectedSection = visibleSection;
                    }
                }
            }
            var sectionName = $filter('limitTo')($scope.ck.currentSection.sectionName, 50, 0);
            if ($scope.ck.currentSection.sectionName.length > 50) {
                sectionName = sectionName + '...';
            }

            $("#topSectionNameId").html($scope.ck.currentSection.sectionNumber + '  ' + sectionName);
            //$("#spellcheckSectionInfo").html($scope.ck.currentSection.sectionNumber + '  ' + sectionName);
            ReportWriteService.setSelectedSection($scope.ck.selectedSection)

            loadSectionsOnScroll();

            if ($scope.ck.selectedSection.sectionID == $scope.ck.sectionIdList[$scope.ck.sectionIdList.length - 1]) {

                self.nextDisabled = true;
                self.prevDisabled = false;
            }

            if ($scope.ck.selectedSection.sectionID == $scope.ck.sectionIdList[0]) {

                self.nextDisabled = false;
                self.prevDisabled = true;
            }

        }

    }



    //start Scroll 
    self.scrollToSectionAfterNavigation = function (sectionId) {

        // var name = 'section_' + sectionId;
        var name = 'divsection_' + sectionId;

        var elementRight = document.getElementById(name);
        /*if(self.showAllSections)
        $scope.$broadcast('set-skip-handle-scroll-top-condition-true');*/

        var leftContentName = 'tocSection_' + sectionId;
        var leftContentElement = document.getElementById(leftContentName);
        if (leftContentElement) {
            //left section scroll for chrome or safari
            if ($scope.ck.isChrome) {
                leftContentElement.scrollIntoViewIfNeeded();
            } else {
                // for other browsers
                //leftContentElement.scrollIntoView();
                ReportWriteService.scrollToLeftSection(sectionId);
            }
        }

        //right section scroll
        $timeout(function () {
            //elementRight.scrollIntoView();
            $location.hash(name);
            $anchorScroll();

            if (!$scope.ck.showAllSections)
                $("#rightContent").scrollTop(0);
        });
    }



    self.scrollUp = function (sectionId) {
            // var elementId = 'section_' + sectionId;
            var elementId = 'divsection_' + sectionId;
            $timeout(function () {
                $location.hash(elementId);
                $anchorScroll();
                //$('html,body').animate({scrollTop: $("#"+elementId).offset().top},'slow');
            });
        }
        //end Scroll

    self.flagClicked = function (section) {

        localStorage.setItem('flagClicked', true);
        if (section.hasComments) {
            self.sectionClicked(section, true);
            $('#li_toc').removeClass('active');
            $('#li_comments').addClass('active');
            self.reportAuthoringWriteSelected = 'Comments';
            $scope.ck.commentsErrorStatus = false;
            $scope.ck.commentsErrorText = "";
            $scope.ck.checkComments = false;
            $scope.ck.newComm = false;
            $scope.ck.serviceResponseAlert = true;
            $scope.ck.selectedSection = section;
            $scope.ck.currentSection = section;

            window.sessionStorage.setItem('currentSectionId', section.sectionID);
            var commentFilterSelected = localStorage.getItem('commentFilterSelected');
            if (commentFilterSelected) {
                $scope.ck.selSection_Comments = commentFilterSelected;
                $scope.ck.getCommentsByFilter(commentFilterSelected, section);

            } else {
                $scope.ck.selSection_Comments = 0;
                $scope.ck.getCommentsBySection(section);
            }

        }
    }


    self.getFlag = function (index) {

        $("#divHeightChild" + index).prev().removeClass('language-area-default');
        var heightWithOutcss = $("#divHeightChild" + index).prev().height();
        $("#divHeightChild" + index).prev().addClass('language-area-default');
        //return true;
        //var name = "#divHeightChild"+index;
        //var height = $("#divHeightChild"+index).prev().children().height();
        //var height = $("#divHeightChild"+index).parent().height();
        var totalheight = 0;
        //var length = $("#divHeightChild"+index).prev().children().length;
        var i = 0;
        var countBlankEle = 0;
        var nonBlankEle = 0;
        for (i; i < $("#divHeightChild" + index).prev().children().length; i++) {

            /*$("#divHeightChild" + index).prev().children().eq(i).html() == "&nbsp;"
                countBlankEle = countBlankEle + 1;
            else
                nonBlankEle = nonBlankEle + 1;*/

            totalheight += $("#divHeightChild" + index).prev().children().eq(i).height();
            //alert(totalheight);
        }



        if ($("#divHeightChild" + index).prev().children().length == 3 && totalheight < 61)
            return false;
        else {
            if (totalheight >= 57 || heightWithOutcss >= 45)
                return true;
            else
                return false;
        }

    }


    $scope.$on(
        "refresh-history-onFocus",
        function (event, args) {

            event.stopPropagation();
            $scope.historyArr = args;
            if (args.length == 0)
                self.showHistoryMsg = true;
            else
                self.showHistoryMsg = false;
        }
    );

    $scope.$on(
        "refresh-library-onFocus",
        function (event, args) {

            event.stopPropagation();
            self.languages = $filter("selectableLanguages")(args);
        }
    );

    $scope.$on('update-ckedit-data', function (event, args) {
        if (args && args.ckEditData && args.sectionID) {
            var oldSectionData = $filter('filter')($scope.ck.copyOfAllSections, {
                sectionID: args.sectionID
            }, true);
            var sectionIndex = $scope.ck.copyOfAllSections.indexOf(oldSectionData[0]);
            if (sectionIndex > -1) {
                /*self.copyOfAllSections[sectionIndex].sectionData.contentValues.ckEditData = angular.copy(args.ckEditData);*/
                if ($scope.ck.copyOfAllSections[sectionIndex].sectionData.contentValues)
                    $scope.ck.copyOfAllSections[sectionIndex].sectionData.contentValues.ckEditData = angular.copy(args.ckEditData);
            }

        }
        //alert('updated'+ JSON.stringify(args));
        event.stopPropagation();

    });

    //Report Write Save releated methods

    var updatedSections = [];
    var sectionsArray = [];
    var isUpdate = false;

    self.blackAllCurrentSummary = function () {

        if ($scope.ck.selectedSection && !$scope.ck.selectedSection.isGeneralInfo) {
            var currentSection = $scope.ck.selectedSection;
            ReportWriteService.blackAllChildSummariesSection(currentSection);

            self.pNotifySuccessTitle = 'Section text changed to black';
            self.pNotifyErrorTitle = 'Problem changing section text';
            //self.pNotifySuccessMsg = 'Section <strong>' + currentSection.sectionNumber + ' - ' + currentSection.sectionName + '</strong> saved.';
            self.pNotifySuccessMsg = ' ';
            self.pNotifyErrorMsg = 'There was a problem changing the section text to black. Please try again.';
            self.saveSections(currentSection);
        }
    }

    self.blackAllSummaries = function () {
        for (var i = 0; i < $scope.ck.resp.sections.length; i++) {
            ReportWriteService.blackAllChildSummariesSection($scope.ck.resp.sections[i]);
        }

        self.pNotifySuccessTitle = 'Sections text changed to black';
        self.pNotifyErrorTitle = 'Problem changing section text';
        self.pNotifySuccessMsg = ' '; // This is being appended by changed sections in saveSections()
        self.pNotifyErrorMsg = 'There was a problem changing the section text to black. Please try again.';

        self.saveSections($scope.ck.resp.sections);

    }

    self.saveAllTable = function (type) {
        //self.pNotifySuccessTitle = 'Table saved';
        self.pNotifyErrorTitle = 'Problem saving tables';
        switch (type) {
            case "CURRENT_SECTION":
                self.pNotifySuccessTitle = ' ';
                self.pNotifySuccessMsg = 'Tables in section <strong>' + $scope.ck.selectedSection.sectionNumber + ' ' + $scope.ck.selectedSection.sectionName + '</strong> have been saved.';
                self.pNotifyErrorMsg = 'There was a problem saving the table. Please try again.';
                self.saveSections($scope.ck.selectedSection);
                $scope.$broadcast('set-editable-flag');
                break;
            case "ALL_SECTIONS":
                $scope.updatedTableSections = [];
                $scope.$broadcast('save-all-tables', {
                    "copyOfTocData": $scope.ck.copyOfAllSections
                });
                updatedSections = [];
                sectionsArray = [];
                self.pNotifySuccessTitle = ' ';
                self.pNotifySuccessMsg = 'Tables in sections ';
                self.pNotifyErrorMsg = 'There was a problem saving the tables. Please try again.';

                if ($scope.updatedTableSections.length) {
                    for (var sectionIndex = 0; $scope.ck.resp.sections.length > sectionIndex; sectionIndex++) {
                        var section = $scope.ck.resp.sections[sectionIndex];
                        loadupdatedSection(section);
                    }

                    if (sectionsArray.length) {
                        self.pNotifySuccessMsg += "<strong>" + updatedSections.join(", ") + "</strong> have been saved.";
                        updateSections(sectionsArray, null, null, null, null);
                    } else {
                        HelperService.showPNotifyMessage('Everything is up to date.', 'We couldn\'t find any changes to save.', 'info');
                    }
                    $scope.$broadcast('set-editable-flag');
                } else {
                    HelperService.showPNotifyMessage('Everything is up to date.', 'We couldn\'t find any changes to save.', 'info');
                }
                break;
            default:
                return;
        }
    }

    function loadupdatedSection(section) {

        if (section.sectionData && section.sectionData.contentValues) {
            var updatedSectionsFiltered = $filter('filter')($scope.updatedTableSections, section.sectionGUID, true);

            if (updatedSectionsFiltered.length) {
                var obj = {
                    "sectionGUID": section.sectionGUID,
                    "sectionData": {
                        "contentValues": section.sectionData.contentValues
                    }
                }
                sectionsArray.push(obj);

                var updatedSectionsObj = {
                    "sectionNumber": section.sectionNumber,
                    "sectionName": section.sectionName,
                    toString: function () {
                        return this.sectionNumber + " " + this.sectionName;
                    }
                };
                updatedSections.push(updatedSectionsObj);
            }
        }
        for (var childIndex = 0; section.sections.length > childIndex; childIndex++) {
            loadupdatedSection(section.sections[childIndex]);
        }

    }

    function loadsaveSection(section) {

        if (section.sectionData && section.sectionData.contentValues) {

            var oldSectionData = $filter('filter')($scope.ck.copyOfAllSections, {
                sectionGUID: section.sectionGUID
            }, true);
            if (!HelperService.compareObjFunction(oldSectionData[0].sectionData.contentValues, section.sectionData.contentValues)) {
                var obj = {
                    "sectionGUID": section.sectionGUID,
                    "sectionData": {
                        "contentValues": section.sectionData.contentValues
                    }
                }
                if (section.sectionNumber) {
                    self.savedSectionsNames += section.sectionNumber + ' - ' + section.sectionName + ', ';
                } else {
                    self.savedSectionsNames += section.sectionName + ', ';
                }
                sectionsArray.push(obj);
                isUpdate = true;
            }

        }
        for (var childIndex = 0; section.sections.length > childIndex; childIndex++) {
            loadsaveSection(section.sections[childIndex]);
        }

    }

    self.saveSections = function (sectionData, messageText) {
        sectionsArray = [];
        self.savedSectionsNames = '';
        if (!angular.isArray(sectionData)) {

            loadsaveSection(sectionData);
            if (isUpdate && sectionsArray.length) {
                updateSections(sectionsArray, sectionData.sectionName, sectionData.sectionNumber, null, sectionData.sectionID);
            } else {
                HelperService.showPNotifyMessage('Everything is up to date.', 'We couldn\'t find any changes to save.', 'info');
            }
        }
        //Save all sections
        else {
            var updatedSectionsArr = [];
            angular.forEach($scope.ck.resp.sections, function (section, index) {
                loadsaveSection(section);
            });

            if (sectionsArray.length) {
                //self.pNotifySuccessMsg = updatedSectionsArr.join(', ') + ' saved.';
                if (!(messageText && messageText != '')) {
                    self.pNotifySuccessMsg = 'Section <strong>' + self.savedSectionsNames + ' </strong> was saved successfully.';
                }
                updateSections(sectionsArray, null, null, null, null, messageText);
            } else {
                HelperService.showPNotifyMessage('Everything is up to date.', 'We couldn\'t find any changes to save.', 'info');
            }
        }
    }

    function setUpdatedSectionsToOldSections(sectionsArray, changedContentValues, sectionID) {
        if (sectionID && sectionsArray.length == 1) {
            var oldSectionData = $filter('filter')($scope.ck.copyOfAllSections, {
                sectionID: sectionID
            }, true);
            var sectionIndex = $scope.ck.copyOfAllSections.indexOf(oldSectionData[0]);
            if (sectionIndex > -1)
                $scope.ck.copyOfAllSections[sectionIndex].sectionData.contentValues = angular.copy(sectionsArray[0].sectionData.contentValues);
        } else {
            angular.forEach(sectionsArray, function (section, index) {
                var oldSectionData = $filter('filter')($scope.ck.copyOfAllSections, {
                    sectionGUID: section.sectionGUID
                }, true);
                var sectionIndex = $scope.ck.copyOfAllSections.indexOf(oldSectionData[0]);
                if (sectionIndex > -1) {
                    $scope.ck.copyOfAllSections[sectionIndex].sectionData.contentValues = angular.copy(section.sectionData.contentValues);
                    /*if(self.copyOfAllSections[sectionIndex].sectionData){
                        self.copyOfAllSections[sectionIndex].sectionData.contentValues = angular.copy(section.sectionData.contentValues);
                    }*/
                }
            })
        }
    }

    function updateSections(sectionsArray, sectionName, sectionNumber, changedContentValues, sectionID, messageText) {
        var data = {};
        data["formSectionData"] = sectionsArray;
        //$scope.rigthSectionForm.$setPristine();
        if (sectionsArray && sectionsArray.length <= 0) {
            HelperService.showPNotifyMessage('Everything is up to date.', 'We couldn\'t find any changes to save.', 'info');
            return false;
        }

        self.isCkDirty = false;
        var promise = ReportAuthoringAPI.updateSection($scope.ck.reportId, null, data);
        promise.then(function (resp) {
            if (resp.report && resp.report.reportData && resp.report.reportData.formSectionData.length) {
                var updatedSections = resp.report.reportData.formSectionData;
                $scope.$broadcast('disable-save-button');
                var title = self.pNotifySuccessTitle ? self.pNotifySuccessTitle : 'Success';
                var text = self.pNotifySuccessMsg ? self.pNotifySuccessMsg : messageText;
                var type = 'success';


                HelperService.showPNotifyMessage(title, text, type);
                self.isCkDirty = false;
                $scope.ck.lastUpdatedSectionDetails(updatedSections); //set lastupdated details
                setUpdatedSectionsToOldSections(sectionsArray, changedContentValues, sectionID);
                return true;
            } else {
                var msg = 'Failed to update your information. Please try again';
                if (resp.message)
                    msg = resp.message.userMessage;

                var title = self.pNotifySuccessTitle ? self.pNotifySuccessTitle : "Error";
                var text = self.pNotifyErrorMsg ? self.pNotifyErrorMsg + " " + msg : msg;
                var type = 'error';
                HelperService.showPNotifyMessage(title, text, type);
                return false;
            }
        }, function (error) {
            var msg = 'Failed to update your information. Please try again';
            if (error.message)
                msg = error.message.userMessage;

            var title = self.pNotifySuccessTitle ? self.pNotifySuccessTitle : "Error";
            var text = self.pNotifyErrorMsg ? self.pNotifyErrorMsg + " " + msg : msg;
            var type = 'error';
            HelperService.showPNotifyMessage(title, text, type);
        });
    }

    self.saveSectionAfterNavigation = function (changedSectionData) {
        self.sectionsArray = [];
        self.savedSectionsNames = '';

        var changedContentValues;

        createUpdateObjForSectionAndItsChild(changedSectionData);
        var updateArray = angular.copy(self.sectionsArray);
        self.sectionsArray = [];
        if (self.savedSectionsNames) {
            self.savedSectionsNames = self.savedSectionsNames.slice(0, -2);
        }
        self.pNotifySuccessMsg = 'Section <strong>' + self.savedSectionsNames + ' </strong> was saved successfully.';
        updateSections(updateArray, changedSectionData.sectionName, changedSectionData.sectionNumber, changedContentValues, changedSectionData.sectionID);
    }

    var createUpdateObjForSectionAndItsChild = function (section) {
        //var updateArray =[];

        if (section.sectionData && section.sectionData.contentValues) {
            var oldSection = getOldSectionData(section.sectionID);
            var contentValuesObj = null;
            if (oldSection.sectionData) {
                contentValuesObj = oldSection.sectionData.contentValues;
            }
            if (!HelperService.compareObjFunction(contentValuesObj, section.sectionData.contentValues)) {
                var obj = {
                    "sectionGUID": section.sectionGUID,
                    "sectionData": {
                        "contentValues": section.sectionData.contentValues
                    }
                }
                if (section.sectionNumber) {
                    self.savedSectionsNames += section.sectionNumber + ' - ' + section.sectionName + ', ';
                } else {
                    self.savedSectionsNames += section.sectionName + ', ';
                }

                self.sectionsArray.push(obj);
            }
        }
        var nestedSections = section.sections;
        if (!nestedSections || !nestedSections.length) return;

        //create update obj for its child and nested sections.
        for (var childSectionIndex = 0; childSectionIndex < nestedSections.length; childSectionIndex++) {
            var childSection = nestedSections[childSectionIndex];
            if (!childSection.isVisibleInToc) {
                createUpdateObjForSectionAndItsChild(childSection);
            }
        }
    }


    function getOldSectionData(sectionID) {
        var oldSectionData = $filter('filter')($scope.ck.copyOfAllSections, {
            sectionID: sectionID
        }, true);
        if (angular.isArray(oldSectionData)) {
            return oldSectionData[0];
        } else {
            return oldSectionData;
        }
    }
    //Report Write Save releated methods


    //Start Find and Replace
    var findWhat, replaceWith;

    self.findReplaceViewMode = function (SelectedMode) {

        $timeout(function () {

            self.editAllTables(true);
            if ($scope.ck.selectedSection.sectionNumber == '') {
                jQuery('#FRSectionNumberId').hide();
            } else {
                jQuery('#FRSectionNumberId').show();
            }
            jQuery('.fedsearch-box').focus();
            jQuery('#FRSectionNumberId').text($scope.ck.currentSection.sectionNumber);
            window.sessionStorage.setItem('initsectionNumber', $scope.ck.selectedSection.sectionNumber);
        });

        self.SelectedMode = SelectedMode;

        if (SelectedMode == 'all') {
            if (!$scope.ck.showAllSections) {
                var confirmAllSections = confirm('Your report will need to be in "All Sections Mode" with all tables in edit mode to run find and replace on your full report.\n\nWould you like to switch to these modes now?');
                if (confirmAllSections) {
                    self.switchViewMode();
                    $timeout(function () {
                        FindReplace.reset();
                        FindReplace.displayFindAndReplacePanelAllSections($scope.ck.allsectionIdList);
                    }, 200);
                }
                if (!confirmAllSections) {
                    self.showMainButtions = true;
                }
            }
        } else {
            if ($scope.ck.showAllSections) {
                self.switchViewMode();
            }

            $timeout(function () {
                FindReplace.displayFindAndReplacePanelActiveSection($scope.ck.obj.selectedSection, self.childSectionArray);
            }, 200);
        }
    }


    String.prototype.replaceAll = function (search, replacement) {
        var reg = new RegExp(search, 'ig');
        return this.replace(reg, replacement);
    };


    this.replaceAll = function () {

        $timeout(function () {
            FindReplace.replaceAll(self.findWhat);
        }, 200);
    }

    String.prototype.replaceAllOptions = function (_f, _r, _c) {

        var o = this.toString();
        var r = '';
        var s = o;
        var b = 0;
        var e = -1;
        if (_c) {
            _f = _f.toLowerCase();
            s = o.toLowerCase();
        }

        while ((e = s.indexOf(_f)) > -1) {
            r += o.substring(b, b + e) + _r;
            s = s.substring(e + _f.length, s.length);
            b += e + _f.length;
        }

        // Add Leftover
        if (s.length > 0) {
            r += o.substring(o.length - s.length, o.length);
        }

        // Return New String
        return r;
    };

    this.saveReplacedText = function () {

        var sectionData;
        if ($scope.ck.showAllSections) {
            sectionData = $scope.ck.resp.sections;
            self.saveSections(sectionData);
        } else {
            sectionData = $scope.ck.selectedSection;
            if (!$scope.ck.selectedSection.isGeneralInfo) {
                self.editAllTables(false);

                window.setTimeout(function () {
                        var changedSectionData = angular.copy($scope.ck.selectedSection);
                        self.saveSectionAfterNavigation(changedSectionData);
                    }, 200)
                    //self.saveSections(sectionData);
            }
        }

        /* for (var instance in CKEDITOR.instances) {
             var currentInstance = instance;
             var oEditor = CKEDITOR.instances[currentInstance];
             oEditor.focusManager.focus();
             oEditor.focusManager.blur();
         }*/
    }


    this.clearOnFindReplace = function () {
        $timeout(function () {
            FindReplace.reset();
        }, 50);
        clearReplaceInput();
        //window.sessionStorage.setItem('isSpellcheckRunning', false);
        window.sessionStorage.setItem('isFindreplaceRunning', false);
        self.editAllTables(false);

    }

    function clearReplaceInput() {
        self.findWhat = String.empty;
        self.replaceWith = String.empty;
        self.matchCase = false;
        self.findWholeWordsOnly = false;
    }

    self.clearOldFindReplace = function () {
        var currentFindWhat = self.findWhat;
        if (findWhat != self.currentFindWhat) {
            oldKeys = [];
            FindCheckEndCounter = 0;
            visitedSection = [];
        }
    }


    self.findNext = function () {

        $timeout(function () {
            //self.editAllTables(true);
            FindReplace.findNext(self.findWhat);
        }, 200);

    }

    self.resumeFindReplace = function () {
        $timeout(function () {
            FindReplace.resume();
        }, 200);

    }

    self.ReplaceFindNext = function () {
        $timeout(function () {
            FindReplace.replaceAndFindNext(self.findWhat);
        }, 200);
    }

    //End Find Replace


    self.removeLocalStorage = function () {
        HelperService.removeLocalStorage();

    }

}])
