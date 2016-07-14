var policyApp = angular.module('PolicyManagerModule', ['ui.router.state']);


policyApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/Policy', '/Policy/Information');

    $stateProvider.state('Policy', {
        'url': '/Policy',
        'abstract': true,
        'templateUrl': 'modules/PolicyManager/views/policy.navigation.html',
        'controller': 'PolicyNavCtrl as policynav'
    }).
    state('Policy.Information', {
        'url': '/Information',
        'templateUrl': 'modules/PolicyManager/views/policy.information.html',
        'controller': 'PolicyInfoCtrl as policyinfo',
        'resolve': {
            createPolicyInfoData: function (PolicyFactory, PolicyShareDataService) {
                var policyManagerData = PolicyShareDataService.getPolicyManagerData();
                if(!policyManagerData.hasOwnProperty('policies') || !policyManagerData.hasOwnProperty('fields')) {
                    return PolicyFactory.getPolicyManagerData().then(function (result) {
                        return result;
                    })                
                }
                else {
                    return policyManagerData;
                }
            }
        }
    }).
    state('Policy.Values', {
        'url': '/Values',
        'templateUrl': 'modules/PolicyManager/views/policy.values.html',
        'controller': 'PolicyValuesCtrl as policyvalues',
        'resolve': {
            createPolicyValuesData: function (PolicyFactory, PolicyShareDataService) {
                var policyManagerData = PolicyShareDataService.getPolicyManagerData();
                if(!policyManagerData.hasOwnProperty('policies') || !policyManagerData.hasOwnProperty('fields')) {
                    return PolicyFactory.getPolicyManagerData().then(function (result) {
                        return result;
                    })                
                }
                else {
                    return policyManagerData;
                }
            }
        }
    }).
    state('Policy.Matrix', {
        'url': '/Matrix',
        'templateUrl': 'modules/PolicyManager/views/policy.matrix.html',
        'controller': 'PolicyMatrixCtrl as policymatrix',
        'resolve': {
            createPolicyManager: function (PolicyFactory, PolicyShareDataService) {
                var policyManagerData = PolicyShareDataService.getPolicyManagerData();
                if(Object.keys(policyManagerData).length === 0) {
                    return PolicyFactory.getPolicyManagerData().then(function (result) {
                        return result;
                    })
                }
            }
        }
    }).
    state('Policy.Test', {
        'url': '/Test',
        'templateUrl': 'modules/PolicyManager/views/policy.test.html',
        'controller': 'PolicyTestCtrl as policytest',
        'resolve': {
            createPolicyManager: function (PolicyFactory, PolicyShareDataService) {
                var policyManagerData = PolicyShareDataService.getPolicyManagerData();
                if(Object.keys(policyManagerData).length === 0) {
                    return PolicyFactory.getPolicyManagerData().then(function (result) {
                        return result;
                    })
                }
            }
        }
    }).
    state('ViewPolicy', {
        'url': '/View?type',
        'templateUrl': 'modules/PolicyManager/views/policy.view.html',
        'controller': 'PolicyViewCtrl as policyview',
        'params': {
            'view': null
        },        
        'resolve': {
            policyMatrixData: function (PolicyFactory, PolicyShareDataService, $stateParams) {
              var policyManagerData = PolicyShareDataService.getPolicyManagerData();

              if(!policyManagerData.hasOwnProperty('policies')) {
                return PolicyFactory.getPolicyManagerData().then(function (result) {
                    var data = result;
                    result = data.policies.filter(function(item){
                        return item.policyType== $stateParams.type;
                    })[0];
                    return result;
                })
              }
              else {
                      policyManagerData = policyManagerData.policies.filter(function(item){
                        return item.policyType== $stateParams.type;
                      })[0];
                    return policyManagerData;
              }
            }
        }
    })
}])