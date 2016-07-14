// define module
angular.module('ParcelWriter', ['ui.router.state', 'ui.bootstrap']);

// routers
angular.module('ParcelWriter').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/ParcelWriter/views/';

        $stateProvider.state('parcelWriter', {
            'url': '/ParcelWriter?projectGuid&reportGuid',

            'templateUrl': baseViewsFolder + 'parcelWriter.html',
            'data': {
                pageTitle: "Parcel Writer"
            },
            controller: "ParcelWriterController as parcelWriter",

            resolve: {
                parcelWriterData: ['ParcelWriterFactory', '$stateParams', function (ParcelWriterFactory, $stateParams) {
                    return ParcelWriterFactory.getWriterData($stateParams.reportGuid).then(function (response) {
                        return response;
                    }, function (error) {
                        return error;
                    })
                }]
            }


        })



    }
]);