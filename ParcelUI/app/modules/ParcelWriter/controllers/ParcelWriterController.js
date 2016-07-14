
angular.module('ParcelWriter').controller('ParcelWriterController', ['parcelWriterData', 'projectDashboardOperations', '$scope', '$timeout', '$compile', '$filter', '$sce', '$state', '$stateParams', 'ParcelWriterFactory', 'notification', '$rootScope', '$window' , function (parcelWriterData, projectDashboardOperations, $scope, $timeout, $compile, $filter, $sce, $state, $stateParams, ParcelWriterFactory, notification, $rootScope, $window) {
    var self = this;
    self.keywords = [];
    self.errorMsg = '';
    self.putErrorMsg = '';
    self.putSuccessMsg = '';
    var updatedSections = [];
    init();

    function windowWriteResize() {


        $(window).resize(function () {
            var parcelWriterheader = $("#parcelWriterNav").height();
            var parcelWritertop = $(".parcelWriterHeader").height();
            var reportWritePage = $(window).height();

            var reportWritebodyheight = reportWritePage - (parcelWriterheader + parcelWritertop);
            $(".reportWriteScroll").height(reportWritebodyheight - 180);
        });
        $(window).trigger('resize');
    };

    function init() {

        $scope.popover = {};
        if (typeof parcelWriterData == "string") {
            self.errorMsg = parcelWriterData;
            return;
        }

        self.languageToUpdateArray = [];
        self.checkInstruction = {};
        self.appendOrOverwrite = "APPEND";

        $('#EDRnav').hide();
        /*angular.forEach(parcelWriterData.sections, function (section) {
            section.isChecked = false;
        });*/
        self.parentSections = parcelWriterData.sections;
        getKeywords('');

        $timeout(function () {
            $('[data-toggle="popover"]').popover();
            windowWriteResize();
        }, 1000);

        $scope.popover.getInstrContent = function (parentSection) {
            var instructionText = '';
            angular.forEach(parentSection.languages, function (lang) {
                if (lang.category.toLowerCase() == 'instructions') {
                    instructionText += lang.text.toString();
                }
            });
            return instructionText;
        }

    }


    self.checkIsSectionChecked = function (language) {       
        if (language.isChecked) {
            for (var i = 0; i < self.keywords.length; i++) {
                if (self.keywords[i].keyword === language.keyword) {
                    self.keywords[i].checked = true;
                }
            }
        } else {
            for (var i = 0; i < self.keywords.length; i++) {
                if (self.keywords[i].keyword === language.keyword) {
                    self.keywords[i].checked = false;
                }
            }            
        }       
    }

    $scope.popover.selectOption = function (hide, language) {
        console.log("parent section popover checked");
        language.isChecked = true;        
        hide();        
    }

    $scope.popover.deSelectOption = function (hide, language) {
        console.log("parent section popover unchecked");
        language.isChecked = false;        
        hide();        
    }

    self.backToReport = function () {
        $('#EDRnav').show();
        if (!$('input[type="checkbox"]:checked').length > 0) {
           /* $state.go('ReportAuthoring.Write', {
                projectGuid: $stateParams.projectGuid,
                reportGuid: $stateParams.reportGuid
            }); */
			$window.close();
        } else {
            var resolveObj = {
                resolveObj: function () {
                    return {};
                }
            }
            projectDashboardOperations.openPopUp($scope, 0, resolveObj, "parcelWriterAlert", true, true);
        } 	
    }


    self.bindLanguage = function (language) {
        if (language.keyword) {
            return language.keyword;
        } else if (!language.keyword) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = language.text;
   
            var substring = tmp.textContent.substring(0, 25) + '...' || tmp.innerText.substring(0, 25) + '...' || "";
            return substring;
        }

    }

    function getKeywords(recursiveSections) {
        var sections;
        if (!recursiveSections) {
            sections = parcelWriterData.sections;
        } else {
            sections = recursiveSections;

        }

        for (var i = 0; i < sections.length; i++) {
            if (sections[i].sectionName != '' && sections[i].sectionName != 'General Information') {


                angular.forEach(sections[i].languages, function (language) {
                    var keywordFound = false;

                    if (language.category && language.category.toLowerCase() !== "instructions" &&
                        !language.isAddedOnProjectStartup && language.keyword != "") {
                        language.isChecked = false;
                        if (self.keywords.length > 0) {
                            for (var i = 0; i < self.keywords.length; i++) {
                                if (self.keywords[i].keyword == language.keyword) {
                                    keywordFound = true;
                                    break;
                                }
                            }
                            if (!keywordFound) {
                                var keywordObj = {
                                    keyword: language.keyword,
                                    languageID: language.languageID,
                                    checked: language.isChecked
                                }
                                self.keywords.push(keywordObj);
                            }


                        } else {
                            var keywordObj = {
                                keyword: language.keyword,
                                languageID: language.languageID,
                                checked: language.isChecked
                            }
                            self.keywords.push(keywordObj);

                        }
                    }



                })
                if (sections[i].subSection instanceof Array && sections[i].subSection.length > 0) {

                    getKeywords(sections[i].subSection);
                }
            }
        }


    }

    self.selectKeywords = function (recursiveSections) {
        var resolveObj = {
            resolveObj: function () {
                return self.keywords;
            }
        }
        projectDashboardOperations.openPopUp($scope, 0, resolveObj, "showKeywords", true, true);
    }

    self.checkInstruction = function (section) {
        if (section.languages && section.languages.length) {
            var instructionsCategory = section.languages.filter(function (lang) {
                return lang.category.toLowerCase() === 'instructions'
            }).length;
            if (instructionsCategory > 0) return true;
            return false;
        }
    };

    self.checkOptions = function (section) {
        if (section.languages && section.languages.length) {
            var optionsCategory = section.languages.filter(function (lang) {
                if (lang && lang.category) {
//                    return lang.category.toLowerCase() === 'options';
                    return lang.category.toLowerCase() !== 'instructions';
                }
            }).length;
            if (optionsCategory > 0) return false;
            return true;
        } else {
            return true;
        }
    };

    $scope.$on('event:data-updated', function (ev, args) {
       
        self.modalClosed = 0;
        angular.forEach(args.obj, function (language) {
            selectLanguages('', language);
        });
    })

    function selectLanguages(recursiveSections, keyword) {
        if (!recursiveSections) {
            var sections = self.parentSections;
        } else {
            var sections = recursiveSections;
        }

        angular.forEach(sections, function (section) {
            if (!section.sectionName == '' || !section.sectionName == 'General Information') {
                angular.forEach(section.languages, function (language) {
                    if (keyword.keyword == language.keyword) {
                        language.isChecked = keyword.checked;
                        
                    }
                })

                if (section.subSection instanceof Array && section.subSection.length > 0)
                    selectLanguages(section.subSection, keyword);
            }
        })
    }

    function removeDuplicates(input) {

        var hashObject = new Object();

        for (var i = input.length - 1; i >= 0; i--) {
            var currentItem = input[i];

            if (hashObject[currentItem] == true) {
                input.splice(i, 1);
            }

            hashObject[currentItem] = true;
        }
        return input;
    }


    function notify(title, text, type, addclass, styling) {

        new PNotify({
            title: title,
            text: text,
            type: type,
            addclass: addclass,
            stack: $rootScope.stack_bottomright
        });
    }

    function deselectCheckBoxes(recursiveSections) {
        var sections;
        if (!recursiveSections) {
            sections = parcelWriterData.sections;
        } else {
            sections = recursiveSections;

        }

        for (var i = 0; i < sections.length; i++) {
            if (sections[i].sectionName != '' || sections[i].sectionName != 'General Information') {


                angular.forEach(sections[i].languages, function (language) {


                    if (language.category && language.category.toLowerCase() !== 'instructions' &&
                        !language.isAddedOnProjectStartup && language.isChecked) {
                        var obj = {
                            sectionGuid: language.sectionGUID,

                            languageItemGuids: language.languageItemGuid
                        }
                        self.langToAppendOrOverwrite.push(obj)
                        
                        language.isChecked = false;

                    }



                })
                if (sections[i].subSection instanceof Array && sections[i].subSection.length > 0) {

                    deselectCheckBoxes(sections[i].subSection);
                }
            }
        }
        
        
        return self.langToAppendOrOverwrite;
        
    }


    self.updateReportWithSelectedLanguages = function () {
        self.langToAppendOrOverwrite = [];
        self.optionsArray = [];
        var x = deselectCheckBoxes('');
        
        var groupedLanguageObjects = _.groupBy(x, 'sectionGuid');
        for (var key in groupedLanguageObjects) {
            var obj = {};
            obj.sectionGuid = groupedLanguageObjects[key][0].sectionGuid;
            obj.overwriteOrAppend = self.appendOrOverwrite;
            obj.languageItemGuids = [];
            for (var i = 0; i < groupedLanguageObjects[key].length; i++) {
                if (groupedLanguageObjects[key][i].languageItemGuids)
                    obj.languageItemGuids.push(groupedLanguageObjects[key][i].languageItemGuids);
            }
            self.optionsArray.push(obj);
        }       
        
         var languageData = {
            parcelWriter: {
                sections: self.optionsArray
            }
        }

         
         if ($("input:checkbox:checked").length > 0) {

            ParcelWriterFactory.putWriterData($stateParams.reportGuid, languageData).then(function (response) {
                notify('Success', 'The Default Language was inserted successfully into your report', 'success', "stack-bottomright", "fontawesome");                
                self.optionsArray.length = 0;
                for (var i = 0; i < self.keywords.length; i++) {
                    if (self.keywords[i].checked)
                        self.keywords[i].checked = false;
                }
            }, function (error) {
                self.putErrorMsg = error;
            })
        } else {
            var resolveObj = {
                resolveObj: function () {
                    return {};
                }
            }
            projectDashboardOperations.openPopUp($scope, 0, resolveObj, "languageSelectionAlert", true, true);
        }


    }
}]);


