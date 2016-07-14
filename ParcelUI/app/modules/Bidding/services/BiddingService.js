angular.module('Bidding').service('BiddingAPI', ['APIFactory', 'BiddingUrlCollection','BASEURL', function (APIFactory, UrlColl,BASEURL) {

    var self = this;
    self.apiType = {
        type: 'mock', //'real',

        getDirectAwardsAndBids: {
            mock: BASEURL.BIDDING + UrlColl.GETAPI_DIRECTAWARDSANDBIDS_MOCK,
            real: BASEURL.BIDDING + UrlColl.GETAPI_DIRECTAWARDSANDBIDS
        },
        postSubmitBid: {
            mock: BASEURL.BIDDING + UrlColl.POST_SUBMITBID_MOCK,
            real: BASEURL.BIDDING + UrlColl.POST_SUBMITBID
        }


    };


    this.getDirectAwardsAndBids = function (vendorGUID) {
        var url = this.apiType.getDirectAwardsAndBids[this.apiType.type];
        var queryParams = {
            vendorGUID: vendorGUID
        }
        return APIFactory.get(url, queryParams);
    };
    this.postSubmitBid = function (data) {
        var url = this.apiType.postSubmitBid[this.apiType.type];

        var postData = {
            submitBidRequest: data
        };
        return APIFactory.post(url, postData).then(function (response) {
            return response;
        });
    }

}]);