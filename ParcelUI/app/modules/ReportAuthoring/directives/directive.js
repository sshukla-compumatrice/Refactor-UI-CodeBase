angular.module('ReportAuthoring').directive('ckEditor', ['$timeout', 'MouseClickCopyService', 'ReportOutputAPI', '$rootScope', '$compile', '$filter', 'ReportAuthoringAPI', 'DefaultLanguageLibraryAPI', 'ParcelUI.Resources', 'BASEURL', '$stateParams', '$interval', 'PerformedOperation', 'HelperService', function ($timeout, MouseClickCopyService, ReportOutputAPI, $rootScope, $compile, $filter, ReportAuthoringAPI, DefaultLanguageLibraryAPI, ParcelUI_Resources, BASEURL, $stateParams, $interval, PerformedOperation, HelperService) {
    CKEDITOR.disableAutoInline = true;
    /* $rootScope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
     $rootScope.waitingHistoryResources = ParcelUI_Resources.waitingHistoryResources;

     $rootScope.waitingLibraryResources = ParcelUI_Resources.waitingLibraryResources*/



    return {
        require: '?ngModel',
        link: function (scope, elm, attr, ngModel) {
            elm.attr('id', 'ckEditor_' + scope.sectionGUID);
            isSelectionChangeStarted = false;
            isFirefox = false;
            if (scope.flag) {
                scope.$parent.$parent.$parent.ck.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
                scope.$parent.$parent.$parent.ck.waitingHistoryResources = ParcelUI_Resources.waitingHistoryResources;
                scope.$parent.$parent.$parent.ck.waitingLibraryResources = ParcelUI_Resources.waitingLibraryResources;
            }


            if (scope.contentValues != undefined && scope.contentValues != null) {

                var splitArr = attr.ngModel ? attr.ngModel.split('.') : null;
                var ckProp = splitArr && splitArr.length ? splitArr[splitArr.length - 1] : null;
                scope.ckProp = ckProp;
                var filtered = $filter("filter")(scope.contentValues.ImportData, {
                    destinationDivID: ckProp
                });

                // if (scope.contentValues && scope.contentValues.ImportData && scope.contentValues.ImportData.length && filtered && filtered.length) {
                //                var parentEl = elm.parent();
                //                var btnHtmlText = "<div class='text-right bottom-margin-xs'><button class='btn btn-primary btn-md' ng-click='importDataClick(\"" + parentEl + "\")'>Import Data</button></div>";
                //                var templateFn = $compile(btnHtmlText);
                //                parentEl.prepend(templateFn(scope));

            }
            var height = attr.editorHeight;
            var fullPage = attr.editorFullPage;

            CKEDITOR.disableAutoInline = true;
            var ck = CKEDITOR.inline(elm[0], {
                height: height ? height : '100%',
                fullPage: fullPage ? fullPage === "true" : false,
                title: false,
                //height: 500,
                //minHeight: 250
                //extraPlugins: 'sourcedialog',             
                allowedContent: true, //enterMode : CKEDITOR.ENTER_BR, 
                sharedSpaces: {
                    top: 'ckeditorTopToolbar'
                        //                    bottom: 'bottom2'
                },


                //contentsCss: 'scripts/CKEditor/ckEditorStyle.css',
                on: {
                    instanceReady: function (ev) {
                        // Output paragraphs as <p>Text</p>.
                        this.dataProcessor.writer.selfClosingEnd = '>';
                        this.dataProcessor.writer.setRules('p', {
                            indent: false,
                            breakBeforeOpen: false
                                /*,
                                 breakAfterOpen: false,
                                 breakBeforeClose: false,
                                 breakAfterClose: false*/
                        });
                    }
                }

            });




            //var ck = CKEDITOR.inline(elm[0]);


            /*var instance_name = 'editor2';
CKEDITOR.instances[instance_name].events.setData('<p>ankit test may 09 2016</p>');*/

            /* var focusManager = new CKEDITOR.instances['editor1'].focusManager;
             focusManager.focus();*/

            // to be used by other controllers
            // used by 'ReportOutputSetupController' to retrieve editor data
            scope.ckInstance = ck;

            selectSectionElement("title");
            selectSectionElement("sub-title");
            selectSectionElement("sub-sub-title");
            selectSectionElement("narrative");
            selectSectionElement("photos");
            if (scope.resp != undefined) {
                var sectionGUID = scope.resp.sectionGUID;
                var reportGUID = scope.resp.reportGUID;
                var sectionID = scope.resp.sectionID;
            }

            //If CK editor don't want any plugin to display, add remove-ck-plugin attr on ck directive element.
            // e.g- remove-ck-plugin="plugin1,plugin2", seperate plugin name by comma(,). No space.
            if (attr.removeCkPlugin != undefined) {
                var pluginToRemove = attr.removeCkPlugin.split(",");
                for (var i = 0; i < pluginToRemove.length; i++) {
                    scope.ckInstance.config.removePlugins = pluginToRemove[i];
                }
            }


            $rootScope.$on(
                "text-copied",
                function (event, args) {
                    //change cursor to copy
                    //scope.ckInstance.config.contentsCss = 'scripts/CKEditor/textCopy.css';
                    event.stopPropagation();
                    $('iframe').contents().find('body.cke_show_borders').addClass('copy-cursor');
                }
            );

            $rootScope.$on(
                "text-unselected",
                function (event, args) {
                    //change cusror to default
                    //scope.ckInstance.config.contentsCss = 'scripts/CKEditor/textCopy.css';
                    event.stopPropagation();
                    $('iframe').contents().find('body.cke_show_borders').removeClass('copy-cursor');
                }
            );

            scope.ckInstance.config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';

            //This command executed from saveCkData plugin
            ck.addCommand("saveReportWritingCkData", {
                exec: function (edt) {
                    var isSpellcheckRunning = window.sessionStorage.getItem('isSpellcheckRunning');
                    var isFindreplaceRunning = window.sessionStorage.getItem('isFindreplaceRunning');

                    if (isSpellcheckRunning == "false" && isFindreplaceRunning == "false") {
                        scope.stopInterval();
                        if (ck.checkDirty() && scope.isCkDirty == true) {
                            var htmlData = edt.getData();
                            var splitArr = attr.ngModel ? attr.ngModel.split('.') : null;
                            var ckPropName = splitArr && splitArr.length ? splitArr[splitArr.length - 1] : null;
                            scope.contentValues.ckEditData[ckPropName] = htmlData;

                            var data = {
                                "formSectionData": [
                                    {
                                        "sectionGUID": scope.resp.sectionGUID,
                                        "sectionData": {
                                            "operationCode": PerformedOperation.EDIT,
                                            "contentValues": scope.contentValues

                                        }
                              }]
                            };

                            scope.msg = 'Section <strong>' + scope.resp.sectionNumber + ' - ' + scope.resp.sectionName + '</strong> was saved successfully.';
                            updateSection(data);
                            //ReportAuthoringAPI.updateSection($stateParams.reportGuid, scope.sectionGUID, data);
                        }
                    }
                }
            });


            var stopTime;
            ck.on('change', function (event) {

                var isSpellcheckRunning = window.sessionStorage.getItem('isSpellcheckRunning');
                var isFindreplaceRunning = window.sessionStorage.getItem('isFindreplaceRunning');
                if (scope.flag) {
                    window.sessionStorage.setItem('sectionNumber', scope.resp.sectionNumber);
                }

                if (isSpellcheckRunning == "false" && isFindreplaceRunning == "false") {

                    if (ck.checkDirty()) {
                        var _p = ck.plugins.saveReportWritingCkData.path + "icons";
                        $('#cke_ckEditor_' + scope.sectionGUID).find('.cke_button__savebtndisable_icon').css('background-position', '0 0').css('background-image', 'url("' + _p + '/savebtn.png")').css('background-repeat', 'no-repeat');
                    }
                    var editorSaveCounter = 0;

                    editorSaveCounter = 0;
                    scope.isCkDirty = true;

                    // update ng-model
                    ngModel.$setViewValue(ck.getData());
                    if (angular.isDefined(stopTime)) return;
                    stopTime = $interval(function () {
                        editorSaveCounter = 0;
                        scope.stopInterval();
                        if (ck.checkDirty() && scope.isCkDirty == true) {
                            var htmlData = event.editor.getData();
                            var splitArr = attr.ngModel ? attr.ngModel.split('.') : null;
                            var ckPropName = splitArr && splitArr.length ? splitArr[splitArr.length - 1] : null;
                            var oldEditorData = scope.contentValues.ckEditData[ckPropName];

                            // if (oldEditorData != htmlData) {
                            scope.contentValues.ckEditData[ckPropName] = htmlData;

                            var data = {
                                "formSectionData": [
                                    {
                                        "sectionGUID": scope.resp.sectionGUID,
                                        "sectionData": {
                                            "contentValues": scope.contentValues

                                        }
                                    }]
                            };

                            scope.msg = 'Contents auto saved. \n Section <strong>' +
                                scope.resp.sectionNumber + ' - ' + scope.resp.sectionName + '</strong> saved.';

                            //autosave call after 2 minutes
                            updateSection(data);
                        }
                        //}
                    }, 120000);
                }

            });


            scope.stopInterval = function () {
                $interval.cancel(stopTime);
                stopTime = undefined;
            };

            scope.$on('$destroy', function () {
                // Make sure that the interval is destroyed too
                scope.stopInterval();
            });

            ck.on('instanceReady', function (ev) {
                var editor = ev.editor;

                if (window.sessionStorage.getItem('reportStatusAbbreviation') == 'FIN') {
                    $('.cke_contents').css('border', '0px');
                    $('.boxCK .editCK').hide();
                    editor.setReadOnly(true);
                } else {
                    $('.cke_contents').css('border', '1px solid #ddd');
                    $('.boxCK .editCK').show();
                    editor.setReadOnly(false);
                }
                $('#cke_' + ev.editor.name).find(".cke_reset_all").hide();

                $('#ckEditor_' + scope.sectionGUID).mouseup(function () {
                    if (isSelectionChangeStarted) {
                        isSelectionChangeStarted = false;
                        insertHtml();
                        console.log('in editor mouseup');
                        ngModel.$setViewValue(ck.getData());
                    }
                });
                $('#ckEditor_' + scope.sectionGUID).mouseleave(function () {
                    if (isFirefox) {
                        $('body').bind('mouseup', function (ev) {
                            //$('body').unbind('mouseup');
                            insertHtml();
                            console.log('in body mouse event');
                            ngModel.$setViewValue(ck.getData());
                            $('body').unbind('mouseup');
                            isFirefox = false;
                        });
                    }
                });



            });

            ck.on('focus', function (event) {

                //$('#cke_' + event.editor.name).find(".cke_reset_all").show();

                //&& scope.allSectionMode == true
                angular.element("#ckeditorTopToolbar").show();
                angular.element("#tableCkEditorTopToolbar").hide();
                if (scope.flag == "History") {


                    //scope.$parent.$parent.$parent.ck.getHistoryForSections();

                    scope.$parent.$parent.$parent.ck.showHistoryMsg = false;
                    //scope.$parent.getSectionHistory();
                    scope.historyArr = [];
                    ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                    var promise = ReportAuthoringAPI.getHistory($stateParams.reportGuid, scope.sectionGUID);
                    scope.$parent.$parent.$parent.ck.waitingHistoryResources.promise = promise;
                    scope.historyArr = [];
                    return promise.then(function (resp) {

                        for (var i = 0; i < resp.history.length; i++) {

                            scope.historyArr.push(resp.history[i]);
                            ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                        }

                        scope.$emit("refresh-history-onFocus", scope.historyArr);
                        ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                    });
                }

                if (scope.flag == "Library") {
                    var libraryID = ReportAuthoringAPI.getLibraryID();
                    var promise = DefaultLanguageLibraryAPI.getLanguageBySection(libraryID, scope.sectionGUID);
                    scope.$parent.$parent.$parent.ck.waitingLibraryResources.promise = promise;
                    return promise.then(function (languages) {
                        ReportAuthoringAPI.putLanguageArray(languages);
                        scope.$emit("refresh-library-onFocus", languages);
                    })
                }

                //$timeout(function () {
                if (typeof FindReplace.pause === "function") {
                    FindReplace.pause();
                }
                //});


            });

            ck.on('blur', function (event) {

                var isSpellcheckRunning = window.sessionStorage.getItem('isSpellcheckRunning');
                var isFindreplaceRunning = window.sessionStorage.getItem('isFindreplaceRunning');

                if (isSpellcheckRunning == "false" && isFindreplaceRunning == "false") {
                    //$('#cke_' + event.editor.name).find(".cke_reset_all").hide();

                    scope.stopInterval();

                    var splitArr = attr.ngModel ? attr.ngModel.split('.') : null;
                    var ckPropName = splitArr && splitArr.length ? splitArr[splitArr.length - 1] : null;
                    if (ck.checkDirty() && scope.isCkDirty == true) {
                        var htmlData = event.editor.getData();
                        //var oldEditorData = scope.contentValues.ckEditData[ckPropName];

                        // if (oldEditorData != htmlData) {
                        if (scope.contentValues) {
                            scope.contentValues.ckEditData[ckPropName] = htmlData;
                            var data = {
                                "formSectionData": [
                                    {
                                        "sectionGUID": scope.resp.sectionGUID,
                                        "sectionData": {
                                            "operationCode": PerformedOperation.EDIT,
                                            "contentValues": scope.contentValues
                                        }
                              }]
                            };

                            scope.msg = 'Section <strong>' + scope.resp.sectionNumber + ' - ' + scope.resp.sectionName + '</strong> was saved successfully.';
                            //ngModel.$setViewValue(ck.getData());
                            updateSection(data);
                        }

                    }

                    /*if (scope.flag == "History") {

                    //scope.$parent.getSectionHistory();
                    scope.historyArr = [];
                    ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                    var promise = ReportAuthoringAPI.getHistory($stateParams.reportGuid, scope.sectionGUID);
                    scope.$parent.$parent.$parent.ck.waitingHistoryResources.promise = promise;
                    scope.historyArr = [];
                    return promise.then(function (resp) {

                        for (var i = 0; i < resp.history.length; i++) {

                            scope.historyArr.push(resp.history[i]);
                            ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                        }

                        ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                    });
                }*/
                }
                // $(this.contentAreaContainer.parentElement).find("div.cke_reset_all").hide();
                //  $(this.contentAreaContainer.parentElement).find("div.mce-container-body").hide(); 

            });

            ck.on('change', function (event) {
                // update ng-model for dll
                ngModel.$setViewValue(ck.getData());
            });

            ck.on('selectionChange', function (event) {

                //$timeout(function () {

                if (!!window.chrome && !!window.chrome.webstore) {
                    insertHtml();
                    ngModel.$setViewValue(ck.getData());
                } else if (typeof InstallTrigger !== 'undefined') {
                    isFirefox = true;
                    isSelectionChangeStarted = true;
                    /*var selection = event.editor.getSelection().getRanges();
                    if (selection && selection.length) {
                        if (!selection[0].collapsed) {

                        } else {
                            isSelectionChangeStarted = true;
                            //$('#ckEditor_' + scope.sectionGUID).trigger('mouseup');
                        }
                    }*/
                    ngModel.$setViewValue(ck.getData());

                } else {
                    isSelectionChangeStarted = true;
                }

                //});


            });


            $rootScope.$on("cancel-editor-edit", function () {
                if (ngModel.$rollbackViewValue) {
                    ngModel.$rollbackViewValue();
                }
            });

            /* elm.bind('click', function(){
             	window.alert("sdfdsdf");
                 for(name in CKEDITOR.instances)
                     CKEDITOR.instances[name].destroy();
                 CKEDITOR.replace(element[0]);
             });*/
            ngModel.$render = function (value) {
                ck.setData(ngModel.$viewValue);
            };

            ck.on('configLoaded', extendConfig);

            function extendConfig() {
                var currentUserName = scope.$parent.currentUserName;
                var currentUserGuid = scope.$parent.currentUserGuid;
                ck.config.lite.userName = currentUserName;
                ck.config.lite.userId = currentUserGuid;
                //ck.config.lite.isTracking = false;
                /* ck.config.autoGrow_maxHeight: 700,
                ck.config.autoGrow_minHeight: 500,*/
                //removePlugins: 'resize'
                //if(scope.flag)
                ck.config.autoGrow_onStartup = true;
            }


            function disableSaveButton() {
                var _p = ck.plugins.saveReportWritingCkData.path + "icons";
                $('#cke_ckEditor_' + scope.sectionGUID).find('.cke_button__savebtndisable_icon').css('background-position', '0 0').css('background-image', 'url("' + _p + '/savebtndisable.png")').css('background-repeat', 'no-repeat');
            }

            scope.$on('disable-save-button', function (event) {
                disableSaveButton();
            });

            function updateSection(data) {
                scope.newCKData = data.formSectionData[0].sectionData.contentValues;
                ReportAuthoringAPI.updateSection($stateParams.reportGuid, scope.sectionGUID, data)
                    .then(
                        function (response) {

                            if (response.report && response.report.reportData && response.report.reportData.formSectionData.length) {

                                var updatedSection = response.report.reportData.formSectionData[0];
                                var newCkEditData = updatedSection.sectionData.contentValues.ckEditData;
                                scope.$emit('update-ckedit-data', {
                                    ckEditData: newCkEditData,
                                    sectionID: scope.resp.sectionID
                                });
                                disableSaveButton();

                                /*  new PNotify({
                                      title: 'Success',
                                      text: scope.msg,
                                      type: 'success',
                                      addclass: "stack-bottomright",
                                      stack: scope.$parent.stack_bottomright
                                  });*/
                                HelperService.showPNotifyMessage('Success', scope.msg, 'success');
                                scope.isCkDirty = false;

                                var _p = ck.plugins.saveReportWritingCkData.path + "icons";
                                $('#cke_ckEditor_' + scope.sectionGUID).find('.cke_button__savebtndisable_icon').css('background-position', '0 0').css('background-image', 'url("' + _p + '/savebtndisable.png")').css('background-repeat', 'no-repeat');

                                scope.resp.updatedBy = updatedSection.createdBy;
                                scope.resp.updatedDate = updatedSection.createDate;
                                scope.updatedBy = updatedSection.createdBy;
                                scope.updatedDate = updatedSection.createDate;

                                scope.$emit('set-last-updated-section-details', {
                                    updatedSections: response.report.reportData.formSectionData,
                                    //updatedBy: respData.createdBy,
                                    //updatedDate: respData.createDate,
                                    sectionID: scope.resp.sectionID
                                })

                                if (scope.flag == "History") {

                                    //scope.$parent.getSectionHistory();

                                    var promise = ReportAuthoringAPI.getHistory($stateParams.reportGuid, scope.sectionGUID);
                                    scope.$parent.$parent.$parent.ck.waitingHistoryResources.promise = promise;
                                    scope.historyArr = [];
                                    return promise.then(function (resp) {

                                        for (var i = 0; i < resp.history.length; i++) {

                                            scope.historyArr.push(resp.history[i]);
                                            // ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                                        }
                                        ReportAuthoringAPI.putHistoryArray(scope.historyArr);
                                        scope.$emit("refresh-history-onFocus", scope.historyArr);


                                    });
                                }
                            } //success
                            else {
                                /*new PNotify({
                                    title: 'Error',
                                    text: ,
                                    type: 'error',
                                    addclass: "stack-bottomright",
                                    stack: scope.$parent.stack_bottomright
                                });*/
                                HelperService.showPNotifyMessage('Error', 'Your information was not updated successfully.', 'error');
                            }
                        },
                        function (error) {
                            HelperService.showPNotifyMessage('Error', 'Your information was not updated successfully.', 'error');
                        });
            }


            function insertHtml() {
                var copied = MouseClickCopyService.getCopied();
                if (copied) {
                    // ck.insertHtml(copied);
                    if (copied.source == "toCopyLibrary") {
                        // alert(ck.getSelectedHtml().$.textContent);
                        copied.html = copied.html.substring(0, copied.html.length - 1);
                        console.log("copy lib");
                        var text = ck.getData();
                        if (text.length > 1)
                            copied.html = "<p>&nbsp;</p>" + copied.html;
                        else
                            copied.html = copied.html;
                        $timeout(function () {
                            ck.insertHtml(copied.html);
                        })
                    } else if (copied.source == "toCopyHistory") {
                        console.log("copy history");
                        ck.setData(copied.html);
                        // ck.insertHtml(copied.html);
                    }
                    $('iframe').contents().find('body.cke_show_borders').removeClass('copy-cursor');
                }
            }




            function selectSectionElement(name) {
                /* var el = CKEDITOR.document.getById("section-narrative");
                 el.on("click", function(ev) {
                     alert("clic");
                 });*/

                var nativeText = {
                    title: "Title",
                    narrative: "Narrative"
                };

                var elemId = "section-" + name;
                var findString = nativeText[name];
                ck.customSelections = {};
                ck.on('contentDom', function () {

                    var narrative = this.document.getById(elemId);

                    function getComponent() {
                        return narrative;
                    }
                    if (narrative) {
                        narrative.on("blur", function () {});

                        narrative.on("click", function (event) {
                            var componentEl = getComponent();
                            componentEl.$.style.backgroundColor = "blue";
                            componentEl.$.style.color = "white";
                            componentEl.$.attributes["el-clicked"] = true;
                            var selection = ck.getSelection();

                            //var placeHolder = target.$.querySelector("#data-placeholder");
                            /*if (!ck.customSelections[name]) {
                                ck.customSelections[name] = selection.getStartElement();
                            }
                            selection.selectElement(ck.customSelections[name]);*/

                            var element = selection.getStartElement();
                            selection.selectElement(element);

                            var ranges = selection.getRanges();
                            ranges[0].setStart(element.getLast(), 0);
                            ranges[0].setEnd(element.getLast(), element.getLast().getLength());
                            selection.selectRanges([ranges[0]]);

                            /* var startIndex = element.getHtml().indexOf(findString);
                             if (startIndex != -1) {
                                 ranges[0].setStart(element.getFirst(), startIndex);
                                 ranges[0].setEnd(element.getLast(), startIndex + findString.length);
                                 selection.selectRanges([ranges[0]]);
                             }*/
                        });


                        narrative.$.onblur = function () {
                            alert("el blur");
                        };
                        narrative.focus = function () {
                            alert("compoenent focus");
                        };

                        //if (!ck.customSelections.documentOnClick) {
                        this.document.on('click', function (event) {
                            var target = event.data.getTarget();
                            var targetId = target.$.id;
                            var componentEl = getComponent();
                            if (targetId != elemId && !!componentEl.$.attributes["el-clicked"]) {
                                componentEl.$.style.backgroundColor = "rgb(238, 238, 238)";
                                componentEl.$.style.color = "";
                                componentEl.$.attributes["el-clicked"] = false;
                            }
                        });
                        // only one onclick event handler for CKEDITOR.document
                        // property used to indicate handler attachement
                        // case for there being multiple section-components
                        //ck.customSelections.documentOnClick = true;
                        //}
                    }
                });
            }
        },
        controller: ['$scope', '$sce', '$element', function ($scope, $sce, $element) {

            $scope.importDataClick = function (parentEl) {




                var filteredSourceSectionID = $filter("filter")($scope.contentValues.ImportData, {
                    destinationDivID: propName
                });

                for (var i = 0; i < $scope.$parent.ck.resp.sections.length; i++) {

                    if ($scope.$parent.ck.resp.sections[i].sectionID == filteredSourceSectionID[0].originSectionID) {
                        if (JSON.stringify($scope.$parent.ck.resp.sections[i].contentValues.ckEditData) != '{}') {
                            var dataFromSourceSection = $scope.$parent.ck.resp.sections[i].contentValues.ckEditData;

                            var divHtml = "";
                            for (var key in dataFromSourceSection) {
                                if (key == filteredSourceSectionID[0].originDivID) {
                                    var divHtml = dataFromSourceSection[key];
                                    break;
                                }


                            }

                            $scope.contentValues.ckEditData[propName] = $scope.contentValues.ckEditData[propName] + divHtml;

                            break;
                        }


                    }


                }


            }

        }]
    };
}]);





angular.module('ReportAuthoring').directive('addHtml', ['$compile', '$sce', 'ReportAuthoringAPI', 'scopeArray', 'PerformedOperation', '$stateParams', 'HelperService', 'ReportWriteService', function ($compile, $sce, ReportAuthoringAPI, scopeArray, PerformedOperation, $stateParams, HelperService, ReportWriteService) {
    return {
        restrict: 'A',
        scope: {
            parentSectionid: '=parentSectionid',
            resp: '=resp',
            obj: '=obj',
            flag: '=flag',
            allSectionMode: '=allSectionMode',
            allTablesEditMode: '=allTablesEditMode',
            getSectionHistory: "&",
            isCkDirty: '='


        },
        link: function (scope, element, attrs) {
            scope.updatedBy = scope.resp.updatedBy;
            scope.updatedDate = scope.resp.updatedDate;
            scope.secId = scope.resp.sectionID;

            scope.renderHtml = function (html_asText) {
                var renderedHtml = $sce.trustAsHtml(html_asText);
                return renderedHtml;
            };

            scope.showAllSections = false;
            scope.alertData = {};
            //console.log("html in directive: " + JSON.stringify(scope.obj));
            scope.setVisibility = function () {
                return scope.showAllSections || scope.obj.selectedSection == scope.sectionID;
            }
            var html = scope.resp.html;

            scope.$on(
                "editAllTables",
                function handleEditTableEvent(event, isTableEdit) {
                    scope.$broadcast("handleEditTable", isTableEdit);
                }
            );

            // var filteredHtml = html.replace(/id='ckEdit'/g, "data-ck-editor");


            if (scope.resp.sectionData) {
                if (scope.resp.sectionData.contentValues != null && scope.resp.sectionData.contentValues != undefined && scope.resp.sectionData.contentValues != "") {


                    scope.sectionID = scope.resp.sectionID;
                    //console.log(scope.resp.SectionID,"SECTIONID");
                    scope.sectionGUID = scope.resp.sectionGUID;
                    scope.contentValues = scope.resp.sectionData.contentValues;
                    scope.html = scope.resp.html;



                    if (scope.resp.sectionData.contentValues.table != undefined) {
                        scope.title = scope.resp.sectionData.contentValues.table.title;

                    }
                    scope.editLink = true;

                }
            }

            scopeArray.setScopes(scope);

            // scope.childSectionArray = [];
            // if (localStorage.getItem('childSectionArray')) {
            //  scope.childSectionArray = JSON.parse(localStorage.getItem('childSectionArray'));
            // }


            if (scope.$parent.reportWrite.childSectionArray.length <= 0) {
                setChildSectionArray(scope.$parent.ck.selectedSection);
            }

            if (scope.$parent.reportWrite.childSectionArray.indexOf(scope.resp.sectionID) > -1) {

                scope.$parent.reportWrite.sectionCompiledArray.push(scope.resp.sectionID);
                //scope.childSectionArray.push(scope.resp.sectionID);
                var childfilteredHtml = html.replace(/id='ckEdit'/g, "data-ck-editor");
                compiledElement = $compile(childfilteredHtml)(scope);
                var pageElement = angular.element(element);
                pageElement.append(compiledElement);
            }

            // }


            function setChildSectionArray(section) {
                scope.$parent.reportWrite.childSectionArray.push(section.sectionID);
                for (var index = 0; section.sections.length > index; index++) {
                    if (!section.sections[index].isVisibleInToc) {
                        setChildSectionArray(section.sections[index]);
                    }
                }
            }


            scope.importData = function () {
                scope.updateDestinationSectionWithImportData(arguments, scope.contentValues, false);
            }

            scope.updateDestinationSectionWithImportData = function (arguments, destinationContentValues, isImportAllData) {

                var html = "";
                var importedData = "";

                for  (var  i = 0;  i  <  arguments.length;  i++)  {
                    var originDivData = "";
                    var section = ReportWriteService.findChildSectionById(arguments[i].originSectionID);
                    if (section != undefined)
                        originDivData = section.sectionData.contentValues.ckEditData[arguments[i].originDivID];

                    var destinationDivData = destinationContentValues.ckEditData[arguments[i].destinationDivID];

                    if (arguments[i].isHardcoded) {
                        var divHardcoded = angular.element(document).find('#divHardcodedImportData_' + arguments[i].destinationSectionID);
                        if (divHardcoded && divHardcoded.length > 0) {

                            importedData += originDivData != "" ? "<p>" + originDivData + "</p>" : importedData;
                            destinationContentValues.importData[i].importedHardcodedData = originDivData;

                            divHardcoded[0].innerHTML = "";

                            divHardcoded[0].innerHTML = importedData;
                            divHardcoded.addClass('alert alert-info');
                        }
                    } else {
                        html = originDivData;
                        destinationContentValues.ckEditData[arguments[i].destinationDivID] = "";
                        destinationContentValues.ckEditData[arguments[i].destinationDivID] = destinationDivData + html;
                    }
                }


                if (!isImportAllData) {

                    scope.sectionsArray = [];
                    scope.loadupdatedSection(scope.resp);
                    scope.msg = '<strong>' + scope.resp.sectionNumber + ' - ' + scope.resp.sectionName + '</strong> was updated successfully.';

                    scope.updateSectionWithImportData(scope.sectionsArray);
                }
            }

            scope.loadupdatedSection = function (section) {
                if (section.sectionData && section.sectionData.contentValues) {
                    var obj = {
                        "sectionGUID": section.sectionGUID,
                        "sectionData": {
                            "contentValues": section.sectionData.contentValues
                        }
                    }
                    scope.sectionsArray.push(obj);
                }
                for (var childIndex = 0; section.sections.length > childIndex; childIndex++) {
                    scope.loadupdatedSection(section.sections[childIndex]);
                }
            }

            scope.updateSectionWithImportData = function (sectionsArray, isImportAllData) {
                var data = {};
                data["formSectionData"] = sectionsArray;

                ReportAuthoringAPI.updateSection($stateParams.reportGuid, scope.sectionGUID, data)
                    .then(
                        function (response) {
                            angular.forEach(data["formSectionData"], function (formSectionData) {
                                scope.newCKData = formSectionData.sectionData.contentValues;
                                var newCkEditData;
                                if (scope.newCKData && scope.newCKData.ckEditData)
                                    newCkEditData = scope.newCKData.ckEditData;
                                else
                                    newCkEditData = scope.resp.contentValues.ckEditData;

                                scope.$emit('update-ckedit-data', {
                                    ckEditData: newCkEditData,
                                    sectionID: scope.resp.sectionID
                                });
                            });

                            if (isImportAllData) {

                                HelperService.showPNotifyMessage('Successful Import', scope.msg, 'success');
                            } else {
                                HelperService.showPNotifyMessage('Success', scope.msg, 'success');
                                scope.isCkDirty = false;
                            }
                        },
                        function (error) {
                            HelperService.showPNotifyMessage('Error', 'Your information was not updated successfully.', 'error');
                        });
            }

        },
        controller: ['$scope', '$sce', '$element', function ($scope, $sce, $element) {

            $scope.submit = function () {
                var val = $scope.contentValues;
                // console.log("submit Data" + JSON.stringify(val));
            }

            $scope.renderLayoutHtml = function (htmlStart, data, htmlEnd) {
                    var complete = htmlStart + data + htmlEnd;
                    return $sce.trustAsHtml(complete);
                }
                /*   $scope.importData = function () {
                       console.log("content val: " + JSON.stringify($scope.contentValues));
                       for  (var  i = 0;  i  <  arguments.length;  i++)  {
                           console.log("import data clicked:" + JSON.stringify(arguments[i]));
                           $scope.contentValues.ckEditData[arguments[i].destinationDivID] = "again";
                       }
                       //$scope.contentValues.ckEditData[propName] = $scope.contentValues.ckEditData[propName] + divHtml;
                   }*/
         }]
    }
   }]);

angular.module('ReportAuthoring').factory('scopeArray', [function () {
    var factory = {};
    var scopeArray = [];
    var tableScopeArray = [];
    //console.log("sectioncount_service " + scope.sectioncount);
    factory.setScopes = function (scope) {
        scopeArray.push(scope);

    }
    factory.getScopes = function () {
        return scopeArray;
    }
    factory.getScope = function (sectionid) {
        var returnScope = null;
        for (var scopeIndex = 0; scopeArray.length > scopeIndex; scopeIndex++) {
            if (scopeArray[scopeIndex].sectionID == sectionid) {
                returnScope = scopeArray[scopeIndex];
            }
        }
        return returnScope;
    }

    factory.setTableScopes = function (scope) {
        tableScopeArray.push(scope);

    }
    factory.getTableScopes = function () {

        return tableScopeArray;
    }

    return factory;
}]);

angular.module('ReportAuthoring').directive("tagWithDashes", function () {
    var uniqueId = 1;
    return {
        restrict: "E",
        replace: true,
        template: '<div ng-repeat="tag in tagData track by $index" id="div_instruction_{{resp.sectionGUID? resp.sectionGUID: section.sectionGUID}}_{{$index}}" class="alert alert-warning summary-area-maximized">  <button class="btn btn-default btn-xs summary-area-btn pull-right" id="instruction_{{resp.sectionGUID? resp.sectionGUID: section.sectionGUID}}_{{$index}}" ng-click="expandCollapseTag($event)"><i id="instruction_{{resp.sectionGUID? resp.sectionGUID: section.sectionGUID}}_{{$index}}" class="fa fa-minus"></i></button><div ng-bind-html="trustAsHtml(tag)"></div></div>',
        link: function (scope, element, attrs, $sce, compile) {
            //scope.tagData = scope.resp.contentValues.tagData;

            //scope.tagData = $sce.trustAsHtml(scope.resp.contentValues.tagData)
            scope.tagData = [];
            if (scope.resp) {
                if (scope.resp.sectionData && scope.resp.sectionData.contentValues.tagData) {
                    angular.forEach(scope.resp.sectionData.contentValues.tagData, function (tagData) {
                        scope.tagData.push(tagData);
                    });
                    //scope.tagData = scope.resp.sectionData.contentValues.tagData[0];
                }

                //scope.tagData = scope.resp.sectionData.contentValues.tagData;
            } else {
                scope.tagData = [];

                if (scope.section && scope.section.sectionData && scope.section.sectionData.contentValues.tagData) {
                    angular.forEach(scope.section.sectionData.contentValues.tagData, function (tagData) {
                        scope.tagData.push(tagData);
                    });
                }
                //scope.tagData = scope.section.sectionData != undefined ? //scope.section.sectionData.contentValues.tagData : "";

            }
            //compile(element)(scope);
            var item = 'item' + uniqueId++;
            //element.attr('id', item);
            //element.find('button').attr('id', item);
            //element.find('i').attr('id', item);
        },
        controller: function ($scope, $sce) {

            $scope.trustAsHtml = function (string) {
                if (typeof string === "string")
                    return $sce.trustAsHtml(string);

            };

            $scope.expandCollapseTag = function (focusedValue) {
                var id = focusedValue.target.id;
                if (id) {
                    var parentNode = angular.element("div#div_" + id)[0];
                    var target = angular.element("i#" + id)[0];
                    var index = parentNode.className.lastIndexOf("summary-area-maximized");

                    if (index > -1) {
                        angular.element(parentNode).removeClass('summary-area-maximized');
                        angular.element(target).removeClass('fa-minus');
                        angular.element(parentNode).addClass('summary-area-default');
                        angular.element(target).addClass('fa-plus');
                    } else {
                        angular.element(parentNode).removeClass('summary-area-default');
                        angular.element(target).removeClass('fa-plus');
                        angular.element(parentNode).addClass('summary-area-maximized');
                        angular.element(target).addClass('fa-minus');
                    }
                }

            }
        }
    };
});


angular.module('ReportAuthoring').directive("importData", function () {
    return {
        restrict: "E",
        replace: true,

        templateUrl: 'app/modules/ReportAuthoring/views/importData.html',
        link: function (scope, element, attrs) {

                        
            var flagSkipHarcoded = false;
            if(scope.contentValues && scope.contentValues.importData){
                var contentValues = scope.contentValues;
                for(var i = 0;  i  <  contentValues.importData.length; i++){                    
                    if (contentValues.importData[i].isHardcoded && contentValues.importData[i].importedHardcodedData != undefined){
                        flagSkipHarcoded=  true;
                    }
                }
            }
            
            if(!flagSkipHarcoded && scope.contentValues && scope.contentValues.hardcodedData){
                var hardcodedData = scope.contentValues.hardcodedData;
                //Hardcoded text functionality
                if(hardcodedData.isHardcodedText && hardcodedData.hardcodedText){
                    scope.divId = scope.sectionID;
                    scope.isHardcoded = hardcodedData.isHardcodedText;
                    element[0].innerHTML = hardcodedData.hardcodedText;
                    element.addClass('alert alert-info');
                }
            }
            else {
                //Import Harcoded Functionality
                if(scope.contentValues && scope.contentValues.importData) {
                    var contentValues = scope.contentValues;
                    scope.divId = scope.sectionID;
                    var importedHardcodedData = "";

                    for  (var i = 0;  i  <  contentValues.importData.length; i++) {

                        if (contentValues.importData[i].destinationSectionID == scope.sectionID && contentValues.importData[i].isHardcoded) {
                            if (contentValues.importData[i].importedHardcodedData != undefined)
                                importedHardcodedData += contentValues.importData[i].importedHardcodedData + "\n";
                            scope.isHardcoded = contentValues.importData[i].isHardcoded;
                        }
                    }

                    //scope.importedHardcodedData = importedHardcodedData;
                    element[0].innerHTML = importedHardcodedData;
                    if (importedHardcodedData != "")
                        element.addClass('alert alert-info');
                }
            }// end of else
        }
    };
});

angular.module('ReportAuthoring').directive("importAllData", function (PerformedOperation) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: 'app/modules/ReportAuthoring/views/importAllData.html',
        controller: ['$scope', function ($scope) {

            $scope.importAllData = function () {
                if ($scope.resp) {
                    $scope.sectionsArray = [];

                    var importData = $scope.resp.sectionData.contentValues.importData;
                    if (importData != undefined) {
                        $scope.updateDestinationSectionWithImportData(importData, $scope.resp.sectionData.contentValues, true);
                    }

                    var sectionArr = $scope.resp.sections;
                    angular.forEach(sectionArr, function (childSection) {
                        var importDataArr = childSection.sectionData.contentValues.importData;
                        if (importDataArr != undefined && importDataArr.length > 0) {
                            $scope.updateDestinationSectionWithImportData(importDataArr, childSection.sectionData.contentValues, true);
                            $scope.loadupdatedSection(childSection);
                        }
                    });

                    if ($scope.sectionsArray.length) {
                        $scope.msg = 'Your information was imported successfully.';
                        $scope.updateSectionWithImportData($scope.sectionsArray, true);
                    }
                }
            }
        }]
    };
});

