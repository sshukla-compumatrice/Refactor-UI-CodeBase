angular.module('ReportAuthoring').service('VariableReplacerAPI', ['APIFactory', 'ReportAuthoringUrlCollection','BASEURL', function(APIFactory, ReportAuthoringUrlCollection,BASEURL) {
    
  
    this.getVariableReplacerKeywords = function(reportID) {
        
		var url = BASEURL.BASE_PARCEL_SERVICE +  ReportAuthoringUrlCollection.GET_VARIABLEREPLACER_KEYWORDS;
        var params = {
            reportGuid: reportID
        };

        return APIFactory.get(url, params).then(function(response) {			
            return response.generalInformation;
        });
    }
   
	
    this.updateKeywordsValue = function(reportID, variables) {
        var url = BASEURL.REPORTAUTHORING +  ReportAuthoringUrlCollection.PUT_VARIABLEREPLACER_KEYWORDS;
        var queryParams = {
            reportGuid: reportID
        }
        var putData = {
            variables: variables
        }
        return APIFactory.put(url, putData, queryParams).then(function(resp) {
            return resp;
        });
    };

}]);