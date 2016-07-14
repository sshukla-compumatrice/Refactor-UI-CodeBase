angular.module('ParcelUI').controller('DashBoardCtrl', ['$timeout', '$rootScope', '$scope', '$compile',
    'DashboardAPI', '$filter', '$state', '$location', 'BASEURL', 'projectDashboardOperations', '$q', '$interval', 'appBridgeConstants', 'AuthFactory', 'globalValues',
    function ($timeout, $rootScope, $scope, $compile, DashboardAPI, $filter,
        $state, $location, BASEURL, projectDashboardOperations, $q, $interval, appBridgeConstants, AuthFactory, globalValues) {


        var self = this;
        var scope = $scope;
        window.sessionStorage.removeItem("currentTocSectionId");
        window.sessionStorage.removeItem("currentSectionId");
        // self.recentViewReports = viewedRecentReports;
        self.isRefactorBridgeLinked = appBridgeConstants.IS_BRIDGE_LINKED;
        $rootScope.refactorDash = true;
        self.activityLoader = {
            promise: null,
            templateUrl: '',
            message: 'Please Wait...',
            backdrop: true,
            delay: 0,
            minDuration: 0
        };


        $scope.$on('load-datatable', function () {
            init();
        });

        function init() {
            self.recentViewReports = [];
            self.currentUserCompanyGuid = globalValues.currentUserCompanyGuid;
            self.currentUserOfficeGuid = globalValues.currentUserOfficeGuid;
            self.currentUserGuid = globalValues.currentUserGuid;

            $('body').addClass('body-padding');
            self.accountGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');

            self.companyGuid = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');

            self.localStorageKey = "DataTable_LandingPageGrid";
            self.statusFilter = "";

            getDataForDashboard();
            getDataForActivityService();
        }

        function getDataForActivityService() {
            $('.report-panel').addClass('recentview-report');
            var recentlyViewedReportsKey = "";
            var cachedActivityObj = {};
            var cachedActivity = localStorage.getItem("UserActivities");
            if (cachedActivity && cachedActivity.length) {
                cachedActivityObj = JSON.parse(cachedActivity);
                if (cachedActivityObj && cachedActivityObj.recentlyViewedReportsActivity && cachedActivityObj.recentlyViewedReportsActivity.activityAssociationUserGuid == self.accountGuid && cachedActivityObj.recentlyViewedReportsActivity.activityKey) {
                    recentlyViewedReportsKey = cachedActivityObj.recentlyViewedReportsActivity.activityKey;
                } else {
                    localStorage.removeItem("UserActivities");
                }
            }

            if (recentlyViewedReportsKey) {
                //GET activity items from cached activity key
                self.activityLoader.promise = DashboardAPI.getActivityItems(recentlyViewedReportsKey, false, "User", self.currentUserGuid, "distinct", "100", false).then(function (activityData) {
                    if (activityData && activityData.activityItems && activityData.activityItems.length) {
                        if (activityData.activityItems && activityData.activityItems.length) {
                            for (var i = 0; i < activityData.activityItems.length; i++) {
                                self.recentViewReports.push(activityData.activityItems[i]);
                            }
                        }
                    }
                }).finally(function () {
                    $('.report-panel').removeClass('recentview-report');
                });
            } else {
                self.activityLoader.promise = DashboardAPI.getActivities("Recently+Opened+Files", self.currentUserGuid, "User", "activityitemsdistinct", "100", false).then(function (activityData) {
                    if (activityData && activityData.activities && activityData.activities.length && activityData.activities[0] != null) {
                        var activityObj = {
                            "recentlyViewedReportsActivity": {
                                "activityAssociationUserGuid": self.currentUserGuid,
                                "activityKey": activityData.activities[0].activityGUID ? activityData.activities[0].activityGUID : ""
                            }
                        };
                        localStorage.setItem("UserActivities", JSON.stringify(activityObj));
                        angular.forEach(activityData.activities, function (item, key) {
                            if (item && item != null && item.activityItemsDistinct && item.activityItemsDistinct.length) {
                                for (var i = 0; i < item.activityItemsDistinct.length; i++) {
                                    self.recentViewReports.push(item.activityItemsDistinct[i]);
                                }
                            }
                        });
                    }
                }).finally(function () {
                    $('.report-panel').removeClass('recentview-report');
                });
            }
        }


        this.grantAccessToReport = function (projectGuid) {
            if (typeof projectGuid === 'undefined') {
                alert('Please select the row with SiteID or PID for which you want to Grant Access');
                return false;
            } else {
                $state.go('grantAccess', {
                    projectGuid: projectGuid,
                    prevState: 'ProjectDashboard'
                });
            }
        }

        function getDataForDashboard() {
            $('.goto-project').prop('disabled', true);
            $scope.delay = 0;
            $scope.minDuration = 0;
            $scope.message = 'Please Wait...';
            $scope.backdrop = true;
            $scope.promise = DashboardAPI.getReports(self.accountGuid).then(function (response) {
                self.dashboardData = response;
                fillDataTable();
                showSelect2();
                initializeDateRangeFilter();

            });
        }

        self.setRefactorDashFlag = function (flag) {
            $rootScope.refactorDash = flag;
        }

        self.getClass = function (str) {
            var length = self.recentViewReports ? self.recentViewReports.length : 0;
            if (str == "panel") {
                if (length <= 6)
                    return 'maximized';
                else
                    return 'default';
            } else {
                if (length <= 6)
                    return 'text-muted';
                else
                    return 'pointer';
            }
        }

        self.filterByStatus = function () {
            var filteredResultSet = [];
            $("#landingpageTable_processing").css('visibility', 'visible');
            switch (self.statusFilter) {

                case "0":
                    filteredResultSet = $filter('filter')(self.dashboardData.data, {
                        reportStatus: "!Final"
                    }, true);
                    break;
                case "1":
                    filteredResultSet = $filter('filter')(self.dashboardData.data, {
                        reportStatus: "Final"
                    }, true);
                    break;
                default:
                    filteredResultSet = angular.copy(self.dashboardData.data);

            }

            $scope.dataTable.clear().draw();
            $scope.dataTable.rows.add(filteredResultSet);
            $scope.dataTable.draw();
        }

        self.goToProject = function () {
            if (self.selectedProject && self.selectedProject != "") {
                $state.go('projectDashboard', {
                    projectGuid: self.selectedProject.projectGUID,
                    accountGuid: self.accountGuid,
                    companyGuid: self.companyGuid,
                    reportGuid: self.reportGuid
                });
            }
        }

        self.targetArr = [];

        function fillDataTable() {
            $(document).ready(function () {

                var columnDefs = [];
                self.dashboardData.desc.columns = [
                    {
                        "orderIndex": 0,
                        "title": "R",
                        "data": null,
                        "sortable": false,
                        "render": function (data, type, full) {
                            return '<a title="Enter this report or project" class = "btn btn-warning btn-xs report-write-link" href="#/ReportAuthoring/Write?projectGuid=' + data.projectGuid + '&reportGuid=' + data.reportGuid + '"' + '><span class="fa fa-file-text fa-inverse"></span></a>';
                        }
                    },
                    {
                        "orderIndex": 1,
                        "title": "P",
                        "data": null,
                        "sortable": false,
                        "class": "projectDashboardIcon",

                        "render": function (data, type, full) {
                            return '<a title="Enter this project" class = "btn btn-warning btn-xs" href="#/projectDashboard?projectGuid=' + data.projectGuid + '&accountGuid=' + self.accountGuid + '&companyGuid=' + self.companyGuid + '"' + '><span class= "glyphicon glyphicon-duplicate"></span></a>';
                        }

                    },
                    {
                        "orderIndex": 2,
                        "title": "Project",
                        "data": "projectName",
                        "visible": true
                    },
                    {
                        "orderIndex": 3,
                        "title": "Client Prop.#",
                        "data": "propertyNumber",
                        "visible": true
                    },
                    {

                        "orderIndex": 4,
                        "title": "Site Name",
                        "data": "siteName",
                        "visible": true
                    },

                    {
                        "orderIndex": 5,
                        "title": "Address",
                        "data": "address",
                        "visible": true
                    },
                    {
                        "orderIndex": 6,
                        "title": "City",
                        "data": "city",
                        "visible": true
                    },
                    {
                        "orderIndex": 7,
                        "title": "State",
                        "data": "state",
                        "visible": true
                    },
                    {
                        "orderIndex": 8,
                        "title": "Report Type",
                        "data": "reportTypeName",
                        "visible": true
                    },
                    {
                        "orderIndex": 9,
                        "title": "Creation Date",
                        "data": "creationDateTime",
                        "visible": true,
                        "orderData": 11,
                        "render": function (data, type, full) {
                            var creationDate = new Date(parseFloat(data));
                            return (creationDate.getMonth() + 1) + '/' + creationDate.getDate() + '/' + creationDate.getFullYear();
                        }
                    },
                    {
                        "orderIndex": 10,
                        "title": "Site ID",
                        "data": "siteID",
                        "visible": true
                    },
                    {
                        "orderIndex": 11,
                        "title": "hidden field",
                        "data": "creationDateTime",
                        "visible": false
                    }
                ]
                self.sortedCols = $filter('orderBy')(self.dashboardData.desc.columns, "orderIndex");
                angular.forEach(self.sortedCols, function (col, index) {
                    var def = angular.copy(col);
                    def.targets = index;
                    def.name = def.data;
                    self.targetArr.push(index);
                    def.sortable = ("sortable" in def) ? def.sortable : true;
                    delete def.orderIndex;
                    columnDefs.push(def);
                });

                $('#landingpageTable')
                    .on('order.dt', function (e, settings, column, state) {
                        eventFired(e, settings, column, state);
                    })
                    .on('search.dt', function (e, settings, column, state) {
                        eventFired(e, settings, column, state);
                    })
                    .on('page.dt', function (e, settings, column, state) {
                        eventFired(e, settings, column, state);
                    })
                    .on('length.dt', function (e, settings, column, state) {
                        eventFired(e, settings, column, state);
                    })
                    .on('column-visibility.dt', function (e, settings, column, state) {

                        eventFired(e, settings, column, state);
                    })
                var eventFired = function (e, settings, column, state) {
                    $timeout(function () {
                        $('#landingpageTable tbody tr td').each(function () {
                            this.setAttribute('title', $(this).text());
                        });
                    });
                }

                $scope.dataTable = $('#landingpageTable').DataTable({

                    "dom": '<"toolbar pull-left col-md-4 col-xs-12 btn-group"B><"col-md-4 col-xs-12 text-right nopadding"p><"col-md-4 col-xs-12 text-right"i>r<"dashboard-table pull-left"t > ',
                    "processing": true,
                    "responsive": true,
                    "data": self.dashboardData.data,
                    "orderCellsTop": true,
                    "bInfo": true,
                    "iDisplayLength": 100,
                    "autoWidth": false,
                    "initComplete": function () {
                        $('#landingpageTable tbody tr').each(function () {
                            $(this).find('td:eq(0)').css('white-space', 'nowrap');

                        });
                        $('.csvHtml5').parents('a').attr('title', 'Export to CSV');
                        insertFilterInputHTML();
                    },
                    "language": {
                        "lengthMenu": "Per page: _MENU_",
                        "infoFiltered": "",
                        "paginate": {
                            "previous": '<i class="fa fa-caret-left" ></i>',
                            "next": '<i class="fa fa-caret-right" ></i>',
                        },
                    },
                    "stateSave": true,
                    "stateSaveCallback": function (settings, data) {
                        localStorage.setItem(self.localStorageKey, JSON.stringify(data));
                    },
                    "stateLoadCallback": function () {
                        return JSON.parse(localStorage.getItem(self.localStorageKey));
                    },
                    "stateLoadParams": function (settings, data) {
                        for (var i = 0; i < data.columns.length; i++) {
                            data.columns[i].search.search = "";
                        }
                        data.search.search = "";
                    },
                    "buttons": [{
                            extend: 'csvHtml5',
                            text: '<i class="csvHtml5 fa fa-clipboard fa-lg"></i>'
                    }
                    ],

                    "columnDefs": columnDefs,
                    "lengthMenu": [
                        [10, 25, 50, 100, 250, 500, -1],
                        [10, 25, 50, 100, 250, 500, "All"]
                    ],
                    "paging": true,
                    "ordering": true,
                    "info": false,
                    "filter": true,
                    "searching": true,
                    "order": [], //[[0, "asc"]],

                    "serverSide": false,
                    "colReorder": true

                });

                $("#landingpageTable_wrapper div.toolbar").prepend("<div class='btn-group pull-left'><div class='settings-button btn-group' aria-haspopup='true' aria-expanded='false' id='openOrdersSettingsButton' ng-click='dashboard.settings()' data-placement='right'><a id='column-setting' data-toggle='tooltip' data-placement='left' title='Choose Columns' items='dashboard.columns' class='column-settings pointer btn btn-default decoration-n'><span class='glyphicon glyphicon-new-window'></span> Columns</a> </div><button data-toggle='tooltip' data-placement='left' title='Reload Grid'  class='btn btn-md btn-default' ng-click='dashboard.reloadData()'><i class='fa fa-refresh'></i></button><button data-toggle='tooltip' data-placement='left' title='Clear Column Filters' class='btn btn-md btn-default' ng-click='dashboard.clearAllFilter()'>Clear</button></div>");
                $compile($("#landingpageTable_wrapper div.toolbar"))($scope)

                angular.element('.settings').popover({
                    html: true,
                    container: 'body',
                    trigger: 'manual',
                    title: 'Custom Range',
                    content: showContentDate(),
                    template: '<div id="settings-popover" class="popover popover-large"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
                });



                $('.settings').click(function (e) {
                    if ($('.settings').val() == 3)
                        $('.settings').popover('show');
                    else
                        $('.settings').popover('hide');
                });

                function showContentDate() {
                    var itemsTemplate = '<div class="row">' +
                        '<div class="col-md-6 col-xs-12 input-group date">' +
                        "<input id='minDate' type='text' class='form-control datePicker' />" +
                        '</div>' +
                        '<div class="col-md-6 col-xs-12 input-group date">' +
                        "<input id='maxDate' type='text' class='form-control datePicker' />" +
                        '</div>' +
                        '</div>  </br>' +
                        '<div class="pull-right"><button class="btn-sm btn" ng-click="dashboard.submitValues(date)">go</button><button close-popover class="btn-sm btn" ng-click="dashboard.closeDateSettingsPopup()">Close</button>';
                    return $compile(itemsTemplate)($scope);
                }

                $('body').on('click', 'input.datePicker', function (event) {
                    $(this).datepicker({
                        showOn: 'focus',
                        yearRange: '1900:+0',
                        changeMonth: true,
                        changeYear: true
                    }).focus();
                });

                angular.element('.settings-button').popover({
                    html: true,
                    container: 'body',
                    trigger: 'manual',
                    title: 'Select Columns',
                    content: showContent(),
                    template: '<div id="settings-popover" class="popover popover-large column-popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
                });

                $('.column-settings').click(function (e) {

                    e.preventDefault();
                    var tab = $(this).attr('data-tab');
                    $('.settings-button').popover('show');

                });
                $('input.global_filter').on('keyup click', function () {
                    filterGlobal();
                });

                $('#landingpageTable tbody tr').click(function () {
                    var allData = $scope.dataTable;
                    self.projectGuid = allData.row(this).data().projectGuid;
                    self.reportGuid = allData.row(this).data().reportGuid;
                });

                function showContent() {

                    var itemsTemplate = '<div class="row bottom-margin-sm list-group" ui-sortable ng-model="dashboard.columns">' +
                        '<div class="col-md-12 col-xs-12 list-group-item cursor-move padding-15" ng-repeat="item in dashboard.columns" ng-hide="$index==0 || $index==1 || $index == 11">' +
                        '<div class="checkbox margin-5"  ><i class="fa fa-arrows-v cursor-move"></i>&nbsp;&nbsp;<label><input ng-model="item.visible" class="column-settings-checkbox" columnindex = "{{item.index}}"' +
                        'type="checkbox"></input> {{item.name}} </label> </div>' +
                        '</div> </div> ' +
                        '<div class="text-right bottom-margin-sm"><button close-popover class="btn-sm btn btn-default" ng-click="dashboard.closeSettingsPopup()">Close</button><button close-popover class="btn-sm marginLeft btn btn-primary" ng-click="dashboard.saveSettingsPopup()">Save</button>';

                    return $compile(itemsTemplate)($scope);
                }

                // Dashboard row bouble click event
                $('#landingpageTable tbody').on('dblclick', 'tr', function () {
                    //$state.go('ReportAuthoring.Write');
                    window.location.assign(this.getElementsByClassName('report-write-link')[0].href);
                });

                // Highlight row on row single click
                $('#landingpageTable tbody').on('click', 'tr', function () {
                    $scope.dataTable.$('tr.row-selected').removeClass('row-selected');
                    $(this).addClass('row-selected');
                    var allData = $scope.dataTable;
                    self.projectGuid = allData.row(this).data().projectGuid;
                    self.reportGuid = allData.row(this).data().reportGuid;
                });
            });
        }

        function insertFilterInputHTML() {
            $('#landingpageTable thead tr#filterrow th').each(function () {
                var title = $('#landingpageTable thead th').eq($(this).index()).text();
                if (title != "" && title != "R" && title != "P") {
                    var elemHtml = '<form class="form-inline" > <div class="input-group filterinput"><input type="text"  class="form-control input-xs "  ng-click="stopPropagation($event);" text-change = ' + title.split(" ").join("") + ' /><span title="Clear Search Value" class="input-group-addon input-xs pointer" ng-click="clearFilter($event);">x</span></div> </form>';
                    var compiledHtml = $compile(elemHtml)(scope);
                    $(this).html(compiledHtml);
                }
            });
        }

        function initializeDateRangeFilter() {
            $(function () {
                function cb(start, end, title) {
                    if (title && title != "Custom Range") {
                        $('#reportrange span').html(title);
                    } else {
                        $('#reportrange span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
                    }
                }

                $('#reportrange').daterangepicker({
                    "showDropdowns": true,
                    "opens": "right",
                    "autoApply": true,
                    "ranges": {
                        'Last 90 Days': [moment().subtract(90, 'days'), moment(), 'Last 90 Days'],
                        'This Year': [moment().startOf('year'), moment(), 'This Year'],
                        'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year'), 'Last Year'],
                        'All Time': [moment().subtract(10, 'year'), moment(), 'All Time']
                    },
                    "startDate": moment().subtract(90, 'days'),
                    "endDate": moment()
                }, cb);

                // to apply default filter
                $timeout(function () {
                    var startMoment = moment().subtract(90, 'days');
                    var endMoment = moment();
                    cb(startMoment, endMoment, 'Last 90 Days');
                    $("input[name=daterangepicker_start]").val(startMoment.format('MMMM D, YYYY'));
                    $("input[name=daterangepicker_end]").val(endMoment.format('MMMM D, YYYY'));
                    $scope.dataTable.draw();
                });

                /*$('#reportrange').on('apply.daterangepicker', function (ev, picker) {
                    self.dateRange_start = picker.startDate._d;
                    self.dateRange_end = picker.endDate._d;
                    $scope.dataTable.draw();
                });*/

                $('#reportrange').on('hide.daterangepicker', function (ev, picker) {
                    self.dateRange_start = picker.startDate._d;
                    self.dateRange_end = picker.endDate._d;
                    if (picker.chosenLabel == "Custom Range") {
                        self.dateRange_end = moment(picker.endDate._d).subtract(1, 'day')._d;
                    }
                    $scope.dataTable.draw();
                });
            });
        }

        this.submitValues = function (date) {
            $scope.minVal = new Date('10/21/2014');
            $scope.maxVal = new Date('10/21/2015');

            $scope.dataTable.draw();
            $scope.dataTable.state.save();
        }

        this.saveSettings = function () {
            $scope.dataTable.state.save();
        }

        this.saveSettingsPopup = function () {
            var columnDefs = angular.copy(self.dashboardData.desc.columns);
            angular.forEach(this.columns, function (col, index) {
                var originalIndex = col.index;
                var result = columnDefs.filter(function (item) {
                    return item.data == col.field;
                });
                if (result && result.length) {
                    var first = result[0];
                    first.orderIndex = index;
                    first.visible = col.visible;
                }
            });
            applyPopupSettings();
        }

        function applyPopupSettings() {
            var reorder = [];
            angular.forEach(self.columns, function (item) {
                var column = $scope.dataTable.column(item.index);
                column.visible(item.visible);
                reorder.push(item.index);
            });

            $scope.dataTable.colReorder.order(reorder);
            $('.settings-button').popover('hide');
            insertFilterInputHTML();
        }

        this.closeSettingsPopup = function () {
            $('.settings-button').popover('hide');
        }

        this.closeDateSettingsPopup = function () {
            $('.settings').popover('hide');
        }


        this.hideshowColumns = function (item) {
            console.log("dashboard items: " + item);
            var column = $scope.dataTable.column(item.index);
            // toggel visibility
            column.visible(!column.visible());
        }


        this.settings = function () {
            this.columns = [];
            for (var i = 0; i < $scope.dataTable.context[0].aoColumns.length; i++) {
                this.obj = {};
                this.obj.name = $scope.dataTable.context[0].aoColumns[i].title;
                this.obj.field = $scope.dataTable.context[0].aoColumns[i].data;
                this.obj.index = i;
                this.obj.visible = $scope.dataTable.context[0].aoColumns[i].bVisible;
                if (this.obj.name != "R" && this.obj.name != "P") {
                    this.obj.isVisible = true;
                    // this.columns.push(this.obj);
                }
                this.columns.push(this.obj);
            }
        }

        $scope.stopPropagation = function (evt) {
            if (evt.stopPropagation !== undefined) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        }

        function fnResetAllFilters(oTable) {
            var oSettings = oTable.settings();
            for (iCol = 0; iCol < oSettings[0].aoPreSearchCols.length; iCol++) {
                oSettings[0].aoPreSearchCols[iCol].sSearch = '';
            }
            oSettings[0].oPreviousSearch.sSearch = '';
            oTable.draw();
        }

        this.clearAllFilter = function () {
            clearFilterTextFronLS();
            $('#landingpageTable thead tr#filterrow th :input').val("");
            fnResetAllFilters($scope.dataTable);
        }

        function clearFilterTextFronLS() {
            var key = self.localStorageKey;
            var rawVal = localStorage.getItem(key);
            var json = JSON.parse(rawVal);
            angular.forEach(json.columns, function (col) {
                if (col && col.search && col.search.search) {
                    col.search.search = "";
                }
            });
            localStorage.setItem(self.localStorageKey, JSON.stringify(json));
        }

        function getDashboardData_withPromise(accountGuid) {
            return DashboardAPI.getReports(accountGuid).then(function (dashboard) {
                return dashboard;
            });
        }

        self.reloadData = function () {
            $scope.delay = 0;
            $scope.minDuration = 0;
            $scope.message = 'Please Wait...';
            $scope.backdrop = true;
            self.clearAllFilter();
            $scope.promise = DashboardAPI.getReports(self.accountGuid).then(function (response) {
                self.dashboardData = response;
                $scope.dataTable.draw();
            });
        }

        $scope.displayProject = function (result) {
            if (JSON.stringify(result) != "{}") {
                self.selectedProject = result;
                $('.goto-project').prop('disabled', false);
                $('.select2-chosen').text(result.name);
                $('.select2-search-choice-close').css("display", "block");
                scope.dataTable
                    .column('projectName:name')
                    .search(result.name)
                    .draw();
                scope.dataTable.state.save();
                scope.isProjectSelected = true;

            } else {
                $('.goto-project').prop('disabled', true);

                $('.select2-chosen').text("Quick select a project");
                $('.select2-search-choice-close').css("display", "none");
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
                return deferred.promise;
            }
        }

        $scope.clearFilter = function (evt) {
            var elem;
            if (event.srcElement) elem = event.srcElement;
            else if (event.target) elem = event.target;

            $(elem).parent().children('input').val("");
            scope.dataTable
                .column($(elem).parents('th').index() + ':visible')
                .search("")
                .draw();
            scope.dataTable.state.save();
        }

        $scope.projectSearchGenerateMarkup = function (result, element, search) {
            var n = result.name.toLowerCase().indexOf(search.term.toLowerCase());
            var matchText = result.name.substring(n, n + search.term.length)
            var markup = "";
            if (n >= 0) {
                markup += "<div>" + result.name.substring(0, n) + "<u>" + matchText + "</u>" + result.name.substring(n + search.term.length, result.name.length) + "</div>";
                markup += "</div>";
            } else {
                markup += "<div>" + result.name + "</div>";
            }
            return markup;
        }

        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            if (settings.sTableId == "landingpageTable") {
                if (!self.dateRange_start || !self.dateRange_end) return true;

                var minVal = self.dateRange_start
                var maxVal = self.dateRange_end

                if (minVal == 'Invalid Date' || maxVal == 'Invalid Date') {
                    return true;
                }
                var dataTable = $('#landingpageTable').DataTable();
                var index = dataTable.column('creationDateTime:name').index();
                var creationDateColIndex = dataTable.column("creationDateTime:name").index();
                var date = new Date(data[creationDateColIndex]);


                if (date >= minVal && date <= maxVal) {
                    return true;
                } else {

                    return false;
                }
            } else {
                return true;
            }
        });

        function larg() {
            var landingTablecolumns = $scope.dataTable.columns().nodes().length;
            for (checkCount = 1; checkCount <= landingTablecolumns; checkCount++) {
                if ($('.thHeader' + checkCount).css('display') == 'none') {
                    $('.headerFilter' + checkCount).hide();
                } else {
                    $('.headerFilter' + checkCount).show();
                }
            }
        }

        $('body').click(function (e) {
            var idClicked = e.target.id;
            if (idClicked != 'column-setting' && $(e.target).parents('.popover.in').length === 0 && $(e.target).parent().attr('id') != 'column-setting' && $(e.target).attr('class') != 'column-popover') {
                $('.column-popover').popover('hide');
            }
        });

        $interval(function () {
            if ($scope.dataTable) {
                larg();
            }
        }, 100);

        function showSelect2() {
            $('.select2-search-choice-close').on('click', function () {
                self.selectedProject = "";
                $('.goto-project').prop('disabled', true);
                $('.select2-search-choice-close').css("display", "none");
                scope.dataTable
                    .column('projectName:name')
                    .search('')
                    .draw();

                scope.dataTable.state.save();
            });
            self.showFilter = true;
        }
    }]);
