angular.module('AccountMgmtModule').service('FileMgmtAPI', ['AccessMgmtFactory', 'AccountManagementUrlCollection', 'BASEURL', 'Upload', '$log', function (AccessMgmtFactory, AccountManagementUrlCollection, BASEURL, Upload, $log) {

    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    }

    this.uploadFile = function (file, deletionType, folderGuid, availabilityTier, basePath, fileguid) {
        var uploadUrl = fileguid ? BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.PUTAPI_COREFILE : BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.POSTAPI_COREFILE;

        var fileguid = fileguid ? fileguid : '';
        var inputFile = file;

        var file = {
            "fileName": inputFile.name,
            "fileDescription": inputFile.name,
            "fileSize": inputFile.size,
            "displayIndex": 0,
            "retentionInDays": 365,
            "deletionType": deletionType ? deletionType : "",
            "folderGUID": folderGuid ? folderGuid : "",
            "availabilityTier": availabilityTier ? availabilityTier : "",
            "physicalPathPreDate": basePath ? basePath : "",
            "physicalPathAddDate": false,
            "physicalPathPostDate": "",
            "createNewVersion": fileguid ? true : false
        };

        var fileRequestJson = {
            "file": file
        };
        var request = {
            "fileRequestJson": fileRequestJson
        }
        var queryParams = {
            fileguid: fileguid,
            fileRequestJson: JSON.stringify(fileRequestJson)
        }
        var url = formatUrl(uploadUrl, queryParams);
        return Upload.upload({
            url: url,
            file: inputFile,
            method: 'POST',
            data: request,
            header: {
                'Content-Type': 'multipart/formdata',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            }
        });
    }

    this.getfiledetails = function (fileGUID) {
        var getFileInfourl = BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.GETAPI_COREFILE_INFORMATION;
        var params = {
            fileguid: fileGUID
        };

        return AccessMgmtFactory.get(getFileInfourl, params).then(function (response) {
            return response;
        });
    }

    this.getFileStream = function (fileGuid) {
        if (fileGuid) {
            return BASEURL.COREFILE_MGMT + "/" + fileGuid + "/stream";
        }
        return "";
    }

    this.deleteFile = function (fileGUID) {
        var url = BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.DELETEAPI_COREFILE;
        var params = {
            fileguid: fileGUID
        };
        return AccessMgmtFactory.delete(url, null, params);
    }

    this.getSharedFolder = function (folderguid, foldertype, companyguid, officeguid, userguid, parentfolderguid, fileguid, categories, detail, limit, offset) {
        var getSharedFolderUrl = BASEURL.SHAREDFILEMGMT_SERVICE + AccountManagementUrlCollection.GETAPI_SHAREDFILE_GETFOLDER;
        var params = {
            folderguid: folderguid ? folderguid : "",
            foldertype: foldertype ? foldertype : "",
            companyguid: companyguid ? companyguid : "",
            officeguid: officeguid ? officeguid : "",
            userguid: userguid ? userguid : "",
            parentfolderguid: parentfolderguid ? parentfolderguid : "",
            fileguid: fileguid ? fileguid : "",
            categories: categories ? categories : "",
            detail: detail ? detail : "",
            limit: limit ? limit : "",
            offset: offset ? offset : ""
        };

        return AccessMgmtFactory.get(getSharedFolderUrl, params).then(function (response) {
            return response;
        });
    }
}]);