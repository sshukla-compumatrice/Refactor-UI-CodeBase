// define module
angular.module('Bidding', ['ui.router.state', 'ui.bootstrap']);

// routers
angular.module('Bidding').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        var baseViewsFolder = 'app/modules/Bidding/views/';

        $stateProvider.state('directAwardsAndBids', {
                'url': '/DirectAwardsAndBids',

                'templateUrl': baseViewsFolder + 'DirectAwardAndBids.html',
				'data': {
					pageTitle : "Bids / PARCEL"
				}

                //                ,
                //                'resolve': {
                //                    directAwardAndBids_NewRequestData: function ($http) {
                //
                //                        return $http.get('app/modules/Bidding/staticData/directAwardAndBidsJSON.js')
                //                            .then(function (result) {
                //                                return result.data;
                //
                //                            });
                //
                //                    }
                //                }
            })
            .state('submitBid', {
                'url': '/SubmitBid?bidGUID',
                'templateUrl': baseViewsFolder + 'submitBid.html',
                'controller': 'SubmitBidController'
            })
            .state('retractBid', {
                'url': '/RetractBid?bidGUID',
                'templateUrl': baseViewsFolder + 'RetractBid.html'

            })
            .state('updateBid', {
                'url': '/UpdateBid?bidGUID',
                'templateUrl': baseViewsFolder + 'UpdateBid.html'

            })
            .state('acceptBid', {
                'url': '/AcceptBid?bidGUID',
                'templateUrl': baseViewsFolder + 'AcceptBid.html'

            })
            .state('rejectBid', {
                'url': '/RejectBid?bidGUID',
                'templateUrl': baseViewsFolder + 'RejectBid.html'

            })
            .state('biddersArea', {
                'url': '/BiddersArea',
                'templateUrl': baseViewsFolder + 'BiddersArea.html'

            })
            .state('viewBiddersArea', {
                'url': '/BidAction',
                'templateUrl': baseViewsFolder + 'ViewBiddersArea.html'

            })
            .state('viewBid', {
                'url': '/viewBid',
                'templateUrl': baseViewsFolder + 'ViewBid.html'

            });
    }
]);