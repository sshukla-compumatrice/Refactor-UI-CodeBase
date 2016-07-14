angular.module('DefaultLanguageLibrary').constant('DefaultLanguageLibraryAPIUrlCollection', {
     GETAPI_DLLPDF : '{libraryID}/language?outputType={outputType}',
   



    GETAPI_DLLLIST: '{companyID}',

   GETAPI_DLLCOMPANYLIST:'companies/',
   GETAPI_DLLCOMPANYLISTBYUSER:'users/{userGuid}',

    PUTAPI: '{libraryID}',
   

    DELETEAPI: '{libraryID}',


   POSTAPI: '',
   
 POSTAPI_UNLINKLIBRARY: "{libraryID}/{sectionGUID}",
POSTAPI_UNLINKCOMPLETELIBRARY: "{libraryID}",

    DELETEAPI_LANGUAGE: '{libraryID}/language/',
   

    GETAPI_LANGUAGE_ALLSECTIONS: '{libraryID}/language?outputType={outputType}',
  

    POSTAPI_LANGUAGE: '{libraryID}/language',
    

    PUTTAPI_LANGUAGEITEM: '{libraryID}/language/{languageID}',
   

    PUTTAPI_LANGUAGESITEMREORDER: '{libraryID}/language',
   

    GETAPI_LANGUAGE_BYSECTION: '{libraryID}/language?sectionGUID={sectionID}',


  
    
    DELETEAPI_LANGUAGE_BYSECTION: "{libraryID}/language/?sectionGUID={sectionID}",
    
    POSTAPI_LINKLIBRARY: "",


    POSTAPI_COPYFROMLANGUAGE: '{libraryID}/language',
   

    PUTAPI_LANGUAGE: '{libraryID}/language/{languageID}',
  

    DELETEAPI_LANGUAGEITEM: '{libraryID}/language/{languageID}',


   GETAPI_TEMPLATESECTIONS: '{templateID}/sections',

});
