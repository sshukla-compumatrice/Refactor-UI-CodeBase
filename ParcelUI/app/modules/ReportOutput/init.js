var reportOutputModule = angular.module('ReportOutput', []);

reportOutputModule.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    var baseViewFolder = 'app/modules/ReportOutput/views/';
    var baseControllerFolder = 'app/modules/ReportOutput/controllers/';
    $stateProvider.state('reportOutput', {
        url: '/ReportOutput',
        templateUrl: baseViewFolder + 'reportOutput.html',
        controller: 'ReportOutputController as reportOutput' 
    })
    .state('reportOutputSetupT', {
        url: '/ReportOutputSetup',
        templateUrl: baseViewFolder + 'reportOutputSetup.html',
        controller: 'ReportOutputSetupController as reportOutputSetup' 
    });
}]);