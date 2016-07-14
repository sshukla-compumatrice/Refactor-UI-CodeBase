angular.module('templates-dist', ['../modules/accManagement/views/SearchAll.html', '../modules/accManagement/views/accountMgmt.html', '../modules/accManagement/views/accountMgmtNavigation.html', '../modules/accManagement/views/grid-view.html', '../modules/resetPassword/views/forgotPassword.html', '../modules/resetPassword/views/resetPassword.html']);

angular.module("../modules/accManagement/views/SearchAll.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/accManagement/views/SearchAll.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-12 col-lg-12\">\n" +
    "        <div class=\"bottom-margin-sm\">\n" +
    "            <a class=\"pointer\" ng-click=\"SearchCtrl.orderSearchResultsDt()\">{{SearchCtrl.searchType}}</a>\n" +
    "        </div>\n" +
    "\n" +
    "        <form class=\"form-inline bottom-margin\" novalidate>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input id=\"searchStringInp\" type=\"text\" name=\"search\" ng-model=\"SearchCtrl.searchString\" class=\"form-control\" required>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <select class=\"form-control\" name=\"searchType\" ng-change=\"SearchCtrl.clearSearch()\" ng-model=\"SearchCtrl.searchType\">\n" +
    "                    <option value=\"Users\">Users</option>\n" +
    "                    <option value=\"Offices\">Offices</option>\n" +
    "                    <option value=\"Companies\">Companies</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <button type=\"submit\" ng-click=\"SearchCtrl.SearchAll()\" class=\"btn btn-primary\">Search</button>\n" +
    "        </form>\n" +
    "        <span ng-hide=\"SearchCtrl.isSearchStringSet\" class=\"text-danger\">Search string for {{SearchCtrl.searchType}} search cannot be blank.</span>\n" +
    "\n" +
    "        <div class=\"border-top\" ng-show=\"SearchCtrl.gridData\">\n" +
    "            <table id=\"SearchResultsDt\" class=\"table table-bordered table-condensed table-hover table-striped small\">\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <th>Search Results</th>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody></tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("../modules/accManagement/views/accountMgmt.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/accManagement/views/accountMgmt.html",
    "<div class=\"AccountMgmtContainer\">\n" +
    "    <div cg-busy=\"promise\">\n" +
    "        <header app-header=\"PARCEL\"></header>\n" +
    "        <!-- Can use this modal as comman error alert -->\n" +
    "        <div class=\"modal modal-priority-alert fade in\" id=\"errorPriorityAlertModal\" data-backdrop=\"static\">\n" +
    "            <div class=\"modal-dialog\">\n" +
    "                <div class=\"modal-content\">\n" +
    "                    <div class=\"modal-header\">\n" +
    "                        <div class=\"icon\">\n" +
    "                            <i class=\"fa fa-exclamation-triangle\"></i>\n" +
    "                        </div>\n" +
    "                        <h4 class=\"modal-title\">{{alertTitle}}</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"modal-body\">\n" +
    "                        <div class=\"content\">\n" +
    "                            <p class=\"lead\" ng-repeat=\"alertMessage in alertMessageArr\">{{alertMessage}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"modal-footer\">\n" +
    "                        <a class=\"pull-right btn btn-danger\" ng-click=\"closeErrorPriorityAlertModal();\">Ok, Got It</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- Error alert modal end-->\n" +
    "        <div ng-hide=\"serviceError\">\n" +
    "            <!--<ol class=\"breadcrumb breadcrumb-inverse custom-breadcrumb\">\n" +
    "            <li breadcrumb-directive></li>\n" +
    "        </ol>-->\n" +
    "            <div class=\"container-fluid\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-12 col-lg-12\">\n" +
    "                        <h2 class=\"page-header\">ACCOUNT MANAGEMENT</h2>\n" +
    "                        <div ui-view=\"navigation\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/delete-confirmation-modal.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/delete-confirmation-action-modal.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/company-reports-save-confirmation-modal.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/update-report-vendors-confirmation-modal.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/lender-submit-invoice-modal.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/helpEP.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/helpSignFor.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/sendFeesToABS.html'\"></div>\n" +
    "                        <div ng-include src=\"'modules/accManagement/views/modals/upload-user-modal.html'\"></div>\n" +
    "                        <div id=\"alertMessage\" class=\"alert\" ng-class=\"alertClass\" role=\"alert\" ng-show=\"userMessage\">\n" +
    "                            <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span> {{userMessage}}\n" +
    "                            <button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"dismissUserMessage()\">\n" +
    "                                <span aria-hidden=\"true\">&times;</span>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                        <div ui-view=\"container\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <footer class=\"footer-bar\">\n" +
    "            <div class=\" col-lg-offset-4 col-sm-offset-3  col-md-offset-4 Footermenu1-LP\">\n" +
    "                <ul class=\" list-unstyled \">\n" +
    "                    <li><a href=\"http://edrnet.com/\" target=\"_blank\"><i class=\"fa fa-copyright\"></i> 2015 EDR, Inc.</a></li>\n" +
    "                    <li><a href=\"#\" target=\"_blank\">Terms of Service</a></li>\n" +
    "                    <li><a href=\"http://edrnet.com/contact-us/\" target=\"_blank\">Contact Us</a></li>\n" +
    "                    <li class=\"border-none\"><a id=\"currentserver\" class=\"decoration-n\">Current Server: </a></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </footer>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("../modules/accManagement/views/accountMgmtNavigation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/accManagement/views/accountMgmtNavigation.html",
    "<a href=\"#/accounts/search\">Search</a>\n" +
    "<!--<div cg-busy=\"promise\"></div>-->\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-1 col-lg-1 text-center top-margin-lg\" ng-show=\"showNavs\">\n" +
    "        <a ng-show=\"backArrowState\" ng-href=\"{{backArrowState}}\" class=\"pointer\">\n" +
    "            <span class=\"glyphicon glyphicon-arrow-up fa-lg top-margin-sm\"></span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 col-lg-2\" ng-repeat=\"nav in navigations\" ng-show=\"showNavs\">        \n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">{{nav.title == \"ParentCompany\" ? \"Parent Company\" : nav.title}}</label>\n" +
    "            <select class=\"form-control\" chosen=\"nav.options\" ng-model=\"nav.model\" ng-change=\"navCtrl.transitionOnSelect(nav.model.guid, nav.title)\" ng-options=\"option.name for option in nav.options | orderBy:['name'] track by option.guid\" data-transitionToState=\"{{nav.transitionToState}}\" data-attachedParam=\"{{nav.attachedParam}}\" data-placeholder=\"{{nav.model.name}}\"></select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<h4>{{navCtrl.subHeaderTitle}}</h4>");
}]);

