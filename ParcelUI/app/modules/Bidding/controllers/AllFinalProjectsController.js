angular.module('Bidding').controller('AllFinalProjectsController', ['$timeout', '$scope', '$compile', '$location', '$state', 'BiddingAPI', 'globalValues', function ($timeout, $scope, $compile, $location, $state, BiddingAPI, globalValues) {

    $scope.bidsList = [];
    var bids_AllFinalProjects = {
        "Client": "",
        "Requestor": "",
        "BidRequest": "",
        "BidDeadline": "",
        "Project": "",
        "Address": "",
        "ReportType": "",
        "Sites": ""
    };


    $scope.$on('load-datatable', function () {
        $scope.bidsList = [];
        fillDataTable_AllFinalProjects();
    });

    var self = this;


    function fillDataTable_AllFinalProjects() {

        BiddingAPI.getDirectAwardsAndBids(globalValues.currentUserCompanyGuid).then(function (result) {

            for (var i = 0; i < result.vendorBids.length; i++) {
                bids_AllFinalProjects.Client = result.vendorBids[i].lender.company.name;
                bids_AllFinalProjects.Requestor = result.vendorBids[i].lender.fullName;
                bids_AllFinalProjects.BidRequest = "test bid request date";
                bids_AllFinalProjects.BidDeadline = result.vendorBids[i].bid.proposedDateToComplete;
                bids_AllFinalProjects.Project = result.vendorBids[i].property.address.address1;
                bids_AllFinalProjects.Address = result.vendorBids[i].property.address.address1;
                bids_AllFinalProjects.ReportType = "test report type";
                bids_AllFinalProjects.Sites = "test site";


                $scope.bidsList.push(bids_AllFinalProjects);

            }
            console.log("obj: " + JSON.stringify($scope.bidsList));
            $(document).ready(function () {
                console.log("4");
                $scope.dataTable = $('#tableAllFinalProjects_id').DataTable({

                    "dom": '<"pull-left col-md-10"l><"text-right col-md-2"B>r<"dashboard-table"t><"pull-right"p>',
                    "processing": true,

                    "data": $scope.bidsList,
                    "orderCellsTop": true,
                    "initComplete": function () {


                        $('#tableAllFinalProjects_id tbody tr').each(function () {
                            $(this).find('td:eq(0)').css('white-space', 'nowrap');
                        });



                        $('#tableAllFinalProjects_id thead tr#filterrow th').each(function () {

                            var title = $('#tableAllFinalProjects_id thead th').eq($(this).index() + 1).text();

                            if (title != "" && title != "Action")

                                var elemHtml = '<input type="text" class="form-control input-xs"  ng-click="stopPropagation($event);" text-change = ' + title.split(" ").join("") + ' />';
                            var compiledHtml = $compile(elemHtml)($scope);
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
                    "stateSave": false,
                    "buttons": [{
                            extend: 'copyHtml5',
                            text: '<i class="fa fa-clipboard fa-lg"></i>'
                                //                        exportOptions: {
                                //                            columns: [8, 9, 10]
                                //                        }
                    }, {
                            extend: 'excelHtml5',
                            text: '<i class="fa fa-file-excel-o fa-lg"></i>'

                    },

                        {
                            extend: 'print',
                            text: '<i class="fa fa-print fa-lg"></i>'

                    }
                ],
                    "columnDefs": [

                        {
                            "targets": 0,
                            "data": null,
                            "searchable": false,
                            "sortable": false,
                            "defaultContent": "<a  class='goToReport-AwaitingAcceptance pointer'>Go To Report</a> "
                                //<a class='table-delete' data-id=" + row.companyGUID + ">DELETE</a>
        },
                        {
                            "targets": 1,
                            "title": "Client",
                            "data": "Client",
                            "sortable": true

                    }, {
                            "targets": 2,
                            "title": "Requestor",
                            "data": "Requestor",
                            "sortable": true

                    }, {
                            "targets": 3,
                            "title": "BidRequest",
                            "data": "BidRequest",
                            "sortable": true

                    }, {
                            "targets": 4,
                            "title": "BidDeadline",
                            "data": "BidDeadline",
                            "sortable": true

                    }, {
                            "targets": 5,
                            "title": "Project",
                            "data": "Project",
                            "sortable": true

                    }, {
                            "targets": 6,
                            "title": "Address",
                            "data": "Address",
                            "sortable": true

                    }, {
                            "targets": 7,
                            "title": "ReportType",
                            "data": "ReportType",
                            "sortable": true

                    }, {
                            "targets": 8,
                            "title": "Sites",
                            "data": "Sites",
                            "sortable": true

                    }

                ],

                    "lengthMenu": [
                    [10, 25, 50, 100, 250, 500, -1],
                    [10, 25, 50, 100, 250, 500, "All"]
                ],
                    "paging": true,
                    "ordering": true,
                    "info": false,
                    "filter": false,
                    "searching": true

                });

                $('#tableAllFinalProjects_id').on('click', 'a.goToReport-AwaitingAcceptance', function (e) {

                 console.log("go To Report");
                });

                $("#tableAllFinalProjects_id thead input").on('keyup change', function () {
                    if ($(this).attr("type") == "text") {
                        $scope.dataTable
                            .column($(this).parent().index() + ':visible')
                            .search(this.value)
                            .draw();
                    }
                });
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
                    //  console.log("show content: " + JSON.stringify($scope.dataTable.context[0].aoColumns[0].title));

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

                /*  $( ".datePicker" ).datepicker({
                  	 
                  	});*/
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
                    template: '<div id="settings-popover" class="popover popover-large"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
                });

                $('.column-settings').click(function (e) {
                    
                    e.preventDefault();
                    var tab = $(this).attr('data-tab');
                    $('.settings-button').popover('show');

                });
                $('input.global_filter').on('keyup click', function () {
                    filterGlobal();
                });
                $('#projStatus').change(function () {

                    filterStatus();

                });


                function showContent() {
                    //  console.log("show content: " + JSON.stringify($scope.dataTable.context[0].aoColumns[0].title));

                    var itemsTemplate = '<div class="row">' +
                        '<div class="col-md-6 col-xs-12" ng-repeat="item in allFinalProj.columns_allFinalProjects">' +
                        '<input ng-model="item.visible" class="column-settings-checkbox" columnindex = "{{item.index}}"' +
                        'type="checkbox" ng-change="allFinalProj.hideshowColumns(item)"></input> {{item.name}} ' + '</div> </div> </br>' +
                        '<div class="pull-right"><button close-popover class="btn-sm btn" ng-click="allFinalProj.closeSettingsPopup()">Close</button>';
                    //                +
                    //                    '<button style="margin-left : 10px;" ng-click="dashboard.saveSettings();" class="btn-sm btn">Save tab settings</button></div> </br></br>';
                    return $compile(itemsTemplate)($scope);
                }
            });

        });




    }



    this.saveSettings = function () {
        $scope.dataTable.state.save();
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
        // Toggle the visibility
        column.visible(!column.visible());
    }


    this.settings = function () {

        this.columns_allFinalProjects = [];

        for (var i = 0; i < $scope.dataTable.context[0].aoColumns.length; i++) {
            if ($scope.dataTable.context[0].aoColumns[i].title != "Action" && $scope.dataTable.context[0].aoColumns[i].title != "undefined" && $scope.dataTable.context[0].aoColumns[i].title != null && $scope.dataTable.context[0].aoColumns[i].title != "") {
                this.obj = {};
                this.obj.name = $scope.dataTable.context[0].aoColumns[i].title;
                this.obj.index = i;
                this.obj.visible = $scope.dataTable.context[0].aoColumns[i].bVisible;
                this.columns_allFinalProjects.push(this.obj);
            }
        }
        console.log("fghj" + JSON.stringify(this.columns_allFinalProjects));

    }


    $scope.stopPropagation = function (evt) {
        if (evt.stopPropagation !== undefined) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }




}]);