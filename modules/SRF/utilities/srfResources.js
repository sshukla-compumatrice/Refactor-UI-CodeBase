angular.module('SRFModule').constant('SRFResources', {

    //localstorage keys

    view  : 'view', // localstorage to view type in form
    //messages in form-directive
    transactionTab : "transaction tab clicked",
    collateralTab  : "collateral tab clicked",
    transactionButton : "move to transaction button clicked",
    collateralButton : "moved to collateral button clicked",
    transactionSubmit : "submit button clicked from transaction tab",
    transactionCancel : "cancel button clicked from transaction tab",
    collateralSubmit : "submit button clicked from collateral tab",
    collateralCancel : "cancel button clicked from collateral tab",
    invalidFormEntry : "invalid form entry by user",
    validFormEntry   : "valid form entry by user",
    dataSubmitted : "insertion successful",
    errorInDataSubmitted : "insertion unsuccessful",
    postDataFromCtrl : "post data service called from controller",

    //messages in cabinet factory
    getCabinetsService : "cabinet factory reached",
    getcabinetSuccessful : "cabinets fetched",
    getCabinetUnsuccessful : "cabinets fetching unsuccessful",

    //messages in cabinet controller
    cabinetsInController : "cabinets data reached controller from service",
    cabinetResolve : "resolve called to fetch cabinets",
    cabinetHTMLLoaded : "user visited add cabinet page",
    cabinetEntry : "user clicked to fill cabinet",
    invalidCabinet : "invalid cabinet entry",
    validCabinet : "valid cabinet entry",
    emptyCabinetArray : "cabinet array is empty",

    //messages in form factory
    getFormAndReportService : "get form-JSON and reports factory reached",
    getFormSuccessful : "form JSON fetched",
    getFormUnsuccessful : "form JSON fetching unsuccessful",
    getReportsSuccessful : "report JSON fetched",
    getReportsUnsuccessful : "report JSON fetching unsuccessful",

    //messages in form controller
    formController : "reached form controller",
    getReportsJSONToController : "request from controller to service to fetch reports JSON",
    reportsJSONInController : "reports JSON data received from service in controller",
    getFormJSONToController : "request from controller to service to fetch form JSON",
    formJSONInController : "form JSON data received from service in controller",
    emptyreportsObject : "reports object is null or undefined",
    emptyreportsArray : "reports array is empty",
    emptyFormObject : "empty form object",

    //messages in post service

    postService : "form data post service called",
    postDataSuccess : "data post success",
    postDataError : "error in data post",
    defaultSRFBtnText : "Choose Cabinet",

    // Regular Exprerssions and Error Messages for validatons

    NumberValidator:"/^[0-9]+$/",
    ErrorMessageNumber:"Invalid amount, Only numbers are allowed",
    PhoneNumberValidator:"/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/",
    ErrorMessagePhone:"Invalid Phone Number, Please Enter Valid Phone Number",

    //Message for Choose cabinet confirm box
    ConfirmChooseCabinet :"By choosing a new cabinet  ,you are starting the creation process from the beginning and any information you have added will be lost."+

"Would you like to choose a new cabinet?",
    
    emailLimitsWarning : "Maximum number of monitoring emails have reached. Please delete an email to add another"

});