angular.module('ReportAuthoring').directive("includeExclude", ['PerformedOperation', 'ReportAuthoringAPI', '$stateParams', function (PerformedOperation, ReportAuthoringAPI, $stateParams) {
    var uniqueId = 1;
    var includedArr = {};
    return {
        restrict: "E",
        scope: {
            sectionId: "=?sectionId",
            isIncluded: "=isIncluded"
        },
        //replace: true,
        templateUrl: 'app/modules/ReportAuthoring/views/includeExclude.html',
        link: function (scope, element, attr, $sce, compile) {
            if (scope.isIncluded) {
                scope.isIncludedText = 'Yes';
                element.find('button').eq(1).addClass('btn-success');
            } else {
                scope.isIncludedText = 'No';
                element.find('button').eq(1).addClass('btn-danger');
            }
            //scope.dataSectionId = attrs.dataSectionId;
            //element.attr('id' ,'btnInclude_'+ scope.sectionID+'_'+uniqueId);
            uniqueId++;

            scope.includeClick = function (event) {
                //alert($scope.sectionId+'-isIncluded :'+$scope.isIncluded);
                if (scope.isIncludedText == 'Yes') {
                    scope.isIncludedText = 'No';
                    scope.isIncludeFlag = false;
                    //updateSection(isIncludeFlag);
                } else {
                    scope.isIncludedText = 'Yes';
                    scope.isIncludeFlag = true;
                }

                var splitArr = attr.isIncluded ? attr.isIncluded.split('.') : null;
                var propName = splitArr && splitArr.length ? splitArr[splitArr.length - 1] : null;
                scope.$parent.contentValues[propName] = scope.isIncludeFlag;
                /*scope.$parent.contentValues.isIncluded = scope.isIncludeFlag;*/

                var data = {
                    "formSectionData": [
                        {
                            "sectionGUID": scope.$parent.resp.sectionGUID,
                            "sectionData": {
                                "operationCode": PerformedOperation.EDIT,
                                "contentValues": scope.$parent.contentValues

                            }
                              }]
                };

                scope.msg = '<strong>' +
                    scope.$parent.resp.sectionNumber + ' - ' + scope.$parent.resp.sectionName + '</strong> was updated successfully.';

                updateSection(data);

                function updateSection(data) {
                    scope.newCKData = data.formSectionData[0].sectionData.contentValues;
                    ReportAuthoringAPI.updateSection($stateParams.reportGuid, scope.sectionGUID, data)
                        .then(
                            function (response) {
                                var newCkEditData;
                                if (scope.newCKData && scope.newCKData.ckEditData)
                                    newCkEditData = scope.newCKData.ckEditData;
                                else
                                    newCkEditData = scope.resp.contentValues.ckEditData;

                                //scope.resp.contentValues.ckEditData = scope.newCKData.ckEditData;
                                scope.$emit('update-ckedit-data', {
                                    ckEditData: newCkEditData,
                                    sectionID: scope.$parent.resp.sectionID
                                });
                                //disableSaveButton();

                                new PNotify({
                                    title: 'Success',
                                    text: scope.msg,
                                    type: 'success',
                                    addclass: "stack-bottomright"
                                        //stack: scope.$parent.stack_bottomright
                                });
                                scope.isCkDirty = false;

                                /* var _p = ck.plugins.saveReportWritingCkData.path + "icons";
                                 $(ck.container.$).find('.cke_button__savebtndisable_icon').css('background-position', '0 0').css('background-image', 'url("' + _p + '/savebtndisable.png")').css('background-repeat', 'no-repeat');*/

                                /*   if (scope.flag == "History") {

                                       //scope.$parent.getSectionHistory();

                                       var promise = ReportAuthoringAPI.getHistory($stateParams.reportGuid, scope.resp.sectionGUID);
                                       $rootScope.waitingHistoryResources.promise = promise;
                                       scope.historyArr = [];
                                       return promise.then(function (resp) {

                                           for (var i = 0; i < resp.history.length; i++) {

                                               scope.historyArr.push(resp.history[i]);
                                               // ReportAuthoringAPI.putHistoryArray(scope.historyArr);

                                           }
                                           ReportAuthoringAPI.putHistoryArray(scope.historyArr);


                                       });
                                   }*/

                            },
                            function (error) {
                                new PNotify({
                                    title: 'Error',
                                    text: 'Your information was not updated successfully.',
                                    type: 'error',
                                    addclass: "stack-bottomright",
                                    //stack: scope.$parent.stack_bottomright
                                });
                            });
                }

            }

        },
        controller: function ($scope, $timeout) {
            $scope.isIncludeFlag = $scope.isIncluded ? true : false;
            $timeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });
            /*$scope.includeClick = function (event) {
                //alert($scope.sectionId+'-isIncluded :'+$scope.isIncluded);
                if ($scope.isIncludedText == 'Yes') {
                    $scope.isIncludedText = 'No';
                    $scope.isIncludeFlag = false;
                    //updateSection(isIncludeFlag);
                } else {
                    $scope.isIncludedText = 'Yes';
                    $scope.isIncludeFlag = true;
                }*/




        }
    };
}]);

