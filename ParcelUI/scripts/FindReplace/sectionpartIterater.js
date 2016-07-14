/*
 * This file defines two classes that are used together:
 * 
 * 1. SectionPart - An editable piece of a report section.  
 *                  A TinyMCE rich text box is a SectionPart.
 *                  A textarea in a detail is also a SectionPart.
 *                  
 * 2. FindReplaceSectionPartIterator - A component that can be used to iterate over
 *                          all of the SectionParts in a simplified report.
 *                          
 * The purpose of these classes is to provide a generalized way of accessing
 * report content sequentially, to support full-report Find/Replace or Spellcheck.
 * 
 * Sample usage:
 * var it = new FindReplaceSectionPartIterator();
 * var sectionPart = it.getCurrent();
 * sectionPart.getContent();
 * sectionPart.setContent("new content");
 * sectionPart.scrollTo();
 * it.moveNext();
 */


function FindReplaceSectionPart(id, type, editorName, sectionID) {
    this.id = id;
    this.type = type;
    this.editorName = editorName;
    this.sectionID = sectionID;
}



/*
 * Given a DOM element, returns an array of SectionPart objects.
 */
FindReplaceSectionPart.getSectionPartArray = function (sectionID, element) {
    element = jQuery(element);

    // narrative rich text areas
    if (element.hasClass("cke_contents")) {

        var id = element.attr("id");
        var part = new FindReplaceSectionPart(
            id + "_parent",
            "CKEDITOR",
            id,
            sectionID);
        return [part];
    } else if (element.hasClass("table-responsive")) {

        var tableCells = element.find(".cke_editable_inline");
        var parts = [];
        for (var i = 0; i < tableCells.length; ++i) {

            // skip text boxes whose id starts with 'numRows'
            if (tableCells[i].id.indexOf("numRows") == 0) continue;

            parts.push(new FindReplaceSectionPart(
                tableCells[i].id,
                "INLINECKEDITOR",
                tableCells[i].id,
                sectionID));
        }
        return parts;
    }

    return [];
}


/*
 * Get the text content of this SectionPart.
 */
FindReplaceSectionPart.prototype.getContent = function () {
    if (this.type == "TEXT") {
        return document.getElementById(this.id).value;
    } else if (this.type == "CKEDITOR") {
        return CKEDITOR.instances[this.editorName].getData(); //tinyMCE.get(this.editorName).getContent();
    } else if (this.type == "INLINECKEDITOR") {
        return CKEDITOR.instances[this.editorName].getData(); //tinyMCE.get(this.editorName).getContent();
    }
};


/*
 * Set the text content for this SectionPart.
 */
FindReplaceSectionPart.prototype.setContent = function (newContent) {

    if (this.type == "TEXT") {
        document.getElementById(this.id).value = newContent;
    } else if (this.type == "CKEDITOR") {
        return CKEDITOR.instances[this.editorName].setData(newContent); //tinyMCE.get(this.editorName).setContent(newContent);
    } else if (this.type == "INLINECKEDITOR") {
        return CKEDITOR.instances[this.editorName].setData(newContent); //tinyMCE.get(this.editorName).setContent(newContent);
    }
};


/*
 * Scrolls the writer panel to the location of this SectionPart.
 */
FindReplaceSectionPart.prototype.scrollTo = function (offset,currentContentID) {
    offset = offset || 0;
    //genericScrollTo(jQuery("#rightContent"), jQuery("#cke_editor3"), jQuery("#rightContent"), offset);
    
    genericScrollTo(jQuery("#rightContent"), jQuery("#cke_editor"+currentContentID), jQuery("#rightContent"), offset);
    
};


function genericScrollTo(containerObj, scrollToObj, thingToScroll, offset){
		offset = offset || 0;
		/*thingToScroll.animate({
		   scrollTop: scrollToObj.offset().top - containerObj.offset().top + containerObj.scrollTop() + offset 
		});*/
    
    thingToScroll.animate({
		   scrollTop: scrollToObj.offset().top - containerObj.offset().top + containerObj.scrollTop() + offset
		});
	}

/*
 * FindReplaceSectionPartIterator exposes the various SectionParts of a report in sequential order.
 */
function FindReplaceSectionPartIterator() {
    this.sections = jQuery(".divsection");
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
FindReplaceSectionPartIterator.prototype.loadSectionParts = function () {   
    var sectionDivID = this.sections[this.currentSection].getAttribute("id");
    var sectionID = parseInt(sectionDivID.replace("divsection_", ""));
    // var editorCssClass = 'cke_editor_editor' + sectionID;
    //$('#spellcheckSectionInfo').html($('.col-md-8 .pull-left .text-primary').text());

    scrollToSection(sectionID);

    //  var elements = angular.element(this.sections[this.currentSection]);
    var elements = angular.element(this.sections[this.currentSection]).find(".cke_contents, .table-responsive");

    var parts = [];
    for (var i = 0, length = elements.length; i < length; ++i) {
        parts = parts.concat(FindReplaceSectionPart.getSectionPartArray(sectionID, elements[i]));
    }
    this.sectionParts = parts;
    this.currentPart = 0;
    
};

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
FindReplaceSectionPartIterator.prototype.reset = function () {
    this.currentSection = 0;
    this.loadSectionParts();

    if (null == this.getCurrent()) {
        this.moveNext();
    }
};


/*
 * Move the iterator to the next section part (if it exists). 
 */
FindReplaceSectionPartIterator.prototype.moveNext = function () {

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
FindReplaceSectionPartIterator.prototype.getCurrent = function () {
    return this.sectionParts[this.currentPart];
};


/*
 * Move the iterator to the first part of the given sectionID.
 */
FindReplaceSectionPartIterator.prototype.goToSectionID = function (sectionID) {
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
