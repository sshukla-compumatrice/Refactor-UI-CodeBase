angular.module('ProjectDashboard').controller('Portfolio', ['$state', '$stateParams', '$scope', '$q', 'projectDashboardOperations', '$compile', '$timeout', 'localStorageObject', function ($state, $stateParams, $scope, $q, projectDashboardOperations, $compile, $timeout, localStorageObject) {

    var self = this;
    self.projectSearchCriteria = [];
    self.sampleTemplates = [];
    self.sampleReportsParts = [];
    self.sampleTemplateCheckbox = {};
    self.reportPartsModel = {};
    self.readDataCount = 0;
    self.readDataPage;
    //$scope.portfolioRequestID = $stateParams.portfolioRequestID;
    self.filterItem = "";
    self.showError = false;

    init();

    function init() {
        initializeSelect2CrossButton();
        self.projectSearchCriteria = [
            {
                'criteria': 'Unfinalized Projects',
                'value': 2
        }, {
                'criteria': 'Finalized Projects',
                'value': 3
        }, {
                'criteria': 'Projects Created in the last 90 days',
                'value': 4
        }, {
                'criteria': 'Projects created in ' + new Date().getFullYear(),
                'value': 5
        }, {
                'criteria': 'Projects created in ' + (new Date().getFullYear() - 1),
                'value': 6
        }, {
                'criteria': 'Projects with more than 2 reports',
                'value': 7
        }, {
                'criteria': 'Projects with more than 20 reports',
                'value': 8
        }];
        self.select = false;
        self.selectReports = false;
        self.selectReportsParts = false;
        //self.projectSelected = "";
        //routeAfterValidation();
        changeView();
        getLocalStorageObject();
    }

    function getLocalStorageObject() {

        self.portfolioLocalStorageArray = localStorageObject;


    }

    function initializeSelect2CrossButton(){
        $('abbr').on('click', function () {
            $('.select2-search-choice-close').css("display", "none");
        });
    }
    
    self.gotoProjectDashboard = function () {
        $state.go('projectDashboard', {
            projectGuid: $stateParams.projectGuid,
            accountGuid: $stateParams.accountGuid,
            companyGuid : $stateParams.companyGuid
        });

    }

    function changeView() {

        var stateName = $state.current.name;
        switch (stateName) {
            case 'Portfolio.Select':
                checkFormValidity(0);
                //self.select = true;
                break;
            case 'Portfolio.SelectReports':

                checkFormValidity(1);
                //self.selectReports = true;
                break;
            case 'Portfolio.SelectReportsParts':
                checkFormValidity(2);
                //self.selectReportsParts = true;
                break;
            default:
                $state.go('LandingPage');
                break;
        }
    }

    function checkFormValidity(linkIndex) {
        switch (linkIndex) {
            case 0:
                angular.element('#buttonPrevious').hide();
                if (!validateFirstStep()) {

                    angular.element('#portfolioUlNavigation li:eq(0)').addClass('active')
                        .siblings().removeClass('active').addClass('disabled');
                    self.select = true; // first view


                } else {

                    self.select = true; // first view
                    angular.element('#portfolioUlNavigation li:eq(0)').addClass('active')
                        .siblings().removeClass('active');
                    var isSecondStateValid = validateSecondStep();
                    if (isSecondStateValid) {
                        angular.element('#portfolioUlNavigation li:eq(0)').nextAll().removeClass('disabled');
                    } else {
                        angular.element('#portfolioUlNavigation li:eq(1)').nextAll().addClass('disabled');
                    }
                }

                break;
            case 1:
                if (!validateFirstStep()) {
                    angular.element('#buttonPrevious').hide();
                    angular.element('#portfolioUlNavigation li:eq(0)').addClass('active')
                        .siblings().removeClass('active').addClass('disabled');
                    self.select = true;

                } else {
                    getReports();
                    angular.element('#buttonPrevious').show();

                    angular.element('#portfolioUlNavigation li:eq(1)').addClass('active')
                        .siblings().removeClass('active').prev().removeClass('disabled');
                    self.selectReports = true;

                    var isSecondStateValid = validateSecondStep();
                    if (isSecondStateValid) {
                        angular.element('#portfolioUlNavigation li:eq(1)').nextAll().removeClass('disabled');
                    } else {
                        angular.element('#portfolioUlNavigation li:eq(1)').nextAll().addClass('disabled');
                    }

                }
                break;
            case 2:
                if (!validateFirstStep()) {
                    angular.element('#buttonPrevious').hide();
                    angular.element('#portfolioUlNavigation li:eq(0)').addClass('active')
                        .siblings().removeClass('active').addClass('disabled');
                    self.select = true;
                } else if (!validateSecondStep()) {
                    angular.element('#buttonPrevious').show();
                    angular.element('#portfolioUlNavigation li:eq(1)').addClass('active')
                        .siblings().removeClass('active').prev().removeClass('disabled');
                    angular.element('#portfolioUlNavigation li:eq(1)').nextAll().addClass('disabled');
                    self.selectReports = true;

                } else {
                    angular.element('#buttonPrevious').show();
                    angular.element('#portfolioUlNavigation li:eq(2)').addClass('active').removeClass('disabled')
                        .siblings().removeClass('active').removeClass('disabled');
                    self.selectReportsParts = true;

                }


                break;

        }
    }

    function validateSecondStep() {
        if (JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[1].selectionIndex.length > 0) {
            return true;
        } else return false;

    }

    function validateFirstStep() {
        if (JSON.stringify(JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[0].project) === '{}') return false;
        else return true;
    }

    function getReports() {
        var reportStatus = [];
        if (localStorage.getItem('portfolioLocalStorageArray') != undefined || localStorage.getItem('portfolioLocalStorageArray') != null) {
            var obj = JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[0];
            self.projectGUID = obj.project.projectGUID;
            $scope.delay = 0;
            $scope.minDuration = 0;
            $scope.message = 'Please Wait...';
            $scope.backdrop = true;
            $scope.promise = projectDashboardOperations.getProjectReports(self.projectGUID).then(function (response) {
                angular.forEach(response.reports, function (data) {
                    if(data.reportStatus != 'Final' && data.reportStatus != 'Non-Final')
                    reportStatus.push(data.reportStatus);
                })

                self.distinctReportStatus = getDistinctReportStatus(reportStatus);
                

                self.reports = response.reports;
                
            })
        }
    }
    
    

    function getDistinctReportStatus(reportStatusArray) {
        var u = {},
            a = [];
        for (var i = 0, l = reportStatusArray.length; i < l; ++i) {
            if (u.hasOwnProperty(reportStatusArray[i])) {
                continue;
            }
            a.push(reportStatusArray[i]);
            u[reportStatusArray[i]] = 1;
        }
        return a;
    }



    self.projectFilter = function (item) {
        $('.select2-chosen').text("Quick select a project");
        $('.select2-search-choice-close').css("display", "none");
        var obj = {};
        obj.value = item;
        self.portfolioLocalStorageArray[0].filterCriteria = obj;
        self.portfolioLocalStorageArray[0].project = {};
        localStorage.setItem('portfolioLocalStorageArray',
            JSON.stringify(self.portfolioLocalStorageArray));
        if (item === null) getProjects(item)
        else getProjects(item);
    }

    function getProjects(val) {
        if (val === 2) {
            self.filterItem = "UNFIN_PROJ";
        } else if (val === 3) {
            self.filterItem = "FIN_PROJ";
        } else if (val === 4) {
            self.filterItem = "LAST_90";
        } else if (val === 5) {
            self.filterItem = "CRE_CURYEAR";
        } else if (val === 6) {
            self.filterItem = "CRE_LASYEAR";
        } else if (val === 7) {
            self.filterItem = "MOR2_REP";
        } else if (val === 8) {
            self.filterItem = "MOR20_REP";
        } else {
            self.filterItem = "";
        }

        //$scope.projectListProvider.readData("", 1, 10);

    }

    self.setInitialCriteria = function () {
        if (localStorage.getItem('portfolioLocalStorageArray') != undefined || localStorage.getItem('portfolioLocalStorageArray') != null) {
            var obj = JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[0];
            self.searchCriteria = obj.filterCriteria.value;
        }


    }

    self.selectReport = function (index) {
        var returnedVal = checkAllReportsIfTrue();
        if (returnedVal) {
            angular.element('#portfolioUlNavigation li.active').next().removeClass('disabled');
        } else {
            angular.element('#portfolioUlNavigation li.active').next().addClass('disabled');
        }
        if (self.sampleTemplateCheckbox[index])

            self.portfolioLocalStorageArray[1].selectionIndex.push(index);

        else {
            angular.forEach(self.portfolioLocalStorageArray[1].selectionIndex, function (indexArray, count) {
                if (indexArray == index) {
                    self.portfolioLocalStorageArray[1].selectionIndex.splice(count, 1);
                }
            })
        }



        localStorage.setItem('portfolioLocalStorageArray', JSON.stringify(self.portfolioLocalStorageArray));


    }

    function checkAllReportsIfTrue() {
        for (var keys in self.sampleTemplateCheckbox)
            if (self.sampleTemplateCheckbox[keys]) return true;

        return false;
    }


    self.checkPreSelectedReport = function () {
        /*if (JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[1].selectionIndex.length > 0) {
            self.selected = true;
        }*/

        angular.forEach(self.portfolioLocalStorageArray[1].selectionIndex, function (indexArray, count) {
            self.sampleTemplateCheckbox[indexArray] = true;
        })
    }

    self.checkReportsOnCondition = function (status) {
        if (status === 'check-all') {
            self.portfolioLocalStorageArray[1].selectionIndex.length = 0;
            angular.forEach(self.reports, function (report, index) {
                self.sampleTemplateCheckbox[index] = true;
                self.portfolioLocalStorageArray[1].selectionIndex.push(index);
            })
            localStorage.setItem('portfolioLocalStorageArray', JSON.stringify(self.portfolioLocalStorageArray));
        } else if (status === 'uncheck-all') {
            uncheckAllReports();

        } else if (status === 'check-final') {
            self.portfolioLocalStorageArray[1].selectionIndex.length = 0;
            uncheckAllReports();
            angular.forEach(self.reports, function (report, index) {
                if (report.reportStatus === 'Final') {
                    self.sampleTemplateCheckbox[index] = true;
                    self.portfolioLocalStorageArray[1].selectionIndex.push(index);
                }

            })
            localStorage.setItem('portfolioLocalStorageArray', JSON.stringify(self.portfolioLocalStorageArray));

        } else if (status === 'check-nonfinal') {
            self.portfolioLocalStorageArray[1].selectionIndex.length = 0;
            uncheckAllReports();
            angular.forEach(self.reports, function (report, index) {
                if (report.reportStatus === 'Non-Final') {
                    self.sampleTemplateCheckbox[index] = true;
                    self.portfolioLocalStorageArray[1].selectionIndex.push(index);
                }

            })
            localStorage.setItem('portfolioLocalStorageArray', JSON.stringify(self.portfolioLocalStorageArray));

        } else {
            self.portfolioLocalStorageArray[1].selectionIndex.length = 0;
            uncheckAllReports();
            angular.forEach(self.reports, function (report, index) {
                if (report.reportStatus === status) {
                    self.sampleTemplateCheckbox[index] = true;
                    self.portfolioLocalStorageArray[1].selectionIndex.push(index);
                }

            })
            localStorage.setItem('portfolioLocalStorageArray', JSON.stringify(self.portfolioLocalStorageArray));

        }



    }


    self.selectReportParts = function (parentIndex, childIndex) {

        if (self.reportPartsModel[parentIndex + '' + childIndex]) {
            self.portfolioLocalStorageArray[2].selectionIndex.push(parentIndex + '' + childIndex);

        } else {
            angular.forEach(self.portfolioLocalStorageArray[2].selectionIndex, function (indexArray, count) {
                if (indexArray == parentIndex + '' + childIndex) {
                    self.portfolioLocalStorageArray[2].selectionIndex.splice(count, 1);
                }
            })
        }

        localStorage.setItem('portfolioLocalStorageArray', JSON.stringify(self.portfolioLocalStorageArray));

    }

    self.checkPreSelectedReportParts = function (parentIndex, childIndex) {
        if (self.sampleReportsParts[parentIndex].reportsParts[childIndex].value)
            self.reportPartsModel[parentIndex + '' + childIndex] = true;

        localStorage.setItem('portfolioLocalStorageArray', JSON.stringify(self.portfolioLocalStorageArray));

    }

    $scope.generateMarkUp = function (result) {
        var markup = "<div>";
        markup += "<div>" + result.name + "</div>";
        markup += "</div>";
        return markup;
    }

    $scope.displayProject = function (result) {
        if ($state.is('Portfolio.Select')) {

            if (JSON.stringify(JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[0].project) !== '{}' && JSON.stringify(result) === '{}') {
                angular.element('#portfolioUlNavigation li:eq(1)').removeClass('disabled');
                result = JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[0].project;

            }
            self.showError = false;
            $('.select2-chosen').text(result.name);
           // angular.element('.select2-choice').val(result.name);

            var obj = {};
            obj.name = result.name;
            obj.projectGUID = result.projectGUID;
            self.portfolioLocalStorageArray[0].project = obj;
            localStorage.setItem('portfolioLocalStorageArray',
                JSON.stringify(self.portfolioLocalStorageArray));
            /*if(JSON.stringify(result) === '{}') {
                
                self.showError = true;
            }
            else self.showError = false;*/
        }
    }

    $scope.projectListProvider = {
        readData: function (term, page, pageSize) {
            if (term != undefined) {

                if (self.readDataCount == 0) {
                    projectDashboardOperations.setTerm(term);
                    self.readDataCount = self.readDataCount + 1;
                    self.readDataPage = page - 1;
                } else {
                    if ($('.select2-input').val() == projectDashboardOperations.getTerm()) {
                        self.readDataPage = self.readDataPage + pageSize;
                    } else {
                        projectDashboardOperations.setTerm(term);
                        self.readDataPage = page - 1;
                    }

                }
            }
            var deferred = $q.defer();
            if (term == "") {
                if (self.filterItem == "") getAllProjectListData(page, pageSize, deferred);
                else getProjectsWithCriteria(page, pageSize, deferred);

            } else if (term != "") {

                if (self.filterItem == "") searchProjectWithoutCriteria(page, pageSize, deferred, term);
                else searchProjectWithCriteriaAndFilter(page, pageSize, deferred, term);



            }



            return deferred.promise;
        }
    };

    function searchProjectWithoutCriteria(page, pageSize, deferred, term) {
        projectDashboardOperations.getProjectSearchData({

                limit: pageSize,
                offset: (page * pageSize) - pageSize,
                projectName: term

            })
            .then(function (result) {


                deferred.resolve(result.projects);
            }, function (reason) {

                deferred.reject(reason);
            });
    }

    function searchProjectWithCriteriaAndFilter(page, pageSize, deferred, term) {
        projectDashboardOperations.getSearchedPortfolioProjects({

                limit: pageSize,
                offset: (page * pageSize) - pageSize,
                projectName: term,
                filterText: self.filterItem

            })
            .then(function (result) {


                deferred.resolve(result.projects);
            }, function (reason) {

                deferred.reject(reason);
            });

    }

    function getAllProjectListData(page, pageSize, deferred) {
        projectDashboardOperations.getProjectListData({

                limit: pageSize,
                offset: (page * pageSize) - pageSize
            })
            .then(function (result) {


                deferred.resolve(result.projects);
            }, function (reason) {

                deferred.reject(reason);
            });
    }

    function getProjectsWithCriteria(page, pageSize, deferred) {
        projectDashboardOperations.getProjectsForPortfolio({

            limit: pageSize,
            offset: (page * pageSize) - pageSize,
            filterText: self.filterItem
        }).
        then(function (response) {

            deferred.resolve(response.projects);


        }, function (error) {

            deferred.reject(reason);
        })
    }

    $scope.setInitialSelectedProject = function () {
        if (localStorage.getItem('portfolioLocalStorageArray') != undefined || localStorage.getItem('portfolioLocalStorageArray') != null) {
            var obj = JSON.parse(localStorage.getItem('portfolioLocalStorageArray'))[0];
            //angular.element('.select2-choice').val(obj.name); //self.searchCriteria = obj.filterCriteria.value;
            $('.select2-chosen').text(obj.name);
            $('.select2-search-choice-close').css("display", "block");
        }
        else{
            $('.select2-chosen').text("Quick select a project");
            $('.select2-search-choice-close').css("display", "none");
        }
    }

    $scope.$on('show-error-message', function (event, args) {

        if (args.obj === "firstStep") {
            self.showError = true;
            self.errorMessage = "Please select a project to proceed to next step";
        } else if (args.obj === "secondStep") {
            self.showError = true;
            self.errorMessage = "Please select a report to proceed to next step";
        }
    })

}])