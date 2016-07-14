angular.module('ProjectDashboard').controller('AppendixList', ['$scope','$stateParams','$window','$modal','reportGridDataOperations','checkStatus','$sce',  function($scope,$stateParams,$window,$modal,reportGridDataOperations,checkStatus,$sce) {
   
    
     var self = this;
    
    init();
    function init(){
        self.reportGuid = $stateParams.reportGuid;
        self.sectionGuid = $stateParams.sectionGuid;
        self.filesArray = [];
        self.showAlert = false;
        self.displayDoc = false;
        
        getAppendixFiles();
    }
     
    function getAppendixFiles (){
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
        reportGridDataOperations.getAppendixFiles(self.reportGuid,self.sectionGuid).
        then(function (response) {
               if(response.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'GET') ){
                   self.showAlert = true;
                   self.serviceMessage = response.data.message.userMessage;
               }
            else{
                self.showAlert = false;
                angular.forEach(response.files,function(file,index){
                   // file.downloadURl = "http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf";
                    self.filesArray.push(file);
                })
                angular.forEach(response.photos,function(photo,index){
                    photo.downloadURL = "https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwifrKbsrdHKAhXCGz4KHeHdCFEQjRwIBw&url=http%3A%2F%2Fwww.gettyimages.com%2Fdetail%2Fnews-photo%2Fanthony-buonicore-ceo-of-environmental-data-resources-inc-news-photo%2F3179240&psig=AFQjCNE54TlrtqsIqSsBr6oijWwXYQw2TA&ust=1454237189612434";
                    self.filesArray.push(photo);
                })
                
            }

            });
    }
    
    this.dismissAlert = function(){
        self.showAlert = false;
        self.serviceMessage = "";
    }
    
    this.openDoc = function(appendixObject){
        if(appendixObject.downloadURL == undefined) self.docUrl = appendixObject.downloadURl;
        else self.docUrl = appendixObject.downloadURL;
        self.displayDoc = true;
        
    }
    
    
    
			  
               
		
    
 
}]);