angular.module('ParcelUI', ['ui.router.state', 'ui.bootstrap', 'ProjectCreation',
    'PortfolioCreation', 'OrderPlacedOnEDR', 'ProjectDashboard',
    'LenderProjectCreation', 'LenderPortfolioCreation', 'ReportTemplates', 'ReportSetup', 'DefaultLanguageLibrary', 'TransmittalLetterSetup', 'TOCSetup', 'ReportAuthoring', 'Support', 'ngSanitize', 'cgBusy', 'ReportOutput', 'FilingCabinet', 'Bidding', 'angularUtils.directives.dirPagination', 'ngResource', 'ngCookies', 'focus-if', 'ngStorage', 'xeditable', 'ParcelWriter', 'mgcrea.ngStrap']);

angular.module('ParcelUI').value("globalValues", {
    pageRefreshed: false,
    isAuthenticated: false,
    isAuthorized: false,
    isLogout: false,
    currentUserCompanyGuid: "",
    currentUserOfficeGuid: "",
    currentUserGuid: ""
});

angular.module('ParcelUI')

.config(function ($popoverProvider) {
    angular.extend($popoverProvider.defaults, {
        html: true
    });
});

angular.module('ParcelUI').config([
    '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('Authenticate', {

            'url': '/',
            'controller': function () {

            },
            'resolve': {
                getAuthToken: ["AuthFactory", "$cookieStore", "BASEURL", function (AuthFactory, $cookieStore, BASEURL) {
                    if (BASEURL.IS_OTHERENV === 1) {
                        return AuthFactory.getAuthToken().then(function (respToken) {
                            if (respToken && respToken.authId) {

                                return respToken;
                            }
                        }, function (error) {
                            //redirect to login page and log error.
                        });
                    } else {
                        return {};
                    }
                }],
                authorize: ["getAuthToken", "AuthFactory", "BASEURL", "$state", function (getAuthToken, AuthFactory, BASEURL, $state) {
                    if (BASEURL.IS_OTHERENV === 1) AuthFactory.authorize();
                    else $state.go('LandingPage');
                }]

            }
        });

        $stateProvider.state('LandingPage', {
            'url': '/LandingPage',
            'templateUrl': 'app/modules/LandingPage/views/CreateProjectMenu.html',
            'controller': 'DashBoardCtrl as dashboard',
            'data': {
                pageTitle: "PARCEL"
            }
        });

    }
]);




angular.module('ParcelUI').provider('logEnhancer', function (Urls, BASEURL) {

    var staticPath = BASEURL.loggerUrl + Urls.postLogJSON;

    var log = log4javascript.getLogger();
    var consoleAppender = new log4javascript.BrowserConsoleAppender();
    log.addAppender(consoleAppender);



    this.$get = function ($http, $location) {

        var loggingPattern = this.loggingPattern;
        return {
            enhanceAngularLog: function ($log) {
                $log.enabledContexts = [];

                $log.getInstance = function (context) {
                    return {
                        log: enhanceLogging($log.log, context, loggingPattern, "log"),
                        info: enhanceLogging($log.info, context, loggingPattern, "info"),
                        warn: enhanceLogging($log.warn, context, loggingPattern, "warn"),
                        debug: enhanceLogging($log.debug, context, loggingPattern, "debug"),
                        error: enhanceLogging($log.error, context, loggingPattern, "error"),

                        enableLogging: function (enable) {
                            $log.enabledContexts[context] = enable;
                        }
                    };
                };

                function enhanceLogging(loggingFunc, context, loggingPattern, type) {
                    return function () {

                        var contextEnabled = $log.enabledContexts[context];

                        if (contextEnabled === undefined || contextEnabled) {
                            var modifiedArguments = [].slice.call(arguments);

                            var errorObj = {
                                "stack": type == "error" || type == "warn" ? modifiedArguments[0].stack : "",
                                "message": type == "error" || type == "warn" ? modifiedArguments[0].message : modifiedArguments[0]

                            }
                            modifiedArguments[0] = [sprintf(loggingPattern, moment().format("dddd h:mm:ss a"), context)] + modifiedArguments[0];


                            var timestamp = sprintf(loggingPattern, moment().format("dddd h:mm:ss a"));



                            loginServer(timestamp.split('::[')[0], type, context, errorObj, "", "");

                            //loggingFunc.apply(null, modifiedArguments);
                        }
                    };
                }

                function loginServer(timestamp, level, controller, modifiedArguments, uriparams, requestid) {

                    var obj = new Object();
                    obj.timestamp = timestamp;
                    obj.level = level;
                    obj.controller = controller;
                    obj.stacktrace = modifiedArguments.stack;
                    obj.message = modifiedArguments.message;
                    obj.uriparams = $location.path();
                    obj.requestid = '';

                    if (level == "error") {

                        log.info(JSON.stringify(obj));
                    } else if (level == "info") {


                        log.info(JSON.stringify(obj));
                    } else if (level == "warn") {

                        log.info(JSON.stringify(obj));
                    } else if (level == "log") {

                        log.info(JSON.stringify(obj));
                    } else if (level == "debug") {

                        log.info(JSON.stringify(obj));
                    }

                    if (level != "debug") {
                        $http.post(staticPath, obj).then(function (response) {

                            //console.log("logging service response " + response);

                        }, function (error) {

                            //console.log("logging service threw an error; " + error);
                        });
                    }


                }
            }
        };
    };
});


