AccessManagement.service('commonServices', ['BASEURL', 'commonUrlCollection', 'AccessMgmtFactory', function (BASEURL, commonUrlCollection, AccessMgmtFactory) {
    
    this.reportBySiteID = function (siteID) {
        var url = BASEURL.REPORT + commonUrlCollection.GETAPI_SEARCHBYSITEID;
        var params = {
            siteID: siteID
        };

        return AccessMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    
    this.getCompReportTemplates = function (companyGUID, filter, reportType) {
        var url = BASEURL.REPORT_TEMPLATES + commonUrlCollection.GETAPI_COMPREPORTEMPLATE_REAL;
        var params = {
            companyguid: companyGUID,
            filter: filter ? filter : "",
            reportType: reportType ? reportType : ""
        }
        return AccessMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    
    this.getReportTypes = function () {
        var url = BASEURL.REPORT + commonUrlCollection.GETAPI_REPORTTYPES_REAL;
        return AccessMgmtFactory.get(url, null).then(function (response) {
            return response;
        });
    }
}]);