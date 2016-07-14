angular.module('Bidding').constant('BiddingUrlCollection', {

    GETAPI_DIRECTAWARDSANDBIDS: 'bids?vendorGUID={vendorGUID}',
    GETAPI_DIRECTAWARDSANDBIDS_MOCK: 'bids?vendorGUID={vendorGUID}',
    
    POST_SUBMITBID: 'vendor/bid',
    POST_SUBMITBID_MOCK: 'vendor/bid'
   
});