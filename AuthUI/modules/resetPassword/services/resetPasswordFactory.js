angular.module('ResetPasswordModule').factory('resetPasswordFactory', ['BASEURL', '$http', function (BASEURL, $http) {
    var factory = {};


    factory.validateEmail = function (email) {
        var url = BASEURL.ACCOUNT_MGMT + '/users/?search=' + email;
        return $http.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            }
        }).then(function (response) {
            return response.data;
        }, function (error) {
            throw error;
        })
    }


    factory.createSession = function (userDetailsArray) {

        var url = BASEURL.ACCESS_MGMT_CORE + "/sessiontokens";

        var obj = {};
        obj.sessionToken = {};

        obj.sessionToken.expirationTimeFrameMinutes = "60";
        obj.sessionToken.sessionData = [];
        angular.forEach(userDetailsArray, function (detail) {
            obj.sessionToken.sessionData.push(detail);
        })
        return $http.post(url, obj).then(function (response) {
            if (response) {
                return response.data.sessionToken.sessionTokenGUID;
            }
        }, function (error) {
            throw error;
        })
    };

    factory.getSession = function (sessionGuid) {
        var url = BASEURL.ACCESS_MGMT_CORE + "/sessiontokens";
        return $http.get(url + '/' + sessionGuid).then(function (response) {
            if (response) {
                return response.data;
            }
        }, function (error) {
            throw error;
        })
    }

    factory.putSession = function (sessionObject, sessionGuid) {

        var url = BASEURL.ACCESS_MGMT_CORE + "/sessiontokens";
        return $http.put(url + '/' + sessionGuid, sessionObject).then(function (response) {
            if (response) {
                return response.data;
            }
        }, function (error) {
            throw error;
        })
    }


    factory.resetPassword = function (password, userGuid) {
        var url = BASEURL.ACCOUNT_MGMT + "/user";
        var obj = {};
        obj.userAuthenitication = {};
        obj.userAuthenitication.password = password;
        return $http.put(url + '/' + userGuid, obj).then(function (response) {
            return response.data;
        }, function (error) {
            throw error;
        })
    }

    factory.updateSessionTokenInfo = function (sessionDataArray, tokenGuid) {
        var url = BASEURL.ACCESS_MGMT_CORE + "/sessiontokens";
        var obj = {};
        obj.sessionToken = {};

        for (var i = 0; i < sessionDataArray.length; i++) {
            if (sessionDataArray[i].key === 'ISUSED') {
                sessionDataArray[i].value = 1;
                break;
            }
        }
        obj.sessionToken.sessionData = sessionDataArray;
        return $http.put(url + '/' + tokenGuid, obj).then(function (response) {
            return response.data;
        }, function (error) {
            throw error;
        })
    }


    factory.sendEmailNotification = function (toEmail, tokenGuid, displayName, email, userName) {
        var abc = window.location.protocol + "//" + window.location.host + '/#/ResetPassword';
        var url = BASEURL.MESSAGE_SERVICE + "/messages/";
        var obj = {}
        obj.assetGUID = BASEURL.ASSETGUID;
        obj.assetType = "cabinet";
        obj.applicationGUID = BASEURL.APPLICATIONGUID;
        obj.messages = [];
        var messageObject = {};
        messageObject.templateName = BASEURL.TEMPLATENAME;
        messageObject.templateGUID = BASEURL.TEMPLATEGUID;
        messageObject.messageType = "EMAIL";
        messageObject.from = "";
        messageObject.to = [toEmail];
        messageObject.cc = [];
        messageObject.bcc = [];
        messageObject.fields = [{
            "fieldName": "resetPasswordLink",
            "fieldValue": BASEURL.EMAILLINK + '?Token=' + tokenGuid
        }, {
            "fieldName": "displayName",
            "fieldValue": displayName
        }, {
            "fieldName": "userName",
            "fieldValue": userName
        }, {
            "fieldName": "supportEmailAddress",
            "fieldValue": BASEURL.PARCELSUPPORTEMAIL
        }, {
            "fieldName": "supportPhoneNumber",
            "fieldValue": BASEURL.PARCELSUPPORTPHONE
        }]
        obj.messages.push(messageObject);


        return $http.post(url, obj).then(function (response) {
            return response.data;
        }, function (error) {
            throw error;
        })
    }

    return factory;
}])