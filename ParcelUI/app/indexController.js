angular.module('ParcelUI').controller('indexController', ['$scope', '$http', '$cookieStore', 'checkStatus', 'AuthFactory', 'globalValues', 'BASEURL', '$state', '$location', '$window', 'ReportAuthoringAPI', 'globalValues','$rootScope', function ($scope, $http, $cookieStore, checkStatus, AuthFactory, globalValues, BASEURL, $state, $location, $window, ReportAuthoringAPI, globalValues,$rootScope) {

    init();

    function init() {
        if (BASEURL.IS_LOCAL === 1) {
            $scope.isAuthenticated = true;
        } else {
            $scope.isAuthenticated = checkIfSessionIsActive();            
        }
        setUserDisplayName();
    }

    function setUserDisplayName() {
        var userDetails = JSON.parse(localStorage.getItem('userdetails'));
        if (userDetails) {
            var userName;
            for (var i = 0; i < userDetails.length; i++) {
                if (userDetails[i].key === "EFF_DISPLAYNAME") {
                    userName = userDetails[i].value;
                    $scope.userName = userName;
                } else if (userDetails[i].key === "EFF_COMPANYGUID") {
                    $scope.currentUserCompanyGuid = globalValues.currentUserCompanyGuid = userDetails[i].value;
                } else if (userDetails[i].key === "EFF_OFFICEGUID") {
                    $scope.currentUserOfficeGuid = globalValues.currentUserOfficeGuid = userDetails[i].value;
                } else if (userDetails[i].key === "EFF_USERGUID") {
                    $scope.currentUserGuid = globalValues.currentUserGuid = userDetails[i].value;
                }
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

    /*$scope.redirctToAccountMgmt = function ()
    {
      var companyGuid, officeGuid, userGuid;
      var userDetails = JSON.parse(localStorage.getItem('userdetails'));
      if (userDetails)
      {
        for (var i = 0 ; i < userDetails.length ; i++)
        {
          if (userDetails[i].key === "COMPANYGUID")
          {

            companyGuid = userDetails[i].value;
          }
          else if (userDetails[i].key === "OFFICEGUID")
          {
            officeGuid = userDetails[i].value;
          }
          else if (userDetails[i].key === "USERGUID")
          {

            userGuid = userDetails[i].value;
          }
        }

        $window.location.href = BASEURL.ACCOUNT_MGMT + 'accounts/company/office/user/view?companyguid=' + companyGuid + '&officeguid' + officeGuid + '&userguid' + userGuid;
      }
    }*/

    $scope.searchReportBySiteID = function (siteID) {

        ReportAuthoringAPI.reportBySiteID(siteID).then(function (data) {

            if (data != null && data != undefined)
                $state.go('ReportAuthoring.Write', {
                    projectGuid: data.report.projectGuid,
                    reportGuid: data.report.reportGuid,
                    siteID: siteID
                }, {
                    reload: true,
                    inherit: false
                });
        }).catch(function (error) {
            new PNotify({
                title: 'Error',
                text: 'No data found for this SiteID',
                type: 'error',
                addclass: "stack-topright"
            });
        });
    }
}]);