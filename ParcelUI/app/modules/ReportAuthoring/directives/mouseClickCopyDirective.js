var copyPasteApp = angular.module('ReportAuthoring');

copyPasteApp.directive('mouseClickCopy', ['MouseClickCopyService', '$rootScope', '$parse','$localStorage', function(MouseClickCopyService, $rootScope, $parse,$localStorage) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.addClass('pointer');

            var extractFrom = element;
            var childElemId = attrs['mouseClickCopy'];
            if (childElemId) {
                var childEl = element[0].querySelector("[id='" + childElemId + "']");
                var angularEl = angular.element(childEl);

                if (angularEl) {
                    extractFrom = angularEl;
                }


            }

            var enableConditionExp = attrs["oneClickCopyCondition"];
            if (enableConditionExp != "true") return;

            element.bind('click', function(event) {
                var toCopy = extractFrom.html();
                var alreadySelected = MouseClickCopyService.checkIfElemAlreadySelected(element, null);
                if (event.ctrlKey) {
                    // if element already selected, then unselect
                    // else select current                    
                    if (alreadySelected) {
                        unselectElement(element);
                    } else {
                        selectElement(element, childElemId, toCopy);
                    }
                } else {
                    // if element already selected, then unselect
                    // else unselect others, and then select current
                    if (alreadySelected) {
                        if (MouseClickCopyService.collection.length > 1) {
                            unselectAll();
                            selectElement(element, childElemId, toCopy);
                        } else {
                            unselectElement(element);
                        }
                    } else {
                        unselectAll();
                        selectElement(element, childElemId, toCopy);
                    }
                }
            });

            function selectElement(el, childElemId, toCopyHtml) {
                
               if( window.sessionStorage.getItem("reportStatusAbbreviation") != 'FIN')
                   {
                       MouseClickCopyService.insert(toCopyHtml, el, childElemId);
                scope.$emit("text-copied",null);
                 
                setSelectIndicator(el);
                   }
                
            }

            function unselectElement(el) {
                MouseClickCopyService.clear(el, null, false);
                 scope.$emit("text-unselected",null);
                removeSelectedIndicator(el);
            }

            function unselectAll() {
                var coll = MouseClickCopyService.collection;
                for (var i = 0; i < coll.length; i++) {
                    var item = coll[i];
                    var el = item.parentEl;
                    removeSelectedIndicator(el);
                }
                MouseClickCopyService.clear(null, null, true);
            }

            function setSelectIndicator(el) {
                element.attr('clicked', true);
                element.addClass('language-selected');
            }

            function removeSelectedIndicator(el) {
                el.removeClass('language-selected');
                el.removeAttr('clicked');
            }


            $rootScope.$on(MouseClickCopyService.broadcastMsgText_copyRetrieved, function() {
                removeSelectedIndicator(element);
            });

        }
    }
}]);

copyPasteApp.service('MouseClickCopyService', ['$rootScope', function($rootScope) {

    this.finalHtml_;
    this.separator = "";//<br>";
    this.lineSeperator = "<p>&nbsp;</p>";
    this.broadcastMsgText_copyRetrieved = "mouse-click-copy-text-retrieved";
    this.collection = [];

    function ElItem(html, parentEl, copyFromElId) {
        this.html = html;
        this.parentEl = parentEl;
        this.copyFromElId = copyFromElId;
    }

    function getMergedHtml() {
        if (!this.collection || !this.collection.length) return "";

        var merged = null;
        var coll = this.collection;
        for (var i = 0; i < coll.length; i++) {
            var item = coll[i];
            merged = merged ? merged + this.separator + item.html : item.html;
        }
        return merged;
    }

    this.insert = function(html, parentEl, copyFromElId) {
        if (html) {
            this.finalHtml_ = this.finalHtml_ ? this.finalHtml_ + this.lineSeperator + html : html;
            var item = new ElItem(html, parentEl, copyFromElId);
            this.collection.push(item);
        }
    }

    this.checkIfElemAlreadySelected = function(parentEl, copyFromElId) {
        if (!this.collection || !this.collection.length) return false;

        var coll = this.collection;
        for (var i = 0; i < coll.length; i++) {
            var item = coll[i];
            if ((parentEl && parentEl == item.parentEl) || (copyFromElId && copyFromElId == item.copyFromElId)) {
                return true;
            }
        }
        return false;
    };

    this.clear = function(parentEl, copyFromElId, isClearAll) {
        if (!this.finalHtml_ || !this.collection || !this.collection.length) return;

        if (isClearAll) {
            this.finalHtml_ = null;
            this.collection = [];
            return;
        }

        if (parentEl || copyFromElId) {
            var coll = this.collection;
            var modified = false;
            for (var i = 0; i < coll.length; i++) {
                var item = coll[i];
                if ((parentEl && parentEl == item.parentEl) || (copyFromElId && copyFromElId == item.copyFromElId)) {
                    modified = true;
                    coll.splice(i, 1);
                    break;
                }
            }
            if (modified) {
                this.finalHtml_ = getMergedHtml();
            }
        }
    };

    this.getCopied = function() {
        //$('iframe').contents().find('body.cke_show_borders').removeClass('copy-cursor');
        var copied = angular.copy(this.finalHtml_);
        var coll = this.collection;
        var copyContent = copied ? {
            html: copied,
            //collection: coll,
            source: coll && coll.length ? coll[0].copyFromElId : null
        } : undefined;
        $rootScope.$broadcast(this.broadcastMsgText_copyRetrieved);
        this.clear(null, null, true);

        return copyContent;
    };
}]);