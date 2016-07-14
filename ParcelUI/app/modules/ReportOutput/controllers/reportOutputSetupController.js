var setupModule = angular.module('ReportOutput');
setupModule.controller('ReportOutputSetupController', ['$scope', 'ReportOutputAPI', '$state', 'ReportAuthoringAPI', '$parse', '$timeout', '$document', 'ReportOutputAPI', function($scope, ReportOutputAPI, $state, ReportAuthoringAPI, $parse, $timeout, $document, ReportOutputAPI) {

    var self = this;

    self.saveSetup = function() {
        var ckInstance = $scope.ckInstance;
        var data = ckInstance.getData();
        /*var promise = ReportOutputAPI.saveReportSetup(data);
        promise.then(function(result){
            $state.go("reportOutput");
        });*/



        //var tableHeader = ckInstance.document.$.querySelector("#section-table table th");
        var result = ckInstance.document.$.querySelector("#section-table table th").firstChild;
        var cloned = result.cloneNode(true);
        var lastChild = getLastNestedChild(cloned);    
        var angularEl = angular.element(lastChild);
        angularEl.html("");
        var tableHeaderElements = cloned;

        var allReportTh = document.querySelectorAll("#reportSectionData table th");
        angular.forEach(allReportTh, function(thElement) {
            var clonedHeaderElems = tableHeaderElements.cloneNode(true);
            var appended = clonedHeaderElems;
            if (thElement.firstChild) {
                var first = thElement.firstChild;
                var clonedChild = first.cloneNode(true);
                appended = clonedHeaderElems.appendChild(clonedChild);
            }
            var angularTh = angular.element(thElement);
            angularTh.html(appended.html);
        });
    };

    function getLastNestedChild(element) {
        if (!element.lastChild) return element;
        return getLastNestedChild(element.lastChild);
    }

    function init(reportId) {
        getReportData(reportId);
    }
    self.reportId = 12;
    self.obj = {
        selectedSection: {}
    };
    self.sectionIdList = [];
    init(self.reportId);

    function getReportData(reportId) {
        self.resp = {
            sections: []
        }

        var promise = getReportToc(reportId);
        promise.then(function() {
            createSectionIdListFromToC();

            if (!self.sectionIdList || !self.sectionIdList.length) return;

            startRetrievingSectionData();
        });
    }

    function getReportToc(reportId) {
        var promise = ReportAuthoringAPI.getToC(reportId);
        return promise.then(function(tocSections) {
            self.toc = {
                sections: tocSections
            }

            //var first = tocSections[0];
            //self.obj.selectedSection = first.sectionID;
            //self.selectedSection = first;
        });
    }

    function createSectionIdListFromToC() {
        var tocSections = self.toc.sections;
        if (!tocSections || !tocSections.length) return;

        for (var i = 0; i < tocSections.length; i++) {
            var local = tocSections[i];
            extractSectionIdAndPushToArr(local);
        }
    }

    function extractSectionIdAndPushToArr(section) {
        var sectionId = section.sectionID;
        self.sectionIdList.push(sectionId);

        var nestedSectionArr = section.sections;
        if (!nestedSectionArr) return;
        for (var i = 0; i < nestedSectionArr.length; i++) {
            var nested = nestedSectionArr[i];
            extractSectionIdAndPushToArr(nested);
        }
    }

    function startRetrievingSectionData() {
        var firstSectionId = self.sectionIdList[0];
        getSectionData(firstSectionId);
    }

    function getSectionData(sectionId) {
        if (!sectionId) return;

        var retrieved = checkIfSectionRetrieved(sectionId);
        if (retrieved) return;

        var promise = ReportOutputAPI.getSection(null, sectionId);
        promise.then(function(section) {

            self.resp.sections.push(section);

            var nextSectionId = getNextSectionId(sectionId);
            if (!nextSectionId) return;
            $timeout(function() {
                getSectionData(nextSectionId);
            }, 2000);
        });
    }

    function checkIfSectionRetrieved(sectionId) {
        var existingCount = $parse('self.resp.sections.length')(self);
        if (existingCount <= 0) return false;

        var arr = self.resp.sections;
        for (var i = 0; i < arr.length; i++) {
            var local = arr[i];
            if (local && local.sectionID == sectionId && local.contentValues) {
                return true;
            }
        }
        return false;
    }

    function getNextSectionId(currentSectionId) {
        if (!self.sectionIdList || !self.sectionIdList.length) return 0;
        var index = (self.sectionIdList.indexOf(currentSectionId) + 1);
        if (index < 0 || index >= self.sectionIdList.length) return 0;
        return self.sectionIdList[index];
    }


    self.sectionVisible = function(section) {
        return self.selectedSection && self.selectedSection.sectionID == section.sectionID; //self.obj.selectedSection == section.SectionID;
    }
    self.sectionClicked = function(section, avoidScroll) {
        var sectionId = section.sectionID;
        if (self.showAllSections && !avoidScroll) {
            scrollToSection(sectionId);
        }

        self.obj.selectedSection = sectionId;
        self.selectedSection = section;
        self.selectedLayout = null;
    }

    self.layoutClicked = function(label) {
        self.selectedSection = null;
        self.selectedLayout = label;
    }
    
    
}]);