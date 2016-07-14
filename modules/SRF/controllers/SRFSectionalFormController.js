
angular.module('SRFModule').controller('SRFSectionalViewLoanCtrl', ['$scope', 'SectionViewLoanData', '$log','SRFResources', function ($scope, SectionViewLoanData, $log, SRFResources) {

    var self = this;
    this.tabsArray = [];
    this.form = {};
    this.form.tabsArray = [];
    this.form.individualTabsArray = [];
    this.form.uiOptions = [];


    angular.forEach(SectionViewLoanData.tabs,function(tab){
        
        //self.form.individualTabsArray.push(tab.tabTitle);
        self.form.tabsArray.push(tab);
    })

}]);

