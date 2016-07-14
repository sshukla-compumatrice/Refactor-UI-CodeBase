angular.module('ReportAuthoring').constant('ReportAuthoringUrlCollection', {
    GETAPI_ALLSECTIONS_MOCK: 'app/modules/ReportAuthoring/sampleJson/sampleSections.json',

    GETAPI_ALLSECTIONS_WITHLIMIT_MOCK: 'app/modules/ReportAuthoring/sampleJson/sampleSections_{offset}_{limit}.json',

    GETAPI_MOCK: 'app/modules/ReportAuthoring/sampleJson/{moduleName}/{sectionID}.json',

    GETTOC_MOCK: 'app/modules/ReportAuthoring/sampleJson/{moduleName}/TOC.json',

    // GETCOMMENTS_MOCK: 'app/modules/ReportAuthoring/sampleJson/sampleComments.json',

    GETAPI_ReportDefaulfLibrary_REAL: '{reportGUID}',

    GETCOMMENTS: 'comments?reportGUID={reportGUID}&sectionGUID={sectionGUID}&sortEnum={sortEnum}',
    PUTCOMMENTS: 'comments?reportGUID={reportGUID}&sectionGUID={sectionGUID}',
    GETALLCOMMENTS: 'comments?reportGUID={reportGUID}&sortEnum={sortEnum}',
    DELETECOMMENTS: 'deletecomments/',

    GETAPI_REPORTSIGNOFF_REAL: 'reports/{reportGuid}/signoffs',
    GETAPI_REPORTSIGNOFF_MOCK: 'app/modules/ReportAuthoring/sampleJson/reportSignoffJSON.js',
    GETAPI_REPORTSIGNOFFUSERS_REAL: 'users/?company={companyGuid}',
    GETAPI_REPORTSIGNOFFSINGLE_REAL: 'reports/{reportGuid}/signoffs?reportsignoffguid={reportsignoffguid}',

    GETHISTORY_MOCK: 'history?reportGUID={reportGUID}&sectionGUID={sectionGUID}',
    //GETHISTORY_MOCK: 'app/modules/ReportAuthoring/sampleJson/SampleHistoryData.js',
    UPDATESECTION_MOCK: 'sections?reportGUID={reportGUID}',
    GETAPI_ALLSECTIONS_REAL: 'sections?reportGUID={reportGuid}',

    GETAPI_REAL: 'sections?reportGUID={reportGuid}&sectionGUID={sectionGUID}',

    GETTOC_REAL: 'tableofcontents?reportGUID={reportGuid}&depth={depth}',
    UPDATESECTION_REAL: 'sections?reportGUID={reportGUID}',

    GET_SETUP_DEFAULTS:'reportsetup?reportGUID={reportGUID}',
    PUT_SETUP_DEFAULTS:'reportsetup?reportGUID={reportGUID}',
    GET_COVERPAGES_LIST:'deliverable/covers?companyGuid={companyGuid}',
    UPDATE_PREPOPULATED:'updatePrepopulatedData?reportGUID={reportGUID}',
    REPORTOUTPUTLIST:'reportOutputSetup?companyGUID={companyGUID}&type={type}',
    GETAPI_SEARCHBYSITEID: "reports/siteid/{siteID}",
    
    GET_VARIABLEREPLACER_KEYWORDS: 'reports/{reportGuid}/generalInfo',
    PUT_VARIABLEREPLACER_KEYWORDS: 'report/tools/variablereplacer/{reportGuid}',

    ACCT_USER: '/accountmgmt/#/accounts/company/office/user/view?companyguid={companyguid}&officeguid={officeguid}&userguid={userguid}',
        UPDATE_REPORTSTATUS: 'updateReportStatus?reportGUID={reportGuid}&level={level}',
    GET_PREV_EMAILED_REPORTS:'reports/{reportguid}/deliveries',
  //  GET_PREV_EMAILED_REPORTS:"http://private-865d6-parceldeliverableapi.apiary-mock.com/deliverable/{reportguid}/history",
    GET_ASSEMBLE_SECTIONS:'deliverable/{reportguid}/sections',
    GET_SECTIONDATA_EDIT: 'http://private-865d6-parceldeliverableapi.apiary-mock.com/deliverable/{reportGuid}/content/{generationType}',
    PUT_SECTIONDATA:'http://private-865d6-parceldeliverableapi.apiary-mock.com/deliverable/{reportGuid}/content/{generationType}',
    //GET_APPENDICESSECTIONS_ASSEMBLE:'http://private-66bb6-parcelappendixapi.apiary-mock.com/appendices/{reportGuid}',
    PUT_DISABLE_EMAILED_REPORTS:'http://private-865d6-parceldeliverableapi.apiary-mock.com/deliverable/links/{deliverableLinkGuid}',
    GETAPI_EDRIMPORTDATA_REAL: '{reportguid}/dataimport/',
    //UPLOAD_DELIVERABLESECTION:"http://private-865d6-parceldeliverableapi.apiary-mock.com/deliverable/{reportGuid}/upload",
    UPLOAD_DELIVERABLESECTION:"deliverable/{reportGuid}/upload?fileRequest={fileRequest}",
//    DELETE_DELIVERABLEDOCUMENTS:"http://private-865d6-parceldeliverableapi.apiary-mock.com/deliverable/{reportGuid}/upload/{deliverableSectionGuid}",
    DELETE_DELIVERABLEDOCUMENTS:"deliverable/{reportGuid}/upload/{deliverableSectionGuid}",
    
    //GET_APPENDICESSECTIONS_ASSEMBLE: 'tableofcontents?reportGUID={reportGuid}&depth=SHALLOW',
    GET_APPENDICESSECTIONS_ASSEMBLE: 'appendices/{reportGuid}?detail=statistics',

    GETAPI_EMAILDEFAULTS: 'deliverable/{reportGuid}/email',
    GETAPI_PARCELDATAIMPORTSTATUS: '{reportGuid}/dataimport/edrreportstatus/{reportType}',
    GET_VIEW_PDF_RESPONSE_TYPE: '?responseType=inline',
    GETAPI_DOWNLOADTABLEXCELFILEREQUEST: '{reportGuid}/dataimport/download/excel?sectionGuid={sectionGuid}&tableName={tableName}',
    POSTAPI_UPLOADTABLESPREADSHEET:'{reportGuid}/dataimport/upload/excel?sectionGuid={sectionGuid}&tableName={tableName}',
    GETAPI_DOWNLOADEXCELFILE: 'files/{fileGuid}/stream'
});

  
