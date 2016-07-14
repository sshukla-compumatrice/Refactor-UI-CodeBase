angular.module('AuthModule').controller('AuthController', ['$location', '$modal', 'resetPassword', '$timeout', '$state', function ($location, $modal, resetPassword, $timeout, $state) {

    this.openSignInModal = function () {
        $modal.open({
            templateUrl: 'sign-in-modal.html',
            controller: 'C360AuthController as authModalInst'
        });
    }

    openResetPasswordModal = function () {
        $modal.open({
            templateUrl: 'reset-password-modal.html',
            controller: 'C360AuthController as authModalInst'
        });
    }

    if (resetPassword) {
        $timeout(function () {
            openResetPasswordModal();
        }, 50);
    }
}]);

angular.module('AuthModule').controller('C360AuthController', ['$modalInstance', 'AuthService', function ($modalInstance, AuthService) {
    this.appName = 'Collateral360';
    this.signIn = true;
    this.forgotPass = false;
    this.forgotPassSubmit = false;
    this.resetPass = true;
    this.resetPassSubmit = false;

    this.username = "";
    this.password = "";
    this.passwordRequestEmail = "";
    this.newPassword = "";
    this.repeatPassword = "";

    function clearModalErrors(event) {
        var modalContent = document.getElementsByClassName("modal-content");
        angular.element(modalContent).find('.form-group').each(function () {
            var formElement = angular.element(this);
            if (!formElement.hasClass('ng-hide')) {
                formElement.removeClass('has-error');
                formElement.find('.validation-error-text').each(function () {
                    var spanElem = angular.element(this);
                    if (!spanElem.hasClass('ng-hide'))
                        spanElem.addClass('ng-hide');
                })
            }
        });
    }

    this.closeModal = function () {
        $modalInstance.close();
    }

    this.setViewsState = function (event, flag) {
        this.forgotPass = flag;
        this.signIn = !flag;
        this.forgotPassSubmit = false;
        clearModalErrors(event);
    }

    this.submitCredentials = function (form) {
        //console.log('Post the credentials to server');
        if (form.$valid) {
            console.log('Posting the credentials to test1 server');
            /*AuthService.postUserCredentials(this.username, this.password).then(function(result){
                if (result.status == 'success') {
                    window.location.href = "https://test1.collateral360.com/reporting/index2.php";
                }
                else {
                    var passwordFieldContext = angular.element(document.getElementById('signInPasswordField'));
                    passwordFieldContext.toggleClass('has-error', true);
                    angular.element(passwordFieldContext).append('<span class="help-block error-text">'+result.message+'</span>');
                }
            })*/
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    this.submitPasswordChange = function (form) {
        if (form.$valid) {
            this.forgotPassSubmit = true;
            this.forgotPass = false;
            this.signIn = false;
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    this.submitNewPassword = function (form) {
        if (form.$valid) {
            this.resetPass = false;
            this.resetPassSubmit = true;
            console.log('post the new password to server');
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }
}]);