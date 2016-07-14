angular.module('ReportAuthoring').service('ReportAuthoringAPI', ['$timeout', 'APIFactory', 'ReportAuthoringUrlCollection', '$stateParams', 'BASEURL', 'globalValues', function ($timeout, APIFactory, ReportAuthoringUrlCollection, $stateParams, BASEURL, globalValues) {

    var self = this;
    var storedHistoryArray = [];
    var storedLanguagesArray = [];
    var libraryID;
    self.apiType = {
        type: 'real', //'real',

        getAllSections: {
            mock: ReportAuthoringUrlCollection.GETAPI_ALLSECTIONS_MOCK,
            real: ReportAuthoringUrlCollection.GETAPI_ALLSECTIONS_REAL
        },
        getReportDefaulfLibrary: {
            mock: ReportAuthoringUrlCollection.GETAPI_ReportDefaulfLibrary_MOCK,
            real: ReportAuthoringUrlCollection.GETAPI_ReportDefaulfLibrary_REAL
        },
        getAllSectionsWithLimit: {
            mock: ReportAuthoringUrlCollection.GETAPI_ALLSECTIONS_WITHLIMIT_MOCK,
            real: ReportAuthoringUrlCollection.GETAPI_ALLSECTIONS_WITHLIMIT_MOCK
        },

        getSection: {
            mock: ReportAuthoringUrlCollection.GETAPI_MOCK,
            real: ReportAuthoringUrlCollection.GETAPI_REAL
        },


        getToC: {
            mock: ReportAuthoringUrlCollection.GETTOC_MOCK,
            real: ReportAuthoringUrlCollection.GETTOC_REAL
        },

        //        getComments: {
        //            mock: ReportAuthoringUrlCollection.GETCOMMENTS_MOCK,
        //            real: ReportAuthoringUrlCollection.GETCOMMENTS_MOCK
        //        },

        getHistory: {
            mock: ReportAuthoringUrlCollection.GETHISTORY_MOCK,
            real: ReportAuthoringUrlCollection.GETHISTORY_MOCK
        },
        updateSection: {
            mock: ReportAuthoringUrlCollection.UPDATESECTION_MOCK,

            real: ReportAuthoringUrlCollection.UPDATESECTION_REAL

        },
        getReportSignoff: {
            mock: ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFF_MOCK,
            //mock: BASEURL.parcelPOC+ ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFF_REAL, 
            real: BASEURL.parcelPOC + ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFF_REAL,

            //real : ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFF_MOCK
        },
        getReportSignOffSingle: {
            mock: ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFF_MOCK,
            real: BASEURL.parcelPOC + ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFFSINGLE_REAL,
        },
        getUsersUnderSignTab: {
            mock: BASEURL.ACCOUNT_MGMT_API + ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFFUSERS_REAL,
            real: BASEURL.ACCOUNT_MGMT_API + ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFFUSERS_REAL,
            //real: BASEURL.REPORTAUTHORING_ACCMGMTPOC + ReportAuthoringUrlCollection.GETAPI_REPORTSIGNOFFUSERS_REAL,
        },
        getEDRImportData: {
            mock: BASEURL.BASE_PARCELDATAIMPORT_SERVICE + ReportAuthoringUrlCollection.GETAPI_EDRIMPORTDATA_MOCK,
            real: BASEURL.BASE_PARCELDATAIMPORT_SERVICE + ReportAuthoringUrlCollection.GETAPI_EDRIMPORTDATA_REAL,
            //real: BASEURL.REPORTAUTHORING + ReportAuthoringUrlCollection.GETAPI_IMPORTDATA_REAL,
        }
    };

    self.formatUrl = function (url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    };

    self.getReportDefaulfLibrary = function (reportGuid) {
        var url = BASEURL.REPORTS + self.apiType.getReportDefaulfLibrary[self.apiType.type];
        var params = {
            reportGUID: reportGuid
        };
        return APIFactory.get(url, params);
    }

    self.getAllSections = function (reportId) {

        var url = BASEURL.REPORTAUTHORING + self.apiType.getAllSections[self.apiType.type];
        var params = {
            reportGuid: reportId
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.report.reportData.formSectionData;
        });
    }

    self.getAllSectionsWithLimit = function (reportId, offset, limit) {
        var url = self.apiType.getAllSectionsWithLimit[self.apiType.type];
        var params = {
            limit: limit,
            offset: offset
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.Sections;
        });
    }

    self.getSection = function (reportId, sectionId, sectionGUID) {

        var url = BASEURL.REPORTAUTHORING + self.apiType.getSection[self.apiType.type];
        var params = {
            reportGuid: reportId,
            sectionGUID: sectionGUID
        };

        return APIFactory.get(url, params).then(function (response) {
            response.sectionID = response.sectionID || sectionId;
            response.sectionGUID = response.sectionGUID || sectionGUID;
            response.reportGUID = response.reportGUID || $stateParams.reportGUID;
            return response.report.reportData.formSectionData[0];

        });
    }


    self.updateSection = function (reportID, sectionGUID, data) {


        var url = BASEURL.REPORTAUTHORING + self.apiType.updateSection[self.apiType.type];
        var params = {
            reportGUID: reportID

        };

        return APIFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }


    self.getToC = function (reportId) {

        var url = BASEURL.REPORTAUTHORING + self.apiType.getToC[self.apiType.type];
        // var url = 'app/modules/ReportAuthoring/sampleJson/TOC_RequestJsonNew.js';

        var params = {

            reportGuid: reportId,
            depth: 'SHALLOW'
        };

        return APIFactory.get(url, params).then(function (response) {
            //return response.tableOfContent.sections;
            return response;
        });
    }

    self.getComments = function (sortEnum, reportGUID, sectionGUID) {

        if (sectionGUID != undefined && sectionGUID != null && sectionGUID != "") {
            var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.GETCOMMENTS;
            var params = {
                reportGUID: reportGUID,
                sectionGUID: sectionGUID,
                sortEnum: sortEnum
            };
        } else {

            var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.GETALLCOMMENTS;
            var params = {
                reportGUID: reportGUID,
                sortEnum: sortEnum

            };
        }

        return APIFactory.get(url, params).then(function (response) {
            return response.sections;

        });
    }
    self.add_update_Comments = function (reportGUID, sectionGUID, data) {
        var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.PUTCOMMENTS;
        var params = {
            reportGUID: reportGUID,
            sectionGUID: sectionGUID
        };

        return APIFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }
    self.deleteComments = function (data) {
        var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.DELETECOMMENTS;

        return APIFactory.put(url, data).then(function (response) {
            return response;
        });
    }
    self.getCommentTypes = function () {
        var url = BASEURL.GET_COMMENT_TYPES;
        var params = {
            reportGUID: reportGUID,
            sectionGUID: sectionGUID
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.comments;
        });
    }
    self.getHistory = function (reportGuid, sectionId) {
        var url = BASEURL.BASE_REPORTWRITING_SERVICE + self.apiType.getHistory[self.apiType.type];
        var params = {
            reportGUID: reportGuid,
            sectionGUID: sectionId
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    self.getSetupDefaults = function (reportGUID) {
        var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.GET_SETUP_DEFAULTS;
        var params = {
            reportGUID: reportGUID
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    self.updateSetupDefaults = function (reportGUID, data) {


        var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.PUT_SETUP_DEFAULTS;
        var params = {
            reportGUID: reportGUID
        };

        return APIFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    self.getCoverPageList = function (companyGuid) {
        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.GET_COVERPAGES_LIST;
        var params = {
            companyGuid: companyGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.covers;
        });
    }

    self.updatePrepopulatedData = function (reportGUID) {


        var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.UPDATE_PREPOPULATED;
        var params = {
            reportGUID: reportGUID
        };

        return APIFactory.put(url, null, params).then(function (response) {
            return response;
        });
    }
    self.getReportOutputList = function (companyGUID, type) {
        var url = BASEURL.BASE_PARCEL_SERVICE + ReportAuthoringUrlCollection.REPORTOUTPUTLIST;
        var params = {
            companyGUID: companyGUID,
            type: type
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.reportOutputSetup;
        });
    }


    self.getCostTableData = function (siteId, packageId, tableId) {

        var url = 'app/modules/ReportAuthoring/sampleJson/' + siteId + '/sampleSection_25.json';
        return APIFactory.get(url).then(function (response) {

            var tableObject = {};
            tableObject.reserveTableConstantValues = {};
            tableObject.recommendations = {};
            tableObject.displayType = response.packages.type;
            angular.forEach(response.reports, function (report, index) {

                if (report.reportName == "Replacement Reserve Costs Table") {
                    tableObject.reserveTableConstantValues = report;
                }
                if (report.reportName == "Freddie Mac 2015 Cost Tables") {
                    tableObject.reserveTableConstantValues = report;
                }
            });
            angular.forEach(response.packages.packagesArray, function (package, index) {

                if (package.packageId == packageId) {

                    for (var i = 0; i < package.tables.length; i++) {
                        if (package.tables[i].tableId === tableId) tableObject.recommendations = package.tables[i];
                    }

                }
            });
            return tableObject;
        });
    }


    self.addUpdateRecommendation = function (submitData) {

        return true;
    }

    self.updateCondition = function (condition) {
        return true;
    }

    self.updateAction = function (action) {
        return true;
    }

    self.putHistoryArray = function (historyArray) {
        storedHistoryArray = [];
        return storedHistoryArray = historyArray;
    }

    self.getHistoryArray = function () {
        return storedHistoryArray;
    }

    self.putLanguageArray = function (languageArray) {
        storedLanguagesArray = [];
        return storedLanguagesArray = languageArray;
    }

    self.getLanguageArray = function () {
        return storedLanguagesArray;
    }

    self.putLibraryID = function (libraryGUID) {
        libraryID = "";
        return libraryID = libraryGUID;
    }

    self.getLibraryID = function () {
        return libraryID;
    }

    self.getReportSignOff = function (reportGuid) {
        var url = self.apiType.getReportSignoff[self.apiType.type];
        var params = {
            reportGuid: reportGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });

    }

    self.getSingleReportSignOff = function (reportGuid, reportsignoffguid) {
        var url = self.apiType.getReportSignOffSingle[self.apiType.type];
        var params = {
            reportGuid: reportGuid,
            reportsignoffguid: reportsignoffguid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    self.getUsersUnderSignTab = function () {
        var url = self.apiType.getUsersUnderSignTab[self.apiType.type];
        var params = {
            companyGuid: globalValues.currentUserCompanyGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }


    self.managePanelHeight = function () {
        $timeout(function () {
            var leftpanelheight = $('.leftContent ').height();
            var topheader = $('.topHeaderHeight').height();
            var contentheight = leftpanelheight - topheader;
            $('.contentbodyHeight').height(contentheight - 5);
            $('.topHeaderHeight').css("max-height", leftpanelheight);
            $(window).resize(function () {

                var leftpanelheight = $('.leftContent ').height();
                var topheader = $('.topHeaderHeight').height();
                var contentheight = leftpanelheight - topheader;
                $('.contentbodyHeight').height(contentheight - 5);
                $('.topHeaderHeight').css("max-height", leftpanelheight);
            });
            $(window).trigger('resize');
        })
    }

    self.reportBySiteID = function (siteID) {
        var url = BASEURL.BASE_PARCEL_SERVICE + ReportAuthoringUrlCollection.GETAPI_SEARCHBYSITEID;
        var params = {
            siteID: siteID
        };

        return APIFactory.get(url, params).then(function (data) {
            return data;
        });
    }

    self.getPrevGeneratedEmailedReports = function (reportGuid) {
        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.GET_PREV_EMAILED_REPORTS;
        //var url = 'app/modules/ReportAuthoring/sampleJson/deliverableHistoryJson.js';
        var params = {
            reportguid: reportGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.reportDeliveries;
        });
    }
    self.getAssembleSections = function (reportGuid) {
        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.GET_ASSEMBLE_SECTIONS;
        var params = {
            reportguid: reportGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.deliverableSections;
        });
    }

    self.getSectionDataToEdit = function (reportGuid, generationType) {
        var url = ReportAuthoringUrlCollection.GET_SECTIONDATA_EDIT;
        var params = {
            reportGuid: reportGuid,
            generationType: generationType
        };
        return APIFactory.get(url, params).then(function (response) {
            return response.content;
        });
    }

    self.updateSectionData = function (reportGuid, generationType, data) {
        var url = ReportAuthoringUrlCollection.PUT_SECTIONDATA;

        var data = {
            "content": data
        };
        var params = {
            reportGuid: reportGuid,
            generationType: generationType
        };

        return APIFactory.put(url, data, params).then(function (data) {
            return data;
        });
    }

    self.getAppendicesSections = function (reportGuid) {
        //        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.GET_APPENDICESSECTIONS_ASSEMBLE;
        //var url = ReportAuthoringUrlCollection.GET_APPENDICESSECTIONS_ASSEMBLE;
        //var url = BASEURL.REPORTAUTHORING + ReportAuthoringUrlCollection.GET_APPENDICESSECTIONS_ASSEMBLE;
        var url = BASEURL.BASE_APPENDICES_SERVICE + ReportAuthoringUrlCollection.GET_APPENDICESSECTIONS_ASSEMBLE;
        var params = {
            reportGuid: reportGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            /*angular.forEach(response.tableOfContent.sections, function (section, index) {
				if(section.isAppendix != undefined && section.isAppendix)
				 sectionsObject = section.sections;
			});
			
			return sectionsObject;*/
            return response.sections;
        });
    }

    self.getResponseType = function () {
        return ReportAuthoringUrlCollection.GET_VIEW_PDF_RESPONSE_TYPE;
    }

    self.updateReportStatus = function (reportGuid, level) {
        var url = BASEURL.BASE_REPORTWRITING_SERVICE + ReportAuthoringUrlCollection.UPDATE_REPORTSTATUS;
        var params = {
            reportGuid: reportGuid,
            level: level
        };

        return APIFactory.put(url, null, params).then(function (data) {
            return data;
        });
    }
    self.disableEmailedReports = function (deliverableLinkGuid, data) {
        //        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.PUT_DISABLE_EMAILED_REPORTS;
        var url = ReportAuthoringUrlCollection.PUT_DISABLE_EMAILED_REPORTS;
        var params = {
            deliverableLinkGuid: deliverableLinkGuid
        };
        return APIFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }
    self.getEDRImportData = function (reportGuid, importType) {
        // var url = 'app/modules/ReportAuthoring/sampleJson/'+ importType  +'_mockImportData.json';		
        var url = self.apiType.getEDRImportData[self.apiType.type] + importType;
        var params = {
            reportguid: reportGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    self.uploadDeliverableSectionFile = function (reportGuid, file, data) {
        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.UPLOAD_DELIVERABLESECTION;
        //        var url = ReportAuthoringUrlCollection.UPLOAD_DELIVERABLESECTION;
        var params = {
            reportGuid: reportGuid,
            fileRequest: data
        };

        //return APIFactory.uploadDeliverableFile(url, params,file, data).then(function (data) {
        return APIFactory.uploadFile(url, null, params, file).then(function (data) {
            return data;
        });
    }
    self.deleteDeliverableSectionDocument = function (reportGuid, deliverableSectionGuid) {
        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.DELETE_DELIVERABLEDOCUMENTS;
        //var url = ReportAuthoringUrlCollection.DELETE_DELIVERABLEDOCUMENTS;
        var params = {
            reportGuid: reportGuid,
            deliverableSectionGuid: deliverableSectionGuid
        };
        return APIFactory.delete(url, null, params).then(function (response) {
            return response;
        });
    }

    self.getEmailDefaults = function (reportGuid) {
        var url = BASEURL.BASE_DELIVERABLE_SERVICE + ReportAuthoringUrlCollection.GETAPI_EMAILDEFAULTS;
        //var url = ReportAuthoringUrlCollection.GETAPI_EMAILDEFAULTS;
        var params = {
            reportGuid: reportGuid
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    self.gerEDRImportDataStatus = function (reportGuid, reportType) {
        var url = BASEURL.BASE_PARCELDATAIMPORT_SERVICE + ReportAuthoringUrlCollection.GETAPI_PARCELDATAIMPORTSTATUS;

        var params = {
            reportGuid: reportGuid,
            reportType: reportType
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    self.getTableExcelFile = function (reportGuid, sectionGUID, tableName) {
        var url = BASEURL.BASE_PARCELDATAIMPORT_SERVICE + ReportAuthoringUrlCollection.GETAPI_DOWNLOADTABLEXCELFILEREQUEST;
        var params = {
            reportGuid: reportGuid,
            sectionGuid: sectionGUID,
            tableName: tableName
        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
            //window.open(response);
        });
    };

    self.buildSpreadsheetDownloadFileUrl = function (fileGuid) {
        var url = BASEURL.GET_COREFILE + ReportAuthoringUrlCollection.GETAPI_DOWNLOADEXCELFILE;
        var params = {
            fileGuid: fileGuid
        };
        var uri = self.formatUrl(url, params);
        return uri;
    }

    self.uploadSpreadsheetFile = function (reportGuid, file, sectionGUID, tableName) {
        var url = BASEURL.BASE_PARCELDATAIMPORT_SERVICE + ReportAuthoringUrlCollection.POSTAPI_UPLOADTABLESPREADSHEET;
        var params = {
            reportGuid: reportGuid,
            sectionGuid: sectionGUID,
            tableName: tableName
        };
        return APIFactory.uploadFile(url, null, params, file).then(function (data) {
            return data;
        });

    }

}]);
