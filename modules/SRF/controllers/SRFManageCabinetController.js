angular.module('SRFModule').controller('SRFManageCabinetCtrl', ['$scope', '$modal', '$compile', 'shareDataService', 'SRFCabinetFactory', 'SRFUrls', '$http', '$rootScope', 'Encoder', 'globalValues', 'SRFResources',
                                                             function ($scope, $modal, $compile,
        shareDataService, SRFCabinetFactory, SRFUrls, $http, $rootScope, Encoder, globalValues, SRFResources)
    {
        var self = this;
        this.serviceResponseAlert = false;
        this.emails = []; //global variable for this controller to store default emails from service.
        this.storeCabinetName; // global variable for this controller to store cabinet name.
        this.id = ''; // global variable for this controller to store cabinet id.
        this.arrayForEditView = [];
        this.arrayForCancelView = [];
        var emailTemplateUrl = SRFUrls.emailTemplate;

        //This condition executes on refresh
        if (globalValues.pageRefreshed && localStorage.getItem('m_cab') != undefined) {
            var encodedString = localStorage.getItem('m_cab');
            var decodedString = Encoder.decode(encodedString);
            var decodedJSON = JSON.parse(decodedString);
            fillCabinetDetails(decodedJSON.cabinetID);
        }

        /**
         * watch changes in cabinet name and update the screen accordingly
         */
        $scope.$watch(function () {
                if (localStorage.getItem("manage") == "true") {
                    self.cabinetDeleted = false;
                }
                return shareDataService.getCabinet();
            },
            function (value) {
                if (value != undefined) {
                    $scope.email = "";
                    self.serviceResponseAlert = false;
                    self.emails = [];
                    self.id = value.cabinetID;
                    //make a service call to get notification emails from cabinet ID
                    fillCabinetDetails(value.cabinetID);
                }

            }
        )

        function fillCabinetDetails(cabinetID) {
            SRFCabinetFactory.getCabinetDetailsByID(cabinetID).then(function (result) {
                self.storeCabinetName = result.cabinetName;
                self.cabinetName = result.cabinetName;
                self.id = result.cabinetID;
                angular.forEach(result.monitoringEmails, function (email) {
                    self.serviceResponseAlert = false;
                    //This is to show updated view if page is in edited mode and cabinet is changed
                    self.emails.push(email.emailAddress);
                });
                if (self.default && self.edit) {
                    angular.element('.editemaildiv').remove();
                    showEmailsOnEdit(self.emails);
                }
                self.arrayForEditView = self.emails;
                self.prefilledEmails = self.emails.join(', ');

            }, function (error) {
                var emptyArray = [];
                angular.element('#serviceResponseDiv').addClass('alert-danger');
                self.serviceResponseAlert = true;
                self.serviceResponseText = error.data.userMessage;

            });
        }

        /*function saveObjectForRefresh(cabinetName, emails, status, message) {
            self.refreshObject.name = cabinetName;
            self.refreshObject.emails = emails;
            self.refreshObject.status = status;
            self.refreshObject.message = message;
            var encodedString = Encoder.encode(JSON.stringify(self.refreshObject));
            localStorage.setItem('m_cab', encodedString);
        }*/

        this.emptyModal = function (e) {
            if (this.cabinetName == undefined) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * common function to show dynamic divs represnting emails.
         */
        function showEmailsOnEdit(arrayForEditView) {

            angular.forEach(arrayForEditView, function (email) {
                if (email != "") {
                    $http.get(emailTemplateUrl).success(function (response) {
                        template = response;
                        angular.element('.cabinetemaildiv').append(template);
                        $compile($('.dynamicemails').contents())($scope);
                        $('.dynamicemails:last span:first').text(email);
                    });
                }
            });
        }

        /**
         * emails hardcoded for now to implement typeahead functionality
         */
        $scope.emails = ['prateek@compumatrice.com', 'sucheta@compumatrice.com',
                        'prakash@compumatrice.com'];

        /**
         * function to show emails in edit mode after clicking on edit
         */
        this.editCabinetDetails = function () {
            self.serviceResponseAlert = false;
            this.default = true;
            this.edit = true;
            shareDataService.setEditMode(true);
            this.arrayForCancelView = this.arrayForEditView;
            angular.element('#cabinetemail').removeClass('has-error');
            showEmailsOnEdit(this.arrayForEditView);
        }

        /**
         * cancel edit functionality.
         */
        this.cancelEdit = function () {
            //$scope.$broadcast('show-errors-reset');
            this.default = false;
            this.edit = false;
            shareDataService.setEditMode(false);
            self.serviceResponseAlert = false;
            this.cabinetName = this.storeCabinetName;
            $scope.email = "";
            //this.prefilledEmails = this.emails;*/
            angular.element('#cabinetemail').removeClass('has-error');
            angular.element('.editemaildiv').remove();
        }

        /**
         * save after editing the cabinet details
         */
        this.saveEdit = function () {
            $scope.$broadcast('show-errors-check-validity');
            if (this.managecabinetform.$invalid) {
                return;
            }
            else if(angular.element('.dynamicemails').length == 0) {
                return;
            }
                else {
                $scope.email = ""; // clearing the typeahead
                this.serviceResponseAlert = false;
                var servicePutEmailObj = {};
                var editedEmails = [];
                
                servicePutEmailObj.monitoringEmails = [];
               
                servicePutEmailObj.cabinetName = this.cabinetName;
                servicePutEmailObj.cabinetID = this.id;
                angular.element(".dynamicemails").each(function (i) {


                    var emailAddress = {};
                    emailAddress.emailAddress = $('span:first', this).text().trim();
                    servicePutEmailObj.monitoringEmails[i] = emailAddress;
                    editedEmails.push($('span:first', this).text().trim());


                });
                editedEmails = editedEmails.filter(Boolean);
                SRFCabinetFactory.updateCabinet(servicePutEmailObj, this.id).then(function (result) {

                    self.default = false;
                    self.edit = false;
                    self.prefilledEmails = '';
                    self.arrayForEditView = [];
                    self.arrayForEditView = editedEmails;
                    self.prefilledEmails = editedEmails.join(', ');
                    self.serviceResponseAlert = true;
                    self.storeCabinetName = servicePutEmailObj.cabinetName;
                    angular.element('#serviceResponseDiv').removeClass('alert-danger');
                    angular.element('#serviceResponseDiv').removeClass('alert-warning');
                    angular.element('#serviceResponseDiv').addClass('alert-success');
                    self.serviceResponseText = 'Cabinet Details Updated';
                    angular.element('.editemaildiv').remove();
                    $scope.$root.$broadcast('update-cabinet-detail', servicePutEmailObj);
                    //setLocalStorageForCabinets(servicePutEmailObj.cabinetName,id);                                  
                }, function (error) {
                    angular.element('#serviceResponseDiv').removeClass('alert-success');
                    angular.element('#serviceResponseDiv').removeClass('alert-warning');
                    angular.element('#serviceResponseDiv').addClass('alert-danger');
                    self.serviceResponseAlert = true;
                    self.serviceResponseText = error.data.userMessage;
                    self.default = true;
                    self.edit = true;
                })
            }
        }

        /*function setLocalStorageForCabinets(name,id){
            var encodedString = Encoder.encode(JSON.stringify({
                        name: name,
                        cabinetID: id
                    }));
                    localStorage.setItem('m_cab', encodedString);
        }*/

        /**
         * function called on selecting typeahead emails.
         */
        this.selectEmail = function () {
            angular.element('#cabinetemail').removeClass('has-error');
            var checkForSelectedEmails = [];
            angular.element(".dynamicemails").each(function (i) {

                checkForSelectedEmails.push($('span:first', this).text().trim());

            });
            //requirement-- not allow emails if the existing emails count is more than 15
            if (checkForSelectedEmails.length <= 14) {
                //this.serviceResponseAlert = false;
                //Don't allow to enter emails that is already there.
                if (checkForSelectedEmails.indexOf($scope.email) == -1) {
                    $http.get(emailTemplateUrl).success(function (response) {
                        template = response;
                        $('.cabinetemaildiv').append(template);
                        $compile($('.dynamicemails').contents())($scope);
                        $('.editemaildiv:last #typeahedemails').text($scope.email);
                        $scope.email = "";
                    });
                    
                }
                else{
                    $scope.email = "";
                }
                

            } else {
                
                angular.element('#serviceResponseDiv').removeClass('alert-success');
                angular.element('#serviceResponseDiv').removeClass('alert-danger');
                angular.element('#serviceResponseDiv').addClass('alert-warning');
                self.serviceResponseAlert = true;
                self.serviceResponseText = SRFResources.emailLimitsWarning;
            }


        }
        
       

        $scope.DeleteDiv = function () {}

        this.closeWarning = function () {
            this.serviceResponseAlert = false;
        }

        /**
         * show alert pop up on delete
         */
        this.deletePopUp = function () {
            var modalInstance = $modal.open({
                templateUrl: 'alertpopup.html',
                scope: $scope,
                controller: 'DeleteAlertController as deletealert',
                size: 'lg'
            }).result.then(function (result) {
                if (result.value) {
                    self.serviceResponseAlert = false;
                } else {

                    angular.element('#serviceResponseDiv').addClass('alert-danger');
                    self.serviceResponseAlert = true;
                    self.serviceResponseText = result.msg;
                }
                self.cabinetDeleted = result.value;
            });
        }




}]).
controller('DeleteAlertController', ['$modalInstance', '$scope', 'shareDataService', 'SRFCabinetFactory', 'globalValues', 'Encoder', function ($modalInstance, $scope, shareDataService, SRFCabinetFactory, globalValues, Encoder) {

    var deleteResolve = {
        value: '',
        msg: ''

    }
    this.cancelDeletion = function () {
        //$scope.value = false;
        deleteResolve.value = true;
        $modalInstance.close(deleteResolve);
    }

    this.deleteCabinet = function () {

        localStorage.setItem("manage", false);
        if (!globalValues.pageRefreshed) {
            var cabinetToDelete = shareDataService.getCabinet();
        } else {
            var encodedString = localStorage.getItem('m_cab');
            var decodedString = Encoder.decode(encodedString);
            var cabinetToDelete = JSON.parse(decodedString);
        }
        SRFCabinetFactory.deleteCabinet(cabinetToDelete.cabinetID).then(function (result) {
            $scope.$root.$broadcast('reset-cabinets', cabinetToDelete);
            deleteResolve.value = true;

            localStorage.removeItem('m_cab');
            $modalInstance.close(deleteResolve);
        }, function (error) {
            deleteResolve.value = false;
            deleteResolve.msg = error.data.userMessage;

            $modalInstance.close(deleteResolve);
        })
    }

}]);