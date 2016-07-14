angular.module('AccessManagement').provider('breadcrumb', function () {
    var $$options = {
        prefixStateName: null,
    };

    function isAOlderThanB(scopeA, scopeB) {
        if (angular.equals(scopeA.length, scopeB.length)) {
            return scopeA > scopeB;
        } else {
            return scopeA.length > scopeB.length;
        }
    }

    function parseStateRef(ref) {
        var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
        if (!parsed || parsed.length !== 4) {
            throw new Error("Invalid state ref '" + ref + "'");
        }
        return {
            state: parsed[1],
            paramExpr: parsed[3] || null
        };
    }

    this.setOptions = function (options) {
        angular.extend($$options, options);
    };

    this.$get = ['$state', '$stateParams', '$rootScope', function ($state, $stateParams, $rootScope) {

        var $lastViewScope = $rootScope;

        // Early catch of $viewContentLoaded event
        $rootScope.$on('$viewContentLoaded', function (event) {
            // With nested views, the event occur several times, in "wrong" order
            if (isAOlderThanB(event.targetScope.$id, $lastViewScope.$id)) {
                $lastViewScope = event.targetScope;
            }
        });

        // Get the parent state
        var $$parentState = function (state) {
            // Check if state has explicit parent OR we try guess parent from its name
            var parent = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
            var isObjectParent = typeof parent === "object";
            // if parent is a object reference, then extract the name
            return isObjectParent ? parent.name : parent;
        };

        // Add the state in the chain if not already in and if not abstract
        var $$addStateInChain = function (chain, stateRef) {
            var conf,
                parentParams,
                ref = parseStateRef(stateRef)
                skip = false;

            for (var i = 0, l = chain.length; i < l; i += 1) {
                if (chain[i].name === ref.state) {
                    return;
                }
            }

            conf = $state.get(ref.state);
            // Get breadcrumb options
            if (conf.breadcrumb) {
                if (conf.breadcrumb.skip) {
                    skip = true;
                }
            }
            if (!conf.abstract && !skip) {
                if (ref.paramExpr) {
                    parentParams = $lastViewScope.$eval(ref.paramExpr);
                }

                conf.breadcrumbLink = $state.href(ref.state, parentParams || $stateParams || {});
                chain.unshift(conf);
            }
        };

        // Get the state for the parent step in the breadcrumb
        var $$breadcrumbParentState = function (stateRef) {
            var ref = parseStateRef(stateRef),
                conf = $state.get(ref.state);

            if (conf.breadcrumb && conf.breadcrumb.parent) {
                // Handle the "parent" property of the breadcrumb, override the parent/child relation of the state
                var isFunction = typeof conf.breadcrumb.parent === 'function';
                var parentStateRef = isFunction ? conf.breadcrumb.parent($lastViewScope) : conf.breadcrumb.parent;
                if (parentStateRef) {
                    return parentStateRef;
                }
            }

            return $$parentState(conf);
        };

        return {

            getStatesChain: function (exitOnFirst) { // Deliberately undocumented param, see getLastStep
                var chain = [];

                // From current state to the root
                for (var stateRef = $state.$current.self.name; stateRef; stateRef = $$breadcrumbParentState(stateRef)) {
                    $$addStateInChain(chain, stateRef);
                    if (exitOnFirst && chain.length) {
                        return chain;
                    }
                }

                // Prefix state treatment
                if ($$options.prefixStateName) {
                    $$addStateInChain(chain, $$options.prefixStateName);
                }

                return chain;
            },

            getLastStep: function () {
                var chain = this.getStatesChain(true);
                return chain.length ? chain[0] : undefined;
            },

            $getLastViewScope: function () {
                return $lastViewScope;
            }
        };
    }];
})