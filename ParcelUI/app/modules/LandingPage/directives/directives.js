angular.module('ParcelUI').directive('datePicker', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.datepicker({
                format: 'mm/dd/yyyy'
            });
        }
    };
});


angular.module('ParcelUI').directive('hideShowColumns', [function () {
    return {
        restrict: 'A',
        scope: {
            columnindex: '@'
        },
        link: function (scope, elem, attr) {
            elem.bind('click', function () {
                if ($(this).prop('checked')) {
                    scope.$emit('show-hide-column', scope.columnindex);
                    console.log("checked " + scope.columnindex);
                } else {
                    scope.$emit('show-hide-column', scope.columnindex);
                    console.log(" not checked " + scope.columnindex);
                }
            });
        }
    }
}]);


angular.module('ParcelUI').directive('activityUpdisplay', [function () {
    return {
        restrict: 'A',

        link: function (scope, elem, attr) {
            elem.bind('click', function () {
                if ($(".report-panel").hasClass("maximized")) {
                    $(".report-panel").removeClass("maximized");
                    $(".report-panel").addClass("default");
                    $(".down-arrow").removeClass("text-muted");
                    $(".down-arrow").addClass("pointer");
                    $(window).scrollTop(0);
                } else if ($(".report-panel").hasClass("default")) {
                    $(".report-panel").removeClass("default");
                    $(".report-panel").addClass("minimized");
                    $(".up-arrow").removeClass("pointer");
                    $(".up-arrow").addClass("text-muted");
                    $(".down-arrow").removeClass("text-muted");
                    $(".down-arrow").addClass("pointer");
                }
            });
        }
    }
}])

angular.module('ParcelUI').directive('activityDowndisplay', [function () {
    return {
        scope: {
            length: "="
        },
        link: function (scope, elem, attr) {
            console.log('attr', scope.length);
            elem.bind('click', function () {

                if (scope.length <= 6 && $(".report-panel").hasClass("minimized")) {
                    $(".report-panel").removeClass("minimized");
                    $(".report-panel").addClass("maximized");
                    $(".up-arrow").addClass("pointer");
                    $(".up-arrow").removeClass("text-muted");
                    $(".down-arrow").addClass("text-muted");
                    $(".down-arrow").removeClass("pointer");

                } else if (scope.length <= 6) {
                    $(".report-panel").removeClass("default");
                    $(".report-panel").addClass("maximized");
                    $(".down-arrow").addClass("text-muted");
                    $(".down-arrow").removeClass("pointer");

                } else if ($(".report-panel").hasClass("minimized")) {
                    $(".report-panel").removeClass("minimized");
                    $(".report-panel").addClass("default");
                    $(".up-arrow").addClass("pointer");
                    $(".up-arrow").removeClass("text-muted");


                } else if ($(".report-panel").hasClass("default")) {
                    $(".report-panel").removeClass("default");
                    $(".report-panel").addClass("maximized");
                    $(".down-arrow").addClass("text-muted");
                    $(".down-arrow").removeClass("pointer");
                }
            });
        }
    }
}])


angular.module('ParcelUI').directive('menuToggle', [function () {
    return {
        restrict: 'A',

        link: function (scope, elem, attr) {
            window.onresize = function () {
                if ($(window).width() < 1285) {
                    $(".report-menu").removeClass("col-md-3");
                    $(".report-menu").addClass("report-menu-width");
                    $(".report-menu").addClass("col-sm-3");
                    $(".report-contain").removeClass("col-md-9 col-md-12");
                    $(".report-contain").addClass("col-sm-12");
                    $("#menu-toggle").addClass("report-menubar-toggled");
                    $("#menu-toggle").addClass("sidemenubar-icon");
                    $("#menu-toggle").addClass("menu-toggle");
                }
            }

            elem.bind('click', function () {

                console.log("menutoggle");
                $(".report-menu").toggleClass("col-md-3");
                $(".report-menu").toggleClass("report-menu-width");
                $(".report-menu").toggleClass("col-sm-3");
                $(".report-contain").toggleClass("col-md-9 col-md-12");
                $(".report-contain").toggleClass("col-sm-12");
                $("#menu-toggle").toggleClass("report-menubar-toggled");
                $("#menu-toggle").toggleClass("sidemenubar-icon");
                $("#menu-toggle").toggleClass("menu-toggle");
            });
        }
    }
}]);



angular.module('ParcelUI').directive('openHideshowpopover', ['$compile', '$timeout', function ($compile, $timeout) {

    var itemsTemplate = '<div class="row">' +
        '<div class="col-md-6 col-xs-12" ng-repeat="item in items">' +
        '<input ng-model="item.default"  columnindex = "{{item.index}}"' +
        'type="checkbox"></input> {{item.name}}  </div> </div>' +
        '<div><button close-popover class="btn-sm btn">Close</button>' +
        '<button save-settings class="btn-sm btn btn-default">Save tab settings</button></div>'

    var getTemplate = function (contentType) {
        var template = '';
        switch (contentType) {
        case 'items':
            template = itemsTemplate;
            break;
        }
        return template;
    }
    return {
        restrict: 'A',
        transclude: true,
        template: "<span ng-transclude></span>",
        scope: {
            items: '=',
            title: '@'
        },
        link: function (scope, elem, attr) {
            elem.bind('click', function (e) {
                e.stopPropagation();
                $timeout(function () {
                    var popOverContent;
                    if (scope.items) {
                        var html = getTemplate("items");
                        popOverContent = $compile(html)(scope);
                    }
                    var options = {
                        content: popOverContent,
                        placement: "right",
                        html: true,
                        title: scope.title,
                        container: 'body'
                    };

                    $(elem).popover(options);
                }, 5000);
            });
        }
    }
}]);

angular.module('ParcelUI').directive('textChange', [function () {
    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            if (attr.textChange == "CreationDate") {
                $(elem).attr("readOnly", true);

                elem.datepicker({
                        format: "m/d/yyyy",
                        autoclose: true,
                        clearBtn: true,
                        orientation: 'left'
                    }).change(dateChanged)
                    .on('changeDate', dateChanged);

                function dateChanged(ev) {
                    scope.dateFilterRangeSearch = true;
                    scope.dataTable
                        .column($(this).parents('th').index() + ':visible')
                        .search(this.value)
                        .draw();
                    scope.dataTable.state.save();
                }
                elem.bind('click', function () {
                    $(elem).datepicker('show');
                });
            } else {
                elem.bind('keyup', function () {
                    if ($(this).attr("type") == "text" && attr.textChange != "CreationDate") {
                        scope.dataTable
                            .column($(this).parents('th').index() + ':visible')
                            .search(this.value)
                            .draw();
                        scope.dataTable.state.save();
                    }
                });
            }
        }
    }
}]);