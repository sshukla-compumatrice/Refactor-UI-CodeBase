angular.module("ReportAuthoring").service("GeneralInformationAPI", ['APIFactory', 'GeneralInformationUrlCollection', 'BASEURL', function (APIFactory, GeneralInformationUrlCollection, BASEURL) {

    var self = this;
    self.get = function (reportGuid, sectionGuid) {
        var url = BASEURL.REPORTS + GeneralInformationUrlCollection.GETAPI_GI;
        var params = {
            reportGuid: reportGuid,
            sectionGuid: sectionGuid ? sectionGuid : ""
        };
        return APIFactory.get(url, params);
    }
    
    self.putGI = function (data, reportGuid) {
        var url = BASEURL.REPORTS + GeneralInformationUrlCollection.PUTAPI_GI;
        var putData = {
            generalInformation: data
        };
        var params = {
            reportGuid: reportGuid
        };
        return APIFactory.put(url, putData, params).then(function (response) {
            return response.generalInformation;
        });
    };
    
    self.getGeoCode = function (address1, city, state, zip) {
        var url = BASEURL.REPORTAUTHORING_GEODEV + GeneralInformationUrlCollection.GETAPI_GEOCODE;
        var params = {
            address1: address1,
            city: city,
            state: state,
            zip: zip
        };

        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    
    self.updateLatLong=function(propertyGuid,data)
    {
        var url = BASEURL.UPDATE_LATLONG + GeneralInformationUrlCollection.UPDATE_LATLONG;;
        var putData = {
            latlong: data
        };
        
         var params = {
            propertyGuid: propertyGuid
        };
     
        return APIFactory.put(url, putData,params).then(function (response) {
            return response;
        });
    }
}]);