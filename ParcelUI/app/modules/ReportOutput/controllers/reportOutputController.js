var reportOutputModule = angular.module('ReportOutput');
reportOutputModule.controller('ReportOutputController', ['ReportOutputAPI', function(ReportOutputAPI) {

    var self = this;
    //self.sections = [];

    function init() {
        var promise = getData();
        promise.then(function(data) {

            var setupPromise = ReportOutputAPI.getReportSetup();
            setupPromise.then(function(html) {
                console.log("setup promise");
                console.log(html);
                console.log(JSON.stringify(html));
                data.html = html;

                self.sections = [];
                self.sections.push(data);
                
                getReportData(12);
            });
        });
    }

    function getData() {
        return ReportOutputAPI.get().then(function(data) {
            return data;
        });
    }

    init();    

}]);

reportOutputModule.directive('replaceData', ['$parse', '$compile', function($parse, $compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var sectionJson = $parse(attrs.replaceData)(scope);
            angular.forEach(sectionJson.contentValues.reportData.data, function(sectionData) {
                var key = sectionData.key;
                var val = sectionData.html;
                var compile = sectionData.compile;

                var result = element[0].querySelector("#" + key);
                if (!result) return;

                var lastNestedChild = getLastNestedChild(result);
                var el = lastNestedChild.parentElement;

                var angularEl = angular.element(el);
                angularEl.html(val);

                if (!!compile) {
                    $compile(angularEl)(scope);
                }
                //angular.element(result.lastChild)[0].html("<a>asd</a>")
                //$compile(angularEl.contents())(scope);
            });

            function getLastNestedChild(element) {
                if (!element.lastChild) return element;
                return getLastNestedChild(element.lastChild);
            }
        }
    }
}]);