lenderPortalApp.controller('HeaderController', ['$modal', 'shareDataService', '$scope', '$state', '$location', '$rootScope', 'SRFResources', 'HeaderFactory', '$log', 'globalValues', 'Encoder', '$timeout', '$q', 'searchLoanService',
                                                        function ($modal, shareDataService, $scope, $state, $location, $rootScope, SRFResources, HeaderFactory, $log, globalValues, Encoder, $timeout, $q, searchLoanService) {


        $('#loanSearchDiv .dropdown-menu').click(function (e) {
            e.stopPropagation();
        });

        $scope.readDataCount = 0;
         $scope.readDataPage;                                                   
        $scope.termInput = "";
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

        
        this.policiesType = ['Environmental','Appraisal','Flood'];





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



        $scope.loanListProvider = {
            

            readData: function (term, page, pageSize) {
                if(term != undefined){
                    if($scope.readDataCount == 0){
                        HeaderFactory.setTerm(term);
                        $scope.readDataCount = $scope.readDataCount  + 1;
                        $scope.readDataPage = page - 1;
                    }
                    else{
                       if($('.select2-input').val() == HeaderFactory.getTerm()){
                           $scope.readDataPage = $scope.readDataPage + pageSize;
                       }
                        else{
                             HeaderFactory.setTerm(term);
                            $scope.readDataPage = page - 1;
                        }
                        console.log("next load");
                    }
                }
                

             





                var deferred = $q.defer();
                if (term == "") {
                    console.log("without term");
                    searchLoanService.getDefaultLoans.get({

                            limit: pageSize,
                            offset: 0
                        })
                        .$promise.then(function (result) {
                            console.log("without term data " + result);
                            deferred.resolve(result);
                        }, function (reason) {
                            console.log("without term data " + JSON.stringify(reason));
                            deferred.reject(reason);
                        });
                } else if (term != "") {
                    
                    
                    
                    searchLoanService.getSearchLoans.get({
                            term: term,
                            limit: pageSize,
                            offset: $scope.readDataPage
                        })
                        .$promise.then(function (result) {
                            console.log("with term data " + result);
                            deferred.resolve(result);
                        }, function (reason) {
                            console.log("with term data " + JSON.stringify(reason));
                            deferred.reject(reason);
                        });
                }



                return deferred.promise;
            }
        };





        this.redirectToPropertyOverview = function (property) {
            /*$state.go('Property.Overview',{'LocationID' : property.locationID, 'PID' : property.cabinetID ,'address': property.address, 'city':property.city, 'state':property.state,'zip': property.zip});*/

            $state.go('Property.Overview', {
                'LocationID': property.locationID,
                'PID': property.cabinetID
            });

        }


        $timeout(function(){
            angular.element("[data-toggle=popover]").popover();
        },1000);
        






}]);