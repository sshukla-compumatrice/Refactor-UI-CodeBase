angular.module('LenderPortal').controller('DashBoardCtrl', ['DashboardFactory', '$timeout', '$scope', 'globalValues', '$templateCache', 'dashboardUrls', '$compile', 'dashboardData', 'shareDataService', 'globalValues', '$location', function (DashboardFactory, $timeout, $scope, globalValues, $templateCache, dashboardUrls, $compile, dashboardData, shareDataService, globalValues, $location) {

    var scope = $scope;
    var self = this;
    var title = '';
    var value = "";
    this.settingsSaved = false;

    $scope.dateFilterRangeSearch = false;

    var truthyColumnsArrayNumber;

    $scope.$watch(function () {

            return self.alert;
        },
        function (value) {
            if (value) {
                $timeout(function () {
                    self.alert = false;
                }, 2000)
            }

        }
    )






    var dateElemHtml = '<div class="input-group">' +
        '<input type="text" class="form-control input-xs date-min-width date-filter" text-change ="date" ng-click ="stopPropagation($event)" />' +
        '<span class="input-group-btn">' +
        '<a class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" href="#">' +
        '<span>= &nbsp;</span>' +
        '<span class="caret"></span>' +
        '</a>' +
        '<ul class="dropdown-menu custom-dropdown pull-right">' +
        '<li><a class="dateComparison" datefilter-condition = "=">On this date</a></li>' +
        '<li><a class="dateComparison" datefilter-condition = "<">Before this date</a></li>' +
        '<li><a class="dateComparison" datefilter-condition = ">">After this date</a></li>' +
        '</ul>' +
        '</span>' +
        '</div>'

    angular.element('#openOrders-actions').hide();


    this.headers = [];



    this.headers = [
        {
            "name": "CreatedTimeStamp",
            "index": 1,
            "default": false,
            "image": '',
            "visible": false

        },
        {
            "name": "MsgFlag",
            "index": 2,
            "default": true,
            "image": 'images/message_dashboard_header.png',
            "visible": true

        },
        {
            "name": "MsgFlagExport",
            "index": 3,
            "default": false,
            "image": '',
            "visible": false

        },
        {
            "name": "IsMonitored",
            "index": 4,
            "default": true,
            "image": 'images/monitoring_dashboard_header.png',
            "visible": true

        },
        {
            "name": "IsMonitoredExport",
            "index": 5,
            "default": false,
            "image": '',
            "visible": false
        },
        {
            "name": "AlertStatus",
            "index": 6,
            "default": true,
            "image": 'images/alert_dashboard_header.png',
            "visible": true
        },
        {
            "name": "AlertStatusExport",
            "index": 7,
            "default": false,
            "image": '',
            "visible": false
        }, {
            "name": "Cabinet",
            "index": 8,
            "default": true,
            "visible": true
        }, {
            "name": "Loan No",
            "index": 9,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Application No",
            "index": 10,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "Borrower",
            "index": 11,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Location ID",
            "index": 12,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "Location Name",
            "index": 13,
            "default": false,
            "image": '',
            "visible": true
        },
        {
            "name": "Address",
            "index": 14,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "City",
            "index": 15,
            "default": false,
            "image": '',
            "visible": true
        },
        {
            "name": "County",
            "index": 16,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "State",
            "index": 17,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Zip",
            "index": 18,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "Created",
            "index": 19,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Created By",
            "index": 20,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "Due",
            "index": 21,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Service",
            "index": 22,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "Status",
            "index": 23,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Status Date",
            "index": 24,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "Ordered By",
            "index": 25,
            "default": false,
            "image": '',
            "visible": true
        },
        {
            "name": "Ordered Date",
            "index": 26,
            "default": false,
            "image": '',
            "visible": true
        }];



    $scope.$on('fillDatatable', function () {
        if (globalValues.pageRefreshed) {
            localStorage.setItem('DataTables_table_id_/index.html', '');
        }
        fillDataTable();
    })


    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        if ($scope.dateFilterRangeSearch && $scope.dateValue != "") {
            $scope.operator;
            $scope.dateValue;
            if (moment($scope.dateValue, "M/D/YYYY", true).isValid()) {
                if ($scope.operator == "<") {
                    var max = Date.parse($scope.dateValue);
                    var date = (Date.parse(data[19])) || 0;
                    if ((isNaN(max)) || (date < max))
                    {
                     return true;
                    }
                    return false;
                } else if ($scope.operator == ">") {
                    var min = Date.parse($scope.dateValue);

                    var date = (Date.parse(data[19])) || 0;

                    if ((isNaN(min)) || (date > min))

                    {
                        return true;
                    }
                    return false;
                } else if ($scope.operator == "=") {
                    var singleValue = Date.parse($scope.dateValue);

                    var date = (Date.parse(data[$scope.columnIndex])) || 0;

                    if ((isNaN(singleValue)) || (date == singleValue))

                    {
                        return true;
                    }
                    return false;
                }
                else{
                    var searchText = $scope.textboxVal;
                    var columnData = data[$scope.columnIndex];
                    if(searchText == ""){
                        return true;
                    }
                    else if(searchText == columnData){
                        return true;
                    }
                    return false;
                    
                }
            } else {
                return false;
            }


        } else {
            return true;
        }
    })


    function fillDataTable() {
        $(document).ready(function () {
            /**
             * function executed when any of the datatable event is fired
             */
            var eventFired = function (e, settings, column, state, type) {

                switch (type) {
                    case 'Length':
                        $('.checkAll').prop('checked', false);
                        if (globalValues.dashBoardCollapseAll)
                            $scope.$broadcast('collapse-after-length-change');
                        break;
                    case 'column-visibility':
                        var value = "";
                        var index = "";
                        var searchLocalStorageCols = [];
                        var columnsArray = $scope.dataTable.columns().visible();
                        truthyColumnsArrayNumber = getTotalVisibleColumnsNumber(columnsArray);
                        $('.group').each(function (i, obj) {
                            $(this).children().first().attr('colspan', truthyColumnsArrayNumber)

                        });

                        $('#table_id thead tr.filterrow th').each(function () {
                            var title = $('#table_id thead th').eq($(this).index()).text();
                            if (title != "" && title.split(" ").join("").toLowerCase() == $scope.hiddenColumnName.split(" ").join("").toLowerCase()) {
                                index = $(this).index();
                                if (!$('#table_id tbody').find('tr:nth(1) td').eq($(this).index()).hasClass('datefield')) {
                                    var elemHtml = '<input type="text" class="form-control input-xs" text-change = ' + title + 'value = ' + value + ' ng-click ="stopPropagation($event)" />'
                                } else {
                                    var elemHtml = dateElemHtml;
                                }
                                var compiledHtml = $compile(elemHtml)(scope);
                                $(this).html(compiledHtml);
                            }
                        });

                        var localStorageJSON = localStorage.getItem('DataTables_table_id_/index.html');

                        for (var i = 0; i < JSON.parse(localStorageJSON).columns.length; i++) {
                            if (i == $scope.hiddenColumnIndex)
                                $('#table_id thead tr.filterrow th').eq(index).find('input').val(JSON.parse(localStorageJSON).columns[i].search.search);

                        }
                        break;
                }
            }

            /**
             * Different event handlers for different events
             */
            $('#table_id')
                .on('order.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Order');
                })
                .on('search.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Search');
                })
                .on('page.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Page');
                })
                .on('length.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Length');
                })
                .on('column-visibility.dt', function (e, settings, column, state, type) {

                    eventFired(e, settings, column, state, 'column-visibility');
                })
            $scope.dataTable = $('#table_id').DataTable({

                "dom": '<"icon-right pull-right"B<"btn txt-white"l>>r<"dashboard-table"t><"pull-left"i>p<"text-right"l>',
                "processing": true,
                "data": dashboardData,
                "orderCellsTop": true,
                "bInfo": true,
                "deferRender": true,
                "initComplete": function () {

                    $('#table_id').DataTable().state.clear();
                    $('#table_id tbody tr').each(function () {
                        $(this).find('td:eq(0)').css('white-space', 'nowrap');
                    });

                    $('#table_id thead tr.filterrow th').each(function () {

                        var title = $('#table_id thead th').eq($(this).index()).text();

                        if (title != "" && !$('#table_id tbody').find('tr:nth(1) td').eq($(this).index()).hasClass('datefield')) {

                            var elemHtml = '<input type="text" class="form-control text-filter input-xs"  ng-click="stopPropagation($event);" text-change = ' + title.split(" ").join("") + ' />';
                        } else if (title != "" && $('#table_id tbody').find('tr:nth(1) td').eq($(this).index()).hasClass('datefield')) {

                            var elemHtml = dateElemHtml;
                        }
                        var compiledHtml = $compile(elemHtml)(scope);
                        $(this).html(compiledHtml);
                    });
                },

                "language": {
                    "lengthMenu": "Per page: _MENU_"
                        /*"zeroRecords": "Nothing found - sorry",
                        "info": "Showing page _PAGE_ of _PAGES_",
                        "infoEmpty": "No records available",
                        "infoFiltered": "(filtered from _MAX_ total records)"*/
                },
                "stateSave": true,
                "colReorder": true,
                "buttons": [{
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-clipboard fa-lg" title="Copy to Clipboard"></i>',
                        className: 'dashboard-btn-icon',
                        exportOptions: {
                            columns: [8, 9, 10]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fa fa-print fa-lg" title="Print"></i>',
                        className: 'dashboard-btn-icon',
                        exportOptions: {
                            columns: [8, 9, 10]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o fa-lg" title="Export visible results to Excel"></i>',
                        className: 'dashboard-btn-icon',
                        exportOptions: {
                            columns: [8, 9, 10]
                        }
                    }

                    ],
                "columnDefs": [
                    {
                        "targets": 0,
                        "data": null,
                        "sortable": false,

                        "title": '<input type="checkbox" title="Check/Uncheck all checkboxes" class="checkAll" id="checkall" name="checkAll">',

                        "render": function (data, type, full) {
                            if (full.serviceRequestId != undefined) {
                                var html = '<a class=createLoanPopup href="/lenderPortal/newLoan.php?serviceRequestID=' + full.serviceRequestId + '"><img src="images/zoom.gif"/></a>';

                                return html;
                            } else if (full.locationId != undefined && full.cabinetId != undefined) {
                                var html = '<a class="propertyRedirect" href="' + $location.absUrl() + 'Property/Overview?LocationID=' + full.locationId + '&PID=' + full.cabinetId + '"><img src="images/zoom.gif"/></a>';

                                return html;
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        "targets": 1,
                        "title": "Created Timestamp",
                        "data": "createdTimeStamp",
                        "visible": false,
                        "class": "datefield",
                        "name": "Created Timestamp"

                    },
                    {
                        "targets": 2,

                        "title": '<img src="images/message_dashboard_header.png" title="Messages"/>',
                        "data": "MsgFlag",
                        "render": function (data, type, full) {
                            if (full.MsgFlag == 1)
                                return '<a href="/lenderPortal/Messaging/MessageCenter/' + full.pSiteID + '/Lender' + '"  class="MessageCenter"><img id=envelope_' + full.pSiteID + ' class="messageImage" src="images/u47.png" title="Message" alt="Message"/></a>';

                            else if (full.MsgFlag == 2)
                                return '<a href="/lenderPortal/Messaging/MessageCenter/' + full.pSiteID + '/Lender' + '" class="MessageCenter"><img id=envelope_' + full.pSiteID + ' class="messageImage" src="images/u16.png" title="Message" alt="Message"/></a>';

                            else
                                return "";
                        }
                    },
                    {
                        "targets": 3,
                        "title": "Messages",
                        "data": "MsgFlagExport",
                        "sortable": false,
                        "visible": false,

                        "render": function (data, type, full) {
                            if (full.MsgFlag == 1 || full.MsgFlag == 2)
                                return 'Yes';
                            else
                                return 'No';
                        }
                    },
                    {
                        "targets": 4,

                        "title": '<img src="images/monitoring_dashboard_header.png"/>',
                        "data": "isMonitored",
                        "class": "isMonitored",
                        "render": function (data, type, full) {
                            var link = '/reporting/PARCELAssetSite.php?LocationID=' +
                                full.locationId + '&PID=' + full.cabinetId + '#78';
                            if (data == 1) {
                                return '<a href="' + link + '">' +
                                    '<img src = "images/icon_monitoring_on.gif"></a>';
                            } else if (data == 2) {
                                return '<a href="' + link + '"> <img src = "images/alert_check.png"' +
                                    'width = "16"' +
                                    'height = "16"/></a>';
                            } else if (data == 3) {
                                return '<a href="' + link + '"> <img src = "images/icon_alert.png"></a>';
                            } else if (data == 4) {
                                return '<a href="' + link + '"> <img src = "images/stop.png"' +
                                    'width = "16"' +
                                    'height = "16" /></a>';
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 5,
                        "title": "Monitoring",

                        "data": "isMonitoredExport",
                        "sortable": false,
                        "visible": false,
                        "render": function (data, type, full) {
                            if (full.isMonitored == 1) {
                                return 'On';
                            } else if (full.isMonitored == 2) {
                                return 'Clear';
                            } else if (full.isMonitored == 3) {
                                return 'Alert';
                            } else if (full.isMonitored == 4) {
                                return 'Issue';
                            } else {
                                return 'Off';
                            }
                        }
                    },
                    {
                        "targets": 6,

                        "title": '<img src="images/alert_dashboard_header.png" title="Alert"/>',
                        "data": "alertStatus",
                        "render": function (data, type, full) {
                            //null = no alerts, 1 = read alerts, 2=unread alerts
                            if (data == null) {
                                return '';
                            } else if (data == 1) {
                                return '<a  class="alertpop" href="#" id="alerts-' + full.pSiteID + '" onclick="getAlerts(\'' + full.pSiteID + '\')"><img id="alert-image-' + full.pSiteID + '" src="images/alert_inactive.png" height="16" width="16"/></a>';
                            } else if (data == 2) {
                                return '<a  class="alertpop" href="#" id="alerts-' + full.pSiteID + '" onclick="getAlerts(\'' + full.pSiteID + '\')"><img id="alert-image-' + full.pSiteID + '" src="images/alert_active.png" height="16" width="16"/></a>';
                            } else {
                                return 'Error retrieving AlertStatus. Data code: ' + data;
                            }
                        }
                    },
                    {
                        "targets": 7,

                        "title": "Alert",
                        "data": "alertStatusExport",
                        "sortable": false,
                        "visible": false,
                        "render": function (data, type, full) {
                            if (full.alertStatus == null) {
                                return 'No';
                            } else if (full.alertStatus == 1 || full.alertStatus == 2) {
                                return 'Yes';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        "targets": 8,

                        "title": "Cabinet",
                        "data": "cabinet",
                        "sortable": true



                    },
                    {
                        "targets": 9,

                        "title": "Loan No.",
                        "data": "loanNumber"
                    },
                    {
                        "targets": 10,
                        "title": "Application No.",
                        "data": "applicationNumber",
                        "visible": false

                    },
                    {
                        "targets": 11,

                        "title": "Borrower",
                        "data": "borrower"

                    },
                    {
                        "targets": 12,

                        "title": "Location ID",
                        "data": "locationId",
                        "visible": false
                    },
                    {
                        "targets": 13,

                        "title": "Location Name",
                        "data": "locationName",
                        "visible": false
                    },
                    {
                        "targets": 14,

                        "title": "Address",
                        "data": "locationAddress",
                        "name": "Address"
                    },
                    {
                        "aTargets": 15,

                        "title": "City",
                        "data": "locationCity",
                        "visible": false,
                        "name": "City"
                    },
                    {
                        "targets": 16,
                        
                        "title": "County",
                        "data": "locationCounty",
                        "visible": false
                    },
                    {
                        "targets": 17,

                        "title": "State",
                        "data": "locationState",
                        "name": "State"
                    },
                    {
                        "targets": 18,

                        "title": "Zip",
                        "data": "locationZip",
                        "visible": false,
                        "name": "Zip"
                    },
                    {
                        "targets": 19,
                        "class": "datefield",
                        "title": "Created",
                        "name": "Created",
                        "data": "creationDate",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 20,

                        "title": "Created By",
                        "data": "createdBy"
                    },
                    {
                        "targets": 21,
                        "title": "Due",
                        "class": "datefield",
                        "data": "dueDate",
                        "name": "Due",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 22,

                        "title": "Service",
                        "data": "service"
                    },
                    {
                        "targets": 23,
                        "title": "Status",

                        "data": "status"
                    },
                    {
                        "targets": 24,
                        "title": "Status Date",
                        "class": "datefield",
                        "data": "statusDate",
                        "name": "Status Date",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 25,
                        "title": "Ordered By",

                        "data": "orderedBy",
                        "visible": false
                    },
                    {
                        "targets": 26,
                        "title": "Ordered Date",
                        "class": "datefield",
                        "data": "orderedDate",
                        "visible": false,
                        "name": "Ordered Date",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    }
        ],

                "lengthMenu": [[10, 25, 50, 100, 250, 500, -1], [10, 25, 50, 100, 250, 500, "All"]],
                "paging": true,
                "ordering": true,
                "info": false,
                "drawCallback": function (settings) {
                    var api = this.api();
                    var columnsArray = api.columns().visible();
                    truthyColumnsArrayNumber = getTotalVisibleColumnsNumber(columnsArray);
                    var rows = api.rows({
                        page: 'current'
                    }).nodes();
                    var last = null;
                    api.column(12, {
                        page: 'current'
                    }).data().each(function (group, i) {

                        if (last !== group) {
                            var locationAddress = getLocationAddress(api, i);
                            var locationCity = getLocationCity(api, i);
                            var locationState = getLocationState(api, i);
                            $(rows).eq(i).before(
                                $compile('<tr class="table-group group"><td colspan=' + truthyColumnsArrayNumber +
                                    '><label class="inline" class="margin-0"><input class="locationCheckbox"  type="checkbox" name="locationCheckbox"> <label class="inline pointer" class="margin-0"><i class="fa fa-minus-square-o fa-lg"></i> <input ng-click="rowExpandCollapse($event)"   class="collapsed"  type="button"  name="collapsed"> &nbsp;</label>' + locationAddress + '-' + locationCity + ',' + locationState + " " + '[' + group + ']' + '</label></td></tr>')($scope));
                            last = group;
                        }
                    });
                }
            });
            
            
            $('.dataTables_length').find('select').addClass('input-xs');
            $('.dataTables_length').find('select').removeClass('input-sm');
            //$('.datepicker-dropdown').addClass('datepicker-z-index');

            // Handle click on "Select all" control
            angular.element('.checkAll').on('click', function () {
                var checkbox = this;
                $scope.dataTable.columns().visible();
                if (this.checked)
                    angular.element('#openOrders-actions').show();
                else angular.element('#openOrders-actions').hide();
                $('.group').each(function (i, obj) {
                    $(this).find('input[type="checkbox"]').prop('checked', checkbox.checked);
                })
            });

            $scope.$on('show-hide-column', function (event, columnIndex) {
                var column = $scope.dataTable.column(columnIndex);
                // Toggle the visibility
                column.visible(!column.visible());
            })
            $('#table_id').on("change", ".locationCheckbox", function (event) {

                if (!this.checked) {
                    if ($('.checkAll').prop('checked')) $('.checkAll').prop('checked', false);
                }

                // check if any of the checkbox is checked if yes then show action button
                $('.locationCheckbox').each(function (i, obj) {
                    if ($(this).prop('checked')) {
                        angular.element('#openOrders-actions').show();
                        return false;
                    } else {
                        angular.element('#openOrders-actions').hide();
                    }
                    console.log("actions3 " + $scope.actions);
                })
            });

            angular.element('th.isMonitored ').popover({
                html: true,
                container: 'body',
                trigger: 'hover',
                title: 'Monitoring Icons',
                content: '<img src="images/icon_monitoring_on.gif"> - Property is being monitored</br></br>' +
                    '<img src="images/alert_check.png" width="16" height="16"> - Recent alert has been reviewed as non-issue</br></br>' +
                    '<img src="images/icon_alert.png"> - New Alert - Not yet reviewed</br></br>' +
                    '<img src="images/stop.png" width="16" height="16"> - Recent alert has been reviewed as an issue</br></br>'
            });

            angular.element('.settings-button').popover({
                html: true,
                container: 'body',
                trigger: 'manual',
                title: 'Edit Column Settings',
                content: showContent(),
                template: '<div id="settings-popover" class="popover popover-large settings popover-min-width"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
            });

            $('.column-settings').click(function (e) {
                e.preventDefault();
                var tab = $(this).attr('data-tab');
                $('.settings-button').popover('show');

            });

        });
    }

    function showContent() {
        console.log("show content");
        var itemsTemplate = '<div class="container-fluid"><div class="row  margin-0">' +
            '<div class="col-md-4 col-xs-12" ng-repeat="item in dashboard.columns">' +
            '<div class="checkbox"><label>' +
            '<input ng-model="item.visible" class="column-settings-checkbox" columnindex = "{{item.index}}"' +
            'type="checkbox" ng-change="dashboard.hideshowColumns(item)"><img ng-src="{{item.image}}""></img> {{item.name | capitalize}} ' + '</div></label></div> </div><br/>' +
            '<div class="pull-right"><button close-popover class="btn btn-default btn-sm" ng-click="dashboard.closeSettingsPopup()">Close</button>' +
            '<button ng-click="dashboard.saveSettings();" class="btn btn-primary btn-sm left-margin">Save tab settings</button></div></div>';
        return $compile(itemsTemplate)($scope);
    }

    function getTotalVisibleColumnsNumber(columnsArray) {

        var truthyColumnsArray = [];

        for (var i = 0; i < columnsArray.length; i++) {
            if (columnsArray[i]) {
                truthyColumnsArray.push(columnsArray[i])
            }
        }
        
        return truthyColumnsArray.length;
    }

    function getLocationAddress(api, i) {
        var address = api.column(14, {
            page: 'current'
        }).data()[i];
        return address;
    }

    function getLocationCity(api, i) {
        var city = api.column(15, {
            page: 'current'
        }).data()[i];
        return city;
    }

    function getLocationState(api, i) {
        var state = api.column(17, {
            page: 'current'
        }).data()[i];
        return state;
    }

    this.saveSettings = function () {
        $scope.dataTable.state.save();
        this.alert = true;
        this.message = "Dashboad settings saved";
        $('.settings-button').popover('hide');
    }

    this.closeSettingsPopup = function () {
        $('.settings-button').popover('hide');
    }
    this.hideshowColumns = function (item) {
        this.name = item.name;      
        var column = $scope.dataTable.column(item.index);
        // Toggle the visibility
        $scope.hiddenColumnName = item.name;
        $scope.hiddenColumnIndex = item.index;
        column.visible(!column.visible());
    }

    $scope.rowExpandCollapse = function (e) {
        var parentRow = $(e.target).parents("tr:last");
        if (parentRow.next().hasClass("ng-hide")) {
            //expand all
            parentRow.find("input[name='collapsed']").prev().addClass('fa-minus-square-o fa-lg');
            parentRow.find("input[name='collapsed']").prev().removeClass('fa-plus-square-o');
            parentRow.nextUntil('.group').removeClass('ng-hide');
        } else {
            //collapse all
            parentRow.find("input[name='collapsed']").prev().addClass('fa-plus-square-o fa-lg');
            parentRow.find("input[name='collapsed']").prev().removeClass('fa-minus-square-o');
            parentRow.nextUntil('.group').addClass('ng-hide');
        }
    }


    this.settings = function () {
        this.columns = [];
        //this.columns = this.headers;
        for (i = 2; i < 7; i++) {
            if (i == 2 || i == 4 || i == 6) {
                this.obj = {};
                this.obj.image = $($scope.dataTable.column(i).header()).find('img').attr('src');
                this.obj.name = "";
                this.obj.index = i;
                this.obj.visible = $scope.dataTable.column(i).visible();
                this.columns.push(this.obj);
            }
        }
        for (i = 8; i < 27; i++) {

            this.obj = {};
            this.obj.image = "";
            this.obj.name = $scope.dataTable.column(i).header().innerText;
            this.obj.index = i;
            this.obj.visible = $scope.dataTable.column(i).visible();
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

    this.saveTableState = function () {
        $('#table_id').DataTable().state.save();
        this.alert = true;
        this.message = "Dashboard state saved";
    }

    this.clearTableState = function () {
        this.visibleLocalStorageCols = [];
        var localStorageJSON = localStorage.getItem('DataTables_table_id_/index.html');
        console.log("mnmnmn " + JSON.parse(localStorageJSON));
        angular.forEach(JSON.parse(localStorageJSON).columns, function (column, index) {
            if (column.visible) {
                console.log("sdvgfgv " + index);
                self.visibleLocalStorageCols.push(column);

            }
        });

        for (var i = 0; i < this.visibleLocalStorageCols.length; i++) {
            $('#table_id thead tr.filterrow th').eq(i).find('input').val("");
            $('#table_id').DataTable()
                .column(i + ':visible')
                .search("")
                .draw();
        }

        $('#table_id').DataTable().state.clear();

        this.alert = true;
        this.message = "Dashboard state settings erased";
    }

}]);