angular.module('ResetPasswordModule').controller('ForgotPasswordController', ['resetPasswordFactory', 'resetPasswordMessages', '$state', '$window', '$stateParams', function (resetPasswordFactory, resetPasswordMessages, $state, $window, $stateParams) {

    var self = this;

    init();


    function init() {

        if ($stateParams.default) self.default = true;
        else self.default = false;

    }

    
    self.resetEmail = function () {
        $window.location = window.location.protocol + "//" + window.location.host;
    }

    self.cancelResubmit = function () {
        $window.location = window.location.protocol + "//" + window.location.host;
    }
    self.reSubmit = function () {
        self.default = true;
    }

    self.validateEmail = function (form) {
        self.isEmailValidated = false;
        if (!form.$valid) {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            return;
        } else {
            resetPasswordFactory.validateEmail(self.email).then(function (response) {
                if (response && response.users && response.users.length > 0) {
                    self.toEmail = response.users[0].email;
                    self.userDetailsArray = [];
                    self.userGuidObject = {
                        "key": "USERGUID",
                        "value": response.users[0].userGUID
                    };
                    self.userAccountGuidObject = {
                        "key": "OFFICEGUID",
                        "value": response.users[0].office === null ? "" : response.users[0].office.companyOfficeGUID
                    };
                    self.userCompanyGuid = {
                        "key": "COMPANYGUID",
                        "value": response.users[0].company === null ? "" : response.users[0].company.companyGUID

                    };
                    self.userName = {
                        "key": "USERNAME",
                        "value": response.users[0].userName
                    };
                    self.email = {
                        "key": "EMAIL",
                        "value": response.users[0].email
                    };
                    self.cellPhone = {
                        "key": "PHONE",
                        "value": response.users[0].cellPhone
                    };

                    self.companyName = {
                        "key": "COMPANYNAME",
                        "value": response.users[0].company == null ? "" : response.users[0].company.name
                    };

                    self.officeName = {
                        "key": "OFFICENAME",
                        "value": response.users[0].office == null ? "" : response.users[0].office.officeName
                    };

                    self.displayName = {
                        "key": "DISPLAYNAME",
                        "value": response.users[0].displayName || response.users[0].firstName + " " + response.users[0].lastName
                    };

                    self.isUsed = {
                        "key": "ISUSED",
                        "value": 0
                    };


                    self.userDetailsArray.push(self.userGuidObject);
                    self.userDetailsArray.push(self.userAccountGuidObject);
                    self.userDetailsArray.push(self.userCompanyGuid);
                    self.userDetailsArray.push(self.userName);
                    self.userDetailsArray.push(self.email);
                    self.userDetailsArray.push(self.cellPhone);
                    self.userDetailsArray.push(self.companyName);
                    self.userDetailsArray.push(self.officeName);
                    self.userDetailsArray.push(self.displayName);
                    self.userDetailsArray.push(self.isUsed);


                    createSession(self.userDetailsArray);
                } else {
                    alertDiv("error");
                    //self.isEmailValidated = false;
                    self.message = resetPasswordMessages.INVALID_USER;
                }
            }, function (error) {
                alertDiv("error");
                self.message = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
            })
        }
    }


    function createSession(userDetailsArray) {

        resetPasswordFactory.createSession(self.userDetailsArray).then(function (sessionToken) {
            self.tokenGuid = sessionToken;
            document.cookie = "sessionToken=" + sessionToken;
            callMessageService();
            //Here message service will be called

        }, function (error) {
            alertDiv("error");
            self.message = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
        })
    }

    function callMessageService(displayName, email) {
        resetPasswordFactory.sendEmailNotification(self.toEmail, self.tokenGuid, self.displayName.value, self.email.value, self.userName.value).then(function (response) {
            alertDiv("success");
            self.message = resetPasswordMessages.EMAIL_VALIDATION_SUCCESS;
            self.email = "";
            self.mailsentToUpdate = true;
        }, function (error) {
            alertDiv("error");
            self.message = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
        })
    }

    function alertDiv(status) {
        self.isEmailValidated = true;
        if (status === 'error') {
            $('#forgotPasswordAlert').addClass('alert-danger');
            $('#forgotPasswordAlert').removeClass('alert-success');
        } else if (status === 'success') {
            $('#forgotPasswordAlert').addClass('alert-success');
            $('#forgotPasswordAlert').removeClass('alert-danger');
        }
    }





}])