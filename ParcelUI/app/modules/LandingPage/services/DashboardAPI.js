angular.module("ParcelUI").service("DashboardAPI", ["APIFactory", "ReportDashboardUrlCollection","BASEURL","$q","globalValues", function(APIFactory, ReportDashboardUrlCollection,BASEURL,$q,globalValues) {

    var self = this;

    self.getReports = function(accountGuid, detail, limit, offset) {
        var url = BASEURL.LANDINGPAGE_REAL + ReportDashboardUrlCollection.GETAPI;
        var params = {};
        params.limit = "-1";
        params.offset = 0;
        params.detail = "none";
        
        if (accountGuid) {
            params.accountGuid = accountGuid;
        }
        if (detail) {
            params.detail = detail;
        }
        if (limit) {
            params.limit = limit;
        }
        if (offset) {
            params.offset = offset;
        }

        return APIFactory.get(url, params).then(function(data) {
            return data.dashboard;
        });
    };
    


    self.getActivities = function(categoryname, entityid, entitytype, detail, limit, offset) {
        var url = BASEURL.BASE_ACTIVITY_SERVICE + ReportDashboardUrlCollection.GETAPI_ACTIVITY;
        var params = {
            "categoryname" : categoryname ? categoryname : "",
            "entityid" : entityid ? entityid : "",
            "entitytype" : entitytype ? entitytype : "",
            "detail" : detail ? detail : "",
            "limit" : limit ? limit : "",
            "offset" : offset ? offset : ""
        };

        return APIFactory.get(url, params).then(function(data) {
            return data;
        });
    };
    
    self.getActivityItems = function(activityguid, activityitemguid, entitytype, entityid, itemmode, limit, offset) {
        var url = BASEURL.BASE_ACTIVITY_SERVICE + ReportDashboardUrlCollection.GETAPI_ACTIVITY_ITEMS;
        var params = {
            "activityguid" : activityguid ? activityguid : "",
            "activityitemguid" : activityitemguid ? activityitemguid : "",            
            "entitytype" : entitytype ? entitytype : "",
            "entityid" : entityid ? entityid : "",
            "itemmode" : itemmode ? itemmode : "",
            "limit" : limit ? limit : "",
            "offset" : offset ? offset : ""
        };

        return APIFactory.get(url, params).then(function(data) {
            return data;
        });
    };

    self.updateColumns = function(accountGuid, columns) {
        var url = BASEURL.LANDINGPAGE_MOCK + ReportDashboardUrlCollection.PUTAPI;
        var putData = {
            columns: columns
        };
        return APIFactory.put(url, putData).then(function(data) {
            return data;
        });
    }


}]);
