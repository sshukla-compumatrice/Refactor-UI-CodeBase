angular.module('ProjectDashboard').controller('ModalControllerForChangeReportStatus', function($scope,$modalInstance) {
   
    var self = this;
    
    self.reportStatusArray = [
        
        "The work order has been created",
        "This report is undergoing data entry",
        "The report is currently in senior review",
        "The report is draf",
        "The environmental analysis is incomplete",
        "This report is final"
        
    ]
    $scope.reportID =  $scope.reportID;
    $scope.reportIndex = $scope.index;
    $scope.reportStatus = $scope.reportStatus;
    
    $scope.index = angular.copy($scope.reportIndex);
    $scope.FINALIZE = "FINALIZE";
    
      $scope.reportStatus = $scope.reportStatusArray[$scope.reportIndex];
    
    /*minusButton();
    plusButton();*/
    checkMinus();
    checkPlus();
    
    function checkMinus()
    {
        if($scope.index <= 0)
            $scope.minusButtonHide = true; 
    }
    
    function checkPlus()
    {
        if($scope.index >= 5)
            $scope.plusButtonHide = true;
    }
    
      $scope.minusbutton = function()
      {
           
           minusButton();
      }
    
    function minusButton()
    {        
        if($scope.index > 1)
            {
                $scope.minusButtonHide = false;
                      $scope.plusButtonHide = false;
                  $scope.index = parseInt($scope.index)-1;
       
        $scope.reportStatus = $scope.reportStatusArray[$scope.index];
                
            }
        else if($scope.index == 1)
            {
                  $scope.minusButtonHide = true; 
                 $scope.index = parseInt($scope.index)-1;
      
        $scope.reportStatus = $scope.reportStatusArray[$scope.index];
            }
          
        else
            $scope.minusButtonHide = true;  
    }
    
     $scope.plusbutton = function()
     {
         plusButton();
     }
    
    function plusButton()
    {
        
         
        
            if($scope.index < 3)
                {
        $scope.plusButtonHide = false;
                     $scope.minusButtonHide = false;
        $scope.index = parseInt($scope.index)+1;
       
        $scope.reportStatus = $scope.reportStatusArray[$scope.index];
                
                }
        else if($scope.index == 3)
            {
                  $scope.index = parseInt($scope.index)+1;
       
        $scope.reportStatus = $scope.reportStatusArray[$scope.index];
              $scope.plusButtonHide = true;  
            }
            
        else
            $scope.plusButtonHide = true;
        
       
        
    }
    
    $scope.finalizeReport = function()
    {
        if($scope.FINALIZE == "FINALIZE")
            {
               $scope.reportStatus = $scope.reportStatusArray[5];
                $scope.FINALIZE = "UNFINALIZE";
                 $scope.plusButtonHide = true;
                $scope.minusButtonHide = true;
            }
       
        else
            {
                $scope.FINALIZE = "FINALIZE";
               // $scope.reportStatus = $scope.reportStatusArray[4];
                 $scope.reportStatus = $scope.reportStatusArray[3];
                   $scope.plusButtonHide = false;
                $scope.minusButtonHide = false;
                
            }
            
    }
    
    $scope.closeAndUpdate = function()
    {
        var final;
        //update request so changes hve been made can reflets on dashboard
        if($scope.FINALIZE == "FINALIZE")
            final = false;
        else
            final = true;
        
         $modalInstance.close();
    }
    
    $scope.close = function()
    {
        $modalInstance.close();
    }
});


