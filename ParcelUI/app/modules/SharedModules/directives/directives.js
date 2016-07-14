angular.module('ParcelUI').directive('formInputValidation', ['$parse', '$compile', function ($parse, $compile) {
    return {
        restrict: 'A',
        require: '^form',
        terminal: true,
        priority: 1000,
        compile: function (tElem, tAttrs) {
            return {
                pre: function (scope, iElem, iAttrs, formCtrl) {
                    // validation expression to assigned to ng-class directive
                    var validationExpStr = "";

                    // case where expression is provided
                    if (!!iAttrs.formInputValidation) {

                        validationExpStr = iAttrs.formInputValidation;
                    } else {
                        // default case
                        // expression comprised of all required fields
                        var requiredFields = iElem[0].querySelectorAll('[required]');
                        if (requiredFields && requiredFields.length) {
                            var formname = formCtrl.$name;
                            var first = angular.element(requiredFields[0]);
                            var firstname = first.attr('name');
                            validationExpStr = (formname + "." + firstname + ".$invalid");

                            for (var i = 1; i < requiredFields.length; i++) {
                                var mandatory = angular.element(requiredFields[i]);
                                var elname = mandatory.attr('name');
                                validationExpStr = validationExpStr + " || " + (formname + "." + elname + ".$invalid");
                            }
                        }
                    }

                    if (!validationExpStr) return;

                    iElem.removeAttr('form-input-validation');
                    iElem.attr("ng-class", "{'has-error': " + validationExpStr + "}");
                    $compile(iElem)(scope);
                },
                post: function (scope, iElem, iAttrs, formCtrl) {}
            }
        }
    }
}]);


angular.module('ParcelUI').directive('emailValidator', ['ParcelUI.Resources', '$compile', function (resources, $compile) {
    return {
        restrict: 'A',
        replace: false,
        priority: 1000,
        terminal: true,
        compile: function (tElem, tAttrs) {

            tElem.removeAttr('email-validator');
            tElem.attr("ng-pattern", resources.validationExpression.email);
            return {
                pre: function (scope, iElem, iAttrs, controller) {},
                post: function (scope, iElem, iAttrs, controller) {

                    $compile(iElem)(scope);
                }
            }
        }
    }

}]);



angular.module('ParcelUI').directive("emailPattern", ['ParcelUI.Resources', '$compile', function (resources, $compile) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, el, attrs, ngModel) {
            var validator, patternValidator,
                pattern = resources.validationExpression.email,
                required = false;



            ngModel.$formatters.push(patternValidator);
            ngModel.$parsers.push(patternValidator);

            attrs.$observe("emailPattern", function (newval) {
                required = newval;
                patternValidator(ngModel.$viewValue);
            });

            function validate(regexp, value) {

                if (value == null || value === "" || !required || regexp.test(value)) {
                    ngModel.$setValidity('pattern', true);
                    return value;
                } else {
                    ngModel.$setValidity('pattern', false);
                    return;
                }
            }
        }
    };
}]);


