angular.module('ReportTemplates').constant('ReportTemplatesAPIUrlCollection', {

    GETAPI_TEMPLATESLIST: '{companyID}',
   

    GETAPI_TEMPLATEDEFAULTS: '{templateID}/defaults/{companyID}',

    PUTAPI_TEMPLATEDEFAULTS: '{templateID}/defaults/{companyID}',


   

    DELETEAPI_TEMPLATEDEFAULTS: '',
   
    GETAPI_DASHBOARDLIST: 'templatedashboards',
  
    GETAPI_TEMPLATESECTIONS: '{templateID}/sections',
 
    PUTAPI_TEMPLATES: '{templateID}',
  
    DELETEAPI_TEMPLATES: '{templateID}',
   
    POSTAPI_TEMPLATES: 'templates',

    PUTAPI_DEFAULTREPORTTEMPLATE: 'defaulttemplate/{companyID}/{reportType}/{clientCompanyID}',


    
});