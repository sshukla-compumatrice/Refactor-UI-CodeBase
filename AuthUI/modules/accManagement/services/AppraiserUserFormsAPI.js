angular.module('AccountMgmtModule').service('UserFormsServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection','BASEURL' ,function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getForms: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWALLUSERFORMS_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWALLUSERFORMS_REAL
        },
        deleteForm :{
             mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSERFORMS_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSERFORMS_REAL
        },
        createForm :{
             mock: AccountManagementUrlCollection.POSTAPI_CREATEUSERFORMS_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSERFORMS_REAL
        },
        updateUserForms : {
             mock: AccountManagementUrlCollection.PUTAPI_UPDATEUSERFORMS_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATEUSERFORMS_REAL
        }   
        
    };
                 
     this.getuserw9form = function(userGUID) {
        
        var url = this.apiType.getForms[this.apiType.type];        
        var params = {
            userguid: userGUID,
            formguid: "",
            formtype: "w9"
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    }
     
    this.getUserAdditionalDocuments = function(userGUID, formguid){
        var url = this.apiType.getForms[this.apiType.type];        
        var params = {
            userguid: userGUID,
            formguid: formguid ? formguid : ""
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
    } 
     
     this.deleteuserw9form = function(userGUID, w9formGUID){
         
        var url = this.apiType.deleteForm[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            formguid:w9formGUID
        };

        return AccMgmtFactory.delete(url, null, params);
     }
    
    
     this.createuserform = function(userGUID,data){
        
        var url = this.apiType.createForm[this.apiType.type];        
        var params = {
            userguid: userGUID            
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });
         
     }
    
     this.deleteadditionaldocument = function(userGUID,formGUID){
          var url = this.apiType.deleteForm[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            formguid: formGUID
        };

        return AccMgmtFactory.delete(url, null, params);
     }
     
     this.updateadditionaldocument = function(userGUID, formGUID,data){
         
        var url = this.apiType.updateUserForms[this.apiType.type];        
        var params = {
            userguid: userGUID,
            formguid:formGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
     }
    
}])