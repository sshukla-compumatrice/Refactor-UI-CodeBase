angular.module('ProjectCreation').controller('FindContactCtrl', ['$scope', '$log', '$modalInstance', '$http', 'contactObj', 'ContactAPIService', '$timeout', 'BASEURL', 'globalValues', function ($scope, $log, $modalInstance, $http, contactObj, ContactAPIService, $timeout, BASEURL, globalValues) {

        $scope.possibleTimes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

        // $scope.time = time;


        var self = this;
        self.companyId = globalValues.currentUserCompanyGuid;
        self.currentPage = 1;
        self.numPerPage = 20;
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

        function getStates() {
            var url = BASEURL.SHARED_GEOCODE + CountryStateUrlColl.GETAPI_STATES;
            var params = {
                countryCode: 'US'
            };

            self.stateList = APIFactory.get(url, params).then(function (data) {
                if (data && data.states) {
                    return data.states;
                }
                return null;
            });
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

        self.filter = function () {
            $timeout(function () {
                self.totalItems = self.filtered.length;
            }, 10);
        };

        this.CancelDelete = function () {

            //console.log("return value: " + $scope.hour);
            //console.log(time);
            //$modalInstance.close($scope.hour);
            $modalInstance.close();
        }

        this.FindContactClick = function () {

            resetAddContactMsgFields();
            resetEditContactMsgFields();

            $scope.selectedTab = 1;

            clearValidationMessages("addContactForm");
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
                zip: contact.zipCode

                //contactID: contact.contactID,
                //phone: contact.phone,
                //fax: contact.fax,
                //email: contact.email

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

        this.SubmitContact = function (form) {

            if (!form || form.$invalid) {
                self.showAddContactOpMsg = true;
                self.isAddContactOpSuccess = false;
                self.addContactOpMsg = "Invalid Form Submission";
                var inputElements = document.getElementsByName(form.$name);
                angular.element(inputElements).find(':input').trigger('blur');
                return
            }

            resetAddContactMsgFields();

            var contact = self.newContact;
            contact.companyGuid = self.companyId;

            ContactAPIService.add(contact).then(function (result) {
                ClearFields();
                self.showAddContactOpMsg = true;
                self.isAddContactOpSuccess = true;
                self.addContactOpMsg = "Contact added successfully."
                getContactData(true);
            }, function (error) {
                self.showAddContactOpMsg = true;
                self.isAddContactOpSuccess = false;
                self.addContactOpMsg = error;
            });
        }

        function resetAddContactMsgFields() {
            self.showAddContactOpMsg = false;
            self.isAddContactOpSuccess = false;
            self.addContactOpMsg = "";
        }

        this.Reset = function (form) {
            resetAddContactMsgFields();
            ClearFields();
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
            var contact = self.editedContact;

            var put = {
                contactID: contact.contactID,
                contactGUID: contact.contactGUID,
                companyName: contact.companyName,
                firstName: contact.firstName,
                lastName: contact.lastName,
                address: contact.address,
                city: contact.city,
                state: contact.state,
                zipCode: contact.zipCode,
                phone: contact.phone,
                fax: contact.fax,
                email: contact.email
            }

            ContactAPIService.update(contact.contactGUID, put).then(function (result) {
                self.showEditContactOpMsg = true;
                self.isEditContactOpSuccess = true;
                self.editContactOpMsg = "Contact edited successfully."
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

    }
]);
