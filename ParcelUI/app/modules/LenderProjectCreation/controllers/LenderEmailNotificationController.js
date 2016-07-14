angular.module('LenderProjectCreation').controller('LenderEmailNotificationCtrl', ['$scope', '$log', '$modal', function ($scope, $log, $modal) {

    /*var emailNotificationControllerLogger = $log.getInstance('emailNotificationController');

    emailNotificationControllerLogger.info("attachments controller reached");*/

    $scope.$emit('showButtons');

    this.sendNotification = function () {

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
            templateUrl: 'app/modules/LenderProjectCreation/views/lender_helpEmailConsultant.html',
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
            templateUrl: 'app/modules/LenderProjectCreation/views/lender_helpAccess.html',
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

    self.emailNotificationObj = {
        from: {
            name: "Mr. Appraiser Gabberty"
        },
        to: {
            contacts: [],
            display: null
        },
        cc: {
            contacts: [],
            display: null
        },
        message: {
            text: ""
        }
    };

    this.ShowFindContact = function () {
        var modalInstance = $modal.open({
            templateUrl: 'app/modules/LenderProjectCreation/views/lender_emailContacts.html',
            scope: $scope,
            controller: 'LenderEmailContactsCtrl as emailContacts',
            size: 'lg',
            windowClass: 'app-modal-window',

            resolve: {
                notificationObj: function () {
                    return self.emailNotificationObj;
                }
            }
        });

        modalInstance.result.then(function () {
            //console.log(JSON.stringify(self.emailNotificationObj));

            var to = self.emailNotificationObj.to;
            if (to.contacts && to.contacts.length > 0) {
                var toval = stringifyContactColl(to.contacts);
                //if (to.display) {
                //    to.display += ", " + toval;
                //} else {
                to.display = toval;
                //}
            }

            var cc = self.emailNotificationObj.cc;
            if (cc.contacts && cc.contacts.length > 0) {
                var ccval = stringifyContactColl(cc.contacts);
                //if (cc.display) {
                //    cc.display += ", " + ccval;
                //} else {
                cc.display = ccval;
                //}
            }

            self.notifications.emailTo = self.emailNotificationObj.to.display;
            self.notifications.emailCC = self.emailNotificationObj.cc.display;

            //console.log(JSON.stringify(self.emailNotificationObj));
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
