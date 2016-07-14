angular.module('FilingCabinet').service('FileServiceAPI',['APIFactory', 'FilingCabinetAPIUrlCollection','Upload','BASEURL', function(APIFactory, UrlColl,Upload,BASEURL) {
            
   
    var self = this;
   
     
     
     this.uploadFile = function(fileObject, FolderName){  
         var urlUpload = BASEURL.FILLINGCABINET_POC + UrlColl.UPLOADAPIPOC_FILE;
         
       /* var urlUpload = "http://PARReDataPOC2:8080/corefile/files/{fileguid}?fileRequestJson={fileRequestJson}";   "EDR_UPLOAD_DIR" */
         
        var method = 'POST';
        var fileguid = '';                                           
        
            var file = {
                
                        "file": {
            "fileName": fileObject.name,
            "fileDescription": fileObject.name + ' size:' + fileObject.size,
            "clientFileID": "123ABC",
            "retentionInDays": 365,
            "deletionType": "DISABLE",
            "currentVersionURL": "",
            "currentVersionUNC": "EDR_UPLOAD_DIR",
            "displayIndex": 1,
            "folderID": 1,
            "folderGUID": "",
            "organizationalBasePath": "EDR_UPLOAD_DIR//Filing_Cabinet",
            "organizationalParentFolderName": FolderName,
            "organizationalDatePath": true,
            "serverType": "AmazonWebServer",
            "metadata": {
              "category": "AppendixFile"
            }
          }
                            
        }              
            var request = {
                "fileRequestJson": file
            }
            var queryParams = {
                fileguid: fileguid,
                fileRequestJson: JSON.stringify(file)
            }
            
            var url = self.formatUrl(urlUpload, queryParams);
            return Upload.upload({
                url: url,
                file: fileObject,
                method: method,
                data: request,
                header: {
                    'Content-Type': 'multipart/formdata',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {                
                              
            }).error(function (data, status, headers, config) { 
               
            })               
     }
     
     this.getfiledetails = function(fileGUID){
         
       var url = BASEURL.FILLINGCABINET_POC + UrlColl.GETAPIPOC_FILE;     
       var params = {
           fileguid : fileGUID
       };
         
        return APIFactory.get(url, params).then(function(response){
                                 
            return response;
        });
                  
     }
     
     this.getfilesByFolder = function(folderGUID){
         
       var url =  BASEURL.FILLINGCABINET_POC + UrlColl.GETAPIPOC_FILESBYFOLDER;     
       var params = {
           folderGUID : folderGUID
       };
         
        return APIFactory.get(url, params).then(function(response){
                                 
            return response;
        });
                  
     }
     
     this.getfolderdetails = function(folderGUID){
         
          var url = UrlColl.GETAPIJSON_FOLDER;     
           var params = {
               folderguidsorids : folderGUID
           };
         
        return APIFactory.get(url, params).then(function(response){
                                 
            return response;
        });
     }
     
     this.deleteFile = function(fileGUID){
         
        var url = BASEURL.FILLINGCABINET_POC + UrlColl.UPLOADAPIPOC_FILE; 
        
         var params = {
           fileguid : fileGUID
       };
       return APIFactory.delete(url, null, params);
     }
     
     this.formatUrl = function(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    }
     
     this.getLinks = function(){
         
          var url = BASEURL.FILLINGCABINET_POC + UrlColl.GETAPIPOC_FILE;     
     
        return APIFactory.get(url, null).then(function(response){
                                 
            return response;
        });
     }
     
     this.UpdateLink = function(id,data){
         var url = BASEURL.FILLINGCABINET_POC + UrlColl.GETAPIPOC_FILE; 
        var queryParams = {
            linkID: id
        }
        var putData = {
            data: data
        }
        return APIFactory.put(url, putData, queryParams).then(function(response) {
            return response;
        });
     }
     
     this.CreateLink = function(data){
        var url = BASEURL.FILLINGCABINET_POC + UrlColl.GETAPIPOC_FILE;        
        var putData = {
            data: data
        }
        return APIFactory.post(url, putData).then(function(response) {
            return response;
        });
     }
}])