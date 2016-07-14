angular.module('AccountMgmtModule').service('searchAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory, AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        searchCompanies: {
            mock: AccountManagementUrlCollection.SEARCHCOMPANY_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SEARCHCOMPANY_REAL
        },
        searchOffices: {
            mock: AccountManagementUrlCollection.SEARCHOFFICE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SEARCHOFFICE_REAL
        },
        searchUsers: {
            mock: AccountManagementUrlCollection.SEARCHUSERS_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SEARCHUSERS_REAL
        }
    };
    
    
    this.searchCompanies = function(searchString){
        var url = this.apiType.searchCompanies[this.apiType.type];        
        var queryParams = {};
        queryParams.search = searchString ? searchString : "";
        return AccMgmtFactory.get(url, queryParams).then(function(results){
            return results;
        });
    }
     
    
    this.searchOffices = function(searchString){
        var url = this.apiType.searchOffices[this.apiType.type];        
        var queryParams = {};
        queryParams.search = searchString ? searchString : "";
        return AccMgmtFactory.get(url, queryParams).then(function(results){
            return results;
        });
    }
    
    this.searchUsers = function(searchString){
        var url = this.apiType.searchUsers[this.apiType.type];        
        var queryParams = {};
        queryParams.search = searchString ? searchString : "";
        return AccMgmtFactory.get(url, queryParams).then(function(results){
            return results;
        });
    }   
    
}])