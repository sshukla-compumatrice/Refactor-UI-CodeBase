angular.module('ResetPasswordModule').controller('ResetPasswordController', ['resetPasswordFactory', '$stateParams', 'BASEURL', '$scope', 'resetPasswordMessages', '$timeout', '$window', '$state', function (resetPasswordFactory, $stateParams, BASEURL, $scope, resetPasswordMessages, $timeout, $window, $state) {

    var self = this;

    init();


    function init() {
        
        self.tokenGuid = $stateParams.Token;

        if (self.tokenGuid) {
            self.isTokenValid = true;
            validateSessionToken(self.tokenGuid);
        } else {
            self.isTokenValid = false;
            self.errorMsg = resetPasswordMessages.INVALIDTOKEN;
        }

    }


    function validateSessionToken(tokenGuid) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        self.isTokenValid = false;
        self.isExpired = false;
        self.isUsed = false;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
            resetPasswordFactory.getSession(tokenGuid).then(function (response) {
                if (response) {
                    var isUsedValue;
                    self.sessionDataArray = response.sessionToken.sessionData;
                    if (response.sessionToken.sessionData && response.sessionToken.sessionData instanceof Array && response.sessionToken.sessionData.length > 0) {


                        for (var i = 0; i < self.sessionDataArray.length; i++) {
                            if (self.sessionDataArray[i].key === 'ISUSED') {
                                var isUsedValue = self.sessionDataArray[i].value;
                                if (isUsedValue === 0 && response.sessionToken.statusAsOfCurrentTS.toLowerCase() === 'active') {
                                    self.isTokenValid = true;
                                    self.isExpired = false;
                                } else if (isUsedValue === 0 && response.sessionToken.statusAsOfCurrentTS.toLowerCase() === 'expired') {
                                    self.isTokenValid = true;
                                    self.isExpired = true;
                                }
                                else if(isUsedValue === 1) {
                                    self.isTokenValid = true;
                                    self.isUsed = true;                                    
                                }
                                else {
                                    self.isTokenValid = false;
                                    self.errorMsg = resetPasswordMessages.INVALIDTOKEN
                                }
                            }
                            if (self.sessionDataArray[i].key === 'USERGUID') {
                                self.userGuid = self.sessionDataArray[i].value;
                            }
                            if (self.sessionDataArray[i].key === 'USERNAME') {
                                self.userName = self.sessionDataArray[i].value;
                            }
                        }
                    } else {
                        self.isTokenValid = false;
                        self.errorMsg = resetPasswordMessages.INVALIDTOKEN;
                    }

                }
            }, function (error) {

                self.isTokenValid = false;
                self.errorMsg = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
            })
    }

    self.cancel = function () {
        $window.location = window.location.protocol + "//" + window.location.host;
    }

    self.resubmitRequest = function () {
        $state.go('ForgotPassword');
    }


    self.resetPassword = function () {
        self.newPassword = '';
        self.repeatPassword = undefined;
        $('.has-error').removeClass('has-error');
        $('.error-text').remove();
        $('.validation-error-text').remove();
        self.resetPasswordSuccess = false;
    }

    self.submitNewPassword = function (form) {
        self.resetPasswordSuccess = false;

        if (!form.$valid) {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            return;
        } else {
            if(self.newPassword === self.userName) return;
            if (self.repeatPassword != $scope.resetPassword.newPassword) {
                displayErrorforPassMismatch(form);
                return;
            }
            resetPasswordFactory.resetPassword(self.newPassword, self.userGuid).then(function (response) {

                UpdateTokenInformation();

            }, function (error) {

                self.isPasswordChangedMessage = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;;
                alertDiv('error');
            })
        }
    }

    function UpdateTokenInformation() {
        resetPasswordFactory.updateSessionTokenInfo(self.sessionDataArray, self.tokenGuid).then(function (response) {
            alertDiv('success');
            self.isPasswordChangedMessage = resetPasswordMessages.RESETPASSWORD_SUCCESS;

            $timeout(function () {
                $window.location = window.location.protocol + "//" + window.location.host;
            }, 500);

        }, function (error) {

            self.isPasswordChangedMessage = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
            alertDiv('error');
        })
    }

    function alertDiv(status) {
        self.resetPasswordSuccess = true;
        if (status === 'error') {
            $('#resetPasswordAlert').addClass('alert-danger');
            $('#resetPasswordAlert').removeClass('alert-success');
        } else if (status === 'success') {
            $('#resetPasswordAlert').addClass('alert-success');
            $('#resetPasswordAlert').removeClass('alert-danger');
        }
    }

    self.matchPassword = function (form) {
        
        if (self.repeatPassword) {
            if (self.repeatPassword != $scope.resetPassword.newPassword) {
                displayErrorforPassMismatch(form);
                
            } else {
                if ($('.repassword').parent().parent().find('span')) {
                    $('.repassword').parent().parent().find('span').remove();
                    $('.repassword').parent().parent().removeClass('has-error');
                }
                form['reset-password-repeat'].$valid = true;
                form.$valid = true;
            }
        }
    }
    
    function displayErrorforPassMismatch(form){
        var html = '<span class="help-block error-text"></span>';
        if ($('.repassword').parent().parent().find('span')) {
                    $('.repassword').parent().parent().find('span').remove();
                }
                $('.repassword').parent().parent().append(html);
                $('.repassword').parent().parent().find('span').first().html('Password does not match.');
                $('.repassword').parent().parent().addClass('has-error');

                form['reset-password-repeat'].$valid = false;
                form.$valid = false;
    }


}])


angular.module('ResetPasswordModule').directive('matchPassword', [function () {
    return {
        restrict: 'A',
        require: ['ngModel', '^form'],



        link: function ($scope, elem, attr, formController) {

            var html = '<span class="help-block error-text"></span>';
            
            elem.bind('blur', function () {
                if (!formController[0].$modelValue) {
                    if (elem.parent().parent().find('span')) {
                        elem.parent().parent().find('span').remove();
                    }
                    elem.parent().parent().append(html);
                    elem.parent().parent().find('span').first().html('Repeat Password cannot be blank');
                    elem.parent().parent().addClass('has-error');

                    formController[1][elem.attr('name')].$valid = false;
                    $scope.parcelResetPassForm.$valid = false;
                } else {
                    formController[1][elem.attr('name')].$valid = true;
                    $scope.parcelResetPassForm.$valid = true;
                }

            })
        }

    }
}])