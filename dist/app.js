var lenderPortalApp = angular.module('LenderPortal', ['ui.router.state', 'ui.bootstrap', 'logEnhancingModule', 'PropertyModule', 'SRFModule','PolicyManagerModule']);

lenderPortalApp.config([
  '$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider',
  function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('Home', {
            'url': '/',
            'controller': 'DashBoardCtrl as dashboard',
            'templateUrl': 'modules/DashBoard/views/dashboard.html',
            'resolve' : {
                dashboardData : function(DashboardFactory){
                    var dashboardData =  DashboardFactory.getDashboardData();
                        return dashboardData.data;
                    
                }
            }
        })
  }
]);






lenderPortalApp.run(['$log', 'logEnhancer', '$http', 'applicationInfoSession', 'environmentInfoSession', 'SRFUrls', 'GUID', function ($log, logEnhancer, $http, applicationInfoSession, environmentInfoSession, SRFUrls, GUID) {

    //Will  be called only once after user logs in
    //Code has to be wriiten for that.
    environmentInfoSession.create();
    applicationInfoSession.create();
    GUID.create();

    var environmentObject = environmentInfoSession.getenvironmentInfo();
    var applicationObject = applicationInfoSession.getapplicationInfo();
    var guid = GUID.get();

    logEnhancer.enhanceAngularLog(applicationObject, environmentObject, SRFUrls, guid, $log, $http);
    
}]);


lenderPortalApp.directive('showErrors', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {

            var inputEl = el[0].querySelector("[name]");

            var inputNgEl = angular.element(inputEl);

            var inputName = inputNgEl.attr('name');

            var blurred = false;

            inputNgEl.bind('blur', function (elem) {

                blurred = true;
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });

            scope.$watch(function () {

                if (formCtrl[inputName] == undefined) {
                    return false;
                } else {

                    return formCtrl[inputName].$invalid;
                }

            }, function (invalid) {

                if (!blurred && invalid) {
                    return
                }

                el.toggleClass('has-error', invalid);
            });

            scope.$on('show-errors-check-validity', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            })


            scope.$on('show-errors-reset', function () {
                $timeout(function () {
                    el.removeClass('has-error');
                }, 0, false);
            });
        }
    }



}]);




lenderPortalApp.value("globalValues", {
    srfCabinetBtn: 'not clicked',
    srfBlockNavigation: '',
    pageRefreshed : false,
    dashBoardCollapseAll : false,
    dashBoardExpandAll : false


});

lenderPortalApp.run(['$rootScope','globalValues', function ($rootScope,globalValues) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {

        if(next === current){

            globalValues.pageRefreshed = true;
        }
        else{
            globalValues.pageRefreshed = false;
        }


        var myEvent = window.attachEvent || window.addEventListener;
        var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

        myEvent(chkevent, function (e) { // For >=IE7, Chrome, Firefox


            var confirmationMessage = 'All your unsaved data will be lost.'; // a space
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        });

    });

}])


lenderPortalApp.run(['$rootScope',function($rootScope){
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    
        
  });
}])

;var policyApp = angular.module('PolicyManagerModule', ['ui.router.state']);


policyApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/Policy', '/Policy/Information');

    $stateProvider.state('Policy', {
        'url': '/Policy',
        'abstract': true,
        'templateUrl': 'modules/PolicyManager/views/policy.navigation.html',
        'controller': 'PolicyNavCtrl as policynav',
        'resolve': {
            'policyparams': function () {
                var obj = [
                    {
                        'dataField': 'LoanType',
                        'displayName': 'Loan Type',
                        'parameterType': 'List'
                        },
                    {
                        'dataField': 'LoanAmount',
                        'displayName': 'Loan Amount',
                        'parameterType': 'Range'
                        },
                    {
                        'dataField': 'PropertyType',
                        'displayName': 'Property Type',
                        'parameterType': 'List'
                        },
                    {
                        'dataField': 'State',
                        'displayName': 'State',
                        'parameterType': 'List'
                        }

                              ]
                return obj;
            },

            'policyvalues': function () {
                var obj = [
                    {
                        'dataField': 'LoanType',
                        'displayName': 'Loan Type',
                        'parameterType': 'List',
                        'options': ['LoanOption1', 'LoanOption2', 'LoanOption3'],
                        'fieldValue': '',
                        'values': ['LoanOption1', 'LoanOption2']
                        },
                    {
                        'dataField': 'LoanAmount',
                        'displayName': 'Loan Amount',
                        'parameterType': 'Range',
                        'fieldLowerValue': '',
                        'fieldHigherValue': '',
                        'values': [{
                            'lowerLimit': '0',
                            'upperLimit': '100,00'
                            }, {
                            'lowerLimit': '100,001',
                            'upperLimit': '1,000,000'
                            }]
                        },
                    {
                        'dataField': 'PropertyType',
                        'displayName': 'Property Type',
                        'parameterType': 'List',
                        'options': ['PropertyOption1', 'PropertyOption2', 'PropertyOption3'],
                        'fieldValue': '',
                        'values': ['PropertyOption1', 'PropertyOption2', 'PropertyOption1']
                        },
                    {
                        'dataField': 'State',
                        'displayName': 'State',
                        'parameterType': 'List',
                        'fieldValue': '',
                        'options': ['State1', 'State2', 'State3'],
                        'values': ['State1', 'State2', 'State3']
                        }

                            ]
                return obj;
            }
        }

    }).
    state('Policy.Information', {
        'url': '/Information',
        'templateUrl': 'modules/PolicyManager/views/policy.information.html',
        'controller': 'PolicyInfoCtrl as policyinfo'
    }).
    state('Policy.Values', {
        'url': '/Values',
        'templateUrl': 'modules/PolicyManager/views/policy.values.html',
        'controller': 'PolicyValuesCtrl as policyvalues'
    }).
    state('Policy.Matrix', {
        'url': '/Matrix',
        'templateUrl': 'modules/PolicyManager/views/policy.matrix.html',
        'controller': 'PolicyMatrixCtrl as policymatrix'
    }).
    state('ViewPolicy', {
        'url': '/View?type',
        'templateUrl': 'modules/PolicyManager/views/policy.view.html',
        'controller': 'PolicyViewCtrl as policyview'
    })
   

    

}]);var propertyApp = angular.module('PropertyModule',['ui.router.state']);

propertyApp.config([ '$stateProvider', '$urlRouterProvider', '$provide', '$httpProvider',function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.when('/Property', '/Property/Overview');

    $stateProvider.state('Property',{
            'url' : '/Property',
            'abstract' : true,
            'templateUrl' : 'modules/Property/views/property.navigation.html',

            'controller' :  'PropertyNavCtrl as propertynav',
            //'params': {'address' : '', 'city' : '', 'state' : '','zip' : ''},
            'resolve' : {
                navLinks : function(PropertyDetailsFactory){
                   return PropertyDetailsFactory.GetNavLinks().then(function(result){

                        return result;
                    });

                },


                PropertyLoanData: function (GetSRFFormDataFactory) {
                    return GetSRFFormDataFactory.propertySectionalForm().then(function(result){
                        return result;

                    });

                }
            }

        }).
        state('Property.Overview',{
            'url' : '/Overview?LocationID&PID',
            'templateUrl' : 'modules/Property/views/property.overview.html',


            'controller' :  'PropertyOverviewCtrl as propertyoverview'


        }).
        state('Property.Valuation',{
            'url' : '/Valuation',
            'templateUrl' : 'modules/Property/views/property.valuation.html',

            'controller' :  'PropertyValuationCtrl as propertyvaluation'

        }).
        state('Property.Environmental',{
            'url' : '/Environmental',
            'templateUrl' : 'modules/Property/views/property.environmental.html',
            'controller' :  'PropertyEnvironmentalCtrl as propertyenvironmental'
        }).
        state('Property.Flood',{
            'url' : '/Flood',
            'templateUrl' : 'modules/Property/views/property.flood.html',
            'controller' :  'PropertyFloodCtrl as propertyflood'
        }).
        state('Property.InspectionServices',{
            'url' : '/InspectionServices',
            'templateUrl' : 'modules/Property/views/property.inspectionsefvices.html',
            'controller' : 'PropertyInspectionSvcCtrl as propertyinspectionsvc'
        }).
        state('Property.AdditionalServices',{
            'url' : '/AdditionalServices',
            'templateUrl' : 'modules/Property/views/property.additionalservices.html',
            'controller' :  'PropertyAdditionalSvcCtrl as propertyadditionalsvc'
        }).
        state('Property.ReportStatus',{
            'url' : '/ReportStatus',
            'templateUrl' : 'modules/Property/views/property.reportstatus.html',
            'controller' :  'PropertyReportStatusCtrl as propertyreportstatus'
        }).
         state('Property.FileManager',{
            'url' : '/FileManager',
            'templateUrl' : 'modules/Property/views/property.filemanager.html',
            'controller' :  'PropertyFileManagerCtrl as propertyfilemanager'
        }).
         state('Property.Monitoring',{
            'url' : '/Monitoring',
            'templateUrl' : 'modules/Property/views/property.monitoring.html',
            'controller' :  'PropertyMonitoringCtrl as propertymonitoring'
        }).
         state('Property.Notepad',{
            'url' : '/Notepad',
            'templateUrl' : 'modules/Property/views/property.notepad.html',
            'controller' :  'PropertyNotepadCtrl as propertynotepad'
        })
}])

;var srfApp = angular.module('SRFModule', ['ui.router.state']);



srfApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/SRF', '/SRF/Cabinet');

    $stateProvider.state('SRF', {
        'url': '/SRF',
        'abstract': true,
        'templateUrl': 'modules/SRF/views/srf.navigation.html',
        'controller': 'SRFNavCtrl as srfnav',
        'params': {
            'view': null
        },
        'resolve': {
            SectionViewLoanData: function (GetSRFFormDataFactory) {


                return GetSRFFormDataFactory.sectionalForm().then(function (result) {
                    return result;
                })



            }
        }

    }).

    state('SRF.Cabinet', {
        'url': '/Cabinet',
        'templateUrl': 'modules/SRF/views/srf.cabinet.create.html',
        'controller': 'SRFCabinetCtrl as srfcabinet',
        'params': {
            'view': null
        }


    }).


    state('SRF.CreateSectionViewLoan', {

        'url': '/CreateLoan/SectionalForm',
        'templateUrl': 'modules/SRF/views/srf.createloan.section.html',
        'controller': 'SRFSectionalViewLoanCtrl as sectionalloan'
    }).

    state('ManageCabinet', {
        'url': '/ManageCabinet',
        'templateUrl': 'modules/SRF/views/srf.cabinet.manage.html',
        'controller': 'SRFManageCabinetCtrl as managecabinet'


    })


}])
;angular.module('templates-dist', ['../modules/HeaderAndFooter/views/footer.html', '../modules/HeaderAndFooter/views/header.alert.html', '../modules/HeaderAndFooter/views/header.html', '../modules/HeaderAndFooter/views/policycreation_popup.html', '../modules/SRF/views/srf.alert.html', '../modules/SRF/views/srf.cabinet.create.html', '../modules/SRF/views/srf.cabinet.manage.html', '../modules/SRF/views/srf.createloan.section.html', '../modules/SRF/views/srf.navigation.html', '../modules/PolicyManager/views/policy.information.html', '../modules/PolicyManager/views/policy.matrix.html', '../modules/PolicyManager/views/policy.navigation.html', '../modules/PolicyManager/views/policy.values.html', '../modules/PolicyManager/views/policy.view.html', '../modules/DashBoard/views/dashboard.acceptedawards.html', '../modules/DashBoard/views/dashboard.awardedbids.html', '../modules/DashBoard/views/dashboard.closed.html', '../modules/DashBoard/views/dashboard.draftservicerequest.html', '../modules/DashBoard/views/dashboard.html', '../modules/DashBoard/views/dashboard.navigation.html', '../modules/DashBoard/views/dashboard.openbids.html', '../modules/DashBoard/views/dashboard.upcomingduedates.html', '../modules/Property/views/property.additionalservices.html', '../modules/Property/views/property.environmental.html', '../modules/Property/views/property.filemanager.html', '../modules/Property/views/property.flood.html', '../modules/Property/views/property.inspectionsefvices.html', '../modules/Property/views/property.monitoring.html', '../modules/Property/views/property.navigation.html', '../modules/Property/views/property.notepad.html', '../modules/Property/views/property.overview.html', '../modules/Property/views/property.reportstatus.html', '../modules/Property/views/property.valuation.html']);

angular.module("../modules/HeaderAndFooter/views/footer.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/HeaderAndFooter/views/footer.html",
    "<div class=\"col-md-3 col-lg-3 needhelppopout\">\n" +
    "	<div class=\"needhelp-toggle\" style=\"display: none;\">\n" +
    "		<button class=\"btn btn-md btn-success pull-right\" type=\"button\"\n" +
    "			help-popup>Need Help?</button>\n" +
    "		<div class=\"clearfix\"></div>\n" +
    "		<div class=\"needhelp \">\n" +
    "			<p>Enter your comment or question here and click send, we'll take\n" +
    "				care of the rest.</p>\n" +
    "			<form>\n" +
    "				<textarea type=\"text\" class=\"form-control\"> </textarea>\n" +
    "				<div class=\"pull-right top-margin\">\n" +
    "					<button type=\"button\" class=\"btn btn-xs btn-default\" help-popup>\n" +
    "						NEVERMIND</button>\n" +
    "					<button type=\"button\" class=\"btn btn-xs btn-primary\">SEND\n" +
    "					</button>\n" +
    "				</div>\n" +
    "			</form>\n" +
    "			<div class=\"clearfix\"></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "	<footer>\n" +
    "		<div class=\" Footermenu-bar1 clearfix\">\n" +
    "			<div class=\"Footermenu1\">\n" +
    "				<ul class=\" list-unstyled \">\n" +
    "					<img class=\"footerlogo \" src=\"images/Footer-logo.png\"\n" +
    "						alt=\"EDR Collateral 360 logo\" />\n" +
    "					<li><a href=\"#\">� 2015 EDR, Inc.</a></li>\n" +
    "					<li>|</li>\n" +
    "					<li><a href=\"#\">Terms of Service</a></li>\n" +
    "					<li>|</li>\n" +
    "					<li><a href=\"#\">Contact Us</a></li>\n" +
    "					<li>|</li>\n" +
    "					<li><a href=\"#\">Current Server: AWS118-1c</a></li>\n" +
    "				</ul>\n" +
    "				<ul class=\"Needhelp-button\" ng-hide=\"hidebtn\">\n" +
    "					<button id=\"needhelp-btn\" help-btn class=\"btn btn-md btn-success\"\n" +
    "						type=\"button\">Need Help?</button>\n" +
    "				</ul>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</footer>\n" +
    "\n" +
    "</div>");
}]);

angular.module("../modules/HeaderAndFooter/views/header.alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/HeaderAndFooter/views/header.alert.html",
    "<div header-alert-events class=\"modal modal-priority-alert fade in\"\n" +
    "	id=\"headerAlertModal\">\n" +
    "	<div class=\"modal-dialog\">\n" +
    "		<div class=\"modal-content\">\n" +
    "			<div class=\"modal-header\">\n" +
    "				<div class=\"icon\">\n" +
    "					<i class=\"fa fa-exclamation-triangle\"></i>\n" +
    "				</div>\n" +
    "				<h4 class=\"modal-title\">Oh No.</h4>\n" +
    "			</div>\n" +
    "			<div class=\"modal-body\">\n" +
    "				<div class=\"content\">\n" +
    "					<p class=\"lead\">\n" +
    "						Something really bad has happened and <b>we've lost all of\n" +
    "							your data.</b>\n" +
    "					</p>\n" +
    "					<p class=\"lead\">We're doing everything we can to get it back.\n" +
    "						We're taking PARCEL offline to prevent further data loss and will\n" +
    "						alert everyone when the problems have been resolved.</p>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"modal-footer\">\n" +
    "				<a   class=\"pull-right btn btn-danger\" ng-click=\"header.alertClick()\"\n" +
    "					data-dismiss=\"modal\">Ok, Got It</a>\n" +
    "			</div>\n" +
    "\n" +
    "\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../modules/HeaderAndFooter/views/header.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/HeaderAndFooter/views/header.html",
    "<div ng-include src=\"'modules/HeaderAndFooter/views/policycreation_popup.html'\">\n" +
    "</div>\n" +
    "\n" +
    "<header ng-controller=\"HeaderController as header\">\n" +
    "    <div ng-include src=\"'modules/HeaderAndFooter/views/header.alert.html'\"></div>\n" +
    "    <nav id=\"EDRnav\" role=\"navigation\" class=\"navbar navbar-lg navbar-default navbar-fixed-top\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "\n" +
    "            <div class=\"navbar-header\">\n" +
    "                <button type=\"button\" data-target=\"#navbarCollapse\" data-toggle=\"collapse\" class=\"navbar-toggle\">\n" +
    "                    <span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span>\n" +
    "                </button>\n" +
    "                <a href=\"#\" class=\"navbar-brand\">Collateral360</a>\n" +
    "            </div>\n" +
    "            <div id=\"navbarCollapse\" class=\"collapse navbar-collapse\">\n" +
    "                <ul class=\"nav navbar-nav\">\n" +
    "                    <li class=\"dropdown\"><a data-toggle=\"dropdown\" class=\"dropdown-toggle\" href=\"#\">POLICIES <b class=\"caret\"></b></a>\n" +
    "                        <ul role=\"menu\" class=\"dropdown-menu\">\n" +
    "                            <li><a ng-repeat = \"policy in  header.policiesType\" redirect-to-specific-policy = {{policy}}> {{policy}} </a></li>\n" +
    "                            \n" +
    "                            \n" +
    "                            <li>\n" +
    "                                <button ng-click=\"header.redirectToCreatePolicy()\" class=\"btn btn-default\">CREATE NEW POLICY</button>\n" +
    "                            </li>\n" +
    "\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li><a href=\"#\">REPORTS</a></li>\n" +
    "                    <li><a href=\"#\">VENDORS</a></li>\n" +
    "                    <li class=\"dropdown\"><a data-toggle=\"dropdown\" class=\"dropdown-toggle\" href=\"#\">COMPANY <b class=\"caret\"></b></a>\n" +
    "                        <ul role=\"menu\" class=\"dropdown-menu\">\n" +
    "                            <li><a href=\"#\">Company Accounts</a></li>\n" +
    "                            <li><a href=\"#\">Supporting Documentation</a></li>\n" +
    "                            <li><a href=\"#\">Platform Settings</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <form role=\"search\" class=\"navbar-form navbar-right \">\n" +
    "\n" +
    "\n" +
    "                    <div class=\"form-group lp-search navbar-search dropdown\" >\n" +
    "                        <div class=\"input-group input-group-bordered\">\n" +
    "                        <input data-toggle=\"dropdown\" type=\"text\" class=\"form-control form-control-bordered input-md\" placeholder=\"Search for Collateral\"  ng-change=\"header.searchLoanRecords()\" ng-model=\"header.loanToSearch\" ng-click=\"header.recentSearchedLoans()\" aria-describedby=\"loanSearchInstructions\"></input>\n" +
    "                        \n" +
    "                        <span tabindex=\"0\" role=\"button\" data-trigger=\"focus\"  data-toggle=\"popover\" title=\"Loan search instruction\"  data-placement=\"bottom\"\n" +
    "       data-content=\"Click on the search box to see your recently viewed properties or start typing to search by borrower name, address, city, state, zip, county, application number or loan number.\" data-container=\"body\"  class=\"input-group-addon addon-primary pointer\" id=\"loanSearchInstructions\"><i class=\"fa fa-info-circle fa-lg\"></i></span>\n" +
    "                        \n" +
    "                        \n" +
    "                        <!--<input data-toggle=\"dropdown\" type=\"text\" class=\"form-control form-control-bordered input-md\" placeholder=\"Search for Collateral\" ng-click=\"header.recentSearchedLoans()\"  ng-change=\"header.searchLoanRecords()\" ng-model=\"header.loanToSearch\"></input>-->\n" +
    "                        <ul id=\"dropdown-deafultloan\" class=\"dropdown-menu loanSearch\" ng-show=\"header.defaultLoanView && header.recentLoanRecords.length > 0\">\n" +
    "                            \n" +
    "\n" +
    "                            <li  data-ng-repeat=\"record in header.recentLoanRecords\">\n" +
    "                                <a data-toggle=\"tab\" ng-click=\"header.redirectToPropertyOverview(record)\" class=\"pointer dropdownli\">{{record.address}} - {{record.city}},  {{record.state}} {{record.zip}} : {{record.loanBorrower}}</a>\n" +
    "                            </li>\n" +
    "                            \n" +
    "                        </ul>\n" +
    "						\n" +
    "						<ul id=\"dropdown-loansearch\" class=\"dropdown-menu loanSearch\" ng-show=\"header.searchLoanView && header.searchedLoanRecords.length > 0\">\n" +
    "						<div infinite-scroll-loan=\"header.loadNextLoanRecords()\" id=\"loansearch\">\n" +
    "                                <li  ng-repeat=\"record in header.searchedLoanRecords\">\n" +
    "                                    <a data-toggle=\"tab\" ng-click=\"header.redirectToPropertyOverview(record)\" class=\"pointer dropdownli\">{{record.address}} - {{record.city}},  {{record.state}} {{record.zip}} : {{record.loanBorrower}}</a>\n" +
    "                                </li>\n" +
    "                                <div ng-show='header.busy'>Loading data...</div>\n" +
    "\n" +
    "                            </div>\n" +
    "                            <div class=\"clearfix\"></div>\n" +
    "						</ul>\n" +
    "                    <ul id=\"dropdown-loansearch\" class=\"dropdown-menu loanSearch\" ng-show=\"header.noRecords\">\n" +
    "						\n" +
    "                                <div>{{header.usermessage}}</div>\n" +
    "\n" +
    "                            \n" +
    "						</ul>\n" +
    "                    <ul id=\"dropdown-loansearch\" class=\"dropdown-menu loanSearch\" ng-show=\"header.recordsLoader\">\n" +
    "						\n" +
    "                                <div>Loading Data...</div>\n" +
    "\n" +
    "                            \n" +
    "						</ul>\n" +
    "                    </div></div>\n" +
    "\n" +
    "                    <!--<div class=\"notifay form-group \">\n" +
    "\n" +
    "                        <a href=\"#\"> <i class=\"fa fa-bell\"></i><span class=\"badge badge-notify\"> 4 </span>\n" +
    "                        </a>\n" +
    "                    </div>-->\n" +
    "                    <div class=\"form-group \">\n" +
    "                        <div class=\"dropdown userinfo \">\n" +
    "                            <button class=\"btn btn-default dropdown-toggle \" type=\"button\" id=\"userDetails\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\n" +
    "                                user nameDropdown <span class=\"caret\"></span>\n" +
    "                            </button>\n" +
    "                            <ul class=\"dropdown-menu pull-right \" aria-labelledby=\"dropdownMenu1\">\n" +
    "                                <div class=\"signoutdiv\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-md btn-primary pull-right\">\n" +
    "                                        <i class=\"fa fa-sign-out icon-16 \"></i>\n" +
    "                                    </button>\n" +
    "                                    <span>Lender Portal Training Company\n" +
    "                                        <p>\n" +
    "                                            <b> Office:</b> Headquarters\n" +
    "                                        </p>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <li class=\"divider\"></li>\n" +
    "                                <li><a href=\"#\"><i class=\"fa fa-user icon-16\"></i>\n" +
    "                                        &nbsp; My account settings</a></li>\n" +
    "                                <li><a href=\"#\"><i class=\"fa fa-wrench icon-16\"></i>&nbsp;Admin\n" +
    "                                        tools</a></li>\n" +
    "                                <li><a href=\"#\"><i class=\"fa fa-exchange icon-16\"></i>&nbsp;Portal\n" +
    "                                        select</a></li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                </form>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!----------------------------------------- breadcrumb -------------------------------------------------------->\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <div class=\"row\">\n" +
    "\n" +
    "                <ul class=\"breadcrumb breadcrumb-inverse Margin-bottom-0 clearfix\">\n" +
    "                    <li><a>Home</a></li>\n" +
    "                    <li class=\"dropdown\"><a class=\"dropdown-toggle\" id=\"branches\" ng-click=\"header.searchCabinets()\" role=\"button\" data-toggle=\"dropdown\">{{header.cabinetHeader}}<b\n" +
    "                            class=\"caret\"></b></a>\n" +
    "\n" +
    "                        <ul id=\"branches-dropdown\" class=\"dropdown-menu\">\n" +
    "                            <li stop-propagation>\n" +
    "                                <input class=\"form-control\" ng-change=\"header.loadCabinetsToDropDown()\" ng-model=\"header.cabinetName\" type=\"text\" />\n" +
    "                            </li>\n" +
    "\n" +
    "                            <!--div to show items on first load and on scroll-->\n" +
    "                            <div infinite-scroll='header.nextPage()'>\n" +
    "                                <li data-ng-show=\"header.hideOnFilter\" data-ng-repeat=\"item in header.items\"><a data-toggle=\"tab\" ng-click=\"header.loadCabinet(item)\" class=\"pointer dropdownli\">{{item.cabinetName}}</a>\n" +
    "                                </li>\n" +
    "                                <div ng-show='busy'>Loading data...</div>\n" +
    "                            </div>\n" +
    "                            <li stop-propagation>\n" +
    "\n" +
    "                                <div ng-show=\"(cabinets | filter:header.cabinetName).length == 0 && header.cabinetcount\">No cabinets found</div>\n" +
    "                            </li>\n" +
    "\n" +
    "                            <!--This li comes up after searching in dropdown-->\n" +
    "                            <li data-ng-show=\"header.showOnFilter\" data-ng-repeat=\"item in header.cabinets | filter:header.cabinetName\">\n" +
    "                                <a data-toggle=\"tab\" href=\"\" ng-click=\"header.loadCabinet(item)\" class=\"pointer\">{{item.cabinetName}}</a>\n" +
    "                            </li>\n" +
    "\n" +
    "                        </ul> &nbsp;&nbsp; <span ng-show=\"header.cabinetSelected\" id=\"clearCabinetSelection\" class=\"glyphicon glyphicon-remove pointer\" ng-click=\"header.clearCabinetFilter(); header.cabinetSelected = !header.cabinetSelected\" title=\"Clear the cabinet selection\"></span> <span class=\"divider\">/</span>\n" +
    "                    </li>\n" +
    "                    <span class=\" \">\n" +
    "                        <button type=\"button\" class=\"btn btn-xs btn-default\"\n" +
    "                            ng-click=\"header.manageCabinet()\" ng-show=\"header.showManageBtn\">MANAGE</button>\n" +
    "                    </span>\n" +
    "                    <!--<div breadcrumb ng-show=\"header.isHome\"></div>-->\n" +
    "                    \n" +
    "                    \n" +
    "                    <span class=\" pull-right \">\n" +
    "\n" +
    "                        <button type=\"button\" ng-click=\"header.createLoan()\"\n" +
    "                            class=\"btn btn-xm btn-success\">CREATE LOAN</button>\n" +
    "                    </span>\n" +
    "\n" +
    "                </ul>\n" +
    "    </nav>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</header>");
}]);

angular.module("../modules/HeaderAndFooter/views/policycreation_popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/HeaderAndFooter/views/policycreation_popup.html",
    "<script type=\"text/ng-template\" id=\"policycreation_popup.html\">\n" +
    "\n" +
    "  \n" +
    "\n" +
    "<div class=\"modal-header dividerline\">\n" +
    "  <button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"ClosePolicyCreationPopUp()\"> <span aria-hidden=\"true\">&times;</span></button>\n" +
    "  <h4 class=\"modal-title\">CREATE NEW POLICY</h4>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "      <form name = \"createpolicyform\" ng-submit=\"CreatePolicy(createpolicyform)\">\n" +
    "       \n" +
    "<div  class=\"form-group\" show-errors>\n" +
    "      <label for=\"policyname\">Policy Name</label>\n" +
    "      <input type=\"text\" tabindex = \"1\" class=\"form-control\"\n" +
    "                               name=\"policyname\" ng-model=\"policyname\" placeholder=\"Policy Name\" required/>\n" +
    "							   \n" +
    "                               \n" +
    "	\n" +
    "    \n" +
    "    </div>\n" +
    "\n" +
    "<div  class=\"form-group\" show-errors>\n" +
    "      <label for=\"policytype\" >Policy Type</label>\n" +
    " <select ng-model=\"policytype\" name = \"policytype\" class=\"form-control\" \n" +
    "       ng-options=\"policytype.name as policytype.name  for policytype in policytypes\"  options-disabled=\"policytype.isinuse for policytype in policytypes\"  required>\n" +
    "\n" +
    "</select>\n" +
    "							   \n" +
    "                               \n" +
    "	\n" +
    "    \n" +
    "    </div>\n" +
    "\n" +
    "      </form>\n" +
    " </div>\n" +
    "<div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">NeverMind</button>\n" +
    "        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"CreatePolicy(createpolicyform)\">Create Policy</button>\n" +
    "      </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</script>\n" +
    "");
}]);

