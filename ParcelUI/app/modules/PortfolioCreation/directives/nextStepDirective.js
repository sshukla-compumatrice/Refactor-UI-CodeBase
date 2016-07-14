angular.module('PortfolioCreation').constant('PortfolioCreationStateNavigation', {
    'PortfolioCreation.ProjectInformation': {
        nextState: 'PortfolioCreation.ReportInformation'
    },
    'PortfolioCreation.ReportInformation': {
        nextState: 'PortfolioCreation.FeeInformation'
    },
    'PortfolioCreation.UploadSiteSpreadSheet': {
        nextState: 'PortfolioCreation.UploadedSiteDetails',
        hasSuccessiveSection: true
    },
    'PortfolioCreation.UploadedSiteDetails': {
        nextState: 'PortfolioCreation.UploadedSitesReportSelection',
        hasSuccessiveSection: true
    },
    'PortfolioCreation.UploadedSitesReportSelection': {
        nextState: 'PortfolioCreation.FeeInformation'
    },
    'PortfolioCreation.FeeInformation': {
        nextState: 'PortfolioCreation.Attachments'
    },
    'PortfolioCreation.Attachments': {
        nextState: 'PortfolioCreation.GrantAccess'
    },
    'PortfolioCreation.GrantAccess': {
        nextState: 'PortfolioCreation.ConfirmProjectInfo'
    },
    'PortfolioCreation.ConfirmProjectInfo': {
        nextState: 'PortfolioCreation.Email'
    },
    'PortfolioCreation.Email': {
        nextState: 'PortfolioCreation.SetupSuccess'
    }
});
angular.module('PortfolioCreation').directive('nextStep', ['$location', '$state', function ($location, $state) {

    return {
        restrict: 'A',
        scope: {
            getSubmitProjectData: '&',
            form: '=',
            currentProjectData: '=',
            responseReceiver: '&',
            buttonText: '=',
            tabIndex: '&',
            stateNavigation: '=',
            errorHandler: '&',
            disableStepWise: '='
        },
        template: '<button id="nextButton" class="btn btn-md btn-primary pull-right" type="button" tabindex="{{tabIndex}}" ng-click="submitPortfolioProject()" ng-disabled="disableStepWise"> {{buttonText}} </button>',
        replace: true,
        controller: ['$scope', '$state', 'ParcelUI.Resources', 'ProjectStartupAPI', function ($scope, $state, ParcelUI_Resources, ProjectStartupAPI) {

            $scope.waitingProcessResources = ParcelUI_Resources.waitingProcessResources;
            $scope.disableStepWise = false;

            var PortfolioCreationStateNavigation = $scope.stateNavigation;
            // save $state as scope property
            // to make it accessible in scope methods
            $scope.state = $state;
            $scope.buttonText = "Next";
            if ($scope.state.current.name == "PortfolioCreation.ProjectInformation") {
                $scope.tabIndex = "9";
            } else if ($scope.state.current.name == "LenderPortfolioCreation.ProjectInformation") {
                $scope.tabIndex = "10";
            }
            // submit project data
            $scope.submitPortfolioProject = function () {
                // form validation

                if ($scope.form && $scope.form.$invalid) {
                    processError('Invalid Form Submission');
                    var inputElements = document.getElementsByName($scope.form.$name);
                    angular.element(inputElements).find(':input[required],multiselect[required]').trigger('blur');
                    return;
                }

                // state information
                var currentState = $scope.state.current.name;
                var currentStateNavigation = PortfolioCreationStateNavigation[currentState];
                var nextState = currentStateNavigation.nextState;


                // retrieve project data from current child controller
                var toSubmitProjectData = $scope.getSubmitProjectData();

                if (!toSubmitProjectData) {
                    navigationHandler(null, currentState, currentStateNavigation, nextState, null);
                    return;
                }

                var companyId = 12;
                var projectID = toSubmitProjectData.projectGUID;
                var addSiteMethod = toSubmitProjectData.addSiteMethod;
                delete toSubmitProjectData.addSiteMethod;

                var servicePromise = currentState == "PortfolioCreation.Email" || currentState == "LenderPortfolioCreation.ConfirmProjectInfo" ? ProjectStartupAPI.postData(companyId, toSubmitProjectData) : currentState == 'PortfolioCreation.ProjectInformation' || currentState == 'LenderPortfolioCreation.ProjectInformation' ? ProjectStartupAPI.postDraft(companyId, toSubmitProjectData) : ProjectStartupAPI.putDraft(projectID, toSubmitProjectData);


                $scope.waitingProcessResources.promise = null;
                $scope.waitingProcessResources.promise = servicePromise;

                $scope.disableStepWise = true;

                servicePromise.then(function (responseData) {
                    if (currentState == "PortfolioCreation.ProjectInformation" || currentState == "LenderPortfolioCreation.ProjectInformation") {

                        responseData.addSiteMethod = addSiteMethod;
                    }
                    navigationHandler(responseData, currentState, currentStateNavigation, nextState, toSubmitProjectData);
                }, function (error) {

                    processError(error);
                }).finally(function () {
                    $scope.disableStepWise = false;
                });
            }

            var processError = function (error) {
                var errorMsg = error;
                $scope.errorHandler({
                    errorMsg: errorMsg
                });
            }

            var navigationHandler = function (responseData, currentState, currentStateNavigation, defaultNextState, dataRetrievedForSubmit) {

                var nextState = defaultNextState;

                if (currentState == 'PortfolioCreation.ProjectInformation' || currentState == 'LenderPortfolioCreation.ProjectInformation') {
                    // return response

                    var receivedProjectData = responseData;

                    // NOTE: for mock purposes, removing locations from response
                    if (receivedProjectData) {
                        var temp = angular.copy(receivedProjectData);
                        receivedProjectData = temp;
                        //receivedProjectData.locations = null;//Commented by Yogesh 
                        processServiceResponseData(receivedProjectData);
                    }

                    var portfolioType = currentState.split('.')[0];
                    // special cases for step 1

                    if (responseData.addSiteMethod == 'upload') {
                        if (receivedProjectData && receivedProjectData.locations && receivedProjectData.locations.length) {
                            // where sites have already been added
                            // screen to display added sites with add/edit actions
                            nextState = portfolioType + '.UploadedSiteDetails';
                        } else if (dataRetrievedForSubmit && dataRetrievedForSubmit.addSiteMethod == 'upload') {
                            // case where sites are not added
                            // and option to upload spreadsheet selected by user
                            nextState = portfolioType + '.UploadSiteSpreadSheet';
                        }
                    }
                } else {
                    // return response
                    var receivedProjectData = responseData
                    if (receivedProjectData) {
                        processServiceResponseData(receivedProjectData);
                    }

                    if (currentState == "PortfolioCreation.ReportInformation" && $scope.currentProjectData && $scope.currentProjectData.locations && $scope.currentProjectData.locations.length) {
                        nextState = 'PortfolioCreation.UploadedSiteDetails';
                    } else if ((currentState == 'LenderPortfolioCreation.ReportInformation' || currentState == 'LenderPortfolioCreation.UploadedSitesReportSelection') && $scope.currentProjectData && $scope.currentProjectData.outToBid) {
                        nextState = 'LenderPortfolioCreation.SelectEnvironmentalConsultant';
                    }
                }
                changeToNextState(currentStateNavigation, nextState);
            }

            var processServiceResponseData = function (receivedProjectData) {
                $scope.responseReceiver({
                    projectData: receivedProjectData
                });
            }

            var changeToNextState = function (currentStateNavigation, nextState) {
                if (!currentStateNavigation.hasSuccessiveSection) {
                    // update status for current step
                    var currentActive = angular.element('#ulnavigation li.active');
                    currentActive.attr('status', 'completed');
                    // make next step active
                    var nextElem = currentActive.next();
                    nextElem.addClass('active');
                    nextElem.removeClass('disabled');
                    nextElem.attr('status', 'current');
                    // make current inactive
                    currentActive.removeClass('active');
                }
                $state.go(nextState);
                if (nextState == 'PortfolioCreation.Email' || nextState == 'LenderPortfolioCreation.ConfirmProjectInfo') {
                    $scope.buttonText = "Finish";
                } else {
                    $scope.buttonText = "Next";
                }


                if (nextState == 'PortfolioCreation.ReportInformation') {
                    $scope.tabIndex = "21";
                } else if (nextState == 'PortfolioCreation.FeeInformation') {
                    $scope.tabIndex = "5";
                } else if (nextState == 'PortfolioCreation.Attachments') {
                    $scope.tabIndex = "2";
                } else if (nextState == 'PortfolioCreation.GrantAccess') {
                    $scope.tabIndex = "2";
                } else if (nextState == 'PortfolioCreation.ConfirmProjectInfo') {
                    $scope.tabIndex = "7";
                } else if (nextState == 'PortfolioCreation.Email') {
                    $scope.tabIndex = "3";
                }

                if (nextState == 'LenderPortfolioCreation.ReportInformation') {
                    $scope.tabIndex = "21";
                } else if (nextState == 'LenderPortfolioCreation.FeeInformation') {
                    $scope.tabIndex = "5";
                } else if (nextState == 'LenderPortfolioCreation.Attachments') {
                    $scope.tabIndex = "2";
                } else if (nextState == 'LenderPortfolioCreation.GrantAccess') {
                    $scope.tabIndex = "2";
                } else if (nextState == 'LenderPortfolioCreation.ConfirmProjectInfo') {
                    $scope.tabIndex = "9";
                }

                angular.element('#cancelThisProject_topbtn').hide();
                angular.element('#cancelThisProject_bottombtn').show()
                angular.element('#previousStep').show();
            }
        }]
    }

}]);