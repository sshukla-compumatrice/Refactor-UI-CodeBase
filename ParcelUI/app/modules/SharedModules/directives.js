angular.module('ProjectDashboard').directive('rtSelect2', ['$resource', '$compile','$state', function ($resource,$compile,$state) {
    return {
        template: "<div ui-select2='select2Options' ng-model='selected'></div>",
        scope: {
            provider: '=',
            template: '&',
            afterevent: '&',
            setvalue: '&',
            minimuminput: "@",
            data : '='


        },
        compile: function compile(tElement, tAttrs, transclude) {
            return {

                pre: function preLink(scope, iElement, iAttrs) {

                    

                    var PAGE_SIZE = 10;



                    var queryHandler = function (query) {

                        scope.provider.readData(query.term, query.page, PAGE_SIZE)
                            .then(function (results) {



                                    if (results != undefined) {



                                        var more = false;

                                        if (results.length > 0 && results.length == PAGE_SIZE) {
                                            more = true;
                                        } else {
                                            more = false;
                                        }

                                        query.callback({
                                            results: results,
                                            more: more
                                        });

                                    }


                                },

                                function () {
                                    query.callback({
                                        results: [],
                                        more: false
                                    });
                                });
                    };

                    var formatResult = function (result, element, search) {
                        var markup = scope.template()(result, element, search);
                        return markup;
                    }

                    var formatSelection = function (result) {
                        scope.afterevent()(result);
                    }

                    var initialValue = function () {
                        if (typeof scope.setvalue() == "function")
                            scope.setvalue()();
                    }

                    scope.selected = {};
                    
                    
                    
                    scope.select2Options = {
                        data: [],
                        placeholder: 'Quick select a project',
                        allowClear: true,
                        formatResult: formatResult,
                        formatSelection: formatSelection,
                        multiple: false,
                        query: queryHandler,
                        selectable: true,
                        allowClear: true,
                        initSelection: initialValue,
                        minimumInputLength: scope.minimuminput,
                        
                        
                        
                        //minimumResultsForSearch: scope.enablesearch,
                        formatNoMatches: function (term) {
                            //if($state.current.name === 'ReportAuthoring.Write')
                            if($state.current.name.startsWith('ReportAuthoring'))
                                return "No Results Found ... Note: This search only finds reports found in the same project as the report you are currently viewing.";
                            return "No results for : " + term;
                        }
                    };
                }
            }
        }
    }
}]);





angular.module('ProjectDashboard').directive('countryState', ['$compile', '$http', 'projectDashboardOperations', function ($compile, $http, projectDashboardOperations) {


    var getTemplateUrl = function () {
        var templateUrl = '';
        templateUrl = 'app/modules/SharedModules/countriesState.html';
        return templateUrl;
    }
    return {
        restrict: 'E',
        require: ['^form', 'ngModel'],


        replace: true,
        scope: {
            countrylabelcss: '@',
            countrydivcss: '@',
            statelabelcss: '@',
            statedivcss: '@',
            ngModel: '=',
            controllerobject: '='

        },

        link: function (scope, elem, attr, controllersArray) {
            var templateUrl = getTemplateUrl();
            if (templateUrl != undefined) {
                $http.get(templateUrl).success(function (data) {
                    elem.html(data);
                    $compile(elem.contents())(scope);
                });
            }

            scope.addCountryLabelClass = function () {

                return scope.countrylabelcss;
            }
            scope.addCountryDivClass = function () {
                return scope.countrydivcss;
            }

            scope.addStateLabelClass = function () {

                return scope.statelabelcss;
            }
            scope.addStateDivClass = function () {
                return scope.statedivcss;
            }
            scope.setDisabled = function () {
                if (scope.country == undefined) {
                    return true;
                } else {
                    return false;
                }
            }

            scope.getCountryStates = function () {
                scope.countryHasState = false;
                scope.stateInput = "";
                scope.controllerobject.selectedCountry = scope.country;
                scope.states = [];
                if (scope.country === undefined) {
                    elem.find('#stateDropDown').parent().addClass('has-error');
                    scope.controllerobject.selectedState = undefined;
                    scope.states = undefined;
                } else {
                    var countryObject = scope.country;
                    projectDashboardOperations.getStatesData(countryObject).
                    then(function (response) {
                        scope.states = response;
                    })
                }


            }

            scope.getStateCities = function () {
                scope.controllerobject.selectedState = scope.state;
            }



        },




        controller: function ($scope, $element) {

            $scope.$on('clear-country-state', function (event, args) {
                $scope.country = undefined;
                $scope.state = undefined;

            })

        }




    }

}]);


/*angular.module('ProjectDashboard').directive('stateTextChange', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1000,
        link: function (scope, elem, attr, ngModelController) {
            if (ngModelController.$modelValue == "" ||
                ngModelController.$modelValue == undefined || isNaN(ngModelController.$modelValue)) {
                $timeout(function () {
                    elem.parents('.form-group').addClass('has-error');
                }, 1000);

            }
            elem.on('input', function () {
                var obj = {};
                obj.code = "";
                obj.name = ngModelController.$modelValue;
                scope.$emit('Update-State-Model', {
                    stateObject: obj
                });
                if (ngModelController.$modelValue == "" ||
                    ngModelController.$modelValue == undefined) {
                    elem.parents('.form-group').addClass('has-error');
                } else {
                    elem.parents('.form-group').removeClass('has-error');
                }
            })
        },
        controller: function ($scope, $element) {
            $scope.$on('Add-Error-Class', function (event, args) {

                $element.parents('.form-group').addClass('has-error');

            })

        }
    }
}])*/