CKEDITOR.plugins.add('bulletedListOptions', {
    icons: 'caret',
    html: '<span class="caret"></span>',
    init: function (editor) {
        editor.ui.addButton('caret', {
            label: "Bulleted List Options",
            toolbar: 'list',
            command: 'bulletedListStyle' //Triggered bulletedListStyle command of ckeditor.js and liststyle.js
        });
    }
});