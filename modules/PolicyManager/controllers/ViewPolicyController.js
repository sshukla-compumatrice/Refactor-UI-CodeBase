angular.module('PolicyManagerModule').controller('PolicyViewCtrl', ['$scope', 'policyMatrixData', '$timeout', '$state', '$stateParams', 'PolicyShareDataService', function ($scope, policyMatrixData, $timeout, $state, $stateParams, PolicyShareDataService) {



    this.policyClicked = false;

    $scope.getPolicyNameTypes = function () {
        var policyNamesType = [];
        var policies = PolicyShareDataService.getPolicyManagerData();
        policies = policies.policies.filter(function (item) {
            return (item.policyName != '' && item.hasOwnProperty('rawMatrix'))
        });
        angular.forEach(policies, function (policy, i) {
            var item = {};
            item["policyName"] = policy.policyName;
            if (policy.hasOwnProperty('versionStatus')) {
                if (policy.versionStatus.toUpperCase() == "DRAFT")
                    item['policyName'] = policy.policyName + ' (' + policy.versionStatus + ')';
            }
            item['policyType'] = policy.policyType;
            policyNamesType.push(item);
        });
        return policyNamesType;
    };



    $scope.getCustomizedJsonPolicyMatrix = function (policyMatrixData) {
        //var policyMatrixData = PolicyShareDataService.getPolicyManagerData();
        //factory.getCustomizedJsonPolicyMatrix = function(data,type)
        //{
        //------Customize JSON according to table-------------------
        var mainObj = [];
        var policy = policyMatrixData;
        //angular.forEach(data.policies ,function(policy,p)
        //{
        if (policy != undefined && policy.rawMatrix != undefined) { // if policy contains rawMatrix thn only get for view.

            var fieldOrder = policy.rawMatrix[0].fieldOrder;
            fieldOrder.push("Suggested Actions");

            angular.forEach(policy.rawMatrix[0].rows, function (cols, i) {
                var jsonObj = []; //forEachRow        

                for (z = 0; z < cols.columns.length; z++) //forEachColumns
                {

                    for (t = 0; t < fieldOrder.length - 1; t++) {
                        var item = {};
                        var fieldValue = {};
                        var colfilter = cols.columns.filter(function (item) {
                            return item.fieldName == fieldOrder[t];
                        })[0];

                        if (colfilter != undefined) {
                            if (colfilter.ruleType == "Range") {
                                item["fieldName"] = fieldOrder[t];
                                item["fieldValue"] = colfilter.upperBound + ' - ' + colfilter.lowerBound;

                            } else if (colfilter.ruleType == "Value") {
                                item["fieldName"] = fieldOrder[t];
                                item["fieldValue"] = colfilter.ruleValue
                                    //fieldValue[t] = colfilter.ruleValue;

                            }
                            //console.log(item);
                            //fieldValue+i.push(item);
                            jsonObj.push(item);
                        }
                    }
                    //for suggested actions (decisions)
                    var colfilter = cols.columns.filter(function (item) {
                        return item.decisions;
                    })[0];
                    var fieldVal = colfilter.decisions.join();
                    var decisionItem = {};
                    decisionItem["fieldName"] = fieldOrder[t];
                    decisionItem["fieldValue"] = fieldVal;
                    jsonObj.push(decisionItem);
                    mainObj.push(jsonObj);
                    break;
                }
            }); //end of second for

            //}); // end of first for

        } // End of If(policy.rowMatrix)

        //}); // End of policies in response.data

        //----------------------------------------------------------

        return mainObj;
        //}

    };

    if (policyMatrixData != undefined && policyMatrixData.hasOwnProperty('rawMatrix')) {
        $scope.policyNamesType = $scope.getPolicyNameTypes();
        console.log('data is; ' + JSON.stringify($scope.policyNamesType));
        $scope.policyMatrixData = $scope.getCustomizedJsonPolicyMatrix(policyMatrixData);

        $timeout(function () {
            $(document).ready(function () {
                $('#tblPolicyView').DataTable({
                    paging: false,
                    info: false,
                    search: false,
                    filter: false
                });

            });
        });
    }


    
        this.redirectToCreatePolicy = function () {
            $state.go('Policy.Information');
        }

    

    $scope.redirectToPolicy = function (policyType) {
        this.policyClicked = true;
        $state.go('ViewPolicy', {
            type: policyType
        });
    }

}]);