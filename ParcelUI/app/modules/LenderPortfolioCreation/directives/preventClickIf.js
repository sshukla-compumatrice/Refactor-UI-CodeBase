angular.module('LenderPortfolioCreation').directive('preventClickIf', ['$parse', '$rootScope',
    function($parse, $rootScope) {
        return {
            // this ensure eatClickIf be compiled before ngClick
            priority: 100,
            restrict: 'A',
            compile: function($element, attr) {
                var fn = !attr.preventClickIf ? null : $parse(attr.preventClickIf);         
                return {
                    pre: function link(scope, element) {
                        var preventClickFn = fn || function() {
                            var hasDisabledClass = element.hasClass('disabled') || element.parent().hasClass('disabled');
                            return hasDisabledClass;
                        }

                        var eventName = 'click';
                        element.on(eventName, function(event) {
                            var callback = function() {
                                if (preventClickFn(scope, {
                                        $event: event
                                    })) {
                                    // prevents ng-click to be executed
                                    event.stopImmediatePropagation();
                                    // prevents href 
                                    event.preventDefault();
                                    return false;
                                }
                            };
                            if ($rootScope.$$phase) {
                                scope.$evalAsync(callback);
                            } else {
                                scope.$apply(callback);
                            }
                        });
                    },
                    post: function() {}
                }
            }
        }
    }
]);