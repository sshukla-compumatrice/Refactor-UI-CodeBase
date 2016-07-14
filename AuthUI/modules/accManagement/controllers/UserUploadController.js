angular.module('AccountMgmtModule').controller('UserUploadController', ['$rootScope', '$scope', '$modalInstance', '$location', '$timeout', '$state', 'uploadModalParams', '$q', 'UserServiceAPI', 'Upload', function ($rootScope, $scope, $modalInstance, $location, $timeout, $state, deleteModalParams, $q, UserServiceAPI, Upload) {

    var scope = $scope;
    var self = this;
    self.isUpload = true;
    self.isSubmit = true;
    self.emailList ={};
    
    
    
    
    //self.showUserTbl = false;
    self.defaultAccessLevels = [
        {
            text:"Lender User",
            value:"1"
        },
        {
            text:"Lender Manager",
            value:"2"
        },
        {
            text:"Lender Executive",
            value:"3"
        }
    ];
        
    self.closeModal = function () {
        $modalInstance.close();
    }
    
    $scope.read = function (workbook) {
        
        
        /* DO SOMETHING WITH workbook HERE */
        self.userSheetData = XLSX.utils.sheet_to_json(workbook.Sheets["List of Users"],{range:8});
//        angular.forEach(self.userSheetData, function(user,i){
//            if(user['Default Access Level']){
//                var x= self.defaultAccessLevels.filter(function(item){
//                    return item.text == user['Default Access Level'];
//                })[0];
//                user['Default Access Level'] = x;
//            }
//        })
        if(self.userSheetData.length>0){            
            self.showUserTbl = true;
            self.isSubmit = false;
            $timeout(function () {
                $(document).ready(function(){
                    $('[data-toggle="tooltip"]').tooltip();
                });
            });
           /* angular.forEach(self.userSheetData,function(usr,i){
                self.emailList[i]= usr['Email'];
            })*/
        }
        else{
            self.IncorrectFormat = "Error in reading file. Please check sheet with name 'List of Users' is either empty or is not available.";
        }
        //console.log(self.userSheetData);
      }
    
    self.saveUser = function(data,id){
        console.log(data);
//        var accessLevel=  data.defaultAccessLevel.text;
//        self.userSheetData[id] = data;
        self.userSheetData[id]['First Name'] = data.firstName;
        self.userSheetData[id]['Last Name'] =data.lastName;
        self.userSheetData[id]['Title'] =data.title;
        self.userSheetData[id]['Default Access Level'] = data.defaultAccessLevel;
        self.userSheetData[id]['Email'] = data.email;
        self.userSheetData[id]['Direct Phone'] = data.phone;
        var editableRowCount = document.getElementsByName('firstName').length;
        if(editableRowCount==1)
            self.isSubmit = false;
    }
    self.removeUser = function(index,data) {
            self.userSheetData.splice(index, 1);
        }
    
    self.UploadUsers = function(form){
        
        var promises = [];
        angular.forEach(self.userSheetData, function(user,i){
            var userData = {
                "firstName": user['First Name'],
                "middleInitial": "",
                "lastName":  user['Last Name'],
//                "title": user['Title'],
//                "defaultAccessLevels": user['Default Access level'],
                "email": user['Email'],
                "directPhone": user['Direct Phone'],
                "office": {
                    "companyOfficeGUID": $state.params.officeguid
                }
            };
            var reqUserObj = {
                "user": userData
            }
            promises.push(UserServiceAPI.createuser(reqUserObj));
        })
        $q.all(promises).then(function(responses){
            self.showHeaderAfterSave = true;
            angular.forEach(responses,function(resp,i){
                self.userSheetData[i].messageAfterSave = 'The new account was successfully created.';
                if(resp.user && resp.user.userGUID){
                    self.userSheetData[i].isSuccess = true;
                }
                else if(resp.data.message && !resp.user){
                    self.userSheetData[i].isSuccess = false;
                    self.userSheetData[i].messageAfterSave = "Failed to add new account due to: "+resp.data.message.userMessage;
                }
                else{
                    self.userSheetData[i].isSuccess = false;
                    self.userSheetData[i].messageAfterSave = 'Sorry. We encountered a problem while processing your request. Please try again.';
                }
            })
        })
    }
    
    
    self.checkFile = function(files,invalidFiles){
        self.showUserTbl = false;
//        self.userSheetData = null;
        self.IncorrectFormat = false;
        if (invalidFiles.length > 0) {
            self.IncorrectFormat = 'File format is incorrect.';
            self.isUpload = true;
        }
        else if(!files)
            self.isUpload = true;
        else
           self.isUpload = false;
    }
    
    self.uploadFile =function(){
        self.isUpload = true; 
        var file = self.files;
        var reader = new FileReader();
        var name = file.name;
        reader.readAsBinaryString(file);
          reader.onload = function(e) {
            var data = e.target.result;
            /* if binary string, read with type 'binary' */
            try {
              var workbook = XLS.read(data, {type: 'binary'});
                if(workbook){
                    $scope.$apply(function(){
                        $scope.read(workbook);
                    })
                }
            } catch(e) {
                self.IncorrectFormat = "Error in reading file. Please check the spreadsheet file has correct format.";
                console.log('Error in reading file: ');
            }
          };
    }
    
    /* Validations*/
    self.checkInvalid = function(data,type,index,valid){
        if(type=="Email" && !data){
//            if(self.userSheetData[index]['Email'])
                return "Invalid email address";
        }
        if(!data)
            return "This field is required";
    }
    
    self.setSubmitFlag = function(flag){
        if(flag)
            self.isSubmit = true;        
    }
    
}])