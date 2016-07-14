angular.module('ParcelUI').constant('accountMgmtUrlCollection', {    
    //Company URLs
    GETAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}?name={name}&search={search}&parent={parentcompanyguid}&hasparent={hasparent}&detail={detail}',
    GETAPI_COMPANY_REAL: 'companies/{companyguid}?name={name}&detail={detail}&parentcompanyguid={parentcompanyguid}&hasparent={hasparent}',
    
    //Office URLs
    GETAPI_OFFICELIST_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}?name={name}&search={search}&detail={detail}',
    GETAPI_OFFICE_REAL: 'companies/{companyguid}/offices/{officeguid}?detail={detail}&name={name}',


    //General User URLs
    GETAPI_GETUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}?company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&detail={detail}',
    GETAPI_GETUSER_REAL: 'users/{userguid}?users={userguids}&company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&search={search}&detail={detail}',
    
    //Office Edit
    PUTAPI_OFFICEUPDATE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}',
    PUTAPI_OFFICEUPDATE_REAL: 'companies/{companyguid}/offices/{officeguid}',
    
    //User update
    PUTAPI_UPDATEUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}',
    PUTAPI_UPDATEUSER_REAL: 'users/{userguid}',
    
    CREATE_TEAM: 'teams/',
    
    
    MODIFY_TEAM: 'teams/{teamguid}/assignments',
    
    GET_TEAMS :'teams?company={companyGUID}',
    
    GET_PRECONFIGURED_TEAMS : 'users/queries?company={companyGUID}',
    
    GET_USERS_BYTEAM :'teams/{teamGUID}?company={companyguid}&office={officeguid}&user={userguid}&limit=&offset=&detail={detail}',
    DELETE_USERFROMTEAM : 'teams/{teamGUID}/assignments/{assignmentGUID}'
        
});

 angular.module('ParcelUI').constant('accessMgmtUrlCollection', {    
    
    GET_ROLES : 'roles?accessentity={userGuid}&accessentitytype={entity}',
    
    POST_ROLEACCESSENTITYASSET : 'roleaccessentityassets',
    
    DELETE_ROLEACCESSENTITYASSET : 'roleaccessentityassets/{assetRoleAccessEntityGUID}',
    DELETE_BULROLEACCESSENTITYASSET : 'roleaccessentityassets',
           
    GET_ALL_ROLES : 'roles/{roleguid}',
     
    GET_DEFAULT_ROLE : 'authorizations?accessentity={accessentity}&accessentitytype={accessentitytype}&applications={applications}',
    
    GET_ROLEACCESSENTITYASSET :  'roleaccessentityassets/?asset={assetguid}&accessentity={accessentityguid}&accessentitytype={accessentitytype}',
    
    GET_ACCESSENTITY_INFO : 'roleaccessentityassets/?asset={assetguid}&accessentitytype={accessentitytype}',
     
    CREATE_ROLE : 'roleaccessentities'
    
/*GET_ROLEACCESSENTITYASSET = 'roleaccessentityassets?role={roleguid}&asset={assetguid}&assettype={assettype}&accessentity={accessentityguid}&accessentitytype={accessentitytype}'*/
     
     
     
     
     
    
                    
});