
angular.module('ProjectDashboard').controller('SendEmail', ['$scope', '$controller', 'reportGridDataOperations', '$modal', 'checkStatus', '$compile','$window', function ($scope, $controller, reportGridDataOperations, $modal, checkStatus, $compile, $window) {


    var self = this;

    init();

    function init() {
        self.toEmailCount = 0;
        self.to = [];
        self.cc = [];
        self.fromUserEmail = "shkumar@edrnet.com";
        initializeDataRole();
        self.blankEmailTo = false;
        self.toValidation = true;
        self.ccValidation = true;
		$('#tagsInputTextbox').focus();
    }

    function initializeDataRole() {

        $('.requiredToField').hide();
        $("input[data-role=tagsinput]").tagsinput({
            allowDuplicates: false,
            trimValue: true
        });
        var elem = angular.element('.bootstrap-tagsinput');
        $compile(elem)($scope);


    }



    $('input[data-role=tagsinput]').tagsinput({
        onTagExists: function (item, $tag) {
            $tag.hide().fadeIn();
        }
    });


    $('input[name=mailTo]').on('itemRemoved', function (event) {
        self.toEmailCount = self.toEmailCount -1;
        var val = $('input[name=mailTo]').val();
        if (val === "") {
            $('.requiredToField').show();
            angular.element('.toEmailDiv').addClass('has-error');
            angular.element('.toEmailDiv').find('.bootstrap-tagsinput').addClass('tagsinput-invalid');
        }
    });


    $('input[name=mailTo]').on('itemAdded', function (event) {
        var elemTo = $('.tag')[self.toEmailCount];
        $(elemTo).addClass('tagTo');

        self.toEmailCount = self.toEmailCount + 1;
        $('.requiredToField').hide();
        angular.element('.toEmailDiv').removeClass('has-error');
        $('.bootstrap-tagsinput').removeClass('tagsinput-invalid');
        var isValidEmail = /\S+@\S+\.\S+/.test(event.item);
        if (!isValidEmail) {
            $('.tagTo').last().removeClass('label-info');
            $('.tagTo').last().addClass('label-danger');

        }
    });

    $('input[name=mailCC]').on('itemAdded', function (event) {
        $('.tag').last().addClass('tagCc');
        var isValidEmail = /\S+@\S+\.\S+/.test(event.item);
        if (!isValidEmail) {
            $('.tagCc').last().removeClass('label-info');
            $('.tagCc').last().addClass('label-danger');

        }
    });

    /*$('input').on('beforeItemAdd', function (event) {
        //var isValidEmail = /\S+@\S+\.\S+/.test(event.item);
        //if (!isValidEmail) event.cancel = true;


    });*/

    $('#tagsInputTextbox').bind('blur', function () {

        var val = $('input[name=mailTo]').val();

        if (val === "") {
            $('.requiredToField').show();
            angular.element('.toEmailDiv').addClass('has-error');
            angular.element('.toEmailDiv').find('.bootstrap-tagsinput').addClass('tagsinput-invalid');

        }
    })

    this.findContact = function () {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/emailContacts.html',
            scope: $scope,
            controller: 'EmailContactsCtrl as emailContacts',
            size: 'lg',
            windowClass: 'app-modal-window'
        });

        modalInstance.result.then(function (emailObj) {
            if (emailObj && emailObj.emailTo && emailObj.emailTo.length) {
                if (angular.isArray(emailObj.emailTo)) {
                    $('#requiredToField').hide();
                    angular.element('.toEmailDiv').removeClass('has-error');
                    $('.bootstrap-tagsinput').removeClass('tagsinput-invalid');
                    angular.forEach(emailObj.emailTo, function (email) {

                        $('input[name=mailTo]').tagsinput('add', email);
                    })


                }

            }
            if (emailObj && emailObj.emailCC && emailObj.emailCC.length) {
                if (angular.isArray(emailObj.emailCC)) {
                    angular.forEach(emailObj.emailCC, function (email) {

                        $('input[name=mailCC]').tagsinput('add', email);
                    })
                }
            }


        })


    }


    this.cancelDelete = function () {
		$window.close();
     /*   $('input[data-role=tagsinput]').tagsinput('removeAll');
        self.toEmailCount = 0;
        self.showAlert = false;
        //$('.requiredToField').show();
        //angular.element('.toEmailDiv').addClass('has-error');
        //angular.element('.toEmailDiv').find('.bootstrap-tagsinput').addClass('tagsinput-invalid');
        self.message = "";
        self.executiveSummary = false;
        self.detailReport = false;
        self.subject = "";
        self.toValidation = true;
        self.ccValidation = true; */

    }

    function checkEmailValidation(toEmailArray, ccEmailArray) {
        var valid = true;
        if (toEmailArray && toEmailArray.length > 0) {


            var emailPatternValidation = /\S+@\S+\.\S+/;
            for (var i = 0; i < toEmailArray.length; i++) {
                var isTOEmailValid = emailPatternValidation.test(toEmailArray[i]);
                if (!isTOEmailValid) {
                    valid = false;
                    self.toValidation = false;
                    //return valid;
                }
            }
        }

        if (ccEmailArray && ccEmailArray.length > 0) {
            for (var j = 0; j < ccEmailArray.length; j++) {
                var isCCEmailValid = emailPatternValidation.test(ccEmailArray[j]);
                if (!isCCEmailValid) {
                    valid = false;
                    self.ccValidation = false;
                    //return valid;
                }
            }
        }

        return valid;
    }

    this.submit = function (form) {
        if (form.$invalid) {
			
			if($('input[name=mailTo]').val() === "") {
			$('.requiredToField').show();
            angular.element('.toEmailDiv').addClass('has-error');
            angular.element('.toEmailDiv').find('.bootstrap-tagsinput').addClass('tagsinput-invalid');
			}
			
			var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input[required]').trigger('blur');            
			return;		            
            
        } else {
			if($('input[name=mailTo]').val() === "") {
			$('.requiredToField').show();
            angular.element('.toEmailDiv').addClass('has-error');
            angular.element('.toEmailDiv').find('.bootstrap-tagsinput').addClass('tagsinput-invalid');
			return;
			}
            self.toValidation = true;
            self.ccValidation = true;
            var toEmailArray = splitEmailString($('input[name=mailTo]').val());
            var ccEmailArray = splitEmailString($('input[name=mailCC]').val());
            var areEmailsValid = checkEmailValidation(toEmailArray, ccEmailArray);
            if (areEmailsValid == undefined || areEmailsValid) {
                self.showAlert = false;
                var obj = {
                    "assetGUID": "A0F5E294-B497-4C16-8FA4-5dfC9413530F",
                    "assetType": "cabinet",
                    "applicationGUID": "A0F5E294-B497-4C16-4EFA-79834FEAF",
                    "messages": []
                }
                var messageObject = {};
                messageObject.templateName = self.subject == undefined ? "" : self.subject,
                    messageObject.templateGUID = "A5BB0200-C206-45C2-849F-0050C409159B",
                    messageObject.messageType = "EMAIL";
                messageObject.from = self.fromUserEmail;

                messageObject.to = [];
                messageObject.cc = [];
                messageObject.bcc = [];


                messageObject.fields = [{
                        "fieldName": "message",
                        "fieldValue": self.message == undefined ? "" : self.message
                }
                ];

                angular.forEach(toEmailArray, function (email) {
                    messageObject.to.push(email);
                });
                angular.forEach(ccEmailArray, function (email) {
                    messageObject.cc.push(email);
                });
                obj.messages.push(messageObject);

                $scope.delay = 0;
                $scope.minDuration = 0;
                $scope.message = 'Please Wait...';
                $scope.backdrop = true;
                $scope.promise =

                    reportGridDataOperations.sendEmail(obj).then(function (response) {
                        self.showAlert = true;
                        if (response.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'POST')) {

                            self.serviceMessage = response.data.message === undefined ? "Sending email failed" : response.data.message.userMessage;
                            addClassToEmailAlert("error");


                        } else {


                            self.serviceMessage = "Email sent successfully";
                            addClassToEmailAlert("success");
                            
                            self.showAlert = true;



                        }

                    }, function (error) {

                    })
            } else {
                self.serviceMessage = "";

                self.showAlert = true;
                if(self.ccValidation && !self.toValidation) self.serviceMessage = "Invalid email address in the 'To:' field";
                else if(self.toValidation && !self.ccValidation)  self.serviceMessage = "Invalid email address in the 'CC:' field";
                else if(!self.toValidation && !self.ccValidation) {
                    self.serviceMessage = "Invalid email address in the 'To:' field. Invalid email address in the 'CC':' field";



                }
                //self.showAlert = true;
                //self.serviceMessage = "The message can't be sent because at least one recipient isn't valid."
                addClassToEmailAlert("error");
            }

        }
    }

    this.dismissAlert = function () {
        self.serviceMessage = "";
        self.showAlert = false;
    }

    function addClassToEmailAlert(status) {
        if (status === "success") {
            angular.element('#alertEmailMsgDiv').addClass('alert-success');
            angular.element('#alertEmailMsgDiv').removeClass('alert-danger');
        } else {
            angular.element('#alertEmailMsgDiv').removeClass('alert-success');
            angular.element('#alertEmailMsgDiv').addClass('alert-danger');
        }
    }

    function splitEmailString(emailString) {
        if (emailString != undefined && emailString.length > 0)
            return emailString.split(',');

    }
}]);
