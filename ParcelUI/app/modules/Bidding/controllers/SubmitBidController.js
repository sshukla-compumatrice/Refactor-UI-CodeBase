angular.module('Bidding').controller('SubmitBidController', ['$timeout', '$scope', '$compile', '$location', '$state', 'BiddingAPI', 'globalValues', function ($timeout, $scope, $compile, $location, $state, BiddingAPI, globalValues) {

    var bidGUID = $state.params.bidGUID;


    $scope.searchLocation = {};

    BiddingAPI.getDirectAwardsAndBids(globalValues.currentUserCompanyGuid).then(function (result) {

        for (var i = 0; i < result.vendorBids.length; i++) {

            if (bidGUID == result.vendorBids[i].bid.bidGUID) {
                $scope.propertyName = "property name";
                $scope.propertyAddress = result.vendorBids[0].property.address.address1 + ' ' + result.vendorBids[0].property.address.address2;
                $scope.scopeOfWork = "scope of work";
                $scope.reqDraftDate = "requested draft date";
                $scope.reqDeliveryDate = "requested delivery date";
                $scope.comments = result.vendorBids[0].bid.comments[0].commentText;
                $scope.bidDeadline = result.vendorBids[0].bid.proposedDateToComplete;

                $scope.searchLocation.latitude = result.vendorBids[0].property.geoData.latitude;
                $scope.searchLocation.longitude = result.vendorBids[0].property.geoData.longitude;
                break;
            }
        }


    });

    $scope.submitResponse = function () {
     console.log("post");
    }
      $(document).ready(function () {
        $("#yes").click(function () {
            $(".collapse").show();
        });
        $("#no").click(function () {
            $(".collapse").hide();
        });
    });

}]);