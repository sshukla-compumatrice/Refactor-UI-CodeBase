//For ascynchronous display of data on scroll in dropdown



angular.module('SRFModule').directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout',
    function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {

                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element('#scrolldrpdwn');
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
                }), 0);
            }
        };
  }
]);

angular.module('SRFModule').directive('shiftPrevious', ['$location', '$state', '$stateParams', 'SRFResources', '$timeout', function ($location, $state, $stateParams, SRFResources, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            if ($location.path() == '/SRF/Cabinet') {
                angular.element('#srfNextBtn').hide();
                angular.element('#srfPreviousBtn').hide();
            } else {
                angular.element('#srfPreviousBtn').show();
            }
        }
    }

}]);

angular.module('SRFModule').directive('activeClassSectionalView', ['$location', '$timeout', '$stateParams', 'globalValues', function ($location, $timeout, $stateParams, globalValues) {

    return {
        restrict: 'A',
        scope: {
            title: '@'
        },

        link: function (scope, elem, attr) {



            if (globalValues.pageRefreshed) {
                var tab = localStorage.getItem('active-tab');

                if (tab === scope.title) {
                    elem.removeClass('disabled');
                    elem.addClass("active");
                } else if (tab == '') {
                    elem.removeClass("active");
                    elem.addClass('disabled');
                    angular.element('#leftnavChooseCabinet').addClass('active');
                    angular.element('#leftnavChooseCabinet').removeClass('disabled');
                } else {
                    elem.removeClass('disabled');
                    elem.removeClass("active");

                }

            }

            elem.bind('click', function () {


                if (globalValues.srfCabinetBtn == 'clicked') {

                    elem.addClass('active');
                    elem.siblings().removeClass('active');
                }

                if (globalValues.srfCabinetBtn == 'not clicked' && localStorage.getItem('active-tab') != '') {
                    elem.addClass('active');
                    elem.siblings().removeClass('active');
                }


                if (attr.urlparams == '/SRF/Cabinet') {

                    angular.element('#srfPreviousBtn').hide();

                    angular.element('#srfNextBtn').html('Next');
                }

            });

        }
    }


}]);


angular.module('SRFModule').directive('showtab', [function () {

    return {
        link: function (scope, element, attrs) {

            element.click(function (e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
}]);


// For dynamic email templates

angular.module('SRFModule').directive('customButton', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            elem.bind('click', function () {
                //$(this).parent().remove();
                if(scope.managecabinet == null || scope.managecabinet == undefined) {
                    scope.$parent.managecabinet.serviceResponseAlert = false;
                }
                   else  {
                       scope.managecabinet.serviceResponseAlert = false;
                   }
                                
                            
                $(this).parent().parent().parent().remove();
                if (!angular.element(".dynamicemails")[0]) {
                    angular.element('#cabinetemail').addClass('has-error');
                }
            });
        },
        controller: function ($scope) {

        }
    }
}]);


//For dynamic email templates
angular.module('SRFModule').directive('customAction', ['$compile', '$sce', '$http',
                                                    'SRFUrls', 'SRFResources',
    function ($compile, $sce, $http, SRFUrls, SRFResources) {
        return {
            restrict: 'A',
            scope: {
                diremail: '@'

            },
            require: 'ngModel',
            link: function (scope, elem, attr, modelCtrl) {

                var template;
                var templateUrl = SRFUrls.emailTemplate;

                elem.bind("keypress", function (event) {
                    //scope.$parent.managecabinet.serviceResponseAlert = true;
                    if (scope.diremail != undefined && scope.diremail != '')
                        angular.element('#cabinetemail').removeClass('has-error');
                    if (event.which == 13 && (scope.diremail != undefined &&
                            scope.diremail != null && scope.diremail != '')) {
                        if (angular.element('.dynamicemails').length <= 14) {
                            
                            var checkDirectiveForSelectedEmails = [];
                            angular.element(".dynamicemails").each(function (i) {

                                checkDirectiveForSelectedEmails.push($('span:first', this).text().trim());

                            });
                            if (checkDirectiveForSelectedEmails.indexOf(scope.diremail) == -1) {
                                $http.get(templateUrl).success(function (response) {

                                    template = response;
                                    var html = $sce.trustAsHtml(template);

                                    $('.cabinetemaildiv').append(template);

                                    $compile($('.dynamicemails').contents())(scope);
                                    $('.editemaildiv:last #typeahedemails').text(scope.diremail);


                                    modelCtrl.$setViewValue('');
                                    modelCtrl.$render();

                                });
                            } else {
                                modelCtrl.$setViewValue('');
                                modelCtrl.$render();
                            }
                        } else {
                            
                            angular.element('#serviceResponseDiv').removeClass('alert-success');
                            angular.element('#serviceResponseDiv').removeClass('alert-danger');
                            angular.element('#serviceResponseDiv').addClass('alert-warning');
                            scope.$apply(function () {
                                scope.$parent.managecabinet.serviceResponseAlert = true;
                                scope.$parent.managecabinet.serviceResponseText =
                                    SRFResources.emailLimitsWarning;
                            });


                            //scope.$emit('show-email-limit-warning');    
                        }





                    }


                });


            },
            controller: function ($scope) {
                angular.element('#outsideEmailBtn').bind('click', function () {

                    $(this).parent().remove();
                });

            }
        }
}]);

