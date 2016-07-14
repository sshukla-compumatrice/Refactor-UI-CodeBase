angular.module('ProjectDashboard').controller('GrantAccess', ['projectsList', '$scope', 'projectDashboardOperations', 'checkStatus', '$state', 'accountMgmtAPI', '$stateParams', 'AuthFactory', 'accessMgmtAPI', '$timeout', '$q', '$window', '$filter', 'notification', '$rootScope', function (projectsList, $scope, projectDashboardOperations, checkStatus, $state, accountMgmtAPI, $stateParams, AuthFactory, accessMgmtAPI, $timeout, $q, $window, $filter, notification, $rootScope) {



    var self = this;

    init();

    function init() {
        //getProjects();
        getParentCompanies();
        getRoles();
        getReports($stateParams.projectGuid);
        initialShowHideOfficeTab(); //show/hide span for office tab
        initialShowHideTeamTab(); //show.hide span for team tab
        self.offices = []; // office array
        self.childCompanies = []; // array for campanies which comes after selecting company
        self.companies = []; // parent company array
        self.users = []; // array for users which are selected after operations on tab
        self.searchedUsers = []; // array for users which comes after operation on second tab
        self.accessToUsersOnOfficeLevel = []; // array for users which comes after operation on first tab
        self.teamChildCompanies = [];
        self.selectedTeamCompany = [];
        self.selectedSavedTeam = [];
        self.selectedPreconfiguredTeam = [];
        self.searchedUserInOfficeCheckbox = {};
        self.searchedUserCheckbox = {};
        self.reportsCheckbox = {};
        self.searchUserResults = true;
        self.reports = [];
        self.savedTeams = [];
        self.preconfiguredTeams = [];
        self.currentTab = 1;
        self.prevState = $stateParams.prevState;
        self.usersToDelete = [];
        $scope.roleObject = {};
        self.userGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
        self.companyGuid = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');

        self.tooltiptext = "Click to view who has access to this report";


    }

    $scope.roleObject.updateDefaultRole = function (role, user, report) {

        //console.log("reportguid " + JSON.stringify(report));

        var expirationTS = new Date();
        expirationTS.setFullYear(expirationTS.getFullYear() + 2);
        var obj = {};
        obj.roleAccessEntityAssets = [];
        var entityObject = {
            "assetGUID": report.reportGuid,
            "accessEntityType": "User",
            "accessEntityGUID": user.userGUID,
            "effectiveTS": formatDate(new Date()),
            "expirationTS": formatDate(expirationTS)
        }

        if (role) {

            entityObject.roleGUID = role.value;
            entityObject.grantDefaultAccess = false;
            obj.roleAccessEntityAssets.push(entityObject);

        } else {

            entityObject.roleGUID = null;
            entityObject.grantDefaultAccess = true;
            obj.roleAccessEntityAssets.push(entityObject);



        }
        createRole(obj, user, role, '');

    }


    function createRole(obj, user, role, responseObject) {
        accessMgmtAPI.postRoleAccessEntityAsset(obj).then(function (response) {
            if (role) {
                user.defaultRole = role.value;
                user.defaultRoleName = role.text;
            } else {

                getRoleName(response.roleAccessEntityAssets[0].roleGUID, user)

            }

            notify('Success', 'Role updated', 'info', "stack-bottomright", "fontawesome");
        }, function (error) {
            notify('Error', 'Role update failed', 'info', "stack-bottomright", "fontawesome");

        })

        $('#defaultRolePopOver').hide();
    }





    function getRoles() {

        $scope.rolesForExditable = {
            rolesArray: []
        }
        var userGuid = AuthFactory.getUserDetailsFromStorage('EFF_USERGUID');
        accessMgmtAPI.getRoles(userGuid, 'User').then(function (response) {

            self.roles = response.roles;
            angular.forEach(response.roles, function (role, index) {
                var obj = {
                    value: role.roleGUID,
                    text: role.roleName
                };
                $scope.rolesForExditable.rolesArray.push(obj);
            })


        }, function (error) {

        })
    }

    self.setDefaultValue = function () {
        if (self.companies.length === 1) {
            self.selectedOrganization = self.companies[0];
        }
    }

    self.gotoProjectDashboard = function () {

        this.projectDashboardUrl = $state.href('projectDashboard', {
            projectGuid: $stateParams.projectGuid,
            prevState: 'GrantAccess'
        });

    }

    self.gotoReportAuthoring = function () {
        $window.close();
    }

    //step1 --- select project (using select2.js)

    function initializeSelect2CrossButton() {
        $('abbr').on('click', function () {
            $('.select2-search-choice-close').css("display", "none");
        });
    }

    $scope.generateMarkUp = function (result) {
        var markup = "<div>";
        markup += "<div>" + result.name + "</div>";
        markup += "</div>";
        return markup;
    }

    $scope.displayProject = function (result) {
        self.reports.length = 0;
        if (JSON.stringify(result) != "{}") {
            initializeSelect2CrossButton();
            $('.select2-chosen').text(result.name);
            $('.select2-search-choice-close').css("display", "block");
            self.showAlertForReports = false;
            $state.go('grantAccess', {
                projectGuid: result.projectGUID,
                prevState: 'GrantAccess'
            }, {
                notify: false
            });
            self.selectedProject = true;
            getReports(result.projectGUID);
        } else {
            projectDashboardOperations.getProjectData($stateParams.projectGuid).then(function (response) {
                $('.select2-chosen').text(response.projects[0].name);
            }, function (error) {})
            $('.select2-search-choice-close').css("display", "none");
        }
    }

    $scope.projectListProvider = {
        readData: function (term, page, pageSize) {
            if (term != undefined) {
                if (self.readDataCount == 0) {
                    projectDashboardOperations.setTerm(term);
                    self.readDataCount = self.readDataCount + 1;
                    self.readDataPage = page - 1;
                } else {
                    if ($('.select2-input').val() == projectDashboardOperations.getTerm()) {
                        self.readDataPage = self.readDataPage + pageSize;
                    } else {
                        projectDashboardOperations.setTerm(term);
                        self.readDataPage = page - 1;
                    }
                }
            }
            var deferred = $q.defer();
            if (term == "") {
                projectDashboardOperations.getProjectListData({
                        limit: pageSize,
                        offset: (page * pageSize) - pageSize
                    })
                    .then(function (result) {
                        deferred.resolve(result.projects);
                    }, function (reason) {
                        deferred.reject(reason);
                    });
            } else if (term != "") {
                projectDashboardOperations.getProjectSearchData({
                        limit: pageSize,
                        offset: (page * pageSize) - pageSize,
                        projectName: term
                    })
                    .then(function (result) {
                        deferred.resolve(result.projects);
                    }, function (reason) {

                        deferred.reject(reason);
                    });

            }
            return deferred.promise;
        }
    };


    function getReports(projectGuid) {

        //if(!projectGuid) projectGuid = $stateParams.projectGuid;
        projectDashboardOperations.getProjectReports(projectGuid).then(function (response) {

            if (response.status != undefined && checkStatus.checkCodeInStatusArray(response.status, 'GET') || response.reports.length === 0) {
                self.showAlertForReports = true;
                self.serviceMessageForReport = response.data.message.userMessage;
            } else {
                self.selectedProject = true;
                self.reports = response.reports;

                angular.forEach(self.reports, function (report) {
                    getUserGuids(report.reportGuid, report);
                    report.callMadeToBringUsers = false;
                })
            }
        })
    }

    //common step1 functions
    function disableSelectedUsers(type) {
        if (type === 'user') {
            angular.forEach(self.searchedUsers, function (user, index) {
                var userFound = _.find(self.users, function (element) {
                    if (element.userGUID === user.userGUID) {

                        angular.element('#usersByName' + index).addClass('text-muted');
                        angular.element('#usersByName' + index).children().find('input').attr('disabled', true);
                        self.searchedUserCheckbox[index] = false;
                    }
                })
            })
        } else if (type === 'office') {
            angular.forEach(self.accessToUsersOnOfficeLevel, function (user, index) {
                var userFound = _.find(self.users, function (element) {
                    if (element.userGUID === user.userGUID) {
                        angular.element('#officeUsers' + index).addClass('text-muted');
                        angular.element('#officeUsers' + index).children().find('input').attr('disabled', true);
                        self.searchedUserInOfficeCheckbox[index] = false;
                    }
                })
            })
        }
    }

    self.checkDefault = function (type) {
        if (type === 'user') {
            angular.forEach(self.searchedUsers, function (user, index) {
                self.searchedUserCheckbox[index] = true;
            })
        }
        if (type === 'office') {
            angular.forEach(self.accessToUsersOnOfficeLevel, function (user, index) {
                self.searchedUserInOfficeCheckbox[index] = true;
            })
        }
        if (type === 'selectedUser') {
            angular.forEach(self.users, function (user, index) {
                user.selectUser = true;
                //self.selectUsers[index] = true;
            })
        }
    }

    self.removeAllUsers = function () {
        switch (self.currentTab) {
            case 1:
                angular.forEach(self.accessToUsersOnOfficeLevel, function (user, index) {
                    _.find(self.users, function (element) {
                        if (element.userGUID === user.userGUID) {

                            angular.element('#officeUsers' + index).removeClass('text-muted');
                            angular.element('#officeUsers' + index).children().find('input').attr('disabled', false);
                            self.searchedUserInOfficeCheckbox[index] = false;
                        }
                    })
                })

                break;
            case 2:
                angular.forEach(self.searchedUsers, function (user, index) {
                    var userFound = _.find(self.users, function (element) {
                        if (element.userGUID === user.userGUID) {
                            angular.element('#usersByName' + index).removeClass('text-muted');
                            angular.element('#usersByName' + index).children().find('input').attr('disabled', false);
                            self.searchedUserCheckbox[index] = false;
                        }
                    })
                })
                break;
            case 3:
                break;
        }
        self.users.length = 0;
    }

    self.tabClicked = function (type) {
        if (type === 'office') {
            self.currentTab = 1;
            clearTabData(2);
            clearTabData(3);
        } else if (type === 'user') {
            self.currentTab = 2;
            clearTabData(1);
            clearTabData(3);
        } else if (type === 'team') {
            self.teamOfficeGuid = null;
            self.currentTab = 3;
            clearTabData(1);
            clearTabData(2);
        }
    }

    function clearTabData(tabIndex) {
        switch (tabIndex) {
            case 1:
                self.accessToUsersOnOfficeLevel.length = 0;
                initialShowHideOfficeTab();
                self.showAlertForCompany = false;
                self.childCompanies.length = 0;
                self.childCompany = undefined;
                self.office = undefined;
                self.hasCompany = false;
                self.hasOffice = false;
                self.selectedOrganization = undefined;
                self.usersNotUnderOffice = false;
                break;
            case 2:
                self.searchedUsers.length = 0;
                self.searchTerm = "";
                self.searchUserResults = true;
                break;
            case 3:
                initialShowHideTeamTab();
                self.teamUsersNotFound = false;
                self.selectedTeamOrganization = undefined;
                self.selectedTeamChildCompany = undefined;
                self.selectedSavedTeam = undefined;
                self.selectedPreconfiguredTeam = undefined;
                self.teamChildCompanies.length = 0;
                self.savedTeams.length = 0;
                self.preconfiguredTeams.length = 0;
                self.hasPreconfiguredTeam = false;
                self.hasSavedTeam = false;
                self.hasTeamChildCompany = false;
                break;
        }
    }

    self.selectAllSearchedUsers = function (type) {
        if (type === 'user') {
            angular.forEach(self.searchedUsers, function (user, index) {
                if (!angular.element('#usersByName' + index).hasClass('text-muted'))
                    self.searchedUserCheckbox[index] = true;
            })
        }
        if (type === 'office') {
            angular.forEach(self.accessToUsersOnOfficeLevel, function (user, index) {
                if (!angular.element('#officeUsers' + index).hasClass('text-muted'))
                    self.searchedUserInOfficeCheckbox[index] = true;
            })
        }
    }

    self.unSelectAllSearchedUsers = function (type) {
        if (type === 'user') {
            angular.forEach(self.searchedUsers, function (user, index) {
                self.searchedUserCheckbox[index] = false;
            })
        }
        if (type === 'office') {
            angular.forEach(self.accessToUsersOnOfficeLevel, function (user, index) {
                self.searchedUserInOfficeCheckbox[index] = false;
            })
        }
    }




    //step 2 --- select users from office ... first tab
    function getParentCompanies() {
        self.showAlertForCompany = false;
        accountMgmtAPI.getCompany('', '', '', '', '').then(function (response) {
            self.companies = response.companies;

            if (self.companies.length == 1) {
                self.selectedOrganization = self.companies[0].companyGUID;
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    self.setCascadedCompany = function (companyGuid) {
        self.teamCompanyGuid = companyGuid;
        self.usersNotUnderOffice = false;
        initialShowHideOfficeTab();
        self.showAlertForCompany = false;
        self.childCompanies.length = 0;
        self.childCompany = undefined;
        self.office = undefined;
        self.hasCompany = false;
        self.hasOffice = false;
        self.accessToUsersOnOfficeLevel.length = 0;
        if (!companyGuid) return;
        accountMgmtAPI.getCompany(companyGuid, '', 'companies,offices', '', '').then(function (response) {
            self.childCompanies = response.companies[0].companies;
            if (self.childCompanies && self.childCompanies && self.childCompanies.length > 0) {
                self.offices.length = 0;
                self.hasOffice = false;
                self.hasCompany = true;
                //angular.element('#divCompany2').show();
                //angular.element('#selectCompany2').show();
            } else {
                checkForOffices(response.companies[0].offices);
                //angular.element('#divCompany2').hide();
                //angular.element('#selectCompany2').hide();
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })

    }

    self.setCascadedOffice = function () {
        self.usersNotUnderOffice = false;
        self.showAlertForCompany = false;
        self.offices.length = 0;
        self.accessToUsersOnOfficeLevel.length = 0;
        self.teamCompanyGuid = self.childCompany;
        accountMgmtAPI.getOffice(self.childCompany, '', '', '').then(function (response) {
            if (response && response.offices && response.offices.length > 0) {
                angular.element('#spanOffice').hide();
                angular.element('#selectOffice').show();
                self.hasOffice = true;
                self.offices = response.offices;
            } else {
                self.hasOffice = false;
                angular.element('#spanOffice').show();
                angular.element('#selectOffice').hide();
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    function checkForOffices(offices) {
        if (offices && offices.length > 0) {
            self.offices.length = 0;
            self.hasOffice = true;
            self.offices = offices;
            angular.element('#selectOffice').show();
            angular.element('#spanOffice').hide();
        } else {
            angular.element('#spanOffice').show();
            angular.element('#selectOffice').hide();
        }
    }

    function initialShowHideOfficeTab() {
        //angular.element('#spanCompany2').hide();
        //angular.element('#divCompany2').show();
        angular.element('#spanOffice').hide();
        angular.element('#selectOffice').show();
        //angular.element('#selectCompany2').show();
    }

    self.getUsersInOffice = function () {
        self.usersNotUnderOffice = false;
        self.showAlertForCompany = false;
        if (!self.office) return;
        self.accessToUsersOnOfficeLevel.length = 0;
        self.teamOfficeGuid = self.office;
        accountMgmtAPI.getUser('', '', '', self.office, '', '', '', '', 'defaultuserrole').then(function (response) {
            if (response && response.users && response.users.length > 0) {
                self.accessToUsersOnOfficeLevel = response.users;
                $timeout(function () {
                    disableSelectedUsers("office");
                }, 500);
            } else {
                self.usersNotUnderOffice = true;
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    //step 2 --- select users from searching.... second tab
    self.searchUser = function () {
        self.showAlertForCompany = false;
        self.searchedUsers.length = 0;
        if (!self.searchTerm) return;
        accountMgmtAPI.getUser('', '', '', '', '', '', '', self.searchTerm, 'defaultuserrole').then(function (response) {
            if (response && response.users && response.users.length > 0) {

                self.searchUserResults = true;
                self.searchedUsers = response.users;
                $timeout(function () {
                    disableSelectedUsers("user");
                }, 500);
            } else {
                self.searchUserResults = false;
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    //step2 --- select users from teams --- third tab
    self.setCascadedTeamCompany = function (companyGuid) {
        self.teamCompanyGuid = companyGuid;
        self.teamUsersNotFound = false;
        initialShowHideTeamTab();
        self.showAlertForCompany = false;
        self.teamChildCompanies.length = 0;
        self.selectedTeamChildCompany = undefined;
        self.selectedSavedTeam = undefined;
        self.selectedPreconfiguredTeam = undefined;
        self.hasTeamChildCompany = false;
        self.hasSavedTeam = false;
        self.hasPreconfiguredTeam = false;
        if (!companyGuid) return;
        accountMgmtAPI.getCompany(companyGuid, '', 'companies,teams', '', '').then(function (response) {
            self.teamChildCompanies = response.companies[0].companies;
            if (self.teamChildCompanies && self.teamChildCompanies && self.teamChildCompanies.length > 0) {

                self.savedTeams.length = 0;
                self.preconfiguredTeams.length = 0;
                self.hasTeamChildCompany = true;
                // angular.element('#spanTeamChildCompany').hide();
                angular.element('#selectTeamChildCompany').show();
            } else {
                checkForSavedTeams(response.companies[0].teams, companyGuid);
                self.getPreConfiguredTeams(companyGuid);
                //angular.element('#spanTeamChildCompany').show();
                angular.element('#selectTeamChildCompany').hide();
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    function checkForSavedTeams(teams, companyGuid) {
        if (teams && teams.length > 0) {
            self.savedTeams.length = 0;
            self.hasSavedTeam = true;
            self.savedTeams = teams;
            self.getPreConfiguredTeams(companyGuid);
            angular.element('#selectSavedTeam').show();
            angular.element('#spanSavedTeam').hide();
        } else {
            angular.element('#spanSavedTeam').show();
            angular.element('#selectSavedTeam').hide();
        }
    }

    self.getTeamUsers = function (teamGUID) {
        self.usersToDelete.length = 0;
        self.teamUsersNotFound = false;
        self.selectedSavedTeam = undefined;
        accountMgmtAPI.getTeamUsers(teamGUID, '', '', '', 'users').then(function (response) {
            if (response && response.teams && response.teams.length > 0) {
                self.teamCreated = true;
                self.teamGuid = teamGUID;
                //console.log("new teamguid " + teamGUID);
                self.teamName = response.teams[0].name;
                if (self.users.length == 0) {
                    angular.forEach(response.teams[0].users, function (user) {
                        user.defaultRoleName = user.edrDefaultUserRole;
                        user.defaultRole = user.edrDefaultUserRoleGUID;
                        //getRoleName(user.edrDefaultUserRole, user);
                        self.users.push(user);
                    });
                } else {
                    angular.forEach(response.teams[0].users, function (user, index) {
                        var userFoundInList = _.filter(self.users, function (element) {
                            return element.userGUID == user.userGUID
                        })[0];
                        if (!userFoundInList) {
                            user.defaultRoleName = user.edrDefaultUserRole;
                            user.defaultRole = user.edrDefaultUserRoleGUID;
                            //var roleObject = getRoleName(user.edrDefaultUserRole, user);
                            /*response.teams[0].users[index].defaultRoleName = roleObject ? roleObject.roleName : '';*/
                            self.users.push(response.teams[0].users[index]);
                        }
                    })
                }
            } else {
                self.teamUsersNotFound = true;
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    self.getPreconfiguredTeamUsers = function (preConfiguredTeamDeatail) {
        if (!preConfiguredTeamDeatail) return;
        self.teamUsersNotFound = false;
        var resourceURL = preConfiguredTeamDeatail.resourceURL;
        accountMgmtAPI.getPreconfiguredTeamUsers(resourceURL).then(function (response) {
            if (response && response.users && response.users.length > 0) {
                if (self.users.length == 0) {
                    angular.forEach(response.users, function (user) {
                        user.defaultRoleName = user.edrDefaultUserRole;
                        user.defaultRole = user.edrDefaultUserRoleGUID;
                        //getRoleName(user.edrDefaultUserRole, user);
                        self.users.push(user);
                    });
                } else {
                    angular.forEach(response.users, function (user, index) {
                        var userFoundInList = _.filter(self.users, function (element) {
                            return element.userGUID == user.userGUID
                        })[0];
                        if (!userFoundInList) {
                            user.defaultRoleName = user.edrDefaultUserRole;
                            user.defaultRole = user.edrDefaultUserRoleGUID;
                            // var roleObject = getRoleName(user.edrDefaultUserRole, user);
                            /*response.users[index].defaultRoleName =
                                roleObject ? roleObject.roleName : '';*/
                            self.users.push(response.users[index]);
                        }
                    })
                }
            } else {
                self.teamUsersNotFound = true;
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    self.getSavedTeams = function (companyGUID) {
        self.savedTeams.length = 0;
        accountMgmtAPI.getTeams(companyGUID).then(function (response) {
            if (response.teams.length >= 1) {
                angular.element('#spanSavedTeam').hide();
                angular.element('#selectSavedTeam').show();
                self.hasSavedTeam = true;
                self.savedTeams = response.teams;
            } else {
                angular.element('#spanSavedTeam').show();
                angular.element('#selectSavedTeam').hide();
            }
        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;

        })

    }

    self.getPreConfiguredTeams = function (companyGUID) {
        self.preconfiguredTeams.length = 0;
        accountMgmtAPI.getPreconfiguredTeams(companyGUID).then(function (response) {
            if (response.userQueries.length >= 1) {
                angular.element('#spanPreConfiguredTeam').hide();
                angular.element('#selectPreConfiguredTeam').show();
                self.hasPreconfiguredTeam = true;
                self.preconfiguredTeams = response.userQueries;
            } else {
                angular.element('#spanPreConfiguredTeam').show();
                angular.element('#selectPreConfiguredTeam').hide();
            }

        }, function (error) {
            self.showAlertForCompany = true;
            self.serviceMessage = error;
        })
    }

    self.getCascadeTeams = function (companyGUID) {
        self.teamCompanyGuid = companyGUID;
        self.teamUsersNotFound = false;
        self.getSavedTeams(companyGUID);
        self.getPreConfiguredTeams(companyGUID);
    }

    self.addSelectedUsers = function (type) {
        var roleGuidArray = [];
        if (type === 'user') {
            for (var key in self.searchedUserCheckbox) {
                if (self.searchedUserCheckbox[key] === true) {
                    self.searchedUsers[key].defaultRoleName = self.searchedUsers[key].edrDefaultUserRole;
                    self.searchedUsers[key].defaultRole = self.searchedUsers[key].edrDefaultUserRoleGUID;

                    self.users.push(self.searchedUsers[key]);
                    self.searchedUserCheckbox[key] = false;
                    angular.element('#usersByName' + key).addClass('text-muted');
                    angular.element('#usersByName' + key).children().find('input').attr('disabled', true);
                }
            }
        }
        if (type === 'office') {
            for (var key in self.searchedUserInOfficeCheckbox) {
                if (self.searchedUserInOfficeCheckbox[key] === true) {
                    self.accessToUsersOnOfficeLevel[key].defaultRoleName = self.accessToUsersOnOfficeLevel[key].edrDefaultUserRole;
                    self.accessToUsersOnOfficeLevel[key].defaultRole = self.accessToUsersOnOfficeLevel[key].edrDefaultUserRoleGUID;

                    self.users.push(self.accessToUsersOnOfficeLevel[key]);
                    self.searchedUserInOfficeCheckbox[key] = false;
                    angular.element('#officeUsers' + key).addClass('text-muted');
                    angular.element('#officeUsers' + key).children().find('input').attr('disabled', true);
                }
            }
        }
    }



    //step3 --- select users selected from step 1
    self.selectAllUsers = function () {
        angular.forEach(self.users, function (user, index) {
            user.selectUser = true;
        })
    }

    self.unSelectAllUsers = function () {
        angular.forEach(self.users, function (user, index) {
            user.selectUser = false;
        })
    }

    self.createNewTeam = function () {
        var companyGUID;
        var officeGUID;
        var userToGrantAccess = [];
        for (var i = 0; i < self.users.length; i++) {
            if (self.users[i].selectUser) {
                userToGrantAccess.push(self.users[i]);
            }
        }
        var resolveObj = {
            resolveObj: function () {
                var obj = {
                    users: userToGrantAccess,
                    companyGUID: self.teamCompanyGuid,
                    officeGUID: self.teamOfficeGuid,
                    tab : self.currentTab
                }
                return obj;
            }
        }
        projectDashboardOperations.openPopUp($scope, 0, resolveObj, "createTeam", true, false);
    }

    self.updateTeam = function () {

        self.usersToAdd = [];

        self.copiedUsersToDelete = angular.copy(self.usersToDelete);

        accountMgmtAPI.getTeamUsers(self.teamGuid, '', '', '', 'users').then(function (result) {

            for (var i = 0; i < self.users.length; i++) {
                if (result && result.teams[0].users.length > 0) {

                    var matchFound = _.some(result.teams[0].users, function (c) {
                        return c.userGUID == self.users[i].userGUID;
                    });
                    if (!matchFound) {
                        self.usersToAdd.push({
                            "userGUID": self.users[i].userGUID
                        });

                    }

                } else {
                    self.usersToAdd.push({
                        "userGUID": self.users[i].userGUID
                    });

                }
            }


            var obj = {};
            obj.teamUserAssignments = {};
            obj.teamUserAssignments.teamGUID = self.teamGuid;
            obj.teamUserAssignments.assignedUsers = self.usersToAdd;

            obj.teamUserAssignments.unassignedUsers = self.copiedUsersToDelete;
            self.usersToDelete.length = 0;

            if (self.usersToAdd.length > 0 || self.copiedUsersToDelete.length > 0) {
                accountMgmtAPI.assignUsersToTeam(self.teamGuid, obj, 'PUT').then(function (response) {


                    notify('Success', 'Team updated successfully', 'success', "stack-bottomright", "fontawesome");




                }, function (error) {

                })
            } else {
                notify('Notice', 'No modifications made', 'info', "stack-bottomright", "fontawesome");

            }



        }, function (error) {

        })

    }

    function notify(title, text, type, addclass, styling) {

        new PNotify({
            title: title,
            text: text,
            type: type,
            addclass: addclass,
            stack: $rootScope.stack_bottomright
        });
    }

    $scope.$on('event:data-updated', function (ev, args) {
        self.usersToDelete.length = 0;
        self.teamCreated = true;
        self.teamName = args.obj.teamName;
        self.teamGuid = args.obj.teamGuid;
        var companyGuid = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');
        if (self.selectedTeamOrganization && self.selectedTeamOrganization === companyGuid) {
            self.getSavedTeams(companyGuid);
        } else if (self.hasTeamChildCompany && self.hasTeamChildCompany === companyGuid) {
            self.getSavedTeams(companyGuid);
        }
    })

    self.removeUser = function (userIndex) {

        self.usersToDelete.push({
            "userGUID": self.users[userIndex].userGUID

        });
        switch (self.currentTab) {
            case 1:
                angular.forEach(self.accessToUsersOnOfficeLevel, function (user, index) {
                    if (self.users[userIndex].userGUID === user.userGUID) {
                        angular.element('#officeUsers' + index).removeClass('text-muted');
                        angular.element('#officeUsers' + index).children().find('input').attr('disabled', false);
                        self.searchedUserInOfficeCheckbox[index] = false;
                    }
                })
                break;
            case 2:
                angular.forEach(self.searchedUsers, function (user, index) {
                    if (self.users[userIndex].userGUID === user.userGUID) {
                        angular.element('#usersByName' + index).removeClass('text-muted');
                        angular.element('#usersByName' + index).children().find('input').attr('disabled', false);
                        self.searchedUserCheckbox[index] = false;
                    }
                })
                break;
        }
        self.users.splice(userIndex, 1);
    }

    self.changeToUsersRole = function (user) {

    }


    //step4 --- Get users having access to a report
    self.getUsersByReport = function (index) {
        var id = '#expandReports' + index;
        $('[data-toggle="tooltip"]').tooltip('hide');

        if (angular.element(id).hasClass('fa-plus')) {
            angular.element(id).removeClass('fa-plus');
            angular.element(id).addClass('fa-minus');

            self.tooltiptext = "Click to hide the access list";
        } else {
            angular.element(id).addClass('fa-plus');
            angular.element(id).removeClass('fa-minus');

            self.tooltiptext = "Click to view who has access to this report";
        }
        var usersGuidForReport = '';

        /*self.showAlertForReports = false;
        if (angular.element(id).hasClass('fa-minus')) {
            getUserGuids(reportGuid, report);
        }*/
    }

    self.selectAllReports = function () {
        angular.forEach(self.reports, function (report, index) {
            self.reportsCheckbox[index] = true;
        })
    }

    self.unSelectAllReports = function () {
        angular.forEach(self.reports, function (report, index) {
            self.reportsCheckbox[index] = false;
        })
    }

    function getUserGuids(reportGuid, report) {
        var usersGuidForReport = '';
        var roleAccessEntityAssetGuidsArray = [];
        accessMgmtAPI.getAccessEntityInfo(reportGuid, 'User').then(function (response) {
            for (var index = 0; index < response.roleAccessEntityAssets.length; index++) {
                roleAccessEntityAssetGuidsArray.push({
                    "roleAccessEntityAssetGUID": response.roleAccessEntityAssets[index].roleAccessEntityAssetGUID,
                    "userGUID": response.roleAccessEntityAssets[index].accessEntityGUID
                })
                usersGuidForReport = usersGuidForReport + response.roleAccessEntityAssets[index].accessEntityGUID + ','
            }

            getUserFromGuids(usersGuidForReport.slice(0, -1), roleAccessEntityAssetGuidsArray, report);
        }, function (error) {
            self.showAlertForReports = true;
            self.serviceMessageForReport = error;
        })

    }

    function getUserFromGuids(userGuids, roleAccessEntityAssetGuidsArray, report) {


        accountMgmtAPI.getUser('', userGuids, '', '', '', '', '', '', 'defaultuserrole').then(function (userResp) {
            if (userResp && userResp.users && userResp.users.length > 0) {
                report.reportUsers = [];
                angular.forEach(userResp.users, function (user, index) {

                    var element = {};
                    element.lastName = user.lastName;
                    element.firstName = user.firstName;
                    element.companyName = user.companyName;
                    element.email = user.email;
                    element.userGUID = user.userGUID;
                    var obj = _.filter(roleAccessEntityAssetGuidsArray, function (elem) {
                        if (elem.userGUID == user.userGUID) {
                            element.roleAccessEntityAssetGUID = elem.roleAccessEntityAssetGUID
                            return element;
                        }

                    });

                    var roleObject = getRoleForReport(element, report);

                    //var roleObject = getRoleName(user.edrDefaultUserRole, element);

                    report.callMadeToBringUsers = true;

                    report.reportUsers.push(element);

                })

            }
        }, function (error) {
            self.showAlertForReports = true;
            self.serviceMessageForReport = error;
        })
    }

    function getRoleForReport(element, report) {
        accessMgmtAPI.getRoleAccessEntityAsset(report.reportGuid, element.userGUID, 'REPORT').
        then(function (response) {
            if (response && response.roleAccessEntityAssets[0] && response.roleAccessEntityAssets[0].roleGUID) {

                getRoleName(response.roleAccessEntityAssets[0].roleGUID, element);
            }
        }, function (error) {

        })
    }

    function getRoleName(roleGUID, element) {
        accessMgmtAPI.getRoleDetails(roleGUID).then(function (response) {
            if (response) {

                element.defaultRoleName = response.roles[0] ? response.roles[0].roleName : '';
                element.defaultRole = response.roles[0] ? response.roles[0].roleGUID : '';

            }
        }, function (error) {

        })
    }



    self.grantAccessBulkUsers = function () {

        var isReportSelected = validateIfReportsSelected();
        if (!isReportSelected) {
            notify('Notice', 'Please select atleast one report', 'info', "stack-bottomright", "fontawesome");
            return;
        } else {
            var isUserSelected = validateIfUsersSelected();
            if (!isUserSelected) {
                notify('Notice', 'Please select atleast one user', 'info', "stack-bottomright", "fontawesome");
                return;
            }
        }

        self.showAlertForReports = false;
        var roleAccessEntityAssets = [];
        var reportsToBeGranted = [];
        var expirationTS = new Date();
        expirationTS.setFullYear(expirationTS.getFullYear() + 2);

        for (var i = 0; i < self.users.length; i++) {
            if (self.users[i].selectUser) {
                //DEFAULT ROLE
                for (var key in self.reportsCheckbox) {
                    if (self.reportsCheckbox[key] && !self.users[i].changedRole) {
                        /*var x = _.some(self.reports[key].reportUsers, function (c, index) {
                            return c.userGUID === self.users[i].userGUID
                        });*/
                        //if (!x) {
                        reportsToBeGranted.push({
                            "report": self.reports[key],
                            "reportGUID": self.reports[key].reportGuid
                        });
                        reportGuid = self.reports[key].reportGuid;
                        roleAccessEntityAssets.push({
                            "roleGUID": null,
                            "expirationTS": formatDate(expirationTS),
                            "effectiveTS": formatDate(new Date()),
                            "accessEntityGUID": self.users[i].userGUID,
                            "grantDefaultAccess": "true",
                            "assetGUID": reportGuid,
                            "accessEntityType": "User"
                        });
                        //}

                    } else if (self.reportsCheckbox[key] && self.users[i].changedRole) {

                        /*var x = _.some(self.reports[key].reportUsers, function (c, index) {
                            return c.userGUID === self.users[i].userGUID
                        });*/
                        //if (!x) {
                        reportsToBeGranted.push({
                            "report": self.reports[key],
                            "reportGUID": self.reports[key].reportGuid
                        });
                        reportGuid = self.reports[key].reportGuid;
                        roleAccessEntityAssets.push({
                            "roleGUID": self.users[i].changedRole,
                            "expirationTS": formatDate(expirationTS),
                            "effectiveTS": formatDate(new Date()),
                            "accessEntityGUID": self.users[i].userGUID,
                            "grantDefaultAccess": "false",
                            "assetGUID": reportGuid,
                            "accessEntityType": "User"
                        });
                        //}
                    }

                }
            }
        }
        var dataobj = {
            "roleAccessEntityAssets": roleAccessEntityAssets
        }
        var groupedReports = _.groupBy(reportsToBeGranted, 'reportGUID');
        //if (dataobj.roleAccessEntityAssets && dataobj.roleAccessEntityAssets.length > 0) {
        accessMgmtAPI.postRoleAccessEntityAsset(dataobj).then(function (response) {
                for (var key in groupedReports) {
                    getUserGuids(key, groupedReports[key][0].report);
                }
                notify('Success', 'Access granted successfully.', 'success', "stack-bottomright", "fontawesome");
            }, function (error) {
                self.showAlertForReports = true;
                self.serviceMessageForReport = error;
            })
            //} else {
            /*notify('Notice', 'All the users selected have access in selected reports', 'info', "stack-bottomright", "fontawesome");*/
            //}
    }

    self.revokeAccessBulkUsers = function () {
        var isReportSelected = validateIfReportsSelected();
        if (!isReportSelected) {
            notify('Notice', 'Please select atleast one report', 'info', "stack-bottomright", "fontawesome");

            return;
        } else {
            var isUserSelected = validateIfUsersSelected();
            if (!isUserSelected) {
                notify('Notice', 'Please select atleast one user', 'info', "stack-bottomright", "fontawesome");

                return;
            }

        }
        var objectForRevokingAccess = {};
        var usersAndReports = [];

        objectForRevokingAccess.roleAccessEntityAssets = [];
        var expirationTS = new Date();
        expirationTS.setFullYear(expirationTS.getFullYear() + 2);
        for (var key in self.reportsCheckbox) {

            if (self.reportsCheckbox[key]) {
                var obj = {
                    "report": self.reports[key],
                    "usersIndex": []
                };
                var reportObject = self.reports[key];
                if (self.users.length == 1 && self.users[0].userGUID === self.userGuid) {
                    notify('Notice', 'You cannot revoke your own access. Skipping...', 'info', "stack-bottomright", "fontawesome");

                } else {

                    var checkedUsersArray = _.filter(self.users, function (item) {
                        return item.selectUser
                    });

                    if (checkedUsersArray.length == 1 && checkedUsersArray[0].userGUID == self.userGuid) {
                        notify('Notice', 'You cannot revoke your own access. Skipping...', 'info', "stack-bottomright", "fontawesome");
                    } else {
                        for (var i = 0; i < self.users.length; i++) {

                            if (self.users[i].selectUser) {
                                var matchFound = _.some(self.reports[key].reportUsers, function (c, index) {
                                    if (c.userGUID == self.users[i].userGUID && self.users[i].userGUID != self.userGuid) {
                                        obj.usersIndex.push(index);
                                        objectForRevokingAccess.roleAccessEntityAssets.push({
                                            "roleAccessEntityAssetGUID": self.reports[key].reportUsers[index].roleAccessEntityAssetGUID,
                                            "effectiveTS": formatDate(new Date()),
                                            "expirationTS": formatDate(expirationTS),
                                            "removeAssignment": "true"
                                        })

                                    }
                                });
                            }
                        }

                        revokeAccessOfBulkUsers(objectForRevokingAccess, obj);
                    }


                }

            }
        }
    }

    function revokeAccessOfBulkUsers(objectForRevokingAccess, obj) {

        self.showAlertForReports = false;
        self.serviceMessageForReport = '';
        accessMgmtAPI.updateBulkRoleAccessEntityAsset(objectForRevokingAccess).then(function (response) {


            for (var i = obj.usersIndex.length - 1; i >= 0; i--) {
                obj.report.reportUsers.splice(obj.usersIndex[i], 1);
            }

            notify('Success', 'Access revoked successfully', 'success', "stack-bottomright", "fontawesome");

        }, function (error) {
            self.showAlertForReports = true;
            self.serviceMessageForReport = error;
        })
    }

    function validateIfReportsSelected() {
        var validated = false;
        for (var key in self.reportsCheckbox) {
            if (self.reportsCheckbox[key]) {
                validated = true;
                return validated;
            }
        }
        return validated;
    }

    function validateIfUsersSelected() {
        var validated = false;
        for (var i = 0; i < self.users.length; i++) {
            if (self.users[i].selectUser) {
                validated = true;
                return validated;
            }
        }
        return validated;
    }

    self.revokeAccessForSingleUser = function (index, roleAccessEntityAssetGUID, report, type, userGUID) {

        self.showAlertForReports = false;

        accessMgmtAPI.deleteRoleAccessEntityAsset(roleAccessEntityAssetGUID).then(function (response) {
            if (type == "single") {
                report.reportUsers.splice(index, 1);
            }
            notify('Success', 'Access revoked successfully.', 'success', "stack-bottomright", "fontawesome");
        }, function (error) {
            self.showAlertForReports = true;
            self.serviceMessageForReport = error;
        })
    }

    //common functions

    self.dismissAlert = function (type) {
        switch (type) {
            case ('company'):
                self.showAlertForCompany = false;
                break;
            case ('report'):
                self.showAlertForReports = false;
                break;
        }
    }

    function initialShowHideTeamTab() {
        //angular.element('#spanTeamChildCompany').hide();
        angular.element('#selectTeamChildCompany').show();

        angular.element('#spanSavedTeam').hide();
        angular.element('#selectSavedTeam').show();

        angular.element('#spanPreConfiguredTeam').hide();
        angular.element('#selectPreConfiguredTeam').show();

    }

    function formatDate(dateVal) {
        var newDate = new Date(dateVal);
        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = padValue(newDate.getMinutes());
        var sSecond = newDate.getSeconds();
        return sYear + "-" + sMonth + "-" + sDay + " " + sHour + ":" + sMinute + ":" + sSecond;
    }

    function padValue(value) {
        return (value < 10) ? "0" + value : value;
    }


}])

angular.module('ProjectDashboard').controller('CreateTeam', ['$scope', '$modalInstance', 'accountMgmtAPI', 'resolveObj', '$stateParams', '$rootScope', function ($scope, $modalInstance, accountMgmtAPI, resolveObj, $stateParams, $rootScope) {
    var self = this;
    self.resolveObj = resolveObj;

    this.confirm = function () {
        self.exception = false;
        var team = {
            "team": {
                "name": self.teamName,
                "description": self.teamName,
                "companyGUID": self.resolveObj.companyGUID


            }
        }
        
        if(self.resolveObj.currentTab == 3) {team.team.officeGUID = self.resolveObj.officeGUID}
        
        accountMgmtAPI.createTeam(team).then(function (response) {
            if (response.team) {

                var teamGUID = response.team.teamGUID;


                if (self.resolveObj.users.length > 0) {
                    self.assignUsersToTeam(teamGUID);
                } else {
                    $modalInstance.close({
                        teamName: self.teamName,
                        teamGuid: response.team.teamGUID
                    });
                    new PNotify({
                        title: 'Success',
                        text: 'Project team created successfully.',
                        type: 'success',
                        addclass: "stack-bottomright",
                        stack: $rootScope.stack_bottomright
                    });
                }

            }
        }, function (error) {

            self.exception = true;
            self.serviceMessage = error;
        })
    }

    self.assignUsersToTeam = function (teamGuid) {
        var assignedUsers = [];
        for (var index = 0; index < self.resolveObj.users.length; index++) {
            assignedUsers.push({
                "userGUID": self.resolveObj.users[index].userGUID
            });
        }
        var users = {
            "teamUserAssignments": {
                "teamGUID": teamGuid,
                "assignedUsers": assignedUsers
            }
        }
        accountMgmtAPI.assignUsersToTeam(teamGuid, users, 'POST').then(function (response) {
            $modalInstance.close({
                teamName: self.teamName,
                teamGuid: teamGuid
            });
            new PNotify({
                title: 'Success',
                text: 'Project team created successfully.',
                type: 'success',
                addclass: "stack-bottomright",
                stack: $rootScope.stack_bottomright
            });

        }, function (error) {
            self.exception = true;
            self.serviceMessage = error;
        })
    }

    this.cancel = function () {
        $modalInstance.close();
    }
    $(document).on("click", ".popover .close", function () {
        $(this).parents(".popover").popover('hide');
    });
}])