angular.module('ParcelUI').directive('userAction', ['$location', 'LoggingAPI', function ($location, LoggingAPI) {


    return {
        restrict: "A",
        link: function (scope, el, attrs) {
            el.bind('click', function (event) {
                var actionMessage = "";
                // var controlId = "";
                var module = $location.path().split('/')[1];
                var pageName = $location.path().split('/')[2];
                if (attrs.userAction == 'xeditable save') {

                    // controlId = pageName;
                    actionMessage = (pageName != "" || pageName != undefined || pageName != null) ? pageName : "" + " saved";
                } else {

                    //  controlId = attrs.id;
                    actionMessage = attrs.userAction;
                }


                var moduleVal = "module: - " + module;
                var pageVal = (pageName != "" && pageName != undefined && pageName != null) ? "/ " + pageName : "";
                var actionVal = "action performed: - " + actionMessage;

                var logMsg = moduleVal + " " + pageVal + " , " + actionVal;

                //  console.log("11111:- " + logMsg);
                var loggedDate = new Date();
                var postData = {
                    "logModuleUsed": "EDR.Logging.LogHelper.vb",
                    "authenticatedEntity": "2013213",
                    "authenticatedType": "Account",
                    "applicationInfo": {
                        "applicationType": "WebApp",
                        "name": "Parcel",
                        "version": "1.5.1.17",
                        "language": "Angular JS",
                        "languageVersion": "4.5"
                    },
                    "events": [

                        {
                            "eventType": "Log",
                            "startTS": loggedDate,
                            "elapsedInMS": 1250,
                            "eventDetail": {
                                "eventGUID": "A0F5E294-B497-4C16-8FA4-526C9413530F",
                                "severityLevel": "OK",
                                "logSource": "IIS",
                                "logSourceType": "Log File",
                                "sourcePath": "",
                                "logData": logMsg,
                                "additionalInfo": [{
                                    "key": "IIS Version",
                                    "value": "7.5"
                                }]
                            }
                        }
                    ]
                };
                LoggingAPI.postLogs(postData).then(function (result) {
                    //  console.log("success: " + JSON.stringify(result));
                }, function (error) {
                    // console.log("error");
                });

            })
        }
    };


}]);


angular.module('ParcelUI').directive('siteSearch', ['$state', '$window', '$timeout', function ($state, $window, $timeout) {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                $state.go('ReportAuthoring.Write', {
                    SiteId: element.val()
                });
            }
        });
    };
}]);


