angular.module('AccountMgmtModule').service('UserServiceAPI', ['AccessMgmtFactory', 'AccountManagementUrlCollection', 'BASEURL', function (AccMgmtFactory, AccountManagementUrlCollection, BASEURL) {

    var self = this;
    self.apiType = {
        type: 'real', //'real',
        createUser: {
            mock: AccountManagementUrlCollection.POSTAPI_CREATEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSER_REAL
        },
        getUser: {
            mock: AccountManagementUrlCollection.GETAPI_GETUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_GETUSER_REAL
        },
        updateUser: {
            mock: AccountManagementUrlCollection.PUTAPI_UPDATEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATEUSER_REAL
        },
        deleteUser: {
            mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSER_REAL
        },
        changePassword: {
            mock: AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_REAL
        }
    };


    this.createuser = function (data) {
        var url = this.apiType.createUser[this.apiType.type];

        return AccMgmtFactory.post(url, data, null).then(function (response) {
            return response;
        });
    };

    this.getUserInfo = function (userGUID, companyGUID, officeGUID, detail, firstName, lastName, email) {

        var url = this.apiType.getUser[this.apiType.type];
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";
        queryParams.firstname = firstName ? firstName : "";
        queryParams.lastname = lastName ? lastName : "";
        queryParams.email = email ? email : "";
        queryParams.detail = detail ? detail : "";

        return AccMgmtFactory.get(url, queryParams).then(function (response) {
            return response;
        });

    }

    this.updateuser = function (userGUID, data) {
        var url = this.apiType.updateUser[this.apiType.type];
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";

        return AccMgmtFactory.put(url, data, queryParams).then(function (response) {
            return response;
        });
    };

    this.deleteuser = function (userGUID) {
        var url = this.apiType.deleteUser[this.apiType.type];
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";

        return AccMgmtFactory.delete(url, null, queryParams);
    };
}]);