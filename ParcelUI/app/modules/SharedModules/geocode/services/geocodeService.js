angular.module('ParcelUI').service('geocodeService', ['APIFactory', 'geocodeUrlCollection', 'BASEURL', function (APIFactory, geocodeUrlCollection, BASEURL) {

    this.apiType = {
        type: 'real',
        //type: 'mock',

        geocode: {
            mock: geocodeUrlCollection.GETAPI_GEOCODE_MOCK,
            real: BASEURL.SHARED_GEOCODE + geocodeUrlCollection.GETAPI_GEOCODE_REAL
        },
        getCountries: {
            mock: geocodeUrlCollection.GETAPI_COUNTRIES_MOCK,
            real: BASEURL.SHARED_GEOCODE + geocodeUrlCollection.GETAPI_COUNTRIES_REAL
        },
        getStates: {
            mock: geocodeUrlCollection.GETAPI_STATES_MOCK,
            real: BASEURL.SHARED_GEOCODE + geocodeUrlCollection.GETAPI_STATES_REAL
        },
        getCounties: {
            mock: geocodeUrlCollection.GETAPI_COUNTIES_REAL,
            real: BASEURL.SHARED_GEOCODE + geocodeUrlCollection.GETAPI_COUNTIES_REAL
        }
    };

    this.geocode = function (geocodeParams) {
        var url = this.apiType.geocode[this.apiType.type];
        var queryParams = {};

        queryParams.locationid = geocodeParams.locationid ? geocodeParams.locationid : "";
        queryParams.sitename = geocodeParams.sitename ? geocodeParams.sitename : "";
        queryParams.address1 = geocodeParams.address1 ? geocodeParams.address1 : "";
        queryParams.address2 = geocodeParams.address2 ? geocodeParams.address2 : "";
        queryParams.city = geocodeParams.city ? geocodeParams.city : "";
        queryParams.state = geocodeParams.state ? geocodeParams.state : "";
        queryParams.zipcode = geocodeParams.zipcode ? geocodeParams.zipcode : "";
        queryParams.latitude = geocodeParams.latitude ? geocodeParams.latitude : "";
        queryParams.longitude = geocodeParams.longitude ? geocodeParams.longitude : "";
        queryParams.distance = geocodeParams.distance ? geocodeParams.distance : 0;
        queryParams.geosettingscode = geocodeParams.geosettingscode ? geocodeParams.geosettingscode : "";
        queryParams.minScore = geocodeParams.minScore ? geocodeParams.minScore : -1;
        queryParams.limit = geocodeParams.limit ? geocodeParams.limit : "";
        queryParams.offset = geocodeParams.offset ? geocodeParams.offset : "";

        return APIFactory.get(url, queryParams);
    };
    
    this.getCountries = function (countryCode) {
        var url = this.apiType.getCountries[this.apiType.type];
        var queryParams = {};
        
        queryParams.countrycode = countryCode ? countryCode : "";
        
        return APIFactory.get(url, queryParams);
    }

    this.getStates = function (countryCode, statecode) {
        var url = this.apiType.getStates[this.apiType.type];
        var queryParams = {};
        
        queryParams.countrycode = countryCode ? countryCode : "";
        queryParams.statecode = statecode ? statecode : "";
        
        return APIFactory.get(url, queryParams);
    }
    
    this.getCounties = function (countryCode, statecode, fips) {
        var url = this.apiType.getCounties[this.apiType.type];
        var queryParams = {};
        
        queryParams.countrycode = countryCode ? countryCode : "";
        queryParams.statecode = statecode ? statecode : "";
        queryParams.fips = fips ? fips : "";
        
        return APIFactory.get(url, queryParams);
    }
}]);