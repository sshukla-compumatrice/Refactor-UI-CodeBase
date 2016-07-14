CKEDITOR.plugins.add('numberListOptions', {
    icons: 'caret1',
    init: function (editor) {
        editor.ui.addButton('caret1', {
            label: "Number List Options",
            toolbar: 'list,10',
            command: 'numberedListStyle' // Triggered numberedListStyle command of ckeditor.js and liststyle.js
        });
    }
});