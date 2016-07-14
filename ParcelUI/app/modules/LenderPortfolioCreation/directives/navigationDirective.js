angular.module('LenderPortfolioCreation').directive('activeClassLender', ['$location', '$state', function($location, $state) {

    return {
        restrict: 'A',

        link: function(scope, elem, attr) {



            if (String($location.path()) === String(attr.urlparams)) {
                elem.removeClass("disabled");
                elem.addClass("active");

            } else {

                elem.removeClass("active");
                elem.addClass("disabled");
            }

            elem.bind('click', function() {
                if (!elem.attr('status') || (elem.attr('status') != "completed" && elem.attr('status') != 'current')) return;

                elem.removeClass('disabled');
                elem.addClass('active');

                //elem.nextAll().addClass('disabled');
                elem.siblings().removeClass('active');

                if (attr.urlparams == '/LenderPortfolioCreation/ProjectInformation') {

                    angular.element('#previousStep').hide();
                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.ProjectInformation');

                } else if (attr.urlparams == '/LenderPortfolioCreation/ReportInformation') {

                    angular.element('#previousStep').show();
                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.ReportInformation');

                } else if (attr.urlparams == '/LenderPortfolioCreation/FeeInformation') {

                    angular.element('#previousStep').show();
                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.SelectConsultantWithFee');

                } else if (attr.urlparams == '/LenderPortfolioCreation/Attachments') {

                    angular.element('#previousStep').show();
                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.Attachments');

                } else if (attr.urlparams == '/LenderPortfolioCreation/GrantAccess') {

                    angular.element('#previousStep').show();
                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.GrantAccess');

                } else if (attr.urlparams == '/LenderPortfolioCreation/ConfirmProjectInformation') {
                    angular.element('#previousStep').show();
                    scope.nextButtonText = "Finish";
                    $state.go('LenderPortfolioCreation.ConfirmProjectInfo');

                }

            });

        }
    }


}]);



angular.module('LenderPortfolioCreation').directive('shiftPreviousLender', ['$location', '$state', function($location, $state) {

    return {
        restrict: 'A',
        link: function(scope, elem, attr) {

            if ($location.path() == '/LenderPortfolioCreation/ProjectInformation') {
                angular.element('#previousStep').hide();
            } else {
                angular.element('#previousStep').show();
            }

            elem.bind('click', function() {

                if ($location.path() == '/LenderPortfolioCreation/ReportInformation' || $location.path() == '/LenderPortfolioCreation/UploadSites' || $location.path() == '/LenderPortfolioCreation/UploadedSiteDetails' || $location.path() == '/LenderPortfolioCreation/UploadedSitesReportSelection') {
                    $state.go('LenderPortfolioCreation.ProjectInformation');
                    scope.nextButtonText = "Next";
                    angular.element('#previousStep').hide();
                } else if ($location.path() == '/LenderPortfolioCreation/SelectEnvironmentalConsultant' || $location.path() == '/LenderPortfolioCreation/SelectConsultantWithFee') {

                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.ReportInformation');
                } else if ($location.path() == '/LenderPortfolioCreation/Attachments') {

                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.SelectConsultantWithFee');
                } else if ($location.path() == '/LenderPortfolioCreation/GrantAccess') {

                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.Attachments');
                } else if ($location.path() == '/LenderPortfolioCreation/ConfirmProjectInformation') {

                    scope.nextButtonText = "Next";
                    $state.go('LenderPortfolioCreation.GrantAccess');
                }

                angular.element('#ulnavigation li.active').prev().addClass('active');
                angular.element('#ulnavigation li.active').next().removeClass('active');

            })
        }
    }

}]);