angular.module("../modules/SRF/views/srf.alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/SRF/views/srf.alert.html",
    "<div action-events class=\"modal modal-priority-alert fade in\"\n" +
    "	id=\"srfAlertModal\">\n" +
    "	<div class=\"modal-dialog\">\n" +
    "		<div class=\"modal-content\">\n" +
    "			<div class=\"modal-header\">\n" +
    "				<div class=\"icon\">\n" +
    "					<i class=\"fa fa-exclamation-triangle\"></i>\n" +
    "				</div>\n" +
    "				<h4 class=\"modal-title\">Oh No.</h4>\n" +
    "			</div>\n" +
    "			<div class=\"modal-body\">\n" +
    "				<div class=\"content\">\n" +
    "					<p class=\"lead\">\n" +
    "						Something really bad has happened and <b>we've lost all of\n" +
    "							your data.</b>\n" +
    "					</p>\n" +
    "					<p class=\"lead\">We're doing everything we can to get it back.\n" +
    "						We're taking PARCEL offline to prevent further data loss and will\n" +
    "						alert everyone when the problems have been resolved.</p>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"modal-footer\">\n" +
    "				<a class=\"pull-right btn btn-danger\" ng-click=\"srfnav.alertClick()\"\n" +
    "					data-dismiss=\"modal\">Ok, Got It</a>\n" +
    "			</div>\n" +
    "\n" +
    "\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../modules/SRF/views/srf.cabinet.create.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/SRF/views/srf.cabinet.create.html",
    "<!-- STEP 1: CHOOSE CABINET start -->\n" +
    "\n" +
    "<h6 class=\"table-H-label\">Please select the cabinet that you would\n" +
    "    like to add the loan to, or create a new cabinet.</h6>\n" +
    "<div class=\"alert alert-danger alert-dismissible\" role=\"alert\" id=\"srfCabinetInfo\"\n" +
    "    ng-show=\"srfcabinet.createCabinetFailed\">\n" +
    "    <button type=\"button\" class=\"close\"\n" +
    "        ng-click=\"srfcabinet.closeWarning()\" aria-label=\"Close\">\n" +
    "        <span aria-hidden=\"true\">&times;</span>\n" +
    "    </button>\n" +
    "    <strong>Warning!</strong> {{srfcabinet.serviceErrorMsg}}\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-md-6 col-sm-6 col-lg-6 border-right text-center\">\n" +
    "        <img class=\"creatloan-icon \" src=\"images/newloan.png\" alt=\"newloan\">\n" +
    "        <p class=\"text-30\">\n" +
    "            <a class=\"decoration-n  text-green pointer\"\n" +
    "                ng-click=\"srfcabinet.showExistingCabinet()\"> Add a new Loan to\n" +
    "                an Existing Cabinet</a>\n" +
    "        </p>\n" +
    "        <div class=\"newloanresults\" ng-show=\"srfcabinet.existingCabinet\">\n" +
    "            <p>You can search for an existing cabinet by typing it's name in\n" +
    "                the box below. Matching results will be shown. When you find the\n" +
    "                cabinet you want to modify select it and click continue.</p>\n" +
    "            <form role=\"form\" name=\"srfcabinet.existingCabinetForm\" class=\"\"\n" +
    "                novalidate>\n" +
    "                <fieldset>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-12 col-md-12 col-xs-12\">\n" +
    "                            <div class=\"input-group stylish-input-group  dropup \" show-errors>\n" +
    "                                <div class=\"dropdown\">\n" +
    "                                    <button id=\"srfExistingCabinet\" type=\"button\"\n" +
    "                                        placeholder=\"Choose cabinet\"\n" +
    "                                        class=\"form-control dropdown-toggle btn btn-md btn-default\"\n" +
    "                                        ng-bind=\"srfcabinet.selectedCabinet\" role=\"button\"\n" +
    "                                        data-toggle=\"dropdown\" required name=\"existingCabinet\">\n" +
    "                                    </button>\n" +
    "                                    <ul class=\"dropdown-menu\">\n" +
    "                                        <li stop-propagation>\n" +
    "                                            <div class=\"right-inner-addon \">\n" +
    "                                                <i class=\"fa fa-search\"></i> <input type=\"search\"\n" +
    "                                                    ng-model=\"CabinetName\" class=\"form-control\"\n" +
    "                                                    placeholder=\"Search\" />\n" +
    "                                            </div>\n" +
    "                                        </li>\n" +
    "\n" +
    "                                        <li stop-propagation>\n" +
    "                                            <div ng-show=\"(cabinets | filter:cabinetName).length == 0\">No\n" +
    "                                                cabinets found</div>\n" +
    "                                        </li>\n" +
    "                                        <li data-ng-repeat=\"item in cabinets | filter:cabinetName\">\n" +
    "                                            <a data-toggle=\"tab\"\n" +
    "                                            ng-click=\"srfcabinet.filterCabinet(item)\"\n" +
    "                                            class=\"pointer dropdownli\">{{item.cabinetName}}</a>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                                <span class=\"input-group-btn \">\n" +
    "                                    <button type=\"submit\" class=\"btn btn-md btn-primary\"\n" +
    "                                        ng-click=\"srfcabinet.selectExistingCabinet(srfcabinet.existingCabinetForm)\">\n" +
    "                                        Continue</button>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </fieldset>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 col-sm-6 col-lg-6 text-center\">\n" +
    "        <img class=\"creatloan-icon \" src=\"images/newcabinet.png\"\n" +
    "            alt=\"newcabinet\">\n" +
    "        <p class=\"text-30\">\n" +
    "            <a class=\"decoration-n text-green pointer\"\n" +
    "                ng-click=\"srfcabinet.showNewCabinet()\">Create a new Cabinet</a>\n" +
    "        </p>\n" +
    "        <div class=\"newcabinetresults\" ng-show=\"srfcabinet.newCabinet\">\n" +
    "            <p>Your new cabinet needs a name, so that you can easily\n" +
    "                distinguish it later. Enter one now.</p>\n" +
    "            <form name=\"srfcabinet.newCabinetForm\" role=\"form\" class=\"\"\n" +
    "                novalidate>\n" +
    "                <fieldset>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-sm-12 col-md-12 col-lg-12 col-xs-12\">\n" +
    "                            <div class=\"input-group\" show-errors>\n" +
    "                                <input type=\"text\" class=\"form-control\" name=\"createCabinet\"\n" +
    "                                    ng-model=\"srfcabinet.newCabinetName\" required /> <span\n" +
    "                                    class=\"input-group-btn\">\n" +
    "                                    <button type=\"submit\" class=\"btn btn-md btn-primary\"\n" +
    "                                        ng-click=\"srfcabinet.createNewCabinet(srfcabinet.newCabinetForm)\">\n" +
    "                                        Continue</button>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </fieldset>\n" +
    "            </form>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../modules/SRF/views/srf.cabinet.manage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/SRF/views/srf.cabinet.manage.html",
    "<script type=\"text/ng-template\" id=\"alertpopup.html\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div class=\"alert alert-danger\"  role=\"alert\">\n" +
    "            <span class=\"alert-link\">Are you sure you want to delete this cabinet?</span>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"deletealert.cancelDeletion()\">No</button>\n" +
    "        <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"deletealert.deleteCabinet()\">Yes</button>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "<div class=\"container-fluid\">\n" +
    "\n" +
    "    <h2 class=\"page-header\">MANAGE CABINET</h2>\n" +
    "    <div class=\"alert alert-dismissible\" role=\"alert\" id=\"serviceResponseDiv\"\n" +
    "        ng-show=\"managecabinet.serviceResponseAlert\">\n" +
    "        <button type=\"button\" class=\"close\"\n" +
    "            ng-click=\"managecabinet.closeWarning()\" aria-label=\"Close\">\n" +
    "            <span aria-hidden=\"true\">&times;</span>\n" +
    "        </button>\n" +
    "        {{managecabinet.serviceResponseText}}\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-info\" ng-show = \"managecabinet.cabinetDeleted\">Cabinet Deleted</div>\n" +
    "    <div class=\"row \" ng-show = \"!managecabinet.cabinetDeleted\">\n" +
    "        <div class=\"col-md-6 col-sm-6 col-lg-6 \">\n" +
    "            <form name=\"managecabinet.managecabinetform\" role=\"form\" novalidate>\n" +
    "                <div class=\"form-group\" ng-show=\"managecabinet.default\">\n" +
    "                    <button class=\"btn btn-md btn-danger\" type=\"button\"\n" +
    "                        ng-click=\" managecabinet.cancelEdit();\">\n" +
    "                        <i class=\"fa fa-times\"></i> Cancel\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-md btn-default\" type=\"button\"\n" +
    "                        ng-click=\"managecabinet.saveEdit();\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i> Save\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\" ng-show=\"!managecabinet.default\">\n" +
    "                    <button class=\"btn btn-md btn-default\" type=\"button\" ng-disabled = \"managecabinet.emptyModal()\"\n" +
    "                        ng-click=\"managecabinet.editCabinetDetails();\">\n" +
    "                        <i class=\"fa fa-pencil\"></i> Edit\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-md btn-danger\" type=\"button\" ng-disabled = \"managecabinet.emptyModal()\"\n" +
    "                        ng-click=\"managecabinet.deletePopUp()\">\n" +
    "                        <i class=\"fa fa-times\"></i> Delete\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div class=\"row form-group\" show-errors>\n" +
    "                    <label for=\"txtcabinetname\" class=\"col-md-4 col-sm-4 col-xs-12  \">Cabinet\n" +
    "                        Name:</label>\n" +
    "                    <div class=\"col-md-8 col-sm-8 col-xs-12\">\n" +
    "                        <input type=\"text\" class=\"form-control\"\n" +
    "                            ng-disabled=\"!managecabinet.edit\"\n" +
    "                            ng-model=\"managecabinet.cabinetName\" name=\"txtcabinetName\"\n" +
    "                            required />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row form-group\" show-errors>\n" +
    "                    <label for=\"txtcabinetemail\" class=\"col-md-4  col-sm-4 col-xs-12 \">Monitoring\n" +
    "                        Alert Emails:</label>\n" +
    "                    <div class=\"col-md-8 col-sm-8 col-xs-12\" id=\"cabinetemail\">\n" +
    "                        <textarea rows=\"5\" class=\"form-control\"\n" +
    "                            ng-disabled=\"!managecabinet.edit\" ng-show=\"!managecabinet.edit\"\n" +
    "                            ng-model=\"managecabinet.prefilledEmails\"></textarea>\n" +
    "                        <input id=\"emailTypeahead\" placeholder=\"Select Email\"\n" +
    "                            ng-show=\"managecabinet.edit\" custom-action diremail=\"{{email}}\"\n" +
    "                            type=\"email\" class=\"form-control\" ng-model=\"email\"\n" +
    "                            name=\"txtcabinetemail\"\n" +
    "                            typeahead=\"email for email in emails | filter:$viewValue\"\n" +
    "                            typeahead-on-select=\"managecabinet.selectEmail()\"\n" +
    "                            ng-disabled=\"!managecabinet.edit\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"cabinetemaildiv top-margin\"></div>\n" +
    "        </form>\n" +
    "                \n" +
    "                </div>\n" +
    "    </div>\n" +
    "    \n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("../modules/SRF/views/srf.createloan.section.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/SRF/views/srf.createloan.section.html",
    "<div sectionalform-directive form=\"sectionalloan.form\"></div>\n" +
    "\n" +
    "<hr>\n" +
    "");
}]);

angular.module("../modules/SRF/views/srf.navigation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/SRF/views/srf.navigation.html",
    "<div ng-include src=\"'modules/SRF/views/srf.alert.html'\"></div>\n" +
    "<div class=\"container-fluid\">\n" +
    "	<div class=\"row \">\n" +
    "		<div\n" +
    "			class=\"col-md-3 col-lg-3 col-sm-3 margin-padding-0 bg-gray panel-left\">\n" +
    "			<div class=\"box-dark-gray\">\n" +
    "				<span class=\"text-24\"> CREATING NEW LOAN </span>\n" +
    "			</div>\n" +
    "			<div class=\"top-margin\">\n" +
    "				<ul id=\"srfulSectionNavigation\" class=\"nav nav-pills nav-stacked-lg\">\n" +
    "\n" +
    "\n" +
    "					<li id=\"leftnavChooseCabinet\" role=\"presentation\"\n" +
    "						ng-click=\"srfnav.chooseCabinet()\" active-class-sectional-view\n" +
    "						title=\"\" class=\"active\"><a> STEP 1: CHOOSE CABINET </a></li>\n" +
    "\n" +
    "					<li id=\"leftnav{{tab.tabTitle}}\" class=\"disabled\"\n" +
    "						active-class-sectional-view title=\"{{tab.tabTitle}}\"\n" +
    "						ng-click=\"srfnav.navLinkClicked(tab.tabTitle)\"\n" +
    "						ng-repeat=\"tab in srfnav.form.tabsArray\" role=\"presentation\"><a>STEP\n" +
    "							{{$index+2}}: {{tab.tabTitle}} </a></li>\n" +
    "				</ul>\n" +
    "				<hr>\n" +
    "				<div class=\"col-md-12 col-sm-12\">\n" +
    "					<button shift-previous id=\"srfPreviousBtn\"\n" +
    "						class=\"btn btn-md btn-primary pull-left\"\n" +
    "						ng-click=\"srfnav.srfPreviousBtn()\" type=\"button\">\n" +
    "						Previous</button>\n" +
    "					<button shift-next id=\"srfNextBtn\" ng-click=\"srfnav.srfNextBtn()\"\n" +
    "						class=\"btn btn-md btn-primary pull-right\" type=\"button\">\n" +
    "						{{srfnav.srfNextBtnText}}</button>\n" +
    "				</div>\n" +
    "				<div class=\"clearfix\"></div>\n" +
    "				<hr class=\"border-gray\">\n" +
    "				<div class=\"col-md-12 col-sm-12 form-group text-center\">\n" +
    "					<button class=\"btn btn-md btn-danger\" type=\"button\">\n" +
    "						CANCEL LOAN CREATION</button>\n" +
    "				</div>\n" +
    "				<div class=\"clearfix\"></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div class=\"col-md-9 col-lg-9 col-sm-9 panel-right \">\n" +
    "			<h2 class=\"page-header\">Create Loan</h2>\n" +
    "			<div ui-view=\"\"></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../modules/PolicyManager/views/policy.information.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/PolicyManager/views/policy.information.html",
    "<h3 class=\"text-size-24\">NAME AND TYPE</h3>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-6 col-lg-6 col-sm-12\">\n" +
    "        <div class=\"form-group\">\n" +
    "        <label for=\"policyname\">Policy Name</label>\n" +
    "        <input type=\"text\" class=\"form-control\" id=\"policyname\">\n" +
    "        </div>    \n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "    <label>Policy Type</label>\n" +
    "    <div class=\"radio\">\n" +
    "      <label>\n" +
    "        <input type=\"radio\" name=\"optionsRadios\" id=\"optionsRadios1\" value=\"option1\">\n" +
    "        Environmental(<span class=\"text-muted\">Policy exists.</span><a href=\"#\">Click here to edit.</a>)\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"radio\">\n" +
    "      <label>\n" +
    "        <input type=\"radio\" name=\"optionsRadios\" id=\"optionsRadios2\" value=\"option2\">\n" +
    "        Flood(<span class=\"text-muted\">Policy exists.</span><a href=\"#\">Click here to edit.</a>)\n" +
    "      </label>\n" +
    "    </div>\n" +
    "        <div class=\"radio\">\n" +
    "      <label>\n" +
    "        <input type=\"radio\" name=\"optionsRadios\" id=\"optionsRadios3\" value=\"option3\">\n" +
    "        Inpsection Services\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"radio\">\n" +
    "      <label>\n" +
    "        <input type=\"radio\" name=\"optionsRadios\" id=\"optionsRadios4\" value=\"option4\">\n" +
    "        Valuation(<span class=\"text-muted\">Policy exists.</span><a href=\"#\">Click here to edit.</a>)\n" +
    "      </label>\n" +
    "    </div>\n" +
    "</div>\n" +
    " <h3 class=\"text-size-24\">PARAMETERS</h3>\n" +
    "<div class=\"form-group\">\n" +
    "    <label>Policy will be based on:</label><br/>\n" +
    "    <em class=\"text-muted\">As <u>Loan Amount</u> and <u>Loan Type</u> are common parameters for policies, we have preselected them for you.</em>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" value=\"\">\n" +
    "        Business Operations Risk Level\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" value=\"\">\n" +
    "        Loan Amount\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" value=\"\">\n" +
    "        Loan Type\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" value=\"\">\n" +
    "        Property Type\n" +
    "      </label>\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "      <label>\n" +
    "        <input type=\"checkbox\" value=\"\">\n" +
    "        State/Province\n" +
    "      </label>\n" +
    "    </div>  \n" +
    "</div>");
}]);

angular.module("../modules/PolicyManager/views/policy.matrix.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/PolicyManager/views/policy.matrix.html",
    "<table class=\"table table-striped vert-align\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th>Loan Type</th>\n" +
    "      <th>Loan Amount</th>\n" +
    "      <th>Property Type</th>\n" +
    "      <th>Suggested Action(s)</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr>\n" +
    "      <td>Construction Loan</td>\n" +
    "      <td>0- 100,000</td>\n" +
    "      <td>Sport/Entertainment</td>\n" +
    "      <td>\n" +
    "      <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            QuickView Site Inspection(Drive-by Site Report)\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            QuickPro Site Inspection(Comprehensive Site Report)\n" +
    "          </label>\n" +
    "      </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <td>Construction Loan</td>\n" +
    "      <td>0- 100,000</td>\n" +
    "      <td>Sport/Entertainment</td>\n" +
    "      <td>\n" +
    "      <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            QuickView Site Inspection(Drive-by Site Report)\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            QuickPro Site Inspection(Comprehensive Site Report)\n" +
    "          </label>\n" +
    "      </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <td>Construction Loan</td>\n" +
    "      <td>0- 100,000</td>\n" +
    "      <td>Sport/Entertainment</td>\n" +
    "      <td>\n" +
    "      <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            QuickView Site Inspection(Drive-by Site Report)\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            QuickPro Site Inspection(Comprehensive Site Report)\n" +
    "          </label>\n" +
    "      </div>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "\n" +
    "<!--\n" +
    "<h3 class=\"text-size-24\">SAMPLE LOAN INFORMATION</h3>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "<div class=\"col-md-4 col-lg-4\">\n" +
    "<form> \n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"loanamount\">Loan amount</label>\n" +
    "    <input type=\"email\" class=\"form-control\" id=\"loanamount\" placeholder=\"Email\">\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"loantype\">Loan type</label>\n" +
    "    <select class=\"form-control\">\n" +
    "      <option>Line of Credit</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"propertytype\">Property Type</label>\n" +
    "    <select class=\"form-control\">\n" +
    "      <option>Residential</option>\n" +
    "    </select>\n" +
    "  </div>\n" +
    "  <button type=\"submit\" class=\"btn btn-primary\">test policy</button>\n" +
    "\n" +
    "</form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"col-md-12 col-lg-12\">\n" +
    "\n" +
    "<h3 class=\"text-size-24\">POLICY RESULT</h3>\n" +
    "</div>\n" +
    "</div>\n" +
    "-->");
}]);

angular.module("../modules/PolicyManager/views/policy.navigation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/PolicyManager/views/policy.navigation.html",
    "<!DOCTYPE html>\n" +
    "\n" +
    "<html>\n" +
    "<head>\n" +
    "<meta charset=\"utf-8\">\n" +
    "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
    "</head>\n" +
    "\n" +
    "<body>\n" +
    "<div class=\"container-fluid\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-lg-3 col-sm-3 margin-padding-0 bg-gray panel-left\">\n" +
    "      <div class=\"top-margin\">\n" +
    "        <ul id=\"ulnavigation\" class=\"nav nav-pills nav-stacked-lg \">\n" +
    "          <li active-class urlparams=\"/Policy/Parameters\" class=\"active\"><a ui-sref=\".Parameters\"> STEP 1: POLICY INFORMATION </a></li>\n" +
    "          <li active-class urlparams=\"/Policy/Values\"><a ui-sref=\".Values\"> STEP 2: PARAMETER VALUES </a></li>\n" +
    "          <li active-class urlparams=\"/Policy/Matrix\"><a ui-sref=\".Matrix\"> STEP 3: POLICY MATRIX </a></li>\n" +
    "          <li active-class urlparams=\"/Policy/Testpolicy\"><a ui-sref=\".Testpolicy\"> STEP 4: TEST POLICY </a></li>\n" +
    "        </ul>\n" +
    "   <!--     <hr class=\"border-gray\">\n" +
    "       <div class=\"col-md-12 col-sm-12 clearfix\">\n" +
    "          <button id=\"prevbtn\" shift-previous class=\"btn btn-md btn-primary pull-left\" type=\"button\"> Previous </button>\n" +
    "          <button id=\"nxtbtn\" shift-next class=\"btn btn-md btn-primary pull-right\" type=\"button\"> {{nxtbtntext}} </button>\n" +
    "        </div>  -->\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "        <hr class=\"border-gray\">\n" +
    "        <div class=\"col-md-12 col-sm-12 text-center \">\n" +
    "          <button class=\"btn btn-md btn-danger\" type=\"button\"> CANCEL POLICY CREATION </button>\n" +
    "        </div>\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-lg-9 col-sm-9 panel-right\">\n" +
    "      <h2 class=\"page-header\" >STEP 1: POLICY INFORMATION</h2>\n" +
    "      <div ui-view=\"\"></div>\n" +
    "      <br/><br/>\n" +
    "      <div class=\"page-footer clearfix\">\n" +
    "          \n" +
    "        <button class=\"btn btn-default\" role=\"button\">previous: ........</button>\n" +
    "        <div class=\"pull-right\">\n" +
    "        <button class=\"btn btn-default\" role=\"button\">save as draft</button>\n" +
    "        <button class=\"btn btn-primary\" role=\"button\">next: ..........</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("../modules/PolicyManager/views/policy.values.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/PolicyManager/views/policy.values.html",
    "<h3 class=\"text-size-24\">Loan Types</h3>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-md-3\">  \n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Construction Loan\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Forclosure\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Line of Credit\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Government Lending\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Purchase\n" +
    "          </label>\n" +
    "        </div> \n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">  \n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Renewal with new money\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Renewal with no money option\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            SBA\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            VA Lending\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<h3 class=\"text-size-24\">Loan Amounts</h3>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-4 col-lg-4\">\n" +
    "        <label for=\"startingrangevalue\">Starting range value</label>\n" +
    "    </div> \n" +
    "\n" +
    "    <div class=\"col-md-4 col-lg-4\">\n" +
    "        <label for=\"endingrangevalue\">Ending range value</label>\n" +
    "    </div>\n" +
    "   \n" +
    "    \n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "<form class=\"form-inline\">\n" +
    "    <div class=\"col-md-4 col-lg-4\">\n" +
    " <div class=\"form-group txt-width\">\n" +
    "        <label class=\"sr-only\" for=\"startingrangevalue\">Starting range value</label>\n" +
    "        <input type=\"text\" class=\"form-control txt-width\" id=\"startingrangevalue\">\n" +
    " </div>\n" +
    "    </div>\n" +
    "    <span class=\"pull-left\">-</span>\n" +
    "    <div class=\"col-md-4 col-lg-4\">\n" +
    "  <div class=\"form-group txt-width\">\n" +
    "        <label class=\"sr-only\" for=\"endingrangevalue\">Ending range value</label>\n" +
    "        <input type=\"text\" class=\"form-control txt-width\" id=\"endingrangevalue\">\n" +
    "    </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-3 col-lg-3\">\n" +
    "  <button type=\"submit\" class=\"btn btn-danger btn-xs top-margin-5\"><span class=\"glyphicon glyphicon-minus-sign\"></span> remove range</button>\n" +
    "    </div>\n" +
    "</form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row top-margin\">\n" +
    "<form class=\"form-inline\">\n" +
    "    <div class=\"col-md-4 col-lg-4\">\n" +
    " <div class=\"form-group txt-width\">\n" +
    "        <label class=\"sr-only\" for=\"startingrangevalue\">Starting range value</label>\n" +
    "        <input type=\"text\" class=\"form-control txt-width\" id=\"startingrangevalue\">\n" +
    " </div>\n" +
    "    </div>\n" +
    "        <span class=\"pull-left\">-</span>\n" +
    "    <div class=\"col-md-4 col-lg-4\">\n" +
    "  <div class=\"form-group txt-width\">\n" +
    "        <label class=\"sr-only\" for=\"endingrangevalue\">Ending range value</label>\n" +
    "        <input type=\"text\" class=\"form-control txt-width\" id=\"endingrangevalue\">\n" +
    "    </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-3 col-lg-3\">\n" +
    "  <button type=\"submit\" class=\"btn btn-danger btn-xs top-margin-5\"><span class=\"glyphicon glyphicon-minus-sign\"></span> remove range</button>\n" +
    "    </div>\n" +
    "</form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"top-margin\">\n" +
    "<button type=\"button\" class=\"btn btn-success btn-xs\"><span class=\"glyphicon glyphicon-plus-sign\"></span> Add additional range</button>\n" +
    "</div>\n" +
    "<h3 class=\"text-size-24\">Property Types</h3>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"col-md-3\">  \n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Agricultural\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Health Care\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Industrial\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Land\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Lodging/Hospitality\n" +
    "          </label>\n" +
    "        </div>\n" +
    "            <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Multi-Family\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"col-md-3\">  \n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Office\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Residential\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Retail\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Senior Housing\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Special Purpose\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" value=\"\">\n" +
    "            Sport/Entertainment\n" +
    "          </label>\n" +
    "        </div>\n" +
    "        \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("../modules/PolicyManager/views/policy.view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/PolicyManager/views/policy.view.html",
    "<div class=\"container-fluid\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-lg-3 col-sm-3 margin-padding-0 bg-gray panel-left\">\n" +
    "  \n" +
    "      <div class=\"top-margin\">\n" +
    "        <ul id=\"ulnavigation\" class=\"nav nav-pills nav-stacked-lg matrix-nav\">\n" +
    "            \n" +
    "          <li class=\"active\">\n" +
    "              <a href=\"\"> \n" +
    "                  ENVIORONMENTAL POLICY\n" +
    "                  <span class=\"text-small text-capitalize\">Type: Environmental</span>\n" +
    "                  <button class=\"btn btn-sm btn-danger custom-btn\" type=\"button\"><span class=\"glyphicon glyphicon-trash\"></span></button>  \n" +
    "              </a>\n" +
    "              \n" +
    "          </li>\n" +
    "            <li><a href=\"\"> TEST FLOOD POLICY<span class=\"text-small text-capitalize\">Type: Flood</span></a></li>\n" +
    "            <li><a href=\"\"> AC SAMPLE <span class=\"text-small text-capitalize\">Type: Valuation</span></a></li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "        <hr class=\"border-gray\">\n" +
    "        <div class=\"col-md-12 col-sm-12 text-center \">\n" +
    "          <button class=\"btn btn-md btn-success\" type=\"button\"> CREATE NEW POLICY</button>\n" +
    "        </div>\n" +
    "        <div class=\"clearfix\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-lg-9 col-sm-9 panel-right\">\n" +
    "      <h2 class=\"page-header\">POLICY MATRIX</h2>\n" +
    "      <div ui-view=\"\">\n" +
    "        <table class=\"table table-striped vert-align\">\n" +
    "      <thead>\n" +
    "        <tr>\n" +
    "          <th>Loan Type</th>\n" +
    "          <th>Loan Amount</th>\n" +
    "          <th>Property Type</th>\n" +
    "          <th>Suggested Action(s)</th>\n" +
    "        </tr>\n" +
    "      </thead>\n" +
    "      <tbody>\n" +
    "        <tr>\n" +
    "          <td>Construction Loan</td>\n" +
    "          <td>0- 100,000</td>\n" +
    "          <td>Sport/Entertainment</td>\n" +
    "          <td>\n" +
    "            QuickView Site Inspection(Drive-by Site Report)\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Construction Loan</td>\n" +
    "          <td>0- 100,000</td>\n" +
    "          <td>Sport/Entertainment</td>\n" +
    "          <td>\n" +
    "            QuickView Site Inspection(Drive-by Site Report)\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "          <td>Construction Loan</td>\n" +
    "          <td>0- 100,000</td>\n" +
    "          <td>Sport/Entertainment</td>\n" +
    "          <td>\n" +
    "            QuickView Site Inspection(Drive-by Site Report)<br/>\n" +
    "            QuickPro Site Inspection(Comprehensive Site Report)\n" +
    "          </td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "        \n" +
    "      </div>\n" +
    "      <br/><br/>\n" +
    "        \n" +
    "     <div class=\"page-footer clearfix\">\n" +
    "          \n" +
    "        \n" +
    "        <div class=\"pull-right\">\n" +
    "        <button class=\"btn btn-primary\" role=\"button\">edit policy</button>\n" +
    "       \n" +
    "        </div>\n" +
    "      </div>\n" +
    "      \n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("../modules/DashBoard/views/dashboard.acceptedawards.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.acceptedawards.html",
    "");
}]);

angular.module("../modules/DashBoard/views/dashboard.awardedbids.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.awardedbids.html",
    "");
}]);

angular.module("../modules/DashBoard/views/dashboard.closed.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.closed.html",
    "");
}]);

angular.module("../modules/DashBoard/views/dashboard.draftservicerequest.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.draftservicerequest.html",
    "");
}]);

angular.module("../modules/DashBoard/views/dashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.html",
    "<div class=\"container-fluid\">\n" +
    "    <div class=\"row padding-5\">\n" +
    "        <br>\n" +
    "    <div class=\"alert alert-info\" ng-show = \"dashboard.alert\">{{dashboard.message}}</div>\n" +
    "    \n" +
    "    <br>\n" +
    "    <ul class=\"nav nav-tabs dashboard-tab\">\n" +
    "        <li class=\"active\"><a href=\"#openOrders\" data-name=\"openOrders\" data-toggle=\"tab\">Open (119)</a></li>\n" +
    "        <li><a href=\"#closedTab\" data-name=\"closedTab\" data-toggle=\"tab\">Closed (4)</a></li>\n" +
    "        <li><a href=\"#dueDates\" data-name=\"dueDates\" data-toggle=\"tab\">Upcoming Due Dates (6)</a></li>\n" +
    "        <li><a href=\"#openBids\" data-name=\"openBids\" data-toggle=\"tab\">Open Bids (1)</a></li>\n" +
    "        <li><a href=\"#awardedBids\" data-name=\"awardedBids\" data-toggle=\"tab\">Awarded Bids (0)</a></li>\n" +
    "        <li><a href=\"#acceptedAwards\" data-name=\"acceptedAwards\" data-toggle=\"tab\">Accepted Awards (18)</a></li>\n" +
    "        <li><a href=\"#serviceRequest\" data-name=\"serviceRequest\" data-toggle=\"tab\">Draft Service Request (0)</a></li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div id=\"openOrders\" class=\"tab-pane active\">\n" +
    "        <div class=\"tab-header\">\n" +
    "            \n" +
    "                <div class=\"btn-group\">\n" +
    "                    <button class=\"btn btn-default btn-mini btn-xs dropdown-toggle settings-button\" \n" +
    "                            aria-haspopup=\"true\" aria-expanded=\"false\" \n" +
    "                            id=\"openOrdersSettingsButton\" ng-click=\"dashboard.settings()\"\n" +
    "                            data-toggle=\"dropdown\"><i class=\"fa fa-cog\"></i> \n" +
    "                        Settings <span class=\"caret\"></span></button>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li><a items=\"dashboard.columns\" href=\"#\"\n" +
    "                               \n" +
    "                               class=\"column-settings cursor-pointer\">\n" +
    "                            <i class=\"icon-eye-close\"></i> Show / hide columns</a></li>\n" +
    "                        <li><a href=\"#openOrders\" class=\"save-columns\" ng-click=\"dashboard.saveTableState();\"\n" +
    "><i class=\"icon-save\"></i> Save table state</a></li>\n" +
    "                        <li><a href=\"#openOrders\" class=\"clear-column-settings\" ng-click=\"dashboard.clearTableState();\"><i class=\"icon-ban-circle\"></i> Clear saved settings</a></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"btn-group\">\n" +
    "                    <button class=\"btn btn-mini btn-xs btn-default\" id=\"expandAll\" expand-currentview type=\"button\">\n" +
    "                        <i class=\"fa fa-plus-square-o fa-lg\"></i> Expand all groups </button>\n" +
    "                </div>\n" +
    "                <nbsp></nbsp>\n" +
    "                <div class=\"btn-group collapseBtnDiv\">\n" +
    "                    <button class=\"btn btn-mini btn-xs btn-default\" id=\"collapseAll\" href=\"#\" collapse-currentview><i class=\"fa fa-minus-square-o fa-lg\"></i> Collapse all groups </button>\n" +
    "                </div>\n" +
    "                <div class=\"btn-group\" id=\"openOrders-actions\">\n" +
    "                    <button class=\"btn btn-mini btn-xs dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" aria-expanded=\"false\"><i class=\"icon-signin\"></i> Actions <span class=\"caret\"></span></button>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li> Move loan files</li>\n" +
    "                        <li>Delete selected locations</li> </ul>\n" +
    "                </div>\n" +
    "            \n" +
    "        </div>\n" +
    "        <table id=\"table_id\" class=\"table table-bordered table-condensend table-hover table-header-shaded table-striped small\" width=\"100%\">\n" +
    "            <thead>\n" +
    "                <tr class=\"dataTableRow\">\n" +
    "                    <th></th>\n" +
    "                    <th  ng-repeat=\"header in dashboard.headers\">{{header.name}}</th>\n" +
    "                                      \n" +
    "                </tr>\n" +
    "                \n" +
    "                <tr class=\"filterrow\" role=\"row\">\n" +
    "                    <th class=\"bg-white\"></th>\n" +
    "                    <th on-finish-render-row = \"{{header.name}}\" ng-repeat=\"header in dashboard.headers\" class=\"font-normal bg-white\" >{{header.name}}</th>\n" +
    "                    \n" +
    "            </tr>\n" +
    "            </thead>\n" +
    "\n" +
    "           \n" +
    "           \n" +
    "\n" +
    "            \n" +
    "           \n" +
    "            \n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <br>\n" +
    "    <br>\n" +
    "</div>\n" +
    "</div>    ");
}]);

angular.module("../modules/DashBoard/views/dashboard.navigation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.navigation.html",
    "");
}]);

angular.module("../modules/DashBoard/views/dashboard.openbids.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.openbids.html",
    "");
}]);

angular.module("../modules/DashBoard/views/dashboard.upcomingduedates.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/DashBoard/views/dashboard.upcomingduedates.html",
    "");
}]);

angular.module("../modules/Property/views/property.additionalservices.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.additionalservices.html",
    "");
}]);

angular.module("../modules/Property/views/property.environmental.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.environmental.html",
    "<h4>environment</h4>\n" +
    "");
}]);

angular.module("../modules/Property/views/property.filemanager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.filemanager.html",
    "");
}]);

angular.module("../modules/Property/views/property.flood.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.flood.html",
    "");
}]);

angular.module("../modules/Property/views/property.inspectionsefvices.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.inspectionsefvices.html",
    "");
}]);

angular.module("../modules/Property/views/property.monitoring.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.monitoring.html",
    "");
}]);

angular.module("../modules/Property/views/property.navigation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.navigation.html",
    "<div class=\"container-fluid \">\n" +
    " <div class=\"row \">\n" +
    "<div class=\"col-md-3 col-lg-3 col-sm-3 margin-padding-0 bg-gray panel-left\">\n" +
    "    <div class=\"box-dark-gray\">\n" +
    "\n" +
    "    <span class=\"text-24\"> {{propertynav.propertyAddress}} </span>\n" +
    "\n" +
    "<div class=\"btn-group  pull-right\">\n" +
    "<span class=\"fa fa-bars icon-20 text-gray pointer dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"></span>\n" +
    "\n" +
    "  <ul class=\"dropdown-menu pull-right\">\n" +
    "    <li><a href=\"#\">Copy to new SRF</a></li>\n" +
    "    <li><a href=\"#\">View Others</a></li>\n" +
    "    <li role=\"separator\" class=\"divider\"></li>\n" +
    "    <li><a href=\"#\">Delete</a></li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "    <p class=\"text-14\">{{propertynav.propertyCity}} , {{propertynav.propertyState}} : {{propertynav.propertyZip}}</p>\n" +
    "    </div>\n" +
    "    <div class=\"top-margin\">\n" +
    "      <ul id=\"propertyulNavigation\" class=\"nav nav-pills nav-stacked-lg\" >\n" +
    "        <li  ng-repeat=\"link in propertynav.links\"><a class=\"pointer\"  ng-click = \"propertynav.ChangePropView(link)\">{{link.featureName}}</a></li>\n" +
    "\n" +
    "\n" +
    "      </ul>\n" +
    "      <hr class=\"border-gray\">\n" +
    "      <div class=\"col-md-12 col-sm-12\">\n" +
    "        <button class=\"btn btn-md btn-primary pull-left\" type=\"button\"> Previous </button>\n" +
    "        <button class=\"btn btn-md btn-primary pull-right\" type=\"button\"> Next </button>\n" +
    "      </div>\n" +
    "      <div class=\"clearfix\"></div>\n" +
    "     <hr class=\"border-gray\">\n" +
    "      <div class=\"col-md-12 col-sm-12 form-group text-center \" >\n" +
    "        <button class=\"btn btn-md btn-danger\" type=\"button\"> CANCEL POLICY CREATION </button>\n" +
    "      </div>\n" +
    "      <div class=\"clearfix\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    " <div class=\"col-md-9 col-lg-9 col-sm-9 panel-right \">\n" +
    "            <h2 class=\"page-header\"> Heading</h2>\n" +
    "            <div ui-view=\"\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../modules/Property/views/property.notepad.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.notepad.html",
    "");
}]);

