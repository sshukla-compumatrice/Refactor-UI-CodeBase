angular.module('PolicyManagerModule').factory('PolicyShareDataService',function(){

    var sharedata = {};
    var policyManagerData = {};

    var policy = {
            'policyname' : '',
            'policytype' : ''
    }   

    var policyValues = {};
    var createPolicyParams = [];
    var createPolicyType = null;
    
    sharedata.getSharedData = function() {
        return sharedata;
    }
    
    sharedata.setPolicyManagerData = function(data) {
        policyManagerData = data;
    } 
    
    sharedata.getPolicyManagerData = function(data) {
        return policyManagerData;
    }
    
    sharedata.getPolicyFields = function() {
        return policyManagerData.fields;
    }
    
    sharedata.getPolicies = function() {
        return policyManagerData.policies;
    }
    
    sharedata.setCreatePolicyType = function() {
        createPolicyType = policyType;
    }
    
    sharedata.getCreatePolicyType = function() {
        return createPolicyType;
    }
    
    sharedata.setCreatePolicyParams = function() {        
        for(var i=0; i<policyManagerData.fields.length; i++) {
            var policyParamObj = {};
            policyParamObj['fieldName'] = policyManagerData.fields[i].fieldName;
            if(policyManagerData.fields[i].fieldName == 'loanAmount' || policyManagerData.fields[i].fieldName == 'loanType') {                
                policyParamObj['checkedStatus'] = true;
            }
            else {
                policyParamObj['checkedStatus'] = false;
            }
            createPolicyParams.push(policyParamObj);
        }        
    }
    
    sharedata.getCreatePolicyParams = function() {
        return createPolicyParams;
    }
    
    sharedata.setCreatePolicyParam = function(fieldName, checkedStatus) {
        for(var i=0; i<createPolicyParams.length; i++) {
            if(createPolicyParams[i].fieldName == fieldName) {
                createPolicyParams[i].checkedStatus = checkedStatus;
                break;
            }
        }
    }
    
    sharedata.resetCreatePolicyData = function() {
        createPolicyType = null;
        createPolicyParams = ['loanAmount','loanType'];
    }
    
    return sharedata;
})
