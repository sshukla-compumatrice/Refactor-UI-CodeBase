angular.module('PropertyModule').controller('PropertyOverviewCtrl',['PropertyLoanData','$log','PropertyResources','$scope',function(PropertyLoanData,$log,PropertyResources,$scope){

    var PropertyOverviewControllerLogger = $log.getInstance('propertyoverview');

    PropertyOverviewControllerLogger.info(PropertyResources.navcontroller);

    var self = this;
    this.tabsArray = [];
    this.propertydetails = {};
    this.propertydetails.tabsArray = [];
    this.propertydetails.individualTabsArray = [];
    this.editbtn = "Edit";
    this.showSavebtn = false;
    this.submissionSuccess = false;
    this.submissionFailed = false;




    angular.forEach(PropertyLoanData.tabs,function(tab){

        self.propertydetails.tabsArray.push(tab);
    })


            self.TabClicked = function (tabtitle) {

                    angular.forEach(self.propertydetails.tabsArray,function(tabs){
                        if(tabs.tabTitle != tabtitle){
                            angular.element('#' + tabs.tabTitle).hide();
                        }
                        else{
                            angular.element('#' + tabs.tabTitle).show();
                        }
                    })
                }

            self.EditForm = function(){

                if(this.editbtn == "Edit"){
                    this.editbtn = "Cancel";
                    this.showSavebtn = true;

                    ChangeIsEditable(true);

                }
                else{
                    this.editbtn = "Edit";
                    this.showSavebtn = false;

                    ChangeIsEditable(false);

                }


            }

            self.SaveFormData = function(){
                this.showSavebtn = false;
                this.editbtn = "Edit";
                ChangeIsEditable(false);
                $scope.submissionSuccess = false;
                $scope.submissionFailed = false;


                for(var i = 0  ; i < self.propertydetails.tabsArray.length ; i++){

                        var currentTab = self.propertydetails.tabsArray[i].tabTitle;

                        if (self.form[currentTab].$invalid ) {

                            $scope.submissionFailed = true;
                            $scope.submissionSuccess = false;

                            break;

                        }
                        else {

                            $scope.submissionFailed = false;
                            $scope.submissionSuccess = true;

                        }

                    }

                //PostData();


            }

            //This function changes status of isEditable field so all controls enables/disables depending on status

            function ChangeIsEditable(status){

                angular.forEach(PropertyLoanData.tabs,function(tab){  // foreach for tabs
                        angular.forEach(tab.rows,function(row){  // foreach for rows
                            angular.forEach(row.columns,function(column){  // foreach for columns
                                angular.forEach(column.sections,function(section){ // foreach for sections
                                    angular.forEach(section.fields,function(field){ // foreach for fields
                                        field.isEditable = status;
                                    })
                                })
                            })
                        })

                    })
            }
}]);
