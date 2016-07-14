angular.module('LenderProjectCreation').factory('LenderProjectStartupAPIFactory', ['$http', 'Urls','APIFactory','BASEURL', function ($http, urlColl,APIFactory,BASEURL) {

    // helpers
    var parseServiceRespForError = function (rawResp) {
        var data = rawResp.data;
        var result = data.result;
        if (!result || !result.success) throw new Error(result.messages);
        return result;
    }

    return {
        getData: function (companyId) {
              var uri = BASEURL.LENDERPROJECTCREATION_PROJECTSTARTUP + urlColl.getProjectStartupFormData;
            var params = {
                companyID: companyId
            };
            return APIFactory.get(uri, params);
            //var uri = urlColl.getProjectStartupFormData + companyId;
//            var uri = 'app/modules/LenderProjectCreation/sampleJson/ProjectStartup.js';
//            return $http({
//                method: 'GET',
//                url: uri,
//                header: {
//                    'Content-Type': 'application/json',
//                    'Cache-Control': 'no-cache, no-store, must-revalidate',
//                    'Pragma': 'no-cache',
//                    'Expires': 0
//                }
//            }).then(function (results) {
//                return results.data;
//            }, function (error) {
//                console.log('error: ' + error);
//            });
        },

        postData: function (companyId, data) {
            var uri = BASEURL.LENDERPROJECTCREATION_POSTSINGLESITEPROJECT + urlColl.postSingleSiteProjectFormData + companyId;
            return $http({
                method: 'POST',
                url: uri,
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (results) {
                //var retVal = parseServiceRespForError(results);
                //return retVal;
                return results.data;
            });
        }
    }
}])