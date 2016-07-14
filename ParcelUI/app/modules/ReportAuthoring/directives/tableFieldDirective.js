angular.module('ReportAuthoring').directive('tablefieldDirective', ['$http', '$compile', '$filter', function ($http, $compile, $filter) {

    var getTemplateUrl = function (field, data, editmode, parentindex, index, tablescope) {
        var type = field.type;
        var template = '';

        switch (type) {
            case 'text':
                template = '<p class="form-control-static" ng-show="!editmode">{{data}}</p><input id="txt_{{parentindex}}_{{index}}" class="form-control" type="text" ng-show="editmode" ng-init="data = data || field.defaultValue"  ng-model="data">';
                break;
            case 'textarea':

                // template = '<p class="form-control-static" ng-show="!editmode">{{data}}</p><input id="txt_{{parentindex}}_{{index}}" class="form-control" type="text" ng-show="editmode" ng-init="data = data || field.defaultValue"  ng-model="data">';
                template = '<div ck-inline tablescope="tablescope" id="ck_inline_editor_{{sectionguid}}_{{parentindex}}_{{index}}" name="ck_inline_editor{{index}}" editmode="editmode" class="form-control-static inlineCkeditor" ng-model="data" ng-bind-html="trustAsHtml(data)"></div>';
                break;
            case 'checkbox':
                template = '<div class="col-xs-12 col-lg-12 col-md-12"><div ng-show="!editmode"><span ng-show="{{data}}" class="form-control-static">{{data}}</span></div><div data-ng-repeat="item infield.options"><input type="checkbox" ng-show="editmode" ng-checked="data(item.value)>-1" /><span ng-show="editmode">{{item.name}}</span></div></div>';
                break;
            case 'radio':
                template = '<fieldset id="radio"><div ng-show="!editmode"><span ng-show="data" class="form-control-static">{{data}}</span></div><div data-ng-repeat="item in field.options | orderBy: "orderIndex""><input type="radio" ng-show="editmode" value="{{item.value}}" name="radio_{{index}}" ng-model="data" ng-init="data=data||field.defaultValue"/><span ng-show="editmode">{{item.name}}</span></div></fieldset>';
                break;
            case 'email':
                template = '<p class="form-control-static" ng-show="!editmode">{{data}}</p><input type="email" placeholder="Email" ng-show="editmode"  ng-init="data = data || field.defaultValue"  value="{{data}}" ng-model="data"/>';
                break;
            case 'dropdown':
                template = '<p class="form-control-static" ng-show="!editmode">{{data.name}}</p><select id="grouping" ng-show="editmode" class="form-control" ng-model="data" ng-options="item.name for item in field.options" ng-model="data"><option value="">-- Select--</option></select>';
                break;
            case 'date':
                template = '<div><span class="form-control-static" ng-show="!editmode">{{data | date:"dd-MM-yyyy"}}</span><div ng-show="editmode" class=" input-group"><input type="text" class="form-control" datetime-picker="dd-MM-yyyy" ng-model="data" is-open="status.opened" enable-time="false" datepicker-options="dateOptions" date-disabled="disabled(date, mode)" close-on-date-selection="true" datepicker-append-to-body="true" name="date" ng-click="open($event)"><span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="open($event)"><i class="fa fa-calendar"></i></button></span></div></div>';
                break;
            default:
                template = '<p class="form-control-static" ng-show="!editmode">{{data}}</p><input class="form-control" type="text" ng-show="editmode" ng-init="data = data || field.defaultValue"  ng-model="data">';
        }
        return template;
    }

    var linker = function (scope, element, attr, controllers) {

        // GET template content from path
        scope.attr = attr;
        scope.element = element;

        if (scope.field.type == "dropdown") {
            if (scope.data && scope.data.value != undefined) {
                var selectedGroupTypeArr = $filter('filter')(scope.field.options, {
                    value: scope.data.value
                }, true);
                scope.data = selectedGroupTypeArr[0];
            }
        }


        scope.open = {};

        // Disable weekend selection
        scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };
        scope.dateOptions = {
            showWeeks: false,
            startingDay: 1
        };

        scope.timeOptions = {
            readonlyInput: true,
            showMeridian: false
        };

        scope.open = function ($event) {
            scope.status.opened = true;
        };

        scope.status = {
            opened: false
        };

        var template = getTemplateUrl(scope.field, scope.data, scope.editmode, scope.parentindex, scope.index, scope.tablescope);
        if (template != undefined) {
            //  $http.get(templateUrl).success(function (data) {
            element.html(template);
            scope.element = element.contents();
            $compile(element.contents())(scope);

            // });
        }

    }

    return {

        restrict: 'A',
        require: '?^form',

        scope: {
            field: '=',
            data: '=',
            editmode: '=',
            index: '=',
            parentindex: '=',
            sectionguid: '=',
            tablescope: '='
        },
        controller: function ($scope, $element, $http, $sce) {
            $scope.trustAsHtml = function (string) {
                if (string)
                    return $sce.trustAsHtml(string);
                return;
            }
        },
        link: linker
    };
}]);



