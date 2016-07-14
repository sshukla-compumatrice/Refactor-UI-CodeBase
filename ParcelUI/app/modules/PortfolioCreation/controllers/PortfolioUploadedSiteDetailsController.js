angular.module('PortfolioCreation').controller('PortfolioUploadedSiteDetailsCtrl', ['$scope', '$modal', '$state', function ($scope, $modal, $state) {

    var self = this;
    var main = $scope.portfolio;

    $("#ulnavigation .active").removeClass('active');
    $("#ulnavigation #ReportInformation").addClass('active');
    var existingProjectData = main.project;
    self.data = angular.copy(existingProjectData);

    self.siteDetails = [];

    var parseLoadData = function () {
        var locations = self.data ? self.data.locations : null;

        if (locations && locations.length) {
            var cloned = angular.copy(locations);
            for (var i = 0; i < cloned.length; i++) {
                var loc = cloned[i];

                var toPush = parseIntoBindObj(loc, loc.siteContact, i);
                if (toPush.reports) {
                    toPush.poNumber = toPush.reports[0].poNumber;
                    toPush.projectNumber = toPush.reports[0].projectNumber
                }

                self.siteDetails.push(toPush);
            }
        }

        //var pushbindObj = function (location, index, contact) {
        //    var toPush = parseIntoBindObj(location, contact, index);
        //    self.siteDetails.push(toPush);
        //}
        //executeFnOnReportTemplates(locations, null, pushbindObj, commonContact);
    }

    var parseIntoBindObj = function (location, contact, index) {
        var temp = angular.copy(location);
        temp.latitude = temp.latitude == 0 ? '0.0000' : temp.latitude;
        temp.longitude = temp.longitude == 0 ? '0.0000' : temp.longitude;
        temp.index = index;
        temp.contact = contact.name;
        temp.phone = contact.phone;
        temp.fax = contact.fax;
        temp.email = contact.email;
        return temp;

        /*return {
            index: index,
            projectNumber: location.projectNumber,
            propertyNumber: location.propertyNumber,
            name: location.name,
            address1: location.address1,
            address2: location.address2,
            city: location.city,
            state: location.state,
            zip: location.zip,
            country: location.country,
            county: location.county,
            latitude: location.latitude,
            longitude: location.longitude,
            contact: contact.name,
            phone: contact.phone,
            fax: contact.fax,
            email: contact.email,
            poNumber: location.poNumber,
            transactionType: location.transactionType,
            reports: location.reports
        };*/
    }



    var clearScreenData = function () {
        self.siteDetails = [];
    }
    var init = function () {
        clearScreenData();
        parseLoadData();
    }

    init();

    main.getSubmitData = function () {

        var p = main;
        var data = angular.copy(p.project);
        angular.forEach(self.data.locations, function (loc) {
            if (loc.reports) {
                angular.forEach(loc.reports, function (report) {
                    report.poNumber = loc.poNumber;
                    report.projectNumber = loc.projectNumber;
                });
                if (loc.reports.length == 1) {
                    if (!loc.reports[0].templateGUID) {
                        delete loc.reports;
                    }
                }
            }
            if (angular.isObject(loc.state)) {
                var stateName = loc.state.name;
                delete loc.state
                loc.state = stateName;
            }

            if (angular.isObject(loc.country)) {
                var countryName = loc.country.name;
                delete loc.country
                loc.country = countryName;
            }
            delete loc.projectNumber;
            delete loc.poNumber;
        });

        data.locations = self.data.locations;
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



    self.deleteSite = function (site) {
        var locations = self.data.locations;
        locations.splice(site.index, 1);
        init();
    }

    self.editSite = function (site) {
        //$state.go('PortfolioCreation.AddLocation');

        self.editModalDataContainer = {
            location: site,
            action: 'Edit',
            index: site.index
        };

        var modalInstance = $modal.open({
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.AddLocation.html',
            scope: $scope,
            controller: 'PortfolioAddLocationCtrl as addLocation',
            size: 'lg',
            windowClass: 'app-modal-window',
            resolve: {
                modalDataContainer: function () {

                    return self.editModalDataContainer;
                }
            }
        });

        modalInstance.result.then(function () {
            /*data.locations[self.editModalDataContainer.index] = self.editModalDataContainer.location;
            init();*/

            var edited = self.editModalDataContainer.location;

            if (edited) {
                /*data.locationCount = data.locationCount + 1;
                data.locations[data.locationCount] = self.modalDataContainer.location;*/

                var editedLoc = angular.copy(edited);
                editedLoc = {
                    propertyNumber: edited.propertyNumber,
                    name: edited.name,
                    address1: edited.address1,
                    address2: edited.address2,
                    city: edited.city,
                    state: edited.state,
                    zip: edited.zip,
                    propertyType: edited.propertyType,
                    country: edited.country,
                    latitude: edited.latitude,
                    longitude: edited.longitude,
                    acreage: edited.acreage,
                    numBuildings: edited.numBuildings,
                    transactionType: edited.transactionType,
                    poNumber: edited.poNumber,
                    projectNumber: edited.projectNumber,
                    /*"reports":[{
                      "templateID":101,
                      "libraryID":102,
                      "companyID":153,
                      "projectNumber":"",
                      "poNumber":"",
                      "fee":""
                    }],*/
                    siteContact: {
                        name: edited.contact,
                        phone: edited.phone,
                        fax: edited.fax,
                        email: edited.email
                    }
                }
                self.data.locations[self.editModalDataContainer.index] = editedLoc;
                init();
            }

        });
    }


    //angular.isObject(edited.state) ? angular.edited.state.name : edited.state
    self.addNewLocation = function () {
        //$state.go('PortfolioCreation.AddLocation');
        self.modalDataContainer = {
            location: null,
            action: 'Add'
        };

        var modalInstance = $modal.open({
            templateUrl: 'app/modules/PortfolioCreation/views/portfolio.AddLocation.html',
            scope: $scope,
            controller: 'PortfolioAddLocationCtrl as addLocation',
            size: 'lg',
            windowClass: 'app-modal-window',
            resolve: {
                modalDataContainer: function () {
                    return self.modalDataContainer;
                }
            }
        });

        modalInstance.result.then(function () {

            var added = self.modalDataContainer.location;
            if (added) {
                /*data.locationCount = data.locationCount + 1;
                data.locations[data.locationCount] = self.modalDataContainer.location;*/
    
                var newLoc = {
                    propertyNumber: added.propertyNumber,
                    name: added.name,
                    address1: added.address1,
                    address2: added.address2,
                    city: added.city,
                    state: added.state,
                    zip: added.zip,
                    propertyType: added.propertyType,
                    country: added.country,
                    latitude: added.latitude,
                    longitude: added.longitude,
                    acreage: added.acreage,
                    numBuildings: added.numBuildings,
                    transactionType: added.transactionType,
                    poNumber: added.poNumber,
                    /*"reports":[{
                      "templateID":101,
                      "libraryID":102,
                      "companyID":153,
                      "projectNumber":"",
                      "poNumber":"",
                      "fee":""
                    }],*/
                    siteContact: {
                        name: added.contact,
                        phone: added.phone,
                        fax: added.fax,
                        email: added.email
                    }
                }

                self.data.locations.push(newLoc);
                init();
            }
        });
    };

    self.deleteAllSites = function () {
        self.siteDetails = [];
        self.data.locations = [];
        $state.go('PortfolioCreation.UploadSiteSpreadSheet');
    };


            }]);
