angular.module('AccessManagement').directive('chosen', function() {
  var linker = function(scope, element, attr) {
        // update the select when data is loaded
        scope.$watch(attr.chosen, function(newVal, oldVal) {
            element.trigger('chosen:updated');
        });

        // update the select when the model changes
        scope.$watch(attr.ngModel, function(newVal, oldVal) {
            element.trigger('chosen:updated');
        });
        
        element.chosen();
    };

    return {
        restrict: 'A',
        link: linker
    };
});