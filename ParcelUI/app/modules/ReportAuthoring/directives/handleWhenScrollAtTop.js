angular.module('ReportAuthoring').directive('scrollableTopContainer', ['scrollableElement', function (scrollableElement) {
    return {
        restrict: 'A',
        compile: function (tElem, tAttrs) {
            return {
                pre: function (scope, iElem, iAttrs) {
                    scrollableElement.el = iElem;
                },
                post: function (scope, iElem, iAttrs) {

                }
            }
        }
    }
}]);

angular.module('ReportAuthoring').value('scrollableElement', {
    el: null
});



angular.module('ReportAuthoring').directive('handleWhenScrollAtTop', ['$window', '$parse', 'scrollableElement', function ($window, $parse, scrollableElement) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var $elem = null;

            if (scrollableElement && scrollableElement.el) {
                $elem = angular.element(scrollableElement.el);
            }
            if (!$elem) {
                $elem = angular.element($window); // wrap window object as jQuery object
                element.attr('default-scroll', true);
            }

            /*scope.$on('set-skip-handle-scroll-top-condition-true', function(event){
                scope.skipHandleScrollTopCondition = true;
            })
            scope.$on('set-skip-handle-scroll-top-condition-false', function(event){
                scope.skipHandleScrollTopCondition = false;
            })*/



            var sectionId = attrs.reportSectionId;
            var topOffset = parseInt(attrs.scrollTopOffset);
            // var handler = attrs.handleWhenScrollAtTop;
            var skipCondition = attrs.skipHandleScrollTopCondition;

            // var handlerParsed = $parse(handler);
            var skipConditionParsed = $parse(skipCondition);

            var lastScrollTop = 0;
            var objid = 1;
            var rightContentBottom, activeInlineCk, activeInlineCkBottom, latestCkBlurId, activeInlineCkToolbarTop, activeInlineCkParentTop, activeInlineCkParentBottom, sharedSpaceDivBottom;

            $elem.on('scroll', function (e) {
                try {

                    if (JSON.parse(window.sessionStorage.getItem('handleAfterScroll')))
                        return;

                    var shouldSkip = skipConditionParsed(scope);
                    if (shouldSkip) {
                        var childSectionArray = scope.reportWrite.childSectionArray;

                        /*scope.skipHandleScrollTopCondition = false;*/
                        // return
                        var currentSectionId = window.sessionStorage.getItem('currentSectionId');
                        currentSectionId = parseInt(currentSectionId);
                        var currentIndex = childSectionArray.indexOf(currentSectionId);

                        if (currentIndex > -1) {
                            var scrollsectionId = 0;
                            var st = $('#rightContent').scrollTop();
                            if (st > lastScrollTop) {
                                if (currentIndex < (childSectionArray.length - 1)) {
                                    scrollsectionId = childSectionArray[currentIndex + 1];

                                    var sectionId = '#section_' + parseInt(currentSectionId);
                                    var nextsectionId = '#section_' + parseInt(scrollsectionId);

                                    if ($('#rightContent').height() >= ($(sectionId).height() + $(sectionId).offset().top) - ($('#rightContent').offset().top / 2) + ($(nextsectionId).offset().top / 2)) {

                                        scope.$emit('set-selected-section', {
                                            sectionId: scrollsectionId
                                        });
                                        //  }
                                    } else {
                                        if (currentIndex == childSectionArray.length - 1) {
                                            if ($('#rightContent').height() >= $(sectionId).offset().top) {
                                                scope.$emit('set-selected-section', {
                                                    sectionId: scrollsectionId
                                                });
                                            }

                                        }

                                    }
                                }

                            } else {
                                if (currentIndex != 0) {
                                    scrollsectionId = childSectionArray[currentIndex - 1];
                                    var sectionId = '#section_' + parseInt(scrollsectionId);

                                    if ($('#rightContent').height() <= ($(sectionId).height() + $(sectionId).offset().top) - $('#rightContent').offset().top) {

                                        // if (!($(sectionId).offset().top < 0)) {
                                        scope.$emit('set-selected-section', {
                                            sectionId: scrollsectionId
                                        });
                                        //  }

                                    } else {
                                        //condition for parent sectionid
                                        if ($('#rightContent').height() >= $(sectionId).offset().top - $('#rightContent').offset().top) {

                                            if (scope.$parent.ck.sectionIdList.indexOf(scrollsectionId) > -1) {
                                                scope.$emit('set-selected-section', {
                                                    sectionId: scrollsectionId
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            lastScrollTop = st;
                        }


                    } else {


                        var allsectionIdsArray = scope.$parent.ck.allsectionIdList;

                        var currentSectionId = window.sessionStorage.getItem('currentSectionId');

                        currentSectionId = parseInt(currentSectionId);
                        var scrollsectionId = 0;
                        var st = $('#rightContent').scrollTop();
                        var currentSectionindex = allsectionIdsArray.indexOf(currentSectionId);

                        if (currentSectionindex > -1) {
                            if (st > lastScrollTop) {
                                scrollsectionId = allsectionIdsArray[currentSectionindex + 1];
                                //var sectionId = '#section_' + parseInt(scrollsectionId);
                                var sectionId = '#section_' + parseInt(currentSectionId);
                                var nextsectionId = '#section_' + parseInt(scrollsectionId);

                                $(sectionId).click(function () {
                                    var intsectionId = $(this).attr('id').split('_')[1];
                                    if (currentSectionId != intsectionId) {
                                        scope.$emit('set-selected-section', {
                                            sectionId: sectionId,
                                            scrollType: 'DOWN'
                                        });
                                    }
                                });

                                if ($('#rightContent').height() >= ($(sectionId).height() + $(sectionId).offset().top) - ($('#rightContent').offset().top / 2) + ($(nextsectionId).offset().top / 2)) {

                                    scope.$emit('set-selected-section', {
                                        sectionId: scrollsectionId,
                                        scrollType: 'DOWN'
                                    });
                                    //  }

                                }

                            } else {
                                // scrollsectionId = parseInt(currentSectionId) - 1;

                                scrollsectionId = allsectionIdsArray[currentSectionindex - 1];

                                var sectionId = '#section_' + parseInt(scrollsectionId);
                                $(sectionId).click(function () {
                                    var intsectionId = $(this).attr('id').split('_')[1];
                                    if (currentSectionId != intsectionId) {
                                        scope.$emit('set-selected-section', {
                                            sectionId: sectionId,
                                            scrollType: 'UP'
                                        });
                                    }
                                });
                                //  if ($('#rightContent').height() <= $(sectionId).offset().top - $('#rightContent').offset().top + $(sectionId).offset().top) {
                                if ($('#rightContent').height() <= $(sectionId).offset().top - $('#rightContent').offset().top + ($(sectionId).offset().top + ($('#rightContent').height() / 2))) {
                                    scope.$emit('set-selected-section', {
                                        sectionId: scrollsectionId,
                                        scrollType: 'UP'
                                    });
                                    //}

                                }

                            }
                            lastScrollTop = st;

                        }
                    }

                } catch (e) {

                }
                // }

                /* angular.forEach(arr, function (item) {

                         if (keepGoing) {

                             var sectionId = '#section_' + item;
                             if ($('#rightContent').height() >= $(sectionId).offset().top - $('#rightContent').offset().top) {

                                 if ($(sectionId).offset().top < 0) {

                                     //$('#tocSection_' + item).removeClass('bg-gray');
                                     //$('#tocSection_' + item).removeClass('current-section');

                                 } else {
                                     keepGoing = false;
                                     if (item != '1' && item != currentSectionId) {
                                         $('.toc-section').removeClass('bg-gray');
                                         $('.toc-section').removeClass('current-section');
                                         $('#tocSection_' + item).addClass('bg-gray');
                                         $('#tocSection_' + item).addClass('current-section');
                                         //console.log('correct item:' + item);

                                         scope.$emit('set-selected-section', {
                                             sectionId: item
                                         });


                                         //lastScrollPos = $(sectionId).offset().top;
                                     } else {
                                         keepGoing = false;
                                         var currentSelectedEltId = $('.toc-nav li a.bg-gray').attr('id');
                                         if (currentSelectedEltId && currentSelectedEltId.split('_')[1] === "2") {
                                             $('.toc-section').removeClass('bg-gray');
                                             $('.toc-section').removeClass('current-section');
                                             $('#tocSection_' + item).addClass('bg-gray');
                                             $('#tocSection_' + item).addClass('current-section');
                                             if (item != currentSectionId)
                                                 scope.$emit('set-selected-section', {
                                                     sectionId: item
                                                 });
                                         }
                                     }
                                 }
                             }
                         } // end of if(keepGoing)
                     }) */
                //end of foreach
            });
        }
    };
            }]);


////New Approach for scrolling
//var $scope, $location;
//var app = angular.module('ReportAuthoring', []);

/*angular.module('ReportAuthoring').service('anchorSmoothScroll', function () {

    this.scrollTo = function (eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for (var i = startY; i < stopY; i += step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        }
        for (var i = startY; i > stopY; i -= step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            }
            return y;
        }

    };

});*/
