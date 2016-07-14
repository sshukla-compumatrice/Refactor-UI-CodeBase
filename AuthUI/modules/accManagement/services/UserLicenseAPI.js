angular.module('AccountMgmtModule').service('LicenseServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory, AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getUserLicense: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWLICENSE_REAL
        },
        updateUserLicense: {
            mock: AccountManagementUrlCollection.PUTAPI_UPDATELICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATELICENSE_REAL
        },
        createUserLicense:{
            mock: AccountManagementUrlCollection.POSTAPI_CREATEUSERLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSERLICENSE_REAL
        },
        deleteUserLicense: {
            mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSERLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSERLICENSE_REAL
        },        
        verifyLicense: {
            mock: AccountManagementUrlCollection.VERIFYUSERLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_VERIFYUSERLICENSE_REAL
        }
        
    };
                 
     this.getuserlicense = function(userGUID) {
        
        var url = this.apiType.getUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID,
            licenseguid: "",
            filtertype: ""
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    } 
     
     this.getmostRecentuserlicense = function(userGUID) {
        var filter = 'mostrecent';
        var url = this.apiType.getUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID,
            licenseguid: "",
            filter:filter
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    } 
    
     this.updateUserLicense = function(userGUID,licenseGUID,data){
        var url = this.apiType.updateUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID,
            licenseguid:licenseGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    };  
    
    this.createUserLicense = function(userGUID,data){
        var url = this.apiType.createUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID            
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });
    };  
    
      this.deleteuserlicense = function(userGUID,licenseGUID){      
        var url = this.apiType.deleteUserLicense[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            licenseguid:licenseGUID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    
    this.verifyUserLicense = function(LicenseData,userGUID,licenseGUID){
      
        var url = this.apiType.verifyLicense[this.apiType.type];   
         var params = {                       
            userguid:userGUID,
            userlicenseguid:licenseGUID
        };
        return AccMgmtFactory.post(url, LicenseData, params).then(function(response){
            return response;
        });  
    };
    
}])