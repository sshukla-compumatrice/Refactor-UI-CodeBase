angular.module('ReportAuthoring').factory('associatePhotosAPI', ['APIFactory', 'BASEURL', 'AppendicesUrlCollection', function (APIFactory, BASEURL, AppendicesUrlCollection) {
    return {
        getImageColl: function (reportID, sectionGUID) {

            var url = BASEURL.appendicesPOC + AppendicesUrlCollection.GETAPI_APPENDIXPHOTOS;
            var params = {
                reportID: reportID,
                sectionGUID: sectionGUID
            };
            return APIFactory.get(url, params).then(function (results) {
                //return results;
                return results.photos;
            })
        },

        get: function (id, sectionId) {


            var url = "app/modules/ReportAuthoring/directives/associatePhotos/sampleJson/associated_{id}_{sectionId}.json";
            var queryParams = {
                id: id,
                sectionId: sectionId
            };
            return APIFactory.get(url, queryParams).then(function (response) {
                return response;
            });
        }
    }
}])
