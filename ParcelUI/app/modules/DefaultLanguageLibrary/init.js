// define module
angular.module('DefaultLanguageLibrary', ['ui.router.state', 'ui.bootstrap', 'colorpicker.module']);

// routers
angular.module('DefaultLanguageLibrary').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/DefaultLanguageLibrary/views/';
        $stateProvider.state('defaultLanguageLibrary', {
            'url': '/DefaultLanguage?languageLibraryGUID',
            'templateUrl': baseViewsFolder + 'DefaultLanguage.html',
            'controller': "DefaultLangLibCtrl as dll",
			'data': {
				pageTitle : "Default Language Library / PARCEL"
			}
        });
    }
]);