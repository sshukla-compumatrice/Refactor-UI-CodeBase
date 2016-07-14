/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {


    //config.removeButtons = 'Image,Table,HorizontalRule';


    //below code is to have custom defined toolbar
    config.toolbarGroups = [{
            name: 'document',
            groups: ['mode', 'document', 'doctools']
        },
        {
            name: 'clipboard',
            groups: ['clipboard', 'undo']
        },
        {
            name: 'editing',
            groups: ['find', 'selection', 'spellchecker']
        },
        {
            name: 'insert'
        },
        {
            name: 'forms'
        },
        /*{
            name: 'links'
        },*/
        {
            name: 'lite'
        },
        {
            name: 'tools'
        },

        {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup']
        },
        {
            name: 'colors'
        },
        '/', // insert '/' for new line
        {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi']
        },

        {
            name: 'styles'
        }
        /*
                {
                    name: 'blackAll'
                }*/
    ];

    config.removeButtons = 'Save,Source,Print,Templates,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CreateDiv,Language,Flash,Smiley,Iframe,InsertPre,ShowBlocks,About,NewPage,Preview,SelectAll,Styles,BidiLtr,BidiRtl,Image,Table,HorizontalRule,PageBreak';


    var lite = config.lite = config.lite || {};
    lite.acceptRejectInReadOnly = false;
    lite.isTracking = false;
    //lite.tooltips = true;

    /*changed in ckeditor.js 
    1. defined : \ParcelUI\scripts\CKEditor\ckeditor.js in _makeTooltipTitle function.
    2. commented alert for tracking in toggleTracking: function line no.-23724*/

    config.extraPlugins = 'dialogui';
    config.extraPlugins = 'dialog';
    config.extraPlugins = 'colordialog';
    config.extraPlugins = 'wysiwygarea';
    config.extraPlugins = 'docprops';


    config.extraPlugins = 'lineutils';
    config.extraPlugins = 'clipboard';
    config.extraPlugins = 'widget';

    config.extraPlugins = 'filetools';
    config.extraPlugins = 'notification';
    config.extraPlugins = 'notificationaggregator';
    config.extraPlugins = 'uploadwidget';

    config.extraPlugins = 'uploadimage';
    config.uploadUrl = '/uploader/upload.php';
    config.imageUploadUrl = '/uploader/upload.php?type=Images';
    /*config.extraPlugins = 'uploadimage';    
    config.imageUploadUrl = 'http://sdk.ckeditor.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json';*/

    config.extraPlugins = 'popup';
    config.extraPlugins = 'filebrowser';
    config.filebrowserBrowseUrl = 'http://sdk.ckeditor.com/ckfinder/ckfinder.html';
    config.filebrowserImageBrowseUrl = 'app/modules/ReportAuthoring/directives/associatePhotos/sampleImgs/';
    config.filebrowserUploadUrl = 'http://sdk.ckeditor.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files';
    config.filebrowserImageUploadUrl = 'http://sdk.ckeditor.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';

    //Plugin to save Report Writing Data.

    config.removePlugins = 'elementspath';

    config.extraPlugins = 'saveReportWritingCkData,autogrow,bulletedListOptions,numberListOptions,sharedspace','textselection';

    config.pasteFromWordRemoveStyles = false;
    config.pasteFromWordRemoveFontStyles = false;

    //Enable keyboard shortcuts for subscript and superscript.
    config.keystrokes = [
        //Formating
         [CKEDITOR.CTRL + 188 /*COMMA*/ , 'subscript'],
        [CKEDITOR.CTRL + 190 /*PERIOD*/ , 'superscript']
    ];
    //config.autoGrow_onStartup = true;

    //config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';

    //    config.extraPlugins = 'placeholder';
    //    config.extraPlugins = 'dialog';
    //    config.extraPlugins = 'widget';
    //    config.extraPlugins = 'dialogui';
    //    config.extraPlugins = 'clipboard';
    //    config.extraPlugins = 'lineutils';



    //  config.removeButtons = 'Templates,NewPage,RemoveFormat,CreateDiv,BidiLtr,BidiRtl,Language,Flash,HorizontalRule,Iframe,TextColor,BGColor,ShowBlocks,Maximize,Strike,Subscript,Superscript,RemoveFormat'; //working
    // config.removePlugins ='forms,about';
    //    config.toolbar = [
    //        {
    //            name: 'basicstyles',
    //            groups: ['basicstyles', 'cleanup'],
    //            items: ['Bold', 'Italic', 'Underline']
    //        },
    //        {
    //            name: 'colors',
    //            groups: ['colors'],
    //            items: ['TextColor']
    //        },
    //        {
    //            name: 'clipboard',
    //            groups: ['clipboard', 'undo'],
    //            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
    //        },
    //        {
    //            name: 'paragraph',
    //            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
    //            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
    //        },
    //        {
    //            name: 'editing',
    //            groups: ['find', 'selection', 'spellchecker'],
    //            items: ['Scayt']
    //        },
    //        {
    //            name: 'links',
    //            items: ['Link', 'Anchor']
    //        },
    //        {
    //            name: 'insert',
    //            items: ['Image']
    //        },
    //        {
    //            name: 'tools',
    //            items: ['Maximize']
    //        },
    //        {
    //            name: 'document',
    //            groups: ['mode', 'document', 'doctools'],
    //            items: ['Source']
    //        },
    //        {
    //            name: 'others',
    //            items: ['-']
    //        },
    //        {
    //            name: 'styles',
    //            items: ['Styles', 'Format']
    //        }
    //];

    //http://cdn.ckeditor.com/4.4.3/full/samples/plugins/toolbar/toolbar.html
    //http://ckeditor.com/sites/default/files/uploads/Complete%20List%20of%20Toolbar%20Items%20for%20CKEditor.pdf

};
