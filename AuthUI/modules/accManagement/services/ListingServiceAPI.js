angular.module('AccountMgmtModule').service('ListingsAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory, AccountManagementUrlCollection, BASEURL){
    
    this.getListings = function (types) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_LISTINGS_REAL;
        var params = {
            types: types
        }

        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    
}]);