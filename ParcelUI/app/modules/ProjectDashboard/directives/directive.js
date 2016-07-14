angular.module('ProjectDashboard').directive('activeClassPortfolio', ['$location', function ($location) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            var firstIndexUrl = angular.element('#portfolioUlNavigation').children().first().attr('active-class-portfolio');
            if (String($location.path()) === firstIndexUrl) angular.element('#buttonPrevious').hide();
            else angular.element('#buttonPrevious').show();
        }
    }
}])

angular.module('ProjectDashboard').directive('setAppendixTooltip', [function () {
    return {
        link: function (scope, elem, attr) {
            
            var appendiceCount = attr["appendiceIndexCount"];
            if(attr["appendixcount"] != "0"){
                 switch (appendiceCount + 1) {
                case 1:
                    elem.attr("title", "View files in appendix A:");
                    break;
                case 2:
                    elem.attr("title", "View files in appendix B:");
                    break;
                case 3:
                    elem.attr("title", "View files in appendix C:");
                    break;
                case 4:
                    elem.attr("title", "View files in appendix D:");
                    break;
                case 5:
                    elem.attr("title", "View files in appendix E:");
                    break;
                case 6:
                    elem.attr("title", "View files in appendix F:");
                    break;
                case 7:
                    elem.attr("title", "View files in appendix G:");
                    break;
                case 8:
                    elem.attr("title", "View files in appendix H:");
                    break;
                case 9:
                    elem.attr("title", "View files in appendix I:");
                    break;
                case 10:
                    elem.attr("title", "View files in appendix J:");
                    break;
                case 11:
                    elem.attr("title", "View files in appendix K:");
                    break;
                default:
                    elem.attr("title", "View files in appendix");
            }
        
            }
           
        }
    }
}])

angular.module('ProjectDashboard').directive('setFlag', [function () { return {
        restrict: 'A',
        scope: {
            data: '='
        },
        link: function (scope, elem, attr) {


            var seniorReviewerCount = 0;
            var reportWriterCount = 0;
            var generalCount = 0;
            var addressedCount = 0;

            if (scope.data.commentStatus === 'UNADDRESSED') {
                for (var i = 0; i < scope.data.comments.length; i++) {
                    var srCommentStatus = checkForSeniorReviewerComment(scope.data.comments[i].commentType, scope.data.comments[i].addressed);
                    if (srCommentStatus) {

                        addFlagClass('red');
                        seniorReviewerCount = seniorReviewerCount + 1;
                        generateToolTip(seniorReviewerCount, "SR");
                        return;
                    } else if (!srCommentStatus) {
                        var rwCommentStatus = checkForReportWriterComment(scope.data.comments[i].commentType, scope.data.comments[i].addressed);
                        if (rwCommentStatus) {
                            addFlagClass('blue');
                            reportWriterCount = reportWriterCount + 1;
                            generateToolTip(reportWriterCount, "RW");
                            return;
                        } else if (!rwCommentStatus) {
                            var genCommentStatus = checkForGeneralComment(scope.data.comments[i].commentType, scope.data.comments[i].addressed);
                            if (genCommentStatus) {
                                addFlagClass('black');
                                generalCount = generalCount + 1;
                                generateToolTip(generalCount, "GEN");
                        }
                        }
                    }
                }

            } else if (scope.data.commentStatus === 'ADDRESSED') {
                addFlagClass('green');
                addressedCount = addressedCount + 1;
                generateToolTip(addressedCount, "ADD");
            }

            function generateToolTip(commentCount, role) {
                if (role == "SR") {
                    if (commentCount > 0) {
                        elem.attr("title", "There is at least" + " " + commentCount + " " + "outstanding senior reviewer comment in this report");
                    }
                } else if (role == "RW") {
                    if (commentCount > 0) {
                        elem.attr("title", "There is at least" + " " + commentCount + " " + "outstanding report writer comment in this report");

                    }
                } else if (role == "GEN") {
                    if (commentCount > 0) {
                        elem.attr("title", "There is at least" + " " + commentCount + " " + "outstanding general comment in this report");

                    }
                } else if (role == "ADD") {
                    if (commentCount > 0) {
                        elem.attr("title", "There is at least" + " " + commentCount + " " + "addressed comment in this report");

                    }
                }
            }

            function checkForSeniorReviewerComment(commentType, addressed) {
                if (commentType === 'Senior Reviewer' && !addressed) {
                    return true;
                } else {
                    return false;
                }
            }

            function checkForReportWriterComment(commentType, addressed) {
                if (commentType === 'Report Writer' && !addressed) {
                    return true;
                } else {
                    return false;
                }
            }

            function checkForGeneralComment(commentType, addressed) {
                if (commentType === 'General Comment' && !addressed) {
                    return true;
                } else {
                    return false;
                }
            }

            function addFlagClass(color) {
                if (color == "red") {
                    elem.addClass('text-danger');
                    elem.removeClass('blueFlag');
                    elem.removeClass('text-success');
                } else if (color == "blue") {
                    elem.addClass('blueFlag');
                    elem.removeClass('text-danger');
                    elem.removeClass('text-success');
                } else if (color == "black") {
                    elem.removeClass('blueFlag');
                    elem.removeClass('text-danger');
                    elem.removeClass('text-success');
                } else if (color == "green") {
                    elem.addClass('text-success');
                    elem.removeClass('text-danger');
                    elem.removeClass('blueFlag');
                }
            }

        }
    }}])

