angular.module('AccountMgmtModule').directive('elemReady', function ($parse, $timeout) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            elem.ready(function () {
                $timeout(function () {
                    $scope.$apply(function () {
                        var func = $parse(attrs.elemReady);
                        func($scope);
                    });
                });
            });
        }
    }
});