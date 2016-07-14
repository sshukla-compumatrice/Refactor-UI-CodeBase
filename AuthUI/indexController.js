angular.module('AccessManagement').controller('indexController', ['$scope', '$http', '$cookieStore', 'AuthFactory', 'globalValues', 'BASEURL', '$state', '$location', '$window', 'globalValues', '$rootScope', function ($scope, $http, $cookieStore, AuthFactory, globalValues, BASEURL, $state, $location, $window, globalValues, $rootScope) {

    init();

    function init() {
        if (BASEURL.IS_LOCAL === 1) {
            $scope.isAuthenticated = true;
        } else {
            $scope.isAuthenticated = checkIfSessionIsActive();
        }
        setUserDetails();
    }

    function setUserDetails() {
        var userDetails = JSON.parse(localStorage.getItem('userdetails'));
        if (userDetails) {
            var userName;
            for (var i = 0; i < userDetails.length; i++) {
                if (userDetails[i].key === "EFF_DISPLAYNAME") {
                    userName = userDetails[i].value;
                    $rootScope.userName = userName;
                } else if (userDetails[i].key === "EFF_COMPANYGUID") {
                    $rootScope.currentUserCompanyGuid = userDetails[i].value;
                } else if (userDetails[i].key === "EFF_OFFICEGUID") {
                    $rootScope.currentUserOfficeGuid = userDetails[i].value;
                } else if (userDetails[i].key === "EFF_USERGUID") {
                    $rootScope.currentUserGuid = userDetails[i].value;
                } else {}
            }
        }
    }

    function checkIfSessionIsActive() {
        var sessionToken = AuthFactory.retrieveCookie('sessionToken');
        return sessionToken ? true : false;
    }

    $rootScope.$on('logoutUser', function (event, data) {
        AuthFactory.logout('expired');
    });


    $scope.logoutUser = function () {
        AuthFactory.logout('loggedout');
    }

    $scope.$on("User", function (event, args) {
        $scope.isAuthenticated = true;
        $scope.userName = args;
    })

    $scope.isHeaderEnabled = function () {
        if ($state.current.name == "parcelLogin") return false;
        return true;
    }

    $scope.searchBySiteid = function (siteID) {
        var keyCode = event.which || event.keyCode;
        // If enter key is pressed
        if (keyCode === 13) {
            if (siteID) {
                var regEx = /^[a-zA-Z]{1}[0-9]{7}$/;
                if (regEx.test(siteID)) {
                    searchReportBySiteID(siteID);
                } else {
                    new PNotify({
                        title: 'Error',
                        text: 'Please enter valid SiteID',
                        type: 'error',
                        addclass: "stack-topright",
                        styling: "fontawesome"
                    });
                }
            }
            event.preventDefault();
        }
    }

    function searchReportBySiteID(siteID) {
        commonServices.reportBySiteID(siteID).then(function (data) {
            if (data != null && data != undefined) {
                var linkToReportWrite = "/#/ReportAuthoring/Write?projectGuid=" + data.report.projectGuid + "&reportGuid=" + data.report.reportGuid + "&siteID=" + siteID;
                $window.open(linkToReportWrite, '_self');
            } else {
                $window.open("/#/LandingPage", '_self');
            }
        }).catch(function (error) {
            new PNotify({
                title: 'Error',
                text: 'No data found for this SiteID',
                type: 'error',
                addclass: "stack-topright",
                styling: "fontawesome"
            });
        });
    }
}]);