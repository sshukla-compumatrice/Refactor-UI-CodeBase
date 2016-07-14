angular.module('ReportAuthoring').constant('ReportOutputUrlCollection', {
    GETAPI_EXECUTIVESUMMARY: 'sections?reportGUID={reportGUID}&sectionGUID={sectionGUID}',

    GETAPI_DETAILREPORT: 'reportGUID={reportID}',
    
    GETAPI_DETAILREPORTCOMMENTS : 'comments?reportGUID={reportGUID}',
    
    GETAPI_COSTTABLE : 'sections?reportGUID={reportGUID}&sectionGUID={sectionGUID}',
    
    GETAPI_COSTTABLEEXCEL : 'sections?reportGUID={reportGUID}&sectionGUID={sectionGUID}'
});