angular.module("../modules/accManagement/views/grid-view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/accManagement/views/grid-view.html",
    "<div class=\"border-top\">\n" +
    "    <a ng-href=\"{{gridCtrl.linkToAdd}}\" class=\"btn btn-md btn-primary\" ng-if=\"!gridCtrl.isChildCompany\">Add {{gridCtrl.entityType}}</a>\n" +
    "    <span ng-show=\"gridCtrl.showUserSpreadsheet\"> <a class=\"btn btn-md btn-primary pointer\" ng-click=\"gridCtrl.uploadUsers()\">Upload User Spreadsheet</a></span>\n" +
    "    <span ng-if=\"gridCtrl.umbrellaCompanyGUID\"> \n" +
    "<a class=\"btn btn-md btn-primary\" href=\"#/accounts/umbrella?companyguid={{gridCtrl.umbrellaCompanyGUID}}\">Umbrella</a></span>\n" +
    "    <div class=\"table-responsive\">\n" +
    "        <table id=\"AccountMgmtDatatable\" class=\"table table-striped table-bordered dt-responsive nowrap small\">\n" +
    "            <thead></thead>\n" +
    "            <tbody></tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("../modules/resetPassword/views/forgotPassword.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/resetPassword/views/forgotPassword.html",
    "<div class=\"bg-image\">\n" +
    "    <div class=\"container-fluid \">\n" +
    "        <div class=\"top-margin-lg\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-offset-2 col-md-8\">\n" +
    "                    <div class=\"login-inner\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-4\">\n" +
    "                                <a href=\"\"><img class=\"img-responsive\" src=\"images/logo.png\"></a>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"col-md-8\">\n" +
    "                                <img class=\"img-responsive\" src=\"images/taglogo.png\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <hr class=\"border-white\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <div>\n" +
    "\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <p><strong>PARCEL Password Reset</strong></p>\n" +
    "                                    <p>If you have forgotten your username or password, you can request to have your username emailed to you and to reset your password.</p>\n" +
    "                                    <p>When you fill in your registered email address, you will be sent instructions on how to reset your password.</p>\n" +
    "                                    <hr class=\"border-white\">\n" +
    "                                    <form class=\"form-horizontal\" name=\"emailValidationForm\" novalidate>\n" +
    "                                            <div class=\"form-group\" field-validation=\"Your Email\">\n" +
    "                                            <label class=\"col-sm-3 control-label\">Your email address:</label>\n" +
    "                                            <div class=\"col-sm-4\">\n" +
    "                                                <input class=\"form-control\" type=\"email\" name=\"forgot-password-email\" placeholder=\"Email\" ng-model=\"forgotPassword.email\" required>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"form-group\">\n" +
    "                                            <div class=\"col-md-offset-3 col-sm-4\">\n" +
    "                                                <button class=\"btn btn-default\" ng-click=\"forgotPassword.resetEmail()\">Cancel</button>\n" +
    "                                                <button class=\"btn btn-primary\" ng-click=\"forgotPassword.validateEmail(emailValidationForm)\">Submit</button>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </form>\n" +
    "                                    <div id=\"forgotPasswordAlert\" class=\"alert\" ng-show=\"forgotPassword.isEmailValidated\" role=\"alert\">\n" +
    "                                        {{forgotPassword.message}}\n" +
    "\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div id=\"row\" class=\"footer-container\">\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <a href=\"http://edrnet.com/privacy-policy/privacy-policy\">Privacy Policy</a> /\n" +
    "\n" +
    "                            <a href=\"http://edrnet.com/terms-conditions/\">Terms and Conditions</a> / &copy; 2015 Copyright <a href=\"http://edrnet.com/\">EDR</a> / Need Help? Call 1.866.475.1272\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6 text-right\">\n" +
    "                            <a href=\"http://edrnet.com/about-edr/in-the-news?display=rss\">RSS</a> /\n" +
    "                            <a href=\"https://www.facebook.com/edrnet\">Facebook</a> /\n" +
    "                            <a href=\"https://twitter.com/#!/Enviro_Data\">Twitter</a> /\n" +
    "                            <a href=\"http://www.linkedin.com/company/edr\">LinkedIn</a> /\n" +
    "                            <a href=\"http://www.youtube.com/user/EDRincvideo\">YouTube</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("../modules/resetPassword/views/resetPassword.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/resetPassword/views/resetPassword.html",
    "<div class=\"bg-image\">\n" +
    "    <div class=\"container-fluid \">\n" +
    "        <div class=\"top-margin-lg\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-offset-2 col-md-8\">\n" +
    "                    <div class=\"login-inner\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-4\">\n" +
    "                                <a href=\"\"><img class=\"img-responsive\" src=\"images/logo.png\"></a>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"col-md-8\">\n" +
    "                                <img class=\"img-responsive\" src=\"images/taglogo.png\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <hr class=\"border-white\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <div class=\"row\" cg-busy=\"{promise:promise,templateUrl:templateUrl,message:message,backdrop:backdrop,delay:delay,minDuration:minDuration}\">\n" +
    "                            <div ng-show = \"resetPassword.isTokenValid\" class=\"col-md-12\">\n" +
    "                                <p><strong>PARCEL Password Reset</strong></p>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                                <hr class=\"border-white\">\n" +
    "                                <form class=\"form-horizontal\" name=\"parcelResetPassForm\"  novalidate>\n" +
    "                                    <div class=\"form-group\" field-validation=\"New Password\">\n" +
    "\n" +
    "                                        <label for=\"reset-password-new\" class=\"col-sm-2 control-label\">New Password:</label>\n" +
    "                                        <div class=\"col-sm-4\">\n" +
    "                                            <input class=\"form-control\" type=\"password\" placeholder=\"New Password\" id=\"reset-password-new\" name=\"reset-password-new\" ng-model=\"resetPassword.newPassword\" ng-pattern=\"/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/\" required>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div class=\"form-group\">\n" +
    "                                        <label class=\"col-sm-2 control-label\">Retype Password:</label>\n" +
    "                                        <div class=\"col-sm-4\">\n" +
    "                                            <input class=\"form-control repassword\" type=\"password\" match-password ng-change=\"resetPassword.matchPassword(parcelResetPassForm)\"  placeholder=\"Retype Password\" name=\"reset-password-repeat\" ng-model=\"resetPassword.repeatPassword\" required>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div class=\"form-group\">\n" +
    "                                        <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "                                            <button class=\"btn btn-default\" ng-click=\"resetPassword.resetPassword()\">Cancel</button>\n" +
    "                                            <button class=\"btn btn-primary\" ng-mousedown=\"resetPassword.submitNewPassword(parcelResetPassForm)\">Submit</button>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </form>\n" +
    "                                <div class=\"alert alert-success\" id=\"resetPasswordAlert\" ng-show=\"resetPassword.resetPasswordSuccess\" role=\"alert\">{{resetPassword.isPasswordChangedMessage}}</div>\n" +
    "                                <!--<div class=\"alert alert-success\" ng-show=\"!resetPassword.resetPasswordSuccess\" role=\"alert\">{{resetPassword.errorMsg}}</div>-->\n" +
    "                            </div>\n" +
    "                            <div class=\"alert alert-danger\" role=\"alert\" ng-show = \"!resetPassword.isTokenValid\">\n" +
    "                                {{resetPassword.errorMsg}}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div id=\"row\" class=\"footer-container\">\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <a href=\"http://edrnet.com/privacy-policy/privacy-policy\">Privacy Policy</a> /\n" +
    "\n" +
    "                            <a href=\"http://edrnet.com/terms-conditions/\">Terms and Conditions</a> / &copy; 2015 Copyright <a href=\"http://edrnet.com/\">EDR</a> / Need Help? Call 1.866.475.1272\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6 text-right\">\n" +
    "                            <a href=\"http://edrnet.com/about-edr/in-the-news?display=rss\">RSS</a> /\n" +
    "                            <a href=\"https://www.facebook.com/edrnet\">Facebook</a> /\n" +
    "                            <a href=\"https://twitter.com/#!/Enviro_Data\">Twitter</a> /\n" +
    "                            <a href=\"http://www.linkedin.com/company/edr\">LinkedIn</a> /\n" +
    "                            <a href=\"http://www.youtube.com/user/EDRincvideo\">YouTube</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
;"use strict";

var AccountMgmt = angular.module('AccountMgmtModule', ['ui.router.state', 'countrySelect', 'ngFileUpload','xeditable']);

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

    //$urlRouterProvider.when('/accounts', '/accounts');
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
        breadcrumb: {
            skip: true
        }
    })

    //Company routes
    //Parent state for company states
    .state('accountMgmt.company', {
        abstract: true
    })

    //ParentCompany listing state
    .state('accountMgmt.company.parentcompanieslist', {
        url: '/accounts',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavController as navCtrl'
            },
            'container@accountMgmt': {
                templateUrl: 'modules/accManagement/views/grid-view.html',
                controller: 'GridController as gridCtrl'
            },
        },
        breadcrumb: {
            label: 'Account Management'
        },
        resolve: {
            data: function (CompanyServiceAPI) {
                return CompanyServiceAPI.getCompany(null, null, 'none', null, false).then(function (result) {
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
                            
                            if(isLenderCompany.length)
                                view = 'view';
                            
                            return '<a href="#/accounts/company/'+view+'?companyguid=' + data.companyGUID + '">' + data.name + '</a>';
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
                controller: 'NavController as navCtrl'
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
        resolve: {
            data: function ($stateParams, CompanyServiceAPI) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid).then(function (result) {
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
                            
                            if(isLenderCompany.length)
                                view = 'view';
                            
                            return '<a href="#/accounts/company/'+view+'?companyguid=' + data.companyGUID + '">' + data.name + '</a>';
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
                controller: 'NavController as navCtrl'
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
                return CompanyServiceAPI.getCompany($stateParams.companyguid);
            },
            listingTypes: function (ListingsAPI) {
                return ListingsAPI.getListings('companytypes,appcomponenttypes,companycerttypes,lendersetupfeetypes').then(function (result) {
                    return result;
                })
            },
            data: function () {
                return false;
            },
            companyTemplates: function (CompanyServiceAPI, $stateParams){
                return CompanyServiceAPI.getCompReportTemplates($stateParams.companyguid).then(function(result){
                    if(result && result.templates)
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
                controller: 'NavController as navCtrl'
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
                return CompanyServiceAPI.getCompany($stateParams.companyguid);
            },
            data: function () {
                return false;
            }
        }
    })
                
    //Edit company state
    .state('accountMgmt.company.edit', {
        url: '/accounts/company/edit?companyguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavController as navCtrl'
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
                return CompanyServiceAPI.getCompany($stateParams.companyguid, null, 'certifications,offices,companyTypes');
            },
            listingTypes: function (ListingsAPI) {
                return ListingsAPI.getListings('companytypes,appcomponenttypes,companycerttypes').then(function (result) {
                    return result;
                })
            },
            data: function () {
                return false;
            },
            companyTemplates : function() {
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
                controller: 'NavController as navCtrl'
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
            companyTemplates : function() {
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
                controller: 'NavController as navCtrl'
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
        resolve: {
            data: function (CompanyServiceAPI, $stateParams) {
                return CompanyServiceAPI.getCompany($stateParams.companyguid).then(function (result) {
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
                controller: 'NavController as navCtrl'
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
                controller: 'NavController as navCtrl'
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
                return OfficeServiceAPI.getOfficeData($stateParams.companyguid, $stateParams.officeguid);
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
                controller: 'NavController as navCtrl'
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
                controller: 'NavController as navCtrl'
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
        resolve: {
            data: function (OfficeServiceAPI, $stateParams) {
                return OfficeServiceAPI.getOfficeData($stateParams.companyguid, $stateParams.officeguid).then(function (result) {
                    return {
                        "gridData": result.offices[0].users,
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
                            if($stateParams.parentcompanyguid != "none")
                                view = "appraisalview";
                            return '<a href="#/accounts/company/office/user/'+view+'?companyguid=' + $stateParams.companyguid + '&officeguid=' + $stateParams.officeguid + '&userguid=' + data.userGUID + '">' + data.lastName + ', ' + data.firstName + '</a>';
                        }
                    },
                    {
                        "targets": 1,
                        "title": "Action",
                        "data": null,
                        "orderable": false,
                        "searchable": false,
                        "mRender": function (data, type, row) {
                            var view = "edit";
                            if($stateParams.parentcompanyguid != "none")
                                view = "appraisalview";
                            return '<a href="#/accounts/company/office/user/'+view+'?companyguid=' + $stateParams.companyguid + '&officeguid=' + $stateParams.officeguid + '&userguid=' + data.userGUID + '">Edit</a>&nbsp;|&nbsp;<a href="" class="link-delete" data-entityType="user" data-entityname="' + data.lastName + ' ' + data.firstName + '" data-companyguid="' + $stateParams.companyguid + '" data-officeguid="' + $stateParams.officeguid + '" data-userguid="' + data.userGUID + '">Delete</a>';
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
                controller: 'NavController as navCtrl'
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
            }
        }
    })

    // State to view user
    .state('accountMgmt.user.view', {
        url: '/accounts/company/office/user/view?companyguid&officeguid&userguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavController as navCtrl'
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
            }
        }
    })

    // State to create new user
    .state('accountMgmt.user.new', {
        url: '/accounts/company/office/user/new?companyguid&officeguid',

        views: {
            'navigation@accountMgmt': {
                template: '<span></span>',
                controller: 'NavController as navCtrl'
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
        resolve: {
            data: function () {
                return false;
            }
        }
    })
    
   
    
    .state('accountMgmt.user.appraiserView', {
        url: '/accounts/company/office/user/appraisalview?companyguid&officeguid&userguid',
        views: {
            'navigation@accountMgmt': {
                templateUrl: 'modules/accManagement/views/accountMgmtNavigation.html',
                controller: 'NavController as navCtrl'
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
        resolve: {
            companyData: function (CompanyServiceAPI, $stateParams) {
                    return CompanyServiceAPI.getCompany($stateParams.companyguid);
            }
        }
    })

}]);

AccountMgmt.run(function(editableOptions){
    editableOptions.theme = 'bs3';
});;angular.module('AccountMgmtModule').controller('AppraisalUserController', ['$rootScope', '$scope', '$state', 'UserServiceAPI', 'Upload', '$modal', 'LicenseServiceAPI', '$filter', '$stateParams', '$location', 'InsuranceServiceAPI', 'CoverageAreaServiceAPI', 'UserFormsServiceAPI', '$timeout', 'ListingsAPI', 'geocodeService', 'UsaStates', '$log', 'FileMgmtAPI', function ($rootScope, $scope, $state, UserServiceAPI, Upload, $modal, LicenseServiceAPI, $filter, $stateParams, $location, InsuranceServiceAPI, CoverageAreaServiceAPI, UserFormsServiceAPI, $timeout, ListingsAPI, geocodeService, UsaStates, $log, FileMgmtAPI) {
    var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
    var self = this;
    var AppraisalId = $stateParams.userguid;
    self.AppraisalId = $stateParams.userguid;
    self.companyguid = $stateParams.companyguid;
    self.officeguid = $stateParams.officeguid;
    self.editAppraisalPersonalInfo = false;
    self.designationselected = {};
    self.residentialselected = {};
    self.commericialselected = {};
    self.AppraiserFilesSignature = [];
    self.editAppraiserSelected = {};
    self.InsuranceDetail = {};
    self.InsuranceFileGUID = "";
    self.Userw9FormsDetail = {};
    self.ShowW9Download = false;
    self.DeletelicenseStatus = false;
    self.DeleteAddDocStatus = false;
    self.UpdateAddDocStatus = false;

    self.datePicker = {
        opened: false
    };
    self.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        self.datePicker.opened = true;
    };
    self.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    self.formats = ['MM-dd-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate', 'EEE MMM dd yyyy'];
    self.format = self.formats[4];


    if ($state.current.name == 'accountMgmt.user.appraiserView') {
        displayAppraisal(AppraisalId);
    }

    self.tab = 'PersonalInfo';

    self.selectTab = function (setTab) {
        if (setTab != self.tab) {
            var previousTab = self.tab;
            self.tab = setTab;
            $rootScope.dismissUserMessage();
            $("#" + previousTab + " form").each(function () {
                if (this.name)
                    $rootScope.clearValidationMessages(this.name);
            });
        }
    }

    self.isSelected = function (checkTab) {
        return self.tab === checkTab;
    }

    self.states = UsaStates;
    self.coverageAreaState = "";

    function mapToStateName(stateCode) {
        var stateName = "";
        var mappedState = [];
        mappedState = self.states.filter(function (item) {
            return item.stateCode == stateCode;
        });

        return mappedState.length ? mappedState[0].stateName : "";
    }

    function displayAppraisal(AppraisalId) {
        var promise = UserServiceAPI.getUserInfo(AppraisalId, self.companyguid, self.officeguid);
        promise.then(function (data) {
            var users = data.users;
            for (var index = 0; index < users.length; index++) {
                if (AppraisalId == users[index].userGUID) {
                    self.Appfirstname = users[index].firstName != undefined ? users[index].firstName : "";
                    self.Apptitle = users[index].title != undefined ? users[index].title : "";
                    self.Appmiddlename = users[index].middleInitial != undefined ? users[index].middleInitial : "";
                    self.Applastname = users[index].lastName != undefined ? users[index].lastName : "";

                    if (users[index].directPhone != "" && users[index].directPhone != undefined)
                        self.AppDirectPhone = users[index].directPhone;

                    if (users[index].cellPhone != "" && users[index].cellPhone != undefined)
                        self.AppCellPhone = users[index].cellPhone;

                    self.Appemail = users[index].email != undefined ? users[index].email : "";
                    self.AppofficeEmail = users[index].officeEmail != undefined ? users[index].officeEmail : "";
                    self.Appusername = users[index].userName != undefined ? users[index].userName : "";
                    
                    var signatureFileGUID = users[index].signatureFileCoreFileGUID;
                    self.signatureFileCoreFileGUID = signatureFileGUID;
                    if (signatureFileGUID != "" && signatureFileGUID != undefined) {
                        var promise = FileMgmtAPI.getfiledetails(signatureFileGUID);
                        promise.then(function (DownloadResponse) {
                            if(DownloadResponse.files)
                                self.AppSignatureImage = DownloadResponse.files[0].currentVersionURL;
                        })
                    } else {
                        self.AppSignatureImage = "";
                    }

                    self.AppallowFeeAssignments = users[index].allowFeeAssignments != undefined ? users[index].allowFeeAssignments : "";
                    self.AppallowAppraisalReviews = users[index].allowAppraisalReviews != undefined ? users[index].allowAppraisalReviews : "";
                    self.AppallowEvaluations = users[index].allowEvaluations != undefined ? users[index].allowEvaluations : "";
                    self.AppcertifiedHUDFHA = users[index].certifiedHUDFHA != undefined ? users[index].certifiedHUDFHA : "";
                    self.AppcertifiedVA = users[index].certifiedVA != undefined ? users[index].certifiedVA : "";

                    self.Appdesignations = users[index].designations != undefined ? users[index].designations : "";
                    self.AppAltdesignations = users[index].altDesignations != undefined ? users[index].altDesignations : "";
                    if (self.AppAltdesignations != "") {
                        self.Appdesignations = self.Appdesignations.concat(self.AppAltdesignations);
                    }

                    self.Appexpertise = users[index].expertise != undefined ? users[index].expertise : "";
                }
            }
        });
    }


    self.editAppraisal = function () {
        self.residentialselected = {};
        self.commericialselected = {};
        self.designationselected = {};

        this.editAppraisalPersonalInfo = true;

        //START
        var tempCheckAppraisalDesignations = new Array();
        tempCheckAppraisalDesignations = self.Appdesignations.toString().split(",");

        var tempAppraisalDesignations = new Array();

        var promiseListing = ListingsAPI.getListings('appraisaldesignations,expertiseresidential,expertisecommercial');
        promiseListing.then(function (Listingdata) {

            var AppraisalDesignation = Listingdata.appraisalDesignations;
            for (var indexdesignation = 0; indexdesignation < AppraisalDesignation.length; indexdesignation++) {
                var designationelement = {};
                designationelement.id = AppraisalDesignation[indexdesignation].guid;
                designationelement.designation = AppraisalDesignation[indexdesignation].name;
                tempAppraisalDesignations.push(designationelement);
                designationelement = {};

                for (var indexcd = 0; indexcd < tempCheckAppraisalDesignations.length; indexcd++) {
                    if (AppraisalDesignation[indexdesignation].name == tempCheckAppraisalDesignations[indexcd]) {
                        self.designationselected[AppraisalDesignation[indexdesignation].name] = true;
                    }
                }
            }


            self.AppraisalDesignation = tempAppraisalDesignations;
            self.AlternateDesignations = self.AppAltdesignations;

            //Expertise

            var tempcheckAppraisalExeperise = new Array();
            var tempAppraisalCommercial = new Array();
            var tempAppraisalResidential = new Array();

            tempcheckAppraisalExeperise = self.Appexpertise.toString().split(",");
            for (var indexexpcheck = 0; indexexpcheck < tempcheckAppraisalExeperise.length; indexexpcheck++) {
                if (tempcheckAppraisalExeperise[indexexpcheck].match("Residential-")) {
                    var residentialelement = {};
                    residentialelement.expertise = tempcheckAppraisalExeperise[indexexpcheck].split("Residential-")[1];
                    tempAppraisalResidential.push(residentialelement);
                } else {
                    var commericalelement = {};
                    commericalelement.expertise = tempcheckAppraisalExeperise[indexexpcheck].split("Commercial-")[1];
                    tempAppraisalCommercial.push(commericalelement);
                }
            }


            var AppraisalResidential = [];
            var AppraisalCommercial = [];
            var AppraisalResidentialData = Listingdata.expertiseResidential;
            var AppraisalCommercialData = Listingdata.expertiseCommercial;

            for (var indexexpertiseres = 0; indexexpertiseres < AppraisalResidentialData.length; indexexpertiseres++) {
                var residentialelement = {};
                residentialelement.id = AppraisalResidentialData[indexexpertiseres].guid;
                residentialelement.expertise = AppraisalResidentialData[indexexpertiseres].name;
                AppraisalResidential.push(residentialelement);
                residentialelement = {};

                for (var indexr = 0; indexr < tempAppraisalResidential.length; indexr++) {
                    if (AppraisalResidential[indexexpertiseres].expertise == tempAppraisalResidential[indexr].expertise) {
                        self.residentialselected[AppraisalResidential[indexexpertiseres].expertise] = true;
                    }
                }
            }

            self.AppraisalResidential = AppraisalResidential;


            for (var indexexpertisecom = 0; indexexpertisecom < AppraisalCommercialData.length; indexexpertisecom++) {
                var commercialelement = {};
                commercialelement.id = AppraisalCommercialData[indexexpertisecom].guid;
                commercialelement.expertise = AppraisalCommercialData[indexexpertisecom].name;
                AppraisalCommercial.push(commercialelement);
                commercialelement = {};

                for (var indexc = 0; indexc < tempAppraisalCommercial.length; indexc++) {
                    if (AppraisalCommercial[indexexpertisecom].expertise == tempAppraisalCommercial[indexc].expertise) {
                        self.commericialselected[AppraisalCommercial[indexexpertisecom].expertise] = true;
                    }
                }

            }
            self.AppraisalCommercial = AppraisalCommercial;
            //Expertise End
        });

        //END 

        var promise = UserServiceAPI.getUserInfo(AppraisalId, self.companyguid, self.officeguid);
        promise.then(function (viewdata) {

            var viewappraisal = viewdata.users;
            for (var index = 0; index < viewappraisal.length; index++) {
                if (AppraisalId == viewappraisal[index].userGUID) {

                    self.AppraiserFirstName = viewappraisal[index].firstName != undefined ? viewappraisal[index].firstName : "";

                    self.AppraiserMiddleName = viewappraisal[index].middleInitial != undefined ? viewappraisal[index].middleInitial : "";

                    self.AppraiserLastName = viewappraisal[index].lastName != undefined ? viewappraisal[index].lastName : "";

                    self.AppraiserTitle = viewappraisal[index].title != undefined ? viewappraisal[index].title : "";

                    self.AppraiserDirectPhone = viewappraisal[index].directPhone != undefined ? viewappraisal[index].directPhone : "";

                    self.AppraiserCellPhone = viewappraisal[index].cellPhone != undefined ? viewappraisal[index].cellPhone : "";

                    self.AppraiserEmail = viewappraisal[index].email != undefined ? viewappraisal[index].email : "";

                    self.AppraiserOfficeEmail = viewappraisal[index].officeEmail != undefined ? viewappraisal[index].officeEmail : "";

                    self.AppraiserUserName = viewappraisal[index].userName != undefined ? viewappraisal[index].userName : "";
                    self.AppraiserfeeAssignments = viewappraisal[index].allowFeeAssignments != undefined && viewappraisal[index].allowFeeAssignments != "" ? viewappraisal[index].allowFeeAssignments : false;

                    self.isAppraiserReview = viewappraisal[index].allowAppraisalReviews != undefined && viewappraisal[index].allowAppraisalReviews != "" ? viewappraisal[index].allowAppraisalReviews : false;

                    self.isAppraiserEvaluation = viewappraisal[index].allowEvaluations != undefined && viewappraisal[index].allowEvaluations != "" ? viewappraisal[index].allowEvaluations : false;

                    self.isAppraiserHUDFHACertified = viewappraisal[index].certifiedHUDFHA != undefined && viewappraisal[index].certifiedHUDFHA != "" ? viewappraisal[index].certifiedHUDFHA : false;

                    self.isAppraiserVACertified = viewappraisal[index].certifiedVA != undefined && viewappraisal[index].certifiedVA != "" ? viewappraisal[index].certifiedVA : false;

                }
            }
        });
    }

    self.selectAll = function (type) {
        switch (type) {
        case 'Residential':
            for (var resindex = 0; resindex < self.AppraisalResidential.length; resindex++) {
                var residentialItem = self.AppraisalResidential[resindex];
                self.residentialselected[residentialItem.expertise] = true;
            }
            break;
        case 'Commercial':
            for (var commercialindex = 0; commercialindex < self.AppraisalCommercial.length; commercialindex++) {
                var commericialItem = self.AppraisalCommercial[commercialindex];
                self.commericialselected[commericialItem.expertise] = true;
            }
            break;
        case 'Designation':
            for (var designationindex = 0; designationindex < self.AppraisalDesignation.length; designationindex++) {
                var designationItem = self.AppraisalDesignation[designationindex];
                self.designationselected[designationItem.designation] = true;
            }
            break;
        default:
            //default code block
        }
    }

    self.updateAppraiser = function () {
        if ($scope.formEditAppraiserProfile.$valid) {
            var selectedResidential = [];
            var selectedResidentialValues = [];
            selectedResidential = $.grep(self.AppraisalResidential, function (record) {
                return self.residentialselected[record.expertise];
            });
            for (var indexdres = 0; indexdres < selectedResidential.length; indexdres++) {
                selectedResidentialValues.push("Residential-" + selectedResidential[indexdres].expertise);
            }

            var selectedCommercial = [];
            var selectedCommercialValues = [];
            selectedCommercial = $.grep(self.AppraisalCommercial, function (recordCom) {
                return self.commericialselected[recordCom.expertise];
            });
            for (var indexdcom = 0; indexdcom < selectedCommercial.length; indexdcom++) {
                selectedCommercialValues.push("Commercial-" + selectedCommercial[indexdcom].expertise);
            }
            var expertise = selectedResidentialValues.concat(selectedCommercialValues);

            var selectedDesignations = [];
            var selectedDesignationsValues = [];
            selectedDesignations = $.grep(self.AppraisalDesignation, function (record) {
                return self.designationselected[record.designation];
            });
            for (var indexdesignate = 0; indexdesignate < selectedDesignations.length; indexdesignate++) {
                selectedDesignationsValues.push(selectedDesignations[indexdesignate].designation);
            }

            var user = {
                "user": {
                    "userGUID": AppraisalId,
                    "userName": this.AppraiserUserName != undefined ? this.AppraiserUserName : "",
                    "title": this.AppraiserTitle != undefined ? this.AppraiserTitle : "",
                    "firstName": this.AppraiserFirstName,
                    "middleInitial": this.AppraiserMiddleName != undefined ? this.AppraiserMiddleName : "",
                    "lastName": this.AppraiserLastName,
                    "isEnabled": "",
                    "email": this.AppraiserEmail,
                    "officeEmail": this.AppraiserOfficeEmail,
                    "emailClosing": "",
                    "directPhone": this.AppraiserDirectPhone != undefined ? this.AppraiserDirectPhone : "",
                    "cellPhone": this.AppraiserCellPhone != undefined ? this.AppraiserCellPhone : "",
                    "qualificationsFileDisplayName": "",
                    "qualificationsFileCoreFileGUID": "",
                    "signatureFileDisplayName": "",
                    "signatureFileCoreFileGUID": "",
                    "isEnvProfessional": true,
                    "allowAdminsToSign": true,
                    "allowFeeAssignments": this.AppraiserfeeAssignments,
                    "allowAppraisalReviews": this.isAppraiserReview,
                    "allowEvaluations": this.isAppraiserEvaluation,
                    "certifiedHUDFHA": this.isAppraiserHUDFHACertified,
                    "certifiedVA": this.isAppraiserVACertified,
                    "designations": selectedDesignationsValues,
                    "expertise": expertise,
                    /*"altDesignations": self.AlternateDesignations,*/
                    "office": {
                        "companyOfficeGUID": $stateParams.officeguid
                    }
                }
            }
            var promise = UserServiceAPI.updateuser(AppraisalId, user); //updateappraiseruser(AppraisalId, user);
            promise.then(function (data) {
                var params = {
                    companyguid: $stateParams.companyguid,
                    officeguid: $stateParams.officeguid
                };
                $state.go('accountMgmt.user.list', params);
            })

        } else {
            var inputElements = document.getElementsByName($scope.formEditAppraiserProfile.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.CancelAppraiserUpdate = function () {
        this.editAppraisalPersonalInfo = false;
    }


    self.IncorrectFormat = false;
    self.isSignatureUpload = false;

    self.uploadFile = function (name) {
        if (name == 'signature') {
            var file = self.Signaturefile;
            self.IncorrectFormat = "";
            self.isSignatureUpload = false;
            self.uploadSuccessMsgSignature = false;
            if (!file || file == null) {
                self.IncorrectFormat = "Please attach files before trying to upload.";
                return;
            } else {
                    var basePath = "/Accounts/Users/"+self.AppraisalId;
                    var promise = FileMgmtAPI.uploadFile(file,'DISABLE',self.AppraisalId,basePath,"Signature",self.signatureFileCoreFileGUID);
                    promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function(data,status, headers, config){
                        if (data) {
                            self.uploadSuccessMsgSignature = true;
                            self.AppSignatureImage = data.file.currentVersionURL;
                            $timeout(function () {
                                self.callAtTimeout("uploadSuccessMsgSignature");
                            }, 3000);
                        }
                    }),
                    promise.error(function(data, status, headers, config){
                        self.IncorrectFormat = "Sorry. We encountered a problem while processing your request. Please try again.";
                        self.isSignatureUpload = true;
                        if(data.message)
                            self.IncorrectFormat = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
        }
    }


    self.checkFile = function (file, invalidFiles, form) {
        if (invalidFiles.length > 0) {
            var msg = '';
            switch (invalidFiles[0].$error.toLowerCase()) {
            case "pattern":
                msg = 'File format is incorrect';
                break;
            case "maxsize":
            case "maxtotalsize":
                msg = 'Image size is incorrect';
                break;
            case "ratio":
                msg = 'Image aspect ratio is incorrect'
                break;
            }
            self.IncorrectFormat = msg;
            self.isSignatureUpload = true;
        } else {
            self.IncorrectFormat = "";
            self.isSignatureUpload = false;
            self.uploadSuccessMsgSignature = false;
        }
    }



    self.getAllAdditionalDocuments = function () {
        var AppraisalId = $stateParams.userguid;
        var promise = UserFormsServiceAPI.getUserAdditionalDocuments(AppraisalId);
        promise.then(function (RespAdditionalDocuments) {
            console.log(RespAdditionalDocuments);
            var tempAdditionDocArray = [];
            for (var index = 0; index < RespAdditionalDocuments.forms.length; index++) {
                if (RespAdditionalDocuments.forms[index].formType == "additionaldoc") {

                    var element = {};

                    element.AddDocFileName = RespAdditionalDocuments.forms[index].fileName;
                    element.AddDocFileDescription = RespAdditionalDocuments.forms[index].fileDescription;
                    element.AddDocformCoreFileGUID = RespAdditionalDocuments.forms[index].formCoreFileGUID;
                    element.userFormGUID = RespAdditionalDocuments.forms[index].userFormGUID;

                    element.AddDocformType = RespAdditionalDocuments.forms[index].formType;

                    var formCoreFileGUID = RespAdditionalDocuments.forms[index].formCoreFileGUID;
                    if (formCoreFileGUID != "" && formCoreFileGUID != undefined) {
                        var promise = FileMgmtAPI.getfiledetails(formCoreFileGUID);
                        promise.then(function (DownloadResponse) {
                            if(DownloadResponse.files)
                                element.filePath = DownloadResponse.files[0].currentVersionURL;
                        })
                    } else {
                        element.filePath = "";
                    }

                    //element.filePath = RespAdditionalDocuments.forms[index].filePath;

                    tempAdditionDocArray.push(element);
                    element = {};
                }
            }
            self.AdditionDocuments = tempAdditionDocArray;
        })

    }

    $scope.openDeleteAddDoc = function (userFormGUID, FileNameConfirmation) {
        //$scope.userFormAddDocDeleteFileName = FileNameConfirmation;
        $scope.DeleteAddDocuserFormGUID = userFormGUID;
        var modalInstance = $modal.open({
            templateUrl: "DeleteAddDocTemplate.html",
            scope: $scope,
            controller: deleteAddDocController,
            size: 0,
            resolve: {
                FileName: function () {
                    return FileNameConfirmation;
                }
            }
        });
    }

    function deleteAddDocController($scope, $modalInstance, FileName) {
        $scope.DeleteAddDocuserFormGUID;
        $scope.userFormAddDocDeleteFileName = FileName;

        $scope.deleteAdditionalDocument = function () {

            var userGUID = $stateParams.userguid;
            var formGUID = $scope.DeleteAddDocuserFormGUID;

            var promise = UserFormsServiceAPI.deleteadditionaldocument(userGUID, formGUID);
            promise.then(function (AddDocdata) {
                self.getAllAdditionalDocuments();
                $modalInstance.close();
                self.DeleteAddDocStatus = true;
                $timeout(function () {
                    self.callAtTimeout("DeleteAddDocStatus");
                }, 3000);
            });
        }

        $scope.CancelAdditionalDocumentDelete = function () {

            $modalInstance.close();
        }
    }


    self.SelectedAdditionDoc = {};

    self.getAddDocTemplate = function (AddDoc) {
        if (AddDoc.userFormGUID === self.SelectedAdditionDoc.userFormGUID) return 'edit';
        else return 'display';
    };

    self.editAditionalDocument = function (AddDocument) {
        self.SelectedAdditionDoc = angular.copy(AddDocument);
    };

    self.UpdateAdditionalDocument = function () {
        var dataObj = {
            "form": {
                "userFormGUID": self.SelectedAdditionDoc.userFormGUID,
                "userGUID": $stateParams.userguid,
                "formType": self.SelectedAdditionDoc.AddDocformType,
                "formCoreFileGUID": self.SelectedAdditionDoc.AddDocformCoreFileGUID,
                "isEnabled": true,
                "fileName": self.SelectedAdditionDoc.AddDocFileName,
                "fileDescription": self.SelectedAdditionDoc.AddDocFileDescription
            }
        }
        var promise = UserFormsServiceAPI.updateadditionaldocument($stateParams.userguid, self.SelectedAdditionDoc.userFormGUID, dataObj);
        promise.then(function (RespUpdateDoc) {
            self.getAllAdditionalDocuments();
            self.UpdateAddDocStatus = true;
            $timeout(function () {
                self.callAtTimeout("UpdateAddDocStatus");
            }, 3000);
        });
        self.SelectedAdditionDoc = {};
    }


    self.getUserw9Forms = function () {
        var AppraisalId = $stateParams.userguid;
        var promise = UserFormsServiceAPI.getuserw9form(AppraisalId);
        promise.then(function (RespW9Form) {

            for (var index = 0; index < RespW9Form.forms.length; index++) {

                var formtype = RespW9Form.forms[index].formType;
                if (formtype == "w9") {

                    var IsfileExist = RespW9Form.forms[index].filePath;
                    if (IsfileExist != "") {
                        self.ShowW9Download = true;
                    }

                    var userformCoreFileGUID = RespW9Form.forms[index].formCoreFileGUID;
                    if (userformCoreFileGUID != "" && userformCoreFileGUID != undefined) {
                        var promise = FileMgmtAPI.getfiledetails(userformCoreFileGUID);
                        promise.then(function (DownloadResponse) {
                            if(DownloadResponse.files)
                                self.W9DownloadUrl = DownloadResponse.files[0].currentVersionURL;
                        })
                    } else {
                        self.W9DownloadUrl = "";
                    }
                    //self.W9DownloadUrl = RespW9Form.forms[index].filePath;

                    self.Userw9FormsDetail = RespW9Form.forms[index];
                }
            }
        });
    }

    self.DeleteFile = function (type) {
        var AppraisalId = $stateParams.userguid;
        var w9formGuid = self.Userw9FormsDetail.userFormGUID;

        switch (type) {
        case 'w9':
            var promise = UserFormsServiceAPI.deleteuserw9form(AppraisalId, w9formGuid);
            promise.then(function (RespW3Form) {
                self.deletew9formStatus = true;
            });
            break;

        default:

        }
    }

    self.IncorrectLicenseFormat = '';
    self.uploadLicenseSuccessMsg = false;

    self.uploadFilesOneSelect = function (filetype, file, errFiles) {
        switch (filetype) {
        case 'license':
            self.IncorrectLicenseFormat = "";
            if (errFiles.length > 0) {
                switch (errFiles[0].$error.toLowerCase()) {
                case "pattern":
                    msg = 'File format is incorrect';
                    break;
                }
                self.IncorrectLicenseFormat = msg;
            }

            if (file) {                
                var basePath = "/Accounts/Users/"+self.AppraisalId;
                    var promise = FileMgmtAPI.uploadFile(file,'DISABLE',self.AppraisalId,basePath,"License");
                    promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function(data,status, headers, config){
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {                            
                            /*self.uploadLicenseSuccessMsg = true;
                            $timeout(function () {
                                self.callAtTimeout("uploadLicenseSuccessMsg");
                            }, 3000);*/
                        }
                    }),
                    promise.error(function(data, status, headers, config){
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if(data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })   
            }
            break;

        case 'insurance':
            if (file) {                
                var basePath = "/Accounts/Users/"+self.AppraisalId;
                    var promise = FileMgmtAPI.uploadFile(file,'DISABLE',self.AppraisalId,basePath,"Insurance");
                    promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function(data,status, headers, config){
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {                            
                            /*self.UploadfileInsuranceStatus = true;
                            $timeout(function () {
                                self.callAtTimeout("UploadfileInsuranceStatus");
                            }, 3000);*/
                            self.InsuranceFileGUID = data.file.fileGUID;
                        }
                    }),
                    promise.error(function(data, status, headers, config){
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if(data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
            break;

        case 'w-9':
            if (file) {                
                var basePath = "/Accounts/Users/"+self.AppraisalId;
                    var promise = FileMgmtAPI.uploadFile(file,'DISABLE',self.AppraisalId,basePath,"W9");
                    promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function(data,status, headers, config){
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {
                            console.log(UploadResponse.data.file);
                            self.W9DownloadUrl = data.file.currentVersionURL;
                            self.getUserw9Forms();
                        }
                        self.ShowW9Download = true;
                    }),
                    promise.error(function(data, status, headers, config){
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if(data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
            break;

        case 'AdditionalDocument':
            if (file) {      
                var basePath = "/Accounts/Users/"+self.AppraisalId;
                    var promise = FileMgmtAPI.uploadFile(file,'DISABLE',self.AppraisalId,basePath,"AdditionalDocument");
                    promise.progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }),
                    promise.success(function(data,status, headers, config){
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "File Uploaded Successfully";
                        if (data) {
                            var createAddDoc = {
                                "form": {
                                    "userGUID": $stateParams.userguid,
                                    "formType": "additionaldocs",
                                    "formCoreFileGUID": data.file.fileGUID,
                                    "isEnabled": true,
                                    "fileName": data.file.fileName,
                                    "fileDescription": data.file.fileDescription
                                }
                            }
                            var promiseForms = UserFormsServiceAPI.createuserform($stateParams.userguid, createAddDoc);
                            promiseForms.then(function (Formsdata) {
                                self.getAllAdditionalDocuments();
                            });
                        }                       
                    }),
                    promise.error(function(data, status, headers, config){
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if(data.message)
                            $rootScope.userMessage = data.message.userMessage;
                        accessMgmtFactoryLogger.error(config);
                    })
            }
            break;

        default:
            //default code block
        }
    }


    //********************** Appraisal Licenses **********************//

    $scope.$watchCollection('[AppraisalUserCtrl.DisplayAddLicense]', function (newValues, oldValues) {
        if (newValues[0] != oldValues[0] && !newValues[0])
            $rootScope.clearValidationMessages('AddLicenseForm');
    });

    self.getAppraiserLicense = function () {
        var AppraisalId = $stateParams.userguid;
        self.AppraisalLicenseInfo = null;
        var licenseElement = {};
        var licenseArray = [];

        var promise = LicenseServiceAPI.getuserlicense(AppraisalId);
        return promise.then(function (Licesdedata) {
            var viewlicense = Licesdedata.licenses;
            for (var index = 0; index < viewlicense.length; index++) {
                if (AppraisalId.toLowerCase() == viewlicense[index].userGUID.toLowerCase()) {
                    licenseElement.userGUID = viewlicense[index].userGUID;
                    licenseElement.licenseState = mapToStateName(viewlicense[index].licenseState);
                    licenseElement.licenseNumber = viewlicense[index].licenseNumber;
                    licenseElement.expirationDate = $filter('setDateFormat')(viewlicense[index].expirationDate, "MM-dd-yyyy");

                    var licensePath = viewlicense[index].licenseFilePath;
                    if (licensePath != "" && licensePath != undefined)
                        licenseElement.licenseFilePath = viewlicense[index].licenseFilePath;
                    else
                        licenseElement.licenseFilePath = false;

                    licenseElement.licenseType = viewlicense[index].licenseType;
                    licenseElement.status = viewlicense[index].status;
                    licenseElement.isVerified = viewlicense[index].isVerified;
                    licenseElement.userLicenseGUID = viewlicense[index].userLicenseGUID;
                    licenseArray.push(licenseElement);
                    licenseElement = {};
                }
            }
            self.AppraisalLicenseInfo = licenseArray;
        });
    }
    self.getAppraiserLicense();

    $scope.openDeleteLicense = function (license) {
        $scope.DeleteSpecificLicense = license;
        var modalInstance = $modal.open({
            templateUrl: "DeleteLicenseTemplate.html",
            scope: $scope,
            controller: deleteLicenseController,
            size: 0
        });
    }

    var deleteLicenseController = function ($scope, $modalInstance) {
        $scope.DeleteSpecificLicense;

        $scope.deleteLicense = function () {
            var userGUID = $scope.DeleteSpecificLicense.userGUID;
            var licenseGUID = $scope.DeleteSpecificLicense.userLicenseGUID;
            var promise = LicenseServiceAPI.deleteuserlicense(userGUID, licenseGUID);
            promise.then(function (response) {
                $modalInstance.close();
                if (response.data) {
                    $rootScope.alertClass = "alert-danger";
                    $rootScope.userMessage = "Error: Failed to delete License. " + response.data.message.userMessage;
                } else {
                    self.getAppraiserLicense();
                    $rootScope.alertClass = "alert-success";
                    $rootScope.userMessage = "The appraisal license has been deleted.";
                }
            });
        }

        $scope.CancelLicenseDelete = function () {
            $modalInstance.close();
        }
    }


    self.getTemplate = function (ApplicenseObj) {
        if (ApplicenseObj.userLicenseGUID === self.editAppraiserSelected.userLicenseGUID) {
            return 'editLicense';
        } else return 'displayLicense';

    };

    self.AppraiserLicenseReset = function () {
        self.editAppraiserSelected = {};
    }


    self.editAppraiserLicense = function (ApplicenseObj) {
        self.editAppraiserSelected = angular.copy(ApplicenseObj);
    }

    self.verifyAndSaveLicense = function (actionType, userLicenseGUID, form) {
        if (form.$valid) {
            var selectedLicenseState = self.selectStateUpdateLicense;
            var LicenseNumber = self.AddlicenseNumber;
            var AppraisalUserId = $stateParams.userguid;
            self.licenseVerifiedData = {};

            var VerifyLicenseData = {
                "licenseVerifications": [{
                    "userLicenseGUID": LicenseNumber
                }]
            };

            var promise = LicenseServiceAPI.verifyUserLicense(VerifyLicenseData, AppraisalUserId, LicenseNumber);
            promise.then(function (licenseVerifiedData) {
                if (licenseVerifiedData.data) {
                    if (licenseVerifiedData.data.licenseVerifications == null) {
                        $rootScope.userMessage = "Error: Failed to verify the Appraisal license. " + licenseVerifiedData.data.message.userMessage;
                        $rootScope.alertClass = "alert-danger";
                    }
                } else {
                    self.licenseVerifiedData = licenseVerifiedData.licenseVerifications[0];
                    var newLicenseData = {
                        "license": {
                            "userGUID": AppraisalUserId,
                            "licenseState": selectedLicenseState,
                            "licenseNumber": LicenseNumber,
                            "expirationDate": "2015-07-22",
                            "licenseType": "",
                            "status": "",
                            "licenseFileCoreFileGUID": "",
                            "isVerified": true
                        }
                    }

                    if (actionType) {
                        switch (actionType) {
                        case 'add':
                            var promise = LicenseServiceAPI.createUserLicense(AppraisalUserId, newLicenseData);
                            promise.then(function (licenseData) {
                                if (!self.licenseVerifiedData.isVerified) {
                                    $rootScope.userMessage = "Appraisal license could not be verified with the Appraisal Subcommittee (ASC.gov); please re-type your license number EXACTLY as it appears on your appraiser license.";
                                    $rootScope.alertClass = "alert-danger";
                                } else if (licenseVerifiedData.data) {
                                    if (licenseVerifiedData.data.license == null) {
                                        $rootScope.userMessage = "Error: Failed to add new Appraisal license. " + licenseVerifiedData.data.message.userMessage;
                                        $rootScope.alertClass = "alert-danger";
                                    }
                                } else {
                                    $rootScope.userMessage = "Appraisal license has been verified and saved.";
                                    $rootScope.alertClass = "alert-success";
                                }
                                self.getAppraiserLicense();
                                self.editAppraiserLicense({});
                                self.cancelAddLicense();
                            });
                            break;
                        case 'update':
                            var promise = LicenseServiceAPI.updateUserLicense(AppraisalUserId, userLicenseGUID, newLicenseData);
                            promise.then(function (Licensedata) {
                                if (!self.licenseVerifiedData.isVerified) {
                                    $rootScope.userMessage = "Appraisal license could not be verified with the Appraisal Subcommittee (ASC.gov); please re-type your license number EXACTLY as it appears on your appraiser license.";
                                    $rootScope.alertClass = "alert-danger";
                                } else if (licenseVerifiedData.data) {
                                    if (licenseVerifiedData.data.license == null) {
                                        $rootScope.userMessage = "Error: Failed to update Appraisal license. " + licenseVerifiedData.data.message.userMessage;
                                        $rootScope.alertClass = "alert-danger";
                                    }
                                } else {
                                    $rootScope.userMessage = "Appraisal license has been verified and saved.";
                                    $rootScope.alertClass = "alert-success";
                                }
                                self.getAppraiserLicense();
                                self.editAppraiserSelected = {};
                            });
                        }
                    }
                }
            });
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.cancelAddLicense = function () {
            self.DisplayAddLicense = false;
            self.selectStateUpdateLicense = "";
            self.AddlicenseNumber = "";
        }
        //********************** Appraisal Licenses End **********************//



    self.IsCreateInsurance = "";
    self.InsuranceDetail = {};
    self.InsuranceDetailUpdate = {};

    self.getuserInsurance = function () {
        var AppraiserID = $stateParams.userguid;

        var promise = InsuranceServiceAPI.getuserinsurance(AppraiserID);
        return promise.then(function (InsuranceResponseData) {
            if (InsuranceResponseData.insurances.length > 0) {
                self.IsCreateInsurance = false;
            } else {
                self.IsCreateInsurance = true;
            }

            var InsuranceData = InsuranceResponseData.insurances;

            if (InsuranceData.length > 0) {


                self.InsuranceDetail.amount = InsuranceData[0].amount !== undefined ? '$' + InsuranceData[0].amount : "";
                self.InsuranceDetail.carrier = InsuranceData[0].carrier != undefined ? InsuranceData[0].carrier : "";
                self.InsuranceDetail.expirationDate = InsuranceData[0].expirationDate != undefined ? $filter('setDateFormat')(InsuranceData[0].expirationDate, "MM/dd/yyyy") : "";

                if (InsuranceData[0].insuranceDocumentFilePath == "") {
                    self.InsuranceDetail.insuranceDocumentFilePath = "(Not Uploaded)";
                    self.InsuranceDetail.IsInsuranceFile = false;
                } else {
                    self.InsuranceDetail.insuranceDocumentFilePath = InsuranceData[0].insuranceDocumentFilePath;
                    self.InsuranceDetail.IsInsuranceFile = true;
                }

                self.InsuranceDetail.userInsuranceGUID = InsuranceData[0].userInsuranceGUID;
                self.InsuranceDetail.insuranceDocumentCoreFileGUID = InsuranceData[0].insuranceDocumentCoreFileGUID;

            }
        });
    }

    self.editInsurance = function () {

        /* self.InsuranceDetail.expirationDate = InsuranceDetail[0].expirationDate != undefined ?$filter('setDateFormat')(self.InsuranceDetail.expirationDate, "EEE MMM dd yyyy") : "";*/

        self.InsuranceDetailUpdate.carrier = self.InsuranceDetail.carrier;
        self.InsuranceDetailUpdate.amount = self.InsuranceDetail.amount;
        self.InsuranceDetailUpdate.expirationDate = self.InsuranceDetail.expirationDate !== undefined ? $filter('setDateFormat')(self.InsuranceDetail.expirationDate, "EEE MMM dd yyyy") : "";
    }

    self.InsuranceUpdateSuccessMsg = false;

    self.updateInsurance = function () {

        var AppraiserID = $stateParams.userguid;
        var isnuranceGUID = self.InsuranceDetail.userInsuranceGUID;

        var insuranceData = {
            "insurance": {
                "userInsuranceGUID": self.InsuranceDetail.userInsuranceGUID,
                "userGUID": AppraiserID,
                "carrier": self.InsuranceDetailUpdate.carrier,
                "amount": self.InsuranceDetailUpdate.amount,
                "expirationDate": self.InsuranceDetailUpdate.expirationDate,
                "insuranceDocumentCoreFileGUID": self.InsuranceFileGUID
            }
        }



        if (self.IsCreateInsurance) {

            var promiseCreate = InsuranceServiceAPI.createuserinsurance(AppraiserID, insuranceData);
            promiseCreate.then(function (insuranceResponse) {
                self.InsuranceUpdateSuccessMsg = true;
                self.InsuranceUpdateSuccessMsgText = "Insurance has been created Successfully";
                self.viewInsurancePolicy = true;
                self.InsuranceDetail.expirationDate = $filter('setDateFormat')(self.InsuranceDetail.expirationDate, "MM/dd/yyyy");
                self.getuserInsurance();
                $timeout(function () {
                    self.callAtTimeout("InsuranceUpdateSuccessMsg");
                }, 3000);
            })

        } else {

            var promise = InsuranceServiceAPI.updateuserinsurance(AppraiserID, isnuranceGUID, insuranceData);
            promise.then(function (insuranceResponse) {
                self.InsuranceUpdateSuccessMsg = true;
                self.InsuranceUpdateSuccessMsgText = "Insurance has been updated Successfully";
                self.viewInsurancePolicy = true;
                self.InsuranceDetail.expirationDate = $filter('setDateFormat')(self.InsuranceDetail.expirationDate, "MM/dd/yyyy");
                self.getuserInsurance();
                $timeout(function () {
                    self.callAtTimeout("InsuranceUpdateSuccessMsg");
                }, 3000);
            });
        }

    }

    self.resetInsurance = function () {

    }

    $scope.openDeleteInsurance = function () {

        var modalInstance = $modal.open({
            templateUrl: "DeleteInsuranceTemplate.html",
            scope: $scope,
            controller: deleteInsuranceController,
            size: 0
        })
    }

    var deleteInsuranceController = function ($scope, $modalInstance) {
        $scope.deleteInsurance = function () {
            var AppraiserID = $stateParams.userguid;
            var insuranceGUID = self.InsuranceDetail.userInsuranceGUID;

            /*var promise = InsuranceServiceAPI.deleteuserinsurance(AppraiserID,insuranceGUID);
               promise.then(function (deleteInsurancedata) {                                      
                   $modalInstance.close();
                   self.getuserInsurance();
                   self.DeleteInsuranceStatus = true;
                   $timeout( function(){ self.callAtTimeout("DeleteInsuranceStatus"); }, 3000);
               })  */

            var fileGUID = self.InsuranceDetail.insuranceDocumentCoreFileGUID;
            var promise = FileMgmtAPI.deleteFile(fileGUID);
            promise.then(function (deleteInsurancedata) {
                $modalInstance.close();
                self.getuserInsurance();
                self.DeleteInsuranceStatus = true;
                $timeout(function () {
                    self.callAtTimeout("DeleteInsuranceStatus");
                }, 3000);
            });
        }

        $scope.CancelInsuranceDelete = function () {

            $modalInstance.close();
        }
    }




    //********************** Coverage Area **********************//
    self.invalidCounty = false;
    self.isNationwide = false;
    $scope.$watchCollection('[AppraisalUserCtrl.AddToCoverageArea]', function (newValues, oldValues) {
        if (newValues[0] != oldValues[0] && !newValues[0])
            $rootScope.clearValidationMessages('formAppraiserAddCoverageArea');
    });

    function getSelectedStateCoverage() {
        var i = 0;
        return self.AllCoverageArea.filter(function (item) {
            return item.stateCode == self.coverageAreaState;
        });
    }

    self.countyOnSelect = function () {
        if (self.coverageAreaCountiesSelected) {
            $("#coverageAreaCounties_chosen").find(".chosen-choices").css('border-color', '');
            self.invalidCounty = false;
        }
    }

    self.getAllCoverageArea = function () {
        self.AllCoverageArea = [];
        var AppraiserID = $stateParams.userguid;
        var promise = CoverageAreaServiceAPI.getUserCoverageArea(AppraiserID);
        return promise.then(function (CAResponseData) {
            var CoverageAreaData = CAResponseData.coverageAreas;
            var elementCA = {};
            angular.forEach(CoverageAreaData, function (CAData) {
                elementCA = {};
                if (CAData.state == "ALL") {
                    elementCA.state = "Nationwide";
                    self.isNationwide = true;
                } else {
                    elementCA.state = mapToStateName(CAData.state);
                }
                elementCA.stateCode = (CAData.state == "ALL") ? "0" : CAData.state;
                elementCA.county = (CAData.state == "ALL" || CAData.county == "ALL") ? "All Counties" : CAData.county;
                elementCA.countyCode = (CAData.county == "ALL") ? "0" : CAData.county;
                elementCA.userCoverageAreaGUID = CAData.userCoverageAreaGUID;
                self.AllCoverageArea.push(elementCA);
            });
        });
    }


    $scope.openDeleteCoverageArea = function (userCoverageAreaGUID, stateCode) {
        $scope.userCoverageAreaGUIDDelete = userCoverageAreaGUID;
        $scope.coverageStateCodeToDelete = stateCode;

        var modalInstance = $modal.open({
            templateUrl: "DeleteCoverageAreaTemplate.html",
            scope: $scope,
            controller: deleteCoverageAreaController,
            size: 0
        });
    }

    var deleteCoverageAreaController = function ($scope, $modalInstance) {
        $scope.deleteCoverageArea = function () {
            var userGUID = $stateParams.userguid;
            var userCoverageAreaGUID = $scope.userCoverageAreaGUIDDelete;

            var promise = CoverageAreaServiceAPI.deleteCoverageArea(userGUID, userCoverageAreaGUID);
            promise.then(function (response) {
                $modalInstance.close();
                if (response.data) {
                    $rootScope.alertClass = "alert-danger";
                    $rootScope.userMessage = "Error: Failed to delete coverage area. " + response.data.message.userMessage;
                } else {
                    if ($scope.coverageStateCodeToDelete == "0")
                        self.isNationwide = false;

                    self.getAllCoverageArea();
                    $rootScope.alertClass = "alert-success";
                    $rootScope.userMessage = "The coverage entry was deleted.";
                }
            });
        }

        $scope.CancelCoverageAreaDelete = function () {
            $modalInstance.close();
        }
    }

    self.getCountiesByState = function () {
        document.getElementById("coverageAreaCounties").disabled = true;
        self.coverageAreaCountiesSelected = [];
        self.CountiesByState = [];
        if (self.coverageAreaState !== undefined && self.coverageAreaState !== "ALL") {
            var promise = geocodeService.getCounties('US', self.coverageAreaState);
            var allCountiesOption = {
                "countyName": "(All Counties)",
                "stateCode": "ALL",
                "fips": ""
            }
            promise.then(function (dataCounties) {
                document.getElementById("coverageAreaCounties").disabled = false;
                self.CountiesByState = dataCounties.counties;
                self.CountiesByState.push(allCountiesOption);

                // applying timeout to wait till counties gets append to view
                $timeout(function () {
                    var i = 0;
                    var selectedStateCounties = getSelectedStateCoverage();

                    $("#coverageAreaCounties").find("option").each(function () {
                        for (i = 0; i < selectedStateCounties.length; i++) {
                            if (selectedStateCounties[i].county.toLowerCase() == this.innerText.toLowerCase()) {
                                $(this).addClass('result-selected');
                                $(this).prop('disabled', true);
                                break;
                            }
                        }
                    });
                    $('#coverageAreaCounties').trigger('chosen:updated')
                });
            });
        }
    }

    self.AddCoverageArea = function () {
        if ($scope.formAppraiserAddCoverageArea.$valid) {
            var AppraiserID = $stateParams.userguid;
            var SelectedCovrageArea = [];
            var objCountyName = {};
            var selectedStateCounties = getSelectedStateCoverage();
            var i = 0;
            if (self.coverageAreaState == 'ALL') {
                objCountyName.state = self.coverageAreaState;
                objCountyName.county = "ALL";
                SelectedCovrageArea.push(objCountyName);
            } else {
                for (var index = 0; index < self.coverageAreaCountiesSelected.length; index++) {
                    objCountyName = {};
                    objCountyName.state = self.coverageAreaState;
                    objCountyName.county = (self.coverageAreaCountiesSelected[index].countyName.toLowerCase() == "(all counties)") ? "ALL" : self.coverageAreaCountiesSelected[index].countyName;
                    SelectedCovrageArea.push(objCountyName);

                    //Preventing coverage county to make duplicate entry if county is already added as coverage area for selected state.
                    for (i = 0; i < selectedStateCounties.length; i++) {
                        if (selectedStateCounties[i].county.toLowerCase() == self.coverageAreaCountiesSelected[index].countyName.toLowerCase()) {
                            SelectedCovrageArea.pop();
                            break;
                        }
                    }
                }
            }

            if (SelectedCovrageArea.length) {
                var promise = CoverageAreaServiceAPI.createUserCoverageArea(AppraiserID, {
                    "coverageAreas": SelectedCovrageArea
                });

                promise.then(function (coverageAreadata) {
                    if (coverageAreadata.coverageAreas == null) {
                        $rootScope.alertClass = "alert-danger";
                        $rootScope.userMessage = "Error: Failed to add new coverage area. " + coverageAreadata.data.message.userMessage;
                    } else {
                        self.getAllCoverageArea();
                        self.cancelAddCoverageArea();
                        $rootScope.alertClass = "alert-success";
                        $rootScope.userMessage = "New coverage area has been added successfully.";
                    }
                });
            } else {
                $rootScope.alertClass = "alert-danger";
                $rootScope.userMessage = "Error: Duplicate entry found.";
            }
        } else {
            if ($scope.formAppraiserAddCoverageArea.coverageAreaCounties) {
                $("#coverageAreaCounties_chosen").find(".chosen-choices").css('border-color', '#8e1d14');
                self.invalidCounty = true;
            }
            var inputElements = document.getElementsByName("formAppraiserAddCoverageArea");
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.cancelAddCoverageArea = function () {
        self.AddToCoverageArea = false;
        self.CountiesByState = [];
        self.coverageAreaState = "";
        document.getElementById("coverageAreaCounties").disabled = true;
        $("#coverageAreaCounties_chosen").find(".chosen-choices").css('border-color', '');
        self.invalidCounty = false;
    }

    //********************** Coverage Area End **********************//

    self.callAtTimeout = function (Type) {
        switch (Type) {
        case 'AddCAFail':
            if (self.AddCoverageAreaStatus == true) {
                self.AddCoverageAreaStatus = false;
            }
            break;

        case 'AddCASuccess':
            if (self.CreateCoverageAreaStatus == true) {
                self.CreateCoverageAreaStatus = false;
            }
            break;

        case 'DeleteInsuranceStatus':
            if (self.DeleteInsuranceStatus == true) {
                self.DeleteInsuranceStatus = false;
            }
            break;

        case 'UploadfileInsuranceStatus':
            if (self.UploadfileInsuranceStatus == true) {
                self.UploadfileInsuranceStatus = false;
            }
            break;

        case 'DeletelicenseStatus':
            if (self.DeletelicenseStatus == true) {
                self.DeletelicenseStatus = false;
            }
            break;

        case 'LicenseCreatedStatus':
            if (self.LicenseCreatedStatus == true) {
                self.LicenseCreatedStatus = false;
            }
            break;

        case 'uploadLicenseSuccessMsg':
            if (self.uploadLicenseSuccessMsg == true) {
                self.uploadLicenseSuccessMsg = false;
            }
            break;

        case 'UpdatelicenseStatus':
            if (self.UpdatelicenseStatus == true) {
                self.UpdatelicenseStatus = false;
            }
            break;
        case 'DeleteAddDocStatus':
            if (self.DeleteAddDocStatus == true) {
                self.DeleteAddDocStatus = false;
            }
            break;
        case 'UpdateAddDocStatus':
            if (self.UpdateAddDocStatus == true) {
                self.UpdateAddDocStatus = false;
            }
            break;

        case 'IsChangePasswordFailed':
            if (self.IsChangePasswordFailed == true) {
                self.IsChangePasswordFailed = false;
            }
            break;

        case 'uploadSuccessMsgSignature':
            if (self.uploadSuccessMsgSignature == true) {
                self.uploadSuccessMsgSignature = false;
            }
            break;

        case 'InsuranceUpdateSuccessMsg':
            if (self.InsuranceUpdateSuccessMsg == true) {
                self.InsuranceUpdateSuccessMsg = false;
            }
            break;

        default:
        }
    }

    self.ResetPassword = function () {

        var AppraiserID = $stateParams.userguid;
        var oldpassword = this.oldPassword;
        var newPassword = this.newPassword;
        var Retypepassword = this.retype;

        if ($scope.AppraiserChangePassword.$valid) {
            if (newPassword != Retypepassword) {
                self.IsChangePasswordFailed = true;
                self.ErrorMessage = "New Password and Repeat Password should be same";
                $timeout(function () {
                    self.callAtTimeout("IsChangePasswordFailed");
                }, 3000);
                return; // this.ErrorMessage;
            }

            var PasswordData = {
                "userAuthenitication": {
                    "password": newPassword
                }
            }
            var promise = UserServiceAPI.ChangePassword(AppraiserID, PasswordData);
            promise.then(function (data) {
                //$state.go('accountMgmt.user.list');
                console.log("Password changed successfully");
            });

        } else {
            var inputElements = document.getElementsByName($scope.AppraiserChangePassword.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.CancelAppraiserChangePassword = function () {
        var params = {
            companyguid: $stateParams.companyguid,
            officeguid: $stateParams.officeguid,
            userguid: $stateParams.userguid
        };
        $state.go('accountMgmt.user.appraiserView', params);
    }

    $timeout(function () {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    });
}]);

angular.module('AccountMgmtModule').filter('setDateFormat', function ($filter) {
    return function (input, format) {
        if (input == null) {
            return "";
        }
        var _date = $filter('date')(new Date(input), format);
        return _date.toUpperCase();

    };
});;angular.module('AccountMgmtModule').controller('CreateCompanyCtrl', ['$rootScope', '$scope', 'companyData', '$compile', '$state', '$location', '$timeout', '$log', 'Upload', 'CompanyServiceAPI', '$modal', '$q', '$filter', 'listingTypes', 'UserServiceAPI', 'companyTemplates','FileMgmtAPI', function ($rootScope, $scope, existingCompanyData, $compile, $state, $location, $timeout, $log, Upload, CompanyServiceAPI, $modal, $q, $filter, listingTypes, UserServiceAPI, companyTemplates,FileMgmtAPI) {

    var scope = $scope;
    var self = this;
    var parentcompanyguid, companyGUID;
    var selectedCert = [];
    var showAvailableComponents, showCompanyHeadqrts;
    self.selectedAssoContact = {};
    self.attachmentFile = {
        "logoFilePathURL": "",
        "logoFilePathUNC": "",
        "logoCoreFileGUID": "",
        "fileVersionGUID": ""
    };
    self.UploadSuccessMsg = "";
    self.UploadErrorMsg = "";
    self.IncorrectFormat = "";
    self.isUploadErrorMsg = false;
    self.selectedCompCertificates = {};
    //    self.createNewCompData = createCompanyData;
    self.compAssoUsers = {};
    //view lender Comp
    self.selectedReportTemplate = [];
    self.checkedShowInPolicy = [];
    self.isEdit = false;
    // SWalunj code.. Gautam don't touch it
    this.parentcompanyguid = $location.search().parentcompanyguid;
    this.companyguid = $location.search().companyguid;
    this.hasParent = ($location.search().hasParent) == 'true' ? true : false;

    //Setting breadcrumb label on view and edit state
    if ($state.current.name == 'accountMgmt.company.view' || $state.current.name == 'accountMgmt.company.edit') {
        if (!this.hasParent) {
            $state.current.breadcrumb.skip = true;
        } else {
            $state.current.breadcrumb.skip = false;
            $state.current.breadcrumb.label = $rootScope.companyCrumbTitle;
        }
    } else {
        $state.current.breadcrumb.skip = false;
        if (existingCompanyData)
            $rootScope.parentCompanyCrumbTitle = existingCompanyData.companies[0].name;
    }
    //SWalunj code end

    self.parentCompanyGUID = $state.params.parentcompanyguid;
    self.companyTypes = listingTypes.companyTypes;
    //add new company
    if ($state.current.name == 'accountMgmt.company.new') {
        self.submitButtonText = "SUBMIT";
        self.showAvailableComponents = self.showCompanyHeadqrts = false;
        self.appComponentTypes = listingTypes.appcomponenttypes;
        //self.companyTypes = listingTypes.companyTypes;
        self.certTypes = listingTypes.companycerttypes;
        if (existingCompanyData) {
            self.parentCompanyName = existingCompanyData.companies[0].name;
        }
    }
    //edit company
    if ($state.current.name == 'accountMgmt.company.edit') {
        self.isEdit = true;
        self.submitButtonText = "UPDATE";
        //self.companyTypes = listingTypes.companyTypes;
        self.appComponentTypes = listingTypes.appcomponenttypes;
        self.showAvailableComponents = self.showCompanyHeadqrts = false;
        self.existingCompanyData = existingCompanyData.companies[0];
        self.certTypes = listingTypes.companycerttypes;
        if (self.existingCompanyData != null && self.existingCompanyData != undefined) {
            assignExistingData();
            self.showCompanyHeadqrts = true;
            var selectedCompType = [];
            angular.forEach(self.existingCompanyData.companyTypes, function (compType, i) {
                var x = self.companyTypes.filter(function (item) {
                    return item.companyType == compType.companyType
                })[0];
                selectedCompType.push(x);
            })
            self.compType = selectedCompType;
            if (self.existingCompanyData.hasOwnProperty('certifications')) {
                var selectedCertificates = {};
                for (var i = 0; i < self.existingCompanyData.certifications.length; i++) {
                    selectedCertificates[self.existingCompanyData.certifications[i].certificationGUID] =
                        true;
                    selectedCert.push(self.existingCompanyData.certifications[i].certificationGUID);
                }
                self.selectedCompCertificates = selectedCertificates;
            }

            self.applicationComponentType = self.appComponentTypes.filter(function (item) {
                return item.guid == self.existingCompanyData.applicationComponentTypeGUID
            })[0];
            if (self.applicationComponentType) {
                var promise = CompanyServiceAPI.getAppComponentItems(self.applicationComponentType.guid);
                promise.then(function (resp) {
                    //getComponetItemsForComponentType and assign in self.appComponentItems
                    self.appComponentItems = resp.applicationComponentItems;
                    assignAppComponentItem();
                    self.showAvailableComponents = true;
                })
            }
            $scope.companyNameCrumb = self.existingCompanyData.name;
        }
    }
    //View Company
    if ($state.current.name == 'accountMgmt.company.view') {
        $scope.tab = 'companyDtls';
        var todayDate = new Date();
        var mmddyyyyDate = ("0" + (todayDate.getMonth() + 1 )).slice(-2) + '/' + todayDate.getDate() + '/' +  todayDate.getFullYear();
        self.effectiveDateStart= mmddyyyyDate;
        self.effectiveDate = mmddyyyyDate;
        self.expirationDate = ("0" + (todayDate.getMonth() + 1 )).slice(-2) + '/' + todayDate.getDate() + '/' +  (todayDate.getFullYear()+1);
        $scope.lenderServiceTab = 'environmental';
        self.reportFee = [];
        self.existingCompanyData = existingCompanyData.companies[0];
        self.compAssoUsers = {};
        var component = self.existingCompanyData.applicationComponentType + '(';
        component += self.existingCompanyData.companyApplicationComponentItems.map(function (elem) {
            return elem.applicationComponentItemName;
        }).join(",");
        component += ')'
        self.component = component;
        self.companyHeadquartersType = '';
        self.function = self.existingCompanyData.companyTypes.map(function (elem) {
            return elem.companyType;
        }).join(",");
        if (self.existingCompanyData.logoFilePathURL) {
            self.isLogoExist = true;
        }
        if (self.existingCompanyData.certifications.length > 0)
            self.compCertList = self.existingCompanyData.certifications.map(function (elemt) {
                return elemt.certificationType;
            }).join(", ");
        assignExistingData();
        //1.LENDER VENDORS
        self.companyAssociations = self.existingCompanyData.companyAssociations;
        modifyCompAssociationJSON();
        //        var promiseGetFunctions = CompanyServiceAPI.getListingTypes('companyTypes');
        self.compFunctions = self.companyTypes;
        var promiseGetCompList = CompanyServiceAPI.getCompany();
        promiseGetCompList.then(function (data) {
            self.compList = data.companies;
        })

        //2.LENDER SETUP FEES
        self.setupFees = self.existingCompanyData.setupFees;
        self.lenderSetupFeeTypes = listingTypes.lenderSetupFeeTypes;

        //3.Lender Service Groups & Reports
        assignReportSettings();
    }

    self.showSetupType = function (setupfee) {
        var selected = [];
        if (setupfee.setupType) {
            selected = $filter('filter')(self.setupTypeOptions, {
                value: setupfee.setupType
            });
        }
        return selected.length ? selected[0].text : 'Not set';
    }

    function assignReportSettings() {
        var promises = [];
        self.compTemplates = companyTemplates;
        angular.forEach(self.existingCompanyData.reportSettings, function (report, i) {
            report['templateIndex'] = i;
            //self.reportFee[i] = report.fee;
            if (i % 2 == 0) //custom set, change after getting data from service
            //report.reportType = 'ASTMPCA' ;//'Phase I ESA'; //Environmental Questionnaire';//
            /*if (report.templateGUID) {
                report['templates'] = resp[count].templates;
                self.selectedReportTemplate[i] = report.templateGUID;
            }*/
                var tempCount = tempCount ? tempCount : 0;
            if (companyTemplates && companyTemplates.length > 0)
                tempCount = self.compTemplates.filter(function (item) {
                    return item.reportType == report.reportType
                }).length;
            if (tempCount > 0)
                report['hasTemplates'] = true;
            else
                report['hasTemplates'] = false;
        })
        self.reportSettings = self.existingCompanyData.reportSettings;
        try {
            self.reportCategory = self.reportSettings.filter(function (item) {
                return item.reportCategory.toLowerCase() == $scope.lenderServiceTab.toLowerCase()
            })[0].reportCategory;
        } catch (e) {
            self.reportCategory = null;
        }
    }

    function assignExistingData() {
        self.companyGUID = self.existingCompanyData.companyGUID;
        self.name = self.existingCompanyData.name;
        self.webAddress = self.existingCompanyData.webAddress;
        self.slogan = self.existingCompanyData.slogan;
        self.edrDataVendorId = self.existingCompanyData.edrDataVendorGUID;
        self.billLender = self.existingCompanyData.billLender;
        self.attachmentFile["logoCoreFileGUID"] = self.existingCompanyData.logoCoreFileGUID;
        self.attachmentFile["logoFilePathUNC"] = self.existingCompanyData.logoFilePathUNC;
        self.attachmentFile["logoFilePathURL"] = self.existingCompanyData.logoFilePathURL;
        self.compOffices = self.existingCompanyData.offices;
        if (self.existingCompanyData.headquarterCompanyOfficeGUID) {
            if (self.compOffices.length > 0) {
                self.compHeadqtr = self.compOffices.filter(function (item) {
                    return item.companyOfficeGUID == self.existingCompanyData.headquarterCompanyOfficeGUID //compare type or guid
                })[0];

                if (self.compHeadqtr)
                    self.companyHeadquartersType = self.compHeadqtr.officeName;
            }
        }
        //        if (self.existingCompanyData.hasOwnProperty('applicationComponentTypeGUID'))
        //            self.applicationComponentType = self.appComponentTypes.filter(function (item) {
        //                return item.guid == self.existingCompanyData.applicationComponentTypeGUID
        //            });
    }

    function modifyCompAssociationJSON() {
        angular.forEach(self.companyAssociations, function (association, index) {
            if (association.companyAssociationUsers.length == 0) {
                association.companyAssociationUsers.push("");
            }
        })
    }

    self.getLenderServiceData = function () {
        //assign current tab report to reportSettings
        var currentLenderServiceTab = $scope.lenderServiceTab;
        try {
            self.reportCategory = self.reportSettings.filter(function (item) {
                return item.reportCategory.toLowerCase() == $scope.lenderServiceTab.toLowerCase()
            })[0].reportCategory;
        } catch (e) {
            self.reportCategory = null;
        }
    }

    self.setSetupType = function (e) {
        self.setupCost = 0;
    }

    self.setApplicationComponentType = function (e) {
        self.showAvailableComponents=false;
        if (self.applicationComponentType) {
            self.showAvailableComponents = true;
            //get appcomponetsItem for appcomponentType
            var promise = CompanyServiceAPI.getAppComponentItems(self.applicationComponentType.guid);
            promise.then(function (resp) {
                //getComponetItemsForComponentType and assign in self.appComponentItems
                if (resp.applicationComponentItems) {
                    self.appComponentItems = resp.applicationComponentItems;
                    assignAppComponentItem();
                }
            })
        }
    }

    function assignAppComponentItem() {
        angular.forEach(self.appComponentItems, function (item, i) {
            if ($state.current.name == "accountMgmt.company.new") {
                item['isChecked'] = true;
            }
            if ($state.current.name == "accountMgmt.company.edit") {
                var checkedItem = self.existingCompanyData.companyApplicationComponentItems.filter(function (checkedItem) {
                    return item.guid == checkedItem.applicationComponentItemGUID
                });
                if (checkedItem.length > 0) {
                    item['isChecked'] = true;
                } else
                    item['isChecked'] = false;
            }
        })
    }

    self.checkedAvailApplicationComponentTypeItem = function (e, value) {
        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;

        if (elem.checked) {
            angular.forEach(self.appComponentItems, function (item, i) {
                if (value.guid == item.guid) {
                    self.appComponentItems[i].isChecked = true;
                }
            })
        } else {
            angular.forEach(self.appComponentItems, function (item, i) {
                if (value.guid == item.guid) {
                    self.appComponentItems[i].isChecked = false;
                }
            })
        }
    }

    self.checkedcert = function (e, value) {
        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;

        if (elem.checked) {
            selectedCert.push(value)
        } else {
            for (var i = 0; i < selectedCert.length; i++) {
                if (selectedCert[i] == value) {
                    selectedCert.splice(i, 1);
                }
            }
        }
    }

    self.checkFile = function (file, invalidFiles, form) {
        self.IncorrectFormat = false;
        self.isUploadErrorMsg = false;
        self.uploadSuccessMsg = false;
        self.isUpload = false;
        if (invalidFiles.length > 0) {
            var msg = '';
            switch (invalidFiles[0].$error.toLowerCase()) {
                case "pattern":
                    msg = 'File format is incorrect';
                    break;
                case "maxsize":
                case "maxtotalsize":
                    msg = 'Image size is incorrect';
                    break;
                case "ratio":
                    msg = 'Image aspect ratio is incorrect'
                    break;
            }
            self.IncorrectFormat = msg;
            self.isUpload = true;
        }
    }

     var uploadFile = function(companyGUID){
        var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
        var fileguid = '';
        self.UploadErrorMsg = "";
        self.uploadSuccessMsg = false;
        self.isUploadErrorMsg = false;
        var method = "POST";
        if ($state.$current.name == "accountMgmt.company.edit") {
            fileguid = self.attachmentFile.logoCoreFileGUID;
        }
        var logoFile = self.files;
        if (!logoFile || logoFile == null) {
            self.isUploadErrorMsg = true;
            self.UploadErrorMsg += "Please attach files before trying to upload.";
            return;
        } else{
            var compguid = $state.params.companyguid?$state.params.companyguid:companyGUID;
            var basePath = "/Accounts/Companies/"+compguid;
            var category = "Company Logo";
            var promise = FileMgmtAPI.uploadFile(logoFile,'DISABLE',compguid,basePath,category,fileguid);
            promise.progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }),
            promise.success(function(data,status, headers, config){
                if (data) {
                    self.attachmentFile["logoCoreFileGUID"] = data.file.fileGUID;
                    self.attachmentFile["fileVersionGUID"] = data.file.fileVersionGUID;
                    addEditCompany(true,compguid);
                }else redirectAfterAddEdit(compguid,true);
                self.uploadSuccessMsg = true;
            }),
            promise.error(function(data, status, headers, config){
                $rootScope.alertClass = 'alert-danger';
                $rootScope.skipMsgClear = true;
                self.isUploadErrorMsg = true;
                self.UploadErrorMsg = "Sorry. We encountered a problem while processing your request. Please try again.";
                $rootScope.userMessage = "Failed to upload company logo.";
                if(data.message){
                    self.UploadErrorMsg = data.message.userMessage;
                    $rootScope.userMessage ="Failed to upload logo due to: " + data.message.userMessage;
                }
                redirectAfterAddEdit(compguid,true);
                accessMgmtFactoryLogger.error(config);
            })
        }
    }

    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    }

    self.saveCompanyData = function (form) {
        if (form.$valid) {
            addEditCompany(false);
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            //angular.element(inputElements).find(':input').first().trigger('focus');
            inputElements[0].querySelector('.ng-invalid').focus();
        }
    }
    
    var addEditCompany = function(isEditAfterUpload, addedCompanyGUID){
        /*var selectedDPType = self.dfltPortalViewType == undefined ? "" : self.dfltPortalViewType.value;
        var selectedCSType = self.cabinetSettgType == undefined ? "" : self.cabinetSettgType.value;
        var selectedSRType = self.serviceReqSettgType == undefined ? "" : self.serviceReqSettgType.value;*/
        var logoFileGUID = null;
        var parentcompanyguid = $state.params.parentcompanyguid == 'none' || $state.params.parentcompanyguid == undefined ? null : $state.params.parentcompanyguid;
        var isedrVendorGUID = isUUIDGUID(self.edrDataVendorId);
        if (self.attachmentFile.logoCoreFileGUID)
            logoFileGUID = self.attachmentFile.logoCoreFileGUID;
        var compTypes = [];
        if (self.compType) {
            angular.forEach(self.compType, function (comptype, i) {
                var companyTp = {};
                companyTp["companyType"] = comptype.companyType
                //compTypes.push(comptype.name);
                compTypes.push(companyTp);
            })
        }
        var certifications =  getCompanyCertificationObj();
        var companyApplicationComponentItems = getCompanyApplicationCompItemsObj();

        var company = {
                "name": self.name,
                "applicationComponentTypeGUID": self.applicationComponentType.guid,
                "applicationComponentType": self.applicationComponentType.name,
                "isEnabled": true,
                "parentCompanyGUID": parentcompanyguid,
                "webAddress": self.webAddress == undefined ? "" : self.webAddress,
                "slogan": self.slogan == undefined ? "" : self.slogan,
                //"edrDataVendorGUID": self.edrDataVendorId ==  undefined ? null : self.edrDataVendorId,
                "billLender": self.billLender == undefined ? false : self.billLender,
                //"headquarterCompanyOfficeGUID": self.compHeadqtr.companyOfficeGUID,
                "logoCoreFileGUID": logoFileGUID,
                "companyTypes": compTypes
                //"certifications" :certifications,
                //"companyApplicationComponentItems": companyApplicationComponentItems
            };
            if (self.compHeadqtr && self.compHeadqtr.companyOfficeGUID) {
                company["headquarterCompanyOfficeGUID"] = self.compHeadqtr.companyOfficeGUID;
            }
            var companyData = {
                "company": company
            };
            var name = self.name;
            var parentCompanyGUID = parentcompanyguid;
            var hasParent = false;
            var detail = 'none';
            if ($state.current.name == "accountMgmt.company.new" && !isEditAfterUpload) {
                var promise = CompanyServiceAPI.createCompany(companyGUID, detail, name, parentCompanyGUID, hasParent, companyData);
                promise.then(function (data) {
                    $rootScope.skipMsgClear = true;
                    if (data.company) {
                        $rootScope.alertClass = 'alert-success';
                        $rootScope.userMessage = 'The ' + companyData.company.name + " company is created successfully.";
                        if(self.files){
                            uploadFile(data.company.companyGUID);
                        }else redirectAfterAddEdit(data.company.companyGUID,true);
                        
                        //createCompAppComponentItems(data.company.companyGUID);
                    } else if (data.data.message) {
                        $rootScope.alertClass = 'alert-danger';
                        $rootScope.userMessage = data.data.message.userMessage;
                        redirectAfterAddEdit(null, false);
                    } else {
                        $rootScope.alertClass = 'alert-danger';
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                    }
                })
            } else {
                //This else case is handling simple update company and also update after logo upload using flag(isEditAfterUpload)
                if(self.existingCompanyData)
                    addEditCompanyGUID = self.existingCompanyData.companyGUID;
                else
                    addEditCompanyGUID = addedCompanyGUID;
                var promise = CompanyServiceAPI.updateCompany(addEditCompanyGUID, detail, name, parentCompanyGUID, hasParent, companyData);
                promise.then(function (data) {
                    $rootScope.skipMsgClear = true;
                    if (data.length == 0) {
                        if(self.files && !isEditAfterUpload){
                            uploadFile(self.existingCompanyData.companyGUID);
                        }else
                            redirectAfterAddEdit(addEditCompanyGUID,true);
                        //updateCompAppComponentItems(self.existingCompanyData.companyGUID);
                        $rootScope.alertClass = 'alert-success';
                        if(!isEditAfterUpload)
                            $rootScope.userMessage = 'The ' + self.existingCompanyData.name + " company is updated successfully.";
                    } else if (data.data.message) {
                        $rootScope.alertClass = 'alert-danger';
                        $rootScope.userMessage = data.data.message.userMessage;
                        redirectAfterAddEdit(addEditCompanyGUID, false);
                    } else {
                        $rootScope.alertClass = 'alert-danger';
                        $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                    }
                })
            }
        
    }

    redirectAfterAddEdit = function (companyGUID, successState) {
        if (successState) {
            var view = 'viewParcel';
            var isLenderCompany = self.compType.filter(function (item) {
                return item.companyType == 'Lender';
            });
            if(isLenderCompany.length)
                view = 'view';
            $state.go('accountMgmt.company.'+view, {
                parentcompanyguid: $state.params.parentcompanyguid,
                companyguid: companyGUID,
                hasParent: $state.params.hasparent
            })
        } else {
            if ($state.params.parentcompanyguid && $state.params.parentcompanyguid != 'none') {
                $state.go('accountMgmt.company.parentcompanieslist', {
                    parentcompanyguid: $state.params.parentcompanyguid,
                })
            } else
                $state.go('accountMgmt.company.list', {
                    parentcompanyguid: $state.params.parentcompanyguid,
                })
        }
    }
    
    var getCompanyCertificationObj = function(){
        var objCertification;
        if($state.current.name == "accountMgmt.company.new"){
            objCertification = createCompCertificates();
        }else{
            objCertification = updateCompCertificates();
        }
        return objCertification;
    }
    
    var getCompanyApplicationCompItemsObj = function(){
        var objCompanyApplicationCompItem;
        if($state.current.name == "accountMgmt.company.new"){
            objCompanyApplicationCompItem = createCompAppComponentItems();
        }else{
            objCompanyApplicationCompItem = updateCompAppComponentItems();
        }
        return objCompanyApplicationCompItem;
    } 
    
    var createCompAppComponentItems = function (companyGUID) {
        var companyApplicationComponentItems = [];
        angular.forEach(self.appComponentItems, function (appItem, i) {
            var appItemObj = {
                "applicationComponentItemGUID": appItem.guid,
                "applicationComponentItemName": appItem.name
            }
            if (appItem.isChecked) {
                companyApplicationComponentItems.push(appItemObj);
            }
        })
        
        return companyApplicationComponentItems;
        
        /*var requestCompComponentItemObj = {
            "companyApplicationComponentItems": companyApplicationComponentItems
        }
        if (companyApplicationComponentItems.length > 0) {
            var promise = CompanyServiceAPI.createCompAppComponentItems(companyGUID, requestCompComponentItemObj);
            promise.then(function (data) {
                // call createCertifications here
                createCompCertificates(companyGUID);
                //$('#backStepArrow').trigger('click'); 
            })
        } else {
            createCompCertificates(companyGUID);
        }*/
    }

    var createCompCertificates = function (companyGUID) {
        var certifications = [];
        angular.forEach(selectedCert, function (item, i) {
            var certType = self.certTypes.filter(function (certtype) {
                return certtype.guid == item
            })[0];
            if (certType.name) {

                var cert = {
                    "certificationTypeGUID": item,
                    "certificationType": certType.name,
                    "certificationGUID": item
                }
                certifications.push(cert);
            }
        })
        return certifications;
        /*var requestCertObj = {
            "certifications": certifications
        }
        if (certifications.length > 0) {
            var promise = CompanyServiceAPI.createCompCertificate(companyGUID, requestCertObj);
            promise.then(function (data) {
                redirectAfterAddEdit(companyGUID, true);
            })
        } else
            redirectAfterAddEdit(companyGUID, true);*/
    }

    var updateCompAppComponentItems = function (companyGUID) {
        var companyApplicationComponentItemsAssigned = [];
        var companyApplicationComponentItemsUnassigned = [];
        angular.forEach(self.appComponentItems, function (appItems, i) {

            var existItem = self.existingCompanyData.companyApplicationComponentItems.filter(function (item) {
                return item.applicationComponentItemGUID == appItems.guid
            })[0];
            if (appItems.isChecked) {
                var addItemObj = {
                    "applicationComponentItemGUID": appItems.guid,
                    "applicationComponentItemName": appItems.name
                }
                if (existItem && existItem.companyApplicationComponentItemGUID) {} else
                    companyApplicationComponentItemsAssigned.push(addItemObj);
            } else {
                if (existItem && existItem.companyApplicationComponentItemGUID) {
                    var removeItemObj = {
                        "companyApplicationComponentItemGUID": existItem.companyApplicationComponentItemGUID
                    }
                    companyApplicationComponentItemsUnassigned.push(removeItemObj);
                }
            }
        })
        var requestCompComponentItemObj = {
            "companyApplicationComponentItemsAssigned": companyApplicationComponentItemsAssigned,
            "companyApplicationComponentItemsUnassigned": companyApplicationComponentItemsUnassigned
        }
        return requestCompComponentItemObj;
        /*if (companyApplicationComponentItemsAssigned.length > 0 || companyApplicationComponentItemsUnassigned.length > 0) {
            var promise = CompanyServiceAPI.updateCompAppComponentItems(companyGUID, requestCompComponentItemObj);
            promise.then(function (data) {
                updateCompCertificates(self.existingCompanyData.companyGUID);
            })
        } else
            updateCompCertificates(self.existingCompanyData.companyGUID);*/
    }

    var updateCompCertificates = function (companyGUID) {
        var certificationsAssigned = [];
        var certificationsUnassigned = [];
        angular.forEach(self.certTypes, function (certType, i) {
            var checkedCert = selectedCert.filter(function (item) {
                return item == certType.guid
            })
            var existCertificate = self.existingCompanyData.certifications.filter(function (item) {
                return item.certificationGUID == certType.guid
            })[0];

            if (checkedCert.length > 0) {
                if (!existCertificate) {
                    var cert = {
                        "certificationTypeGUID": certType.guid,
                        "certificationType": certType.name,
                        "certificationGUID": certType.guid
                    }
                    certificationsAssigned.push(cert);
                }
            } else {
                var cert = {
                    "certificationGUID": certType.guid
                }
                if (existCertificate && existCertificate.certificationGUID) {
                    certificationsUnassigned.push(cert)
                }
            }
        })
        var requestCertObj = {
            "certificationsAssigned": certificationsAssigned,
            "certificationsUnassigned": certificationsUnassigned
        }
        
        return requestCertObj;
        
        /*var certificationGUID = "";
        if (certificationsAssigned.length > 0 || certificationsUnassigned.length > 0) {
            var promise = CompanyServiceAPI.updateCompCertificate(companyGUID, certificationGUID, requestCertObj);
            promise.then(function (data) {
                redirectAfterAddEdit(companyGUID, true);
            })
        } else
            redirectAfterAddEdit(companyGUID, true);*/
    }

    self.cancelCompCreate = function () {
        $state.go('accountMgmt.company.list');
    }

    //C360 Company View: 1. Lender Vendors

    self.disableExpDate = function(form){
        //self.disableExpDate = true;
        
        if($('#expDate').data('datepicker')){
            $('#expDate').data('datepicker').setDate(null);
            $('#expDate').data('datepicker').setStartDate(self.effectiveDate);
        }
        if(self.effectiveDate){
            var expDate = new Date(self.effectiveDate);
            self.expirationDate = (expDate.getMonth() + 1) + '/' + expDate.getDate() + '/' + (expDate.getFullYear()+1);
        }
    }

    function isValidDate(date){
        var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
        if (matches == null) return false;
        var d = matches[2];
        var m = matches[1] - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
                composedDate.getMonth() == m &&
                composedDate.getFullYear() == y;
    }
    
    self.addCompAssociation = function (form) {
        var detail = 'none';
        if (form.$valid) {
            var effectiveDate = new Date(self.effectiveDate);
            var expirationDate = new Date(self.expirationDate);
            var validEffectiveDate = isValidDate(self.effectiveDate);
            var validExpDate = isValidDate(self.expirationDate);
            if(!validEffectiveDate){               
                var todayDate = new Date();
                var mmddyyyyDate = ("0" + (todayDate.getMonth() + 1 )).slice(-2) + '/' + todayDate.getDate() + '/' +  todayDate.getFullYear();
                effectiveDate= mmddyyyyDate;
                expirationDate = ("0" + (todayDate.getMonth() + 1 )).slice(-2) + '/' + todayDate.getDate() + '/' +  (todayDate.getFullYear()+1);
            }
            if(!validExpDate){
                var exp_Date = new Date(expirationDate);
                expirationDate = (exp_Date.getMonth() + 1) + '/' + exp_Date.getDate() + '/' + (exp_Date.getFullYear()+1);
            }
//            var currentdate = new Date();
//            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();
            var selectedCompFromList = self.selectedCompFromList;
            var selectedCompFunction = self.selectedCompFunction;
            var companyAssociation = {
                "companyGUID": self.existingCompanyData.companyGUID,
                "associatedCompanyGUID": selectedCompFromList.companyGUID,
                "associationType": selectedCompFunction.companyType,
                "effectiveTS": new Date(effectiveDate+ " UTC").toISOString(),//datetime, //"07-22-2015 08:01:16 AM",
                "expirationTS": new Date(expirationDate+ " UTC").toISOString(),
                "isEnabled": true
            }
            var data = {
                "companyAssociation": companyAssociation
            };
            var promise = CompanyServiceAPI.addCompanyAssociation(self.existingCompanyData.companyGUID, detail, data);
            promise.then(function (data) {
                self.showLenderVendorMsg = true;
                if (data.companyAssociation && data.companyAssociation.companyAssociationGUID) {
                    //refresh table or update model data(we are getting companyAssociationGUID to get single assocociation detail);
                    self.alertClassLenderVendors = 'alert-success';
                    self.lenderVendorMsg = 'The company: ' + self.selectedCompFromList.name + ' added successfully to lender group.';
                    var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations(self.existingCompanyData.companyGUID, detail);
                    promiseGetCompAssociations.then(function (resp) {
                        self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                        modifyCompAssociationJSON();
                    })
                } else {
                    self.lenderVendorMsg = "Sorry. We encountered a problem while processing your request. Please try again.";
                    self.alertClassLenderVendors = 'alert-danger';
                    if(data.data.message)
                        self.lenderVendorMsg = data.data.message.userMessage;
                }
            })
            $scope.showAddCompany = false;
        } else {
            $scope.showAddCompany = true;
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            //inputElements[0].querySelector('.ng-invalid').focus();
        }
    }

    self.resetCompAssociation = function (form) {
        self.selectedCompFunction = null;
        self.selectedCompFromList = null;
        self.effectiveDate = null;
        self.expirationDate = null;
        //form.$valid = true;
        var inputElements = document.getElementsByName(form.$name);
        angular.element(inputElements).find(':input').parent('div').removeClass('has-error');
        angular.element(inputElements).find('span').remove();

    }

    self.deleteCompAssocition = function (companyGUID, companyAssociationGUID, companyName, e) {
        var modalContainer = {
            enityType: 'company from vendor list',
            companyGUID: self.existingCompanyData.companyGUID,
            //companyGUID: companyGUID,
            companyAssociationGUID: companyAssociationGUID,
            enityName: companyName
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: compAssocitionDelCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var compAssocitionDelCtrl = function ($scope, $modalInstance, data) {
        $scope.deleteTitle = 'Delete Company Vendor'
        $scope.toDelete = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            companyAssociationGUID: data.companyAssociationGUID,
            enityName: data.enityName,
            showMsg: true
        };
        $scope.afterDelete = {
            showMsg: false,
            msgAfterDelete: "Deleted",
        };
        $scope.deleteEntity = function () {
            var companyGUID = $scope.toDelete.companyGUID;
            var name = $scope.toDelete.enityName;
            var companyAssociationGUID = $scope.toDelete.companyAssociationGUID;
            var promise = CompanyServiceAPI.deleteCompAssociation(companyGUID, companyAssociationGUID);
            promise.then(function (resp) {
                self.showLenderVendorMsg = true;
                if (resp.length == 0) {
                    self.alertClassLenderVendors = 'alert-success';
                    self.lenderVendorMsg = "Deleted " + $scope.toDelete.enityName;
                    var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations(self.existingCompanyData.companyGUID);
                    promiseGetCompAssociations.then(function (resp) {
                        if (resp.companyAssociations) {
                            self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                            modifyCompAssociationJSON();                            
                        }
                    })
                } else {
                    self.alertClassLenderVendors = 'alert-danger';
                    self.lenderVendorMsg = 'Sorry. We encountered a problem while processing your request. Please try again.';
                    if(resp.data.message)
                        self.lenderVendorMsg = resp.data.message.userMessage;
                }
                $modalInstance.close();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.getCompAssoUsers = function (companyGUID, index) {
        if (!self.compAssoUsers[companyGUID]) {
            var promise = UserServiceAPI.getUserInfo(null, companyGUID);
            promise.then(function (resp) {
                if (resp.users)
                    self.compAssoUsers[companyGUID] = resp.users;
            })
        }
    }

    self.addAssoContact = function (e, parentIndex, childIndex, companyGUID, companyAssociationGUID) {
        //console.log('P-index:' + parentIndex + ',C-index:' + childIndex);
        if (self.selectedAssoContact[parentIndex + '_' + childIndex]) {
            var selectedContactGUID = self.selectedAssoContact[parentIndex + '_' + childIndex].userGUID;
            var currentdate = new Date();
            var datetime = currentdate.getFullYear() + "-" + ("0" + (currentdate.getMonth() + 1 )).slice(-2) + "-" + currentdate.getDate();
            var effectiveTs = new Date(datetime+ " UTC").toISOString();
            var expDateTime = (currentdate.getFullYear()+1) + "-" + ("0" + (currentdate.getMonth() + 1 )).slice(-2) + "-" + currentdate.getDate();
            var expriationTs = new Date(expDateTime+ " UTC").toISOString();
            var companyAssociationUserData = {
                "companyAssociationUser": {
                    "companyAssociationGUID": companyAssociationGUID,
                    "userGUID": selectedContactGUID,
                    "effectiveTS": effectiveTs,
                    "expirationTS":expriationTs,
                    "isEnabled": true
                }
            }
            var promise = CompanyServiceAPI.createCompAssociationUser(companyGUID, companyAssociationGUID, companyAssociationUserData);
            promise.then(function (resp) {
                self.showLenderVendorMsg = true;
                if (resp.companyAssociationUser && resp.companyAssociationUser.companyAssociationUserGUID) {
                    self.alertClassLenderVendors = 'alert-success';
                    self.lenderVendorMsg = 'The contact: ' + self.selectedAssoContact[parentIndex + '_' + childIndex].userName + ' added successfully to vendors group.';
                    var detail = 'none';
                    //var promiseGetCompAssociations = CompanyServiceAPI.getCompanyAssociations(self.existingCompanyData.companyGUID, detail);
                    // get asso-users for particular association
                    var promiseGetCompAssoUsers = CompanyServiceAPI.getCompanyAssoUsers(companyGUID, companyAssociationGUID, detail);
                    promiseGetCompAssoUsers.then(function (resp) {
                        if (resp.companyAssociationUsers) {
                            self.companyAssociations[parentIndex].companyAssociationUsers = resp.companyAssociationUsers;
                            //                          self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                            modifyCompAssociationJSON();
                        }
                    })
                } else {
                    self.alertClassLenderVendors = 'alert-danger';
                    self.lenderVendorMsg = 'Failed to add contact: ' + self.selectedAssoContact[parentIndex + '_' + childIndex].userName + ' to vendors group due to ' + resp.data.message.userMessage;
                }

            })
        }

    }

    self.deleteAssoContact = function (e, firstName, lastName, companyGUID, companyAssociationGUID, companyAssociationUserGUID, parentIndex) {
        var modalContainer = {
            enityType: 'contact from vendor list',
            companyGUID: companyGUID,
            //companyGUID: companyGUID,
            companyAssociationGUID: companyAssociationGUID,
            companyAssociationUserGUID: companyAssociationUserGUID,
            enityName: firstName + ' ' + lastName,
            index: parentIndex
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: compAssocitionContactDelCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })

    }

    var compAssocitionContactDelCtrl = function ($scope, $modalInstance, data) {
        $scope.deleteTitle = 'Delete Contact'
        $scope.toDelete = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            companyAssociationGUID: data.companyAssociationGUID,
            companyAssociationUserGUID: data.companyAssociationUserGUID,
            enityName: data.enityName,
            index: data.index,
            showMsg: true
        };
        $scope.afterDelete = {
            showMsg: false,
            msgAfterDelete: "Deleted",
        };
        $scope.deleteEntity = function () {
            var companyGUID = $scope.toDelete.companyGUID;
            var name = $scope.toDelete.enityName;
            var companyAssociationGUID = $scope.toDelete.companyAssociationGUID;
            var companyAssociationUserGUID = $scope.toDelete.companyAssociationUserGUID;
            var promise = CompanyServiceAPI.deleteCompAssoUser(companyGUID, companyAssociationGUID, companyAssociationUserGUID);
            promise.then(function (resp) {
                self.showLenderVendorMsg = true;
                if (resp.length == 0) {
                    self.alertClassLenderVendors='alert-success';
                    self.lenderVendorMsg = "Deleted contact: " + $scope.toDelete.enityName;
                    var promiseGetCompAssoUsers = CompanyServiceAPI.getCompanyAssoUsers(companyGUID, companyAssociationGUID);
                    promiseGetCompAssoUsers.then(function (resp) {
                        if (resp.companyAssociationUsers) {
                            self.companyAssociations[$scope.toDelete.index].companyAssociationUsers = resp.companyAssociationUsers;
                            //self.companyAssociations = resp.companyAssociations; //self.existingCompanyData.setupFees
                            modifyCompAssociationJSON();                            
                        }
                    })
                } else {
                    self.alertClassLenderVendors='alert-danger';
                    self.lenderVendorMsg = "Sorry. We encountered a problem while processing your request. Please try again.";
                    if(resp.data.message)
                        self.lenderVendorMsg=resp.data.message.userMessage;
                }
                //var promiseGetcompAsso = CompanyServiceAPI.getCompanyAssociations(self.existingCompanyData.companyGUID);
                //promiseGetcompAsso.then(function (resp) {
                    //self.companyAssociations = resp.companyAssociations;
                    //modifyCompAssociationJSON();
                    ////$modalInstance.close();
                //})
                $modalInstance.close();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    //C360 Company View: 2. Lender Setup Fees
    self.addSetupFees = function (form) {
        if (form.$valid) {
            var price = self.setupCost == "" ? 0 : self.setupCost;
            var currentdate = new Date();
            var datetime = currentdate.getFullYear() + "-" + ("0" + (currentdate.getMonth() + 1 )).slice(-2) + "-" + currentdate.getDate();
            var orderGUId;
            var newSetupFees = {
                "setupFee": {
                    "companyGUID": self.existingCompanyData.companyGUID,
                    "setupType": self.selectedSetupItem.name,
                    "price": price,
                    "comments": self.setupComments,
                    "enteredBy": ""
                     //"invoiceDate": datetime, //"07-22-2015 08:01:16 AM",
                     //"orderGUID": null //"A0F5E294-B497-4C16-8FA4-526C9413530F"
                }
            }
            var promise = CompanyServiceAPI.addSetupFees(self.existingCompanyData.companyGUID, newSetupFees);
            promise.then(function (resp) {
                self.showSetupFeeMsg = true;
                if (resp.setupFee && resp.setupFee.setupFeeGUID) {
                    var promiseGetSetupfees = CompanyServiceAPI.getSetupFees(self.existingCompanyData.companyGUID);
                    self.alertClassSetupFee = 'alert-success';
                    self.setupFeeMsg = 'The Setup item: ' + self.selectedSetupItem.name + " is added successfully.";
                    promiseGetSetupfees.then(function (respSetupFees) {
                        if (respSetupFees.setupFees)
                            self.setupFees = respSetupFees.setupFees; //self.existingCompanyData.setupFees
                    })
                } else {
                    self.alertClassSetupFee = 'alert-danger';
                    self.setupFeeMsg = "Sorry. We encountered a problem while processing your request. Please try again.";
                    if(resp.data.message)
                        self.setupFeeMsg = resp.data.message.userMessage;
                }
            })
            $scope.showAddSetupFees = false;
        } else {
            $scope.showAddSetupFees = true;
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    self.lenderDeleteSetupFees = function (companyGUID, setupFeeGUID, e, setupType) {

        var modalContainer = {
            enityType: 'Company SetupFee',
            companyGUID: companyGUID,
            setupFeeGUID: setupFeeGUID,
            enityName: setupType
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: lendercompSetupFeesDelCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var lendercompSetupFeesDelCtrl = function ($scope, $modalInstance, data) {
        $scope.deleteTitle = 'Delete Company'
        $scope.toDelete = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            setupFeeGUID: data.setupFeeGUID,
            enityName: data.enityName,
            showMsg: true
        };
        $scope.afterDelete = {
            showMsg: false,
            msgAfterDelete: "Deleted",
        };
        $scope.deleteEntity = function () {
            var companyGUID = $scope.toDelete.companyGUID;
            var name = $scope.toDelete.enityName;
            var setupFeeGUID = $scope.toDelete.setupFeeGUID;
            var promise = CompanyServiceAPI.lenderDeleteSetupFees(companyGUID, setupFeeGUID);
            promise.then(function (resp) {
                self.showSetupFeeMsg = true;
                if (resp.length == 0) {
                    self.alertClassSetupFee='alert-success';
                    self.setupFeeMsg = "Deleted " + $scope.toDelete.enityName;
                    var promiseGetSetupfees = CompanyServiceAPI.getSetupFees(self.existingCompanyData.companyGUID);
                    promiseGetSetupfees.then(function (resp) {
                        if (resp.setupFees)
                            self.setupFees = resp.setupFees;
                    })
                } else {
                    self.alertClassSetupFee='alert-danger';
                    self.setupFeeMsg= "Sorry. We encountered a problem while processing your request. Please try again.";
                    if(resp.data.message)
                        self.setupFeeMsg= resp.data.message.userMessage;
                }
                $modalInstance.close();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.resetSetupFees = function (form) {
        self.setupCost = 0;
        self.selectedSetupItem = null;
        self.setupComments = "";
        var inputElements = document.getElementsByName(form.$name);
        angular.element(inputElements).find(':input').parent('div').removeClass('has-error');
        angular.element(inputElements).find('span').remove();
    }

    self.showSubmitInvoicePopup = function () {
        if (self.setupFees) {
            self.existingCompanyData.headquarterCompanyOfficeGUID = 'a1f5e294-b497-4c16-8fa4-526c9413530f';
            var lenderOfficeDetails = self.existingCompanyData.offices.filter(function (item) {
                return item.companyOfficeGUID == self.existingCompanyData.headquarterCompanyOfficeGUID
            })[0];

            var setupFeesInvoice = self.lenderSetupFeeTypes;
            var selectedSetupFees = self.setupFees;
            angular.forEach(setupFeesInvoice, function (setupInvoiceItem, i) {
                var checkedSetupFees = self.setupFees.filter(function (item) {
                    return item.setupType == setupInvoiceItem.name //filter by Id
                })[0];
                if (checkedSetupFees) {
                    setupInvoiceItem['price'] = checkedSetupFees.price;
                    setupInvoiceItem['setupFeeGUID'] = checkedSetupFees.setupFeeGUID;
                    setupInvoiceItem['companyGUID'] = checkedSetupFees.companyGUID;
                    if (checkedSetupFees.orderGUID && checkedSetupFees.orderGUID != null)
                        setupInvoiceItem['isChecked'] = false;
                    else
                        setupInvoiceItem['isChecked'] = true;
                } else {
                    setupInvoiceItem['isChecked'] = false;
                    setupInvoiceItem['price'] = null;
                    setupInvoiceItem['companyGUID'] = null;
                    setupInvoiceItem['setupFeeGUID'] = null;
                }
            })
            var selectedSetupInvoiceCount = setupFeesInvoice.filter(function (item) {
                return item.isChecked == true
            }).length;
            if (selectedSetupInvoiceCount <= 0) {
                self.checkSubmitInvoice = true;
            } else {
                self.checkSubmitInvoice = false;

                var modalContainer = {
                    enityType: 'report group and services',
                    companyGUID: self.existingCompanyData.companyGUID,
                    enityName: self.existingCompanyData.name,
                    lenderOfficeDetails: lenderOfficeDetails,
                    selectedSetupFees: setupFeesInvoice
                }
                var modalInstance = $modal.open({
                    templateUrl: "lender-submit-invoice-modal.html",
                    scope: $scope,
                    controller: submitInvoiceSaveCtrl,
                    size: 'lg',
                    resolve: {
                        data: function () {
                            return modalContainer;
                        }
                    }
                })
            }
        } else
            self.checkSubmitInvoice = true;

    }

    var submitInvoiceSaveCtrl = function ($scope, $modalInstance, data) {
        $scope.setupFees = data.selectedSetupFees;
        $scope.toSave = {};
        $scope.toSave.showMsg = true;
        if (data.lenderOfficeDetails) {
            $scope.toSave.officeName = data.lenderOfficeDetails.officeName;
            $scope.toSave.edrAccountNumber = data.lenderOfficeDetails.edrAccountNumber;
            $scope.toSave.edrAccountPassword = data.lenderOfficeDetails.edrAccountPassword;
            $scope.toSave.address = data.lenderOfficeDetails.address;
            $scope.toSave.state = data.lenderOfficeDetails.state;
            $scope.toSave.city = data.lenderOfficeDetails.city;
            $scope.toSave.zipCode = data.lenderOfficeDetails.zipCode;
            $scope.toSave.fax = data.lenderOfficeDetails.fax;
        }

        $scope.afterSave = {
            showMsg: false,
            msgAfterSave: "Order Submitted Successfully",
        };

        $scope.showPreviewInvoice = function (invoiceForm) {
            if (invoiceForm.$valid) {
                $scope.showInvoicePreview = true;
            } else {
                $scope.showInvoicePreview = false;
                var inputElements = document.getElementsByName(invoiceForm.$name);
                angular.element(inputElements).find(':input').trigger('blur');
                inputElements[0].querySelector('.ng-invalid').focus();
            }
        }

        $scope.closeModal = function () {
            $modalInstance.close();
        }

        $scope.setshowInvoicePreview = function () {
            $scope.showInvoicePreview = false;
        }

        $scope.total = function () {
            var total = 0;
            angular.forEach($scope.setupFees, function (item) {
                if (item.isChecked)
                    total += item.price;
            })
            return total;
        }

        $scope.submitFees = function () {
            var objSetupFees = [];
            angular.forEach($scope.setupFees, function (submitItem, i) {
                if (submitItem.isChecked && submitItem.setupFeeGUID) {
                    var obj = {
                        "setupFeeGUID": submitItem.setupFeeGUID
                    }
                    objSetupFees.push(obj);
                }
            })
            var requestInvoiceObj = {
                "accountNumber": $scope.toSave.edrAccountNumber,
                "password": $scope.toSave.edrAccountPassword,
                "projectNumber": $scope.toSave.projectNumber,
                "poNumber": $scope.toSave.poNumber,
                "contactName": $scope.toSave.contactName,
                "contactPhone": $scope.toSave.contactPhone,
                "contactFax": $scope.toSave.fax,
                "contactAddress": $scope.toSave.address,
                "contactCity": $scope.toSave.city,
                "contactState": $scope.toSave.state,
                "contactZip": $scope.toSave.zipCode,
                "setupFees": objSetupFees
            }
            var promise = CompanyServiceAPI.sendInvoice(self.existingCompanyData.companyGUID, requestInvoiceObj);
            promise.then(function (resp) {
                if (resp.length == 0) {
                    var promiseGetSetupfees = CompanyServiceAPI.getSetupFees(self.existingCompanyData.companyGUID);
                    promiseGetSetupfees.then(function (respSetupFees) {
                        if (respSetupFees.setupFees)
                            self.setupFees = resp.setupFees; //self.existingCompanyData.setupFees
                    })
                    $scope.toSave.showMsg = false;
                    $scope.afterSave.showMsg = true;
                    $scope.afterSave.msgAfterSave = "Order Submitted Successfully.";
                } else {
                    $scope.afterSave.msgAfterSave = "Sorry. We encountered a problem while processing your request. Please try again.";
                        if(resp.message.userMessage){
                           $scope.afterSave.msgAfterSave = "Failed to submit order due to " + resp.message.userMessage; 
                        }
                    $scope.toSave.showMsg = false;
                    $scope.afterSave.showMsg = true;
                }
            })
        }
    }

    //C360 Company View: 3. Lender Service Groups & Reports
    self.saveServiceGroupReports = function () {
        var companyReportSettings = self.reportSettings;
        var modalContainer = {
            enityType: 'report group and services',
            companyGUID: self.existingCompanyData.companyGUID,
            //companyGUID: companyGUID,
            companyReportSettings: companyReportSettings,
            enityName: self.existingCompanyData.name
        }
        var modalInstance = $modal.open({
            templateUrl: "company-reports-save-confirmation-modal.html",
            scope: $scope,
            controller: serviceGroupReportsSaveCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var serviceGroupReportsSaveCtrl = function ($scope, $modalInstance, data) {
        $scope.saveTitle = 'Save Reports'
        $scope.toSave = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            reportSettings: data.companyReportSettings,
            enityName: data.enityName,
            showMsg: true
        };
        $scope.afterSave = {
            showMsg: false,
            msgAfterDelete: "Saved",
        };
        $scope.saveEntity = function () {
            var requestReportSettings = [];
            var companyGUID = $scope.toSave.companyGUID;
            var name = $scope.toSave.enityName;
            var reportSettings = $scope.toSave.reportSettings;
            var promises = [];
            //var reportSetting= [];
            angular.forEach($scope.toSave.reportSettings, function (report, i) {
                var obj = {
                    "reportSettingsGUID": report.reportSettingsGUID,
                    "companyGUID": report.companyGUID,
                    "reportType": report.reportType,
                    "fee": report.fee, //self.reportFee[report.templateIndex],
                    "showInPolicy": report.showInPolicy ? report.showInPolicy : false,
                    "showInProcurement": report.showInProcurement ? report.showInProcurement : false,
                    "templateGUID": report.templateGUID ? report.templateGUID : null,
                    "isEnabled": report.isEnabled ? report.isEnabled : false
                }
                requestReportSettings.push(obj);
            })
            var requestReportObj = {
                "reportSettings": requestReportSettings
            };
            var promise = CompanyServiceAPI.updateReportSettings(companyGUID, requestReportObj);
            promise.then(function (resp) {
                self.showReportMsg = true;
                if (resp.length == 0) {
                    var promiseGetReportSettings = CompanyServiceAPI.getCompReportSettings(self.existingCompanyData.companyGUID, "vendors");
                    self.alertClassReports = 'alert-success';
                    self.reportMsg = "Service groups and reports updated successfully for company: '" + $scope.toSave.enityName + "'";
                    promiseGetReportSettings.then(function (respReportSettings) {
                        if (respReportSettings.reportSettings) {
                            self.existingCompanyData.reportSettings = respReportSettings.reportSettings;
                            assignReportSettings();
                        }
                    })
                } else {
                    self.alertClassReports = 'alert-danger';
                    self.showReportMsg = true;
                    self.reportMsg = "Sorry. We encountered a problem while processing your request. Please try again.";
                    if (resp.data.message)
                        self.reportMsg = resp.data.message.userMessage;
                }
                $modalInstance.close();
            })
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.showReportVendors = function (reportSettingsGUID, templateIndex) {
        //modifyCompAssociationJSON();
        self.reportVendorsList = self.existingCompanyData.companyAssociations;
        var currentReportTypeData = self.reportSettings.filter(function (item) {
            return item.reportSettingsGUID == reportSettingsGUID
        })[0];
        var modalContainer = {
            enityType: 'report group and services',
            companyGUID: self.existingCompanyData.companyGUID,
            enityName: self.existingCompanyData.name,
            reportVendorsList: self.reportVendorsList,
            currentReportSettingsGUID: reportSettingsGUID,
            currentReportTypeData: currentReportTypeData,
            currentReportTemplateIndex: templateIndex
        }
        var modalInstance = $modal.open({
            templateUrl: "update-report-vendors-confirmation-modal.html",
            scope: $scope,
            controller: reportVendorsSaveCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        })
    }

    var reportVendorsSaveCtrl = function ($scope, $modalInstance, data) {
        $scope.modalContent = {
            enityType: data.enityType,
            companyGUID: data.companyGUID,
            enityName: data.enityName,
            reportVendorsList: data.reportVendorsList, //Comp-Associations
            currentReportSettingsGUID: data.currentReportSettingsGUID,
            currentReportTypeData: data.currentReportTypeData,
            currentReportTemplateIndex: data.currentReportTemplateIndex,
            showMsg: true
                //filterType: ['Environmental', 'Appraisal']
        };
        $scope.funFilterType = function (value, index) {
            //Only show for Environmental/Appraisal
            return value.associationType && ['Environmental', 'Appraisal'].indexOf(value.associationType) !== -1;
        }
        $scope.selectedReportVendor = {};
        angular.forEach($scope.modalContent.currentReportTypeData.vendors, function (vendor, i) {
            angular.forEach(vendor.reportSettingsVendorUsers, function (vendorUser, j) {
                $scope.selectedReportVendor[vendorUser.userGUID] = true;
            })
        })
        $scope.afterUpdate = {
            showMsg: false,
            msgAfterUpdate: "Saved",
        };
        $scope.updateEntity = function () {
                var assigned = [],
                    unassigned = [];

                var companyGUID = $scope.modalContent.companyGUID;
                var name = $scope.modalContent.enityName;
                var currentReportTypeData = $scope.modalContent.currentReportTypeData;

                var count = 0;
                angular.forEach($scope.modalContent.reportVendorsList, function (reportVendorAssoc, i) {
                        //iterating first vendor of company associations
                        var assignedVendorUsers = [],
                            unassignedVendorUsers = [];
                        if (count < Object.keys($scope.selectedReportVendor).length) {
                            //Object.keys($scope.selectedReportVendor).length
                            //iterate companyAssociationUsers under particular companyAssociation
                            angular.forEach(reportVendorAssoc.companyAssociationUsers, function (user) {
                                    var checkedVendorUser = $scope.selectedReportVendor[user.userGUID];
                                    var isExistUser = null;
                                    if (currentReportTypeData.vendors && currentReportTypeData.vendors.length > 0) {
                                        for (var j = 0; j < currentReportTypeData.vendors.length; j++) {
                                            isExistUser = currentReportTypeData.vendors[j].reportSettingsVendorUsers.filter(function (item) {
                                                return item.userGUID == user.userGUID
                                            })[0];
                                            if (isExistUser)
                                                break;
                                        }
                                    }

                                    if (checkedVendorUser != undefined) {
                                        if (checkedVendorUser) {
                                            if (!isExistUser) {
                                                var vendorUserObjAssigned = {
                                                    //"vendorCompanyGUID": reportVendorAssoc.companyGUID,
                                                    "userGUID": user.userGUID
                                                }
                                                assignedVendorUsers.push(vendorUserObjAssigned);
                                            }
                                        } else {
                                            if (isExistUser && isExistUser.companyReportVendorUserGUID) {
                                                var vendorUserObjUnassigned = {
                                                    "companyreportvendoruserguid": isExistUser.companyReportVendorUserGUID
                                                }
                                                unassignedVendorUsers.push(vendorUserObjUnassigned);
                                            }
                                        }
                                        count++;
                                    }
                                }) //end of forEach(companyAssociations-companyAssociationUsers)
                            var vendorObj = {
                                "vendorCompanyGUID": reportVendorAssoc.companyGUID,
                                "reportSettingsVendorUsers": assignedVendorUsers
                            }
                            if (assignedVendorUsers.length > 0) {
                                assigned.push(vendorObj);
                            }
                            if (unassignedVendorUsers.length > 0) {
                                //check for all users under same vendorcompanyguid are unassigned then only pass reportVendorGUID else-wise pass vendorCompanyGUID
                                var isAllUsersUnchecked = true;
                                for (var j = 0; j < currentReportTypeData.vendors.length; j++) {
                                    if (currentReportTypeData.vendors[j].vendorGUID == reportVendorAssoc.companyGUID) {
                                        for (var k = 0; k < currentReportTypeData.vendors[j].reportSettingsVendorUsers.length; k++) {
                                            var userIsUnchecked = unassignedVendorUsers.filter(function (item) {
                                                return item.userGUID == currentReportTypeData.vendors[j].reportSettingsVendorUsers[k].userGUID
                                            })[0];
                                            if (!userIsUnchecked) {
                                                isAllUsersUnchecked = false;
                                                break;
                                            }
                                        }
                                        var vendorObj = {
                                            "reportSettingsVendorUsers": unassignedVendorUsers
                                        }
                                        if (isAllUsersUnchecked) {
                                            vendorObj['reportVendorGUID'] = reportVendorAssoc.reportVendorGUID;
                                        } else {
                                            vendorObj['vendorCompanyGUID'] = reportVendorAssoc.companyGUID;
                                        }

                                    }
                                } //end of for
                                unassigned.push(vendorObj);
                            } //end of if(unassignedVendorUsers)
                        } // end of if(count < Object.keys($scope.selectedReportVendor).length)
                    }) // end of forEach(reportVendorList/companyAssociations)

                var requestVendorsObj = {
                    "vendors": {
                        "assigned": assigned,
                        "unassigned": unassigned
                    }
                }
                if (assigned.length > 0 || unassigned.length > 0) {

                    var promise = CompanyServiceAPI.updateReportVendors($scope.modalContent.companyGUID, $scope.modalContent.currentReportSettingsGUID, requestVendorsObj);
                    promise.then(function (respVendors) {
                        self.showReportVendorMsg = true;
                        if (respVendors.vendors) {
                            self.alertClassReportsVendor = "alert-success";
                            self.reportVendorMsg = "The vendor user list has been updated for report type: " + $scope.modalContent.currentReportTypeData.reportType;
                            //                        var promiseGetRprtSettg = CompanyServiceAPI.getCompReportSettings($scope.modalContent.companyGUID, "vendors", $scope.modalContent.currentReportSettingsGUID);
                            var promiseGetRprtVendors = CompanyServiceAPI.getCompReportVendors($scope.modalContent.companyGUID, $scope.modalContent.currentReportSettingsGUID, "vendorusers");
                            promiseGetRprtVendors.then(function (respReportSettg) {
                                //                            if (respReportSettg.reportSettings) {
                                if (respReportSettg && !respReportSettg.message) {
                                    //                                $scope.modalContent.currentReportTypeData.vendors = respReportSettg.reportSettings[0].vendors;
                                    $scope.modalContent.currentReportTypeData.vendors = respReportSettg.vendors;
                                    self.reportSettings[$scope.modalContent.currentReportTemplateIndex].vendors = respReportSettg.vendors;
                                }
                            })
                        } else {
                            self.alertClassReportsVendor = "alert-danger";
                            self.reportVendorMsg = "Sorry. We encountered a problem while processing your request. Please try again.";
                            if (respVendors.data.message)
                                self.reportVendorMsg = respVendors.data.message.userMessage;
                        }
                        $modalInstance.close();
                    })
                } else {
                    self.showReportVendorMsg = true;
                    self.alertClassReportsVendor = "alert-success";
                    self.reportVendorMsg = "The vendor user list has been updated for report type: " + $scope.modalContent.currentReportTypeData.reportType;
                    $modalInstance.close();
                }
            } //end of updateEntity function
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    function isUUIDGUID(id) {
        if (id != undefined && id != '') {
            var isGUID = id.match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i');
            return isGUID;
        } else {
            return false;
        }
    }
    
    $timeout(function () {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    });

}]);;angular.module('AccountMgmtModule').controller('EntityDeleteController', ['$rootScope', '$scope', '$modalInstance', '$location', '$timeout', '$state', 'deleteModalParams', 'CompanyServiceAPI', 'OfficeServiceAPI', 'UserServiceAPI', function ($rootScope, $scope, $modalInstance, $location, $timeout, $state, deleteModalParams, CompanyServiceAPI, OfficeServiceAPI, UserServiceAPI) {       

    this.enityType = (deleteModalParams.entitytype == "parent-company") ? "company" : deleteModalParams.entitytype;
    this.enityName = deleteModalParams.entityname;

    function handleShowMessages(data, redirectState, redirectStateParams) {
        if(data.length == 0) {
            if($state.current.name != redirectState) {
                $rootScope.skipMsgClear = true;
                $state.go(redirectState, redirectStateParams);
            }
            else {
                $rootScope.skipMsgClear = true;
                $state.reload();
            }
            
            $rootScope.alertClass = 'alert-success';
            $rootScope.userMessage = deleteModalParams.entityname + " deleted successfully.";
        } else {
            $rootScope.alertClass = 'alert-danger';
            $rootScope.userMessage = "Error: Failed to delete " + deleteModalParams.entityname + " " + deleteModalParams.entitytype;
        }
        $modalInstance.close();
        if($rootScope.skipMsgClear) {
            $timeout(function () {
                $('#backStateArrow').trigger('click');
            }, 100);
        }
    }

    this.deleteEntityConfirm = function () {
        switch (deleteModalParams.entitytype) {
        case "parent-company":
            CompanyServiceAPI.deleteCompany(deleteModalParams.companyguid).then(function (response) {                
                handleShowMessages(response, 'accountMgmt.company.parentcompanieslist', {});                
            });
            break;
        case "company":
            CompanyServiceAPI.deleteCompany(deleteModalParams.companyguid).then(function (response) {                
                handleShowMessages(response, 'accountMgmt.company.list', {companyguid:deleteModalParams.companyguid});
            });
            break;
        case "office":
            OfficeServiceAPI.deleteOffice(deleteModalParams.companyguid, deleteModalParams.officeguid).then(function (response) {
                handleShowMessages(response, 'accountMgmt.office.list', {companyguid:deleteModalParams.companyguid});
            });
            break;
        case "user":
            UserServiceAPI.deleteuser(deleteModalParams.userguid).then(function (response) {
                handleShowMessages(response, 'accountMgmt.user.list', {companyguid:deleteModalParams.companyguid, officeguid:deleteModalParams.officeguid});
            });
            break;
        }
    }

    this.closeModal = function () {
        $modalInstance.close();
    }
}]);angular.module('AccountMgmtModule').controller('GridController', ['$scope', '$state', '$timeout', '$modal', 'data', 'gridColumns', function ($scope, $state, $timeout, $modal, data, gridColumns) {

    this.gridData = data.gridData;
    this.gridColumns = gridColumns;
    this.entityType = data.gridDataType;
    this.linkToAdd = data.linkToAddEntity;
    this.umbrellaCompanyGUID = $state.params.companyguid;
    this.isChildCompany = ('isChildCompany' in data) ? data.isChildCompany : false;
    self = this;

    //Enable UploadUserSpreadSheet for Office
    this.showUserSpreadsheet = (this.entityType.toLowerCase() == 'user' && $state.params.officeguid) ? true : false;
    this.entityType = (this.entityType.toLowerCase() == 'parentcompany') ? "Company" : this.entityType;

    $timeout(function () {
        $(document).ready(function () {
            var AccountMgmtDatatable = $('#AccountMgmtDatatable').DataTable({
                "dom": '<"pull-left"i><"pull-right"p><"pull-left col-sm-5"f>t<"pull-right"p>',
                "data": self.gridData,
                "pagingType": "simple_numbers",
                "retrieve": true,
                "language": {
                    "info": "<b>Showing _START_ - _END_ of _TOTAL_ records</b>",
                    "infoFiltered": "<br><i>(filtered from _MAX_ total records)</i>"
                },
                "pageLength": 30,
                "columnDefs": self.gridColumns
            });

            $('#entitySearch').on('keyup', function () {
                AccountMgmtDatatable.search(this.value).draw();
            });
        });
    });

    $('#AccountMgmtDatatable').on('click', 'a.link-delete', function (e) {
        e.preventDefault();
        var linkDelete = this;
        $modal.open({
            templateUrl: 'delete-confirmation-modal.html',
            controller: 'EntityDeleteController as deleteModalInst',
            resolve: {
                deleteModalParams: function () {
                    return $(linkDelete).data();
                }
            }
        });
    })

    self.uploadUsers = function () {
        $modal.open({
            templateUrl: 'upload-user-modal.html',
            controller: 'UserUploadController as userUploadCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                uploadModalParams: function () {
                    return null; //self.linkToAdd.officeguid;
                }
            }
        });
    }

}]);"use strict";

angular.module('AccountMgmtModule').controller('NavController', ['$rootScope', '$scope', '$state', '$stateParams', 'data', '$timeout', 'CompanyServiceAPI', 'OfficeServiceAPI', function ($rootScope, $scope, $state, $stateParams, data, $timeout, CompanyServiceAPI, OfficeServiceAPI) {
    var self = this;
    var arr = [],
        mapRecordGuid = "",
        modelVal = {},
        pushObj = {},
        parentCompanyGuid = "",
        listStates = ["accountMgmt.company.parentcompanieslist", "accountMgmt.company.list", "accountMgmt.office.list", "accountMgmt.user.list"],
        newEntityStates = ["accountMgmt.company.new", "accountMgmt.office.new", "accountMgmt.user.new"];

    $scope.showNavs = false;
    $scope.backTracedCompanies = [];
    $scope.navigations = [];
    $rootScope.backArrowState = false;
    $rootScope.parentEntityName = "";

    function setBackArrowState(guid, navArr) {
        for (var i = 0; i < navArr.length; i++) {
            if (navArr[i].model.guid) {
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
                    } else {
                        $rootScope.backArrowState = "#/accounts/company/list?companyguid=" + navArr[i + 1].model.guid;
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

    function backTraceParentCompanies(guid) {
        $rootScope.promise = CompanyServiceAPI.getCompany(guid).then(function (response) {
            if (!('data' in response)) {
                if (response.companies && response.companies.length > 0) {
                    $scope.backTracedCompanies.push({
                        "records": response.companies[0].companies,
                        "mapTo": mapRecordGuid
                    });
                    if (response.companies[0].parentCompanyGUID) {
                        mapRecordGuid = response.companies[0].companyGUID;
                        parentCompanyGuid = response.companies[0].parentCompanyGUID;
                        backTraceParentCompanies(response.companies[0].parentCompanyGUID);
                    } else {
                        $rootScope.promise = CompanyServiceAPI.getCompany(null, null, 'companies', null, false).then(function (results) {
                            if (parentCompanyGuid == "" && $scope.backTracedCompanies.records == undefined) {
                                parentCompanyGuid = $stateParams.companyguid;
                            }

                            $scope.backTracedCompanies.push({
                                "records": results.companies,
                                "mapTo": parentCompanyGuid
                            });

                            modelVal = {
                                "guid": "",
                                "name": "Select a company..."
                            };

                            pushObj = {};

                            for (var i = 0; i < $scope.backTracedCompanies.length; i++) {
                                pushObj = {};
                                arr = [];
                                angular.forEach($scope.backTracedCompanies[i].records, function (d, key) {
                                    pushObj = {
                                        "guid": d["companyGUID"],
                                        "name": d["name"]
                                    };

                                    if ($scope.backTracedCompanies[i].mapTo == d["companyGUID"]) {
                                        modelVal = pushObj;
                                    }

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
                            setBackArrowState(mapRecordGuid, angular.copy($scope.navigations));
                            setParentEntityName(angular.copy($scope.navigations));
                            $scope.navigations.reverse();
                            $scope.showNavs = true;
                            if ($state.current.name == "accountMgmt.company.view" || $state.current.name == "accountMgmt.company.viewParcel" || $state.current.name == "accountMgmt.company.edit") {
                                var index = $scope.navigations.length-1;
                                if (index > -1 && $scope.navigations[index].model.guid.length <= 0) {
                                    $scope.navigations.splice(index, 1);
                                }
                            }
                            prepareSubHeaderTitle();
                        });
                    }
                }
            }
        });
        return;
    }

    //Preparing sub-header according to state
    function prepareSubHeaderTitle() {
        //console.log($scope.navigations[$scope.navigations.length - 1].model);
        var lastNavEntity = "";
        for(var i=0; i<$scope.navigations.length; i++) {
            if ($scope.navigations[i].model.guid.length > 0) {
                lastNavEntity = $scope.navigations[i].model.name;
            } else {
                break;
            }
        }
        //console.log(lastNavEntity);
        switch ($state.current.name) {
        case "accountMgmt.company.parentcompanieslist":
            self.subHeaderTitle = "Viewing parent companies";
            break;
        case "accountMgmt.company.list":
            self.subHeaderTitle = "Viewing " + lastNavEntity + "'s Companies";
            break;
        case "accountMgmt.company.view":
        case "accountMgmt.company.viewParcel":
            if ($stateParams.hasParent == "false")
                self.subHeaderTitle = "Viewing " + lastNavEntity + " Company";
            else
                self.subHeaderTitle = "Viewing " + lastNavEntity + " Company";
            break;
        case "accountMgmt.company.edit":
            if ($stateParams.hasParent == "false")
                self.subHeaderTitle = "Editing " + lastNavEntity + " Company";
            else
                self.subHeaderTitle = "Editing " + lastNavEntity + " Company";
            break;
        case "accountMgmt.office.list":
            self.subHeaderTitle = "Viewing " + lastNavEntity + "'s Offices";
            break;
        case "accountMgmt.office.view":
            self.subHeaderTitle = "Viewing " + lastNavEntity + " Office";
            break;
        case "accountMgmt.office.edit":
            self.subHeaderTitle = "Editing " + lastNavEntity + " Office";
            break;
        case "accountMgmt.user.list":
            self.subHeaderTitle = "Viewing " + lastNavEntity + "'s Users";
            break;
        case "accountMgmt.user.view":
        case "accountMgmt.user.appraiserView":
            self.subHeaderTitle = "Viewing " + lastNavEntity + " User";
            break;
        case "accountMgmt.user.edit":
            self.subHeaderTitle = "Editing " + lastNavEntity + " User";
            break;
        default:
            self.subHeaderTitle = "";
        }
    }

    function init() {
        if ($state.$current.parent.name == 'accountMgmt.user') {
            $rootScope.promise = OfficeServiceAPI.getOfficeData($stateParams.companyguid, $stateParams.officeguid, "", "users").then(function (response) {
                if (!('data' in response)) {
                    if (response.offices && response.offices.length > 0) {
                        modelVal = {
                            "guid": "",
                            "name": "Select a user..."
                        };
                        pushObj = {};
                        arr = [];
                        angular.forEach(response.offices[0].users, function (d, key) {
                            pushObj = {
                                "guid": d["userGUID"],
                                "name": d["lastName"] + ", " + d["firstName"]
                            };

                            if ($stateParams.userguid == d["userGUID"]) {
                                modelVal = pushObj;
                            }

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
                }
            });
        }

        if ($state.$current.parent.name == 'accountMgmt.office' || $state.$current.parent.name == 'accountMgmt.user') {
            $rootScope.promise = CompanyServiceAPI.getCompany($stateParams.companyguid).then(function (response) {
                if (!('data' in response)) {
                    if (response.companies && response.companies.length > 0) {
                        modelVal = {
                            "guid": "",
                            "name": "Select a office..."
                        };
                        pushObj = {};
                        arr = [];
                        //arr.push(modelVal);
                        angular.forEach(response.companies[0].offices, function (d, key) {
                            pushObj = {
                                "guid": d["companyOfficeGUID"],
                                "name": d["officeName"]
                            };

                            if ($stateParams.officeguid == d["companyOfficeGUID"]) {
                                modelVal = pushObj;
                            }

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
                }
            });
        }

        if ($stateParams.companyguid != "none")
            backTraceParentCompanies($stateParams.companyguid);
    }

    init();


    // State transition on entity selection
    self.transitionOnSelect = function (selectedEntityGuid, navControlType) {
        var transitionObj = {},
            elemVal = selectedEntityGuid,
            transitionState = "";

        if (navControlType.toLowerCase() == 'company') {
            CompanyServiceAPI.getCompany(elemVal, '', 'companies').then(function (response) {
                if (response.companies) {
                    if (response.companies[0].companies && response.companies[0].companies.length > 0) {
                        if ($state.$current.parent.name == "accountMgmt.company")
                            transitionState = (listStates.indexOf($state.current.name) >= 0) ? "accountMgmt.company.list" : $state.current.name;
                        else
                            transitionState = "accountMgmt.company.list";
                        
                        $state.go(transitionState, {
                            companyguid: elemVal
                        });
                    } else {
                        if ($state.current.name == "accountMgmt.company.list" || $state.current.name == "accountMgmt.company.parentcompanieslist") {
                            $state.go("accountMgmt.office.list", {
                                companyguid: elemVal
                            });
                        } else {
                            $state.go($state.current.name, {
                                companyguid: elemVal
                            });
                        }
                    }
                }
            });
        } else if (navControlType.toLowerCase() == 'office') {
            if ($state.current.parent == "accountMgmt.office")
                transitionState = (listStates.indexOf($state.current.name) >= 0) ? "accountMgmt.user.list" : $state.current.name;
            else
                transitionState = "accountMgmt.user.list";

            $state.go(transitionState, {
                companyguid: $stateParams.companyguid,
                officeguid: elemVal
            });
        } else if (navControlType.toLowerCase() == 'user') {
            if ($state.current.parent == "accountMgmt.user")
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
}]);;angular.module('AccountMgmtModule').controller('NavigationController', ['$rootScope', '$scope', '$state', '$stateParams', 'data', 'parentCompanies', 'companies', 'offices', 'users', 'CompanyServiceAPI', '$timeout', function ($rootScope, $scope, $state, $stateParams, data, parentCompanies, companies, offices, users, CompanyServiceAPI, $timeout) {
    $scope.navigations = [];
    var arr = [];
    var dataTypeGuidAlise, dataTypeNameAlise, defaultSelection, title, modelVal, parentcompanyguid, transitionState, attachedParam;

    function init() {
        if (parentCompanies) {
            arr = [];
            modelVal = {
                "guid": "",
                "name": "Select a Company..."
            };
            transitionState = "accountMgmt.company.list";
            attachedParam = 'parentcompanyguid';

            //arr.push(modelVal);

            parentcompanyguid = ($stateParams.parentcompanyguid == 'none') ? $stateParams.companyguid : $stateParams.parentcompanyguid;

            if ($state.current.name != 'accountMgmt.company.list' && $state.$current.parent.name == 'accountMgmt.company') {
                transitionState = $state.current.name;
                if ($stateParams.parentcompanyguid == 'none') {
                    companies = false;
                    attachedParam = 'companyguid';
                }
            }

            angular.forEach(parentCompanies, function (company, key) {
                if (parentcompanyguid == company.companyGUID) {
                    modelVal = {
                        "guid": company.companyGUID,
                        "name": company.name
                    };
                    $rootScope.parentCompanyCrumbTitle = company.name;
                    this.splice(0, 1);
                }

                this.push({
                    "guid": company.companyGUID,
                    "name": company.name
                });

            }, arr);

            $scope.navigations.push({
                "title": "Company",
                "model": modelVal,
                "options": arr,
                "transitionToState": transitionState,
                "attachedParam": attachedParam,
                "navigationState": "accountMgmt.company.parentcompanieslist"
            });
        }

        if (companies) {
            arr = [];
            transitionState = "accountMgmt.office.list";

            modelVal = {
                "guid": "",
                "name": "Select a Company..."
            };
            arr.push(modelVal);

            angular.forEach(companies, function (company, key) {
                if ($stateParams.companyguid == company.companyGUID) {
                    modelVal = {
                        "guid": company.companyGUID,
                        "name": company.name,
                        "parentCompanyGUID": company.parentCompanyGUID
                    };
                    $rootScope.companyCrumbTitle = company.name;
                    this.splice(0, 1);
                }

                this.push({
                    "guid": company.companyGUID,
                    "name": company.name
                });

            }, arr);

            if ($state.current.name != 'accountMgmt.company.list' && $state.$current.parent.name == 'accountMgmt.company') {
                transitionState = $state.current.name;
            }

            if(modelVal.parentCompanyGUID) {
                var parentCompaniesTraced = backTraceParentCompanies(modelVal.parentCompanyGUID, []);
            }

            $scope.navigations.push({
                "title": "Company",
                "model": modelVal,
                "options": arr,
                "transitionToState": transitionState,
                "attachedParam": "companyguid",
                "navigationState": "accountMgmt.company.list"
            });
        } else {
            if (parentCompanies) {
                $rootScope.companyCrumbTitle = $rootScope.parentCompanyCrumbTitle;
                if ($state.current.name == 'accountMgmt.company.list') {
                    $state.get('accountMgmt.company.list').breadcrumb.skip = false;
                }
            }
        }

        if (offices) {
            arr = [];
            transitionState = "accountMgmt.user.list";

            modelVal = {
                "guid": "",
                "name": "Select a Office..."
            };
            //arr.push(modelVal);

            angular.forEach(offices, function (office, key) {
                if ($stateParams.officeguid == office.companyOfficeGUID) {
                    modelVal = {
                        "guid": office.companyOfficeGUID,
                        "name": office.officeName
                    };
                    $rootScope.officeCrumbTitle = office.officeName;
                    this.splice(0, 1);
                }

                this.push({
                    "guid": office.companyOfficeGUID,
                    "name": office.officeName
                });

            }, arr);

            if ($state.current.name != 'accountMgmt.office.list' && $state.$current.parent.name == 'accountMgmt.office') {
                transitionState = $state.current.name;
            }

            $scope.navigations.push({
                "title": "Office",
                "model": modelVal,
                "options": arr,
                "transitionToState": transitionState,
                "attachedParam": "officeguid",
                "navigationState": 'accountMgmt.office.list'
            });
        }

        if (users) {
            arr = [];
            transitionState = "accountMgmt.user.list";

            modelVal = {
                "guid": "",
                "name": "Select a User..."
            };
            //arr.push(modelVal);

            angular.forEach(users, function (user, key) {
                if ($stateParams.userguid == user.userGUID) {
                    modelVal = {
                        "guid": user.userGUID,
                        "name": user.lastName + ', ' + user.firstName
                    };
                    $rootScope.userCrumbTitle = user.lastName + ', ' + user.firstName;
                    this.splice(0, 1);
                }

                this.push({
                    "guid": user.userGUID,
                    "name": user.lastName + ', ' + user.firstName
                });

            }, arr);

            if ($state.current.name != 'accountMgmt.user.list' && $state.$current.parent.name == 'accountMgmt.user') {
                transitionState = $state.current.name;
            }

            $scope.navigations.push({
                "title": "User",
                "model": modelVal,
                "options": arr,
                "transitionToState": transitionState,
                "attachedParam": "userguid",
                "navigationState": 'accountMgmt.user.list'
            });
        }

        if (data) {
            arr = [];

            switch (data.gridDataType) {
            case "ParentCompany":
                title = "Company";
                dataTypeGuidAlise = "companyGUID";
                dataTypeNameAlise = "name";
                defaultSelection = "Select a Company...";
                transitionState = "accountMgmt.company.list";
                attachedParam = "parentcompanyguid";
                break;
            case "Company":
                title = data.gridDataType;
                dataTypeGuidAlise = "companyGUID";
                dataTypeNameAlise = "name";
                defaultSelection = "Select a Company...";
                transitionState = "accountMgmt.office.list";
                attachedParam = "companyguid";
                break;
            case "Office":
                title = data.gridDataType;
                dataTypeGuidAlise = "companyOfficeGUID";
                dataTypeNameAlise = "officeName";
                defaultSelection = "Select a Office...";
                transitionState = "accountMgmt.user.list";
                attachedParam = "officeguid";
                break;
            case "User":
                title = data.gridDataType;
                dataTypeGuidAlise = "userGUID";
                dataTypeNameAlise = "userName";
                defaultSelection = "Select a User...";
                transitionState = "accountMgmt.user.view";
                attachedParam = "userguid";
                break;
            }

            modelVal = {
                "guid": "",
                "name": defaultSelection
            };
            //arr.push(modelVal);
            var pushObj = {};
            angular.forEach(data.gridData, function (d, key) {
                if (dataTypeGuidAlise == "userGUID") {
                    pushObj = {
                        "guid": d[dataTypeGuidAlise],
                        "name": d.lastName + ', ' + d.firstName
                    };
                } else {
                    pushObj = {
                        "guid": d[dataTypeGuidAlise],
                        "name": d[dataTypeNameAlise]
                    };
                }
                if ($stateParams[dataTypeGuidAlise.toLowerCase()] == d[dataTypeGuidAlise]) {
                    modelVal = pushObj;
                    this.splice(0, 1);
                }

                this.push(pushObj);

            }, arr);

            $scope.navigations.push({
                "title": title,
                "model": modelVal,
                "options": arr,
                "transitionToState": transitionState,
                "attachedParam": attachedParam,
                "navigationState": $state.current.name
            });
        }

        // Setting back state by observing navigation array
        var currentStateSplit = $state.current.name.split('.');
        var backState;
        if ($scope.navigations.length > 1 || currentStateSplit[currentStateSplit.length - 1] == ["new"]) {
            //Need to set $rootScope.backArrowState on new entity state to apply it on cancel button
            if (currentStateSplit[currentStateSplit.length - 1] == ["new"]) {
                if ($state.current.name == "accountMgmt.company.new")
                    backState = $state.get("accountMgmt.company.parentcompanieslist");
                else
                    backState = $state.get(currentStateSplit[0] + "." + currentStateSplit[1] + "." + "list");
            }
            //Redirect on list state if user hit up arrow from edit or view state
            else {
                if (currentStateSplit[currentStateSplit.length - 1] == ["view"] || currentStateSplit[currentStateSplit.length - 1] == ["viewParcel"] || currentStateSplit[currentStateSplit.length - 1] == "edit")
                    backState = $state.get($scope.navigations[$scope.navigations.length - 1].navigationState);
                else
                    backState = $state.get($scope.navigations[$scope.navigations.length - 2].navigationState);
            }

            var paramArr = [];

            if (backState.url.split('?').length > 1)
                paramArr = backState.url.split('?')[1].split('&');

            var parmString = "";
            var backStateHref = "#/accounts";

            for (var i = 0; i < paramArr.length; i++) {
                if (paramArr[i] in $stateParams) {
                    parmString += paramArr[i] + "=" + $stateParams[paramArr[i]];
                    if (i != $scope.navigations.length)
                        parmString += "&";
                }
            }

            if (parmString.length > 0)
                backStateHref = "#" + backState.url.split('?')[0] + "?" + parmString;

            $rootScope.backArrowState = backStateHref;

        } else {
            $rootScope.backArrowState = ($scope.navigations.length == 1 && $state.current.name != 'accountMgmt.company.parentcompanieslist') ? "#/accounts" : false;
            //$rootScope.backArrowState = false;
        }

        //Preparing sub-header according to state
        switch ($state.current.name) {
        case "accountMgmt.company.parentcompanieslist":
            this.subHeaderTitle = "Viewing parent companies";
            break;
        case "accountMgmt.company.list":
            this.subHeaderTitle = "Viewing " + $rootScope.parentCompanyCrumbTitle + "'s Companies";
            break;
        case "accountMgmt.company.view":
        case "accountMgmt.company.viewParcel":
            if ($stateParams.hasParent == "false")
                this.subHeaderTitle = "Viewing " + $rootScope.parentCompanyCrumbTitle + " Company";
            else
                this.subHeaderTitle = "Viewing " + $rootScope.companyCrumbTitle + " Company";
            break;
        case "accountMgmt.company.edit":
            if ($stateParams.hasParent == "false")
                this.subHeaderTitle = "Editing " + $rootScope.parentCompanyCrumbTitle + " Company";
            else
                this.subHeaderTitle = "Editing " + $rootScope.companyCrumbTitle + " Company";
            break;
        case "accountMgmt.office.list":
            this.subHeaderTitle = "Viewing " + $rootScope.companyCrumbTitle + "'s Offices";
            break;
        case "accountMgmt.office.view":
            this.subHeaderTitle = "Viewing " + $rootScope.officeCrumbTitle + " Office";
            break;
        case "accountMgmt.office.edit":
            this.subHeaderTitle = "Editing " + $rootScope.officeCrumbTitle + " Office";
            break;
        case "accountMgmt.user.list":
            this.subHeaderTitle = "Viewing " + $rootScope.officeCrumbTitle + "'s Users";
            break;
        case "accountMgmt.user.view":
        case "accountMgmt.user.appraiserView":
            this.subHeaderTitle = "Viewing " + $rootScope.userCrumbTitle + " User";
            break;
        case "accountMgmt.user.edit":
            this.subHeaderTitle = "Editing " + $rootScope.userCrumbTitle + " User";
            break;
        default:
            this.subHeaderTitle = "";
        }
    }
    
    function backTraceParentCompanies (guid, companies) {
        //var companies = [];
        CompanyServiceAPI.getCompany(guid).then(function (response) {
            if(!('data' in response)) {
                if(response.companies && response.companies.length > 0) {
                    companies.push(response.companies[0].companies);
                    if(response.companies[0].parentCompanyGUID) {
                        backTraceParentCompanies(response.companies[0].parentCompanyGUID);
                    }
                }
            }
        });
        return companies;
    }
    
    init();

    // State transition on entity selection
    this.transitionOnSelect = function (controlId) {
        var transitionObj = {};
        var elem = $('#' + controlId);
        var transitiontostate = elem.data('transitiontostate');
        var transitionState = $state.get(transitiontostate);
        var paramArr = transitionState.url.split('?')[1].split('&');
        var attachedParam = elem.data('attachedparam');
        var elemVal = elem.val();

        for (var i = 0; i < paramArr.length; i++) {
            if (attachedParam == paramArr[i]) {
                // Need to land user on office list screen if there are no child companies
                if (transitiontostate == "accountMgmt.company.list") {
                    CompanyServiceAPI.getCompany(elemVal).then(function (result) {
                        if (!result.companies[0].companies.length) {
                            transitiontostate = "accountMgmt.office.list";
                            transitionObj = {
                                parentcompanyguid: "none",
                                companyguid: result.companies[0].companyGUID
                            }
                            $state.go(transitiontostate, transitionObj);
                        }
                    });
                }

                transitionObj[paramArr[i]] = elemVal;

            } else if (paramArr[i] in $stateParams) {
                transitionObj[paramArr[i]] = $stateParams[paramArr[i]];
            } else {
                transitionObj = false;
            }
        }

        if (transitionObj)
            $state.go(transitiontostate, transitionObj);
        else
            $state.go(transitiontostate);
    }
}]);;angular.module('AccountMgmtModule').controller('OfficeController', ['$rootScope', '$scope', '$state', '$location', '$timeout', 'officeData', 'getCountriesAPI', 'getStatesAPI', 'geocodeService', 'OfficeServiceAPI', function ($rootScope, $scope, $state, $location, $timeout, officeInfo, getCountriesAPI, getStatesAPI, geocodeService, OfficeServiceAPI) {
    this.isEditOffice = false;
    this.submitBtnText = 'Submit';
    this.officeLocation = {};
    this.mapZoom = 3;

    //Query Params
    this.companyguid = $location.search().companyguid;
    this.officeguid = $location.search().officeguid;

    var geocodeParams = {};


    getBillingContactUser = function (officeInfo, userGuid) {
        if (officeInfo.users) {
            for (var i = 0; i < officeInfo.users.length; i++) {
                if (officeInfo.users[i].userGUID == userGuid)
                    return officeInfo.users[i];
            }
        }
        return {};
    }

    setCountry = function (selectedContryCode, from) {
        var officeCountryPromise = getCountriesAPI.getCountryByCountryCode(selectedContryCode);
        officeCountryPromise.then(function (data) {
            $scope.selectedCountry = data;
            if (from == "fromWatch") {
                $timeout(function () {
                    angular.element('#countrySelect').trigger('change');
                });
            }
        }, function (error) {

        });
    }

    setState = function (selectedContryCode, selectedStateCode) {
        var officeStatePromise = getStatesAPI.getStateByStateCode(selectedContryCode, selectedStateCode);
        officeStatePromise.then(function (data) {
            $scope.selectedState = data;
        }, function (error) {

        });
    }

    setOfficeLocation = function (geocodeParams) {
        $rootScope.promise = geocodeService.geocode(geocodeParams).then(function (geocodeResult) {
            if (geocodeResult.addressResults !== undefined) {
                var countryCode = geocodeResult.addressResults.addresses[0].countryCode;
                $scope.officeCtrl.officeLocation.latitude = geocodeParams.latitude ? geocodeParams.latitude : geocodeResult.addressResults.addresses[0].latitude;
                $scope.officeCtrl.officeLocation.longitude = geocodeParams.longitude ? geocodeParams.longitude : geocodeResult.addressResults.addresses[0].longitude;
                $scope.officeCtrl.officeLocation.city = geocodeResult.addressResults.addresses[0].city;
                $scope.officeCtrl.officeLocation.zipCode = geocodeResult.addressResults.addresses[0].zipCode;

                $scope.officeCtrl.officeLocation.countryCode = (countryCode != null) ? countryCode : "US";
                $scope.officeCtrl.officeLocation.stateCode = geocodeResult.addressResults.addresses[0].state;

                var inputElements = document.getElementsByName("officeAddEditForm");
                $timeout(function () {
                    angular.element(inputElements).find(':input').trigger('change');
                });

            } else {
                alert("Sorry! We can't locate this place.");
            }
        });
    }

    handleAddEditResponse = function (response, officeName) {
        if (response.office != null || response.office != undefined || response == "") {
            var redirectOfficeguid = (response == "") ? $state.params.officeguid : response.office.companyOfficeGUID;
            $rootScope.alertClass = 'alert-success';
            $rootScope.userMessage = "The '" + officeName + "' office was added successfully.";
            $rootScope.skipMsgClear = true;
            $state.go('accountMgmt.office.view', {
                companyguid: $scope.officeCtrl.companyguid,
                officeguid: redirectOfficeguid
            });
        } else {
            if (response.data.message != null || response.data.message != undefined) {
                $rootScope.alertClass = 'alert-danger';
                $rootScope.userMessage = "Error: " + response.data.message.userMessage;
                $rootScope.skipMsgClear = true;
                window.scrollTo(0, 0);
            } else {
                $rootScope.alertClass = 'alert-danger';
                $rootScope.userMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
            }
        }
    }

    this.isLatLngSet = function () {
        if (this.officeLocation.latitude == "" || parseFloat(this.officeLocation.latitude) == 0)
            return false;

        else if (this.officeLocation.longitude == "" || parseFloat(this.officeLocation.longitude) == 0)
            return false;

        else
            return true;
    }

    if (!!officeInfo) {
        if (officeInfo == "" || officeInfo.data)
            $rootScope.serviceError = true;
        else {
            this.officeInfo = officeInfo.offices[0];
            this.billingContactUser = getBillingContactUser(this.officeInfo, this.officeInfo.billingContactUserGUID);

            this.officeLocation.address = this.officeInfo.address;
            this.officeLocation.addressLine2 = this.officeInfo.addressLine2;
            this.officeLocation.city = this.officeInfo.city;
            this.officeLocation.zipCode = this.officeInfo.zipCode;
            this.officeLocation.latitude = this.officeInfo.latitude;
            this.officeLocation.longitude = this.officeInfo.longitude;
            this.mapZoom = (this.isLatLngSet()) ? 15 : 3;
        }
    } else {
        this.officeInfo = {};
        this.billingContactUser = {};
        $scope.selectedCountryCode = this.officeLocation.countryCode = "US";
        $scope.selectedStateCode = this.officeLocation.stateCode = "";
    }

    if ($state.current.name == 'accountMgmt.office.edit') {
        this.isEditOffice = true;
        this.submitBtnText = 'Update';

        //Set country and state according to office detail
        if (officeInfo.offices) {
            $scope.selectedCountryCode = this.officeLocation.countryCode = officeInfo.offices[0].country;
            $scope.selectedStateCode = this.officeLocation.stateCode = officeInfo.offices[0].state;
        }

        setCountry($scope.selectedCountryCode, "fromInit");
        setState($scope.selectedCountryCode, $scope.selectedStateCode);

        //Setting breadcrumb label on view and edit state
        //$state.current.breadcrumb.label = $rootScope.officeCrumbTitle;
    } else if ($state.current.name == 'accountMgmt.office.new') {
        $scope.selectedCountry = {
            code: "US",
            name: "United States"
        }
    } else {
        if (officeInfo.offices) {
            $scope.selectedCountryCode = this.officeLocation.countryCode = officeInfo.offices[0].country;
            $scope.selectedStateCode = this.officeLocation.stateCode = officeInfo.offices[0].state;
            this.cityStateZip = this.officeInfo.city + ", " + $scope.selectedStateCode + ", " + this.officeInfo.zipCode;
        }
    }

    // Submitting data to edit or add
    this.submitOfficeData = function (form) {
        if (form.$valid) {
            var officeData = {
                "office": {
                    "officeName": this.officeInfo.officeName,
                    "companyGUID": this.companyguid,
                    "address": this.officeLocation.address,
                    "addressLine2": this.officeLocation.addressLine2,
                    "country": $scope.selectedCountry.code,
                    "city": this.officeLocation.city,
                    "state": $scope.selectedState.code,
                    "zipCode": this.officeLocation.zipCode,
                    "latitude": this.officeLocation.latitude,
                    "longitude": this.officeLocation.longitude,
                    "phone": this.officeInfo.phone,
                    "fax": this.officeInfo.fax,
                    "edrAccountNumber": this.officeInfo.edrAccountNumber
                }
            }

            if (this.isEditOffice && this.billingContactUser)
                officeData.office.billingContactUserGUID = this.billingContactUser.userGUID;
            else
                officeData.office.billingContactUserGUID = "";

            if (this.isEditOffice) {
                OfficeServiceAPI.updateOffice(this.companyguid, this.officeguid, officeData).then(function (response) {
                    handleAddEditResponse(response, officeData.office.officeName);
                });
            } else {
                OfficeServiceAPI.createOffice(this.companyguid, officeData).then(function (response) {
                    handleAddEditResponse(response, officeData.office.officeName);
                });
            }
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    this.cancelOfficeCreation = function () {
        $state.go('accountMgmt.office.list', {
            companyguid: $state.params.companyguid
        });
    }

    //Geocoding office address
    this.gecodeOfficeLocation = function () {
        geocodeParams = {
            address1: this.officeLocation.address,
            address2: this.officeLocation.addressLine2,
            city: this.officeLocation.city,
            state: $scope.selectedState.code
        };
        setOfficeLocation(geocodeParams);
    }

    // Watching country code to set select control and restict geocoding withing US & Canada
    $scope.$watch(function (scope) {
            return scope.officeCtrl.officeLocation.countryCode;
        },
        function (newValue, oldValue) {
            var availableCountries = ["US", "CA"]
            if (newValue != oldValue) {
                if (availableCountries.indexOf(newValue) == -1) {
                    $scope.officeCtrl.officeLocation.countryCode = "US";
                    $scope.officeCtrl.officeLocation.city = "";
                    $scope.officeCtrl.officeLocation.zipCode = "";
                    $scope.officeCtrl.officeLocation.latitude = "";
                    $scope.officeCtrl.officeLocation.longitude = "";
                    alert("Sorry! We can't help you outside United States and Canada.")
                } else {
                    setCountry(newValue, "fromWatch");
                }
            }
        }
    );

    //Watching state code to reflect value in state select control
    $scope.$watch(function (scope) {
            return scope.officeCtrl.officeLocation.stateCode;
        },
        function (newValue, oldValue) {
            if (newValue != oldValue) {
                setState($scope.officeCtrl.officeLocation.countryCode, newValue);
            }
        }
    );

    //Watching selectedContry if user manually select to set respective states
    $scope.$watch(function (scope) {
            return scope.selectedCountry;
        },
        function (newValue, oldValue) {
            if (newValue != oldValue && newValue)
                $scope.officeCtrl.officeLocation.countryCode = newValue.code;
        }
    );

    //Watching selectedState for manual selection
    $scope.$watch(function (scope) {
            return scope.selectedState;
        },
        function (newValue, oldValue) {
            if (newValue && oldValue)
                if (newValue.code != oldValue.code)
                    $scope.officeCtrl.officeLocation.stateCode = newValue.code;
        }
    );

    //Watching latitude longitude to call geocoding service    
    $scope.$watchCollection('[officeCtrl.officeLocation.dragendLat, officeCtrl.officeLocation.dragendLng]', function (newValues, oldValues) {
        geocodeParams = {
            latitude: parseFloat($scope.officeCtrl.officeLocation.dragendLat),
            longitude: parseFloat($scope.officeCtrl.officeLocation.dragendLng)
        };
        if (newValues[0] == oldValues[0]) {
            if (newValues[1] != oldValues[1]) {
                setOfficeLocation(geocodeParams);
            }
        } else {
            setOfficeLocation(geocodeParams);
        }
    });

}]);;angular.module('AccountMgmtModule').controller('parcelViewCtrl', ['$rootScope', '$scope', 'CompanyServiceAPI', 'OfficeServiceAPI', '$window', '$modal', '$stateParams', '$window', '$state', '$location', 'companyData', '$timeout', 'ListingsAPI', function ($rootScope, $scope, CompanyServiceAPI, OfficeServiceAPI, $window, $modal, $stateParams, $window, $state, $location, companyData, $timeout, ListingsAPI) {

    var self = this;
    self.cid = $stateParams.companyguid;

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

    self.TsToDate = function (ts, separator) {
        var d = new Date(ts);
        var month = d.getMonth() + 1;
        month = (month / 10 < 1) ? "0" + month : month;
        var day = d.getDate();
        day = (day / 10 < 1) ? "0" + day : day;

        switch (separator) {
        case '-':
            return d.getFullYear() + '-' + month + '-' + day;
            break;
        case '/':
            return d.getFullYear() + '/' + month + '/' + day;
            break;
        default:
            return ts;
        }
    }

    var todayDate = new Date();
    var yyyyddmmDate = self.TsToDate(todayDate, '-');

    $scope.$watchCollection('[parcelCtrl.showAddNewSetupItem, parcelCtrl.showAddNewRate, parcelCtrl.showAddNewDiscount]', function (newValues, oldValues) {
        if (newValues[0] != oldValues[0] && !newValues[0])
            self.cancelAddNewSetupItem();
        if (newValues[1] != oldValues[1] && !newValues[1])
            self.cancelAddNewRate();
        if (newValues[2] != oldValues[2] && !newValues[2])
            self.cancelAddNewDiscount();
    });


    //Code to support Breadcrumb. Author-SWalunj@edrnet.com
    this.parentcompanyguid = "none";
    this.companyguid = $location.search().companyguid;
    //this.hasParent = ($location.search().hasParent) == 'true' ? true : false;
    $state.current.breadcrumb.skip = false;
    $state.current.breadcrumb.label = $rootScope.companyCrumbTitle;
    //if (!this.hasParent) $state.current.breadcrumb.parent = "accountMgmt.company.parentcompanieslist";
    //Code to support Breadcrumb ends here

    //Code to view company Information. Author-SWalunj@edrnet.com
    if (!!companyData && !!companyData.companies) {
        self.companyData = companyData.companies[0];
        $rootScope.parentCompanyCrumbTitle = self.companyData.name;

        // Setting components of company
        var component = self.companyData.applicationComponentType + '(';
        component += self.companyData.companyApplicationComponentItems.map(function (elem) {
            return elem.applicationComponentItemName;
        }).join(", ");
        component += ')'
        self.companyData.component = component;

        // Setting functions of company
        self.companyData.function = self.companyData.companyTypes.map(function (elem) {
            return elem.companyType;
        }).join(", ");

        // Setting Headquarters of company
        if (self.companyData.headquarterCompanyOfficeGUID) {
            if (self.companyData.offices.length > 0) {
                self.compHeadqtr = self.companyData.offices.filter(function (item) {
                    return item.companyOfficeGUID == self.companyData.headquarterCompanyOfficeGUID //compare type or guid
                })[0];
                if (self.compHeadqtr)
                    self.companyData.companyHeadquartersType = self.compHeadqtr.officeName;
            }
        }
        
        self.parentcompanyguid = self.companyData.parentCompanyGUID ? self.companyData.parentCompanyGUID : "none";
    }
    //Code to view company Information ends here

    CompanyServiceAPI.getReportTypes().then(function (resp) {
        self.reportTypes = resp;
    });

    ListingsAPI.getListings("setupfeetypes").then(function (resp) {
        self.setupTypeList = resp.setupFeeTypes;
    });

    self.getReportTemplate = function () {
        CompanyServiceAPI.getCompReportTemplates(self.cid, "", self.pricingAdd.reportType).then(function (resp) {
            self.templates = resp.templates;
        });
    }

    //***************** Setup items section *****************//
    self.setupItemAdd = {
        companyGUID: self.cid,
        setupType: "",
        price: "",
        comments: "",
        enteredBy: "Logged In User"
    }

    drawSetupItemTable();

    function drawSetupItemTable() {
        CompanyServiceAPI.getSetupFees(self.cid).then(function (resp) {
            self.setupItems = resp.setupFees;

            if (self.setupTypeList) {
                for (var i = 0; i < self.setupItems.length; i++) {
                    for (var j = 0; j < self.setupTypeList.length; j++) {
                        if (self.setupItems[i].setupType == self.setupTypeList[j].guid) {
                            self.setupItems[i].setupTypeName = self.setupTypeList[j].name;
                            break;
                        }
                    }
                }
            }

            self.setupItemsCopy = angular.copy(self.setupItems);
            self.editSetupItems = false;
            self.hideSetupItemsOptions = false;
        });
    }

    self.editSetupItemsTable = function () {
        self.editSetupItems = true;
        self.showSetupItemsMsg = false;
        self.hideSetupItemsOptions = true;
        self.showAddNewSetupItem = false;
    }

    self.cancelEditSetupItems = function () {
        self.editSetupItems = false;
        self.showSetupItemsMsg = true;
        self.setupItemsMessage = "Editing was cancelled.";
        self.setupItemsAlertType = "alert-danger";
        self.setupItems = angular.copy(self.setupItemsCopy);
        self.hideSetupItemsOptions = false;
    }

    self.cancelAddNewSetupItem = function () {
        self.setupItemAdd = {
            companyGUID: self.cid,
            setupType: "",
            price: "",
            comments: "",
            enteredBy: "Logged In User"
        }
        self.showAddNewSetupItem = false;
        clearValidationMessages('addSetupForm');
    }

    self.saveNewSetupItem = function (form) {
        if (form.$valid) {
            var newSetupItem = {
                setupFee: self.setupItemAdd
            };
            CompanyServiceAPI.addSetupItem(newSetupItem, self.cid).then(function (resp) {
                if (resp.data && resp.data.rates == null) {
                    self.showSetupItemsMsg = true;
                    self.setupItemsMessage = "Error: Could not add a new setup item. " + resp.data.message.userMessage;
                    self.setupItemsAlertType = "alert-danger";
                } else {
                    self.showSetupItemsMsg = true;
                    self.setupItemsMessage = "The new setup item was added successfully.";
                    self.setupItemsAlertType = "alert-success";
                    self.cancelAddNewSetupItem();
                }
                drawSetupItemTable();
            });
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.updateSetupItems = function (form) {
        if (form.$valid) {
            if (form.$dirty) {
                var items = [];
                var obj = {};
                for (var i = 0; i < self.setupItems.length; i++) {
                    obj = {};
                    obj.setupFeeGUID = self.setupItems[i].setupFeeGUID;
                    obj.setupType = self.setupItems[i].setupType;
                    obj.price = self.setupItems[i].price;
                    obj.comments = self.setupItems[i].comments;
                    obj.enteredBy = self.setupItems[i].enteredBy;
                    items.push(obj);
                }
                CompanyServiceAPI.updateSetupItems({
                    "setupFees": items
                }, self.cid).then(function (resp) {
                    if (resp.data && resp.data.message) {
                        self.showSetupItemsMsg = true;
                        self.setupItemsMessage = "Error: Could not update setup items. " + resp.data.message.userMessage;
                        self.setupItemsAlertType = "alert-danger";
                    } else {
                        self.showSetupItemsMsg = true;
                        self.setupItemsMessage = "Setup items updated successfully.";
                        self.setupItemsAlertType = "alert-success";
                    }
                    drawSetupItemTable();
                });
            } else {
                self.showSetupItemsMsg = true;
                self.setupItemsMessage = "Nothing to update.";
                self.setupItemsAlertType = "alert-danger";
            }
        } else {
            var inputElements = document.getElementsByName('setupTableForm');
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }


    self.deleteSetupItem = function (setupType, setupFeeGUID) {
        setupType = self.setupTypeList.filter(function (item) {
            return item.guid == setupType;
        })[0];
        var modalContainer = {
            enityName: setupType.name,
            enityType: 'setup item',
            setupFeeGUID: setupFeeGUID,
            cid: self.cid
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: setupItemDeleteCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });
    }

    var setupItemDeleteCtrl = function ($scope, $modalInstance, data) {
        $scope.toDelete = {
            enityName: data.enityName,
            enityType: data.enityType,
            showMsg: true
        };
        $scope.deleteEntity = function () {
            var name = $scope.toDelete.enityName;
            var promise = CompanyServiceAPI.deleteSetupFee(data.setupFeeGUID, data.cid);
            promise.then(function (resp) {
                if (resp.data && resp.data.message) {
                    $scope.$parent.parcelCtrl.showSetupItemsMsg = true;
                    $scope.$parent.parcelCtrl.setupItemsMessage = "Error: Could not delete the setup item. " + resp.data.message.userMessage;
                    $scope.$parent.parcelCtrl.setupItemsAlertType = "alert-danger";
                } else {
                    $scope.$parent.parcelCtrl.showSetupItemsMsg = true;
                    $scope.$parent.parcelCtrl.setupItemsMessage = "The setup item was deleted successfully.";
                    $scope.$parent.parcelCtrl.setupItemsAlertType = "alert-success";
                }
                $modalInstance.close();
                drawCurrentPricingTable();
            });
        }
        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.expandChargeDetails = function () {
        if (event.srcElement) elem = event.srcElement;
        else if (event.target) elem = event.target;

        var chargeDetailRow = elem.parentElement.parentElement.nextElementSibling;
        if (chargeDetailRow.className == '')
            chargeDetailRow.className = 'ng-hide';
        else
            chargeDetailRow.className = '';
    }

    self.sendFeesToAbsCtrl = function ($scope, $modalInstance, companyHeadquarterOfficeData) {
        $scope.headquarterOfficeData = {};
        if (companyHeadquarterOfficeData && 'offices' in companyHeadquarterOfficeData) {
            $scope.sendToAbsFormData = angular.copy(companyHeadquarterOfficeData.offices[0]);
        }

        if (self.setupTypeList && self.setupItems) {
            $scope.charges = angular.copy(self.setupTypeList);
            var projectNo = [];
            for (var i = 0; i < $scope.charges.length; i++) {
                for (var j = 0; j < self.setupItems.length; j++) {
                    if ($scope.charges[i].name.localeCompare(self.setupItems[j].setupType) == 0) {
                        $scope.charges[i].isSelected = false;
                        $scope.charges[i].price = self.setupItems[j].price;

                        if (parseInt(self.setupItems[j].price) > 0) {
                            $scope.charges[i].isSelected = true;
                            projectNo.push($scope.charges[i].name);
                        }
                    }
                }
            }
            if (projectNo.length) {
                $scope.sendToAbsFormData.projectNumber = "PARCEL " + projectNo.join('/');
            }
        }

        $scope.submitFeesToAbs = function (form) {
            if (form.$valid) {
                var setupFeeCharges = [];
                var obj = {};
                var sendToAbsData = {};

                if ($scope.charges) {
                    for (var i = 0; i < $scope.charges.length; i++) {
                        obj = {};
                        if ($scope.charges[i].isSelected) {
                            obj.setupFeeGUID = $scope.charges[i].guid;
                            //obj.price = $scope.charges[i].price;
                            setupFeeCharges.push(obj);
                        }
                    }
                }

                if (setupFeeCharges.length) {
                    sendToAbsData.accountNumber = $scope.sendToAbsFormData.edrAccountNumber;
                    sendToAbsData.password = $scope.sendToAbsFormData.edrAccountPassword;
                    sendToAbsData.projectNumber = $scope.sendToAbsFormData.projectNumber;
                    sendToAbsData.poNumber = $scope.sendToAbsFormData.poNumber ? $scope.sendToAbsFormData.poNumber : "";
                    sendToAbsData.contactName = $scope.sendToAbsFormData.contactName;
                    sendToAbsData.contactPhone = $scope.sendToAbsFormData.contactPhone;
                    sendToAbsData.contactAddress = $scope.sendToAbsFormData.address;
                    sendToAbsData.contactCity = $scope.sendToAbsFormData.city;
                    sendToAbsData.contactState = $scope.sendToAbsFormData.state;
                    sendToAbsData.contactZip = $scope.sendToAbsFormData.zipCode;
                    sendToAbsData.setupFees = setupFeeCharges;

                    CompanyServiceAPI.sendInvoice(self.companyguid, sendToAbsData).then(function (response) {
                        $modalInstance.close();
                        if(response.data) {
                            $rootScope.alertClass = 'alert-danger';
                            $rootScope.userMessage = "Error: Unable to send setup fees to ABS. " + response.data.message.userMessage;
                            $rootScope.skipMsgClear = false;
                        } else {
                            $rootScope.alertClass = 'alert-success';
                            $rootScope.userMessage = "Setup Fees are successfully sent to ABS.";
                            $rootScope.skipMsgClear = false;
                        }
                        window.scroll(0,0);
                    });
                } else {
                    $scope.showSendToAbsChargesMsg = true;
                    $scope.sendToAbsChargesClass = "alert-danger";
                    $scope.sendToAbsChargesMessage = "You must select at least one charge to send to ABS.";
                }
            } else {
                var inputElements = document.getElementsByName(form.$name);
                angular.element(inputElements).find('input, select').trigger('blur');
            }
        }

        $scope.closeModal = function () {
            $modalInstance.close();
        }
    }

    self.sendFeesToABS = function () {
            $modal.open({
                templateUrl: 'sendFeesToABS.html',
                scope: $scope,
                controller: self.sendFeesToAbsCtrl,
                size: 'lg',
                resolve: {
                    companyHeadquarterOfficeData: function (OfficeServiceAPI) {
                        if (self.companyData.headquarterCompanyOfficeGUID) {
                            return OfficeServiceAPI.getOfficeData(self.companyData.companyGUID, self.companyData.headquarterCompanyOfficeGUID);
                        } else {
                            return false;
                        }
                    }
                }
            });
        }
        //***************** Setup items section end *****************//


    //***************** Current Pricing section *****************//
    self.currentPricingMessage = "";

    self.pricingAdd = {
        companyGUID: self.cid,
        reportType: "",
        templateID: "",
        templateGUID: "",
        name: "",
        amount: "",
        currencyType: "USD"
    }

    drawCurrentPricingTable();

    function drawCurrentPricingTable() {
        CompanyServiceAPI.getCompanyRates(self.cid).then(function (resp) {
            self.currentPricings = resp.rates;
            self.currentPricingsCopy = angular.copy(self.currentPricings);
            self.editCurrentPricing = false;
            self.hideCurrentPricingOptions = false;
        });
    }

    self.editCurrentPricingTab = function () {
        self.editCurrentPricing = true;
        self.showCurrentPricingMsg = false;
        self.hideCurrentPricingOptions = true;
        self.showAddNewRate = false;
    }

    self.cancelCurrentPricingTab = function () {
        self.editCurrentPricing = false;
        self.showCurrentPricingMsg = true;
        self.currentPricingMessage = "Editing was cancelled.";
        self.currentPricingAlertType = "alert-danger";
        self.currentPricings = angular.copy(self.currentPricingsCopy);
        self.hideCurrentPricingOptions = false;
    }

    self.cancelAddNewRate = function () {
        self.pricingAdd = {
            companyGUID: self.cid,
            reportType: "",
            templateID: "",
            templateGUID: "",
            name: "",
            amount: "",
            currencyType: "USD"
        }
        self.showAddNewRate = false;
        self.templates = false;
        clearValidationMessages('currentPricingForm');
    }

    self.saveNewCurrentPricing = function (form) {
        if (form.$valid) {
            var newRateData = {
                rates: [self.pricingAdd]
            };
            CompanyServiceAPI.addCompanyRate(newRateData, self.cid).then(function (resp) {
                if (resp.data && resp.data.rates == null) {
                    self.showCurrentPricingMsg = true;
                    self.currentPricingMessage = "Error: Could not add a new rate. " + resp.data.message.userMessage;
                    self.currentPricingAlertType = "alert-danger";
                } else {
                    self.showCurrentPricingMsg = true;
                    self.currentPricingMessage = "The new rate was added successfully.";
                    self.currentPricingAlertType = "alert-success";
                    self.cancelAddNewRate();
                }
                drawCurrentPricingTable();
            });
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.updateCurrentPricingTab = function (form) {
        if (form.$valid) {
            if (form.$dirty) {
                var rates = [];
                var obj = {};
                for (var i = 0; i < self.currentPricings.length; i++) {
                    obj = {};
                    obj.rateGUID = self.currentPricings[i].rateGUID;
                    obj.reportType = self.currentPricings[i].reportType;
                    obj.templateID = self.currentPricings[i].templateID;
                    obj.templateGUID = self.currentPricings[i].templateGUID;
                    obj.name = self.currentPricings[i].name;
                    obj.amount = self.currentPricings[i].amount;
                    obj.currencyType = self.currentPricings[i].currencyType;
                    rates.push(obj);
                }
                CompanyServiceAPI.updateCompanyRates({
                    "rates": rates
                }, self.cid).then(function (resp) {
                    if (resp.data && resp.data.message) {
                        self.showCurrentPricingMsg = true;
                        self.currentPricingMessage = "Error: Could not update pricing. " + resp.data.message.userMessage;
                        self.currentPricingAlertType = "alert-danger";
                    } else {
                        self.showCurrentPricingMsg = true;
                        self.currentPricingMessage = "Pricing updated successfully.";
                        self.currentPricingAlertType = "alert-success";
                    }
                    drawCurrentPricingTable();
                });
            } else {
                self.showCurrentPricingMsg = true;
                self.currentPricingMessage = "Nothing to update.";
                self.currentPricingAlertType = "alert-danger";
            }
        } else {
            var inputElements = document.getElementsByName('currentPricingTableForm');
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.deletePricing = function (pricingName, rateGUID) {
        var modalContainer = {
            enityName: pricingName,
            enityType: 'current Pricing item',
            rateGUID: rateGUID,
            cid: self.cid
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: pricingDeleteCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });
    }

    var pricingDeleteCtrl = function ($scope, $modalInstance, data) {
            $scope.toDelete = {
                enityName: data.enityName,
                enityType: data.enityType,
                showMsg: true
            };
            $scope.deleteEntity = function () {
                var name = $scope.toDelete.enityName;
                var promise = CompanyServiceAPI.deleteCompanyRate(data.rateGUID, data.cid);
                promise.then(function (resp) {
                    if (resp.data && resp.data.message) {
                        $scope.$parent.parcelCtrl.showCurrentPricingMsg = true;
                        $scope.$parent.parcelCtrl.currentPricingMessage = "Error: Could not delete the rate. " + resp.data.message.userMessage;
                        $scope.$parent.parcelCtrl.currentPricingAlertType = "alert-danger";
                    } else {
                        $scope.$parent.parcelCtrl.showCurrentPricingMsg = true;
                        $scope.$parent.parcelCtrl.currentPricingMessage = "The rate was deleted successfully.";
                        $scope.$parent.parcelCtrl.currentPricingAlertType = "alert-success";
                    }
                    $modalInstance.close();
                    drawCurrentPricingTable();
                });
            }
            $scope.closeModal = function () {
                $modalInstance.close();
            }
        }
        //***************** Current Pricing section End *****************//


    //***************** Discount section *****************//
    self.discountAdd = {
        "reportType": "",
        "templateID": "",
        "templateGUID": "",
        "name": "",
        "discountPercent": "",
        "discountType": "NUMREPORTS",
        "maxNumberOfReports": "",
        "maxNumberOfDays": "",
        "startDate": yyyyddmmDate,
        "expirationTS": ""
    }

    self.getExpirationDate = function (startDate, daysToExpire) {
        var effectiveDate = new Date(startDate);
        var expirationDate = new Date(effectiveDate.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
        return new Date(expirationDate).toISOString();
    }

    drawDiscountTable();

    function drawDiscountTable() {
        CompanyServiceAPI.getCompanyDiscount(self.cid).then(function (resp) {
            self.discountTableData = resp.discounts;

            for (var i = 0; i < self.discountTableData.length; i++)
                self.discountTableData[i].startDate = self.TsToDate(self.discountTableData[i].effectiveTS, '-');

            self.discountTableDataCopy = angular.copy(self.discountTableData);
            self.editDiscounts = false;
            self.hideDiscountOptions = false;
        });
    }

    self.editDiscountsTable = function () {
        self.editDiscounts = true;
        self.showDiscountsMsg = false;
        self.hideDiscountOptions = true;
        self.showAddNewDiscount = false;
    }

    self.cancelEditDiscountsTable = function () {
        self.editDiscounts = false;
        self.showDiscountsMsg = true;
        self.discountsMessage = "Editing was cancelled.";
        self.discountsAlertType = "alert-danger";
        self.discountTableData = angular.copy(self.discountTableDataCopy);
        self.hideDiscountOptions = false;
    }

    self.cancelAddNewDiscount = function () {
        self.discountAdd = {
            "reportType": "",
            "templateID": "",
            "templateGUID": "",
            "name": "",
            "discountPercent": "",
            "discountType": "NUMREPORTS",
            "maxNumberOfReports": "",
            "maxNumberOfDays": "",
            "startDate": yyyyddmmDate,
            "expirationTS": ""
        };
        self.showAddNewDiscount = false;
        clearValidationMessages('discountForm');
    }

    self.saveNewDiscount = function (form) {
        if (form.$valid) {
            if ((self.discountAdd.maxNumberOfReports < 1 || self.discountAdd.maxNumberOfReports > 1000) && self.discountAdd.discountType == 'NUMREPORTS') {
                self.showDiscountsMsg = true;
                self.discountsMessage = "Error: The number of reports must be between 1 and 1000.";
                self.discountsAlertType = "alert-danger";
                $('form[name=discountForm] #reports').parent().addClass('has-error');
                $('form[name=discountForm] #reports').trigger('focus');
            } else if ((self.discountAdd.days < 1 || self.discountAdd.days > 366) && self.discountAdd.discountType == 'TIME') {
                self.showDiscountsMsg = true;
                self.discountsMessage = "Error: The duration of the discount must be between 1 and 366 days.";
                self.discountsAlertType = "alert-danger";
                $('form[name=discountForm] #days').parent().addClass('has-error');
                $('form[name=discountForm] #days').trigger('focus');
            } else {
                if (self.discountAdd.discountType == 'TIME' && self.discountAdd.maxNumberOfDays && self.discountAdd.startDate) {
                    self.discountAdd.maxNumberOfReports = "";
                    var effectiveDt = new Date(self.discountAdd.startDate);
                    self.discountAdd.effectiveTS = new Date(effectiveDt).toISOString();
                    self.discountAdd.expirationTS = self.getExpirationDate(effectiveDt, self.discountAdd.maxNumberOfDays);
                } else {
                    self.discountAdd.effectiveTS = self.discountAdd.expirationTS = new Date(new Date()).toISOString();
                }
                delete self.discountAdd.startDate;

                var newDiscountData = {
                    discounts: [self.discountAdd]
                };

                CompanyServiceAPI.addCompanyDiscount(newDiscountData, self.cid).then(function (resp) {
                    if (resp.data && resp.data.rates == null) {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "Error: Could not add a new discount. " + resp.data.message.userMessage;
                        self.discountsAlertType = "alert-danger";
                    } else {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "The new discount was added successfully.";
                        self.discountsAlertType = "alert-success";
                        self.cancelAddNewDiscount();
                    }
                    drawDiscountTable();
                });
            }
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.updateDiscountsTable = function (form) {
        if (form.$valid) {
            if (form.$dirty) {
                var discounts = [];
                var obj = {};
                var effectiveDt;
                for (var i = 0; i < self.discountTableData.length; i++) {
                    obj = {};
                    obj.reportType = self.discountTableData[i].reportType;
                    obj.templateID = self.discountTableData[i].templateID;
                    obj.templateGUID = self.discountTableData[i].templateGUID;
                    obj.name = self.discountTableData[i].name;
                    obj.discountPercent = self.discountTableData[i].discountPercent;
                    obj.discountType = self.discountTableData[i].discountType;
                    obj.maxNumberOfReports = self.discountTableData[i].maxNumberOfReports;

                    if (self.discountTableData[i].discountType == 'TIME' && self.discountTableData[i].maxNumberOfDays && self.discountTableData[i].startDate) {
                        obj.maxNumberOfReports = "";
                        effectiveDt = new Date(self.discountTableData[i].startDate);
                        obj.effectiveTS = new Date(effectiveDt + " UTC").toISOString();
                        obj.expirationTS = self.getExpirationDate(effectiveDt, self.discountTableData[i].maxNumberOfDays);
                    } else {
                        self.discountTableData[i].effectiveTS = self.discountTableData[i].expirationTS = new Date(new Date() + " UTC").toISOString();
                    }
                    delete self.discountTableData[i].startDate;

                    discounts.push(obj);
                }
                CompanyServiceAPI.updateCompanyDiscounts({
                    "discounts": discounts
                }, self.cid).then(function (resp) {
                    if (resp.data && resp.data.message) {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "Error: Could not update discounts. " + resp.data.message.userMessage;
                        self.discountsAlertType = "alert-danger";
                    } else {
                        self.showDiscountsMsg = true;
                        self.discountsMessage = "Discounts updated successfully.";
                        self.discountsAlertType = "alert-success";
                    }
                    drawDiscountTable();
                });
            } else {
                self.showDiscountsMsg = true;
                self.discountsMessage = "Nothing to update.";
                self.discountsAlertType = "alert-danger";
            }
        } else {
            var inputElements = document.getElementsByName('discountTableForm');
            angular.element(inputElements).find('input, select').trigger('blur');
        }
    }

    self.deleteDiscount = function (discountName, discountGUID) {
        var modalContainer = {
            enityName: discountName,
            enityType: 'discount item',
            discountGUID: discountGUID,
            cid: self.cid
        }
        var modalInstance = $modal.open({
            templateUrl: "delete-confirmation-action-modal.html",
            scope: $scope,
            controller: discountDeleteCtrl,
            size: 0,
            resolve: {
                data: function () {
                    return modalContainer;
                }
            }
        });
    }

    var discountDeleteCtrl = function ($scope, $modalInstance, data) {
            $scope.toDelete = {
                enityName: data.enityName,
                enityType: data.enityType,
                showMsg: true
            };
            $scope.deleteEntity = function () {
                var name = $scope.toDelete.enityName;
                var promise = CompanyServiceAPI.deleteCompanyDiscount(data.cid, data.discountGUID);
                promise.then(function (resp) {
                    if (resp.data && resp.data.message) {
                        $scope.$parent.parcelCtrl.showDiscountsMsg = true;
                        $scope.$parent.parcelCtrl.discountsMessage = "Error: Could not delete the discount. " + resp.data.message.userMessage;
                        $scope.$parent.parcelCtrl.discountsAlertType = "alert-danger";
                    } else {
                        $scope.$parent.parcelCtrl.showDiscountsMsg = true;
                        $scope.$parent.parcelCtrl.discountsMessage = "The discount was deleted successfully.";
                        $scope.$parent.parcelCtrl.discountsAlertType = "alert-success";
                    }
                    $modalInstance.close();
                    drawDiscountTable();
                });
            }
            $scope.closeModal = function () {
                $modalInstance.close();
            }
        }
        //***************** Discount section end*****************//

    //currentYearStatus table
    drawCurrentYearStatusTable();

    function drawCurrentYearStatusTable() {
        CompanyServiceAPI.getCurrentYearStatusTable().then(function (resp) {
            self.currentYearStatus = resp;
        });
    }

    $timeout(function () {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    });
}]);;angular.module('AccountMgmtModule').controller('SearchController', ['$scope', '$timeout', 'searchAPI', function ($scope, $timeout, searchAPI) {

    var self = this;

    self.searchType = 'Users';
    self.gridData = false;
    self.searchColumnDef = {};
    self.searchString = "";
    self.isSearchStringSet = true;

    renderSearchResults = function (data) {
        switch (self.searchType) {
        case 'Companies':
            var view = 'viewParcel';
            var isLenderCompany = data.companyTypes.filter(function (item) {
                return item.companyType.lowerCase() == 'lender';
            });

            if (isLenderCompany.length)
                view = 'view';

            return '<a href="#/accounts/company/' + view + '?companyguid=' + data.companyGUID + '">' + data.name + '</a>';
            break;

        case 'Offices':
            return '<a href="#/accounts/company/office/view?companyguid=' + data.companyGUID + '&officeguid=' + data.companyOfficeGUID + '">' + data.officeName + '</a>';
            break;

        case 'Users':
            /*return '<a href="#/accounts/company/office/user/view?parentcompanyguid=' + $stateParams.parentcompanyguid + '&companyguid=' + $stateParams.companyguid + '&officeguid=' + $stateParams.officeguid + '&userguid=' + data.userGUID + '">' + data.lastName + ', ' + data.firstName + '</a>';*/
            return '<a href="#/accounts/company/office/user/view">' + data.lastName + ', ' + data.firstName + '</a>';
        }
    }

    $timeout(function () {
        $(document).ready(function () {
            SearchResultsDt = $('#SearchResultsDt').DataTable({
                "dom": '<"pull-left"i><"pull-right"p>t<"pull-right"p>',
                "data": self.gridData,
                "pagingType": "simple",
                "language": {
                    "info": "<b>Showing _START_ - _END_ of _TOTAL_ records</b>"
                },
                "pageLength": 200,
                "columnDefs": [{
                    "targets": 0,
                    "data": null,
                    "mRender": function (data, type, row) {
                        return renderSearchResults(data);
                    }
                }]
            });

            $('#searchStringInp').bind('keypress', function () {
                self.isSearchStringSet = true;
                $('#searchStringInp').parent().removeClass('has-error');
            });
        });
    });

    bindSearchResultsDt = function (data) {
        if (data) self.gridData = true;

        SearchResultsDt.clear().draw();
        SearchResultsDt.rows.add(data);
        SearchResultsDt.columns.adjust().order([0, 'asc']).draw();
    }

    self.SearchAll = function () {
        if (self.searchString) {
            switch (self.searchType) {
            case 'Users':
                searchAPI.searchUsers(self.searchString).then(function (result) {
                    bindSearchResultsDt(result.users);
                });
                break;
            case 'Offices':
                searchAPI.searchOffices(self.searchString).then(function (result) {
                    bindSearchResultsDt(result.offices);
                });
                break;
            case 'Companies':
                searchAPI.searchCompanies(self.searchString).then(function (result) {
                    bindSearchResultsDt(result.companies);
                });
                break;
            default:
                //default code block
            }
        } else {
            self.isSearchStringSet = false;
            $('#searchStringInp').parent().addClass('has-error');
            $('#searchStringInp').focus();
        }
    }

    self.orderSearchResultsDt = function () {
        console.log(SearchResultsDt.order());
    }
}]);;angular.module('AccountMgmtModule').controller('UmbrellaController', ['$timeout', '$scope', '$rootScope', '$compile', '$modal', '$state', 'companyData', 'CompanyServiceAPI', 'UserServiceAPI', 'ListingsAPI', function ($timeout, $scope, $rootScope, $compile, $modal, $state, companyData, CompanyServiceAPI, UserServiceAPI, ListingsAPI) {

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
                    "info": "<b>Showing _START_ - _END_ of _TOTAL_ records</b>"
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

}]);;angular.module('AccountMgmtModule').controller('UserController', ['$scope', '$state', 'UserServiceAPI', '$compile', 'Upload', '$modal', 'LicenseServiceAPI', '$window', '$filter', '$location', '$stateParams','FileMgmtAPI','$log', function ($scope, $state, UserServiceAPI, $compile, Upload, $modal, LicenseServiceAPI, $window, $filter, $location, $stateParams,FileMgmtAPI, $log) {

    var self = this;
    this.isEditUser = false;
    var userGUID = $location.search().userguid;

    // Query params
    this.companyguid = $location.search().companyguid;
    this.officeguid = $location.search().officeguid;
    this.userguid = $location.search().userguid;

    //upload
    self.attachmentFilesQualification = [];
    this.attachmentFilesSignature = [];

    if ($state.current.name == 'accountMgmt.user.new') {
        this.buttonText = "SUBMIT";
        this.headerText = "Creating Account";

    } else if ($state.current.name == 'accountMgmt.user.edit') {
        this.buttonText = "UPDATE";
        this.headerText = "Editing User";
        this.isEditUser = true;
        displayUserInfo();
    } else if ($state.current.name == 'accountMgmt.user.view') {
        var userguid = $stateParams.userguid;
        viewUser(userguid);
    }


    function displayUserInfo() {
        var userguid = $stateParams.userguid;
        var promise = UserServiceAPI.getUserInfo(userguid, this.companyguid, this.officeguid);
        promise.then(function (data) {
            var users = data.users;
            for (var index = 0; index < users.length; index++) {
                self.firstname = users[index].firstName != undefined ? users[index].firstName : "";
                self.title = users[index].title != undefined ? users[index].title : "";
                self.middlename = users[index].middleInitial != undefined ? users[index].middleInitial : "";
                self.lastname = users[index].lastName != undefined ? users[index].lastName : "";
                self.email = users[index].email != undefined ? users[index].email : "";
                self.emailClosing = users[index].emailClosing != undefined ? users[index].emailClosing : "";
                if (users[index].directPhone != "" && users[index].directPhone != undefined)
                    self.cell = users[index].directPhone;
                else
                    self.cell = users[index].cellPhone;

                self.IsEnvProfessional = users[index].isEnvProfessional != undefined &&
                    users[index].isEnvProfessional != "" ? users[index].isEnvProfessional : false;


                self.IsAllowAdmintoSignIn = users[index].allowAdminsToSign != undefined &&
                    users[index].allowAdminsToSign != "" ? users[index].allowAdminsToSign : false;
                self.username = users[index].userName != undefined ? users[index].userName : "";                
                self.qualificationsFileCoreFileGUID = users[index].qualificationsFileCoreFileGUID;
                self.signatureFileCoreFileGUID = users[index].signatureFileCoreFileGUID;
            }
        })
    }

    self.openHelpModal = function (targetModal) {
        $modal.open({
            templateUrl: targetModal,
            size: "lg",
            controller: function ($modalInstance, $scope) {
                $scope.closeHelpModal = function () {
                    $modalInstance.close();
                }
            }
        });
    }

    self.saveUserData = function (form) {
        var qualificationsFileDisplayName = self.attachmentFilesQualification[0] ? self.attachmentFilesQualification[0].qualificationsFileDisplayName : "";

        var qualificationsFileCoreFileGUID = self.attachmentFilesQualification[0] ? self.attachmentFilesQualification[0].qualificationsFileCoreFileGUID : "";

        var signatureFileDisplayName = self.attachmentFilesSignature[0] ? self.attachmentFilesSignature[0].signatureFileDisplayName : "";

        var signatureFileCoreFileGUID = self.attachmentFilesSignature[0] ? self.attachmentFilesSignature[0].signatureFileCoreFileGUID : "";


        if (form.$valid) {
            var userData = {
                "user": {
                    "userName": this.username != undefined ? this.username : "",
                    "title": this.title != undefined ? this.title : "",
                    "firstName": this.firstname,
                    "middleInitial": this.middlename != undefined ? this.middlename : "",
                    "lastName": this.lastname,
                    "isEnabled": "",
                    "email": this.email,
                    "officeEmail": "",
                    "emailClosing": this.emailClosing != undefined ? this.emailClosing : "",
                    "directPhone": "",
                    "cellPhone": this.cell != undefined ? this.cell : "",
                    "qualificationsFileDisplayName": qualificationsFileDisplayName,
                    "qualificationsFileCoreFileGUID": qualificationsFileCoreFileGUID,
                    "signatureFileDisplayName": signatureFileDisplayName,
                    "signatureFileCoreFileGUID": signatureFileCoreFileGUID,
                    "isEnvProfessional": this.IsEnvProfessional,
                    "allowAdminsToSign": this.IsAllowAdmintoSignIn != undefined ? this.IsAllowAdmintoSignIn : false,
                    "allowFeeAssignments": true,
                    "allowAppraisalReviews": true,
                    "allowEvaluations": true,
                    "certifiedHUDFHA": true,
                    "certifiedVA": true,
                    "designations": [],
                    "expertise": [],
                    "office": {
                        "companyOfficeGUID": this.officeguid
                    }
                }
            }

            if ($state.current.name == "accountMgmt.user.new") {
                var promise = UserServiceAPI.createuser(userData);
                promise.then(function (data) {
                    $state.go('accountMgmt.user.view', {
                        companyguid: $scope.userCtrl.companyguid,
                        officeguid: $scope.userCtrl.officeguid,
                        userguid: data.user.userGUID
                    });
                })
            } else if ($state.current.name == "accountMgmt.user.edit") {
                var userguid = this.userguid;
                var promise = UserServiceAPI.updateuser(userguid, userData);
                promise.then(function (data) {
                    $state.go('accountMgmt.user.view', {
                        companyguid: $scope.userCtrl.companyguid,
                        officeguid: $scope.userCtrl.officeguid,
                        userguid: $scope.userCtrl.userguid
                    });
                })
            }

        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }

    }
    
    self.cancelUserCreation = function () {
        $state.go('accountMgmt.user.list', {
            companyguid: $state.params.companyguid,
            officeguid: $state.params.officeguid
        });
    }

    self.uploadFile = function (Type) {
        var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
        switch (Type) {
        case 'qualification':            
            var file = self.qualificationfile;
            self.isUploadQualificationSuccess = false;
            self.isQualificationUpload = false;
            self.QualificationErrorMessage = "";
            if (!file || file == null) {
                self.QualificationErrorMessage = "Please attach file before trying to upload.";
                self.isQualificationUpload = true;
                return;

            } else {
                
                var basePath = "/Accounts/Users/"+this.userguid;
                var promise = FileMgmtAPI.uploadFile(file,'DISABLE',this.userguid,basePath,"Qualification",self.qualificationsFileCoreFileGUID);
                promise.progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }),
                promise.success(function(data,status, headers, config){
                    self.isUploadQualificationSuccess = true;
                    if (data) {
                        self.attachmentFilesQualification.push({
                            "qualificationsFileDisplayName": data.file.fileName,
                            "qualificationsFileCoreFileGUID": data.file.fileGUID
                        });
                    }
                }),
                promise.error(function(data, status, headers, config){
                    self.isQualificationUpload = true;
                    self.QualificationErrorMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                    if(data.message)
                        self.QualificationErrorMessage = data.message.userMessage;
                    accessMgmtFactoryLogger.error(config);
                })
            }

            break;

        case 'signature':

            var filesignature = self.signaturefiles;
            self.isUploadSignatureSuccess =false;
            self.isSignatureUpload = false;
            self.SignatureErrorMessage = "";
            if (!filesignature || filesignature == null) {
                self.isSignatureUpload = true;
                self.SignatureErrorMessage = "Please attach file before trying to upload.";
                return;

            } else {
                
                var basePath = "/Accounts/Users/"+this.userguid;
                var promise = FileMgmtAPI.uploadFile(filesignature,'DISABLE',this.userguid,basePath,"Signature",self.signatureFileCoreFileGUID);
                promise.progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }),
                promise.success(function(data,status, headers, config){
                    self.isUploadSignatureSuccess = true;
                    if (data) {
                       self.attachmentFilesSignature.push({
                            "signatureFileDisplayName": data.file.fileName,
                            "signatureFileCoreFileGUID": data.file.fileGUID
                        });
                    }
                }),
                promise.error(function(data, status, headers, config){
                    self.isSignatureUpload = true;
                    self.SignatureErrorMessage = "Sorry. We encountered a problem while processing your request. Please try again.";
                    if(data.message)
                        self.SignatureErrorMessage = data.message.userMessage;
                    accessMgmtFactoryLogger.error(config);
                })
                
                break;
            }

        default:
        }       

    }

   

    function viewUser(userGUID) {

        var promise = UserServiceAPI.getUserInfo(userGUID);
        promise.then(function (viewdata) {

            var viewusers = viewdata.users;
            for (var index = 0; index < viewusers.length; index++) {
                //if (userGUID == viewusers[index].userGUID) {
                self.viewfirstname = viewdata.users[index].firstName;
                self.viewmiddlename = viewdata.users[index].middleInitial;
                self.viewlastname = viewdata.users[index].lastName;
                self.viewtitle = viewdata.users[index].title;
                self.viewemail = viewdata.users[index].email;

                if (viewdata.users[index].directPhone != "" && viewdata.users[index].directPhone != undefined)
                    self.viewdirectorcell = viewdata.users[index].directPhone;
                else
                    self.viewdirectorcell = viewdata.users[index].cellPhone;

                if (viewdata.users[index].isEnvProfessional)
                    self.viewisenvprofessional = 'Yes';
                else
                    self.viewisenvprofessional = 'No';

                if (viewdata.users[index].allowAdminsToSign)
                    self.viewssallowadmintosignIn = 'Yes';
                else
                    self.viewssallowadmintosignIn = 'No';


                self.qualificationsFileCoreFileGUID = viewdata.users[index].qualificationsFileCoreFileGUID;

                var UserqualificationFileGUID = viewdata.users[index].qualificationsFileCoreFileGUID;
                console.log(UserqualificationFileGUID);
                if (UserqualificationFileGUID !== null) {
                    self.ShowUserQualificationFile = formatUrl(downloadUrl,params);
                    var promise = FileMgmtAPI.getfiledetails(UserqualificationFileGUID);
                    promise.then(function (DownloadResponse) {
                        self.viewsqualificationsfile = 'Uploaded';
                        self.ShowUserQualificationFile = DownloadResponse.files[0].currentVersionURL;
                    })
                } else {
                    self.viewsqualificationsfile = 'Not Uploaded';
                    self.ShowUserQualificationFile = "";
                }
                
                self.signatureFileCoreFileGUID = viewdata.users[index].signatureFileCoreFileGUID;
                var UsersignatureFileGUID = viewdata.users[index].signatureFileCoreFileGUID;
                if (UsersignatureFileGUID !== null) {
                    var promise = FileMgmtAPI.getfiledetails(UsersignatureFileGUID);
                    promise.then(function (DownloadResponse) {
                        self.ShowUserSignatureImage = DownloadResponse.files[0].currentVersionURL;
                    })
                } else {
                    self.ShowUserSignatureImage = "";
                }
            }
        })
    }

    self.checkFile = function (file, invalidFiles, uploadtype) {

        if (invalidFiles.length > 0) {
            var msg = '';
            switch (invalidFiles[0].$error.toLowerCase()) {
            case "pattern":
                msg = 'File format is incorrect';
                break;
            case "maxsize":
            case "maxtotalsize":
                msg = 'Image size is incorrect';
                break;
            case "ratio":
                msg = 'Image aspect ratio is incorrect'
                break;
            }
            if (uploadtype == "signature") {
                self.SignatureErrorMessage = msg;
                self.isSignatureUpload = true;
            }
            if (uploadtype == "qualification") {
                self.QualificationErrorMessage = msg;
                self.isQualificationUpload = true;
            }
        } else {
            if (uploadtype == "signature") {
                self.isSignatureUpload = false;
                self.isUploadSignatureSuccess = false;
            }
            if (uploadtype == "qualification") {
                self.isQualificationUpload = false;
                self.isUploadQualificationSuccess = false;
            }
        }
    }

    $scope.OpenDeleteQualificationFile = function (fileGUID) {

        $scope.QFFileGUID = fileGUID;

        var modalInstance = $modal.open({
            templateUrl: "DeleteQualificationTemplate.html",
            scope: $scope,
            controller: deleteQualificationFileController,
            size: 0
        });
    }

    function deleteQualificationFileController($scope, $modalInstance) {
        $scope.QFFileGUID;

        $scope.deleteQualificationFile = function () {

            var QFFileGUID = $scope.QFFileGUID;

            var promise = FileMgmtAPI.deleteFile("8d2d825c-1dc4-46b2-8b1c-93f7aabb9ab2"); //(QFFileGUID);
            promise.then(function (deleteQFdata) {
                $modalInstance.close();
                self.DeleteQualificationFileStatus = true;
                $timeout(function () {
                    self.callAtTimeout("DeleteQualificationFileStatus");
                }, 3000);
            })
        }

        $scope.CancelQualificationFileDelete = function () {

            $modalInstance.close();
        }

    }

    self.callAtTimeout = function (Type) {
        switch (Type) {
        case 'DeleteQualificationFileStatus':
            if (self.DeleteQualificationFileStatus == true) {
                self.DeleteQualificationFileStatus = false;
            }
            break;
        default:
        }
    }
    
    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    }
}]);;angular.module('AccountMgmtModule').controller('UserUploadController', ['$rootScope', '$scope', '$modalInstance', '$location', '$timeout', '$state', 'uploadModalParams', '$q', 'UserServiceAPI', 'Upload', function ($rootScope, $scope, $modalInstance, $location, $timeout, $state, deleteModalParams, $q, UserServiceAPI, Upload) {

    var scope = $scope;
    var self = this;
    self.isUpload = true;
    self.isSubmit = true;
    self.emailList ={};
    
    
    
    
    //self.showUserTbl = false;
    self.defaultAccessLevels = [
        {
            text:"Lender User",
            value:"1"
        },
        {
            text:"Lender Manager",
            value:"2"
        },
        {
            text:"Lender Executive",
            value:"3"
        }
    ];
        
    self.closeModal = function () {
        $modalInstance.close();
    }
    
    $scope.read = function (workbook) {
        
        
        /* DO SOMETHING WITH workbook HERE */
        self.userSheetData = XLSX.utils.sheet_to_json(workbook.Sheets["List of Users"],{range:8});
//        angular.forEach(self.userSheetData, function(user,i){
//            if(user['Default Access Level']){
//                var x= self.defaultAccessLevels.filter(function(item){
//                    return item.text == user['Default Access Level'];
//                })[0];
//                user['Default Access Level'] = x;
//            }
//        })
        if(self.userSheetData.length>0){            
            self.showUserTbl = true;
            self.isSubmit = false;
            $timeout(function () {
                $(document).ready(function(){
                    $('[data-toggle="tooltip"]').tooltip();
                });
            });
           /* angular.forEach(self.userSheetData,function(usr,i){
                self.emailList[i]= usr['Email'];
            })*/
        }
        else{
            self.IncorrectFormat = "Error in reading file. Please check sheet with name 'List of Users' is either empty or is not available.";
        }
        //console.log(self.userSheetData);
      }
    
    self.saveUser = function(data,id){
        console.log(data);
//        var accessLevel=  data.defaultAccessLevel.text;
//        self.userSheetData[id] = data;
        self.userSheetData[id]['First Name'] = data.firstName;
        self.userSheetData[id]['Last Name'] =data.lastName;
        self.userSheetData[id]['Title'] =data.title;
        self.userSheetData[id]['Default Access Level'] = data.defaultAccessLevel;
        self.userSheetData[id]['Email'] = data.email;
        self.userSheetData[id]['Direct Phone'] = data.phone;
        var editableRowCount = document.getElementsByName('firstName').length;
        if(editableRowCount==1)
            self.isSubmit = false;
    }
    self.removeUser = function(index,data) {
            self.userSheetData.splice(index, 1);
        }
    
    self.UploadUsers = function(form){
        
        var promises = [];
        angular.forEach(self.userSheetData, function(user,i){
            var userData = {
                "firstName": user['First Name'],
                "middleInitial": "",
                "lastName":  user['Last Name'],
//                "title": user['Title'],
//                "defaultAccessLevels": user['Default Access level'],
                "email": user['Email'],
                "directPhone": user['Direct Phone'],
                "office": {
                    "companyOfficeGUID": $state.params.officeguid
                }
            };
            var reqUserObj = {
                "user": userData
            }
            promises.push(UserServiceAPI.createuser(reqUserObj));
        })
        $q.all(promises).then(function(responses){
            self.showHeaderAfterSave = true;
            angular.forEach(responses,function(resp,i){
                self.userSheetData[i].messageAfterSave = 'The new account was successfully created.';
                if(resp.user && resp.user.userGUID){
                    self.userSheetData[i].isSuccess = true;
                }
                else if(resp.data.message && !resp.user){
                    self.userSheetData[i].isSuccess = false;
                    self.userSheetData[i].messageAfterSave = "Failed to add new account due to: "+resp.data.message.userMessage;
                }
                else{
                    self.userSheetData[i].isSuccess = false;
                    self.userSheetData[i].messageAfterSave = 'Sorry. We encountered a problem while processing your request. Please try again.';
                }
            })
        })
    }
    
    
    self.checkFile = function(files,invalidFiles){
        self.showUserTbl = false;
//        self.userSheetData = null;
        self.IncorrectFormat = false;
        if (invalidFiles.length > 0) {
            self.IncorrectFormat = 'File format is incorrect.';
            self.isUpload = true;
        }
        else if(!files)
            self.isUpload = true;
        else
           self.isUpload = false;
    }
    
    self.uploadFile =function(){
        self.isUpload = true; 
        var file = self.files;
        var reader = new FileReader();
        var name = file.name;
        reader.readAsBinaryString(file);
          reader.onload = function(e) {
            var data = e.target.result;
            /* if binary string, read with type 'binary' */
            try {
              var workbook = XLS.read(data, {type: 'binary'});
                if(workbook){
                    $scope.$apply(function(){
                        $scope.read(workbook);
                    })
                }
            } catch(e) {
                self.IncorrectFormat = "Error in reading file. Please check the spreadsheet file has correct format.";
                console.log('Error in reading file: ');
            }
          };
    }
    
    /* Validations*/
    self.checkInvalid = function(data,type,index,valid){
        if(type=="Email" && !data){
//            if(self.userSheetData[index]['Email'])
                return "Invalid email address";
        }
        if(!data)
            return "This field is required";
    }
    
    self.setSubmitFlag = function(flag){
        if(flag)
            self.isSubmit = true;        
    }
    
}]);angular.module('AccountMgmtModule').directive('entityDelete', ['$log', '$modal', function ($log, $modal) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.bind('click', function (e) {
                e.preventDefault();
                var linkDelete = this;
                $modal.open({
                    templateUrl: 'delete-confirmation-modal.html',
                    controller: 'EntityDeleteController as deleteModalInst',
                    resolve: {
                        deleteModalParams: function () {
                            return $(linkDelete).data();
                        }
                    }
                });
            });
        }
    };
}]);;angular.module('AccountMgmtModule').directive('appHeader', function() {
   return {
       restrict: 'A',
       link: function(scope, element, attrs) {
           // some ode
       },
       templateUrl: function(elem, attrs) {
           return (attrs.appHeader == "PARCEL") ? "modules/accManagement/views/headers/parcelAppHeader.html" : "modules/accManagement/views/headers/c360AppHeader.html";
       }
   }
});;angular.module('AccountMgmtModule').service('AppraisalUserServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
               
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        createUser: {
            mock: AccountManagementUrlCollection.POSTAPI_CREATEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSER_REAL
        },
        getAppraisalUser: {
            mock: AccountManagementUrlCollection.GETAPPRAISALUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_GETUSER_REAL
        },       
        updateAppraiserUser: {
            mock: AccountManagementUrlCollection.UPDATEAPPRAISERUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.UPDATEAPPRAISERUSER_REAL
        },  
        deleteUser: {
            mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSER_REAL
        },
        
        changepasswordAppraiser: {
            mock: AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_REAL
        },
        
        UploadFile:{
            mock: AccountManagementUrlCollection.UPLOADFILE_MOCK,
            real: AccountManagementUrlCollection.UPLOADFILE_REAL
        }
        
        
    };
     
     this.getAppraisalInfo = function(AppraisalGUID) {
        
        var url = this.apiType.getAppraisalUser[this.apiType.type];        
        var params = {
            userguid: AppraisalGUID                    
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    }
     
     /*this.getAppraisalListing = function() {
        
        var url = this.apiType.getAppraiserListing[this.apiType.type];        
       
        return AccMgmtFactory.get(url, null).then(function(response){
            return response;
        });
        
    }*/
     
     this.updateappraiseruser = function(userGUID,data){
        var url = this.apiType.updateAppraiserUser[this.apiType.type];        
        var params = {
            userguid: userGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    };        
      
    this.deleteuser = function(userGUID){      
        var url = this.apiType.deleteUser[this.apiType.type];        
        var params = {                       
            userguid:userGUID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
        
    this.ChangePasswordAppraiser = function(userGUID,data){
        var url = this.apiType.changepasswordAppraiser[this.apiType.type];        
        var params = {
            userguid: userGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    }; 
    
    this.UploadFile = function(fileName,data){
        var url = this.apiType.UploadFile[this.apiType.type];        
        var params = {
            filename: filename
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    };      
    
    
}]);angular.module('AccountMgmtModule').service('UserFormsServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection','BASEURL' ,function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getForms: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWALLUSERFORMS_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWALLUSERFORMS_REAL
        },
        deleteForm :{
             mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSERFORMS_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSERFORMS_REAL
        },
        createForm :{
             mock: AccountManagementUrlCollection.POSTAPI_CREATEUSERFORMS_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSERFORMS_REAL
        },
        updateUserForms : {
             mock: AccountManagementUrlCollection.PUTAPI_UPDATEUSERFORMS_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATEUSERFORMS_REAL
        }   
        
    };
                 
     this.getuserw9form = function(userGUID) {
        
        var url = this.apiType.getForms[this.apiType.type];        
        var params = {
            userguid: userGUID,
            formguid: "",
            formtype: "w9"
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    }
     
    this.getUserAdditionalDocuments = function(userGUID, formguid){
        var url = this.apiType.getForms[this.apiType.type];        
        var params = {
            userguid: userGUID,
            formguid: formguid ? formguid : ""
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
    } 
     
     this.deleteuserw9form = function(userGUID, w9formGUID){
         
        var url = this.apiType.deleteForm[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            formguid:w9formGUID
        };

        return AccMgmtFactory.delete(url, null, params);
     }
    
    
     this.createuserform = function(userGUID,data){
        
        var url = this.apiType.createForm[this.apiType.type];        
        var params = {
            userguid: userGUID            
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });
         
     }
    
     this.deleteadditionaldocument = function(userGUID,formGUID){
          var url = this.apiType.deleteForm[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            formguid: formGUID
        };

        return AccMgmtFactory.delete(url, null, params);
     }
     
     this.updateadditionaldocument = function(userGUID, formGUID,data){
         
        var url = this.apiType.updateUserForms[this.apiType.type];        
        var params = {
            userguid: userGUID,
            formguid:formGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
     }
    
}]);angular.module('AccountMgmtModule').service('CompanyServiceAPI', ['AccessMgmtFactory', 'AccountManagementUrlCollection', 'BASEURL', function (AccMgmtFactory, AccountManagementUrlCollection, BASEURL) {

    this.createCompany = function (data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANY_REAL;
        return AccMgmtFactory.post(url, data, null).then(function (response) {
            return response;
        });
    };

    this.updateCompany = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANY_REAL;
        var params = {
            companyguid: companyGUID
        };
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    };

    this.getCompany = function (companyGUID, parentCompanyGUID, detail, name, hasParent) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANY_REAL;
        var params = {
            companyguid: companyGUID == undefined ? '' : companyGUID,
            detail: detail == undefined ? 'none' : detail,
            name: name == undefined ? '' : name,
            parentcompanyguid: parentCompanyGUID == undefined ? '' : parentCompanyGUID,
            hasparent: hasParent == undefined ? '' : hasParent
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    
    this.deleteCompany = function (companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPANY_REAL;
        var params = {
            companyguid: companyGUID
        };
        return AccMgmtFactory.delete(url, null, params);
    };

    this.createCompCertificate = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANYCERTIFICATE_REAL;
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.createCompAppComponentItems = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPAPPCOMPONENTITEMS_REAL
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompCertificate = function (companyGUID, certificationGUID, data) {
        //        var url = AccountManagementUrlCollection.PUTAPI_COMPANYCERTIFICATE_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANYCERTIFICATE_REAL;
        var params = {
            companyguid: companyGUID,
            certificationguid: certificationGUID
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompAppComponentItems = function (companyGUID, data) {
        //        var url = AccountManagementUrlCollection.PUTAPI_COMPAPPCOMPONENTITEMS_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPAPPCOMPONENTITEMS_REAL;
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    /*this.getListingTypes = function (types) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_LISTINGTYPES_REAL;
        var params = {
            types: types
        }

        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }*/

    /*this.getCompanyStaticData = function () {
        var url = AccountManagementUrlCollection.GETAPI_COMPANYSTATIC_MOCKJSON;
        return AccMgmtFactory.get(url, null).then(function (response) {
            return response;
        });
    };*/

    this.getAppComponentItems = function (appComponentTypeGUID, limit, offset) {
        //        var url = AccountManagementUrlCollection.GETAPI_APPCOMPONENTITEMS_MOCKJSON;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_APPCOMPONENTITEMS_REAL;
        var params = {
            appcomponenttypeguid: appComponentTypeGUID,
            limit: limit == undefined ? 0 : limit,
            offset: offset == undefined ? 0 : offset
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addSetupFees = function (companyGUID, data) {
        //        var url = AccountManagementUrlCollection.POSTAPI_COMPANYSETUPFEES_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANYSETUPFEES_REAL;
        var params = {
            companyguid: companyGUID
        };
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.getSetupFees = function (companyGUID, setupFeeGUID) {
        //        var url = AccountManagementUrlCollection.GETAPI_COMPANYSETUPFEES_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYSETUPFEES_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: setupFeeGUID == undefined ? '' : setupFeeGUID
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.lenderDeleteSetupFees = function (companyGUID, setupFeeGUID) {
        //        var url = AccountManagementUrlCollection.DELETEAPI_COMPANYSETUPFEES_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPANYSETUPFEES_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: setupFeeGUID
        };
        return AccMgmtFactory.delete(url, null, params).then(function (response) {
            return response;
        })
    }

    this.addCompanyAssociation = function (companyGUID, detail, data, companyAssociationGUID) {
        //        var url = AccountManagementUrlCollection.POSTAPI_COMPANYASSOCIATION_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANYASSOCIATION_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID == undefined ? '' : companyAssociationGUID,
            detail: detail == undefined ? 'none' : detail
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.getCompanyAssociations = function (companyGUID, detail, companyAssociationGUID) {
        //var url = AccountManagementUrlCollection.GETAPI_COMPANYASSOCIATIONS_MOCK;
        //        var url = AccountManagementUrlCollection.GETAPI_COMPANYASSOCIATIONS_MOCKJSON;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYASSOCIATIONS_REAL;

        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID == undefined ? '' : companyAssociationGUID,
            detail: detail == undefined ? 'none' : detail
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.deleteCompAssociation = function (companyGUID, companyAssociationGUID) {
        //        var url = AccountManagementUrlCollection.DELETEAPI_COMPANYASSOCIATION_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPANYASSOCIATION_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID
        };
        return AccMgmtFactory.delete(url, null, params).then(function (response) {
            return response;
        })
    }

    this.getCompanyAssoUsers = function (companyGUID, companyAssociationGUID, detail, companyAssociationUserGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPASSOUSERS_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID,
            companyassociationuserguid: companyAssociationUserGUID ? companyAssociationUserGUID : "",
            detail: detail == undefined ? 'none' : detail
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.createCompAssociationUser = function (companyGUID, companyAssociationGUID, data, companyAssociationUserGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPASSOUSER_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID,
            companyassociationuserguid: companyAssociationUserGUID ? companyAssociationUserGUID : ""
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.deleteCompAssoUser = function (companyGUID, companyAssociationGUID, companyAssociationUserGUID) {
        //        var url = AccountManagementUrlCollection.DELETEAPI_COMPASSOUSER_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPASSOUSER_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID,
            companyassociationuserguid: companyAssociationUserGUID
        }
        return AccMgmtFactory.delete(url, null, params).then(function (response) {
            return response;
        });
    }

    this.getCompReportTemplates = function (companyGUID, filter, reportType) {
        //        var url = AccountManagementUrlCollection.GETAPI_REPORTTEMPLATE_MOCKJSON;
        var url = BASEURL.REPORT_TEMPLATES + AccountManagementUrlCollection.GETAPI_COMPREPORTEMPLATE_REAL;
        var params = {
            companyguid: companyGUID,
            filter: filter ? filter : "",
            reportType: reportType ? reportType : ""
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.updateReportSettings = function (companyGUID, data) {
        //        var url = AccountManagementUrlCollection.PUTAPI_COMPANYREPORTSETTING_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANYREPORTSETTING_REAL;
        var params = {
            companyguid: companyGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.getCompReportSettings = function (companyGUID, detail, reportSettingGUID) {
        //        var url = AccountManagementUrlCollection.GETAPI_COMPANYREPORTSETTINGS_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYREPORTSETTINGS_REAL;
        var params = {
            companyguid: companyGUID,
            reportsettingguid: reportSettingGUID ? reportSettingGUID : '',
            detail: detail ? detail : 'none'
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.getCompReportVendors = function (companyGUID, reportSettingGUID, detail, reportVendorGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYREPORTVENDORS_REAL;
        var params = {
            companyguid: companyGUID,
            reportsettingguid: reportSettingGUID,
            reportvendorguid: reportVendorGUID ? reportVendorGUID : '',
            detail: detail ? detail : 'none'
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.updateReportVendors = function (companyGUID, reportSettingGUID, data) {
        //        var url = AccountManagementUrlCollection.PUTAPI_COMPANYREPORTVENDORS_MOCK;
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANYREPORTVENDORS_REAL;
        var params = {
            companyguid: companyGUID,
            reportsettingguid: reportSettingGUID
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        })
    }

    this.sendInvoice = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_SENDFEESTOABS_REAL;
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    //******* PARCEL company view services *******//
    // Service to get all report types
    this.getReportTypes = function () {
        var url = AccountManagementUrlCollection.GETAPI_REPORTTYPES_REAL;
        return AccMgmtFactory.get(url, null).then(function (response) {
            return response;
        })
    }

    // SetUp items services
    this.getSetupTypes = function (types) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SETUPTYPES_REAL;
        var params = {
            types: types
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.getSetupFees = function (companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GET_COMPANYSETUP_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: ""
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addSetupItem = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_UPDATESETUPTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: ""
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateSetupItems = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATESETUPTABLE_REAL;
        var params = {
            companyguid: companyGUID,

        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    /*this.sendFeesToABS = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_SENDFEESTOABS_REAL;
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }*/

    this.deleteSetupFee = function (setupID, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_SETUPFEES_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: setupID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    // SetUp items services End


    // Current Pricing services
    this.getCompanyRates = function (companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_CURRENTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            rateguid: ""
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addCompanyRate = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_ADDCURRENTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            rateguid: ""
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompanyRates = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATECURRENTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            rateguid: ""
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.deleteCompanyRate = function (rateGUID, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_CURRENTRATETABLE_REAL;
        var params = {
            rateguid: rateGUID,
            companyguid: companyGUID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    // Current Pricing services end


    // Discount services
    this.getCompanyDiscount = function (companyGUID, discountguid) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_DISCOUNTTABLE_REAL; //GETAPI_DISCOUNTTABLE_MOCK
        var params = {
            companyguid: companyGUID,
            discountguid: discountguid ? discountguid : ""
        };
        // var url = AccountManagementUrlCollection.GETAPI_DISCOUNTTABLE;
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addCompanyDiscount = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_DISCOUNTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompanyDiscounts = function (data, companyGUID) {
        var url = AccountManagementUrlCollection.POSTAPI_ADDDISCOUNTTABLE_MOCK;
        var params = {
            companyguid: companyGUID,
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.deleteCompanyDiscount = function (companyGUID, discountGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DISCOUNTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            discountguid: discountGUID
        };
        return AccMgmtFactory.delete(url, null, params);
    };

    this.getDiscountTypes = function (types) {
        var url = AccountManagementUrlCollection.GETAPI_DISCOUNTTYPES;
        var params = {
            types: types
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.getCurrentYearStatusTable = function () {
            var url = AccountManagementUrlCollection.GETAPI_CURRENTYEARSTATUSTABLE;

            return AccMgmtFactory.get(url, null).then(function (response) {
                return response;
            });
        }
        //******* PARCEL company view services end *******//

}]);;angular.module('AccountMgmtModule').service('FileMgmtAPI', ['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL', 'Upload','$log', function (AccessMgmtFactory, AccountManagementUrlCollection, BASEURL, Upload, $log) {
    
    //var accessMgmtFactoryLogger = $log.getInstance('AccessManagement');
    var method = 'POST';
    
    
    function formatUrl(url, queryParams) {
        if (!queryParams) return url;

        for (var param in queryParams) {
            url = url.replace("{" + param + "}", queryParams[param]);
        }
        return url;
    }
    
    this.uploadFile = function (file,deletionType,folderName,basePath,category,fileguid) {
        var uploadUrl;
        if(fileguid)
            uploadUrl = BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.PUTAPI_COREFILE;//PUT        
        else
            uploadUrl = BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.POSTAPI_COREFILE;//POST            
        var fileguid = fileguid?fileguid:'';
        var inputFile = file;
            var file = {
                "fileName": inputFile.name,
                "fileDescription": inputFile.name + ', size:' + inputFile.size,
                "clientFileID": 0,
                "retentionInDays": 365,
                "deletionType": deletionType, //if need to delete this file in future set to deletion type to: "Deleted"
                "displayIndex":1,
                "folderID":1,
                "folderGUID": folderName,
                "organizationalBasePath":basePath,
                "organizationalParentFolderName": folderName,
                "organizationalDatePath": true,
                "serverType": "AmazonWebServer",
                "metadata": {
                    "category": category
                }
            }
            var fileRequestJson = {
                "file": file
            };
            var request = {
                "fileRequestJson": fileRequestJson
            }
            var queryParams = {
                fileguid: fileguid,
                fileRequestJson: JSON.stringify(fileRequestJson)
            }
            var url = formatUrl(uploadUrl, queryParams);
            return Upload.upload({
                url: url,
                file: inputFile,
                method: 'POST',
                data: request,
                header: {
                    'Content-Type': 'multipart/formdata',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            })
        
    }
    
    this.getfiledetails = function(fileGUID){
         
        var getFileInfourl = BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.GETAPI_COREFILE_INFORMATION;    
        var params = {
           fileguid : fileGUID
        };
         
        return AccessMgmtFactory.get(getFileInfourl, params).then(function(response){                         
            return response;
        });
                  
     }
     
     this.deleteFile = function(fileGUID){
         var url = BASEURL.COREFILE_MGMT + AccountManagementUrlCollection.DELETEAPI_COREFILE; 
         var params = {
           fileguid : fileGUID
       };
       return AccessMgmtFactory.delete(url, null, params);
     }
    
}]);;angular.module('AccountMgmtModule').service('ListingsAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory, AccountManagementUrlCollection, BASEURL){
    
    this.getListings = function (types) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_LISTINGS_REAL;
        var params = {
            types: types
        }

        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    
}]);;angular.module('AccountMgmtModule').service('OfficeServiceAPI', ['AccessMgmtFactory', 'AccountManagementUrlCollection', 'BASEURL', function (AccMgmtFactory, AccountManagementUrlCollection, BASEURL) {
    
    this.apiType = {
        type: 'real',
        //type: 'mock',

        createOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_OFFICECREATE_REAL,
            mock: AccountManagementUrlCollection.POSTAPI_OFFICECREATE_MOCK
        },
        getOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_OFFICE_REAL,
            mock: AccountManagementUrlCollection.GETAPI_OFFICELIST_MOCK
        },
        updateOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_OFFICEUPDATE_REAL,
            mock: AccountManagementUrlCollection.PUTAPI_OFFICEUPDATE_MOCK
        },
        deleteOffice: {
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_OFFICEDELETE_REAL,
            mock: AccountManagementUrlCollection.DELETEAPI_OFFICEDELETE_MOCK
        }
    };
    
    this.deleteOffice = function (companyGUID, officeGUID) {
        var url = this.apiType.deleteOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";

        return AccMgmtFactory.delete(url, null, queryParams);
    };

    this.createOffice = function (companyGUID, data) {
        var url = this.apiType.createOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";

        return AccMgmtFactory.post(url, data, queryParams).then(function (response) {
            return response;
        });
    };

    this.updateOffice = function (companyGUID, officeGUID, data) {
        var url = this.apiType.updateOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";

        return AccMgmtFactory.put(url, data, queryParams).then(function (response) {
            return response;
        });
    };

    this.getOfficeData = function (companyGUID, officeGUID, detail, name) {
        var url = this.apiType.getOffice[this.apiType.type];
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";
        queryParams.detail = detail ? detail : "";
        queryParams.name = name ? name : "none";
        
        return AccMgmtFactory.get(url, queryParams).then(function (response) {
            return response;
        });
    };

}]);;angular.module('AccountMgmtModule').service('CoverageAreaServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection','BASEURL' ,function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getUserCoverageArea: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWCOVERAGEAREA_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWCOVERAGEAREA_REAL
        },    
        
        deleteUserCoverageArea :{
             mock: AccountManagementUrlCollection.DELETEAPI_DELETECOVERAGEAREA_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETECOVERAGEAREA_REAL
        },
        
        AddToCoverage: {
            mock: AccountManagementUrlCollection.POSTAPI_ADDTOCOVERAGE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_ADDTOCOVERAGE_REAL
        }
        
    };
                 
     this.getUserCoverageArea = function(userGUID) {
        
        var url = this.apiType.getUserCoverageArea[this.apiType.type];        
        var params = {
            userguid: userGUID,
            coverageareaguid: ""
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    }         
    
     this.deleteCoverageArea = function(userGUID,coverageareaguid){      
        var url = this.apiType.deleteUserCoverageArea[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            coverageareaguid:coverageareaguid
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    
    this.createUserCoverageArea = function(userGUID,data){
        
        var url = this.apiType.AddToCoverage[this.apiType.type];        
        var params = {
            userguid: userGUID,
            coverageareaguid: ""
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });
    }    
}]);;angular.module('AccountMgmtModule').service('InsuranceServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getUserInsurance: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWINSURANCE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWINSURANCE_REAL
        },
        updateUserInsurance:{
             mock: AccountManagementUrlCollection.PUTAPI_UPDATEINSURANCE_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATEINSURANCE_REAL
        },
        
        deleteUserInsurance :{
             mock: AccountManagementUrlCollection.DELETEAPI_DELETEINSURANCE_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEINSURANCE_REAL
        },
        
        createUserInsurance:{            
             mock: AccountManagementUrlCollection.POSTAPI_CREATEINSURANCE_MOCK,
             real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEINSURANCE_REAL
        }
        
    };
                 
     this.getuserinsurance = function(userGUID) {
        
        var url = this.apiType.getUserInsurance[this.apiType.type];        
        var params = {
            userguid: userGUID                    
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    } 
    
    this.updateuserinsurance =  function(userguid,insuranceguid,data){
        
        var url = this.apiType.updateUserInsurance[this.apiType.type];        
        var params = {
            userguid: userguid,
            insuranceguid:insuranceguid
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    }
    
     this.deleteuserinsurance = function(userGUID,insuranceguid){      
        var url = this.apiType.deleteUserInsurance[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            insuranceguid:insuranceguid
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    
    this.createuserinsurance = function(userguid,data){
        
        var url = this.apiType.createUserInsurance[this.apiType.type];        
        var params = {
            userguid: userguid            
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });                 
    }
    
}]);angular.module('AccountMgmtModule').service('LicenseServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory, AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        getUserLicense: {
            mock: AccountManagementUrlCollection.GETAPI_VIEWLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_VIEWLICENSE_REAL
        },
        updateUserLicense: {
            mock: AccountManagementUrlCollection.PUTAPI_UPDATELICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATELICENSE_REAL
        },
        createUserLicense:{
            mock: AccountManagementUrlCollection.POSTAPI_CREATEUSERLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSERLICENSE_REAL
        },
        deleteUserLicense: {
            mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSERLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSERLICENSE_REAL
        },        
        verifyLicense: {
            mock: AccountManagementUrlCollection.VERIFYUSERLICENSE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_VERIFYUSERLICENSE_REAL
        }
        
    };
                 
     this.getuserlicense = function(userGUID) {
        
        var url = this.apiType.getUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID,
            licenseguid: "",
            filtertype: ""
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    } 
     
     this.getmostRecentuserlicense = function(userGUID) {
        var filter = 'mostrecent';
        var url = this.apiType.getUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID,
            licenseguid: "",
            filter:filter
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });
        
    } 
    
     this.updateUserLicense = function(userGUID,licenseGUID,data){
        var url = this.apiType.updateUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID,
            licenseguid:licenseGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    };  
    
    this.createUserLicense = function(userGUID,data){
        var url = this.apiType.createUserLicense[this.apiType.type];        
        var params = {
            userguid: userGUID            
        };

        return AccMgmtFactory.post(url, data, params).then(function(response){
            return response;
        });
    };  
    
      this.deleteuserlicense = function(userGUID,licenseGUID){      
        var url = this.apiType.deleteUserLicense[this.apiType.type];        
        var params = {                       
            userguid:userGUID,
            licenseguid:licenseGUID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    
    this.verifyUserLicense = function(LicenseData,userGUID,licenseGUID){
      
        var url = this.apiType.verifyLicense[this.apiType.type];   
         var params = {                       
            userguid:userGUID,
            userlicenseguid:licenseGUID
        };
        return AccMgmtFactory.post(url, LicenseData, params).then(function(response){
            return response;
        });  
    };
    
}]);angular.module('AccountMgmtModule').service('UserServiceAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory,AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        createUser: {
            mock: AccountManagementUrlCollection.POSTAPI_CREATEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CREATEUSER_REAL
        },
        getUser: {
            mock: AccountManagementUrlCollection.GETAPI_GETUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_GETUSER_REAL
        },        
        updateUser: {
            mock: AccountManagementUrlCollection.PUTAPI_UPDATEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATEUSER_REAL
        },  
        deleteUser: {
            mock: AccountManagementUrlCollection.DELETEAPI_DELETEUSER_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DELETEUSER_REAL
        },
        userRole: {
            mock: AccountManagementUrlCollection.GETAPI_USERROLE_MOCK,
            real: AccountManagementUrlCollection.GETAPI_USERROLE_MOCK
        },
        changePassword: {
            mock: AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_CHANGEPASSWORD_REAL
        }        
    };
    
    
    this.createuser = function(data){
        var url = this.apiType.createUser[this.apiType.type];

        return AccMgmtFactory.post(url, data, null).then(function(response){
            return response;
        });
    };        
      
     this.getUserInfo = function(userGUID, companyGUID, officeGUID, firstName, lastName, email, detail) {
        
        var url = this.apiType.getUser[this.apiType.type];
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";
        queryParams.firstname = firstName ? firstName : "";
        queryParams.lastname = lastName ? lastName : "";
        queryParams.email = email ? email : "";
        queryParams.detail = detail ? detail : "";

        return AccMgmtFactory.get(url, queryParams).then(function(response){
            return response;
        });
        
    }
     
     this.updateuser = function(userGUID, data){
        var url = this.apiType.updateUser[this.apiType.type];
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";

        return AccMgmtFactory.put(url, data, queryParams).then(function(response){
            return response;
        });
    };        
      
    this.deleteuser = function(userGUID){      
        var url = this.apiType.deleteUser[this.apiType.type];
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";

        return AccMgmtFactory.delete(url, null, queryParams);
    };
    
    
    this.ChangePassword = function(userGUID, data){
        var url = this.apiType.changePassword[this.apiType.type];        
        var params = {
            userguid: userGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function(response){
            return response;
        });
    }; 
    
    this.getAppNameByUserRole = function(userguid) {
        
        var url = this.apiType.userRole[this.apiType.type];        
        var params = {
            userguid: userguid                     
        };

        return AccMgmtFactory.get(url, params).then(function(response){
            return response;
        });        
    }    
}]);;angular.module('AccountMgmtModule').service('searchAPI',['AccessMgmtFactory','AccountManagementUrlCollection', 'BASEURL',function(AccMgmtFactory, AccountManagementUrlCollection, BASEURL){
            
   
    var self = this;
    self.apiType = {
        type: 'real', //'real',
        searchCompanies: {
            mock: AccountManagementUrlCollection.SEARCHCOMPANY_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SEARCHCOMPANY_REAL
        },
        searchOffices: {
            mock: AccountManagementUrlCollection.SEARCHOFFICE_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SEARCHOFFICE_REAL
        },
        searchUsers: {
            mock: AccountManagementUrlCollection.SEARCHUSERS_MOCK,
            real: BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SEARCHUSERS_REAL
        }
    };
    
    
    this.searchCompanies = function(searchString){
        var url = this.apiType.searchCompanies[this.apiType.type];        
        var queryParams = {};
        queryParams.search = searchString ? searchString : "";
        return AccMgmtFactory.get(url, queryParams).then(function(results){
            return results;
        });
    }
     
    
    this.searchOffices = function(searchString){
        var url = this.apiType.searchOffices[this.apiType.type];        
        var queryParams = {};
        queryParams.search = searchString ? searchString : "";
        return AccMgmtFactory.get(url, queryParams).then(function(results){
            return results;
        });
    }
    
    this.searchUsers = function(searchString){
        var url = this.apiType.searchUsers[this.apiType.type];        
        var queryParams = {};
        queryParams.search = searchString ? searchString : "";
        return AccMgmtFactory.get(url, queryParams).then(function(results){
            return results;
        });
    }   
    
}]);angular.module('AccountMgmtModule').constant('AccountManagementUrlCollection', {
    // Listings URLs
    GETAPI_LISTINGS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    GETAPI_LISTINGS_REAL: '/listings?types={types}',
    
    //Company URLs
    GETAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}?name={name}&search={search}&parent={parentcompanyguid}&hasparent={hasparent}&detail={detail}',
    GETAPI_COMPANY_REAL: '/companies/{companyguid}?name={name}&detail={detail}&parentcompanyguid={parentcompanyguid}&hasparent={hasparent}',

    POSTAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies',
    POSTAPI_COMPANY_REAL: '/companies/',

    PUTAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}',
    PUTAPI_COMPANY_REAL: '/companies/{companyguid}?detail={detail}&name={name}&parent={parentcompanyguid}&hasparent={hasparent}',

    DELETEAPI_COMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}',
    DELETEAPI_COMPANY_REAL: '/companies/{companyguid}?detail={detail}&name={name}&parent={parentcompanyguid}&hasparent={hasparent}',

    GETAPI_APPCOMPONENTITEMS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/appcomponents/{appcomponenttypeguid}/items?limit={limit}&offset={offset}',
    GETAPI_APPCOMPONENTITEMS_REAL: '/appcomponents/{appcomponenttypeguid}/items?limit={limit}&offset={offset}',

    POSTAPI_COMPANYCERTIFICATE_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/certifications',
    POSTAPI_COMPANYCERTIFICATE_REAL: '/companies/{companyguid}/certifications',

    PUTAPI_COMPANYCERTIFICATE_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/certifications/{certificationguid}',
    PUTAPI_COMPANYCERTIFICATE_REAL: '/companies/a0f5e294-b497-4c16-8fa4-526c9413530f/certifications/{certificationguid}',

    POSTAPI_COMPAPPCOMPONENTITEMS_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/applicationcomponentitems',
    POSTAPI_COMPAPPCOMPONENTITEMS_REAL: '/companies/{companyguid}/applicationcomponentitems',

    PUTAPI_COMPAPPCOMPONENTITEMS_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/applicationcomponentitems',
    PUTAPI_COMPAPPCOMPONENTITEMS_REAL: '/companies/{companyguid}/applicationcomponentitems',

    POSTAPI_COMPANYSETUPFEES_MOCK: 'http://private-db7da-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees',
    POSTAPI_COMPANYSETUPFEES_REAL: '/companies/{companyguid}/setupfees',
    
    GETAPI_COMPANYSETUPFEES_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    GETAPI_COMPANYSETUPFEES_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',
    
    DELETEAPI_COMPANYSETUPFEES_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    DELETEAPI_COMPANYSETUPFEES_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',

    POSTAPI_COMPANYASSOCIATION_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',
    POSTAPI_COMPANYASSOCIATION_REAL: '/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',

    GETAPI_COMPANYASSOCIATIONS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',
    GETAPI_COMPANYASSOCIATIONS_REAL: '/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',

    DELETEAPI_COMPANYASSOCIATION_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}',
    DELETEAPI_COMPANYASSOCIATION_REAL: '/companies/{companyguid}/associations/{companyassociationguid}',

    GETAPI_COMPASSOUSERS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}?detail={detail}',
    GETAPI_COMPASSOUSERS_REAL:'/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}?detail={detail}',

    POSTAPI_COMPASSOUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}?detail={detail}',
    POSTAPI_COMPASSOUSER_REAL: '/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}?',

    DELETEAPI_COMPASSOUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/associations/{companyassociationguid}',
    DELETEAPI_COMPASSOUSER_REAL: '/companies/{companyguid}/associations/{companyassociationguid}/users/{companyassociationuserguid}',

    GETAPI_REPORTTEMPLATE_MOCK: 'http://refactor.parcelplatform.com/companytemplates/companyID?filter=filter&reporttype=reportType',
    GETAPI_COMPREPORTEMPLATE_REAL:'/{companyguid}',

    GETAPI_COMPANYREPORTSETTINGS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings/{reportsettingguid}?detail={detail}',
    GETAPI_COMPANYREPORTSETTINGS_REAL: '/companies/{companyguid}/reportsettings/{reportsettingguid}?detail={detail}',

    PUTAPI_COMPANYREPORTSETTING_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings',
    PUTAPI_COMPANYREPORTSETTING_REAL: '/companies/{companyguid}/reportsettings',
    
    GETAPI_COMPANYREPORTVENDORS_MOCK:'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors/{reportvendorguid}?detail={detail}',
    GETAPI_COMPANYREPORTVENDORS_REAL: '/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors/{reportvendorguid}?detail={detail}',

    PUTAPI_COMPANYREPORTVENDORS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors',
    PUTAPI_COMPANYREPORTVENDORS_REAL: '/companies/{companyguid}/reportsettings/{reportsettingguid}/reportvendors',

    
    //Office URLs
    GETAPI_OFFICELIST_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}?name={name}&search={search}&detail={detail}',
    GETAPI_OFFICE_REAL: '/companies/{companyguid}/offices/{officeguid}?detail={detail}&name={name}',
    
    POSTAPI_OFFICECREATE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices',
    POSTAPI_OFFICECREATE_REAL: '/companies/{companyguid}/offices',

    PUTAPI_OFFICEUPDATE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}',
    PUTAPI_OFFICEUPDATE_REAL: '/companies/{companyguid}/offices/{officeguid}',

    DELETEAPI_OFFICEDELETE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}',
    DELETEAPI_OFFICEDELETE_REAL: '/companies/{companyguid}/offices/{officeguid}',
    //Office URL's END


    //Search URL's
    GETAPI_SEARCHCOMPANY_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}?name={name}&search={search}&parent={parentcompanyguid}&hasparent={hasparent}&detail={detail}',
    GETAPI_SEARCHCOMPANY_REAL: '/companies/?search={search}',

    GETAPI_SEARCHOFFICE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/offices/{officeguid}?name={name}&search={search}&detail={detail}',
    GETAPI_SEARCHOFFICE_REAL: '/companies/offices/?search={search}',

    GETAPI_SEARCHUSERS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}?users={userguids}&company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&search={search}&detail={detail}',
    GETAPI_SEARCHUSERS_REAL: '/users/?search={search}',
    //Search URL's end


    //General User URLs
    POSTAPI_CREATEUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users',
    POSTAPI_CREATEUSER_REAL: '/users',

    PUTAPI_UPDATEUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}',
    PUTAPI_UPDATEUSER_REAL: '/users/{userguid}',

    GETAPI_GETUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}?company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&detail={detail}',
    GETAPI_GETUSER_REAL: '/users/{userguid}?company={companyguid}&office={officeguid}&firstname={firstname}&lastname={lastname}&email={email}&detail={detail}',

    DELETEAPI_DELETEUSER_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}',
    DELETEAPI_DELETEUSER_REAL: '/users/{userguid}',    

    GETAPI_VIEWLICENSE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/userguid/licenses/{licenseguid}?filter={filtertype}',
    GETAPI_VIEWLICENSE_REAL: '/users/{userguid}/licenses/{licenseguid}?filter={filtertype}',
    
    PUTAPI_UPDATELICENSE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses/{licenseguid}',
    PUTAPI_UPDATELICENSE_REAL: '/users/{userguid}/licenses/{licenseguid}',

    POSTAPI_CREATEUSERLICENSE_MOCK: 'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses',
    POSTAPI_CREATEUSERLICENSE_REAL: '/users/{userguid}/licenses',

    DELETEAPI_DELETEUSERLICENSE_MOCK: 'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses/{licenseguid}',
    DELETEAPI_DELETEUSERLICENSE_REAL: '/users/{userguid}/licenses/{licenseguid}',

    //******** DANGER *********//
    GETAPI_USERROLE_MOCK: 'modules/accManagement/staticdata/UserRoleJSON.js', // Need to replace this with real
    //******** DANGER *********//
    
    POSTAPI_CHANGEPASSWORD_MOCK : 'http://private-8459d-edrcoreaccessmanagmentapi.apiary-mock.com/authentication/users/{userguid}',    
    POSTAPI_CHANGEPASSWORD_REAL : '/user/{userguid}',
    
    DOWNLOADFILE_MOCK : '',    
    DOWNLOADFILE_REAL : '/{fileguid}?limit=10&offset=0',
    
    DELETEFILE_MOCK : '',    
    DELETEFILE_REAL : 'http://parredatapoc2:8080/corefile/rest/v1.0/files/{fileguid}',
    
    POSTAPI_VERIFYUSERLICENSE_MOCK:'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/licenses/{userlicenseguid}/verifications',
    POSTAPI_VERIFYUSERLICENSE_REAL: '/users/{userguid}/licenses/{userlicenseguid}/verifications',
    
    GETAPI_VIEWINSURANCE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances/{insuranceguid}',
    GETAPI_VIEWINSURANCE_REAL: '/users/{userguid}/insurances',
    
    PUTAPI_UPDATEINSURANCE_MOCK :'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances/{insuranceguid}',
    PUTAPI_UPDATEINSURANCE_REAL :'/users/{userguid}/insurances/{insuranceguid}',
    
    DELETEAPI_DELETEINSURANCE_MOCK :'http://private-c809e-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances/{insuranceguid}',
    DELETEAPI_DELETEINSURANCE_REAL : '/users/{userguid}/insurances/{insuranceguid}',
    
    POSTAPI_CREATEINSURANCE_MOCK : 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/insurances',    
    POSTAPI_CREATEINSURANCE_REAL : '/users/{userguid}/insurances',    
    
    GETAPI_VIEWCOVERAGEAREA_MOCK : 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/coverageareas/{coverageareaguid}',     
    GETAPI_VIEWCOVERAGEAREA_REAL : '/users/{userguid}/coverageareas/{coverageareaguid}',
    
    DELETEAPI_DELETECOVERAGEAREA_MOCK :'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/coverageareas/{coverageareaguid}',    
    DELETEAPI_DELETECOVERAGEAREA_REAL : '/users/{userguid}/coverageareas/{coverageareaguid}',
    
    POSTAPI_ADDTOCOVERAGE_MOCK : 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/coverageareas/{coverageareaguid}',    
    POSTAPI_ADDTOCOVERAGE_REAL : '/users/{userguid}/coverageareas/{coverageareaguid}',
    
    GETAPI_VIEWALLUSERFORMS_MOCK :'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms/{formguid}?formtype={formtype}',
    GETAPI_VIEWALLUSERFORMS_REAL :'/users/{userguid}/forms/{formguid}?formtype={formtype}',
    
    POSTAPI_CREATEUSERFORMS_MOCK : 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms',    
    POSTAPI_CREATEUSERFORMS_REAL :'/users/{userguid}/forms',
    
    DELETEAPI_DELETEUSERFORMS_MOCK : 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms/{formguid}',    
    DELETEAPI_DELETEUSERFORMS_REAL : '/users/{userguid}/forms/{formguid}',
    
    PUTAPI_UPDATEUSERFORMS_MOCK : 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/users/{userguid}/forms/{formguid}',
    PUTAPI_UPDATEUSERFORMS_REAL : '/users/{userguid}/forms/{formguid}',
    //Appraisal User URLs Ends
    
    //******** PARCEL company view service urls ********//
    GETAPI_REPORTTYPES_MOCK: 'http://refactor.parcelplatform.com/reports/reporttypes',
    GETAPI_REPORTTYPES_REAL: 'modules/accManagement/staticdata/reportsTypeJSON.js',
    
    /*GETAPI_TEMPLATELIST_MOCK: 'http://refactor.parcelplatform.com/companytemplates/{companyguid}?filter={filter}&reporttype={reportType}',
    GETAPI_TEMPLATELIST_REAL: 'http://refactor.parcelplatform.com/companytemplates/{companyguid}?filter={filter}&reporttype={reportType}',*/

    // SETUP ITEMS service Urls
    GET_COMPANYSETUP_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    GET_COMPANYSETUP_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',

    PUTAPI_UPDATESETUPTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees',
    PUTAPI_UPDATESETUPTABLE_REAL: '/companies/{companyguid}/setupfees',

    POSTAPI_SENDFEESTOABS_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/invoice',
    POSTAPI_SENDFEESTOABS_REAL: '/companies/{companyguid}/setupfees/invoice',

    POSTAPI_UPDATESETUPTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    POSTAPI_UPDATESETUPTABLE_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid}',

    DELETEAPI_SETUPFEES_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/setupfees/{setupfeeguid}',
    DELETEAPI_SETUPFEES_REAL: '/companies/{companyguid}/setupfees/{setupfeeguid} ',
    // SETUP ITEMS service Urls

    // Current Pricing service Urls
    GETAPI_CURRENTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    GETAPI_CURRENTTABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',

    PUTAPI_UPDATECURRENTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    PUTAPI_UPDATECURRENTTABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',

    POSTAPI_ADDCURRENTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    POSTAPI_ADDCURRENTTABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',

    DELETEAPI_CURRENTRATETABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/rates/{rateguid}',
    DELETEAPI_CURRENTRATETABLE_REAL: '/companies/{companyguid}/rates/{rateguid}',
    // Current Pricing service Urls End

    // Discounts service Urls
    GETAPI_DISCOUNTTABLE_MOCK: 'http://private-87940-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts/{discountguid}',
    GETAPI_DISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts',

    POSTAPI_ADDDISCOUNTTABLE_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts',
    POSTAPI_ADDDISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts',

    PUTAPI_UPDATEDISCOUNTTABLE_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts',
    PUTAPI_UPDATEDISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts',

    DELETEAPI_DISCOUNTTABLE_MOCK: 'http://private-a5dad-edrsharedaccountmanagementapi.apiary-mock.com/companies/{companyguid}/discounts/{discountguid}',
    DELETEAPI_DISCOUNTTABLE_REAL: '/companies/{companyguid}/discounts/{discountguid}',
    // Discounts service Urls End

    // CURRENT YEAR STATUS service Urls
    GETAPI_CURRENTYEARSTATUSTABLE: 'modules/accManagement/staticdata/currentYearStatusTableJSON.js',
    GETAPI_CURRENTYEARSTATUSTABLE_MOCK: 'modules/accManagement/staticdata/currentYearStatusTableJSON.js',
    GETAPI_CURRENTYEARSTATUSTABLE_REAL: 'modules/accManagement/staticdata/currentYearStatusTableJSON.js',
    //CURRENT YEAR STATUS service Urls End

    //******** PARCEL company view service urls End ********//    
    
    /*File Management API*/
    POSTAPI_COREFILE:'?fileRequestJson={fileRequestJson}',
    PUTAPI_COREFILE:'/{fileguid}?fileRequestJson={fileRequestJson}',
    GETAPI_COREFILE:'/{fileguid}/stream',
    GETAPI_COREFILE_INFORMATION:'/{fileguid}',
    DELETEAPI_COREFILE:'/{fileguid}',
    /*Enf of File Management API*/

});var Auth = angular.module('AuthModule', ['ui.router.state']);

Auth.config([
  '$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');


        $stateProvider.state('parcel-login', {
            'url': '/parcel/login',
            'controller': 'ParcelAuthController as parcelAuthCtrl',
            'templateUrl': 'modules/auth/views/parcelAuth/parcelLandingPage.html',
            'resolve': {
                resetPassword: function () {
                    return false;
                }
            }
        });


        $stateProvider.state('c360-login', {
            'url': '/collateral360/login',
            'controller': 'AuthController as authCtrl',
            'templateUrl': 'modules/auth/views/c360Auth/c360LandingPage.html',
            'resolve': {
                resetPassword: function () {
                    return false;
                }
            }
        });
  }
]);;angular.module('AuthModule').controller('AuthController', ['$location', '$modal', 'resetPassword', '$timeout', '$state', function ($location, $modal, resetPassword, $timeout, $state) {

    getApplicationName = function () {
        /*if($location.host() == 'www.collateral360.com')
            return('Collateral360');
        else
            return('PARCEL');*/

        //return('PARCEL');

        return ('PARCEL');

    }

    this.appName = getApplicationName();

    this.openSignInModal = function () {
        $modal.open({
            templateUrl: 'sign-in-modal.html',
            controller: 'AuthModalInstanceController as authModalInst',
            resolve: {
                applicationName: function () {
                    return getApplicationName();
                }
            }
        });
    }

    this.redirectToAccountPage = function () {
        $state.go('AccountsEntity');
    }

    openResetPasswordModal = function () {
        $modal.open({
            templateUrl: 'reset-password-modal.html',
            controller: 'AuthModalInstanceController as authModalInst',
            resolve: {
                applicationName: function () {
                    return getApplicationName();
                }
            }
        });
    }

    if (resetPassword) {
        $timeout(function () {
            openResetPasswordModal();
        }, 50);
    }
}]);;angular.module('AuthModule').controller('AuthController', ['$location', '$modal', 'resetPassword', '$timeout', '$state', function ($location, $modal, resetPassword, $timeout, $state) {

    this.openSignInModal = function () {
        $modal.open({
            templateUrl: 'sign-in-modal.html',
            controller: 'C360AuthController as authModalInst'
        });
    }

    openResetPasswordModal = function () {
        $modal.open({
            templateUrl: 'reset-password-modal.html',
            controller: 'C360AuthController as authModalInst'
        });
    }

    if (resetPassword) {
        $timeout(function () {
            openResetPasswordModal();
        }, 50);
    }
}]);

angular.module('AuthModule').controller('C360AuthController', ['$modalInstance', 'AuthService', function ($modalInstance, AuthService) {
    this.appName = 'Collateral360';
    this.signIn = true;
    this.forgotPass = false;
    this.forgotPassSubmit = false;
    this.resetPass = true;
    this.resetPassSubmit = false;

    this.username = "";
    this.password = "";
    this.passwordRequestEmail = "";
    this.newPassword = "";
    this.repeatPassword = "";

    function clearModalErrors(event) {
        var modalContent = document.getElementsByClassName("modal-content");
        angular.element(modalContent).find('.form-group').each(function () {
            var formElement = angular.element(this);
            if (!formElement.hasClass('ng-hide')) {
                formElement.removeClass('has-error');
                formElement.find('.error-text').each(function () {
                    var spanElem = angular.element(this);
                    if (!spanElem.hasClass('ng-hide'))
                        spanElem.addClass('ng-hide');
                })
            }
        });
    }

    this.closeModal = function () {
        $modalInstance.close();
    }

    this.setViewsState = function (event, flag) {
        this.forgotPass = flag;
        this.signIn = !flag;
        this.forgotPassSubmit = false;
        clearModalErrors(event);
    }

    this.submitCredentials = function (form) {
        //console.log('Post the credentials to server');
        if (form.$valid) {
            console.log('Posting the credentials to test1 server');
            /*AuthService.postUserCredentials(this.username, this.password).then(function(result){
                if (result.status == 'success') {
                    window.location.href = "https://test1.collateral360.com/reporting/index2.php";
                }
                else {
                    var passwordFieldContext = angular.element(document.getElementById('signInPasswordField'));
                    passwordFieldContext.toggleClass('has-error', true);
                    angular.element(passwordFieldContext).append('<span class="help-block error-text">'+result.message+'</span>');
                }
            })*/
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    this.submitPasswordChange = function (form) {
        if (form.$valid) {
            this.forgotPassSubmit = true;
            this.forgotPass = false;
            this.signIn = false;
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }

    this.submitNewPassword = function (form) {
        if (form.$valid) {
            this.resetPass = false;
            this.resetPassSubmit = true;
            console.log('post the new password to server');
        } else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }
}]);;angular.module('AuthModule').controller('ParcelAuthController', ['AuthService', 'resetPassword', function (AuthService, resetPassword) {
    this.resetPassword = resetPassword;
    this.forgotPassSubmit = false;
    this.resetPassSubmit = false;  
        

    function clearErrors(event) {
        //var modalContent = document.getElementsByClassName("modal-content");
        angular.element(document.getElementsByClassName('form-group')).each(function () {
            var formElement = angular.element(this);
            if (!formElement.hasClass('ng-hide')) {
                formElement.removeClass('has-error');
                formElement.find('.error-text').each(function () {
                    var spanElem = angular.element(this);
                    spanElem.remove();
                });
            }
        });
    }

    this.setForgotPasswordDisplay = function (displayFlag) {
        clearErrors();
        var signInPanelDiv = document.getElementById('parcelSignInPanel');
        var forgotPassPanelDiv = document.getElementById('parcelForgotPassPanel');
        if (displayFlag) {
            angular.element(signInPanelDiv).slideUp();
            angular.element(forgotPassPanelDiv).slideDown();
        } else {
            angular.element(signInPanelDiv).slideDown();
            angular.element(forgotPassPanelDiv).slideUp();
        }
    }

    this.setResetPassword = function (flag) {
        this.resetPassword = flag;
    }
    
    this.submitCredentials = function(form) {
        //console.log('Post the credentials to server');
        if(form.$valid) {
            console.log('Posting the credentials to test1 server');
            /*AuthService.postUserCredentials(this.username, this.password).then(function(result){
                if (result.status == 'success') {
                    window.location.href = "https://test1.collateral360.com/reporting/index2.php";
                }
                else {
                    var passwordFieldContext = angular.element(document.getElementById('signInPasswordField'));
                    passwordFieldContext.toggleClass('has-error', true);
                    angular.element(passwordFieldContext).append('<span class="help-block error-text">'+result.message+'</span>');
                }
            })*/
            window.location.href = "http://wwwdev.parcelplatform.com"; 
        }
        else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }        
    }
    
    this.submitForgotPassRequest = function (form) {
        if(form.$valid) {
            this.forgotPassSubmit = true;
            console.log('post the new password to server');
        }
        else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }
    
    this.submitNewPassword = function(form) {
        if(form.$valid) {
            this.resetPassSubmit = true;
            console.log('post the new password to server');
        }
        else {
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
        }
    }
    
}]);;angular.module('AuthModule').factory('AuthService', ['$http', '$log', 'AuthUrls', function ($http, $log, AuthUrls) {
    //var getAuthResponseData = '/modules/auth/staticdata/authResponse.js';

    var authFactoryLogger = $log.getInstance('AuthService');
    factory = {};

    factory.postUserCredentials = function (username, password) {
        var credentialsObj = {
            "uEmail": username,
            "pass": password
        };
        try {
            return $http.post(AuthUrls.postUserCredentials, credentialsObj, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            }, function (error) {
                authFactoryLogger.error(error.statusText);
                return error;
            });
        } catch (e) {
            authFactoryLogger.error(error.statusText)
        }
    }

    return factory;
}]);;;Auth.constant('AuthUrls', {
    postUserCredentials  : 'https://test1.collateral360.com/c360/api/v1/auth/login'
});
;angular.module('ResetPasswordModule').constant('resetPasswordMessages',{
    
    INVALID_USER : 'Email address not found',
    EMAIL_VALIDATION_SUCCESS : 'Your username and details about how to reset your password have been sent to you by email.',
    ERROR : 'Something went wrong',
    RESETPASSWORD_SUCCESS : 'Your password was reset successfully. Please wait while you are redirected.',
    INVALIDTOKEN : 'Invalid Token'
});var ResetPassword = angular.module('ResetPasswordModule', ['ui.router.state']);

ResetPassword.config([
  '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');


        $stateProvider.state('ForgotPassword', {
            'url': '/ForgotPassword',
            'controller': 'ForgotPasswordController as forgotPassword',
            'templateUrl': 'modules/resetPassword/views/forgotPassword.html'
            
        });
        
        $stateProvider.state('ResetPassword', {
            'url': '/ResetPassword?Token',
            'controller': 'ResetPasswordController as resetPassword',
            'templateUrl': 'modules/resetPassword/views/resetPassword.html'
            
        });      
  }
]);;angular.module('ResetPasswordModule').controller('ForgotPasswordController',['resetPasswordFactory','resetPasswordMessages','$state',function(resetPasswordFactory,resetPasswordMessages,$state){

    var self = this;

    init();


    function init(){

    }

    self.resetEmail = function(){
        self.email = undefined;
        self.isEmailValidated = false;
    }

    self.validateEmail = function(form){
        if(!form.$valid){
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            return;
        }
        else{

            resetPasswordFactory.validateEmail(self.email).then(function(response){
                if(response && response.users && response.users.length > 0){
                   self.toEmail = response.users[0].email;
                    var userDetailsArray = [];
                    var userGuidObject = {
                        "key": "USERGUID",
                        "value": response.users[0].userGUID
                    };
                    var userAccountGuidObject = {
                        "key": "OFFICEGUID",
                        "value": response.users[0].office === null ? "" : response.users[0].office.companyOfficeGUID
                    };
                    var userCompanyGuid = {
                        "key": "COMPANYGUID",
                        "value": response.users[0].company === null ? "" : response.users[0].company.companyGUID

                    };
                    var userName = {
                        "key": "USERNAME",
                        "value": response.users[0].firstName + " " + response.users[0].lastName
                    };
                    var email = {
                        "key": "EMAIL",
                        "value": response.users[0].email
                    };
                    var cellPhone = {
                        "key": "PHONE",
                        "value": response.users[0].cellPhone
                    };

                    var companyName = {
                        "key": "COMPANYNAME",
                        "value": response.users[0].company == null ? "" : response.users[0].company.name
                    };

                    var officeName = {
                        "key": "OFFICENAME",
                        "value": response.users[0].office == null ? "" : response.users[0].office.officeName
                    };

                    var isUsed = {
                        "key": "ISUSED",
                        "value": 0
                    };


                    userDetailsArray.push(userGuidObject);
                    userDetailsArray.push(userAccountGuidObject);
                    userDetailsArray.push(userCompanyGuid);
                    userDetailsArray.push(userName);
                    userDetailsArray.push(email);
                    userDetailsArray.push(cellPhone);
                    userDetailsArray.push(companyName);
                    userDetailsArray.push(officeName);
                    userDetailsArray.push(isUsed);


                    createSession(userDetailsArray);
                }
                else{
                    self.isEmailValidated = false;
                    self.message = resetPasswordMessages.INVALID_USER;
                }
            },function(error){
                alertDiv("error");
                self.message = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
            })
        }
    }


    function createSession(userDetailsArray){
        resetPasswordFactory.createSession(userDetailsArray).then(function(sessionToken){
            self.tokenGuid = sessionToken;
            callMessageService();
            //Here message service will be called
            //$state.go('ResetPassword',{Token : sessionToken});
        },function(error){
            alertDiv("error");

            self.message = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
        })
    }

    function callMessageService(){
        resetPasswordFactory.sendEmailNotification(self.toEmail,self.tokenGuid).then(function(response){
            alertDiv("success");
            self.message = resetPasswordMessages.EMAIL_VALIDATION_SUCCESS;
        },function(error){
            alertDiv("error");
            self.message = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;
        })
    }

    function alertDiv(status){
        self.isEmailValidated = true;
        if(status === 'error'){
            $('#forgotPasswordAlert').addClass('alert-danger');
            $('#forgotPasswordAlert').removeClass('alert-success');
        }
        else if(status ==='success'){
            $('#forgotPasswordAlert').addClass('alert-success');
            $('#forgotPasswordAlert').removeClass('alert-danger');
        }
    }



}])


;angular.module('ResetPasswordModule').controller('ResetPasswordController',['resetPasswordFactory','$stateParams','BASEURL','$scope','resetPasswordMessages',function(resetPasswordFactory,$stateParams,BASEURL,$scope,resetPasswordMessages){
   
    var self = this;
    
    init();
    
    
    function init(){
        self.tokenGuid =  $stateParams.Token;

       if(self.tokenGuid)
        ValidateSessionToken(self.tokenGuid);
        else {
           self.isTokenValid = false;
           self.errorMsg = resetPasswordMessages.INVALIDTOKEN;
       }

    }
    
    
    function ValidateSessionToken (tokenGuid){
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.promise =
        resetPasswordFactory.getSession(tokenGuid).then(function(response){
            if(response){
                var isUsedValue;
                self.sessionDataArray = response.sessionToken.sessionData;
                for(var i = 0 ; i < self.sessionDataArray.length ; i ++){
                    if(self.sessionDataArray[i].key === 'ISUSED'){
                        var isUsedValue = self.sessionDataArray[i].value;
                        if(isUsedValue === 0) self.isTokenValid = true;
                        else {self.isTokenValid = false; self.errorMsg = resetPasswordMessages.INVALIDTOKEN}
                    }
                    if(self.sessionDataArray[i].key === 'USERGUID'){
                        self.userGuid = self.sessionDataArray[i].value;
                    }
                }
            }
        },function(error){

            self.isTokenValid = false;
            self.errorMsg = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;;
        })
    }
    
    self.resetPassword = function (){
        self.newPassword = undefined;
        self.repeatPassword = undefined;     
        $('.has-error').removeClass('has-error');
        $('.error-text').remove();   
        self.resetPasswordSuccess = false;
    }
    
    self.submitNewPassword = function(form){
                self.resetPasswordSuccess = false;

        if(!form.$valid){
            var inputElements = document.getElementsByName(form.$name);
            angular.element(inputElements).find(':input').trigger('blur');
            return;
        }
        else{
            resetPasswordFactory.resetPassword(self.newPassword,self.userGuid).then(function(response){

                UpdateTokenInformation();
                
            },function(error){

                self.isPasswordChangedMessage = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;;
                alertDiv('error');
            })
        }
    }
    
    function UpdateTokenInformation(){
        resetPasswordFactory.resetPassword(self.sessionDataArray,self.tokenGuid).then(function(response){

            self.successMsg = resetPasswordMessages.RESETPASSWORD_SUCCESS;
            alertDiv('success');
            $timeout(function(){
                $window.location.href = BASEURL.LandinPage;
            })

        },function(error){

            self.isPasswordChangedMessage = error.data.message ? error.data.message.userMessage : resetPasswordMessages.ERROR;;
            alertDiv('error');
        })
    }

    function alertDiv(status){
        self.resetPasswordSuccess = true;
        if(status === 'error'){
            $('#resetPasswordAlert').addClass('alert-danger');
            $('#resetPasswordAlert').removeClass('alert-success');
        }
        else if(status ==='success'){
            $('#resetPasswordAlert').addClass('alert-success');
            $('#resetPasswordAlert').removeClass('alert-danger');
        }
    }
    
    self.matchPassword = function(form){
        var html = '<span class="help-block error-text"></span>';
        if(self.repeatPassword){
                    if(self.repeatPassword != $scope.resetPassword.newPassword){
                        if($('.repassword').parent().parent().find('span')){
                            $('.repassword').parent().parent().find('span').remove();
                        }
                        $('.repassword').parent().parent().append(html);
                        $('.repassword').parent().parent().find('span').first().html('Password does not match.');
                        $('.repassword').parent().parent().addClass('has-error'); 
                                         
                        form['reset-password-repeat'].$valid = false; 
                        form.$valid = false;
                    }
                    else{
                        if($('.repassword').parent().parent().find('span')){
                            $('.repassword').parent().parent().find('span').remove();
                            $('.repassword').parent().parent().removeClass('has-error'); 
                        }
                        form['reset-password-repeat'].$valid = true; 
                        form.$valid = true;
                    }
                }
    }

    
}])


angular.module('ResetPasswordModule').directive('matchPassword',[function(){
    return{
        restrict : 'A',
        require : ['ngModel','^form'],
           

        
        link : function($scope,elem,attr,formController){
            
            var html = '<span class="help-block error-text"></span>';
            
            
            /*elem.on('input',function(){
                
                if(formController[0].$modelValue){
                    if(formController[0].$modelValue != $scope.resetPassword.newPassword){
                        if(elem.parent().parent().find('span')){
                            elem.parent().parent().find('span').remove();
                        }
                        elem.parent().parent().append(html);
                        elem.parent().parent().find('span').first().html('Password does not match.');
                        elem.parent().parent().addClass('has-error'); 
                                         
                        formController[1][elem.attr('name')].$valid = false; 
                        $scope.parcelResetPassForm.$valid = false;
                    }
                    else{
                        if(elem.parent().parent().find('span')){
                            elem.parent().parent().find('span').remove();
                            elem.parent().parent().removeClass('has-error'); 
                        }
                        formController[1][elem.attr('name')].$valid = true; 
                        $scope.parcelResetPassForm.$valid = true;
                    }
                }
            })*/
            
            elem.bind('blur',function(){
                
                
                    if(!formController[0].$modelValue){
                        if(elem.parent().parent().find('span')){
                            elem.parent().parent().find('span').remove();
                        }
                        elem.parent().parent().append(html);
                        elem.parent().parent().find('span').first().html('Repeat Password cannot be blank');
                        elem.parent().parent().addClass('has-error'); 
                    /*elem.parents().find('[field-validation = "Repeat Password"]').append(html);
                    elem.parents().find('[field-validation = "Repeat Password"]').find('span').first().html('Password does not match.');
                    elem.parents().find('[field-validation = "Repeat Password"]').addClass('has-error');   */                     
                        formController[1][elem.attr('name')].$valid = false; 
                        $scope.parcelResetPassForm.$valid = false;
                    }
                    else{
                        formController[1][elem.attr('name')].$valid = true; 
                        $scope.parcelResetPassForm.$valid = true;
                    }
               
            })
        }
        
    }
}]);angular.module('ResetPasswordModule').factory('resetPasswordFactory', ['BASEURL','$http', function (BASEURL,$http) {
    var factory = {};
    
    
    factory.validateEmail = function (email) {
        var url = BASEURL.GETUSERS + '/?search=' + email;
        return $http.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            }
        }).then(function (response) {
            return response.data;
        }, function (error) {
            throw error;
        })
    }


    factory.createSession = function (userDetailsArray) {

        var url = BASEURL.SESSIONTOKEN;

        var obj = {};
        obj.sessionToken = {};

        obj.sessionToken.expirationTimeFrameMinutes = "1440";
        obj.sessionToken.sessionData = [];
        angular.forEach(userDetailsArray, function (detail) {
            obj.sessionToken.sessionData.push(detail);
        })
        return $http.post(url, obj).then(function (response) {
            if (response) {
                return response.data.sessionToken.sessionTokenGUID;
            }
        }, function (error) {
            throw error;
        })
    };

    factory.getSession = function (sessionGuid) {
        var url = BASEURL.SESSIONTOKEN;
        return $http.get(url + '/' + sessionGuid).then(function (response) {
            if (response) {
                return response.data;
            }
        }, function (error) {
            throw error;
        })
    }

    factory.resetPassword = function (password, userGuid) {
        var url = BASEURL.RESETPASSWORD;
        var obj = {};
        obj.userAuthenitication = {};
        obj.userAuthenitication.password = password;
        return $http.put(url + '/' + userGuid,obj).then(function (response) {
            return response.data;
        }, function (error) {
            throw error;
        })
    }

    factory.updateSessionTokenInfo = function (sessionDataArray, tokenGuid) {
        var url = BASEURL.SESSIONTOKEN;
        var obj = {};
        obj.sessionToken = {};

        for (var i = 0; i < sessionDataArray.length; i++) {
            if (sessionDataArray[i].key === 'ISUSED') {
                sessionDataArray[i].value = 1;
                break;
            }
        }
        obj.sessionToken.sessionData = sessionDataArray;
        return $http.put(url + '/' + tokenGuid,obj).then(function (response) {
            return response.data;
        }, function (error) {
            throw error;
        })
    }


    factory.sendEmailNotification = function (toEmail,tokenGuid){
        var abc =  window.location.protocol + "//" + window.location.host + '/#/ResetPassword';
        console.log("jsdgfj " + abc);
        var url = BASEURL.EMAIL;
        var obj = {}
        obj.assetGUID = BASEURL.ASSETGUID;
        obj.assetType = "cabinet";
        obj.applicationGUID = BASEURL.APPLICATIONGUID;
        obj.messages = [];
        var messageObject = {};
        messageObject.templateName = BASEURL.TEMPLATENAME;
        messageObject.templateGUID = BASEURL.TEMPLATEGUID;
        messageObject.messageType = "EMAIL";
        messageObject.from = "";
        messageObject.to = [toEmail];
        messageObject.cc = [];
        messageObject.bcc = [];
        messageObject.fields = [{
            "fieldName" : "resetPasswordLink",
            "fieldValue" : BASEURL.EMAILLINK  + '?Token=' + tokenGuid
        }]
        obj.messages.push(messageObject);


        return $http.post(url,obj).then(function(response){
            return response.data;
        },function(error){
            throw error;
        })
    }

    return factory;
}])