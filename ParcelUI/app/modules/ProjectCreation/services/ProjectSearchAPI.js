var projectCreationModule = angular.module('ProjectCreation');
projectCreationModule.service('ProjectSearchAPI', ['APIFactory', 'UrlColl', 'BASEURL', function (APIFactory, UrlColl, BASEURL) {


    this.getProjects = function (paramObjSearch) {
        var url = BASEURL.parcelPOC + UrlColl.GET_PROJECTSEARCH;

        var params = {
            field1: paramObjSearch.field1,
            type1: paramObjSearch.type1,
            text1: paramObjSearch.text1,
            field2: paramObjSearch.field2,
            type2: paramObjSearch.type2,
            text2: paramObjSearch.text2,
            reportTypes: paramObjSearch.reportTypes
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.projects;
        });
    }

    this.getReportTypes = function () {
        var url = BASEURL.parcelPOC + UrlColl.GET_REPORTTYPES;
        return APIFactory.get(url, null).then(function (response) {
            return response.reportTypes;
        });
    }

    this.getProjectSearchFields = function () {
        var url = BASEURL.parcelPOC + UrlColl.GET_PROJECTSEARCHFIELDS;
        return APIFactory.get(url, null).then(function (response) {
            return response.fields;
        });
    }

    this.getFolders = function (projectGuid) {
        var url = BASEURL.GET_FOLDERS + UrlColl.GET_FOLDERS;
        var params = {
            projectGuid: projectGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.projectFolder.subFolderTreeWithFiles;
        });
    }
    this.getFolderFiles = function (folderGuid) {
        var url = BASEURL.GET_FOLDER_FILES + UrlColl.GET_FOLDER_FILES;
        var params = {
            folder: folderGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.files;
        });
    }
       this.uploadFiles = function (file,fileRequestJson) {
        var url = BASEURL.PROJECTCREATION_PROJECTDOCUMENTS_UPLOAD + UrlColl.UPLOAD_FILES;
        
        var request = {
                "fileRequest": fileRequestJson
            };
          var queryParams = {
           
                fileRequest: JSON.stringify(fileRequestJson)
            }
        return APIFactory.uploadFile(url,request,queryParams,file).then(function (result) {
            return result.data.file;
        });
    };    
      this.deleteFiles = function (fileguid) {
        var url = BASEURL.PROJECTCREATION_PROJECTDOCUMENTS_DELETE + UrlColl.DELETE_FILES;
         var params = {
            fileguid: fileguid
        };
        return APIFactory.delete(url,null ,params).then(function (result) {
            return result;
        });
    };    
    

}]);