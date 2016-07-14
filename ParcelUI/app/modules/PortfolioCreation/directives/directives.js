angular.module('PortfolioCreation').directive('activeClass', ['$location', '$state', function ($location, $state) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            // default page for any step
            // redirect to default on page load
            if ($state.current.name != "PortfolioCreation.ProjectInformation" && $state.current.name != "LenderPortfolioCreation.ProjectInformation") {
                if ($state.current.name.startsWith("PortfolioCreation")) {
                    $state.go("PortfolioCreation.ProjectInformation");
                } else if ($state.current.name.startsWith("LenderPortfolioCreation")) {
                    $state.go("LenderPortfolioCreation.ProjectInformation");
                }
                if (attr.urlparams == "/PortfolioCreation/ProjectInformation") {
                    elem.removeClass("disabled");
                    elem.addClass("active");
                } else {
                    elem.removeClass("active");
                    elem.addClass("disabled");
                }
            } else {
                if (String($location.path()) === String(attr.urlparams)) {
                    elem.removeClass("disabled");
                    elem.addClass("active");
                } else {
                    elem.removeClass("active");
                    elem.addClass("disabled");
                }
            }

            elem.bind('click', function () {
                if (!elem.attr('status') || (elem.attr('status') != "completed" && elem.attr('status') != 'current')) return;

                elem.removeClass('disabled');
                elem.addClass('active');

                //elem.nextAll().addClass('disabled');
                elem.siblings().removeClass('active');

                if (attr.urlparams == '/PortfolioCreation/ProjectInformation') {

                    angular.element('#previousStep').hide();
                    angular.element('#cancelThisProject_bottombtn').hide();
                    angular.element('#cancelThisProject_topbtn').show();
                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.ProjectInformation');

                } else if (attr.urlparams == '/PortfolioCreation/ReportInformation' || attr.urlparams == '/PortfolioCreation/UploadSites' || attr.urlparams == '/PortfolioCreation/UploadedSiteDetails' || attr.urlparams == '/PortfolioCreation/UploadedSitesReportSelection') {

                    angular.element('#previousStep').show();
                    angular.element('#cancelThisProject_bottombtn').show();
                    angular.element('#cancelThisProject_topbtn').hide();
                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.ReportInformation');

                } else if (attr.urlparams == '/PortfolioCreation/FeeInformation') {

                    angular.element('#previousStep').show();
                    angular.element('#cancelThisProject_bottombtn').show();
                    angular.element('#cancelThisProject_topbtn').hide();
                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.FeeInformation');

                } else if (attr.urlparams == '/PortfolioCreation/Attachments') {

                    angular.element('#previousStep').show();
                    angular.element('#cancelThisProject_bottombtn').show();
                    angular.element('#cancelThisProject_topbtn').hide();
                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.Attachments');

                } else if (attr.urlparams == '/PortfolioCreation/GrantAccess') {

                    angular.element('#previousStep').show();
                    angular.element('#cancelThisProject_bottombtn').show();
                    angular.element('#cancelThisProject_topbtn').hide();
                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.GrantAccess');
                } else if (attr.urlparams == '/PortfolioCreation/ConfirmProjectInformation') {
                    angular.element('#previousStep').show();
                    angular.element('#cancelThisProject_bottombtn').show();
                    angular.element('#cancelThisProject_topbtn').hide();
                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.ConfirmProjectInfo');
                } else if (attr.urlparams == '/PortfolioCreation/Email') {
                    angular.element('#previousStep').show();
                    angular.element('#cancelThisProject_bottombtn').show();
                    angular.element('#cancelThisProject_topbtn').hide();
                    scope.nextButtonText = "Finish";

                    $state.go('PortfolioCreation.Email');
                }

            });

        }
    }


}]);



