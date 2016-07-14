lenderPortalApp.factory('HeaderFactory', ['$http','HeaderAndFooterUrls', function ($http,HeaderAndFooterUrls) {

    var header = {};
    var searchTerm = "";

    header.getAllCabinets = function(){

        //var url =  HeaderAndFooterUrls.samplefile+"/sample1.js";
       var url =  HeaderAndFooterUrls.getOfficesCabinets;

       return $http.get(url,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){
           return result.data;

        });
    }
    
    header.getRecentLoans = function(userId,limit,offset){
        var url = HeaderAndFooterUrls.getRecentLoans;
        var str1 =  url.replace("{UserID}", userId);
        var str2 =  str1.replace("{limit}", limit);
        var str3 =  str2.replace("{offset}", offset);
        
        return $http.get(str3,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){
           return result.data;

        });
    }
    
    
    header.getSearchedLoans = function(data,companyId,limit,offset){
        var url = HeaderAndFooterUrls.getSearchedLoans;
        var str1 =  url.replace("{CompanyID}", companyId);
        var str2 =  str1.replace("{limit}", limit);
        var str3 =  str2.replace("{offset}", offset);
        var str4 = str3.replace("{data}",data);
       
        return $http.get(str4,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){
            
            
            return result.data;

        },function(error){
            if(error.data.message.errorCode == "404"){
                return error.data.message.userMessage;
            }
            else{
                return error;
            }
            
            console.log("error received " + JSON.stringify(error));
        });
    }
    
    header.setTerm = function(term){
        //if(term == searchTerm){
            searchTerm = term;
        //}
        //else{
           // if(searchTerm != "same term") searchTerm = term;
       // }
         
    }
    header.getTerm = function(){
        return searchTerm;
    }
    
    
    return header;

}])
