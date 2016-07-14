var countrySelectModule = angular.module('countrySelect', []);

countrySelectModule.constant("CountryStateUrlColl", {
    GETAPI_COUNTRIES: "countries",
    GETAPI_STATES: "countries/{countryCode}/states"
});

countrySelectModule.factory('getCountriesAPI', ["APIFactory", "CountryStateUrlColl", "$q", "BASEURL", function (APIFactory, CountryStateUrlColl, $q, BASEURL) {

    var replacePropertyFn = function (arrayObj, propertyKeyValPair) {
        for (var i = 0; i < arrayObj.length; i++) {
            var item = arrayObj[i];

            for (var property in propertyKeyValPair) {
                var renamed = propertyKeyValPair[property];

                if (!item.hasOwnProperty(property)) return;

                item[renamed] = item[property];
                delete item[property];
            }
        }
    };

    // private member to retain value to duplicate calls
    // e.g. case where there are multiple controls in same page/form
    var localCountryArr = null;
    var promise = null;

    return {
        get: function () {
            if (localCountryArr && localCountryArr.length) {
                var deferred = $q.defer();
                deferred.resolve(localCountryArr);
                return deferred.promise;
            }
            // corner case where call to get countries is made before first response is returned
            if (promise) {
                return promise;
            }

            var url = BASEURL.SHARED_GEOCODE + CountryStateUrlColl.GETAPI_COUNTRIES;
            promise = APIFactory.get(url).then(function (data) {

                if (data && data.countries) {


                    var USCountryObject = _.find(data.countries, function (item, index) {
                        if (item.countryCode === 'US') {
                            data.countries.splice(index, 1);
                            return item;
                        }

                    })
                    var mexicoCountryObject = _.find(data.countries, function (item, index) {
                        if (item.countryCode === 'MX') {
                            data.countries.splice(index, 1);
                            return item;
                        }

                    })

                    var canadaCountryObject = _.find(data.countries, function (item, index) {
                        if (item.countryCode === 'CA') {
                            data.countries.splice(index, 1);
                            return item;
                        }

                    })

                    var unitedKingdomCountryObject = _.find(data.countries, function (item, index) {
                        if (item.countryCode === 'GB') {
                            data.countries.splice(index, 1);
                            return item;
                        }

                    })

                    var countryArr = _.sortBy(data.countries, function (o) {
                        return o.countryName;
                    });



                    countryArr.unshift(unitedKingdomCountryObject);
                    countryArr.unshift(mexicoCountryObject);
                    countryArr.unshift(canadaCountryObject);
                    countryArr.unshift(USCountryObject);

                    var propertyKeyValPair = {
                        countryName: "name",
                        countryCode: "code"
                    };
                    replacePropertyFn(countryArr, propertyKeyValPair);
                    localCountryArr = countryArr;
                    return countryArr;
                }
            });
            return promise;
        }
    }
}]);

countrySelectModule.factory('getStatesAPI', ["APIFactory", "CountryStateUrlColl", "BASEURL", function (APIFactory, CountryStateUrlColl, BASEURL) {

    var replacePropertyFn = function (arrayObj, propertyKeyValPair) {
        for (var i = 0; i < arrayObj.length; i++) {
            var item = arrayObj[i];

            for (var property in propertyKeyValPair) {
                var renamed = propertyKeyValPair[property];

                if (!item.hasOwnProperty(property)) return;

                item[renamed] = item[property];
                delete item[property];
            }
        }
    };

    return {
        get: function (countryCode) {
            var url = BASEURL.SHARED_GEOCODE + CountryStateUrlColl.GETAPI_STATES;
            var params = {
                countryCode: countryCode
            };
            return APIFactory.get(url, params).then(function (data) {
                if (data && data.states) {
                    var stateArr = _.sortBy(data.states, function (o) {
                        return o.stateName
                    });

                    var propertyKeyValPair = {
                        stateName: "name",
                        stateCode: "code"
                    };
                    replacePropertyFn(stateArr, propertyKeyValPair);
                    return stateArr;
                }
            });
        }
    }
}]);


