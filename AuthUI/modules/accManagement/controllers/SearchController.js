angular.module('AccountMgmtModule').controller('SearchController', ['$rootScope', '$scope', '$timeout', 'searchAPI', function ($rootScope, $scope, $timeout, searchAPI) {

    var self = this;

    self.searchType = 'Users';
    self.gridData = false;
    self.searchColumnDef = {};
    self.searchString = "";
    self.isSearchStringSet = true;
    self.sortOrder = false;

    renderSearchResults = function (data) {
        switch (self.searchType) {
        case 'Companies':
            var view = 'viewParcel';
            var isLenderCompany = data.companyTypes.filter(function (item) {
                return item.companyType.toLowerCase() == 'lender';
            });

            if (isLenderCompany.length)
                view = 'view';

            return '<a href="#/accounts/company/' + view + '?companyguid=' + data.companyGUID + '">' + data.name + '</a>';
            break;

        case 'Offices':
            return '<a href="#/accounts/company/office/view?companyguid=' + data.companyGUID + '&officeguid=' + data.companyOfficeGUID + '">' + data.officeName + '</a>';
            break;

        case 'Users':
            return '<a href="#/accounts/company/office/user/view?companyguid=' + data.companyGUID + '&officeguid=' + data.officeGUID + '&userguid=' + data.userGUID + '">' + data.lastName + ', ' + data.firstName + ' (' + data.email + ')' + '</a>';
        }
    }

    $timeout(function () {
        $(document).ready(function () {
            SearchResultsDt = $('#SearchResultsDt').DataTable({
                "dom": '<"pull-left"i><"pull-right"p>t<"pull-right"p>',
                "data": self.gridData,
                "pagingType": "simple",
                "language": {
                    "info": "<strong>Showing _START_ - _END_ of _TOTAL_ records</strong>",
                    "emptyTable": "No record available for this search."
                },
                "pageLength": 200,
                "columnDefs": [{
                    "targets": 0,
                    "data": null,
                    "mRender": function (data, type, row) {
                        return renderSearchResults(data);
                    }
                }]
            });

            $('#searchStringInp').bind('keypress', function () {
                self.isSearchStringSet = true;
                $('#searchStringInp').parent().removeClass('has-error');
            });
        });
    });

    bindSearchResultsDt = function (data) {
        SearchResultsDt.clear().draw();
        if (data) {
            self.gridData = true;
            SearchResultsDt.rows.add(data);            
        }        
        SearchResultsDt.columns.adjust().order([0, 'asc']).draw();
    }

    self.SearchAll = function () {
        if (self.searchString) {
            switch (self.searchType) {
            case 'Users':
                $rootScope.promise = searchAPI.searchUsers(self.searchString).then(function (result) {
                    bindSearchResultsDt(result.users);
                });
                break;
            case 'Offices':
                $rootScope.promise = searchAPI.searchOffices(self.searchString).then(function (result) {
                    bindSearchResultsDt(result.offices);
                });
                break;
            case 'Companies':
                $rootScope.promise = searchAPI.searchCompanies(self.searchString).then(function (result) {
                    bindSearchResultsDt(result.companies);
                });
                break;
            default:
                //default code block
            }
        } else {
            self.isSearchStringSet = false;
            $('#searchStringInp').parent().addClass('has-error');
            $('#searchStringInp').focus();
        }
    }
    
    self.orderSearchResultsDt = function (order) {
        var sortType = order ? "asc" : "desc";
        self.sortOrder = !order;
        SearchResultsDt.order( [ 0, sortType ] ).draw();
    }
}]);