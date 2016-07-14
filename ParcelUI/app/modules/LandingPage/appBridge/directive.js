angular.module('ParcelUI').directive('appBridgeColumnFilter', [function () {
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
                    scope.appBridgeDataTable
                        .column($(this).parents('th').index() + ':visible')
                        .search(this.value)
                        .draw();
                    scope.dataTable.state.save();
                }
                elem.bind('click', function () {
                    $(elem).datepicker('show');
                })
            } else {
                elem.bind('keyup', function () {
                    if ($(this).attr("type") == "text" && attr.textChange != "CreationDate") {
                        scope.appBridgeDataTable
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