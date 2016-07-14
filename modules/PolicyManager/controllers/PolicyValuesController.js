angular.module('PolicyManagerModule').controller('PolicyValuesCtrl', ['$scope', 'PolicyShareDataService','PolicyFactory', 'createPolicyValuesData',function ($scope, PolicyShareDataService, PolicyFactory, createPolicyValuesData) {    
    
    getSelectedParamFieldsDetails = function() {
        var policyParamDetails = [];
        selectedPolicyParams = PolicyShareDataService.getCreatePolicyParams();
        policyFields = createPolicyValuesData.fields;
        
        for(var i=0; i<selectedPolicyParams.length; i++) {
            if(selectedPolicyParams[i].checkedStatus) {
                var policyDetailObj = {
                            "fieldName"      : policyFields[i].fieldName,
                            "fieldLabel"     : policyFields[i].fieldLabel,
                            "fieldType"      : policyFields[i].fieldType,
                            "fieldOptions"   : policyFields[i].fieldOptions
                          }
                policyParamDetails.push(policyDetailObj);
            }
        }
        return policyParamDetails;
    }
    
    this.selectedParamFieldsDetails = getSelectedParamFieldsDetails();
    
}]);
