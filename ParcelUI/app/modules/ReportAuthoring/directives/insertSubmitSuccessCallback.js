angular.module('ReportAuthoring').directive('insertSubmitSuccessCallback', ['$timeout', '$rootScope', function($timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            // mandatory to identify angular element
            // need to 
            var elemId = attrs.id;

            // this needs to be called after submit success
            scope.callback = function(event) {
                $rootScope.$broadcast('submit-success-callback-invoked');

                // cancel default behavior
                if (event) {
                    // prevents ng-click to be executed
                    event.stopImmediatePropagation();
                    // prevents href 
                    event.preventDefault();
                }
            };



            $timeout(function() {
                //var btn = elem[0].querySelector("input[type=submit]");
                var btn = elem[0].querySelector("button[type=submit]");
                var submit = angular.element(btn);

                /*submit.on('click', function() {
                    otherCallback();
                });*/

                var clickEvName = "onClick";
                var original = submit.attr(clickEvName);
                //var modified = original + "; callbackFunc(event, '" + elemId + "');";
                var modified = "javascript: someFunc(event); callbackFunc(event, '" + elemId + "');";
                //submit.attr(clickEvName, modified);

                submit.attr('submit-success', "callbackFunc(event, '" + elemId + "')");
            });
        }
    }
}]);

// test javascript functions
// to replicate what would have
function someFunc() {
    alert('some javascript function invoked');
}

function callbackFunc(event, elemId) {
    angular.element(document.getElementById(elemId)).scope().callback(event);
}