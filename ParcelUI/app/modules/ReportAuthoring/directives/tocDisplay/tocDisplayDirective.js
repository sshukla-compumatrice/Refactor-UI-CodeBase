angular.module('ReportAuthoring').directive('tocDisplay', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/modules/ReportAuthoring/directives/tocDisplay/tocView.html',
        scope: {
            sections: '=',
            selectedSection: '=',
            sectionClick: "&",
            flagClick: "&"
        },
        link: function (scope, element, attrs) {
            scope.sectionTotal = "";
            var sectionTotalCost = 0;
            scope.calculateRecommendationCost = function (section, selectedSection) {

                if (section.sections.length > 0) {
                    sectionTotalCost = 0;
                    var calculateTotalCost = totalCost(section, selectedSection);
                    section.totalCost = calculateTotalCost;
                } else {
                    if (section.totalCost != undefined) {
                        section.totalCost = section.totalCost;
                    }
                }
            }

            function totalCost(section, selectedSection) {

                angular.forEach(section.sections, function (section, index) {
                    if (section.length != undefined && section.length > 0) {
                        totalCost(section);
                    } else {
                        if (section.totalCost != undefined) {
                            sectionTotalCost = parseFloat(sectionTotalCost) + parseFloat(section.totalCost);
                        }
                    }

                });
                return sectionTotalCost;

            }

            function checkCommentAddress(section, isAddress) {
                var iFlag = false;
                if (isAddress) {
                    if (section.hasComments && section.isCommentsAddressed) {
                        iFlag = true;
                    }
                } else {
                    if (section.hasComments && !section.isCommentsAddressed) {
                        iFlag = true;
                    }
                }
                /*if (!iFlag) {
                    for (var index = 0; section.sections.length > index; index++) {
                        checkCommentAddress(section, isAddress)
                    }
            }*/

                return iFlag;
            }

            scope.isShowCommentAddress = function (section, isAddress) {

                var val = checkCommentAddress(section, isAddress);

                return val;

            }

            $rootScope.$on('load-ReportWriting-Toc', function (event, args) {

                var selectedSection = scope.sections.filter(function (item) {
                    return item.sectionGUID.toLowerCase() == args.selectedSection.sectionGUID.toLowerCase()
                })
                if (selectedSection.length > 0) {
                    selectedSection[0].totalCost = args.selectedSection.totalCost;
                }
                angular.forEach(scope.sections, function (section, index) {
                    scope.calculateRecommendationCost(section);
                });



            });

        }
    };
}]);


angular.module('ReportAuthoring').directive('nestedSections', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            nestedSections: '=',
            selectedSection: '=',
            nestedSectionClick: "&",
            nestedSectionFlagClick: "&"
        },
        link: function (scope, element, attrs) {
            if (angular.isArray(scope.nestedSections)) {

                element.append("<toc-display sections='nestedSections' id='tocSection_{section.hasComments}' section-click='nestedSectionClick({section: section})' flag-click='nestedSectionFlagClick({section: section})' selected-section='selectedSection'></toc-display>");
                $compile(element.contents())(scope);
            }
        }
    };
}]);
