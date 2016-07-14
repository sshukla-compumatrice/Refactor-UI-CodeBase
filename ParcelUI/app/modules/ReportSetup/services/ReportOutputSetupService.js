angular.module('ReportSetup').service('ReportOutputSetupAPI', ['APIFactory', 'ReportOutputSetupAPIUrlCollection','BASEURL', function(APIFactory, UrlColl,BASEURL) {

    var self = this;
   

    
    this.get = function(reportOutputSetupID) {
        var url = UrlColl.GETAPI_MOCK;
        var queryParams = {
            reportOutputSetupID: reportOutputSetupID
        }
        return APIFactory.get(url, queryParams).then(function(response){
            return response.reportOutputSetup;
        })
    };

    this.post = function(reportOutputSetupData) {
        var url = BASEURL.REPORTOUTPUT + UrlColl.POSTAPI_MOCK;
        
        /*var postData = {
            reportOutputSetup: reportOutputSetupData
        };*/
        var postData = reportOutputSetupData;

        return APIFactory.post(url, postData).then(function(result) {
            return result.data;
        });
    }

    this.put = function(reportOutputSetupID, reportOutputSetup) {
        var url =  BASEURL.REPORTOUTPUT + UrlColl.PUTAPI_MOCK;
        var queryParams = {
            reportOutputSetupID: reportOutputSetupID
        }

        var putData = {
            reportOutputSetup: reportOutputSetup
        };

        return APIFactory.put(url, putData, queryParams).then(function(result) {
            return result.data;
        });
    }
    
    this.delete = function(reportOutputSetupID, data){
        var url = BASEURL.REPORTOUTPUT + UrlColl.DELETEAPI_MOCK;
        var queryParams = {
            reportOutputSetupID: reportOutputSetupID
        }

        var putData = {
            reportOutputSetup: data
        };

        return APIFactory.delete(url, putData, queryParams).then(function(result) {
            return result.data;
        });
    }
    
    this.getList = function(companyId, type) {
        var url = UrlColl.GETLISTAPI_MOCK;
        var queryParams = {
            companyID: companyId,
            type: type
        }
        return APIFactory.get(url, queryParams).then(function(results){
            return results.reportOutputSetups;
        });
    };

}]);