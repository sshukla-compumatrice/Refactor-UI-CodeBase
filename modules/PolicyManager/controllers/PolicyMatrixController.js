angular.module('PolicyManagerModule').controller('PolicyMatrixCtrl',['$scope','policyvalues','PolicyShareDataService',function($scope,policyvalues,PolicyShareDataService){


    var policyList = [];
    var policyRange = [];

    $scope.policyValues = [];







        angular.forEach(policyvalues,function(policy){

            if(policy.parameterType == 'List'){

                policyList.push(policy);

            }


        });

        angular.forEach(policyvalues,function(policy){

            if(policy.parameterType == 'Range'){

                policyRange.push(policy);

            }


        });





        $scope.policyValues = policyList.concat(policyRange);

    //$scope.policyValues = policyvalues;

    PolicyShareDataService.setPolicyValues(policyvalues);

}]);
