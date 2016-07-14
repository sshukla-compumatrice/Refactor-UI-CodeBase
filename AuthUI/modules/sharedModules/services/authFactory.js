angular.module("AccessManagement").service("AuthFactory", ["AccessMgmtFactory", "BASEURL", "$http", "globalValues", "$rootScope", "AccountManagementUrlCollection", "$cookieStore", "globalValues", function (AccessMgmtFactory, BASEURL, $http, globalValues, $rootScope, AccountManagementUrlCollection, $cookieStore, globalValues) {

    var self = this;
    self.userDetailsArray = [];

    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    };

    self.authorizeFormFieldsObject = {
        "save_content": "1",
        "decision": "Allow",
        "client_id": "parcelclient",
        "client_secret": "parcelclient",
        "scope": "cn entryUUID",
        "redirect_uri": window.location.protocol + BASEURL.REDIRECT_OAUTHPAGE,
        "response_type": "token",
        "realm": "/"
    };

    self.authorize = function () {
        $http.defaults.withCredentials = true;

        // define html form to post to OPENAM authorize
        var authForm = $('<form enctype="application/x-www-form-urlencoded" action="' + BASEURL.POSTAPI_GETAUTHCODE + '" method="POST">' +
            '<input type="hidden" name="save_content" value="' + self.authorizeFormFieldsObject.save_content + '">' +
            '<input type="hidden" name="decision" value="' + self.authorizeFormFieldsObject.decision + '">' +
            '<input type="hidden" name="client_id" value="' + self.authorizeFormFieldsObject.client_id + '">' +
            '<input type="hidden" name="client_secret" value="' + self.authorizeFormFieldsObject.client_secret + '">' +
            '<input type="hidden" name="scope" value="' + self.authorizeFormFieldsObject.scope + '">' +
            '<input type="hidden" name="redirect_uri" value="' + self.authorizeFormFieldsObject.redirect_uri + '">' +
            '<input type="hidden" name="response_type" value="' + self.authorizeFormFieldsObject.response_type + '">' +
            '<input type="hidden" name="realm" value="' + self.authorizeFormFieldsObject.realm + '">' +
            '</form>');

        // put into the body before submitting
        $('body').append(authForm);
        authForm.submit();
    };

    self.isAuthorized = function () {
        return globalValues.isAuthorized;
    };

    self.isAuthenticated = function () {
        return globalValues.isAuthenticated;
    };

    self.getSession = function () {
        var url = BASEURL.GET_SESSIONTOKEN;
        var sessionGuid = self.retrieveCookie('sessionToken');
        return $http.get(url + '/' + '5ba15302-6547-4cc3-9bbc-5c6fc61facb6').then(function (response) {
            if (response) {
                return response.data;
            }
        }, function (error) {
            throw error;
        })
    }

    self.createSession = function () {
        var sessionExpiryTime = self.retrieveCookie('expiry');
        var userName = "";
        var url = BASEURL.GET_SESSIONTOKEN;
        //var userDetailsArray = JSON.parse(localStorage.getItem("userdetails"));
        var obj = {};
        obj.sessionToken = {};
        var sessionExpiryTimeinNum = parseInt(sessionExpiryTime) + 1;

        obj.sessionToken.expirationTimeFrameMinutes = (sessionExpiryTimeinNum / 60).toString();
        obj.sessionToken.sessionData = [];
        angular.forEach(self.userDetailsArray, function (detail) {
            obj.sessionToken.sessionData.push(detail);
        })
        return $http.post(url, obj).then(function (response) {
            if (response) {
                document.cookie = "sessionToken=" + response.data.sessionToken.sessionTokenGUID;
                localStorage.setItem("userdetails", JSON.stringify(self.userDetailsArray));
                var userName = self.getUserDetailsFromStorage('EFF_DISPLAYNAME');
                $rootScope.$broadcast("User", userName);
                return response.data.sessionToken.sessionTokenGUID;
            }

        }, function (error) {
            //redirect to error page
        })
    };

    /**
     * @function setUserSessionData Sets the USER session information
     * 
     * @param {Object} origUser Original user information (user that actually logged in)
     * @param {Object} impUser Impersonated user information (this can be the currently logged in user)
     */
    self.setUserSessionData = function (origUser, impUser) {
        // simple closure to create key/value
        var createKeyValue = function (key, value) {
            return {
                key: key,
                value: value || ''
            };
        };
        var userPhone = origUser.directPhone ? origUser.directPhone : origUser.cellPhone ? origUser.cellPhone : origUser.office.phone;
        var EFF_userPhone = impUser.directPhone ? impUser.directPhone : impUser.cellPhone ? impUser.cellPhone : impUser.office.phone;

        // reset it
        self.userDetailsArray = [];

        // set the original logged in user
        self.userDetailsArray.push(createKeyValue('USERGUID', origUser.userGUID));
        self.userDetailsArray.push(createKeyValue('OFFICEGUID', origUser.officeGUID));
        self.userDetailsArray.push(createKeyValue('COMPANYGUID', origUser.companyGUID));
        self.userDetailsArray.push(createKeyValue('USERNAME', origUser.userName));
        self.userDetailsArray.push(createKeyValue('EMAIL', origUser.email));
        self.userDetailsArray.push(createKeyValue('DISPLAYNAME', origUser.displayName || origUser.firstName + " " + origUser.lastName));
        self.userDetailsArray.push(createKeyValue('PHONE', userPhone));
        self.userDetailsArray.push(createKeyValue('COMPANYNAME', origUser.companyName));
        self.userDetailsArray.push(createKeyValue('OFFICENAME', origUser.officeName));
        self.userDetailsArray.push(createKeyValue('TITLE', origUser.title));
        self.userDetailsArray.push(createKeyValue('EP', origUser.isEnvProfessional));
        self.userDetailsArray.push(createKeyValue('FULLNAME', origUser.firstName + ' ' + origUser.lastName));

        // set the impersonated user (NOTE that curUser can be the same as impUser if impersonation did not happen)
        self.userDetailsArray.push(createKeyValue('EFF_USERGUID', impUser.userGUID));
        self.userDetailsArray.push(createKeyValue('EFF_OFFICEGUID', impUser.officeGUID));
        self.userDetailsArray.push(createKeyValue('EFF_COMPANYGUID', impUser.companyGUID));
        self.userDetailsArray.push(createKeyValue('EFF_USERNAME', impUser.userName));
        self.userDetailsArray.push(createKeyValue('EFF_EMAIL', impUser.email));
        self.userDetailsArray.push(createKeyValue('EFF_DISPLAYNAME', impUser.displayName || impUser.firstName + " " + impUser.lastName));
        self.userDetailsArray.push(createKeyValue('EFF_PHONE', EFF_userPhone));
        self.userDetailsArray.push(createKeyValue('EFF_COMPANYNAME', impUser.companyName));
        self.userDetailsArray.push(createKeyValue('EFF_OFFICENAME', impUser.officeName));
        self.userDetailsArray.push(createKeyValue('EFF_TITLE', impUser.title));
        self.userDetailsArray.push(createKeyValue('EFF_EP', origUser.isEnvProfessional));
    };

    self.getUserDetails = function () {
        // url
        var accountManagementUrl = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_GETUSER_REAL;

        // get user guid from cookies
        var userGuid = self.retrieveCookie('userGuid');
        var params = {
            userGuid: userGuid,
            detail: "office"
        }

        // get user details from Account Management
        var uri = formatUrl(accountManagementUrl, params);
        return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            })
            .then(function (response) {
                if (response) {
                    // get the user information
                    var curUser = response.data.users[0];
                    if (BASEURL.IS_OTHERENV == 1) self.deleteCookie('userGuid');
                    if ((curUser === 'undefined') || (curUser === null)) {
                        alert('Unable to get user information (' + userGuid + ')');
                        return;
                    }
                    // set the user session information
                    self.setUserSessionData(curUser, curUser);

                    return response.data;
                } else {
                    return {};
                }

            }, function (error) {
                return error;
            });

    };

    self.retrieveCookie = function (cookieName) {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };

    self.getHostName = function (url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        } else {
            return null;
        }
    }

    self.extractDomain = function (url) {
        var hostName = self.getHostName(url);
        var domain = hostName;

        if (hostName != null) {
            var parts = hostName.split('.').reverse();

            if (parts != null && parts.length > 1) {
                domain = parts[1] + '.' + parts[0];

                if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
                    domain = parts[2] + '.' + domain;
                }
            }
        }

        return domain;
    }

    self.logout = function (instance) {
        var logoutUrl = BASEURL.REDIRECT_LOGOUT;
        var ca = document.cookie.split(';');
        var cookiesKeys = [];
        for (var i = 0; i < ca.length; i++) {
            cookiesKeys.push(ca[i].split('=')[0]);
        }

        angular.forEach(cookiesKeys, function (key) {
            if (instance == 'loggedout') self.deleteCookie(key.trim());
            else if (instance == 'expired' && key.trim() != 'currentRoute')
                self.deleteCookie(key.trim());
        });

        // remove user information in local storage
        //self.deleteLocalStorage('userdetails');
        localStorage.clear();


        // already logout
        globalValues.isLogout = true;

        // OPENAM is configured to clear login information by redirecting to logout.html
        window.location = logoutUrl;


    };

    self.deleteCookie = function (name) {

        // This function will attempt to remove a cookie from all paths.
        var domain = self.extractDomain(location.href);
        var pathBits = location.pathname.split('/');
        var pathCurrent = ' path=';

        // do a simple pathless delete first.
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

        for (var i = 0; i < pathBits.length; i++) {
            pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';' + 'domain=.' + domain;
        }
    };

    self.deleteLocalStorage = function (name) {
        localStorage.removeItem(name);
    };

    self.getUserDetailsFromStorage = function (key) {
        var userDetails = JSON.parse(localStorage.getItem('userdetails'));
        if (userDetails) {
            for (var i = 0; i < userDetails.length; i++) {
                if (userDetails[i].key === key) {
                    return userDetails[i].value;
                }
            }
        }
    };

    self.impersonateUserOnLocalEnv = function () {
        localStorage.removeItem('userdetails');
        var userDetails = [{
            "key": "USERGUID",
            "value": "bbc8bb95-f8d0-42aa-b053-00f187134f16"
            }, {
            "key": "OFFICEGUID",
            "value": "5d96e57b-5571-4914-88b3-ce07d0c592bf"
            }, {
            "key": "COMPANYGUID",
            "value": "cd024ac2-f962-472f-acf1-1dc4238c321e"
            }, {
            "key": "USERNAME",
            "value": "devuser@benchmarkenviro.com"
            }, {
            "key": "EMAIL",
            "value": "devuser@benchmarkenviro.com"
            }, {
            "key": "DISPLAYNAME",
            "value": "DEV DevUser"
            }, {
            "key": "PHONE",
            "value": ""
            }, {
            "key": "COMPANYNAME",
            "value": "Benchmark Environmental Consultants"
            }, {
            "key": "OFFICENAME",
            "value": "Dallas\\, TX"
            }, {
            "key": "TITLE",
            "value": ""
            }, {
            "key": "EP",
            "value": true
            }, {
            "key": "FULLNAME",
            "value": "Developer User"
            }, {
            "key": "EFF_USERGUID",
            "value": "bbc8bb95-f8d0-42aa-b053-00f187134f16"
            }, {
            "key": "EFF_OFFICEGUID",
            "value": "5d96e57b-5571-4914-88b3-ce07d0c592bf"
            }, {
            "key": "EFF_COMPANYGUID",
            "value": "cd024ac2-f962-472f-acf1-1dc4238c321e"
            }, {
            "key": "EFF_USERNAME",
            "value": "devuser@benchmarkenviro.com"
            }, {
            "key": "EFF_EMAIL",
            "value": "devuser@benchmarkenviro.com"
            }, {
            "key": "EFF_DISPLAYNAME",
            "value": "DEV DevUser"
            }, {
            "key": "EFF_PHONE",
            "value": ""
            }, {
            "key": "EFF_COMPANYNAME",
            "value": "Benchmark Environmental Consultants"
            }, {
            "key": "EFF_OFFICENAME",
            "value": "Dallas\\, TX"
            }, {
            "key": "EFF_TITLE",
            "value": ""
            }, {
            "key": "EFF_EP",
            "value": true
            }];

        localStorage.setItem("userdetails", JSON.stringify(userDetails));
    }
}]);