angular.module("ParcelUI").factory("accessMgmtAPI", ["APIFactory", "$http", "BASEURL", "accessMgmtUrlCollection","$q", function (APIFactory, $http, BASEURL, accessMgmtUrlCollection,$q) {
    var factory = {};

    factory.getRoles = function (accessEntity, entityType) {
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.GET_ROLES;
        var params = {

            userGuid: accessEntity,
            entity: entityType

        };
        return APIFactory.get(url, params).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });


    }
    
   
    
    factory.getUsersDefaultRole = function(accessentity,accessentitytype){
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.GET_DEFAULT_ROLE;
        var params  = {
            accessentity : accessentity,
            accessentitytype : accessentitytype,
            applications : BASEURL.APPLICATIONGUID
        }
        return APIFactory.get(url, params).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });
    }

    factory.getAccessEntityInfo = function (assetGUID, accessEntityType) {
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.GET_ACCESSENTITY_INFO;
        var params = {

            assetguid: assetGUID,
            accessentitytype: accessEntityType

        };
        return APIFactory.get(url, params).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });


    }
    
    

    factory.postRoleAccessEntityAsset = function (dataobj) {
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.POST_ROLEACCESSENTITYASSET;

        return APIFactory.post(url, dataobj).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });

    }

    factory.deleteRoleAccessEntityAsset = function (assetRoleAccessEntityGuid) {
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.DELETE_ROLEACCESSENTITYASSET;
        var queryParams = {
            assetRoleAccessEntityGUID: assetRoleAccessEntityGuid
        }

        return APIFactory.delete(url, null, queryParams);
    };

    factory.updateBulkRoleAccessEntityAsset = function (object) {
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.DELETE_BULROLEACCESSENTITYASSET;
        return APIFactory.put(url, object, null);
        
    }

    factory.getRoleDetails = function (roleguid) {
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.GET_ALL_ROLES;
        var params = {
            roleguid: roleguid

        };
        return APIFactory.get(url, params).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });


    }
    
    

    factory.getRoleAccessEntityAsset = function (assetguid, accessentityguid, accessentitytype) {
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.GET_ROLEACCESSENTITYASSET;
        var params = {
            
            assetguid: assetguid,            
            accessentityguid: accessentityguid,
            accessentitytype: accessentitytype

        };
        return APIFactory.get(url, params).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });

    }
    
    factory.createRole = function(obj){
        var url = BASEURL.ACCESS_MGMT + accessMgmtUrlCollection.CREATE_ROLE;
        
        return APIFactory.post(url, obj,null,null).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });
    }
    
    
    



    return factory;
}])