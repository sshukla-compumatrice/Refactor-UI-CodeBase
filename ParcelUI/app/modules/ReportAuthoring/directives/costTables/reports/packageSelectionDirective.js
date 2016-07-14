angular.module('ReportAuthoring').directive('packageSelection', [function () {
    return {
        restrict: 'A',

        templateUrl: 'app/modules/ReportAuthoring/directives/costTables/reports/packageSelectionDefaultView.html',

        controller: ['$scope', '$window', '$state', '$http', '$compile', '$timeout', '$stateParams', function ($scope, $window, $state, $http, $compile, $timeout, $stateParams) {

            init();

            function init() {
                $scope.packages = [];
                $scope.packageSelected = false;
                fillPackages();
            }



            function fillPackages() {
                if ($scope.resp.sectionData.contentValues.packages.packagesArray === undefined) return;
                angular.forEach($scope.resp.sectionData.contentValues.packages.packagesArray, function (package, index) {
                    var obj = {};
                    obj.name = package.packageName;
                    obj.id = package.packageId;
                    $scope.packages.push(obj);
                })
            }


            $scope.changeReportsWithPackages = function () {
                $scope.packageSelected = true;
                $scope.cosTables = [];
                angular.forEach($scope.resp.sectionData.contentValues.packages.packagesArray, function (package, index) {
                    if (package.packageName === $scope.package.name) {
                        if ($scope.package.name === "None") $scope.packageSelected = false;
                        angular.forEach(package.tables, function (table, index) {
                            var obj = {};
                            obj.name = table.tableName;
                            obj.tableType = table.tableType;
                            obj.tableId = table.tableId;
                            $scope.cosTables.push(obj);
                        })
                    }
                })
            }

            $scope.openWindowWithRecommendations = function (table) {

                console.log("reached on click " + table.tableId, $scope.package.id);
                var url = $state.href('ReportAuthoring.CostTable', {
                    SiteId: $stateParams.SiteId,
                    tableType: table.tableType,
                    packageId: $scope.package.id,
                    tableId: table.tableId
                });
                $window.open(url, {
                    absolute: true
                }, 'self');
            }

            $scope.generatePdf = function (table) {

                $http.get('app/modules/ReportAuthoring/directives/costTables/reports/' + table.tableType + '/' + table.tableType + 'PdfView.html').then(function (result) {

                    $scope.packageId = $scope.package.id;
                    $scope.tableId = table.tableId;
                    $compile(result.data)($scope);

                    $scope.$on('openpdf', function (event, args) {
                        console.log("pdf html " + args.html);

                    });


                });
            }


        }]
    }


}])
