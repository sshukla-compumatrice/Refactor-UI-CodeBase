CKEDITOR.plugins.add('blackAll', {
    requires : ['richcombo'], //, 'styles' ],
    /*icons: 'savebtn',
    init: function (editor) {
        editor.ui.addButton('savebtn', {
            label: "Save",
            toolbar: 'document',
            command: 'saveReportWritingCkData' //Defined in \ParcelUI\app\modules\ReportAuthoring\directives\directive.js
        });
    }*/
    /*onLoad: function() {
        CKEDITOR.addCss( 'width: 500px',
                        
            'p:first-child {' +
                'border-top: solid 2px green' +
            '}' +
            'p:last-child {' +
                'border-bottom: solid 2px green' +
            '}'
        );
    },*/
    
    init : function(editor)
   {
      var config = editor.config,
         lang = editor.lang.format;

      // Gets the list of tags from the settings.
      var tags = []; //new Array();
      //this.add('value', 'drop_text', 'drop_label');
      tags[0]=["[1]", "These Summaries", "Summaries in this section"];
      //tags[1]=["[allSummaries]", "email", "email"];
      tags[1]=["[2]", "All Summaries", "Summaries in any section that has been opened at least once"];
      // Create style objects for all defined styles.

      editor.ui.addRichCombo( 'blackAll',
         {
            label : "Black All",
            title :"Black All",
            voiceLabel : "Black All",
            className : 'cke_format',
            multiSelect : false,
            toolbar: 'blackAll',
            command: 'blackAllSection',
            
            panel :
            {
               css : [ config.editorCss],
               voiceLabel : lang.panelVoiceLabel
            },

            init : function()
            {
               this.startGroup( "Black All" );
               //this.add('value', 'drop_text', 'drop_label');
               for (var this_tag in tags){
                  this.add(tags[this_tag][0], tags[this_tag][1], tags[this_tag][2]);
               }
            },

            onClick : function( value )
            {
                //var element = CKEDITOR.config.format_tags;
                var styles = new CKEDITOR.style({
                element     : 'span',
                styles      : { 'color' : '#000000' }//,
                //overrides   : [ { element : 'color'} ] //, attributes : { 'color' : 'black' }
                });
                //editor.execCommand('selectAll');
                
                var range = editor.createRange();
                range.selectNodeContents( editor.editable() );
                styles.applyToRange(range, editor);
                //styles.apply( editor.document );
                if(value==1){
                  //black-all current summary
                }
                else{
                    //black-all all summaries
                }
                
               editor.focus();
               editor.fire('blackAllSection');//Defined in \ParcelUI\app\modules\ReportAuthoring\directives\directive.js
               //editor.insertHtml(value);
               //editor.fire('blackAllSection');
            }
         });
   }
    
    
});