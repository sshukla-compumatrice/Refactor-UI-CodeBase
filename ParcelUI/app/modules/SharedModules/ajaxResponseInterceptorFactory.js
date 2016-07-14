angular.module('ProjectDashboard').factory('ajaxRequestInterceptor', ['$q', 'BASEURL','$rootScope','$location', function ($q, BASEURL,$rootScope,$location) {
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    function getValueFromStorage(key) {
        var userDetails = JSON.parse(localStorage.getItem('userdetails'));
        if (userDetails) {
            for (var i = 0; i < userDetails.length; i++) {
                if (userDetails[i].key === key) {
                    return userDetails[i].value;
                }
            }
        }
    }
    
    function logout ()
      {
        
         $rootScope.$broadcast('logoutUser');
        
      };
    
    return {
        // On request success
        request: function (config) {
            //console.log("first " + config.status); // Contains the data about the request before it is sent.


            
            var noHeadersUrlArray = [BASEURL.POSTAPI_GETAUTHTOKEN, BASEURL.ACCOUNT_MGMT_API, BASEURL.GET_SESSIONTOKEN]
            var isAddHeader = true

            if (noHeadersUrlArray.indexOf(config.url) > -1) {
                isAddHeader = false;
            }
            var fileExtension = config.url.replace(/^.*\./, '');

            if (fileExtension == 'html' || fileExtension == 'htm') {
                isAddHeader = false;
            }

            if (isAddHeader) {
                var oAuthToken = getCookie('oAuthToken');
                var sessionToken = getCookie('sessionToken');
                
                var userGUID =
                    BASEURL.IS_OTHERENV === 1 ? getCookie('userGuid') : getValueFromStorage('EFF_USERGUID');
                if (oAuthToken && BASEURL.IS_OTHERENV === 1)
                    config.headers['AccessToken'] = oAuthToken;
                if (sessionToken && BASEURL.IS_OTHERENV === 1)
                    config.headers['SessionTokenGuid'] = sessionToken;
                if (userGUID && BASEURL.IS_OTHERENV === 0)
                    config.headers['UserGuid'] = userGUID;
            }
            // Return the config or wrap it in a promise if blank.
            return config || $q.when(config);
        },

        // On request failure
        requestError: function (rejection) {
            // console.log("second " + rejection.status); // Contains the data about the error on the request.

            // Return the promise rejection.
            return $q.reject(rejection);
        },

        // On response success
        response: function (response) {
            
             /*if(reponse && reponse.status === '302'){
                 logout();
             }*/
            // console.log("third " + response.status); // Contains the data from the response.

            // Return the response or promise.
            
            return response || $q.when(response);
        },

        // On response failure
        responseError: function (rejection) {
            if(rejection && rejection.status === 403){
                 
                 document.cookie = "currentRoute=" + $location.url();
                 logout();
                return;

             }
            //  console.log("fourth " + rejection.status); // Contains the data about the error.
            //console.log("fourth " + JSON.stringify(rejection));



            // Return the promise rejection.
            else
            return $q.reject(rejection);
        }
    };
            }]);