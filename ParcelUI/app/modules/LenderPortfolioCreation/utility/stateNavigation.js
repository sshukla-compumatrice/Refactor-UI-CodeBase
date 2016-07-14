angular.module('LenderPortfolioCreation').constant('LenderPortfolioCreationStateNavigation', {
    'LenderPortfolioCreation.ProjectInformation': {
        nextState: 'LenderPortfolioCreation.ReportInformation'
    },
    'LenderPortfolioCreation.ReportInformation': {
        nextState: 'LenderPortfolioCreation.SelectConsultantWithFee'
    },
    'LenderPortfolioCreation.UploadSiteSpreadSheet': {
        nextState: 'LenderPortfolioCreation.UploadedSiteDetails',
        hasSuccessiveSection: true
    },
    'LenderPortfolioCreation.UploadedSiteDetails': {
        nextState: 'LenderPortfolioCreation.UploadedSitesReportSelection',
        hasSuccessiveSection: true
    },
    'LenderPortfolioCreation.UploadedSitesReportSelection': {
        nextState: 'LenderPortfolioCreation.SelectConsultantWithFee'
    },
    'LenderPortfolioCreation.SelectEnvironmentalConsultant': {
        nextState: 'LenderPortfolioCreation.Attachments'
    },
    'LenderPortfolioCreation.SelectConsultantWithFee': {
        nextState: 'LenderPortfolioCreation.Attachments'
    },
    'LenderPortfolioCreation.Attachments': {
        nextState: 'LenderPortfolioCreation.GrantAccess'
    },
    'LenderPortfolioCreation.GrantAccess': {
        nextState: 'LenderPortfolioCreation.ConfirmProjectInfo'
    },
    'LenderPortfolioCreation.ConfirmProjectInfo': {
        nextState: 'LenderPortfolioCreation.Success'
    }
});