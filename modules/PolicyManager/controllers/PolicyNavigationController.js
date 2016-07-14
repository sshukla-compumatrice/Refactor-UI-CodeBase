angular.module('PolicyManagerModule').controller('PolicyNavCtrl', ['$scope', '$state', '$location', '$rootScope','$timeout','PolicyShareDataService', function ($scope, $state, $location, $rootScope, $timeout, PolicyShareDataService) {


    
    
    var viewName = $location.path().substring($location.path().lastIndexOf('/') + 1, $location.path().length);
    if (viewName == "Information") {
        this.viewHeader = "Step 1 : Policy Information";
        this.nextButtonText = "Add Values";
        this.firstLink = true;
    } else if (viewName == "Values") {
        this.viewHeader = "Step 2 : Policy Parameter Values";
        this.nextButtonText = "View Policy Preview";
        this.previousButtonText = "Policy Information";
        this.firstLink = false;
    } else if (viewName == "Matrix") {
        this.viewHeader = "Step 3 : Policy Matrix";
        this.nextButtonText = "Test Policy";
        this.previousButtonText = "Add Values";
        this.firstLink = false;
    } else if (viewName == "Test") {
        this.viewHeader = "Step 4 : Test Policy";
        this.nextButtonText = "Activate Policy";
        this.previousButtonText = "Policy Matrix";
        this.firstLink = false;
    }


    this.nextButton = function (event) {

        var viewName = $location.path().substring($location.path().lastIndexOf('/') + 1, $location.path().length);
       
        switch (viewName) {
            case 'Information':
                
                $scope.$broadcast("check-policyinfoname-validaion");
                
                    this.nextButtonText = "View Policy Preview";
                    this.previousButtonText = "Policy Information";
                    this.firstLink = false;
                    this.viewHeader = "Step 2 : Policy Parameter Values";
                    $state.go('Policy.Values');                                   
                break;
            case 'Values':
                this.nextButtonText = "Test Policy";
                this.previousButtonText = "Add Values";
                this.firstLink = false;
                this.viewHeader = "Step 3 : Policy Matrix";
                
                $state.go('Policy.Matrix');
                break;
            case 'Matrix':
                this.nextButtonText = "Activate Policy";
                this.previousButtonText = "Policy Matrix";
                this.firstLink = false;
                this.viewHeader = "Step 4 : Test Policy";
                $state.go('Policy.Test');
                break;
            case 'Test':
                $state.go('ViewPolicy', {
                    type: 'Environmental'
                });
                break;
            default:

        }
        $scope.$broadcast("change-active-class","next");

    };
    
    this.getValues = function(){
        var valuesJson = {};
        var fields = PolicyShareDataService.getPolicyFields();
        
    };


    this.prevButton = function () {
        var viewName = $location.path().substring($location.path().lastIndexOf('/') + 1, $location.path().length);
        
        switch (viewName) {
           
            case 'Values':
                this.nextButtonText = "Add Values";
                this.viewHeader = "Step 1 : Policy Information";
                this.firstLink = true;
                $state.go('Policy.Information');

                break;
            case 'Matrix':
                this.nextButtonText = "View Policy Preview";
                this.previousButtonText = "Policy Information";
                this.firstLink = false;
                this.viewHeader = "Step 2 : Policy Parameter Values";
                $state.go('Policy.Values');
                break;
            case 'Test':
                this.nextButtonText = "Test Policy";
                this.previousButtonText = "Add Values";
                this.firstLink = false;
                this.viewHeader = "Step 3 : Policy Matrix";
                $state.go('Policy.Matrix');
                
                break;
            default:

        }
        $scope.$broadcast("change-active-class","prev");

    }
    
    
    this.cancelPolicyCreation = function() {
        angular.element('#createPolicyCancel').modal({
                "backdrop": "true"
        });
    }
    
    this.acceptCancelPolicyCreation = function() {
        PolicyShareDataService.resetCreatePolicyData();
        $timeout(function(){
            $state.go('ViewPolicy');
        }, 300);
    }
    
}]);