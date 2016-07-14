angular.module('ParcelUI').constant('edrOrderUrlCollection', {
    //Order Status URLs
    GETAPI_ORDERSTATUS_GETORDER_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/project/{projectGuid}?detail={detail}',
    GETAPI_ORDERSTATUS_GETORDER_REAL : '',
    
    GETAPI_ORDERSTATUS_GETTRANSFERURL_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/order/{orderGuid}?detail={detail}',
    GETAPI_ORDERSTATUS_GETTRANSFERURL_REAL : '',
    
    GETAPI_ORDERSTATUS_GETREPORTORDERS_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/report/{reportGuid}?detail={detail}',
    GETAPI_ORDERSTATUS_GETREPORTORDERS_REAL : '',
    
    PUTAPI_ORDERSTATUS_ADDEDRPROPTOREPORT_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/report/{reportGuid}?detail={detail}',
    PUTAPI_ORDERSTATUS_ADDEDRPROPTOREPORT_REAL : '',
    
    DELETEAPI_ORDERSTATUS_DELETEEDRORDERFROMREPORT_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/report/{reportGuid}/{edrPropertyGuid}',
    DELETEAPI_ORDERSTATUS_DELETEEDRORDERFROMREPORT_REAL : '',
    
    GETAPI_ORDERSTATUS_GETPROJECTORDERS_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/project/{projectGuid}?detail={detail}',
    GETAPI_ORDERSTATUS_GETPROJECTORDERS_REAL : '',
    
    //Portfolio Ordering urls
    POSTAPI_PORTFOLIOORDERING_GETSEARCHDISTANCES_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/searchDistances',
    POSTAPI_PORTFOLIOORDERING_GETSEARCHDISTANCES_REAL : 'searchDistances',
    
    GETAPI_PORTFOLIOORDERING_GETPORTFOLIOPRODUCTS_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/products/{companyGuid}',
    GETAPI_PORTFOLIOORDERING_GETPORTFOLIOPRODUCTS_REAL : 'products/{companyGuid}',
    
    POSTAPI_PORTFOLIOORDERING_CREATEPORTFOLIOORDER_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/portfolioorder',
    POSTAPI_PORTFOLIOORDERING_CREATEPORTFOLIOORDER_REAL : 'portfolioorder',
    
    GETAPI_PORTFOLIOORDERING_GETSTATUS_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/portfolioorder/{portfolioOrderGuid}',
    GETAPI_PORTFOLIOORDERING_GETSTATUS_REAL : 'portfolioorder/{portfolioOrderGuid}',
    
    POSTAPI_SINGLESITEORDER_CREATEORDER_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/order',
    POSTAPI_SINGLESITEORDER_CREATEORDER_REAL : 'order',
    
    //Notification Service Urls
    POSTAPI_NOTIFICATION_SENDSTATUS_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/notification',
    POSTAPI_NOTIFICATION_SENDSTATUS_REAL : 'notification',
    
    POSTAPI_NOTIFICATION_REQUERY_MOCK : 'http://private-79eea-sharededrorderapi.apiary-mock.com/edrorders/requery',
    POSTAPI_NOTIFICATION_REQUERY_REAL : 'requery',    
});
