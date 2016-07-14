// view map tool controller 
angular.module('ReportAuthoring').controller('PortfolioOrderStatusController', ['$scope', 'edrOrderAPI', '$state', '$interval', function ($scope, edrOrderAPI, $state, $interval) {

    var self = this;
    var orderStatusInterval;
    self.isServiceError = "NO";

    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Fetching EDR order status...';
    $scope.backdrop = true;

    init();

    function applyEdrOrderStatus() {
        if (self.orderStatus && self.orderStatus.portfolioOrder && self.orderStatus.portfolioOrder.ordersPending <= 0 && self.orderStatus.portfolioOrder.ordersRequested > 0 && angular.isDefined(orderStatusInterval)) {
            $interval.cancel(orderStatusInterval);
            orderStatusInterval = undefined;
        } else {
            if ($state.params.portfolioOrderGuid) {
                $scope.promise = edrOrderAPI.getPortfolioOrderStatus($state.params.portfolioOrderGuid).then(function (result) {
                    self.isServiceError = false;
                    self.orderStatus = result;
                    if (self.orderStatus && self.orderStatus.portfolioOrder && self.orderStatus.portfolioOrder.ordersRequested > 0) {
                        self.isOrderPlaced = true;
                        self.groupByOrders = _.groupBy(self.orderStatus.portfolioOrder.orders, 'portfolioProductCode');
                    }
                }, function (error) {
                    self.isServiceError = "YES";
                    $interval.cancel(orderStatusInterval);
                    orderStatusInterval = undefined;
                });
            }
        }
    }

    function init() {
        window.scrollTo(0, 0);
        self.projectName = $state.params.projectName;
        self.isOrderPlaced = false;
        self.groupByOrders = [];
        applyEdrOrderStatus();

        orderStatusInterval = $interval(applyEdrOrderStatus, 6000);
    }
}]);