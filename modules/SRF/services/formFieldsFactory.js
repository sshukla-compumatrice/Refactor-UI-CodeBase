
angular.module('SRFModule').service('GetSRFFormDataFactory',['$http','SRFResources','$log','SRFUrls', function FormService($http,SRFResources,$log,SRFUrls) {

    var formFactoryLogger = $log.getInstance('formFactory');
    formFactoryLogger.info(SRFResources.getFormAndReportService);

    var getSingleFormJSON = 'modules/SRF/staticdata/singleFormJSON.js';
    var getSectionalFormJSON = 'modules/SRF/staticdata/sampleData.js';
    //var getSectionalFormJSON = SRFUrls.getFormStructure;
    var getPropertySectionalFormJSON ="modules/Property/staticdata/loandetailsJSON.js";




    return {




        sectionalForm : function() {
            try{
                var ajaxTime = new Date().getTime();
                console.log("ajaxTime " + ajaxTime);
            return $http.get(getSectionalFormJSON,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function (response) {
                var totalTime = new Date().getTime()-ajaxTime;
                console.log("totalTime " + totalTime);

                return response.data;
            },function(error){
                formFactoryLogger.error(error.statusText);
                return error;
            });
            }
            catch(e){
                formFactoryLogger.info(SRFResources.getFormUnsuccessful);
                formFactoryLogger.error(e);
            }
        },

        propertySectionalForm : function() {
            try{
                var ajaxTime = new Date().getTime();
                console.log("ajaxTime " + ajaxTime);
            return $http.get(getPropertySectionalFormJSON).then(function (response) {
                var totalTime = new Date().getTime()-ajaxTime;
                console.log("totalTime " + totalTime);

                return response.data;
            },function(error){
                formFactoryLogger.error(error.statusText);
                return error;
            });
            }
            catch(e){
                formFactoryLogger.info(SRFResources.getFormUnsuccessful);
                formFactoryLogger.error(e);
            }
        }





    };
}]);
