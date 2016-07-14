angular.module('ReportTemplates').service('ReportTemplatesAPI', ['APIFactory', 'ReportTemplatesAPIUrlCollection','BASEURL', function(APIFactory, UrlColl,BASEURL) {

    var self = this;
  


    this.getTemplateList = function(companyId) {
        var url = BASEURL.REPORTTEMPLATES_COMPTEMPLATES + UrlColl.GETAPI_TEMPLATESLIST;
        var queryParams = {
            companyID: companyId
        }
        return APIFactory.get(url, queryParams);
    };

    this.getTemplateDefaults = function(companyID, templateID) {
        var url = BASEURL.REPORTTEMPLATES_TEMPLATES + UrlColl.GETAPI_TEMPLATEDEFAULTS;
        var params = {
            companyID: companyID,
            templateID: templateID
        };
        return APIFactory.get(url, params).then(function(data) {
            return data.defaults;
        });
    };

    this.putDefaultTemplates = function(templateID, defaultTemplatesData, companyID) {
        var url = BASEURL.REPORTTEMPLATES_TEMPLATES + UrlColl.PUTAPI_TEMPLATEDEFAULTS;
        var queryParams = {
            templateID: templateID,
            companyID: companyID
        }

        var putData = {
            defaults: defaultTemplatesData
        };

        return APIFactory.put(url, putData, queryParams).then(function(result) {
            return result.data;
        });
    };

    this.deleteDefaultTemplates = function(templateID, data) {
        var url = UrlColl.DELETEAPI_TEMPLATEDEFAULTS;
        var queryParams = {
            templateID: templateID
        }

        var putData = {
            template: data
        };

        return APIFactory.delete(url, putData, queryParams).then(function(result) {
            return result.data;
        });
    };

    this.getDashboard = function() {
        var url = BASEURL.REPORTTEMPLATES_PARCELSERVICE + UrlColl.GETAPI_DASHBOARDLIST;

        return APIFactory.get(url, "");
    };

    this.getTemplateSections = function(templateId) {
        var url =  BASEURL.REPORTTEMPLATES_TEMPLATES + UrlColl.GETAPI_TEMPLATESECTIONS;
        var queryParams = {
            templateID: templateId
        }
        return APIFactory.get(url, queryParams).then(function(data) {
            return data.template.tableOfContent.sections;
        });
    };

    this.putTemplates = function(templateID, templatesData) {
        var url = BASEURL.REPORTTEMPLATES_TEMPLATES + UrlColl.PUTAPI_TEMPLATES;
        var queryParams = {
            templateID: templateID
        }

        var templateObj = angular.copy(templatesData);
        if (templateObj) {
            delete templateObj.companyDefaultTemplate;
            var name = templateObj.reportType;
            templateObj.reportType = templateObj.reportTypeValue;
        }
        var putData = {
            template: templateObj
        };

        return APIFactory.put(url, putData, queryParams).then(function(result) {

            return result.template;
        });
    };

    this.deleteTemplates = function(templateID, data) {
        var url = BASEURL.REPORTTEMPLATES_TEMPLATES + UrlColl.DELETEAPI_TEMPLATES;
        var queryParams = {
            templateID: templateID
        }

        var putData = {
            template: data
        };

        return APIFactory.delete(url, putData, queryParams).then(function(result) {
            return result.data;
        });
    };

    this.copyTemplate = function(data) {
        var url = BASEURL.REPORTTEMPLATES_PARCELSERVICE + UrlColl.POSTAPI_TEMPLATES;
        return APIFactory.post(url, data).then(function(data) {
            return data.template;
        });
    };

    this.setDefaultReportTemplate = function(template, companyGuid, reportType, clientCompanyGuid) {
        var url = BASEURL.REPORTTEMPLATES_PARCELSERVICE + UrlColl.PUTAPI_DEFAULTREPORTTEMPLATE;

        // this is fix for API
        // url: /defaulttemplate/companyID/reportType/clientCompanyID
        // 'clientCompanyID' becomes mandatory in this case
        // if not provided, response is 404 error
        if (!clientCompanyGuid) {
            clientCompanyGuid = "null";
        }
        var queryParams = {
            companyID: companyGuid,
            reportType: reportType,
            clientCompanyID: clientCompanyGuid
        }

        var putData = {
            "template": template
        };
        return APIFactory.put(url, putData, queryParams).then(function(result) {
            return result;
        });
    };

}]);