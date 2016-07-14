angular.module('ProjectCreation').controller('ProjectSearchCtrl', ['$scope', '$timeout', 'ProjectSearchAPI', '$location', 'BASEURL', '$state', 'globalValues', function ($scope, $timeout, ProjectSearchAPI, $location, BASEURL, $state, globalValues) {

    var self = this;

    var ProjectSearchObj = {};

    self.ProjectSearchFields = {};

    self.SearchData = [];

    init();

    function init() {
        getReportTypes();
        getProjectSearchFields();
    }

    self.SearchProjects = function () {
        ProjectSearchObj = {
            field1: self.ProjectSearchFields.field1,
            type1: self.ProjectSearchFields.type1,
            text1: self.ProjectSearchFields.text1,
            field2: self.ProjectSearchFields.field2,
            type2: self.ProjectSearchFields.type2,
            text2: self.ProjectSearchFields.text2,
            reportTypes: self.ProjectSearchFields.reportTypes.toString()
        }

        ProjectSearchAPI.getProjects(ProjectSearchObj).then(function (SearchResponse) {
            var SearchDataArray = [];

            for (var index = 0; index < SearchResponse.length; index++) {
                var element = {};

                element.projectGUID = SearchResponse[index].projectGUID;
                element.projectName = SearchResponse[index].name; //projectName;  
                element.FinalTotal = SearchResponse[index].numberOfFinalReports + '/' + SearchResponse[index].totalReports;

                for (var indexj = 0; indexj < SearchResponse[index].reports.length; indexj++) {
                    element.projectNumber = SearchResponse[index].reports[indexj].projectNumber;
                    element.clientCompanyName = ""; //SearchResponse[index].reports[indexj].clientCompanyName;

                    element.projectGuid = SearchResponse[index].reports[indexj].projectGuid;
                    SearchDataArray.push(element);
                    element = {};
                }
            }
            self.SearchData = SearchDataArray;


            self.showSearchResults = true;
            //CreateProjectSearchDatatable(); 


            bindSearchResultsDt(self.SearchData);


        })
    }

    self.gridData = false;

    $timeout(function () {
        $(document).ready(function () {

            tblprojectSearch = $('#tblprojectSearch').DataTable({
                //"dom": '<"pull-left"i><"pull-right"p>t<"pull-right"p>',
                destroy: true,
                "data": self.SearchData, //self.gridData,
                //"pagingType": "simple",
                /*"language": {
                    "info": "<b>Showing _START_ - _END_ of _TOTAL_ records</b>"
                },*/
                iDisplayLength: 30,
                "lengthMenu": [[30, 50, -1], [30, 50, "All"]],
                "dom": '<"top"ip>rt', //'<"top"i>rt<"top"fp><"clear">',
                //"pageLength": 30,
                "columnDefs": [
//                    {
//                    "targets": 0,
//                    "data": 'projectName',
//                     "mRender": function ( data, type, full )  {
//          return  '<a href="'+data+'">' + data + '</a>';
//      }
//                }
                    {
                        "targets": 0,
                        "data": 'projectName',
                        "mRender": function (data, type, full) {
                            return "<a title='Click to view the Project Dashboard' class='pointer table-projectName' data-id=" + full.projectGUID + ">" + data + "</a>"
                        }
                },

                    {
                        "targets": 1,
                        "data": 'projectNumber',
                        "orderable": false
                },

                    {
                        "targets": 2,
                        "data": 'clientCompanyName'
                },

                    {
                        "targets": 3,
                        "data": 'FinalTotal',
                        "orderable": false
                },
                     {
                        "targets": -1,
                        "title": "Actions",
                        "data": null,
                        "orderable": false,
                        "className": "center",                      
                        "mRender": function (data, type, full) {
                           
                            return "<a title='View documents for this project' class='pointer table-documents' data-id=" + full.projectGUID + ">Documents</a>"
                        }
                    }
                              ]
            });
            $('#tblprojectSearch').on('click', 'a.table-projectName', function (e) {
                e.preventDefault();
                //var flag = false;

                var data = tblprojectSearch.row($(this).parents('tr')).data();
                var url = $state.href('projectDashboard', {
                    projectGuid: data.projectGUID,
                    accountGuid: globalValues.currentUserGuid,
                    companyGuid: globalValues.currentUserCompanyGuid
                });
                window.open(url,'_blank');
                
            });
            
             $('#tblprojectSearch').on('click', 'a.table-documents', function (e) {
                e.preventDefault();
             
                var data = tblprojectSearch.row($(this).parents('tr')).data();
                var url = $state.href('projectDocs', {
                    projectGuid: data.projectGUID,
                    companyGuid: globalValues.currentUserCompanyGuid
                });
                window.open(url,'_blank');
                
            });


        });
    });


    bindSearchResultsDt = function (data) {
        if (data) self.gridData = true;

        if ($('#tblprojectSearch >tbody >tr').length) {
            tblprojectSearch.clear().draw();
        }
        tblprojectSearch.rows.add(data);
        tblprojectSearch.columns.adjust().order([0, 'asc']).draw();
    }

    /*function CreateProjectSearchDatatable(){         
        $timeout(function () {	        
             tableprojectSearch = $('#tblprojectSearch').DataTable({   
                    bDestroy: true,
                    //bRetrieve: true,
                    iDisplayLength: 30,
                    paging: true,
                    info: true,
                    filter: false,               
                    stateSave: true,
                    "lengthMenu": [[30, 50, -1], [30, 50, "All"]],            
                    "dom": '<"top"ip>rt<"clear">', //'<"top"i>rt<"top"fp><"clear">',
                    "columnDefs": [ { "targets": 1, "orderable": false },
                                  { "targets": 3, "orderable": false },
                                  { "targets": 4, "orderable": false }]
            });            
        });               
    }*/

    function getReportTypes() {
        ProjectSearchAPI.getReportTypes().then(function (data) {
            self.allReportTypes = data;
        })
    }


    function getProjectSearchFields() {
        ProjectSearchAPI.getProjectSearchFields().then(function (data) {

            self.projectSearchFields = data;

            var ProjectSearchFilters = [];
            var dupes = {};
            var singlesfilterGUID = [];
            $.each(data, function (i, el) {
                if (!dupes[el.filterGUID]) {
                    dupes[el.filterGUID] = true;
                    singlesfilterGUID.push(el);
                }
            });

            $.each(singlesfilterGUID, function (index, elmt) {
                var element = {};
                element.filterGUID = elmt.filterGUID;
                element.filterName = elmt.filterName;
                ProjectSearchFilters.push(element);
                elemet = {};
            });

            self.ProjectSearchFilters = ProjectSearchFilters;

            //set init value to ng-model search filters           
            self.ProjectSearchFields.field1 = ProjectSearchFilters[0].filterGUID;
            self.ProjectSearchFields.field2 = ProjectSearchFilters[0].filterGUID;

            //show operators for first filter default
            self.getSearchOperators(ProjectSearchFilters[0].filterGUID, 'type1');
            self.getSearchOperators(ProjectSearchFilters[0].filterGUID, 'type2');
        })
    }

    self.getSearchOperators = function (filterGUID, type) {
        var ProjectSearchOperators = [];
        $.each(self.projectSearchFields, function (index, elmt) {
            if (filterGUID == elmt.filterGUID) {
                var element = {};
                element.operatorGUID = elmt.operatorGUID;
                element.operatorName = elmt.operatorName;
                ProjectSearchOperators.push(element);
                element = {};
            }
        });
        if (type == 'type1') {
            self.ProjectSearchOperators1 = ProjectSearchOperators;
            //set init value ng-model search operators        
            self.ProjectSearchFields.type1 = ProjectSearchOperators[0].operatorGUID;
        }


        if (type == 'type2') {
            self.ProjectSearchOperators2 = ProjectSearchOperators;
            self.ProjectSearchFields.type2 = ProjectSearchOperators[0].operatorGUID;
        }
    }


}]);