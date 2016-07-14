angular.module('AccountMgmtModule').service('InsuranceServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getUserInsurance: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWINSURANCE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWINSURANCE_REAL
        },
        updateUserInsurance:{
             mock: AccountManagementUrlCollection.PUTAPI_UPDATEINSURANCE_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATEINSURANCE_REAL
        },
        
        deleteUserInsurance :{
             mock: AccountManagementUrlCollection.DELETEAPI_DELETEINSURANCE_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEINSURANCE_REAL
        },
        
        createUserInsurance:{            
             mock: AccountManagementUrlCollection.POSTAPI_CREATEINSURANCE_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEINSURANCE_REAL
        }
        
    };
                 
     this.getuserinsurance = function(userGUID) {
        
        var url = this.apiType.getUserInsurance[this.apiType.type];        
        var params = {
            userguid: userGUID                    
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    } 
    
    this.updateuserinsurance =  function(userguid,insuranceguid,data){
        
        var url = this.apiType.updateUserInsurance[this.apiType.type];        
        var params = {
            userguid: userguid,
            insuranceguid:insuranceguid
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    }
    
     this.deleteuserinsurance = function(userGUID,insuranceguid){      
        var url = this.apiType.deleteUserInsurance[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            insuranceguid:insuranceguid
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    
    this.createuserinsurance = function(userguid,data){
        
        var url = this.apiType.createUserInsurance[this.apiType.type];        
        var params = {
            userguid: userguid            
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });                 
    }
    
}])