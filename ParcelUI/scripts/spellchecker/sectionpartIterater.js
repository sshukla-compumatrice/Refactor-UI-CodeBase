/*
 * This file defines two classes that are used together:
 * 
 * 1. SectionPart - An editable piece of a report section.  
 *                  A TinyMCE rich text box is a SectionPart.
 *                  A textarea in a detail is also a SectionPart.
 *                  
 * 2. SectionPartIterator - A component that can be used to iterate over
 *                          all of the SectionParts in a simplified report.
 *                          
 * The purpose of these classes is to provide a generalized way of accessing
 * report content sequentially, to support full-report Find/Replace or Spellcheck.
 * 
 * Sample usage:
 * var it = new SectionPartIterator();
 * var sectionPart = it.getCurrent();
 * sectionPart.getContent();
 * sectionPart.setContent("new content");
 * sectionPart.scrollTo();
 * it.moveNext();
 */

var sectionNameArray = [];

function SectionPart(id, type, editorName, sectionID) {
    this.id = id;
    this.type = type;
    this.editorName = editorName;
    this.sectionID = sectionID;
}



/*
 * Given a DOM element, returns an array of SectionPart objects.
 */
SectionPart.getSectionPartArray = function (sectionID, element) {
    element = jQuery(element);

    // narrative rich text areas
    if (element.hasClass("cke_editable_inline")) {
        var id = null;
        id = element.attr('id');
        if (!id) {
            id = $.trim(element.attr("title").split(',')[1]);
        }
        var part = new SectionPart(
            id,
            "CKEDITOR",
            id,
            sectionID);
        return [part];
    } else if (element.hasClass("table-responsive")) {

        var tableCells = element.find("td");
        var parts = [];
        for (var i = 0; i < tableCells.length; ++i) {


            var cellEditorId = $(tableCells[i]).find('.inlineCkeditor').attr('id');
            if (cellEditorId) {
                parts.push(new SectionPart(
                    cellEditorId,
                    "INLINECKEDITOR",
                    cellEditorId,
                    sectionID));
            }
        }
        return parts;
    } else if ($(element).attr('type') == 'text') {

        var id = element.attr("id");

        if (id) {
            if (id.indexOf('date') > -1) {
                return [];
            }
            var part = new SectionPart(
                id,
                "TEXT",
                id,
                sectionID);
            return [part];
        }

    }
    return [];
}


/*
 * Get the text content of this SectionPart.
 */
SectionPart.prototype.getContent = function () {
    if (this.type == "TEXT") {
        document.getElementById(this.id).focus();
        return document.getElementById(this.id).value;
    } else if (this.type == "CKEDITOR") {
        return CKEDITOR.instances[this.editorName].getData(); //tinyMCE.get(this.editorName).getContent();
    } else if (this.type == "INLINECKEDITOR") {
        return $("#section_" + this.sectionID).find("#" + sectionPart.editorName).html();
        // return CKEDITOR.instances[this.editorName].getData(); //tinyMCE.get(this.editorName).getContent();
    }
};


/*
 * Set the text content for this SectionPart.
 */
SectionPart.prototype.setContent = function (newContent) {

    if (this.type == "TEXT") {
        return document.getElementById(this.id).value = newContent;
    } else if (this.type == "CKEDITOR") {
        return CKEDITOR.instances[this.editorName].setData(newContent);
    } else if (this.type == "INLINECKEDITOR") {
        return $("#section_" + this.sectionID).find("#" + sectionPart.editorName).html(newContent);

        //return CKEDITOR.instances[this.editorName].setData(newContent);
    }
};


/*
 * Scrolls the writer panel to the location of this SectionPart.
 */


SectionPart.prototype.scrollTo = function (offset, scrollToObj, currentContentID) {

    offset = offset || 0;
    genericScrollTo(jQuery("#rightContent"), scrollToObj, jQuery("#rightContent"), offset);

};



function genericScrollTo(containerObj, scrollToObj, thingToScroll, offset) {
    offset = offset || 0;

    thingToScroll.animate({
        scrollTop: scrollToObj.offset().top - containerObj.offset().top + containerObj.scrollTop() - 100
    });
}

/*
 * SectionPartIterator exposes the various SectionParts of a report in sequential order.
 */
function SectionPartIterator(sectionIds, replaceAll) {
    this.sections = [];

    sectionNameArray = JSON.parse(window.sessionStorage.getItem('sectionNameArray'));

    for (var sectionIndex = 0; sectionIds.length > sectionIndex; sectionIndex++) {
        this.sections.push($("#section_" + sectionIds[sectionIndex]));
    }
    // this.sections = jQuery(".divsection");
    this.replaceAll = replaceAll;
    this.currentSection = 0;
    this.loadSectionParts();

    if (this.getCurrent() == null) {
        this.moveNext();
    }
};


/*
 * Load the SectionParts contained in the current section.
 * This function looks for specific CSS classes to find instances
 * of editable content.
 * For example, ".simplified-display-section" indicates a TinyMCE narrative.
 * ".detail-table-section" indicates a detail table.
 */
