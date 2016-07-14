angular.module('ProjectCreation').controller('EmailNotificationCtrl', ['$scope', '$log', '$modal', function ($scope, $log, $modal) {

    var emailNotificationControllerLogger = $log.getInstance('emailNotificationController');

    emailNotificationControllerLogger.info("attachments controller reached");
    $scope.$emit('showButtons');
    $scope.$parent.$parent.main.submitData.notification.sendEmailNotification = false;


    this.sendNotification = function () {

        if (!$scope.$parent.$parent.main.submitData.notification.sendEmailNotification) {
            $("#divEmailTo").children('.has-error').removeClass('has-error');
            $("#divEmailCC").children('.has-error').removeClass('has-error');
            $("#divEmailTo").removeClass('has-error');
            $("#divEmailCC").removeClass('has-error');
            $("#divEmailTo").find('#fieldValidationMsg').remove();
            $("#divEmailCC").find('#fieldValidationMsg').remove();
            $scope.$parent.$parent.main.submitData.notification.emailTo = '';
            $scope.$parent.$parent.main.submitData.notification.emailCC = '';



        } else {

            $("#divEmailTo").find('input').focus();
        }
        /*if(!$scope.main.parentEmailNotification.sendMail){
			$scope.main.parentEmailNotification.to = "";
			$scope.main.parentEmailNotification.CC = "";
			$scope.main.parentEmailNotification.message = "";
		}*/
    }

    this.emailTo = function (form) {

        if (form.To.$error.email) {
            emailNotificationControllerLogger.info("emailto field entered wrong");
            $('#divEmailTo').addClass('has-error');

        } else {
            $('#divEmailTo').removeClass('has-error');

        }
    }

    this.emailCC = function (form) {

        if (form.CC.$error.email) {
            emailNotificationControllerLogger.info("emailcc field entered wrong");
            $('#divEmailCC').addClass('has-error');

        } else {
            $('#divEmailCC').removeClass('has-error');

        }
    }

    this.ShowEmailHelp = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/helpEmailConsultant.html',
            scope: $scope,
            controller: EmailHelpController,
            size: size

        })
    }
    var EmailHelpController = function ($scope, $modalInstance) {
        $scope.CancelDelete = function () {
            $modalInstance.close()
        }

        $scope.ShowAccessHelp = function () {
            $scope.CancelDelete();
            showAccessHelp();
        }
    }

    function showAccessHelp(size) {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/helpAccess.html',
            scope: $scope,
            controller: AccessHelpController,
            size: size
        })
    }
    var AccessHelpController = function ($scope, $modalInstance) {
        $scope.CancelDelete = function () {
            $modalInstance.close()
        }
    }


    var self = this;
    self.notifications = $scope.$parent.$parent.main.submitData.notification;
    self.notifications.emailTo = [];
    self.notifications.emailCC = [];

    this.ShowFindContact = function () {

        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/emailContacts.html',
            scope: $scope,
            controller: 'EmailContactsCtrl as emailContacts',
            size: 'lg',
            windowClass: 'app-modal-window'
        });

        modalInstance.result.then(function (emailObj) {

            if (emailObj.emailTo && emailObj.emailTo.length > 0) {
                if (angular.isArray(emailObj.emailTo)) {
                    $("#to").focus();
                    if (self.notifications.emailTo) {
                        self.notifications.emailTo = self.notifications.emailTo.concat(emailObj.emailTo);
                    } else {
                        self.notifications.emailTo = emailObj.emailTo;
                    }
                } else {
                    if (!self.notifications.emailTo) {
                        self.notifications.emailTo = '';
                    }

                    if (self.notifications.emailTo.trim() == '') {
                        self.notifications.emailTo = emailObj.emailTo;
                    } else {
                        self.notifications.emailTo = self.notifications.emailTo.trim() == '' ? emailObj.emailTo : self.notifications.emailTo + "," + emailObj.emailTo;
                    }
                }
            }

            if (emailObj.emailCC && emailObj.emailCC.length > 0) {
                if (angular.isArray(emailObj.emailCC)) {
                    if (self.notifications.emailCC) {
                        self.notifications.emailCC = self.notifications.emailCC.concat(emailObj.emailCC);
                    } else {
                        self.notifications.emailCC = emailObj.emailCC;
                    }
                } else {
                    if (!self.notifications.emailCC) {
                        self.notifications.emailCC = '';
                    }
                    if (self.notifications.emailCC == '') {
                        self.notifications.emailCC = emailObj.emailCC;
                    } else {
                        self.notifications.emailCC = self.notifications.emailCC.trim() == '' ? emailObj.emailCC : self.notifications.emailCC + "," + emailObj.emailCC;
                    }
                }
            }
        });
    };

    function stringifyContactColl(coll) {
        if (!coll || coll.length <= 0) return "";

        var val = coll[0].email;
        for (var i = 1; i < coll.length; i++) {
            val += ", " + coll[i].email;
        }
        return val;
    }



}]);



angular.module('ProjectCreation').filter('selectColumnFilter', function () {

    return function (dataArray, searchTerm) {

        if (!dataArray) {
            return;
        } else if (!searchTerm) {
            return dataArray;
        } else {

            var term = searchTerm.toLowerCase();

            return dataArray.filter(function (item) {
                if (item.email)
                    var termInEmail = item.email.toLowerCase().indexOf(term) > -1;
                if (item.companyName)
                    var termInCompany = item.companyName.toLowerCase().indexOf(term) > -1;
                if (item.firstName)
                    var termInFirstName = item.firstName.toLowerCase().indexOf(term) > -1;
                if (item.lastName)
                    var termInLastName = item.lastName.toLowerCase().indexOf(term) > -1;
                return termInEmail || termInCompany || termInFirstName || termInLastName;
            });
        }
    }
});
