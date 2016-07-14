angular.module('SRFModule').controller('SRFNavCtrl', ['$scope', '$stateParams', '$rootScope', 'SRFResources', '$location', 'SectionViewLoanData', '$state', '$modal', 'globalValues', function ($scope, $stateParams, $rootScope, SRFResources, $location, SectionViewLoanData, $state, $modal, globalValues) {

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

}]);