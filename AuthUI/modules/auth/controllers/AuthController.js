angular.module('AuthModule').controller('AuthController', ['$location', '$modal', 'resetPassword', '$timeout', '$state', function ($location, $modal, resetPassword, $timeout, $state) {

    getApplicationName = function () {
        /*if($location.host() == 'www.collateral360.com')
            return('Collateral360');
        else
            return('PARCEL');*/

        //return('PARCEL');

        return ('PARCEL');

    }

    this.appName = getApplicationName();

    this.openSignInModal = function () {
        $modal.open({
            templateUrl: 'sign-in-modal.html',
            controller: 'AuthModalInstanceController as authModalInst',
            resolve: {
                applicationName: function () {
                    return getApplicationName();
                }
            }
        });
    }

    this.redirectToAccountPage = function () {
        $state.go('AccountsEntity');
    }

    openResetPasswordModal = function () {
        $modal.open({
            templateUrl: 'reset-password-modal.html',
            controller: 'AuthModalInstanceController as authModalInst',
            resolve: {
                applicationName: function () {
                    return getApplicationName();
                }
            }
        });
    }

    if (resetPassword) {
        $timeout(function () {
            openResetPasswordModal();
        }, 50);
    }
}]);