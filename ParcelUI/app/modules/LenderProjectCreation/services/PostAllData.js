angular.module('LenderProjectCreation').factory('PostDataFactory', ['$http', 'Urls', '$log','BASEURL', function($http, Urls, $log,BASEURL) {

    try {
        var postDataFactoryLogger = $log.getInstance('postDataFactory');

        postDataFactoryLogger.info("service to post data reached");
        var postData = {};

        var path = BASEURL.LENDERPROJECTCREATION + Urls.postProjectCreationData;

        postData.submitData = function(data) {

            console.log("response post service ");
            return $http.post(path, data).then(
                function(results) {

                    return results.data;
                },
                function(error) {

                    postDataFactoryLogger.error(error.statusText);

                });


        }
    } catch (e) {
        postDataFactoryLogger.info("error in posting data service");
        postDataFactoryLogger.error("e");
    }






    return postData;

}]);