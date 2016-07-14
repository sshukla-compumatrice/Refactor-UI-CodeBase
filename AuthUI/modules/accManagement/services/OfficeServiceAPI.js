angular.module('AccountMgmtModule').service('OfficeServiceAPI', ['AccessMgmtFactory', 'AccountManagementUrlCollection', 'BASEURL', function (AccMgmtFactory, AccountManagementUrlCollection, BASEURL) {
    
    this.apiType = {
        type: 'real',
        //type: 'mock',

        createOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_OFFICECREATE_REAL,
            mock: AccountManagementUrlCollection.POSTAPI_OFFICECREATE_MOCK
        },
        getOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_OFFICE_REAL,
            mock: AccountManagementUrlCollection.GETAPI_OFFICELIST_MOCK
        },
        updateOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_OFFICEUPDATE_REAL,
            mock: AccountManagementUrlCollection.PUTAPI_OFFICEUPDATE_MOCK
        },
        deleteOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_OFFICEDELETE_REAL,
            mock: AccountManagementUrlCollection.DELETEAPI_OFFICEDELETE_MOCK
        }
    };
    
    this.deleteOffice = function (companyGUID, officeGUID) {
        var url = this.apiType.deleteOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";

        return AccMgmtFactory.delete(url, null, queryParams);
    };

    this.createOffice = function (companyGUID, data) {
        var url = this.apiType.createOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";

        return AccMgmtFactory.post(url, data, queryParams).then(function (response) {
            return response;
        });
    };

    this.updateOffice = function (companyGUID, officeGUID, data) {
        var url = this.apiType.updateOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";

        return AccMgmtFactory.put(url, data, queryParams).then(function (response) {
            return response;
        });
    };

    this.getOfficeData = function (companyGUID, officeGUID, detail, name) {
        var url = this.apiType.getOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";
        queryParams.detail = detail ? detail : "";
        queryParams.name = name ? name : "";
        
        return AccMgmtFactory.get(url, queryParams).then(function (response) {
            return response;
        });
    };

}]);