angular.module('AccessManagement').directive('breadcrumbDirective', ['$interpolate', '$rootScope', 'breadcrumb', function ($interpolate, $rootScope, $breadcrumb) {
    var breadcrumbTemplate = '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
        '<a ng-switch-when="false" href="{{step.breadcrumbLink}}">{{step.breadcrumbLabel}}</a>' +
        '<span ng-switch-when="true">{{step.breadcrumbLabel}}</span>' +
        '</li>';

    return {
        restrict: 'AE',
        replace: true,
        scope: {},
        template: breadcrumbTemplate,
        link: {
            post: function postLink(scope) {
                var labelWatchers = [];

                var renderBreadcrumb = function () {
                    labelWatchers = [];

                    var viewScope = $breadcrumb.$getLastViewScope();
                    scope.steps = $breadcrumb.getStatesChain();
                    angular.forEach(scope.steps, function (step) {
                        if (step.breadcrumb && step.breadcrumb.label) {
                            var parseLabel = $interpolate(step.breadcrumb.label);
                            step.breadcrumbLabel = parseLabel(viewScope);
                        } else {
                            step.breadcrumbLabel = step.name;
                        }
                    });
                };

                $rootScope.$on('$viewContentLoaded', function () {
                    renderBreadcrumb();
                });

                // View(s) may be already loaded while the directive's linking
                renderBreadcrumb();
            }
        }
    };
}]);