var countrySelectModule = angular.module('countrySelect', []);

countrySelectModule.factory('getCountriesAPI', ['$http', function ($http) {
    return {
        get: function () {
            return $http.get('modules/sharedModules/countrySelect/countries.json');
        },
        getCountryByCountryCode: function (code) {
            this.code = code;
            var self = this;
            return $http.get('modules/sharedModules/countrySelect/countries.json').then(function (countries) {
                for (var i = 0; i < countries.data.length; i++) {
                    if (self.code == countries.data[i].code) {
                        return countries.data[i];
                    }
                }
            });
        }
    }
}]);

countrySelectModule.factory('getStatesAPI', ['$http', 'BASEURL', function ($http, BASEURL) {
    return {
        get: function (countryCode) {
            return $http.get(BASEURL.GEOCODE + '/countries/' + countryCode + '/states/');
        },
        getStateByStateCode: function (countryCode, stateCode) {
            this.stateCode = stateCode;
            var self = this;
            return $http.get(BASEURL.GEOCODE + '/countries/' + countryCode + '/states/').then(function (states) {
                for (var i = 0; i < states.data.states.length; i++) {
                    if (self.stateCode == states.data.states[i].stateCode) {
                        return states.data.states[i];
                    }
                }
            });
        }
    }
}]);

countrySelectModule.directive('countries', [
  'getCountriesAPI', 'getStatesAPI', '$log',
    function (getCountriesAPI, getStatesAPI, $log) {
        return {
            restrict: 'E',
            replace: true,
            template: '<select id="countrySelect" class="form-control" ng-model="selectedCountry" name="country" ng-options="country.name for country in countries track by country.code"></select>',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                getCountriesAPI.get().then(function (countries) {
                    scope.countries = countries.data;
                });

                //Need to set 'selectedCountryCode' to $scope
                getStatesAPI.get(scope.selectedCountryCode).then(function (states) {
                    scope.states = states.data.states;
                });

                element.bind('change', function (event) {
                    scope.selectState = {};
                    getStatesAPI.get(scope.selectedCountry.code).then(function (states) {
                        scope.states = states.data.states;
                    });
                });
            }
        };
}]);

countrySelectModule.directive('states', [
  'getStatesAPI', '$log',
    function (getStatesAPI, $log) {
        return {
            restrict: 'E',
            replace: true,
            template: '<select class="form-control" ng-model="selectedState" name="state" ng-options="state.stateCode for state in states  | orderBy:[\'stateCode\'] track by state.stateCode"><option></option></select>',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {                
                getStatesAPI.get(scope.selectedCountryCode).then(function (states) {
                    scope.states = states.data.states;
                });
            }
        };
}]);