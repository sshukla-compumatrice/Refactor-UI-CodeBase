angular.module('AccessManagement').factory('AccessMgmtFactory', ['$http', '$log', function ($http, $log) {
    var accessMgmtFactoryLogger = $log;
    
    try {
        accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
    } catch (error) {
        console.log("Failed to init accessMgmtFactoryLogger in accessMgmtFactory.js");
    }
    
    accessMgmtFactoryLogger.info('Reached Access Management Common Factory');
    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    };

    function getAPICall(url, queryParams) {
        var uri = formatUrl(url, queryParams);
        try {
            return $http({
                method: 'GET',
                url: uri,
                header: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (results) {
                return results.data;
            }, function (error) {
                accessMgmtFactoryLogger.error(error);                
                return error;
            });
        } catch (e) {
            accessMgmtFactoryLogger.error(e);
        }
    };

    function postAPICall(url, data, queryParams) {
        var uri = formatUrl(url, queryParams);
        try {
            return $http({
                method: 'POST',
                url: uri,
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (results) {
                return results.data;
            }, function (error) {
                accessMgmtFactoryLogger.error(error);
                return error;
            });
        } catch (e) {
            accessMgmtFactoryLogger.error(e);
        }
    };

    function putAPICall(url, data, queryParams) {
        var uri = formatUrl(url, queryParams);
        try {
            return $http({
                method: 'PUT',
                url: uri,
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (results) {
                return results.data;
            }, function (error) {
                accessMgmtFactoryLogger.error(error);
                return error;
            });
        } catch (e) {
            accessMgmtFactoryLogger.error(e);
        }
    };

    function deteleAPICall(url, data, queryParams) {
        var uri = formatUrl(url, queryParams);
        try {
            return $http({
                method: 'DELETE',
                url: uri,
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (results) {
                return results.data;
            }, function (error) {
                accessMgmtFactoryLogger.error(error);
                return error;
            });
        } catch (e) {
            accessMgmtFactoryLogger.error(e);
        }
    }

    return {
        get: getAPICall,
        post: postAPICall,
        put: putAPICall,
        delete: deteleAPICall
    };
}]);