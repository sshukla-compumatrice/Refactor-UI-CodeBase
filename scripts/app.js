var lenderPortalApp = angular.module('LenderPortal', ['ui.router.state', 'ui.bootstrap', 'logEnhancingModule', 'PropertyModule', 'SRFModule','PolicyManagerModule','ngResource', 'ui.select2']);

lenderPortalApp.config([
  '$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider',
  function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('Home', {
            'url': '/',
            'controller': 'DashBoardCtrl as dashboard',
            'templateUrl': 'modules/DashBoard/views/dashboard.html',
            'resolve' : {
                dashboardData : function(DashboardFactory){
                    var dashboardData =  DashboardFactory.getDashboardData();
                        return dashboardData.data;
                    
                }
            }
        })
  }
]);






lenderPortalApp.run(['$log', 'logEnhancer', '$http', 'applicationInfoSession', 'environmentInfoSession', 'SRFUrls', 'GUID', function ($log, logEnhancer, $http, applicationInfoSession, environmentInfoSession, SRFUrls, GUID) {

    //Will  be called only once after user logs in
    //Code has to be wriiten for that.
    environmentInfoSession.create();
    applicationInfoSession.create();
    GUID.create();

    var environmentObject = environmentInfoSession.getenvironmentInfo();
    var applicationObject = applicationInfoSession.getapplicationInfo();
    var guid = GUID.get();

    logEnhancer.enhanceAngularLog(applicationObject, environmentObject, SRFUrls, guid, $log, $http);
    
}]);


lenderPortalApp.directive('showErrors', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {

            var inputEl = el[0].querySelector("[name]");

            var inputNgEl = angular.element(inputEl);

            var inputName = inputNgEl.attr('name');

            var blurred = false;

            inputNgEl.bind('blur', function (elem) {

                blurred = true;
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });

            scope.$watch(function () {

                if (formCtrl[inputName] == undefined) {
                    return false;
                } else {

                    return formCtrl[inputName].$invalid;
                }

            }, function (invalid) {

                if (!blurred && invalid) {
                    return
                }

                el.toggleClass('has-error', invalid);
            });

            scope.$on('show-errors-check-validity', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            })


            scope.$on('show-errors-reset', function () {
                $timeout(function () {
                    el.removeClass('has-error');
                }, 0, false);
            });
        }
    }



}]);




lenderPortalApp.value("globalValues", {
    srfCabinetBtn: 'not clicked',
    srfBlockNavigation: '',
    pageRefreshed : false,
    dashBoardCollapseAll : false,
    dashBoardExpandAll : false


});

lenderPortalApp.run(['$rootScope','globalValues', function ($rootScope,globalValues) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {

        if(next === current){

            globalValues.pageRefreshed = true;
        }
        else{
            globalValues.pageRefreshed = false;
        }


        var myEvent = window.attachEvent || window.addEventListener;
        var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

        myEvent(chkevent, function (e) { // For >=IE7, Chrome, Firefox


            var confirmationMessage = 'All your unsaved data will be lost.'; // a space
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        });

    });

}])


lenderPortalApp.run(['$rootScope',function($rootScope){
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    
        
  });
}])

