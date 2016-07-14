angular.module('ProjectCreation').controller('BiddersAreaController', ['$scope', '$log', '$http',
function ($scope, $log, $http) {




        $scope.companyId = 12;
        $scope.currentPage = 1;
        $scope.numPerPage = 5;
        $scope.biddersArea_AwaitingAcceptanceArr = [];
        $scope.biddersArea_TaskedBidsArr = [];

        $scope.totalItems = 0;
        $scope.selectedTab = 1;
        init();


        function init() {
           
            getBiddersArea_AwaitingAcceptanceData();
        }

        function getBiddersArea_AwaitingAcceptanceData() {
            var objAwaitingAcceptance1 = {
                "PortfolioName": "Portfolio Name",
                "Address": "Address",
                "Status": "Status",
                "Deadline": "Deadline",
                "ReportTypes": "ReportTypes",
                "Sites": "Sites",
                "BidsSubmitted": "BidsSubmitted",
                "LowestBid": "LowestBid"
            };
            var objAwaitingAcceptance2 = {
                "PortfolioName": "Portfolio Name2",
                "Address": "Address2",
                "Status": "Status2",
                "Deadline": "Deadline2",
                "ReportTypes": "ReportTypes2",
                "Sites": "Sites2",
                "BidsSubmitted": "BidsSubmitted2",
                "LowestBid": "LowestBid2"
            };

            $scope.biddersArea_AwaitingAcceptanceArr.push(objAwaitingAcceptance1);
            $scope.biddersArea_AwaitingAcceptanceArr.push(objAwaitingAcceptance2);
          
        }

        function bind(data) {
            if (data.length > 0) {

                $scope.biddersArea_AwaitingAcceptanceArr = data;
                $scope.totalItems = $scope.biddersArea_AwaitingAcceptanceArr.length;
            }
        }

        this.paginate = function (value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.filtered.indexOf(value);
            return (begin <= index && index < end);
        };

        $scope.getBiddersArea_TaskedBidsData = function() {
           $scope.biddersArea_TaskedBidsArr=[];
            var objTaskedBids1 = {
                "PortfolioName": "Portfolio Name",
                "Address": "Address",
                "DateAwarded": "Status",               
                "ReportTypes": "ReportTypes",
                "Sites": "Sites",
                "Bids": "Bids",
                "Consultant": "Consultant",
                "Bid":"Bid"
            };
            var objTaskedBids2 = {
                "PortfolioName": "Portfolio Name2",
                "Address": "Address2",
                "DateAwarded": "Status2",               
                "ReportTypes": "ReportTypes2",
                "Sites": "Sites2",
                "Bids": "Bids2",
                "Consultant": "Consultant2",
                "Bid":"Bid2"
            };

            $scope.biddersArea_TaskedBidsArr.push(objTaskedBids1);
            $scope.biddersArea_TaskedBidsArr.push(objTaskedBids2);

        }

}]);