var srfApp = angular.module('SRFModule', ['ui.router.state']);



srfApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/SRF', '/SRF/Cabinet');

    $stateProvider.state('SRF', {
        'url': '/SRF',
        'abstract': true,
        'templateUrl': 'modules/SRF/views/srf.navigation.html',
        'controller': 'SRFNavCtrl as srfnav',
        'params': {
            'view': null
        },
        'resolve': {
            SectionViewLoanData: function (GetSRFFormDataFactory) {


                return GetSRFFormDataFactory.sectionalForm().then(function (result) {
                    return result;
                })



            }
        }

    }).

    state('SRF.Cabinet', {
        'url': '/Cabinet',
        'templateUrl': 'modules/SRF/views/srf.cabinet.create.html',
        'controller': 'SRFCabinetCtrl as srfcabinet',
        'params': {
            'view': null
        }


    }).


    state('SRF.CreateSectionViewLoan', {

        'url': '/CreateLoan/SectionalForm',
        'templateUrl': 'modules/SRF/views/srf.createloan.section.html',
        'controller': 'SRFSectionalViewLoanCtrl as sectionalloan'
    }).

    state('ManageCabinet', {
        'url': '/ManageCabinet',
        'templateUrl': 'modules/SRF/views/srf.cabinet.manage.html',
        'controller': 'SRFManageCabinetCtrl as managecabinet'


    })


}])
