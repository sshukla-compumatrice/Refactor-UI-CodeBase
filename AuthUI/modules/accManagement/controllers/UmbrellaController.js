angular.module('AccountMgmtModule').controller('UmbrellaController', ['$timeout', '$scope', '$rootScope', '$compile', '$modal', '$state', 'companyData', 'CompanyServiceAPI', 'UserServiceAPI', 'ListingsAPI', function ($timeout, $scope, $rootScope, $compile, $modal, $state, companyData, CompanyServiceAPI, UserServiceAPI, ListingsAPI) {

    var scope = $scope;
    var self = this;
    self.companyData = companyData.companies[0];
    //    self.compList = compList.companies;
    self.arr = ["1", "2", "3", "4"];
    self.companyAssociations = self.companyData.companyAssociations;
    getDataTableJSON();
    getCompanyAssociationData();

    function getDataTableJSON() {
        var compUmbrellaData = [];
        angular.forEach(self.companyAssociations, function (compAsso, index) {
            if (compAsso.companyAssociationUsers.length == 0) {
                var companyAssociations = {};
                companyAssociations['associatedCompanyGUID'] = compAsso.associatedCompanyGUID;
                companyAssociations['associationType'] = compAsso.associationType;
                companyAssociations['companyAssociationGUID'] = compAsso.companyAssociationGUID;
                companyAssociations['companyName'] = compAsso.companyName;
                companyAssociations['companyGUID'] = compAsso.companyGUID;
                //                        companyAssociations['companyAssociationUserGUID'] = "";
                companyAssociations['companyAssociationUserName'] = "";
                companyAssociations['companyAssociationUsers'] = null;
                compUmbrellaData.push(companyAssociations);
            }
            if (compAsso.companyAssociationUsers.length > 0) {
                for (var i = 0; i < compAsso.companyAssociationUsers.length; i++) {
                    var companyAssociations = {};
                    companyAssociations['associatedCompanyGUID'] = compAsso.associatedCompanyGUID;
                    companyAssociations['associationType'] = compAsso.associationType;
                    companyAssociations['companyAssociationGUID'] = compAsso.companyAssociationGUID;
                    companyAssociations['companyName'] = compAsso.companyName;
                    companyAssociations['companyGUID'] = compAsso.companyGUID;
                    //                        var companyAssociationUsers = Object.keys(compAsso.companyAssociationUsers[i]).map(function(k) { return compAsso.companyAssociationUsers[k] });
                    companyAssociations['companyAssociationUsers'] = compAsso.companyAssociationUsers[i];
                    companyAssociations['companyAssociationUserName'] = compAsso.companyAssociationUsers[i].firstName + ' ' + compAsso.companyAssociationUsers[i].middleInitial + ' ' + compAsso.companyAssociationUsers[i].lastName;
                    compUmbrellaData.push(companyAssociations);
                }
            }
        })
        self.compUmbrellaData = compUmbrellaData;
    }

    function getCompanyAssociationData() {
        $timeout(function () {
            if (self.compUmbrellaData.length > 0)
                fillCompanyAssociationData(true);
        });
    }

    function fillCompanyAssociationData(isFirstTime) {
        $(document).ready(function () {
            $scope.dataTable = $('#tblCompUmbrella').DataTable({
                "dom": '<"pull-left"i><"pull-right"p>t<"pull-right"p>',
                "processing": true,
                "data": self.compUmbrellaData,
                //"retrieve": true,
                "orderCellsTop": true,
                "initComplete": function () {

                    $('#tblCompUmbrella tbody tr').each(function () {
                        $(this).find('td:eq(0)').css('white-space', 'nowrap');
                    });
                    ////Uncomment if need to add filters
                    $('#tblCompUmbrella thead tr#filterrow th').each(function () {
                        var title = $('#tblCompUmbrella thead th').eq($(this).index() + 1).text();
                        if (title != "")
                            var elemHtml = '<input type="text" class="form-control input-xs" ng-click="stopPropagation($event);" text-change = ' + title.split(" ").join("") + ' />';
                        var compiledHtml = $compile(elemHtml)(scope);
                        $(this).html(compiledHtml);
                    });
                },
                "language": {
                    "info": "<strong>Showing _START_ - _END_ of _TOTAL_ records<strong>"
                },
                /*"language": {
                    "lengthMenu": "Per page: _MENU_"
                        //"zeroRecords": "Nothing found - sorry",
                        //"info": "Showing page _PAGE_ of _PAGES_",
                        //"infoEmpty": "No records available",
                        //"infoFiltered": "(filtered from _MAX_ total records)"
                },*/
                "stateSave": true,
                "columnDefs": [
                    {
                        "targets": 0,
                        "title": "Company Id",
                        "data": "companyGUID",
                        "sortable": true,
                        "visible": false
                    },
                    {
                        "targets": 1,
                        "title": "CompanyName",
                        "data": "companyName",
                        "sortable": true
                    },
                    {
                        "targets": 2,
                        "title": "Function",
                        "data": "associationType",
                        "sortable": true

                    },
                    {
                        "targets": 3,
                        "title": "ProjectManager",
                        "data": "companyAssociationUserName",
                        "sortable": true
                    },
                    {
                        "targets": -1,
                        "title": "Actions",
                        "data": null,
                        "className": "center",
                        "mRender": function (data, type, row) {
                            var compAssoUserId = '';
                            if (row.companyAssociationUsers != null) {
                                var compAssoUserId = row.companyAssociationUsers.companyAssociationUserGUID;
                                return "<a class='table-addContact pointer' data-companyAssoGUID=" + row.companyAssociationGUID + " data-companyAssoUserGUID =" + compAssoUserId + ">Add Contact</a> | <a class='table-deleteContact pointer' data-id=" + row.companyGUID + ">Delete Contact</a> | <a class='table-deleteCompany pointer' data-id=" + row.companyGUID + ">Delete Company</a>"
                            }
                            else
                                return "<a class='table-addContact pointer' data-companyAssoGUID=" + row.companyAssociationGUID + " data-companyAssoUserGUID =" + compAssoUserId + ">Add Contact</a> | <a class='table-deleteCompany pointer' data-id=" + row.companyGUID + ">Delete Company</a>"
                            //console.log(JSON.stringify(data)+type+JSON.stringify(row));
                            //{"id":1,"orgName":"ABC"}display{"id":1,"orgName":"ABC"}
                        }
                    }
        ],

                "lengthMenu": [[10, 25, 50, 100, 250, 500, -1], [10, 25, 50, 100, 250, 500, "All"]],
                "paging": true,
                "pagingType": "simple_numbers",
                "pageLength": 100,
                "ordering": true,
                "info": false,
                "filter": false,
                "searching": false
            });

            ////Edit record
            if (isFirstTime) {
                $('#tblCompUmbrella').on('click', 'a.table-addContact', function (e) {
                    e.preventDefault();
                    var data = $scope.dataTable.row($(this).parents('tr')).data();

                    var modalContainer = {
                        modalType: 'Add Company',
                        companyGUID: data.companyGUID,
                        companyAssociationGUID: data.companyAssociationGUID,
                        compName: data.companyName,
                        compFunction: data.associationType,
                        //                                compAssoUsers: self.compAssoUsers
                    }
                    var modalInstance = $modal.open({
                        templateUrl: "AddContactAssociationPopup.html",
                        scope: $scope,
                        controller: addContactController,
                        size: 0,
                        resolve: {
                            data: function () {
                                return modalContainer;
                            },
                            compAssoUsers: function (UserServiceAPI) {
                                return UserServiceAPI.getUserInfo(null, data.companyGUID).then(function (resp) {
                                    return compAssoUsers = resp.users;
                                })
                            }
                        }
                    })
                });

                $('#tblCompUmbrella').on('click', 'a.table-deleteContact', function (e) {
                    e.preventDefault();
                    var data = $scope.dataTable.row($(this).parents('tr')).data();
                    if (data.companyAssociationUsers != null) {
                        var modalContainer = {
                            enityType: 'contact',
                            companyGUID: data.companyGUID,
                            //companyGUID: companyGUID,
                            companyAssociationGUID: data.companyAssociationGUID,
                            companyAssociationUserGUID: data.companyAssociationUsers.companyAssociationUserGUID,
                            enityName: data.companyAssociationUsers.firstName + ' ' + data.companyAssociationUsers.lastName
                        }
                        var modalInstance = $modal.open({
                            templateUrl: "delete-confirmation-action-modal.html",
                            scope: $scope,
                            controller: deleteCompContactAssoCtrl,
                            size: 0,
                            resolve: {
                                data: function () {
                                    return modalContainer;
                                }
                            }
                        })
                    }

                });

                $('#tblCompUmbrella').on('click', 'a.table-deleteCompany', function (e) {
                    e.preventDefault();
                    var data = $scope.dataTable.row($(this).parents('tr')).data();
                    var modalContainer = {
                        enityType: 'company',
                        companyGUID: data.companyGUID,
                        //companyGUID: companyGUID,
                        companyAssociationGUID: data.companyAssociationGUID,
                        enityName: data.companyName
                    }
                    var modalInstance = $modal.open({
                        templateUrl: "delete-confirmation-action-modal.html",
                        scope: $scope,
                        controller: deleteCompContactAssoCtrl,
                        size: 0,
                        resolve: {
                            data: function () {
                                return modalContainer;
                            }
                        }
                    })
                });
            } //end of if
        });
    }

    self.addAssoCompany = function () {

        var modalContainer = {
            modalType: 'Add Company',
            //compList: self.compList,
            //compFunctions: self.compFunctions
            //companyGUID: data.companyGUID,
        }
        var modalInstance = $modal.open({
            templateUrl: "AddCompanyAssociationPopup.html",
            scope: $scope,
            controller: addCompController,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                },
                compList: function (CompanyServiceAPI) {
                    return CompanyServiceAPI.getCompany();
                },
                compFunctions: function (ListingsAPI) {
                    return ListingsAPI.getListings('companytypes').then(function (data) {
                        return data.companyTypes;
                    })
                }
            }
        })
    }

    var addCompController = function ($scope, $modalInstance, data, compList, compFunctions) {
        $scope.modalData = data;
        $scope.modalData.compList = compList.companies;
        $scope.modalData.compFunctions = compFunctions;
        $scope.addCompAssociation = function (form) {
            if (form.$valid) {
                var effectiveDate = getCurrentDate();
                var exp_Date = new Date(effectiveDate);
                var expirationDate = (exp_Date.getMonth() + 1) + '/' + exp_Date.getDate() + '/' + (exp_Date.getFullYear()+1);
                var selectedComp = this.modalData.selectedComp;
                var selectedFun = this.modalData.selectedFunctionType;
                var detail = 'none';
                var companyAssociation = {
                    "companyGUID": $state.params.companyguid,
                    "associatedCompanyGUID": selectedComp.companyGUID,
                    "associationType": selectedFun.companyType,
                    "effectiveTS": new Date(effectiveDate+ " UTC").toISOString(),
                    "expirationTS": new Date(expirationDate+ " UTC").toISOString(),
                    "isEnabled": true
                }
                var data = {
                    "companyAssociation": companyAssociation
                };

                var promise = CompanyServiceAPI.addCompanyAssociation($state.params.companyguid, detail, data);
                promise.then(function (data) {
                    self.showUmbrellaMessage = true;
                    if (data.companyAssociation && data.companyAssociation.companyAssociationGUID) {
                        self.alertClass = 'alert-success';
                        self.umbrellaMessage = 'The company: ' + $scope.modalData.selectedComp.name + ' added successfully';
                        var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations($state.params.companyguid, 'none');
                        promiseGetCompAssociations.then(function (resp) {
                            if (resp.companyAssociations) {
                                self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                                getDataTableJSON();
                                $timeout(function () {
                                    $scope.dataTable.destroy();
                                    fillCompanyAssociationData(false);
                                });
                                $modalInstance.close();
                            }
                        })
                    } else if (data.message) {
                        self.alertClass = 'alert-error';
                        self.umbrellaMessage = 'Failed to add  ' + $scope.modalData.selectedComp.name + ' company due to :' + data.message.userMessage;
                    } else {
                        self.alertClass = 'alert-error';
                        self.umbrellaMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                    }
                })
            } else {
                var inputElements = document.getElementsByName(form.$name);
                angular.element(inputElements).find(':input').trigger('blur');
            }
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    var addContactController = function ($scope, $modalInstance, data, compAssoUsers) {
        $scope.modalData = data;
        $scope.modalData.compAssoUsers = compAssoUsers;
        $scope.addCompProjectManager = function (form) {
            if (form.$valid) {
                var effectiveDate = getCurrentDate();
                var exp_Date = new Date(effectiveDate);
                var expirationDate = (exp_Date.getMonth() + 1) + '/' + exp_Date.getDate() + '/' + (exp_Date.getFullYear()+1);
                var selectedCompMangr = $scope.modalData.selectedMangrFromList;
                var detail = 'none';
                var companyAssociationGUID = $scope.modalData.companyAssociationGUID;
                var companyAssociationUserData = {
                    "companyAssociationUser": {
                        "companyAssociationGUID": companyAssociationGUID,
                        "userGUID": selectedCompMangr.userGUID,
                        "effectiveTS": new Date(effectiveDate+ " UTC").toISOString(),
                        "expirationTS": new Date(expirationDate+ " UTC").toISOString(),
                        "isEnabled": true
                    }
                }
                var companyGUID = $state.params.companyguid;
                var promise = CompanyServiceAPI.createCompAssociationUser(companyGUID, companyAssociationGUID, companyAssociationUserData);
                promise.then(function (data) {
                    self.showUmbrellaMessage = true;
                    if (data.companyAssociationUser && data.companyAssociationUser.companyAssociationUserGUID) {
                        self.alertClass = 'alert-success';
                        self.umbrellaMessage = 'The contact: ' + $scope.modalData.selectedMangrFromList.userName + ' added successfully';
                        var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations($state.params.companyguid, detail);
                        promiseGetCompAssociations.then(function (resp) {
                            if (resp.companyAssociations) {
                                self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                                getDataTableJSON();
                                $timeout(function () {
                                    $scope.dataTable.destroy();
                                    fillCompanyAssociationData(false);
                                });
                            }
                        })
                    } else if (data.message) {
                        self.alertClass = 'alert-error';
                        self.umbrellaMessage = 'Failed to add  ' + $scope.modalData.selectedMangrFromList.userName + ' company to lender group due to :' + data.message.userMessage;
                    } else {
                        self.alertClass = 'alert-error';
                        self.umbrellaMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                    }
                    $modalInstance.close();
                })
            } else {
                var inputElements = document.getElementsByName(form.$name);
                angular.element(inputElements).find(':input').trigger('blur');
            }
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    var deleteCompContactAssoCtrl = function ($scope, $modalInstance, data) {
        $scope.deleteTitle = 'Delete ' + data.enityType;
        $scope.toDelete = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            companyAssociationGUID: data.companyAssociationGUID,
            companyAssociationUserGUID: data.companyAssociationUserGUID, //additional for contact delete
            enityName: data.enityName,
            showMsg: true
        };
        $scope.afterDelete = {
            showMsg: false,
            msgAfterDelete: "Deleted",
        };
        $scope.deleteEntity = function () {
            var promise;
            if ($scope.toDelete.enityType.toLowerCase() == "company") {
                //Delete Company
                promise = CompanyServiceAPI.deleteCompAssociation($state.params.companyguid, $scope.toDelete.companyAssociationGUID);
            } else // Delete Contact
                promise = CompanyServiceAPI.deleteCompAssoUser($state.params.companyguid, $scope.toDelete.companyAssociationGUID, $scope.toDelete.companyAssociationUserGUID);
            promise.then(function (resp) {
                self.showUmbrellaMessage = true;
                if (resp.length == 0) {
                    self.alertClass = 'alert-success';
                    self.umbrellaMessage = 'The ' + $scope.toDelete.enityType + ': ' + $scope.toDelete.enityName + ' is deleted successfully.';
                    var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations($state.params.companyguid);
                    promiseGetCompAssociations.then(function (data) {
                        if (data.companyAssociations) {
                            self.companyAssociations = data.companyAssociations; //self.existingCompanyData.setupFees
                            getDataTableJSON();
                            $timeout(function () {
                                $scope.dataTable.destroy();
                                fillCompanyAssociationData(false);
                            });
                        }
                    })
                } else if (resp.message) {
                    self.alertClass = 'alert-error';
                    self.umbrellaMessage = "Failed to delete " + $scope.toDelete.enityType + ": " + $scope.toDelete.enityName;
                } else {
                    self.alertClass = 'alert-error';
                    self.umbrellaMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                }
                $modalInstance.close();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    function getCurrentDate() {
        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-" + ("0" + (currentdate.getMonth() + 1 )).slice(-2) + "-" + currentdate.getDate();
        return datetime;
    }

}]);