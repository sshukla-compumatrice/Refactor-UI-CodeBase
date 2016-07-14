angular.module('PolicyManagerModule').controller('PolicyInfoCtrl', ['$scope', 'PolicyShareDataService','PolicyFactory', 'createPolicyInfoData',function ($scope, PolicyShareDataService, PolicyFactory, createPolicyInfoData) {

    var self = this;
    $scope.$on('check-policyinfoname-validaion', function (event) {
        $scope.$broadcast('show-errors-check-validity');

        if (self.policyInfoForm.$invalid) {

        } else {

        }

    })
    
    


    this.policyTypes = createPolicyInfoData.policies;
    this.policyFields = createPolicyInfoData.fields;

    this.setCreatePolicyType = function (policyType) {
        PolicyShareDataService.setCreatePolicyType(policyType);
    }

    this.confirmedPolicyType = function (policyType) {
        var checkedPolicyType = PolicyShareDataService.getCreatePolicyType();
        if (checkedPolicyType == policyType)
            return true;
        else
            return false;
    }
    
    this.setPolicyParam = function(event, fieldName) {
        PolicyShareDataService.setCreatePolicyParam(fieldName,event.target.checked);
    }

    this.isPolicyChecked = function (fieldName) {
        var checkedPolicyParameters = PolicyShareDataService.getCreatePolicyParams();
        for (var i = 0; i < checkedPolicyParameters.length; i++) {
            if (checkedPolicyParameters[i].fieldName == fieldName && checkedPolicyParameters[i].checkedStatus) {
                return true;
            }
        }
        return false;
    }


}]);