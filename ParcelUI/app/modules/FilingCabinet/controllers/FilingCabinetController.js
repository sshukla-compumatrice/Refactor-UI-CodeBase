angular.module('FilingCabinet').controller('FilingCabinetCtrl', ['$scope','FileServiceAPI','$filter','$modal', function($scope,FileServiceAPI,$filter,$modal) {
    
    var self = this;            

    self.SelectedFolderName = "Select One";
    var FileDetails = [];
    
    self.editLinkSelected = {};
    
    
    self.Alllinks = {
        links: [{
            id: 1,
            title: "Ben",
            linkurl: 28,
            by:"abcd"
        }, {
            id: 2,
            title: "Sally",
            linkurl: 24,
            by:"abcdee"
        }, {
            id: 3,
            title: "John",
            linkurl: 32,
            by:"abcaasasas"
        }, {
            id: 4,
            title: "Jane",
            linkurl: 40,
            by:"abaasasasacd"
        }]               
    };
    
    self.GetLinks = function(){
        
        self.Alllinks = [];
        
         var promise = FileServiceAPI.getLinks();
    promise.then(function (FileResponse) {        
        for(var index =0; index<FileResponse.files.length; index++){
                self.Alllinks = index<FileResponse.files[index];
            }
        })
    }
	
	self.setFocus = function(){
		setTimeout(function() { $('.add-title').focus() });
	}
    
    self.UpdateLink = function() {
        
        var LinkId = FilingCabinetCtrl.editLinkSelected.id;     
        
        var data= {
            "Title" : FilingCabinetCtrl.editLinkSelected.title,
            "Link"  : FilingCabinetCtrl.editLinkSelected.linkurl
        };
        
        var promise = FileServiceAPI.UpdateLink(LinkId,data);
    promise.then(function (UpdateResponse) {               
                    
        })
    }
    
    self.CreateLink = function(){
        var Data =  {
            "Title" : FilingCabinetCtrl.editLinkSelected.title,
            "Link"  : FilingCabinetCtrl.editLinkSelected.linkurl
        };
        
        var promise = FileServiceAPI.CreateLink(data);
    promise.then(function (CreateResponse) {        
       
        })
    }
    
    self.openLinkDelete = function(){
         var modalInstance = $modal.open({
                    templateUrl: "DeleteLink.html",
                    scope: $scope,
                    controller: deleteLinkController,
                    size: 0
            })
    }
    
   var deleteLinkController = function($scope, $modalInstance){
       var Id = "124";
       self.deleteLink = function(){
           var promise = FileServiceAPI.DeleteLink(Id);
    promise.then(function (DeleteResponse) {        
       
        })
       }
        self.CancelDeleteLink = function () {

                $modalInstance.close();
            }
   }

self.getLinksTemplate = function(links){
         if (links.id === self.editLinkSelected.id) {
             return 'editrelatedlinks';
         }
        else { 
            return 'displayrelatedlinks'; 
        }                                                      
}   
                                                                 
self.editRelatedLink = function (LinkObj) {
		setTimeout(function() { $('.edit-title').focus() });
        self.editLinkSelected = angular.copy(LinkObj);
    } 

    

self.uploadFile = function(){
    
    var file = self.fileForAllFolders;

    var FolderName = self.SelectedFolderName;
    
    if(FolderName == "Select One"){
         self.showMessage("First select a folder. Then select file by clicking on the Attach button and click Upload","danger");                
         return;
    }
            if (!file || file == null) {
                self.showMessage("Please attach files before trying to upload","danger");                
                return;

            } else {
                var UploadFolderName = FolderName.replace(/[^A-Z0-9]+/ig, "_");
                var promise = FileServiceAPI.uploadFile(file,UploadFolderName);
                promise.then(function (UploadResponse) {                    
                    self.showMessage("The file was successfully uploaded.","success");   
                    GetFolders();
                    /*var FileGUID = UploadResponse.data.file.fileGUID;                    
            if (FileGUID != "" && FileGUID != undefined && FileGUID != null) {
                        var promise = FileServiceAPI.getfiledetails(FileGUID);
                        promise.then(function (DownloadResponse) {
                            var element = {};
                            element.currentVersionURL = DownloadResponse.files[0].currentVersionURL;
                            element.fileName = DownloadResponse.files[0].fileName;
                            FileDetails.push(element);
                            element = {};
                        })
                        self.FileDetails = FileDetails;
                    }*/
                    
                });

            }
}

self.showMessage = function(MessageText, MessageType){
    
    self.UploadStatusClass = "alert alert-" + MessageType;
    self.UploadStatusText = MessageText;
    
}

GetFolders();
        
function GetFolders(){
    
    var folderList = [];    
   
    //Call SharedAPI to get All and get Root Folder GUI and pass that guid to get all subfolders
    
    var folderGUIDS = ['5365360E-1AAD-42F6-926C-768431FFBC67','D85ADCEE-77CB-4A5C-B555-82C4DCC6A0D3','3AF93081-BB9D-4A93-83DC-863B5F04BD78'];
    
    var promise = FileServiceAPI.getfolderdetails(folderGUIDS);
    promise.then(function (FolderResponse) {  
                    for(var index=0 ; index <FolderResponse.folders.length; index++){
                        var element = {};
                    element.folderGUID = $filter('lowercase')(FolderResponse.folders[index].folderGUID);
                        console.log(element.folderGUID);
                        element.folderName = FolderResponse.folders[index].folderName;
                        folderList.push(element);
                        element = {};
                    }                    
            if(folderList.length >=1 ){        
            self.folderList = folderList;  
            
            var FileList = [];                
            for(var index=0 ; index <folderList.length; index++){ 
                FileList.push(getFiles(folderList[index].folderGUID));
                console.log(FileList);
                self.FileList = FileList;                
            }                
            
        }
    })
    
    
}
    
function getFiles(folderGUID){
    
    var FileListTemp = [];
    
    var promise = FileServiceAPI.getfilesByFolder(folderGUID);
    promise.then(function (FileResponse) {        
        for(var index =0; index<FileResponse.files.length; index++){                        
                var element = {};
                element.fileName = FileResponse.files[index].fileName;
                element.currentVersionURL = FileResponse.files[index].currentVersionURL;
                element.fileGUID = FileResponse.files[index].fileGUID;
                element.folderGUID = $filter('lowercase')(FileResponse.files[index].folders.folderGUID);
                console.log(element.folderGUID);
                FileListTemp.push(element);
                element = {};            
        }       
    })      
     return FileListTemp;
    
    
}                                                                
                                                                 
    
}]);