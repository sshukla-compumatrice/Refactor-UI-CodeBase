angular.module('ProjectCreation').controller('EmailContactsCtrl', ['$scope', '$log', '$modalInstance', '$http', 'ContactAPIService', 'BASEURL', 'globalValues', function ($scope, $log, $modalInstance, $http, ContactAPIService, BASEURL, globalValues) {

    var self = this;
    // pagination
    self.currentPage = 1;
    self.numPerPage = 20;
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


    function checkEmailPattern(emailValue) {
        var regexp = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
        return regexp.test(emailValue);

    }

    function bind(data) {
        self.ContactArr = [];
        if (data.length > 0) {

            self.ContactArr = angular.copy(data);
            self.totalItems = self.ContactArr.length;
        }
    }


    this.uncheckCCContact = function (contact) {
        if (contact.toSelected != undefined) {
            contact.toSelected = false;
        }

    }

    this.uncheckToContact = function (contact) {
        if (contact.ccSelected != undefined) {
            contact.ccSelected = false;
        }

    }

    this.paginate = function (value) {
        var begin, end, index;
        begin = (self.currentPage - 1) * self.numPerPage;
        end = begin + self.numPerPage;
        index = self.filtered.indexOf(value);
        return (begin <= index && index < end);
    };
    this.filter = function () {
        $timeout(function () {
            self.totalItems = self.filtered.length;
        }, 10);
    };
    this.Cancel = function () {
        $modalInstance.close();
    };

    this.DoneSelection = function () {
        var contactsArray = [];
        contactsArray.emailTo = [];
        contactsArray.emailCC = [];

        for (var i = 0; i < self.ContactArr.length; i++) {
            var contact = self.ContactArr[i];

            if (contact.toSelected || contact.ccSelected) {
                contactsArray.push(contact);

                if (contact.toSelected) {
                    contactsArray.emailTo.push(contact.email);

                }
                if (contact.ccSelected) {
                    contactsArray.emailCC.push(contact.email);
                }
            }

        }


        /*if (contactsArray && contactsArray.length) {         
            var emailTo = [];
            var emailCC = [];
            for (var i = 0; i < contactsArray.length; i++) {
                var contact = contactsArray[i];
                if (contact.toSelected) {
                    emailTo.push(contact.email);
                }
                if (contact.ccSelected) {
                    emailCC.push(contact.email);
                }
            }
            if(emailTo) contactsArray.emailTo = emailTo;
            if(emailCC) contactsArray.emailCC = emailCC;
        }*/


        $modalInstance.close(contactsArray);
    };



    this.Reset = function (form) {
        resetAddContactMsgFields();
        // ClearFields();
        clearValidationMessages(form.$name);
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
    self.ResetEditChanges = function (form) {

        self.editedContact = {};
        self.EditContact(self.contactSelectedToEdit);
        //resetEditContactMsgFields();
        // copyContactSelectedToEditToEdited();
        // clearValidationMessages(form.$name);
        var formName = form.$name;
        $("form[name=" + formName + "] .has-error").each(function () {
            if (!$(this).hasClass('ng-hide')) {
                $(this).removeClass('has-error');
                $(this).find('.error-text').each(function () {
                    var spanElem = angular.element(this);
                    spanElem.remove();
                });
            }
        });
    }
    self.SubmitEdit = function (form) {

        if (!form || form.$invalid) {
            self.showEditContactOpMsg = true;
            self.isEditContactOpSuccess = false;
            self.editContactOpMsg = "Invalid Form Submission";
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            return
        }

        resetEditContactMsgFields();
        var emailContact = self.editedContact;

        var put = {
            contactID: emailContact.contactID,
            contactGUID: emailContact.contactGUID,
            companyName: emailContact.companyName,
            firstName: emailContact.firstName,
            lastName: emailContact.lastName,
            address: emailContact.address,
            city: emailContact.city,
            state: emailContact.state,
            zipCode: emailContact.zipCode,
            phone: emailContact.phone,
            fax: emailContact.fax,
            email: emailContact.email
        }

        ContactAPIService.update(emailContact.contactGUID, put).then(function (result) {

            self.showEditContactOpMsg = true;
            self.isEditContactOpSuccess = true;
            self.editContactOpMsg = "Contact edited successfully.";
            self.editSelected = false;

            getContactData(true);
        }, function (error) {
            self.showEditContactOpMsg = true;
            self.isEditContactOpSuccess = false;
            self.editContactOpMsg = error;
        });
    }
    self.CancelEdit = function (form) {
        resetEditContactMsgFields();
        clearEditObjects();
        clearValidationMessages(form.$name);
    }

    // helpers
    function resetEditContactMsgFields() {
        self.isEditContactOpSuccess = false;
        self.showEditContactOpMsg = false;
        self.editContactOpMsg = "";
    }

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


    function clearValidationMessages(formName) {
        $("form[name=" + formName + "] .has-error").each(function () {
            if (!$(this).hasClass('ng-hide')) {
                $(this).removeClass('has-error');
                $(this).find('.error-text').each(function () {
                    var spanElem = angular.element(this);
                    spanElem.remove();
                });
            }
        });

        $("form[name=" + formName + "]").get(0).reset();
    }

}]);