angular.module('SRFModule').directive('customValidation', ['$compile', 'SRFResources', function ($compile, SRFResources) {

    return {
        restrict: 'A',
        require: 'ngModel',

        link: function (scope, elem, attrs, ngModelCtrl) {

            var spanid = 'msg' + attrs.isrequired;

            /*if (attrs.isRequired == '1') {

                elem.parent().addClass('has-error');
            }

            elem.bind('change', function () {
                elem.parent().toggleClass('has-error', ngModelCtrl.$invalid);

            });*/

            elem.bind('keyup', function () {


                elem.parent().toggleClass('has-error', ngModelCtrl.$invalid);
                if (ngModelCtrl.$invalid && ngModelCtrl.$viewValue != undefined &&
                    ngModelCtrl.$viewValue != "") {


                    if (!angular.element('#' + spanid).length) {
                        if (attrs.ngPattern == SRFResources.NumberValidator) {
                            elem.after('<div id=' + spanid + '>' + SRFResources.ErrorMessageNumber + '</div>');
                        }
                        if (attrs.ngPattern == SRFResources.PhoneNumberValidator) {


                            elem.after('<div id=' + spanid + '>' + SRFResources.ErrorMessagePhone + '</div>');



                        }
                    }


                } else {
                    /*scope.$apply(function(){
                         scope.crossmark = false;

                     })*/
                    angular.element('#remove').hide();
                    angular.element('#' + spanid).remove();
                }
            })



        }

    }
}])

angular.module('SRFModule').directive("dynamicName", ['$compile', 'SRFResources', function ($compile, SRFResources) {
    return {
        restrict: "A",

        terminal: true,
        priority: 1000,
        link: function (scope, element, attrs) {

            element.attr('name', scope.$eval(attrs.dynamicName));

            if (scope.$eval(attrs.customValidation) == "Number") {
                element.attr('ng-pattern', SRFResources.NumberValidator);
            }
            if (scope.$eval(attrs.customValidation) == "Phone") {

                element.attr('ng-pattern', SRFResources.PhoneNumberValidator);
            }

            element.removeAttr("dynamic-name");

            $compile(element)(scope);



        }
    };
}]);

angular.module('SRFModule').directive('loadDefaultMap', ['SetMarker', 'shareDataService', function (SetMarker, shareDataService) {

    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            var defaultlatLongObj = {
                lat: 39.50,
                lng: -98.35
            }
            var map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 3,
                center: defaultlatLongObj
            });
            defaultlatLongObj.map = map;
            shareDataService.setMapObject(map);
            SetMarker.marker(defaultlatLongObj, scope, 'directive');
            //setMarker(39.50,-98.35);

        }
    }

}]);

//Dynamic bootstrap classes for SRF

angular.module('SRFModule').directive('dynamicGridColumns', [function () {
    return {
        restrict: 'A',
        scope: {
            columnarr: '='
        },
        link: function (scope, elem, attr) {

            switch (scope.columnarr.length) {
                case 1:
                    elem.addClass("col-xs-12 col-md-4 col-lg-4");
                    break;
                case 2:
                    elem.addClass("col-xs-12 col-md-6 col-lg-6");
                    break;
                case 3:
                    elem.addClass("col-xs-12 col-md-4 col-lg-4");
                    break;
                case 4:
                    elem.addClass("col-xs-12 col-md-3 col-lg-3");
                    break;

            }


        }
    }
}])


//Adding map dynamically in SRF
angular.module('SRFModule').directive('addMap', ['$http', '$compile', function ($http, $compile) {
    return {
        restrict: 'A',
        scope: {
            section: '='
        },
        link: function (scope, element, attribute) {

            if (scope.section == "MAP") {

                scope.element = element;
                $http.get('modules/SRF/views/directive-templates/field/map.html').success(function (data) {

                    element.html(data);
                    scope.element = scope.element.contents();
                    $compile(element.contents())(scope);

                });

            }
        }
    }

}])

//show first tab as active on page load

angular.module('SRFModule').directive('dynamicTabVisibility', ['$timeout', 'globalValues', function ($timeout, globalValues) {
    return {
        restrict: 'A',
        scope: {
            tabindex: '=',
            tabtitle: '='
        },
        link: function (scope, element, attribute) {


            if (globalValues.pageRefreshed) {


                $timeout(function () {
                    angular.element('#tab' + scope.tabtitle).addClass('active');
                }, 500);

                var activeTab = localStorage.getItem('active-tab');
                if (scope.tabtitle != activeTab) {
                    $timeout(function () {

                        angular.element('#' + scope.tabtitle).hide();
                        angular.element('#tab' + scope.tabtitle).removeClass('active');
                    }, 500);
                }


            } else {
                if (scope.tabindex != 0) {
                    $timeout(function () {
                        $('#' + scope.tabtitle).hide();
                    }, 500);
                }
                /*if (scope.tabindex != 0) {
                    $timeout(function () {
                        $('#' + scope.tabtitle).hide();
                    }, 500);
                }*/

            }
        }
    }

            }]);


// Open high alert popup
/*angular.module('SRFModule').directive('openAlertPopup', ['$location', '$state',
        function ($location, $state) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {

                elem.bind('click', function () {

                    if ($state.current.name != 'SRF.Cabinet') {

                        angular.element('#srfAlertModal').modal({
                            "backdrop": "true"
                        });
                    }

                });

            }

        }
        }]);*/

// High alert popup events

angular.module('SRFModule').directive('actionEvents', ['globalValues', function (globalValues) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.on('show.bs.modal', function () {
                globalValues.srfBlockNavigation = "Alert";
                //alert('show.bs.modal');
            });
            elem.on('shown.bs.modal', function () {
                //alert('shown.bs.modal');
            });
            elem.on('hide.bs.modal', function () {
                //alert('hide.bs.modal');
            });
            elem.on('hidden.bs.modal', function () {
                //alert('hidden.bs.modal');
            });
        }

    }
}])