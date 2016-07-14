function formatDate(date, format) {
    var date = new Date(date);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    switch(format) {
        case 'yyyy-mm-dd' : return year+"-"+month+"-"+day;
        case 'dd-mm-yyyy' : return day+"-"+month+"-"+year;
        case 'mm-dd-yyyy' : return month+"-"+day+"-"+year;
    }
}

CKEDITOR.plugins.add('insertDate', {
    icons: 'calender-btn',
    init: function (editor) {
        editor.addCommand('insertDateCommand', new CKEDITOR.dialogCommand('insertDateDialog'));

        editor.ui.addButton('calender-btn', {
            label: "Insert Date",
            toolbar: 'insert',
            command: 'insertDateCommand'
        });

        CKEDITOR.dialog.add('insertDateDialog', function (editor) {
            return {
                title: 'Insert Date',
                minWidth: 120,
                minHeight: 100,
                contents: [
                    {
                        id: 'insertDate',
                        label: 'Insert Date',
                        elements: [
                            {
                                type: 'select',
                                id: 'dateFormat',
                                label: 'Date Format',
                                items: [['yyyy-mm-dd', 'yyyy-mm-dd'], ['dd-mm-yyyy', 'dd-mm-yyyy'], ['mm-dd-yyyy', 'mm-dd-yyyy']],
                                default: 'yyyy-mm-dd',
                                commit: function (data) {
                                    data.dateFormat = this.getValue();
                                }
							},
                            {
                                type: 'select',
                                id: 'dateType',
                                label: 'Available Dates',
                                items: [['Today\'s date', 'current'], ['Due date', 'due'], ['Site visit date', 'visit']],
                                default: 'current',
                                commit: function (data) {
                                    data.dateType = this.getValue();
                                }
							}
						]
					}
				],
                onOk: function () {
                    console.log(angular);
                    var dialog = this, data = {}, formatedDate = "";
                    this.commitContent(data);

                    switch (data.dateType) {
                    case 'current':
                        var today = new Date();
                        formatedDate = formatDate(today, data.dateFormat);
                        break;
                    case 'due':
                        //link.setStyle('text-decoration', 'underline');
                        break;
                    case 'visit':
                        //link.setStyle('font-style', 'italic');
                    }
                    var dataSpan = editor.document.createElement('span');
                    dataSpan.setHtml(formatedDate);
                    editor.insertElement(dataSpan);
                }
            };
        });
    }
});