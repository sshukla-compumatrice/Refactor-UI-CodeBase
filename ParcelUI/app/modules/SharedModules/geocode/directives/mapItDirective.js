angular.module('ParcelUI').directive('mapIt', ['$parse', '$compile', '$filter', 'geocodeService', function ($parse, $compile, $filter, geocodeService) {
    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            mapItFieldsConfig: '='
        },
        templateUrl: 'app/modules/SharedModules/geocode/views/map-it-template.html',
        link: function (scope, element, attrs, ngModel) {
            scope.mapItFieldsConfigCopy = angular.copy(scope.mapItFieldsConfig);

            init = function () {
                var index, defaultCountryCode = "US";
                for (var i = 0; i < scope.mapItFieldsConfig.dataFields.length; i++) {
                    if (scope.mapItFieldsConfig.dataFields[i].fieldName == "countryCode") {
                        countryIndex = i;

                        defaultCountryCode ? scope.mapItFieldsConfig.dataFields[i].fieldValue : defaultCountryCode;

                        scope.promise = geocodeService.getCountries().then(function (resp) {
                            scope.countriesList = resp.countries;
                            for (var j = 0; j < resp.countries.length; j++) {
                                scope.mapItFieldsConfig.dataFields[countryIndex].options.push({
                                    value: resp.countries[j].countryCode,
                                    name: resp.countries[j].countryName
                                });
                            }

                            var countryObj = $filter('filter')(scope.countriesList, {
                                countryCode: defaultCountryCode
                            }, true)[0];

                            scope.mapItFieldsConfig.dataFields[countryIndex].fieldValue["name"] = countryObj.countryName;
                            scope.mapItFieldsConfig.dataFields[countryIndex].fieldValue["value"] = countryObj.countryCode;
                        });
                    }

                    if (scope.mapItFieldsConfig.dataFields[i].fieldName == "state") {
                        stateIndex = i;
                        scope.promise = geocodeService.getStates(defaultCountryCode).then(function (resp) {
                            scope.statesList = resp.states;
                            for (var j = 0; j < resp.states.length; j++) {
                                scope.mapItFieldsConfig.dataFields[stateIndex].options.push({
                                    value: resp.states[j].stateAbbrev,
                                    name: resp.states[j].stateName
                                });
                            }

                            if (scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue.value) {
                                var stateObj = $filter('filter')(scope.statesList, {
                                    stateAbbrev: scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue.value
                                }, true)[0];
                                scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["name"] = stateObj.stateName;
                                scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["value"] = stateObj.stateAbbrev;
                            } else {
                                scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["name"] = "-- Select a state --";
                                scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["value"] = "";
                            }
                        });
                    }
                }
            }
            init();
        },
        controller: ['$scope', '$timeout', '$filter', 'geocodeService', function (scope, $timeout, $filter, geocodeService) {
            scope.delay = 0;
            scope.minDuration = 0;
            scope.message = 'Please Wait...';
            scope.backdrop = true;

            scope.onCountrySelect = function (countryCode, stateCode) {
                var countryObj = $filter('filter')(scope.countriesList, {
                    countryCode: countryCode
                }, true)[0];

                for (var i = 0; i < scope.mapItFieldsConfig.dataFields.length; i++) {
                    if (scope.mapItFieldsConfig.dataFields[i].fieldName == "state") {
                        stateIndex = i;
                        if (countryObj.isStateProvDataAvailable) {
                            scope.promise = geocodeService.getStates(countryCode).then(function (resp) {
                                scope.statesList = resp.states;
                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.mapItFieldsConfig.dataFields[stateIndex].fieldType = "dropdown";
                                        scope.mapItFieldsConfig.dataFields[stateIndex].options = [];
                                        scope.mapItFieldsConfig.dataFields[stateIndex].options.push({
                                            value: "",
                                            name: "-- Select a state --"
                                        });
                                        for (var j = 0; j < resp.states.length; j++) {
                                            scope.mapItFieldsConfig.dataFields[stateIndex].options.push({
                                                value: resp.states[j].stateAbbrev,
                                                name: resp.states[j].stateName
                                            });
                                        }

                                        scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue = {};
                                        if (stateCode) {
                                            var stateObj = $filter('filter')(scope.statesList, {
                                                stateAbbrev: stateCode
                                            }, true)[0];
                                            scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["name"] = stateObj.stateName;
                                            scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["value"] = stateObj.stateAbbrev;
                                        } else {
                                            scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["name"] = "-- Select a state --";
                                            scope.mapItFieldsConfig.dataFields[stateIndex].fieldValue["value"] = "";
                                        }
                                    });
                                });
                            });
                            break;
                        } else {
                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.mapItFieldsConfig.dataFields[stateIndex] = {};
                                    scope.mapItFieldsConfig.dataFields[stateIndex] = {
                                        "fieldName": "state",
                                        "fieldLabel": "State:",
                                        "fieldLabelClasses": "control-label col-sm-4 align-left",
                                        "fieldDivClasses": "col-sm-8",
                                        "fieldClasses": "form-control",
                                        "fieldType": "text",
                                        "orderIndex": 7,
                                        "required": true,
                                        "viewStatus": true,
                                        "editable": true,
                                        "fieldValue": stateCode ? stateCode : "",
                                        "options": "",
                                        "tooltip": null
                                    }
                                    scope.mapItFieldsConfig.dataFields[stateIndex].fieldType = "text";

                                    scope.mapItFieldsConfig.dataFields[stateIndex].options = "";
                                });
                            });
                            break;
                        }
                    }
                }
            }

            scope.isGeocodeDisabled = function () {
                var addressField = $filter('filter')(scope.mapItFieldsConfig.dataFields, {
                    fieldName: "address1"
                }, true)[0];

                var stateField = $filter('filter')(scope.mapItFieldsConfig.dataFields, {
                    fieldName: "state"
                }, true)[0];

                if (addressField.fieldValue && stateField.fieldValue && stateField.fieldValue.value) {
                    return false;
                }

                return true;
            }

            scope.geocodeAddress = function (operationType, lat, lon) {
                var geocodeParamObj = {},
                    countryObj;

                //for (var i = 0; i < scope.mapItFieldsConfig.dataFields.length; i++) {
                if (operationType == "GEOCODE") {
                    for (var i = 0; i < scope.mapItFieldsConfig.dataFields.length; i++) {
                        if (scope.mapItFieldsConfig.dataFields[i].fieldName == "latitude" || scope.mapItFieldsConfig.dataFields[i].fieldName == "longitude") {
                            geocodeParamObj[scope.mapItFieldsConfig.dataFields[i].fieldAlias] = "";
                        } else if (typeof scope.mapItFieldsConfig.dataFields[i].fieldValue === 'object' && scope.mapItFieldsConfig.dataFields[i].fieldValue != null && scope.mapItFieldsConfig.dataFields[i].fieldValue.value) {
                            geocodeParamObj[scope.mapItFieldsConfig.dataFields[i].fieldAlias] = scope.mapItFieldsConfig.dataFields[i].fieldValue.value;
                        } else {
                            geocodeParamObj[scope.mapItFieldsConfig.dataFields[i].fieldAlias] = scope.mapItFieldsConfig.dataFields[i].fieldValue;
                        }
                    }
                } else if (operationType == "RE-GEOCODE") {
                    $filter('filter')(scope.mapItFieldsConfig.dataFields, {
                        fieldName: 'latitude'
                    }, true)[0]["fieldValue"] = lat;

                    $filter('filter')(scope.mapItFieldsConfig.dataFields, {
                        fieldName: 'longitude'
                    }, true)[0]["fieldValue"] = lon;

                    geocodeParamObj["latitude"] = lat;
                    geocodeParamObj["longitude"] = lon;
                } else {
                    return;
                }
                //}

                geocodeParamObj["limit"] = 1;

                scope.promise = geocodeService.geocode(geocodeParamObj).then(function (resp) {
                    if (resp && resp.addressResults && resp.addressResults.addresses && resp.addressResults.addresses.length) {
                        var geoCodeCountry = resp.addressResults.addresses[0].countryCode ? resp.addressResults.addresses[0].countryCode : "US";
                        for (var i = 0; i < scope.mapItFieldsConfig.dataFields.length; i++) {
                            if (scope.mapItFieldsConfig.dataFields[i].fieldName == "countryCode") {
                                countryObj = $filter('filter')(scope.countriesList, {
                                    countryCode: geoCodeCountry
                                }, true)[0];
                                if (countryObj) {
                                    scope.mapItFieldsConfig.dataFields[i].fieldValue["name"] = countryObj.countryName;
                                    scope.mapItFieldsConfig.dataFields[i].fieldValue["value"] = countryObj.countryCode;
                                } else {
                                    scope.mapItFieldsConfig.dataFields[i].fieldValue["name"] = "-- Select a country --";
                                    scope.mapItFieldsConfig.dataFields[i].fieldValue["value"] = "";
                                }
                            } else if (scope.mapItFieldsConfig.dataFields[i].fieldName == "state") {
                                scope.onCountrySelect(geoCodeCountry, resp.addressResults.addresses[0].state);
                            } else {
                                if (operationType != "RE-GEOCODE" && (scope.mapItFieldsConfig.dataFields[i].fieldName != "latitude" || scope.mapItFieldsConfig.dataFields[i].fieldName != "longitude"))
                                    scope.mapItFieldsConfig.dataFields[i].fieldValue = resp.addressResults.addresses[0][scope.mapItFieldsConfig.dataFields[i].fieldName];
                            }
                        }
                        if (operationType != "RE-GEOCODE" && resp.addressResults.addresses.length) {
                            scope.mapItFieldsConfig.mapConfig.center.lat = scope.mapItFieldsConfig.mapConfig.marker.lat = resp.addressResults.addresses[0].latitude;
                            scope.mapItFieldsConfig.mapConfig.center.lon = scope.mapItFieldsConfig.mapConfig.marker.lon = resp.addressResults.addresses[0].longitude;
                            
                            scope.mapItFieldsConfig.mapConfig.mapZoom = 15;
                        }
                    }
                });
            }
        }]
    };
}]);


