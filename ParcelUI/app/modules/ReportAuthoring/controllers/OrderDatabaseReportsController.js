angular.module("ReportAuthoring").controller("OrderDatabaseReportsController", ["$scope", "$modal", "$modalInstance", "$window", "$state", "edrOrderAPI", "siteDetails", "userDetails", "accountMgmtAPI", "AuthFactory", "BASEURL", function ($scope, $modal, $modalInstance, $window, $state, edrOrderAPI, siteDetails, userDetails, accountMgmtAPI, AuthFactory, BASEURL) {
    self = this;
    self.userMsg = false;
    self.userMsgAlertClass = "";
    self.order = {};
    self.forSingleSiteOrder = false;
    self.storeEdrCredentials = false;

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;

    var userDetailsCopy = {};

    function init() {
        if (siteDetails && siteDetails.location) {
            self.order["address"] = siteDetails.location.address1 + siteDetails.location.address2 ? siteDetails.location.address1 + siteDetails.location.address2 + "," : siteDetails.location.address1 + siteDetails.location.address2;
            self.order["cityStateZip"] = siteDetails.location.city ? siteDetails.location.city + ", " + siteDetails.location.state + " " + siteDetails.location.zip : siteDetails.location.state + " " + siteDetails.location.zip;
            self.order["latitude"] = siteDetails.location.latitude;
            self.order["longitude"] = siteDetails.location.longitude;
            self.forSingleSiteOrder = true;
        }

        var edrCredentialObj = sessionStorage.getItem("edrCredential");

        if (edrCredentialObj) {
            edrCredentialObj = JSON.parse(edrCredentialObj);
            self.order["accountNo"] = edrCredentialObj.edrAccountNumber ? edrCredentialObj.edrAccountNumber : "";
            self.order["password"] = edrCredentialObj.edrPassword ? edrCredentialObj.edrPassword : "";
        }

        if (userDetails && userDetails.users && userDetails.users.length) {
            var userData = userDetails.users[0];
            userDetailsCopy = angular.copy(userDetails.users[0]);
            if (userData) {
                self.order["accountNo"] = userData.edrAccountNumber ? userData.edrAccountNumber : userData.office.edrAccountNumber ? userData.office.edrAccountNumber : "";
                self.order["password"] = userData.edrAccountPassword ? userData.edrAccountPassword : userData.office.edrAccountPassword ? userData.office.edrAccountPassword : "";
            }

            sessionStorage.setItem("edrCredential", JSON.stringify({
                "edrAccountNumber": self.order.accountNo,
                "edrPassword": self.order.password
            }));
        } else {
            self.userMsgAlertClass = "alert-danger";
            self.userMsg = "<strong>Error:</strong> Problem in getting your EDR credentials. You can continue by entering it manually.";
        }

        var userEmail = AuthFactory.getUserDetailsFromStorage("EFF_EMAIL");
        self.order["emailNotification"] = userEmail ? userEmail + ';' : "";

        self.order["sendNotificationMail"] = false;
        self.order["storeEdrCredentials"] = false;
    }

    init();

    self.closeModal = function () {
        $modalInstance.close();
    }

    self.closeWindow = function () {
        $modalInstance.close();
        window.close();
    }

    self.singleSiteOrder = function (form) {
        if (form.$valid) {
            var orderDetails = {
                "edrAccountNumber": self.order.accountNo,
                "edrPassword": self.order.password,
                "reportGuid": $state.params.reportGuid,
                "notificationEmails": (self.order.sendNotificationMail && self.order.emailNotification) ? self.order.emailNotification : ""
            }
            $scope.promise = edrOrderAPI.postSingleSiteOrder({
                "order": orderDetails
            });
            $scope.promise.then(function (data) {
                    sessionStorage.setItem("edrCredential", JSON.stringify({
                        "edrAccountNumber": self.order.accountNo,
                        "edrPassword": self.order.password
                    }));

                    if (self.order.storeEdrCredentials) {
                        if (userDetailsCopy) {
                            accountMgmtAPI.updateEdrCredentials(userDetailsCopy.userGUID, self.order.accountNo, self.order.password, accountMgmtAPI.prepareEditUserObj(userDetailsCopy));
                        }
                    }

                    $modalInstance.close();
                    $window.open(data.transferURL, '_blank');
                },
                function (error) {
                    self.userMsgAlertClass = "alert-danger";
                    self.userMsg = "<strong>Error:</strong> Problem in placing your order. " + error;
                });
        } else {
            var formElem = document.getElementsByName(form.$name);
            angular.element(formElem).find(':input').trigger('blur');
        }
    }

    self.portfolioOrder = function (form) {
        if (form.$valid) {
            var edrCredentialsData = {
                "edrCredentials": {
                    "edrAccountNumber": self.order.accountNo,
                    "edrPassword": self.order.password
                }
            }
            edrOrderAPI.searchDistances(edrCredentialsData).then(function (resp) {
                sessionStorage.setItem("edrCredential", JSON.stringify(edrCredentialsData.edrCredentials));

                if (self.order.storeEdrCredentials) {
                    if (userDetailsCopy) {
                        accountMgmtAPI.updateEdrCredentials(userDetailsCopy.userGUID, self.order.accountNo, self.order.password, accountMgmtAPI.prepareEditUserObj(userDetailsCopy));
                    }
                }

                if ($state.current.name == "edrPortfolioOrder") {
                    $modalInstance.close();
                    $state.reload();
                } else {
                    $modalInstance.close();
                    var url = $state.href('edrPortfolioOrder', {
                        projectGuid: $state.params.projectGuid
                    });
                    window.open(url, '_blank');
                }
            }, function (error) {
                self.userMsgAlertClass = "alert-danger";
                self.userMsg = "<strong>Error:</strong> Problem in placing portfolio order. " + error;
            });
        } else {
            var formElem = document.getElementsByName(form.$name);
            angular.element(formElem).find(':input').trigger('blur');
        }
    }
}]);