angular.module('SRFModule').constant('SRFUrls', {

    //Urls

    getCabinets  :  'http://parredatapoc2:8080/lenderportalservice/rest/v1/companies/1218/cabinets/',
    updateCabinetDetails : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets/',
    createCabinets : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets',
    deleteCabinets : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets/',
    getCabinetDetails : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets/',

    getFormJSON  :  'http://parredatapoc2:8080/lenderportaldata/rest/srf/4/datafields',
    postFormData : 'http://parredatapoc2:8080/lenderportaldata/rest/srf/create',
    getreportsJSON : 'modules/SRF/staticdata/servicesJSON.js',
    postLogJSON : 'http://parredatapoc2:8080/logging/rest/v1.0/logging/logitems',
    emailTemplate : 'modules/SRF/views/directive-templates/emailTemplate.html',
    getFormStructure : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/forms/123/structure/'

});
