angular.module('ProjectCreation').service('ContactAPIService', ['$http', 'UrlColl', '$q', 'APIFactory', 'BASEURL', function ($http, urlColl, $q, APIFactory, BASEURL) {

    var self = this;
    this.contacts = [];
    var test = [];

    var getContactServiceCall = function (companyId, enforceLive) {
        if ((this.contacts && this.contacts.length) > 0 && (!enforceLive)) {
            var defer = $q.defer();
            defer.resolve(this.contacts);
            return defer.promise;
        }

        var uri = BASEURL.PROJECTCREATION_CONTACTS + urlColl.GETAPI_CONTACTS;
        var params = {
            companyID: companyId
        };
        uri = uri + "?nocache=" + new Date().getTime();

        return APIFactory.get(uri, params).then(function (data) {
            return self.contacts = data.contacts;
        });
    };


    var addContactServiceCall = function (contact) {
        var uri = BASEURL.PROJECTCREATION_CONTACTS + urlColl.POSTAPI_CONTACT;
        var postData = {
            contact: contact
        };
        return APIFactory.post(uri, postData).then(function (results) {
            clearData();
        });

        //        return $http({
        //            method: 'POST',
        //            url: uri,
        //            data: contact,
        //            header: {
        //                'Content-Type': 'application/json',
        //                'Cache-Control': 'no-cache, no-store, must-revalidate',
        //                'Pragma': 'no-cache',
        //                'Expires': 0
        //            }
        //        }).then(function (results) {
        //             console.log("oooooo: "+JSON.stringify(results));
        //            var retVal = parseServiceRespForError(results);
        //            clearData();
        //            return retVal;
        //        });
    }

    // contact should be the same as post/add call
    var editContactServiceCall = function (contactID, contact) {
        var uri = BASEURL.PROJECTCREATION_CONTACTS + urlColl.PUTAPI_CONTACT;
        var params = {
            contactID: contactID
        };

        var putData = {
            contact: contact
        };


        return APIFactory.put(uri, putData, params).then(function (results) {
            clearData();

        });

        //        return $http({
        //            method: 'PUT',
        //            url: uri,
        //            data: contact,
        //            header: {
        //                'Content-Type': 'application/json',
        //                'Cache-Control': 'no-cache, no-store, must-revalidate',
        //                'Pragma': 'no-cache',
        //                'Expires': 0
        //            }
        //        }).then(function (results) {
        //            var retVal = parseServiceRespForError(results);
        //            clearData();
        //            return retVal;
        //        });
    }


    // helpers
    var parseServiceRespForError = function (rawResp) {
        var data = rawResp.data;
        var result = data.result;
        //if (!result || !result.success) throw new Error("error message here");
        return result;
    }

    var clearData = function () {
        this.contacts = null;
    }


    this.getContacts = getContactServiceCall;
    this.add = addContactServiceCall;
    this.update = editContactServiceCall;
}]);
