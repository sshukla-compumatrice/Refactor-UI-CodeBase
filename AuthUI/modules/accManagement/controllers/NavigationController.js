"use strict";

angular.module('AccountMgmtModule').controller('NavigationController', ['$rootScope', '$scope', '$state', '$stateParams', 'data', '$timeout', 'CompanyServiceAPI', 'OfficeServiceAPI', '$filter', function ($rootScope, $scope, $state, $stateParams, data, $timeout, CompanyServiceAPI, OfficeServiceAPI, $filter) {
    var self = this;
    var arr = [],
        mapRecordGuid = "",
        modelVal = {},
        pushObj = {},
        parentCompanyGuid = "",
        pCompanyGuidDataGrid = "",
        listStates = ["accountMgmt.company.parentcompanieslist", "accountMgmt.company.list", "accountMgmt.office.list", "accountMgmt.user.list"],
        newEntityStates = ["accountMgmt.company.new", "accountMgmt.office.new", "accountMgmt.user.new"],
        backTracedCompanies = [],
        blankContainerObj = false;

    //$scope.showNavs = false;
    $scope.navigations = [];
    $scope.showNav = false;
    $rootScope.backArrowState = false;
    $rootScope.parentEntityName = "";

    function setBackArrowState(guid, navArr) {
        for (var i = 0; i < navArr.length; i++) {
            if (navArr[i].model && navArr[i].model.guid) {
                if (navArr[i + 1] == undefined) {
                    $rootScope.backArrowState = "#/accounts";
                } else {
                    if (navArr[0].title.toLowerCase() == "user" && $state.$current.name != "accountMgmt.user.list" && $state.$current.parent.name == 'accountMgmt.user') {
                        $rootScope.backArrowState = "#/accounts/company/office/user/list?companyguid=" + $stateParams.companyguid + "&officeguid=" + navArr[i + 1].model.guid;
                        break;
                    } else if (navArr[0].title.toLowerCase() == "user" && $state.$current.name == "accountMgmt.user.list" && $state.$current.parent.name == 'accountMgmt.user') {
                        $rootScope.backArrowState = "#/accounts/company/office/list?companyguid=" + $stateParams.companyguid;
                        break;
                    } else if (navArr[0].title.toLowerCase() == "office" && $state.$current.name != "accountMgmt.office.list" && $state.$current.parent.name == 'accountMgmt.office') {
                        $rootScope.backArrowState = "#/accounts/company/office/list?companyguid=" + navArr[i + 1].model.guid;
                        break;
                    } else if (navArr[0].title.toLowerCase() == "office" && $state.$current.name == "accountMgmt.office.list" && $state.$current.parent.name == 'accountMgmt.office' && navArr[i + 1].model.hasChildCompanies) {
                        $rootScope.backArrowState = "#/accounts/company/list?companyguid=" + navArr[i + 1].model.guid;
                        break;
                    } else if (navArr[0].title.toLowerCase() == "company" && $state.$current.name != "accountMgmt.company.list" && $state.$current.parent.name == 'accountMgmt.company' && navArr[i + 1].model.hasChildCompanies) {
                        $rootScope.backArrowState = "#/accounts/company/list?companyguid=" + navArr[i + 1].model.guid;
                        break;
                    } else {
                        $rootScope.backArrowState = "#/accounts";
                        break;
                    }
                }
                break;
            }
        }
    }

    function setParentEntityName(navArr) {
        for (var i = 0; i < navArr.length; i++) {
            if (navArr[i].model.guid && navArr[i].model.name) {
                $rootScope.parentEntityName = navArr[i].model.name;
                break;
            }
        }
    }

    function prepareCompanyNavigation() {
        if (data && (data.gridDataType == "Company" || data.gridDataType == "ParentCompany")) {
            if (data.gridData && data.gridData.length > 0) {
                var hasChildCompanies = false;
                modelVal = {
                    "guid": "",
                    "name": "Select a company..."
                };
                pushObj = {};
                arr = [];
                angular.forEach(data.gridData, function (d, key) {
                    hasChildCompanies = false;
                    pushObj = {
                        "guid": d["companyGUID"],
                        "name": d["name"]
                    };

                    if (d.companies && d.companies.length) {
                        hasChildCompanies = true;
                    }
                    pushObj["hasChildCompanies"] = hasChildCompanies;

                    this.push(pushObj);

                }, arr);

                if (arr.length > 0) {
                    $scope.navigations.push({
                        "title": "Company",
                        "model": modelVal,
                        "options": arr
                    });
                }

                if (data.gridData[0].parentCompany && data.gridData[0].parentCompany.parentCompanyGUID) {
                    backTraceParentCompanies(data.gridData[0].parentCompany.parentCompanyGUID);
                } else {
                    $scope.showNav = true;
                }

                if ($stateParams.companyguid != "none" && $stateParams.companyguid != undefined)
                    prepareBackTraceNavigation();
            } else {
                $scope.showNav = true;
                blankContainerObj = {
                    "title": "Company",
                    "blankContainerMsg": "The selected company contains no companies.",
                    "model": {guid:true}
                };
            }
        } else {
            if ($stateParams.companyguid != "none" && $stateParams.companyguid != undefined)
                backTraceParentCompanies($stateParams.companyguid);
        }
    }

    function officeNav(data) {
        modelVal = {
            "guid": "",
            "name": "Select an office..."
        };
        pushObj = {};
        arr = [];
        angular.forEach(data, function (d, key) {
            pushObj = {
                "guid": d["companyOfficeGUID"],
                "name": d["officeName"]
            };

            if ($stateParams.officeguid == d["companyOfficeGUID"]) {
                modelVal = pushObj;
            }
            pushObj["hasChildCompanies"] = false;

            this.push(pushObj);

        }, arr);

        if (arr.length > 0) {
            $scope.navigations.push({
                "title": "Office",
                "model": modelVal,
                "options": arr
            });
        }
    }

    function prepareOfficeNavigation() {
        if (data && data.gridDataType == "Office") {
            if (data.gridData && data.gridData.length > 0) {
                officeNav(data.gridData);
            } else {
                blankContainerObj = {
                    "title": "Office",
                    "blankContainerMsg": "The selected company contains no offices.",
                    "model": {guid:true}
                };
            }
            prepareCompanyNavigation();
        } else {
            $rootScope.promise = CompanyServiceAPI.getCompany($stateParams.companyguid, false, "offices").then(function (response) {
                if (!('data' in response)) {
                    if (response.companies && response.companies.length > 0) {
                        officeNav(response.companies[0].offices);
                    }
                    prepareCompanyNavigation();
                }
            });
        }        
    }

    function userNav(data) {
        modelVal = {
            "guid": "",
            "name": "Select a user..."
        };
        pushObj = {};
        arr = [];
        angular.forEach(data, function (d, key) {
            pushObj = {
                "guid": d["userGUID"],
                "name": d["lastName"] + ", " + d["firstName"]
            };

            if ($stateParams.userguid == d["userGUID"]) {
                modelVal = pushObj;
            }
            pushObj["hasChildCompanies"] = false;

            this.push(pushObj);

        }, arr);

        if (arr.length > 0) {
            $scope.navigations.push({
                "title": "User",
                "model": modelVal,
                "options": arr
            });
        }
    }

    function prepareUserNavigation() {
        if (data && data.gridDataType == "User") {
            if (data.gridData && data.gridData.length > 0) {
                userNav(data.gridData);
            } else {
                blankContainerObj = {
                    "title": "User",
                    "blankContainerMsg": "The selected office contains no users.",
                    "model": {guid:true}
                };
            }
            prepareOfficeNavigation();
        } else {
            $rootScope.promise = OfficeServiceAPI.getOfficeData($stateParams.companyguid, $stateParams.officeguid, "users").then(function (response) {
                if (!('data' in response)) {
                    if (response.offices && response.offices.length > 0) {
                        userNav(response.offices[0].users);
                    }
                    prepareOfficeNavigation();
                }
            });
        }
    }

    function prepareBackTraceNavigation() {
        var hasChildCompanies = false;
        var navArrToBackState = [];
        $rootScope.promise = CompanyServiceAPI.getCompany(null, null, 'companies', null, false).then(function (results) {
            if (parentCompanyGuid == "" && backTracedCompanies.records == undefined) {
                parentCompanyGuid = $stateParams.companyguid;
            }

            backTracedCompanies.push({
                "records": results.companies,
                "mapTo": parentCompanyGuid
            });

            modelVal = {
                "guid": "",
                "name": "Select a company..."
            };

            pushObj = {};

            for (var i = 0; i < backTracedCompanies.length; i++) {
                pushObj = {};
                arr = [];
                angular.forEach(backTracedCompanies[i].records, function (d, key) {
                    hasChildCompanies = false;
                    pushObj = {
                        "guid": d["companyGUID"],
                        "name": d["name"]
                    };

                    if (backTracedCompanies[i].mapTo == d["companyGUID"]) {
                        modelVal = pushObj;
                    }

                    if (d.companies && d.companies.length) {
                        hasChildCompanies = true;
                    }
                    pushObj["hasChildCompanies"] = hasChildCompanies;

                    this.push(pushObj);

                }, arr);

                if (arr.length > 0) {
                    $scope.navigations.push({
                        "title": "Company",
                        "model": modelVal,
                        "options": arr
                    });
                }
            }
            
            navArrToBackState = angular.copy($scope.navigations);
            if (blankContainerObj) {                
                navArrToBackState.unshift(blankContainerObj);
            }
            
            setBackArrowState(mapRecordGuid, navArrToBackState);
            setParentEntityName(angular.copy($scope.navigations));
            $scope.navigations.reverse();
            if (blankContainerObj) {
                $scope.navigations.push(blankContainerObj);
            }
            
            blankContainerObj = false;
            if ($state.current.name == "accountMgmt.company.view" || $state.current.name == "accountMgmt.company.viewParcel" || $state.current.name == "accountMgmt.company.edit") {
                var index = $scope.navigations.length - 1;
                if (index > -1 && $scope.navigations[index].model.guid.length <= 0) {
                    $scope.navigations.splice(index, 1);
                }
            }
            prepareSubHeaderTitle();
            $scope.showNav = true;
        });
    }

    function backTraceParentCompanies(guid) {
        $rootScope.promise = CompanyServiceAPI.getCompany(guid, false, 'companies').then(function (response) {
            if (!('data' in response)) {
                if (response.companies && response.companies.length > 0) {
                    backTracedCompanies.push({
                        "records": response.companies[0].companies,
                        "mapTo": mapRecordGuid
                    });
                    if (response.companies[0].parentCompanyGUID) {
                        mapRecordGuid = response.companies[0].companyGUID;
                        parentCompanyGuid = response.companies[0].parentCompanyGUID;
                        backTraceParentCompanies(response.companies[0].parentCompanyGUID);
                    } else {
                        prepareBackTraceNavigation();
                    }
                }
            }
        });
        return;
    }

    //Preparing sub-header according to state
    function prepareSubHeaderTitle() {
        var lastNavEntity = "";
        for (var i = 0; i < $scope.navigations.length; i++) {
            if ($scope.navigations[i].model && $scope.navigations[i].model.guid.length > 0) {
                lastNavEntity = $scope.navigations[i].model.name;
            } else {
                break;
            }
        }

        switch ($state.current.name) {
        case "accountMgmt.company.parentcompanieslist":
            self.subHeaderTitle = "Viewing Companies";
            break;
        case "accountMgmt.company.list":
            self.subHeaderTitle = "Viewing Companies";
            break;
        case "accountMgmt.company.view":
        case "accountMgmt.company.viewParcel":
            if ($stateParams.hasParent == "false")
                self.subHeaderTitle = "Viewing " + lastNavEntity + " Company";
            else
                self.subHeaderTitle = "Viewing " + lastNavEntity + " Company";
            $rootScope.title = self.subHeaderTitle ? self.subHeaderTitle + " / PARCEL" : "PARCEL";
            break;
        case "accountMgmt.company.edit":
            if ($stateParams.hasParent == "false")
                self.subHeaderTitle = "Editing " + lastNavEntity + " Company";
            else
                self.subHeaderTitle = "Editing " + lastNavEntity + " Company";
            $rootScope.title = self.subHeaderTitle ? self.subHeaderTitle + " / PARCEL" : "PARCEL";
            break;
        case "accountMgmt.office.list":
            self.subHeaderTitle = "Viewing Offices";
            break;
        case "accountMgmt.office.view":
            self.subHeaderTitle = "Viewing " + lastNavEntity + " Office";
            $rootScope.title = self.subHeaderTitle ? self.subHeaderTitle + " / PARCEL" : "PARCEL";
            break;
        case "accountMgmt.office.edit":
            self.subHeaderTitle = "Editing " + lastNavEntity + " Office";
            $rootScope.title = self.subHeaderTitle ? self.subHeaderTitle + " / PARCEL" : "PARCEL";
            break;
        case "accountMgmt.user.list":
            self.subHeaderTitle = "Viewing Users";
            break;
        case "accountMgmt.user.view":
        case "accountMgmt.user.appraiserView":
            self.subHeaderTitle = "Viewing " + lastNavEntity + " User";
            $rootScope.title = self.subHeaderTitle ? self.subHeaderTitle + " / PARCEL" : "PARCEL";
            break;
        case "accountMgmt.user.edit":
            self.subHeaderTitle = "Editing " + lastNavEntity + " User";
            $rootScope.title = self.subHeaderTitle ? self.subHeaderTitle + " / PARCEL" : "PARCEL";
            break;
        default:
            self.subHeaderTitle = "";
        }        
    }

    function init() {        
        switch ($state.$current.parent.name) {
        case "accountMgmt.company":
            prepareCompanyNavigation();
            break;
        case "accountMgmt.office":
            prepareOfficeNavigation();
            break;
        case "accountMgmt.user":
            prepareUserNavigation();
            break;
        default:
            console.error("$state.$current.parent.name does not match in NavigationController");
        }
    }

    init();


    // State transition on entity selection
    self.transitionOnSelect = function (selectedEntityGuid, navControlType, navIndex) {        
        var transitionObj = {},
            elemVal = selectedEntityGuid,
            transitionState = "",
            selectedEntityObj;

        if (navControlType.toLowerCase() == 'company') {
            for (var i = 0; i < $scope.navigations.length; i++) {
                selectedEntityObj = $filter('filter')($scope.navigations[i].options, {
                    guid: selectedEntityGuid
                }, true);

                if (selectedEntityObj.length) break;
            }

            if (navIndex == $scope.navigations.length - 1) {
                if ((listStates.indexOf($state.current.name) >= 0)) {
                    if (selectedEntityObj[0].hasChildCompanies) {
                        transitionState = "accountMgmt.company.list";
                    } else {
                        transitionState = "accountMgmt.office.list";
                    }
                } else {
                    transitionState = $state.current.name;
                }
            } else {
                if (selectedEntityObj[0].hasChildCompanies) {
                    transitionState = "accountMgmt.company.list";
                } else {
                    transitionState = "accountMgmt.office.list";
                }
            }

            $state.go(transitionState, {
                companyguid: elemVal
            });            
        } else if (navControlType.toLowerCase() == 'office') {
            if ($state.$current.parent.name == "accountMgmt.office")
                transitionState = (listStates.indexOf($state.current.name) >= 0) ? "accountMgmt.user.list" : $state.current.name;
            else
                transitionState = "accountMgmt.user.list";

            $state.go(transitionState, {
                companyguid: $stateParams.companyguid,
                officeguid: elemVal
            });
        } else if (navControlType.toLowerCase() == 'user') {
            if ($state.$current.parent.name == "accountMgmt.user")
                transitionState = (listStates.indexOf($state.current.name) >= 0) ? "accountMgmt.user.view" : $state.current.name;
            else
                transitionState = "accountMgmt.user.view";

            $state.go(transitionState, {
                companyguid: $stateParams.companyguid,
                officeguid: $stateParams.officeguid,
                userguid: elemVal
            });
        } else {}
    }
}]);