angular.module('ParcelUI').directive('fieldValidation', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            var html = '<span id="fieldValidationMsg" class="help-block error-text"></span>';
            var elInput = el.find('input').first();
            var elSelectOptions = el.find('select').first();
            var elMultiSelect = el.find('multiselect').first();
            var eltextArea = el.find('textarea').first();
            var invalidPasswordMsg = "The new password does not meet the minimum password requirements. Passwords must be at least 8 characters long, with at least one letter, one Upper case letter, one numeric character, one non-alphanumeric character and cannot contain your username.";



            elInput.bind('blur', function (event) {

                if (formCtrl[elInput.attr('name')].$valid) {
                    el.removeClass('has-error');
                    removeSpan(el);
                } else {
                    if (formCtrl[elInput.attr('name')].$viewValue == "" || formCtrl[elInput.attr('name')].$viewValue == undefined) {
                        el.append(html);

                        el.find('span#fieldValidationMsg').first().html(el.attr('field-validation') + ' cannot be blank.');
                        el.find('span#fieldValidationMsg').show();

                    } else if (elInput.attr('type') == 'email' && !formCtrl[elInput.attr('name')].$valid) {
                        el.append(html);
                        el.find('span').first().html('Invalid email address.');
                    } else if (elInput.attr('type') == 'password' && !formCtrl[elInput.attr('name')].$valid) {
                        el.append(html);
                        el.find('span').first().html(invalidPasswordMsg);
                    } else if (elInput.attr('custom') == 'alphaOnly' && !formCtrl[elInput.attr('name')].$valid) {
                        el.append(html);
                        el.find('span').first().html(el.attr('field-validation') + ' can only contains alphabets.');
                    } else if (elInput.attr('custom') == 'numbersOnly' && !formCtrl[elInput.attr('name')].$valid) {
                        el.append(html);
                        el.find('span').first().html(el.attr('field-validation') + ' can only contains Numbers.');
                    } else if (elInput.attr('custom') == 'numbersAndDot' && !formCtrl[elInput.attr('name')].$valid) {
                        el.append(html);
                        el.find('span').first().html(el.attr('field-validation') + ' is not a valid Cost.');

                    } else if (elInput.attr('custom') == 'phoneNumber' && !formCtrl[elInput.attr('name')].$valid && formCtrl[elInput.attr('name')].$viewValue.length != 14) {
                        el.append(html);
                        el.find('span').first().html(el.attr('field-validation') + ' is not a valid number.');

                    } else if (elInput.attr('custom') == 'multipleEmails' && !formCtrl[elInput.attr('name')].$valid) {

                        el.append(html);
                        el.find('span').first().html(el.attr('field-validation') + 'one or more email is not valid');
                    } else {}
                    el.addClass('has-error');
                }
            });

            eltextArea.bind('blur', function (event) {
                if (formCtrl[eltextArea.attr('name')].$valid) {
                    el.removeClass('has-error');
                    removeSpan(el);
                } else {
                    if (formCtrl[eltextArea.attr('name')].$viewValue == "" || formCtrl[eltextArea.attr('name')].$viewValue == undefined) {
                        el.append(html);
                        el.find('span#fieldValidationMsg').first().html(el.attr('field-validation') + ' cannot be blank.');
                    } else {

                    }
                    el.addClass('has-error');
                }
            });

            elInput.bind('keypress change focus', function (event) {
                if (formCtrl[elInput.attr('name')].$valid)
                    el.removeClass('has-error');
                else
                if ((elInput.attr('type') == 'email' || elInput.attr('type') == 'password') && !formCtrl[elInput.attr('name')].$valid)
                    el.removeClass('has-error');
                removeSpan(el);
            });

            elSelectOptions.bind('blur', function (event) {
                if (formCtrl[elSelectOptions.attr('name')].$valid)
                    el.removeClass('has-error');
                else {
                    if (formCtrl[elSelectOptions.attr('name')].$viewValue == "" || formCtrl[elSelectOptions.attr('name')].$viewValue == undefined) {
                        el.append(html);
                        el.find('span').first().html(el.attr('field-validation') + ' must be selected.');
                    }
                    el.addClass('has-error');
                }
            });

            elSelectOptions.bind('focus change', function (event) {
                if (formCtrl[elSelectOptions.attr('name')].$valid)
                    el.removeClass('has-error');
                else
                if (!formCtrl[elSelectOptions.attr('name')].$valid)
                    el.removeClass('has-error');
                removeSpan(el);
            });

            elMultiSelect.bind('blur', function (event) {
                if (formCtrl[elMultiSelect.attr('name')].$valid) {
                    el.removeClass('has-error');
                    el.find('button').first().css('border-color', '');
                } else {
                    if (formCtrl[elMultiSelect.attr('name')].$viewValue == "" || formCtrl[elMultiSelect.attr('name')].$viewValue == undefined) {
                        el.append(html);
                        el.find('span[id=fieldValidationMsg]').first().html(el.attr('field-validation') + ' must be selected.');
                        //el.find('button').first().attr('ng-class',"{'error': !valid()}");
                        el.find('button').first().css('border-color', '#8e1d14');
                    }
                    el.addClass('has-error');
                }
            });

            /*elMultiSelect.bind('focus change', function (event) {
             if (formCtrl[elMultiSelect.attr('name')].$valid)
             el.removeClass('has-error');
             else
             if (!formCtrl[elMultiSelect.attr('name')].$valid)
             el.removeClass('has-error');
             removeSpan(el);
             });*/
            scope.$watchCollection(elMultiSelect.attr('ng-model'), function (val) {
                if (val && val.length) {
                    el.removeClass('has-error');
                    removeSpan(el);
                }
                /*else {
                 el.addClass('has-error');
                 el.append(html);
                 el.find('span[id=fieldValidationMsg]').first().html(el.attr('field-validation') + ' must be selected.');
                 }*/

            });

            function removeSpan(el) {
                if (el.find('span#fieldValidationMsg').length > 0)
                    el.find('span#fieldValidationMsg').remove();
            }
        }
    }
});

