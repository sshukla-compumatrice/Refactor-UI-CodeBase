angular.module('PortfolioCreation').controller('PortfolioFeeInfoCtrl', ['$scope', '$state', function ($scope, $state) {

    var self = this;
    $scope.portfolio.currentSection = $scope.portfolio.sectionCollection.FeeInformation;

    self.tableArr = [];

    $("#ulnavigation .active").removeClass('active');
    $("#ulnavigation #FeeInformation").addClass('active');

    var loadData = function () {
        var loadedData = $scope.portfolio.loadData;
        var locations = angular.copy($scope.portfolio.project.locations);
        if (locations) {
            for (var i = 0; i < locations.length; i++) {
                var loc = locations[i];

                var propNo = loc.propertyNumber;
                var address = loc.address1;

                if (loc.reports) {
                    for (var j = 0; j < loc.reports.length; j++) {
                        var temp = loc.reports[j];

                        temp.locationIndex = i;
                        temp.propertyNumber = propNo;
                        temp.address = address;

                        temp.name = loc.name;
                        temp.propertyTypeGUID = loc.propertyTypeGUID;
                        temp.country = loc.country;
                        temp.city = loc.city;
                        temp.state = loc.state;
                        temp.zip = loc.zip;
                        temp.county = loc.county;
                        temp.latitude = loc.latitude;
                        temp.longitude = loc.longitude;
                        temp.transactionTypeGUID = loc.transactionTypeGUID;
                        temp.siteContact = loc.siteContact;

                        for (var k = 0; k < loadedData.templates.length; k++) {
                            var local = loadedData.templates[k];
                            if (local.templateID == temp.templateID) {
                                temp.reportType = local.reportType;
                                temp.languageLibraryGUID = local.defaultLanguageLibraryGUID;
                                break;
                            }
                        }
                        self.tableArr.push(temp);
                    }
                }
            }
        }
    };

    var copyNestedObjToRemoveRef = function () {
        var locations = angular.copy($scope.portfolio.project.locations);
        if (locations) {
            for (var i = 0; i < locations.length; i++) {
                var loc = locations[i];

                var templateColl = [];
                if (loc.reports) {
                    for (var j = 0; j < loc.reports.length; j++) {
                        var temp = loc.reports[j];

                        // clone report template object to avoid having duplicate entries
                        // duplicate entries will break the ng-repeat
                        var clone = angular.copy(temp);

                        // need to override consultant with original val
                        // to bind selected value
                        clone.consultant = temp.consultant;

                        templateColl.push(clone);
                    }
                    delete loc.reportTemplates;
                    loc.reportTemplates = templateColl;
                }
            }
        }
    }

    // declare init and call
    var init = function () {
        copyNestedObjToRemoveRef();
        loadData();
    }
    init();


    var main = $scope.portfolio;
    main.getSubmitData = function () {

        var locationContainer = {};
        for (var i = 0; i < self.tableArr.length; i++) {
            var row = self.tableArr[i];

            locationContainer[row.locationIndex] = locationContainer[row.locationIndex] || {
                propertyNumber: row.propertyNumber,
                address1: row.address,
                name: row.name,
                propertyTypeGUID: row.propertyTypeGUID,
                country: row.country,
                city: row.city,
                state: row.state,
                zip: row.zip,
                county: row.county,
                latitude: row.latitude,
                longitude: row.longitude,
                transactionTypeGUID: row.transactionTypeGUID,
                siteContact: row.siteContact,
                reports: []
            };
            var currentLocation = locationContainer[row.locationIndex];

            var report = {
                templateID: row.templateID,
                templateGUID: row.templateGUID,
                languageLibraryGUID: row.languageLibraryGUID,
                taskedCompanyID: row.consultant ? row.consultant.companyGUID : null,
                projectNumber: row.projectNumber,
                poNumber: row.poNumber,
                fee: row.fee,
                templateVersionGUID: row.templateVersionGUID
            };
            currentLocation.reports.push(report);
        }

        var locationColl = [];
        for (var index in locationContainer) {
            locationColl.push(locationContainer[index]);
        }

        var data = angular.copy($scope.portfolio.project);
        data.locations = locationColl;
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

    $scope.fillDown = function (paramfee, paramPrjNumber) {
        angular.forEach(self.tableArr, function (tblobj) {

            if (paramfee != '') {
                tblobj.fee = paramfee;
            }
            if (paramPrjNumber != '') {
                tblobj.projectNumber = paramPrjNumber;
            }
        });
    }

}]);
