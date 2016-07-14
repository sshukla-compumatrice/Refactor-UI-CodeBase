var propertyApp = angular.module('PropertyModule',['ui.router.state']);

propertyApp.config([ '$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider',function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.when('/Property', '/Property/Overview');

    $stateProvider.state('Property',{
            'url' : '/Property',
            'abstract' : true,
            'templateUrl' : 'modules/Property/views/property.navigation.html',

            'controller' :  'PropertyNavCtrl as propertynav',
            //'params': {'address' : '', 'city' : '', 'state' : '','zip' : ''},
            'resolve' : {
                navLinks : function(PropertyDetailsFactory){
                   return PropertyDetailsFactory.GetNavLinks().then(function(result){

                        return result;
                    });

                },


                PropertyLoanData: function (GetSRFFormDataFactory) {
                    return GetSRFFormDataFactory.propertySectionalForm().then(function(result){
                        return result;

                    });

                }
            }

        }).
        state('Property.Overview',{
            'url' : '/Overview?LocationID&PID',
            'templateUrl' : 'modules/Property/views/property.overview.html',


            'controller' :  'PropertyOverviewCtrl as propertyoverview'


        }).
        state('Property.Valuation',{
            'url' : '/Valuation',
            'templateUrl' : 'modules/Property/views/property.valuation.html',

            'controller' :  'PropertyValuationCtrl as propertyvaluation'

        }).
        state('Property.Environmental',{
            'url' : '/Environmental',
            'templateUrl' : 'modules/Property/views/property.environmental.html',
            'controller' :  'PropertyEnvironmentalCtrl as propertyenvironmental'
        }).
        state('Property.Flood',{
            'url' : '/Flood',
            'templateUrl' : 'modules/Property/views/property.flood.html',
            'controller' :  'PropertyFloodCtrl as propertyflood'
        }).
        state('Property.InspectionServices',{
            'url' : '/InspectionServices',
            'templateUrl' : 'modules/Property/views/property.inspectionsefvices.html',
            'controller' : 'PropertyInspectionSvcCtrl as propertyinspectionsvc'
        }).
        state('Property.AdditionalServices',{
            'url' : '/AdditionalServices',
            'templateUrl' : 'modules/Property/views/property.additionalservices.html',
            'controller' :  'PropertyAdditionalSvcCtrl as propertyadditionalsvc'
        }).
        state('Property.ReportStatus',{
            'url' : '/ReportStatus',
            'templateUrl' : 'modules/Property/views/property.reportstatus.html',
            'controller' :  'PropertyReportStatusCtrl as propertyreportstatus'
        }).
         state('Property.FileManager',{
            'url' : '/FileManager',
            'templateUrl' : 'modules/Property/views/property.filemanager.html',
            'controller' :  'PropertyFileManagerCtrl as propertyfilemanager'
        }).
         state('Property.Monitoring',{
            'url' : '/Monitoring',
            'templateUrl' : 'modules/Property/views/property.monitoring.html',
            'controller' :  'PropertyMonitoringCtrl as propertymonitoring'
        }).
         state('Property.Notepad',{
            'url' : '/Notepad',
            'templateUrl' : 'modules/Property/views/property.notepad.html',
            'controller' :  'PropertyNotepadCtrl as propertynotepad'
        })
}])

