angular.module('PortfolioCreation').controller('LenderUploadedSitesReportSelectionCtrl', ['$scope', function ($scope) {
    
    var self = this;
    var portfolio = $scope.lenderPortfolio;
    var project = portfolio.project;

    self.data = {
        locations: []
    };

    var loadData = function () {
        if (project.locations && project.locations.length) {
            for (var i = 0; i < project.locations.length; i++) {
                var location = project.locations[i];
                var clone = angular.copy(location);
                self.data.locations.push(clone);
            }
        }
    }
    loadData();
  
    portfolio.getSubmitData = function () {
        var locations = angular.copy(self.data.locations);
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];
            if (location.reports) {
                for (var j = 0; j < location.reports.length; j++) {
                    var report = location.reports[j];
                    var valid = {
                        taskedCompanyID: report.ownerCompanyID,
                        taskedCompanyGUID: report.ownerCompanyGUID,
                        templateID: report.templateID,
                        templateGUID: report.templateGUID,                        
                        libraryID: report.libraryID,
                        libraryGUID: report.libraryGUID,
                        projectNumber: report.projectNumber,
                        poNumber: report.poNumber,
                        fee: report.fee
                    };
                    location.reports[j] = valid;
                }
            }
            delete location.poNumber;
        }
        
        var p = portfolio;
        var data = angular.copy(p.project);
        data.locations = locations;
        return data;
    }
    portfolio.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    portfolio.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }

}])