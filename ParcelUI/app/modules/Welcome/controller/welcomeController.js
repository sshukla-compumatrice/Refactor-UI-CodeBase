app.controller('welcomeController',['$scope', function($scope) {
    this.resetPassword = false;
    this.forgotPassSubmit = false;
    this.resetPassSubmit = false;  
        

    function clearErrors(event) {
        //var modalContent = document.getElementsByClassName("modal-content");
        angular.element(document.getElementsByClassName('form-group')).each(function () {
            var formElement = angular.element(this);
            if (!formElement.hasClass('ng-hide')) {
                formElement.removeClass('has-error');
                formElement.find('.error-text').each(function () {
                    var spanElem = angular.element(this);
                    spanElem.remove();
                });
            }
        });
    }

    this.setForgotPasswordDisplay = function (displayFlag) {
        clearErrors();
        var signInPanelDiv = document.getElementById('parcelSignInPanel');
        var forgotPassPanelDiv = document.getElementById('parcelForgotPassPanel');
        if (displayFlag) {
            angular.element(signInPanelDiv).slideUp();
            angular.element(forgotPassPanelDiv).slideDown();
        } else {
            angular.element(signInPanelDiv).slideDown();
            angular.element(forgotPassPanelDiv).slideUp();
        }
    }

    this.setResetPassword = function (flag) {
        this.resetPassword = flag;
    }
    
    this.submitCredentials = function(form) {
        //console.log('Post the credentials to server');
        if(form.$valid) {
            //console.log('Posting the credentials to test1 server');
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
            //window.location.href = "http://wwwdev.parcelplatform.com";
            //$('body').addClass('body-padding');
            //$state.go('LandingPage');
            //$state.go('ReportAuthoring.Write');
            window.location.assign("/#/LandingPage");
        }
        else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }        
    }
    
    this.submitForgotPassRequest = function (form) {
        if(form.$valid) {
            this.forgotPassSubmit = true;
            console.log('post the new password to server');
        }
        else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }
    
    this.submitNewPassword = function(form) {
        if(form.$valid) {
            this.resetPassSubmit = true;
            console.log('post the new password to server');
        }
        else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }
}]);