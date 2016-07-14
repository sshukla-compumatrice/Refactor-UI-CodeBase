angular.module('ProjectDashboard').controller('ProjectDashboardController', ['$state', '$stateParams', '$scope', '$timeout', 'projectDashboardOperations', '$q', '$modal', '$window', 'reportGridDataOperations', '$window', 'checkStatus', '$location', '$compile', 'AuthFactory', function ($state, $stateParams, $scope, $timeout, projectDashboardOperations, $q, $modal, $window, reportGridDataOperations, $window, checkStatus, $location, $compile, AuthFactory) {

    var self = this;
    self.totalProjectCount = 0;
    self.readDataCount = 0;
    self.parentTaskObj = {};



    init();

    function init() {
        self.projectGuid = $stateParams.projectGuid;
        self.accountGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');      
        self.companyGuid = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');
        //self.selectProjectMode = false;
        self.editMode = false;
        self.reportTypes = [];
        self.reportsTypesHeaderarray = [];
        self.reportTypeData = [];
        self.projectInfoObject = {};
        self.groupedGuidArray = [];
        self.groupedGuidObject = {};
        self.readDataCount = 0;
        self.readDataPage;
        self.taskStatus = {};
        self.isSigned = {};
        //getCommentHierarchy();
        getDashboardData(self.projectGuid, self.accountGuid);



        /*fillProjectDetails(dashBoardData.dashboard.desc);
         getReportTypes(dashBoardData.dashboard.desc.columnSets);
         getReportData(dashBoardData.dashboard.data);*/
        /* $timeout(function () {
         createDatatable();
         }, 1000)*/

    }

    function getCommentHierarchy() {
        var obj = {
            0: "General Comment",
            1: "Report Writer",
            2: "Senior Reviewer"

        }

        return obj;
    }

    function getDashboardData(projectGuid, accountGuid) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
            projectDashboardOperations.getData(projectGuid, accountGuid).then(function (response) {
                self.copyProjectDetails = {};
                if (response && response.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'GET') || !response.dashboard) {
                    configureSelect2ForError();

                    self.showAlert = true;
                    self.serviceMessage = response.data.message === undefined ? "Unable to fetch records" : response.data.message.userMessage;

                    addClassToProjectUpdateAlert("error");
                    self.displayIfRecords = false;
                } else {
                    self.displayIfRecords = true;
                    self.showAlert = false;
                    self.dashboardData = response;

                    self.copyProjectDetails = angular.copy(response.dashboard.desc);
                    fillProjectDetails(response.dashboard.desc);
                    self.reportsTypesHeaderarray = response.dashboard.desc.columnSets;
                    getReportTypes(response.dashboard.desc.columnSets);
                    getReportData(response.dashboard.data);
                    $timeout(function () {
                        createDatatable(self.dashboardData);
                        configureSelect2ForSuccess();
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                }

            }, function (error) {

            })
    }

    function configureSelect2ForSuccess() {

        $('abbr').on('click', function () {

            $('.select2-search-choice-close').css("display", "none");



        });
    }

    function configureSelect2ForError() {
        $('.select2-chosen').text("Quick select a project"); //select2 error display
        $('.select2-search-choice-close').css("display", "none"); //select2 error display
        $('abbr').on('click', function () {

            $('.select2-search-choice-close').css("display", "none");



        });
    }


    function groupByGuid() {
        self.groupedGuidArray = _.groupBy(self.dashboardData.dashboard.data, function (d) {
            return d.reportTypeGuid;
        });
    }

    function fillProjectDetails(projectDetail) {
        self.reportsFinal = projectDetail.reportsFinal; // adding for cancel functionality
        self.reportsTotal = projectDetail.reportsTotal; // adding for cancel functionality
        self.projectName = projectDetail.name;

        $('.select2-chosen').text(self.projectName); // putting name in select2.js
        if (projectDetail.draftReportDue && projectDetail.draftReportDue.indexOf(':') > -1) {
            self.draftReportDue = convert(new Date(projectDetail.draftReportDue.substring(0, projectDetail.draftReportDue.length - 11)).toString());
        } else self.draftReportDue = convert(new Date(projectDetail.draftReportDue).toString());
        if (projectDetail.projectReportDue && projectDetail.projectReportDue.indexOf(':') > -1) {
            self.projectReportDue = convert(new Date(projectDetail.projectReportDue.substring(0, projectDetail.draftReportDue.length - 11)).toString());
        } else self.projectReportDue = convert(new Date(projectDetail.projectReportDue).toString());
        //self.draftReportDue = convert(new Date(projectDetail.draftReportDue).toString());
        //self.projectReportDue = convert(new Date(projectDetail.projectReportDue).toString());
        self.reportsFinalTotal = projectDetail.reportsFinal + '/' + projectDetail.reportsTotal;
    }

    function getReportTypes(columnHeaders) {
        angular.forEach(columnHeaders, function (columnSet, index) {
            self.reportTypes.push(columnSet);
        });
    }

    function getReportData(columnData) {
        angular.forEach(columnData, function (data, index) {
            self.reportTypeData.push(data);
        })
    }

    /*this.checkIfReportExists = function(reportGuid){
        angular.forEach(columnData, function (data, index) {
            if(data.reportTypeGuid === reportGuid)
            self.reportTypeData.push(data);
        })
    }*/

    this.selectProject = function () {
        angular.element('.select2-choice').val(self.projectName);
        //this.selectProjectMode = true;
    }

    this.cancelProjectSelection = function () {
        this.onEditOperation = false;
        //this.selectProjectMode = false;
    }

    this.dismissAlert = function () {
        this.showAlert = false;
        this.serviceMessage = "";
    }

    this.saveProjectDetails = function (form) {
        if (form.$invalid) {
            return;
        } else {


            this.onEditOperation = true;
            self.projectReportDue = convert(new Date(self.projectReportDue).toString());
            self.draftReportDue = convert(new Date(self.draftReportDue).toString());
            var projectReportDueDate = self.projectReportDue.replace('/', '-').replace('/', '-').split('-');
            var draftReportDue = self.draftReportDue.replace('/', '-').replace('/', '-').split('-');
            var projectDetailsObject = {
                "project": {
                    "name": self.projectName,
                    "draftDueDate": draftReportDue[2] + '-' + draftReportDue[0] + '-' + draftReportDue[1],
                    "finalDueDate": projectReportDueDate[2] + '-' + projectReportDueDate[0] + '-' + projectReportDueDate[1]
                }
            }
            projectDashboardOperations.updateProjectData(self.projectGuid, projectDetailsObject).then(function (result) {

                self.showAlert = true;
                if (result.status != undefined && result.status != 204) {
                    self.editMode = true;
                    self.serviceMessage = result.data.message.userMessage;
                    addClassToProjectUpdateAlert("error");
                } else {
                    self.copyProjectDetails.name = self.projectName;
                    /*convert(new Date(projectDetail.draftReportDue.substring(0,projectDetail.draftReportDue.length-11)).toString());*/
                    self.copyProjectDetails.draftReportDue = projectDetailsObject.project.draftDueDate;
                    self.copyProjectDetails.projectReportDue = projectDetailsObject.project.finalDueDate;
                    angular.element('.select2-choice').val(self.projectName);
                    self.editMode = false;
                    self.serviceMessage = "Project Information Updated";
                    addClassToProjectUpdateAlert("success");

                    $('.select2-chosen').text(self.projectName); // putting name in select2.js
                }
            }, function (error) {
                self.showAlert = true;
                addClassToProjectUpdateAlert("error");
                self.serviceMessage = "error";
            })
        }

    }

    function addClassToProjectUpdateAlert(status) {
        if (status === "success") {
            angular.element('#alertMsgDiv').addClass('alert-success');
            angular.element('#alertMsgDiv').removeClass('alert-danger');
        } else {
            angular.element('#alertMsgDiv').removeClass('alert-success');
            angular.element('#alertMsgDiv').addClass('alert-danger');
        }
    }

    this.cancelProjectEdit = function () {

        this.editMode = false;
        var obj = {};
        obj.name = self.copyProjectDetails.name;
        obj.projectReportDue = self.copyProjectDetails.projectReportDue;
        obj.draftReportDue = self.copyProjectDetails.draftReportDue;
        //obj.projectReportDue = convert(new Date(self.projectReportDue).toString());
        //obj.draftReportDue = convert(new Date(self.draftReportDue).toString());
        obj.reportsFinal = self.reportsFinal;
        obj.reportsTotal = self.reportsTotal;
        fillProjectDetails(obj);
    }

    $scope.generateMarkUp = function (result) {
        var markup = "<div>";
        markup += "<div>" + result.name + "</div>";
        markup += "</div>";
        return markup;
    }

    $scope.displayProject = function (result) {

        if (JSON.stringify(result) != "{}") {

            $('.select2-chosen').text(result.name);
            $('.select2-search-choice-close').css("display", "block");
            $state.go($state.current, {
                projectGuid: result.projectGUID,
                accountGuid: self.accountGuid,
                companyGuid: self.companyGuid
            }, {
                reload: true
            });
        } else {
            $('.select2-chosen').text(self.projectName);
            $('.select2-search-choice-close').css("display", "block");
        }
    }

    $scope.projectListProvider = {
        readData: function (term, page, pageSize) {
            if (term != undefined) {

                if (self.readDataCount == 0) {
                    projectDashboardOperations.setTerm(term);
                    self.readDataCount = self.readDataCount + 1;
                    self.readDataPage = page - 1;
                } else {
                    if ($('.select2-input').val() == projectDashboardOperations.getTerm()) {
                        self.readDataPage = self.readDataPage + pageSize;
                    } else {
                        projectDashboardOperations.setTerm(term);
                        self.readDataPage = page - 1;
                    }

                }
            }
            var deferred = $q.defer();
            if (term == "") {

                projectDashboardOperations.getProjectListData({

                        limit: pageSize,
                        offset: (page * pageSize) - pageSize
                    })
                    .then(function (result) {


                        deferred.resolve(result.projects);
                    }, function (reason) {

                        deferred.reject(reason);
                    });
            } else if (term != "") {


                projectDashboardOperations.getProjectSearchData({

                        limit: pageSize,
                        offset: (page * pageSize) - pageSize,
                        projectName: term

                    })
                    .then(function (result) {


                        deferred.resolve(result.projects);
                    }, function (reason) {

                        deferred.reject(reason);
                    });

            }



            return deferred.promise;
        }
    };



    function convert(str) {
        var mnths = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
        };
        date = str.split(" ");

        return [mnths[date[1]], date[2], date[3]].join("/");
    }

    this.editProject = function (project) {
        self.showAlert = false;
        this.editMode = true;
			$timeout(function () {
			$('#projectName').focus();
		});
    }
	
    

    this.showProjectMap = function () {
        this.projectMapUrl = $state.href('projectMap', {
            projectGuid: self.projectGuid,
            accountGuid: self.accountGuid
        });

    }

    this.orderStatus = function () {
        this.orderStatusUrl = $state.href('orderStatus', {
            projectGuid: self.projectGuid,
            accountGuid: self.accountGuid,
            projectName: self.projectName
        });
    }

    this.portfolioDownload = function () {
        this.portfolioDownloadUrl = $state.href('Portfolio.Select', {
            projectGuid: self.projectGuid,
            accountGuid: self.accountGuid,
            companyGuid: self.companyGuid

        });
    }

    this.portfolioSignTool = function () {
        this.portfolioSignToolUrl = $state.href('portfolioSignatureTool', {
            projectGuid: self.projectGuid,
            accountGuid: self.accountGuid,
            companyGuid: self.companyGuid
        });
    }

    this.generateProjectDashboardPdf = function (event) {

        var newWindow = window.open("", "_blank");
        projectDashboardOperations.getPDF(self.projectGuid, self.accountGuid).then(function (result) {

            if (result.outputDocument) {
                newWindow.location.href = result.outputDocument;
            } else {
                $(newWindow.document.body).html("<h2>pdf not found</h2>");
                self.showAlert = true;
                addClassToProjectUpdateAlert("error");
                self.serviceMessage = "PDF not found.";
            }

        }, function (error) {
            self.showAlert = true;
            addClassToProjectUpdateAlert("error");

            self.serviceMessage = "error";

        })
    }

    this.checkIfSigned = function (signerName) {
        if (signerName != "") return true;
        else return false;
    }

    /* this.checkAccess = function () {
         return true;
     }*/

    this.checkUncheckAllTasks = function (val, tableIndex, taskHeaderIndex, reportTypeGuid) {
        self.parentTaskObj.tasks = [];

        angular.forEach(self.reportTypeData, function (data, index) {
            self.projectGuidForTasks = data.projectGuid;
            if (data.reportTypeGuid === reportTypeGuid) {
                angular.forEach(data.tasks, function (task, childIndex) {

                    if (childIndex === taskHeaderIndex) {
                        if (val) {
                            task.status = true;
                            updateBulkTask(true, task.taskGuid, task.labelMappingGuid, task.reportGuid);
                        } else {
                            task.status = false;
                            updateBulkTask(false, task.taskGuid, task.labelMappingGuid, task.reportGuid);
                        }
                    } else {
                        return;
                    }

                })


            }
        })
        updateTasks(self.parentTaskObj, self.projectGuidForTasks);

    }

    function updateBulkTask(status, taskGuid, labelMappingGuid, reportGuid) {
        var obj = {
            "taskGuid": taskGuid,
            "status": status,
            "labelMappingGuid": labelMappingGuid,
            "reportGuid": reportGuid
        }
        self.parentTaskObj.tasks.push(obj);

    }

    this.open = {
        date1: false,
        date2: false,
    };

    // Disable weekend selection
    this.disabled = function (date, mode) {
        return (mode === 'day' && (new Date().toDateString() == date.toDateString()));
    };

    this.dateOptions = {
        showWeeks: false,
        startingDay: 1,
        format: 'MM/dd/YYYY'
    };

    this.timeOptions = {
        readonlyInput: true,
        showMeridian: false
    };

    this.openCalendar = function (e, date) {
        e.preventDefault();
        e.stopPropagation();
        this.open[date] = true;
    };

    this.closeCalendar = function (e, date) {
        e.preventDefault();
        e.stopPropagation();

        this.open[date] = false;
    };

    this.openCalendarOnFocus = function (e, currentTabDate, previousTabDate) {
        e.preventDefault();
        e.stopPropagation();
        if (this.open[previousTabDate]) {
            this.open[previousTabDate] = false;
        }
        this.open[currentTabDate] = true;
    };

    this.redirectToReports = function (reportGuid) {

        $state.go('ReportAuthoring.Write', {
            projectGuid: self.projectGuid,
            reportGuid: reportGuid
        });

    }

    this.changeReportStatus = function (reportGuid, reportTypeGuid, reportStatus, reportStatusGuid) {


        //var reportStatuses = projectDashboardOperations.getReportStatusArray();
        var resolveObj = {
            /*reportStatusArray: function () {
                return reportStatuses;

            },*/
            reportStatusObj: function () {
                var obj = {
                    reportGuid: reportGuid,
                    reportTypeGuid: reportTypeGuid,
                    reportStatus: reportStatus,
                    reportStatusGuid: reportStatusGuid,
                    reportStatusList: self.dashboardData.dashboard.desc.reportStatusList
                }
                return obj;

            }


        }

        projectDashboardOperations.openPopUp($scope, 0, resolveObj, "reportStatus", "static",false);


    }

    this.showSiteDetails = function (item) {
        self.showReportsAlert = false;
        reportGridDataOperations.getSiteInformation(item.reportGuid).then(function (result) {
            if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'GET')) {
                addClassToReportsAlerts('error');
                self.showReportsAlert = true;
                self.serviceReportsMessage = result.data.message.userMessage;
            } else {
                self.showReportsAlert = false;
                var resolveObj = {
                    siteObj: function () {
                        var obj = {
                            reportGuid: item.reportGuid,
                            siteDetails: result

                        }
                        return obj;


                    }
                }
                projectDashboardOperations.openPopUp($scope, 0, resolveObj, "openSiteDetails", "static",false);
            }

        })

    }

    function addClassToReportsAlerts(status) {
        if (status === "success") {
            angular.element('#alertReportOperationsMsgDiv').addClass('alert-success');
            angular.element('#alertReportOperationsMsgDiv').removeClass('alert-danger');
        } else {
            angular.element('#alertReportOperationsMsgDiv').removeClass('alert-success');
            angular.element('#alertReportOperationsMsgDiv').addClass('alert-danger');
        }
    }

    this.dismissReportsAlert = function () {
        self.showReportsAlert = false;
        self.serviceReportsMessage = "";
    }

    this.deleteReport = function (reportGuid) {
        var resolveObj = {
            reportGuid: function () {

                return reportGuid;


            }
        }
        projectDashboardOperations.openPopUp($scope, 0, resolveObj, "deleteReport", true,false);
    }

    this.updateTaskStatus = function ($event, reportGuid, projectGuid, taskGuid, status, labelMappingGuid) {

        self.showReportsAlert = false;
        self.parentTaskObj.tasks = [];
        var obj = {
            "taskGuid": taskGuid,
            "status": status,
            "labelMappingGuid": labelMappingGuid,
            "reportGuid": reportGuid
        }
        self.parentTaskObj.tasks.push(obj);
        updateTasks(self.parentTaskObj, projectGuid);
    }

    function updateTasks(parentTaskObj, projectGuid) {
        reportGridDataOperations.updateTaskStatus(self.parentTaskObj, projectGuid).then(function (result) {
            if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'PUT')) {
                addClassToReportsAlerts("error");
                self.serviceReportsMessage = result.data.message.userMessage;
                alertMessage('Error', 'error', self.serviceReportsMessage);
            } else {
                addClassToReportsAlerts("success");
                self.serviceReportsMessage = "Task/Tasks status updated";
                alertMessage('Updated', 'success', self.serviceReportsMessage);
                //$state.reload();
            }
            // self.showReportsAlert = true;

        }, function (error) {
            // self.showReportsAlert = false;
            alertMessage('Error', 'error', error);
        })
    }

    function alertMessage(title, type, msg) {
        new PNotify({
            title: title,
            text: msg,
            type: type,
            addclass: "stack-topright",
            styling: "fontawesome"
        });
    }

    this.updateSignature = function (reportGuid, signatureObject, dataTableIndex, signatureIndex) {



        var count = 0;
        var id = "dataTable-" + dataTableIndex;
        var table = $('#' + id).DataTable();
        $('#' + id).find('tbody').on('click', 'td', function () {
            if (count == 0) {
                count = 1;
                var idx = table.cell(this).index().column;
                var title = table.column(idx).header();

                var resolveObj = {
                    resolveObj: function () {
                        var obj = {
                            reportGuid: reportGuid,
                            signatureObj: signatureObject,
                            signerType: title.innerText
                        }
                        return obj;
                    }
                }
                projectDashboardOperations.openPopUp($scope, 0, resolveObj, "reportSignOff", "static",false);
            }

        })



    }

    self.initSignature = function (signature, tableIndex, index, reportIndex) {
        if (signature.signerAccountGuid != null) {

            self.isSigned[tableIndex + '' + index + '' + reportIndex] = true;

        } else {

            self.isSigned[tableIndex + '' + index + '' + reportIndex] = false;
        }
    }

    self.showCheckBox = function (signatureObject, reportType) {
        if (signatureObject != undefined && signatureObject.label) {
            var signatureLabelsArray = [];
            angular.forEach(reportType.columns, function (column, index) {
                if (column.type === 'Signature') {
                    signatureLabelsArray.push(column.label.toLowerCase());
                }

            })

            if (signatureLabelsArray.indexOf(signatureObject.label.toLowerCase()) > -1) {
                return true;
            } else {
                return false;
            }


        } else {
            return false;
        }
    }

    function createDatatable(tableData) {
        for (var i = 0; i < tableData.dashboard.desc.columnSets.length; i++) {
            var columnDefs = [];
            var id = "dataTable-" + i;

            angular.forEach($("#" + id).find('thead tr th'), function (elem, index) {
                if ($(elem).hasClass('taskStatus')) {

                    var taskStatusColumnObj = {
                        targets: index,
                        orderable: false
                    }
                    columnDefs.push(taskStatusColumnObj);
                }
                if ($(elem).hasClass('signature')) {

                    var signatureColumnObj = {
                        targets: index,
                        orderable: false
                    }
                    columnDefs.push(signatureColumnObj);
                }
                if ($(elem).hasClass('comments')) {

                    var commentsColumnObj = {
                        targets: index,
                        orderable: false
                    }
                    columnDefs.push(commentsColumnObj);
                }
                if ($(elem).hasClass('reportRedirection')) {

                    var reportRedirectionColumnObj = {
                        targets: index,
                        orderable: false
                    }
                    columnDefs.push(reportRedirectionColumnObj);
                }
                if ($(elem).hasClass('email')) {

                    var emailColumnObj = {
                        targets: index,
                        orderable: false
                    }
                    columnDefs.push(emailColumnObj);
                }
                if ($(elem).hasClass('reportDeletion')) {

                    var reportDeletionObj = {
                        targets: index,
                        orderable: false
                    }
                    columnDefs.push(reportDeletionObj);
                }

            })

            var table = $("#" + id).DataTable({
                order: [],
                pageLength: 5,
                paging: false,
                info: false,
                filter: false,
                columnDefs: columnDefs,
                stateSave: true
            });

            /*if(table.data().length === 0){
               var datatableWrapperId = id + "_wrapper";
               $("#" + datatableWrapperId).parents('#reportsDiv').hide();
            }*/

        }
    }


    this.getAppendix = function (reportGuid, sectionGuid, count) {

        if (count > 0) {
            var link = "index.html#/appendixFileList?reportGuid=" + reportGuid + "&sectionGuid=" + sectionGuid;
            var name = "appendixwindow";
            openwindow(link, name, 500, 600);
        }
    }

    this.addPointerClass = function (appendice) {
        if (appendice.count > 0) {
            return "pointer";
        }
    }

    this.sendEmail = function () {
        this.sendEmailUrl = $state.href('sendEmail', {
            projectGuid: self.projectGuid,
            accountGuid: self.accountGuid,
            companyGuid: self.companyGuid
        });
		$('.sendEmail').blur();
    }




    $scope.$on('event:data-updated', function (ev, args) {

        $state.reload();
    })

    $scope.$on('event:alert-message', function (status, message) {
        self.showAlert = true;
        self.serviceMessage = message;
        addClassToProjectUpdateAlert(status);
    })

    this.showCommentsInTOC = function (data) {
        var link = 'index.html#' + '/TOC?reportGuid=' + data.reportGuid + '&reportType=' + data.reportType;
        var name = "tocwindow";
        openwindow(link, name, 500, 600);
    }




    function openwindow(link, name, width, height) {
        $window.open(link, name, width = width, height = height);
    }

}])

