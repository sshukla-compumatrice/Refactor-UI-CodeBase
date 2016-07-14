angular.module('AccountMgmtModule').controller('EntityDeleteController', ['$rootScope', '$scope', '$modalInstance', '$location', '$timeout', '$state', 'deleteModalParams', 'CompanyServiceAPI', 'OfficeServiceAPI', 'UserServiceAPI', function ($rootScope, $scope, $modalInstance, $location, $timeout, $state, deleteModalParams, CompanyServiceAPI, OfficeServiceAPI, UserServiceAPI) {       

    this.enityType = (deleteModalParams.entitytype == "parent-company") ? "company" : deleteModalParams.entitytype;
    this.enityName = deleteModalParams.entityname;
    
    var self = this;

    function handleShowMessages(data, redirectState, redirectStateParams) {
        if(data.length == 0) {
            if($state.current.name != redirectState) {
                $rootScope.skipMsgClear = true;
                $state.go(redirectState, redirectStateParams);
            }
            else {
                $rootScope.skipMsgClear = true;
                $state.reload();
            }
            
            $rootScope.alertClass = 'alert-success';
            $rootScope.userMessage = "<strong>" + deleteModalParams.entityname + "</strong> deleted successfully.";
        } else {
            var usrMsg = (data.data.message != undefined) ? data.data.message.userMessage : "";
            $rootScope.alertClass = 'alert-danger';
            $rootScope.userMessage = "Error: Problem in deleting <strong>" + deleteModalParams.entityname + "</strong> " +  self.enityType + ". " + usrMsg;
            window.scrollTo(0, 0);
        }
        $modalInstance.close();
        if($rootScope.skipMsgClear) {
            $timeout(function () {
                $('#backStateArrow').trigger('click');
            }, 100);
        }
    }

    this.deleteEntityConfirm = function () {
        switch (deleteModalParams.entitytype) {
        case "parent-company":
            CompanyServiceAPI.deleteCompany(deleteModalParams.companyguid).then(function (response) {                
                handleShowMessages(response, 'accountMgmt.company.parentcompanieslist', {});                
            });
            break;
        case "company":
            CompanyServiceAPI.deleteCompany(deleteModalParams.companyguid).then(function (response) {                
                handleShowMessages(response, 'accountMgmt.company.list', {companyguid:deleteModalParams.companyguid});
            });
            break;
        case "office":
            OfficeServiceAPI.deleteOffice(deleteModalParams.companyguid, deleteModalParams.officeguid).then(function (response) {
                handleShowMessages(response, 'accountMgmt.office.list', {companyguid:deleteModalParams.companyguid});
            });
            break;
        case "user":
            UserServiceAPI.deleteuser(deleteModalParams.userguid).then(function (response) {
                handleShowMessages(response, 'accountMgmt.user.list', {companyguid:deleteModalParams.companyguid, officeguid:deleteModalParams.officeguid});
            });
            break;
        }
    }

    this.closeModal = function () {
        $modalInstance.close();
    }
}])