angular.module('AccountMgmtModule').service('AppraisalUserServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
               
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        createUser: {
            mock: AccountManagementUrlCollection.POSTAPI_CREATEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSER_REAL
        },
        getAppraisalUser: {
            mock: AccountManagementUrlCollection.GETAPPRAISALUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_GETUSER_REAL
        },       
        updateAppraiserUser: {
            mock: AccountManagementUrlCollection.UPDATEAPPRAISERUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.UPDATEAPPRAISERUSER_REAL
        },  
        deleteUser: {
            mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSER_REAL
        },
        
        changepasswordAppraiser: {
            mock: AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_REAL
        },
        
        UploadFile:{
            mock: AccountManagementUrlCollection.UPLOADFILE_MOCK,
            real: AccountManagementUrlCollection.UPLOADFILE_REAL
        }
        
        
    };
     
     this.getAppraisalInfo = function(AppraisalGUID) {
        
        var url = this.apiType.getAppraisalUser[this.apiType.type];        
        var params = {
            userguid: AppraisalGUID                    
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    }
     
     /*this.getAppraisalListing = function() {
        
        var url = this.apiType.getAppraiserListing[this.apiType.type];        
       
        return AccMgmtFactory.get(url, null).then(function(response){
            return response;
        });
        
    }*/
     
     this.updateappraiseruser = function(userGUID,data){
        var url = this.apiType.updateAppraiserUser[this.apiType.type];        
        var params = {
            userguid: userGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    };        
      
    this.deleteuser = function(userGUID){      
        var url = this.apiType.deleteUser[this.apiType.type];        
        var params = {                       
            userguid:userGUID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
        
    this.ChangePasswordAppraiser = function(userGUID,data){
        var url = this.apiType.changepasswordAppraiser[this.apiType.type];        
        var params = {
            userguid: userGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    }; 
    
    this.UploadFile = function(fileName,data){
        var url = this.apiType.UploadFile[this.apiType.type];        
        var params = {
            filename: filename
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    };      
    
    
}])