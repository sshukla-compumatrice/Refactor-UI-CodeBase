angular.module('ProjectDashboard').constant('getProjectDashboardUrls', {

    mockImplementationGetProjectDetails: 'app/modules/ProjectDashboard/sampleJson/projectDashboardJSON.js.js',
    realImplementationGetProjectDetails: 'dashboard/project/{projectGuid}/{accountGuid}',
    mockImplementationUpdateProjectDetails: '',
    realImplementationUpdateProjectDetails: 'projects/',
    mockImplementationGetsiteDetails : 'reports/',
    realImplementationGetSiteDetails : 'reports/{reportGuid}/location',
    mockImplementationUpdatesiteDetails : 'reports/',
    realImplementationUpdatesiteDetails : 'reports/{reportGuid}/location',
    realImplementationUpdateReportStatus : 'reportstatus/',
    realImplemetationGetSignatureDetails : 'reports/{reportGUID}/signoffs/?reportsignoffguid={reportsignoffguid}',
    realImplemetationDeleteReports : 'reports/{reportGUID}',
    getDataForAddingReports : 'projectstartup/{companyGUID}/{userGUID}',
    realImplementationUpdateTasks : 'dashboard/tasks/{projectGuid}',
    realImplementationProjectList : 'projects?limit={limit}&offset={offset}',
    realImplementationAddReportsToProject : 'addreporttoproject',

    realImplementationGetProjectSearchList : 'projects?projectName={projectname}&limit={limit}&offset={offset}',
    realImplementationGetPdfList : 'dashboard/project/{projectGuid}/{accountGuid}?outputType=PDF',
    realImplementationAddSignatures : 'reports/signoffs',
    realImplementationUpdateSignatures : 'reports/signoffs',
    realImplementationSignatures : 'reports/signoffs/',
        
    realImplementationDeleteSignatures : 'reports/{reportGuid}/signoffs/{reportsignoffguid}',
    realImplementationGetPortfolioProjects : 'projects?filter={filter}&limit={limit}&offset={offset}',
    realImplementationSearchedPortfolioProjects : 'projects?filter={filter}&projectName={projectname}&limit={limit}&offset={offset}',
    realImplementationGetProjectReports : 'projects/{projectGuid}/reports',
    realImplementationGetTOC : 'tableofcontents?reportGUID={reportGuid}&depth={depth}',
    portfolioLocalStorageObject : 'app/modules/ProjectDashboard/staticdata/localStorageObject.js',
    realImplementationGetAppendices : 'appendices/{reportGuid}/{sectionGuid}/content',
    realImplementationGetReportOrdersList : 'report/{reportGuid}',
    realImplementationGetProjectOrdersList : 'project/{projectGuid}',
    realImplementationGetEDRStatusPage: 'edrorders/order/{orderGuid}/transferUrl',
    realImplementationSendMail : 'messages/',
    realImpemenationSpecificCountryUrl : 'countries/{code}',
    realImplementationGetLatLongUrl : 'addresses?sitename={sitename}&address1={address1}&city={city}&state={state}&country={country}&zipcode={zipcode}',
    
    realImplementationGetProjectSignoff: 'reports/signoffs/project/{projectGuid}',
    mockImplementationGetProjectSignoffJSON: 'app/modules/ProjectDashboard/staticdata/projectSignoffJSON.js',
    realImplementationDeleteReportSignOff:'reports/signoffs',
    realImplementationSearchProjectReports : 'projects/{projectGuid}?query={query}&limit={limit}&offset={offset}',
    realImplementationGetProjectsInfo : 'projects/{projectGuid}'

})


