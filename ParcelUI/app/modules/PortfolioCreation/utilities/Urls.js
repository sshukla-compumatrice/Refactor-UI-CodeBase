angular.module('PortfolioCreation').constant('PortfolioCreationUrlColl', {
    
    MockGETAPI: 'app/modules/ProjectCreation/sampleJson/ProjectStartup.js',
    GETAPI: 'http://private-e494f-parcelprojectstartup.apiary-mock.com/projectstartup/{companyID}',
    
    POSTAPI: 'http://private-e494f-parcelprojectstartup.apiary-mock.com/projectstartup/{companyID}',
    MockPOSTAPI: 'app/modules/PortfolioCreation/sampleJson/postResponse.js',
    
    PUTAPI: 'http://private-e494f-parcelprojectstartup.apiary-mock.com/projectstartup/{projectID}'
})