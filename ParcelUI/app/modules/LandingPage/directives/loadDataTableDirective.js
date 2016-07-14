angular.module('ParcelUI').directive('loadDataTable', [function() {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            $scope.$emit('load-datatable');
        }
    }
}])