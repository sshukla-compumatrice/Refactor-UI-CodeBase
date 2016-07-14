angular.module('LenderPortfolioCreation').controller('LenderPortfolioSelectEnvironmentalConsultantCtrl', ['$scope', function($scope) {

    var self = this;
    var main = $scope.lenderPortfolio;
    
    self.bidCompanyIDs = main.project ? main.project.bidCompanyIDs : null;
        
    main.getSubmitData = function() {

        var arr = self.bidCompanyIDs;
        var idArr = [];
        if (arr && arr.length) {
            for (var i = 0; i < arr.length; i++) {
                var local = arr[i];
                
                var idVal = isNumber(local) ? local : local.companyID;
                idArr.push(idVal);
            }
        }
        return {
            bidCompanyIDs: idArr
        };
    }
    main.clearErrorDisplay = function() {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function(errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }
    
    
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
}]);