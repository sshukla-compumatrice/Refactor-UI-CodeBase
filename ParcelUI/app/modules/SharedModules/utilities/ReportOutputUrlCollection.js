angular.module('ParcelUI').constant('ReportOutputUrlCollection', {

    POSTAPI_LOGGING: 'logging/logitems',
    POSTAPI_REPORT_GENERATION_REQUEST_MOCK: '{reportguid}/generations',
    POSTAPI_REPORT_GENERATION_REQUEST_REAL: '{reportguid}/generations',
    GETAPI_CONSTRUCTED_DOCUMENT_MOCK:'',
    GETAPI_CONSTRUCTED_DOCUMENT_REAL:'',
    GET_CONSTRUCTED_DOC_REAL:'documentgenerationservice/docgen/constructeddocuments/{constructeddocumentguid}',
    GET_DOCUMENT_REAL_DOWNLOAD:'files/{fileGuid}/stream',
    GET_DOCUMENT_REAL_VIEW:'files/{fileGuid}/stream?responseType=inline'


});
