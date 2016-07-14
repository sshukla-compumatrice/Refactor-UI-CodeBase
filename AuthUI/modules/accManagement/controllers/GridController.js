angular.module('AccountMgmtModule').controller('GridController', ['$scope', '$state', '$timeout', '$modal', 'data', 'gridColumns', function ($scope, $state, $timeout, $modal, data, gridColumns) {

    this.gridData = data.gridData;
    this.gridColumns = gridColumns;
    this.entityType = data.gridDataType;
    this.linkToAdd = data.linkToAddEntity;
    this.umbrellaCompanyGUID = $state.params.companyguid;
    this.isChildCompany = ('isChildCompany' in data) ? data.isChildCompany : false;
    self = this;

    //Enable UploadUserSpreadSheet for Office
    this.showUserSpreadsheet = (this.entityType.toLowerCase() == 'user' && $state.params.officeguid) ? true : false;
    this.entityType = (this.entityType.toLowerCase() == 'parentcompany') ? "Company" : this.entityType;

    $timeout(function () {
        $(document).ready(function () {
            var AccountMgmtDatatable = $('#AccountMgmtDatatable').DataTable({
                "dom": '<"pull-left"i><"pull-right"p><"pull-left col-sm-5"f>t<"pull-right"p>',
                "data": self.gridData,
                "pagingType": "simple_numbers",
                "retrieve": true,
                "stateSave": true,
                "language": {
                    "info": "<strong>Showing _START_ - _END_ of _TOTAL_ records</strong>",
                    "infoFiltered": "<br><em>(filtered from _MAX_ total records)</em>"
                },
                "pageLength": 30,
                "columnDefs": self.gridColumns
            });

            $('#entitySearch').on('keyup', function () {
                AccountMgmtDatatable.search(this.value).draw();
            });
        });
    });

    $('#AccountMgmtDatatable').on('click', 'a.link-delete', function (e) {
        e.preventDefault();
        var linkDelete = this;
        $modal.open({
            templateUrl: 'delete-confirmation-modal.html',
            controller: 'EntityDeleteController as deleteModalInst',
            resolve: {
                deleteModalParams: function () {
                    return $(linkDelete).data();
                }
            }
        });
    })

    self.uploadUsers = function () {
        $modal.open({
            templateUrl: 'upload-user-modal.html',
            controller: 'UserUploadController as userUploadCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                uploadModalParams: function () {
                    return null; //self.linkToAdd.officeguid;
                }
            }
        });
    }

}])