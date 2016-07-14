angular.module('ReportAuthoring').controller('spellCheckController', ['$scope', '$modal', 'getScopeService', function ($scope, $modal, getScopeService) {
    window.sessionStorage.setItem('isSpellcheckRunning', false);
    window.sessionStorage.setItem("isSpellcheckClosed", true);

    $scope.IsShowspellcheck = false;
    $("#spellcheck").show();
    if (window.sessionStorage.getItem('isSpellcheckPause') == "true") {
        window.sessionStorage.setItem('isSpellcheckRunning', true);
        // window.sessionStorage.setItem('handleAfterScroll', true);

        $scope.IsShowspellcheck = true;
        if (!$("#chkNarrativeOnly").is(':checked')) {
            $scope.reportWrite.editAllTables(true);
        }
        // Spellcheck.removeSelectText();
        // Spellcheck.resume();
        isSpellcheckRunning = true;
        window.setTimeout(function () {
            $('.spellcheckButton').hide();
            $("#spellcheck-save").hide();
            $("#spellcheck-close").hide();
            $("#btn_addToDictionary").attr('disabled', true);
            $('.spellcheckbody').show();
            $('.spellcheckButton').hide();
            $('.spellcheck-paused').show();

            $('#spellcheckStartupBtn').hide();
            $("#btn_ignore").attr('disabled', true);
            $("#btn_ignore_all").attr('disabled', true);
            $("#btn_replace_sp").attr('disabled', true);
            $("#btn_replace_sp_all").attr('disabled', true);

        }, 10)

    }


    $scope.spellcheckinsectionclick = function () {

        $('.spellcheckButton').show();
        var isGISection = true;
        $("#spellcheckinsection").attr('disabled', 'disabled');
        window.sessionStorage.setItem('isSpellcheckRunning', true);
        $("#btn_addToDictionary").attr('disabled', false);
        $("#btn_ignore").attr('disabled', false);
        $("#btn_ignore_all").attr('disabled', false);
        $("#btn_replace_sp").attr('disabled', false);
        $("#btn_replace_sp_all").attr('disabled', false);
        isSpellcheckRunning = true;
        $scope.IsShowspellcheck = true;
        if ($scope.ck.showAllSections) {
            $scope.reportWrite.switchViewMode();
        }

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

        window.setTimeout(function () {

            Spellcheck.displaySpellcheckPanelActiveSection($scope.ck.obj.selectedSection, $scope.reportWrite.childSectionArray);
        }, 200);


        $('.spellcheckbody').show();
        $('.spellcheckButton').show();

        $('#spellcheckStartupBtn').hide();
        $('#spellcheck-save').show();
        $('#spellcheck-close').show();
        window.setTimeout(function () {
            $("#spellcheckinsection").removeAttr('disabled');
            //window.sessionStorage.setItem('handleAfterScroll', true);
        }, 200)
    }


    $scope.spellcheckinAllSectionclick = function () {


        if (!$scope.ck.showAllSections) {

            var confirmdialog = confirm("Your report will need to be in 'All Sections Mode' with all tables in edit mode to run spellcheck on your full report Would you like to switch to these modes now?");
            if (confirmdialog) {
                window.sessionStorage.setItem('isSpellcheckRunning', true);
                $scope.reportWrite.switchViewMode();
                isSpellcheckRunning = true;
                $scope.IsShowspellcheck = true;
                /*var GIScopesArray = getScopeService.getGIScope();
                for (var index = 0; GIScopesArray.length > index; index++) {
                    GIScopesArray[index].editMode = true;
                }*/
                $("#btn_addToDictionary").attr('disabled', false);
                $("#btn_ignore").attr('disabled', false);
                $("#btn_ignore_all").attr('disabled', false);
                $("#btn_replace_sp").attr('disabled', false);
                $("#btn_replace_sp_all").attr('disabled', false);

            }

        } else {
            window.sessionStorage.setItem('isSpellcheckRunning', true);
            isSpellcheckRunning = true;
            $scope.IsShowspellcheck = true;
            /* var GIScopesArray = getScopeService.getGIScope();
             for (var index = 0; GIScopesArray.length > index; index++) {
                 GIScopesArray[index].editMode = true;
             }*/
            if (!$("#chkNarrativeOnly").is(':checked')) {
                $scope.reportWrite.editAllTables(true);
            }
            $("#btn_addToDictionary").attr('disabled', false);
            $("#btn_ignore").attr('disabled', false);
            $("#btn_ignore_all").attr('disabled', false);
            $("#btn_replace_sp").attr('disabled', false);
            $("#btn_replace_sp_all").attr('disabled', false);
            //window.sessionStorage.setItem('handleAfterScroll', true);
            $('.spellcheckbody').show();
            $('.spellcheckButton').show();
            $('#spellcheck-save').show();
            $('#spellcheck-close').show();
            $('#spellcheckStartupBtn').hide();
            window.setTimeout(function () {
                if ($scope.reportWrite.GISelectedSectionId == -1) {
                    $scope.reportWrite.GISelectedSectionId = $scope.ck.allsectionIdList[0];
                }
                var sectionIdlist = angular.copy($scope.ck.allsectionIdList);
                var gisectionIndex = sectionIdlist.indexOf($scope.reportWrite.GISelectedSectionId);
                sectionIdlist.splice(gisectionIndex, 1)
                Spellcheck.displaySpellcheckPanelAllSections(sectionIdlist);
            }, 200);
        }


    }

    $scope.ignorClick = function () {
        window.setTimeout(Spellcheck.ignoreOnce, 10);

    }

    $scope.replaceWordClick = function () {
        window.setTimeout(Spellcheck.replaceOnce, 10);

    }


    $scope.spellcheckClose = function () {
        window.sessionStorage.setItem("isSpellcheckClosed", true);
        $scope.IsShowspellcheck = false;
        $('.spellcheckbody').hide();
        $('.spellcheckButton').hide();
        $('.spellcheck-paused').hide();
        $('#spellcheckStartupBtn').show();
        Spellcheck.reset();
        Spellcheck.closeSpellcheckPanel();
        var GIScopesArray = getScopeService.getGIScope();
        for (var index = 0; GIScopesArray.length > index; index++) {
            GIScopesArray[index].editMode = false;
        }
        window.sessionStorage.setItem('isSpellcheckRunning', false);
        window.sessionStorage.setItem('handleAfterScroll', false);
        if (!$("#chkNarrativeOnly").is(':checked')) {
            $scope.reportWrite.editAllTables(false);
        }
    }

    $scope.spellcheckSave = function () {

        window.sessionStorage.setItem("isSpellcheckClosed", true);
        window.sessionStorage.setItem('isSpellcheckRunning', false);
        window.sessionStorage.setItem('handleAfterScroll', false);
        $scope.IsShowspellcheck = false;
        $('.spellcheckbody').hide();
        $('.spellcheckButton').hide();
        $('.spellcheck-paused').hide();
        $('#spellcheckStartupBtn').show();
        Spellcheck.reset();

        //All section mode
        if ($scope.ck.showAllSections) {
            if (!$("#chkNarrativeOnly").is(':checked')) {
                $scope.reportWrite.editAllTables(false);
            }
            window.setTimeout(function () {
                $scope.reportWrite.saveSections($scope.ck.resp.sections);
            }, 500)
            var GIScopesArray = getScopeService.getGIScope();
            for (var index = 0; GIScopesArray.length > index; index++) {
                GIScopesArray[index].saveGI(true);
                GIScopesArray[index].editMode = false;
            }
            var GiFormScope = getScopeService.getGiFormScope();
            // GiFormScope.showPNotifyMessage("General Information saved.", "", "success");

        } else if ($scope.ck.selectedSection.isGeneralInfo) {
            var GIScopesArray = getScopeService.getGIScope();
            for (var index = 0; GIScopesArray.length > index; index++) {
                GIScopesArray[index].saveGI(true);
                GIScopesArray[index].editMode = false;
            }
            var GiFormScope = getScopeService.getGiFormScope();
            GiFormScope.showPNotifyMessage("General Information saved.", "", "success");
        } else {
            //Code for single section mode
            if (!$("#chkNarrativeOnly").is(':checked')) {
                $scope.reportWrite.editAllTables(false);
            }

            window.setTimeout(function () {
                var changedSectionData = angular.copy($scope.ck.selectedSection);
                $scope.reportWrite.saveSectionAfterNavigation(changedSectionData);
            }, 200)


        }

    }

    $scope.spellIgnoreAll = function () {
        window.setTimeout(Spellcheck.ignoreAll, 10);

    }

    $scope.spellReplaceAll = function () {
        window.setTimeout(Spellcheck.replaceAll, 10);

    }

    $scope.spellResume = function () {
        window.sessionStorage.setItem('isSpellcheckRunning', true);
        window.sessionStorage.setItem('isSpellcheckPause', false);
        window.sessionStorage.setItem("isSpellcheckClosed", false);
        Spellcheck.resume();
        $('.spellcheck-paused').hide();
        $("#spellcheck-save").show();
        $("#spellcheck-close").show();
        $('.spellcheckButton').show();
        $("#btn_addToDictionary").attr('disabled', false);
        $("#btn_ignore").attr('disabled', false);
        $("#btn_ignore_all").attr('disabled', false);
        $("#btn_replace_sp").attr('disabled', false);
        $("#btn_replace_sp_all").attr('disabled', false);

    }

    $scope.addToDictionary = function () {
        Spellcheck.addToDictionary();
    }


    $(".divsection").click(function () {

        if ($scope.reportWrite.reportAuthoringWriteSelected == "Spellcheck" && window.sessionStorage.getItem("isSpellcheckClosed") != "true") {
            Spellcheck.pause();
            $("#btnspellResume").show();
            $("#spellcheck-save").hide();
            $("#spellcheck-close").hide();
            window.sessionStorage.setItem('isSpellcheckPause', true);
            $("#btn_addToDictionary").attr('disabled', true);
            $("#btn_ignore").attr('disabled', true);
            $("#btn_ignore_all").attr('disabled', true);
            $("#btn_replace_sp").attr('disabled', true);
            $("#btn_replace_sp_all").attr('disabled', true);
            window.sessionStorage.setItem('isSpellcheckRunning', false);
        }

    });

   }]);


function setSpellcheckSuggestions() {

    var val = $('#spellcheckSuggestions').val();
    val = val || '';

    if ((typeof (val.constructor) !== 'undefined') && (val.constructor === Array)) val = val[0];

    // get the original word so that we can fix the casing accordingly
    var orig = jQuery('#spellcheckTypo').val();

    if ((typeof (orig.constructor) !== 'undefined') && (orig.constructor === Array)) orig = orig[0];

    if ((orig !== null) && (jQuery.trim(orig) !== '') && (val !== '')) {
        for (var i = 0; i < orig.length; i++) {
            if ((i < val.length) && (orig[i].toLowerCase() === val[i].toLowerCase())) {
                val = val.substr(0, i) + orig[i] + val.substr(i + 1);
            }
        }
    }

    $('#spellcheckReplaceWith').val(val);
}
