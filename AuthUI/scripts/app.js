var AccessManagement = angular.module('AccessManagement', ['ui.router.state', 'ui.bootstrap', 'logEnhancingModule', 'AuthModule', 'AccountMgmtModule', 'ResetPasswordModule', 'am.multiselect', 'cgBusy', 'ngSanitize', 'ngCookies']);

AccessManagement.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.when('/', '/accounts');

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('timestampMarker');
    $httpProvider.interceptors.push('ajaxRequestInterceptor');


    //code to fix IE issue starts
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Fri, 01 Apr 2016';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    //code to fix IE issue ends
}]);

angular.module('AccessManagement').value("globalValues", {
    pageRefreshed: false,
    isAuthenticated: false,
    isAuthorized: false,
    isLogout: false
});

AccessManagement.run(['$rootScope', '$log', 'logEnhancer', '$http', 'applicationInfoSession', 'environmentInfoSession', 'GUID', '$modal', '$state', 'BASEURL', 'AuthFactory', '$cookieStore', '$timeout', function ($rootScope, $log, logEnhancer, $http, applicationInfoSession, environmentInfoSession, GUID, $modal, $state, BASEURL, AuthFactory, $cookieStore, $timeout) {

    $rootScope.skipMsgClear = false;
    $rootScope.serviceError = false;
    //$rootScope.title = "Account Management / PARCEL";
    environmentInfoSession.create();
    applicationInfoSession.create();
    GUID.create();

    var environmentObject = environmentInfoSession.getenvironmentInfo();
    var applicationObject = applicationInfoSession.getapplicationInfo();
    var guid = GUID.get();
    logEnhancer.enhanceAngularLog(applicationObject, environmentObject, {
        postLogJSON: BASEURL.LOGGING
    }, guid, $log, $http);

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        if (BASEURL.IS_LOCAL === 1 && !localStorage.getItem("userdetails")) {
            AuthFactory.impersonateUserOnLocalEnv();
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, fromState) {
        window.scrollTo(0, 0);
        if (!$rootScope.skipMsgClear) {
            $rootScope.userMessage = false;
            $rootScope.alertClass = "";
        }
        $rootScope.skipMsgClear = false;
        $rootScope.serviceError = false;
        
        $timeout(function () {
            $rootScope.$apply(function () {
                $rootScope.title = (toState.data && toState.data.pageTitle) ? toState.data.pageTitle + " / PARCEL" : '';
            });
        });
    });

    $rootScope.dismissUserMessage = function () {
        $rootScope.userMessage = false;
        $rootScope.alertClass = "";
    }
}]);

// Handling footer on scrolling
$(window).scroll(function () {
    if ($(this).scrollTop() === 0) {
        $('#footerLP').hide();
    } else {
        $('#footerLP').show();
        $('#footerLP').fadeIn();
    }
});