angular.module('ParcelUI').directive('cookiesFooter', ['$cookies', '$cookieStore', '$window', 'DashboardAPI', function ($cookies, $cookieStore, $window, DashboardAPI) {

    return {

        restrict: 'E',
        scope: {
            user: '=',
            code: '=',
            data: '='
        },
        templateUrl: 'app/modules/LandingPage/views/footer.html',




        link: function ($scope, element, attrs) {
            /*            $(window).scroll(function () {
                            if ($(this).scrollTop() === 0) {
                                $('#footerLP').hide();
                            } else {
                                $('#footerLP').show();
                                $('#footerLP').fadeIn();
                            }
                        });*/
            // $scope.user = cookiesData.header();

        },
        controller: function ($scope) {
            $scope.exampleCookie = $cookieStore.get('exampleCookie');
            console.log($scope.code);
            var iCalContent = '<form name="Response" method="post" action="http://wwwdev.collateral360.com:80/?code=c556e1f0-eacd-416f-9847-83a4e1924a7c&scope=cn">';



            extractCode(iCalContent);

            function extractCode(iCalContent) {
                var arr = iCalContent.match(/^<form name="Response" method="post" action="http:\/\/wwwdev.collateral360.com:80\/\?code=(.+)">/);
                console.log(arr[1]);
            }



        }
    };


}]);


angular.module('ParcelUI').directive('helpBtn', [function () {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {

                scope.$apply(
                    scope.hidebtn = true
                );


                $(".needhelp-toggle").slideToggle({
                    direction: "top"
                });



            });

        }
    }


}]);


angular.module('ParcelUI').directive('helpPopup', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',

        link: function (scope, elem, attr) {

            elem.bind('click', function () {
                console.log("viuer");
                scope.$apply(
                    $timeout(function () {
                        scope.hidebtn = false;
                    }, 500)

                );


                $(".needhelp-toggle").slideToggle({
                    direction: "top"
                });



            });

        }
    }


}]);