angular.module('ParcelWriter').controller('ShowKeywords', ['$modalInstance', 'resolveObj', 'ParcelWriterFactory', function ($modalInstance, resolveObj, ParcelWriterFactory) {

    var self = this;
    self.selectedLanguageKeywords = [];
    self.languageToUpdateArray = [];
    init();

    function init() {
        self.languageKeywords = resolveObj;

    }

    self.selectedKeyword = function (keyword) {


    }

    self.selectLanguages = function () {

        angular.forEach(self.languageKeywords, function (element) {
            if (element.isChecked) {
                self.selectedLanguageKeywords.push(element);
            }
        })

        $modalInstance.close(self.languageKeywords);
    }

    self.cancelModal = function () {
        $modalInstance.close();
    }

}])

angular.module('ParcelWriter').controller('ParcelWriterAlert', ['$modalInstance', '$stateParams', 'resolveObj', '$state', '$scope', '$window', function ($modalInstance, $stateParams, resolveObj, $state, $scope, $window) {

    $scope.closeNotification = function () {
       
        $modalInstance.close([]);
    }
    $scope.redirectToReport = function () {		
        $modalInstance.close([]);
       /* $state.go('ReportAuthoring.Write', {
            projectGuid: $stateParams.projectGuid,
            reportGuid: $stateParams.reportGuid
        });*/
		$window.close();
    }

}])

angular.module('ParcelWriter').controller('LanguageSelectionAlert', ['$modalInstance', '$stateParams', 'resolveObj', '$state', '$scope', function ($modalInstance, $stateParams, resolveObj, $state, $scope) {

    $scope.closeAlert = function () {
       
        $modalInstance.close();
    }
    

}])


angular.module('ParcelWriter').constant('parcelWriterUrlCollection', {

    GETWRITERDATA: 'language/{reportGuid}',
    PUTWRITERDATA: 'language/{reportGUID}'

})