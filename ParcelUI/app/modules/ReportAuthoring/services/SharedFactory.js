angular.module('ReportAuthoring').factory('sharedService', [function () {

    var factory = {};

    factory.getTemplateUrl = function (type) {

        var rootCostViewUrl = 'app/modules/ReportAuthoring/directives/costTables/';
        var templateUrl = '';
        switch (type) {
            case 'displayATC':
                templateUrl = rootCostViewUrl + 'atc/recommendationView.html';
                break;
            case 'displayDefault':
                templateUrl = rootCostViewUrl + 'default/recommendationView.html';
                break;
            case 'displayEMG':
                templateUrl = rootCostViewUrl + 'emg/recommendationView.html';
                break;
            case 'displayFannie':
                templateUrl = rootCostViewUrl + 'fannie/recommendationView.html';
                break;
            case 'displayFreddie2015':
                templateUrl = rootCostViewUrl + 'freddie/recommendationView.html';
                break;
            case 'displayHUD':
                templateUrl = rootCostViewUrl + 'displayHUD.html';
                break;

        }
        return templateUrl;
    }

    return factory;

}])


angular.module('ReportAuthoring').factory('ReportWriteService', ['$filter', 'HelperService', function ($filter, HelperService) {

    var factory = {};

    var parentSectionFound = null;
    var returnSection = null;
    var returnSectionByGUID = null;
    var sections = [];
    var SelectedReportTab='Toc';
    
    factory.setSectionsArray = function (paramSections) {
        sections = paramSections;
    }


    var extractChildSectionFromArrById = function (section, childSectionId) {

        var sectionId = section.sectionID;
        var nestedSectionArr = section.sections;
        if (!nestedSectionArr && !nestedSectionArr.length) return;
        for (var i = 0; i < nestedSectionArr.length; i++) {
            var nestedChild = nestedSectionArr[i];
            if (nestedChild.sectionID == childSectionId) {
                returnSection = nestedChild;
                break;
            } else
                extractChildSectionFromArrById(nestedChild, childSectionId);
        }
    }

    var extractChildSectionFromArrByGUID = function (section, childSectionGUID) {

        var sectionGUID = section.sectionGUID;
        var nestedSectionArr = section.sections;
        if (!nestedSectionArr && !nestedSectionArr.length) return;
        for (var i = 0; i < nestedSectionArr.length; i++) {
            var nestedChild = nestedSectionArr[i];
            if (nestedChild.sectionGUID == childSectionGUID) {
                returnSectionByGUID = nestedChild;
                break;
            } else
                extractChildSectionFromArrByGUID(nestedChild, childSectionGUID);
        }

    }

    var extractSectionToArr = function (section, childSectionId) {
        var sectionId = section.sectionID;

        if (parentSectionFound) return;
        var nestedSectionArr = section.sections;
        if (!nestedSectionArr || !nestedSectionArr.length) return;
        for (var i = 0; i < nestedSectionArr.length; i++) {
            if (parentSectionFound) return;
            var nested = nestedSectionArr[i];
            if (nested.sectionID == childSectionId) {

                if (nested.isVisibleInToc) {
                    //return nested;
                    parentSectionFound = nested;
                    break;
                    //return;
                } else {
                    if (section.isVisibleInToc) {
                        parentSectionFound = section;
                        break;
                        //return section;
                    } else {
                        //return true;
                        parentSectionFound = true;
                        break;
                    }

                }

            } else {
                if (nested.sections && nested.sections.length) {
                    extractSectionToArr(nested, childSectionId);
                }
            }
        } // end of for
    }


    //Start Report writing Helper method

    factory.filterParentSectionById = function (sectionId) {
        var section = $filter('filter')(sections, {
            sectionID: sectionId
        }, true)[0];
        return section;
    }

    factory.checkIfChildSectionExist = function (section, findSectionId) {
        return child = extractChildSectionFromArrById(section, findSectionId);
    }



    factory.findChildSectionById = function (sectionId, isOnlyVisible) {
        returnSection = null;
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            if (section.sectionID == sectionId) {
                //if(section.isVisibleInToc)
                return section;
            }
            child = extractChildSectionFromArrById(section, sectionId);
            if (child && child.sectionID) {
                returnSection = child;
                break;
            }

        }
        return returnSection;
    }



    //Filter by sectionGUID
    factory.findSectionByGUID = function (sectionGuid) {
        returnSectionByGUID = null;
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            if (section.sectionGUID == sectionGuid) {
                //if(section.isVisibleInToc)
                return section;
            }
            child = extractChildSectionFromArrByGUID(section, sectionGuid);
            if (child && child.sectionGUID) {
                returnSectionByGUID = child;
                break;
            }

        }
        return returnSectionByGUID;
    }

    //End of Filter by sectionGUID

    //find parent section from child section id

    factory.findParentOrVisibleSection = function (sectionId) {
        parentSectionFound = null;
        for (var index = 0; sections.length > index; index++) {
            var parent = sections[index];

            //isParent = extractSectionToArr(parent, sectionId);
            extractSectionToArr(parent, sectionId);
            if (parentSectionFound) {
                if (parentSectionFound.sectionID) {
                    return parentSectionFound;
                    //parentSectionFound = isParent
                    //break;
                } else {
                    return parent
                        // break;
                }
            }
        }
        return parentSectionFound;
    }

    factory.blackAllChildSummariesSection = function (section) {
        if (section.sectionData && section.sectionData.contentValues.ckEditData) {
            var ckDivData = section.sectionData.contentValues.ckEditData;
            // to iterate through each div element of ckeditData

            angular.forEach(section.sectionData.contentValues.ckEditData, function (ckDivData, index) {
                var sectionText = ckDivData; //angular.copy(self.selectedSection.sectionData.contentValues.ckEditData.div02);
                ckDivData = HelperService.changeTextColorToBlack(sectionText);
                section.sectionData.contentValues.ckEditData[index] = ckDivData;
            });

        }
        var nestedSection = section.sections;
        if (!nestedSection || !nestedSection.length) return;
        for (var childIndex = 0; childIndex < nestedSection.length; childIndex++) {
            var child = nestedSection[childIndex];
            factory.blackAllChildSummariesSection(child);
        }
    }

    //End Report writing helper method


    factory.scrollToLeftSection = function (sectionId, isDirectionalNavigation) {

        var leftContentName = 'tocSection_' + sectionId;
        var leftContentElement = document.getElementById(leftContentName);

        var leftContentId = '#tocSection_' + sectionId;

        if (leftContentElement) {
            var topOffset = $('.scrollDiv').offset().top;
            var elementOffset = $(leftContentId).offset().top;
            var isChrome = HelperService.checkActiveBrowser();
            if (isChrome) {
                if (leftContentElement.scrollIntoViewIfNeeded)
                    leftContentElement.scrollIntoViewIfNeeded();
                else leftContentElement.scrollIntoView();
            } else {
                //other than chrome calulate offset to avoid unnecessary scroll
                if (elementOffset - topOffset <= 0)
                    leftContentElement.scrollIntoView();
                else {
                    if ($('.scrollDiv').height() > ($(leftContentId).offset().top + $(leftContentId).height()) - $('.scrollDiv').offset().top) {} else {
                        leftContentElement.scrollIntoView();
                    }
                }
                //$window.scrollBy(0,-70);
            }
        }
    }
    factory.setSelectedReportTabName=function(tabName)
    {
        SelectedReportTab=tabName;
    }

    factory.getSelectedReportTabName=function()
    {
    return SelectedReportTab;
    }

    factory.setSelectedSection = function (selectedSection) {
        if (selectedSection) {
            $('.toc-section').removeClass('bg-gray');
            $('.toc-section').removeClass('current-section');
            $('#tocSection_' + selectedSection.sectionID).addClass('bg-gray');
            $('#tocSection_' + selectedSection.sectionID).addClass('current-section');
            window.sessionStorage.setItem('currentTocSectionId', selectedSection.sectionID);
            HelperService.windowResize();
            factory.scrollToLeftSection(selectedSection.sectionID);
        }
    }

    factory.setReportStatus = function () {
        if (window.sessionStorage.getItem('reportStatusAbbreviation') == 'FIN') {

            var inputsbuttons = $("#rightContent").find('.btn');
            $(inputsbuttons).each(function () {
                $(this).attr('disabled', true);
            });

        } else {

            var inputsbuttons = $("#rightContent").find('.btn');
            $(inputsbuttons).each(function () {
                $(this).attr('disabled', false);
            });
        }

    }
    return factory;

}])


