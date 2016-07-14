angular.module('LenderPortal').directive('expandCurrentview', ['globalValues', function (globalValues) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            console.log("reached");
            elem.bind('click', function () {
                globalValues.dashBoardExpandAll = true;
                globalValues.dashBoardCollapseAll = false;
                var rowElemArray = angular.element('.group');

                $('.group').each(function (i, obj) {
                    if ($(this).next().hasClass("ng-hide")) {

                        $(this).nextUntil('.group').removeClass('ng-hide');
                    }
                })
                $("input[name='collapsed']").each(function (i, obj) {
                    $(this).prev().removeClass("fa-plus-square-o");
                    $(this).prev().addClass("fa-minus-square-o fa-lg");
                })
            })



        }
    }
}])

angular.module('LenderPortal').directive('collapseCurrentview', ['globalValues', '$timeout', function (globalValues, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            console.log("reached");
            elem.bind('click', function () {
                globalValues.dashBoardCollapseAll = true;
                globalValues.dashBoardExpandAll = false;
                var rowElemArray = angular.element('.group');

                $('.group').each(function (i, obj) {
                    if (!$(this).next().hasClass("ng-hide")) {

                        $(this).nextUntil('.group').addClass('ng-hide');
                    }
                })
                $("input[name='collapsed']").each(function (i, obj) {
                    $(this).prev().addClass("fa-plus-square-o fa-lg");
                    $(this).prev().removeClass("fa-minus-square-o");
                })
            })

            scope.$on('collapse-after-length-change', function () {
                var rowElemArrayLength = angular.element('.group').length;
                var rowElemArray = angular.element('.group');

                $timeout(function () {
                    $('.group').each(function (i, obj) {
                        if (i == rowElemArrayLength - 1) {
                            $(this).nextUntil('.group').addClass('ng-hide');
                        }
                        if (!$(this).next().hasClass("ng-hide")) {

                            $(this).nextUntil('.group').addClass('ng-hide');
                        }
                    })
                    $("input[name='collapsed']").each(function (i, obj) {
                        $(this).prev().addClass("fa-plus-square-o fa-lg");
                        $(this).prev().removeClass("fa-minus-square-o");
                    })
                }, 1000);

            })

        }


    }
}])

angular.module('LenderPortal').directive('closePopover', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            elem.bind('click', function () {
                console.log("reached funnction");
                $('.column-settings').popover('hide');
            })

        }
    }
}])

angular.module('LenderPortal').directive('hideShowColumns', [function () {
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




            })
        }
    }
}])

angular.module('LenderPortal').directive('openHideshowpopover', ['$compile', '$timeout', function ($compile, $timeout) {

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

            })


        }
    }
}])


angular.module('LenderPortal').directive('textChange', ['DashboardFactory', function (DashboardFactory) {
    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            if (attr.textChange == "date") {                       
                elem.datepicker({
                        format: "m/d/yyyy",
                        autoclose: true,
                        clearBtn: true,
                        orientation: 'auto'
                    }).change(dateChanged)
                    .on('changeDate', dateChanged);

                function dateChanged(ev) {
                    scope.operator = $(this).next().children().first().text().trim();
                    scope.dateValue = $(this).val();
                    scope.dateFilterRangeSearch = true;
                    var headerIndex = $(this).parents('th').index();
                    var headerText =  $('#table_id .dataTableRow th').eq(headerIndex).text();                    
                    scope.columnIndex =  scope.dataTable.column(headerText + ':name').index();
                    scope.dataTable.draw();
                    scope.dataTable.state.save();
                }
            }



            elem.bind('keyup change', function () {
                if ($(this).attr("type") == "text" && attr.textChange != "date") {
                   scope.dateFilterRangeSearch = false;
                    scope.dataTable
                        .column($(this).parents('th').index() + ':visible')
                        .search(this.value)
                        .draw();
                    scope.dataTable.state.save();
                }
            })
        }
    }
}])


angular.module('LenderPortal').directive('onFinishRenderRow', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {

            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('fillDatatable');
                })
            }
        }
    }
}])

angular.module('LenderPortal').
filter('capitalize', function () {
    return function (input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    }
});

angular.module('LenderPortal').
directive('datefilterCondition', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {            
            elem.bind('click', function () {
               scope.operator = attr.datefilterCondition;
                if (scope.operator == "=") {                   
                    var html = '= <span class="caret"></span>';                  
                }
                if (scope.operator == "<") {                  
                    var html = '< <span class="caret"></span>';                               
                }
                if (scope.operator == ">") {                                       
                    var html = '> <span class="caret"></span>';                                    
                }
                scope.dateValue = $(this).parent().parent().parent().parent().find('input').val();
                scope.dateFilterRangeSearch = true;
                var headerIndex = $(this).parents('th').index();
                    var headerText =  $('#table_id .dataTableRow th').eq(headerIndex).text();                  
                    scope.columnIndex =  scope.dataTable.column(headerText + ':name').index();
                    scope.dataTable.draw();            
                $(this).parents('.input-group').find('.dropdown-toggle')
                    .html(html);           
                scope.dataTable.state.save();
            })
        }
    }
}]);