countrySelectModule.directive('countrySelect', ['$parse', '$compile', 'getCountriesAPI', '$filter', '$timeout', function ($parse, $compile, getCountriesAPI, $filter, $timeout) {
    return {
        restrict: 'A',
        priority: 1000,
        require: "^form",
        scope: {},
        terminal: true,
        compile: function (tElem, tAttrs) {
            tElem.removeAttr('country-select');
            return {
                pre: function (scope, iElem, iAttrs, formCtrl) {
                    // to break recursive compile loop
                    // need to compile element for below model binding to work
                    if (scope.countrySelectCompiled) return;

                    scope.countryNgModel = "";
                    iElem.attr('ng-model', 'countryNgModel');

                    // default model usage provided with directive usage
                    if (!iAttrs.overrideModelUse) {
                        //scope.countryOptions = [];
                        iElem.attr('data-ng-options', 'country.name for country in countryOptions');
                    }

                    scope.countrySelectCompiled = true;

                    var servicePromise = getCountriesAPI.get();
                    servicePromise.then(function (countries) {
                        scope.countryOptions = countries;

                        $timeout(function () {
                            var countryModel = iAttrs.countryModel;
                            var modeltemplatefn = $parse(countryModel);
                            var assignCountry = modeltemplatefn.assign;
                            var filtered = $filter("filter")(scope.countryOptions, {
                                name: "United States"
                            });
                            if (filtered && filtered.length) {
                                var defaultSelectedCountry = filtered[0];
                                var index = scope.countryOptions.indexOf(defaultSelectedCountry);
                                if (index >= 0) {
                                    assignCountry(scope.$parent, defaultSelectedCountry);
                                    formCtrl[iAttrs.name].$setViewValue(defaultSelectedCountry);
                                }
                            }
                        });
                    });

                },
                post: function (scope, iElem, iAttrs) {
                    var countryModel = iAttrs.countryModel;
                    //var ngmodel = iAttrs.ngModel;

                    if (!!countryModel) {
                        var modeltemplatefn = $parse(countryModel);
                        var assignCountry = modeltemplatefn.assign;

                        iElem.bind('change', function (e) {
                            var val = iElem.val();
                            if (!val) return;

                            var countryVal = val;
                            if (isNumber(val)) {
                                countryVal = scope.countryOptions[val];
                            }
                            assignCountry(scope.$parent, countryVal);
                        });
                        scope.$parent.$watch(countryModel, function (country) {
                            if (!country) return;

                            if (isNumber(country)) {
                                iElem.val(country);
                            } else if (country instanceof Object) {
                                var index = scope.countryOptions.indexOf(country);
                                if (index >= 0) {
                                    iElem.val(index);
                                }
                            }
                        });

                        function isNumber(n) {
                            return !isNaN(parseFloat(n)) && isFinite(n);
                        }
                    }

                    $compile(iElem)(scope);
                }
            }
        }
    }
}]);

function StateSharedService(name) {
    var self = this;
    self.name = name;
    self.statesAvailableForCountry = false;
}
countrySelectModule.service('stateSharedService', ['$rootScope', function ($rootScope) {
    // multiple controls differentiated by state model
    // state-model for stateSelect, and ng-model for stateInput
    // StateSharedService for every state-model
    // and added as property of shareObj
    this.shareObj = {};
    this.getNewInstance = function (name) {
        return new StateSharedService(name);
    }
}]);


