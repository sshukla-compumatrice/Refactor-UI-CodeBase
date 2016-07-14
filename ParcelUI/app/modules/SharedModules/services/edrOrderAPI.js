angular.module("ParcelUI").service("edrOrderAPI", ['edrOrderUrlCollection', 'APIFactory', 'BASEURL', function (edrOrderUrlCollection, APIFactory, BASEURL) {

    this.apiType = {
        type: 'real',
        //type: 'mock',

        postSingleSiteOrder: {
            real: BASEURL.EDR_ORDER + edrOrderUrlCollection.POSTAPI_SINGLESITEORDER_CREATEORDER_REAL,
            mock: edrOrderUrlCollection.POSTAPI_SINGLESITEORDER_CREATEORDER_MOCK
        },

        searchDistances: {
            real: BASEURL.EDR_ORDER + edrOrderUrlCollection.POSTAPI_PORTFOLIOORDERING_GETSEARCHDISTANCES_REAL,
            mock: edrOrderUrlCollection.POSTAPI_PORTFOLIOORDERING_GETSEARCHDISTANCES_MOCK
        },

        getPortfolioProducts: {
            real: BASEURL.EDR_ORDER + edrOrderUrlCollection.GETAPI_PORTFOLIOORDERING_GETPORTFOLIOPRODUCTS_REAL,
            mock: edrOrderUrlCollection.GETAPI_PORTFOLIOORDERING_GETPORTFOLIOPRODUCTS_MOCK
        },

        createPortfolioOrder: {
            real: BASEURL.EDR_ORDER + edrOrderUrlCollection.POSTAPI_PORTFOLIOORDERING_CREATEPORTFOLIOORDER_REAL,
            mock: edrOrderUrlCollection.POSTAPI_PORTFOLIOORDERING_CREATEPORTFOLIOORDER_MOCK
        },
        
        getPortfolioOrderStatus: {
            real: BASEURL.EDR_ORDER + edrOrderUrlCollection.GETAPI_PORTFOLIOORDERING_GETSTATUS_REAL,
            mock: edrOrderUrlCollection.GETAPI_PORTFOLIOORDERING_GETSTATUS_MOCK
        }
    }

    this.postSingleSiteOrder = function (data) {
        var url = this.apiType.postSingleSiteOrder[this.apiType.type];
        return APIFactory.post(url, data).then(function (response) {
            return response;
        });
    };

    this.searchDistances = function (data) {
        var url = this.apiType.searchDistances[this.apiType.type];
        return APIFactory.post(url, data).then(function (response) {
            return response;
        });
    };

    this.getPortfolioProducts = function (companyGuid) {
        var url = this.apiType.getPortfolioProducts[this.apiType.type];
        var queryParams = {};
        queryParams.companyGuid = companyGuid ? companyGuid : "";
        return APIFactory.get(url, queryParams).then(function (response) {
            return response;
        });
    };

    this.createPortfolioOrder = function (data) {
        var url = this.apiType.createPortfolioOrder[this.apiType.type];
        return APIFactory.post(url, data).then(function (response) {
            return response;
        });
    };

    this.getPortfolioOrderStatus = function (portfolioOrderGuid) {
        if (portfolioOrderGuid) {
            var url = this.apiType.getPortfolioOrderStatus[this.apiType.type];
            var queryParams = {};
            queryParams.portfolioOrderGuid = portfolioOrderGuid;
            return APIFactory.get(url, queryParams).then(function (response) {
                return response;
            });
        } else {
            return false;
        }
    };
}]);