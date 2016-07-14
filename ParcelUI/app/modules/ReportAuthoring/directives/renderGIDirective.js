angular.module('ReportAuthoring').directive('renderGeneralinformation', ['$compile', '$sce', 'ReportAuthoringAPI', '$http', function ($compile, $sce, ReportAuthoringAPI, $http) {
    return {
        restrict: 'A',
        link: function (scope, element, attr, controllers) {
            $http.get('app/modules/ReportAuthoring/views/generalInformationForm.html').success(function (data) {
                element.html(data);
                scope.element = element.contents();
                $compile(element.contents())(scope);
            });
        }
    }
}]);