SectionPartIterator.prototype.loadSectionParts = function () {
    // var sectionDivID = this.sections[this.currentSection].getAttribute("id");
    var sectionDivID = $(this.sections[this.currentSection]).attr('id');
    var sectionID = parseInt(sectionDivID.replace("section_", ""));
    // var editorCssClass = 'cke_editor_editor' + sectionID;
    //$('#spellcheckSectionInfo').html($('.col-md-8 .pull-left .text-primary').text());

    if (!this.replaceAll) {
        scrollToSection(sectionID, false);

        setSpellCheckSectionName(sectionID);
    }
    var elements = null;
    //  var elements = angular.element(this.sections[this.currentSection]);

    if (window.sessionStorage.getItem('isSpellcheckRunning') == "true") {
        if ($("#chkNarrativeOnly").is(':checked')) {
            elements = angular.element(this.sections[this.currentSection]).find(".boxCK .cke_editable_inline, input[type=text]");
        } else {
            elements = angular.element(this.sections[this.currentSection]).find(".boxCK .cke_editable_inline, .table-responsive, input[type=text]");
        }
    } else {
        elements = angular.element(this.sections[this.currentSection]).find(".boxCK .cke_editable_inline, .table-responsive, input[type=text]");
    }

    var parts = [];
    for (var i = 0, length = elements.length; i < length; ++i) {
        parts = parts.concat(SectionPart.getSectionPartArray(sectionID, elements[i]));
    }

    this.sectionParts = parts;
    this.currentPart = 0;
};

function setSpellCheckSectionName(sectionID) {
    for (var nameIndex = 0; sectionNameArray.length > nameIndex; nameIndex++) {
        if (sectionNameArray[nameIndex].key == sectionID) {
            var sectionName = '';
            if (sectionNameArray[nameIndex].sectionName && sectionNameArray[nameIndex].sectionName.length > 50) {
                sectionName = sectionNameArray[nameIndex].sectionName.substring(0, 50) + '...';
            } else {
                sectionName = sectionNameArray[nameIndex].sectionName;
            }
            $("#topSectionNameId").html(sectionNameArray[nameIndex].sectionNumber + '  ' + sectionName);

            var spellchecksectionName = '';
            if (sectionNameArray[nameIndex].sectionName && sectionNameArray[nameIndex].sectionName.length > 35) {
                spellchecksectionName = sectionNameArray[nameIndex].sectionName.substring(0, 35) + '...';
            } else {
                spellchecksectionName = sectionNameArray[nameIndex].sectionName;
            }
            $("#spellcheckSectionInfo").html(sectionNameArray[nameIndex].sectionNumber + '  ' + spellchecksectionName);

            $('#spellcheckSectionInfo').prop('title', sectionNameArray[nameIndex].sectionName);
            break;
        }
    }
}


function scrollToSection(sectionId, isDirectionalNavigation) {
    var name = 'section_' + sectionId;
    var element = document.getElementById(name);
    var angularEl = angular.element(element);
    if (element) {
        if (isDirectionalNavigation)
            element.scrollIntoViewIfNeeded();
        else
            element.scrollIntoView();
    }
    //$window.scrollBy(0, -70);
    var leftContentName = 'tocSection_' + sectionId;
    var leftContentElement = document.getElementById(leftContentName);
    var leftContentAngularEl = angular.element(leftContentElement);
    if (leftContentElement) {
        if (isDirectionalNavigation)
            leftContentElement.scrollIntoViewIfNeeded();
        else
            leftContentElement.scrollIntoView();
    }

}
/*
 * Move the iterator to the first element.
 */
SectionPartIterator.prototype.reset = function () {
    this.currentSection = 0;
    this.loadSectionParts();

    if (null == this.getCurrent()) {
        this.moveNext();
    }
};


/*
 * Move the iterator to the next section part (if it exists). 
 */
SectionPartIterator.prototype.moveNext = function () {

    // check for further parts in the current section
    if (this.currentPart < this.sectionParts.length - 1) {
        ++this.currentPart;
        return this.getCurrent();
    }

    // if no parts remain in the current section,
    // increment the current section until we find one that has parts.
    else {
        while (this.currentSection < this.sections.length - 1) {
            ++this.currentSection;
            this.loadSectionParts();

            if (this.sectionParts.length > 0) {
                return this.getCurrent();
            }
        }
    }
    return null;
};


/*
 * Return the SectionPart at which the iterator is currently pointed.
 */
SectionPartIterator.prototype.getCurrent = function () {
    return this.sectionParts[this.currentPart];
};


/*
 * Move the iterator to the first part of the given sectionID.
 */
SectionPartIterator.prototype.goToSectionID = function (sectionID) {
    this.reset();
    var sectionPart = this.getCurrent();
    while (sectionPart != null) {
        if (sectionPart.sectionID == sectionID) {
            return sectionPart;
        }
        sectionPart = this.moveNext();
    }
    return null;
}


SectionPartIterator.prototype.goToDirectSectionID = function (sectionID) {

    //this.reset();
    var sectionIndex;
    for (var index = 0; this.sections.length > index; index++) {
        if ($(this.sections[index]).attr('id').split('_')[1] == sectionID) {
            sectionIndex = index;
            break;
        }
    }

    this.currentSection = sectionIndex;
    this.loadSectionParts();
    if (this.sectionParts.length > 0) {
        return this.getCurrent();
    }
    return null;
}