angular.module('ReportAuthoring').directive('dynamicTable', [function () {
    return {
        restrict: 'E',
        template:

            ' <table class="table table-striped table-bordered">' +
            ' <thead>' +
            ' <tr>' +
            ' <th></th>' +
            ' <th>Tenant Name</th>' +
            ' <th>Location</th>' +
            ' <th>Type of Use</th>' +
            ' <th>Comments</th>' +

            ' <th>Actions</th>' +
            ' </tr>' +
            '</thead>' +
            ' <tbody>' +
            ' <tr data-ng-repeat="entry in appkeys" >' +
            ' <td>{{$index + 1}}</td>' +

            ' <td>' +
            '  <span data-ng-hide="editMode">{{entry.tenantName}}</span>' +
            '  <input class="form-control" type="text" data-ng-show="editMode" data-ng-model="entry.tenantName" data-ng-required />' +
            ' </td>' +
            ' <td>' +
            ' <span data-ng-hide="editMode">{{entry.Location}}</span>' +
            ' <input class="form-control" type="text" data-ng-show="editMode" data-ng-model="entry.Location" data-ng-required />' +
            '</td>' +

            ' <td>' +
            '<span data-ng-hide="editMode">{{entry.use}}</span>' +
            '<input class="form-control" type="text" data-ng-show="editMode" data-ng-model="entry.use" data-ng-required />' +
            ' </td>' +

            '<td>' +
            '<span data-ng-hide="editMode">{{entry.comments}}</span>' +
            ' <input class="form-control" type="text" data-ng-show="editMode" data-ng-model="entry.comments" data-ng-required />' +
            ' </td>' +

            ' <td>' +
            ' <button type="submit" data-ng-hide="editMode" data-ng-click="editMode = true; edit(entry)" class="btn btn-default">Edit</button>' +
            ' <button type="submit" data-ng-show="editMode" data-ng-click="editMode = false" class="btn btn-default">Save</button>' +
            ' <button type="submit" data-ng-show="editMode" data-ng-click="editMode = false; cancel($index)" class="btn btn-default">Cancel</button>' +
            ' </td>' +
            '</tr>' +
            '</tbody>' +
            '</table>'

        ,
        replace: true,
        link: function (scope, element, attrs) {


        },
        controller: function ($scope) {


            $scope.newField = [];
            $scope.editing = false;

            $scope.appkeys = [{
                "tenantName": "sefree",
                "Location": "Pune",
                "use": "nbv",
                "comments": "nbv"
            }, {
                "tenantName": "mnbvc",
                "Location": "Pune",
                "use": "bvcx",
                "comments": "nbv"
            }];

            $scope.edit = function (field) {
                $scope.editing = $scope.appkeys.indexOf(field);
                $scope.newField[$scope.editing] = angular.copy(field);
            }

            $scope.saveField = function (index) {
                //if ($scope.editing !== false) {
                $scope.appkeys[$scope.editing] = $scope.newField;
                //$scope.editing = false;
                //}       
            };

            $scope.cancel = function (index) {
                //if ($scope.editing !== false) {
                $scope.appkeys[index] = $scope.newField[index];
                $scope.editing = false;
                //}       
            };

            //$scope.rows = [
            // {"Id":"1", "type": "", "desc": "", "sign": "" }
            //];
            $scope.val = function () {
                    $scope.show = true;
                }
                //$scope.createTable = function () {

            //}
            //$scope.duplicateRows = function () {
            //    $scope.rows.push({ "type": "", "desc": "", "sign": "" });
            //}
            //$scope.saveRowData = function () {
            //    console.log("save data");
            //}

        },
    };

}]);

