angular.module('AccessManagement').constant('BASEURL',{

    //Logging
    LOGGING: 'http://wwwdev.parcelplatform.com/logging/logging/logitems',

    //Account Management
    ACCOUNT_MGMT: 'http://wwwdev.parcelplatform.com/accountmanagementservice/shared/accountmanagement',

    //Core File Management
    COREFILE_MGMT: 'http://wwwdev.parcelplatform.com/corefilemanagementservice/files',

    //Geocode
    GEOCODE: 'http://wwwdev.parcelplatform.com/geocodeservice/geocode',

    //Report Templates
    REPORT_TEMPLATES: 'http://wwwdev.parcelplatform.com/parcelservice/companytemplates',
    
    //Report
    REPORT: 'http://wwwdev.parcelplatform.com/parcelservice/reports',
    
    // Const GUIDs
    COMPANY_GUID: 'cd024ac2-f962-472f-acf1-1dc4238c321e', // Benchmark Environmental Consultants
    OFFICE_GUID: '5d96e57b-5571-4914-88b3-ce07d0c592bf', //Dallas, TX
    USER_GUID: 'bbc8bb95-f8d0-42aa-b053-00f187134f16', //devuser@benchmarkenviro.com

    //Core Access Management
    ACCESS_MGMT_CORE: 'http://wwwdev.parcelplatform.com/coreaccessmgmtservice',
    
    //shared Access Management
    ACCESS_MGMT_SHARED: 'http://wwwdev.parcelplatform.com/sharedaccessmgmtservice',
    
    //Messaging Service
    MESSAGE_SERVICE: 'http://wwwdev.parcelplatform.com/messageservice',
    
    //Shared File mgmt
    SHAREDFILEMGMT_SERVICE: '//wwwdev.parcelplatform.com/sharedfilemanagementservice',

    //Constants
    ASSETGUID: 'A0F5E294-B497-4C16-8FA4-5dfC9413530F',
    APPLICATIONGUID: '45be52b1-d7f3-11e5-9675-0e29c2a821a7',
    TEMPLATEGUID: 'c6d712d6-1db6-11e6-9675-0e29c2a821a7',
    TEMPLATENAME: 'ResetPassword',
    EMAILLINK: 'http://wwwdev.parcelplatform.com/accountmgmt/#/ResetPassword',
    PARCELSUPPORTEMAIL : 'parcelsupport@edrnet.com',
    
    PARCELSUPPORTPHONE : '866-475-1272',
    
    //Auth Urls
    POSTAPI_GETAUTHTOKEN: '//identitydev.edrcore.com/openam/json/authenticate',
    POSTAPI_GETAUTHCODE: '//identitydev.edrcore.com/openam/oauth2/authorize',
    REDIRECT_OAUTHPAGE: '//wwwdev.parcelplatform.com/Oauth.html',
    REDIRECT_LOGOUT: '//identitydev.edrcore.com/openam/UI/Logout',
    
    // temporary flags to disable OATH
    IS_LOCAL: 1,
    IS_OTHERENV: 0,
    DevEnv: false
});