angular.module("../modules/Property/views/property.overview.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.overview.html",
    "<!-- Map div -->\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-12 col-lg-12\">\n" +
    "		<img src=\"images/map.jpg\" alt=\"map image\">\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- Map div end -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("../modules/Property/views/property.reportstatus.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.reportstatus.html",
    "");
}]);

angular.module("../modules/Property/views/property.valuation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../modules/Property/views/property.valuation.html",
    "");
}]);
;lenderPortalApp.controller('HeaderController', ['$modal', 'shareDataService', '$scope', '$state', '$location', '$rootScope', 'SRFResources', 'HeaderFactory', '$log', 'globalValues', 'Encoder', '$timeout',
                                                        function ($modal, shareDataService, $scope, $state, $location, $rootScope, SRFResources, HeaderFactory, $log, globalValues, Encoder, $timeout) {



        var self = this;
        var singleformCtrlLogger = $log.getInstance('HeaderController');
        singleformCtrlLogger.info("single form controller reached");

        //This condition executes on refresh
        if (globalValues.pageRefreshed && localStorage.getItem('m_cab') != undefined) {
            var encodedString = localStorage.getItem('m_cab');
            var decodedString = Encoder.decode(encodedString);
            var decodedJSON = JSON.parse(decodedString);
            this.cabinetHeader = decodedJSON.name;
            this.showManageBtn = true;
        } else {
            this.cabinetHeader = "SEARCH FOR CABINETS";
        }


        this.items = [];

        this.isPageLoad = true;
        this.limitEnds = false;

        this.cabinetcount = false;
        this.itemsToDisplay = 10;
        this.cabinets = [];
        this.cabinetObj = {}; //variable to hold cabinet after it selected from cabinet


        /**
         * This function is called when user clicks on 'search for cabinets' link
         */
        this.searchCabinets = function () {

            if (this.isPageLoad) {
                $scope.busy = true;
                this.isPageLoad = false;
                HeaderFactory.getAllCabinets().then(function (result) {
                    $scope.busy = false;
                    self.cabinets = result;
                    for (var i = self.itemsToDisplay - 10; i < self.itemsToDisplay; i++) {
                        if (self.cabinets[i] == undefined) return;
                        else {
                            self.items.push(self.cabinets[i]);
                        }
                    }
                    self.itemsToDisplay = self.itemsToDisplay + 10;
                });
            }

        }


        /**
         * core function which does the functionality to show synchronous
         * loading of cabinets on scroll.
         */
        this.nextPage = function () {



            if (this.items.length < this.cabinets.length) {


                // self.count = 1;

                for (var i = this.itemsToDisplay - 10; i < this.itemsToDisplay; i++) {

                    if (this.cabinets[i] == undefined) return;
                    else {
                        this.items.push(this.cabinets[i]);
                    }
                }

                this.itemsToDisplay = this.itemsToDisplay + 10;


            }

        }
        this.hideOnFilter = true;
        this.showOnFilter = false;
        this.cabinetName = "";

        /**
         * function to show cabinet name once name is selected from dropdown
         */
        this.loadCabinet = function (cabinet) {
            var bool = shareDataService.getEditMode();
            if (localStorage.getItem('m_cab') != undefined && bool) {
                this.cabinetObj = cabinet;
                angular.element('#headerAlertModal').modal({
                    "backdrop": "true"
                });
            } else {
                showChangedCabinet(cabinet);
            }

        }

        function showChangedCabinet(cabinet) {
            self.showManageBtn = true;
            self.cabinetHeader = cabinet.cabinetName;
            self.cabinetSelected = true;
            shareDataService.setCabinet(cabinet);
            //save cabinetId to localStorage for refresh service call
            setLocalStorageForCabinets(cabinet.cabinetName, cabinet.cabinetID);
        }

        this.alertClick = function () {
            showChangedCabinet(this.cabinetObj);

        }

        function setLocalStorageForCabinets(name, id) {
            var encodedString = Encoder.encode(JSON.stringify({
                name: name,
                cabinetID: id
            }));
            localStorage.setItem('m_cab', encodedString);
        }


        /**
         * brings on different view once filtering begins on text change.
         */
        this.loadCabinetsToDropDown = function () {

            //allCabinets.loadAllData();
            this.cabinetcount = true;
            if (this.cabinetName != "") {
                this.hideOnFilter = false;
                this.showOnFilter = true;
            } else {
                this.hideOnFilter = true;
                this.showOnFilter = false;
            }

        }


        

        /**
         * Policy module begins
         */
        this.redirectToCreatePolicy = function () {
            $state.go('Policy.Information');

        }
        
        this.policiesType = ['Environmental Policy','Appraisal Policy','Flood Policy'];




        this.createLoan = function () {


            shareDataService.setEditMode(false);
            localStorage.setItem('active-tab', '');


            $state.go('SRF.Cabinet', {
                view: 'section'
            });



            globalValues.srfCabinetBtn = 'not clicked';

            //Clearing the cabinet
            this.cabinetHeader = "SEARCH FOR CABINETS";
            this.showManageBtn = false;
            shareDataService.setCabinet(undefined);
            self.cabinetSelected = false;
            this.cabinetName = "";

            //These lines are to change the classes in SRF page once create loan is clicked
            angular.element("#srfulSectionNavigation li").removeClass("active");
            angular.element("#srfulSectionNavigation li").addClass("disabled");
            angular.element('#leftnavChooseCabinet').addClass("active");
            angular.element('#srfPreviousBtn').hide();
            angular.element('#srfNextBtn').hide();



        }




        /**
         * Redirects to manage cabinet after clicking on manage cabinet
         */
        this.manageCabinet = function () {


            //This has been set to show manage cabinetr dic in managecabinet controller
            //has been hidden after delete operation;
            localStorage.setItem("manage", true);
            $state.go('ManageCabinet');
        }


        /**
         * clear the filter on clicking cross button.
         */
        this.clearCabinetFilter = function () {
            this.cabinetHeader = "SEARCH FOR CABINETS";
            this.showManageBtn = false;
            shareDataService.setCabinet(undefined);
            this.cabinetName = "";
            $state.go('Home');
        }

        /**
         * This broadcast comes when deleting the cabinet from managecabinet controller
         */

        $scope.$on('reset-cabinets', function (event, args) {
            self.cabinetHeader = "SEARCH FOR CABINETS";
            self.showManageBtn = false;
            self.cabinetSelected = false;
            shareDataService.setCabinet(undefined);
            self.cabinetName = "";
            deleteCabinetFromArray(args.cabinetID);
        })

        function deleteCabinetFromArray(cabinetId) {


            self.isPageLoad = true;
            self.items = [];
            self.cabinets = [];
            self.itemsToDisplay = 10;

        }



        $rootScope.$on('put-newcabinet-in-header', function (event, args) {

            self.isPageLoad = true;
            self.itemsToDisplay = 10;
            self.items = [];
            self.cabinets = [];
            self.cabinetHeader = args.cabinetName;
            self.showManageBtn = true;
            shareDataService.setCabinet(args);
            setLocalStorageForCabinets(args.cabinetName, args.cabinetID);



        })

        $rootScope.$on('update-cabinet-detail', function (event, args) {

            self.isPageLoad = true;
            self.itemsToDisplay = 10;
            self.items = [];
            self.cabinets = [];
            self.cabinetHeader = args.cabinetName;
            setLocalStorageForCabinets(args.cabinetName, args.cabinetID);



        })

        $rootScope.$on('change-cabinet-inheader', function (event, args) {

            self.showManageBtn = true;
            self.cabinetHeader = args.cabinetName;
            shareDataService.setCabinet(args);
            setLocalStorageForCabinets(args.cabinetName, args.cabinetID);


        })


        //Functions for LoanSearch
        this.recentLoansView = true;
        this.recentLoanRecords = [];
        var limit = 10;
        var offset;

        this.recentSearchedLoans = function () {
            console.log("reached recent serached loans");
            this.loanToSearch = "";
            this.defaultLoanView = false;
            this.searchLoanView = false;
            this.noRecords = false;
            this.recordsLoader = true;
            this.searchedLoanRecords = [];
            var userID = 37625;

            var offset = 0;
            if (this.recentLoanRecords.length == 0) {
                HeaderFactory.getRecentLoans(userID, limit, offset).then(function (result) {
                    console.log("result for recent loans");
                    self.recordsLoader = false;
                    self.recentLoanRecords = result;
                    self.defaultLoanView = true;
                }, function (error) {

                });
            } else {
                this.recordsLoader = false;
                this.defaultLoanView = true;
            }

        }

        this.searchLoanRecords = function () {
            globalValues.pageRefreshed = false;
            this.limitEnds = false;

            this.searchedLoanRecords = [];
            offset = 0;

            this.noRecords = false;
            if (this.loanToSearch != "") {
                this.limitEnds = false;
                this.defaultLoanView = false; //This is for parent ul
                this.searchLoanView = false;
                this.recordsLoader = true;
                this.busy = true;

                HeaderFactory.getSearchedLoans(self.loanToSearch, 5030, limit, offset).
                then(function (result) {

                    if (self.loanToSearch != "") {
                        if (result instanceof Array) {
                            self.noRecords = false;
                            self.recordsLoader = false;
                            self.searchLoanView = true;
                            self.searchedLoanRecords = result;
                            self.busy = false;
                        } else {
                            self.noRecords = true;
                            self.recordsLoader = false;
                            self.searchLoanView = false;
                            self.usermessage = result;
                        }

                    }



                }, function (error) {



                });
            } else {
                this.recentLoanRecords = [];

                HeaderFactory.getRecentLoans(37625, limit, 0).then(function (result) {
                    console.log("result for recent loans");
                    self.recordsLoader = false;
                    self.noRecords = false;
                    self.searchLoanView = false;
                    self.recentLoanRecords = result;
                    self.defaultLoanView = true;
                }, function (error) {

                });

                /*$timeout(function(){
                    self.recentSearchedLoans();
                },self.totalTime);*/

                /*this.limitEnds = true;
                this.noRecords = false;
                this.defaultLoanView = true;
                this.searchLoanView = false;*/

            }
        }


        this.loadNextLoanRecords = function () {

            if (!globalValues.pageRefreshed) {

                offset += limit;
                this.busy = true;
                HeaderFactory.getSearchedLoans(self.loanToSearch, 5030, limit, offset).
                then(function (result) {
                    if (result instanceof Array) {
                        self.busy = false;
                        angular.forEach(result, function (singleResultObject) {
                            self.searchedLoanRecords.push(singleResultObject)
                        });
                    } else {
                        console.log("error occured");
                        //self.limitEnds = true;
                        self.busy = false;
                    }



                }, function (error) {


                });
            }

        }

        this.redirectToPropertyOverview = function (property) {
            /*$state.go('Property.Overview',{'LocationID' : property.locationID, 'PID' : property.cabinetID ,'address': property.address, 'city':property.city, 'state':property.state,'zip': property.zip});*/

            $state.go('Property.Overview', {
                'LocationID': property.locationID,
                'PID': property.cabinetID
            });

        }


        $("[data-toggle=popover]").popover();



        /*$(document).click(function(e) {
    if (!$(e.target).is('.popup-marker, .popover-title, .popover-content')) {
        $('.popover').popover('hide');
    }
});*/


}]);;lenderPortalApp.factory('HeaderFactory', ['$http','HeaderAndFooterUrls', function ($http,HeaderAndFooterUrls) {

    var header = {};

    header.getAllCabinets = function(){

        //var url =  HeaderAndFooterUrls.samplefile+"/sample1.js";
       var url =  HeaderAndFooterUrls.getOfficesCabinets;

       return $http.get(url,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){
           return result.data;

        });
    }
    
    header.getRecentLoans = function(userId,limit,offset){
        var url = HeaderAndFooterUrls.getRecentLoans;
        var str1 =  url.replace("{UserID}", userId);
        var str2 =  str1.replace("{limit}", limit);
        var str3 =  str2.replace("{offset}", offset);
        
        return $http.get(str3,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){
           return result.data;

        });
    }
    
    
    header.getSearchedLoans = function(data,companyId,limit,offset){
        var url = HeaderAndFooterUrls.getSearchedLoans;
        var str1 =  url.replace("{CompanyID}", companyId);
        var str2 =  str1.replace("{limit}", limit);
        var str3 =  str2.replace("{offset}", offset);
        var str4 = str3.replace("{data}",data);
       
        return $http.get(str4,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){
            
            
            return result.data;

        },function(error){
            if(error.data.message.errorCode == "404"){
                return error.data.message.userMessage;
            }
            else{
                return error;
            }
            
            console.log("error received " + JSON.stringify(error));
        });
    }
    
    
    return header;

}])
;lenderPortalApp
    .directive('optionsDisabled', function ($parse) {
        var disableOptions = function (scope, attr, element, data, fnDisableIfTrue) {
            // refresh the disabled options in the select element.
            $("option[value!='?']", element).each(function (i, e) {
                var locals = {};
                locals[attr] = data[i];
                $(this).attr("disabled", fnDisableIfTrue(scope, locals));
            });
        };
        return {
            priority: 0,
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ctrl) {
                // parse expression and build array of disabled options
                var expElements = iAttrs.optionsDisabled.match(/^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/);
                var attrToWatch = expElements[3];
                var fnDisableIfTrue = $parse(expElements[1]);
                scope.$watch(attrToWatch, function (newValue, oldValue) {
                    if (newValue)
                        disableOptions(scope, expElements[2], iElement, newValue, fnDisableIfTrue);
                }, true);
                // handle model updates properly
                scope.$watch(iAttrs.ngModel, function (newValue, oldValue) {
                    var disOptions = $parse(attrToWatch)(scope);
                    if (newValue)
                        disableOptions(scope, expElements[2], iElement, disOptions, fnDisableIfTrue);
                });
            }
        };
    });

lenderPortalApp.directive('helpPopup', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {

                scope.$apply(
                    $timeout(function () {
                        scope.hidebtn = false;
                    }, 500)

                );


                $(".needhelp-toggle").slideToggle({
                    direction: "top"
                });



            });

        }
    }


}]);

lenderPortalApp.directive('helpBtn', [function () {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {

                scope.$apply(
                    scope.hidebtn = true
                );


                $(".needhelp-toggle").slideToggle({
                    direction: "top"
                });



            });

        }
    }


}]);

lenderPortalApp.directive('stopPropagation', [function () {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function (event) {

                event.stopPropagation();



            });

        }
    }


}]);



lenderPortalApp.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout',
    function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {

                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element('#branches-dropdown');
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {

                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;

                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
  }
]);





lenderPortalApp.directive('infiniteScrollLoan', [
  '$rootScope', '$window', '$timeout',
    function ($rootScope, $window, $timeout) {
        return {

            link: function (scope, elem, attrs) {

                
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                
                $window = angular.element("#dropdown-loansearch");
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {

                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;

                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScrollLoan);
                        } else {
                            return scope.$apply(attrs.infiniteScrollLoan);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
  }
]);


lenderPortalApp.directive('redirectToSpecificPolicy', ['$state',function ($state) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {

                
                angular.forEach(scope.header.policiesType,function(name){
                    if(name == attr.redirectToSpecificPolicy){
                       $state.go('ViewPolicy',{type : attr.redirectToSpecificPolicy}); 
                    }
                })
                



            });

        }
    }


}]);
;lenderPortalApp.constant('HeaderAndFooterUrls', {

   // samplefile  : 'modules/HeaderAndFooter/staticdata/'
    getOfficesCabinets : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/companies/1218/cabinets/',
    getRecentLoans : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/users/{UserID}/loans/recent?limit={limit}&offset={offset}',
    getSearchedLoans : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/companies/{CompanyID}/loans?term={data}&limit={limit}&offset={offset}'

});
;angular.module('SRFModule').controller('SRFCabinetCtrl', ['$scope', '$stateParams', 'shareDataService',
                                                      'SRFResources', '$state', '$location', 'globalValues', 'HeaderFactory', 'SRFCabinetFactory','$rootScope',
    function ($scope, $stateParams, shareDataService, SRFResources, $state, $location, globalValues, HeaderFactory, SRFCabinetFactory,$rootScope) {




        this.existingCabinet = false;

        this.newCabinet = false;

        this.newCabinetName = "";

        this.createCabinetFailed = false;
        this.selectedCabinetObj = {};

        var self = this;


        this.selectedCabinet = SRFResources.defaultSRFBtnText;
        this.filterCabinet = function (selectedCabinet) {
            this.selectedCabinetObj = selectedCabinet;
            angular.element('#srfExistingCabinet').removeClass('border-red');
            this.selectedCabinet = selectedCabinet.cabinetName;
            


        }


        //Service call to fetch all the cabinets
        HeaderFactory.getAllCabinets().then(function (result) {

            $scope.cabinets = result;

        }, function (error) {

        })


        shareDataService.storeCabinets($scope.cabinets);


        $scope.loadMore = function () {
            var last = $scope.cabinets[$scope.cabinets.length - 1];
            for (var i = 1; i <= 8; i++) {
                $scope.cabinets.push(last + i);
            }
        };


        this.showExistingCabinet = function () {
            $scope.$broadcast('show-errors-reset');
            this.newCabinet = false;
            this.existingCabinet = true;
        }

        this.showNewCabinet = function () {
            $scope.$emit('show-errors-reset');
            this.existingCabinet = false;
            this.newCabinet = true;
            this.newCabinetName = "";
        }

        this.createNewCabinet = function (form) {
            $scope.$broadcast('show-errors-check-validity');

            if (form.$invalid) {


                return;

            } else {


                var obj = {
                    "cabinetName": this.newCabinetName,
                    "companyID": 1218,
                    "officeID": 5825,
                    "accountID": 5272,
                    "edrAccount": 2033212
                }
                SRFCabinetFactory.createCabinet(obj).then(function (result) {
                    self.createCabinetFailed = false;
                    setCssStylesForLeftNav();
                    $rootScope.$broadcast('put-newcabinet-in-header',result);


                    $state.go('SRF.CreateSectionViewLoan');
                }, function (error) {


                    self.createCabinetFailed = true;
                    self.serviceErrorMsg = error.data.userMessage;

                })

            }
        }

        this.closeWarning = function(){
            this.createCabinetFailed = false;
        }

        this.selectExistingCabinet = function (form1) {



            if (this.selectedCabinet == SRFResources.defaultSRFBtnText) {
                angular.element('#srfExistingCabinet').addClass('border-red');
            } else {

                setCssStylesForLeftNav();
                globalValues.srfCabinetBtn = 'clicked';
                $state.go('SRF.CreateSectionViewLoan');
                $rootScope.$broadcast('change-cabinet-inheader',this.selectedCabinetObj);
            }

        }


        function setCssStylesForLeftNav() {
            angular.element('#leftnavChooseCabinet').removeClass("active");
            angular.element('#srfNextBtn').html('Next');
            angular.element('#srfPreviousBtn').show();
            angular.element('#srfNextBtn').show();

            $("#srfulSectionNavigation li").removeClass("active");

            var tabtext = $("#srfulSectionNavigation li:nth-child(2)").text().split(':')[1].trim();
            angular.element('#leftnav' + tabtext).addClass("active");


            $("#srfulSectionNavigation li").removeClass("disabled");
            $("#srfulSectionNavigation li").addClass("pointer");
            localStorage.setItem('active-tab', tabtext);
        }


}]);
;angular.module('SRFModule').controller('SRFManageCabinetCtrl', ['$scope', '$modal', '$compile', 'shareDataService', 'SRFCabinetFactory', 'SRFUrls', '$http', '$rootScope', 'Encoder', 'globalValues', 'SRFResources',
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

}]);;angular.module('SRFModule').controller('SRFNavCtrl', ['$scope', '$stateParams', '$rootScope', 'SRFResources', '$location', 'SectionViewLoanData', '$state', '$modal', 'globalValues', function ($scope, $stateParams, $rootScope, SRFResources, $location, SectionViewLoanData, $state, $modal, globalValues) {

    angular.element("#srfulSectionNavigation li:last-child").hasClass('active') ? this.srfNextBtnText = "Create Loan" : this.srfNextBtnText = "Next";
    //this.srfNextBtnText = "Next";





    $scope.object = {};
    this.activateTabs = true;




    this.srfNextBtn = function () {
        var lastTab = angular.element("#srfulSectionNavigation li:last-child").text().split(':')[1].trim();
        var firstTab = angular.element("#srfulSectionNavigation li:first-child").text().split(':')[1].trim();
        var nextTab = angular.element("#srfulSectionNavigation li.active").next();
        var selectedTab = angular.element("#srfulSectionNavigation li.active");
        var nextTabText = nextTab.text().split(':')[1].trim();
        localStorage.setItem('active-tab', nextTabText);

        if (nextTab.length > 0) {
            selectedTab.removeClass("active");
            nextTab.addClass('active');
        } else {

            $scope.$broadcast('submit-form');

            return;
        }

        $scope.$broadcast('on-navigation-click', nextTabText);
        if (nextTabText == lastTab) {

            angular.element('#srfNextBtn').html('Create Loan');
        }


    }

    function HighlightLinks(prevTabText, selectedTab, prevTab) {
        $scope.$broadcast('on-navigation-click', prevTabText);
        selectedTab.removeClass("active");
        prevTab.addClass('active');
        var CurrentTabName = selectedTab.text();

        var lastTab = angular.element("#srfulSectionNavigation li:last-child").text().split(':')[1].trim();

        if (CurrentTabName.indexOf(lastTab) > -1) {

            angular.element('#srfNextBtn').html('Next');

        }
    }

    this.srfPreviousBtn = function () {

        var firstTab = angular.element("#srfulSectionNavigation li:first-child").text().split(':')[1].trim();
        var lastTab = angular.element("#srfulSectionNavigation li:last-child").text().split(':')[1].trim();
        var prevTab = angular.element("#srfulSectionNavigation li.active").prev();
        var selectedTab = angular.element("#srfulSectionNavigation li.active");
        var prevTabText = prevTab.text().split(':')[1].trim();
        localStorage.setItem('active-tab', prevTabText);

        // This if condition checks that are we going to choose cabinet again
        if (firstTab == prevTabText) {
            angular.element('#srfAlertModal').modal({
                "backdrop": "true"
            });
        } else {
            //This function executes if there is no alert
            HighlightLinks(prevTabText, selectedTab, prevTab);

        }






    }

    var self = this;
    this.tabsArray = [];
    this.form = {};
    this.form.tabsArray = [];
    this.form.individualTabsArray = [];


    angular.forEach(SectionViewLoanData.tabs, function (tab) {

        self.form.tabsArray.push(tab);

    })

    //Open respective tab according to left hand side navigation
    this.navLinkClicked = function (currentTab) {
        if (globalValues.srfCabinetBtn == 'not clicked') {
            localStorage.setItem('active-tab', '');
        } else {
            localStorage.setItem('active-tab', currentTab);
        }


        $scope.$broadcast('on-navigation-click', currentTab);
        var tabtext = $("#srfulSectionNavigation li:last-child").text().split(':')[1].trim();

        if (currentTab == tabtext) {

            this.srfNextBtnText = "Create Loan";
        } else {
            this.srfNextBtnText = "Next";
        }

    }


    this.chooseCabinet = function () {
        
        localStorage.setItem('active-tab', '');
        if ($state.current.name != 'SRF.Cabinet') {

            angular.element('#srfAlertModal').modal({
                "backdrop": "true"
            });
        } else {

        }

    }



    this.alertClick = function () {
        $("#srfulSectionNavigation li").addClass("disabled");
        var tabtext = $("#srfulSectionNavigation li:nth-child(1)").text().split(':')[1].trim();

        angular.element('#leftnav' + tabtext).removeClass("active");
        angular.element('#leftnavChooseCabinet').removeClass("disabled");
        angular.element('#srfPreviousBtn').hide();
        angular.element('#srfNextBtn').hide();
        globalValues.srfCabinetBtn = 'not clicked';
        $state.go('SRF.Cabinet');
        angular.element("#srfulSectionNavigation li").removeClass("active");
        angular.element('#leftnavChooseCabinet').addClass("active");

    }

}]);;
angular.module('SRFModule').controller('SRFSectionalViewLoanCtrl', ['$scope', 'SectionViewLoanData', '$log','SRFResources', function ($scope, SectionViewLoanData, $log, SRFResources) {

    var self = this;
    this.tabsArray = [];
    this.form = {};
    this.form.tabsArray = [];
    this.form.individualTabsArray = [];
    this.form.uiOptions = [];


    angular.forEach(SectionViewLoanData.tabs,function(tab){
        
        //self.form.individualTabsArray.push(tab.tabTitle);
        self.form.tabsArray.push(tab);
    })

}]);

;//For ascynchronous display of data on scroll in dropdown



angular.module('SRFModule').directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout',
    function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {

                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element('#scrolldrpdwn');
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {

                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }
                handler = function () {

                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = $window.height() + $window.scrollTop();
                    elementBottom = elem.offset().top + elem.height();
                    remaining = elementBottom - windowBottom;
                    shouldScroll = remaining <= $window.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            return scope.$apply(attrs.infiniteScroll);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };
                $window.on('scroll', handler);
                scope.$on('$destroy', function () {
                    return $window.off('scroll', handler);
                });
                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
  }
]);

angular.module('SRFModule').directive('shiftPrevious', ['$location', '$state', '$stateParams', 'SRFResources', '$timeout', function ($location, $state, $stateParams, SRFResources, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            if ($location.path() == '/SRF/Cabinet') {
                angular.element('#srfNextBtn').hide();
                angular.element('#srfPreviousBtn').hide();
            } else {
                angular.element('#srfPreviousBtn').show();
            }
        }
    }

}]);

angular.module('SRFModule').directive('activeClassSectionalView', ['$location', '$timeout', '$stateParams', 'globalValues', function ($location, $timeout, $stateParams, globalValues) {

    return {
        restrict: 'A',
        scope: {
            title: '@'
        },

        link: function (scope, elem, attr) {



            if (globalValues.pageRefreshed) {
                var tab = localStorage.getItem('active-tab');

                if (tab === scope.title) {
                    elem.removeClass('disabled');
                    elem.addClass("active");
                } else if (tab == '') {
                    elem.removeClass("active");
                    elem.addClass('disabled');
                    angular.element('#leftnavChooseCabinet').addClass('active');
                    angular.element('#leftnavChooseCabinet').removeClass('disabled');
                } else {
                    elem.removeClass('disabled');
                    elem.removeClass("active");

                }

            }

            elem.bind('click', function () {


                if (globalValues.srfCabinetBtn == 'clicked') {

                    elem.addClass('active');
                    elem.siblings().removeClass('active');
                }

                if (globalValues.srfCabinetBtn == 'not clicked' && localStorage.getItem('active-tab') != '') {
                    elem.addClass('active');
                    elem.siblings().removeClass('active');
                }


                if (attr.urlparams == '/SRF/Cabinet') {

                    angular.element('#srfPreviousBtn').hide();

                    angular.element('#srfNextBtn').html('Next');
                }

            });

        }
    }


}]);


angular.module('SRFModule').directive('showtab', [function () {

    return {
        link: function (scope, element, attrs) {

            element.click(function (e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
}]);


// For dynamic email templates

angular.module('SRFModule').directive('customButton', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            elem.bind('click', function () {
                //$(this).parent().remove();
                if(scope.managecabinet == null || scope.managecabinet == undefined) {
                    scope.$parent.managecabinet.serviceResponseAlert = false;
                }
                   else  {
                       scope.managecabinet.serviceResponseAlert = false;
                   }
                                
                            
                $(this).parent().parent().parent().remove();
                if (!angular.element(".dynamicemails")[0]) {
                    angular.element('#cabinetemail').addClass('has-error');
                }
            });
        },
        controller: function ($scope) {

        }
    }
}]);


//For dynamic email templates
angular.module('SRFModule').directive('customAction', ['$compile', '$sce', '$http',
                                                    'SRFUrls', 'SRFResources',
    function ($compile, $sce, $http, SRFUrls, SRFResources) {
        return {
            restrict: 'A',
            scope: {
                diremail: '@'

            },
            require: 'ngModel',
            link: function (scope, elem, attr, modelCtrl) {

                var template;
                var templateUrl = SRFUrls.emailTemplate;

                elem.bind("keypress", function (event) {
                    //scope.$parent.managecabinet.serviceResponseAlert = true;
                    if (scope.diremail != undefined && scope.diremail != '')
                        angular.element('#cabinetemail').removeClass('has-error');
                    if (event.which == 13 && (scope.diremail != undefined &&
                            scope.diremail != null && scope.diremail != '')) {
                        if (angular.element('.dynamicemails').length <= 14) {
                            
                            var checkDirectiveForSelectedEmails = [];
                            angular.element(".dynamicemails").each(function (i) {

                                checkDirectiveForSelectedEmails.push($('span:first', this).text().trim());

                            });
                            if (checkDirectiveForSelectedEmails.indexOf(scope.diremail) == -1) {
                                $http.get(templateUrl).success(function (response) {

                                    template = response;
                                    var html = $sce.trustAsHtml(template);

                                    $('.cabinetemaildiv').append(template);

                                    $compile($('.dynamicemails').contents())(scope);
                                    $('.editemaildiv:last #typeahedemails').text(scope.diremail);


                                    modelCtrl.$setViewValue('');
                                    modelCtrl.$render();

                                });
                            } else {
                                modelCtrl.$setViewValue('');
                                modelCtrl.$render();
                            }
                        } else {
                            
                            angular.element('#serviceResponseDiv').removeClass('alert-success');
                            angular.element('#serviceResponseDiv').removeClass('alert-danger');
                            angular.element('#serviceResponseDiv').addClass('alert-warning');
                            scope.$apply(function () {
                                scope.$parent.managecabinet.serviceResponseAlert = true;
                                scope.$parent.managecabinet.serviceResponseText =
                                    SRFResources.emailLimitsWarning;
                            });


                            //scope.$emit('show-email-limit-warning');    
                        }





                    }


                });


            },
            controller: function ($scope) {
                angular.element('#outsideEmailBtn').bind('click', function () {

                    $(this).parent().remove();
                });

            }
        }
}]);

angular.module('SRFModule').directive('customValidation', ['$compile', 'SRFResources', function ($compile, SRFResources) {

    return {
        restrict: 'A',
        require: 'ngModel',

        link: function (scope, elem, attrs, ngModelCtrl) {

            var spanid = 'msg' + attrs.isrequired;

            /*if (attrs.isRequired == '1') {

                elem.parent().addClass('has-error');
            }

            elem.bind('change', function () {
                elem.parent().toggleClass('has-error', ngModelCtrl.$invalid);

            });*/

            elem.bind('keyup', function () {


                elem.parent().toggleClass('has-error', ngModelCtrl.$invalid);
                if (ngModelCtrl.$invalid && ngModelCtrl.$viewValue != undefined &&
                    ngModelCtrl.$viewValue != "") {


                    if (!angular.element('#' + spanid).length) {
                        if (attrs.ngPattern == SRFResources.NumberValidator) {
                            elem.after('<div id=' + spanid + '>' + SRFResources.ErrorMessageNumber + '</div>');
                        }
                        if (attrs.ngPattern == SRFResources.PhoneNumberValidator) {


                            elem.after('<div id=' + spanid + '>' + SRFResources.ErrorMessagePhone + '</div>');



                        }
                    }


                } else {
                    /*scope.$apply(function(){
                         scope.crossmark = false;

                     })*/
                    angular.element('#remove').hide();
                    angular.element('#' + spanid).remove();
                }
            })



        }

    }
}])

angular.module('SRFModule').directive("dynamicName", ['$compile', 'SRFResources', function ($compile, SRFResources) {
    return {
        restrict: "A",

        terminal: true,
        priority: 1000,
        link: function (scope, element, attrs) {

            element.attr('name', scope.$eval(attrs.dynamicName));

            if (scope.$eval(attrs.customValidation) == "Number") {
                element.attr('ng-pattern', SRFResources.NumberValidator);
            }
            if (scope.$eval(attrs.customValidation) == "Phone") {

                element.attr('ng-pattern', SRFResources.PhoneNumberValidator);
            }

            element.removeAttr("dynamic-name");

            $compile(element)(scope);



        }
    };
}]);

angular.module('SRFModule').directive('loadDefaultMap', ['SetMarker', 'shareDataService', function (SetMarker, shareDataService) {

    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            var defaultlatLongObj = {
                lat: 39.50,
                lng: -98.35
            }
            var map = new google.maps.Map(document.getElementById('map-canvas'), {
                zoom: 3,
                center: defaultlatLongObj
            });
            defaultlatLongObj.map = map;
            shareDataService.setMapObject(map);
            SetMarker.marker(defaultlatLongObj, scope, 'directive');
            //setMarker(39.50,-98.35);

        }
    }

}]);

//Dynamic bootstrap classes for SRF

angular.module('SRFModule').directive('dynamicGridColumns', [function () {
    return {
        restrict: 'A',
        scope: {
            columnarr: '='
        },
        link: function (scope, elem, attr) {

            switch (scope.columnarr.length) {
                case 1:
                    elem.addClass("col-xs-12 col-md-4 col-lg-4");
                    break;
                case 2:
                    elem.addClass("col-xs-12 col-md-6 col-lg-6");
                    break;
                case 3:
                    elem.addClass("col-xs-12 col-md-4 col-lg-4");
                    break;
                case 4:
                    elem.addClass("col-xs-12 col-md-3 col-lg-3");
                    break;

            }


        }
    }
}])


