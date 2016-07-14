angular.module('AccessManagement').factory('commonFactory', function () {

    function clearValidationMessages(formName) {
        $("form[name=" + formName + "] .has-error").each(function () {
            if (!$(this).hasClass('ng-hide')) {
                $(this).removeClass('has-error');
                $(this).find('.validation-error-text').each(function () {
                    var spanElem = angular.element(this);
                    spanElem.remove();
                });
            }
        });

        $("form[name=" + formName + "]").get(0).reset();
    }

    function getUserDetailsFromStorage(key) {
        var userDetails = JSON.parse(localStorage.getItem('userdetails'));
        if (userDetails) {
            for (var i = 0; i < userDetails.length; i++) {
                if (userDetails[i].key === key) {
                    return userDetails[i].value;
                }
            }
        }
    }

    

    function removeNoiseFromDataUrlOfBase64(dataUrl) {
        return dataUrl.indexOf("base64") >= 0 ? dataUrl.split("base64,")[1] : dataUrl;
    }

    return {
        clearFieldValidation: clearValidationMessages,
        getUserDetailsFromStorage: getUserDetailsFromStorage,
        removeNoiseFromDataUrlOfBase64: removeNoiseFromDataUrlOfBase64
        
    };
});