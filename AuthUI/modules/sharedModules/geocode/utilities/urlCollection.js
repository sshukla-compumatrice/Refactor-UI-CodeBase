angular.module('AccessManagement').constant('geocodeUrlCollection', {
    GETAPI_GEOCODE_REAL: '/addresses?locationid={locationid}&sitename={sitename}&address1={address1}&address2={address2}&city={city}&state={state}&zipcode={zipcode}&latitude={latitude}&longitude={longitude}&distance={distance}&geosettingscode={geosettingscode}&minScore={minScore}&limit={limit}&offset={offset}',
    GETAPI_GEOCODE_MOCK: 'http://private-1b1308-edrcorelocationservicesapi.apiary-mock.com/addresses?locationid={locationid}&sitename={sitename}&address1={address1}&address2={address2}&city={city}&state={state}&zipcode={zipcode}&latitude={latitude}&longitude={longitude}&distance={distance}&geosettingscode={geosettingscode}&minScore={minScore}&limit={limit}&offset={offset}',
    
    GETAPI_COUNTRIES_REAL: '/countries',
    GETAPI_COUNTRIES_MOCK: 'http://private-1b1308-edrcorelocationservicesapi.apiary-mock.com/countries/{countrycode}',
    
    GETAPI_STATES_REAL: '/countries/{countrycode}/states/{statecode}',
    GETAPI_STATES_MOCK: 'http://private-1b1308-edrcorelocationservicesapi.apiary-mock.com/countries/{countrycode}/states/{statecode}',
    
    GETAPI_COUNTIES_REAL: '/countries/{countrycode}/states/{statecode}/counties/{fips}',
    GETAPI_COUNTIES_MOCK: 'http://private-1b1308-edrcorelocationservicesapi.apiary-mock.com/countries/{countrycode}/states/{statecode}/counties/{fips}'
});