angular.module('AccountMgmtModule').directive('appHeader', function() {
   return {
       restrict: 'A',
       link: function(scope, element, attrs) {
           // some ode
       },
       templateUrl: function(elem, attrs) {
           return (attrs.appHeader == "PARCEL") ? "modules/accManagement/views/headers/parcelAppHeader.html" : "modules/accManagement/views/headers/c360AppHeader.html";
       },
       controller : ['$scope', 'BASEURL', function($scope, BASEURL) {
           //$scope.loggedInUserCguid = BASEURL.COMPANY_GUID;
       }]
   }
});