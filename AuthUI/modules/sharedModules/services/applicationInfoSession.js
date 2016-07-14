AccessManagement.service('applicationInfoSession',['GUID','$location','$window',function(GUID,$location){

      this.create = function () {

        //var pathArray = url.split('/');
        this.applicationInfoSession = {


                'applicationType' : '',
                'name' : '',
                'version' : '',
                'language': '',
                'languageVersion' : ''

        };

        /*sessionStorage.setItem("applicationObject", angular.toJson(this.applicationInfoSession));*/
        //localStorage.setItem('applicationObject',angular.toJson(this.applicationInfoSession));

      };

      this.getapplicationInfo = function(){

          return this.applicationInfoSession || {};
      }

      this.getFromSessionStorage = function(){
          return angular.fromJson($window.sessionStorage.getItem("applicationObject")) || {};
      }

      this.getFromLocalStorage = function(){
          return angular.fromJson(localStorage.getItem("applicationObject")) || {};
      }

      this.destroy = function () {

          this.applicationInfoSession = null;

      };

}]);
