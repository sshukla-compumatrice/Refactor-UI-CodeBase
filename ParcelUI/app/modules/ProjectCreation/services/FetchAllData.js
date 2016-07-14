angular.module('ProjectCreation').factory('FetchDataFactory', ['$http', '$q', 'Urls', '$log', function($http, $q, Urls, $log) {

    try {
        var fetchDataFactoryLogger = $log.getInstance('fetchDataFactory');

        fetchDataFactoryLogger.info(Urls.getFormData);
        var fetchData = {};
        //var staticPath = 'static_data/';
        return {

            getPreFormRenderData: function() {

                /*getLibrariesUrl  = staticPath + 'getLibraries.js';
			getOfficesUrl = staticPath + 'getOffices.js';
			getPropertyTypesUrl = staticPath + 'getPropertyTypes.js';
			getRelatedCompaniesUrl = staticPath + 'getRelatedCompanies.js';
			getTeamsUrl = staticPath + 'getTeams.js';
			getTemplatesUrl = staticPath + 'getTemplates.js';
			getTransactionTypesUrl = staticPath + 'getTransactionTypes.js';*/

                getLibrariesUrl = Urls.getLibraries;
                getOfficesUrl = Urls.getOffices;
                getPropertyTypesUrl = Urls.getPropertyTypes;
                getRelatedCompaniesUrl = Urls.getRelatedCompanies;
                getTeamsUrl = Urls.getTeams;
                getTemplatesUrl = Urls.getTemplates;
                getTransactionTypesUrl = Urls.getTransactionTypes;


                var promiseA = $http.get(getLibrariesUrl, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function(result) {
                    fetchDataFactoryLogger.info("libraries fetched");
                    return result.data;
                }, function(error) {

                    fetchDataFactoryLogger.error(error.statusText);
                });

                var promiseB = $http.get(getOfficesUrl, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function(result) {
                    fetchDataFactoryLogger.info("Offices fetched");
                    return result.data;
                }, function(error) {
                    fetchDataFactoryLogger.error(error.statusText);
                });

                var promiseC = $http.get(getPropertyTypesUrl, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function(result) {
                    fetchDataFactoryLogger.info("PropertyTypes fetched");
                    return result.data;
                }, function(error) {
                    fetchDataFactoryLogger.error(error.statusText);
                });

                var promiseD = $http.get(getRelatedCompaniesUrl, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function(result) {
                    fetchDataFactoryLogger.info("RelatedCompanies fetched");
                    return result.data;
                }, function(error) {
                    fetchDataFactoryLogger.error(error.statusText);
                });

                var promiseE = $http.get(getTeamsUrl, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function(result) {
                    fetchDataFactoryLogger.info("Teams fetched");
                    return result.data;
                }, function(error) {
                    fetchDataFactoryLogger.error(error.statusText);
                });

                var promiseF = $http.get(getTemplatesUrl, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function(result) {
                    fetchDataFactoryLogger.info("Templates fetched");
                    return result.data;
                }, function(error) {
                    fetchDataFactoryLogger.error(error.statusText);
                });

                var promiseG = $http.get(getTransactionTypesUrl, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function(result) {
                    fetchDataFactoryLogger.info("TransactionTypes fetched");
                    return result.data;
                }, function(error) {
                    fetchDataFactoryLogger.error(error.statusText);
                });

                this.promise = $q.all([promiseA, promiseB, promiseC, promiseD, promiseE, promiseF, promiseG]).then(function(data) {
                    return data;

                });

                return this.promise;

            }
        }
    } catch (e) {
        fetchDataFactoryLogger.info("error in fetching records from service");
        fetchDataFactoryLogger.error(e);
    }

    return fetchData;

}]);