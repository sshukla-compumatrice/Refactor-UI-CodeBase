angular.module('LenderProjectCreation').constant('Urls', {
    getLibraries: 'libraries/1',
    getOffices: 'offices/1',
    getPropertyTypes: 'propertytypes',
    getRelatedCompanies: 'relatedcompanies/1',
    getTeams: 'teams/1',
    getTemplates: 'templates/1/projectSetup',
    getTransactionTypes: 'transactiontypes',

    postProjectCreationData: 'project',



    getProjectStartupFormData: '{companyID}',
    postSingleSiteProjectFormData: '',

    getCompanyContacts: 'search/{companyID}',
    addContact: '',
    editContact: '{contactID}',

    postLogJSON: "logger/log"

});
