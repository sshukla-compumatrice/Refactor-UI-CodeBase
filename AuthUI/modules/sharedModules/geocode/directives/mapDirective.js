angular.module('AccessManagement').directive('googleMap', function () {
    return {
        restrict: 'EA',
        require: '?ngModel',
        scope: {
            mapModel: '=ngModel'
        },
        link: function (scope, element, attrs, ngModel) {

            var mapOptions;
            var googleMap;
            var searchMarker;
            var searchLatLng;
            var mapDraggable = (attrs.mapdraggable == "true") ? true : false;
            var mapZoom = (attrs.mapzoom) ? parseInt(attrs.mapzoom) : 12;
            var US_geoCentre = {
                latitude: 39.828212077334264,
                longitude: -98.5795724196434
            };

            var initLatitude = scope.mapModel.latitude ? scope.mapModel.latitude : US_geoCentre.latitude;
            var initLongitude = scope.mapModel.longitude ? scope.mapModel.longitude : US_geoCentre.longitude;

            if (scope.mapModel != undefined && scope.mapModel != "" && scope.mapModel != null) {
                ngModel.$render = function () {

                };

                scope.$watchCollection('[mapModel.latitude, mapModel.longitude]', function (newValues, oldValues) {
                    initLatitude = scope.mapModel.latitude ? scope.mapModel.latitude : US_geoCentre.latitude;
                    initLongitude = scope.mapModel.longitude ? scope.mapModel.longitude : US_geoCentre.longitude;
                    var currentPosition = new google.maps.LatLng(initLatitude, initLongitude);

                    if (newValues[0] == oldValues[0]) {
                        if (newValues[1] != oldValues[1]) {
                            if (searchMarker) {
                                googleMap.setCenter(currentPosition);
                                searchMarker.setPosition(currentPosition);
                            } else {
                                initMap(initLatitude, initLongitude);
                            }
                        }
                    } else {
                        if (searchMarker) {
                            googleMap.setCenter(currentPosition);
                            searchMarker.setPosition(currentPosition);
                        } else {
                            initMap(initLatitude, initLongitude);
                        }
                    }

                });

                function initMap(lat, lng) {
                    searchLatLng = new google.maps.LatLng(lat, lng);

                    mapOptions = {
                        zoom: mapZoom,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        center: searchLatLng
                    };

                    googleMap = new google.maps.Map(element[0], mapOptions);

                    searchMarker = new google.maps.Marker({
                        position: searchLatLng,
                        map: googleMap,
                        draggable: mapDraggable
                    });

                    google.maps.event.addListener(searchMarker, 'dragend', function () {
                        scope.$apply(function () {
                            scope.mapModel.dragendLat = searchMarker.getPosition().lat();
                            scope.mapModel.dragendLng = searchMarker.getPosition().lng();
                        });
                    }.bind(this));
                }

            }
            initMap(initLatitude, initLongitude);
        }
    };
});