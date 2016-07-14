angular.module("ReportTemplates").directive("sectionStructureDisplay", [function() {
    return {
        restrict: "A",
        templateUrl: "app/modules/ReportTemplates/directives/sectionDisplay/sectionStructureDisplay.html",
        scope: {
            sections: "=",
            rootSectionLevel: "@"
        },
        link: function(scope, element, attrs){
            console.log(scope.rootSectionLevel);
        }
    }
}]);

angular.module("ReportTemplates").directive("nestedSectionDisplay", ['$compile', function($compile) {
    return {
        restrict: "A",
        scope: {
            nestedSections: "="
        },
        link: function(scope, element, attrs) {
            if (angular.isArray(scope.nestedSections)) {
                element.append("<div section-structure-display sections='nestedSections'></div>");
                $compile(element.contents())(scope);
            }
        }
    }
}]);