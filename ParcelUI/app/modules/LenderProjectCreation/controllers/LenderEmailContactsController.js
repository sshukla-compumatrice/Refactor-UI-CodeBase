angular.module('LenderProjectCreation').controller('LenderEmailContactsCtrl', ['$scope', '$log', '$modalInstance', '$http', 'notificationObj', 'ContactAPIService','BASEURL', 'globalValues', function ($scope, $log, $modalInstance, $http, notificationObj, ContactAPIService,BASEURL, globalValues) {

    var self = this;
    // pagination
    self.currentPage = 1;
    self.numPerPage = 5;
    self.totalItems = 0;
    // data structures
    self.ContactArr = [];
    self.filtered = [];

    self.companyId = globalValues.currentUserCompanyGuid;
    init();

    function init() {
        getContactData();
    }

    function getContactData(enforceLive) {
        ContactAPIService.getContacts(self.companyId, enforceLive).then(function (data) {
            bind(data);
        });
    }
    function bind(data) {
        if (data.length > 0) {

            self.ContactArr = data;
            self.totalItems = self.ContactArr.length;
        }
    }



    this.paginate = function (value) {
        var begin, end, index;
        begin = (self.currentPage - 1) * self.numPerPage;
        end = begin + self.numPerPage;
        index = self.filtered.indexOf(value);
        return (begin <= index && index < end);
    };

    this.Cancel = function () {
        $modalInstance.close();
    };

    this.DoneSelection = function () {
        //notificationObj.toContacts
        //notificationObj.ccContacts
        notificationObj.to.contacts = [];
        notificationObj.cc.contacts = [];
        for (var i = 0; i < self.ContactArr.length; i++) {
            var contact = self.ContactArr[i];
            if (contact.toSelected) {
                notificationObj.to.contacts.push(contact);
            }
            if (contact.ccSelected) {
                notificationObj.cc.contacts.push(contact);
            }
        }
        $modalInstance.close();
    };

}]);