angular.module('ReportAuthoring').directive('addTiny', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            resp: '=resp',
            obj: '=obj'
        },
        link: function (scope, element, attrs) {

            var html = "<div ng-show='obj.selectedSection == \"{{section1Title}}\"'>" + scope.resp.html + "<div>";

            //   var filteredHtml = html.replace(/id='ckEdit'/g, "data-ck-editor");
            // var filteredHtml = html.replace(/id='tinymce'/g, "id='tinymce' data-ui-tinymce");
            var filteredHtml = html;
            console.log("qqqqqqqqqqqqqqqqqqqqqqqqqq: " + filteredHtml);
            if (scope.resp.contentValues != null && scope.resp.contentValues != undefined && scope.resp.contentValues != "") {

                scope.section1Title = scope.resp.contentValues.section1Title;

                scope.Y = scope.resp.contentValues.choice.Y;
                scope.N = scope.resp.contentValues.choice.N;
                scope.NS = scope.resp.contentValues.choice.NS;

                scope.title = scope.resp.contentValues.table.title;
                scope.r11 = scope.resp.contentValues.table.r11;
                scope.r12 = scope.resp.contentValues.table.r12;
                scope.r21 = scope.resp.contentValues.table.r21;
                scope.r22 = scope.resp.contentValues.table.r22;

                compiledElement = $compile(filteredHtml)(scope);

                var pageElement = angular.element(element);

                pageElement.append(compiledElement);
            }



        }

    }
});