angular.module('ReportAuthoring').directive('ckInline', ['$sce', '$timeout', '$rootScope', 'getScopeService', function ($sce, $timeout, $rootScope, getScopeService) {
    return {
        scope: {
            editmode: "=editmode",
            value: "=ngModel",
            tablescope: "=tablescope"
        },
        link: function (scope, elm, attr, ngModel) {

            var ck_inline;
            var cfg = {
                title: false,
                sharedSpaces: {
                    top: 'tableCkEditorTopToolbar'
                }
            };

            function applyInlineCKEditor() {


                CKEDITOR.disableAutoInline = false;
                ck_inline = CKEDITOR.inline(attr.id, cfg);

                if (!attr.ngModel)
                    return;

                ck_inline.on('instanceReady', function () {
                    if (window.sessionStorage.getItem('reportStatusAbbreviation') == 'FIN') {
                        ck_inline.setReadOnly(true);
                        elm.attr("contenteditable", "false");
                    } else {
                        angular.element("#ckeditorTopToolbar").show();
                        angular.element("#tableCkEditorTopToolbar").hide();
                        elm.attr("contenteditable", "true");
                        ck_inline.setReadOnly(false);
                        angular.element("#ckeditorTopToolbar").hide();
                        angular.element("#tableCkEditorTopToolbar").show();
                    }
                    ck_inline.setData(elm.html());
                });

                function updateHtml() {

                    scope.$apply(function () {
                        if (ck_inline && ck_inline.getData()) {
                            scope.value = ck_inline.getData();
                        }
                    });
                }

                ck_inline.on('blur', updateHtml);
                ck_inline.on('dataReady', updateHtml);
                ck_inline.on('focus', function () {

                    if (window.sessionStorage.getItem('isTableSpellcheckRunning') == "true") {
                        $('#' + this.id + '_top').hide()
                    } else {
                        $('#' + this.id + '_top').show()
                    }
                });

                ck_inline.addCommand("saveReportWritingCkData", {
                    exec: function (edt) {
                        scope.$apply(function () {
                            scope.value = ck_inline.getData();
                            scope.tablescope.saveChanges();
                        });
                    }
                });

                ck_inline.on('change', function (event) {

                    var isSpellcheckRunning = window.sessionStorage.getItem('isSpellcheckRunning');
                    if (isSpellcheckRunning == "false") {
                        if (ck_inline.checkDirty() && ck_inline._.data !== ck_inline.getData()) {
                            var _p = ck_inline.plugins.saveReportWritingCkData.path + "icons";
                            $('#cke_' + attr.id).find('.cke_button__savebtndisable_icon').css('background-position', '0 0').css('background-image', 'url("' + _p + '/savebtn.png")').css('background-repeat', 'no-repeat');
                        }
                    } else {
                        updateHtml();
                    }
                });
            }

            scope.$watch('editmode', function (newValue, oldValue) {
                if (newValue) {

                    if (window.sessionStorage.getItem('reportStatusAbbreviation') != 'FIN') {
                        $("#" + attr.id).addClass('border-1');
                        $("#" + attr.id).attr('contenteditable', true);

                    } else {
                        $("#" + attr.id).attr('contenteditable', false);
                        $("#" + attr.id).removeClass('border-1');
                        $("#" + attr.id).removeClass('cke_show_borders');
                        if (ck_inline && ck_inline.name && CKEDITOR.instances[ck_inline.name]) {
                            angular.element("#ckeditorTopToolbar").show();
                            angular.element("#tableCkEditorTopToolbar").hide();
                            // CKEDITOR.instances[ck_inline.name].destroy();
                        }
                    }
                } else {

                    clearErrorHtmlnode();
                    scope.value = $("#" + attr.id).html();
                    $("#" + attr.id).attr('contenteditable', false);
                    $("#" + attr.id).removeClass('border-1');
                    $("#" + attr.id).removeClass('cke_show_borders');

                    if (ck_inline && ck_inline.getData()) {
                        clearErrorHtmlnode();
                        scope.value = ck_inline.getData();

                    }
                    if (ck_inline && ck_inline.name && CKEDITOR.instances[ck_inline.name]) {
                        angular.element("#ckeditorTopToolbar").show();
                        angular.element("#tableCkEditorTopToolbar").hide();
                        CKEDITOR.instances[ck_inline.name].destroy();
                    }
                }
            });

            elm.bind('mouseover', function () {
                if (scope.editmode && !(ck_inline && ck_inline.name && CKEDITOR.instances[ck_inline.name])) {
                    applyInlineCKEditor();
                }

            });

            /* elm.bind('focus', function () {
                 if (window.sessionStorage.getItem('reportStatusAbbreviation') != 'FIN') {
                     if (!CKEDITOR.instances[attr.id])
                         applyInlineCKEditor();
                 } else {
                     if (ck_inline && ck_inline.name && CKEDITOR.instances[ck_inline.name]) {
                         CKEDITOR.instances[ck_inline.name].destroy();
                     }
                 }
             });*/

            /*elm.bind('blur', function () {
                //console.log(attr.id + " blur.");
                if (ck_inline && ck_inline.getData()) {
                    scope.value = ck_inline.getData();
                }
                if (ck_inline && ck_inline.name && CKEDITOR.instances[ck_inline.name]) {
                    CKEDITOR.instances[ck_inline.name].destroy();
                }
            });*/
        }
    };
}]);


angular.module('ReportAuthoring').directive("tabularDataFormChange", function ($parse) {
    return {
        require: "form",
        link: function (scope, element, attrs) {
            var cb = $parse(attrs.formOnChange);
            element.on("change", function () {
                cb(scope);
            });
        }
    }
});
