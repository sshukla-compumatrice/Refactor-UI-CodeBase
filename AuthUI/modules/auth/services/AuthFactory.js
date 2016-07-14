angular.module('AuthModule').factory('AuthService', ['$http', '$log', 'AuthUrls', function ($http, $log, AuthUrls) {
    //var getAuthResponseData = '/modules/auth/staticdata/authResponse.js';

    var authFactoryLogger = $log.getInstance('AuthService');
    factory = {};

    factory.postUserCredentials = function (username, password) {
        var credentialsObj = {
            "uEmail": username,
            "pass": password
        };
        try {
            return $http.post(AuthUrls.postUserCredentials, credentialsObj, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            }, function (error) {
                authFactoryLogger.error(error.statusText);
                return error;
            });
        } catch (e) {
            authFactoryLogger.error(error.statusText)
        }
    }

    return factory;
}]);