angular.module('ReportAuthoring').directive('notification', ['$timeout', function ($timeout) {

    return {
        restrict: 'E',
        template: "<div class='alert alert-{{alertData.type}}' ng-show='alertData.message' role='alert' data-notification='{{alertData.status}}'>{{alertData.message}}<a class='close' data-dismiss='alert' aria-hidden='true'>×</a></div>",
        scope: {
            alertData: "="
        }
    };

    }]);



angular.module('ReportAuthoring').directive('condition', ['$timeout', 'ReportAuthoringAPI', function ($timeout, ReportAuthoringAPI) {
    return {
        scope: {
            model: '='
        },
        restrict: 'E',
        template: '<div class="pull-left"><div class="btn-group" data-toggle="buttons"><label class="btn btn-sm btn-warning" ng-repeat="option in conditionOptions" id="lbl_{{option}}" ng-click="conditionActivate(option)"><input  type="{{conditionType}}" ng-checked="conditionData.indexOf(option) > -1" ></input>{{option}}</label> <div class="pull-left"><input class="form-control input-sm" ng-model="model.data.otherText" ng-show="isShowOtherText" type="text"/></div></div></div><div class="pull-right"><button ng-show="isShowConfirmBtn" class="btn btn-md btn-primary" ng-click="conditionConfirm_click()">Confirm</button></div> <div class="clearfix" />',
        controller: function ($scope, $element, $attrs) {
            $scope.isShowConfirmBtn = false;
            $scope.conditionOptions = ["none", "replace", "refubrish", "repair", "other"];
            $scope.conditionData = $scope.model.data.selectedOptions;

            $scope.conditionType = $scope.model.type == "single" ? "radio" : "checkbox";
            $scope.isShowOtherText = false;

            if ($scope.conditionType == 'radio') {
                if ($scope.conditionData == "other") {
                    $scope.isShowOtherText = true;
                }
            } else {
                $scope.isShowOtherText = true;
            }
            $timeout(function () {
                angular.forEach($scope.conditionOptions, function (conditionOption) {
                    if ($scope.conditionData.indexOf(conditionOption) > -1) {
                        $("#lbl_" + conditionOption).addClass("active");
                    }
                });
            }, 100);


            $scope.conditionActivate = function (option) {
                $scope.isShowConfirmBtn = true;
                if ($scope.conditionType == "checkbox") {
                    var idx = $scope.conditionData.indexOf(option);
                    if (idx > -1) {
                        $scope.conditionData.splice(idx, 1);
                    } else {
                        $scope.conditionData.push(option);
                    }
                } else {
                    $scope.conditionData = option;
                }

                if ($scope.conditionType == 'radio') {
                    if ($scope.conditionData == "other") {
                        $scope.isShowOtherText = true;
                    } else {
                        $scope.isShowOtherText = false;
                        $scope.model.data.otherText = '';
                    }
                }
            };

            $scope.conditionConfirm_click = function () {
                alert($scope.conditionData + '-' + $scope.model.data.otherText)
                ReportAuthoringAPI.updateCondition();
            }

        }
    };
}]);


