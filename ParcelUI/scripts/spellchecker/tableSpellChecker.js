// Lets the user know we are processing the table
// if no table is passed, all tables are cleared of throbber
// if no processing state is passed, we clear the throbber
// @table      - optional - the table to mark as processing data
//             - defaults to all tables
// @processing - optional - numeric/binary state of processing
//             - defaults to 0
function setTableProgress(table, processing) {
    if (typeof processing === "undefined") {
        processing = 0;
    }
    if (typeof table === "undefined") {
        table = ".detail-table-section"
        processing = 0;
    } else if (typeof table === "number") {
        table = ".detail-table-section" + table;
    }

    if (processing) {
        jQuery(table).addClass('processing');
        var sectionNumber = jQuery(table).data('section-id');
        jQuery("a[href=#section" + sectionNumber + "]").parent().addClass('alert-info');
    } else {
        jQuery(table).removeClass('processing');
    }
}

/*
 * TABLE SPELLCHECK FUNCTIONS
 */

// Wrapper for spellchecking all tables
function spellCheckAllTables(currentTable, sectionId) {
    // eventually:
    // set progress here
    // mark Toc based on which tables are checked as they return

    var checkSections = spellCheckTablesBatch(sectionId, currentTable);
}

//Spellchecks all open detail tables in the current section
function spellCheckCurrentSection() {
    CurrentSectionAction('spellcheck');
}


