angular.module("ParcelUI").constant("ReportDashboardUrlCollection", {

    GETAPI: "{accountGuid}?detail={detail}&limit={limit}&offset={offset}", //Sort and Filter is removed from real API impl.

    GETAPI_MOCK: "{accountGuid}?detail={detail}&limit={limit}&offset={offset}&sort={sort}&filter={filter}",
    
    PUTAPI: "accountGuid?detail=detail&limit=limit&offset=offset&sort=sort&filter=filter",
    
    //GETAPI_RECENTLYVIEWEDREPORTS_REAL:"activities/?categoryname=Recently+Opened+Files&entityid={entityid}&entitytype=User",
    GETAPI_ACTIVITY: "activities/?categoryname={categoryname}&entityid={entityid}&entitytype={entitytype}&detail={detail}&limit={limit}&offset={offset}",
    
    GETAPI_ACTIVITY_ITEMS: "activities/{activityguid}/activityitems/{activityitemguid}?entitytype={entitytype}&entityid={entityid}&itemmode={itemmode}&limit={limit}&offset={offset}",
    
    GETUSERDETAILS_ACCOUNMGMT : "users/{userGuid}?detail={detail}"
});