angular.module('PortfolioCreation').directive('shiftNext', ['$location', '$state', function ($location, $state) {

    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            if ($location.path() == '/PortfolioCreation/Email') {

                scope.nextButtonText = "Finish";

            }
            elem.bind('click', function () {

                var myform = scope.portfolio.submitForm;
                if (myform && myform.$invalid) return;

                angular.element('#ulnavigation li.active').attr('status', 'completed');

                if ($location.path() == '/PortfolioCreation/ProjectInformation') {
                    $state.go('PortfolioCreation.ReportInformation');

                    angular.element('#previousStep').show();
                    angular.element('#cancelThisProject_bottombtn').show();
                    angular.element('#cancelThisProject_topbtn').hide();

                } else if ($location.path() == '/PortfolioCreation/ReportInformation' || $location.path() == '/PortfolioCreation/UploadSites' || $location.path() == '/PortfolioCreation/UploadedSiteDetails' || $location.path() == '/PortfolioCreation/UploadedSitesReportSelection') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.FeeInformation');
                } else if ($location.path() == '/PortfolioCreation/FeeInformation') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.Attachments');
                } else if ($location.path() == '/PortfolioCreation/Attachments') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.GrantAccess');
                } else if ($location.path() == '/PortfolioCreation/GrantAccess') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.ConfirmProjectInfo');
                } else if ($location.path() == '/PortfolioCreation/ConfirmProjectInformation') {

                    scope.nextButtonText = "Finish";
                    $state.go('PortfolioCreation.Email');
                }


                var nxt = angular.element('#ulnavigation li.active').next();
                nxt.addClass('active');
                nxt.removeClass('disabled');
                nxt.attr('status', 'current');
                angular.element('#ulnavigation li.active').prev().removeClass('active');

            })
        }
    }

}]);

angular.module('PortfolioCreation').directive('shiftPrevious', ['$location', '$state', function ($location, $state) {

    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            if ($location.path() == '/PortfolioCreation/ProjectInformation') {
                angular.element('#previousStep').hide();
                angular.element('#cancelThisProject_bottombtn').hide();
                angular.element('#cancelThisProject_topbtn').show();

            } else {

                angular.element('#previousStep').show();

            }
            elem.bind('click', function () {

                if ($location.path() == '/PortfolioCreation/ReportInformation' || $location.path() == '/PortfolioCreation/UploadSites' || $location.path() == '/PortfolioCreation/UploadedSiteDetails' || $location.path() == '/PortfolioCreation/UploadedSitesReportSelection') {
                    $state.go('PortfolioCreation.ProjectInformation');
                    scope.nextButtonText = "Next";
                    angular.element('#previousStep').hide();
                    angular.element('#cancelThisProject_bottombtn').hide();
                    angular.element('#cancelThisProject_topbtn').show();
                } else if ($location.path() == '/PortfolioCreation/FeeInformation') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.ReportInformation');
                } else if ($location.path() == '/PortfolioCreation/Attachments') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.FeeInformation');
                } else if ($location.path() == '/PortfolioCreation/GrantAccess') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.Attachments');
                } else if ($location.path() == '/PortfolioCreation/ConfirmProjectInformation') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.GrantAccess');
                } else if ($location.path() == '/PortfolioCreation/Email') {

                    scope.nextButtonText = "Next";
                    $state.go('PortfolioCreation.ConfirmProjectInfo');
                }

                angular.element('#ulnavigation li.active').prev().addClass('active');
                angular.element('#ulnavigation li.active').next().removeClass('active');

            });

            /*var previousDisableAttr = attr["previousClickDisable"];
            scope.$watch(previousDisableAttr, function(val) {
                scope.previousClickDisable = val;
            });*/
        }
    }

}]);




angular.module('PortfolioCreation').directive('cancelProject', ['$location', '$state', function ($location, $state) {

    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            if ($location.path() == '/PortfolioCreation/ProjectInformation') {
                angular.element('#cancelThisProject_topbtn').show();
                angular.element('#cancelThisProject_bottombtn').hide();
            } else {


                angular.element('#cancelThisProject_topbtn').hide();
                angular.element('#cancelThisProject_bottombtn').show();
            }

            /*var previousDisableAttr = attr["previousClickDisable"];
            scope.$watch(previousDisableAttr, function(val) {
                scope.previousClickDisable = val;
            });*/
        }
    }

}]);
