angular.module('ReportSetup').constant('ReportOutputSetupAPIUrlCollection', {

    GETAPI: '',
    //GETAPI_MOCK: 'http://private-8af9d-parcelreportoutputsetupservice.apiary-mock.com/reportoutputsetup/{reportOutputSetupID}',
    GETAPI_MOCK: 'app/modules/ReportSetup/services/sampleJson/sampleSetup_{reportOutputSetupID}.json',

    POSTAPI: '',
    POSTAPI_MOCK: '',

    PUTAPI: '',
    PUTAPI_MOCK: '{reportOutputSetupID}',

    DELETEAPI: '',
    DELETEAPI_MOCK: '{reportOutputSetupID}',


    GETLISTAPI: '',
    GETLISTAPI_MOCK: 'app/modules/ReportSetup/services/sampleJson/sampleSetupList_{type}.json'

});