angular.module('ParcelUI').directive("geocodeMap", function () {
    return {
        restrict: "E",
        replace: true,
        template: "<div></div>",
        scope: {
            center: "=", // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
            marker: "=", // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
            width: "@", // Map width in pixels.
            height: "@", // Map height in pixels.
            zoom: "=", // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
            mapTypeId: "@", // Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
            panControl: "@", // Whether to show a pan control on the map.
            zoomControl: "@", // Whether to show a zoom control on the map.
            scaleControl: "@", // Whether to show scale control on the map.
            draggable: "@" // Whether to allow marker draggable.
        },
        link: function (scope, element, attrs) {
            var toResize, toCenter;
            var map;
            var currentMarker;

            var US_geoCentre = {
                lat: 39.828212077334264,
                lon: -98.5795724196434
            };

            // listen to changes in scope variables and update the control
            var arr = ["width", "height", "markers", "mapTypeId", "panControl", "zoomControl", "scaleControl"];
            for (var i = 0, cnt = arr.length; i < arr.length; i++) {
                scope.$watch(arr[i], function () {
                    cnt--;
                    if (cnt <= 0) {
                        updateControl();
                    }
                });
            }

            // update zoom and center without re-creating the map
            scope.$watch("zoom", function () {
                if (map && scope.zoom)
                    map.setZoom(scope.zoom * 1);
            });

            scope.$watch("center.lat", function () {
                if (map && scope.center) {
                    map.setCenter(getLocation(scope.center));
                }
            });
            
            scope.$watch("marker.lat", function() {
                if (map && scope.marker) {
                    updateMarker();
                }
            });

            // update the control
            function updateControl() {
                // update size
                if (scope.width) element.width(scope.width);
                if (scope.height) element.height(scope.height);

                // get map options
                var options = {
                    center: new google.maps.LatLng(US_geoCentre.lat, US_geoCentre.lon),
                    zoom: 6,
                    mapTypeId: "roadmap"
                };
                if (scope.center) options.center = getLocation(scope.center);
                if (scope.zoom) options.zoom = scope.zoom * 1;
                if (scope.mapTypeId) options.mapTypeId = scope.mapTypeId;
                if (scope.panControl) options.panControl = scope.panControl;
                if (scope.zoomControl) options.zoomControl = scope.zoomControl;
                if (scope.scaleControl) options.scaleControl = scope.scaleControl;

                scope.draggable = (scope.draggable == "true") ? true : false;

                // create the map
                map = new google.maps.Map(element[0], options);

                // update markers
                updateMarker();

                /*google.maps.event.addListener(currentMarker, 'dragend', function () {
                    scope.center.lat = currentMarker.getPosition().lat();
                    scope.center.lon = currentMarker.getPosition().lng();
                    scope.$parent.$parent.geocodeAddress("RE-GEOCODE", scope.center.lat, scope.center.lon);
                });*/
            }

            // update map markers to match scope marker collection
            function updateMarker() {
                if (map && scope.marker) {
                    // create new markers
                    if (currentMarker)
                        currentMarker = currentMarker.setMap(null);
                    var marker = scope.marker;
                    if (angular.isString(marker)) marker = scope.$eval(scope.marker);
                    var loc = new google.maps.LatLng(marker.lat, marker.lon);
                    currentMarker = new google.maps.Marker({
                        position: loc,
                        map: map,
                        title: marker.name,
                        draggable: scope.draggable
                    });

                    google.maps.event.addListener(currentMarker, 'dragend', function () {
                        scope.center.lat = currentMarker.getPosition().lat();
                        scope.center.lon = currentMarker.getPosition().lng();
                        scope.$parent.$parent.geocodeAddress("RE-GEOCODE", scope.center.lat, scope.center.lon);
                    });
                }
            }

            // convert current location to Google maps location
            function getLocation(loc) {
                if (loc == null) return new google.maps.LatLng(US_geoCentre.lat, US_geoCentre.lon);
                if (angular.isString(loc)) loc = scope.$eval(loc);
                return new google.maps.LatLng(loc.lat, loc.lon);
            }
        }
    };
});