angular.module('DefaultLanguageLibrary').controller('DefaultLangLibCtrl', ['$scope', '$modal', 'DefaultLanguageLibraryAPI', 'ReportTemplatesAPI', '$sce', '$rootScope', 'BASEURL', '$timeout', 'globalValues','$stateParams','$filter','$location', function ($scope, $modal, DefaultLanguageLibraryAPI, ReportTemplatesAPI, $sce, $rootScope, BASEURL, $timeout, globalValues,$stateParams,$filter,$location) {
    var self = this;
    this.categoryOptions_lang = [{
        text: "Instructions",
        value: "Instructions"
    }, {
        text: "Sample Language",
        value: "Sample"
    }, {
        text: "Option to Insert",
        value: "Options"
    }];


 
   
    self.userGuid = globalValues.currentUserGuid;
    /*{
        text: "Hardcoded Language",
        value: "Hardcoded"
    }, {
        text: "Included in Project Setup",
        value: "Included in Project Setup"
    }*/

    //self.dllCompanyList = defaultCompanyList;

    $scope.shouldShow = function (narrative, number) {

        // put your authorization logic here
        /* if(self.currentSectionFlag == 'true')
             return permissionLevel.value !== 'Sample' && permissionLevel.value !== 'Options';
         else if(self.currentSectionFlag == 'false')
             return permissionLevel.value !== 'Instructions';*/

        if (narrative == false) {
            this[number] = [{
                text: "Instructions",
                value: "Instructions"
    }];
            return this[number];
        } else {
            this[number] = [{
                text: "Instructions",
                value: "Instructions"
    }, {
                text: "Sample Language",
                value: "Sample"
    }, {
                text: "Option to Insert",
                value: "Options"
    }];
            return this[number];
        }
    }



    var setUpParent = self.setupProperties = {};

    self.showDisplayMsg = function (msg, type) {
        self.serviceResponseAlert = true;
        self.serviceResponseText = msg;
        self.msgType = 'alert-' + (type || 'danger');
    }

    function clearDll() {
        self.languageLibrarySelected = null;
        self.dllList = [];
    }

    function clearTemplate() {
        self.templateSelectedId = 0;
        self.templateList = [];
    }

    function clearSection() {
        self.sectionSelected = null;
        self.templateSectionList = [];
    }

    function clearErrorDisplay() {
        self.addLangLibError = false;
        self.languageError = null;
        self.serviceResponseAlert = false;
        self.serviceResponseText = null;
    }


    var getCompanyListPromise = DefaultLanguageLibraryAPI.getDLLCompanyListByUser(self.userGuid);

    getCompanyListPromise.then(function (dllList) {
        // self.dllCompanyList = dllList ? dllList.companies : [];
        self.dllCompanyList = [];
        var obj = {};
        obj.companyGUID = dllList.users[0].companyGUID;
        obj.name = dllList.users[0].companyName;
        self.dllCompanyList.push(obj);
      
        self.selectedCompanyId = self.dllCompanyList[0];
        if (self.dllCompanyList.length > 1) {
            self.disableFlag = false;
            self.moveText = "Move default language library to different company.";
        } else {
            self.disableFlag = true;
            self.moveText = "Can not Move default language library to different company as user has Only One Company.";
        }

        /* var getAllCompanyListPromise = DefaultLanguageLibraryAPI.getDLLCompanyList();

        getAllCompanyListPromise.then(function (dllList) {
           // self.dllCompanyList = dllList ? dllList.companies : [];
            var companyListForMoveLibrary = [];
             for(i=0;i<dllList.companies.length;i++)
                 {
                     if(dllList.companies[i].companyGUID != self.selectedCompanyId.companyGUID)
                         companyListForMoveLibrary.push(dllList.companies[i]);
                 }
           $scope.companies = companyListForMoveLibrary;
        }, function (error) {
            // self.addLangLibError = true;
            // self.languageError = error;
        });*/

        self.companySelectionChanged();
        
     
       
      
    }, function (error) {
        self.addLangLibError = true;
        self.languageError = error;
    });
    
   

    /*var getAllCompanyListPromise = DefaultLanguageLibraryAPI.getDLLCompanyList();

      getAllCompanyListPromise.then(function (dllList) {
         // self.dllCompanyList = dllList ? dllList.companies : [];
         $scope.companies = dllList.companies;
      }, function (error) {
          // self.addLangLibError = true;
          // self.languageError = error;
      });*/

    $scope.removeCurrentCompany = function (itm) {
        if (self.selectedCompanyId.companyGUID != itm.companyGUID)
            return itm;
    }

    self.companySelectionChanged = function () {
        clearDll();
        clearTemplate();
        clearSection();
        clearErrorDisplay();

        // console.log(self.selectedCompanyId.companyGUID,'companyID');
        var selectedCompany = self.selectedCompanyId.companyGUID;
        // var selectedCompany = self.selectedCompanyId;
        var getListPromise = DefaultLanguageLibraryAPI.getDLLList(selectedCompany);

        getListPromise.then(function (dllList) {
            self.dllList = dllList ? dllList.libraries : [];
            
           
        }, function (error) {
            self.addLangLibError = true;
            self.languageError = error;
        });

        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise = null;
        $scope.promise = ReportTemplatesAPI.getTemplateList(selectedCompany).then(function (templateList) {
            self.templateList = templateList ? templateList.templates : [];
             if($stateParams.languageLibraryGUID && self.dllList)
            {
//                var langObj = self.dllList.filter(function(langItem){
//                    return langItem.libraryGUID == $stateParams.languageLibraryGUID
//                })[0];
                var langObj = $filter('filter')(self.dllList,  {libraryGUID: $stateParams.languageLibraryGUID})[0];
                if(langObj)
                {
                 self.languageLibrarySelected = langObj;
                 getDataOnLibraryChange();
                }
               
            }
            
        }, function (error) {
            self.addLangLibError = true;
            self.languageError = error;
        });
    }



    /* self.unlinkLibrary = function (libraryGUID, sectionGUID, languageGUID,name) {
         console.log(libraryGUID + "     " + name, "libraryGUID to unlink");
         var obj = {
             "library": {
                 "libraryGUID":  libraryGUID,
                 "isUnlink": true,
                  "name":name
             }
         };
         

         $scope.promise = null;
         $scope.promise = DefaultLanguageLibraryAPI.unlinkLibrary(obj, libraryGUID,sectionGUID).then(function (resp) {
                  getLanguageForLibrary(libraryGUID);
                 self.isLibraryLinked = false;
             //self.templateSelectionChanged();
         }, function (error) {
             self.addLangLibError = true;
             self.languageError = error;
         });
     }*/

    self.unlinkLibrary = function (libraryGUID, sectionGUID, languageGUID, name) {

        var obj = {
            "library": {
                "libraryGUID": libraryGUID,
                "isUnlink": true,
                "name": name
            },
            "sectionGUID": sectionGUID
        };


        var modalInstance = $modal.open({
            templateUrl: "dllLibraryUnlinkSection.html",
            scope: $scope,
            controller: dllLibraryUnlinkSectionController,
            size: 0,
            resolve: {
                parameters: function () {
                    return obj;
                }
            }

        })

    }

    var dllLibraryUnlinkSectionController = function ($scope, $modalInstance, parameters) {

        $scope.unlinkLibrary = function () {
            var libobj = parameters.library;
            var obj = {};
            obj.library = libobj;
            $scope.promise = null;
            $scope.promise = DefaultLanguageLibraryAPI.unlinkLibrary(obj, libobj.libraryGUID, parameters.sectionGUID).then(function (resp) {
                getLanguageForLibrary(libobj.libraryGUID);
                if (resp.linkedLibraryID != 0 && resp.linkedLibraryID != "" && resp.linkedLibraryID != undefined)
                    self.isLibraryLinked = true;
                else
                    self.isLibraryLinked = false;
                self.showDisplayMsg('Library Section Unlinked successfully', 'success');
            }, function (error) {
                self.addLangLibError = true;
                self.languageError = error;
            });

            $modalInstance.close();
        }



        $scope.CancelDelete = function () {

            $modalInstance.close();
        }
    }



    self.dllSelectionChanged = function () {
         $location.search('languageLibraryGUID', self.languageLibrarySelected.libraryGUID); 
         getDataOnLibraryChange();
    }
    
    function getDataOnLibraryChange()
    {
          /*if (self.languageLibrarySelected && self.languageLibrarySelected.defaultTemplateID) {
            self.templateSelectedId = self.languageLibrarySelected.defaultTemplateID;
            self.templateSelectionChanged();
        }*/

        clearErrorDisplay();
       
        var libraryId = self.languageLibrarySelected.libraryGUID;
        //console.log(self.languageLibrarySelected.linkedLibraryID,'linked libraryid');


        /*console.log(self.dllList,"dll list");
            var obj = $filter('filter')(self.dllList,  {libraryGUID: libraryId});
            console.log(obj,"filtered obj");    
        */
        if (self.languageLibrarySelected.linkedLibraryID != 0 && self.languageLibrarySelected.linkedLibraryID != "" && self.languageLibrarySelected.linkedLibraryID != undefined) {
            self.isLibraryLinked = true;
        } else {
            self.isLibraryLinked = false;

        }
        //$('[data-toggle="tooltip"]').tooltip();
        //console.log(self.isLibraryLinked,"linked library");
        getLanguageForLibrary(libraryId);
        ////commenting below call as pdf functionality for DLL is not done yet.
        //getPdfurl(libraryId);
        setDefaultTemplateAsSelected();
        if (self.templateSelectedId) {
            self.templateSelectionChanged();
        }
    }

    function getLanguageForLibrary(libraryId) {
        $scope.delay = 0;
        $scope.minDuration = 3000;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise = null;
        $scope.promise = DefaultLanguageLibraryAPI.getLanguageForAllSections(libraryId).then(function (languageList) {
            self.languageList = languageList;
            mergeLanguageWithSections(self.languageList, self.templateSectionList);
            // $('[data-toggle="tooltip"]').tooltip();
            $timeout(function () {
                $('[data-toggle="tooltip"]').tooltip();
            }, 3000);

        });
    }

    self.templateSelectionChanged = function () {
       
        clearSection();
        clearErrorDisplay();

        var templateId = self.templateSelectedId.templateGUID;
        /*var templateObjPromise = DefaultLanguageLibraryAPI.getTemplate(templateId);
        templateObjPromise.then(function (data) {
            self.templateSectionObject = data;

        }, function (error) {
            self.languageBySectionList = null;
            self.addLangLibError = true;
            self.languageError = error;
        });*/


        var promise = ReportTemplatesAPI.getTemplateSections(templateId);
        promise.then(function (sections) {
            /* var sectionWithoutAppendix = [];
             for(i=0;i<sections.length;i++)
                 {
                     if(sections[i].isAppendix == false)
                         sectionWithoutAppendix.push(sections[i]);
                 }
             self.templateSectionList = sectionWithoutAppendix;*/
            self.templateSectionList = sections;
            mergeLanguageWithSections(self.languageList, self.templateSectionList);
        }, function (error) {
            self.languageBySectionList = null;
            self.addLangLibError = true;
            self.languageError = error;
        });
    }

    function setDefaultTemplateAsSelected() {
        if (self.languageLibrarySelected && self.languageLibrarySelected.defaultTemplateID && self.templateList && self.templateList.length) {
            var toSelectTemplateID = self.languageLibrarySelected.defaultTemplateID;
            for (var i = 0; i < self.templateList.length; i++) {
                var local = self.templateList[i];
                if (local.templateID == toSelectTemplateID) {
                    self.templateSelectedId = local;
                    break;
                }
            }
        }
    }

    function createNewGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    self.sectionSelectionChanged = function () {
        clearErrorDisplay();
        /*var selectedSectionId = self.sectionSelected ? self.sectionSelected.sectionID : 0;
        if (!selectedSectionId) return;

        getSectionData(selectedSectionId);*/
    }

    function getSectionData(sectionId) {

    }

    self.languageBySectionList = [];
    self.hardCodedlangBySection = {};

    function mergeLanguageWithSections(languageList, sectionList, isAppend, rootSectionID) {
        //if (!languageList || !languageList.length || !sectionList || !sectionList.length) return;

        self.languageBySectionList = isAppend ? self.languageBySectionList : [];
        if (sectionList && sectionList.length)
            for (var i = 0; i < sectionList.length; i++) {
                var section = sectionList[i];
                var langBySection = {
                    languageList: [],
                    name: section.sectionName,
                    number: section.sectionNumber,
                    sectionID: section.sectionID,
                    sectionGUID: section.sectionGUID,
                    hasNarrative: section.hasNarrative,
                    isGeneralInfo: section.isGeneralInfo
                };
                
                //check hardcoded
                if(section.sectionData && section.sectionData.contentValues && section.sectionData.contentValues.hardcodedData){
                    var hardCodedData = section.sectionData.contentValues.hardcodedData;
                    if(hardCodedData.isHardcodedText){
                        var hardCodedlang = {
                            name: section.sectionName,
                            number: section.sectionNumber,
                            sectionID: section.sectionID,
                            sectionGUID: section.sectionGUID,
                            hasNarrative: section.hasNarrative,
                            isGeneralInfo: section.isGeneralInfo,
                            text: hardCodedData.hardcodedText
                        }
                        self.hardCodedlangBySection[section.sectionGUID] = hardCodedlang;
                    }
                }
                //check hardcoded ends                
                
                if (rootSectionID) {
                    langBySection.rootSectionID = rootSectionID;
                }

                if (languageList && languageList.length) {
                    for (var j = 0; j < languageList.length; j++) {
                        var language = languageList[j];
                        if (language.sectionGUID == section.sectionGUID) {
                            var languageObj = {
                                languageID: language.languageID,
                                languageGUID: language.languageGUID,
                                category: language.category,
                                keyword: language.keyword,
                                sectionID: language.sectionID,
                                sectionGUID: language.sectionGUID,
                                text: language.text,
                                isAddedOnProjectStartup: language.isAddedOnProjectStartup,
                                showInPage: language.showInPage,
                                orderIndex: language.orderIndex,
                                languageItemGuid: language.languageItemGuid,
                                isLinked: language.isLinked
                            };

                            langBySection.languageList.push(languageObj);
                        }
                    }
                }
                self.languageBySectionList.push(langBySection);

                // merge language for nested sections
                if (section.sections && section.sections.length) {
                    var rootSection = rootSectionID || section.sectionID;
                    mergeLanguageWithSections(languageList, section.sections, true, rootSection);
                }
            }
    }

    function matchLanguageByProperty(languageList, prop, val) {
        var arr = languageList;
        if (!arr || !arr.length) return;

        for (var i = 0; i < arr.length; i++) {
            var local = arr[i];
            if (local[prop] == val) {
                return local;
            }
        }
    }

    self.renderHtml = function (html_asText) {
        var renderedHtml = $sce.trustAsHtml(html_asText);
        return renderedHtml;
    }



    self.unlinkCompleteLibrary = function (libraryGUID, name) {

        var obj = {
            "library": {
                "libraryGUID": libraryGUID,
                "isUnlink": true,
                "name": name
            }
        };


        var modalInstance = $modal.open({
            templateUrl: "dllLibraryUnlink.html",
            scope: $scope,
            controller: dllLibraryUnlinkController,
            size: 0,
            resolve: {
                parameters: function () {
                    return obj;
                }
            }

        })

    }

    var dllLibraryUnlinkController = function ($scope, $modalInstance, parameters) {

        $scope.unlinkLibrary = function () {
            var obj = parameters;
            $scope.promise = null;
            $scope.promise = DefaultLanguageLibraryAPI.unlinkCompleteLibrary(obj, obj.library.libraryGUID).then(function (resp) {
                getLanguageForLibrary(obj.library.libraryGUID);
                self.isLibraryLinked = false;
                self.showDisplayMsg('Library Unlinked successfully', 'success');
            }, function (error) {
                self.addLangLibError = true;
                self.languageError = error;
            });

            $modalInstance.close();
        }



        $scope.CancelDelete = function () {

            $modalInstance.close();
        }
    }

    self.editOption = function (index, libraryId, languageId, languageSection, isDeleteBySection) {
        self.editAllMode = false;
        console.log("dfdsf");
        clearErrorDisplay();
        angular.forEach(languageSection, function (language, index) {
            //self.toEditLang[language.languageGUID] = angular.copy(language);
            self.toEditLang[language.languageItemGuid] = angular.copy(language);
            language.editmode = true;
        });
        //language.editmode = true;
        /* clearErrorDisplay();
         var val = {
             index: index,
             libId: libraryId,
             langId: languageId,
             languageSection: languageSection,
             isDeleteBySection: isDeleteBySection
         }

         var modalInstance = $modal.open({
             templateUrl: "dllLanguage.html",
             scope: $scope,
             controller: deleteLanguageController,
             size: 0,
             resolve: {
                 parameters: function () {
                     return val;
                 }
             }
         })*/

    }

    self.deleteOption = function (index, libraryId, languageItemId, languageSection, isDeleteBySection) {

        clearErrorDisplay();
        var val = {
            index: index,
            libId: libraryId,
            langItemId: languageItemId,
            languageSection: languageSection,
            isDeleteBySection: isDeleteBySection
        }

        var modalInstance = $modal.open({
            templateUrl: "dllLanguage.html",
            scope: $scope,
            controller: deleteLanguageController,
            size: 0,
            resolve: {
                parameters: function () {
                    return val;
                }
            }
        })

    }

    var deleteLanguageController = function ($scope, $modalInstance, parameters) {
        $scope.isDeleteBySection = parameters.isDeleteBySection;
        $scope.deleteLanguage = function () {

            var promise = null;
            if (parameters.isDeleteBySection) {
                promise = DefaultLanguageLibraryAPI.deleteLanguageBySection(parameters.libId, parameters.langItemId);
                promise.then(function (result) {
                    parameters.languageSection.length = 0;
                    self.showDisplayMsg('Language Items for section deleted successfully', 'success');
                });
            } else {
                promise = DefaultLanguageLibraryAPI.deleteLanguageItem(parameters.libId, parameters.langItemId);
                promise.then(function (result) {
                    //                    parameters.languageSection.splice(parameters.index, 1);
                    for (var i = 0; i < parameters.languageSection.length; i++) {
                        if (parameters.languageSection[i]["languageItemGuid"] == parameters.langItemId) {
                            parameters.languageSection.splice(i, 1);
                            break;
                        }
                    }
                    self.showDisplayMsg('Default Language Item deleted successfully', 'success');
                });
            }
            $modalInstance.close();
        }



        $scope.CancelDeleteLanguage = function () {

            $modalInstance.close();
        }
    }


    function LanguagesReorder(arr, libraryID, sectionID) {

        var languages = [];
        for (index = 0; index < arr.length; index++) {
            languages.push({
                'languageGUID': arr[index].languageGUID
            });
        }
        var putPromise = DefaultLanguageLibraryAPI.putLanguageItemsReorder(libraryID, sectionID, languages);
        putPromise.then(function (result) {
            angular.forEach(arr, function (item, index) {
                item.orderIndex = index;
            });
            dataContainer.refreshOnReturn = true;
            $modalInstance.close();
        });
    }
    self.moveTopOption = function (index, arr, sectionID) {
        clearErrorDisplay();
        $('[data-toggle="tooltip"]').tooltip('hide');
        if (!index) return;

        arr.move(index, 0);
        var libraryID = self.languageLibrarySelected.libraryGUID;
        LanguagesReorder(arr, libraryID, sectionID);
    }

    self.moveEndOption = function (index, arr, sectionID) {
        clearErrorDisplay();
        $('[data-toggle="tooltip"]').tooltip('hide');
        if (index == (arr.length - 1)) return;

        arr.move(index, (arr.length - 1));
        var libraryID = self.languageLibrarySelected.libraryGUID;
        LanguagesReorder(arr, libraryID, sectionID);
    }

    self.moveUpOption = function (index, arr, sectionID) {
        clearErrorDisplay();
        $('[data-toggle="tooltip"]').tooltip('hide');
        if (!index) return;

        arr.move(index, index - 1);
        var libraryID = self.languageLibrarySelected.libraryGUID;
        LanguagesReorder(arr, libraryID, sectionID);
    }

    self.moveDownOption = function (index, arr, sectionID) {
        clearErrorDisplay();
        $('[data-toggle="tooltip"]').tooltip('hide');
        if (index >= (arr.length - 1)) return;

        arr.move(index, index + 1);
        var libraryID = self.languageLibrarySelected.libraryGUID;
        LanguagesReorder(arr, libraryID, sectionID);
    }

    self.toEditLang = {};
    self.editLanguage = function (language) {
      
        
        clearErrorDisplay();
        self.editAllMode = true;
        //self.toEditLang[language.languageGUID] = angular.copy(language);
        self.toEditLang[language.languageItemGuid] = angular.copy(language);
        language.editmode = true;
    };
    self.cancelEditLanguage = function (language) {
//        var originalCopy = self.toEditLang[language.languageGUID];
        var originalCopy = self.toEditLang[language.languageItemGuid];
        copyLanguageProperties(language, originalCopy);
        language.editmode = false;
//        delete self.toEditLang[language.languageGUID];
        delete self.toEditLang[language.languageItemGuid];
        $rootScope.$broadcast("cancel-editor-edit");
    }
    self.cancelAllEditLanguage = function (languageList) {

        angular.forEach(languageList, function (language, index) {
            //var originalCopy = self.toEditLang[language.languageGUID];
            var originalCopy = self.toEditLang[language.languageItemGuid];
            copyLanguageProperties(language, originalCopy);
            language.editmode = false;
            //delete self.toEditLang[language.languageGUID];
            delete self.toEditLang[language.languageItemGuid];
            $rootScope.$broadcast("cancel-editor-edit");
        });



    }

    function copyLanguageProperties(language, fromLang) {
        language.category = fromLang.category;
        language.keyword = fromLang.keyword;
        language.isAddedOnProjectStartup = fromLang.isAddedOnProjectStartup;
        language.text = fromLang.text;
        //$scope.$apply();
    }

    /*self.saveLanguage = function (form, index, libId, objLanguage) {
     
        if (!form || form.$invalid) {
            // self.showDisplayMsg('Invalid Form Submission');
            return;
        }
      
        var promise = DefaultLanguageLibraryAPI.putLanguage(libId, objLanguage.Id, objLanguage)
        promise.then(function (result) {
         
           // objLanguage.editmode = false;


        });
        objLanguage.editmode = false;
    } */

    self.saveAllLanguage = function (index, libId, languageList, editLanguageForm) {
        if (editLanguageForm.$valid) {
            angular.forEach(languageList, function (objLanguage, index) {
                var lang = angular.copy(objLanguage);
                delete lang.editmode;
                var promise = DefaultLanguageLibraryAPI.putLanguageItem(libId, objLanguage.languageGUID, lang);
                promise.then(function (result) {
                    objLanguage.editmode = false;
                    console.log("success");

                });
            });
        }
        if (editLanguageForm.language.$valid == false) {
            alert("Make sure you have text to all narratives.");
        }

    }

    self.saveLanguage = function (index, libId, objLanguage, editLanguageForm,isGeneralInfo) {
        /*var arrLanguage = [];
        arrLanguage.push(objLanguage);
        for (var i = 0; i < arrLanguage.length; i++) {
            delete arrLanguage[i]['editmode'];
        }*/
        //var promise = DefaultLanguageLibraryAPI.putLanguageItem(libId, objLanguage.languageGUID, arrLanguage[0])
        if (editLanguageForm.$valid) {
            var lang = angular.copy(objLanguage);
            if(isGeneralInfo)
            {
                lang.category = "Instructions";
            }
            delete lang.editmode;
//            var promise = DefaultLanguageLibraryAPI.putLanguageItem(libId, objLanguage.languageGUID, lang);
            var promise = DefaultLanguageLibraryAPI.putLanguageItem(libId, objLanguage.languageItemGuid, lang);
            promise.then(function (result) {
                objLanguage.editmode = false;
                console.log("success");

            });
        }
        if (editLanguageForm.language.$valid == false) {
            alert("Please add text to narrative.");
        }
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



    // add new language
    self.addOptionsToSection = function (noOfOptions, section, narative, number) {

        clearErrorDisplay();

        var modalDataContainer = {
            noOfOptions: noOfOptions,
            section: section,
            libraryGUID: self.languageLibrarySelected.libraryGUID,
            categoryOptions: self.categoryOptions_lang,
            refreshOnReturn: false,
            narative: narative,
            number: number

        }

        var modal = $modal.open({
            templateUrl: 'addOptionsToSection.html',
            controller: addOptionsToSectionController,
            scope: $scope,
            size: "lg",
            resolve: {
                dataContainer: function () {
                    return modalDataContainer;
                }
            }
        });

        modal.result.then(function () {
            var refreshLanguage = modalDataContainer.refreshOnReturn;
            section.addOptions = 1;
            if (refreshLanguage) {
                var libraryId = modalDataContainer.libraryGUID;
                // no need to GET again
                // POST returns the added language list
                //getLanguageForLibrary(libraryId);
            }
        });
    }
    var addOptionsToSectionController = function ($scope, $modalInstance, dataContainer) {
        $scope.addLangLibError = false;
        $scope.languageError = "";
        $scope.selectedSection_addOptions = dataContainer.section;
        $scope.noOfOptions = dataContainer.noOfOptions;
        $scope.toAddOptions = [];
        $scope.categoryOptions = dataContainer.categoryOptions;
        $scope.narative = dataContainer.narative;
        $scope.number = dataContainer.number;
        
      

        $scope.cancelAddOptionToSection = function () {
            $modalInstance.close();
        }

        $scope.addNewOptionsToSection = function (form) {

            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }
            if ($scope.toAddOptions && $scope.toAddOptions.length) {
                var libraryID = dataContainer.libraryGUID;
                var sectionId = $scope.selectedSection_addOptions.sectionID;
                var sectionGUID = $scope.selectedSection_addOptions.sectionGUID;
                var languageArr = [];

                /*var tempIdList = [];
                for (var prop in self.languageBySectionList['1'].languageList) {
                    tempIdList.push(parseInt(prop));
                }
                Array.max = function(array) {
                    return Math.max.apply(Math, array);
                };
                var lastId = Array.max(tempIdList);*/

                for (var i = 0; i < $scope.toAddOptions.length; i++) {
                    var local = $scope.toAddOptions[i];
                    var obj = {
                        //Id: 1,
                        category: $scope.selectedSection_addOptions.isGeneralInfo ? 'Instructions' : local.category,
                        keyword: local.keyword,
                        sectionID: sectionId,
                        sectionGUID: sectionGUID,
                        text: local.text
                            //languageID: dataContainer.section.languageList.length + i
                    };

                    if (obj.category == "Instructions") {
                        if (local.included == undefined)
                            obj.showInPage = false;
                        else
                            obj.showInPage = local.included;
                    } else {
                        if (local.included == undefined)
                            obj.isAddedOnProjectStartup = false;
                        else
                            obj.isAddedOnProjectStartup = local.included;
                    }

                    languageArr.push(obj);
                }

                var postPromise = DefaultLanguageLibraryAPI.postLanguage(libraryID, languageArr);
                postPromise.then(function (languageList) {
                    dataContainer.refreshOnReturn = true;

                    // insert into array
                    Array.prototype.push.apply(dataContainer.section.languageList, languageList);

                    $modalInstance.close();
                    getLanguageForLibrary(libraryID);
                }, function (error) {
                    $scope.addLangLibError = true;
                    $scope.languageError = error;
                });


                /*// below code for testing only
                var arr = dataContainer.section.languageList;

                //dataContainer.section.languageList.splice(arr.length - 1, 0, languageArr);
                Array.prototype.push.apply(arr, languageArr);
                $modalInstance.close();*/
            }
        }

        $scope.getNumber = function (num) {
            var parsedInt = parseInt(num);
            var arr = new Array(parsedInt);
            return arr;
        }
    }

    function getPdfurl(libraryId) {
        console.log("SuccessID---------" + libraryId);
        //self.pdfURL =  "http://www.pdf995.com/samples/pdf.pdf";

        // var libraryId = 12;
        var promise = DefaultLanguageLibraryAPI.getPDFURL(libraryId)
        promise.then(function (result) {
            console.log(result);
            self.pdfURL = result.outputDocument;
            console.log(result.outputDocument);
        });
    }

    // tool options
    self.openPopup = function (action) {

        clearErrorDisplay();

        var modalDataContainer = {
            dll: self.languageLibrarySelected,
            selectedTemplateId: self.templateSelectedId,
            dllList: self.dllList,
            action: action,
            templateObject: self.templateSectionObject,
            sections: self.templateSectionList,
            result: {
                deleted: false,
                languageDeleted: false
            }
        };

        if (action == 'deleteAll') {
            var url = 'dllDeleteAll.html';
        } else if (action == 'rename') {
            var url = 'dllRename.html';
        } else if (action == 'duplicate') {
            var url = 'dllDuplicate.html';
        } else if (action == 'delete') {
            var url = 'dllDelete.html';
        } else if (action == 'move' && self.disableFlag == false) {
            var url = 'dllMove.html';
        } else if (action == 'setDefaultStructure') {
            var url = 'dllSetDefaultStructure.html';
        } else if (action == "link") {
            var url = 'dllLink.html';
        } else if (action == "pdf") {
            var url = 'dllPDFGeneration.html'
        }

        var modalInstance = $modal.open({
            templateUrl: url,
            scope: $scope,
            controller: dllToolsController,
            size: 'lg',
            resolve: {
                dataContainer: function () {
                    return modalDataContainer;
                }
            }
        });

        modalInstance.result.then(function () {
            if (modalDataContainer.action == "delete" && modalDataContainer.result.deleted) {
                var index = self.dllList.indexOf(self.languageLibrarySelected);
                if (index >= 0) {
                    self.dllList.splice(index, 1);
                    self.languageLibrarySelected = "";
                }
            } else if (modalDataContainer.action == 'deleteAll' && modalDataContainer.result.languageDeleted) {
                self.languageList = [];
                mergeLanguageWithSections(self.languageList, self.templateSectionList);
            }
        });

        //self.deleteClicked = true;

        //self.copytoClicked = false;
        //self.renameClicked = false;       
        //self.copyfromClicked = false;
    }

    var dllToolsController = function ($scope, $modalInstance, dataContainer) {

        $scope.library = dataContainer.dll.libraryGUID;

        /* var promise = DefaultLanguageLibraryAPI.getPDFURL(dataContainer.dll.libraryGUID)
         promise.then(function (result) {
             console.log(result);
             $scope.pdfURL = result.outputDocument;
         });*/

        $scope.sections = dataContainer.sections;


        this.moveToCompany = 0;


        $scope.newNameDll = dataContainer && dataContainer.dll ? dataContainer.dll.name : '';
        $scope.renameDll = function (form) {
            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }
            var dll = angular.copy(dataContainer.dll);
            var id = dll.libraryGUID;
            var newName = this.newNameDll;
            dll.name = newName;
            var promise = DefaultLanguageLibraryAPI.update(id, dll)
            promise.then(function (result) {
                dataContainer.dll.name = dll.name;
                self.showDisplayMsg('Default Language Library renamed successfully', 'success');
                $modalInstance.close();
            }).catch(function (result) {
                self.showDisplayMsg(result, 'danger');
                $modalInstance.close();
            });
        }

        $scope.deleteDll = function () {
            var dll = angular.copy(dataContainer.dll);
            var id = dll.libraryGUID;
            var promise = DefaultLanguageLibraryAPI.delete(id)
            promise.then(function (result) {
                self.showDisplayMsg('Default Language deleted successfully', 'success');
                dataContainer.result.deleted = true;
                $modalInstance.close();
            });
        }

        $scope.removeAllDefaultLanguage = function () {

            var dll = angular.copy(dataContainer.dll);
            var id = dll.libraryGUID;
            var promise = DefaultLanguageLibraryAPI.deleteLanguage(id)
            promise.then(function (result) {
                self.showDisplayMsg('Default Language Library from every section of the selected library is deleted successfully', 'success');
                dataContainer.result.languageDeleted = true;
                $modalInstance.close();
            });
        }

        $scope.moveToDifferentCompany = function (form) {
            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }
            var dll = angular.copy(dataContainer.dll);
            var id = dll.libraryGUID;
            var moveToCompany = this.moveToCompany;
            dll.ownerCompanyID = moveToCompany.companyID;
            dll.ownerCompanyGUID = moveToCompany.companyGUID;
            var promise = DefaultLanguageLibraryAPI.update(id, dll)
            promise.then(function (result) {
                dataContainer.dll.ownerCompanyID = moveToCompany;
                self.showDisplayMsg('Default Language Library moved successfully to different company', 'success');

                var index = dataContainer.dllList.indexOf(dataContainer.dll);
                if (index >= 0) {
                    dataContainer.dllList.splice(index, 1);
                }

                $modalInstance.close();
            });
        }

        $scope.linkLibrary = function (form) {
            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }

            var name = this.linkLibraryName;
            var data = {
                //"reportTypeID": 22, self.languageLibrarySelected.defaultTemplateID
                libraryID: dataContainer.dll.libraryID,
                libraryGUID: dataContainer.dll.libraryGUID,
                companyID: dataContainer.dll.ownerCompanyID,
                companyGUID: dataContainer.dll.ownerCompanyGUID,
                defaultTemplateID: self.languageLibrarySelected.defaultTemplateID,
                isMobile: dataContainer.templateObject.isMobile,
                description: dataContainer.templateObject.description,
                reportTypeID: dataContainer.dll.reportType,
                requestType: "LINK",
                name: name
            };
            var promise = DefaultLanguageLibraryAPI.linkLibrary(data);
            promise.then(function (linkedlibrary) {
                linkedlibrary.linkedLibraryID = dataContainer.dll.libraryID;
                dataContainer.dllList.push(linkedlibrary);
                //to refresh section languages after linked library success
                getLanguageForLibrary(data.libraryGUID);
                self.showDisplayMsg('Library Linked successfully', 'success');
                $modalInstance.close();
            });
        }


        $scope.duplicate = function (form) {
            if (!form || form.$invalid) {
                // self.showDisplayMsg('Invalid Form Submission');
                return;
            }

            switch (this.copyToAction) {
            case "Existing":
                $scope.cloneReport.apply(this);
                $scope.showCopyBtn = false;
                //$scope.cloneReport();
                break;
            case "New":
                $scope.createReport.apply(this);
                $scope.showCopyBtn = false;
                break;
            }
        }

        $scope.createReport = function () {
            var dll = angular.copy(dataContainer.dll);
            var id = this.langLibrarySelectedFrom.libraryGUID;
            var companyGuid = dll.ownerCompanyGUID;
            var companyId = dll.ownerCompanyID;

            var newDllName = this.toCreateReport;
            var data = {
                libraryGUID: id,
                companyGUID: companyGuid,
                companyID: companyId,
                name: newDllName,
                requestType: "COPY"
            }
            var promise = DefaultLanguageLibraryAPI.post(data);
            promise.then(function (newDll) {
                dataContainer.dllList.push(newDll);
                self.showDisplayMsg('Language Library duplicated successfully', 'success');
                $modalInstance.close();
            });
        }


        $scope.cloneReport = function () {
            var langLibrarySelectedTo = this.langLibrarySelectedTo;
            var langLibrarySelectedFrom = this.langLibrarySelectedFrom;
            if (langLibrarySelectedTo.libraryGUID == langLibrarySelectedFrom.libraryGUID) {
                this.duplicateError = "Copy from and copy to can't be same. Please select two different language library.";
                return;
            }

            /*if(this.isCopyOnlySection){
                var section = this.sectionSelected;
                // only copy language for selected section
            }*/

            //var dll = angular.copy(dataContainer.dll);
            var id = langLibrarySelectedTo.libraryGUID;
            var data = {
                libraryGUID: langLibrarySelectedFrom.libraryGUID

            }
            var promise = DefaultLanguageLibraryAPI.postCopyFromLibrary(id, data);
            promise.then(function (newDll) {
                // retrieve languge for selected library again
                // service response only sends partial language set
                var libraryId = self.languageLibrarySelected.libraryGUID;
                getLanguageForLibrary(libraryId);

                self.showDisplayMsg('Language Library duplicated successfully', 'success');
                $modalInstance.close();
            });
        }
        $scope.setTemplateAsDefault = function () {
            var dll = angular.copy(dataContainer.dll);
            var id = dll.libraryGUID;
            var selectedTemplateguId = dataContainer.selectedTemplateId.templateGUID;
            var selectedTemplateId = dataContainer.selectedTemplateId.templateID; //templateGUID
            dll.defaultTemplateID = selectedTemplateId;
            dll.defaultTemplateGUID = selectedTemplateguId;
            var promise = DefaultLanguageLibraryAPI.update(id, dll)
            promise.then(function (result) {
                dataContainer.dll.defaultTemplateID = selectedTemplateId;
                $scope.setTemplateComplete = true;
                self.showDisplayMsg('Selected template is successfully saved as default structure for the library.', 'success');
                $modalInstance.close();
            });
        }

        $scope.CancelDelete = function () {

            $modalInstance.close();
        }

    }




}])