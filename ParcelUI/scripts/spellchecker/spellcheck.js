var isSpellcheckRunning = false;
var spellCheckSectionID = null;
var edrSP = new EDRSpellChecker();
var selectedSection;

(function (Spellcheck, $, undefined) {
    var stopSpellcheck = true;
    var paused = false;
    var sectionMode = null; // 'ACTIVE' OR 'ALL'
    var iterator;
    var sectionPart;
    var currentCKEditor = null;
    var scrollEditors = [];

    var currentSectionID = null;
    var isSingleModeSectionAlreadyMatched = false;

    var LOGLEVELS = {
        INFO: 'Info',
        WARNING: 'Warning',
        ERROR: 'Error'
    };
    var DISPLAYLOGLEVELS = [LOGLEVELS.ERROR];

    var dotdotdotMsg = null;
    var dotdotdotMax = 4;
    var dotdotdotCur = '';

    var spRWAIterator = null;
    var spRWASectionPart = null;
    var spRWAIsSingleModeSectionAlreadyMatched = false;
    var spRWAIsRunning = false;
    var selectedSection = null;
    var sectionIdArray = [];
    /**
     * Starts spellcheck process
     */
    Spellcheck.startSpellChecking = function () {
        try {

            paused = false;
            sectionPart = null;
            stopSpellcheck = false;
            iterator = null;
            // overlay update
            updateOverlay(true, 'Initializing ...');

            // doublecheck if we need to EDIT all tables
            //if (isTableReopenNeeded()) {
            //this is a syncronous call
            // logToConsole(LOGLEVELS.INFO, 'startSpellChecking', 'Calling editAllTables()');
            // editAllTables();
            // }

            // create new iterator if need be 
            // this is because we may already gave an iterator in RESUME operation
            if ((typeof (iterator) === 'undefined') || (iterator === null)) {
                edrSP = new EDRSpellChecker();
                logToConsole(LOGLEVELS.INFO, 'startSpellChecking', 'Creating SectionPartIterator');
                iterator = new SectionPartIterator(Spellcheck.sectionIdArray, false);
            } else {
                iterator.reset();
            }

            // reset some flags
            isSingleModeSectionAlreadyMatched = false;

            // next section

            if (advanceSection(false)) {
                window.setTimeout(spellcheckSection, 10);
                //spellcheckSection();
            } else {
                resetSpellcheckControls(true, 'We are sorry, but no section was found to spellcheck.');
            }
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'startSpellChecking', e.message);
        }
    };

    /**
     * Initializes and shows spellcheck panel
     * 
     * @param {string} mode ACTIVE for single-section, ALL for all-section mode
     */
    function displaySpellcheckPanel(mode) {
        window.sessionStorage.setItem("isSpellcheckClosed", false);
        window.sessionStorage.setItem("isSpellcheckRunning", true);
        if (typeof iterator !== "undefined") iterator.reset();
        sectionMode = mode;
        paused = false;
        $(".spellcheck-block").hide();
        $(".content-body-spellcheck").hide();
        $(".spellcheck-in-section-block").show();
        $('.spellcheck-in-section').html("In Section");
        $('.spellcheck-in-full-report').html("In Full Report");
        updateButtonState();
        Spellcheck.startSpellChecking();
        window.setTimeout(function () {
            isSpellcheckRunning = true;
        }, 200);
    };

    /**
     * Check if we need to change tables into "EDIT" mode
     */
    function isTableReopenNeeded() {
        if (currentSectionID === null) {
            return;
        }
        var count = 0;
        for (var key in sectionEditMode) {
            if (typeof sectionEditMode[key] === "function" || key === "length") continue;

            if (key.indexOf("divTableOuterDiv") === 0) {
                count++;
            }

            if (sectionEditMode[key] == false) {
                return true;
            }
        }

        if (count === 0) {
            return true;
        }

        return false;
    };

    /**
     * Shows/hides overlay with message
     * 
     * @param {boolean} showIt True to display overlay, false to hide it
     * @param {string} msg Message to display if showing the overlay
     */
    function updateOverlay(showIt, msg) {
        try {
            // get parent
            var parent = $('#spellcheckCont');
            var childO = jQuery('#spellcheckCont .spellcheckoverlay');
            var childS = jQuery('#spellcheckCont .spellcheckstatuscont');
            var lbl = jQuery('#spellcheckCont .spellcheckstatuscont .label');

            // hide if requested
            if (showIt === false) {
                childO.hide();
                childS.hide();
                return true;
            }

            // show 
            childO.show();
            childS.show();

            // set msg
            lbl.html(msg);

            // resize overlay
            //  childO.width(parent.width()).height(parent.height());

            // reposition status
            //  childS.css('top', (parent.height() - childS.height() + 77) / 2 + 'px');
            // childS.css('left', (parent.width() - childS.width() + 10) / 2 + 'px');

            //OVerlay height 
            var spellchecklaftpanel = $('.leftContent').height();
            var spellcheckButton = $(".spellcheckButton").height();
            var spellcheckBody = (spellchecklaftpanel - spellcheckButton) - 50;
            $(".spellcheckoverlay").height(spellcheckBody);
            $(window).resize(function () {
                var spellchecklaftpanel = $('.leftContent').height();
                var spellcheckButton = $(".spellcheckButton").height();
                var spellcheckBody = (spellchecklaftpanel - spellcheckButton) - 50;
                $(".spellcheckoverlay").height(spellcheckBody);
            });
            //$(window).trigger('resize');


            return true;
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'updateOverlay', e.message);
        }
    };

    /**
     * Advance section iterator
     * 
     * @param {boolean} advanceFirst True to advance the iterator first before calling getCurrent, False otherwise
     */
    function advanceSection(advanceFirst) {
        try {
            var currentContent = '';
            var stayInLoop = true;

            while (stayInLoop === true) {
                // check if we need to stop operation
                if (stopSpellcheck === true) return false;

                // get current part
                currentSectionID = null;

                if (advanceFirst) {
                    // move to next section
                    sectionPart = iterator.moveNext();
                } else {
                    // get current section (this function does not return NULL as long as 
                    // iterator has one section in it
                    sectionPart = iterator.getCurrent();
                }

                // at this moment if it is still null, then we are done
                if (sectionPart === null) {
                    logToConsole(LOGLEVELS.INFO, 'advanceSection', 'Completed interating through sections');
                    stayInLoop = false;
                    return false;
                }

                // keep section ID
                currentSectionID = sectionPart.sectionID;
                logToConsole(LOGLEVELS.INFO, 'advanceSection', 'currentSectionID: ' + currentSectionID + ' id: ' + sectionPart.id);

                // if this is single section mode and we've already matched it before then we can force this to end
                // so that we don't loop to the end of the report sections for no reason
                if ((sectionMode === 'ACTIVE') && (isSingleModeSectionAlreadyMatched === true) && !(Spellcheck.sectionIdArray.indexOf(currentSectionID) > -1)) {

                    logToConsole(LOGLEVELS.INFO, 'advanceSection', 'Single section mode: forced completion because already completed spellcheck for active section');
                    sectionPart = null;
                    stayInLoop = false;
                    return false;
                }

                // quick info for the section


                updateOverlay(true, 'Checking ' + $('#spellcheckSectionInfo').html() + '...');

                // if this is single section mode - make sure we are in the currect section
                if ((sectionMode === 'ACTIVE') && !(Spellcheck.sectionIdArray.indexOf(currentSectionID) > -1)) {
                    logToConsole(LOGLEVELS.INFO, 'advanceSection', 'Single section mode: activeSection=' + selectedSection + ' : iteratorSection=' + currentSectionID);
                    advanceFirst = true; // tell it to advance to next section
                } else
                    stayInLoop = false;
                if (sectionPart.type == "TEXT" && jQuery("#" + sectionPart.id).is(":visible") === true) {
                    currentContent = sectionPart.getContent().trim();
                    if (currentContent === '' || isNaN(currentContent) === false || currentContent.toUpperCase() === 'NR') {
                        stayInLoop = true;
                    }
                }
            }

            // flag that we found matched for active section in single section mode
            if ((sectionMode === 'ACTIVE') && (isSingleModeSectionAlreadyMatched === false) && (selectedSection === currentSectionID)) {
                logToConsole(LOGLEVELS.INFO, 'advanceSection', 'Single section mode: found active section to be spellchecked');
                isSingleModeSectionAlreadyMatched = true;
            }

            // at this moment - we have the correct section
            logToConsole(LOGLEVELS.INFO, 'advanceSection', 'MATCHED: activeSection=' + selectedSection + ' : iteratorSection=' + currentSectionID);
            return true;
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'advanceSection', e.message);
        }
    };

    /**
     * Spellcheck section
     */
    function spellcheckSection() {
        try {

            // check if we need to stop operation
            if (stopSpellcheck === true) return;


            // if sectionPart is null - means we do not have anything to spellcheck
            if (sectionPart === null) {
                edrSP.selectText(false);
                Spellcheck.reset();

                return resetSpellcheckControls(true, 'Spellcheck completed.');
            }


            // spellcheck section
            // depending on type, start spell checker and advance word
            if (sectionPart.type == "CKEDITOR") {
                // spellcheck

                updateOverlay(true, 'Spellchecking ...');
                var editorData = CKEDITOR.instances[sectionPart.editorName].getData();
                if (editorData) {
                    edrSP.spellCheckDOM(false, false, editorData, sectionPart);
                }

            } else if (sectionPart.type == "INLINECKEDITOR") {

                //INLINECKEDITOR spellcheck
                updateOverlay(true, 'Spellchecking ...');
                currentCKEditor = $("#section_" + sectionPart.sectionID).find("#" + sectionPart.editorName).html();
                if (currentCKEditor) {
                    edrSP.spellCheckDOM(false, false, currentCKEditor, sectionPart);
                }

            } else if (sectionPart.type == "TEXT") {
                updateOverlay(true, 'Spellchecking ...');
                var textData = sectionPart.getContent();
                if (textData) {
                    edrSP.spellCheckString(false, false, textData, document.getElementById(sectionPart.id));
                }
                //spellcheckNextWord();

            }

            window.setTimeout(spellcheckNextWord, 10);

        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'spellcheckSection', e.message);
        }
    };


    function spellcheckScrollTo(obj) {
        try {

            if (typeof isSpellcheckRunning !== 'undefined' && isSpellcheckRunning === true) {
                var splitarr = sectionPart.editorName.split('_');
                var editorname = splitarr[1];
                var offset = $('.edr-sp-select').offset().top;

                var contentID = sectionPart.id.split('_')[1];

                sectionPart.scrollTo(offset - 100, contentID);
            }
        } catch (e) {
            //logToConsole(LOGLEVELS.ERROR, 'spellcheckScrollTo', e.message);
        }
    }

    /**
     * Spellcheck next available word
     */
    function spellcheckNextWord() {
        // try {

        // check if we need to stop operation
        if (stopSpellcheck === true) return false;

        // if sectionPart is null - means we do not have anything to spellcheck
        if (sectionPart === null) {
            edrSP.selectText(false);
            Spellcheck.reset();

            return resetSpellcheckControls(true, 'Spellcheck completed.');
        }

        // reset input control
        resetSpellcheckControls(false, '');

        // get the next word
        var nextIsAdvanceWord = false;
        var noMoreWord = false;

        updateOverlay(true, dotdotdot('Finding next typo'));
        var ret = edrSP.nextWord();

        if (ret !== null) {
            // found next word - 
            if (ret.isValidWord === true) {
                // advance the word
                nextIsAdvanceWord = true;
            }
        } else {
            // advance the section
            noMoreWord = true;
        }

        if ((nextIsAdvanceWord === false) && (noMoreWord === false)) {
            updateOverlay(false, 'Typo: \'' + ret.originalWord + '\'');
            logToConsole(LOGLEVELS.INFO, 'spellcheckSection', 'Found typo: ' + ret.originalWord);

            // typo
            jQuery('#spellcheckTypo').val(ret.originalWord);

            // display suggestions, if any
            var suggWCtrl = jQuery('#spellcheckSuggestions');
            if ((ret.suggestedWords === null) || (ret.suggestedWords.length === 0)) {
                suggWCtrl.append(jQuery('<option>', {
                    value: '',
                    text: '(no suggestions)'
                }));
            } else {
                var i = 0;
                $.each(ret.suggestedWords, function (index, value) {
                    if (i == 0) {
                        suggWCtrl.append(jQuery('<option>', {
                            value: value,
                            text: value,
                            selected: true
                        }));
                        suggWCtrl.click();
                    } else {
                        suggWCtrl.append(jQuery('<option>', {
                            value: value,
                            text: value
                        }));
                    }
                    i++;
                });
            }

            // set control to be focused
            window.setTimeout(function () {

                if (sectionPart.editorName === '') {
                    jQuery('#' + sectionPart.id)[0].scrollIntoView();
                    jQuery('#' + sectionPart.id)[0].focus();
                }
                /*else {
                    if (sectionPart.type == "CKEDITOR") {
                        CKEDITOR.instances[sectionPart.editorName].focus();
                        //spellcheckScrollTo(jQuery("#" + sectionPart.id)[0]);
                    } else if (sectionPart.type == "INLINECKEDITOR") {
                        $("#section_" + sectionPart.sectionID).find("#" + sectionPart.editorName).focus();
                        console.log("sectionPart.sectionID focus data" + sectionPart.sectionID)
                            //  CKEDITOR.instances[sectionPart.editorName].focus();
                    }
                }*/
                edrSP.selectText(true);
            }, 100);
        } else if (nextIsAdvanceWord === true) {
            logToConsole(LOGLEVELS.INFO, 'spellcheckSection', 'Goto next word: ' + ret.originalWord);

            // advance to next word
            edrSP.advanceWord();
            window.setTimeout(spellcheckNextWord, 10);
            // spellcheckNextWord();
        } else {
            logToConsole(LOGLEVELS.INFO, 'spellcheckSection', 'Goto next section');
            try {

                // hack to fix showing of the first line in tinymce editor :(
                if (is_ms_ie() === false && currentCKEditor !== null) {
                    if (scrollEditors.indexOf(currentCKEditor.id) === -1) {
                        var p = currentCKEditor.getDoc().getElementsByTagName('p');
                        if (p !== null && p.length > 0) {
                            p = p[0];
                            p.scrollIntoView();
                            scrollEditors.push(currentCKEditor.id);
                        }
                    }
                }
            } catch (ex) {
                //console.log ("spellcheckNextWord : Exception = " + ex.message);
            }
            edrSP.selectText(false);

            // advance to next section
            window.setTimeout(function () {
                advanceSection(true);
                spellcheckSection();
            }, 100);
        }
        //  } catch (e) {
        //logToConsole(LOGLEVELS.ERROR, 'spellcheckNextWord', e.message);
        // }
    };

    /**
     * Ignore current typo
     */
    function spellcheckIgnoreWord(ignoreAll) {
        try {
            edrSP.ignoreWord(ignoreAll);
            window.setTimeout(spellcheckNextWord, 10);
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'spellcheckIgnoreWord', e.message);
        }
    };

    /**
     * Adds this word into the dictionary
     * 
     * @param {string} newWord New word to add to the dictionary
     */
    function spellcheckAddToDictionary(newWord) {
        try {
            // add to dictionary
            updateOverlay(true, 'Adding word to dictionary ...');
            newWord = jQuery('#spellcheckTypo').val();
            edrSP.addToDictionary(newWord);

            // ignore this word
            spellcheckIgnoreWord(true);
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'spellcheckAddToDictionary', e.message);
        }
    };

    /**
     * Replaces ALL instances of the word in all input controls (based on sectionMode)
     * 
     * @param {string} oldValue Original string
     * @param {string} newValue Replacement string
     */
    function spellcheckReplaceWordAll(oldValue, newValue) {

        try {
            // check if we need to stop operation
            if (stopSpellcheck === true) return false;

            // show status
            spRWAIsRunning = true;

            updateOverlay(true, dotdotdot('Substituting all instances of \'' + oldValue + '\''));

            if (spRWASectionPart === null) {
                spRWASectionPart = spRWAIterator.moveNext();

                if (spRWASectionPart === null) {
                    // done
                    spRWAIsRunning = false;
                    window.setTimeout(spellcheckSection, 10);

                    return false;
                }
            }

            // get current section
            var curSectID = spRWASectionPart.sectionID;

            // replace all
            if (spRWASectionPart.type === 'TEXT') {
                if (spRWASectionPart.id === sectionPart.id) {
                    sectionPart.setContent(edrSP.replaceAll(oldValue, newValue)); // use this so that the content of edrSP is sync'ed
                    $('#' + sectionPart.id).trigger('input');
                } else {
                    spRWASectionPart.setContent(edrSP.replaceAllString(spRWASectionPart.getContent(), oldValue, newValue));
                    $('#' + spRWASectionPart.id).trigger('input');
                }

            } else if (spRWASectionPart.type === 'CKEDITOR') {
                if (spRWASectionPart.id === sectionPart.id)
                    edrSP.replaceAll(oldValue, newValue);
                else {
                    var editData = CKEDITOR.instances[spRWASectionPart.editorName].getData();
                    if (editData) {
                        edrSP.replaceAllDOM(spRWASectionPart.type, spRWASectionPart.editorName, spRWASectionPart.sectionID, editData, oldValue, newValue);
                    }
                }
            } else if (spRWASectionPart.type === 'INLINECKEDITOR') {
                if (spRWASectionPart.id === sectionPart.id)
                    edrSP.replaceAll(oldValue, newValue);
                else {
                    var editData = $("#section_" + spRWASectionPart.sectionID).find("#" + spRWASectionPart.editorName).html();
                    // var editData = CKEDITOR.instances[spRWASectionPart.id].getData();
                    if (editData) {
                        edrSP.replaceAllDOM(spRWASectionPart.type, spRWASectionPart.id, spRWASectionPart.sectionID, editData, oldValue, newValue);
                    }
                }

            }

            var lastsectionId = Spellcheck.sectionIdArray[Spellcheck.sectionIdArray.length - 1]
            if (curSectID == lastsectionId) {
                spRWAIsRunning = false;
                spRWASectionPart = null;
                window.setTimeout(spellcheckNextWord, 10);
                // spellcheckSection();
                return false;
            }
            // move next
            window.setTimeout(function () {
                spRWASectionPart = null;
                spellcheckReplaceWordAll(oldValue, newValue);
            }, 100);
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'spellcheckReplaceWordAll', e.message);
        }
    };

    /**
     * Adds this word into the dictionary
     * 
     * @param {boolean} replaceAll True to replace all instances, false to replace just the current instance
     */

    function spellcheckReplaceWord(replaceAll) {
        try {
            // update
            var oldValue = jQuery('#spellcheckTypo').val();
            var newValue = jQuery('#spellcheckReplaceWith').val();

            updateOverlay(true, 'Substituting word ...');

            // check if new value has been changed by the user (as in - does not exist
            // in the suggested words
            if (jQuery.trim(newValue) !== '') {
                // get all of the dropdown values
                var suggestedWords = [];

                var suggestedWordOpts = jQuery('#spellcheckSuggestions option');

                if (suggestedWordOpts.length > 0) {
                    suggestedWordOpts.each(function () {
                        if (jQuery(this) && jQuery(this).attr('value')) {
                            suggestedWords.push(jQuery(this).attr('value').toLowerCase());
                        }
                    });
                }

                // variables for jQuery UI modal dialog
                var isNewWordValid = true;
                var isReplaceAnyway = false;

                var confirmDialog = "<div id='dialog-confirm' title='Invalid Word'>" +
                    "<div style='margin-bottom: 10px;'>" +
                    "'" + newValue + "' is an invalid word." +
                    "</div>" +
                    "<div>Replace anyway?</div>" +
                    "</div>";

                var confirmMsg = "<div style='margin-bottom: 10px;'>" +
                    "'" + newValue + "' is an invalid word." +
                    "</div>" +
                    "<div>Replace anyway?</div>";
                // spellcheck the word if
                // 1. it is not one of the option given (meaning user modified it)
                // 2. does not contain spaces (we'll just accept multiple words)
                // 3. is not all caps
                if ((!checkAllCaps(newValue)) && (!checkSpaces(newValue)) && (suggestedWords.indexOf(newValue.toLowerCase()) === -1)) {
                    if (isValidWord(newValue) === false) {
                        isNewWordValid = false;

                        $('#spellCheck_InvalidWordModal .modal-body').html(confirmMsg);

                        $('#spellCheck_InvalidWordModal').modal({
                            backdrop: 'static'
                        })

                        $('#spellCheck_InvalidWordModal #InvalidWordCancel').click(function () {
                            updateOverlay(false, '');

                            window.setTimeout(Spellcheck.ignoreOnce, 10);
                            $('#spellCheck_InvalidWordModal').modal('hide');

                        })
                        $('#spellCheck_InvalidWordModal #InvalidWordReplace').click(function () {
                            isReplaceAnyway = true;
                            replaceIt();
                            $('#spellCheck_InvalidWordModal').modal('hide');
                        });
                    }
                }


                var replaceIt = function () {
                    if (replaceAll === false) {
                        // replace just this instance
                        if (sectionPart.type === 'TEXT') {
                            sectionPart.setContent(edrSP.replaceWord(false, newValue));
                            $('#' + sectionPart.id).trigger('input');
                        } else if (sectionPart.type === 'INLINECKEDITOR') {
                            edrSP.replaceWord(false, oldValue, newValue);
                            //CKEDITOR.instances[sectionPart.id].focus()
                            //  $("#section_" + sectionPart.sectionID).find("#" + sectionPart.editorName).focus();
                        } else {
                            edrSP.replaceWord(false, oldValue, newValue);
                        }


                        window.setTimeout(spellcheckNextWord, 10);
                    } else {
                        // we have to use new iterator and SP
                        spRWAIterator = new SectionPartIterator(Spellcheck.sectionIdArray, true);
                        spRWAIsSingleModeSectionAlreadyMatched = false;
                        spRWASectionPart = null;

                        window.setTimeout(function () {
                            spRWASectionPart = spRWAIterator.getCurrent();
                            spellcheckReplaceWordAll(oldValue, newValue);
                        }, 100);
                    }
                };

                if (isNewWordValid === true && isReplaceAnyway === false) {
                    replaceIt();
                }

            } else {
                // user did not enter anything
                alert('Please enter the word to replace \'' + oldValue + '\' with.');
                updateOverlay(false, '');
                return;
            }

            /*
            if (replaceAll === false)
            {
              // replace just this instance
              if (sectionPart.type === 'TEXT')
                sectionPart.setContent(edrSP.replaceWord(false, newValue));
              else
                edrSP.replaceWord(false, oldValue, newValue); // tiny mce

              window.setTimeout(spellcheckNextWord, 100);
            }
            else
            {
              // we have to use new iterator and SP
              spRWAIterator = new SectionPartIterator();
              spRWAIsSingleModeSectionAlreadyMatched = false;
              spRWASectionPart = null;

              window.setTimeout(function () { spRWASectionPart = spRWAIterator.getCurrent(); spellcheckReplaceWordAll(oldValue, newValue); }, 100);
            }
            */
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'spellcheckReplaceWord', e.message);
        }
    };

    /**
     * Returns if a word is a valid word
     * 
     * @param {string} word Word to check
     */
    function isValidWord(word) {
        try {
            // check if this is valid word
            var isValidWord = edrSP.isValidWord(word);

            if (!isValidWord) {
                // spellcheck it - this is a SYNC call
                edrSP.checkForSpelling(word,
                    function () {
                        // onErrorFn - ignore error from SP - just assume it is good
                        isValidWord = true;
                    },
                    function (result) {
                        // onSuccessFn - result is an array objects with .word
                        // we will make an assumption that word is just 1 word
                        // so we just have to check the first element
                        if (result.length !== 0) {
                            isValidWord = result[0].status === 'F' ? false : true;
                        }
                    },
                    function () {
                        // onCompleteFn - nothing to do
                    });
            }

            return isValidWord;
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'isValidWord', e.message);
        }
    };

    /**
     * Check if word is ALL CAP
     * 
     * @param {string} word Word to check
     */
    function checkAllCaps(word) {
        var containsUpper = /[A-Z]/.test(word);
        var containsLower = /[a-z]/.test(word);

        return containsUpper && !containsLower;
    };

    /**
     * Check if word has one or more spaces
     * 
     * @param {string} word Word to check
     */
    function checkSpaces(word) {
        return /\s/g.test(word);
    };

    /**
     * Resets spellcheck controls and closes it if needed
     * 
     * @param {boolean} closeSpellcheck True to also close the spellcheck dialog, False to only reset input controls
     * @param {string} closeMsg Message to display if we're closing spellcheck
     */
    function resetSpellcheckControls(closeSpellcheck, closeMsg) {
        try {

            // resets inputs
            var suggWCtrl = jQuery('#spellcheckSuggestions');
            jQuery('option', suggWCtrl).remove();
            jQuery('#spellcheckReplaceWith').val('');
            jQuery('#spellcheckTypo').val('');

            updateOverlay(false, 'Closing spellcheck ...');

            // close it if needed
            if (closeSpellcheck === true) {
                // stopSpellcheck = true;
                window.sessionStorage.setItem('isSpellcheckPause', false);
                window.sessionStorage.setItem('isSpellcheckRunning', false);
                window.sessionStorage.setItem('isSpellcheckClosed', true);
                updateOverlay(true, closeMsg);
                $("#btn_addToDictionary").attr('disabled', true);
                $("#btn_ignore").attr('disabled', true);
                $("#btn_ignore_all").attr('disabled', true);
                $("#btn_replace_sp").attr('disabled', true);
                $("#btn_replace_sp_all").attr('disabled', true);

            }
            // return !closeSpellcheck;
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'resetSpellcheckControls', e.message);
        }
    };

    /**
     * Updates buttons state
     */
    function updateButtonState() {
        if (paused) {
            $('#spellcheck-save').hide();
            $('#spellcheck-close').hide();
            $('.spellcheck-paused').show();

        } else {
            $('#spellcheck-save').show();
            $('#spellcheck-close').show();
            $('.spellcheck-paused').hide();

            // $('#replacement').removeAttr('disabled');
            //  $('#suggested_words').removeAttr('disabled');

            //$('#btn_replace_sp').prop('disabled', false).removeAttr('disabled');
            $('#btn_replace_all_sp').prop('disabled', false).removeAttr('disabled');
            $('#btn_ignore').prop('disabled', false).removeAttr('disabled');
            $('#btn_ignore_all').prop('disabled', false).removeAttr('disabled');
            $('#btn_add_to_dictionary').prop('disabled', false).removeAttr('disabled');

            //jQuery('.mceExternalToolbar').removeAttr('style');
        }
    };

    /**
     * Adds ... to the message
     * 
     * @param {string} msg Message to add ... to
     */
    function dotdotdot(msg) {
        try {
            // reset current dot dot dot
            if (msg !== dotdotdotMsg) dotdotdotCur = '';
            if (dotdotdotCur.length >= dotdotdotMax) dotdotdotCur = '';

            dotdotdotCur = (dotdotdotCur + '.').substr(0, dotdotdotMax);
            dotdotdotMsg = msg;

            return msg + ' ' + dotdotdotCur;
        } catch (e) {
            logToConsole(LOGLEVELS.ERROR, 'dotdotdot', e.message);
        }
    };

    /**
     * Log message to console
     * 
     * @param {LOGLEVELS} logLevel One of LOGLEVELS enumeration values
     * @param {string} fnName Name of the function that is logging this message
     * @param {object} msg Message to be displayed
     */
    function logToConsole(logLevel, fnName, msg) {
        // only log if logLevel is in the display log levels array
        if (DISPLAYLOGLEVELS.indexOf(logLevel) !== -1) {
            try {
                console.log('SPELL::' + fnName + ': ' + msg);
            } catch (e) {}
        }
    };

    /**
     * Initiates ALL section spellcheck
     */
    Spellcheck.displaySpellcheckPanelAllSections = function (sectionIds) {
        Spellcheck.sectionIdArray = sectionIds;
        displaySpellcheckPanel('ALL');

        /* if (writeTabMode === "single") {
             if (confirm("Your report will need to be in \"All Sections Mode\" with all tables in edit mode to run spellcheck on your full report.\n\nWould you like to switch to these modes now?")) {
                 var el = jQuery(".simplified-display-section");
                 if (el !== null && el.length > 0) {
                     el = el[0];
                     spellCheckSectionID = jQuery(el).data("section-id");
                 }

                 // switch over to all section mode
                 switchMode(true, function () {
                     displaySpellcheckPanel('ALL');
                 });
             } else {
                 return;
             }
         } else {
             // already in all section mode - just edit the tables up
            // editAllTables();
             displaySpellcheckPanel('ALL');
         }*/
    };

    /**
     * Initiates SINGLE section spellcheck
     */
    Spellcheck.displaySpellcheckPanelActiveSection = function (paramSection, sectionIds) {
        //editAllTables();

        Spellcheck.sectionIdArray = sectionIds;
        selectedSection = paramSection;
        displaySpellcheckPanel('ACTIVE');
    };

    /**
     * Closes spellcheck
     */
    Spellcheck.closeSpellcheckPanel = function () {
        if (isSpellcheckRunning === true) {
            Spellcheck.reset();
            scrollEditors = [];
            jQuery(".spellcheck-block").show();
            jQuery(".content-body-spellcheck").show();
            jQuery(".spellcheck-in-section-block").hide();
            jQuery('.spellcheck-paused').hide();
            jQuery("#ignoreWordsList").val('');
            jQuery("#ignoreAllWordsList").val('');

        }
        isSpellcheckRunning = false;
    };

    /**
     * Ignore a word once
     */
    Spellcheck.ignoreOnce = function () {
        spellcheckIgnoreWord(false);
    };

    /**
     * Ignore this word from now on
     */
    Spellcheck.ignoreAll = function () {
        spellcheckIgnoreWord(true);
    };

    /**
     * Adds words into dictionary
     */
    Spellcheck.addToDictionary = function () {
        spellcheckAddToDictionary(jQuery('#spellcheckTypo').val());
    };

    /**
     * Replaces the word once
     */
    Spellcheck.replaceOnce = function () {
        spellcheckReplaceWord(false);
    };

    /**
     * Replaces all instance of the word
     */
    Spellcheck.replaceAll = function () {
        spellcheckReplaceWord(true);
    };

    /**
     * Pauses spellcheck
     */
    Spellcheck.pause = function (val) {

        if (paused) return;
        if (typeof iterator == "undefined") return;

        // before we pause let's confirm that we are not doing replace all
        if (spRWAIsRunning === true) {
            if (confirm('Pausing spellcheck will stop REPLACE ALL operation.\nHit OK to pause or CANCEL to resume.') === false) return;
        }

        // reset hightlight
        edrSP.selectText(false);

        // sets flags
        paused = true;
        stopSpellcheck = true;
        spRWAIsRunning = false;

        // updates buttons
        updateButtonState();
    };

    /**
     * Resumes spellcheck
     */
    Spellcheck.resume = function () {
        // sets flags
        paused = false;
        stopSpellcheck = false;

        // updates buttons
        updateButtonState();

        // force it to restart spellcheck to the last known section
        iterator.goToSectionID(currentSectionID);
        sectionPart = iterator.getCurrent();

        window.setTimeout(spellcheckSection, 200);
        //spellcheckSection();
    };


    Spellcheck.resumeSection = function (sectionId) {
        // sets flags
        // paused = false;

        //edrSP.selectText(false);
        // updates buttons
        // updateButtonState();
        window.sessionStorage.setItem("isSpellcheckClosed", false);
        window.sessionStorage.setItem("isSpellcheckRunning", true);
        stopSpellcheck = false;
        iterator = undefined;
        paused = false;
        spRWAIsRunning = false;
        spellCheckSectionID = null;

        // reset hightlight
        edrSP.selectText(false);
        if ((typeof (iterator) === 'undefined') || (iterator === null)) {
            edrSP = new EDRSpellChecker();
            logToConsole(LOGLEVELS.INFO, 'startSpellChecking', 'Creating SectionPartIterator');
            iterator = new SectionPartIterator(Spellcheck.sectionIdArray, false);
        }
        // force it to restart spellcheck to the last known section

        sectionPart = iterator.goToDirectSectionID(sectionId);

        //sectionPart = iterator.getCurrent();

        window.setTimeout(spellcheckSection, 200);
        //spellcheckSection();
    };

    /**
     * Resets spellcheck
     */
    Spellcheck.reset = function () {
        stopSpellcheck = true;
        iterator = undefined;
        paused = false;
        spRWAIsRunning = false;
        spellCheckSectionID = null;

        // reset hightlight
        edrSP.selectText(false);
    };

    Spellcheck.removeSelectText = function () {
        // reset hightlight
        edrSP.selectText(false);
    };

}(window.Spellcheck = window.Spellcheck || {}, jQuery));
