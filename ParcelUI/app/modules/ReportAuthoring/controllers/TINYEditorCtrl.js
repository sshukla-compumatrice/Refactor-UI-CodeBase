angular.module('ReportAuthoring').controller('TINYEditorCtrl', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
    var self = this;
    $scope.tinyDefText1 = "The purpose of the Phase I Environmental Site Assessment (ESA) was to evaluate the current and historical conditions of the Subject Property in an effort to identify recognized environmental conditions in connection with the Subject Property.";
    $scope.tinyDefText2 = "The purpose of the Phase I Environmental Site Assessment (ESA) was to evaluate the current and historical conditions of the Subject Property in an effort to identify recognized environmental conditions in connection with the Subject Property.";
    $scope.tinyDefText3 = "The purpose of this Phase I Environmental Site Assessment (ESA) was to identify existing or potential Recognized Environmental Conditions (as defined by ASTM Standard E 1527-05) in connection with the Subject Property. {ConsultantName} understands that the findings of this study will be used to evaluate a pending financial transaction in connection with the Subject Property.The Phase I ESA is being conducted as part of environmental due diligence prior to property transfer or refinancing.";
    $scope.tinyDefText4= "Write your comments here.......";

    this.resp = [{
        "Sections": [{
            "html": "<div><h2><strong><span>{{section1Title}}</span></strong></h2></div><br><tag-with-dashes></tag-with-dashes><br><textarea data-ui-tinymce id='tinymce1' ng-controller='TINYEditorCtrl' ng-model='tinyDefText1'></textarea><hr><div><button  id='createHost' class='btn btn-mini btn-success' data-ng-click='val();createTable()'><b>Create Table</b></button></div><br> <dynamic-table ng-show='show==true'></dynamic-table>",
            "contentValues": {
                "section1Title": "1.0 EDR Order Status",
                "choice": {
                    "Y": "Consulting",
                    "N": "Application Development and Support",
                    "NS": "Testing"
                },
                "table": {
                    "title": "At A Glance Description:",
                    "r11": "Item",
                    "r12": "Condition",
                    "r21": "General Condition",
                    "r22": "Good"
                },
                "tagData": "Please refer to Default Language for EDR Order Status."
            }

        },
     {
         "html": "<div><h2><strong><span>{{section1Title}}</span></strong></h2></div><br><tag-with-dashes></tag-with-dashes><br><ul> <li>{{Y}}</li> <li>{{N}}</li> <li>{{NS}}</li></ul><br><div><button ng-controller='TINYEditorCtrl' id='createHost' class='btn btn-mini btn-success' data-ng-click='uploadSpreadsheet()'><b>Upload Spreadsheet</b></button></div><br> <textarea data-ui-tinymce id='tinymce2' ng-controller='TINYEditorCtrl' ng-model='tinyDefText2'></textarea><br><h3>Attached Files:</h3>     <div><table class='table table-condensed  table-bordered table-hover top-margin'><thead><tr><th>Action</th><th>File Name</th><th>File Size</th></tr></thead><tbody><tr ><td><a style='cursor: pointer;' >Remove</a></td><td>file 1</td><td>10 Bytes</td></tr></tbody></table></div>",
         "contentValues": {
             "section1Title": "2.0 Environmental Report Summary",
             "choice": {
                 "Y": "EDR Environmental Consulting",
                 "N": "EDR Environmental Application Development and Support",
                 "NS": "EDR Environmental Testing"
             },
             "table": {
                 "title": "At A Glance Description:",
                 "r11": "Item",
                 "r12": "Condition",
                 "r21": "General Condition",
                 "r22": "Good"
             },
             "tagData": "Please refer to Default Language for Environmental Report Summary."
         }

     },
      {
          "html": "<div><h2><strong><span>{{section1Title}}</span></strong></h2></div><br><tag-with-dashes></tag-with-dashes><br><textarea data-ui-tinymce id='tinymce3' ng-controller='TINYEditorCtrl' ng-model='tinyDefText3'></textarea><br><p> Please refer to Default Language for narrative options for this section.</p><br><textarea data-ui-tinymce id='tinymce4' ng-controller='TINYEditorCtrl' ng-model='tinyDefText4'></textarea>",
          "contentValues": {
              "section1Title": "3.0 Reason For Performing Phase I ESA",
              "choice": {
                  "Y": "EDR Environmental Consulting",
                  "N": "EDR Environmental Application Development and Support",
                  "NS": "EDR Environmental Testing"
              },
              "table": {
                  "title": "At A Glance Description:",
                  "r11": "Item",
                  "r12": "Condition",
                  "r21": "General Condition",
                  "r22": "Good"
              },
              "tagData": "Please refer to Default Language for Reason For Performing Phase I ESA."
          }

      }
        ]
    }]

    this.obj = {
        selectedSection: ''
    };
    $scope.obj = this.obj;
    this.sectionClicked = function (section) {
        this.obj.selectedSection = section.contentValues.section1Title;

    }

    $scope.uploadSpreadsheet = function () {
        var modalInstance = $modal.open({
            templateUrl: 'UploadSpreadsheet.html',
            scope: $scope,
            controller: UploadSpreadsheetController,
            size: 1

        })
    };

    var UploadSpreadsheetController = function ($scope, $modalInstance) {



        $scope.Cancel = function () {

            $modalInstance.close()
        }

    }

}])