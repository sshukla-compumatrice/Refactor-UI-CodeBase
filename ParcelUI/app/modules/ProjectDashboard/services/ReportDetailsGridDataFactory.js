angular.module('ProjectDashboard').factory('reportGridDataOperations', ['$http', '$log','getProjectDashboardUrls','BASEURL', function ($http, $log,getProjectDashboardUrls,BASEURL) {

    var factory = {};
   


    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    };
    var getSiteDetailsUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetSiteDetails;
    var updateSiteDetailsUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationUpdatesiteDetails;
    var updateReportStatusUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationUpdateReportStatus;
    var getReportSignatureUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplemetationGetSignatureDetails;
    var getDeleteReportsUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplemetationDeleteReports;
    var updateTaskDetailsUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationUpdateTasks;
    var signatureUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationSignatures;
    var createSignatureUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationAddSignatures;
    var updateSignatureUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationUpdateSignatures;
    var deleteSignatureUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationDeleteSignatures;
    var getAppendicesContent = BASEURL.appendicesPOC + getProjectDashboardUrls.realImplementationGetAppendices;
    var getTOCData = BASEURL.reportWritingPOC + getProjectDashboardUrls.realImplementationGetTOC;
    var sendEmailUrl = BASEURL.messagingServicePOC + 
        getProjectDashboardUrls.realImplementationSendMail;
    
    factory.sendEmail = function(obj){
        
            return $http.post(sendEmailUrl,obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });
    }
    factory.getTOC = function (reportGuid,depth){
            var params = {
                reportGuid: '67ACF400-BB4E-11E5-B5C1-0E29ED3D2A45',
                depth : depth
            }
            var uri = formatUrl(getTOCData, params);
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });
        }

    factory.getAppendixFiles = function(reportGuid,sectionGuid){
        try {
            var params = {
                reportGuid : reportGuid,
                sectionGuid : sectionGuid           
            }
            var uri = formatUrl(getAppendicesContent, params); 
            return $http.get(uri, {
                headers: {
                    'Content-Type': undefined,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }

    factory.getSiteInformation = function(reportGuid) {
        try {
            var params = {
                reportGuid : reportGuid
            }
            var uri = formatUrl(getSiteDetailsUrl, params);
            return $http.get(uri, {
                headers: {
                    'Content-Type': undefined,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }
    
    factory.updateSiteInformation = function(reportGuid,obj) {
        try {
            var params = {
                reportGuid : reportGuid
            }
            var uri = formatUrl(updateSiteDetailsUrl, params);
            return $http.put(uri,obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }
    
    factory.updateReportStatus = function(obj) {
        try {
            
            return $http.put(updateReportStatusUrl,obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }
    
  
    factory.getReportSignatureDetail = function(reportGuid,reportSignOffGuid) {
        try {
           
            var params = {
                reportGUID : reportGuid,
                reportsignoffguid : reportSignOffGuid
            }
            var uri = formatUrl(getReportSignatureUrl, params); 
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }
    
    
    
    factory.deleteReports = function(reportGuid) {
        try {         
            var params = {
                reportGUID : reportGuid                
            }
            var uri = formatUrl(getDeleteReportsUrl, params); 
            return $http.delete(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {                
                if(response)
                return response.data;
                else return null;
            }, function (error) {               
                return error;
            });
        } catch (e) {
            
        }
    }
    
    factory.updateTaskStatus = function(obj,projectGuid) {
        try {
            var params = {
                projectGuid : projectGuid
                
            }
            var uri = formatUrl(updateTaskDetailsUrl, params); 
            return $http.put(uri,obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }
    
    factory.createSignature = function (signatureObject){
        try {
            
            
            return $http.post(signatureUrl,signatureObject, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
        
    }
    
    factory.updateSignature = function (obj){
        try {
            
            return $http.put(updateSignatureUrl,obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }
    
    factory.deleteSignature = function (reportGuid,signatureGuid){
        try {
            var params = {
                reportGuid : reportGuid,
                reportsignoffguid : signatureGuid                
            }
            var uri = formatUrl(deleteSignatureUrl, params); 
            return $http.delete(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
               
                
                if(response)
                return response.data;
                else return null;
            }, function (error) {
               
                return error;
            });
        } catch (e) {
            
        }
    }
    
    
    return factory;
}]);