angular.module('ReportAuthoring').factory('HelperService', [function () {

    var factory = {};


    var stack_bottomright = {
        "dir1": "up",
        "dir2": "left",
        "firstpos1": 50,
        "firstpos2": 25
    };
    //Start Helper methods


    factory.windowResize = function () {


        $(window).resize(function () {
            var reportwriteHead = $(".ReportwriteHead").height();
            if ($(".ReportwriteHead").css('display') == "none") {
                reportwriteHead = 0;
            }
            var reportAuthoring = $(window).height();

            var reportHeader = $("#EDRnav").height();
            var footerMenuLP = $(".Footermenu1-LP").height();
            var ckheight = 0;
            if ($("#ckeditorTopToolbar") && $("#ckeditorTopToolbar").css('display') != 'none') {
                ckheight = $("#ckeditorTopToolbar").height();
            }

            var reportbodyheight = reportAuthoring - (reportwriteHead + reportHeader + footerMenuLP);
            var reportLeftheight = reportbodyheight - ckheight;
            $(".leftContent").height(reportbodyheight - 70);
            $("#rightContent").height(reportLeftheight - 70);

        });
        $(window).trigger('resize');
    }

    factory.toggleReportwriteHead = function () {

        $(".ReportwriteHead").toggle(250, function () {

            if ($(".ReportwriteHead").css('display') == "none") {
                reportwriteHead = 0;
                $(".showRwHeader").show();
                $(".hideRwHeader").hide();
            } else if ($(".ReportwriteHead").css('display') != "none") {
                $(".showRwHeader").hide();
                $(".hideRwHeader").show();
            } else {
                $(".showRwHeader").hide();
                $(".hideRwHeader").show();
            }
            factory.windowResize();
        });

        factory.windowResize();

    }

    factory.checkActiveBrowser = function () {
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        return isChrome;
    }

    factory.isEmptyObject = function (obj) {
        return JSON.stringify(obj) === '{}';
    }

    factory.compareObjFunction = function (oldObj, newObj) {
        return angular.equals(oldObj, newObj);
    }
    factory.removeLocalStorage = function () {
        localStorage.removeItem('sign_sectionGUID');

    }


    factory.showPNotifyMessage = function (title, text, type) {
        new PNotify({
            title: title,
            text: text,
            type: type,
            addclass: "stack-bottomright",
            stack: stack_bottomright
        });
    }



    factory.isInArray = function (value, array) {
        return array.indexOf(value) > -1;
    }



      //End Helper methods

    factory.changeTextColorToBlack = function (text) {
        re = /color/g;
        while (m = re.exec(text)) {
            //console.log(m.index);
            matchindex = text.substring(m.index).indexOf('#');
            if (matchindex > -1) {

                //case for background and font color (default white)

                if (text.substring(m.index - 1, m.index) == '-') {
                    colorIndex = m.index + matchindex + 1;
                    text = text.substring(0, colorIndex) + 'ffffff' + text.substring(colorIndex + 6);
                }
                // case for text color (default black)
                else {
                    colorIndex = m.index + matchindex + 1;
                    text = text.substring(0, colorIndex) + '000000' + text.substring(colorIndex + 6);
                }
            }

            //case for IE Browser
            matchindexIE = text.substring(m.index).indexOf('rgb');
            if (matchindexIE > -1) {
                //case for background and font color (default white)
                if (text.substring(m.index - 1, m.index) == '-') {
                    colorIndex = m.index + matchindexIE + 1;
                    startIndex = text.substring(colorIndex).indexOf('(');
                    endIndex = text.substring(colorIndex).indexOf(')');
                    text = text.substring(0, colorIndex + startIndex + 1) + '255, 255, 255' + text.substring(colorIndex + endIndex);
                } else {
                    colorIndex = m.index + matchindexIE + 1;
                    startIndex = text.substring(colorIndex).indexOf('(');
                    endIndex = text.substring(colorIndex).indexOf(')');
                    text = text.substring(0, colorIndex + startIndex + 1) + '0, 0, 0' + text.substring(colorIndex + endIndex);
                }
            }

            //console.log(text);
        }
        return text;
    }

    factory.genericScrollTo = function (containerObj, scrollToObj, thingToScroll, offset) {
        offset = offset || 0;
        /*thingToScroll.animate({
           scrollTop: scrollToObj.offset().top - containerObj.offset().top + containerObj.scrollTop() + offset 
        });*/

        thingToScroll.animate({
            scrollTop: scrollToObj.offset().top - containerObj.offset().top + containerObj.scrollTop() + offset
        });
    }

    //End Helper methods



    return factory;

}])
