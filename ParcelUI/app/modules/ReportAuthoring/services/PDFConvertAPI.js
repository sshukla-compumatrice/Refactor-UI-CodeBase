angular.module('ReportAuthoring').service('PDFConvertAPI', ['APIFactory', 'ReportOutputUrlCollection','BASEURL', function(APIFactory, ReportOutputUrlCollection,BASEURL) {

    this.getPDF = function(params,type) {
        var url = '';
switch(type){         
    case 'ExecutiveSummary':   
            url = BASEURL.REPORTOUPUT_PDFCONVERT + ReportOutputUrlCollection.GETAPI_EXECUTIVESUMMARY;
            return APIFactory.get(url, params).then(function(response) {
                return response.data;
            })
               break;
    case 'DetailReport':
            url = BASEURL.REPORTOUPUT_PDFCONVERT + ReportOutputUrlCollection.GETAPI_DETAILREPORT;
            return APIFactory.get(url, params).then(function(response) {
                return response.data;
            })
               break;
               
    case 'DetailReportWithComments':
            url = BASEURL.REPORTOUPUT_PDFCONVERT + ReportOutputUrlCollection.GETAPI_DETAILREPORTCOMMENTS;
            return APIFactory.get(url, params).then(function(response) {
                return response.data;
            })
            break;
    case 'CostTable':
            url = BASEURL.REPORTOUPUT_PDFCONVERT + ReportOutputUrlCollection.GETAPI_COSTTABLE;
            return APIFactory.get(url, params).then(function(response) {
                return response.data;
            })
            break;
       } 
    }
    
    this.createReportGenerationRequest = function(reportguid, data){
        var url = 'http://wwwdev.parcelplatform.com/parcelservice/reports/{reportguid}/generations';
        var params = {
            reportguid: reportguid
        };
        return APIFactory.post(url, data, params).then(function(response) {
                return response;
        })
    }
    
    this.getConstructedDocument= function(params){
        var url = '';
        var params = {
                    reportguid: self.reportGuid                    
                };
        return APIFactory.get(url, params).then(function(response) {
            return response;
            })
    }

   
}]);