angular.module('ParcelWriter').directive('includeSections', ['$http', '$compile', 'ParcelWriterFactory', function ($http, $compile, ParcelWriterFactory) {
    return {
        restrict: 'AE',
        transclude: true,
        templateUrl: 'app/modules/ParcelWriter/views/subSections.html',
        scope: {
            parentsection: '=',
            parcelWriter: '='
        },
        link: function (scope, elem, attr) {
            scope.bindLanguage = function (language) {
                if (language.keyword) {
                    return language.keyword;
                } else if (!language.keyword) {
                    var tmp = document.createElement("DIV");
                    tmp.innerHTML = language.text;

                    var substring = tmp.textContent.substring(0, 25) + '...' || tmp.innerText.substring(0, 25) + '...' || "";
                    return substring;
                }

            }
        },
        controller: function ($scope) {
            $scope.popover = {
                optionSelected: false,
                getInstrContent: function (parentSection) {
                    var instructionText = '';
                    angular.forEach(parentSection.languages, function (lang) {
                        if (lang.category.toLowerCase() == 'instructions') {
                            instructionText += lang.text.toString();
                        }
                    });
                    return instructionText;
                }
            };

            $scope.popover.selectOption = function (hide, language) {
                console.log("sub section popover checked");

                language.isChecked = true;

                hide();
            }

            $scope.popover.deSelectOption = function (hide, language) {
                console.log("sub section popover unchecked " + $scope);

                language.isChecked = false;

                hide();
            }

            $scope.checkIsSubSectionChecked = function (language) {
                console.log("sub section checked");
                if (language.isChecked) {
                    for (var i = 0; i < $scope.parcelWriter.keywords.length; i++) {

                        if ($scope.parcelWriter.keywords[i].keyword === language.keyword) {
                            $scope.parcelWriter.keywords[i].checked = true;
                        }
                    }

                } else {
                    for (var i = 0; i < $scope.parcelWriter.keywords.length; i++) {
                        if ($scope.parcelWriter.keywords[i].keyword === language.keyword) {
                            $scope.parcelWriter.keywords[i].checked = false;
                        }
                    }

                }

            }

            $scope.checkShowInstructions = function (section) {
                if (section.languages && section.languages.length) {
                    var instructionsCategory = section.languages.filter(function (lang) {
                        if (lang && lang.category) {
                            return lang.category.toLowerCase() === 'instructions';
                        }
                    }).length;
                    if (instructionsCategory > 0) return true;
                    return false;
                }
            };

            $scope.checkOptionsSubSections = function (section) {

                if (section.languages && section.languages.length) {
                    var optionsCategory = section.languages.filter(function (lang) {
                        if (lang && lang.category) {
                            return lang.category.toLowerCase() != 'instructions';
                        }
                    }).length;
                    if (optionsCategory > 0) return false;
                    return true;
                } else {
                    return true;
                }
            };
        }
    }
}])


angular.module('ParcelWriter').directive('includeSubsections', ['$http', '$compile', '$timeout', 'ParcelWriterFactory', function ($http, $compile, $timeout, ParcelWriterFactory) {
    return {
        restrict: 'AE',
        scope: {
            parentsection: '='

        },
        link: function (scope, element, attr) {

            scope.parcelWriter = scope.$parent.parcelWriter;


            scope.subsections = scope.parentsection.subSection;
            if (angular.isArray(scope.subsections) && scope.subsections.length > 0) {


                $http.get('app/modules/ParcelWriter/views/recursiveSection.html').then(function (response) {

                    element.append($compile(response.data)(scope));
                })


            }
            scope.bindLanguage = function (language) {
                if (language.keyword) {
                    return language.keyword;
                } else if (!language.keyword) {
                    var tmp = document.createElement("DIV");
                    tmp.innerHTML = language.text;

                    var substring = tmp.textContent.substring(0, 25) + '...' || tmp.innerText.substring(0, 25) + '...' || "";
                    return substring;
                }

            }
        },
        controller: function ($scope) {

            $scope.popover = {

            };

            $scope.popover = {
                optionSelected: false,
                getInstrContent: function (parentSection) {
                    var instructionText = '';
                    angular.forEach(parentSection.languages, function (lang) {
                        if (lang.category.toLowerCase() == 'instructions') {
                            instructionText += lang.text.toString();
                        }
                    });
                    return instructionText;
                }
            };

            $scope.popover.selectOption = function (hide, language) {
                console.log("rec section popover checked");
                language.isChecked = true;

                hide();
            }

            $scope.popover.deSelectOption = function (hide, language) {
                console.log("rec section popover unchecked");
                language.isChecked = false;

                hide();
            }


            $scope.checkIsRecursiveChecked = function (language) {
                console.log("recursive checked");

                var obj = {
                    sectionGuid: language.sectionGUID,

                    languageItemGuids: language.languageItemGuid
                }

                if (language.isChecked) {
                    for (var i = 0; i < $scope.$parent.parcelWriter.keywords.length; i++) {
                        if ($scope.$parent.parcelWriter.keywords[i].keyword === language.keyword) {
                            $scope.$parent.parcelWriter.keywords[i].checked = true;
                        }
                    }



                } else {

                    for (var i = 0; i < $scope.$parent.parcelWriter.keywords.length; i++) {
                        if ($scope.$parent.parcelWriter.keywords[i].keyword === language.keyword) {
                            $scope.$parent.parcelWriter.keywords[i].checked = false;
                        }
                    }

                }



            }

            $scope.checkShowInstructionsChild = function (section) {
                if (section.languages && section.languages.length) {
                    var instructionsCategory = section.languages.filter(function (lang) {
                        if (lang && lang.category) {
                            return lang.category.toLowerCase() === 'instructions';
                        }
                    }).length;
                    if (instructionsCategory > 0) return true;
                    return false;
                }
            };

            $scope.checkOptionsRecursive = function (section) {

                if (section.languages && section.languages.length) {
                    var optionsCategory = section.languages.filter(function (lang) {
                        if (lang && lang.category) {
                            return lang.category.toLowerCase() != 'instructions';
                        }
                    }).length;
                    if (optionsCategory > 0) return false;
                    return true;
                } else {
                    return true;
                }
            };
        }
    }
}])