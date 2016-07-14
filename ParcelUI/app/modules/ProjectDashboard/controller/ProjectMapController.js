angular.module('ProjectDashboard').controller('ProjectMap', ['$state', '$stateParams', 'dashBoardData', 'projectDashboardOperations','$timeout', '$window', function ($state, $stateParams, dashBoardData, projectDashboardOperations,$timeout,$window) {

   


    var self = this;
    init();


    function init() {
        self.addressArray = [];
        self.addresses = [];
        self.showFullAddress = {};        
        self.latlongArray = [];
        getAddressArray();
        self.addresses = dashBoardData.dashboard.data;
    }
	
	self.closeProjectmapwindow = function () {
        $window.close();
    }

    function getAddressArray() { 
        angular.forEach(dashBoardData.dashboard.data, function (singleAddress, index) {
            self.addressArray.push(singleAddress.address + " " + singleAddress.city + " " + singleAddress.state + " " + singleAddress.zipCode);
        })
        getLatLong(self.addressArray);        
    }
    
    function callBack (coordinates, status){
        if (status === google.maps.GeocoderStatus.OK) {
                    createMarker(self.currentProcessedAddress, coordinates[0], coordinates[1]);
                } 
        else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
            $timeout(function(){
                projectDashboardOperations.getLatitudeLongitude(self.currentProcessedAddress,callBack);
            },2000);          
        }
    }


    function getLatLong(array) {
        self.mapObject = projectDashboardOperations.mapGlobalSettings(39.50, -98.35,4, google.maps.MapTypeId.ROADMAP, "mapCanvas");
        angular.forEach(self.addressArray, function (address) {
            $timeout(function(){
                projectDashboardOperations.getLatitudeLongitude(address, function (coordinates, status) {              
                if (status === google.maps.GeocoderStatus.OK) {
                    createMarker(address, coordinates[0], coordinates[1]);
                } 
            })
            },2000);
            
            
        })


    }


    function createMarker(address, lat, lng) {
        var contentString = address;
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: self.mapObject.map
        });
       
    
        google.maps.event.addListener(marker, 'click', function () {
            self.mapObject.infowindow.setContent(contentString);
            self.mapObject.infowindow.open(self.mapObject.map, marker);
        });
    }



}])