//Adding map dynamically in SRF
angular.module('SRFModule').directive('addMap', ['$http', '$compile', function ($http, $compile) {
    return {
        restrict: 'A',
        scope: {
            section: '='
        },
        link: function (scope, element, attribute) {

            if (scope.section == "MAP") {

                scope.element = element;
                $http.get('modules/SRF/views/directive-templates/field/map.html').success(function (data) {

                    element.html(data);
                    scope.element = scope.element.contents();
                    $compile(element.contents())(scope);

                });

            }
        }
    }

}])

//show first tab as active on page load

angular.module('SRFModule').directive('dynamicTabVisibility', ['$timeout', 'globalValues', function ($timeout, globalValues) {
    return {
        restrict: 'A',
        scope: {
            tabindex: '=',
            tabtitle: '='
        },
        link: function (scope, element, attribute) {


            if (globalValues.pageRefreshed) {


                $timeout(function () {
                    angular.element('#tab' + scope.tabtitle).addClass('active');
                }, 500);

                var activeTab = localStorage.getItem('active-tab');
                if (scope.tabtitle != activeTab) {
                    $timeout(function () {

                        angular.element('#' + scope.tabtitle).hide();
                        angular.element('#tab' + scope.tabtitle).removeClass('active');
                    }, 500);
                }


            } else {
                if (scope.tabindex != 0) {
                    $timeout(function () {
                        $('#' + scope.tabtitle).hide();
                    }, 500);
                }
                /*if (scope.tabindex != 0) {
                    $timeout(function () {
                        $('#' + scope.tabtitle).hide();
                    }, 500);
                }*/

            }
        }
    }

            }]);


// Open high alert popup
/*angular.module('SRFModule').directive('openAlertPopup', ['$location', '$state',
        function ($location, $state) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {

                elem.bind('click', function () {

                    if ($state.current.name != 'SRF.Cabinet') {

                        angular.element('#srfAlertModal').modal({
                            "backdrop": "true"
                        });
                    }

                });

            }

        }
        }]);*/

// High alert popup events

angular.module('SRFModule').directive('actionEvents', ['globalValues', function (globalValues) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            elem.on('show.bs.modal', function () {
                globalValues.srfBlockNavigation = "Alert";
                //alert('show.bs.modal');
            });
            elem.on('shown.bs.modal', function () {
                //alert('shown.bs.modal');
            });
            elem.on('hide.bs.modal', function () {
                //alert('hide.bs.modal');
            });
            elem.on('hidden.bs.modal', function () {
                //alert('hidden.bs.modal');
            });
        }

    }
}]);'use strict';
angular.module('SRFModule').directive('sectionalformDirective', ['shareDataService', 'postDatafactory',
                                            '$log', '$http', '$compile', 'SRFUrls', '$timeout', 'globalValues',
    function (shareDataService, postDatafactory, $log, $http, $compile, SRFUrls, $timeout, globalValues) {

        return {
            restrict: 'A',
            scope: {
                form: '='
            },
            templateUrl: 'modules/SRF/views/directive-templates/form/sectionalView.html',
            controller: function ($scope) {

                
                $scope.tabClicked = function (tabtitle) {
                    localStorage.setItem('active-tab',tabtitle);

                    /*if (globalValues.srfCabinetBtn == 'not clicked') {
                        localStorage.setItem('active-tab', '');
                    } else {
                        localStorage.setItem('active-tab', tabtitle);
                    }*/

                    //localStorage.setItem('active-tab',tabtitle);
                    console.log('in click ' + tabtitle);
                    angular.forEach($scope.form.tabsArray, function (tabs) {
                            console.log('tabTitle ' + tabs.tabTitle);
                            if (tabs.tabTitle != tabtitle) {

                                angular.element('#' + tabs.tabTitle).hide();
                            } else {

                                angular.element('#' + tabs.tabTitle).show();
                            }
                        })
                        //following code is to change class in left hand side
                    $("#srfulSectionNavigation li").removeClass("active");
                    angular.element('#leftnav' + tabtitle).addClass("active");

                    var lastTab = $("#srfulSectionNavigation li:last-child").text().split(':')[1].trim();
                    console.log(tabtitle + "  and " + lastTab);
                    if (tabtitle == lastTab) {
                        console.log('in if');
                        angular.element('#srfNextBtn').html('Create Loan');
                    } else {
                        angular.element('#srfNextBtn').html('Next');
                    }
                    console.log('end');
                }

                $scope.$on('submit-form', function () {

                    angular.forEach($scope.form.tabsArray, function (tabs) {
                        var currentTab = tabs.tabTitle;
                        console.log('tab is ' + currentTab);

                        if ($scope.form[currentTab].$invalid) {
                            console.log('in if ' + currentTab);
                            $scope.submissionFailed = true;
                            //return;
                        } else {
                            console.log('in else');
                            $scope.submissionFailed = false;

                        }

                    })


                });

                $scope.$on('on-navigation-click', function (event, args) {

                    angular.forEach($scope.form.tabsArray, function (tabs) {
                        if (tabs.tabTitle != args) {
                            angular.element('#' + tabs.tabTitle).hide();
                            angular.element('#tab' + tabs.tabTitle).removeClass('active');



                        } else {
                            angular.element('#' + tabs.tabTitle).show();
                            angular.element('#tab' + tabs.tabTitle).addClass('active');

                        }
                    })
                });

            },
            link: function (scope, elem, attr) {

                for (var i = 0; i < scope.form.tabsArray.length; i++) {
                    if (i == 0) {

                        angular.element('#' + scope.form.tabsArray[i].tabTitle).show();

                    } else {

                        angular.element('#Collateral').hide();
                        console.log("end in else")

                    }
                }
            }



        };
                }]);

;'use strict';

angular.module('SRFModule').directive('sectionalfieldDirective', ['$http', '$compile', 'shareDataService', 'SetMarker', '$parse', function ($http, $compile, shareDataService, SetMarker, $parse) {

    var getTemplateUrl = function (field) {

        var type = field.fieldType;
        var templateUrl = '';

        switch (type) {
            case 'text':
                templateUrl = 'modules/SRF/views/directive-templates/field/textfield.html';
                break;
            case 'email':
                templateUrl = 'modules/SRF/views/directive-templates/field/email.html';
                break;
            case 'textarea':
                templateUrl = 'modules/SRF/views/directive-templates/field/textarea.html';
                break;
            case 'checkbox':
                templateUrl = 'modules/SRF/views/directive-templates/field/checkbox.html';
                break;
            case 'date':
                templateUrl = 'modules/SRF/views/directive-templates/field/date.html';
                break;
            case 'dropDown':
                templateUrl = 'modules/SRF/views/directive-templates/field/dropdown.html';
                break;
            case 'hidden':
                templateUrl = 'modules/SRF/views/directive-templates/field/hidden.html';
                break;
            case 'password':
                templateUrl = 'modules/SRF/views/directive-templates/field/password.html';
                break;
            case 'radioButton':
                templateUrl = 'modules/SRF/views/directive-templates/field/radio.html';
                break;
            case 'modifiedbuildingfield':
                templateUrl = 'modules/SRF/views/directive-templates/field/custombuildingfield.html';
                break;
            case 'modifiedlandfield':
                templateUrl = 'modules/SRF/views/directive-templates/field/customlandfield.html';
                break;
        }
        return templateUrl;

    }

    var linker = function (scope, element, attr, controllers) {

        // GET template content from path
        scope.attr = attr;
        scope.element = element;
       
        
        


        var templateUrl = getTemplateUrl(scope.field);
        if (templateUrl != undefined) {
            $http.get(templateUrl).success(function (data) {
                //console.log("fieldName" + scope.field.fieldName);
                element.html(data);
                scope.element = element.contents();
                $compile(element.contents())(scope);

            });

        
        }







    }

    return {

        restrict: 'A',
        require: '?^form',


        scope: {
            field: '=',
            parenttabindex: '=',
            parentrowindex: '=',
            parentcolumnindex: '=',
            parentsectionindex: '='


        },
        controller: function ($scope, $element, $http) {
            $scope.selectedOption = "";
            $scope.subPropertyTypeVisible = false;

            
            

            

            //This event gets fired when user selects any option from the dropdown
            $scope.showHideOptions = function (fieldID,option) {
                
                console.log("hghgh " + option);
                //As fieldID is the only identifier of the field
                //It gives hint as to which dropdown was interacted upon by user. 
                           
                switch (fieldID) {
                    case 34422:
                        //This case is for 'Purpose of request'
                        //As for fieldValue goes. It was not provided in JSON so 
                        //had put it dynamically into every field object through code.
                        
                        
                        if ($scope.field.fieldValue != null) {
                           //Get the field option object which has been selected
                           //Extract rules array of it
                           var rulesArray = $scope.field.fieldValue.rules;
                           //As there can be more than one rule
                            angular.forEach(rulesArray,function(rule){
                                if(rule.ruleType == "show"){
                                    // A single rule to "show" can have more than one element to show
                                    angular.forEach(rule.fields,function(field){
                                        angular.element('#' + field.fieldName).removeClass('ng-hide');
                                    })
                                    
                                    
                                }
                                else if(rule.ruleType == "hide"){
                                    // A single rule to "hide" can have more than one element to show
                                    angular.forEach(rule.fields,function(field){
                                        angular.element('#' + field.fieldName).addClass('ng-hide');
                                    })
                                }
                            })
                            
                        } else {
                            $scope.selectedOption = "";
                        }
                        
                        

                        break;
                    case 34424:

                        $scope.selectedOption = $scope.field.fieldValue.option_name;
                        var onChangeFunction = JSON.parse($scope.field.uiOptions).onchange;

                        var x2 = eval(onChangeFunction);
                        break;

                    case 34447:
                        if (!$scope.drpDwnVisible) {
                            $http.get('views/directive-templates/field/customdropdown.html').
                            success(function (data) {


                                a_input = angular.element($compile(data)($scope));

                                $($element[0]).after(a_input);
                                $scope.drpDwnVisible = true;



                            });
                        }
                    default:
                        console.log("dsugvsdgcfdgsh");
                }




            }



        },
        link: linker
    };
}]);;angular.module('SRFModule').constant('SRFResources', {

    //localstorage keys

    view  : 'view', // localstorage to view type in form
    //messages in form-directive
    transactionTab : "transaction tab clicked",
    collateralTab  : "collateral tab clicked",
    transactionButton : "move to transaction button clicked",
    collateralButton : "moved to collateral button clicked",
    transactionSubmit : "submit button clicked from transaction tab",
    transactionCancel : "cancel button clicked from transaction tab",
    collateralSubmit : "submit button clicked from collateral tab",
    collateralCancel : "cancel button clicked from collateral tab",
    invalidFormEntry : "invalid form entry by user",
    validFormEntry   : "valid form entry by user",
    dataSubmitted : "insertion successful",
    errorInDataSubmitted : "insertion unsuccessful",
    postDataFromCtrl : "post data service called from controller",

    //messages in cabinet factory
    getCabinetsService : "cabinet factory reached",
    getcabinetSuccessful : "cabinets fetched",
    getCabinetUnsuccessful : "cabinets fetching unsuccessful",

    //messages in cabinet controller
    cabinetsInController : "cabinets data reached controller from service",
    cabinetResolve : "resolve called to fetch cabinets",
    cabinetHTMLLoaded : "user visited add cabinet page",
    cabinetEntry : "user clicked to fill cabinet",
    invalidCabinet : "invalid cabinet entry",
    validCabinet : "valid cabinet entry",
    emptyCabinetArray : "cabinet array is empty",

    //messages in form factory
    getFormAndReportService : "get form-JSON and reports factory reached",
    getFormSuccessful : "form JSON fetched",
    getFormUnsuccessful : "form JSON fetching unsuccessful",
    getReportsSuccessful : "report JSON fetched",
    getReportsUnsuccessful : "report JSON fetching unsuccessful",

    //messages in form controller
    formController : "reached form controller",
    getReportsJSONToController : "request from controller to service to fetch reports JSON",
    reportsJSONInController : "reports JSON data received from service in controller",
    getFormJSONToController : "request from controller to service to fetch form JSON",
    formJSONInController : "form JSON data received from service in controller",
    emptyreportsObject : "reports object is null or undefined",
    emptyreportsArray : "reports array is empty",
    emptyFormObject : "empty form object",

    //messages in post service

    postService : "form data post service called",
    postDataSuccess : "data post success",
    postDataError : "error in data post",
    defaultSRFBtnText : "Choose Cabinet",

    // Regular Exprerssions and Error Messages for validatons

    NumberValidator:"/^[0-9]+$/",
    ErrorMessageNumber:"Invalid amount, Only numbers are allowed",
    PhoneNumberValidator:"/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/",
    ErrorMessagePhone:"Invalid Phone Number, Please Enter Valid Phone Number",

    //Message for Choose cabinet confirm box
    ConfirmChooseCabinet :"By choosing a new cabinet  ,you are starting the creation process from the beginning and any information you have added will be lost."+

"Would you like to choose a new cabinet?",
    
    emailLimitsWarning : "Maximum number of monitoring emails have reached. Please delete an email to add another"

});
;angular.module('SRFModule').constant('SRFUrls', {

    //Urls

    getCabinets  :  'http://parredatapoc2:8080/lenderportalservice/rest/v1/companies/1218/cabinets/',
    updateCabinetDetails : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets/',
    createCabinets : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets',
    deleteCabinets : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets/',
    getCabinetDetails : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/cabinets/',

    getFormJSON  :  'http://parredatapoc2:8080/lenderportaldata/rest/srf/4/datafields',
    postFormData : 'http://parredatapoc2:8080/lenderportaldata/rest/srf/create',
    getreportsJSON : 'modules/SRF/staticdata/servicesJSON.js',
    postLogJSON : 'http://parredatapoc2:8080/logging/rest/v1.0/logging/logitems',
    emailTemplate : 'modules/SRF/views/directive-templates/emailTemplate.html',
    getFormStructure : 'http://parredatapoc2:8080/lenderportalservice/rest/v1/forms/123/structure/'

});
;angular.module('SRFModule').factory(
    'SRFCabinetFactory', ['$http', 'SRFUrls','$log','SRFResources',
        function($http, SRFUrls, $log , SRFResources) {

           var cabinetFactoryLogger = $log.getInstance('cabinetFactory');

            cabinetFactoryLogger.info(SRFResources.getCabinetsService);

            var factory = {};

            var cabinetDetailsUrl = SRFUrls.getCabinetDetails;

            var updateCabinetUrl = SRFUrls.updateCabinetDetails;

            var staticPath = SRFUrls.getCabinets;

            var createCabinetUrl = SRFUrls.createCabinets;

            var deleteCabinetUrl = SRFUrls.deleteCabinets;

            //var staticPath = 'staticdata/cabinetJSON.js';

            factory.getCabinets = function() {
                try{

                return $http.get(staticPath,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(
                    function(result) {
                        cabinetFactoryLogger.info(SRFResources.getcabinetSuccessful);
                        return result.data;
                    },function(error){
                        cabinetFactoryLogger.error(error.statusText);
                        return error;
                    });
                }
                catch(error){

                    cabinetFactoryLogger.error(error);
                    throw  error;
                }

            };

            factory.getCabinetDetailsByID = function(id){

                return $http.get(cabinetDetailsUrl + id + '/',{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function(result){

                    return result.data;
                },function(error){
                    cabinetFactoryLogger.error(error);
                    throw  error;

                })
            };



            factory.updateCabinet = function(obj,id){

                return $http.put(updateCabinetUrl + id + '/',obj).then(function(result){
                    return result.data;
                },function(error){

                    cabinetFactoryLogger.error(error);
                    throw error;
                });
            }

            factory.createCabinet = function(obj){
                return $http.post(createCabinetUrl,obj).then(function(result){
                    return result.data;
                },function(error){
                    cabinetFactoryLogger.error(error);
                    throw error;
                })
            }

            factory.deleteCabinet = function(id){
                return $http.delete(deleteCabinetUrl + id + '/').then(function(result){
                    return result.data;
                },function(error){
                    cabinetFactoryLogger.error(error);
                    throw error;
                })
            }

            return factory;

        }
    ]);


;
angular.module('SRFModule').service('GetSRFFormDataFactory',['$http','SRFResources','$log','SRFUrls', function FormService($http,SRFResources,$log,SRFUrls) {

    var formFactoryLogger = $log.getInstance('formFactory');
    formFactoryLogger.info(SRFResources.getFormAndReportService);

    var getSingleFormJSON = 'modules/SRF/staticdata/singleFormJSON.js';
    var getSectionalFormJSON = 'modules/SRF/staticdata/sampleData.js';
    //var getSectionalFormJSON = SRFUrls.getFormStructure;
    var getPropertySectionalFormJSON ="modules/Property/staticdata/loandetailsJSON.js";




    return {




        sectionalForm : function() {
            try{
                var ajaxTime = new Date().getTime();
                console.log("ajaxTime " + ajaxTime);
            return $http.get(getSectionalFormJSON,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(function (response) {
                var totalTime = new Date().getTime()-ajaxTime;
                console.log("totalTime " + totalTime);

                return response.data;
            },function(error){
                formFactoryLogger.error(error.statusText);
                return error;
            });
            }
            catch(e){
                formFactoryLogger.info(SRFResources.getFormUnsuccessful);
                formFactoryLogger.error(e);
            }
        },

        propertySectionalForm : function() {
            try{
                var ajaxTime = new Date().getTime();
                console.log("ajaxTime " + ajaxTime);
            return $http.get(getPropertySectionalFormJSON).then(function (response) {
                var totalTime = new Date().getTime()-ajaxTime;
                console.log("totalTime " + totalTime);

                return response.data;
            },function(error){
                formFactoryLogger.error(error.statusText);
                return error;
            });
            }
            catch(e){
                formFactoryLogger.info(SRFResources.getFormUnsuccessful);
                formFactoryLogger.error(e);
            }
        }





    };
}]);
;angular.module('SRFModule').service('SetMarker',['$rootScope',function($rootScope){

    return {
        marker : function(mapObj,scope,type){
            var myLatLng = {lat: mapObj.lat, lng: mapObj.lng};
                 var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: mapObj.map,
                        draggable: true

                      });

                mapObj.map.panTo(myLatLng);

            if(type == 'button'){

                scope.$emit('SetLatLongOnClick',myLatLng);

            }
                google.maps.event.addListener(marker, 'dragend', function (event) {


                     myLatLng.lat  = this.getPosition().lat();
                     myLatLng.lng = this.getPosition().lng();

                     scope.$emit('SetLatLongOnMarker',myLatLng);
                     //setLatLong(lat , long);

                });
        }
    }

}]);
;angular.module('SRFModule').factory(
    'postDatafactory', ['$http', 'SRFUrls','$log','SRFResources',
        function($http, SRFUrls,$log,SRFResources) {

         var postFormDataLogger = $log.getInstance('postFormDataFactory');

         postFormDataLogger.info(SRFResources.postService);

            var factory = {};

            var staticPath = SRFUrls.postFormData;



            factory.postData = function(obj) {

                try{

                    //postFormDataLogger.debug("posted data object " + JSON.stringify(obj));

                return $http.post(staticPath,obj).then(
                    function(result) {

                        postFormDataLogger.info(SRFResources.postDataSuccess);
                        return result;
                    },function(error){
                        console.log("error result " + JSON.stringify(error));
                        postFormDataLogger.error(error.statusText);
                        return error;
                    });
                }
                catch(e){
                    postFormDataLogger.info(SRFResources.postDataError);
                    postFormDataLogger.error(e);
                }

            };

            return factory;

        }
    ]);
;angular.module('SRFModule').factory('shareDataService',[function(){

    var sharedData = {};

    var objSelectServices = {};


    var objPropInterest = [];
    var objValuationPremise = [];
    var collateralObj = [];
    var subTypeObj = [];

    var cabinets = [];

    var emails = [];

    var cabinetObj;

    var propertyTypes = [];

    var mapObject ;
    
    var editMode = false;

    sharedData.createSeperateJsonforReports = function(reportKeys){

        for(var i = 0 ; i < reportKeys.length ; i ++){


            objSelectServices[reportKeys[i]] = [];

        }

    }

    sharedData.storeSharedData = function(data){


           for(var key in objSelectServices){
               if (key == data.featureName){
                   if(data.value){
                   objSelectServices[key].push(data);
                   }
                   else{
                       for(var i = 0 ; i < objSelectServices[key].length ; i ++){
                        if(objSelectServices[key][i].displayName == data.displayName){

                            objSelectServices[key].splice(i,1);
                        }

                    }
                   }

               }
           }







    };

    sharedData.getStoredData = function(){

        return objSelectServices;
    };



    sharedData.storePropInterest = function(data){
        if(data.value == 1){
            objPropInterest.push(data);
        }
        else{
            for(var i = 0 ; i < objPropInterest.length ; i ++){
                if(objPropInterest[i].name == data.name){

                    objPropInterest.splice(i,1);
                }

            }
        }
    }

    sharedData.getPropInterest = function (){
        return objPropInterest;
    }


    sharedData.storeValuationPremise = function(data){
        if(data.value == 1){
            objValuationPremise.push(data);
        }
        else{
            for(var i = 0 ; i < objValuationPremise.length ; i ++){
                if(objValuationPremise[i].name == data.name){

                    objValuationPremise.splice(i,1);
                }

            }
        }
    }

    sharedData.getValuationPremise = function (){
        return objValuationPremise;
    }

    sharedData.storeCollateralData = function(collateralsections,formCollateral){

        for(var i = 1 ; i <= collateralsections ; i ++  ){
            collateralObj[i] = [];
            collateralObj[i].arr = [];
            for (var j = 0; j < formCollateral.length; j++) {

                if (formCollateral[j].orderIndex.startsWith("2." + i)) {
                    collateralObj[i].arr.push(formCollateral[j]);
                }
            }

    }




    }

    sharedData.getCollateralData = function (){
        return collateralObj;
    }

    sharedData.storeSubTypesData = function(data){
        subTypeObj = data;
    }

    sharedData.getSubTypesData = function(){
        return subTypeObj;
    }

    sharedData.storeCabinets = function(data){


        cabinets = data;


    }

    sharedData.getCabinets = function(){

        return cabinets;
    }

    sharedData.setCabinet = function(data){

        cabinetObj = data;

    }

    sharedData.getCabinet = function(){

        return cabinetObj;

    }

    sharedData.setEmails = function(data){
       emails =  data;
    }

    sharedData.getEmails = function(){
        return emails;
    }

    sharedData.setPropertyType = function(data){
        propertyTypes = data;
    }

    sharedData.getPropertyType = function(){
       return propertyTypes;
    }

    sharedData.setMapObject = function(map){
        mapObject = map;
    }

    sharedData.getMapObject = function(){
        return mapObject;
    }
    
    sharedData.setEditMode = function(bool){
        editMode = bool;
    }
    sharedData.getEditMode = function(){
        return editMode;
    }


    return sharedData;

}]);
;;angular.module('PolicyManagerModule').controller('PolicyMatrixCtrl',['$scope','policyvalues','PolicyShareDataService',function($scope,policyvalues,PolicyShareDataService){


    var policyList = [];
    var policyRange = [];

    $scope.policyValues = [];







        angular.forEach(policyvalues,function(policy){

            if(policy.parameterType == 'List'){

                policyList.push(policy);

            }


        });

        angular.forEach(policyvalues,function(policy){

            if(policy.parameterType == 'Range'){

                policyRange.push(policy);

            }


        });





        $scope.policyValues = policyList.concat(policyRange);

    //$scope.policyValues = policyvalues;

    PolicyShareDataService.setPolicyValues(policyvalues);

}]);
;angular.module('PolicyManagerModule').controller('PolicyNavCtrl',['$scope','resources','PolicyShareDataService','$location',function($scope,resources,
                                                                                                          PolicyShareDataService,$location){


    $scope.nxtbtntext = "Next";

        var obj = PolicyShareDataService.getPolicy();

        if(obj.policyname == "" || obj.policytype == ""){
            $scope.cookiepolicy =  localStorage.getItem(resources.policyname);
            $scope.cookiepolicytype = localStorage.getItem(resources.policytype);
        }
        else{
        $scope.cookiepolicy =  obj.policyname;
        $scope.cookiepolicytype = obj.policytype;
        }






    this.ShiftToNextView = function(){

    };


}]);
;angular.module('PolicyManagerModule').controller('PolicyInfoCtrl',['$scope','policyparams',function($scope,policyparams){



    $scope.existingParams = policyparams;

    $scope.policies = [
                       { 'dataField' : 'PropertyType', 'displayName' : 'Property Type' , 'parameterType' : 'List' },
                       { 'dataField' : 'State', 'displayName' : 'State' , 'parameterType' : 'List' }

                      ];

    this.resetValue = function(){

        $scope.param = undefined;

    }

}]);
;angular.module('PolicyManagerModule').controller('PolicyValuesCtrl',['$scope','policyvalues','PolicyShareDataService',function($scope,policyvalues,PolicyShareDataService){



    $scope.policyValues = policyvalues;

    PolicyShareDataService.setPolicyValues(policyvalues);

}]);
;angular.module('PolicyManagerModule').controller('PolicyViewCtrl',['$scope',function($scope){



    console.log("in policy view controller");

}]);;angular.module('PolicyManagerModule').directive('activeClass', ['$location', function ($location) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {



            if (String($location.path()) === String(attr.urlparams)) {

                elem.addClass("active");

            } else {

                elem.removeClass("active");
            }

            elem.bind('click', function () {

                elem.addClass('active')
                    .siblings().removeClass('active');
                if (attr.urlparams == '/Policy/Parameters') {

                    angular.element('#prevbtn').hide();
                    scope.nxtbtntext = "Next";
                } else if (attr.urlparams == '/Policy/Values') {
                    angular.element('#prevbtn').show();
                    scope.nxtbtntext = "Next";
                } else if (attr.urlparams == '/Policy/Matrix') {
                    angular.element('#prevbtn').show();
                    scope.nxtbtntext = "Create Loan";
                }

            });

        }
    }


}]);



policyApp.directive('shiftNext', ['$location', '$state', function ($location, $state) {

    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            if ($location.path() == '/Policy/Matrix') {

                scope.nxtbtntext = "Create Loan";

            }
            elem.bind('click', function () {

                if ($location.path() == '/Policy/Parameters') {
                    $state.go('Policy.Values');
                    angular.element('#prevbtn').show();
                } else if ($location.path() == '/Policy/Values') {

                    scope.nxtbtntext = "Create Loan";
                    $state.go('Policy.Matrix');
                }


                angular.element('#ulnavigation li.active').next().addClass('active');
                angular.element('#ulnavigation li.active').prev().removeClass('active');

            })
        }
    }

}]);

policyApp.directive('shiftPrevious', ['$location', '$state', function ($location, $state) {

    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            if ($location.path() == '/Policy/Parameters') {
                angular.element('#prevbtn').hide();


            }
            else{
                angular.element('#prevbtn').show();
            }
            elem.bind('click', function () {

                if ($location.path() == '/Policy/Values') {
                    $state.go('Policy.Parameters');
                    scope.nxtbtntext = "Next";
                    angular.element('#prevbtn').hide();
                } else if ($location.path() == '/Policy/Matrix') {

                    scope.nxtbtntext = "Next";
                    $state.go('Policy.Values');
                }


                angular.element('#ulnavigation li.active').prev().addClass('active');
                angular.element('#ulnavigation li.active').next().removeClass('active');

            })
        }
    }

}]);


policyApp.directive('addRow', [function () {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {



                if (scope.param != undefined) {

                    var keepGoing = true;
                    var count = 0;
                    var rowhtml = '<tr>' +
                        '<td>' + scope.param.dataField + '</td>' +
                        '<td>' + scope.param.displayName + '</td>' +
                        '<td>' + scope.param.parameterType + '</td>' +
                        '</tr>'
                    $('#policytablebody').append(rowhtml);
                    angular.forEach(scope.policies, function (singlepolicy) {

                        if (keepGoing && singlepolicy.displayName == scope.param.displayName) {
                            count = count + 1;
                            scope.$apply(scope.policies.splice(count - 1, 1));
                            keepGoing = false;
                        }
                    })
                }

            });



        }
    }


}]);


policyApp.directive('reloadOnrefresh', [function () {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.empty();
            angular.forEach(scope.existingParams, function (singlerecord) {
                var rowhtml = '<tr>' +
                    '<td>' + singlerecord.dataField + '</td>' +
                    '<td>' + singlerecord.displayName + '</td>' +
                    '<td>' + singlerecord.parameterType + '</td>' +
                    '</tr>'

                elem.append(rowhtml);

            });




        }
    }


}]);

policyApp.directive('reloadPolicyValuesOnrefresh', ['PolicyShareDataService', function (PolicyShareDataService) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            var obj = PolicyShareDataService.getPolicyValues();
            elem.empty();
            angular.forEach(obj, function (policyValue) {
                if (policyValue.parameterType == 'List' && policyValue.dataField == attr.id) {

                    if (policyValue.values.length != 0) {
                        scope.prevPolicyValues = true;
                        scope.valid = true;
                        for (var i = 0; i < policyValue.values.length; i++) {
                            var rowhtml = '<tr>' +
                                '<td>' + policyValue.values[i] + '</td>' +

                                '</tr>'

                            elem.append(rowhtml);
                        }
                    } else {
                        scope.prevPolicyValues = false;
                        scope.valid = false;
                    }

                }

                if (policyValue.parameterType == 'Range' && policyValue.dataField == attr.id) {

                    if (policyValue.values.length != 0) {
                        scope.prevPolicyValues = true;
                        scope.valid = true;
                        for (var i = 0; i < policyValue.values.length; i++) {
                            var rowhtml = '<tr>' +
                                '<td>' + policyValue.values[i].lowerLimit + '</td>' +
                                '<td>' + policyValue.values[i].upperLimit + '</td>' +
                                '</tr>'

                            elem.append(rowhtml);
                        }
                    } else {
                        scope.prevPolicyValues = false;
                        scope.valid = false;
                    }

                }

            });




        }
    }


}]);


policyApp.directive('divDirective', ['$http', '$compile', 'PolicyShareDataService', function ($http, $compile, PolicyShareDataService) {

    return {
        restrict: 'A',

        scope: {
            field: '='
        },

        link: function (scope, elem, attr) {




            var listTemplateUrl = 'modules/PolicyManager/views/policylist.html';
            var rangeTemplateUrl = 'modules/PolicyManager/views/policyrange.html'

            if (scope.field.parameterType == 'Range') {


                $http.get(rangeTemplateUrl).then(function (response) {

                    elem.html(response.data);
                    scope.elem = elem.contents();
                    $compile(elem.contents())(scope);

                });
            } else if (scope.field.parameterType == 'List') {

                $http.get(listTemplateUrl).then(function (response) {

                    elem.html(response.data);
                    scope.elem = elem.contents();
                    $compile(elem.contents())(scope);

                });

            }






        },

        controller: function ($scope, $element, $http) {



            $scope.LowerValChanged = function () {

                var truthy = CheckTbodyErrorMsg($scope.field.dataField);

                if (!truthy && $scope.field.fieldLowerValue != "" && $scope.field.fieldLowerValue != undefined) {

                    if ($scope.field.fieldHigherValue != "" && $scope.field.fieldHigherValue != undefined) {
                        $scope.valid = true;
                    } else {

                        $scope.valid = false;
                    }
                }

                /*if($scope.field.fieldLowerValue != "" && $scope.field.fieldLowerValue != undefined){

                    if($scope.field.fieldHigherValue != "" && $scope.field.fieldHigherValue != undefined){
                        $scope.valid = true;
                    }
                    else{

                        $scope.valid = false;
                    }

                }
                else $scope.valid = false;*/
            }

            $scope.HigherValChanged = function () {

                var truthy = CheckTbodyErrorMsg($scope.field.dataField);
                if (!truthy && $scope.field.fieldHigherValue != "" && $scope.field.fieldHigherValue != undefined) {

                    if ($scope.field.fieldLowerValue != "" && $scope.field.fieldLowerValue != undefined) {
                        $scope.valid = true;
                    } else {

                        $scope.valid = false;
                    }
                }

                /*if($scope.field.fieldHigherValue != "" && $scope.field.fieldHigherValue != undefined){
                    if($scope.field.fieldLowerValue != "" && $scope.field.fieldLowerValue != undefined){
                        $scope.valid = true;
                    }
                    else{
                        $scope.valid = false;
                    }
                }
                else $scope.valid = false;*/
            }

            $scope.RemoveListValidation = function () {

                if ($scope.field.fieldValue != undefined) {
                    $scope.valid = true;
                } else $scope.valid = false;
            }

            $scope.AddListValues = function (form) {

                $scope.$broadcast('show-errors-check-validity');
                if (form.$invalid) {
                    return;
                } else {
                    $scope.valid = true;
                    $scope.prevPolicyValues = true;

                    var html = '<tr>' +
                        '<td>' + $scope.field.fieldValue + '</td>' +

                        '</tr>'

                    angular.element('#' + $scope.field.dataField).append(html);
                }


            }

            $scope.ResetListValues = function () {
                CheckTbodyErrorMsg($scope.field.dataField);
                $scope.field.fieldValue = undefined;
                $scope.$broadcast('show-errors-reset');

            }

            $scope.AddRangeValues = function (form) {

                $scope.$broadcast('show-errors-check-validity');
                if (form.$invalid) {
                    return;
                } else {
                    $scope.valid = true;
                    $scope.prevPolicyValues = true;

                    var html = '<tr>' +
                        '<td>' + $scope.field.fieldLowerValue + '</td>' +
                        '<td>' + $scope.field.fieldHigherValue + '</td>' +
                        '</tr>'

                    angular.element('#' + $scope.field.dataField).append(html);
                }



            }

            $scope.ResetRangeValues = function () {

                CheckTbodyErrorMsg($scope.field.dataField);


                $scope.field.fieldHigherValue = undefined;
                $scope.field.fieldLowerValue = undefined;
                $scope.$broadcast('show-errors-reset');

            }

            function CheckTbodyErrorMsg(id) {

                if (angular.element('#' + id).children().length != 0) {
                    $scope.valid = true;
                } else $scope.valid = false;

                return $scope.valid;
            }
        }
    }


}]);


