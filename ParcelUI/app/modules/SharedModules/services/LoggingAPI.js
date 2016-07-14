angular.module("ParcelUI").service("LoggingAPI", ['APIFactory', 'LoggingUrlCollection','BASEURL', function (APIFactory, LoggingUrlCollection,BASEURL) {
    this.postLogs = function (logs) {
        var url = BASEURL.SHARED_LOGGING + LoggingUrlCollection.POSTAPI_LOGGING;
        var header = {
            LoggingSessionGUID: 'A0F5E294-B497-4C16-8FA4-526C9413530F'
        };
        var data = {
            logItem: logs
        };
        return APIFactory.post(url, data, null, header).then(function (result) {
            return result;
        });
    };

}]);