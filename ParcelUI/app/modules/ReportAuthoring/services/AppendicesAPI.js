angular.module('ReportAuthoring').service('AppendixAPI', ['APIFactory', 'AppendicesUrlCollection','BASEURL','$http', function(APIFactory, AppendicesUrlCollection,BASEURL, $http) {

    // 1. Appendix Sections
    // 1.1 Get all report appendices
    this.getAllAppendices = function(reportID) {        
		var url = BASEURL.REPORTAUTHORING + AppendicesUrlCollection.GETAPI_ALLAPPENDICES;
        var params = {
            reportID: reportID
        };
		var sectionsObject = {};
        return APIFactory.get(url, params).then(function(response) {            
			
			angular.forEach(response.tableOfContent.sections, function (section, index) {
				if(section.isAppendix != undefined && section.isAppendix)
				 sectionsObject = section.sections;
			});
			
			return sectionsObject;
        })
    }

    // 2. Appendix Section

    // 3. Appendix Files
    this.getAppendixFiles = function(reportID, sectionGUID) {
        
		var url = BASEURL.appendicesPOC +  AppendicesUrlCollection.GETAPI_APPENDIXFILES;
        var params = {
            reportID: reportID,
            sectionGUID: sectionGUID
        };

        return APIFactory.get(url, params).then(function(response) {			
            return response.files;
        });
    }
    this.reorderAppendixFiles = function(reportID, sectionGUID, files) {
        
		var url = BASEURL.appendicesPOC +  AppendicesUrlCollection.PUTAPI_APPENDIXFILES;
        var params = {
            reportID: reportID,
            sectionGuid: sectionGUID
        };

        var putData = {
            files: files
        };

        return APIFactory.put(url, putData, params).then(function(response) {
            return response;
        });
    };

    // 4. Appendix File
    // 4.1 put file
    this.putAppendixFile = function(reportGuid, sectionGUID, fileGuid, file) {
        var url = BASEURL.appendicesPOC +  AppendicesUrlCollection.PUTAPI_APPENDIXFILE;		
        var params = {
            reportGuid: reportGuid,
            sectionGUID: sectionGUID,
            fileGuid: fileGuid
        };

        var putData = {
            file: file
        };

        return APIFactory.put(url, putData, params).then(function(response) {
            return response.file;
        });
    };
    // 4.2
    this.deleteAppendixFile = function(reportGuid, sectionGuid, fileGuid) {
        
		var url = BASEURL.appendicesPOC +  AppendicesUrlCollection.DELETEAPI_APPENDIXFILE;
		
        var params = {
            reportGuid: reportGuid,
            sectionGuid: sectionGuid,
            fileGuid: fileGuid
        };

        return APIFactory.delete(url, null, params);
    };


    // 5. Appendix Photos
   /* this.getAppendixPhotos = function(reportID) {
        var url = AppendicesUrlCollection.GETAPI_APPENDIXPHOTOS;
        var params = {
            reportID: reportID
        };

        return APIFactory.get(url, params).then(function(response) {
            return response.photos;
        })
    }
	*/
	
	this.getAppendixPhotos = function(reportID, sectionGUID) {
        
		var url = BASEURL.appendicesPOC + AppendicesUrlCollection.GETAPI_APPENDIXPHOTOS;
        var params = {
            reportID: reportID,
			sectionGUID: sectionGUID
        };

        return APIFactory.get(url, params).then(function(response) {			
			return response.photos;
        })
    }

    this.putAppendixPhotos = function(reportID, photos, sectionGuid) {
       // var url = BASEURL.REPORTAUTHORING_PHOTOS + AppendicesUrlCollection.PUTAPI_APPENDIXPHOTOS;
		 var url = BASEURL.appendicesPOC + AppendicesUrlCollection.PUTAPI_APPENDIXPHOTOS;
        var params = {
            reportID: reportID,
			sectionGuid:sectionGuid
        };

        var putData = {
            photos: photos
        };

        return APIFactory.put(url, putData, params).then(function(response) {
            // no response mentioned in the API
            return response;
        });
    };

    // 6. Appendix Photo
    this.putAppendixPhoto = function(reportID, fileGuid, photo, sectionGuid) {
        var url = BASEURL.appendicesPOC + AppendicesUrlCollection.PUTAPI_APPENDIXPHOTO;
        var params = {
            reportID: reportID,
            fileGuid: fileGuid,
			sectionGuid: sectionGuid
        };

        var putData = {
            photo: photo
        };

        return APIFactory.put(url, putData, params).then(function(response) {
            return response.photo;
        });
    }

    this.deleteAppendixPhoto = function(reportGuid, fileGuid) {
        //var url = BASEURL.REPORTAUTHORING_PHOTOS + AppendicesUrlCollection.DELETEAPI_APPENDIXPHOTO;
		var url = BASEURL.appendicesPOC + AppendicesUrlCollection.DELETEAPI_APPENDIXPHOTO;
        var params = {
            reportGuid: reportGuid,
            fileGuid: fileGuid
        };

        return APIFactory.delete(url, null, params);
    }

    // 7. Appendix Upload

    // 8. Photo Upload
	
	// 8. Get EDR Drawing Tool orders
	
	  this.getAvailableDrawingToolOrders = function(reportGuid) {        
		var url = BASEURL.APPENDICES_EDRDRAWINGTOOL + AppendicesUrlCollection.GETAPI_APPENDIXDRAWINGTOOLORDERS;
        var params = {
            reportGuid: reportGuid
        };
		var sectionsObject = {};
        return APIFactory.get(url, params).then(function(response) {            
				
			return response.orders;
			
        })
    }
	  
	    this.getDrawingToolUrl = function(reportGuid, edrPropertyGuid) {        
		var url = BASEURL.APPENDICES_EDRDRAWINGTOOL + AppendicesUrlCollection.GETAPI_APPENDIXDRAWINGTOOLURL;
        var params = {
            reportGuid: reportGuid,
			edrPropertyGuid: edrPropertyGuid
        };
		var sectionsObject = {};
        return APIFactory.get(url, params).then(function(response) {            
				
			return response;
			
        })
    }
		
	 this.deleteAppendixPhotos = function(reportID, photos, sectionGuid) {
       
		var url = BASEURL.appendicesPOC + AppendicesUrlCollection.DELETEAPI_APPENDIXPHOTOS;
        var params = {
            reportID: reportID,
			sectionGuid:sectionGuid
        };
		 
		
       return APIFactory.delete(url, photos, params).then(function(response) {
            // no response mentioned in the API
            return response;
        });
    }
	
	
   
	

}]);