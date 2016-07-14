angular.module('ProjectCreation').service('ProjectStartupAPI', ['UrlColl', 'APIFactory', 'BASEURL', function (Urls, APIFactory, BASEURL) {

    function parseError(error) {
        return error && error.message && error.message.userMessage ? error.message.userMessage : error;
    }

    this.getInfo = function (companyId, userId) {
    
        var uri = BASEURL.PROJECTCREATION_PROJECTSTARTUP + Urls.GETAPI_PROJECTINFO;
        var params = {
            companyID: companyId,
            userID: userId
        };
        return APIFactory.get(uri, params);
    };

    this.getAccountUser = function (userId) {
        var uri = BASEURL.DLL_SHARED + Urls.GETAPI_ACCOUNTUSER;
        var params = {
            userID: userId
        };
        return APIFactory.get(uri, params);

    };


    this.postData = function (companyId, project) {
        var url = BASEURL.PROJECTCREATION_PROJECTSTARTUP + Urls.POSTAPI_PROJECT;
        var params = {
            companyID: companyId
        };
        var data = {
            project: project
        };
        return APIFactory.post(url, data, params).then(function (result) {
            return result.project;
        });
    };


    this.postDraft = function (companyID, draft) {
        var url = BASEURL.PROJECTCREATION_PROJECTSTARTUP + Urls.POSTAPI_DRAFTPROJECT;
        var data = {
            project: draft
        };

        return APIFactory.post(url, data).then(function (result) {
            return result.project;
        }, function (error) {
            var parsed = parseError(error);
            throw parsed;
        });
    };

    this.putDraft = function (draftProjectID, project) {
        var url = BASEURL.PROJECTCREATION_PROJECTSTARTUP + Urls.PUTAPI_DRAFTPROJECT;
        var params = {
            draftID: draftProjectID
        };
        var data = {
            project: project
        };
        return APIFactory.put(url, data, params).then(function (result) {
            return result.project;
        }, function (error) {
            var parsed = parseError(error);
            throw parsed;
        });
    };

    this.getCompany = function () {
        var url = 'http://wwwdev.edrcore.com:8080/accountmanagementservice/shared/accountmanagement/companies/e548bfc4-cf20-457a-8684-c96f876df542'; //BASEURL.PROJECTCREATION_PROJECTSTARTUP + Urls.PUTAPI_DRAFTPROJECT;

        var params = {

        };
        return APIFactory.get(url, params).then(function (result) {
            return result.companies[0];
        }, function (error) {
            var parsed = parseError(error);
            throw parsed;
        });
    }

}])