angular.module('ParcelUI').config(['$httpProvider', function ($httpProvider) {

    $httpProvider.defaults.withCredentials = true;
    //$httpProvider.interceptors.push('timestampMarker');
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

angular.module('ParcelUI').config(['logEnhancerProvider', function (logEnhancerProvider) {
    logEnhancerProvider.loggingPattern = '%s::[%s]> ';
}]);

angular.module('ParcelUI').run(['$log', 'logEnhancer', function ($log, logEnhancer) {

    logEnhancer.enhanceAngularLog($log);
}]);

angular.module('ParcelUI').service('notification', ['$rootScope', function ($rootScope) {
    $rootScope.stack_bottomright = {
        "dir1": "up",
        "dir2": "left",
        "firstpos1": 50,
        "firstpos2": 25
    };
    PNotify.prototype.options.styling = "fontawesome";



}]);


angular.module('ParcelUI').run(['$rootScope', '$location', 'globalValues', '$localStorage', '$timeout', 'AuthFactory', 'BASEURL', function ($rootScope, $location, globalValues, $localStorage, $timeout, AuthFactory, BASEURL) {



    //var history = [];

    // this logic assumes '#' in angular app url

    $rootScope.baseUrl = extractBaseUrl();

    $rootScope.previousNav = {
        initUrl: extractBaseUrl(),
        state: "",
        url: "",
        lastChanger: true
    };
    $rootScope.history = [];
    $rootScope.getHistoryLastIndex = function () {
        return $rootScope.history.length ? $rootScope.history.length - 1 : 0;
    }

    function extractBaseUrl() {
        var initPath = $location.$$absUrl;
        var base = initPath.substr(0, initPath.indexOf('#'));
        var initUrl = base ? base + "#" : "";
        return initUrl;
    }

    function logtestmsg(msg) {

    }
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        
       /*if($location.url() != '/')
        document.cookie = "currentRoute=" + $location.url();*/
        
        if (BASEURL.IS_LOCAL === 1 && !localStorage.getItem("userdetails")) {
            AuthFactory.impersonateUserOnLocalEnv();
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (!globalValues.currentUserCompanyGuid || !globalValues.currentUserOfficeGuid || !globalValues.currentUserGuid) {
            var userDetails = JSON.parse(localStorage.getItem('userdetails'));
            if (userDetails) {
                var userName;
                for (var i = 0; i < userDetails.length; i++) {
                    if (userDetails[i].key === "EFF_USERGUID") {
                        globalValues.currentUserGuid = userDetails[i].value;
                    } else if (userDetails[i].key === "EFF_COMPANYGUID") {
                        globalValues.currentUserCompanyGuid = userDetails[i].value;
                    } else if (userDetails[i].key === "EFF_OFFICEGUID") {
                        globalValues.currentUserOfficeGuid = userDetails[i].value;
                    } else {}
                }
            }
        }

        if (fromState.abstract)
            $localStorage.$reset();

        //if (fromParams.reportGuid) localStorage.setItem('reportGuid', fromParams.reportGuid);
        //if (fromParams.projectGuid) localStorage.setItem('projectGuid', fromParams.projectGuid);

        if (toState.name.indexOf('ReportAuthoring') === -1)
            $('#siteId').val("");

        var current = fromState.url;
        var nextUrl = toState.url;

        var index = $rootScope.getHistoryLastIndex();
        var last = $rootScope.history[index];


        var sectionGUID = localStorage.getItem('sign_sectionGUID');
        if (current.toLowerCase() != "/sign") {
            if (sectionGUID) {
                localStorage.removeItem('sign_sectionGUID');
            }
        }

        if (last && nextUrl == last.url && last.changer == "location") {
            $rootScope.history.splice(index, 1);
            $rootScope.history[index - 1].changer = "state";
        } else {
            appendNav(current, "state");
            //$rootScope.splicedSuccessor = false;
        }

        $timeout(function () {
            $rootScope.$apply(function () {
                $rootScope.title = (toState.data && toState.data.pageTitle) ? toState.data.pageTitle : 'PARCEL';
            });
        });
    });

    var appendNav = function (current, changer) {
        var last = {
            url: current,
            changer: changer,
            home: changer == "location"
        };
        $rootScope.history.push(last);
    };


            }]);

var menuText = '';;
$(document).ready(function () {

    $("#navbarCollapse .dropdown-menu a").click(function () {
        if (menuText != this.text) {
            $(this).closest(".dropdown-menu").prev().dropdown("toggle");
        } else {
            $('#navbarCollapse,.in,.open').removeClass('in open');
        }
        menuText = this.text;
    });

    $("body").tooltip({
        selector: '[data-toggle=tooltip]'
    });

});

angular.module('ParcelUI').directive('focusMe',  function ($timeout,  $parse)  {  
    return  {     //scope: true,   // optionally create a child scope
            
        link:   function (scope,  element,  attrs)  {      
            var  model  =  $parse(attrs.focusMe);      
            scope.$watch(model,  function (value)  {        
                if (value)  {           
                    $timeout(function ()  {            
                        element[0].focus();           
                    });        
                }      
            });          
        }  
    };
});
