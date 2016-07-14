angular.module('PortfolioCreation').controller('PortfolioAddLocationCtrl', ['$scope', '$filter', '$modalInstance', 'modalDataContainer', '$timeout', 'getCountriesAPI', 'getStatesAPI', function ($scope, $filter, $modalInstance, modalDataContainer, $timeout, getCountriesAPI, getStatesAPI) {

    var self = this;


    init();



    function getStates(code) {
        getStatesAPI.get(code).then(function (result) {
            self.states = result;

        });
    }


    function init() {
        self.location = modalDataContainer.location;
        getCountries();
    }

    function setSelectedCountry() {

        if (modalDataContainer.location) {
            var selectedCountry = $filter("filter")(self.countries, {
                name: modalDataContainer.location.country
            })[0];
            if (selectedCountry) {

                self.selectedCountry = selectedCountry;
            } else {
                self.selectedCountry = {
                    code: "US",
                    isStateProvDataAvailable: true,
                    name: "United States"
                }
            }
        } else {
            self.selectedCountry = {
                code: "US",
                isStateProvDataAvailable: true,
                name: "United States"
            }
        }
        self.editCountry();

    }

    function getCountries() {
        getCountriesAPI.get().then(function (result) {
            self.countries = result;
            setSelectedCountry(self.countries);

        })
    }


    self.editCountry = function () {
        if (self.selectedCountry.isStateProvDataAvailable)
            getStates(self.selectedCountry.code);
    }

    self.serviceResponseAlert = false;
    self.action = modalDataContainer.action;
    if (self.action == 'Add') {
        self.title = 'Add Location to Portfolio';
        self.location = {};
    } else {

        self.title = 'Edit Location';
        self.location = angular.copy(modalDataContainer.location);
        self.state = modalDataContainer.location.state;

        if (self.location.reports) {
            self.location.poNumber = self.location.reports[0].poNumber;
        }
    }

    self.from = null;


    self.AddSite = function (form) {

        self.serviceResponseAlert = false;
        if (form && form.$invalid) {
            self.serviceResponseText = "Invalid Form Submission";
            self.serviceResponseAlert = true;
            // processError('Invalid Form Submission');
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input[required],multiselect[required]').trigger('blur');
            return;
        }

        //var portfolio = $scope.portfolio;
        //var data = portfolio.submitData;

        //data.locationCount = data.locationCount + 1;
        //data.locations[data.locationCount] = self.location;

        self.location.country = self.selectedCountry;

        modalDataContainer.location = self.location;


        //$state.go(portfolio.previousState);
        $modalInstance.close();
    }

    self.Cancel = function () {
        //var portfolio = $scope.portfolio;
        //$state.go(portfolio.previousState);

        $modalInstance.close();
    }

    $scope.close = function () {
        $modalInstance.close();
    }


    $timeout(function () {
        if (self.state) {
            $("#state option").filter(function (index) {
                return $(this).text() === self.state;
            }).attr('selected', 'selected');

        }

    }, 1000);


            }]);
