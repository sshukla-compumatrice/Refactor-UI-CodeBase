angular.module('PolicyManagerModule').factory('PolicyFactory', ['$http', '$log','PolicyShareDataService',function ($http, $log, PolicyShareDataService) {

        var factory = {};
    
        var getPolicyManagerDataSample = 'modules/PolicyManager/staticdata/policyManagerJSON.js';

        factory.getPolicyManagerData = function () {
            try {
                var ajaxTime = new Date().getTime();
                console.log("ajaxTime " + ajaxTime);                
                    return $http.get(getPolicyManagerDataSample, {
                        headers: {
                            'Content-Type': undefined,
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': 0
                        }
                    }).then(function (response) {
                        var totalTime = new Date().getTime() - ajaxTime;
                        console.log("totalTime " + totalTime);
                        PolicyShareDataService.setPolicyManagerData(response.data);
                        PolicyShareDataService.setCreatePolicyParams();
                        return response.data;
                    }, function (error) {
                        //formFactoryLogger.error(error.statusText);
                        return error;
                    });
            }
            catch (e) {
            //formFactoryLogger.info(SRFResources.getFormUnsuccessful);
            //formFactoryLogger.error(e);
            }            
        };
    
        factory.getPolicyMatrixData = function () {
            try {


                return $http.get('modules/PolicyManager/staticdata/policyMatrixJSON.js', {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    var fieldValue = {};
                    for (var i = 0; i < response.data.rawMatrix[0].fieldOrder.length; i++) {
                        fieldValue[i] = [];
                    }
                    console.log("fieldValue Object " + fieldValue)
                    var allRowsArray = response.data.rawMatrix[0].rows;
                    for (var i = 0; i < allRowsArray.length; i++) {
                        for (var j = 0; j < response.data.rawMatrix[0].fieldOrder.length; j++) {
                            var columnsInSingleRowArray = allRowsArray[i].columns;
                            if (allRowsArray[i].columns[j].ruleType == "Range") {
                                fieldValue[j].push(allRowsArray[i].columns[j].lowerBound + '-' + allRowsArray[i].columns[j].upperBound);
                            } else if (allRowsArray[i].columns[j].ruleType == "Value") {
                                fieldValue[j].push(allRowsArray[i].columns[j].ruleValue);
                            } else if (allRowsArray[i].columns[j].ruleType == "") {
                                fieldValue[j].push("");
                            }
                        }


                    }
                    
                    console.log("hghghghg " + JSON.stringify(fieldValue));

                    return response.data;
                }, function (error) {
                    //formFactoryLogger.error(error.statusText);
                    return error;
                });

            } catch (e) {
                //formFactoryLogger.info(SRFResources.getFormUnsuccessful);
                //formFactoryLogger.error(e);
            }
        };
    

        return factory;
}
]);