policyApp.directive('dynamicPolicyMatrix', [function () {

    return {

        restrict: 'A',

        link: function (scope, elem, attr) {

            var dynamicArrListObj = {};
            var dynamicArrRangeObj = {};

            var listValuesArray = [];
            var rangeValuesArray = [];
            var listValuesCount = 0;
            var rangeValuesCount = 0;

            var countList = 0;
            var countRange = 0;

            var largestPolicyListCount;
            var largestPolicyRangeCount

            angular.forEach(scope.policyValues, function (policyValue) {



                if (policyValue.parameterType == 'List') {
                    countList = countList + 1;
                    dynamicArrListObj['arrPolicyList' + countList] = policyValue.values;
                    listValuesArray.push(policyValue.values.length);
                } else if (policyValue.parameterType == 'Range') {
                    countRange = countRange + 1;
                    dynamicArrRangeObj['arrPolicyRange' + countRange] = policyValue.values;
                    rangeValuesArray.push(policyValue.values.length);
                }

                largestPolicyListCount = Math.max.apply(Math, listValuesArray);
                largestPolicyRangeCount = Math.max.apply(Math, rangeValuesArray);





            })

            for (var i = 0; i < largestPolicyRangeCount; i++) {

                for (var j = 0; j < largestPolicyListCount; j++) {

                    var html = '<tr>';

                    for (var k = 1; k < countList + 1; k++) {

                        var val = dynamicArrListObj['arrPolicyList' + k][j] == undefined ? '-' : dynamicArrListObj['arrPolicyList' + k][j];
                        html = html + '<td style="width:30%;">' + val + '</td>';



                    }

                    for (var l = 1; l < countRange + 1; l++) {


                        var lowerVal = dynamicArrRangeObj['arrPolicyRange' + l][i] == undefined ? '--' : dynamicArrRangeObj['arrPolicyRange' + l][i].lowerLimit;

                        var higherVal = dynamicArrRangeObj['arrPolicyRange' + l][i] == undefined ? '--' : dynamicArrRangeObj['arrPolicyRange' + l][i].upperLimit;
                        //var val = dynamicArrRangeObj['arrPolicyRange' + l][i].lowerLimit + ' - ' + dynamicArrRangeObj['arrPolicyRange' + l][i].upperLimit;
                        var finalVal = lowerVal + '-' + higherVal;

                        html = html + '<td style="width:30%;">' + finalVal + '</td>';


                    }

                  html = html +  '<td style="width:40%;">' +
                                 '<form class="form-inline"><div class="form-group"><textarea class="form-control" > </textarea></div>' +
                                 '<div class="form-group" style="vertical-align:bottom">' +
                                 '<button type="submit" class="btn btn-xs btn-default">Save Results </button></div></form></td>'

                   elem.append(html + '</tr>');

                }



            }









        }
    }






}]);
;angular.module('PolicyManagerModule').constant('resources', {

    //localstorage keys

    policyname  : 'policyname', // localstorage to keep data after creating policy name from header popup
    policytype : 'policytype'   // localstorage to keep data after creating policy type from header popup

});
;angular.module('PolicyManagerModule').factory('PolicyShareDataService',function(){

    var sharedata = {};

    var policy = {
            'policyname' : '',
            'policytype' : ''
    }

    var policyValues = {};

    sharedata.setPolicy = function(data){

        policy.policyname = data.policyname;
        policy.policytype = data.policytype;
    }

    sharedata.getPolicy = function(){
        return policy;
    }

    sharedata.setPolicyValues = function(data){
        policyValues = data;
    }

    sharedata.getPolicyValues = function(){
        return policyValues;
    }

    return sharedata;
})
;angular.module('PropertyModule').controller('PropertyEnvironmentalCtrl',['navLinks',function(navLinks){

}]);
;angular.module('PropertyModule').controller('PropertyNavCtrl', ['navLinks', '$log', 'PropertyResources', '$state','$stateParams', function (navLinks, $log, PropertyResources, $state,$stateParams) {

    var PropertyNavControllerLogger = $log.getInstance('propertynavigation');

    PropertyNavControllerLogger.info(PropertyResources.navcontroller);
    
   this.propertyAddress = "Sample data";
   this.propertyCity = "Sample data";
   this.propertyState = "Sample data";
   this.propertyZip = "Sample data";

    this.links = navLinks;

    this.ChangePropView = function (link) {

        switch (link.featureID) {

            case 181:
                $state.go('Property.Environmental');
                break;
            case 182:
                $state.go('Property.Engineering');
                break;
            case 183:
                $state.go('Property.Valuation');
                break;
            case 184:
                $state.go('Property.AdditionalServices');
                break;
            case 185:
                $state.go('Property.InspectionServices');
                break;
            case 186:
                $state.go('Property.ReportStatus');
                break;
            case 187:
                $state.go('Property.FileManager');
                break;

            default:
                $state.go('Property.Overview');
        }

    }

}]);
;angular.module('PropertyModule').controller('PropertyOverviewCtrl',['PropertyLoanData','$log','PropertyResources','$scope',function(PropertyLoanData,$log,PropertyResources,$scope){

    var PropertyOverviewControllerLogger = $log.getInstance('propertyoverview');

    PropertyOverviewControllerLogger.info(PropertyResources.navcontroller);

    var self = this;
    this.tabsArray = [];
    this.propertydetails = {};
    this.propertydetails.tabsArray = [];
    this.propertydetails.individualTabsArray = [];
    this.editbtn = "Edit";
    this.showSavebtn = false;
    this.submissionSuccess = false;
    this.submissionFailed = false;




    angular.forEach(PropertyLoanData.tabs,function(tab){

        self.propertydetails.tabsArray.push(tab);
    })


            self.TabClicked = function (tabtitle) {

                    angular.forEach(self.propertydetails.tabsArray,function(tabs){
                        if(tabs.tabTitle != tabtitle){
                            angular.element('#' + tabs.tabTitle).hide();
                        }
                        else{
                            angular.element('#' + tabs.tabTitle).show();
                        }
                    })
                }

            self.EditForm = function(){

                if(this.editbtn == "Edit"){
                    this.editbtn = "Cancel";
                    this.showSavebtn = true;

                    ChangeIsEditable(true);

                }
                else{
                    this.editbtn = "Edit";
                    this.showSavebtn = false;

                    ChangeIsEditable(false);

                }


            }

            self.SaveFormData = function(){
                this.showSavebtn = false;
                this.editbtn = "Edit";
                ChangeIsEditable(false);
                $scope.submissionSuccess = false;
                $scope.submissionFailed = false;


                for(var i = 0  ; i < self.propertydetails.tabsArray.length ; i++){

                        var currentTab = self.propertydetails.tabsArray[i].tabTitle;

                        if (self.form[currentTab].$invalid ) {

                            $scope.submissionFailed = true;
                            $scope.submissionSuccess = false;

                            break;

                        }
                        else {

                            $scope.submissionFailed = false;
                            $scope.submissionSuccess = true;

                        }

                    }

                //PostData();


            }

            //This function changes status of isEditable field so all controls enables/disables depending on status

            function ChangeIsEditable(status){

                angular.forEach(PropertyLoanData.tabs,function(tab){  // foreach for tabs
                        angular.forEach(tab.rows,function(row){  // foreach for rows
                            angular.forEach(row.columns,function(column){  // foreach for columns
                                angular.forEach(column.sections,function(section){ // foreach for sections
                                    angular.forEach(section.fields,function(field){ // foreach for fields
                                        field.isEditable = status;
                                    })
                                })
                            })
                        })

                    })
            }
}]);
;angular.module('PropertyModule').factory(
    'PropertyDetailsFactory', ['$http', 'PropertyUrls', '$log', 'PropertyResources',
        function ($http, PropertyUrls, $log, PropertyResources) {

            var PropertyFactoryLogger = $log.getInstance('propertyFactory');

            PropertyFactoryLogger.info(PropertyResources.initial);

            var factory = {};

            var navigationlinks = PropertyUrls.getPropertyNavigationLinks;
            var loandetails = PropertyUrls.getLoanData;


            factory.GetNavLinks = function () {

                PropertyFactoryLogger.info(PropertyResources.navigationlinks);

                return $http.get(navigationlinks).then(
                    function (result) {

                        return result.data;
                    },
                    function (error) {

                        PropertyFactoryLogger.error(error);
                        throw new Error(error);
                    });
            }

            factory.GetLoanDetails = function () {

                PropertyFactoryLogger.info(PropertyResources.loandetails);

                return $http.get(loandetails).then(
                    function (result) {

                        return result.data;
                    },
                    function (error) {

                        PropertyFactoryLogger.error(error);
                        throw new Error(error);
                    });
            }

            return factory;

}
]);
;angular.module('PropertyModule').constant('PropertyResources', {

    'initial'  : 'propertyfactory reached',
    'navigationlinks' : 'factory called for navigation links',
    'loandetails' : 'factory called for getting loan data',
    'navcontroller' : 'property navigation controller reached',
    'overviewcontroller' : 'property overview controller reached'

});
;angular.module('PropertyModule').constant('PropertyUrls', {

    //Urls

    getPropertyNavigationLinks :  'modules/Property/staticdata/miscJSON.js',
    getLoanData : 'modules/Property/staticdata/loandetailsJSON.js'



});
;;;;angular.module('LenderPortal').controller('DashBoardCtrl', ['DashboardFactory', '$timeout', '$scope', 'globalValues', '$templateCache', 'dashboardUrls', '$compile', 'dashboardData', 'shareDataService', 'globalValues', '$location', function (DashboardFactory, $timeout, $scope, globalValues, $templateCache, dashboardUrls, $compile, dashboardData, shareDataService, globalValues, $location) {

    var scope = $scope;
    var self = this;
    var title = '';
    var value = "";
    this.settingsSaved = false;

    $scope.dateFilterRangeSearch = false;

    var truthyColumnsArrayNumber;

    $scope.$watch(function () {

            return self.alert;
        },
        function (value) {
            if (value) {
                $timeout(function () {
                    self.alert = false;
                }, 2000)
            }

        }
    )






    var dateElemHtml = '<div class="input-group">' +
        '<input type="text" class="form-control input-xs date-min-width date-filter" text-change ="date" ng-click ="stopPropagation($event)" />' +
        '<span class="input-group-btn">' +
        '<a class="btn btn-default dropdown-toggle btn-xs" data-toggle="dropdown" href="#">' +
        '<span>= &nbsp;</span>' +
        '<span class="caret"></span>' +
        '</a>' +
        '<ul class="dropdown-menu custom-dropdown pull-right">' +
        '<li><a class="dateComparison" datefilter-condition = "=">On this date</a></li>' +
        '<li><a class="dateComparison" datefilter-condition = "<">Before this date</a></li>' +
        '<li><a class="dateComparison" datefilter-condition = ">">After this date</a></li>' +
        '</ul>' +
        '</span>' +
        '</div>'

    angular.element('#openOrders-actions').hide();


    this.headers = [];



    this.headers = [
        {
            "name": "CreatedTimeStamp",
            "index": 1,
            "default": false,
            "image": '',
            "visible": false

        },
        {
            "name": "MsgFlag",
            "index": 2,
            "default": true,
            "image": 'images/message_dashboard_header.png',
            "visible": true

        },
        {
            "name": "MsgFlagExport",
            "index": 3,
            "default": false,
            "image": '',
            "visible": false

        },
        {
            "name": "IsMonitored",
            "index": 4,
            "default": true,
            "image": 'images/monitoring_dashboard_header.png',
            "visible": true

        },
        {
            "name": "IsMonitoredExport",
            "index": 5,
            "default": false,
            "image": '',
            "visible": false
        },
        {
            "name": "AlertStatus",
            "index": 6,
            "default": true,
            "image": 'images/alert_dashboard_header.png',
            "visible": true
        },
        {
            "name": "AlertStatusExport",
            "index": 7,
            "default": false,
            "image": '',
            "visible": false
        }, {
            "name": "Cabinet",
            "index": 8,
            "default": true,
            "visible": true
        }, {
            "name": "Loan No",
            "index": 9,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Application No",
            "index": 10,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "Borrower",
            "index": 11,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Location ID",
            "index": 12,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "Location Name",
            "index": 13,
            "default": false,
            "image": '',
            "visible": true
        },
        {
            "name": "Address",
            "index": 14,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "City",
            "index": 15,
            "default": false,
            "image": '',
            "visible": true
        },
        {
            "name": "County",
            "index": 16,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "State",
            "index": 17,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Zip",
            "index": 18,
            "default": false,
            "image": '',
            "visible": true
        }, {
            "name": "Created",
            "index": 19,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Created By",
            "index": 20,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "Due",
            "index": 21,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Service",
            "index": 22,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "Status",
            "index": 23,
            "default": true,
            "image": '',
            "visible": true
        },
        {
            "name": "Status Date",
            "index": 24,
            "default": true,
            "image": '',
            "visible": true
        }, {
            "name": "Ordered By",
            "index": 25,
            "default": false,
            "image": '',
            "visible": true
        },
        {
            "name": "Ordered Date",
            "index": 26,
            "default": false,
            "image": '',
            "visible": true
        }];



    $scope.$on('fillDatatable', function () {
        if (globalValues.pageRefreshed) {
            localStorage.setItem('DataTables_table_id_/index.html', '');
        }
        fillDataTable();
    })


    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        if ($scope.dateFilterRangeSearch && $scope.dateValue != "") {
            $scope.operator;
            $scope.dateValue;
            if (moment($scope.dateValue, "M/D/YYYY", true).isValid()) {
                if ($scope.operator == "<") {
                    var max = Date.parse($scope.dateValue);
                    var date = (Date.parse(data[19])) || 0;
                    if ((isNaN(max)) || (date < max))
                    {
                     return true;
                    }
                    return false;
                } else if ($scope.operator == ">") {
                    var min = Date.parse($scope.dateValue);

                    var date = (Date.parse(data[19])) || 0;

                    if ((isNaN(min)) || (date > min))

                    {
                        return true;
                    }
                    return false;
                } else if ($scope.operator == "=") {
                    var singleValue = Date.parse($scope.dateValue);

                    var date = (Date.parse(data[$scope.columnIndex])) || 0;

                    if ((isNaN(singleValue)) || (date == singleValue))

                    {
                        return true;
                    }
                    return false;
                }
                else{
                    var searchText = $scope.textboxVal;
                    var columnData = data[$scope.columnIndex];
                    if(searchText == ""){
                        return true;
                    }
                    else if(searchText == columnData){
                        return true;
                    }
                    return false;
                    
                }
            } else {
                return false;
            }


        } else {
            return true;
        }
    })


    function fillDataTable() {
        $(document).ready(function () {
            /**
             * function executed when any of the datatable event is fired
             */
            var eventFired = function (e, settings, column, state, type) {

                switch (type) {
                    case 'Length':
                        $('.checkAll').prop('checked', false);
                        if (globalValues.dashBoardCollapseAll)
                            $scope.$broadcast('collapse-after-length-change');
                        break;
                    case 'column-visibility':
                        var value = "";
                        var index = "";
                        var searchLocalStorageCols = [];
                        var columnsArray = $scope.dataTable.columns().visible();
                        truthyColumnsArrayNumber = getTotalVisibleColumnsNumber(columnsArray);
                        $('.group').each(function (i, obj) {
                            $(this).children().first().attr('colspan', truthyColumnsArrayNumber)

                        });

                        $('#table_id thead tr.filterrow th').each(function () {
                            var title = $('#table_id thead th').eq($(this).index()).text();
                            if (title != "" && title.split(" ").join("").toLowerCase() == $scope.hiddenColumnName.split(" ").join("").toLowerCase()) {
                                index = $(this).index();
                                if (!$('#table_id tbody').find('tr:nth(1) td').eq($(this).index()).hasClass('datefield')) {
                                    var elemHtml = '<input type="text" class="form-control input-xs" text-change = ' + title + 'value = ' + value + ' ng-click ="stopPropagation($event)" />'
                                } else {
                                    var elemHtml = dateElemHtml;
                                }
                                var compiledHtml = $compile(elemHtml)(scope);
                                $(this).html(compiledHtml);
                            }
                        });

                        var localStorageJSON = localStorage.getItem('DataTables_table_id_/index.html');

                        for (var i = 0; i < JSON.parse(localStorageJSON).columns.length; i++) {
                            if (i == $scope.hiddenColumnIndex)
                                $('#table_id thead tr.filterrow th').eq(index).find('input').val(JSON.parse(localStorageJSON).columns[i].search.search);

                        }
                        break;
                }
            }

            /**
             * Different event handlers for different events
             */
            $('#table_id')
                .on('order.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Order');
                })
                .on('search.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Search');
                })
                .on('page.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Page');
                })
                .on('length.dt', function (e, settings, column, state) {
                    eventFired(e, settings, column, state, 'Length');
                })
                .on('column-visibility.dt', function (e, settings, column, state, type) {

                    eventFired(e, settings, column, state, 'column-visibility');
                })
            $scope.dataTable = $('#table_id').DataTable({

                "dom": '<"icon-right pull-right"B<"btn txt-white"l>>r<"dashboard-table"t><"pull-left"i>p<"text-right"l>',
                "processing": true,
                "data": dashboardData,
                "orderCellsTop": true,
                "bInfo": true,
                "deferRender": true,
                "initComplete": function () {

                    $('#table_id').DataTable().state.clear();
                    $('#table_id tbody tr').each(function () {
                        $(this).find('td:eq(0)').css('white-space', 'nowrap');
                    });

                    $('#table_id thead tr.filterrow th').each(function () {

                        var title = $('#table_id thead th').eq($(this).index()).text();

                        if (title != "" && !$('#table_id tbody').find('tr:nth(1) td').eq($(this).index()).hasClass('datefield')) {

                            var elemHtml = '<input type="text" class="form-control text-filter input-xs"  ng-click="stopPropagation($event);" text-change = ' + title.split(" ").join("") + ' />';
                        } else if (title != "" && $('#table_id tbody').find('tr:nth(1) td').eq($(this).index()).hasClass('datefield')) {

                            var elemHtml = dateElemHtml;
                        }
                        var compiledHtml = $compile(elemHtml)(scope);
                        $(this).html(compiledHtml);
                    });
                },

                "language": {
                    "lengthMenu": "Per page: _MENU_"
                        /*"zeroRecords": "Nothing found - sorry",
                        "info": "Showing page _PAGE_ of _PAGES_",
                        "infoEmpty": "No records available",
                        "infoFiltered": "(filtered from _MAX_ total records)"*/
                },
                "stateSave": true,
                "colReorder": true,
                "buttons": [{
                        extend: 'copyHtml5',
                        text: '<i class="fa fa-clipboard fa-lg" title="Copy to Clipboard"></i>',
                        className: 'dashboard-btn-icon',
                        exportOptions: {
                            columns: [8, 9, 10]
                        }
                    },
                    {
                        extend: 'print',
                        text: '<i class="fa fa-print fa-lg" title="Print"></i>',
                        className: 'dashboard-btn-icon',
                        exportOptions: {
                            columns: [8, 9, 10]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: '<i class="fa fa-file-excel-o fa-lg" title="Export visible results to Excel"></i>',
                        className: 'dashboard-btn-icon',
                        exportOptions: {
                            columns: [8, 9, 10]
                        }
                    }

                    ],
                "columnDefs": [
                    {
                        "targets": 0,
                        "data": null,
                        "sortable": false,

                        "title": '<input type="checkbox" title="Check/Uncheck all checkboxes" class="checkAll" id="checkall" name="checkAll">',

                        "render": function (data, type, full) {
                            if (full.serviceRequestId != undefined) {
                                var html = '<a class=createLoanPopup href="/lenderPortal/newLoan.php?serviceRequestID=' + full.serviceRequestId + '"><img src="images/zoom.gif"/></a>';

                                return html;
                            } else if (full.locationId != undefined && full.cabinetId != undefined) {
                                var html = '<a class="propertyRedirect" href="' + $location.absUrl() + 'Property/Overview?LocationID=' + full.locationId + '&PID=' + full.cabinetId + '"><img src="images/zoom.gif"/></a>';

                                return html;
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        "targets": 1,
                        "title": "Created Timestamp",
                        "data": "createdTimeStamp",
                        "visible": false,
                        "class": "datefield",
                        "name": "Created Timestamp"

                    },
                    {
                        "targets": 2,

                        "title": '<img src="images/message_dashboard_header.png" title="Messages"/>',
                        "data": "MsgFlag",
                        "render": function (data, type, full) {
                            if (full.MsgFlag == 1)
                                return '<a href="/lenderPortal/Messaging/MessageCenter/' + full.pSiteID + '/Lender' + '"  class="MessageCenter"><img id=envelope_' + full.pSiteID + ' class="messageImage" src="images/u47.png" title="Message" alt="Message"/></a>';

                            else if (full.MsgFlag == 2)
                                return '<a href="/lenderPortal/Messaging/MessageCenter/' + full.pSiteID + '/Lender' + '" class="MessageCenter"><img id=envelope_' + full.pSiteID + ' class="messageImage" src="images/u16.png" title="Message" alt="Message"/></a>';

                            else
                                return "";
                        }
                    },
                    {
                        "targets": 3,
                        "title": "Messages",
                        "data": "MsgFlagExport",
                        "sortable": false,
                        "visible": false,

                        "render": function (data, type, full) {
                            if (full.MsgFlag == 1 || full.MsgFlag == 2)
                                return 'Yes';
                            else
                                return 'No';
                        }
                    },
                    {
                        "targets": 4,

                        "title": '<img src="images/monitoring_dashboard_header.png"/>',
                        "data": "isMonitored",
                        "class": "isMonitored",
                        "render": function (data, type, full) {
                            var link = '/reporting/PARCELAssetSite.php?LocationID=' +
                                full.locationId + '&PID=' + full.cabinetId + '#78';
                            if (data == 1) {
                                return '<a href="' + link + '">' +
                                    '<img src = "images/icon_monitoring_on.gif"></a>';
                            } else if (data == 2) {
                                return '<a href="' + link + '"> <img src = "images/alert_check.png"' +
                                    'width = "16"' +
                                    'height = "16"/></a>';
                            } else if (data == 3) {
                                return '<a href="' + link + '"> <img src = "images/icon_alert.png"></a>';
                            } else if (data == 4) {
                                return '<a href="' + link + '"> <img src = "images/stop.png"' +
                                    'width = "16"' +
                                    'height = "16" /></a>';
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 5,
                        "title": "Monitoring",

                        "data": "isMonitoredExport",
                        "sortable": false,
                        "visible": false,
                        "render": function (data, type, full) {
                            if (full.isMonitored == 1) {
                                return 'On';
                            } else if (full.isMonitored == 2) {
                                return 'Clear';
                            } else if (full.isMonitored == 3) {
                                return 'Alert';
                            } else if (full.isMonitored == 4) {
                                return 'Issue';
                            } else {
                                return 'Off';
                            }
                        }
                    },
                    {
                        "targets": 6,

                        "title": '<img src="images/alert_dashboard_header.png" title="Alert"/>',
                        "data": "alertStatus",
                        "render": function (data, type, full) {
                            //null = no alerts, 1 = read alerts, 2=unread alerts
                            if (data == null) {
                                return '';
                            } else if (data == 1) {
                                return '<a  class="alertpop" href="#" id="alerts-' + full.pSiteID + '" onclick="getAlerts(\'' + full.pSiteID + '\')"><img id="alert-image-' + full.pSiteID + '" src="images/alert_inactive.png" height="16" width="16"/></a>';
                            } else if (data == 2) {
                                return '<a  class="alertpop" href="#" id="alerts-' + full.pSiteID + '" onclick="getAlerts(\'' + full.pSiteID + '\')"><img id="alert-image-' + full.pSiteID + '" src="images/alert_active.png" height="16" width="16"/></a>';
                            } else {
                                return 'Error retrieving AlertStatus. Data code: ' + data;
                            }
                        }
                    },
                    {
                        "targets": 7,

                        "title": "Alert",
                        "data": "alertStatusExport",
                        "sortable": false,
                        "visible": false,
                        "render": function (data, type, full) {
                            if (full.alertStatus == null) {
                                return 'No';
                            } else if (full.alertStatus == 1 || full.alertStatus == 2) {
                                return 'Yes';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        "targets": 8,

                        "title": "Cabinet",
                        "data": "cabinet",
                        "sortable": true



                    },
                    {
                        "targets": 9,

                        "title": "Loan No.",
                        "data": "loanNumber"
                    },
                    {
                        "targets": 10,
                        "title": "Application No.",
                        "data": "applicationNumber",
                        "visible": false

                    },
                    {
                        "targets": 11,

                        "title": "Borrower",
                        "data": "borrower"

                    },
                    {
                        "targets": 12,

                        "title": "Location ID",
                        "data": "locationId",
                        "visible": false
                    },
                    {
                        "targets": 13,

                        "title": "Location Name",
                        "data": "locationName",
                        "visible": false
                    },
                    {
                        "targets": 14,

                        "title": "Address",
                        "data": "locationAddress",
                        "name": "Address"
                    },
                    {
                        "aTargets": 15,

                        "title": "City",
                        "data": "locationCity",
                        "visible": false,
                        "name": "City"
                    },
                    {
                        "targets": 16,
                        
                        "title": "County",
                        "data": "locationCounty",
                        "visible": false
                    },
                    {
                        "targets": 17,

                        "title": "State",
                        "data": "locationState",
                        "name": "State"
                    },
                    {
                        "targets": 18,

                        "title": "Zip",
                        "data": "locationZip",
                        "visible": false,
                        "name": "Zip"
                    },
                    {
                        "targets": 19,
                        "class": "datefield",
                        "title": "Created",
                        "name": "Created",
                        "data": "creationDate",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 20,

                        "title": "Created By",
                        "data": "createdBy"
                    },
                    {
                        "targets": 21,
                        "title": "Due",
                        "class": "datefield",
                        "data": "dueDate",
                        "name": "Due",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 22,

                        "title": "Service",
                        "data": "service"
                    },
                    {
                        "targets": 23,
                        "title": "Status",

                        "data": "status"
                    },
                    {
                        "targets": 24,
                        "title": "Status Date",
                        "class": "datefield",
                        "data": "statusDate",
                        "name": "Status Date",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "targets": 25,
                        "title": "Ordered By",

                        "data": "orderedBy",
                        "visible": false
                    },
                    {
                        "targets": 26,
                        "title": "Ordered Date",
                        "class": "datefield",
                        "data": "orderedDate",
                        "visible": false,
                        "name": "Ordered Date",
                        "render": function (data, type, full) {
                            if (data && data != "0000-00-00") {
                                var dateParts = data.split("-");
                                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                                var date = (jsDate.getMonth() + 1) + "/" + jsDate.getDate() + "/" + jsDate.getFullYear();
                                return date;
                            } else {
                                return "";
                            }
                        }
                    }
        ],

                "lengthMenu": [[10, 25, 50, 100, 250, 500, -1], [10, 25, 50, 100, 250, 500, "All"]],
                "paging": true,
                "ordering": true,
                "info": false,
                "drawCallback": function (settings) {
                    var api = this.api();
                    var columnsArray = api.columns().visible();
                    truthyColumnsArrayNumber = getTotalVisibleColumnsNumber(columnsArray);
                    var rows = api.rows({
                        page: 'current'
                    }).nodes();
                    var last = null;
                    api.column(12, {
                        page: 'current'
                    }).data().each(function (group, i) {

                        if (last !== group) {
                            var locationAddress = getLocationAddress(api, i);
                            var locationCity = getLocationCity(api, i);
                            var locationState = getLocationState(api, i);
                            $(rows).eq(i).before(
                                $compile('<tr class="table-group group"><td colspan=' + truthyColumnsArrayNumber +
                                    '><label class="inline" class="margin-0"><input class="locationCheckbox"  type="checkbox" name="locationCheckbox"> <label class="inline pointer" class="margin-0"><i class="fa fa-minus-square-o fa-lg"></i> <input ng-click="rowExpandCollapse($event)"   class="collapsed"  type="button"  name="collapsed"> &nbsp;</label>' + locationAddress + '-' + locationCity + ',' + locationState + " " + '[' + group + ']' + '</label></td></tr>')($scope));
                            last = group;
                        }
                    });
                }
            });
            
            
            $('.dataTables_length').find('select').addClass('input-xs');
            $('.dataTables_length').find('select').removeClass('input-sm');
            //$('.datepicker-dropdown').addClass('datepicker-z-index');

            // Handle click on "Select all" control
            angular.element('.checkAll').on('click', function () {
                var checkbox = this;
                $scope.dataTable.columns().visible();
                if (this.checked)
                    angular.element('#openOrders-actions').show();
                else angular.element('#openOrders-actions').hide();
                $('.group').each(function (i, obj) {
                    $(this).find('input[type="checkbox"]').prop('checked', checkbox.checked);
                })
            });

            $scope.$on('show-hide-column', function (event, columnIndex) {
                var column = $scope.dataTable.column(columnIndex);
                // Toggle the visibility
                column.visible(!column.visible());
            })
            $('#table_id').on("change", ".locationCheckbox", function (event) {

                if (!this.checked) {
                    if ($('.checkAll').prop('checked')) $('.checkAll').prop('checked', false);
                }

                // check if any of the checkbox is checked if yes then show action button
                $('.locationCheckbox').each(function (i, obj) {
                    if ($(this).prop('checked')) {
                        angular.element('#openOrders-actions').show();
                        return false;
                    } else {
                        angular.element('#openOrders-actions').hide();
                    }
                    console.log("actions3 " + $scope.actions);
                })
            });

            angular.element('th.isMonitored ').popover({
                html: true,
                container: 'body',
                trigger: 'hover',
                title: 'Monitoring Icons',
                content: '<img src="images/icon_monitoring_on.gif"> - Property is being monitored</br></br>' +
                    '<img src="images/alert_check.png" width="16" height="16"> - Recent alert has been reviewed as non-issue</br></br>' +
                    '<img src="images/icon_alert.png"> - New Alert - Not yet reviewed</br></br>' +
                    '<img src="images/stop.png" width="16" height="16"> - Recent alert has been reviewed as an issue</br></br>'
            });

            angular.element('.settings-button').popover({
                html: true,
                container: 'body',
                trigger: 'manual',
                title: 'Edit Column Settings',
                content: showContent(),
                template: '<div id="settings-popover" class="popover popover-large settings popover-min-width"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
            });

            $('.column-settings').click(function (e) {
                e.preventDefault();
                var tab = $(this).attr('data-tab');
                $('.settings-button').popover('show');

            });

        });
    }

    function showContent() {
        console.log("show content");
        var itemsTemplate = '<div class="container-fluid"><div class="row  margin-0">' +
            '<div class="col-md-4 col-xs-12" ng-repeat="item in dashboard.columns">' +
            '<div class="checkbox"><label>' +
            '<input ng-model="item.visible" class="column-settings-checkbox" columnindex = "{{item.index}}"' +
            'type="checkbox" ng-change="dashboard.hideshowColumns(item)"><img ng-src="{{item.image}}""></img> {{item.name | capitalize}} ' + '</div></label></div> </div><br/>' +
            '<div class="pull-right"><button close-popover class="btn btn-default btn-sm" ng-click="dashboard.closeSettingsPopup()">Close</button>' +
            '<button ng-click="dashboard.saveSettings();" class="btn btn-primary btn-sm left-margin">Save tab settings</button></div></div>';
        return $compile(itemsTemplate)($scope);
    }

    function getTotalVisibleColumnsNumber(columnsArray) {

        var truthyColumnsArray = [];

        for (var i = 0; i < columnsArray.length; i++) {
            if (columnsArray[i]) {
                truthyColumnsArray.push(columnsArray[i])
            }
        }
        
        return truthyColumnsArray.length;
    }

    function getLocationAddress(api, i) {
        var address = api.column(14, {
            page: 'current'
        }).data()[i];
        return address;
    }

    function getLocationCity(api, i) {
        var city = api.column(15, {
            page: 'current'
        }).data()[i];
        return city;
    }

    function getLocationState(api, i) {
        var state = api.column(17, {
            page: 'current'
        }).data()[i];
        return state;
    }

    this.saveSettings = function () {
        $scope.dataTable.state.save();
        this.alert = true;
        this.message = "Dashboad settings saved";
        $('.settings-button').popover('hide');
    }

    this.closeSettingsPopup = function () {
        $('.settings-button').popover('hide');
    }
    this.hideshowColumns = function (item) {
        this.name = item.name;      
        var column = $scope.dataTable.column(item.index);
        // Toggle the visibility
        $scope.hiddenColumnName = item.name;
        $scope.hiddenColumnIndex = item.index;
        column.visible(!column.visible());
    }

    $scope.rowExpandCollapse = function (e) {
        var parentRow = $(e.target).parents("tr:last");
        if (parentRow.next().hasClass("ng-hide")) {
            //expand all
            parentRow.find("input[name='collapsed']").prev().addClass('fa-minus-square-o fa-lg');
            parentRow.find("input[name='collapsed']").prev().removeClass('fa-plus-square-o');
            parentRow.nextUntil('.group').removeClass('ng-hide');
        } else {
            //collapse all
            parentRow.find("input[name='collapsed']").prev().addClass('fa-plus-square-o fa-lg');
            parentRow.find("input[name='collapsed']").prev().removeClass('fa-minus-square-o');
            parentRow.nextUntil('.group').addClass('ng-hide');
        }
    }


    this.settings = function () {
        this.columns = [];
        //this.columns = this.headers;
        for (i = 2; i < 7; i++) {
            if (i == 2 || i == 4 || i == 6) {
                this.obj = {};
                this.obj.image = $($scope.dataTable.column(i).header()).find('img').attr('src');
                this.obj.name = "";
                this.obj.index = i;
                this.obj.visible = $scope.dataTable.column(i).visible();
                this.columns.push(this.obj);
            }
        }
        for (i = 8; i < 27; i++) {

            this.obj = {};
            this.obj.image = "";
            this.obj.name = $scope.dataTable.column(i).header().innerText;
            this.obj.index = i;
            this.obj.visible = $scope.dataTable.column(i).visible();
            this.columns.push(this.obj);
        }
    }


    $scope.stopPropagation = function (evt) {
        if (evt.stopPropagation !== undefined) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }

    this.saveTableState = function () {
        $('#table_id').DataTable().state.save();
        this.alert = true;
        this.message = "Dashboard state saved";
    }

    this.clearTableState = function () {
        this.visibleLocalStorageCols = [];
        var localStorageJSON = localStorage.getItem('DataTables_table_id_/index.html');
        console.log("mnmnmn " + JSON.parse(localStorageJSON));
        angular.forEach(JSON.parse(localStorageJSON).columns, function (column, index) {
            if (column.visible) {
                console.log("sdvgfgv " + index);
                self.visibleLocalStorageCols.push(column);

            }
        });

        for (var i = 0; i < this.visibleLocalStorageCols.length; i++) {
            $('#table_id thead tr.filterrow th').eq(i).find('input').val("");
            $('#table_id').DataTable()
                .column(i + ':visible')
                .search("")
                .draw();
        }

        $('#table_id').DataTable().state.clear();

        this.alert = true;
        this.message = "Dashboard state settings erased";
    }

}]);;;;;angular.module('LenderPortal').directive('expandCurrentview', ['globalValues', function (globalValues) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            console.log("reached");
            elem.bind('click', function () {
                globalValues.dashBoardExpandAll = true;
                globalValues.dashBoardCollapseAll = false;
                var rowElemArray = angular.element('.group');

                $('.group').each(function (i, obj) {
                    if ($(this).next().hasClass("ng-hide")) {

                        $(this).nextUntil('.group').removeClass('ng-hide');
                    }
                })
                $("input[name='collapsed']").each(function (i, obj) {
                    $(this).prev().removeClass("fa-plus-square-o");
                    $(this).prev().addClass("fa-minus-square-o fa-lg");
                })
            })



        }
    }
}])

