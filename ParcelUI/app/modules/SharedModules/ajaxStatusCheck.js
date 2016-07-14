angular.module('ParcelUI').factory('checkStatus', ['errorCodes', function (errorCodes) {
    var factory = {};
    factory.checkCodeInStatusArray = function (statusCode, operation) {
        var statusArray = errorCodes[operation];
        var isInStatusArray = false;
        var isInStatusArray = include(statusArray, statusCode);
        return isInStatusArray;
        
    }

    function include(arr,code) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == code) return true;
        }
    }
    return factory;
}]);