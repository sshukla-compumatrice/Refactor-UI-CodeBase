angular.module('AccountMgmtModule').constant('commonUrlCollection', {
    GETAPI_REPORTTEMPLATE_MOCK: 'http://refactor.parcelplatform.com/companytemplates/companyID?filter=filter&reporttype=reportType',
    GETAPI_COMPREPORTEMPLATE_REAL:'/{companyguid}?filter={filter}&reporttype={reportType}',
    
    GETAPI_REPORTTYPES_MOCK: 'http://refactor.parcelplatform.com/reports/reporttypes',
    GETAPI_REPORTTYPES_REAL: '/reporttypes',
    
    GETAPI_SEARCHBYSITEID: '/siteid/{siteID}'
});