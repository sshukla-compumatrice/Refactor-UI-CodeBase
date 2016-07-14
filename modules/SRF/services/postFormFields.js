angular.module('SRFModule').factory(
    'postDatafactory', ['$http', 'SRFUrls','$log','SRFResources',
        function($http, SRFUrls,$log,SRFResources) {

         var postFormDataLogger = $log.getInstance('postFormDataFactory');

         postFormDataLogger.info(SRFResources.postService);

            var factory = {};

            var staticPath = SRFUrls.postFormData;



            factory.postData = function(obj) {

                try{

                    //postFormDataLogger.debug("posted data object " + JSON.stringify(obj));

                return $http.post(staticPath,obj).then(
                    function(result) {

                        postFormDataLogger.info(SRFResources.postDataSuccess);
                        return result;
                    },function(error){
                        console.log("error result " + JSON.stringify(error));
                        postFormDataLogger.error(error.statusText);
                        return error;
                    });
                }
                catch(e){
                    postFormDataLogger.info(SRFResources.postDataError);
                    postFormDataLogger.error(e);
                }

            };

            return factory;

        }
    ]);
