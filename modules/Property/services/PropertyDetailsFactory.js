angular.module('PropertyModule').factory(
    'PropertyDetailsFactory', ['$http', 'PropertyUrls', '$log', 'PropertyResources',
        function ($http, PropertyUrls, $log, PropertyResources) {

            var PropertyFactoryLogger = $log.getInstance('propertyFactory');

            PropertyFactoryLogger.info(PropertyResources.initial);

            var factory = {};

            var navigationlinks = PropertyUrls.getPropertyNavigationLinks;
            var loandetails = PropertyUrls.getLoanData;


            factory.GetNavLinks = function () {

                PropertyFactoryLogger.info(PropertyResources.navigationlinks);

                return $http.get(navigationlinks).then(
                    function (result) {

                        return result.data;
                    },
                    function (error) {

                        PropertyFactoryLogger.error(error);
                        throw new Error(error);
                    });
            }

            factory.GetLoanDetails = function () {

                PropertyFactoryLogger.info(PropertyResources.loandetails);

                return $http.get(loandetails).then(
                    function (result) {

                        return result.data;
                    },
                    function (error) {

                        PropertyFactoryLogger.error(error);
                        throw new Error(error);
                    });
            }

            return factory;

}
]);
