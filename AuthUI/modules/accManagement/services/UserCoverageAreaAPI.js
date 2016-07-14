angular.module('AccountMgmtModule').service('CoverageAreaServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection','BASEURL' ,function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getUserCoverageArea: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWCOVERAGEAREA_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWCOVERAGEAREA_REAL
        },    
        
        deleteUserCoverageArea :{
             mock: AccountManagementUrlCollection.DELETEAPI_DELETECOVERAGEAREA_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETECOVERAGEAREA_REAL
        },
        
        AddToCoverage: {
            mock: AccountManagementUrlCollection.POSTAPI_ADDTOCOVERAGE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_ADDTOCOVERAGE_REAL
        }
        
    };
                 
     this.getUserCoverageArea = function(userGUID) {
        
        var url = this.apiType.getUserCoverageArea[this.apiType.type];        
        var params = {
            userguid: userGUID,
            coverageareaguid: ""
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    }         
    
     this.deleteCoverageArea = function(userGUID,coverageareaguid){      
        var url = this.apiType.deleteUserCoverageArea[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            coverageareaguid:coverageareaguid
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    
    this.createUserCoverageArea = function(userGUID,data){
        
        var url = this.apiType.AddToCoverage[this.apiType.type];        
        var params = {
            userguid: userGUID,
            coverageareaguid: ""
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });
    }    
}]);