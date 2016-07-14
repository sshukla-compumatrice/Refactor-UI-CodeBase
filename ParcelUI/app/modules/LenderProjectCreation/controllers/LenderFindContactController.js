angular.module('LenderProjectCreation').controller('LenderFindContactCtrl', ['$scope', '$log', '$modalInstance', '$http', 'contactObj', 'ContactAPIService','BASEURL', 'globalValues',
function ($scope, $log, $modalInstance, $http, contactObj, ContactAPIService,BASEURL, globalValues) {

    $scope.possibleTimes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    // $scope.time = time;


    var self = this;
    self.companyId = globalValues.currentUserCompanyGuid;
    self.currentPage = 1;
    self.numPerPage = 5;
    self.CompanyContactsArr = [];
    self.totalItems = 0;
    $scope.selectedTab = 1;
    init();

    self.newContact = {};


    function init() {
        //$http.get('app/modules/ProjectCreation/sampleJson/Contacts.js').success(function (data) {
        //    if (data.length > 0) {

        //        self.CompanyContactsArr = data;
        //        self.totalItems = self.CompanyContactsArr.length;
        //    }
        //});


        getContactData();
    }

    function getContactData(enforceLive) {
        ContactAPIService.getContacts(self.companyId, enforceLive).then(function (data) {
            bind(data);
        });
    }
    function bind(data) {
        if (data.length > 0) {

            self.CompanyContactsArr = data;
            self.totalItems = self.CompanyContactsArr.length;
        }
    }



    this.paginate = function (value) {
        var begin, end, index;
        begin = (self.currentPage - 1) * self.numPerPage;
        end = begin + self.numPerPage;
        index = self.filtered.indexOf(value);
        return (begin <= index && index < end);
    };
    this.CancelDelete = function () {

        //console.log("return value: " + $scope.hour);
        //console.log(time);
        //$modalInstance.close($scope.hour);
        $modalInstance.close();
    }

    this.FindContactClick = function () {


        $scope.selectedTab = 1;

    }

    this.AddContactClick = function () {
        $scope.selectedTab = 2;
    }
    this.ContactSelected = function (contact) {
        var c = contact.FirstName + contact.LastName;
        console.log(c);
        var objContactSelected = {

            contactName: contact.firstName + " " + contact.lastName,
            companyName: contact.companyName || "",
            address: contact.address,
            city: contact.city,
            state: contact.state,
            zip: contact.zipCode,

            contactID: contact.contactID,
            phone: contact.phone,
            fax: contact.fax,
            email: contact.email

            //FirstName: contact.FirstName == null ? "" : contact.FirstName,
            //LastName: contact.LastName == null ? "" : contact.LastName,


            //Phone: contact.Phone == null ? "" : contact.Phone,
            //Fax: "",
            //Email: contact.EmailAddress == null ? "" : contact.EmailAddress

        };

        contactObj.client = objContactSelected;
        localStorage.setItem('selectedCompanyContactDetails', objContactSelected);
        $modalInstance.close();

    }

    this.SubmitContact = function () {

        //var companyContactList = "";

        //var newAddedContact = {

        //    FirstName: this.FirstName == null ? "" : this.FirstName,
        //    LastName: this.LastName == null ? "" : this.LastName,
        //    CompanyName: this.CompanyName == null ? "" : this.CompanyName,
        //    Address: this.Address == null ? "" : this.Address,
        //    City: this.City == null ? "" : this.City,
        //    State: this.State == null ? "" : this.State,
        //    Zip: this.ZipCode == null ? "" : this.ZipCode,
        //    Phone: this.Phone == null ? "" : this.Phone,
        //    Fax: this.Fax == null ? "" : this.Fax,
        //    Email: this.Email == null ? "" : this.Email

        //}

        //var companyContactList = {

        //    FirstName: this.FirstName == null ? "" : this.FirstName,
        //    LastName: this.LastName == null ? "" : this.LastName,
        //    Company: this.CompanyName == null ? "" : this.CompanyName,
        //    EmailAddress: this.Email == null ? "" : this.Email,
        //    Phone: this.Phone == null ? "" : this.Phone
        //}
        //self.CompanyContactsArr.push(companyContactList);
        //ClearFields();

        var contact = self.newContact;
        ContactAPIService.add(contact).then(function (result) {
            ClearFields();
            getContactData(true);
        }, function (error) {
        });
    }
    this.Reset = function () {
        ClearFields();
    }

    function ClearFields() {

        self.FirstName = "";
        self.LastName = "";
        self.CompanyName = "";
        self.Address = "";
        self.City = "";
        self.State = "";
        self.ZipCode = "";
        self.Phone = "";
        self.Fax = "";
        self.Email = "";

        self.newContact = {};
    }


    // edit contact
    self.editSelected = false;
    // contact selected for edit
    // used for clearing user changes
    self.contactSelectedToEdit = {};
    // hold user changes
    self.editedContact = {};

    self.EditContact = function (contact) {
        self.editSelected = true;
        self.contactSelectedToEdit = contact;
        copyContactSelectedToEditToEdited();
    }
    self.ResetEditChanges = function () {
        copyContactSelectedToEditToEdited();
    }
    self.SubmitEdit = function () {
        var contact = self.editedContact;
        ContactAPIService.update(contact.contactID, contact).then(function (result) {
            getContactData(true);
        }, function (error) {
        });
    }
    self.CancelEdit = function () {
        clearEditObjects();
    }

    // helpers
    function clearEditObjects() {
        self.contactSelectedToEdit = null;
        self.editedContact = null;
        self.editSelected = false;
    }
    function copyContactSelectedToEditToEdited() {
        copyObj(self.contactSelectedToEdit, self, 'editedContact');
    }

    function copyObj(original, copyObjContainer, property) {
        copyObjContainer[property] = angular.copy(original);
    }

}]);