angular.module("ReportAuthoring").directive("mapResolveGeocode", ["$modal", "$timeout", function($modal, $timeout) {
    return {
        restrict: "A",
        scope: {
            addressData: '='
        },
        controller: function($scope) {
            $scope.$on("map-resolve-geocode-linked", createGoogleMap);

            var createGoogleMap = function() {
                var mapOptions = {
                    zoom: 4,
                    center: new google.maps.LatLng(40.0000, -98.0000),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                };
                $scope.map = new google.maps.Map(document.getElementById('gMap'), mapOptions);
            };
        },
        compile: function(tElem, tAttrs) {
            tElem.attr("ng-click", "openViewinPopup()");
            return {
                pre: function(scope, iElem, iAttrs) {

                },
                post: function($scope, element, attrs) {
                    var templateUrl = 'app/modules/ReportAuthoring/directives/resolveGeocode/mapResolveGeocode.html';

                    $scope.openViewinPopup = function() {
                        var modalInstance = $modal.open({
                            templateUrl: templateUrl,
                            scope: $scope,
                            size: "lg"
                        });

                        $scope.$broadcast("map-resolve-geocode-linked");
                    };

                    element.on("click", $scope.openViewinPopup);
                }
            }
        }
    };

}]);