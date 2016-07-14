var ResetPassword = angular.module('ResetPasswordModule', ['ui.router.state']);

ResetPassword.config([
  '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');


        $stateProvider.state('ForgotPassword', {
            'url': '/ForgotPassword',
            'params': {
                default: true
            },
            'controller': 'ForgotPasswordController as forgotPassword',
            'templateUrl': 'modules/resetPassword/views/forgotPassword.html'

        });

        $stateProvider.state('ResetPassword', {
            'url': '/ResetPassword?Token',
            'controller': 'ResetPasswordController as resetPassword',
            'templateUrl': 'modules/resetPassword/views/resetPassword.html'

        });
  }
]);