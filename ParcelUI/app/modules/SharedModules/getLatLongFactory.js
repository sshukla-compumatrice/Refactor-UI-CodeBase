angular.module('ProjectDashboard').factory('getLatitudeLongitude',function(){
    var factory = {};
    factory.getLatitudeLongitude = function (address, callback) {

            geocoder = new google.maps.Geocoder();

            var coordinates;

          
            geocoder.geocode({ address: address }, function (results, status) {


                console.log("API stats " + status)

                if (status == "OK") {
                    coords_obj = results[0].geometry.location;

                    coordinates = [coords_obj.k, coords_obj.B]
                }

                callback(coordinates,status);



            })
        }
    
    return factory;
})

   


    

