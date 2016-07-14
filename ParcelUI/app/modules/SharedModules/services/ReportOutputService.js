angular.module("ParcelUI").service("ReportOutputService", ['APIFactory', 'LoggingUrlCollection', 'ReportOutputUrlCollection', 'BASEURL','$http','$window', '$sce', function (APIFactory, LoggingUrlCollection, ReportOutputUrlCollection, BASEURL,$http, $window, $sce ) {
    
    var self = this;
    
    self.apiType = {
        type: 'real', //'real',

        createReportGenerationReq: {
            mock: ReportOutputUrlCollection.POSTAPI_REPORT_GENERATION_REQUEST_MOCK,
            real: ReportOutputUrlCollection.POSTAPI_REPORT_GENERATION_REQUEST_REAL
        }
    };
    
    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    };
    
     self.createReportGenerationRequest = function(reportguid, data){
        var url = BASEURL.REPORTS + self.apiType.createReportGenerationReq[self.apiType.type];
        //var url = 'http://wwwdev.parcelplatform.com/parcelservice/reports/{reportguid}/generations';
        var params = {
            reportguid: reportguid
        };         
        return APIFactory.post(url, data, params).then(function(response) {
                return response;
        })
    }
    
    self.getConstructedDocument = function(constructeddocumentguid){
        var url = BASEURL.PARCEL_API + ReportOutputUrlCollection.GET_CONSTRUCTED_DOC_REAL;
        var params = {
                    constructeddocumentguid: constructeddocumentguid                    
                };
        var uri = formatUrl(url, params);
        return $http.get(uri, {
            'data': null,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0,                    
                }
            }).then(function (response) {
                return response.data;
            }, function (error) {

                return error;
            });
/*        
        return APIFactory.get(url, params).then(function(response) {
            return response;
            })*/
    }
    
    self.getGeneratedDocument = function(fileGuid){
        //var url = 'http://wwwdev.parcelplatform.com/corefilemanagementservice/files/{fileGuid}/stream';
        var url = BASEURL.GET_COREFILE + ReportOutputUrlCollection.GET_DOCUMENT_REAL;
        var params = {
            fileGuid: fileGuid
        };
        
        var uri = formatUrl(url, params);
        //window.location =  uri; //
        $window.open(uri, '_blank');            
        
        return $http.get(uri, {
            'data': null,            
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0,
                    'responseType': 'blob',
                }
            }).then(function (data) {
            
            //return data;
                                    
            var file = new Blob([data.data], {type: 'application/pdf'});
               var fileURL = URL.createObjectURL(file);
               window.open('app/modules/ReportAuthoring/views/viewPDF.html?id='+fileGuid); //$sce.trustAsResourceUrl(fileURL));
            
            
                ////System.Convert.ToBase64String(response);
                ////$window.open("data:application/pdf;base64, " + base64EncodedPDF);
                //$window.open(fileURL,'_blank');
            }, function (error) {

                return error;
            });
        
        
        /*return APIFactory.get(url, params).then(function(response) {
            return response;
            })*/
    }
    
    self.buidGeneratedDocUrl = function(fileGuid){
        var url = BASEURL.GET_COREFILE + ReportOutputUrlCollection.GET_DOCUMENT_REAL_VIEW;
        var params = {
            fileGuid: fileGuid
        };
        var uri = formatUrl(url, params);
        return uri;
    }
    
    self.downloadGeneratedDocument = function(fileGuid){
        var url = BASEURL.GET_COREFILE + ReportOutputUrlCollection.GET_DOCUMENT_REAL_DOWNLOAD;
        var params = {
            fileGuid: fileGuid
        };
        var uri = formatUrl(url, params);
        window.location =  uri;
    }

}])