angular.module('ProjectDashboard').controller('DeleteReportController', ['$scope', '$modalInstance', 'reportGridDataOperations', 'reportGuid', 'checkStatus', function ($scope, $modalInstance, reportGridDataOperations, reportGuid, checkStatus) {
    var self = this;

    this.cancelDelete = function () {
        $modalInstance.close();
    }
    this.confirmDelete = function () {

        reportGridDataOperations.deleteReports(reportGuid).then(function (result) {
            if (result.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'POST')) {
                self.serviceMessage = result.data.message.userMessage;
                self.exception = true;

            } else {

                self.exception = false;
                $modalInstance.close(true);


            }
        }, function (error) {

        })

    }
}])


angular.module('ProjectDashboard').controller('DashoboardTOC', ['$scope', 'ReportAuthoringAPI', '$stateParams', 'reportGridDataOperations', function ($scope, ReportAuthoringAPI, $stateParams, reportGridDataOperations) {
    var self = this;

    init();

    function init() {
        self.obj = {};
        getTOC();

    }

    function getTOC() {
        self.reportTypeName = $stateParams.reportType;
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
            reportGridDataOperations.getTOC($stateParams.reportGuid, 'DEEP').then(function (response) {
                self.appendices = response.appendices;
                self.sections =
                    response.tableOfContent.sections;
                var first = response.tableOfContent.sections[0];
                self.obj.selectedSection = first.sectionGUID;
                self.selectedSection = first;

            })

        /*var promise = ReportAuthoringAPI.getToC($stateParams.reportGuid);
        return promise.then(function (tocSections) {
            self.sections =
                tocSections;
            var first = tocSections[0];
            self.obj.selectedSection = first.sectionID;
            self.selectedSection = first;
        });*/
    }
}])
