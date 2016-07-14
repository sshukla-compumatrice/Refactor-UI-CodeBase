angular.module('PortfolioCreation').controller('PortfolioEmailCtrl', ['$scope', '$log', 'Upload', '$modal', function ($scope, $log, Upload, $modal) {

    $scope.portfolio.currentSection = $scope.portfolio.sectionCollection.EmailProjectInformation;
    var self = this;

    $("#ulnavigation .active").removeClass('active');
    $("#ulnavigation #Email").addClass('active');
    var main = $scope.portfolio;
    main.getSubmitData = function () {

        main.clearErrorDisplay();

        var data = angular.copy($scope.portfolio.project);
        data.notification = {
            emailCC: self.emailCC,
            emailBody: self.emailBody
        };
        return data;
    };

    main.clearErrorDisplay = function () {
        self.serviceResponseAlert = false;
        self.serviceResponseText = "";
    }
    main.showServiceError = function (errorMsg) {
        self.serviceResponseAlert = true;
        self.responseType = 'danger';
        self.serviceResponseText = errorMsg;
    }

    self.ShowFindContact = function () {

        var modalInstance = $modal.open({
            templateUrl: 'app/modules/ProjectCreation/views/emailContacts.html',
            scope: $scope,
            controller: 'EmailContactsCtrl as emailContacts',
            size: 'lg',
            windowClass: 'app-modal-window'
        });

        modalInstance.result.then(function (emailObj) {

            if (emailObj.emailCC && emailObj.emailCC.length > 0) {
                if (angular.isArray(emailObj.emailCC)) {
                    if (self.emailCC) {
                        self.emailCC = self.emailCC.concat(emailObj.emailCC);
                    } else {
                        self.emailCC = emailObj.emailCC;
                    }
                } else {
                    if (!self.emailCC) {
                        self.emailCC = '';
                    }
                    if (self.emailCC == '') {
                        self.emailCC = emailObj.emailCC;
                    } else {
                        self.emailCC = self.emailCC.trim() == '' ? emailObj.emailCC : self.emailCC + "," + emailObj.emailCC;
                    }
                }
            }
        });
    };

}]);
