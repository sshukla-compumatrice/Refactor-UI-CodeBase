var Auth = angular.module('AuthModule', ['ui.router.state']);

Auth.config([
  '$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');


        $stateProvider.state('parcel-login', {
            'url': '/parcel/login',
            'controller': 'ParcelAuthController as parcelAuthCtrl',
            'templateUrl': 'modules/auth/views/parcelAuth/parcelLandingPage.html',
            'resolve': {
                resetPassword: function () {
                    return false;
                }
            }
        });


        $stateProvider.state('c360-login', {
            'url': '/collateral360/login',
            'controller': 'AuthController as authCtrl',
            'templateUrl': 'modules/auth/views/c360Auth/c360LandingPage.html',
            'resolve': {
                resetPassword: function () {
                    return false;
                }
            }
        });
  }
]);