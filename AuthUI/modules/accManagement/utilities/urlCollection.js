angular.module('AccountMgmtModule').constant('AccountManagementUrlCollection', {
    // Listings URLs
    GETAPI_LISTINGS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    GETAPI_LISTINGS_REAL: '/listings?types={types}',

    //Company URLs
    GETAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}?name={name}&search={search}&parent={parentcompanyguid}&hasparent={hasparent}&detail={detail}',
    GETAPI_COMPANY_REAL: '/companies/{companyguid}?name={name}&detail={detail}&parentcompanyguid={parentcompanyguid}&hasparent={hasparent}',

    POSTAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies',
    POSTAPI_COMPANY_REAL: '/companies/',

    PUTAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}',
    PUTAPI_COMPANY_REAL: '/companies/{companyguid}',

    DELETEAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}',
    DELETEAPI_COMPANY_REAL: '/companies/{companyguid}',

    GETAPI_APPCOMPONENTITEMS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/appcomponents/{appcomponenttypeguid}/items?limit={limit}&offset={offset}',
    GETAPI_APPCOMPONENTITEMS_REAL: '/appcomponents/{appcomponenttypeguid}/items?limit={limit}&offset={offset}',

    POSTAPI_COMPANYCERTIFICATE_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/certifications',
    POSTAPI_COMPANYCERTIFICATE_REAL: '/companies/{companyguid}/certifications',

    PUTAPI_COMPANYCERTIFICATE_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/certifications/{certificationguid}',
    PUTAPI_COMPANYCERTIFICATE_REAL: '/companies/a0f5e294-b497-4c16-8fa4-526c9413530f/certifications/{certificationguid}',

    POSTAPI_COMPAPPCOMPONENTITEMS_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/applicationcomponentitems',
    POSTAPI_COMPAPPCOMPONENTITEMS_REAL: '/companies/{companyguid}/applicationcomponentitems',

    PUTAPI_COMPAPPCOMPONENTITEMS_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/applicationcomponentitems',
    PUTAPI_COMPAPPCOMPONENTITEMS_REAL: '/companies/{companyguid}/applicationcomponentitems',

    POSTAPI_COMPANYSETUPFEES_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees',
    POSTAPI_COMPANYSETUPFEES_REAL: '/companies/{companyguid}/setupfees',

    GETAPI_COMPANYSETUPFEES_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    GETAPI_COMPANYSETUPFEES_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',

    DELETEAPI_COMPANYSETUPFEES_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    DELETEAPI_COMPANYSETUPFEES_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',

    POSTAPI_COMPANYASSOCIATION_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',
    POSTAPI_COMPANYASSOCIATION_REAL: '/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',

    GETAPI_COMPANYASSOCIATIONS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',
    GETAPI_COMPANYASSOCIATIONS_REAL: '/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',

    DELETEAPI_COMPANYASSOCIATION_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}',
    DELETEAPI_COMPANYASSOCIATION_REAL: '/companies/{companyguid}/associations/{companyassociationguid}',

    GETAPI_COMPASSOUSERS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}?detail={detail}',
    GETAPI_COMPASSOUSERS_REAL: '/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}?detail={detail}',

    POSTAPI_COMPASSOUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',
    POSTAPI_COMPASSOUSER_REAL: '/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}?',

    DELETEAPI_COMPASSOUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}',
    DELETEAPI_COMPASSOUSER_REAL: '/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}',

    GETAPI_COMPANYREPORTSETTINGS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings/{reportsettingguid}?detail={detail}',
    GETAPI_COMPANYREPORTSETTINGS_REAL: '/companies/{companyguid}/reportsettings/{reportsettingguid}?detail={detail}',

    PUTAPI_COMPANYREPORTSETTING_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings',
    PUTAPI_COMPANYREPORTSETTING_REAL: '/companies/{companyguid}/reportsettings',

    GETAPI_COMPANYREPORTVENDORS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors/{reportvendorguid}?detail={detail}',
    GETAPI_COMPANYREPORTVENDORS_REAL: '/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors/{reportvendorguid}?detail={detail}',

    PUTAPI_COMPANYREPORTVENDORS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors',
    PUTAPI_COMPANYREPORTVENDORS_REAL: '/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors',


    //Office URLs
    GETAPI_OFFICELIST_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}?name={name}&search={search}&detail={detail}',
    GETAPI_OFFICE_REAL: '/companies/{companyguid}/offices/{officeguid}?detail={detail}&name={name}',

    POSTAPI_OFFICECREATE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices',
    POSTAPI_OFFICECREATE_REAL: '/companies/{companyguid}/offices',

    PUTAPI_OFFICEUPDATE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}',
    PUTAPI_OFFICEUPDATE_REAL: '/companies/{companyguid}/offices/{officeguid}',

    DELETEAPI_OFFICEDELETE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}',
    DELETEAPI_OFFICEDELETE_REAL: '/companies/{companyguid}/offices/{officeguid}',
    //Office URL's END


    //Search URL's
    GETAPI_SEARCHCOMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}?name={name}&search={search}&parent={parentcompanyguid}&hasparent={hasparent}&detail={detail}',
    GETAPI_SEARCHCOMPANY_REAL: '/companies/?search={search}',

    GETAPI_SEARCHOFFICE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}?name={name}&search={search}&detail={detail}',
    GETAPI_SEARCHOFFICE_REAL: '/companies/offices/?search={search}',

    GETAPI_SEARCHUSERS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}?users={userguids}&company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&search={search}&detail={detail}',
    GETAPI_SEARCHUSERS_REAL: '/users/?search={search}',
    //Search URL's end


    //General User URLs
    POSTAPI_CREATEUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users',
    POSTAPI_CREATEUSER_REAL: '/users',

    PUTAPI_UPDATEUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}',
    PUTAPI_UPDATEUSER_REAL: '/users/{userguid}',

    GETAPI_GETUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}?company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&detail={detail}',
    GETAPI_GETUSER_REAL: '/users/{userguid}?company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&detail={detail}',

    DELETEAPI_DELETEUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}',
    DELETEAPI_DELETEUSER_REAL: '/users/{userguid}',

    GETAPI_VIEWLICENSE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/userguid/licenses/{licenseguid}?filter={filtertype}',
    GETAPI_VIEWLICENSE_REAL: '/users/{userguid}/licenses/{licenseguid}?filter={filtertype}',

    PUTAPI_UPDATELICENSE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses/{licenseguid}',
    PUTAPI_UPDATELICENSE_REAL: '/users/{userguid}/licenses/{licenseguid}',

    POSTAPI_CREATEUSERLICENSE_MOCK: 'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses',
    POSTAPI_CREATEUSERLICENSE_REAL: '/users/{userguid}/licenses',

    DELETEAPI_DELETEUSERLICENSE_MOCK: 'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses/{licenseguid}',
    DELETEAPI_DELETEUSERLICENSE_REAL: '/users/{userguid}/licenses/{licenseguid}',

    //******** DANGER *********//
    GETAPI_USERROLE_MOCK: 'modules/accManagement/staticdata/UserRoleJSON.js', // Need to replace this with real
    //******** DANGER *********//

    POSTAPI_CHANGEPASSWORD_MOCK: 'http://private-8459d-edrcoreaccessmanagmentapi.apiary-mock.com/authentication/users/{userguid}',
    POSTAPI_CHANGEPASSWORD_REAL: '/user/{userguid}',

    DOWNLOADFILE_MOCK: '',
    DOWNLOADFILE_REAL: '/{fileguid}?limit=10&offset=0',

    DELETEFILE_MOCK: '',
    DELETEFILE_REAL: 'http://parredatapoc2:8080/corefile/rest/v1.0/files/{fileguid}',

    POSTAPI_VERIFYUSERLICENSE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses/{userlicenseguid}/verifications',
    POSTAPI_VERIFYUSERLICENSE_REAL: '/users/{userguid}/licenses/{userlicenseguid}/verifications',

    GETAPI_VIEWINSURANCE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances/{insuranceguid}',
    GETAPI_VIEWINSURANCE_REAL: '/users/{userguid}/insurances',

    PUTAPI_UPDATEINSURANCE_MOCK: 'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances/{insuranceguid}',
    PUTAPI_UPDATEINSURANCE_REAL: '/users/{userguid}/insurances/{insuranceguid}',

    DELETEAPI_DELETEINSURANCE_MOCK: 'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances/{insuranceguid}',
    DELETEAPI_DELETEINSURANCE_REAL: '/users/{userguid}/insurances/{insuranceguid}',

    POSTAPI_CREATEINSURANCE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances',
    POSTAPI_CREATEINSURANCE_REAL: '/users/{userguid}/insurances',

    GETAPI_VIEWCOVERAGEAREA_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/coverageareas/{coverageareaguid}',
    GETAPI_VIEWCOVERAGEAREA_REAL: '/users/{userguid}/coverageareas/{coverageareaguid}',

    DELETEAPI_DELETECOVERAGEAREA_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/coverageareas/{coverageareaguid}',
    DELETEAPI_DELETECOVERAGEAREA_REAL: '/users/{userguid}/coverageareas/{coverageareaguid}',

    POSTAPI_ADDTOCOVERAGE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/coverageareas/{coverageareaguid}',
    POSTAPI_ADDTOCOVERAGE_REAL: '/users/{userguid}/coverageareas/{coverageareaguid}',

    GETAPI_VIEWALLUSERFORMS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms/{formguid}?formtype={formtype}',
    GETAPI_VIEWALLUSERFORMS_REAL: '/users/{userguid}/forms/{formguid}?formtype={formtype}',

    POSTAPI_CREATEUSERFORMS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms',
    POSTAPI_CREATEUSERFORMS_REAL: '/users/{userguid}/forms',

    DELETEAPI_DELETEUSERFORMS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms/{formguid}',
    DELETEAPI_DELETEUSERFORMS_REAL: '/users/{userguid}/forms/{formguid}',

    PUTAPI_UPDATEUSERFORMS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms/{formguid}',
    PUTAPI_UPDATEUSERFORMS_REAL: '/users/{userguid}/forms/{formguid}',
    //Appraisal User URLs Ends

    //******** PARCEL company view service urls ********//
    // SETUP ITEMS service Urls
    GET_COMPANYSETUP_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    GET_COMPANYSETUP_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',

    PUTAPI_UPDATESETUPTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees',
    PUTAPI_UPDATESETUPTABLE_REAL: '/companies/{companyguid}/setupfees',

    POSTAPI_SENDFEESTOABS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/invoice',
    POSTAPI_SENDFEESTOABS_REAL: '/companies/{companyguid}/setupfees/invoice',

    POSTAPI_UPDATESETUPTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    POSTAPI_UPDATESETUPTABLE_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',

    DELETEAPI_SETUPFEES_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    DELETEAPI_SETUPFEES_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid} ',
    // SETUP ITEMS service Urls

    // Current Pricing service Urls
    GETAPI_CURRENTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    GETAPI_CURRENTTABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',

    PUTAPI_UPDATECURRENTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    PUTAPI_UPDATECURRENTTABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',

    POSTAPI_ADDCURRENTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    POSTAPI_ADDCURRENTTABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',

    DELETEAPI_CURRENTRATETABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    DELETEAPI_CURRENTRATETABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',
    // Current Pricing service Urls End

    // Discounts service Urls
    GETAPI_DISCOUNTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts/{discountguid}',
    GETAPI_DISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts',
    GETAPI_DISCOUNTTABLE_JSON: 'modules/accManagement/staticdata/discountTableDataJSON.js',

    POSTAPI_ADDDISCOUNTTABLE_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts',
    POSTAPI_ADDDISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts',

    PUTAPI_UPDATEDISCOUNTTABLE_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts',
    PUTAPI_UPDATEDISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts',

    DELETEAPI_DISCOUNTTABLE_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts/{discountguid}',
    DELETEAPI_DISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts/{discountguid}',
    // Discounts service Urls End

    // CURRENT YEAR STATUS service Urls
    GETAPI_CURRENTYEARSTATUSTABLE: 'modules/accManagement/staticdata/currentYearStatusTableJSON.js',
    GETAPI_CURRENTYEARSTATUSTABLE_MOCK: 'modules/accManagement/staticdata/currentYearStatusTableJSON.js',
    GETAPI_CURRENTYEARSTATUSTABLE_REAL: 'modules/accManagement/staticdata/currentYearStatusTableJSON.js',
    GRANTACCESSTOBULKUSERS: '/roleaccessentityassets/bulk',
    //CURRENT YEAR STATUS service Urls End

    //******** PARCEL company view service urls End ********//    

    /*File Management API*/
    POSTAPI_COREFILE: '?fileRequest={fileRequestJson}',
    PUTAPI_COREFILE: '/{fileguid}?fileRequest={fileRequestJson}',
    GETAPI_COREFILE: '/{fileguid}/stream',
    GETAPI_COREFILE_INFORMATION: '/{fileguid}',
    DELETEAPI_COREFILE: '/{fileguid}',
    /*End of File Management API*/

    //Shared file mgmt
    GETAPI_SHAREDFILE_GETFOLDER: "/folders/{folderguid}?type={foldertype}&company={companyguid}&office={officeguid}&user={userguid}&parentfolder={parentfolderguid}&file={fileguid}&categories={categories}&detail={detail}&limit={limit}&offset={offset}"

})