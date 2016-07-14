angular.module('AccountMgmtModule').directive('entityDelete', ['$log', '$modal', function ($log, $modal) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.bind('click', function (e) {
                e.preventDefault();
                var linkDelete = this;
                $modal.open({
                    templateUrl: 'delete-confirmation-modal.html',
                    controller: 'EntityDeleteController as deleteModalInst',
                    resolve: {
                        deleteModalParams: function () {
                            return $(linkDelete).data();
                        }
                    }
                });
            });
        }
    };
}]);