angular.module('SRFModule').factory(
    'SRFCabinetFactory', ['$http', 'SRFUrls','$log','SRFResources',
        function($http, SRFUrls, $log , SRFResources) {

           var cabinetFactoryLogger = $log.getInstance('cabinetFactory');

            cabinetFactoryLogger.info(SRFResources.getCabinetsService);

            var factory = {};

            var cabinetDetailsUrl = SRFUrls.getCabinetDetails;

            var updateCabinetUrl = SRFUrls.updateCabinetDetails;

            var staticPath = SRFUrls.getCabinets;

            var createCabinetUrl = SRFUrls.createCabinets;

            var deleteCabinetUrl = SRFUrls.deleteCabinets;

            //var staticPath = 'staticdata/cabinetJSON.js';

            factory.getCabinets = function() {
                try{

                return $http.get(staticPath,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(
                    function(result) {
                        cabinetFactoryLogger.info(SRFResources.getcabinetSuccessful);
                        return result.data;
                    },function(error){
                        cabinetFactoryLogger.error(error.statusText);
                        return error;
                    });
                }
                catch(error){

                    cabinetFactoryLogger.error(error);
                    throw  error;
                }

            };

            factory.getCabinetDetailsByID = function(id){

                return $http.get(cabinetDetailsUrl + id + '/',{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){

                    return result.data;
                },function(error){
                    cabinetFactoryLogger.error(error);
                    throw  error;

                })
            };



            factory.updateCabinet = function(obj,id){

                return $http.put(updateCabinetUrl + id + '/',obj).then(function(result){
                    return result.data;
                },function(error){

                    cabinetFactoryLogger.error(error);
                    throw error;
                });
            }

            factory.createCabinet = function(obj){
                return $http.post(createCabinetUrl,obj).then(function(result){
                    return result.data;
                },function(error){
                    cabinetFactoryLogger.error(error);
                    throw error;
                })
            }

            factory.deleteCabinet = function(id){
                return $http.delete(deleteCabinetUrl + id + '/').then(function(result){
                    return result.data;
                },function(error){
                    cabinetFactoryLogger.error(error);
                    throw error;
                })
            }

            return factory;

        }
    ]);


