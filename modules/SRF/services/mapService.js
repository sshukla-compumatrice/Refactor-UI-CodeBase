angular.module('SRFModule').service('SetMarker',['$rootScope',function($rootScope){

    return {
        marker : function(mapObj,scope,type){
            var myLatLng = {lat: mapObj.lat, lng: mapObj.lng};
                 var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: mapObj.map,
                        draggable: true

                      });

                mapObj.map.panTo(myLatLng);

            if(type == 'button'){

                scope.$emit('SetLatLongOnClick',myLatLng);

            }
                google.maps.event.addListener(marker, 'dragend', function (event) {


                     myLatLng.lat  = this.getPosition().lat();
                     myLatLng.lng = this.getPosition().lng();

                     scope.$emit('SetLatLongOnMarker',myLatLng);
                     //setLatLong(lat , long);

                });
        }
    }

}]);
