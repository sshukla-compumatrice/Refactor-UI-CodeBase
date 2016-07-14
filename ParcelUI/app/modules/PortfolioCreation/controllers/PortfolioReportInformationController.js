angular.module('PortfolioCreation').controller('PortfolioReportInformationController', ['$scope', '$log', '$state', '$modal', '$compile', function ($scope, $log, $state, $modal, $compile) {


    if ($scope.portfolio.addSiteMethod == $scope.portfolio.addSiteMethodTypes.manual) {
        if ($scope.portfolio.project && $scope.portfolio.project.locations && $scope.portfolio.project.locations.length) {
            $state.go('PortfolioCreation.UploadedSiteDetails');
        }
    } else if ($scope.portfolio.project && $scope.portfolio.addSiteMethod == $scope.portfolio.addSiteMethodTypes.upload) {
        $state.go('PortfolioCreation.UploadSiteSpreadSheet');
    }

    $("#ulnavigation .active").removeClass('active');
    $("#ulnavigation #ReportInformation").addClass('active');


    var self = this;
    self.locationCount = 0;
    self.poNumber = '';
    self.isSiteAdded = false;
    $scope.portfolio.currentSection = $scope.portfolio.sectionCollection.reportInformation;

    if ($scope.portfolio.project.locations) {
        self.locations = angular.copy($scope.portfolio.project.locations);
        self.locationCount = self.locations.length + 1;
        self.locations.push({
            siteContact: {}
        });

    } else {
        self.locations = [{
            siteContact: {}
    }];
    }


    var main = $scope.portfolio;
    main.getSubmitData = function () {
        var locations = angular.copy(self.locations);
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];

            if (location && location.country && location.country.name) {
                location.country = location.country.name;
            }
            if (location && location.state && location.state.name) {
                location.state = location.state.name;
            }

            if (location.reports) {
                for (var j = 0; j < location.reports.length; j++) {
                    var report = location.reports[j];
                    var valid = {
                        templateID: report.templateID,
                        templateGUID: report.templateGUID,
                        taskedCompanyID: report.ownerCompanyID,
                        templateVersionGUID: report.templateVersionGUID,
                        taskedCompanyGUID: report.ownerCompanyGUID,
                        poNumber: self.poNumber

                    };
                    location.reports[j] = valid;
                }
            }
        }

        var p = $scope.portfolio;
        var data = angular.copy(p.project);
        data.locations = locations;
        data.addSiteMethod = $scope.portfolio.addSiteMethod;
        return data;
    }
    main.clearErrorDisplay = function () {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function (errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }

    self.addAnotherSite = function () {


        if ((self.locations[self.locationCount].address1 && self.locations[self.locationCount].state) && (self.locations[self.locationCount].zip && self.locations[self.locationCount].reports.length > 0)) {
            angular.element('#propertyname').focus();
            self.locationCount = self.locationCount + 1;
            self.locations.push({
                siteContact: {}
            });

            self.isSiteAdded = true;
            $('body').scrollTop(0);
        }
    }


}]);
