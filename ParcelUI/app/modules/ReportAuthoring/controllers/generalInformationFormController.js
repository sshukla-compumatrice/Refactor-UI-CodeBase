angular.module("ReportAuthoring").controller("generalInformationFormController", ["$rootScope", "$scope", "GeneralInformationAPI", "$modal", "$window", "$location", "$state", "edrOrderAPI", "reportGridDataOperations", "accountMgmtAPI", "$timeout", "AuthFactory", "getScopeService", "ParcelUI.Resources", function ($rootScope, $scope, GeneralInformationAPI, $modal, $window, $location, $state, edrOrderAPI, reportGridDataOperations, accountMgmtAPI, $timeout, AuthFactory, getScopeService, ParcelUI_Resources) {

    var self = this;
    var offices = [];

    self.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;

    self.data = {};
    var reportGuid = $location.search().reportGuid;
    var sectionGuid = $rootScope.giSectionGuid ? $rootScope.giSectionGuid : $location.search().sectionGuid;
    self.portfolioOrderParamObj = {
        projectGuid: $state.params.projectGuid
    };
    self.userMsg = false;
    self.userMsgAlertClass = false;
    self.isOrderAvailable = false;

    self.currentStateName = $state.$current.name;

    var stack_bottomright = {
        "dir1": "up",
        "dir2": "left",
        "firstpos1": 50,
        "firstpos2": 25
    };
    PNotify.prototype.options.width = "325px";
    PNotify.prototype.options.styling = "fontawesome";
    self.showPNotifyMessage = function (title, text, type) {
        new PNotify({
            title: title,
            text: text,
            type: type,
            delay: 4000,
            addclass: "stack-bottomright",
            stack: $scope.stack_bottomright ? $scope.stack_bottomright : stack_bottomright

        });
    }

    function init() {
        if ($state.params.siteID != undefined)
            $('#siteId').val($state.params.siteID);
        self.offices = [];
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;

        getOffices();
    }

    $('.expandContent').click(function () {
        $('.showMe').slideToggle('slow');
    });

    init();

    function getGeneralInfo() {


        $scope.promise = GeneralInformationAPI.get(reportGuid, sectionGuid).then(function (data) {
            self.data = data;
            self.instruction = data.generalInformation.instructions.html;
            for (i = 0; i < data.generalInformation.dataFields.length; i++) {
                if (data.generalInformation.dataFields[i].name == "Project") {
                    for (j = 0; j < data.generalInformation.dataFields[i].fields.length; j++) {
                        if (data.generalInformation.dataFields[i].fields[j].mappedField == "projectName") {
                            self.projectName = data.generalInformation.dataFields[i].fields[j].fieldValue;
                            break;
                        }
                    }
                    break;
                }
            }
        }, function (error) {
            self.userMsg = "<strong>Error:</strong> Something went wrong while getting General Information details of this project. " + error;
            self.userMsgAlertClass = "alert-danger";
        });
        self.waitingProcessResources.promise = null;
        if ($("#loading").css('display')) {
            if ($("#loading").css('display') == 'none') {
                self.waitingProcessResources.promise = $scope.promise;
            }
        } else {
            self.waitingProcessResources.promise = $scope.promise;
        }
    }

    function getOffices() {
        var companyGuid = AuthFactory.getUserDetailsFromStorage("EFF_COMPANYGUID");
        $scope.promise = accountMgmtAPI.getCompany(companyGuid, false, "offices").then(function (resp) {
            if (resp && resp.companies && resp.companies.length && resp.companies[0].offices && resp.companies[0].offices.length) {
                self.companyInfo = resp.companies[0];
                getGeneralInfo();
            } else {
                self.userMsg = "<strong>Error:</strong> Something went wrong while getting your company's offices. Please refresh the page.";
                self.userMsgAlertClass = "alert-danger";
            }
        }, function (error) {
            self.userMsg = "<strong>Error:</strong> Something went wrong while getting your company's offices. Please refresh the page.";
            self.userMsgAlertClass = "alert-danger";
        });
        self.waitingProcessResources.promise = null;
        if ($("#loading").css('display')) {
            if ($("#loading").css('display') == 'none') {
                self.waitingProcessResources.promise = $scope.promise;
            }
        } else {
            self.waitingProcessResources.promise = $scope.promise;
        }
    }

    self.openEdrCredentialsModal = function () {
        var modalInstance = $modal.open({
            templateUrl: 'orderDBReport.html',
            scope: $scope,
            controller: 'OrderDatabaseReportsController as OrderDbReportsCtrl',
            backdrop: 'static',
            resolve: {
                siteDetails: function (reportGridDataOperations) {
                    return reportGridDataOperations.getSiteInformation(reportGuid).then(function (response) {
                        return response;
                    });
                },
                userDetails: function (globalValues, accountMgmtAPI) {
                    var companyGuid = globalValues.currentUserCompanyGuid;
                    var officeGuid = globalValues.currentUserOfficeGuid;
                    var userGuid = globalValues.currentUserGuid;
                    return accountMgmtAPI.getUser(userGuid, "", companyGuid, officeGuid, "", "", "", "", "office").then(function (resp) {
                        return resp;
                    });
                }
            }
        });
    }

    getScopeService.setGiFormScope(self);

}]);