angular.module('ParcelUI').directive('formatZip', [
    function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl, ngModel) {
                var elInput = elem.find('input');
                elem.add(elInput).on('keyup', function () {
                    var origVal = elem.val().replace(/[^\w\s]/gi, '');
                    var CountryCode = elem.attr('data-CountryCode');
                    switch (CountryCode) {
                        case 'US':
                            if (origVal.length >= 10) {
                                formatedZip = origVal.substring(0, 5) + "-" + origVal.substring(5);
                                $('#' + elInput.context.id).val(formatedZip);
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        };
    }
]);

angular.module("ParcelUI").directive('confirmOnExit', ['$modal', function ($modal) {

    return {
        require: '^form',
        link: function ($scope, elem, attrs, formCtrl) {
                var formObj = formCtrl;
                window.onbeforeunload = PageRefresh;

                function PageRefresh() {
                    angular.forEach(formObj, function (value, key) {
                        if (typeof value === 'object' && value.hasOwnProperty('$modelValue') && (value.$dirty && value.$viewValue != "" && value.$viewValue != null)) {
                            var message = 'If you reload this page you are going to lose all unsaved changes, are you sure you want to reload?';
                            if (typeof event == 'undefined') {
                                event = window.event;
                            }
                            if (event) {
                                event.returnValue = message;
                            }
                            return message;

                        }
                    });
                }

                $scope.$on('$locationChangeStart', function (event, next, current) {
                    var breakLoop = false;
                    var myForm = formCtrl;
           
                    angular.forEach(myForm, function (value, key) {
                        if (typeof value === 'object' && value.hasOwnProperty('$modelValue') && (value.$dirty && value.$viewValue != "" && value.$viewValue != null)) {
                            window.onbeforeunload = null;
                            if (!breakLoop) {
                                if (!confirm("You have made changes that will be lost if you leave this page. Do you want to discard the changes?")) {
                                    event.preventDefault();
                                    breakLoop = true;
                                } else {
                                    window.location.reload();
                                    breakLoop = true;
                                }
                            }
                        }
                    });
                });

            } //end link
    };
}]);

angular.module('ParcelUI').directive('fileInput', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {

            elm.bind('change', function () {
                $('#filetag').hide();
                $('#successdiv').hide();
                $('#errordiv').hide();
                $('#incorrectformatdiv').hide();
                $parse(attrs.fileInput).assign(scope, elm[0].files);
                scope.$apply();
            })
        }
    };
}]);


angular.module('ParcelUI').directive('fileSelect', function () {
    //  var template = '<input type="file" name="files" multiple/>';
    var template = '<input type="file" name="files"/>';
    return function (scope, elem, attrs) {
        var selector = $(template);
        elem.append(selector);
        selector.bind('change', function (event) {
            scope.$apply(function () {
                scope[attrs.fileSelect] = event.originalEvent.target.files;
            });
        });
        scope.$watch(attrs.fileSelect, function (file) {
            if (!file)
                selector.val(file);
        });
    };
});

angular.module('ParcelUI').directive('showErrors', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            el.addClass("has-error");
            var inputEl = el[0].querySelector("[name]");
            var inputNgEl = angular.element(inputEl);

            var inputName = inputNgEl.attr('name');
            var blurred = false;

            inputNgEl.bind('blur', function (elem) {
                console.log("blur event");
                blurred = true;

                if (inputName == "dateDraftDue") {
                    $timeout(function () {
                        console.log("model value " + scope.main.parentProjectInfo.dateDraftDue);
                        if (scope.main.parentProjectInfo.dateDraftDue != undefined || scope.main.parentProjectInfo.dateDraftDue != null) {
                            el.removeClass('has-error');
                        } else {
                            el.addClass('has-error');
                        }
                    }, 200);


                }
                if (inputName == "dateFinalDue") {
                    $timeout(function () {
                        console.log("model value " + scope.main.parentProjectInfo.dateFinalDue);
                        if (scope.main.parentProjectInfo.dateFinalDue != undefined || scope.main.parentProjectInfo.dateFinalDue != null) {
                            el.removeClass('has-error');
                        } else {
                            el.addClass('has-error');
                        }
                    }, 200);


                }
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });

            scope.$watch(function () {
                return formCtrl[inputName].$invalid
            }, function (invalid) {
                // we only want to toggle the has-error class after the blur
                // event or if the control becomes valid
                if (!blurred && invalid) {
                    return
                }
                el.toggleClass('has-error', invalid);
            });

            scope.$on('show-errors-check-validity', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });


            scope.$on('show-errors-reset', function () {
                $timeout(function () {
                    el.removeClass('has-error');
                }, 0, false);
            });
        }
    }



}]);



