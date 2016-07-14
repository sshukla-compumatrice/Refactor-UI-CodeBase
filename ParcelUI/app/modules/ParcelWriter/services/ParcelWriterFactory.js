
angular.module('ParcelWriter').factory('ParcelWriterFactory', ['BASEURL', 'APIFactory', '$http', 'parcelWriterUrlCollection', function (BASEURL, APIFactory, $http, parcelWriterUrlCollection) {
    var self = this;
    self.stoarageArray = [];

    var factory = {};

    factory.getWriterData = function (reportGuid) {
        var url = BASEURL.BASE_REPORTWRITINGADMIN_SERVICE + parcelWriterUrlCollection.GETWRITERDATA;
        var params = {
            reportGuid: reportGuid
        };
        return APIFactory.get(url, params).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });

    }

    factory.updateSelectedLanguageArray = function (operation, obj) {
        //self.array = array;
        if (operation === 'PUSH') {
            self.stoarageArray.push(obj);
        } else if (operation === 'SPLICE') {
            angular.forEach(self.stoarageArray, function (element, index) {
                if (element.sectionGuid === obj.sectionGuid && element.languageItemGuids === obj.languageItemGuids) {
                    self.stoarageArray.splice(index, 1);
                }
            })
        }
    }

    factory.getSelectedLanguageArray = function () {
        return self.stoarageArray;
    }

    factory.removeSelectedLanguageArray = function () {
        self.stoarageArray.length = 0;
    }

    factory.putWriterData = function (reportGUID, languageData) {
        var url = BASEURL.BASE_REPORTWRITINGADMIN_SERVICE + parcelWriterUrlCollection.PUTWRITERDATA;
        var params = {
            reportGUID: reportGUID
        };

        return APIFactory.put(url, languageData, params).then(function (data) {
            return data;
        });
    }

    return factory;
}])
