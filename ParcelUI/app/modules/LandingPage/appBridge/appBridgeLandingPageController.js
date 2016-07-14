angular.module('ParcelUI').controller('appBridgeLandingPageController', ['$scope', '$timeout', '$filter', '$compile', 'appBridgeConstants', 'BASEURL', function ($scope, $timeout, $filter, $compile, appBridgeConstants, BASEURL) {
    self = this;

    self.refactorBridge = appBridgeConstants.IS_BRIDGE_LINKED;
    self.filter_noOfDays = "";
    self.filter_endDate = "";
    self.appBridgeStatusFilter = "ALL";
    self.targetArr = [];

    self.appBridgeFilterByStatus = function () {
        $scope.appBridgeDataTable.ajax.url(BASEURL.APP_BRIDGE + "/appbridge/projects/" + appBridgeConstants.userid + "?itemstatus=" + self.appBridgeStatusFilter + "&numofdays=" + self.filter_noOfDays + "&enddate=" + self.filter_endDate).load();
    }

    init();

    function init() {
        initAppBridgeDataTable();
        initializeDateRangeFilter();
    }

    function initAppBridgeDataTable() {
        $(document).ready(function () {
            var appBridgeColDefs = [];
            var appBridgeColDefPre = [
                {
                    "orderIndex": 0,
                    "title": "R",
                    "data": null,
                    "sortable": false,
                    "render": function (data, type, full) {
                        var html = '<a title="Enter this report or project" class = "btn btn-warning btn-xs" target="_blank" href="' + appBridgeConstants.APP_BRIDGE + '/refactorBridge/sessionInjector.php?userId=' + appBridgeConstants.userid + '&userOid=' + appBridgeConstants.officeid + '&userCid=' + appBridgeConstants.companyid + '&redirectTo=reportAuth&siteId=' + data.reportGuid + '"><span class="fa fa-file-text fa-inverse"></span></a>';
                        return html;
                    }
                },
                {
                    "orderIndex": 1,
                    "title": "P",
                    "data": null,
                    "sortable": false,
                    "class": "projectDashboardIcon",

                    "render": function (data, type, full) {
                        var html = '<a title="Enter this project" class = "btn btn-warning btn-xs" target="_blank" href="' + appBridgeConstants.APP_BRIDGE + '/refactorBridge/sessionInjector.php?userId=' + appBridgeConstants.userid + '&userOid=' + appBridgeConstants.officeid + '&userCid=' + appBridgeConstants.companyid + '&redirectTo=projectDash&pId=' + data.projectGuid + '"><span class= "glyphicon glyphicon-duplicate"></span></a>';
                        return html;
                    }
                        },
                {
                    "orderIndex": 2,
                    "title": "Project Name",
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
                    "render": function (data, type, full) {
                        var creationDate = new Date(data);
                        return (creationDate.getMonth() + 1) + '/' + creationDate.getDate() + '/' + creationDate.getFullYear();
                    }
                        },
                {
                    "orderIndex": 10,
                    "title": "Site ID",
                    "data": "siteGuid",
                    "visible": true
                        }
                    ]

            var appBridgeSortedCols = $filter('orderBy')(appBridgeColDefPre, "orderIndex");
            angular.forEach(appBridgeSortedCols, function (col, index) {
                var def = angular.copy(col);
                def.targets = index;
                def.name = def.data;
                self.targetArr.push(index);
                def.sortable = ("sortable" in def) ? def.sortable : true;
                delete def.orderIndex;
                appBridgeColDefs.push(def);
            });

            $scope.appBridgeDataTable = $('#appBridgeDataTable').DataTable({
                "dom": '<"toolbar pull-left col-md-4 col-xs-12 btn-group"B><"col-md-4 col-xs-12 text-right"p><"col-md-4 col-xs-12 text-right"i>r<"dashboard-table pull-left"t> ',
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": BASEURL.APP_BRIDGE + "/appbridge/projects/" + appBridgeConstants.userid + "?itemstatus=&numofdays=&enddate=",
                    "type": "PUT"
                },
                "responsive": true,
                "orderCellsTop": true,
                "bInfo": true,
                "iDisplayLength": 100,
                "autoWidth": false,
                "initComplete": function () {
                    $('#appBridgeDataTable tbody tr').each(function () {
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
                "stateLoadParams": function (settings, data) {
                    for (var i = 0; i < data.columns.length; i++) {
                        data.columns[i].search.search = "";
                    }
                    data.search.search = "";
                },
                "buttons": [
                    {
                        extend: 'csvHtml5',
                        text: '<i class="csvHtml5 fa fa-clipboard fa-lg"></i>'
                    }
                ],
                "order": [[9, "desc"]],
                "colReorder": true,
                "columnDefs": appBridgeColDefs
            });

            $.fn.dataTable.ext.pager.numbers_length = 6;

            $('#appBridgeDataTable tbody').on('click', 'tr', function () {
                $scope.appBridgeDataTable.$('tr.row-selected').removeClass('row-selected');
                $(this).addClass('row-selected');
            });
        });
    }

    function insertFilterInputHTML() {
        $('#appBridgeDataTable thead tr#filterrow th').each(function () {
            var title = $('#appBridgeDataTable thead th').eq($(this).index()).text();
            if (title != "" && title != "R" && title != "P") {
                var elemHtml = '<form class="form-inline" > <div class="input-group filterinput"><input type="text" class="form-control input-xs"  ng-click="stopPropagation($event);" app-bridge-column-filter = ' + title.split(" ").join("") + ' /><span title="Clear Search Value" class="input-group-addon input-xs pointer" ng-click="appBridgeClearFilter($event);">x</span></div> </form>';
                var compiledHtml = $compile(elemHtml)($scope);
                $(this).html(compiledHtml);
            }
        });
    }

    function getDateDiffInDays(sdate, edate) {
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var startDate = sdate instanceof Date ? sdate : new Date(sdate);
        var endDate = edate instanceof Date ? edate : new Date(edate);;
        return (Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / (oneDay))) - 1);
    }

    function initializeDateRangeFilter() {
        $(function () {
            function cb(start, end, title) {
                if (title && title != "Custom Range") {
                    $('#appBridgeReportRange span').html(title);
                } else {
                    $('#appBridgeReportRange span').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
                }
            }

            $('#appBridgeReportRange').daterangepicker({
                "showDropdowns": true,
                "opens": "right",
                ranges: {
                    'Last 90 Days': [moment().subtract(90, 'days'), moment(), 'Last 90 Days'],
                    'This Year': [moment().startOf('year'), moment(), 'This Year'],
                    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year'), 'Last Year'],
                    'All Time': [moment().subtract(10, 'year'), moment(), 'All Time']
                },
                startDate: moment().subtract(90, 'days'),
                endDate: moment()
            }, cb);

            // to apply default filter
            $timeout(function () {
                var startMoment = moment().subtract(90, 'days');
                var endMoment = moment();
                cb(startMoment, endMoment, 'Last 90 Days');
                $("input[name=daterangepicker_start]").val(startMoment.format('MMMM D, YYYY'));
                $("input[name=daterangepicker_end]").val(endMoment.format('MMMM D, YYYY'));
                self.filter_noOfDays = 90;
                $scope.appBridgeDataTable.ajax.url(BASEURL.APP_BRIDGE + "/appbridge/projects/" + appBridgeConstants.userid + "?itemstatus=" + self.appBridgeStatusFilter + "&numofdays=" + self.filter_noOfDays + "&enddate=" + self.filter_endDate).load();
            });

            $('#appBridgeReportRange').on('apply.daterangepicker', function (ev, picker) {
                switch (picker.chosenLabel) {
                case "Last 90 Days":
                    self.filter_noOfDays = 90;
                    self.filter_endDate = "";
                    break;
                case "This Year":
                    self.filter_noOfDays = getDateDiffInDays(picker.startDate._d, new Date());
                    self.filter_endDate = "";
                    break;
                case "Last Year":
                    self.filter_noOfDays = 365;
                    self.filter_endDate = $filter('date')(picker.endDate._d, 'yyyy-MM-dd');
                    break;
                case "All Time":
                    self.filter_noOfDays = 0;
                    self.filter_endDate = "";
                    break;
                case "Custom Range":
                    self.filter_noOfDays = getDateDiffInDays(picker.startDate._d, picker.endDate._d);
                    self.filter_endDate = $filter('date')(picker.endDate._d, 'yyyy-MM-dd');
                }

                $scope.appBridgeDataTable.ajax.url(BASEURL.APP_BRIDGE + "/appbridge/projects/" + appBridgeConstants.userid + "?itemstatus=" + self.appBridgeStatusFilter + "&numofdays=" + self.filter_noOfDays + "&enddate=" + self.filter_endDate).load();
            });
        });
    }

    $scope.appBridgeClearFilter = function (evt) {
        var elem;
        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;

        $(elem).parent().children('input').val("");
        $scope.appBridgeDataTable
            .column($(elem).parents('th').index() + ':visible')
            .search("")
            .draw();
        $scope.appBridgeDataTable.state.save();
    }
}]);