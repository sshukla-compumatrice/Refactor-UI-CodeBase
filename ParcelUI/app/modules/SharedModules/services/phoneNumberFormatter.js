angular.module('ProjectDashboard').factory('PhoneNumberValidator',[function(){
    var factory = {};
    factory.format = function (number) {
        console.log("number" + number);
        if (number != null && number != undefined && number != "") {
            number = number.replace(/[^0-9]/g, '');
            if (number.length > 3) {
                if (number.length > 6) {
                    number = number.replace(/(\d{3})(\d{3})(\d)/, "($1) $2-$3");
                }
                else {
                    number = number.replace(/(\d{3})(\d)/, "($1) $2");
                }
            }


            if (number.length > 14) {
                number = number.substring(0, 14);
            }

            return number;
        }
    }
    return factory;
}])