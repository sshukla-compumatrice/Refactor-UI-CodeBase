angular.module('PortfolioCreation').factory('APIFactory', ['$http', 'Upload', function ($http, Upload) {

    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    };

    function parseUserErrorMessage(error) {
        return error.data.message ? error.data.message.userMessage : error.data;
    }




    function getAPICall(url, queryParams) {



        var uri = formatUrl(url, queryParams);
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
            if(results)
            return results.data;
            else{
                return null;
            }

        }, function (error) {
         
            //return error;
            throw parseUserErrorMessage(error);
        });
    };

    function postAPICall(url, data, queryParams, headers) {
        var uri = formatUrl(url, queryParams);
        if (headers) {
            for (var headerKey in headers) {
                var headerVal = headers[headerKey];
                if (!$http.defaults.headers.common[headerKey]) {
                    $http.defaults.headers.common[headerKey] = headerVal;
                }
            }
            //$http.defaults.headers.common['LoggingSessionGUID'] = 'A0F5E294-B497-4C16-8FA4-526C9413530F';
        }

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
            if(results)
            return results.data;
            else{
                return null;
            }
        }, function (error) {
            throw parseUserErrorMessage(error);
        });

    };

    function putAPICall(url, data, queryParams) {
        var uri = formatUrl(url, queryParams);
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
            if(results)
            return results.data;
            else{
                return null;
            }
        }, function (error) {
            throw parseUserErrorMessage(error);
        });
    };

    function deteleAPICall(url, data, queryParams) {
        var uri = formatUrl(url, queryParams);
		$http.defaults.headers.common['Content-Type'] = 'application/json';
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
            if(results)
            return results.data;
            else{
                return null;
            }
        }, function (error) {
            throw parseUserErrorMessage(error);
        });
    }

    function uploadFilesCall(url, request, queryParams, file) {

        var url = formatUrl(url, queryParams);

        return Upload.upload({
            url: url,
            file: file,
            method: 'POST',
            data: request,
            header: {
                'Content-Type': 'multipart/formdata',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            }
        })

    }
    
    function uploadDeliverableFile(url,queryParams,file,data) {
      var url = formatUrl(url, queryParams);      
        return Upload.upload({
            url: url,
            file: file,
            method: 'POST',
            data: data,
            header: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            }
        })

    }

    return {
        get: getAPICall,
        post: postAPICall,
        put: putAPICall,
        delete: deteleAPICall,
        uploadFile: uploadFilesCall,
        uploadDeliverableFile: uploadDeliverableFile
    };
}]);
