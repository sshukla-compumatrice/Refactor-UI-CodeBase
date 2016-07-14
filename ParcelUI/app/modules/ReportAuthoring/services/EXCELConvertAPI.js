angular.module('ReportAuthoring').service('EXCELConvertAPI', ['APIFactory', 'ReportOutputUrlCollection','BASEURL', function(APIFactory, ReportOutputUrlCollection,BASEURL) {

    this.getEXCEL = function(params,type) {
        var url = '';
switch(type){         
    case 'CostTable':   
           url = BASEURL.REPORTOUPUT_EXCELCONVERT + ReportOutputUrlCollection.GETAPI_COSTTABLEEXCEL;
            return APIFactory.get(url, params).then(function(response) {
                return response.data;
            })
            
            break;
        
    case 'DetailReport':
            
               break;                                
           
       } 
    }

   
}]);