angular.module('ReportAuthoring').directive('action', ['$timeout', 'ReportAuthoringAPI', function ($timeout, ReportAuthoringAPI) {
    return {
        scope: {
            model: '='
        },
        restrict: 'E',
        template: '<div class="pull-left"><div class="btn-group" data-toggle="buttons"><label class="btn btn-sm btn-warning" ng-repeat="option in actionOptions" id="lbl_{{option}}"  ng-click="actionActivate(option)"><input type="{{actionType}}" ng-checked="actionData.indexOf(option) > -1"></input>{{option}}</label></div></div><div class="pull-right"><button ng-show="isShowConfirmBtn" class="btn btn-md btn-primary" ng-click="actionConfirm_click()">Confirm</button></div> <div class="clearfix" />',
        controller: function ($scope, $element, $attrs) {
            $scope.actionType = $scope.model.type == "single" ? "radio" : "checkbox";
            $scope.actionOptions = ["na", "good", "fair", "poor"];
            $scope.isShowConfirmBtn = false;
            $scope.actionData = $scope.model.data.selectedOptions;

            $timeout(function () {
                angular.forEach($scope.actionOptions, function (actionOption) {
                    if ($scope.actionData.indexOf(actionOption) > -1) {
                        $("#lbl_" + actionOption).addClass("active");
                    }
                });
            }, 100);

            $scope.actionActivate = function (option) {
                // console.log("button clicked: " + option);
                $scope.isShowConfirmBtn = true;

                if ($scope.actionType == "checkbox") {
                    var idx = $scope.actionData.indexOf(option);
                    if (idx > -1) {
                        $scope.actionData.splice(idx, 1);
                    } else {
                        $scope.actionData.push(option);
                    }
                } else {
                    $scope.actionData = option;
                }
            };

            $scope.actionConfirm_click = function () {

                ReportAuthoringAPI.updateAction();
            }
        }
    };
}]);



