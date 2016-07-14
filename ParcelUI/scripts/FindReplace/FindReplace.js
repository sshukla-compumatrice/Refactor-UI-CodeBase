window.sessionStorage.setItem('isFindreplaceRunning', false);
(function( FindReplace, $, undefined ) {
	
	var nextTextOffset = 0;
	var prevTextOffset = 0;
    var iterator;

    var find; // the word in the 'find' box
    var regex; // the regex used for the find operation

    var activeFind; // true if we found something that can be replaced
    var paused; // true if find/replace has been paused.
    var sectionMode; // 'ACTIVE' OR 'ALL'

    var replaceAll = false; // true if user is running a 'replace all'.
    var replaceAllCount = 0; // count of items replaced in current 'replace all' action

    var saveIt; // used when removing richtext highlighting

    var tinymceHighlightElement = "span";
    var tinymceHighlightClass = "edr-find-replace";

    var sectionIDs = [];
    
    FindReplace.findNext = function(find) {    	        
        window.sessionStorage.setItem('isFindreplaceRunning', true);
    	paused = false;
    	regex = getRegex();    	
    	
    	if (find.length == 0) {
    		alert("Please enter the text to find.");
    		return false;
    	}    	
    	
    	if (! iterator) {
    		iterator = new SectionPartIterator(sectionIDs);
    	}
    	
    	var sectionPart = iterator.getCurrent(); 
    	if (sectionPart != null) {            
    		FindReplace.removeHighlighting (sectionPart.editorName);
    	}
    	
    	
    	while (sectionPart != null) {
    		
    		// in 'ACTIVE' mode, restrict the search to the active section
            //!sectionIDs.indexOf(sectionPart.sectionID)
            //if (sectionMode == "ACTIVE" && section != sectionPart.sectionID) {
            if (sectionMode == "ACTIVE" && sectionIDs.indexOf(section) == -1) {
                sectionPart = iterator.moveNext();
                continue;
            }

            // if the find is successful, exit this method
            if (findNextImpl(sectionPart)) {
                activeFind = true;
                updateButtonState();
                return true;
            }

            // otherwise, move to the next part of the report
            sectionPart = iterator.moveNext();
        }

        activeFind = false;
        updateButtonState();
        displayNoMatches();
        return false;
    }



    function findNextImpl(sectionPart) {

        if (sectionPart.type == "CKEDITOR") {

            var splitarr = sectionPart.editorName.split('_');
            var editorname = splitarr[1];

            //var container = CKEDITOR.instances[editorname].document.getBody().$;
            var container = document.getElementById(sectionPart.id);
            if (typeof container === "undefined") {
                return false;
            }

            // run the rich-text find
            var finder = findAndReplaceDOMText(container, {
                find: regex,
                textOffset: nextTextOffset,
                wrap: tinymceHighlightElement,
                wrapCss: tinymceHighlightClass
            });

            // if there are no matches, move to the next section and try again
            if (finder.savedMatches.length == 0) {
                nextTextOffset = 0;
                prevTextOffset = 0;
                return false;
            }

            // store our current location in the current TinyMCE editor
            prevTextOffset = nextTextOffset;
            nextTextOffset = finder.savedMatches[0].endIndex;

            // unless we are in 'Replace All' mode, scroll to the highlighted result
            if (!replaceAll) {

                section = sectionPart.sectionID;
                CKEDITOR.instances[sectionPart.editorName].setData(CKEDITOR.instances[sectionPart.editorName].getData());
                var contentID = sectionPart.editorName;
                sectionPart.scrollTo (0,$('.edr-find-replace'),contentID);
                //jQuery('#' + sectionPart.id)[0].scrollIntoView();
              
	        } 
            jQuery("#FRSectionNumberId").text(window.sessionStorage.getItem('sectionNumber'));
            return true;
        }
        
        if (sectionPart.type == "INLINECKEDITOR") {            
            
            var container = document.getElementById(sectionPart.id);
            if (typeof container === "undefined") {
                return false;
            }

            // run the rich-text find
            var finder = findAndReplaceDOMText(container, {
                find: regex,
                textOffset: nextTextOffset,
                wrap: tinymceHighlightElement,
                wrapCss: tinymceHighlightClass
            });

            // if there are no matches, move to the next section and try again
            if (finder.savedMatches.length == 0) {
                nextTextOffset = 0;
                prevTextOffset = 0;
                return false;
            }

            // store our current location in the current TinyMCE editor
            prevTextOffset = nextTextOffset;
            nextTextOffset = finder.savedMatches[0].endIndex;

            // unless we are in 'Replace All' mode, scroll to the highlighted result
            if (!replaceAll) {
                section = sectionPart.sectionID;
                
                var html ='';
                html = $("#section_" + sectionPart.sectionID).find("#" + sectionPart.editorName).html();
                $("#section_" + sectionPart.sectionID).find("#" + sectionPart.editorName).html(html);
                
                //CKEDITOR.instances[sectionPart.editorName] = $('#'+sectionPart.editorName).html();
                
                CKEDITOR.instances[sectionPart.editorName] = $('#'+sectionPart.editorName).html();    
                
                var element = document.getElementById(sectionPart.id);
                //element.focus();                              
                document.getElementById(sectionPart.id).scrollIntoView();
	        } 
            jQuery("#FRSectionNumberId").text(window.sessionStorage.getItem('sectionNumber'));
            return true;
        }
/*
        else if (sectionPart.type == "TEXT") {
    		// ensure that the textbox is visible
    		// this will be 'false' if table is in 'view' mode.
    		if (! isTextElementVisible (sectionPart.id)) {
        		nextTextOffset = 0;
        		prevTextOffset = 0;
        		return false;    			
    		}
    		
    		// perform the plaintext find using String.search()
    		var string = sectionPart.getContent();
    		var index = string.substring(nextTextOffset).search(regex);
    		if (index == -1) {
        		nextTextOffset = 0;
        		prevTextOffset = 0;
        		return false;
        	}
    		
    		// store our current location in the current text box
    		prevTextOffset = nextTextOffset + index;
    		nextTextOffset = prevTextOffset + 1;
    		
    		// select the 'find' text in the text box
    		var element = document.getElementById(sectionPart.id);
    		if ('selectionStart' in element) {
    			element.selectionStart = prevTextOffset;
    			element.selectionEnd = prevTextOffset + find.length;
    			element.focus();
    		}
    		
    		// unless we are in 'Replace All' mode, 
    		// update the global 'section' variable
    		// and scroll to the highlighted result
    		if (! replaceAll) {
    			section = sectionPart.sectionID;
    			sectionPart.scrollTo();
    		}
    		return true;
    	}*/
    };



    FindReplace.replace = function () {
        if (!activeFind) return; // ensure that something was actually found
        var sectionPart = iterator.getCurrent();

        if (sectionPart.type == "CKEDITOR") {

            //var container = jQuery('#' + sectionPart.editorName).contents().contents().contents().contents().find("body")[0];                                   
            var container = document.getElementById(sectionPart.id);

    		if (typeof container === "undefined") {
    			return false;
    		}
 
            var replaceText = jQuery('#replace_with').val();
            
    		var finder = findAndReplaceDOMText (container, {
				find: regex,
				textOffset: prevTextOffset,
				wrap: tinymceHighlightElement,
				wrapCss: tinymceHighlightClass,
				replace: replaceText
			});
    		
    		FindReplace.removeHighlighting (sectionPart.editorName);
    		activeFind = false;
    		

            var splitarr = sectionPart.editorName.split('_');
            var editorname = splitarr[1];


            CKEDITOR.instances[sectionPart.editorName].setData(CKEDITOR.instances[sectionPart.editorName].getData());
    
            // adjust the next text offset to account for changes in text length.
            // this is necessary when the length of the 'find' string is different from the length of the 'replace' string.
            // if the 'replace' string is shorter, we need to move nextTextOffset to the left
            nextTextOffset += replaceText.length - find.length;
            if (nextTextOffset < 0) {
                nextTextOffset = 0;
            }
                		
 		} 
        else if(sectionPart.type == "INLINECKEDITOR"){
            
            var container = document.getElementById(sectionPart.id);

    		if (typeof container === "undefined") {
    			return false;
    		}
 
            var replaceText = jQuery('#replace_with').val();
            
    		var finder = findAndReplaceDOMText (container, {
				find: regex,
				textOffset: prevTextOffset,
				wrap: tinymceHighlightElement,
				wrapCss: tinymceHighlightClass,
				replace: replaceText
			});
    		
    		FindReplace.removeHighlighting (sectionPart.editorName);
    		activeFind = false;
    		

            var splitarr = sectionPart.editorName.split('_');
            var editorname = splitarr[1];


            var html ='';
                html = $("#section_" + sectionPart.sectionID).find("#" + sectionPart.editorName).html();
                $("#section_" + sectionPart.sectionID).find("#" + sectionPart.editorName).html(html);
            
            //CKEDITOR.instances[sectionPart.editorName] = $('#'+sectionPart.editorName).html();
            
            //CKEDITOR.instances[sectionPart.editorName].setData(CKEDITOR.instances[sectionPart.editorName].getData());
            
            //$('#'+sectionPart.editorName).html($('#'+sectionPart.editorName).html());
            
            
            
            var element = document.getElementById(sectionPart.id);
            //element.focus(); 
            document.getElementById(sectionPart.id).scrollIntoView();
                                        
            nextTextOffset += replaceText.length - find.length;
            if (nextTextOffset < 0) {
                nextTextOffset = 0;
            }
        }
    	
    	/*else if (sectionPart.type == "TEXT") {
    		var string = sectionPart.getContent();
    		var newstring = 
    			string.substring(0,prevTextOffset) +
    			jQuery('#replace_with').val() +
    			string.substring(prevTextOffset + find.length);
    		sectionPart.setContent(newstring);
    		activeFind = false;    		
        	updateIsSectionTableDirty(sectionPart.sectionID);        	        	
		}*/
    	
    	return true;

    };



    FindReplace.replaceAndFindNext = function (findWhat) {
        FindReplace.replace();
        FindReplace.findNext(findWhat);
    };



    FindReplace.replaceAll = function (find) {

        if (jQuery('#replace_with').val().trim() == "") {
            if (!confirm("You have chosen to 'Replace All' without entering any replacement text.\n\nAre you sure you want to do this?")) {
                //jQuery('#btn_replace_all').html("Replace All");
                return;
            }
        }

        if (typeof find === 'undefined') {
            alert("Please enter the text to find.");
            return false;
        }

        FindReplace.reset();
        replaceAllCount = 0;
        replaceAll = true;

        // if we are already looking at a 'find next' result,
        // perform that replacement before moving to the next result.
        if (activeFind) {
            if (FindReplace.replace()) {
                replaceAllCount += 1;
            }
        }

        // loop through all remaining 'find next' results
        // and replace each one.
        while (FindReplace.findNext(find)) {
            if (FindReplace.replace()) {
                replaceAllCount += 1;
            }
        }

        replaceAll = false;
    };



    FindReplace.pause = function () {
        if (paused) return; // if we are already paused, do nothing
        if (typeof iterator == "undefined") return; // if a find has never been run, do nothing

        paused = true;
        activeFind = false;
        updateButtonState();

        if (iterator == null) return;

        var sectionPart = iterator.getCurrent();
        if (sectionPart != null) {
            FindReplace.removeHighlighting(iterator.getCurrent().editorName);
        }
    };



    FindReplace.resume = function () {
        paused = false;
        activeFind = false;
        updateButtonState();
        jQuery('.mceExternalToolbar').removeAttr('style');
    };



    FindReplace.displayFindAndReplacePanelActiveSection = function (paramSection, sectionIds) {
        //editAllTables();
        //sectionIDs.length = 0;
        sectionIDs = sectionIds;
        section = paramSection;
        displayFindAndReplacePanel('ACTIVE', sectionIDs);
    };

    FindReplace.displayFindAndReplacePanelAllSections = function (sectionIds) {       
        sectionIDs = sectionIds;
        displayFindAndReplacePanel('ALL', sectionIDs);

    };



    function displayFindAndReplacePanel(mode, sectionIDs) {
        if (typeof iterator !== "undefined") iterator.reset();
        sectionMode = mode;
        activeFind = false;
        paused = false;       
        updateButtonState();
    }



    function updateButtonState() {
        if (paused) {
            jQuery('#find-replace-save').hide();
            jQuery('#find-replace-close').hide();
            jQuery('#find-and-replace-paused').show();

            jQuery('#find_what').attr('disabled', 'disabled');
            jQuery('#replace_with').attr('disabled', 'disabled');

            jQuery('#btn_find_next').prop('disabled', true).attr('disabled', 'disabled');
            jQuery('#btn_replace').prop('disabled', true).attr('disabled', 'disabled');
            jQuery('#btn_replace_and_find_next').prop('disabled', true).attr('disabled', 'disabled');
            jQuery('#btn_replace_all').prop('disabled', true).attr('disabled', 'disabled');

            jQuery('#match_case').attr('disabled', 'disabled');
            jQuery('#find_whole_words_only').attr('disabled', 'disabled');
        } else if (activeFind) {
            jQuery('#find-replace-save').show();
            jQuery('#find-replace-close').show();
            jQuery('#find-and-replace-paused').hide();

            jQuery('#find_what').removeAttr('disabled');
            jQuery('#replace_with').removeAttr('disabled');

            jQuery('#btn_find_next').prop('disabled', false).removeAttr('disabled');
            jQuery('#btn_replace').prop('disabled', false).removeAttr('disabled');
            jQuery('#btn_replace_and_find_next').prop('disabled', false).removeAttr('disabled');
            jQuery('#btn_replace_all').prop('disabled', false).removeAttr('disabled');

            jQuery('#match_case').removeAttr('disabled');
            jQuery('#find_whole_words_only').removeAttr('disabled');
            jQuery('.mceExternalToolbar').removeAttr('style'); // gray out the tinymce toolbar
        } else {
            jQuery('#find-replace-save').show();
            jQuery('#find-replace-close').show();
            jQuery('#find-and-replace-paused').hide();

            jQuery('#find_what').removeAttr('disabled');
            jQuery('#replace_with').removeAttr('disabled');

            jQuery('#btn_find_next').prop('disabled', false).removeAttr('disabled');
            jQuery('#btn_replace').prop('disabled', true).attr('disabled', 'disabled');
            jQuery('#btn_replace_and_find_next').prop('disabled', true).attr('disabled', 'disabled');
            jQuery('#btn_replace_all').prop('disabled', false).removeAttr('disabled');

            jQuery('#match_case').removeAttr('disabled');
            jQuery('#find_whole_words_only').removeAttr('disabled');
            jQuery('.mceExternalToolbar').removeAttr('style'); // gray out the tinymce toolbar
        }
    }



    function updateSectionNumber() {
        jQuery('#contentlibrary-tab .section-number')
            .text(getCurrentSectionNumber())
            .attr('title', secText);
    }



    function scrollToHighlightedWord(sectionPart) {
       
        var splitarr = sectionPart.editorName.split('_');
        var editorname = 'editor' + splitarr[1];
        CKEDITOR.instances[editorname].focus();
       
        if (sectionPart.editorName === '') {
            jQuery('#' + sectionPart.id)[0].scrollIntoView();
            jQuery('#' + sectionPart.id)[0].focus();
        } else {
            if (sectionPart.type == "CKEDITOR") {
                var splitarr = sectionPart.editorName.split('_');
                var editorname = 'editor' + splitarr[1];
                CKEDITOR.instances[editorname].focus();
            } else if (sectionPart.type == "INLINECKEDITOR") {

                CKEDITOR.instances[sectionPart.editorName].focus();
            }
        }
    }



    function isTextElementVisible(id) {
        return jQuery("#" + id).is(':visible');
    }



    function getRegex() {
        var modifiers, pattern;

        find = jQuery('#find_what').val();

        if (jQuery('#match_case').is(':checked')) {
            modifiers = '';
        } else {
            modifiers = 'i';
        }

        if (jQuery('#find_whole_words_only').is(':checked')) {
            pattern = '\\b' + find + '\\b';
        } else {
            pattern = find;
        }
        return RegExp(pattern, modifiers);
    }



    function displayNoMatches() {

        if (replaceAll) {
            jQuery('#btn_replace_all').html("Replace All");
            if (replaceAllCount == 0) {
                alert("No matches were found, and so nothing was replaced.");
            } else {
                var text = (replaceAllCount == 1) ? " instance was " : " instances were ";
                alert("" + replaceAllCount + text + "replaced.");
            }
            iterator.reset();
        } else {
            var searchStart = (sectionMode == "ACTIVE") ? 'section' : 'report';
            var response = confirm('Find and replace is complete.\n\nWould you like to start over from the beginning of the ' + searchStart + '?');
            if (response) {
                window.sessionStorage.getItem('sectionNumber', window.sessionStorage.getItem('initsectionNumber'));
				jQuery("#FRSectionNumberId").text(window.sessionStorage.getItem('initsectionNumber'));
                
				if (sectionMode == "ACTIVE") {
					iterator.goToSectionID (sectionIDs[0]);                    
				} else {
					iterator.reset();
				}
				iterator.goToSectionID (sectionIDs[0]);                
				
			} 
    	}
    }



    function recursiveCleaner(htmlString) {
        try {
            var htmlJqueryObject = jQuery(htmlString);
            if (htmlJqueryObject.hasClass(tinymceHighlightClass)) {
                recursiveCleaner(htmlJqueryObject.html());
            } else {
                saveIt = htmlString;
            }
        } catch (ex) {

        }
    };


    FindReplace.removeHighlightingFromCurrent = function () {
        if (iterator) {
            var sectionPart = iterator.getCurrent();
            if (sectionPart) {
                FindReplace.removeHighlighting(sectionPart.editorName);
            }
        }
    }


    FindReplace.removeHighlighting = function (editorName) {
        if (editorName !== "") {
            var sectionPart = iterator.getCurrent();
            if (sectionPart) {
                var selector;
                 if (sectionPart.type == "CKEDITOR") {
                selector = $(document.getElementById(sectionPart.editorName)).contents().find('.' + tinymceHighlightClass);
                     saveIt = selector.html();
                     recursiveCleaner(saveIt);
                     selector.after(saveIt);
                     selector.remove();
                 }else if(sectionPart.type == "INLINECKEDITOR"){
                      
                     
                     selector = $(document.getElementById(sectionPart.editorName)).find('.' + tinymceHighlightClass); 
                     
                     //selector = $(document.getElementById(sectionPart.editorName)).contents().find('.' + tinymceHighlightClass); //find("span[style^=background-color]");
                     saveIt = selector.html();
                     recursiveCleaner(saveIt);
                     selector.after(saveIt);
                     selector.remove();
                 }                                
            }
        }
    };

    FindReplace.replaceAllVariables = function (sectionIds, find, replaceWith) {
        sectionIDs = sectionIds;
        if (typeof iterator !== "undefined") {
            iterator = undefined;
            activeFind = false;
            paused = false;
            nextTextOffset = 0;
            prevTextOffset = 0;
        }
        sectionMode = 'ALL';
        activeFind = false;
        paused = false;
        FindReplace.reset();
        replaceAllCount = 0;
        replaceAll = true;

        if (activeFind) {
            if (FindReplace.replace()) {
                replaceAllCount += 1;
            }
        }

        while (FindReplace.findVariableNext(find)) {
            if (FindReplace.replaceVariable(replaceWith)) {
                replaceAllCount += 1;
            }
        }

        replaceAll = false;
    }

    FindReplace.findVariableNext = function (find) {

        paused = false;
        regex = getvariableRegex(find);

        if (!iterator) {
            iterator = new SectionPartIterator(sectionIDs);
        }

        var sectionPart = iterator.getCurrent();

        while (sectionPart != null) {

            if (sectionMode == "ACTIVE" && sectionIDs.indexOf(section) == -1) {
                sectionPart = iterator.moveNext();
                continue;
            }

            // if the find is successful, exit this method
            if (findNextImpl(sectionPart)) {
                activeFind = true;
                return true;
            }

            // otherwise, move to the next part of the report
            sectionPart = iterator.moveNext();
        }

        activeFind = false;
        return false;
    }

    FindReplace.replaceVariable = function (replaceWith) {
        if (!activeFind) return; // ensure that something was actually found
        var sectionPart = iterator.getCurrent();

        if (sectionPart.type == "CKEDITOR") {

            var container = jQuery('#' + sectionPart.editorName).contents().contents().contents().contents().find("body")[0];
            if (typeof container === "undefined") {
                return false;
            }

            var finder = findAndReplaceDOMText(container, {
                find: regex,
                textOffset: prevTextOffset,
                wrap: tinymceHighlightElement,
                wrapCss: tinymceHighlightClass,
                replace: replaceWith
            });

            FindReplace.removeHighlighting(sectionPart.editorName);
            activeFind = false;

            var splitarr = sectionPart.editorName.split('_');
            var editorname = splitarr[1];

            CKEDITOR.instances[editorname].setData(CKEDITOR.instances[editorname].getData());

        }


        return true;
    };

    function getvariableRegex(find) {
        var modifiers, pattern;

        modifiers = 'i';
        pattern = find;

        return RegExp(pattern, modifiers);
    }


    FindReplace.reset = function () {

        FindReplace.removeHighlightingFromCurrent();

        iterator = undefined;
        activeFind = false;
        paused = false;
        nextTextOffset = 0;
        prevTextOffset = 0;
    }


    FindReplace.close = function () {
        FindReplace.reset();

        jQuery(".find-replace-block").show();
        jQuery(".content-body-findreplace").show();
        jQuery(".find-replace-in-section-block").hide();

    };

    FindReplace.save = function () {
        saveAllTablesAndSummaries();
        activeFind = false;
        updateButtonState();
    };


    // for debugging
    FindReplace.getIterator = function () {
        return iterator;
    }


    /**
     * Tables will be made editable whenever FindReplace begins.
     * The current 'save' process closes tables for editing.
     */
    function isTableReopenNeeded() {
        for (var key in sectionEditMode) {
            if (typeof sectionEditMode[key] === "function") continue;

            if (sectionEditMode[key] == false) {
                return true;
            }
        }
        return false;
    }       


}(window.FindReplace = window.FindReplace || {}, jQuery));

/* Event handlers */
/*
jQuery("body").on('click', '#btn_find_next', FindReplace.findNext);

jQuery("body").on('click', '#btn_replace', FindReplace.replace);

jQuery("body").on('click', '#btn_replace_and_find_next', FindReplace.replaceAndFindNext);

jQuery("body").on('click', '#btn_replace_all', function() {
	jQuery('#btn_replace_all').html("Running...").get(0).offsetHeight;
	//setTimeout(FindReplace.replaceAll, 200);
});

jQuery("body").on('click', '.find-replace-in-section', FindReplace.displayFindAndReplacePanelActiveSection);

jQuery("body").on('click', '.find-replace-in-full-report', FindReplace.displayFindAndReplacePanelAllSections);

jQuery("body").on('click', '.find-and-replace-paused', FindReplace.resume);

jQuery("body").on('click', '#find-replace-save', FindReplace.save);

jQuery("body").on('click', '#find-replace-close', FindReplace.close);

jQuery(".panel-tabs a").on('click', FindReplace.pause);
*/