countrySelectModule.directive('stateSelect', ['$parse', '$compile', 'getStatesAPI', 'stateSharedService', function ($parse, $compile, getStatesAPI, stateSharedService) {
    return {
        restrict: 'A',
        priority: 1000,
        scope: {},
        terminal: true,
        compile: function (tElem, tAttrs) {
            tElem.removeAttr('state-select');
            return {
                pre: function (scope, iElem, iAttrs) {
                    // to break recursive compile loop
                    // need to compile element for below model binding to work
                    if (scope.stateSelectDirectiveCompiled) return;

                    scope.selectedStateNgModel = "";
                    iElem.attr('ng-model', 'selectedStateNgModel');

                    // default model usage provided with directive usage
                    if (!iAttrs.overrideModelUse) {
                        scope.stateOptions = [];

                        iElem.attr('data-ng-options', 'state.name for state in stateOptions track by state.code');
                        // iElem.attr('data-ng-options', 'state.name for state in stateOptions');
                    }

                    //stateSharedService.createInstance();
                    //scope.sharedService = stateSharedService.instance;
                    var model_state = iAttrs.stateModel
                    scope.sharedService = stateSharedService.shareObj[model_state] || (stateSharedService.shareObj[model_state] = stateSharedService.getNewInstance(model_state));
                    iElem.attr('ng-show', ' sharedService.statesAvailableForCountry');
                    if (iAttrs.hasOwnProperty('required')) {
                        iElem.removeAttr('required');
                        iElem.attr('ng-required', 'sharedService.statesAvailableForCountry');
                    }

                    scope.stateSelectDirectiveCompiled = true;
                },
                post: function (scope, iElem, iAttrs) {


                    //var ngmodel_state = iAttrs.ngModel;
                    var model_state = iAttrs.stateModel;
                    var model_country = iAttrs.countryModel;

                    if (!!model_state && !!model_country) {

                        var templatefn_state = $parse(model_state);
                        var assignStateValue = templatefn_state.assign;

                        /*var templatefn_state_ngmodel = $parse(ngmodelstate);
                        var assignModel_state_ng = templatefn_state_ngmodel.assign;*/

                        iElem.bind('change', function (e) {
                            var val = iElem.val();
                            if (!val) return;

                            var stateVal = val;
                            if (isNumber(val)) {
                                scope.selectedStateNgModel = val;
                                stateVal = scope.stateOptions[val];
                            }
                            assignStateValue(scope.$parent, stateVal);
                        });
                        scope.$parent.$watch(model_state, function (state) {
                            if (state instanceof Object) {
                                var index = scope.stateOptions.indexOf(state);
                                if (index >= 0) {
                                    iElem.val(index);
                                }
                            } else {
                                iElem.val(state);
                            }
                            /*if (!state) return;

                            if (isNumber(state)) {
                                iElem.val(state);
                            } else if (state instanceof Object) {
                                var index = scope.stateOptions.indexOf(state);
                                if (index >= 0) {
                                    iElem.val(index);
                                }
                            }*/
                        });


                        scope.$parent.$watch(model_country, function (country) {
                            getstatesforcountry(country);
                        });

                        function getstatesforcountry(country) {
                            if (!country) return;
                            if (country && country.hasOwnProperty("isStateProvDataAvailable") && country["isStateProvDataAvailable"] === false) {
                                scope.sharedService.statesAvailableForCountry = false;
                                assignStateValue(scope.$parent, "");
                                iElem.val("");
                                return;
                            }

                            // clear values
                            scope.stateOptions = [];

                            var countryObj = isNumber(country) ? scope.countryOptions[country] : country;
                            var code = countryObj.code;
                            var servicePromise = getStatesAPI.get(code);
                            servicePromise.then(function (states) {
                                scope.stateOptions = states;
                                //scope.selectedCountryHasStates = true;
                                scope.sharedService.statesAvailableForCountry = true;
                            }, function (error) {
                                console.log("error in getting states");
                                console.log(error);
                                scope.sharedService.statesAvailableForCountry = false;
                            }).finally(function () {
                                // clear both ng-model and state-model values
                                assignStateValue(scope.$parent, "");
                                iElem.val("");
                            });
                        }

                        function isNumber(n) {
                            return !isNaN(parseFloat(n)) && isFinite(n);
                        }

                        $compile(iElem)(scope);
                    }
                }
            }
        }
    }
}]);





countrySelectModule.directive('stateInput', ['$parse', '$compile', 'stateSharedService', function ($parse, $compile, stateSharedService) {
    return {
        restrict: 'A',
        /*terminal: true,
        priority: 1000,*/
        scope: {},
        compile: function (tElem, tAttrs) {
            tElem.removeAttr('state-input');
            return {
                pre: function (scope, iElem, iAttrs) {
                    iElem.removeAttr('state-input');
                    //scope.sharedService = stateSharedService.instance;
                    var stateNgModel = iAttrs.ngModel;
                    scope.sharedService = stateSharedService.shareObj[stateNgModel] || (stateSharedService.shareObj[stateNgModel] = stateSharedService.getNewInstance(stateNgModel));
                    iElem.attr('ng-show', '!sharedService.statesAvailableForCountry');
                    if (iAttrs.hasOwnProperty('required')) {
                        iElem.removeAttr('required');
                        iElem.attr('ng-required', '!sharedService.statesAvailableForCountry');
                    }
                },
                post: function (scope, iElem, iAttrs, controller) {
                    $compile(iElem)(scope);
                }
            }
        }
    }
}]);
