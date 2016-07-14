angular.module('ParcelUI').constant('BASEURL', {


    BASE_REPORTWRITINGADMIN_SERVICE: '//wwwdev.parcelplatform.com/reportwritingadminservice/',
    BASE_LIBRARIES_SERVICE: '//wwwdev.parcelplatform.com/librariesservice/',
    BASE_ACCOUNTMGMT_SERVICE: '//wwwdev.parcelplatform.com/accountmanagementservice/',
    BASE_PARCEL_SERVICE: '//wwwdev.parcelplatform.com/parcelservice/',
    BASE_ACTIVITY_SERVICE: '//wwwdev.parcelplatform.com/activityservice/',
    BASE_COREFILEMGMT_SERVICE: '//wwwdev.parcelplatform.com/corefilemanagementservice/files',
    BASE_APPENDICES_SERVICE: '//wwwdev.parcelplatform.com/appendicesservice/',
    BASE_EDRORDERING_SERVICE: '//wwwdev.parcelplatform.com/edrorderingservice/',
    BASE_REPORTWRITING_SERVICE: '//wwwdev.parcelplatform.com/reportwritingservice/',
    BASE_MESSAGE_SERVICE: '//wwwdev.parcelplatform.com/messageservice/',
    BASE_GEOCODE_SERVICE: '//wwwdev.parcelplatform.com/geocodeservice/',
    BASE_LOGGING_SERVICE: '//wwwdev.parcelplatform.com/loggingservice/',
    BASE_COREACCESSMGMT_SERVICE: '//wwwdev.parcelplatform.com/coreaccessmgmtservice/',
    BASE_SHAREDACCESSMGMT_SERVICE: '//wwwdev.parcelplatform.com/sharedaccessmgmtservice/',
    BASE_DELIVERABLE_SERVICE: '//wwwdev.parcelplatform.com/deliverableservice/',

    //Bidding Module
    BIDDING: '//private-bba0f-edrsharedbiddingapi.apiary-mock.com/',

    //Default Language Library Module
    DLLLIB: '//wwwdev.parcelplatform.com/reportwritingadminservice/libraries/',
    DLLCOMPLIB: '//wwwdev.parcelplatform.com/reportwritingadminservice/companylibraries/',
    DLLLIB_REF: '//wwwdev.parcelplatform.com/librariesservice/',
    DLL_SHARED: '//wwwdev.parcelplatform.com/accountmanagementservice/shared/accountmanagement/',

    //Landing Page Module//using both mock and real
    LANDINGPAGE_REAL: '//wwwdev.parcelplatform.com/parcelservice/dashboard/reports/',
    LANDINGPAGE_MOCK: '//private-d08ae-parceldashboardapi.apiary-mock.com/dashboard/reports/',

    //Lender Project Creation
    LENDERPROJECTCREATION_CONTACTS: '//private-0e50c-parcelcontactapi.apiary-mock.com/contacts/',
    LENDERPROJECTCREATION: '//wwwdev.parcelplatform.com/parcel/rest/',
    LENDERPROJECTCREATION_PROJECTSTARTUP: '//private-d1a21-parcelprojectstartup.apiary-mock.com/projectstartup/',
    LENDERPROJECTCREATION_POSTSINGLESITEPROJECT: '//private-e494f-parcelprojectstartup.apiary-mock.com/projectstartup/',

    //project creation
    PROJECTCREATION_PROJECTSTARTUP: "//wwwdev.parcelplatform.com/parcelservice/projectstartup/",
    PROJECTCREATION_CONTACTS: "//wwwdev.parcelplatform.com/parcelservice/contacts/",
    PROJECTCREATION_PROJECTDOCUMENTS: "//wwwdev.parcelplatform.com/parcelservice/",
    PROJECTCREATION_PROJECTDOCUMENTS_MOCK: "//private-ff4cf-parcelprojectapi.apiary-mock.com/projects/projectGuid/documents",
    PROJECTCREATION_PROJECTDOCUMENTS_UPLOAD: "//wwwdev.parcelplatform.com/corefilemanagementservice/files",
    PROJECTCREATION_PROJECTDOCUMENTS_DELETE: "//wwwdev.parcelplatform.com/corefilemanagementservice/files/",

    //DashBoard
    parcelPOC: '//wwwdev.parcelplatform.com/parcelservice/',
    appendicesPOC: '//wwwdev.parcelplatform.com/appendicesservice/',
    APPENDICES_EDRDRAWINGTOOL: '//wwwdev.parcelplatform.com/edrorderingservice/edrorders/',
    reportWritingPOC: '//wwwdev.parcelplatform.com/reportwritingservice/',
    messagingServicePOC: '//wwwdev.parcelplatform.com/messageservice/',
    parcelPlatform: '//wwwdev.parcelplatform.com/messageservice/',
    reportWritingAPI: '//wwwdev.parcelplatform.com/reportwritingservice/',

    //Report Authoring
    REPORTAUTHORING_APPENDICES: '//private-33015-parcelappendixapi.apiary-mock.com/appendices/',
    REPORTAUTHORING_PHOTOS_MOCK: '//private-33015-parcelappendixapi.apiary-mock.com/photos/',
    REPORTS: '//wwwdev.parcelplatform.com/parcelservice/reports/',
    REPORTAUTHORING: '//wwwdev.parcelplatform.com/reportwritingservice/',
    EDR_ORDER: '//wwwdev.parcelplatform.com/edrorderingservice/edrorders/',
    //REPORTAUTHORING_HISTORY: '//wwwdev.parcelplatform.com/reportwritingservice/',
    ACCOUNT_MGMT_API: '//wwwdev.parcelplatform.com/accountmanagementservice/shared/accountmanagement/',
    REPORTAUTHORING_GEODEV: '//wwwdev.parcelplatform.com/geocodeservice/geocode/',
    GET_EDRSTATUSPAGE: '//private-a65d5-sharededrorderapi.apiary-mock.com/',
    UPDATE_LATLONG: 'http://wwwdev.parcelplatform.com/parcelservice/properties/',
    GET_PORTFOLIOORDERSTATUS: 'http://wwwdev.parcelplatform.com/edrorderingservice/edrorders/portfolioorder/',

    

    REPORTAUTHORING_APPENDICES_COREFILES: '//wwwdev.parcelplatform.com/corefilemanagementservice',

    //Report Templates 
    REPORTTEMPLATES_COMPTEMPLATES: '//wwwdev.parcelplatform.com/parcelservice/companytemplates/',
    REPORTTEMPLATES_TEMPLATES: '//wwwdev.parcelplatform.com/parcelservice/templates/',
    REPORTTEMPLATES_PARCELSERVICE: '//wwwdev.parcelplatform.com/parcelservice/',

    //Shared Modules
    SHARED_LOGGING: '//wwwdev.parcelplatform.com/loggingservice/',
    SHARED_GEOCODE: "//wwwdev.parcelplatform.com/geocodeservice/geocode/",

    // Core File Management
    GET_FOLDERS: "//wwwdev.parcelplatform.com/parcelservice/projects/",
    GET_FOLDER_FILES: "//wwwdev.parcelplatform.com/corefilemanagementservice/files/",
    PARCEL_API: '//wwwdev.parcelplatform.com/',
    GET_COREFILE: '//wwwdev.parcelplatform.com/corefilemanagementservice/',
    // Core File Management Ends

    FILLINGCABINET_POC: '//wwwdev.parcelplatform.com/corefilemanagementservice/files/',

    //Auth Urls
    POSTAPI_GETAUTHTOKEN: '//identitydev.edrcore.com/openam/json/authenticate',
    POSTAPI_GETAUTHCODE: '//identitydev.edrcore.com/openam/oauth2/authorize',
    GET_SESSIONTOKEN: '//wwwdev.parcelplatform.com/coreaccessmgmtservice/sessiontokens',
    REDIRECT_OAUTHPAGE: '//wwwdev.parcelplatform.com/Oauth.html',
    REDIRECT_LOGOUT: '//identitydev.edrcore.com/openam/UI/Logout',
    ACCOUNT_MGMT: '//wwwdev.edrcore.com/accountmgmt/#/',
    ACCESS_MGMT: '//wwwdev.parcelplatform.com/sharedaccessmgmtservice/',
    BASE_PARCELDATAIMPORT_SERVICE: '//wwwdev.parcelplatform.com/parceldataimportservice/report/',
    // temporary flags to disable OATH
    IS_LOCAL: 1,
    IS_OTHERENV: 0,
    DevEnv: false,
    APPLICATIONGUID : '45be52b1-d7f3-11e5-9675-0e29c2a821a7',

    // PHP bridge
    APP_BRIDGE: "//wwwdev.parcelplatform.com",

    //file config constants
    maxNumberOfFile: 20,
    maxSizeOfFile: 10485760,
    APPENDIX_FILE_UPLOAD_SIZE_LIMIT: '26214400',

    loggerUrl: '//wwwdev.parcelplatform.com/loggingservice/',

    //company list for dll
    companies: [{
        companyGUID: "d7c051ed-fa1c-48d6-8d71-f3947d768e3d",
        companyID: "602",
        name: "172d Airlift Wing MS ANG"
  }, {
        companyGUID: "cd024ac2-f962-472f-acf1-1dc4238c321e", //A744B47F-529A-40FF-B6C1-33C504A1AAAE",
        companyID: "1218",
        name: "Lauenstein & Associates"
  }, {
        companyGUID: "1086ef14-8c71-437f-a6f6-95457a41c225", //cd024ac2-f962-472f-acf1-1dc4238c321e
        companyID: "5030",
        name: "Land Environmental Group"
  }]
});

var Analytics = {
    Heap: {
        APPID: "3705138"
    },
    NewRelic: {
        applicationID: "12288"
    }
};