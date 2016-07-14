angular.module('PortfolioCreation').controller('LenderPortfolioReportInformationController', ['$scope', '$log', '$state', '$modal', function ($scope, $log, $state, $modal) {

    var self = this;
    var main = $scope.lenderPortfolio;
    var existingProjectData = main.project;
    var loadedData = main.loadData;
    
    if (existingProjectData && existingProjectData.locations && existingProjectData.locations.length) {
        $state.go('LenderPortfolioCreation.UploadedSiteDetails');
    } else if (main.project.addSiteMethod == main.addSiteMethodTypes.upload) {
        $state.go('LenderPortfolioCreation.UploadSiteSpreadSheet');
    }


    self.locations = [{
        siteContact: {}
    }];
    self.locationCount = 0;
    
        
    main.getSubmitData = function () {
        var locations = angular.copy(self.locations);
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];
            if (location.reports) {
                for (var j = 0; j < location.reports.length; j++) {
                    var report = location.reports[j];
                    var valid = {
                        templateID: report.templateID,
                        templateGUID: report.templateGUID,
                        taskedCompanyID: report.ownerCompanyID,
                        taskedCompanyGUID: report.ownerCompanyGUID,
                        poNumber: location.poNumber
                    };
                    location.reports[j] = valid;
                }
            }
            delete location.poNumber;
        }

        var p = main;
        var data = angular.copy(p.project);
        data.locations = locations;
        return data;
    }
    main.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }
    
    self.addAnotherSite = function () {
        self.locationCount = self.locationCount + 1;
        self.locations.push({ siteContact: {} });
    }

}]);