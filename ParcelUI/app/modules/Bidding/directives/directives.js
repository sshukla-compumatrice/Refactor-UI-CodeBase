angular.module('Bidding').directive('googleMap', function () {
    return {
        restrict: 'EA',
        require: '?ngModel',
        scope: {
            myModel: '=ngModel'
        },
        link: function (scope, element, attrs, ngModel) {

            var mapOptions;
            var googleMap;
            var searchMarker;
            var searchLatLng;
            if (scope.myModel != undefined && scope.myModel != "" && scope.myModel != null) {
                ngModel.$render = function () {

                };

                scope.$watch('myModel', function (value) {
                    var myPosition = new google.maps.LatLng(scope.myModel.latitude, scope.myModel.longitude);
                    if (!searchMarker && scope.myModel.latitude && scope.myModel.longitude) {
                        initMap(searchLatLng);
                    } else if (searchMarker) {
                        searchMarker.setPosition(myPosition);
                    }
                }, true);

                function initMap() {
                    searchLatLng = new google.maps.LatLng(scope.myModel.latitude, scope.myModel.longitude);
                    mapOptions = {
                        zoom: 12,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: searchLatLng
                    };

                    googleMap = new google.maps.Map(element[0], mapOptions);

                    searchMarker = new google.maps.Marker({
                        position: searchLatLng,
                        map: googleMap,
                        draggable: true
                    });

                    google.maps.event.addListener(searchMarker, 'dragend', function () {
                        scope.$apply(function () {
                            scope.myModel.latitude = searchMarker.getPosition().lat();
                            scope.myModel.longitude = searchMarker.getPosition().lng();
                        });
                    }.bind(this));
                }

            }
        }
    }
});