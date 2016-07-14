angular.module('ProjectCreation').constant('UrlColl', {

    GETAPI_PROJECTINFO: '{companyID}/{userID}',

    POSTAPI_PROJECT: '',

    POSTAPI_DRAFTPROJECT: "draft",
    PUTAPI_DRAFTPROJECT: "draft/{draftID}",

    GETAPI_CONTACTS: 'search/{companyID}',
    POSTAPI_CONTACT: '',
    PUTAPI_CONTACT: '{contactID}',
    GETAPI_ACCOUNTUSER: 'users/{userID}',



    GET_PROJECTSEARCH: 'dashboard/projectsearch?field1={field1}&type1={type1}&text1={text1}&field2={field2}&type2={type2}&text2={text2}&reportTypes={reportTypes}',

    GET_REPORTTYPES: 'reports/reporttypes',

    GET_PROJECTSEARCHFIELDS: 'projectsearch/fields',
    
    GET_FOLDERS:'{projectGuid}/documents',
    
    GET_FOLDER_FILES:'?fileRequestJson={fileRequestJson}',
    
    UPLOAD_FILES:'?fileRequest={fileRequest}',
    
    DELETE_FILES:'{fileguid}'


});
