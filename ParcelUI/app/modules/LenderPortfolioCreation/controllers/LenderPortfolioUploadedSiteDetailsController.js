angular.module('PortfolioCreation').controller('LenderPortfolioUploadedSiteDetailsCtrl', ['$scope', '$modal', function ($scope, $modal) {

    var self = this;
    var main = $scope.lenderPortfolio;
    var existingProjectData = angular.copy(main.project);
    var loadedData = main.loadData;

    self.siteDetails = [];
    self.data = angular.copy(existingProjectData);

    var parseLoadData = function () {
        var locations = self.data ? self.data.locations : null;

        if (locations && locations.length) {
            var cloned = angular.copy(locations);
            for (var i = 0; i < cloned.length; i++) {                
                var loc = cloned[i];

                var toPush = parseIntoBindObj(loc, loc.siteContact, i);
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
            transactionType: location.transactionType
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
        data.locations = self.data.locations;
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
            templateUrl: 'app/modules/LenderPortfolioCreation/views/lenderportfolio.AddLocation.html',
            scope: $scope,
            controller: 'LenderPortfolioAddLocationCtrl as addLocation',
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
                var editedLoc = {
                    propertyNumber: edited.propertyNumber,
                    name: edited.name,
                    address1: edited.address1,
                    address2: edited.address2,
                    city: edited.city,
                    state: edited.state,
                    zip: edited.zip,
                    propertyType: edited.propertyType,
                    county: edited.county,
                    latitude: edited.latitude,
                    longitude: edited.longitude,
                    acreage: edited.acreage,
                    numBuildings: edited.numBuildings,
                    transactionType: edited.transactionType,
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

    self.addNewLocation = function () {
        //$state.go('PortfolioCreation.AddLocation');
        self.modalDataContainer = {
            location: null,
            action: 'Add'
        };

        var modalInstance = $modal.open({
            templateUrl: 'app/modules/LenderPortfolioCreation/views/lenderportfolio.AddLocation.html',
            scope: $scope,
            controller: 'LenderPortfolioAddLocationCtrl as addLocation',
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
                    county: added.county,
                    latitude: added.latitude,
                    longitude: added.longitude,
                    acreage: added.acreage,
                    numBuildings: added.numBuildings,
                    transactionType: added.transactionType,
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
    }

}]);