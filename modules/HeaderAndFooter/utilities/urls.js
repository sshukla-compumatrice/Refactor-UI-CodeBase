lenderPortalApp.constant('HeaderAndFooterUrls', {

   // samplefile  : 'modules/HeaderAndFooter/staticdata/'
    getOfficesCabinets : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/companies/1218/cabinets/',
    getRecentLoans : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/users/{UserID}/loans/recent?limit={limit}&offset={offset}',
    getSearchedLoans : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/companies/{CompanyID}/loans?term={data}&limit={limit}&offset={offset}'

});
