lenderPortalApp.factory('searchLoanService', ['$resource',
  function ($resource) {
        return {
            getSearchLoans: $resource('http://parredatapoc2:8080/lenderportalservice/rest/v1/companies/5030/loans', {}, {

                'get': {
                    method: 'GET',
                    isArray: true

                }

            }),
            getDefaultLoans: $resource('http://parredatapoc2:8080/lenderportalservice/rest/v1/users/37625/loans/recent', {}, {

                'get': {
                    method: 'GET',
                    isArray: true

                }

            })

        };
                }])