angular.module('ParcelUI').directive('multiselectfieldValidation', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            var html = '<div id="fieldValidationMsg" class="help-block error-text col-md-12"></div>';
            var elInput = el.find('input').first();
            var elSelectOptions = el.find('select').first();
            var elMultiSelect = el.find('multiselect').first();
            var eltextArea = el.find('textarea').first();
            var invalidPasswordMsg = "The new password does not meet the minimum password requirements. Passwords must be at least 8 characters long, with at least one letter, one Upper case letter, one numeric character, one non-alphanumeric character and cannot contain your username.";


            elMultiSelect.bind('blur', function (event) {
 
                if (event.target.textContent.indexOf('Select Report Requested') > -1) {
                    el.append(html);
                    el.find('div[id=fieldValidationMsg]').first().html(el.attr('multiselectfield-validation') + ' must be selected.');
                    //el.find('button').first().attr('ng-class',"{'error': !valid()}");              
                    el.find('button').first().css('border-color', '#8e1d14');

                } else {
                    el.removeClass('has-error');
                    el.find('button').first().css('border-color', '');
                    removeSpan(el);
                }


            });

            function removeSpan(el) {
                if (el.find('span#fieldValidationMsg').length > 0)
                    el.find('span#fieldValidationMsg').remove();
            }
        }
    }
});

angular.module('ParcelUI').directive('emailfieldValidation', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            var html = '<span id="fieldValidationMsg" class="help-block error-text"></span>';
            var elInput = el.find('input').first();
            var eltextArea = el.find('textarea').first();
            var invalidPasswordMsg = "The new password does not meet the minimum password requirements. Passwords must be at least 8 characters long, with at least one letter, one Upper case letter, one numeric character, one non-alphanumeric character and cannot contain your username.";



            elInput.bind('blur', function (event) {

                if (formCtrl[elInput.attr('name')].$viewValue && formCtrl[elInput.attr('name')].$viewValue != "") {

                    var regex = /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;
                    if (!regex.test(formCtrl[elInput.attr('name')].$viewValue)) {
                        el.append(html);
                        el.find('span').first().html(el.attr('emailfield-validation') + ' one or more email is not valid');
                        el.addClass('has-error');
                    } else {
                        el.removeClass('has-error');
                        removeSpan(el);
                    }
                } else {
                    if (!el.attr('field-validation')) {
                        el.removeClass('has-error');
                        removeSpan(el);
                    }
                }
            });

            elInput.bind('keypress change focus', function (event) {
               if (formCtrl[elInput.attr('name')].$valid)
                    el.removeClass('has-error');
                else
                if ((elInput.attr('type') == 'email' || elInput.attr('type') == 'password') && !formCtrl[elInput.attr('name')].$valid)
                    el.removeClass('has-error');
                removeSpan(el);
            });



            eltextArea.bind('blur', function (event) {

                if (formCtrl[eltextArea.attr('name')].$viewValue && formCtrl[eltextArea.attr('name')].$viewValue != "") {

                    var regex = /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;
                    if (!regex.test(formCtrl[eltextArea.attr('name')].$viewValue)) {
                        el.append(html);
                        el.find('span').first().html(el.attr('emailfield-validation') + ' one or more email is not valid');
                        el.addClass('has-error');
                    } else {
                        el.removeClass('has-error');
                        removeSpan(el);
                    }
                } else {
                    if (!el.attr('field-validation')) {
                        el.removeClass('has-error');
                        removeSpan(el);
                    }
                }
            });

            eltextArea.bind('keypress change focus', function (event) {

                if (formCtrl[elInput.attr('name')].$valid)
                    el.removeClass('has-error');
                else
                if ((elInput.attr('type') == 'email' || elInput.attr('type') == 'password') && !formCtrl[elInput.attr('name')].$valid)
                    el.removeClass('has-error');
                removeSpan(el);
            });

            function removeSpan(el) {
                el.removeClass('has-error');
                if (el.find('span#fieldValidationMsg').length > 0)
                    el.find('span#fieldValidationMsg').remove();
            }
        }
    }
});
