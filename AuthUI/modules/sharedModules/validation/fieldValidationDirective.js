angular.module('AccessManagement').directive('fieldValidation', function ($timeout) {
    return {
        restrict: 'A',
        require: '^form',

        link: function (scope, el, attrs, formCtrl) {
            var html = '<span class="validation-error-text text-danger"></span>';
            var elInput = el.find('input').first();
            var elSelectOptions = el.find('select').first();
            var invalidPasswordMsg = "The new password does not meet the minimum password requirements. Passwords must be at least 8 characters long, with at least one letter, one upper case letter, one numeric character, one non-alphanumeric character (symbol) and cannot contain your username.";

            if (elSelectOptions.attr('chosen')) {
                var chosenContainer = el.find('.chosen-container ul input').first();
                chosenContainer.bind('blur', function (event) {
                    $timeout(function () {
                        var chosenUl = angular.element('.chosen-container > ul');
                        if (angular.element('.chosen-container > ul > li').length <= 1) {
                            if (formCtrl[elSelectOptions.attr('name')].$valid)
                                chosenUl.css('border-color', '');
                            else {
                                if (formCtrl[elSelectOptions.attr('name')].$viewValue == "" || formCtrl[elSelectOptions.attr('name')].$viewValue == undefined) {
                                    el.append(html);
                                    el.find('span').first().html(el.attr('field-validation') + ' must be selected.');
                                }
                                chosenUl.css('border-color', '#8e1d14');
                            }
                        } else {
                            if (formCtrl[elSelectOptions.attr('name')].$valid)
                                chosenUl.css('border-color', '');
                            else {
                                if (!formCtrl[elSelectOptions.attr('name')].$valid)
                                    chosenUl.css('border-color', '');
                            }

                            if (el.find('span.validation-error-text').first().length > 0)
                                el.find('span.validation-error-text').first().remove();
                        }
                    }, 100);
                });
            } else {
                elInput.bind('blur', function (event) {
                    if (formCtrl[elInput.attr('name')].$valid) {
                        if (elInput.attr('type') == 'password' && elInput.attr('name') == 'reset-password-new' && formCtrl[elInput.attr('name')].$viewValue === scope.$parent.resetPassword.userName) {
                            el.append(html);
                            el.find('span').first().html(invalidPasswordMsg);
                            el.find('span').addClass('col-sm-10 col-sm-offset-2');
                            el.addClass('has-error');

                        } else {
                            el.removeClass('has-error');
                            removeSpan(el);
                        }
                    } else {
                        if (formCtrl[elInput.attr('name')].$viewValue == "" || formCtrl[elInput.attr('name')].$viewValue == undefined) {
                            el.append(html);
                            el.find('span').first().html(el.attr('field-validation') + ' cannot be blank.');
                            el.addClass('has-error');
                        } else if (elInput.attr('type') == 'email' && !formCtrl[elInput.attr('name')].$valid) {
                            el.append(html);
                            el.find('span').first().html('Invalid email address.');
                            el.addClass('has-error');
                        } else if (elInput.attr('type') == 'password' && elInput.attr('name') == 'reset-password-new' && !formCtrl[elInput.attr('name')].$valid) {
                            el.append(html);
                            el.find('span').first().html(invalidPasswordMsg);
                            el.find('span').addClass('col-sm-10 col-sm-offset-2');
                            el.addClass('has-error');

                        } else if (elInput.attr('custom') == 'alphaOnly' && !formCtrl[elInput.attr('name')].$valid) {
                            el.append(html);
                            el.find('span').first().html(el.attr('field-validation') + ' can only contain alphabets.');
                            el.addClass('has-error');

                        } else if (elInput.attr('custom') == 'numbersOnly' && !formCtrl[elInput.attr('name')].$valid) {
                            el.append(html);
                            el.find('span').first().html(el.attr('field-validation') + ' can only contain positive numbers.');
                            el.addClass('has-error');

                        } else if (elInput.attr('custom') == 'numbersAndDot' && !formCtrl[elInput.attr('name')].$valid) {
                            el.append(html);
                            el.find('span').first().html(el.attr('field-validation') + ' is not a valid entry.');
                            el.addClass('has-error');

                        } else {}

                    }
                });

                elInput.bind('keypress change', function (event) {
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

                elSelectOptions.bind('change', function (event) {
                    if (formCtrl[elSelectOptions.attr('name')].$valid)
                        el.removeClass('has-error');
                    else
                    if (!formCtrl[elSelectOptions.attr('name')].$valid)
                        el.removeClass('has-error');
                    removeSpan(el);
                });
            }

            function removeSpan(el) {
                if (el.find('span').first().length > 0)
                    el.find('span').first().remove();
            }
        }
    }
});