/* directive for slide toggle for Left Panel*/
angular.module('ReportAuthoring').directive('leftPanelSlideToggle', [function () {
    return {
        restrict: 'E',
        template:

            '<span id="section-toggle" ng-click="toggleLeftPanel()" class="hidden-sm hidden-xs fa fa-step-backward btn btn-sm btn-primary" data-toggle="tooltip" data-placement="right" title="Hide"></span>',
        replace: true,
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {

            $scope.toggleLeftPanel = function () {
                $(".leftContent").toggleClass("col-md-4 report-menu-width");
                $(".leftContent").toggleClass("col-md-4");
                $("#rightContent").toggleClass("col-md-8 col-md-12");
                $("#section-toggle").toggleClass("sidesection-icon");
                if ($("#section-toggle").hasClass('sidesection-icon')) {
                    $("#section-toggle").attr('data-original-title', 'Show');
                } else {
                    $("#section-toggle").attr('data-original-title', 'Hide');
                }
            }
        },
    };
}]);

angular.module('ReportAuthoring').directive('lastUpdatedBy', function ($compile, $filter, $window, BASEURL, AuthFactory, ReportAuthoringUrlCollection, ReportAuthoringAPI) {
    return {
        restrict: 'A',
        scope: {
            //secData: '=secData',
            updatedDate: '=updatedDate',
            updatedBy: '=updatedBy',
            secId: '=secId'

        },
        link: function (scope, element, attrs) {

            var sec = scope.secData;
            var updatedDate = '';
            var user = '';
            var uri = '';
            var linkToUserDetail = '';

            //if (sec.updatedBy != null && sec.updatedBy != undefined && !$.isEmptyObject(sec.updatedBy)) {
            updatedDate = scope.updatedDate ? (scope.updatedDate).replace(/-/g, '/') : updatedDate;
            scope.updatedDate = updatedDate;
            user = scope.updatedBy ? scope.updatedBy.firstName + " " + scope.updatedBy.lastName : user;



            var userGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
            if (scope.updatedBy && scope.updatedBy.userGUID == userGuid)
                user = "Me";


            //var url = BASEURL.ACCOUNT_MGMT + ReportAuthoringUrlCollection.ACCT_USER;
            

            if (scope.updatedBy) {
                var params = {
                    companyguid: scope.updatedBy.companyGUID,
                    officeguid: scope.updatedBy.officeGUID,
                    userguid: scope.updatedBy.userGUID
                };
                uri = ReportAuthoringAPI.formatUrl(ReportAuthoringUrlCollection.ACCT_USER, params);
            }
            //else
            linkToUserDetail = '<a id="aUpdatedSection_{{secId}}" ng-href="' + uri + '" class="pointer">' + user + '</a>';



            /*var linkToUserDetail = '<a id="aUpdatedSection_{{secData.sectionID}}" href="" ng-click="linkToAccountUser(\'' + uri + '\')" class="pointer">' + user + '</a>'*/

            var html = "<div ng-show='updatedDate' id='divUpdatedSection_{{secId}}'><p>Last Updated " + updatedDate + " by " + linkToUserDetail + "</p></div>";

            compiledElement = $compile(html)(scope);
            var pageElement = angular.element(element);
            pageElement.append(compiledElement);
            //}
        },
        controller: function ($scope) {
            $scope.linkToAccountUser = function (url) {
                $window.location.href = url;
            }
        }
    }
});

angular.module('ReportAuthoring').directive('searchBySiteid', [function () {
    return function (scope, element, attrs) {

        element.bind("keydown", function (event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 13) {

                var siteID = scope[attrs.ngModel];
                if (siteID) {
                    var regEx = /^[a-zA-Z]{1}[0-9]{7}$/;
                    if (regEx.test(siteID)) {
                        scope.$apply(function () {
                            // Evaluate the expression
                            scope.$eval(attrs.searchBySiteid);
                        });
                    } else {
                        new PNotify({
                            title: 'Error',
                            text: 'Please enter valid SiteID',
                            type: 'error',
                            addclass: "stack-topright"
                        });
                    }
                }

                event.preventDefault();
            }
        });
    };
}]);




