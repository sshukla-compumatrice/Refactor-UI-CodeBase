"use strict";

var AccountMgmt = angular.module('AccountMgmtModule', ['ui.router.state', 'countrySelect', 'ngFileUpload', 'xeditable']);

function isValidParams(obj, params) {
    for (var i = 0; i < params.length; i++) {
        if (params[i] in obj) {
            if (obj[params[i]] == "true" ||
                typeof obj[params[i]] == 'undefined' ||
                obj[params[i]] == 'undefined' ||
                obj[params[i]] == null ||
                obj[params[i]] == '') {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
}

AccountMgmt.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $urlRouterProvider.when('/accounts/', '/accounts');
    $urlRouterProvider.when('/accounts/company', '/accounts');
    $urlRouterProvider.when('/accounts/company/', '/accounts');
    $urlRouterProvider.when('/accounts/office', '/accounts');
    $urlRouterProvider.when('/accounts/office/', '/accounts');
    $urlRouterProvider.when('/accounts/office/user', '/accounts');
    $urlRouterProvider.when('/accounts/office/user/', '/accounts');

    // Root route for Account Management
    $stateProvider.state('accountMgmt', {
        templateUrl: 'modules/accManagement/views/accountMgmt.html',
        controller: function ($rootScope, $sce) {
            if ($rootScope.userMessage)
                $sce.trustAsHtml($rootScope.userMessage);
        },
        breadcrumb: {
            skip: true
        }
    })

    //Company routes
    //Parent state for company states
    .state('accountMgmt.company', {
        abstract: true
    })

    //Upload company logo
    .state("accountMgmt.companyLogo", {
        url: "/company/logo",
        views: {
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/company-logo.html',
                controller: 'LogoController as logoCtrl'
            }
        },
        data: {
            pageTitle : "Logo"
        }
    })

    //ParentCompany listing state
    .state('accountMgmt.company.parentcompanieslist', {
        url: '/accounts',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/grid-view.html',
                controller: 'GridController as gridCtrl'
            },
        },
        breadcrumb: {
            label: 'Account Management'
        },
        data: {
            pageTitle : "Viewing Companies"
        },
        resolve: {
            data: function (CompanyServiceAPI) {
                return CompanyServiceAPI.getCompany(null, null, 'companies', null, false).then(function (result) {
                    return {
                        "gridData": result.companies,
                        "gridDataType": "ParentCompany",
                        "linkToAddEntity": "#/accounts/company/new?companyguid=none"
                    };
                });
            },
            gridColumns: function () {
                return [
                    {
                        "targets": 0,
                        "title": "Company Name",
                        "data": null,
                        "mRender": function (data, type, row) {
                            var view = 'viewParcel';
                            var isLenderCompany = data.companyTypes.filter(function (item) {
                                return item.companyType == 'Lender';
                            });

                            if (isLenderCompany.length)
                                view = 'view';

                            return '<a href="#/accounts/company/' + view + '?companyguid=' + data.companyGUID + '">' + data.name + '</a>';
                        }
                    },
                    {
                        "targets": 1,
                        "title": "Action",
                        "data": null,
                        "orderable": false,
                        "searchable": false,
                        "mRender": function (data, type, row) {
                            return '<a href="#/accounts/company/edit?companyguid=' + data.companyGUID + '">Edit</a>&nbsp;|&nbsp;<a href="" class="link-delete" data-entityType="parent-company" data-entityname="' + data.name + '" data-companyguid="' + data.companyGUID + '">Delete</a>';
                        },
                        "createdCell": function (td, cellData, rowData, row, col) {
                            $(td).attr('align', 'right');
                        }
                    }];
            }
        }
    })

    //Company listing state
    .state('accountMgmt.company.list', {
        url: '/accounts/company/list?companyguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/grid-view.html',
                controller: 'GridController as gridCtrl'
            },
        },
        breadcrumb: {
            label: '{{parentCompanyCrumbTitle}}',
            parent: 'accountMgmt.company.parentcompanieslist'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        data: {
            pageTitle : "Viewing Companies"
        },
        resolve: {
            data: function ($stateParams, CompanyServiceAPI) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid, false, "companies").then(function (result) {
                    return {
                        "gridData": result.companies[0].companies,
                        "gridDataType": "Company",
                        "linkToAddEntity": "#/accounts/company/new?companyguid=" + $stateParams.companyguid,
                        "isChildCompany": result.companies[0].parentCompanyGUID ? true : false
                    };
                });
            },
            gridColumns: function ($stateParams) {
                return [
                    {
                        "targets": 0,
                        "title": "Company Name",
                        "data": null,
                        "mRender": function (data, type, row) {
                            var view = 'viewParcel';
                            var isLenderCompany = data.companyTypes.filter(function (item) {
                                return item.companyType == 'Lender';
                            });

                            if (isLenderCompany.length)
                                view = 'view';

                            return '<a href="#/accounts/company/' + view + '?companyguid=' + data.companyGUID + '">' + data.name + '</a>';
                        }
                    },
                    {
                        "targets": 1,
                        "title": "Action",
                        "data": null,
                        "orderable": false,
                        "searchable": false,
                        "mRender": function (data, type, row) {
                            return '<a href="#/accounts/company/edit?companyguid=' + data.companyGUID + '">Edit</a>&nbsp;|&nbsp;<a href="" class="link-delete" data-entityType="company" data-entityname="' + data.name + '" data-companyguid="' + data.companyGUID + '">Delete</a>';
                        },
                        "createdCell": function (td, cellData, rowData, row, col) {
                            $(td).attr('align', 'right');
                        }
                    }];
            }
        }
    })

    //Company View state
    .state('accountMgmt.company.view', {
        url: '/accounts/company/view?companyguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/company/company-view.html',
                controller: 'CreateCompanyCtrl as createCompCtrl'
            },
        },
        breadcrumb: {
            parent: 'accountMgmt.company.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            companyData: function (CompanyServiceAPI, $stateParams) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid, false, "companies,certifications,applicationcomponents,setupfees,reportsettings,offices,associatedcompanies");
            },
            listingTypes: function (ListingsAPI) {
                return ListingsAPI.getListings('companytypes,appcomponenttypes,companycerttypes,lendersetupfeetypes').then(function (result) {
                    return result;
                })
            },
            data: function () {
                return false;
            },
            companyTemplates: function (commonServices, $stateParams) {
                return commonServices.getCompReportTemplates($stateParams.companyguid).then(function (result) {
                    if (result && result.templates)
                        return result.templates;
                    return null;
                })
            }
        }
    })

    //PARCEL company view
    .state('accountMgmt.company.viewParcel', {
        url: '/accounts/company/viewParcel?companyguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/company/company-view-parcel.html',
                controller: 'parcelViewCtrl as parcelCtrl'
            }
        },
        breadcrumb: {
            parent: 'accountMgmt.company.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            companyData: function (CompanyServiceAPI, $stateParams) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid, false, "companies,applicationcomponents,certifications,offices,setupfees,rates,discounts");
            },
            data: function () {
                return false;
            },
            reportTypes: function (commonServices) {
                return commonServices.getReportTypes().then(function (resp) {
                    return resp.reportTypes;
                });
            },
            setupTypeList: function (ListingsAPI) {
                return ListingsAPI.getListings("setupfeetypes").then(function (resp) {
                    return resp.setupFeeTypes;
                });
            },
            companyTemplates: function (commonServices, $stateParams) {
                return commonServices.getCompReportTemplates($stateParams.companyguid).then(function (resp) {
                    return resp.templates;
                });
            }
        }
    })

    //Edit company state
    .state('accountMgmt.company.edit', {
        url: '/accounts/company/edit?companyguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/company/company-add-edit.html',
                controller: 'CreateCompanyCtrl as createCompCtrl'
            },
        },
        breadcrumb: {
            parent: 'accountMgmt.company.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            companyData: function (CompanyServiceAPI, $stateParams) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid, null, 'certifications,offices,companyTypes,applicationcomponents');
            },
            listingTypes: function (ListingsAPI) {
                return ListingsAPI.getListings('companytypes,appcomponenttypes,companycerttypes').then(function (result) {
                    return result;
                })
            },
            data: function () {
                return false;
            },
            companyTemplates: function () {
                return null;
            }
        }
    })

    //Adding new company state
    .state('accountMgmt.company.new', {
        url: '/accounts/company/new?companyguid',
        views: {
            'navigation@accountMgmt': {
                template: '<span></span>',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/company/company-add-edit.html',
                controller: 'CreateCompanyCtrl as createCompCtrl'
            },
        },
        breadcrumb: {
            label: 'Adding new company',
            parent: 'accountMgmt.company.parentcompanieslist'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        data: {
            pageTitle : "Creating Company"
        },
        resolve: {
            companyData: function (CompanyServiceAPI, $stateParams) {
                return false;
            },
            listingTypes: function (ListingsAPI) {
                return ListingsAPI.getListings('companytypes,appcomponenttypes,companycerttypes').then(function (result) {
                    return result;
                })
            },

            data: function () {
                return false;
            },
            companyTemplates: function () {
                return null;
            }
        }
    })

    //Office routes        
    //Parent state for Office states
    .state('accountMgmt.office', {
        abstract: true
    })

    //Office listing state
    .state('accountMgmt.office.list', {
        url: '/accounts/company/office/list?companyguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/grid-view.html',
                controller: 'GridController as gridCtrl'
            }
        },
        breadcrumb: {
            label: '{{companyCrumbTitle}}',
            parent: 'accountMgmt.company.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        data: {
            pageTitle : "Viewing Offices"
        },
        resolve: {
            data: function (CompanyServiceAPI, $stateParams) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid, false, "offices").then(function (result) {
                    return {
                        "gridData": result.companies[0].offices,
                        "gridDataType": "Office",
                        "linkToAddEntity": "#/accounts/company/office/new?companyguid=" + $stateParams.companyguid
                    };
                });
            },
            gridColumns: function ($stateParams) {
                return [
                    {
                        "targets": 0,
                        "title": "Office Name",
                        "data": null,
                        "mRender": function (data, type, row) {
                            return '<a href="#/accounts/company/office/view?companyguid=' + $stateParams.companyguid + '&officeguid=' + data.companyOfficeGUID + '">' + data.officeName + '</a>';
                        }
                    },
                    {
                        "targets": 1,
                        "title": "Action",
                        "data": null,
                        "orderable": false,
                        "searchable": false,
                        "mRender": function (data, type, row) {
                            return '<a href="#/accounts/company/office/edit?companyguid=' + $stateParams.companyguid + '&officeguid=' + data.companyOfficeGUID + '">Edit</a>&nbsp;|&nbsp;<a href="" class="link-delete" data-entityType="office" data-entityname="' + data.officeName + '" data-companyguid="' + $stateParams.companyguid + '" data-officeguid="' + data.companyOfficeGUID + '">Delete</a>'
                        },
                        "createdCell": function (td, cellData, rowData, row, col) {
                            $(td).attr('align', 'right');
                        }
                    }];
            }
        }
    })

    //Office view state
    .state('accountMgmt.office.view', {
        url: '/accounts/company/office/view?companyguid&officeguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/office/office-view.html',
                controller: 'OfficeController as officeCtrl'
            },
        },
        breadcrumb: {
            label: '{{officeCrumbTitle}}',
            parent: 'accountMgmt.office.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            officeData: function (OfficeServiceAPI, $stateParams) {
                return OfficeServiceAPI.getOfficeData($stateParams.companyguid, $stateParams.officeguid);
            },
            data: function () {
                return false;
            }
        }
    })

    //Office edit state
    .state('accountMgmt.office.edit', {
        url: '/accounts/company/office/edit?companyguid&officeguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/office/office-add-edit.html',
                controller: 'OfficeController as officeCtrl'
            }
        },
        breadcrumb: {
            parent: 'accountMgmt.office.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            officeData: function (OfficeServiceAPI, $stateParams) {
                return OfficeServiceAPI.getOfficeData($stateParams.companyguid, $stateParams.officeguid, "users");
            },
            data: function () {
                return false;
            }
        }
    })

    //Adding new office state
    .state('accountMgmt.office.new', {
        url: '/accounts/company/office/new?companyguid',
        views: {
            'navigation@accountMgmt': {
                template: '<span></span>',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/office/office-add-edit.html',
                controller: 'OfficeController as officeCtrl'
            }
        },
        breadcrumb: {
            label: 'Adding new office',
            parent: 'accountMgmt.office.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        data: {
            pageTitle : "Creating Office"
        },
        resolve: {
            officeData: function () {
                return null;
            },
            data: function () {
                return false;
            }
        }
    })


    // Abstract parent state of user states
    .state('accountMgmt.user', {
        abstract: true
    })

    // Office users listing
    .state('accountMgmt.user.list', {
        url: '/accounts/company/office/user/list?companyguid&officeguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/grid-view.html',
                controller: 'GridController as gridCtrl'
            }
        },
        breadcrumb: {
            label: '{{officeCrumbTitle}}',
            parent: 'accountMgmt.office.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        data: {
            pageTitle : "Viewing Users"
        },
        resolve: {
            data: function (OfficeServiceAPI, UserServiceAPI, $stateParams) {
                //return OfficeServiceAPI.getOfficeData($stateParams.companyguid, $stateParams.officeguid, "users").then(function (result) {
                return UserServiceAPI.getUserInfo("", $stateParams.companyguid, $stateParams.officeguid, "office,company").then(function (result) {                    
                    var gridData = (result && result.users && result.users.length) ? result.users : [];
                    return {
                        "gridData": gridData,
                        "gridDataType": "User",
                        "linkToAddEntity": "#/accounts/company/office/user/new?companyguid=" + $stateParams.companyguid + "&officeguid=" + $stateParams.officeguid
                    }
                });
            },
            gridColumns: function ($stateParams) {
                return [
                    {
                        "targets": 0,
                        "title": "User Name",
                        "data": null,
                        "mRender": function (data, type, row) {
                            var view = "view";
                            /*if($stateParams.parentcompanyguid != "none")
                                view = "appraisalview";*/
                            return '<a href="#/accounts/company/office/user/' + view + '?companyguid=' + $stateParams.companyguid + '&officeguid=' + $stateParams.officeguid + '&userguid=' + data.userGUID + '">' + data.lastName + ', ' + data.firstName + '</a>';
                        }
                    },
                    {
                        "targets": 1,
                        "title": "Email",
                        "data": null,
                        "mRender": function (data, type, row) {
                            return data.email;
                        }
                    },
                    {
                        "targets": 2,
                        "title": "Phone",
                        "data": null,
                        "mRender": function (data, type, row) {
                            return data.directPhone ? data.directPhone : data.cellPhone;
                        }
                    },
                    {
                        "targets": 3,
                        "title": "Action",
                        "data": null,
                        "orderable": false,
                        "searchable": false,
                        "mRender": function (data, type, row) {
                            var view = "edit";
                            /*if ($stateParams.parentcompanyguid != "none")
                                view = "appraisalview";*/
                            return '<a href="#/accounts/company/office/user/' + view + '?companyguid=' + $stateParams.companyguid + '&officeguid=' + $stateParams.officeguid + '&userguid=' + data.userGUID + '">Edit</a>&nbsp;|&nbsp;<a href="" class="link-delete" data-entityType="user" data-entityname="' + data.lastName + ' ' + data.firstName + '" data-companyguid="' + $stateParams.companyguid + '" data-officeguid="' + $stateParams.officeguid + '" data-userguid="' + data.userGUID + '">Delete</a>';
                        },
                        "createdCell": function (td, cellData, rowData, row, col) {
                            $(td).attr('align', 'right');
                        }
                    }];
            }
        }
    })

    // State to edit user
    .state('accountMgmt.user.edit', {
        url: '/accounts/company/office/user/edit?companyguid&officeguid&userguid',

        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/user/user-add-edit.html',
                controller: 'UserController as userCtrl'
            }
        },
        breadcrumb: {
            label: '{{userCrumbTitle}}',
            parent: 'accountMgmt.user.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid', 'userguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            data: function () {
                return false;
            },
            roleList: function($rootScope, roleServiceAPI) {
                return roleServiceAPI.getRoleInformation(false, $rootScope.currentUserCompanyGuid, "Company", $rootScope.currentUserGuid, 'User').then(function (response) {
                    return response;
                });
            }
        }
    })

    // State to view user
    .state('accountMgmt.user.view', {
        url: '/accounts/company/office/user/view?companyguid&officeguid&userguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/user/user-view.html',
                controller: 'UserController as userCtrl'
            },
        },
        breadcrumb: {
            label: '{{userCrumbTitle}}',
            parent: 'accountMgmt.user.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid', 'userguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            data: function () {
                return false;
            },
            roleList: function($rootScope, roleServiceAPI) {
                return roleServiceAPI.getRoleInformation(false, $rootScope.currentUserCompanyGuid, "Company", $rootScope.currentUserGuid, 'User').then(function (response) {
                    return response;
                });
            }
        }
    })

    // State to create new user
    .state('accountMgmt.user.new', {
        url: '/accounts/company/office/user/new?companyguid&officeguid',

        views: {
            'navigation@accountMgmt': {
                template: '<span></span>',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/user/user-add-edit.html',
                controller: 'UserController as userCtrl'
            }
        },
        breadcrumb: {
            label: 'Adding new user',
            parent: 'accountMgmt.user.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        data: {
            pageTitle : "Creating User"
        },
        resolve: {
            data: function () {
                return false;
            },
            roleList: function($rootScope, roleServiceAPI) {
                return roleServiceAPI.getRoleInformation(false, $rootScope.currentUserCompanyGuid, "Company", $rootScope.currentUserGuid, 'User').then(function (response) {
                    return response;
                });
            }
        }
    })



    .state('accountMgmt.user.appraiserView', {
        url: '/accounts/company/office/user/appraisalview?companyguid&officeguid&userguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavigationController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/appraisaluser/appraisaluser-view.html',
                controller: 'AppraisalUserController as AppraisalUserCtrl'
            }
        },
        breadcrumb: {
            label: '{{userCrumbTitle}}',
            parent: 'accountMgmt.user.list'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid', 'userguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            data: function () {
                return false;
            },
            UsaStates: function (geocodeService) {
                return geocodeService.getStates('US').then(function (response) {
                    return response.states;
                });
            }
        }
    })

    .state('accountMgmt.user.passwordchange', {
        url: '/accounts/company/office/user/passwordchange?companyguid&officeguid&userguid',
        views: {
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/appraisaluser/appraiseruser-changepassword.html',
                controller: 'AppraisalUserController as AppraisalUserCtrl'
            },
        },
        data: {
            displayName: false
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid', 'officeguid', 'userguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        resolve: {
            data: function () {
                return false;
            },
            UsaStates: function (geocodeService) {
                return geocodeService.getStates('US').then(function (response) {
                    return response.states;
                });
            }
        }
    })

    //Search routes
    .state('accountMgmt.SearchAll', {
        url: '/accounts/search',
        breadcrumb: {
            label: 'Search',
            parent: 'accountMgmt.company.parentcompanieslist'
        },
        views: {
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/SearchAll.html',
                controller: 'SearchController as SearchCtrl'
            }
        },
        data: {
            pageTitle : "Search"
        }
    })

    //umbrella view
    .state('accountMgmt.umbrella', {
        'url': '/accounts/umbrella?companyguid',
        views: {
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/umbrella/umbrella-view.html',
                controller: 'UmbrellaController as umbrellaCtrl'
            }
        },
        breadcrumb: {
            label: 'Umbrella',
            parent: 'accountMgmt.company.parentcompanieslist'
        },
        onEnter: function ($stateParams, $state) {
            if (!isValidParams($stateParams, ['companyguid'])) {
                $state.go('accountMgmt.company.parentcompanieslist');
            }
        },
        data: {
            pageTitle : "Viewing Umbrella"
        },
        resolve: {
            companyData: function (CompanyServiceAPI, $stateParams) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid);
            }
        }
    })

}]);

AccountMgmt.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});