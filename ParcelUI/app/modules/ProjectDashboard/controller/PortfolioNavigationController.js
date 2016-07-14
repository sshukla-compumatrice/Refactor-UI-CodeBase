angular.module('ProjectDashboard').controller('PortfolioNavigation', ['$state', '$stateParams', '$scope', 'accountGuid','companyGuid','projectGuid','$location', 'localStorageObject', function ($state, $stateParams, $scope, accountGuid,companyGuid,projectGuid, $location, localStorageObject) {


    

    // $scope.portfolioRequestID = portfolioRequestID;

    var stateName = $state.current.name;

    var self = this;
    this.localStorage = localStorageObject;


    self.redirectToSelectPortfolio = function (event) {
        var elem = $(event.target);
        
        $state.go('Portfolio.Select', {
            projectGuid: projectGuid,
            accountGuid: accountGuid,
            companyGuid: companyGuid
        });
    }

    self.redirectToSelectReports = function (event) {
        var elem = $(event.target);
        if (!validateFirstStep()) {
            $scope.$broadcast('show-error-message',{obj : 'firstStep'});
            $state.go('Portfolio.Select', {
                projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
        } else {
            
            $state.go('Portfolio.SelectReports', {
                projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
        }

    }

    self.redirectToSelectReportsParts = function (event) {
        var elem = $(event.target);
        if (!validateFirstStep()) {
            return;
        } else {
            if (!validateSecondStep()) {
                $scope.$broadcast('show-error-message',{obj : 'secondStep'});
                $state.go('Portfolio.SelectReports', {
                    projectGuid: projectGuid,
                    accountGuid: accountGuid,
            companyGuid: companyGuid
                });
            } else {
                
                $state.go('Portfolio.SelectReportsParts', {
                    projectGuid: projectGuid,
                   accountGuid: accountGuid,
            companyGuid: companyGuid
                });
            }
        }


    }

    self.redirectToConfirm = function () {
        $state.go('Portfolio.Confirm', {
            projectGuid: projectGuid,
            accountGuid: accountGuid,
            companyGuid: companyGuid
        });
    }
    
    self.redirectToNextState = function(){
       var currentState = $state.current.name;
        if(currentState === 'Portfolio.Select'){
         var isFirstStepValid =   validateFirstStep();
            if(isFirstStepValid) {$state.go('Portfolio.SelectReports', {
                projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
                                 }
            else{
                $scope.$broadcast('show-error-message',{obj : 'firstStep'});
                $state.go('Portfolio.Select', {
                    projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
            }
        }
        else if (currentState === 'Portfolio.SelectReports'){
            var isSecondStepValid =   validateSecondStep();
            if(isSecondStepValid) {$state.go('Portfolio.SelectReportsParts', {
                projectGuid: projectGuid,
               accountGuid: accountGuid,
            companyGuid: companyGuid
            });
                                 }
            else{
                $scope.$broadcast('show-error-message',{obj : 'secondStep'});
                $state.go('Portfolio.SelectReports', {
                    projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
            }
        }
    }
    
    self.redirectToPreviousState = function (){
        var currentState = $state.current.name;
        if(currentState === 'Portfolio.SelectReports'){
         var isFirstStepValid =   validateFirstStep();
            if(isFirstStepValid) {
                $state.go('Portfolio.Select', {
                    projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
                                 }
            else{
                $scope.$broadcast('show-error-message',{obj : 'firstStep'});
                $state.go('Portfolio.SelectReports', {
                    projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
            }
        }
        else if (currentState === 'Portfolio.SelectReportsParts'){
            var isSecondStepValid =   validateSecondStep();
            if(isSecondStepValid) {$state.go('Portfolio.SelectReports', {
                projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
                                 }
            else{
                $scope.$broadcast('show-error-message',{obj : 'secondStep'});
                $state.go('Portfolio.SelectReportsParts', {
                    projectGuid: projectGuid,
                accountGuid: accountGuid,
            companyGuid: companyGuid
            });
            }
        }
    }
    
    function validateFirstStep(){
        if (JSON.stringify(JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[0].project) === '{}') return false;
        else return true;
    }
    
    function validateSecondStep(){
        if (JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[1].selectionIndex.length === 0) return false;
        else return true;
    }
    
    this.dismissAlert = function(){
        self.showError = false;
        self.errorMessage = "";
    }


}])