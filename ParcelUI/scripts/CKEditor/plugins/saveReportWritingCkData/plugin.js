CKEDITOR.plugins.add('saveReportWritingCkData', {
    icons: 'savebtndisable',
    init: function (editor) {
        editor.ui.addButton('savebtndisable', {
            label: "Save",
            toolbar: 'document',
            command: 'saveReportWritingCkData' //Defined in \ParcelUI\app\modules\ReportAuthoring\directives\directive.js
        });
    }
});