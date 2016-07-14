angular.module('PortfolioCreation').controller('PortfolioProjectInfoController', ['$scope', '$state', '$filter', function ($scope, $state, $filter) {
    var self = this;


    $("#ulnavigation .active").removeClass('active');
    $("#ulnavigation #projectInformationId").addClass('active');

    $scope.portfolio.currentSection = $scope.portfolio.sectionCollection.projectInformation;
    self.serviceResponseAlert = false;
    $scope.open = {
        draftDate: false,
        finalDate: false,
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return false; // (mode === 'day' && (new Date().toDateString() == date.toDateString()));
    };

    $scope.dateOptions = {
        showWeeks: false,
        startingDay: 1
    };

    $scope.timeOptions = {
        readonlyInput: true,
        showMeridian: false
    };

    $scope.openCalendar = function (e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
    };
    $scope.closeCalendar = function (e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = false;
    };

    // watch date4 and date5 to calculate difference
    $scope.$watch(function () {
        return $scope.dates;
    }, function () {

    }, true);



    self.data = $scope.portfolio.project || {
        addSiteMethod: $scope.portfolio.addSiteMethodTypes.manual,
        client: {}
    };


    if ($scope.portfolio.project) {
        self.data.addSiteMethod = $scope.portfolio.addSiteMethod;
        if ($scope.portfolio.project.draftDueDate) {
            // var tempDraftDueDate = new Date($scope.portfolio.project.draftDueDate);
            var tempDraftDueDate = $filter('date')($scope.portfolio.project.draftDueDate, "yyyy-MM-dd hh:mm:ss");
            $scope.portfolio.project.draftDueDate = tempDraftDueDate.split(' ')[0];

        }

        if ($scope.portfolio.project.finalDueDate) {

            var tempFinalDueDate = $filter('date')($scope.portfolio.project.finalDueDate, "yyyy-MM-dd hh:mm:ss");
            $scope.portfolio.project.finalDueDate = tempFinalDueDate.split(' ')[0];
        }
    }

    // over-write main method
    var main = $scope.portfolio;
    main.getSubmitData = function () {

        self.data.draftDueDate = $filter('date')(new Date(self.data.draftDueDate), "yyyy-MM-dd hh:mm:ss");
        self.data.finalDueDate = $filter('date')(new Date(self.data.finalDueDate), "yyyy-MM-dd hh:mm:ss");
        $scope.portfolio.addSiteMethod = self.data.addSiteMethod;
        return self.data;
    }
    main.clearErrorDisplay = function () {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function (errorMsg) {

        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }

    $(document).ready(function () {
        $("input[type='radio']:first").attr("tabindex", "8");
        $("input[type='radio']").focusin(function () {
            $("input[type='radio']").attr("tabindex", "0");
            $(this).attr("tabindex", "8");
        });
    });



    /*$('body').keydown(function (event) {

        if (event.keyCode == 9) {
            $('#draftDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').hide();
            $('#finalDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').hide();
        }
    });*/

    /*  $('body').mouseup(function (event) {
        var target = event.toElement || event.relatedTarget || event.originalEvent.target;
        switch (target.attributes.id.value) {
            case 'draftDate':
                $('#draftDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').show();
                if (event.keyCode == 46 || event.keyCode == 9 || event.keyCode == 8) {
                    $('#draftDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').hide();
                }
                break;
            case 'finalDate':
                $('#finalDate').next('.dropdown-menu.dropdown-menu-left.ng-pristine.ng-valid.ng-valid-date-disabled').show();
                break;

            default:
        }
    });
*/
    //$('#finalDate').val();

    /*$('#draftDate').datepicker().on('changeDate', function (ev) {
        $('#draftDate').datepicker('hide');
        $('#finalDate').focus();

    });
    */

    // $('#finalDate').datepicker().on('changeDate', function (ev) {
    //   $('#finalDate').datepicker('hide');
    //  $("#projectcomments").focus();

    // });

            }])