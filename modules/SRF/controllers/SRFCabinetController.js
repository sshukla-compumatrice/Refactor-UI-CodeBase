angular.module('SRFModule').controller('SRFCabinetCtrl', ['$scope', '$stateParams', 'shareDataService',
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
