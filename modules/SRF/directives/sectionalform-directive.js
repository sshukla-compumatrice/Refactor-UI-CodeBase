'use strict';
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

