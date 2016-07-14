angular.module('PolicyManagerModule').directive('activeClass', ['$location', function ($location) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            scope.$on('change-active-class', function (event, arg) {
                if (arg == "next") {
                    angular.forEach(angular.element('#policyDetailsNavigation').children(), function (liElement) {
                        if ($(liElement).attr('active-class') == String($location.path())) {
                            $(liElement).next().addClass("active");
                            $(liElement).removeClass("active");
                        }

                    })
                } else if (arg == "prev") {
                    angular.forEach(angular.element('#policyDetailsNavigation').children(), function (liElement) {
                        if ($(liElement).attr('active-class') == String($location.path())) {
                            $(liElement).prev().addClass("active");
                            $(liElement).removeClass("active");
                        }

                    })
                }




            })

            if (String($location.path()) === String(attr.activeClass)) {

                elem.addClass("active");

            } else {

                elem.removeClass("active");
            }

            elem.bind('click', function () {

                elem.addClass('active')
                    .siblings().removeClass('active');
                if (attr.activeClass == '/Policy/Information') {
                    scope.policynav.firstLink = true;
                    scope.policynav.nextButtonText = "Add Values";
                    scope.policynav.viewHeader = "Step 1 : Policy Information";

                } else if (attr.activeClass == '/Policy/Values') {
                    scope.policynav.firstLink = false;
                    scope.policynav.nextButtonText = "View Policy Preview";
                    scope.policynav.previousButtonText = "Policy Information";
                    scope.policynav.viewHeader = "Step 2 : Policy Parameter Values";

                } else if (attr.activeClass == '/Policy/Matrix') {
                    scope.policynav.firstLink = false;
                    scope.policynav.nextButtonText = "Test Policy";
                    scope.policynav.previousButtonText = "Add Values";
                    scope.policynav.viewHeader = "Step 3 : Policy Matrix";

                } else if (attr.activeClass == '/Policy/Test') {
                    scope.policynav.firstLink = false;
                    scope.policynav.nextButtonText = "Activate Policy";
                    scope.policynav.previousButtonText = "Policy Matrix";
                    scope.policynav.viewHeader = "Step 4 : Test Policy";
                }

            });

        }
    }


}]);


angular.module('PolicyManagerModule').directive('viewPolicyActiveClass', ['$location','$state', function ($location,$state) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            

            if (String($state.params.type) === String(attr.viewPolicyActiveClass)) {
                var removeBtnHtml = "<button class='btn btn-sm btn-danger custom-btn' type='button'></button>"; 


                var btnImage = "<span  class='glyphicon glyphicon-trash'></span>";
                
                elem.find('a').append(removeBtnHtml);
                elem.find('button').append(btnImage);
                elem.addClass("active");

            } else {
                elem.find('button').remove();
                elem.removeClass("active");
            }

            elem.bind('click', function () {
                
                elem.addClass('active')
                    .siblings().removeClass('active');
                

            });
            
            

        }
    }


}]);




angular.module('PolicyManagerModule').directive('addRangeTextbox', ['$http', '$compile', function ($http, $compile) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {
                $http.get('modules/PolicyManager/views/policy.range.html').success(function (data) {
                    var html = data;
                    $compile(html)(scope);
                    elem.parent().before($compile(html)(scope));
                });
            });



        },

        controller: function ($scope, $element, $http) {
            $scope.removeRangeTextBox = function(event){
                $(event.target).parents('.row').first().remove();
            }

        }
    }


}]);