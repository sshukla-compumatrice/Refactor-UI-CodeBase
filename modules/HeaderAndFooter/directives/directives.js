lenderPortalApp
    .directive('optionsDisabled', function ($parse) {
        var disableOptions = function (scope, attr, element, data, fnDisableIfTrue) {
            // refresh the disabled options in the select element.
            $("option[value!='?']", element).each(function (i, e) {
                var locals = {};
                locals[attr] = data[i];
                $(this).attr("disabled", fnDisableIfTrue(scope, locals));
            });
        };
        return {
            priority: 0,
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ctrl) {
                // parse expression and build array of disabled options
                var expElements = iAttrs.optionsDisabled.match(/^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/);
                var attrToWatch = expElements[3];
                var fnDisableIfTrue = $parse(expElements[1]);
                scope.$watch(attrToWatch, function (newValue, oldValue) {
                    if (newValue)
                        disableOptions(scope, expElements[2], iElement, newValue, fnDisableIfTrue);
                }, true);
                // handle model updates properly
                scope.$watch(iAttrs.ngModel, function (newValue, oldValue) {
                    var disOptions = $parse(attrToWatch)(scope);
                    if (newValue)
                        disableOptions(scope, expElements[2], iElement, disOptions, fnDisableIfTrue);
                });
            }
        };
    });

lenderPortalApp.directive('helpPopup', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {

                scope.$apply(
                    $timeout(function () {
                        scope.hidebtn = false;
                    }, 500)

                );


                $(".needhelp-toggle").slideToggle({
                    direction: "top"
                });



            });

        }
    }


}]);

lenderPortalApp.directive('helpBtn', [function () {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {

                scope.$apply(
                    scope.hidebtn = true
                );


                $(".needhelp-toggle").slideToggle({
                    direction: "top"
                });



            });

        }
    }


}]);

lenderPortalApp.directive('stopPropagation', [function () {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function (event) {

                event.stopPropagation();



            });

        }
    }


}]);



lenderPortalApp.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout',
    function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {

                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element('#branches-dropdown');
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {

                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;

                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 2000);
            }
        };
  }
]);





/*lenderPortalApp.directive('infiniteScrollLoan', [
  '$rootScope', '$window', '$timeout',
    function ($rootScope, $window, $timeout) {
        return {

            link: function (scope, elem, attrs) {

                
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                
                $window = angular.element("#loanSearchDiv");
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {

                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;

                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScrollLoan);
                        } else {
                            return scope.$apply(attrs.infiniteScrollLoan);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
  }
]);*/


lenderPortalApp.directive('redirectToSpecificPolicy', ['$state', function ($state) {

    return {
        restrict: 'A',


        link: function (scope, elem, attr) {

            elem.bind('click', function () {
                console.log("gdgdgddg " + scope.loan);
                angular.forEach(scope.header.policiesType,function(name){
                    if(name == attr.redirectToSpecificPolicy){
                       $state.go('ViewPolicy',{type : attr.redirectToSpecificPolicy}); 
                    }
                })
            });

        }
    }


}]);


lenderPortalApp.directive('rtSelect2', ['$resource', '$compile', '$state', function ($resource, $compile, $state) {
    return {
        template: "<div ui-select2='select2Options' ng-model='selected'></div>",
        scope: {
            provider: '='

        },
        compile: function compile(tElement, tAttrs, transclude) {
            return {

                pre: function preLink(scope, iElement, iAttrs) {

                    var PAGE_SIZE = 10;



                    var queryHandler = function (query) {

                        scope.provider.readData(query.term, query.page, PAGE_SIZE)
                            .then(function (results) {



                                    if (angular.isDefined(results)) {
                                        var more = false;

                                        if (results.length > 0 && results.length == PAGE_SIZE && query.term != "") {
                                            more = true;
                                        } else if (query.term == "") {
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

                    var loanFormatResult = function (loan) {
                        var markup = "<div>";

                        markup += "<div>" + loan.address + " - " + loan.city + ", " + loan.state + loan.zip + " : " + loan.loanBorrower + "</div>";

                        markup += "</div>";
                        /*var markupHtml = $compile(markup)(scope);*/
                        return markup;
                    }

                    var loanFormatSelection = function (loan) {
                        console.log("selected loan");
                        if (!$.isEmptyObject(loan)) {
                            $state.go('Property.Overview', {
                                'LocationID': loan.locationID,
                                'PID': loan.cabinetID

                            });
                            angular.element('.lp-searchloan').val(loan.address + " - " + loan.city + ", " + loan.state + loan.zip + " : " + loan.loanBorrower);
                            //return loan.address;
                        }


                    }

                    scope.selected = {};
                    scope.select2Options = {
                        data: [],
                        formatResult: loanFormatResult,
                        formatSelection: loanFormatSelection,
                        multiple: false,
                        query: queryHandler,
                        selectable: true,
                        allowClear: true,
                        formatNoMatches: function (term) {
                            return "No results for : " + term;
                        }
                    };
                }
            }
        }
    }
}]);
