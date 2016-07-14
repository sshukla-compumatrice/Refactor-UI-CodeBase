angular.module('AccountMgmtModule').service('roleServiceAPI', ['AccessMgmtFactory', 'rolesUrlCollection', 'BASEURL', function (AccMgmtFactory, rolesUrlCollection, BASEURL) {
    var self = this;

    this.getRoleInformation = function (roleguid, ownerguid, ownertype, accessentityguid, accessentitytype, applicationguid, name, detail, status, limit, offset) {
        var url = BASEURL.ACCESS_MGMT_SHARED + rolesUrlCollection.GETAPI_GETROLEINFO;
        var queryParams = {};
        queryParams.roleguid = roleguid ? roleguid : "";
        queryParams.ownerguid = ownerguid ? ownerguid : "";
        queryParams.ownertype = ownertype ? ownertype : "";
        queryParams.accessentityguid = accessentityguid ? accessentityguid : "";
        queryParams.accessentitytype = accessentitytype ? accessentitytype : "";
        queryParams.applicationguid = applicationguid ? applicationguid : "";
        queryParams.name = name ? name : "";
        queryParams.detail = detail ? detail : "";
        queryParams.status = status ? status : "";
        queryParams.limit = limit ? limit : "";
        queryParams.offset = offset ? offset : "";

        return AccMgmtFactory.get(url, queryParams).then(function (response) {
            return response;
        });
    }
    
    this.createRoleAccessEntityAssignment = function(data) {
        var url = BASEURL.ACCESS_MGMT_SHARED + rolesUrlCollection.POSTAPI_ROLEACCESSENTITYASSIGNMENTS;

        return AccMgmtFactory.post(url, data, false).then(function (response) {
            return response;
        });
    }
    
    this.updateRoleAccessEntityAssignment = function(data, roleAccessEntityGUID) {
        var url = BASEURL.ACCESS_MGMT_SHARED + rolesUrlCollection.PUTAPI_ROLEACCESSENTITYASSIGNMENTS;
        var queryParams = {};
        queryParams.roleAccessEntityGUID = roleAccessEntityGUID ? roleAccessEntityGUID : "";

        return AccMgmtFactory.put(url, data, queryParams).then(function (response) {
            return response;
        });
    }
    
    this.grantAccessToAllMyReports = function(data){
        var url = BASEURL.ACCESS_MGMT_SHARED + rolesUrlCollection.POSTAPI_GRANTACCESSTOBULKREPORTS;
        return AccMgmtFactory.post(url, data, null).then(function (response) {
            return response;
        });        
    }
}]);