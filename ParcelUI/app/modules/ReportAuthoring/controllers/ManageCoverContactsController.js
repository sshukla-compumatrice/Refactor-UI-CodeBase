// appendix tool controller 
angular.module('ReportAuthoring').controller('ManageCoverContactsController', ['$scope', '$modal', '$modalInstance', '$rootScope', 'GeneralInformationAPI', 'BASEURL', '$location', 'siteLocation', "globalValues", function ($scope, $modal, $modalInstance, $rootScope, GeneralInformationAPI, BASEURL, $location, siteLocation, globalValues) {
    var self = this;
    self.errorMsg = "";
    self.successMsg = "";
    self.isEditContact = false;
    self.contactsArr = [];
    var reportGuid = $location.search().reportGuid;
    var companyGUID = globalValues.currentUserCompanyGuid;

    function init() {
        if (siteLocation) {
            self.siteLocationAddress = siteLocation.location.address1;
        }

        GeneralInformationAPI.get(reportGuid).then(function (resp) {
            self.giData = resp.generalInformation;
            self.contactsArr = resp.generalInformation.coverContacts ? resp.generalInformation.coverContacts : [];
        });
    }

    init();

    self.CancelDelete = function () {
        $modalInstance.close();
    }

    self.addContact = function (form) {
        var GIObj = {
            "coverContacts": []
        };
        self.errorMsg = "";
        self.successMsg = "";
        var contactObj = {
            "clientFax": "",
            "clientZip": "",
            "clientCity": "",
            "orderIndex": (self.contactsArr.length) ? self.contactsArr.length : 0,
            "clientEmail": "",
            "clientPhone": "",
            "clientState": "",
            "contactGUID": "",
            "clientAddress": "",
            "clientCompany": "",
            "clientContact": ""
        };
        if (!form || form.$invalid) {
            var formElem = document.getElementsByName(form.$name);
            angular.element(formElem).find(':input').trigger('blur');
            return;
        } else {
            contactObj.clientCompany = self.clientCompany != undefined && self.clientCompany != "" && self.clientCompany != "" ? self.clientCompany : "";
            contactObj.clientContact = self.clientContact != undefined && self.clientContact != "" && self.clientContact != "" ? self.clientContact : "";
            contactObj.clientAddress = self.clientAddress != undefined && self.clientAddress != "" && self.clientAddress != "" ? self.clientAddress : "";
            contactObj.clientCity = self.clientCity != undefined && self.clientCity != "" && self.clientCity != "" ? self.clientCity : "";
            contactObj.clientState = self.clientState != undefined && self.clientState != "" && self.clientState != "" ? self.clientState : "";
            contactObj.clientZip = self.clientZip != undefined && self.clientZip != "" && self.clientZip != "" ? self.clientZip : "";
            contactObj.clientPhone = self.clientPhone != undefined && self.clientPhone != "" && self.clientPhone != "" ? self.clientPhone : "";
            contactObj.clientFax = self.clientFax != undefined && self.clientFax != "" && self.clientFax != "" ? self.clientFax : "";
            contactObj.clientEmail = self.clientEmail != undefined && self.clientEmail != "" && self.clientEmail != "" ? self.clientEmail : "";

            GIObj.coverContacts = angular.copy(self.contactsArr);
            GIObj.coverContacts.push(contactObj);
            GeneralInformationAPI.putGI(GIObj, reportGuid).then(function (resp) {
                self.contactsArr.push(contactObj);
                self.successMsg = "Cover contact added successfully.";
                clearFields();
            }, function (error) {
                self.successMsg = "Problem in adding cover conatact. " + error;
            });
        }
    }

    self.updateContact = function (form, orderIndex) {
        var GIObj = {
            "coverContacts": []
        };
        self.errorMsg = "";
        self.successMsg = "";
        //var contact = JSON.parse(localStorage.getItem('editContactObj'));

        var contactObj = {
            "clientFax": "",
            "clientZip": "",
            "clientCity": "",
            "orderIndex": orderIndex,
            "clientEmail": "",
            "clientPhone": "",
            "clientState": "",
            "contactGUID": "",
            "clientAddress": "",
            "clientCompany": "",
            "clientContact": ""
        };
        if (!form || form.$invalid) {
            self.errorMsg = "Invalid Form Submission";
            return;
        } else {
            contactObj.clientCompany = self.clientCompany != undefined && self.clientCompany != "" && self.clientCompany != "" ? self.clientCompany : "";
            contactObj.clientContact = self.clientContact != undefined && self.clientContact != "" && self.clientContact != "" ? self.clientContact : "";
            contactObj.clientAddress = self.clientAddress != undefined && self.clientAddress != "" && self.clientAddress != "" ? self.clientAddress : "";
            contactObj.clientCity = self.clientCity != undefined && self.clientCity != "" && self.clientCity != "" ? self.clientCity : "";
            contactObj.clientState = self.clientState != undefined && self.clientState != "" && self.clientState != "" ? self.clientState : "";
            contactObj.clientZip = self.clientZip != undefined && self.clientZip != "" && self.clientZip != "" ? self.clientZip : "";
            contactObj.clientPhone = self.clientPhone != undefined && self.clientPhone != "" && self.clientPhone != "" ? self.clientPhone : "";
            contactObj.clientFax = self.clientFax != undefined && self.clientFax != "" && self.clientFax != "" ? self.clientFax : "";
            contactObj.clientEmail = self.clientEmail != undefined && self.clientEmail != "" && self.clientEmail != "" ? self.clientEmail : "";

            GIObj.coverContacts = angular.copy(self.contactsArr);

            for (var i = 0; i < GIObj.coverContacts.length; i++) {
                if (GIObj.coverContacts[i].orderIndex == orderIndex) {
                    GIObj.coverContacts.splice(i, 1);
                    break;
                }
            }

            GIObj.coverContacts.push(contactObj);
            GeneralInformationAPI.putGI(GIObj, reportGuid).then(function (resp) {
                self.contactsArr = angular.copy(GIObj.coverContacts);
                self.isEditContact = false;
                self.successMsg = "Cover contact updated successfully.";
                clearFields();
            }, function (error) {
                self.successMsg = "Problem in updating cover conatact. " + error;
            });
        }
    }

    self.cancelEdit = function () {
        self.errorMsg = "";
        self.successMsg = "";
        clearFields();
    }

    function clearFields() {
        self.contactGUID = "";
        self.clientCompany = "";
        self.clientContact = "";
        self.clientAddress = "";
        self.clientCity = "";
        self.orderIndex = "";
        self.clientState = "";
        self.clientZip = "";
        self.clientPhone = "";
        self.clientFax = "";
        self.clientEmail = "";
    }

    self.editCoverContact = function (contact) {
        self.errorMsg = "";
        self.successMsg = "";
        self.clientCompany = contact.clientCompany != undefined && contact.clientCompany != null ? contact.clientCompany : "";
        self.clientContact = contact.clientContact != undefined && contact.clientContact != null ? contact.clientContact : "";
        self.clientAddress = contact.clientAddress != undefined && contact.clientAddress != null ? contact.clientAddress : "";
        self.clientCity = contact.clientCity != undefined && contact.clientCity != null ? contact.clientCity : "";
        self.clientState = contact.clientState != undefined && contact.clientState != null ? contact.clientState : "";
        self.clientZip = contact.clientZip != undefined && contact.clientZip != null ? contact.clientZip : "";
        self.clientPhone = contact.clientPhone != undefined && contact.clientPhone != null ? contact.clientPhone : "";
        self.clientFax = contact.clientFax != undefined && contact.clientFax != null ? contact.clientFax : "";
        self.clientEmail = contact.clientEmail != undefined && contact.clientEmail != null ? contact.clientEmail : "";
        self.orderIndex = contact.orderIndex != undefined ? contact.orderIndex : -1;
    }

    var moveRow = function (origin, destination) {
        var GIObj = {
            "coverContacts": []
        };
        GIObj.coverContacts = angular.copy(self.contactsArr);

        for (var i = 0; i < GIObj.coverContacts.length; i++) {
            if (GIObj.coverContacts[i].orderIndex == origin) {
                GIObj.coverContacts[i].orderIndex = destination;
            } else if (self.contactsArr[i].orderIndex == destination) {
                GIObj.coverContacts[i].orderIndex = origin;
            }
        }

        GeneralInformationAPI.putGI(GIObj, reportGuid).then(function (resp) {
            self.contactsArr = angular.copy(GIObj.coverContacts);
            self.isEditContact = false;
            self.successMsg = "Cover contact order updated successfully.";
            clearFields();
        }, function (error) {
            self.successMsg = "Problem in updating cover conatact order. " + error;
        });
    };

    self.moveUp = function (index) {
        moveRow(index, index - 1);
    }

    self.moveDown = function (index) {
        moveRow(index, index + 1);
    }

    self.deleteCoverContact = function (index, clientCompany, clientContact) {
        var deleteConfirmationStatus = $modal.open({
            templateUrl: 'delete-confirmation-modal.html',
            scope: $scope,
            controller: function ($scope, $modal, clientCompany, clientContact) {
                var isDeleteConfirm = false;
                $scope.clientCompany = clientCompany;
                $scope.clientContact = clientContact;
                $scope.confirmDelete = function () {
                    isDeleteConfirm = true;
                    deleteConfirmationStatus.close(isDeleteConfirm);
                }

                $scope.closeModal = function () {
                    deleteConfirmationStatus.close(isDeleteConfirm);
                }
            },
            size: 0,
            resolve: {
                clientCompany: function () {
                    return clientCompany
                },
                clientContact: function () {
                    return clientContact
                }
            }
        });

        deleteConfirmationStatus.result.then(function (isDeleteConfirm) {
            var GIObj = {
                "coverContacts": []
            };
            if (isDeleteConfirm) {
                self.isEditContact = false;
                self.errorMsg = "";
                self.successMsg = "";
                self.contactsArr.splice(index, 1);
                for (var i = 0; i < self.contactsArr.length; i++) {
                    if (self.contactsArr[i].orderIndex > index) {
                        self.contactsArr[i].orderIndex -= 1;
                    }
                }
                GIObj.coverContacts = angular.copy(self.contactsArr);
                GeneralInformationAPI.putGI(GIObj, reportGuid).then(function (resp) {
                    self.successMsg = "Cover contact removed successfully.";
                    clearFields();
                }, function (error) {
                    self.successMsg = "Problem in removing cover conatact. " + error;
                });
                clearFields();
            }
        });
    }
}]);