angular.module('LenderPortal').directive('collapseCurrentview', ['globalValues', '$timeout', function (globalValues, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            console.log("reached");
            elem.bind('click', function () {
                globalValues.dashBoardCollapseAll = true;
                globalValues.dashBoardExpandAll = false;
                var rowElemArray = angular.element('.group');

                $('.group').each(function (i, obj) {
                    if (!$(this).next().hasClass("ng-hide")) {

                        $(this).nextUntil('.group').addClass('ng-hide');
                    }
                })
                $("input[name='collapsed']").each(function (i, obj) {
                    $(this).prev().addClass("fa-plus-square-o fa-lg");
                    $(this).prev().removeClass("fa-minus-square-o");
                })
            })

            scope.$on('collapse-after-length-change', function () {
                var rowElemArrayLength = angular.element('.group').length;
                var rowElemArray = angular.element('.group');

                $timeout(function () {
                    $('.group').each(function (i, obj) {
                        if (i == rowElemArrayLength - 1) {
                            $(this).nextUntil('.group').addClass('ng-hide');
                        }
                        if (!$(this).next().hasClass("ng-hide")) {

                            $(this).nextUntil('.group').addClass('ng-hide');
                        }
                    })
                    $("input[name='collapsed']").each(function (i, obj) {
                        $(this).prev().addClass("fa-plus-square-o fa-lg");
                        $(this).prev().removeClass("fa-minus-square-o");
                    })
                }, 1000);

            })

        }


    }
}])

angular.module('LenderPortal').directive('closePopover', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            elem.bind('click', function () {
                console.log("reached funnction");
                $('.column-settings').popover('hide');
            })

        }
    }
}])

angular.module('LenderPortal').directive('hideShowColumns', [function () {
    return {
        restrict: 'A',
        scope: {
            columnindex: '@'
        },
        link: function (scope, elem, attr) {
            elem.bind('click', function () {


                if ($(this).prop('checked')) {
                    scope.$emit('show-hide-column', scope.columnindex);
                    console.log("checked " + scope.columnindex);
                } else {
                    scope.$emit('show-hide-column', scope.columnindex);
                    console.log(" not checked " + scope.columnindex);
                }




            })
        }
    }
}])

angular.module('LenderPortal').directive('openHideshowpopover', ['$compile', '$timeout', function ($compile, $timeout) {

    var itemsTemplate = '<div class="row">' +
        '<div class="col-md-6 col-xs-12" ng-repeat="item in items">' +
        '<input ng-model="item.default"  columnindex = "{{item.index}}"' +
        'type="checkbox"></input> {{item.name}}  </div> </div>' +
        '<div><button close-popover class="btn-sm btn">Close</button>' +
        '<button save-settings class="btn-sm btn btn-default">Save tab settings</button></div>'

    var getTemplate = function (contentType) {
        var template = '';
        switch (contentType) {
            case 'items':
                template = itemsTemplate;
                break;
        }
        return template;
    }
    return {
        restrict: 'A',
        transclude: true,
        template: "<span ng-transclude></span>",
        scope: {
            items: '=',
            title: '@'
        },
        link: function (scope, elem, attr) {
            elem.bind('click', function (e) {
                e.stopPropagation();
                $timeout(function () {
                    var popOverContent;
                    if (scope.items) {
                        var html = getTemplate("items");
                        popOverContent = $compile(html)(scope);
                    }
                    var options = {
                        content: popOverContent,
                        placement: "right",
                        html: true,
                        title: scope.title,
                        container: 'body'
                    };

                    $(elem).popover(options);
                }, 5000);

            })


        }
    }
}])


angular.module('LenderPortal').directive('textChange', ['DashboardFactory', function (DashboardFactory) {
    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            if (attr.textChange == "date") {                       
                elem.datepicker({
                        format: "m/d/yyyy",
                        autoclose: true,
                        clearBtn: true,
                        orientation: 'auto'
                    }).change(dateChanged)
                    .on('changeDate', dateChanged);

                function dateChanged(ev) {
                    scope.operator = $(this).next().children().first().text().trim();
                    scope.dateValue = $(this).val();
                    scope.dateFilterRangeSearch = true;
                    var headerIndex = $(this).parents('th').index();
                    var headerText =  $('#table_id .dataTableRow th').eq(headerIndex).text();                    
                    scope.columnIndex =  scope.dataTable.column(headerText + ':name').index();
                    scope.dataTable.draw();
                    scope.dataTable.state.save();
                }
            }



            elem.bind('keyup change', function () {
                if ($(this).attr("type") == "text" && attr.textChange != "date") {
                   scope.dateFilterRangeSearch = false;
                    scope.dataTable
                        .column($(this).parents('th').index() + ':visible')
                        .search(this.value)
                        .draw();
                    scope.dataTable.state.save();
                }
            })
        }
    }
}])


angular.module('LenderPortal').directive('onFinishRenderRow', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('fillDatatable');
                })
            }
        }
    }
}])