angular.module('ProjectDashboard').directive('setSignatureTooltip', [function () {
    return {
        link: function (scope, elem, attr) {
            //console.log("signature " + attr["setSignatureTooltip"]);
            var signatureObject = JSON.parse(attr["setSignatureTooltip"]);
            if (signatureObject.signerAccountGuid != null) {
                elem.attr("title","Signed by: " + signatureObject.signOffUser.userName);

            } else {
                elem.attr("title", "The " + signatureObject.label + " " + "has not signed the report");
            }
        }
    }
}])

angular.module('ProjectDashboard').directive('displayPopover', ['$location', '$state', function ($location, $state) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            var column = attr.field;

            var orderStatusObject = JSON.parse(attr.displayPopover);

            switch (column) {
                case "packageOrdered":

                    if (orderStatusObject.packageOrdered || orderStatusObject.packageOrdered == "") {

                        if (orderStatusObject.packageOrdered.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.packageOrdered === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.packageOrdered === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }
                    }

                    break;

                case "radiusMapReportWithGeoCheck":
                    if (orderStatusObject.radiusMapReportWithGeocheck || orderStatusObject.radiusMapReportWithGeocheck == "") {

                        if (orderStatusObject.radiusMapReportWithGeocheck.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.radiusMapReportWithGeocheck === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.radiusMapReportWithGeocheck === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }
                    }

                    break;

                case "radiusMapReport":
                    if (orderStatusObject.radiusMapReport || orderStatusObject.radiusMapReport == "") {
                        if (orderStatusObject.radiusMapReport.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.radiusMapReport === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.radiusMapReport === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }
                    }

                    break;

                case "sanbornMap":
                    if (orderStatusObject.sanbornMap || orderStatusObject.sanbornMap == "") {

                        if (orderStatusObject.sanbornMap.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.sanbornMap === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.sanbornMap === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }
                    }

                    break;

                case "cityDirectoryAbstract":
                    if (orderStatusObject.cityDirectoryAbstract || orderStatusObject.cityDirectoryAbstract == "") {
                        if (orderStatusObject.cityDirectoryAbstract.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.cityDirectoryAbstract === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.cityDirectoryAbstract === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }
                    }
                    break;

                case "aerialPhoto":
                    if (orderStatusObject.aerialPhotoDecadePackage || orderStatusObject.aerialPhotoDecadePackage == "") {
                        if (orderStatusObject.aerialPhotoDecadePackage.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.aerialPhotoDecadePackage === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.aerialPhotoDecadePackage === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }
                    }
                    break;

                case "historicalTopoMap":
                    if (orderStatusObject.historicalTopMmap || orderStatusObject.historicalTopMmap == "") {
                        if (orderStatusObject.historicalTopMmap.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.historicalTopMmap === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.historicalTopMmap === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }
                    }
                    break;

                case "lienSearch":
                    if (orderStatusObject.lienSearch || orderStatusObject.lienSearch == "") {
                        if (orderStatusObject.lienSearch.toLowerCase() === "shipped") {
                            textForDelivered();

                        } else if (orderStatusObject.lienSearch === "InProduction") {
                            textForInProduction();
                        } else if (orderStatusObject.lienSearch === "Shipped-NoCoverage") {
                            textForShippedNoCoverage();
                        } else {
                            textForNotOrdered();
                        }


                    }
                    break;
            }





            function textForDelivered() {


                elem.attr("title", "Processing");
                elem.attr("data-content", "This product is being processed");

            }

            function textForShippedNoCoverage() {

                elem.attr("title", "Shipped-NoCoverage");
                elem.attr("data-content", "This product is Shipped-NoCoverage");

            }

            function textForNotOrdered() {

                elem.attr("title", "Not Ordered");
                elem.attr("data-content", "This product was not ordered");

            }



        }
    }
            }])


angular.module('ProjectDashboard').directive('embedContent', ['$sce', '$compile', '$timeout', function ($sce, $compile, $timeout) {
    return {
        restrict: 'A',
        scope: {
            appendixobject: '=',
            appendixlist: '='
        },

        link: function (scope, elem, attr) {
            elem.bind('click', function () {
                $('#embeddedUrl').remove();
                scope.appendixlist.displayDoc = true;

                if (scope.appendixobject.downloadURl == undefined)
                    scope.url = $sce.trustAsResourceUrl(scope.appendixobject.downloadURL);
                else
                    scope.url = $sce.trustAsResourceUrl(scope.appendixobject.downloadURl);

                var html = '<embed id="embeddedUrl"  ng-src = "{{url}}" style= "width:100%;height:100%"></embed>';
                var compiledHtml = $compile(html)(scope);
                $timeout(function () {
                    angular.element('#bottom-content').append(compiledHtml);
                }, 1000);
            })

        }
    }
}])

angular.module('ProjectDashboard').directive('resizer', function ($document) {

    return function ($scope, $element, $attrs) {

        $element.on('mousedown', function (event) {
            event.preventDefault();

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {

            if ($attrs.resizer == 'vertical') {
                // Handle vertical resizer
                var x = event.pageX;

                if ($attrs.resizerMax && x > $attrs.resizerMax) {
                    x = parseInt($attrs.resizerMax);
                }

                $element.css({
                    left: x + 'px'
                });

                $($attrs.resizerLeft).css({
                    width: x + 'px'
                });
                $($attrs.resizerRight).css({
                    left: (x + parseInt($attrs.resizerWidth)) + 'px'
                });

            } else {
                // Handle horizontal resizer
                var y = window.innerHeight - event.pageY;

                $element.css({
                    bottom: y + 'px'
                });

                $($attrs.resizerTop).css({
                    bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
                });
                $($attrs.resizerBottom).css({
                    height: y + 'px'
                });
            }
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    };
});