// spellCheck a all textareas in detail-tables that are in scope in one batch method
// and processes the results
// @areas - optional - an array of areas within which to find textareas to spellcheck
//                     setting this limits the scope to only the areas passed.
//        - defaults to 'body' so all activated textareas in detail tables are checked
function spellCheckTablesBatch(sectionId, spellChecktbl) {

    var file = 'checkDocument', // The command to give to AtD to check spelling
        // config = tinymceConfigs[0], // An easier reference to our tinyMCE config
        url = '', // The batch spellchecker URL
        id = '', // Our ID for spellchecking
        chkBtnID = '',
        chkBtnIDs = jQuery(), // object for storing tableIDs
        AtDDivs = jQuery(); // object for storing proofreading divs

    var AtDtextareas = [], // create an empty jquery object to add text areas to later
        spellCheck = {}; // spellcheck object to send off to the serve


    spellCheck.id = id;
    spellCheck.sections = {};


    // Iterate through each area passed in, gathering the spellcheckable textareas
    //jQuery(areas).each2(function () {
    //if (jQuery(this).exists()) {
    //AtDtextareas = AtDtextareas.add($(this).find('.cke_editable'));


    // if no areas are passed - find all areas to spellcheck
    /* if (typeof areas === "undefined") {
         areas = [];
         areas.push("body");
     }*/

    // checks if a global var for click stats exists and increments it if it does...
    //if (typeof AtD_proofread_click_count != "undefined")
    //  AtD_proofread_click_count++;


    // first let's check to see if we are already in proofread mode
    jQuery(spellChecktbl).each2(function () {
        // does the area exist

        //  if (jQuery(this).exists()) {

        // if it does, check if there are any textareas
        // if there are not, assume we are in proofread mode.
        //  if (jQuery(this + ' .AtD-textarea-button').siblings('textarea, input:text').length === 0) {

        // get all of the divs
        //   AtDDivs = AtDDivs.add($(this).find('.cke_editable'));
        $(this).find('.cke_editable').each(function () {
            AtDtextareas.push(this);
        });

        $(this).find('input[type=text]').each(function () {
            AtDtextareas.push(this);
        });
        // AtDtextareas = AtDtextareas.add($(this).find('.cke_editable')).add($(this).find('input[type=text]'); //AtDtextareas = AtDtextareas.add($(this).find('input[type=text]'));
        //if (AtDDivs.length > 0) {
        // use the divs to convert back to edit mode
        // AtDDivs.each2(function () {
        // get the tableID
        // chkBtnID = jQuery(this).parents('form').data('table-id');

        // restore the text area back to edit mode
        // AtD.restoreTextArea(jQuery(this).attr('id'));

        // set the spell check button to check mode
        // jQuery("#spellButtonTop_" + chkBtnID).html("<b>Check Spelling</b>");
        //jQuery("#spellButtonBottom_" + chkBtnID).html("<b>Check Spelling</b>");
        // });

        //return;
        // }

        //}
        // }
    });

    // if (AtDDivs.length === 0) {
    // if we are not already in proofread mode


    // }
    // });


    // Add each text area found to the text we will spellcheck later
    $.each(AtDtextareas, function () {
        var container_id = jQuery(this).attr('id');
        var text = '';
        if (jQuery(this).attr('type') && jQuery(this).attr('type') == "text") {
            text = jQuery(this).val();
            AtD.checkTextArea(container_id, happyTableMethod, jQuery(this).siblings('span').attr('id'), '<span class="AtD_edit_button"></span>');
        } else {
            text = CKEDITOR.instances[container_id].getData();
            AtD._checkInlineCKEDitor(container_id, happyTableMethod, jQuery(this).siblings('span').attr('id'), '<span class="AtD_edit_button"></span>');
        }
        // Get the container and it's html to send to the server

        // XXX - This is sort of hacky and could probably use a little work
        // Have jQuery AtD check each area, passing an empty function for the call of what to do with the data - as we will handle it ourlseves
        // This does a whole bunch of black magic, including creating a text-editable div in the place of the textarea and saving the old textarea somewhere
        // Also restoring the textarea right before the form submits.

        //AtD.checkTextArea(container_id, jQuery(this).siblings('span').attr('id'), '<span class="AtD_edit_button"></span>');

        // Add the text to the spellcheck object under the sections array to send off to the server
        spellCheck.sections[container_id] = text;
    });
    // AtDtextareas.each(function () {
    // Get the ID for the textarea
    // var container_id = jQuery(this).attr('id');
    // sectionContainerID = jQuery(this).parents('.detail-table-section').data('section-id');
    // get the tableID
    //chkBtnIDs = chkBtnIDs.add(jQuery(this).parents('form').data('table-id'));

    // Let the user know we are processing this areas data
    //setTableProgress(sectionContainerID, 1);
    // var text = '';
    // Remove any previous AtD marking from the textarea
    //AtD.remove(container_id);

    // });

    // set the spell check button to edit mode
    chkBtnIDs.each2(function () {
        //  jQuery("#spellButtonTop_" + this).html("<b>Edit Text</b>");
        // jQuery("#spellButtonBottom_" + this).html("<b>Edit Text</b>");
    });


    var success = function (data) {
            // on with the task of processing and highlighting errors
            //  AtDtextareas.each2(function () {
            $.each(AtDtextareas, function () {
                var container_id = jQuery(this).attr('id'),
                    sectionContainerID = jQuery("#" + container_id).parents('.detail-table-section').data('section-id');

                AtD.container = container_id;

                if(data !== null){
                var xml = jQuery.parseXML(data[container_id]);

                // to reduce errors, only try processing if we have XML.
                if (xml) {
                    var count = AtD.processXML(container_id, xml);

                    AtD.counter = count;
                    AtD.count = count;
                }


                // Let the user know we are processing this areas data
                if (typeof sectionContainerID === "number") {
                    setTableProgress(sectionContainerID, 0);
                    //spellCheckHandler(sectionContainerID, count);
                } else {
                    setTableProgress(sectionContainerID, 0);
                }
                }
            });
        },
        error = function (XHR, status, error) {
            //var details = "data: <pre>" + data + "</pre><br /> request: <pre>" + request + "</pre><br />Object: <pre>" + someObject + "</pre>";
            var details = "XHR: <pre>" + XHR + "</pre><br /> status: <pre>" + status + "</pre><br />error: <pre>" + error + "</pre>";

            /* jQuery.pnotify({
                 title: 'Uh oh...',
                 text: 'There was a problem while spellchecking this area. Please refresh and try again.'
             });
             jQuery.pnotify({
                 type: 'info',
                 title: 'Technical Details',
                 text: '<p>If this issue continues please contact support@parcelplatform.com</p><p>Here are the technical details:</p><br />' + details
             });*/
        };

    var call = jQuery.ajax({
        // url: url + "/" + file,
        url: 'http://refactorbridgeqa.parcelplatform.com/ajax/AtD/batchProxy.php?url=/checkDocument',
        type: 'POST',
        dataType: 'json',
        data: spellCheck,
        success: success,
        error: error
    });
    //  }
}

function happyTableMethod(container_id, callback_f) {
    /* checks if a global var for click stats exists and increments it if it does... */
    if (typeof AtD_proofread_click_count != "undefined")
        AtD_proofread_click_count++;

    AtD.callback_f = callback_f; /* remember the callback for later */

    return true;
}


function clearErrorHtmlnode() {

    $(".hiddenSpellError").each(function () {
        AtD.core.removeParent(this);
    })
    $(".mceItemHidden").each(function () {
        AtD.core.removeParent(this);
    })


}
