angular.module('Bidding').controller('UpdateBidController', ['$timeout', '$scope', '$compile', '$location', '$state', 'BiddingAPI', function ($timeout, $scope, $compile, $location, $state, BiddingAPI) {

    var bidGUID = $state.params.bidGUID;


    $scope.searchLocation = {};

    BiddingAPI.getDirectAwardsAndBids(globalValues.currentUserCompanyGuid).then(function (result) {

        for (var i = 0; i < result.vendorBids.length; i++) {

            if (bidGUID == result.vendorBids[i].bid.bidGUID) {
                $scope.propertyName = "property name";
                $scope.propertyAddress = result.vendorBids[0].property.address.address1 + ' ' + result.vendorBids[0].property.address.address2;
                $scope.scopeOfWork = result.vendorBids[0].rfp.requestType;
                $scope.reqDraftDate = result.vendorBids[0].rfp.reportDraftDueDate;
                $scope.reqDeliveryDate = result.vendorBids[0].rfp.reportDraftDueDate;
                $scope.comments = result.vendorBids[0].bid.comments[0].commentText;
                $scope.bidDeadline = result.vendorBids[0].bid.proposedDateToComplete;

                $scope.fee = result.vendorBids[0].bid.proposedFee;
                $scope.signatoryInformation = result.vendor.fullName;
                $scope.turnaroundTime = result.vendorBids[0].bid.proposedDateToComplete; // subtract from current date and show no of days
              
              
                $scope.searchLocation.latitude = result.vendorBids[0].property.geoData.latitude;
                $scope.searchLocation.longitude = result.vendorBids[0].property.geoData.longitude;
                break;
            }
        }


    });


}]);