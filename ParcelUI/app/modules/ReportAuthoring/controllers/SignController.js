angular.module('ReportAuthoring').controller('SignController', ['$scope', 'ReportAuthoringAPI', '$compile', 'reportGridDataOperations', 'projectDashboardOperations', 'checkStatus', '$stateParams', '$q', 'BASEURL', '$timeout', '$state','ParcelUI.Resources', 'AuthFactory', 'ReportAuthoringUrlCollection', function ($scope, ReportAuthoringAPI, $compile, reportGridDataOperations, projectDashboardOperations, checkStatus, $stateParams, $q, BASEURL, $timeout, $state,ParcelUI_Resources, AuthFactory, ReportAuthoringUrlCollection) {

    var self = this;
    //self.currentUserGUID = 'A0F5E294-B497-4C16-8FA4-526C9413530F';
    /*self.currentUserObject = {
        userGUID: 'a0f5e294-b497-4c16-8fa4-526c9413530f',
        userName: 'Kumar Shantnu',
        title: 'Developer'
    }*/
    self.currentUserObject = getCurrentUser();    
    self.expanddivComment = "collapse in";
    self.expanddivAddress = "collapse in";
    self.commentsErrorStatus = false;
    self.commentsErrorText = "";
    $scope.commentsArr = [];
    self.serviceResponseAlert = true;
    self.checkComments = false;
    self.waitingCommentsResources = ParcelUI_Resources.waitingCommentsResources;
    function init() {
        self.signText = {};
        self.signOnBehalfText = {};
        self.signForText = {};
        self.certifiedBy = {};
        self.certifiedForBy = {};
        self.unSign = {};
        self.signOrOverride = {};
        self.signOnBehalfOrOverride = {};
        self.signFor = {};
        self.signatureIndexArray = {};
        self.secUser = {};
        self.signForUser = {};
        self.signOnBehalfUser = {};
        self.signCertfication = {};
        //self.certifications = [];
        self.signatureOperations = {};
        self.showAlert = {};
        self.serviceMessage = {};
        self.certificationForUser = {};
        self.certText = {};
        self.certForText = {};
        self.certificationOperation = {};
        self.reportGuid = $stateParams.reportGuid;
        getAddressedComments();
        getReportSignoffs(false);
        getUsers();
        checkReportStatus();
    }
    init();
        
    function checkReportStatus(){
        if (window.sessionStorage.getItem('reportStatusAbbreviation') == 'FIN') {
            self.isReportFinal = true;            
        }
        else{
            self.isReportFinal = false;
        }
    };

    function getCurrentUser() {
        var obj = {
            userGUID: AuthFactory.getUserDetailsFromStorage('EFF_USERGUID'),
            userName: AuthFactory.getUserDetailsFromStorage('EFF_DISPLAYNAME'),
            title: AuthFactory.getUserDetailsFromStorage('EFF_TITLE'),
            eponly: AuthFactory.getUserDetailsFromStorage('EFF_EP'),
            companyGUID: AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID'),
            officeGUID: AuthFactory.getUserDetailsFromStorage('EFF_OFFICEGUID')
        };
        
        return obj;
    }
    
    function getAddressedComments() {
    if (sessionStorage.getItem("reportStatusAbbreviation") != 'FIN') {
        
        self.commentsErrorStatus = false;
        self.commentsErrorText = "";
        $scope.commentsArr = [];
        self.commentsErrorStatus = false;
        self.commentsErrorText = "";
    
        var promise = ReportAuthoringAPI.getComments('ASC',$stateParams.reportGuid);
  
        self.waitingCommentsResources.promise = promise;
        return promise.then(function (resp) {
  ReportAuthoringAPI.managePanelHeight();
            for (var i = 0; i < resp.length; i++) {
         
                if (resp[i].comments && resp[i].comments.length > 0) {

                    var sectionObj = {
                        "sectionGUID": "",
                        "sectionNumber": "",
                        "sectionName": "",
                        "isAppendix":"",
                        comments: []

                    }

                    sectionObj.sectionGUID = resp[i].sectionGUID;
                    sectionObj.sectionNumber = resp[i].sectionNumber;
                    sectionObj.sectionName = resp[i].sectionTitle;
                    sectionObj.isAppendix = resp[i].isAppendix;
                    for (var k = 0; k < resp[i].comments.length; k++) {
                        if (!resp[i].comments[k].addressed) {
                            var commObj = {
                                "Id": "",
                                "addressed": false,
                                "commentVal": "",
                                "addressedVal": "",
                                "commentedBy": "",
                                "addressedBy": "",
                                "date": "",
                                "addressedDate": ""
                            }
                            commObj.Id = resp[i].comments[k].commentGUID;
                            commObj.addressed = resp[i].comments[k].addressed;
                            commObj.commentVal = resp[i].comments[k].commentText;
                            commObj.commentedBy = resp[i].comments[k].createdBy.firstName + ' ' + resp[i].comments[k].createdBy.lastName;
                            if (resp[i].comments[k].addressed) {
                                if (resp[i].comments[k].responseComments != null && resp[i].comments[k].responseComments != undefined && resp[i].comments[k].responseComments != "") {
                                    commObj.addressedBy = resp[i].comments[k].responseComments[0].createdBy.firstName + ' ' + resp[i].comments[k].responseComments[0].createdBy.lastName;
                                    commObj.addressedVal = resp[i].comments[k].responseComments[0].commentText;
                                    commObj.addressedDate = resp[i].comments[k].responseComments[0].commentDate;
                                }

                            }
                           // commObj.date = resp[i].comments[k].commentDate;
                            if(resp[i].comments[k].commentUpdated)
                            {
                                 commObj.date = resp[i].comments[k].updatedDate;
                            }
                            else{
                                 commObj.date = resp[i].comments[k].commentDate;
                            }
                            sectionObj.comments.push(commObj);


                        }
                    }
                    $scope.commentsArr.push(sectionObj);

                }
         


            }


            if ($scope.commentsArr.length > 0) {
                
                for (var i = 0; i < $scope.commentsArr.length; i++) {
                    if ($scope.commentsArr[i].comments.length > 0) {
                        self.checkComments = true;

                    }
                }
            } else {
                self.checkComments = false;
            }

            if (!self.checkComments) {
                self.commentsErrorText = "No Comments Found";
                self.commentsErrorStatus = true;

            }
            
			
              $timeout(function () {
   $('[data-toggle="tooltip"]').tooltip();
               });
        }, function (error) {
            console.log("error");
            self.commentsErrorText = error;
            self.commentsErrorStatus = true;
			ReportAuthoringAPI.managePanelHeight(); 
        });

    }
    }

    self.CloseAll = function () {

        for (var i = 0; i < $scope.commentsArr.length; i++) {
            for (var j = 0; j < $scope.commentsArr[i].comments.length; j++) {

                //comment
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").addClass('collapse');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").removeClass('ng-hide');
                    $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").removeClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").show();
                  $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment").hide();
                   $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment-span").hide();

                //address
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").addClass('collapse');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").removeClass('ng-hide');
                  $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").removeClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").show();
                   $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").show();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address-span").hide();
            }
        }
		$('.tooltip-hide').blur();
		
    }

    self.OpenAll = function () {

        for (var i = 0; i < $scope.commentsArr.length; i++) {
            for (var j = 0; j < $scope.commentsArr[i].comments.length; j++) {

                //comment
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-comment").addClass('collapse in');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").addClass('ng-hide');
                  $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").addClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment").hide();
                 $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-comment-span").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment").show();
                  $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-comment-span").show();

                //address
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").removeClass();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-address").addClass('collapse in');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").addClass('ng-hide');
                  $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").addClass('ng-hide');
                $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address").hide();
                  $("#" + $scope.commentsArr[i].comments[j].Id + "-plus-address-span").hide();
                $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address").show();
                  $("#" + $scope.commentsArr[i].comments[j].Id + "-minus-address-span").show();
            }
        }
		$('.tooltip-hide').blur();

    }

    self.setIconComment = function (val, commentId) {
        console.log("class: " + val);
        $("#" + commentId + "-comment").removeClass();
        $("#" + commentId + "-comment").addClass(val);
        if (val == 'collapse') {
            $("#" + commentId + "-plus-comment").removeClass('ng-hide');
              $("#" + commentId + "-plus-comment-span").removeClass('ng-hide');
            $("#" + commentId + "-plus-comment").show();
              $("#" + commentId + "-plus-comment-span").show();
            $("#" + commentId + "-minus-comment").hide();
              $("#" + commentId + "-minus-comment-span").hide();

        } else {
            $("#" + commentId + "-plus-comment").hide();
              $("#" + commentId + "-plus-comment-span").hide();
            $("#" + commentId + "-minus-comment").show();
              $("#" + commentId + "-minus-comment-span").show();
        }
        //self.expanddivComment = val;
    }

    self.setIconAddress = function (val, commentId) {
        $("#" + commentId + "-address").removeClass();
        $("#" + commentId + "-address").addClass(val);
        if (val == 'collapse') {
            $("#" + commentId + "-plus-address").removeClass('ng-hide');
            $("#" + commentId + "-plus-address-span").removeClass('ng-hide');
            $("#" + commentId + "-plus-address").show();
              $("#" + commentId + "-plus-address-span").show();
            $("#" + commentId + "-minus-address").hide();
               $("#" + commentId + "-minus-address-span").hide();

        } else {
            $("#" + commentId + "-plus-address").hide();
              $("#" + commentId + "-plus-address-span").hide();
            $("#" + commentId + "-minus-address").show();
             $("#" + commentId + "-minus-address-span").show();
        }
    }

    self.refreshComments = function () {
      
        $timeout(function () {
           
               getAddressedComments();
           
            });
        $('.tooltip-hide').blur();
    }

    self.addressComments = function (sectionGUID, commentGUID) {
        localStorage.setItem('sign_sectionGUID', sectionGUID);
        
        for (var i = 0; i < $scope.commentsArr.length; i++) {
            for (var j = 0; j < $scope.commentsArr[i].comments.length; j++) {
                if ($scope.commentsArr[i].comments[j].Id.toLowerCase() == commentGUID.toLowerCase()) {
                    if ($scope.commentsArr[i].isAppendix) {
                         localStorage.setItem('sign_sectionGUID', $scope.commentsArr[i].sectionGUID);
                        $state.go('ReportAuthoring.Appendices');
                    } 
                    else if(!$scope.commentsArr[i].isAppendix) {
                         localStorage.setItem('sign_sectionGUID', $scope.commentsArr[i].sectionGUID);
                          $state.go('ReportAuthoring.Write');
//                         
//                        $scope.$emit('set-comments', {
//                                        sectionGUID: sectionGUID
//                                    });
//                             $('#li_sign').removeClass('active');
//            $('#li_write').addClass('active');
//                        
//                      
                    }
                    break;
                }
            }
        }
 
    }

    function getUsers() {
        ReportAuthoringAPI.getUsersUnderSignTab().then(function (response) {
            if (angular.isArray(response.users)) {
                self.usersArray = response.users;
            }
        })
    }
    
    self.isShowInReport = function(orderIndex) {
        var signTemplate = self.templateSignature.filter(function (item) {
            return item.orderIndex == orderIndex
        });
       
        return signTemplate[0].showInReport;
    }
    
    self.isShowSignFor = function(orderIndex) {
        var signTemplate = self.templateSignature.filter(function (item) {
            return item.orderIndex == orderIndex
        });
       
        return signTemplate[0].showSignFor;
    }
    
    function getReportSignoffs(isAfterCertificationsUpdate) {
        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;

        $scope.promise = ReportAuthoringAPI.getReportSignOff(self.reportGuid);
        $scope.promise.then(function (resp) {
            if (resp.status != undefined && checkStatus.checkCodeInStatusArray(resp.status, 'GET')) {
                self.signatureServiceMsg = resp.data.message === undefined ? "Unable to fetch records" : response.data.message.userMessage;
                self.showSignaturesAlert = true;
                angular.element('#signaturesMsgDiv').addClass('alert-danger');
            } else if (resp.signatures.length == 0) {
                self.showSignaturesAlert = true;
                self.signatureServiceMsg = "No signature records found";
                angular.element('#signaturesMsgDiv').addClass('alert-danger');
            } else {
                if (!isAfterCertificationsUpdate)
                    createSignoffsArray(resp);
                if (isAfterCertificationsUpdate)
                    self.certicationEditMode = false;

                createCertficationsArray(resp);
                // no data
            }
        }, function (error) {
            self.showSignaturesAlert = true;
            self.signatureServiceMsg = "Error in fetching signature records.";
            angular.element('#signaturesMsgDiv').addClass('alert-danger');
        })
    }

    function createCertficationsArray(resp) {
        //self.reportSignoffs = resp;
        var certifications = resp.signatures.filter(function (item) {
            return item.signatureType.toLowerCase() == 'certification'
        })
        
        var templateCertifications = resp.templateSignatureResponse.certifications.filter(function (item) {
            return item.signatureType.toLowerCase() == 'certification'
        })
        
        if (certifications.length) {
            //self.certifications = certifications;
            groupingByCertficationType(certifications);
        }
        
        if (templateCertifications.length) {
            self.templateCertifications = templateCertifications;
        }

    }

    function createSignoffsArray(resp) {
        var signatures = resp.signatures.filter(function (signItems) {
            return signItems.signatureType.toLowerCase() == 'sign off'
        })
        
        var templateSignature = resp.templateSignatureResponse.signatures.filter(function (signItems) {
            return signItems.signatureType.toLowerCase() == 'sign off'
        })
        
        if (signatures)
            self.signatures = signatures;
        if (templateSignature)
            self.templateSignature = templateSignature;
    }

    function groupingByCertficationType(certifications) {
        self.certifications = [];
        var count = -1;
        var certficationGroupedBysignOffType = _.groupBy(certifications, 'signOffType');
        for (var key in certficationGroupedBysignOffType) {
            count = count + 1;
            var nameAndTitle = "";
            var nameAndTitleSignedFor = ""
            if (certficationGroupedBysignOffType[key].length > 1) {
                for (var i = 0; i < certficationGroupedBysignOffType[key].length; i++) {
                    var userObj = certficationGroupedBysignOffType[key][i];
                    nameAndTitle = nameAndTitle + ', ' + userObj.signOffUser.userName + '-' + userObj.signOffUser.title;

                    nameAndTitleSignedFor += ',' + userObj.signedForUser.userName + '-' + userObj.signedForUser.title + '(Signed by: ' + userObj.signOffUser.userName + ')';

                    if (certficationGroupedBysignOffType[key][i].signOffUser.userGUID === self.currentUserObject.userGUID || !certficationGroupedBysignOffType[key][i].signOffUser.userGUID) {

                        //set isCertified flag
                        if (certficationGroupedBysignOffType[key][i].signOffUser.userGUID)
                            certficationGroupedBysignOffType[key][i].isCertified = true;
                        else
                            certficationGroupedBysignOffType[key][i].isCertified = false;
                        self.certifications.push(certficationGroupedBysignOffType[key][i]);
                    }
                }
                self.certifiedBy[count] = nameAndTitle.substring(1, nameAndTitle.length);
                self.certifiedForBy[count] = nameAndTitleSignedFor.substring(1, nameAndTitleSignedFor.length)
            } else {
                var userObj = certficationGroupedBysignOffType[key][0];
                self.certifiedBy[count] = userObj.signOffUser.userName + '-' + userObj.signOffUser.title;
                self.certifiedForBy[count] = userObj.signedForUser.userName + '-' + userObj.signedForUser.title + '(Signed by: ' + userObj.signOffUser.userName + ')';

                if (certficationGroupedBysignOffType[key][0].signOffUser.userGUID)
                    certficationGroupedBysignOffType[key][0].isCertified = true;
                else
                    certficationGroupedBysignOffType[key][0].isCertified = false;
                self.certifications.push(certficationGroupedBysignOffType[key][0]);
            }
        }
    }

    // change display text events

    self.changeSignOnBehalfText = function (signOffObject, index) {
        if (signOffObject.signedOnBehalfOfUser.userGUID) {
            self.signOnBehalfText[index] = "Over-Ride Sign On Behalf"
        } else {
            self.signOnBehalfText[index] = "Sign On Behalf"
        }
    }

    self.changeSignText = function (signObj, index) {
        if (signObj.signOffUser.userGUID) {
            self.signText[index] = "Over-Ride";
        } else
            self.signText[index] = "Sign"
    }

    self.changeSignForText = function (signOffObject, index) {
        if (signOffObject.signedForUser.userGUID) {
            self.signForText[index] = "Over-Ride Sign For";
        } else
            self.signForText[index] = "Sign For"
    }

    self.isSignOnBehalfChecked = function (index, signOffObject) {
        var showSignVal = 'signOnBehalf' + index;
        if (signOffObject.showSignVal == showSignVal)
            return true;

        if (!signOffObject.showSignVal) {
            if (signOffObject.signedOnBehalfOfUser.userGUID && signOffObject.signOffType != "SEC Name")
                return true;
            else return false;
        }
    }

    self.isSignForChecked = function (index, signOffObject, orderIndex) {
        var showSignVal = 'signFor' + index;
        if (signOffObject.showSignVal == showSignVal && self.isShowSignFor(orderIndex)) // signOffObject.showSignFor)
            return true;

        if (!signOffObject.showSignVal) {
            if (signOffObject.signedForUser.userGUID && signOffObject.signOffType != "SEC Name" && signOffObject.showSignFor)
                return true;
            else return false;
        }
    }

    self.checkForSecName = function (signOffObject) {
        if (signOffObject.signOffType != "SEC Name") return true;
        else return false;
    }

    //radio buttons events

    self.unSignEvent = function (index, signOffObject) {
        signOffObject.signOffUser.title = "";
        signOffObject.signOffUser.userName = "";
        signOffObject.signOffUser.userGUID = "";
        self.signatureOperations[index] = "unsign";
    }

    self.signOnBehalOrOverRideEvent = function (index, signOffObject) {
        if (signOffObject.signedOnBehalfOfUser.userGUID)
            self.signatureOperations[index] = "overrideOnBehalf";
        else {
            self.signOnBehalfUser[index] = null;
            self.signatureOperations[index] = "signOnBehalf";
        }
        self.signForUser[index] = null;
        signOffObject.signOffUser.userGUID = self.currentUserObject.userGUID;
        signOffObject.signOffUser.userName = self.currentUserObject.userName;
        signOffObject.signOffUser.title = self.currentUserObject.title;
    }

    self.signForOrOverRideEvent = function (index, signOffObject) {
        if (signOffObject.signedForUser.userGUID)
            self.signatureOperations[index] = "overrideSignFor";
        else
            self.signatureOperations[index] = "signFor";
        self.signForUser[index] = null;
        signOffObject.signOffUser.userGUID = "";
        signOffObject.signOffUser.userName = "";
        signOffObject.signOffUser.title = "";
    }

    self.signOrOverRideEvent = function (index, signOffObject) {
        if (signOffObject.signOffUser.userGUID)
            self.signatureOperations[index] = "overrideSign";
        else
            self.signatureOperations[index] = "sign";
        signOffObject.signOffUser.userGUID = self.currentUserObject.userGUID;
        signOffObject.signOffUser.userName = self.currentUserObject.userName;
        signOffObject.signOffUser.title = self.currentUserObject.title;
        
        signOffObject.signedOnBehalfOfUser.userGUID = "";
        signOffObject.signedOnBehalfOfUser.userName = "";
        signOffObject.signedOnBehalfOfUser.title = "";
        
        signOffObject.signedForUser.userGUID = "";
        signOffObject.signedForUser.userName = "";
        signOffObject.signedForUser.title = "";
    }

    //dropdown change events    

    self.selectSecUser = function (index, selectedUser, signOffObject) {

        if (self.secUser[index]) {
            signOffObject.signOffUser.email = self.secUser[index].email;
            signOffObject.signOffUser.userName = self.secUser[index].firstName+ ' '+ self.secUser.lastName;
            signOffObject.signOffUser.userGUID = self.secUser[index].userGUID;
            signOffObject.signOffUser.title = self.secUser[index].title;
        } else {
            signOffObject.signOffUser.email = "";
            signOffObject.signOffUser.userName = "";
            signOffObject.signOffUser.userGUID = "";
            signOffObject.signOffUser.title = "";
        }
    }

    self.selectSignOnBehalfUser = function (index, selectedUser, signOffObject) {

        if (signOffObject.signedOnBehalfOfUser.userGUID)
            self.signatureOperations[index] = "overrideOnBehalf";
        else
            self.signatureOperations[index] = "signOnBehalf";

        var showSignVal = 'signOnBehalf' + index;
        signOffObject.showSignVal = showSignVal;
        if (self.signOnBehalfUser[index]) {
            signOffObject.signedOnBehalfOfUser.userName = self.signOnBehalfUser[index].firstName + ' '+ self.signOnBehalfUser[index].lastName;
            signOffObject.signedOnBehalfOfUser.userGUID = self.signOnBehalfUser[index].userGUID;
            signOffObject.signedOnBehalfOfUser.title = self.signOnBehalfUser[index].title;
        } else {
            signOffObject.signedOnBehalfOfUser.userName = "";
            signOffObject.signedOnBehalfOfUser.userGUID = "";
            signOffObject.signedOnBehalfOfUser.title = "";
        }
    }

    self.selectSignForUser = function (index, selectedUser, signOffObject) {
        if (signOffObject.signedForUser.userGUID)
            self.signatureOperations[index] = "overrideSignFor";
        else
            self.signatureOperations[index] = "signFor";

        var showSignVal = 'signFor' + index;
        signOffObject.showSignVal = showSignVal;
        if (self.signForUser[index]) {
            signOffObject.signedForUser.userName = self.signForUser[index].firstName + ' '+ self.signForUser[index].lastName;
            signOffObject.signedForUser.userGUID = self.signForUser[index].userGUID;
            signOffObject.signedForUser.title = self.signForUser[index].title;
            signOffObject.signOffUser.userName = self.signForUser[index].firstName + ' '+ self.signForUser[index].lastName;
            signOffObject.signOffUser.userGUID = self.signForUser[index].userGUID;
            signOffObject.signOffUser.title = self.signForUser[index].title;
        } else {
            signOffObject.signedForUser.userName = "";
            signOffObject.signedForUser.userGUID = "";
            signOffObject.signedForUser.title = "";
            signOffObject.signOffUser.userName = "";
            signOffObject.signOffUser.userGUID = "";
            signOffObject.signOffUser.title = "";
        }
    }

    //edit submit cancel events

    self.edit = function (signOffObject, index) {
		setTimeout(function() { $('.signFirst').focus() });		
        self.oldsignOffObject = angular.copy(signOffObject);
        self.signatureIndexArray[index] = self.oldsignOffObject;
        if (signOffObject.signedOnBehalfOfUser.userGUID)
            self.signOnBehalfUser[index] = signOffObject.signedOnBehalfOfUser;
        if (signOffObject.signedForUser.userGUID) {
            self.signForUser[index] = signOffObject.signedForUser;
            signOffObject.signOffUser.userName = signOffObject.signedForUser.userName;
            signOffObject.signOffUser.title = signOffObject.signedForUser.title;
            signOffObject.signOffUser.userGUID = signOffObject.signedForUser.userGUID;
        }

        if (signOffObject.signOffUser.userGUID)
            self.secUser[index] = signOffObject.signOffUser;
    }

    self.cancelEdit = function (index, signoff) {

        self.signatureIndexArray[index].editmode = false;
        self.signatures[index] = self.signatureIndexArray[index];
        $timeout(function () {
            $scope.$apply(function () {
                angular.element('#collapse' + index).addClass('in');
            })
        })

        //clear dropdown selection on cancel
        //clear signOnBehalf user
        if (self.signatureIndexArray[index].signedOnBehalfOfUser.userGUID)
            self.signOnBehalfUser[index] = self.signatureIndexArray[index].signedOnBehalfOfUser;
        else
            self.signOnBehalfUser[index] = null;

        //clear signForUser
        if (self.signatureIndexArray[index].signedForUser.userGUID)
            self.signForUser[index] = self.signatureIndexArray[index].signedForUser;
        else
            self.signForUser[index] = null;

        //clear secUser
        if (self.signatureIndexArray[index].signOffUser.userGUID)
            self.secUser[index] = self.signatureIndexArray[index].signOffUser
        else
            self.secUser[index] = null;


        //angular.element('#collapse'+index).addClass('in');
        //angular.element('#collapse'+index).addClass('in');
    }

    self.submitSignaturesSignOff = function (parentIndex, signOffObject) {
        getSignatureOperation(parentIndex, signOffObject);
    }

    var getSignatureOperation = function (parentIndex, signOffObject) {
       
        var opr = self.signatureOperations[parentIndex];
      
        switch (opr) {
        case "unsign":
            deleteSignature(parentIndex, signOffObject.signatureGuid, signOffObject);
            break;
        case "sign":
              
             
            if (!compareObj(parentIndex, signOffObject))
                createSignatures(parentIndex, signOffObject);
            break;

        case "signOnBehalf":
            if (!compareObj(parentIndex, signOffObject)) {
                if (signOffObject.signatureGuid)
                    overrideSignature(parentIndex, signOffObject);
                else
                    createSignatures(parentIndex, signOffObject);
            }
            break;

        case "signFor":
            if (!compareObj(parentIndex, signOffObject)) {
                if (signOffObject.signatureGuid) {
                    signOffObject.signOffUser.userName = self.oldsignOffObject.signOffUser.userName;
                    signOffObject.signOffUser.userGUID = self.oldsignOffObject.signOffUser.userGUID;
                    signOffObject.signOffUser.title = self.oldsignOffObject.signOffUser.title;

                    overrideSignature(parentIndex, signOffObject);
                } else {
                    signOffObject.signOffUser.userName = self.currentUserObject.userName;
                    signOffObject.signOffUser.userGUID = self.currentUserObject.userGUID;
                    signOffObject.signOffUser.title = self.currentUserObject.title;
                    createSignatures(parentIndex, signOffObject);
                }

            }
            break;
        case "overrideSign":
        case "overrideOnBehalf":
            if (!compareObj(parentIndex, signOffObject))
                overrideSignature(parentIndex, signOffObject);
            break;
        case "overrideSignFor":
            if (!compareObj(parentIndex, signOffObject)) {
                if (signOffObject.signatureGuid) {
                    signOffObject.signOffUser.userName = self.oldsignOffObject.signOffUser.userName;
                    signOffObject.signOffUser.userGUID = self.oldsignOffObject.signOffUser.userGUID;
                    signOffObject.signOffUser.title = self.oldsignOffObject.signOffUser.title;
                    overrideSignature(parentIndex, signOffObject);
                }
            }
            break;
        default:
            if (signOffObject.signatureGuid) {
                if (!compareObj(parentIndex, signOffObject))
                {
                    overrideSignature(parentIndex, signOffObject);
                }
                else
                {
                    overrideSignature(parentIndex, signOffObject);
                }
            }
            else
            {
                overrideSignature(parentIndex, signOffObject);
            }
            break;

        }
    }

    var compareObj = function (index, newSignOffObject) {
        return angular.equals(self.signatureIndexArray[index], newSignOffObject);
    }

    function deleteSignature(index, signatureGuid, signOffObject) {

        reportGridDataOperations.deleteSignature(self.reportGuid, signatureGuid).then(function (result) {
            if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'DELETE')) {
                alert(index, result.data.message.userMessage, 'error');
            } else {
                ReportAuthoringAPI.getReportSignOff(self.reportGuid).then(function (reportResp) {
                    if (reportResp.signatures) {
                        self.showAlert[index] = false;
                        //insert editMode in both cases
                        var deletedObj = reportResp.signatures.filter(function (item) {
                            return item.signatureType.toLowerCase() == 'sign off' && item.signOffType == signOffObject.signOffType
                        })[0]
                        if (deletedObj)
                            self.signatures[index] = deletedObj;
                    }
                }, function (error) {
                    alert(index, error, 'error');
                })
            }
        }, function (error) {
            alert(index, 'signoff was not deleted', 'error');
        })
    }

    function overrideSignature(index, signOffObject) {
   
        var obj = {};
        obj.signatures = [];
        var objSignOff = getRequestObj(signOffObject, 'PUT');
        obj.signatures.push(objSignOff);
        reportGridDataOperations.updateSignature(obj).then(function (result) {
            self.signatureOperations[index] = "";
            if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'PUT')) {
                alert(index, result.data.message.userMessage, 'error');
            } else {
                //get single report signOff after update
                if (result.length == 0) {
                    ReportAuthoringAPI.getSingleReportSignOff(self.reportGuid, signOffObject.signatureGuid).then(function (singleResp) {

                        //match and update here
                        if (singleResp.signatures && singleResp.signatures.length) {
                            //success
                            self.showAlert[index] = false;
                            self.signatures[index].editmode = false;
                            self.signatures[index] = singleResp.signatures[0];

                        } else {
                            //error
                            signOffObject.editmode = true;
                            alert(index, 'SignOff was updated but not retrived', 'error');
                            //self.signatures[index].editmode = true;
                        }
                    }, function (error) {
                        alert(index, error, 'error');
                        signOffObject.editmode = true;
                    })
                }
                //

            }
        }, function (error) {
            signOffObject.editmode = true;
            alert(index, 'SignOff was not updated', 'error');

        })
    }

    function createSignatures(index, signOffObject) {
      
        var obj = {};
        obj.signatures = [];
        var objSignOff = getRequestObj(signOffObject, 'POST');
        obj.signatures.push(objSignOff);

        reportGridDataOperations.createSignature(obj).then(function (result) {
            self.signatureOperations[index] = "";
            if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'POST')) {
                alert(index, result.data.message.userMessage, 'error');
            } else {
                //get single report signOff after create
                if (result.signatures && result.signatures.length && result.signatures[0].signatureGuid) {
                    ReportAuthoringAPI.getSingleReportSignOff(self.reportGuid, result.signatures[0].signatureGuid).then(function (singleResp) {

                        if (singleResp.signatures && singleResp.signatures.length) {
                            //success
                            self.showAlert[index] = false;
                            self.signatures[index].editmode = false;
                            self.signatures[index] = singleResp.signatures[0];

                        } else {
                            //error
                            signOffObject.editmode = true;
                            alert(index, 'SignOff was created but not retrived', 'error');
                            //self.signatures[index].editmode = true;
                        }
                    }, function (error) {
                        alert(index, error, 'error');
                        signOffObject.editmode = true;
                    })
                }
            }


        }, function (error) {
            signOffObject.editmode = true;
            alert(index, error, 'error');

        })
    }

    function alert(index, message, operation) {
        self.showAlert[index] = true;
        self.serviceMessage[index] = message;
        addClassToAlertHtml(index, operation);
    }

    function addClassToAlertHtml(index, status) {
        if (status === "success") {
            angular.element('#signOffMsgDiv' + index).addClass('alert-success');
            angular.element('#signOffMsgDiv' + index).removeClass('alert-danger');
        } else {
            angular.element('#signOffMsgDiv' + index).removeClass('alert-success');
            angular.element('#signOffMsgDiv' + index).addClass('alert-danger');
        }
    }

    //certification section

    self.changeCertText = function (certificationObj, index) {
        if (certificationObj.signOffUser.userGUID) {
            self.certText[index] = "Over-Ride Sign";
        } else
            self.certText[index] = "Sign"
    }

    self.changeCertForText = function (certificationObj, index) {
        if (certificationObj.signedForUser.userGUID) {
            self.certForText[index] = "Over-Ride Sign For";
        } else
            self.certForText[index] = "Sign For"
    }

    self.isCertificationForChecked = function (index, certificationObj, orderIndex) {
        var showCertificationVal = 'signFor' + index;
        if (certificationObj.showCertificationVal == showCertificationVal && self.isShowSignForCertification(orderIndex))
            return true;

        if (!certificationObj.showCertificationVal) {
            if (certificationObj.signedForUser.userGUID && certificationObj.showSignFor)
                return true;
            else return false;
        }
    }

    self.isShowSignForCertification = function(orderIndex) {
        var signTemplate = self.templateCertifications.filter(function (item) {
            return item.orderIndex == orderIndex
        });
       
        return signTemplate[0].showSignFor;
    }
    
    self.checkForEP = function(eponly) {
        return !eponly || (eponly && self.currentUserObject.eponly);
    }
    
    self.unSignCertificationEvent = function (index, certificationObj) {
        certificationObj.signOffUser.title = "";
        certificationObj.signOffUser.userName = "";
        certificationObj.signOffUser.userGUID = "";
        self.certificationOperation[index] = "unsign";
    }

    self.signOrOverRideCertificationEvent = function (index, certificationObj) {
        if (certificationObj.signOffUser.userGUID)
            self.certificationOperation[index] = "overrideSign";
        else
            self.certificationOperation[index] = "sign";
        certificationObj.signOffUser.userGUID = self.currentUserObject.userGUID;
        certificationObj.signOffUser.userName = self.currentUserObject.userName;
        certificationObj.signOffUser.title = self.currentUserObject.title;
    }

    self.certificationForOrOverRideEvent = function (index, certificationObj) {

        if (certificationObj.signedForUser.userGUID)
            self.certificationOperation[index] = "overrideSignFor";
        else
            self.certificationOperation[index] = "signFor";
        self.certificationForUser[index] = null;
        certificationObj.signOffUser.userGUID = "";
        certificationObj.signOffUser.userName = "";
        certificationObj.signOffUser.title = "";
    }

    self.selectCertificationForUser = function (index, selectedUser, certificationObj) {

        if (certificationObj.signedForUser.userGUID)
            self.certificationOperation[index] = "overrideSignFor";
        else
            self.certificationOperation[index] = "signFor";

        var showCertificationVal = 'signFor' + index;
        certificationObj.showCertificationVal = showCertificationVal;

        if (self.certificationForUser[index]) {
            certificationObj.signedForUser.userName = self.certificationForUser[index].firstName+ ' '+ self.certificationForUser[index].lastName;
            certificationObj.signedForUser.userGUID = self.certificationForUser[index].userGUID;
            certificationObj.signedForUser.title = self.certificationForUser[index].title;
            certificationObj.signOffUser.userName = self.certificationForUser[index].firstName+ ' '+ self.certificationForUser[index].lastName;
            certificationObj.signOffUser.userGUID = self.certificationForUser[index].userGUID;
            certificationObj.signOffUser.title = self.certificationForUser[index].title;
        } else {
            certificationObj.signedForUser.userName = "";
            certificationObj.signedForUser.userGUID = "";
            certificationObj.signedForUser.title = "";
            certificationObj.signOffUser.userName = "";
            certificationObj.signOffUser.userGUID = "";
            certificationObj.signOffUser.title = "";
        }
    }

    this.dismissAlert = function (parentIndex) {
        if (parentIndex != undefined && parentIndex >= 0) {
            self.showAlert[parentIndex] = false;
            self.serviceMessage[parentIndex] = "";
        } else {
            self.showCertAlert = false;
            self.certificationServiceMsg = "";
        }
    }

    this.dismissSignatureAlert = function () {
        self.showSignaturesAlert = false;
        self.signatureServiceMsg = "";
        angular.element('#signaturesMsgDiv').removeClass('alert-danger');
    }

    function addClassToReportsAlerts(status, message) {
        self.showCertAlert = true;
        self.certificationServiceMsg = message;
        if (status === "success") {
            angular.element('#certificationMsgDiv').addClass('alert-success');
            angular.element('#certificationMsgDiv').removeClass('alert-danger');
        } else {
            self.certicationEditMode = true;
            angular.element('#certificationMsgDiv').removeClass('alert-success');
            angular.element('#certificationMsgDiv').addClass('alert-danger');
        }
    }

    self.editCertification = function () {
		setTimeout(function() { $('.signFirst').focus() });
        self.oldCertficationObject = angular.copy(self.certifications);
        if (self.certifications) {
            //assign for each selectred certificationForUser
            for (var i = 0; i < self.certifications.length; i++) {
                if (self.certifications[i].signedForUser.userGUID) {
                    self.certificationForUser[i] = self.certifications[i].signedForUser;
                    self.certifications[i].signOffUser.userName = self.certifications[i].signedForUser.userName;
                    self.certifications[i].signOffUser.title = self.certifications[i].signedForUser.title;
                    self.certifications[i].signOffUser.userGUID = self.certifications[i].signedForUser.userGUID;
                }
            }
        }
    }

    self.cancelCertificationEdit = function (panelId) {
        self.certicationEditMode = false;
        self.certifications = self.oldCertficationObject;
        if (self.certifications) {
            for (var i = 0; i < self.certifications.length; i++) {
                if (self.certifications[i].signedForUser.userGUID)
                    self.certificationForUser[i] = self.certifications[i].signedForUser;
                else
                    self.certificationForUser[i] = null;
            }
            angular.element('#collapse' + panelId).addClass('in');
        }

    }

    self.saveCertification = function () {

        var postCertificationArr = [];
        var putCertificationArr = [];
        var deleteCertificationArr = [];

        //for(var i = 0 ; i < self.certifications.length ; i ++){                      

        for (var j = 0; j < self.oldCertficationObject.length; j++) {

            var certOpr = self.certificationOperation[j];
            if (certOpr) {
                switch (certOpr) {
                case "unsign":
                    var delSignOffObj = {
                        "reportGUID": self.reportGuid,
                        "reportSignoffGUID": self.certifications[j].signatureGuid
                    }
                    deleteCertificationArr.push(delSignOffObj);
                    break;
                case "sign":
                    if (!angular.equals(self.oldCertficationObject[j], self.certifications[j]))
                        postCertificationArr.push(getRequestObj(self.certifications[j], 'POST'));
                    break;
                case "signFor":
                    if (!angular.equals(self.oldCertficationObject[j], self.certifications[j])) {
                        if (self.certifications[j].signatureGuid) {
                            self.certifications[j].signOffUser.userName = self.oldCertficationObject[j].signOffUser.userName;
                            self.certifications[j].signOffUser.userGUID = self.oldCertficationObject[j].signOffUser.userGUID;
                            self.certifications[j].signOffUser.title = self.oldCertficationObject[j].signOffUser.title;
                            putCertificationArr.push(getRequestObj(self.certifications[j], 'PUT'));
                        } else {
                            self.certifications[j].signOffUser.userName = self.currentUserObject.userName;
                            self.certifications[j].signOffUser.userGUID = self.currentUserObject.userGUID;
                            self.certifications[j].signOffUser.title = self.currentUserObject.title;
                            postCertificationArr.push(getRequestObj(self.certifications[j], 'POST'));
                        }
                    }
                    break;
                case "overrideSign":
                    if (!angular.equals(self.oldCertficationObject[j], self.certifications[j]))
                        putCertificationArr.push(getRequestObj(self.certifications[j], 'PUT'));
                    break;
                case "overrideSignFor":
                    if (!angular.equals(self.oldCertficationObject[j], self.certifications[j])) {
                        if (self.certifications[j].signatureGuid) {
                            self.certifications[j].signOffUser.userName = self.oldCertficationObject[j].signOffUser.userName;
                            self.certifications[j].signOffUser.userGUID = self.oldCertficationObject[j].signOffUser.userGUID;
                            self.certifications[j].signOffUser.title = self.oldCertficationObject[j].signOffUser.title;
                            putCertificationArr.push(getRequestObj(self.certifications[j], 'PUT'));
                        }
                    }
                    break;
                }
            } else {
                if (self.oldCertficationObject[j].isCertified) {
                    //delete or update
                    if (self.certifications[j].signOffUser.userGUID) {
                        //update 
                        if (!angular.equals(self.certifications[j], self.oldCertficationObject[j]))
                            putCertificationArr.push(getRequestObj(self.certifications[j], 'PUT'));
                    } else {
                        //delete
                        var delSignOffObj = {
                            "reportGUID": self.reportGuid,
                            "reportSignoffGUID": self.certifications[j].signatureGuid
                        }
                        deleteCertificationArr.push(delSignOffObj);
                    }
                } else {
                    //post call;
                    if (self.certifications[j].isCertified)
                        postCertificationArr.push(getRequestObj(self.certifications[j], 'POST'));
                }
            } // end of outer else
        } // end of for
        AddEditCertification(postCertificationArr, putCertificationArr, deleteCertificationArr)
            //}

    }

    function AddEditCertification(postCertificationArr, putCertificationArr, deleteCertificationArr) {

        var promises = [];
        if (postCertificationArr.length) {
            var requestPostObj = {
                "signatures": postCertificationArr
            }
            promises.push(reportGridDataOperations.createSignature(requestPostObj));
        }
        if (putCertificationArr.length) {
            var requestPutObj = {
                "signatures": putCertificationArr
            }
            promises.push(reportGridDataOperations.updateSignature(requestPutObj));
        }
        if (deleteCertificationArr.length) {
            var requestDeleteObj = {
                    "reportsignoffs": deleteCertificationArr
                }
                //bulk delele
            promises.push(projectDashboardOperations.deleteProjectSignoffs(requestDeleteObj));
        }

        $q.all(promises).then(function (responses) {
            if (responses.length) {

                //case create certification response
                if (postCertificationArr.length) {

                    var resp = responses[0];
                    if (resp.status != undefined && checkStatus.checkCodeInStatusArray(resp.status, 'POST')) {
                        var erroMsg = resp.data.message ? resp.data.message.userMessage : "Sorry. We encountered a problem while processing your request."
                        addClassToReportsAlerts("error", erroMsg);
                    } else {
                        self.showCertAlert = false;
                        //$state.reload();
                    }
                }

                //case update certification response
                if (putCertificationArr.length) {
                    var resp = responses[1] ? responses[1] : responses[0]
                    if (resp.status != undefined && checkStatus.checkCodeInStatusArray(resp.status, 'PUT')) {
                        var erroMsg = resp.data.message ? resp.data.message.userMessage : "Sorry. We encountered a problem while processing your request."
                        addClassToReportsAlerts("error", erroMsg);
                    } else {
                        self.showCertAlert = false;
                        //$state.reload();
                    }
                }

                //case delete certification response
                if (deleteCertificationArr.length) {
                    var resp = responses[2] ? responses[2] : responses[1] ? responses[1] : responses[0]
                    if (resp.status != undefined && checkStatus.checkCodeInStatusArray(resp.status, 'DELETE')) {
                        var erroMsg = resp.data.message ? resp.data.message.userMessage : "Sorry. We encountered a problem while processing your request."
                        addClassToReportsAlerts("error", erroMsg);
                    } else
                        self.showCertAlert = false;
                }

                if (!self.showCertAlert) {
                    getReportSignoffs(true);
                }
            } else self.certicationEditMode = false;
        })
    }

    function getRequestObj(signOffObject, operation) {

        var signObject = {};
        if (operation == 'POST') {
            signObject.templateSignatureGuid = signOffObject.templateSignatureGuid;
            signObject.reportGuid = self.reportGuid;
        } else if (operation == 'PUT')
            signObject.signatureGuid = signOffObject.signatureGuid;
        signObject.certificationText = signOffObject.certificationText;
        signObject.digitalSignatureInPrintedReport = signOffObject.digitalSignatureInPrintedReport;
        signObject.showInPrintedReport = signOffObject.showInPrintedReport;
        signObject.signOffUser = {};
        signObject.signedOnBehalfOfUser = {};
        signObject.signedForUser = {};
        signObject.signOffUser.userID = "";
        signObject.signOffUser.userGUID = signOffObject.signOffUser.userGUID;
        signObject.signOffUser.userName = signOffObject.signOffUser.userName;
        signObject.signOffUser.title = signOffObject.signOffUser.title;
        signObject.signOffUser.email = signOffObject.signOffUser.email;
        signObject.signOffUser.cellPhone = signOffObject.signOffUser.cellPhone;

        signObject.signedOnBehalfOfUser.userGUID = signOffObject.signedOnBehalfOfUser.userGUID;
        signObject.signedOnBehalfOfUser.userName = signOffObject.signedOnBehalfOfUser.userName;
        signObject.signedOnBehalfOfUser.title = signOffObject.signedOnBehalfOfUser.title;
        signObject.signedOnBehalfOfUser.email = signOffObject.signedOnBehalfOfUser.email;
        signObject.signedOnBehalfOfUser.cellPhone = signOffObject.signedOnBehalfOfUser.cellPhone;

        signObject.signedForUser.userGUID = signOffObject.signedForUser.userGUID;
        signObject.signedForUser.userName = signOffObject.signedForUser.userName;
        signObject.signedForUser.title = signOffObject.signedForUser.title;
        signObject.signedForUser.email = signOffObject.signedForUser.email;
        signObject.signedForUser.cellPhone = signOffObject.signedForUser.cellPhone;

        return signObject;
    }

    self.checkUncheckCertification = function (isCertified, certficationObj) {
        if (!isCertified) {
            certficationObj.signOffUser.title = "";
            certficationObj.signOffUser.userName = "";
            certficationObj.signOffUser.userGUID = "";
        } else {
            certficationObj.signOffUser.userName = self.currentUserObject.userName;
            certficationObj.signOffUser.title = self.currentUserObject.title;
            certficationObj.signOffUser.userGUID = self.currentUserObject.userGUID;
        }
    }
    
    self.getAccountMgmtLink = function () {
        var params = {
            companyguid: self.currentUserObject.companyGUID,
            officeguid: self.currentUserObject.officeGUID,
            userguid: self.currentUserObject.userGUID
        };

        var uri = ReportAuthoringAPI.formatUrl(ReportAuthoringUrlCollection.ACCT_USER, params);
        return uri;
    }
    
}])