angular.module('ReportAuthoring').directive('nestedChildSections', ['$compile', 'scopeArray', function ($compile, scopeArray) {
    return {
        restrict: 'E',
        templateUrl: 'app/modules/ReportAuthoring/views/childSection.html',
        scope: {
            childSections: '='
        },
        link: function (scope, element, attrs) {


            //for (var childIndex = 0; childIndex < scope.childSections.length; childIndex++) {
            //scope.childItem = scope.childSections[childIndex];

            //  var htmldata = '';

            //var htmldata = '<div ng-repeat="childItem in childSections"><div add-html id="section_{{childItem.sectionID}}" resp="childItem" flag="reportAuthoringWriteSelected" all-section-mode="ck.showAllSections" is-ck-dirty="ck.isCkDirty" obj="ck.obj" >{{childItem.sectionID}}</div></div>';

            //compiledElement = $compile(htmldata)(scope);
            // var pageElement = angular.element(element);
            //  pageElement.append(compiledElement);

            // }


        }
    };
}]);


angular.module('ReportAuthoring').directive('importEdrData', [function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: false,

        template: '<button type="button" class="btn btn-md btn-primary" ng-show="IsEDRImportVisible" id="importEDRData" ng-click="confirmImportData()">{{btnName}}<span class="fa fa-download"></span></button>',
        scope: {
            table: "="
        },

        link: function ($scope, element, attrs) {

            $scope.tableName = attrs.table.split('.')[1];
            $scope.importAction = attrs.importaction;

        },
        controller: ['$scope', '$modal', '$attrs', 'commonFunctionsService', 'sharedService', '$stateParams', 'ReportAuthoringAPI', 'tablesCommonFunctionsService', 'ParcelUI.Resources', 'ImportEDRDataTypes', function ($scope, $modal, $attrs, commonFunctionsService, sharedService, $stateParams, ReportAuthoringAPI, tablesCommonFunctionsService, ParcelUI_Resources, ImportEDRDataTypes) {

            $scope.reportID = $stateParams.reportGuid;
            if ($attrs.importaction == "envorphans") {
                $scope.btnName = "Import EDR Orphans ";
            } else if ($attrs.importaction == "envdbdetails" || $attrs.importaction == "stateenvdbdetails") {
                $scope.btnName = "Import EDR Database Detail Data ";
            } else if ($attrs.importaction == "historicalaerials" || $scope.importaction == "historicaltopos" || $scope.importaction == "citydirectory" || $scope.importaction == "sanborns" || $attrs.importaction == "dbreview") {
                $scope.btnName = "Import EDR Map Findings Summary ";
            } else if ($attrs.importaction == "historicalsummary") {
                $scope.btnName = "Import EDR Historical Data ";
            } else {
                $scope.btnName = "Import EDR Data ";
            }

            var promise = ReportAuthoringAPI.gerEDRImportDataStatus($scope.reportID, $attrs.importaction);
            promise.then(function (Data) {
                if (Data.status && Data.status.toLowerCase() == "shipped") {
                    $scope.IsEDRImportVisible = true;

                } else {

                    $scope.IsEDRImportVisible = false;
                }
            });

            $scope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;

            $scope.confirmImportData = function () {
                if ($scope.importAction == ImportEDRDataTypes.HISTORICALAERIALS || $scope.importAction == ImportEDRDataTypes.HISTORICALTOPOS || $scope.importAction == ImportEDRDataTypes.CITYDIRECTORY || $scope.importAction == ImportEDRDataTypes.SANBORNS) {

                    tablesCommonFunctionsService.confirmImportData($scope);

                } else if ($scope.importAction == ImportEDRDataTypes.HISTORICALSUMMARY) {
                    //tablesCommonFunctionsService.importHistoricalSummaryData($scope);
                    $scope.importData();

                } else {

                    openImportEDRData();

                }
            }

            function openImportEDRData() {

                var modalContainer = {
                    importAction: $scope.importAction,
                    reportID: $scope.reportID,
                    contentValues: $scope.$parent.contentValues,
                    tableName: $scope.tableName,
                    sectionNumber: $scope.$parent.resp.sectionNumber,
                    sectionGUID: $scope.$parent.sectionGUID
                }

                var modalInstance = $modal.open({
                    templateUrl: 'app/modules/ReportAuthoring/views/importEDRDataView.html',
                    controller: 'ImportEDRDataController',
                    size: 'lg',
                    resolve: {
                        importEDRData: function () {
                            return modalContainer;
                        }
                    }
                });

                modalInstance.result.then(function (importData) {



                });
            }

            $scope.importData = function () {


                var promise = ReportAuthoringAPI.getEDRImportData($scope.reportID, $scope.importAction);
                promise.then(function (importData) {
                    if (importData.data && importData.data.length > 0) {

                        var sectionData = $scope.$parent.contentValues;
                        var copySectionData = angular.copy(sectionData);

                        if ($scope.importAction == ImportEDRDataTypes.HISTORICALSUMMARY) {
                            tablesCommonFunctionsService.importHistoricalSummaryData(copySectionData, importData.data, $scope.tableName);
                        } else {
                            angular.forEach(importData.data, function (tableRow, index) {
                                copySectionData[$scope.tableName].data.push(tableRow);
                            })
                        }
                        $scope.copyTable = copySectionData[$scope.tableName];
                        tablesCommonFunctionsService.importData($scope, $scope.$parent.resp.sectionNumber);


                    } else {

                        var pNotifyErrorTitle = 'Data not found';
                        var pNotifyErrorMsg = 'The data contained in the EDR XML has no coverage.';
                        tablesCommonFunctionsService.showPNotifyMessage(pNotifyErrorTitle, pNotifyErrorMsg, 'error');
                    }
                }).catch(function (error) {

                    var pNotifyErrorTitle = 'Error';
                    var pNotifyErrorMsg = error;
                    tablesCommonFunctionsService.showPNotifyMessage(pNotifyErrorTitle, pNotifyErrorMsg, 'error');

                });

            }

        }]
    }
	}]);

angular.module('ReportAuthoring').directive('uploadSpreadsheetData', [function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: false,

        template: '<button type="button" class="btn btn-md btn-primary" id="uploadSpreadsheet" ng-show="!isTableEditable && table.data.length" ng-click="uploadSpreadsheet()">Upload Spreadsheet</button>',
        scope: {
            table: "="
        },
        link: function ($scope, element, attrs) {
            $scope.tableName = attrs.table.split('.')[1];
            //            $scope.stack_bottomright = $scope.$parent.$parent.stack_bottomright;
        },
        controller: ['$scope', '$modal', '$attrs', '$stateParams', 'ReportAuthoringAPI', 'ParcelUI.Resources', '$rootScope', function ($scope, $modal, $attrs, $stateParams, ReportAuthoringAPI, ParcelUI_Resources, $rootScope) {
            /*if($scope.table.data.length){
                $scope.isTableLength = true;
            }else{
                $scope.isTableLength =false;
            }*/
            //Upload spreadsheet code begins        
            $scope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
            $scope.uploadSpreadsheet = function () {
                openUploadSpreadsheet();
            };

            function openUploadSpreadsheet() {
                var modalContainer = {
                    //importAction: $scope.importAction,
                    reportGuid: $stateParams.reportGuid,
                    contentValues: $scope.$parent.contentValues,
                    tableName: $scope.tableName,
                    sectionNumber: $scope.$parent.resp.sectionNumber,
                    sectionGUID: $scope.$parent.sectionGUID,
                    sectionName: $scope.$parent.resp.sectionName,
                    table: $scope.table,
                    waitingProcessResources: $scope.waitingProcessResources
                };

                var modalInstance = $modal.open({
                    templateUrl: 'app/modules/ReportAuthoring/views/uploadSpreadsheetData.html',
                    controller: 'uploadSpreadsheetDataController as uploadSpreadsheetCtrl',
                    keyboard: false,
                    backdrop: 'static',
                    //size: 'lg',
                    //scope : $scope,
                    resolve: {
                        uploadSpreadsheetData: function () {
                            return modalContainer;
                        }
                    }
                });

                modalInstance.result.then(function (resultObj) {
                    if (resultObj && resultObj.operation) {
                        test(resultObj);
                    }
                });
            };

            $rootScope.$on('set-is-editable', function (event, args) {
                if (args) $scope.isTableEditable = true;
                else $scope.isTableEditable = false;
                //event.stopPropagation;
            });

            //upload spreadsheet code ends
            function test(resultObj) {
                console.log('sdv');
            }


        }]


    }
}]);

angular.module('ReportAuthoring').filter('htmlToPlaintext', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});

angular.module('ReportAuthoring').directive('customPopover', function ($rootScope, $timeout) {
    return {

        restrict: "A",
        link: function (scope, element, attrs) {

            $(element).popover({
                trigger: 'hover',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });

        }
    }
});
