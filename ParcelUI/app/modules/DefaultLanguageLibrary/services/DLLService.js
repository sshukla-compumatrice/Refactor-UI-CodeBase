angular.module('DefaultLanguageLibrary').service('DefaultLanguageLibraryAPI', ['APIFactory', 'DefaultLanguageLibraryAPIUrlCollection','BASEURL', function(APIFactory, UrlColl,BASEURL) {

    var self = this;


    this.getPDFURL = function(libraryID)
    {
        var url = BASEURL.DLLLIB + UrlColl.GETAPI_DLLPDF;
        var queryParams = {
            libraryID:libraryID,
            outputType:'pdf'
        }
         return APIFactory.get(url, queryParams);
    }    

    this.getDLLCompanyList = function() {
        var url = BASEURL.DLL_SHARED + UrlColl.GETAPI_DLLCOMPANYLIST;
        
        return APIFactory.get(url);
    };
    
    this.getDLLCompanyListByUser = function(userGUID) {
        var url = BASEURL.DLL_SHARED + UrlColl.GETAPI_DLLCOMPANYLISTBYUSER;
         var queryParams = {
            userGuid:userGUID
        }
        return APIFactory.get(url,queryParams);
    };
    
    this.getDLLList = function(companyId) {
        var url = BASEURL.DLLCOMPLIB + UrlColl.GETAPI_DLLLIST;
        var queryParams = {
            companyID: companyId
        }
        return APIFactory.get(url, queryParams);
    };

    this.update = function(id, dll) {
        var url = BASEURL.DLLLIB + UrlColl.PUTAPI;
        var queryParams = {
            libraryID: id
        }
        var putData = {
            library: dll
        }
        return APIFactory.put(url, putData, queryParams).then(function(dll) {
            return dll.library;
        });
    };

    this.delete = function(id) {
        var url = BASEURL.DLLLIB + UrlColl.DELETEAPI;
        var queryParams = {
            libraryID: id
        }

        return APIFactory.delete(url, null, queryParams);
    };
    
    this.unlinkLibrary = function(data,libraryID,sectionGUID) {
        var url = BASEURL.DLLLIB + UrlColl.POSTAPI_UNLINKLIBRARY;
        var queryParams = {
            libraryID: libraryID,
            sectionGUID: sectionGUID
        }
        var postData = data;
        return APIFactory.put(url, postData,queryParams).then(function(response) {
            return response.library;
        });
    };
        this.unlinkCompleteLibrary = function(data,libraryID) {
        var url = BASEURL.DLLLIB + UrlColl.POSTAPI_UNLINKCOMPLETELIBRARY;
        var queryParams = {
            libraryID: libraryID
        }
        var postData = data;
        return APIFactory.put(url, postData,queryParams).then(function(response) {
            return response.library;
        });
    };

    this.post = function(data) {
        var url = BASEURL.DLLLIB + UrlColl.POSTAPI;

        var postData = data;
        return APIFactory.post(url, postData).then(function(response) {
            return response.library;
        });
    };

    this.linkLibrary = function(data) {
        var url = BASEURL.DLLLIB + UrlColl.POSTAPI_LINKLIBRARY;
        return APIFactory.post(url, data).then(function(result) {
            return result.library;
        });
    };


    this.postLanguage = function(libraryId, data) {
        var url = BASEURL.DLLLIB + UrlColl.POSTAPI_LANGUAGE;
        var queryParams = {
            libraryID: libraryId
        }
        var postData = {
            languages: data
        };
        return APIFactory.post(url, postData, queryParams).then(function(response) {
            return response.languageList;
        });
    };

    this.deleteLanguage = function(libraryId) {
        var url = BASEURL.DLLLIB + UrlColl.DELETEAPI_LANGUAGE;
        var queryParams = {
            libraryID: libraryId
        }

        return APIFactory.delete(url, null, queryParams);
    };

    this.getLanguageBySection = function(libraryId, sectionId) {
        var url = BASEURL.DLLLIB + UrlColl.GETAPI_LANGUAGE_BYSECTION;
        var queryParams = {
            libraryID: libraryId,
            sectionID: sectionId
        }
        return APIFactory.get(url, queryParams).then(function(response) {
            return response.language;
        });
    };
    this.deleteLanguageBySection = function(libraryId, sectionId) {
        var url = BASEURL.DLLLIB + UrlColl.DELETEAPI_LANGUAGE_BYSECTION;
        var params = {
            libraryID: libraryId,
            sectionID: sectionId
        };

        return APIFactory.delete(url, null, params);
    };

    this.getLanguageForAllSections = function(libraryId) {
        var url =BASEURL.DLLLIB + UrlColl.GETAPI_LANGUAGE_ALLSECTIONS;
        var queryParams = {
            libraryID: libraryId,
            outputType: ""
        }
        return APIFactory.get(url, queryParams).then(function(response) {
            return response.language;
        });
    };
    this.postCopyFromLibrary = function(libraryId, data) {
        var url = BASEURL.DLLLIB + UrlColl.POSTAPI_LANGUAGE;
        var queryParams = {
            libraryID: libraryId
        }
        var postData = {
            copyFromLibrary: data
        };
        return APIFactory.post(url, postData, queryParams).then(function(response) {
            return response.language;
        });
    };

    this.putLanguageItem = function(libId, langId, language) {
        var url = BASEURL.DLLLIB + UrlColl.PUTTAPI_LANGUAGEITEM;
        var queryParams = {
            libraryID: libId,
            languageID: langId
        }
        var putData = {
            language: language
        }
        return APIFactory.put(url, putData, queryParams).then(function(dll) {
            return dll.library;
        });
    };

    this.putLanguageItemsReorder = function(libId, sectionID, languages) {
        var url = BASEURL.DLLLIB + UrlColl.PUTTAPI_LANGUAGESITEMREORDER;
        var queryParams = {
            libraryID: libId
        }
        var putData = {
            sectionGUID: sectionID,
            languages: languages
        }
        return APIFactory.put(url, putData, queryParams).then(function(dll) {
            return dll.library;
        });
    };
    this.putLanguage = function(libId, langId, language) {
        var url = BASEURL.DLLLIB + UrlColl.PUTAPI_LANGUAGE;
        var queryParams = {
            libraryID: libId,
            languageID: langId
        }
        var putData = {
            language: language
        }
        return APIFactory.put(url, putData, queryParams).then(function(dll) {
            return dll.library;
        });
    };
    this.deleteLanguageItem = function(libraryId, languageId) {
        var url = BASEURL.DLLLIB + UrlColl.DELETEAPI_LANGUAGEITEM;
        var queryParams = {
            libraryID: libraryId,
            languageID: languageId
        }

        return APIFactory.delete(url, null, queryParams);
    };
    
     this.getTemplate = function(templateId) {
        var url =  BASEURL.REPORTTEMPLATES_TEMPLATES + UrlColl.GETAPI_TEMPLATESECTIONS;
        var queryParams = {
            templateID: templateId
        }
        return APIFactory.get(url, queryParams).then(function(data) {
            return data.template;
        });
    };
    
     
}]);