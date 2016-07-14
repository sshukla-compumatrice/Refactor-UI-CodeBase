angular.module('AccountMgmtModule').constant('rolesUrlCollection', {
    GETAPI_ACCESSENTITYINFO: "/authorizations?accessentity={accessentityguid}&accessentitytype={accessentitytype}&applications={applicationguids}&detail={detail}&status={status}&limit={limit}&offset={offset}",
    
    GETAPI_GETROLEINFO: "/roles/{roleguid}?owner={ownerguid}&ownertype={ownertype}&accessentity={accessentityguid}&accessentitytype={accessentitytype}&application={applicationguid}&name={name}&detail={detail}&status={status}&limit={limit}&offset={offset}",
    
    PUTAPI_UPDATEROLE: "/roles/{roleguid}",
    
    POSTAPI_CREATEROLE: "/roles",
    
    DELETEAPI_DELETEROLE: "/roles/{roleguid}",
    
    POSTAPI_ROLEACCESSENTITYASSIGNMENTS: "/roleaccessentities",
    
    PUTAPI_ROLEACCESSENTITYASSIGNMENTS: "/roleaccessentities/{roleAccessEntityGUID}",
    
    POSTAPI_GRANTACCESSTOBULKREPORTS: "/roleaccessentityassets/bulk"
});