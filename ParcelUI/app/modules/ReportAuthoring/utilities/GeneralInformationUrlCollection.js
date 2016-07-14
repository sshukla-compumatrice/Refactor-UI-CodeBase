angular.module('ReportAuthoring').constant('GeneralInformationUrlCollection', {
    GETAPI_GI: "{reportGuid}/generalInfo?sectionGUID={sectionGuid}",
    PUTAPI_GI: "{reportGuid}/generalInfo",
    GETAPI_GEOCODE: "addresses?address1={address1}&city={city}&state={state}&zip={zip}",    
    UPDATE_LATLONG:"{propertyGuid}/latlong"
});