angular.module('LenderPortal').
filter('capitalize', function () {
    return function (input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
});

angular.module('LenderPortal').
directive('datefilterCondition', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {            
            elem.bind('click', function () {
               scope.operator = attr.datefilterCondition;
                if (scope.operator == "=") {                   
                    var html = '= <span class="caret"></span>';                  
                }
                if (scope.operator == "<") {                  
                    var html = '< <span class="caret"></span>';                               
                }
                if (scope.operator == ">") {                                       
                    var html = '> <span class="caret"></span>';                                    
                }
                scope.dateValue = $(this).parent().parent().parent().parent().find('input').val();
                scope.dateFilterRangeSearch = true;
                var headerIndex = $(this).parents('th').index();
                    var headerText =  $('#table_id .dataTableRow th').eq(headerIndex).text();                  
                    scope.columnIndex =  scope.dataTable.column(headerText + ':name').index();
                    scope.dataTable.draw();            
                $(this).parents('.input-group').find('.dropdown-toggle')
                    .html(html);           
                scope.dataTable.state.save();
            })
        }
    }
}]);;angular.module('LenderPortal').factory(
    'DashboardFactory', ['$http', 'dashboardUrls','$log','dashboardResources',
        function($http, dashboardUrls, $log , dashboardResources) {

    	var obj = {
    		"sEcho": 7,
    		"iTotalRecords": 252,
    		"iTotalDisplayRecords": 252,
    		"data": [{
    			"loanId": 546740,
    			"locationId": 1028094,
    			"cabinetId": 293935,
    			"pSiteID": null,
    			"locationServiceId": 289845,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 1116558,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "101 Merrit 7",
    			"locationState": "CT",
    			"cabinet": "Ben Test Cabinet",
    			"locationZip": "06851",
    			"locationCity": "Norwalk",
    			"locationCounty": "Fairfield County",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2015-07-16",
    			"createdTimeStamp": "1437053188",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 0,
    			"createdBy": "Ben Larkin",
    			"orderedBy": "Ben Larkin",
    			"orderedDate": "2015-07-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 546740,
    			"locationId": 1028094,
    			"cabinetId": 293935,
    			"pSiteID": null,
    			"locationServiceId": 289846,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 1116558,
    			"siteType": "ERR",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "101 Merrit 7",
    			"locationState": "CT",
    			"cabinet": "Ben Test Cabinet",
    			"locationZip": "06851",
    			"locationCity": "Norwalk",
    			"locationCounty": "Fairfield County",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2015-07-16",
    			"createdTimeStamp": "1437053188",
    			"service": "ERR",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 0,
    			"createdBy": "Ben Larkin",
    			"orderedBy": "Ben Larkin",
    			"orderedDate": "2015-07-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 499522,
    			"locationId": 959516,
    			"cabinetId": 247297,
    			"pSiteID": null,
    			"locationServiceId": 222495,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 1040236,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "325 Boston Post rd ",
    			"locationState": "CT",
    			"cabinet": "Tom Adams Project",
    			"locationZip": "06477",
    			"locationCity": "ORANGE",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2015-03-09",
    			"createdTimeStamp": "1425931428",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 1,
    			"createdBy": "Michael Bruni",
    			"orderedBy": "Michael Bruni",
    			"orderedDate": "2015-03-09",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 499522,
    			"locationId": 959516,
    			"cabinetId": 247297,
    			"pSiteID": null,
    			"locationServiceId": 222524,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 1040236,
    			"siteType": "ERR",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "325 Boston Post rd ",
    			"locationState": "CT",
    			"cabinet": "Tom Adams Project",
    			"locationZip": "06477",
    			"locationCity": "ORANGE",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2015-03-09",
    			"createdTimeStamp": "1425931428",
    			"service": "ERR",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 0,
    			"createdBy": "Michael Bruni",
    			"orderedBy": "Michael Bruni",
    			"orderedDate": "2015-03-09",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 441310,
    			"locationId": 881127,
    			"cabinetId": 247297,
    			"pSiteID": null,
    			"locationServiceId": 148508,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 955814,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "6 Armstrong Rd",
    			"locationState": "CT",
    			"cabinet": "Tom Adams Project",
    			"locationZip": "06484",
    			"locationCity": "Shelton",
    			"locationCounty": "Fairfield",
    			"applicationNumber": "",
    			"borrower": "Andrew Alton LLC",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-09-25",
    			"createdTimeStamp": "1411652473",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 1,
    			"createdBy": "Tom Adams",
    			"orderedBy": "Tom Adams",
    			"orderedDate": "2014-09-25",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 441310,
    			"locationId": 881127,
    			"cabinetId": 247297,
    			"pSiteID": null,
    			"locationServiceId": 189924,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 955814,
    			"siteType": "ERR",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "6 Armstrong Rd",
    			"locationState": "CT",
    			"cabinet": "Tom Adams Project",
    			"locationZip": "06484",
    			"locationCity": "Shelton",
    			"locationCounty": "Fairfield",
    			"applicationNumber": "",
    			"borrower": "Andrew Alton LLC",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-09-25",
    			"createdTimeStamp": "1411652473",
    			"service": "ERR",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 0,
    			"createdBy": "Tom Adams",
    			"orderedBy": "Jay Maltas",
    			"orderedDate": "2015-01-06",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 391734,
    			"locationId": 799746,
    			"cabinetId": 177679,
    			"pSiteID": null,
    			"locationServiceId": 99327,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 869197,
    			"siteType": "Appraisal",
    			"statusDate": "2014-06-05 18:15:52",
    			"locationName": "Valley Lanes",
    			"locationAddress": "East 8005 Sprague Ave",
    			"locationState": "WA",
    			"cabinet": " C MICHAEL MCGRATH",
    			"locationZip": "99212",
    			"locationCity": "Spokane",
    			"locationCounty": "Spokane County",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-06-05",
    			"createdTimeStamp": "1401992152",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 391734,
    			"locationId": 799746,
    			"cabinetId": 177679,
    			"pSiteID": null,
    			"locationServiceId": 99328,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 869197,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2014-06-05 18:15:52",
    			"locationName": "Valley Lanes",
    			"locationAddress": "East 8005 Sprague Ave",
    			"locationState": "WA",
    			"cabinet": " C MICHAEL MCGRATH",
    			"locationZip": "99212",
    			"locationCity": "Spokane",
    			"locationCounty": "Spokane County",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-06-05",
    			"createdTimeStamp": "1401992152",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 391731,
    			"locationId": 799743,
    			"cabinetId": 177679,
    			"pSiteID": null,
    			"locationServiceId": 99322,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 869193,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2014-06-05 18:13:50",
    			"locationName": "East Bowl",
    			"locationAddress": "12828 E Sprague Ave",
    			"locationState": "WA",
    			"cabinet": " C MICHAEL MCGRATH",
    			"locationZip": "99216",
    			"locationCity": "Spokane",
    			"locationCounty": "Spokane County",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-06-05",
    			"createdTimeStamp": "1401992030",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 391731,
    			"locationId": 799743,
    			"cabinetId": 177679,
    			"pSiteID": null,
    			"locationServiceId": 99321,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 869193,
    			"siteType": "Appraisal",
    			"statusDate": "2014-06-05 18:13:50",
    			"locationName": "East Bowl",
    			"locationAddress": "12828 E Sprague Ave",
    			"locationState": "WA",
    			"cabinet": " C MICHAEL MCGRATH",
    			"locationZip": "99216",
    			"locationCity": "Spokane",
    			"locationCounty": "Spokane County",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-06-05",
    			"createdTimeStamp": "1401992030",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 110622,
    			"locationId": 770953,
    			"cabinetId": 180290,
    			"pSiteID": null,
    			"locationServiceId": 79854,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 838685,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "test",
    			"locationAddress": "6 Rogers Rd",
    			"locationState": "MA",
    			"cabinet": "prod cab 20130815",
    			"locationZip": "02420",
    			"locationCity": "Lexington",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "app number",
    			"borrower": "borrower",
    			"loanNumber": "loan number",
    			"refNumber": "loan number",
    			"creationDate": "2014-04-23",
    			"createdTimeStamp": "1398262882",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 4,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": "Kevin Kozarrr",
    			"orderedDate": "2014-04-23",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 99051,
    			"locationId": 753076,
    			"cabinetId": 218980,
    			"pSiteID": null,
    			"locationServiceId": 68975,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 820085,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "4 Davis Farm Rd",
    			"locationState": "CT",
    			"cabinet": "flood testing",
    			"locationZip": "06413",
    			"locationCity": "Clinton",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-03-28",
    			"createdTimeStamp": "1396014373",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 1,
    			"createdBy": "Ryan Marcell",
    			"orderedBy": "Ryan Marcell",
    			"orderedDate": "2014-03-28",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 92397,
    			"locationId": 742908,
    			"cabinetId": 216388,
    			"pSiteID": null,
    			"locationServiceId": 62262,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 809270,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "108 West Main St",
    			"locationState": "CT",
    			"cabinet": "ryan-m",
    			"locationZip": "06413",
    			"locationCity": "Clinton",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-03-11",
    			"createdTimeStamp": "1394559434",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 1,
    			"createdBy": "Ryan Marcell",
    			"orderedBy": "Ryan Marcell",
    			"orderedDate": "2014-03-11",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 88718,
    			"locationId": 736866,
    			"cabinetId": 214818,
    			"pSiteID": null,
    			"locationServiceId": 57491,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 802004,
    			"siteType": "PhaseI",
    			"statusDate": "2014-02-27 14:38:34",
    			"locationName": "SunTrust Building",
    			"locationAddress": "303 Peachtree St",
    			"locationState": "GA",
    			"cabinet": "NorthMarq",
    			"locationZip": "30308",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton County",
    			"applicationNumber": "9999999",
    			"borrower": "Jim Bartlett",
    			"loanNumber": "0000000",
    			"refNumber": "0000000",
    			"creationDate": "2014-02-27",
    			"createdTimeStamp": "1393511914",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 88718,
    			"locationId": 736866,
    			"cabinetId": 214818,
    			"pSiteID": null,
    			"locationServiceId": 57490,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 802004,
    			"siteType": "Appraisal",
    			"statusDate": "2014-02-27 14:38:34",
    			"locationName": "SunTrust Building",
    			"locationAddress": "303 Peachtree St",
    			"locationState": "GA",
    			"cabinet": "NorthMarq",
    			"locationZip": "30308",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton County",
    			"applicationNumber": "9999999",
    			"borrower": "Jim Bartlett",
    			"loanNumber": "0000000",
    			"refNumber": "0000000",
    			"creationDate": "2014-02-27",
    			"createdTimeStamp": "1393511914",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 88718,
    			"locationId": 736866,
    			"cabinetId": 214818,
    			"pSiteID": null,
    			"locationServiceId": 57495,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 802004,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "SunTrust Building",
    			"locationAddress": "303 Peachtree St",
    			"locationState": "GA",
    			"cabinet": "NorthMarq",
    			"locationZip": "30308",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton County",
    			"applicationNumber": "9999999",
    			"borrower": "Jim Bartlett",
    			"loanNumber": "0000000",
    			"refNumber": "0000000",
    			"creationDate": "2014-02-27",
    			"createdTimeStamp": "1393511914",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 1,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": "Jeff Doerner",
    			"orderedDate": "2014-02-27",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 88718,
    			"locationId": 736866,
    			"cabinetId": 214818,
    			"pSiteID": null,
    			"locationServiceId": 57492,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 802004,
    			"siteType": "ASTMPCA",
    			"statusDate": "2014-02-27 14:38:34",
    			"locationName": "SunTrust Building",
    			"locationAddress": "303 Peachtree St",
    			"locationState": "GA",
    			"cabinet": "NorthMarq",
    			"locationZip": "30308",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton County",
    			"applicationNumber": "9999999",
    			"borrower": "Jim Bartlett",
    			"loanNumber": "0000000",
    			"refNumber": "0000000",
    			"creationDate": "2014-02-27",
    			"createdTimeStamp": "1393511914",
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Jeff Doerner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 87852,
    			"locationId": 735668,
    			"cabinetId": 214434,
    			"pSiteID": null,
    			"locationServiceId": 56334,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 800733,
    			"siteType": "PhaseI",
    			"statusDate": "2014-02-25 13:35:03",
    			"locationName": "",
    			"locationAddress": "28 Cherry Street",
    			"locationState": "CT",
    			"cabinet": "Lauren's Demo Cabinet",
    			"locationZip": "06460",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-02-25",
    			"createdTimeStamp": "1393335303",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Lauren Carlucci",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 87852,
    			"locationId": 735668,
    			"cabinetId": 214434,
    			"pSiteID": null,
    			"locationServiceId": 56332,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 800733,
    			"siteType": "Appraisal",
    			"statusDate": "2014-02-25 13:35:03",
    			"locationName": "",
    			"locationAddress": "28 Cherry Street",
    			"locationState": "CT",
    			"cabinet": "Lauren's Demo Cabinet",
    			"locationZip": "06460",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-02-25",
    			"createdTimeStamp": "1393335303",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Lauren Carlucci",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 87852,
    			"locationId": 735668,
    			"cabinetId": 214434,
    			"pSiteID": null,
    			"locationServiceId": 56335,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 800733,
    			"siteType": "EnvScreen",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "28 Cherry Street",
    			"locationState": "CT",
    			"cabinet": "Lauren's Demo Cabinet",
    			"locationZip": "06460",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-02-25",
    			"createdTimeStamp": "1393335303",
    			"service": "EnvScreen",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "Active",
    			"isMonitored": 0,
    			"createdBy": "Lauren Carlucci",
    			"orderedBy": "Lauren Carlucci",
    			"orderedDate": "2014-02-25",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 87852,
    			"locationId": 735668,
    			"cabinetId": 214434,
    			"pSiteID": null,
    			"locationServiceId": 56333,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 800733,
    			"siteType": "AppraisalRev",
    			"statusDate": "2014-02-25 13:35:03",
    			"locationName": "",
    			"locationAddress": "28 Cherry Street",
    			"locationState": "CT",
    			"cabinet": "Lauren's Demo Cabinet",
    			"locationZip": "06460",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2014-02-25",
    			"createdTimeStamp": "1393335303",
    			"service": "Commercial Appraisal Review",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Lauren Carlucci",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 40283,
    			"locationId": 614536,
    			"cabinetId": 182123,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 674778,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "108 West Main st",
    			"locationState": "CT",
    			"cabinet": "ryan ",
    			"locationZip": "06413",
    			"locationCity": "clinton",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-08-23",
    			"createdTimeStamp": "1377278084",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": "Ryan Marcell",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 26774,
    			"locationId": 551573,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 12833,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 610125,
    			"siteType": "PhaseI",
    			"statusDate": "2013-06-26 19:14:44",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-06-26",
    			"createdTimeStamp": "1372274084",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Mike Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 26774,
    			"locationId": 551573,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 12834,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 610125,
    			"siteType": "Appraisal",
    			"statusDate": "2013-06-26 19:14:44",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-06-26",
    			"createdTimeStamp": "1372274084",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Mike Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 10646,
    			"locationId": 465504,
    			"cabinetId": 146163,
    			"pSiteID": null,
    			"locationServiceId": 4849,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 521189,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-04-02 14:18:10",
    			"locationName": "test 101",
    			"locationAddress": "800 W. Cummings Park",
    			"locationState": "MA",
    			"cabinet": "resident-tests",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "test 101",
    			"borrower": "test 101",
    			"loanNumber": "test 101",
    			"refNumber": "test 101",
    			"creationDate": "2013-04-02",
    			"createdTimeStamp": "1364912291",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 10646,
    			"locationId": 465504,
    			"cabinetId": 146163,
    			"pSiteID": null,
    			"locationServiceId": 4848,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 521189,
    			"siteType": "Appraisal",
    			"statusDate": "2013-04-02 14:18:10",
    			"locationName": "test 101",
    			"locationAddress": "800 W. Cummings Park",
    			"locationState": "MA",
    			"cabinet": "resident-tests",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "test 101",
    			"borrower": "test 101",
    			"loanNumber": "test 101",
    			"refNumber": "test 101",
    			"creationDate": "2013-04-02",
    			"createdTimeStamp": "1364912291",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 10650,
    			"locationId": 465510,
    			"cabinetId": 146163,
    			"pSiteID": null,
    			"locationServiceId": 4852,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 521193,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-04-02 14:21:06",
    			"locationName": "test 102",
    			"locationAddress": "6 Rogers Rd",
    			"locationState": "MA",
    			"cabinet": "resident-tests",
    			"locationZip": "02420",
    			"locationCity": "Lexington",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "test 102",
    			"borrower": "test 102",
    			"loanNumber": "test 102",
    			"refNumber": "test 102",
    			"creationDate": "2013-04-02",
    			"createdTimeStamp": "1364912466",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 10650,
    			"locationId": 465510,
    			"cabinetId": 146163,
    			"pSiteID": null,
    			"locationServiceId": 4851,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 521193,
    			"siteType": "Appraisal",
    			"statusDate": "2013-04-02 14:21:06",
    			"locationName": "test 102",
    			"locationAddress": "6 Rogers Rd",
    			"locationState": "MA",
    			"cabinet": "resident-tests",
    			"locationZip": "02420",
    			"locationCity": "Lexington",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "test 102",
    			"borrower": "test 102",
    			"loanNumber": "test 102",
    			"refNumber": "test 102",
    			"creationDate": "2013-04-02",
    			"createdTimeStamp": "1364912466",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 10655,
    			"locationId": 465519,
    			"cabinetId": 146163,
    			"pSiteID": null,
    			"locationServiceId": 4856,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 521202,
    			"siteType": "PhaseI",
    			"statusDate": "2013-04-02 14:29:09",
    			"locationName": "test 103",
    			"locationAddress": "12 Harding Ave",
    			"locationState": "MA",
    			"cabinet": "resident-tests",
    			"locationZip": "02453",
    			"locationCity": "Waltham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "test 103",
    			"borrower": "test 103",
    			"loanNumber": "test 103",
    			"refNumber": "test 103",
    			"creationDate": "2013-04-02",
    			"createdTimeStamp": "1364912950",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 10655,
    			"locationId": 465519,
    			"cabinetId": 146163,
    			"pSiteID": null,
    			"locationServiceId": 4855,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 521202,
    			"siteType": "AppraisalRev",
    			"statusDate": "2013-04-02 14:29:09",
    			"locationName": "test 103",
    			"locationAddress": "12 Harding Ave",
    			"locationState": "MA",
    			"cabinet": "resident-tests",
    			"locationZip": "02453",
    			"locationCity": "Waltham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "test 103",
    			"borrower": "test 103",
    			"loanNumber": "test 103",
    			"refNumber": "test 103",
    			"creationDate": "2013-04-02",
    			"createdTimeStamp": "1364912950",
    			"service": "Commercial Appraisal Review",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 10655,
    			"locationId": 465519,
    			"cabinetId": 146163,
    			"pSiteID": null,
    			"locationServiceId": 4854,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 521202,
    			"siteType": "Appraisal",
    			"statusDate": "2013-04-02 14:29:09",
    			"locationName": "test 103",
    			"locationAddress": "12 Harding Ave",
    			"locationState": "MA",
    			"cabinet": "resident-tests",
    			"locationZip": "02453",
    			"locationCity": "Waltham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "test 103",
    			"borrower": "test 103",
    			"loanNumber": "test 103",
    			"refNumber": "test 103",
    			"creationDate": "2013-04-02",
    			"createdTimeStamp": "1364912950",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Kevin Kozarrr",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 9254,
    			"locationId": 455429,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 4129,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 510937,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-03-21 17:18:11",
    			"locationName": "",
    			"locationAddress": "325 Boston Post Rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06477",
    			"locationCity": "Orange",
    			"locationCounty": "New Haven",
    			"applicationNumber": "1545",
    			"borrower": "Joe",
    			"loanNumber": "516416",
    			"refNumber": "516416",
    			"creationDate": "2013-03-21",
    			"createdTimeStamp": "1363886291",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 9254,
    			"locationId": 455429,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 4128,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 510937,
    			"siteType": "Appraisal",
    			"statusDate": "2013-03-21 17:18:11",
    			"locationName": "",
    			"locationAddress": "325 Boston Post Rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06477",
    			"locationCity": "Orange",
    			"locationCounty": "New Haven",
    			"applicationNumber": "1545",
    			"borrower": "Joe",
    			"loanNumber": "516416",
    			"refNumber": "516416",
    			"creationDate": "2013-03-21",
    			"createdTimeStamp": "1363886291",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 8828,
    			"locationId": 453907,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 3898,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 509313,
    			"siteType": "Appraisal",
    			"statusDate": "2013-03-19 15:07:53",
    			"locationName": "",
    			"locationAddress": "325 Boston Post Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06477",
    			"locationCity": "Orange",
    			"locationCounty": "New Haven",
    			"applicationNumber": "21454",
    			"borrower": "Benz",
    			"loanNumber": "24210",
    			"refNumber": "24210",
    			"creationDate": "2013-03-19",
    			"createdTimeStamp": "1363705673",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 8828,
    			"locationId": 453907,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 3899,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 509313,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-03-19 15:07:53",
    			"locationName": "",
    			"locationAddress": "325 Boston Post Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06477",
    			"locationCity": "Orange",
    			"locationCounty": "New Haven",
    			"applicationNumber": "21454",
    			"borrower": "Benz",
    			"loanNumber": "24210",
    			"refNumber": "24210",
    			"creationDate": "2013-03-19",
    			"createdTimeStamp": "1363705673",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 8832,
    			"locationId": 453913,
    			"cabinetId": 143279,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 509320,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Rd",
    			"locationState": "CT",
    			"cabinet": "FNB",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-03-19",
    			"createdTimeStamp": "1363706721",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": "Nathan Sorensen",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7620,
    			"locationId": 442169,
    			"cabinetId": 140380,
    			"pSiteID": null,
    			"locationServiceId": 3341,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 497421,
    			"siteType": "PhaseI",
    			"statusDate": "2013-03-11 18:27:10",
    			"locationName": "",
    			"locationAddress": "55 Fruit Street",
    			"locationState": "MA",
    			"cabinet": "Conner Cabinet",
    			"locationZip": "02114",
    			"locationCity": "Boston",
    			"locationCounty": "Suffolk",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-03-11",
    			"createdTimeStamp": "1363026431",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Nancy Conner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7648,
    			"locationId": 442219,
    			"cabinetId": 140407,
    			"pSiteID": null,
    			"locationServiceId": 3360,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 497473,
    			"siteType": "Appraisal",
    			"statusDate": "2013-03-11 19:39:37",
    			"locationName": "Randalls Fuel Station",
    			"locationAddress": "12220 Barker Cypress Rd",
    			"locationState": "TX",
    			"cabinet": "SOR Training",
    			"locationZip": "77429",
    			"locationCity": "Cypress",
    			"locationCounty": "Harris",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-03-11",
    			"createdTimeStamp": "1363030783",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Nathan Sorensen",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7648,
    			"locationId": 442219,
    			"cabinetId": 140407,
    			"pSiteID": null,
    			"locationServiceId": 3362,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 497473,
    			"siteType": "PhaseI",
    			"statusDate": "2013-03-11 19:39:37",
    			"locationName": "Randalls Fuel Station",
    			"locationAddress": "12220 Barker Cypress Rd",
    			"locationState": "TX",
    			"cabinet": "SOR Training",
    			"locationZip": "77429",
    			"locationCity": "Cypress",
    			"locationCounty": "Harris",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-03-11",
    			"createdTimeStamp": "1363030783",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Nathan Sorensen",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7648,
    			"locationId": 442219,
    			"cabinetId": 140407,
    			"pSiteID": null,
    			"locationServiceId": 3361,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 497473,
    			"siteType": "AppraisalRev",
    			"statusDate": "2013-03-11 19:39:37",
    			"locationName": "Randalls Fuel Station",
    			"locationAddress": "12220 Barker Cypress Rd",
    			"locationState": "TX",
    			"cabinet": "SOR Training",
    			"locationZip": "77429",
    			"locationCity": "Cypress",
    			"locationCounty": "Harris",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-03-11",
    			"createdTimeStamp": "1363030783",
    			"service": "Commercial Appraisal Review",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Nathan Sorensen",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7620,
    			"locationId": 442169,
    			"cabinetId": 140380,
    			"pSiteID": null,
    			"locationServiceId": 3342,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 497421,
    			"siteType": "ASTMPCA",
    			"statusDate": "2013-03-11 18:27:10",
    			"locationName": "",
    			"locationAddress": "55 Fruit Street",
    			"locationState": "MA",
    			"cabinet": "Conner Cabinet",
    			"locationZip": "02114",
    			"locationCity": "Boston",
    			"locationCounty": "Suffolk",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-03-11",
    			"createdTimeStamp": "1363026431",
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Nancy Conner",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6904,
    			"locationId": 437035,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2946,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 492191,
    			"siteType": "Appraisal",
    			"statusDate": "2013-03-04 19:37:06",
    			"locationName": "",
    			"locationAddress": "440 Wheeler's Farm Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-03-04",
    			"createdTimeStamp": "1362425827",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6632,
    			"locationId": 432186,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2852,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 487297,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-28 20:09:00",
    			"locationName": "",
    			"locationAddress": "146 S. Bridge Street",
    			"locationState": "OR",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "97378",
    			"locationCity": "Sheridan ",
    			"locationCounty": "Yamhill",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-28",
    			"createdTimeStamp": "1362082140",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6498,
    			"locationId": 431807,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2788,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 486895,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-27 21:40:39",
    			"locationName": "",
    			"locationAddress": "382 Rio Communities Blvd ",
    			"locationState": "NM",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "87002",
    			"locationCity": "Belen",
    			"locationCounty": "Valencia",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-27",
    			"createdTimeStamp": "1362001240",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6057,
    			"locationId": 425380,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2599,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 480325,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-25 16:05:50",
    			"locationName": "",
    			"locationAddress": "440 Wheeler Farm's Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-25",
    			"createdTimeStamp": "1361808350",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6060,
    			"locationId": 425384,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2601,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 480329,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-25 16:14:31",
    			"locationName": "",
    			"locationAddress": "325 Post Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06477",
    			"locationCity": "Orange",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-25",
    			"createdTimeStamp": "1361808871",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6145,
    			"locationId": 425527,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2632,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 480487,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-25 21:02:21",
    			"locationName": "",
    			"locationAddress": "3426 Verdugo Road",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "90065",
    			"locationCity": "Los Angeles",
    			"locationCounty": "Los Angeles",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-25",
    			"createdTimeStamp": "1361826141",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6006,
    			"locationId": 423359,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2588,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 478302,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-22 22:11:16",
    			"locationName": "",
    			"locationAddress": "1219 St. Joseph St",
    			"locationState": "SD",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "57701",
    			"locationCity": "Rapid City ",
    			"locationCounty": "Pennington",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-22",
    			"createdTimeStamp": "1361571077",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5964,
    			"locationId": 423281,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2557,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 478219,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-22 19:51:40",
    			"locationName": "",
    			"locationAddress": "6821 North Country Homes Blvd",
    			"locationState": "WA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "99208",
    			"locationCity": "Spokane, ",
    			"locationCounty": "Spokane",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-22",
    			"createdTimeStamp": "1361562700",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5993,
    			"locationId": 423327,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2581,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 478268,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-22 21:13:27",
    			"locationName": "",
    			"locationAddress": "1903 21st Street",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "95811",
    			"locationCity": "Sacramento",
    			"locationCounty": "Sacramento",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-22",
    			"createdTimeStamp": "1361567607",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5963,
    			"locationId": 423280,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2556,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 478218,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-22 19:49:20",
    			"locationName": "",
    			"locationAddress": "1104 W. 7th Ave.",
    			"locationState": "WA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "99204",
    			"locationCity": "Spokane",
    			"locationCounty": "Spokane",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-22",
    			"createdTimeStamp": "1361562560",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 6004,
    			"locationId": 423357,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 478299,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "1401 5th street",
    			"locationState": "SD",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "57701",
    			"locationCity": "Rapid City",
    			"locationCounty": "Pennington",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-22",
    			"createdTimeStamp": "1361570674",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": "Joe Benz",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5690,
    			"locationId": 422396,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2450,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 477300,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-21 15:50:30",
    			"locationName": "",
    			"locationAddress": "10611 Slater Ave NE",
    			"locationState": "WA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "98033",
    			"locationCity": "Kirkland",
    			"locationCounty": "King",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-21",
    			"createdTimeStamp": "1361461830",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5812,
    			"locationId": 422588,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2496,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 477503,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-21 20:41:39",
    			"locationName": "",
    			"locationAddress": "26372 Deere",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "92562",
    			"locationCity": "Murrieta",
    			"locationCounty": "Riverside",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-21",
    			"createdTimeStamp": "1361479308",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5820,
    			"locationId": 422599,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2499,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 477514,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-21 20:53:38",
    			"locationName": "",
    			"locationAddress": "26371 Beckman Court",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "92562",
    			"locationCity": "Murrieta",
    			"locationCounty": "Riverside",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-21",
    			"createdTimeStamp": "1361480018",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5590,
    			"locationId": 421478,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2376,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476374,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-20 20:13:23",
    			"locationName": "",
    			"locationAddress": "795 South 2nd ",
    			"locationState": "OR",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "97446",
    			"locationCity": "harrisburg ",
    			"locationCounty": "Linn",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361391204",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5619,
    			"locationId": 421542,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2418,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476440,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-20 21:12:46",
    			"locationName": "",
    			"locationAddress": "1117 Second Street ",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "90266",
    			"locationCity": "Manhattan Beach",
    			"locationCounty": "Los Angeles",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361394766",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5590,
    			"locationId": 421478,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2378,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476374,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-20 20:13:23",
    			"locationName": "",
    			"locationAddress": "795 South 2nd ",
    			"locationState": "OR",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "97446",
    			"locationCity": "harrisburg ",
    			"locationCounty": "Linn",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361391204",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5620,
    			"locationId": 421543,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2422,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476441,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-20 21:14:18",
    			"locationName": "",
    			"locationAddress": "248 North Lake Ave",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "91101",
    			"locationCity": "Pasadena ",
    			"locationCounty": "Los Angeles",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361394858",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5590,
    			"locationId": 421478,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2377,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476374,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-20 20:13:23",
    			"locationName": "",
    			"locationAddress": "795 South 2nd ",
    			"locationState": "OR",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "97446",
    			"locationCity": "harrisburg ",
    			"locationCounty": "Linn",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361391204",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5620,
    			"locationId": 421543,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2421,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476441,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-20 21:14:18",
    			"locationName": "",
    			"locationAddress": "248 North Lake Ave",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "91101",
    			"locationCity": "Pasadena ",
    			"locationCounty": "Los Angeles",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361394858",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5601,
    			"locationId": 421503,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2379,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476400,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-20 20:38:51",
    			"locationName": "",
    			"locationAddress": "1401 5th street",
    			"locationState": "SD",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "57701",
    			"locationCity": "Rapid City",
    			"locationCounty": "Pennington",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361392732",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5620,
    			"locationId": 421543,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2423,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476441,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-20 21:14:18",
    			"locationName": "",
    			"locationAddress": "248 North Lake Ave",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "91101",
    			"locationCity": "Pasadena ",
    			"locationCounty": "Los Angeles",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361394858",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5601,
    			"locationId": 421503,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2381,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476400,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-20 20:38:51",
    			"locationName": "",
    			"locationAddress": "1401 5th street",
    			"locationState": "SD",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "57701",
    			"locationCity": "Rapid City",
    			"locationCounty": "Pennington",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361392732",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5555,
    			"locationId": 421410,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2363,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476303,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-20 17:26:21",
    			"locationName": "",
    			"locationAddress": "205 E BRINKER DR",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85323",
    			"locationCity": "avondale",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361381181",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5601,
    			"locationId": 421503,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2380,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476400,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-20 20:38:51",
    			"locationName": "",
    			"locationAddress": "1401 5th street",
    			"locationState": "SD",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "57701",
    			"locationCity": "Rapid City",
    			"locationCounty": "Pennington",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361392732",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5555,
    			"locationId": 421410,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2362,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476303,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-20 17:26:21",
    			"locationName": "",
    			"locationAddress": "205 E BRINKER DR",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85323",
    			"locationCity": "avondale",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361381181",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5619,
    			"locationId": 421542,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2420,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476440,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-20 21:12:46",
    			"locationName": "",
    			"locationAddress": "1117 Second Street ",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "90266",
    			"locationCity": "Manhattan Beach",
    			"locationCounty": "Los Angeles",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361394766",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5555,
    			"locationId": 421410,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2364,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476303,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-20 17:26:21",
    			"locationName": "",
    			"locationAddress": "205 E BRINKER DR",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85323",
    			"locationCity": "avondale",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361381181",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5619,
    			"locationId": 421542,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2419,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476440,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-20 21:12:46",
    			"locationName": "",
    			"locationAddress": "1117 Second Street ",
    			"locationState": "CA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "90266",
    			"locationCity": "Manhattan Beach",
    			"locationCounty": "Los Angeles",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-20",
    			"createdTimeStamp": "1361394766",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5461,
    			"locationId": 421198,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2306,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476076,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-19 20:50:46",
    			"locationName": "",
    			"locationAddress": "2995 Avenue G",
    			"locationState": "OR",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "97503",
    			"locationCity": "White City",
    			"locationCounty": "Jackson",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-19",
    			"createdTimeStamp": "1361307047",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5461,
    			"locationId": 421198,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2305,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476076,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-19 20:50:46",
    			"locationName": "",
    			"locationAddress": "2995 Avenue G",
    			"locationState": "OR",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "97503",
    			"locationCity": "White City",
    			"locationCounty": "Jackson",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-19",
    			"createdTimeStamp": "1361307047",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5461,
    			"locationId": 421198,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2307,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 476076,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-19 20:50:46",
    			"locationName": "",
    			"locationAddress": "2995 Avenue G",
    			"locationState": "OR",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "97503",
    			"locationCity": "White City",
    			"locationCounty": "Jackson",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-19",
    			"createdTimeStamp": "1361307047",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5241,
    			"locationId": 419271,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2203,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 474110,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-15 18:28:26",
    			"locationName": "",
    			"locationAddress": "175 Post Avenue",
    			"locationState": "NY",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "11590",
    			"locationCity": "Westbury ",
    			"locationCounty": "Nassau",
    			"applicationNumber": "1222",
    			"borrower": "Benz J",
    			"loanNumber": "1345",
    			"refNumber": "1345",
    			"creationDate": "2013-02-15",
    			"createdTimeStamp": "1360952906",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5243,
    			"locationId": 419274,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 474113,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "East Main Street",
    			"locationState": "UT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "84513",
    			"locationCity": "Castle Dale",
    			"locationCounty": "Emery",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-15",
    			"createdTimeStamp": "1360953546",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5239,
    			"locationId": 419268,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2199,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 474105,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-15 18:18:25",
    			"locationName": "",
    			"locationAddress": "440 Wheeler's Farm Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "836864",
    			"borrower": "Mike Benz",
    			"loanNumber": "1222",
    			"refNumber": "1222",
    			"creationDate": "2013-02-15",
    			"createdTimeStamp": "1360952305",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5239,
    			"locationId": 419268,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2201,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 474105,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-15 18:18:25",
    			"locationName": "",
    			"locationAddress": "440 Wheeler's Farm Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "836864",
    			"borrower": "Mike Benz",
    			"loanNumber": "1222",
    			"refNumber": "1222",
    			"creationDate": "2013-02-15",
    			"createdTimeStamp": "1360952305",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 5239,
    			"locationId": 419268,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2200,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 474105,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-15 18:18:25",
    			"locationName": "",
    			"locationAddress": "440 Wheeler's Farm Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "836864",
    			"borrower": "Mike Benz",
    			"loanNumber": "1222",
    			"refNumber": "1222",
    			"creationDate": "2013-02-15",
    			"createdTimeStamp": "1360952305",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4863,
    			"locationId": 416568,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2079,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 471049,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-13 15:48:02",
    			"locationName": "",
    			"locationAddress": "175 Post Ave",
    			"locationState": "NY",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "11590",
    			"locationCity": "Westbury",
    			"locationCounty": "Nassau",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-13",
    			"createdTimeStamp": "1360770482",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4863,
    			"locationId": 416568,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2078,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 471049,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-13 15:48:02",
    			"locationName": "",
    			"locationAddress": "175 Post Ave",
    			"locationState": "NY",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "11590",
    			"locationCity": "Westbury",
    			"locationCounty": "Nassau",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-13",
    			"createdTimeStamp": "1360770482",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4876,
    			"locationId": 416606,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2085,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 471103,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-13 16:40:41",
    			"locationName": "",
    			"locationAddress": "440 Wheeler Farms Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-13",
    			"createdTimeStamp": "1360773642",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4876,
    			"locationId": 416606,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2084,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 471103,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-13 16:40:41",
    			"locationName": "",
    			"locationAddress": "440 Wheeler Farms Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-13",
    			"createdTimeStamp": "1360773642",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4876,
    			"locationId": 416606,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2086,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 471103,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-13 16:40:41",
    			"locationName": "",
    			"locationAddress": "440 Wheeler Farms Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-13",
    			"createdTimeStamp": "1360773642",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4863,
    			"locationId": 416568,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 2080,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 471049,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-13 15:48:02",
    			"locationName": "",
    			"locationAddress": "175 Post Ave",
    			"locationState": "NY",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "11590",
    			"locationCity": "Westbury",
    			"locationCounty": "Nassau",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-13",
    			"createdTimeStamp": "1360770482",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4135,
    			"locationId": 411509,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1778,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465798,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-05 11:41:10",
    			"locationName": "",
    			"locationAddress": "2198 E. Camelback Rd",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85016",
    			"locationCity": "Phoenix",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064470",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4138,
    			"locationId": 411517,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1784,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465806,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-05 11:44:55",
    			"locationName": "",
    			"locationAddress": "845 N. Gilbert Road",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85234",
    			"locationCity": "Gilbert ",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064695",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4135,
    			"locationId": 411509,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1777,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465798,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-05 11:41:10",
    			"locationName": "",
    			"locationAddress": "2198 E. Camelback Rd",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85016",
    			"locationCity": "Phoenix",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064470",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4140,
    			"locationId": 411519,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1785,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465808,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-05 11:46:39",
    			"locationName": "",
    			"locationAddress": "2001 W. Wickenburg Way",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85390",
    			"locationCity": "Wickenburg ",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064800",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4135,
    			"locationId": 411509,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1776,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465798,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-05 11:41:10",
    			"locationName": "",
    			"locationAddress": "2198 E. Camelback Rd",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85016",
    			"locationCity": "Phoenix",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064470",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4140,
    			"locationId": 411519,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1787,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465808,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-05 11:46:39",
    			"locationName": "",
    			"locationAddress": "2001 W. Wickenburg Way",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85390",
    			"locationCity": "Wickenburg ",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064800",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4140,
    			"locationId": 411519,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1786,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465808,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-05 11:46:39",
    			"locationName": "",
    			"locationAddress": "2001 W. Wickenburg Way",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85390",
    			"locationCity": "Wickenburg ",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064800",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4136,
    			"locationId": 411511,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1780,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465800,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-05 11:41:58",
    			"locationName": "",
    			"locationAddress": "7655 W. Thunderbird Road",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85381",
    			"locationCity": "Peoria",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064519",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4145,
    			"locationId": 411525,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1788,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465814,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-05 17:49:36",
    			"locationName": "",
    			"locationAddress": "175 Post Ave",
    			"locationState": "NY",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "11590",
    			"locationCity": "Westbury",
    			"locationCounty": "Nassau",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360086576",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4136,
    			"locationId": 411511,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1779,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465800,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-05 11:41:58",
    			"locationName": "",
    			"locationAddress": "7655 W. Thunderbird Road",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85381",
    			"locationCity": "Peoria",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064519",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4145,
    			"locationId": 411525,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1790,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465814,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-05 17:49:36",
    			"locationName": "",
    			"locationAddress": "175 Post Ave",
    			"locationState": "NY",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "11590",
    			"locationCity": "Westbury",
    			"locationCounty": "Nassau",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360086576",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4136,
    			"locationId": 411511,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1781,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465800,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-05 11:41:58",
    			"locationName": "",
    			"locationAddress": "7655 W. Thunderbird Road",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85381",
    			"locationCity": "Peoria",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064519",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4145,
    			"locationId": 411525,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1789,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465814,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-05 17:49:36",
    			"locationName": "",
    			"locationAddress": "175 Post Ave",
    			"locationState": "NY",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "11590",
    			"locationCity": "Westbury",
    			"locationCounty": "Nassau",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360086576",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4134,
    			"locationId": 411507,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1775,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465796,
    			"siteType": "PhaseI",
    			"statusDate": "2013-02-05 11:40:09",
    			"locationName": "",
    			"locationAddress": "1675 N. 95th Lane",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85037",
    			"locationCity": "Phoenix",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064409",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4138,
    			"locationId": 411517,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1783,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465806,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-02-05 11:44:55",
    			"locationName": "",
    			"locationAddress": "845 N. Gilbert Road",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85234",
    			"locationCity": "Gilbert ",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064695",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4134,
    			"locationId": 411507,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1774,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465796,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-05 11:40:09",
    			"locationName": "",
    			"locationAddress": "1675 N. 95th Lane",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85037",
    			"locationCity": "Phoenix",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064409",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4138,
    			"locationId": 411517,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1782,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 465806,
    			"siteType": "Appraisal",
    			"statusDate": "2013-02-05 11:44:55",
    			"locationName": "",
    			"locationAddress": "845 N. Gilbert Road",
    			"locationState": "AZ",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "85234",
    			"locationCity": "Gilbert ",
    			"locationCounty": "Maricopa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-05",
    			"createdTimeStamp": "1360064695",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 4021,
    			"locationId": 410646,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 464904,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "tester",
    			"locationAddress": "440 Wheeler Farm's Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford ",
    			"locationCounty": "New Haven",
    			"applicationNumber": "007",
    			"borrower": "Joe",
    			"loanNumber": "007",
    			"refNumber": "007",
    			"creationDate": "2013-02-04",
    			"createdTimeStamp": "1360004872",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3917,
    			"locationId": 313187,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 367432,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "113 North Locust Street ",
    			"locationState": "NE",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "68801",
    			"locationCity": "Grand Island",
    			"locationCounty": "Hall",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-02-01",
    			"createdTimeStamp": "1359749007",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3541,
    			"locationId": 311130,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 365263,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "21 union street",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06706",
    			"locationCity": "waterbury",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-29",
    			"createdTimeStamp": "1359472996",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2628,
    			"locationId": 302915,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 356779,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "920 White Plains Road ",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06611",
    			"locationCity": "Trumbull",
    			"locationCounty": "Fairfield",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-15",
    			"createdTimeStamp": "1358277396",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2639,
    			"locationId": 302930,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 356794,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "111 Stones Throw ",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06611",
    			"locationCity": "Trumbull",
    			"locationCounty": "Fairfield",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-15",
    			"createdTimeStamp": "1358279260",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2660,
    			"locationId": 302996,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 356862,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "321 Boston Post Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06477",
    			"locationCity": "Orange",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-15",
    			"createdTimeStamp": "1358285039",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2621,
    			"locationId": 302903,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 356767,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "85 Boston Post Road ",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford ",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-15",
    			"createdTimeStamp": "1358276838",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2626,
    			"locationId": 302912,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 356776,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "920 White Plains Road",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06611",
    			"locationCity": "Trumbul",
    			"locationCounty": "Fairfield",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-15",
    			"createdTimeStamp": "1358277205",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2346,
    			"locationId": 301878,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1018,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 355667,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-01-10 21:19:39",
    			"locationName": "",
    			"locationAddress": "2915 60 St",
    			"locationState": "WI",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "53140",
    			"locationCity": "Kenosha",
    			"locationCounty": "Kenosha",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-10",
    			"createdTimeStamp": "1357852779",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2346,
    			"locationId": 301878,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 1017,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 355667,
    			"siteType": "Evaluation",
    			"statusDate": "2013-01-10 21:19:39",
    			"locationName": "",
    			"locationAddress": "2915 60 St",
    			"locationState": "WI",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "53140",
    			"locationCity": "Kenosha",
    			"locationCounty": "Kenosha",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-10",
    			"createdTimeStamp": "1357852779",
    			"service": "Evaluation",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2195,
    			"locationId": 301490,
    			"cabinetId": 118910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 355253,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "193 blue ravine rd",
    			"locationState": "CA",
    			"cabinet": "espn",
    			"locationZip": "95630",
    			"locationCity": "folsom",
    			"locationCounty": "Sacramento",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-09",
    			"createdTimeStamp": "1357747947",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2196,
    			"locationId": 301491,
    			"cabinetId": 118910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 355254,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "1205 park ave",
    			"locationState": "CA",
    			"cabinet": "espn",
    			"locationZip": "95928",
    			"locationCity": "chico",
    			"locationCounty": "Butte",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-09",
    			"createdTimeStamp": "1357748082",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2197,
    			"locationId": 301492,
    			"cabinetId": 118910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 355255,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "655 cal oak dr",
    			"locationState": "CA",
    			"cabinet": "espn",
    			"locationZip": "95965",
    			"locationCity": "oroville ",
    			"locationCounty": "Butte",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-09",
    			"createdTimeStamp": "1357748270",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2198,
    			"locationId": 301493,
    			"cabinetId": 118910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 355256,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "88 table mountain blvd",
    			"locationState": "CA",
    			"cabinet": "espn",
    			"locationZip": "95965",
    			"locationCity": "oroville",
    			"locationCounty": "Butte",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-09",
    			"createdTimeStamp": "1357748362",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2193,
    			"locationId": 301487,
    			"cabinetId": 118910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 355250,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "101 h street",
    			"locationState": "CA",
    			"cabinet": "espn",
    			"locationZip": "94509",
    			"locationCity": "antioch",
    			"locationCounty": "Contra Costa",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2013-01-09",
    			"createdTimeStamp": "1357747707",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2045,
    			"locationId": 301042,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 922,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354790,
    			"siteType": "Appraisal",
    			"statusDate": "2013-01-07 19:16:15",
    			"locationName": "Test'2",
    			"locationAddress": "800 W. Cummings Park Ste'4800",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Test'2",
    			"borrower": "Test'2",
    			"loanNumber": "Test'2",
    			"refNumber": "Test'2",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357586175",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2051,
    			"locationId": 301064,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 927,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354814,
    			"siteType": "PhaseI",
    			"statusDate": "2013-01-07 19:55:43",
    			"locationName": "Test'3",
    			"locationAddress": "800 W. Cummings Park Ste'3",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Test'3",
    			"borrower": "Test'3",
    			"loanNumber": "Test'3",
    			"refNumber": "Test'3",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357588544",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2051,
    			"locationId": 301064,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 926,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354814,
    			"siteType": "Appraisal",
    			"statusDate": "2013-01-07 19:55:43",
    			"locationName": "Test'3",
    			"locationAddress": "800 W. Cummings Park Ste'3",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Test'3",
    			"borrower": "Test'3",
    			"loanNumber": "Test'3",
    			"refNumber": "Test'3",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357588544",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2027,
    			"locationId": 300994,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 909,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354740,
    			"siteType": "RadiusGeo",
    			"statusDate": "2013-01-07 17:13:21",
    			"locationName": "Test Site",
    			"locationAddress": "800 W. Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "0001",
    			"borrower": "0001",
    			"loanNumber": "0001",
    			"refNumber": "0001",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357578802",
    			"service": "RadiusGeo",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2053,
    			"locationId": 301072,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 929,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354822,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-01-07 20:08:02",
    			"locationName": "Test\\'4",
    			"locationAddress": "800 W. Cummings Park Ste\\'4700",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Test'4",
    			"borrower": "Test'4",
    			"loanNumber": "Test'4",
    			"refNumber": "Test'4",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357589283",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2028,
    			"locationId": 300995,
    			"cabinetId": 118565,
    			"pSiteID": null,
    			"locationServiceId": 910,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354741,
    			"siteType": "Appraisal",
    			"statusDate": "2013-01-07 17:14:37",
    			"locationName": "Test Site",
    			"locationAddress": "800 W. Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Special \"#\" Cabinet;",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "0002",
    			"borrower": "0002",
    			"loanNumber": "0002",
    			"refNumber": "0002",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357578877",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2028,
    			"locationId": 300995,
    			"cabinetId": 118565,
    			"pSiteID": null,
    			"locationServiceId": 911,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354741,
    			"siteType": "AppraisalRev",
    			"statusDate": "2013-01-07 17:14:37",
    			"locationName": "Test Site",
    			"locationAddress": "800 W. Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Special \"#\" Cabinet;",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "0002",
    			"borrower": "0002",
    			"loanNumber": "0002",
    			"refNumber": "0002",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357578877",
    			"service": "Commercial Appraisal Review",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2053,
    			"locationId": 301072,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 928,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354822,
    			"siteType": "Appraisal",
    			"statusDate": "2013-01-07 20:08:02",
    			"locationName": "Test\\'4",
    			"locationAddress": "800 W. Cummings Park Ste\\'4700",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Test'4",
    			"borrower": "Test'4",
    			"loanNumber": "Test'4",
    			"refNumber": "Test'4",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357589283",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2037,
    			"locationId": 301026,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 917,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354773,
    			"siteType": "PhaseI",
    			"statusDate": "2013-01-07 18:42:31",
    			"locationName": "Kozar\\'s",
    			"locationAddress": "800 West Cummings Park Suite\\'4900",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Kozar's",
    			"borrower": "Kozar's",
    			"loanNumber": "Kozar's",
    			"refNumber": "Kozar's",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357584152",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2054,
    			"locationId": 301073,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 930,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354823,
    			"siteType": "Appraisal",
    			"statusDate": "2013-01-07 20:09:59",
    			"locationName": "Test'5",
    			"locationAddress": "800 W. Cummings Park Ste'4600",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Test'5",
    			"borrower": "Test'5",
    			"loanNumber": "Test'5",
    			"refNumber": "Test'5",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357589399",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2042,
    			"locationId": 301034,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 920,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354782,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-01-07 19:09:22",
    			"locationName": "Kevin\\'s",
    			"locationAddress": "800 W. Cummings Park Suite\\'4900",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Kevin's",
    			"borrower": "Kevin's",
    			"loanNumber": "Kevin's",
    			"refNumber": "Kevin's",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357585763",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2045,
    			"locationId": 301042,
    			"cabinetId": 118564,
    			"pSiteID": null,
    			"locationServiceId": 923,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 354790,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2013-01-07 19:16:15",
    			"locationName": "Test'2",
    			"locationAddress": "800 W. Cummings Park Ste'4800",
    			"locationState": "MA",
    			"cabinet": "Kozar's Cabinet",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": "Test'2",
    			"borrower": "Test'2",
    			"loanNumber": "Test'2",
    			"refNumber": "Test'2",
    			"creationDate": "2013-01-07",
    			"createdTimeStamp": "1357586175",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 1056,
    			"locationId": 296767,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 567,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 350176,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-12-05 22:03:27",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2012-12-05",
    			"createdTimeStamp": "1354745007",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 913,
    			"locationId": 295432,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 517,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 348748,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-11-29 18:34:06",
    			"locationName": "",
    			"locationAddress": "122 West Main Street",
    			"locationState": "MI",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "49285",
    			"locationCity": "Stockbridge",
    			"locationCounty": "Ingham",
    			"applicationNumber": "86498",
    			"borrower": "Mike Benz",
    			"loanNumber": "65465",
    			"refNumber": "65465",
    			"creationDate": "2012-11-29",
    			"createdTimeStamp": "1354214046",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 907,
    			"locationId": 295394,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 516,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 348704,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-11-29 17:06:35",
    			"locationName": "",
    			"locationAddress": "811 Monitor Street",
    			"locationState": "WI",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "54603",
    			"locationCity": "La Crosse",
    			"locationCounty": "La Crosse",
    			"applicationNumber": "321654",
    			"borrower": "Mike Benz",
    			"loanNumber": "56498",
    			"refNumber": "56498",
    			"creationDate": "2012-11-29",
    			"createdTimeStamp": "1354208795",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 829,
    			"locationId": 294932,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 490,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 348197,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-11-27 19:52:15",
    			"locationName": "",
    			"locationAddress": "2330 East 53rd Street",
    			"locationState": "IA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "52807",
    			"locationCity": "Davenport",
    			"locationCounty": "Scott",
    			"applicationNumber": "2131654",
    			"borrower": "Mike Benz",
    			"loanNumber": "3654654",
    			"refNumber": "3654654",
    			"creationDate": "2012-11-27",
    			"createdTimeStamp": "1354045936",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 830,
    			"locationId": 294933,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 491,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 348198,
    			"siteType": "PhaseI",
    			"statusDate": "2012-11-27 19:55:54",
    			"locationName": "",
    			"locationAddress": "21050 North Brady Street",
    			"locationState": "IA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "52804",
    			"locationCity": "Davenport",
    			"locationCounty": "Scott",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2012-11-27",
    			"createdTimeStamp": "1354046155",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 830,
    			"locationId": 294933,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 492,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 348198,
    			"siteType": "Appraisal",
    			"statusDate": "2012-11-27 19:55:54",
    			"locationName": "",
    			"locationAddress": "21050 North Brady Street",
    			"locationState": "IA",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "52804",
    			"locationCity": "Davenport",
    			"locationCounty": "Scott",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2012-11-27",
    			"createdTimeStamp": "1354046155",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 801,
    			"locationId": 294681,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 476,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 347929,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-11-26 17:51:09",
    			"locationName": "",
    			"locationAddress": "11418 Town Center Drive NE",
    			"locationState": "MN",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "55376",
    			"locationCity": "St. Michael",
    			"locationCounty": "Wright",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2012-11-26",
    			"createdTimeStamp": "1353952269",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 692,
    			"locationId": 293737,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 426,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 346892,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-11-19 15:48:59",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farm Rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": "",
    			"borrower": "",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2012-11-19",
    			"createdTimeStamp": "1353340139",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 595,
    			"locationId": 292811,
    			"cabinetId": 112878,
    			"pSiteID": null,
    			"locationServiceId": 382,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 345913,
    			"siteType": "PhaseI",
    			"statusDate": "2012-11-14 17:11:56",
    			"locationName": "",
    			"locationAddress": "123 Main",
    			"locationState": "MA",
    			"cabinet": "Sample",
    			"locationZip": "02129",
    			"locationCity": "Boston",
    			"locationCounty": "Suffolk",
    			"applicationNumber": "1234",
    			"borrower": "ABC",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2012-11-14",
    			"createdTimeStamp": "1352913117",
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 501,
    			"locationId": 291722,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 339,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 344724,
    			"siteType": "Appraisal",
    			"statusDate": "2012-11-08 15:01:54",
    			"locationName": "",
    			"locationAddress": "1400 Riverwood Drive",
    			"locationState": "MN",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "55337",
    			"locationCity": "Burnsville",
    			"locationCounty": "Dakota",
    			"applicationNumber": "1237",
    			"borrower": "Benz",
    			"loanNumber": "768768",
    			"refNumber": "768768",
    			"creationDate": "2012-11-08",
    			"createdTimeStamp": "1352386917",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 479,
    			"locationId": 291532,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 327,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 344493,
    			"siteType": "Appraisal",
    			"statusDate": "2012-11-07 16:41:52",
    			"locationName": "",
    			"locationAddress": "2715 Losey S",
    			"locationState": "WI",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "54601",
    			"locationCity": "La Crosse",
    			"locationCounty": "La Crosse",
    			"applicationNumber": "12345",
    			"borrower": "MIke Benz",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": "2012-11-07",
    			"createdTimeStamp": "1352306512",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 484,
    			"locationId": 291585,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 329,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 344548,
    			"siteType": "Appraisal",
    			"statusDate": "2012-11-07 19:16:09",
    			"locationName": "",
    			"locationAddress": "200 Riverfront Terrace",
    			"locationState": "WI",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "54703",
    			"locationCity": "Eau Claire",
    			"locationCounty": "Eau Claire",
    			"applicationNumber": "1234",
    			"borrower": "Benz",
    			"loanNumber": "5467",
    			"refNumber": "5467",
    			"creationDate": "2012-11-07",
    			"createdTimeStamp": "1352315770",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 431,
    			"locationId": 291094,
    			"cabinetId": 111686,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 344020,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "Test",
    			"locationAddress": "900 Petaluma Blvd",
    			"locationState": "CA",
    			"cabinet": "Tri Counties Bank",
    			"locationZip": "94952",
    			"locationCity": "Petaluma ",
    			"locationCounty": "Sonoma",
    			"applicationNumber": "1321321231",
    			"borrower": "Tri Counties Bank",
    			"loanNumber": "1231312123",
    			"refNumber": "1231312123",
    			"creationDate": "2012-11-05",
    			"createdTimeStamp": "1352144549",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 367,
    			"locationId": 290279,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 255,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 343123,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-10-30 19:24:34",
    			"locationName": "",
    			"locationAddress": "8933 Lyndale Avenue South",
    			"locationState": "MN",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "55420",
    			"locationCity": "Bloomington",
    			"locationCounty": "Hennepin",
    			"applicationNumber": "Sample",
    			"borrower": "Sample",
    			"loanNumber": "Sample",
    			"refNumber": "Sample",
    			"creationDate": "2012-10-30",
    			"createdTimeStamp": "1351628675",
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 317,
    			"locationId": 288854,
    			"cabinetId": 110189,
    			"pSiteID": null,
    			"locationServiceId": 236,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 341569,
    			"siteType": "AppraisalRev",
    			"statusDate": "2012-10-23 13:38:21",
    			"locationName": "FFLD Inn",
    			"locationAddress": "54 Peachtree SW",
    			"locationState": "GA",
    			"cabinet": "Desktop",
    			"locationZip": "30303",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton",
    			"applicationNumber": "100-23-0000",
    			"borrower": "Smith",
    			"loanNumber": "5433",
    			"refNumber": "5433",
    			"creationDate": "2012-10-23",
    			"createdTimeStamp": "1351003102",
    			"service": "Commercial Appraisal Review",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 317,
    			"locationId": 288854,
    			"cabinetId": 110189,
    			"pSiteID": null,
    			"locationServiceId": 235,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 341569,
    			"siteType": "Appraisal",
    			"statusDate": "2012-10-23 13:38:21",
    			"locationName": "FFLD Inn",
    			"locationAddress": "54 Peachtree SW",
    			"locationState": "GA",
    			"cabinet": "Desktop",
    			"locationZip": "30303",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton",
    			"applicationNumber": "100-23-0000",
    			"borrower": "Smith",
    			"loanNumber": "5433",
    			"refNumber": "5433",
    			"creationDate": "2012-10-23",
    			"createdTimeStamp": "1351003102",
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 318,
    			"locationId": 288858,
    			"cabinetId": 110193,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 341573,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "Hotel in ATL",
    			"locationAddress": "54 Peachtree SW",
    			"locationState": "GA",
    			"cabinet": "53 DEMO",
    			"locationZip": "30303",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton",
    			"applicationNumber": "9999",
    			"borrower": "999999999",
    			"loanNumber": "",
    			"refNumber": "",
    			"creationDate": "2012-10-23",
    			"createdTimeStamp": "1351003288",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 319,
    			"locationId": 288864,
    			"cabinetId": 110197,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 341579,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "FFLD Inn",
    			"locationAddress": "54 Peachtree SW",
    			"locationState": "GA",
    			"cabinet": "Fifth Third Bank DEMO",
    			"locationZip": "30303",
    			"locationCity": "Atlanta",
    			"locationCounty": "Fulton",
    			"applicationNumber": "100002",
    			"borrower": "Jeff D",
    			"loanNumber": "55555",
    			"refNumber": "55555",
    			"creationDate": "2012-10-23",
    			"createdTimeStamp": "1351005005",
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 253,
    			"locationId": 287652,
    			"cabinetId": 109293,
    			"pSiteID": null,
    			"locationServiceId": 201,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 340177,
    			"siteType": "ASTMPCA",
    			"statusDate": "2012-10-15 19:28:18",
    			"locationName": "Colony Grill",
    			"locationAddress": "1520 Post Rd",
    			"locationState": "CT",
    			"cabinet": "Jeff's Demo Site",
    			"locationZip": "06824",
    			"locationCity": "Fairfield",
    			"locationCounty": "Fairfield",
    			"applicationNumber": "App01",
    			"borrower": "Jeff D",
    			"loanNumber": "10-15-2012",
    			"refNumber": "10-15-2012",
    			"creationDate": "2012-10-15",
    			"createdTimeStamp": "1350332898",
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 80,
    			"locationId": 281814,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333281,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "495 Boston Post Rd ",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06460",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "654106540",
    			"loanNumber": "8540604",
    			"refNumber": "8540604",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 23,
    			"locationId": 279098,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 16,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330345,
    			"siteType": "ASTMPCA",
    			"statusDate": "2012-09-17 16:26:58",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 17,
    			"locationId": 277506,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 2,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328569,
    			"siteType": "AppraisalRev",
    			"statusDate": "2012-09-05 23:14:06",
    			"locationName": "",
    			"locationAddress": "2 dean st",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "02180",
    			"locationCity": "stoneham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "123456789",
    			"refNumber": "123456789",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal Review",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3,
    			"locationId": 149923,
    			"cabinetId": 53910,
    			"pSiteID": 181156,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 158785,
    			"siteType": "CAR",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "400 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": null,
    			"loanNumber": "ID1235",
    			"refNumber": "ID1235",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Compliance Audit",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-08-15",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283712,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": "2012-02-14 16:41:56",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2011-04-12",
    			"dueDate": "2011-04-19",
    			"status": "On Hold",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-13",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312588,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-12",
    			"dueDate": "2012-07-18",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290071,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-10",
    			"dueDate": "2012-04-18",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 48,
    			"locationId": 281662,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333119,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "101 East Main St",
    			"locationState": "IL",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "61084",
    			"locationCity": "Stillman Valley",
    			"locationCounty": "Ogle",
    			"applicationNumber": null,
    			"borrower": "Mike Smith",
    			"loanNumber": "123456",
    			"refNumber": "123456",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 21,
    			"locationId": 277808,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 11,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328883,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-07 18:13:37",
    			"locationName": "Jenny\\'s House",
    			"locationAddress": "200 Riverside Ave",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "02155",
    			"locationCity": "Boston",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jenny",
    			"loanNumber": "8675309",
    			"refNumber": "8675309",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 300552,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 283841,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-24 12:36:03",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "2012-05-01",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "1969-12-31",
    			"dueDate": "2012-09-19",
    			"status": "On Hold",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-04-25",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290067,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-08",
    			"dueDate": "2012-04-30",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312593,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-19",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 302217,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Appraisal",
    			"locationConsultant": "Test Appraisal",
    			"draftDate": "2012-05-17",
    			"dueDate": "2012-05-18",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-05-07",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290070,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "ASTMPCA",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Engineering Company",
    			"locationConsultant": "Test Engineering Company",
    			"draftDate": "2012-03-16",
    			"dueDate": "2012-04-17",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 97,
    			"locationId": 281952,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333455,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "575 Rudder Road",
    			"locationState": "MO",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "63026",
    			"locationCity": "Fenton",
    			"locationCounty": "St. Louis",
    			"applicationNumber": null,
    			"borrower": "Mike Benz",
    			"loanNumber": "123456",
    			"refNumber": "123456",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 24,
    			"locationId": 279099,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 22,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330346,
    			"siteType": "RadiusGeo",
    			"statusDate": "2012-09-17 16:27:09",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "RadiusGeo",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 18,
    			"locationId": 277508,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 4,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328572,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-09-05 23:25:30",
    			"locationName": "House",
    			"locationAddress": "1 Main Street",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "99999",
    			"refNumber": "99999",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 17,
    			"locationId": 277506,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 1,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328569,
    			"siteType": "Appraisal",
    			"statusDate": "2012-09-05 23:14:06",
    			"locationName": "",
    			"locationAddress": "2 dean st",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "02180",
    			"locationCity": "stoneham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "123456789",
    			"refNumber": "123456789",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3,
    			"locationId": 149923,
    			"cabinetId": 53910,
    			"pSiteID": 181165,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 158785,
    			"siteType": "FastTrack",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "400 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": null,
    			"loanNumber": "ID1235",
    			"refNumber": "ID1235",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PARCEL FastTrack",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-08-15",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312592,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-25",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 297476,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "Appraisal",
    			"statusDate": "2012-04-03 00:00:00",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-14",
    			"dueDate": "2012-04-21",
    			"status": "Out to Bid",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-04-03",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283800,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "Appraisal",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Appraisal",
    			"locationConsultant": "Test Appraisal",
    			"draftDate": "2012-02-23",
    			"dueDate": "2012-03-01",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 59,
    			"locationId": 281683,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333141,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "David Kilgo",
    			"loanNumber": "12345678",
    			"refNumber": "12345678",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 22,
    			"locationId": 277824,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 13,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328899,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-09-07 18:48:33",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guido",
    			"loanNumber": "EDR1",
    			"refNumber": "EDR1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 319401,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 283841,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "2012-05-01",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-25",
    			"dueDate": "2012-08-16",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-07-23",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283708,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": "2012-05-18 14:34:05",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2011-04-12",
    			"dueDate": "2011-04-19",
    			"status": "In Progress",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-13",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312486,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-12",
    			"dueDate": "2012-07-26",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 297473,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "Appraisal",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-04",
    			"dueDate": "2012-04-11",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-04-03",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283712,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": "2012-02-14 16:41:56",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2011-04-12",
    			"dueDate": "2011-04-19",
    			"status": "On Hold",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-13",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 98,
    			"locationId": 281953,
    			"cabinetId": 103549,
    			"pSiteID": null,
    			"locationServiceId": 81,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333456,
    			"siteType": "PhaseI",
    			"statusDate": "2012-10-02 14:20:23",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "PARCEL Demo Cabinet",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Tom Waldron",
    			"loanNumber": "1",
    			"refNumber": "1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 24,
    			"locationId": 279099,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 20,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330346,
    			"siteType": "ASTMPCA",
    			"statusDate": "2012-09-17 16:27:09",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 18,
    			"locationId": 277508,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 5,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328572,
    			"siteType": "RadiusGeo",
    			"statusDate": "2012-09-05 23:25:30",
    			"locationName": "House",
    			"locationAddress": "1 Main Street",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "99999",
    			"refNumber": "99999",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "RadiusGeo",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 18,
    			"locationId": 277508,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 6,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328572,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-05 23:25:30",
    			"locationName": "House",
    			"locationAddress": "1 Main Street",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "99999",
    			"refNumber": "99999",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 283840,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 160544,
    			"siteType": "PhaseI",
    			"statusDate": "2012-05-14 19:28:07",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2011-04-12",
    			"dueDate": "2012-05-01",
    			"status": "On Hold",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312478,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-12",
    			"dueDate": "2012-07-26",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290067,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-08",
    			"dueDate": "2012-04-30",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312593,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-19",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 65,
    			"locationId": 281730,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 66,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333193,
    			"siteType": "ASTMPCA",
    			"statusDate": "2012-09-29 18:45:53",
    			"locationName": "",
    			"locationAddress": "50 Main Street",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06010",
    			"locationCity": "Bristol",
    			"locationCounty": "Hartford",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "Jon's Test",
    			"refNumber": "Jon's Test",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 22,
    			"locationId": 277824,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 14,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328899,
    			"siteType": "RadiusGeo",
    			"statusDate": "2012-09-07 18:48:33",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guido",
    			"loanNumber": "EDR1",
    			"refNumber": "EDR1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "RadiusGeo",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 283863,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 283841,
    			"siteType": "Appraisal",
    			"statusDate": "2012-02-14 18:42:22",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "2012-05-01",
    			"vendor": "Test Appraisal",
    			"locationConsultant": "Test Appraisal",
    			"draftDate": "2011-04-12",
    			"dueDate": "2012-05-01",
    			"status": "In Progress",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312591,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-26",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312473,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-19",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290066,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Environmental Company",
    			"locationConsultant": "Test Environmental Company",
    			"draftDate": "2012-03-22",
    			"dueDate": "2012-03-29",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312592,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-25",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 98,
    			"locationId": 281953,
    			"cabinetId": 103549,
    			"pSiteID": null,
    			"locationServiceId": 82,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333456,
    			"siteType": "ASTMPCA",
    			"statusDate": "2012-10-02 14:20:23",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "PARCEL Demo Cabinet",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Tom Waldron",
    			"loanNumber": "1",
    			"refNumber": "1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 24,
    			"locationId": 279099,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 23,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330346,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-17 16:27:09",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 19,
    			"locationId": 277511,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 9,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328575,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-05 23:29:12",
    			"locationName": "",
    			"locationAddress": "2 Main Street",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "88888888",
    			"refNumber": "88888888",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 300552,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 160544,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-24 12:36:03",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "1969-12-31",
    			"dueDate": "2012-09-19",
    			"status": "On Hold",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-04-25",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 294411,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "1969-12-31",
    			"dueDate": "1969-12-31",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-19",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283708,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": "2012-05-18 14:34:05",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2011-04-12",
    			"dueDate": "2011-04-19",
    			"status": "In Progress",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-13",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312486,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-12",
    			"dueDate": "2012-07-26",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 65,
    			"locationId": 281730,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 65,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333193,
    			"siteType": "RadiusGeo",
    			"statusDate": "2012-09-29 18:45:53",
    			"locationName": "",
    			"locationAddress": "50 Main Street",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06010",
    			"locationCity": "Bristol",
    			"locationCounty": "Hartford",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "Jon's Test",
    			"refNumber": "Jon's Test",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "RadiusGeo",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 22,
    			"locationId": 277824,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 12,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328899,
    			"siteType": "ASTMPCA",
    			"statusDate": "2012-09-07 18:48:33",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guido",
    			"loanNumber": "EDR1",
    			"refNumber": "EDR1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 317465,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 283841,
    			"siteType": "PhaseI",
    			"statusDate": "2012-08-22 18:11:29",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "2012-05-01",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2012-07-18",
    			"dueDate": "2012-09-04",
    			"status": "Scheduled",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-07-12",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 13,
    			"locationId": 270613,
    			"cabinetId": 101291,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 321273,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "House",
    			"locationAddress": "26 Dean Stre",
    			"locationState": "MA",
    			"cabinet": "New Test Cabinet",
    			"locationZip": "02180",
    			"locationCity": "Stoneham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "1",
    			"refNumber": "1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3,
    			"locationId": 149923,
    			"cabinetId": 53910,
    			"pSiteID": 181170,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 158785,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "400 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": null,
    			"loanNumber": "ID1235",
    			"refNumber": "ID1235",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-08-15",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 161453,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": "2011-05-10 00:00:00",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": "Out to Bid",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-05-10",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312478,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-12",
    			"dueDate": "2012-07-26",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 99,
    			"locationId": 281956,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333459,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "207 W. Main St.",
    			"locationState": "WI",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "53190",
    			"locationCity": "Whitewater",
    			"locationCounty": "Walworth",
    			"applicationNumber": null,
    			"borrower": "Mike Benz",
    			"loanNumber": "123456",
    			"refNumber": "123456",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 24,
    			"locationId": 279099,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 21,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330346,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-09-17 16:27:09",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 19,
    			"locationId": 277511,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 7,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328575,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-09-05 23:29:12",
    			"locationName": "",
    			"locationAddress": "2 Main Street",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "88888888",
    			"refNumber": "88888888",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 319401,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 160544,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-25",
    			"dueDate": "2012-08-16",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-07-23",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283801,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-02-24",
    			"dueDate": "2012-03-07",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312591,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-26",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 297473,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "Appraisal",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-04",
    			"dueDate": "2012-04-11",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-04-03",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 66,
    			"locationId": 281731,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333194,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "APN TEST",
    			"locationAddress": "300 Main St",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01151",
    			"locationCity": "Springfield",
    			"locationCounty": "Hampden",
    			"applicationNumber": null,
    			"borrower": "APN",
    			"loanNumber": "TEST APN",
    			"refNumber": "TEST APN",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 22,
    			"locationId": 277824,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 15,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328899,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-07 18:48:33",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guido",
    			"loanNumber": "EDR1",
    			"refNumber": "EDR1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 23,
    			"locationId": 279098,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 19,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330345,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-17 16:26:58",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 14,
    			"locationId": 272962,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 323786,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "123 Main Street",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "02180",
    			"locationCity": "Stoneham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Todd",
    			"loanNumber": "NEW12345",
    			"refNumber": "NEW12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3,
    			"locationId": 149923,
    			"cabinetId": 53910,
    			"pSiteID": 181160,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 158785,
    			"siteType": "NEPA",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "400 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": null,
    			"loanNumber": "ID1235",
    			"refNumber": "ID1235",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "National Environmental Policy",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-08-15",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312589,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-19",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 294411,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "1969-12-31",
    			"dueDate": "1969-12-31",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-19",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 116,
    			"locationId": 282030,
    			"cabinetId": 103549,
    			"pSiteID": null,
    			"locationServiceId": 92,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333544,
    			"siteType": "PhaseI",
    			"statusDate": "2012-10-02 17:55:02",
    			"locationName": "",
    			"locationAddress": "54 Lindor Road",
    			"locationState": "MA",
    			"cabinet": "PARCEL Demo Cabinet",
    			"locationZip": "01864",
    			"locationCity": "North Reading",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Oreste",
    			"loanNumber": "1",
    			"refNumber": "1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 38,
    			"locationId": 281633,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 47,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333088,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-09-28 18:18:22",
    			"locationName": "Michael",
    			"locationAddress": "73 Holcomb Street",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06516",
    			"locationCity": "West Haven",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Benz",
    			"loanNumber": "123456",
    			"refNumber": "123456",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 19,
    			"locationId": 277511,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 8,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328575,
    			"siteType": "RadiusGeo",
    			"statusDate": "2012-09-05 23:29:12",
    			"locationName": "",
    			"locationAddress": "2 Main Street",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "88888888",
    			"refNumber": "88888888",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "RadiusGeo",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 283863,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 160544,
    			"siteType": "Appraisal",
    			"statusDate": "2012-02-14 18:42:22",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Appraisal",
    			"locationConsultant": "Test Appraisal",
    			"draftDate": "2011-04-12",
    			"dueDate": "2012-05-01",
    			"status": "In Progress",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 153776,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "Appraisal",
    			"statusDate": "2011-03-30 00:00:00",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": "Out to Bid",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-03-30",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312473,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-19",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290066,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Environmental Company",
    			"locationConsultant": "Test Environmental Company",
    			"draftDate": "2012-03-22",
    			"dueDate": "2012-03-29",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 77,
    			"locationId": 281799,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333265,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "440 Wheelers farms Rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Benz",
    			"loanNumber": "123456",
    			"refNumber": "123456",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 78,
    			"locationId": 281806,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333273,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "DeVoes House",
    			"locationAddress": "191 Dawson Ave",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06516",
    			"locationCity": "West Haven",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Devoe",
    			"loanNumber": "123456",
    			"refNumber": "123456",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 23,
    			"locationId": 279098,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 17,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330345,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-09-17 16:26:58",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 15,
    			"locationId": 275524,
    			"cabinetId": 103549,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 326467,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "Tavern Uptown",
    			"locationAddress": "538 E. 17th Ave",
    			"locationState": "CO",
    			"cabinet": "PARCEL Demo Cabinet",
    			"locationZip": "80203",
    			"locationCity": "Denver",
    			"locationCounty": "Denver",
    			"applicationNumber": null,
    			"borrower": "Mr. Jon Smith",
    			"loanNumber": "13579",
    			"refNumber": "13579",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3,
    			"locationId": 149923,
    			"cabinetId": 53910,
    			"pSiteID": 181169,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 158785,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "400 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": null,
    			"loanNumber": "ID1235",
    			"refNumber": "ID1235",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-08-15",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 302217,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Appraisal",
    			"locationConsultant": "Test Appraisal",
    			"draftDate": "2012-05-17",
    			"dueDate": "2012-05-18",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-05-07",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283801,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-02-24",
    			"dueDate": "2012-03-07",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 116,
    			"locationId": 282030,
    			"cabinetId": 103549,
    			"pSiteID": null,
    			"locationServiceId": 91,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333544,
    			"siteType": "Appraisal",
    			"statusDate": "2012-10-02 17:55:02",
    			"locationName": "",
    			"locationAddress": "54 Lindor Road",
    			"locationState": "MA",
    			"cabinet": "PARCEL Demo Cabinet",
    			"locationZip": "01864",
    			"locationCity": "North Reading",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Oreste",
    			"loanNumber": "1",
    			"refNumber": "1",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 40,
    			"locationId": 281635,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": 48,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333090,
    			"siteType": "LoanChkPlus",
    			"statusDate": "2012-09-28 18:22:50",
    			"locationName": "",
    			"locationAddress": "1 Jones Hill Rd",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06516",
    			"locationCity": "West Haven",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "John Smith",
    			"loanNumber": "1234567",
    			"refNumber": "1234567",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "LoanChkPlus",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 20,
    			"locationId": 151563,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 160546,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "TEST311",
    			"locationAddress": "485 Forum Drive",
    			"locationState": "SC",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "29229",
    			"locationCity": "Columbia",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guido",
    			"loanNumber": "ID78956",
    			"refNumber": "ID78956",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 317465,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 160544,
    			"siteType": "PhaseI",
    			"statusDate": "2012-08-22 18:11:29",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2012-07-18",
    			"dueDate": "2012-09-04",
    			"status": "Scheduled",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-07-12",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312588,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-12",
    			"dueDate": "2012-07-18",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290071,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-10",
    			"dueDate": "2012-04-18",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 161453,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": "2011-05-10 00:00:00",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": "Out to Bid",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-05-10",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 79,
    			"locationId": 281812,
    			"cabinetId": 119618,
    			"pSiteID": null,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333279,
    			"siteType": null,
    			"statusDate": null,
    			"locationName": "",
    			"locationAddress": "517 Boston Post Rd ",
    			"locationState": "CT",
    			"cabinet": "Benz Lending CT",
    			"locationZip": "06460",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "541545",
    			"loanNumber": "564658",
    			"refNumber": "564658",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "No Services Selected",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 23,
    			"locationId": 279098,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 18,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 330345,
    			"siteType": "RadiusGeo",
    			"statusDate": "2012-09-17 16:26:58",
    			"locationName": "",
    			"locationAddress": "440 Wheelers Farms Road",
    			"locationState": "CT",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "06461",
    			"locationCity": "Milford",
    			"locationCounty": "New Haven",
    			"applicationNumber": null,
    			"borrower": "Guy",
    			"loanNumber": "123",
    			"refNumber": "123",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "RadiusGeo",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 17,
    			"locationId": 277506,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 3,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328569,
    			"siteType": "PhaseI",
    			"statusDate": "2012-09-05 23:14:06",
    			"locationName": "",
    			"locationAddress": "2 dean st",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "02180",
    			"locationCity": "stoneham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "123456789",
    			"refNumber": "123456789",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 3,
    			"locationId": 149923,
    			"cabinetId": 53910,
    			"pSiteID": 283799,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 158785,
    			"siteType": "Appraisal",
    			"statusDate": "2012-02-14 19:48:41",
    			"locationName": "",
    			"locationAddress": "400 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": null,
    			"loanNumber": "ID1235",
    			"refNumber": "ID1235",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Appraisal",
    			"locationConsultant": "Test Appraisal",
    			"draftDate": "2011-04-12",
    			"dueDate": "2011-04-19",
    			"status": "Accepted",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 290070,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "ASTMPCA",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Engineering Company",
    			"locationConsultant": "Test Engineering Company",
    			"draftDate": "2012-03-16",
    			"dueDate": "2012-04-17",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-03-16",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 153776,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "Appraisal",
    			"statusDate": "2011-03-30 00:00:00",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "0000-00-00",
    			"dueDate": "0000-00-00",
    			"status": "Out to Bid",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2011-03-30",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 43,
    			"locationId": 281639,
    			"cabinetId": 103549,
    			"pSiteID": null,
    			"locationServiceId": 53,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 333094,
    			"siteType": "Title",
    			"statusDate": "2012-09-28 18:32:25",
    			"locationName": "Test",
    			"locationAddress": "26 Dean St",
    			"locationState": "MA",
    			"cabinet": "PARCEL Demo Cabinet",
    			"locationZip": "02180",
    			"locationCity": "Stoneham",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jon",
    			"loanNumber": "39485",
    			"refNumber": "39485",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Title Services",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 21,
    			"locationId": 277808,
    			"cabinetId": 53910,
    			"pSiteID": null,
    			"locationServiceId": 10,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 328883,
    			"siteType": "ASTMPCA",
    			"statusDate": "2012-09-07 18:13:37",
    			"locationName": "Jenny\\'s House",
    			"locationAddress": "200 Riverside Ave",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "02155",
    			"locationCity": "Boston",
    			"locationCounty": "Middlesex",
    			"applicationNumber": null,
    			"borrower": "Jenny",
    			"loanNumber": "8675309",
    			"refNumber": "8675309",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "PCA",
    			"completedDate": "0000-00-00",
    			"vendor": null,
    			"locationConsultant": null,
    			"draftDate": null,
    			"dueDate": null,
    			"status": "New",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": null,
    			"orderedDate": null,
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 7,
    			"locationId": 151561,
    			"cabinetId": 53910,
    			"pSiteID": 283840,
    			"locationServiceId": null,
    			"MsgFlag": 1,
    			"alertStatus": null,
    			"siteId": 283841,
    			"siteType": "PhaseI",
    			"statusDate": "2012-05-14 19:28:07",
    			"locationName": "Woburn Office",
    			"locationAddress": "204 West Cummings Park",
    			"locationState": "MA",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "01801",
    			"locationCity": "Woburn",
    			"locationCounty": "",
    			"applicationNumber": null,
    			"borrower": "Guy Tassinari",
    			"loanNumber": "ID12356",
    			"refNumber": "ID12356",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "2012-05-01",
    			"vendor": "Test Consultant Company",
    			"locationConsultant": "Test Consultant Company",
    			"draftDate": "2011-04-12",
    			"dueDate": "2012-05-01",
    			"status": "On Hold",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 297476,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "Appraisal",
    			"statusDate": "2012-04-03 00:00:00",
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-04-14",
    			"dueDate": "2012-04-21",
    			"status": "Out to Bid",
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-04-03",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 283800,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152916,
    			"siteType": "Appraisal",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Commercial Appraisal",
    			"completedDate": "0000-00-00",
    			"vendor": "Test Appraisal",
    			"locationConsultant": "Test Appraisal",
    			"draftDate": "2012-02-23",
    			"dueDate": "2012-03-01",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-02-14",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		},
    		{
    			"loanId": 2,
    			"locationId": 144275,
    			"cabinetId": 53910,
    			"pSiteID": 312589,
    			"locationServiceId": null,
    			"MsgFlag": 0,
    			"alertStatus": null,
    			"siteId": 152884,
    			"siteType": "PhaseI",
    			"statusDate": null,
    			"locationName": "Home Depot",
    			"locationAddress": "13915 New Halls Ferry Rd",
    			"locationState": "MO",
    			"cabinet": "Sample End-User Portfolio",
    			"locationZip": "63033",
    			"locationCity": "Florissant",
    			"locationCounty": "11113333",
    			"applicationNumber": null,
    			"borrower": "Kevin",
    			"loanNumber": "12345",
    			"refNumber": "12345",
    			"creationDate": null,
    			"createdTimeStamp": null,
    			"service": "Phase I ESA",
    			"completedDate": "0000-00-00",
    			"vendor": "unknown",
    			"locationConsultant": "unknown",
    			"draftDate": "2012-07-11",
    			"dueDate": "2012-07-19",
    			"status": null,
    			"isMonitored": 0,
    			"createdBy": " ",
    			"orderedBy": " ",
    			"orderedDate": "2012-06-22",
    			"MsgFlagExport": "",
    			"isMonitoredExport": "",
    			"alertStatusExport": ""
    		}]
    	}
            var length,start
            var factory = {};
    	var searchFieldsArray = [];

            var dashboardDataUrl = dashboardUrls.getDashboardData;

           factory.storeLengthOption = function(data){
               console.log("storeLengthOption");
              length = data;       
           }
           
           factory.getLengthOption = function(){
               return length;
           }
           
           factory.storeStartOption = function(data){
               console.log("storeStartOption");
               start = data;
           }
           
           factory.getStartOption = function(){
               return start;
           }

            /*factory.getDashboardData = function() {
                try{

                return $http.get(dashboardDataUrl,{headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }}).then(
                    function(result) {
                        
                        return result.data;
                    },function(error){
                        
                        return error;
                    });
                }
                catch(error){

                   
                    throw  error;
                }

            }*/
           
           factory.storeDashboardSearchField = function (obj) {
               if (searchFieldsArray.length != 0) {
                   angular.forEach(searchFieldsArray, function (searchField) {
                       if (searchField.placeHolder == obj.placeHolder) {
                           searchField.value = obj.value;
                       } else {
                           searchFieldsArray.push(obj);
                       }
                   })
               } else {
                   searchFieldsArray.push(obj);
               }


           }

           factory.getDashboardSearchField = function (obj) {

               return searchFieldsArray;
           }

           factory.getDashboardData = function() {
              

               return obj;
           }


            

            return factory;

        }
    ]);


;angular.module('LenderPortal').constant('dashboardResources', {

  
    

});
;angular.module('LenderPortal').constant('dashboardUrls', {

  
    getDashboardData  :  'modules/DashBoard/staticdata/sampleDashBoardJSON.js'
    

});;lenderPortalApp.service('applicationInfoSession',['GUID','$location','$window',function(GUID,$location){

      this.create = function () {

        //var pathArray = url.split('/');
        this.applicationInfoSession = {


                'applicationType' : '',
                'name' : '',
                'version' : '',
                'language': '',
                'languageVersion' : ''

        };

        /*sessionStorage.setItem("applicationObject", angular.toJson(this.applicationInfoSession));*/
        //localStorage.setItem('applicationObject',angular.toJson(this.applicationInfoSession));

      };

      this.getapplicationInfo = function(){

          return this.applicationInfoSession || {};
      }

      this.getFromSessionStorage = function(){
          return angular.fromJson($window.sessionStorage.getItem("applicationObject")) || {};
      }

      this.getFromLocalStorage = function(){
          return angular.fromJson(localStorage.getItem("applicationObject")) || {};
      }

      this.destroy = function () {

          this.applicationInfoSession = null;

      };

}]);
;lenderPortalApp.service('Encoder', [function () {
    var Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function (e) {
                var t = "";
                var n, r, i, s, o, u, a;
                var f = 0;
                e = Base64._utf8_encode(e);
                while (f < e.length) {
                    n = e.charCodeAt(f++);
                    r = e.charCodeAt(f++);
                    i = e.charCodeAt(f++);
                    s = n >> 2;
                    o = (n & 3) << 4 | r >> 4;
                    u = (r & 15) << 2 | i >> 6;
                    a = i & 63;
                    if (isNaN(r)) {
                        u = a = 64
                    } else if (isNaN(i)) {
                        a = 64
                    }
                    t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                }
                return t
            },
            decode: function (e) {
                var t = "";
                var n, r, i;
                var s, o, u, a;
                var f = 0;
                e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (f < e.length) {
                    s = this._keyStr.indexOf(e.charAt(f++));
                    o = this._keyStr.indexOf(e.charAt(f++));
                    u = this._keyStr.indexOf(e.charAt(f++));
                    a = this._keyStr.indexOf(e.charAt(f++));
                    n = s << 2 | o >> 4;
                    r = (o & 15) << 4 | u >> 2;
                    i = (u & 3) << 6 | a;
                    t = t + String.fromCharCode(n);
                    if (u != 64) {
                        t = t + String.fromCharCode(r)
                    }
                    if (a != 64) {
                        t = t + String.fromCharCode(i)
                    }
                }
                t = Base64._utf8_decode(t);
                return t
            },
            _utf8_encode: function (e) {
                e = e.replace(/\r\n/g, "\n");
                var t = "";
                for (var n = 0; n < e.length; n++) {
                    var r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r)
                    } else if (r > 127 && r < 2048) {
                        t += String.fromCharCode(r >> 6 | 192);
                        t += String.fromCharCode(r & 63 | 128)
                    } else {
                        t += String.fromCharCode(r >> 12 | 224);
                        t += String.fromCharCode(r >> 6 & 63 | 128);
                        t += String.fromCharCode(r & 63 | 128)
                    }
                }
                return t
            },
            _utf8_decode: function (e) {
                var t = "";
                var n = 0;
                var r = c1 = c2 = 0;
                while (n < e.length) {
                    r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r);
                        n++
                    } else if (r > 191 && r < 224) {
                        c2 = e.charCodeAt(n + 1);
                        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                        n += 2
                    } else {
                        c2 = e.charCodeAt(n + 1);
                        c3 = e.charCodeAt(n + 2);
                        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                        n += 3
                    }
                }
                return t
            }
        }

    this.encode = function (string) {

        // Create Base64 Object




        // Encode the String
        var encodedString = Base64.encode(string);
        return encodedString;




    };



    this.decode = function (encodedString) {
        // Decode the String
        var decodedString = Base64.decode(encodedString);
        return decodedString;

    }



}]);
;lenderPortalApp.service('environmentInfoSession',['GUID',function(GUID){

    this.create = function () {

        //Code snippet take to have correct browser name and version
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName  = navigator.appName;
        var fullVersion  = ''+parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion,10);
        var nameOffset,verOffset,ix;

        // In Opera 15+, the true version is after "OPR/"
        if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
         browserName = "Opera";
         fullVersion = nAgt.substring(verOffset+4);
        }
        // In older Opera, the true version is after "Opera" or after "Version"
        else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
         browserName = "Opera";
         fullVersion = nAgt.substring(verOffset+6);
         if ((verOffset=nAgt.indexOf("Version"))!=-1)
           fullVersion = nAgt.substring(verOffset+8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
         browserName = "Microsoft Internet Explorer";
         fullVersion = nAgt.substring(verOffset+5);
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
         browserName = "Chrome";
         fullVersion = nAgt.substring(verOffset+7);
        }
        // In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
         browserName = "Safari";
         fullVersion = nAgt.substring(verOffset+7);
         if ((verOffset=nAgt.indexOf("Version"))!=-1)
           fullVersion = nAgt.substring(verOffset+8);
        }
        // In Firefox, the true version is after "Firefox"
        else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
         browserName = "Firefox";
         fullVersion = nAgt.substring(verOffset+8);
        }
        // In most other browsers, "name/version" is at the end of userAgent
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
                  (verOffset=nAgt.lastIndexOf('/')) )
        {
         browserName = nAgt.substring(nameOffset,verOffset);
         fullVersion = nAgt.substring(verOffset+1);
         if (browserName.toLowerCase()==browserName.toUpperCase()) {
          browserName = navigator.appName;
         }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix=fullVersion.indexOf(";"))!=-1)
           fullVersion=fullVersion.substring(0,ix);
        if ((ix=fullVersion.indexOf(" "))!=-1)
           fullVersion=fullVersion.substring(0,ix);

        majorVersion = parseInt(''+fullVersion,10);
        if (isNaN(majorVersion)) {
         fullVersion  = ''+parseFloat(navigator.appVersion);
         majorVersion = parseInt(navigator.appVersion,10);
        }



          this.environmentObject = {

                  'userAgent' : navigator.userAgent,
                  'browserType' : '',
                  'browserName' : browserName,
                  'majorVersion' : fullVersion,
                  'minorVersion' : majorVersion,
                  'browserPlatform' : navigator.platform,
                  'referrerURL' : $(location).attr('href'),
                  'requestURL' : '',
                  'edrHost' :  '',
                  'edrEnvironment' : '',
                  'webRemoteClientIP' : '',
                  "addionalInfo":
                        [{
                            "key": "Cookies",
                            "value": navigator.cookieEnabled
                        }]
          };


          /*sessionStorage.setItem("environmentObject", angular.toJson(this.environmentObject));*/
          //localStorage.setItem('environmentObject',angular.toJson(this.environmentObject));
      };


      this.getenvironmentInfo = function(){
          return this.environmentObject || {};
      }

      this.getFromSessionStorage = function(){
          return angular.fromJson($window.sessionStorage.getItem("environmentObject")) || {};
      }

      this.getFromLocalStorage = function(){
          return angular.fromJson(localStorage.getItem("environmentObject")) || {};
      }
      this.destroy = function () {

          this.environmentObject = null;

      };

}]);
;lenderPortalApp.factory('GUID',[function(){

    var guid = {};

    var guidStorageVar;

    guid.create = function(){
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
             return v.toString(16);
        });
        guidStorageVar = guid;

        return guid;
    }

    guid.get = function(){

        return guidStorageVar;
    }

    return guid;

}]);
