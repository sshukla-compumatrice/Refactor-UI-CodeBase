// view map tool controller 
angular.module('ReportAuthoring').controller('VariableReplacerCtrl', ['$scope', '$modalInstance', '$timeout', '$stateParams', 'VariableReplacerAPI', '$modal', '$filter', 'HelperService', 'ReportAuthoringAPI', '$window', function ($scope, $modalInstance, $timeout, $stateParams, VariableReplacerAPI, $modal, $filter, HelperService, ReportAuthoringAPI, $window) {

    var self = this;

    init();

    function init() {
        $scope.ExcludedVariables = [
            'regeocode', 'consultantFillOfficeInfo'
          ];
        var VRContents = [];
        if (typeof $scope.$parent.VRContents !== 'undefined') {
            for (var index = 0; index < $scope.$parent.VRContents.dataFields.length; index++) {
                for (var fieldIndex = 0; fieldIndex < $scope.$parent.VRContents.dataFields[index].fields.length; fieldIndex++) {
                    var mapField = $scope.$parent.VRContents.dataFields[index].fields[fieldIndex].mappedField;
                    if ($scope.ExcludedVariables.indexOf(mapField) == -1) {

                        var element = {};
                        var variableName = $scope.$parent.VRContents.dataFields[index].fields[fieldIndex].variableName; 
                        if(variableName != null){
                        element.VariableName = variableName;                       
                        element.keywordname = $scope.$parent.VRContents.dataFields[index].fields[fieldIndex].mappedField;

                        var fieldValue = $scope.$parent.VRContents.dataFields[index].fields[fieldIndex].fieldValue;     
                        var fieldType = $scope.$parent.VRContents.dataFields[index].fields[fieldIndex].fieldType;
                        element.fieldType = fieldType;       
                            
                        if (fieldType == 'text') {
                            element.keywordvalue = fieldValue;
                        } else if(fieldType == 'date') {
                            
                            var dateFieldIsVariable;
                            if(fieldValue != ''){
                                dateFieldIsVariable = fieldValue.substring(1, fieldValue.length-1);                      
                            }
                            if(dateFieldIsVariable != variableName){
                                var d = new Date(fieldValue);
                                if(d == 'Invalid Date'){
                                    element.keywordvalue = fieldValue;
                                }else{
                                   fieldValue = fieldValue.replace(new RegExp('-',"g"),'/');
                                   element.keywordvalue = $filter('date')(new Date(fieldValue), 'MM/dd/yyyy');
                                }
                            }else if(dateFieldIsVariable == variableName ){
                                element.keywordvalue = '{' + variableName + '}';
                            }else{
                                element.keywordvalue = "";
                            }                    
                                //element.keywordvalue = fieldValue != '' ? $filter('date')(new Date(fieldValue), 'MM/dd/yyyy') : "";
                        }
                        else {
                            element.keywordvalue = fieldValue;
                        }                                                  

                if ($scope.$parent.VRContents.dataFields[index].fields[fieldIndex].variableReplacerSections !== null) {
                            element.isKeywordExist = true;
                            var content = $scope.$parent.VRContents.dataFields[index].fields[fieldIndex].variableReplacerSections;
                            if (content.length > 0) {
                                var sectionData = [];
                                for (var ct = 0; ct < content.length; ct++) {

                                    var con = content[ct].sectionData.contentValues.ckEditData.div1;
                                    /*var matches = con.match(/\{(.*?)\}/g);
                                    $.each(matches, function (index, match) {
                                        con = con.replace(match, '<font style="color:#9400D3">' + match + "</font>");
                                    });*/
        var mf = $scope.$parent.VRContents.dataFields[index].fields[fieldIndex].mappedField;
                                    
        con = con.replace(new RegExp('{' + variableName + '}',"g"),'<font style="color:#9400D3">' + '{' + variableName + '}' + "</font>");                                    

                                    var obj = {
                                        "sectionTitle": content[ct].sectionNumber + ' ' + content[ct].sectionTitle,
                                        "sectionData": con 
                                    };
                                    sectionData.push(obj);
                                }
                                element.sectionColData = sectionData;                                
                            }
                        } else {
                            element.isKeywordExist = false;
                        }
                        VRContents.push(element);
                        element = {};
                    }
                  }

                }
                self.VRContents = VRContents;
            }
        }
    }

    function isDate(val) {
        var d = new Date(val);
        return !isNaN(d.valueOf());
    }

    String.prototype.replaceAll = function (search, replacement) {
        var reg = new RegExp(search, 'g');
        return this.replace(reg, replacement);
    };

    self.CancelVariableReplacer = function () {
        $modalInstance.close();
        $window.location.reload();
    }

    self.selectAll = function () {

        angular.forEach(self.VRContents, function (obj) {
            obj.isKeywordExist = true;
        });
    };

    self.clearAll = function () {
        angular.forEach(self.VRContents, function (obj) {
            obj.isKeywordExist = false;
        });
    };

    function showPNotifyMessage(title, text, type) {
        new PNotify({
            title: title,
            text: text,
            type: type,
            addclass: "stack-bottomright",
            stack: $scope.stack_bottomright
        });
    }

    self.showPopupContent = function () {
        $timeout(function () {
            $('[data-toggle="popover"]').popover();
        });
    }


    function replaceChildSection(section, variableName, replaceWhich) {

        if (section.sectionData && section.sectionData.contentValues.ckEditData) {
            var ckDivData = section.sectionData.contentValues.ckEditData;

            angular.forEach(section.sectionData.contentValues.ckEditData, function (ckDivData, index) {
                var sectionText = ckDivData;
                ckDivData = changeSectionText(sectionText, variableName, replaceWhich);
                section.sectionData.contentValues.ckEditData[index] = ckDivData;
            });

        }
        var nestedSection = section.sections;
        if (!nestedSection || !nestedSection.length) return;
        for (var childIndex = 0; childIndex < nestedSection.length; childIndex++) {
            var child = nestedSection[childIndex];
            replaceChildSection(child, variableName, replaceWhich);
        }
    }

    function changeSectionText(text, variableName, replaceWhich) {
        text = text.replace(new RegExp('{' + variableName + '}', 'g'), ' ' + replaceWhich + ' ')
        return text;
    }

    self.ReplaceVariables = function () {

        if (!confirm("Clicking OK will overwrite the sections selected with the information you chose. \n Are you sure you want to proceed?")) {
            return;
        }
       
        var sectionIDlist = $scope.ck.allsectionIdList;
        for (var index = 0; index < self.VRContents.length; index++) {
            var variableName = self.VRContents[index].VariableName;
            var replaceWhich = self.VRContents[index].keywordvalue;
            var isKeywordChecked = self.VRContents[index].isKeywordExist;
            if (isKeywordChecked) {
                var checkIsvariable = '{' + variableName + '}';
                if(replaceWhich != '' || replaceWhich == checkIsvariable){
                    for (var i = 0; i < $scope.ck.resp.sections.length; i++) {
                        replaceChildSection($scope.ck.resp.sections[i], variableName, replaceWhich);
                    }
                }
            }
        }

        //SAVE CONTENT
        //        

        $timeout(function () {
            var sectionData;
            sectionData = $scope.ck.resp.sections;
            var messageText = 'The variables were replaced successfully in the narrative and General Information of your report.'
            self.saveSections(sectionData, messageText);
           
        }, 3000);




        //SAVE VARIABLE VALUES

        var variables = [];
        var ExcludedVariablesForEmpty = [
            'PropertyLongitude', 'PropertyLatitude'
          ];
        for (var index = 0; index < self.VRContents.length; index++) {
                           
            var IsVariableChecked = self.VRContents[index].isKeywordExist;            
            var variableName = self.VRContents[index].VariableName;
            
            //var isKeywordExist = self.VRContents[index].isKeywordExist;
                        
            if(IsVariableChecked){
            
                var keywordValue;
                
                //if(self.VRContents[index].keywordvalue != ''){
                    //if (isKeywordExist) {
                        if(self.VRContents[index].keywordvalue == '' || self.VRContents[index].keywordvalue == null){
                            keywordValue = '{' + self.VRContents[index].VariableName + '}';
                            if (ExcludedVariablesForEmpty.indexOf(variableName) == -1){
                                        variables.push({
                                    'name': variableName,
                                    'value': keywordValue
                                });
                              }
                            
                        }else{
                            keywordValue = self.VRContents[index].keywordvalue;
                                        variables.push({
                                    'name': variableName,
                                    'value': keywordValue
                                });
                        }
                    /*}else{
                       keywordValue = self.VRContents[index].keywordvalue;
                    }*/
                //}else{
                  //  keywordValue = self.VRContents[index].keywordvalue;
             //    }
                    /*variables.push({
                        'name': variableName,
                        'value': keywordValue
                    });*/
                }            
            
        }
        if(variables.length > 0){
            var reportGuid = $stateParams.reportGuid;
            VariableReplacerAPI.updateKeywordsValue(reportGuid, variables);
        }

    }

    var sectionsArray = [];
    var isUpdate = false;
    self.saveSections = function (sectionData, messageText) {
        sectionsArray = [];
        isUpdate = false;
        if (!angular.isArray(sectionData)) {

            loadsaveSection(sectionData);
            if (isUpdate && sectionsArray.length) {
                updateSections(sectionsArray, sectionData.sectionName, sectionData.sectionNumber, null, sectionData.sectionID);
            } else {
                HelperService.showPNotifyMessage('Everything is up to date.', 'We couldn\'t find any changes to save.', 'info');
            }
        }
        //Save all sections
        else {
            var updatedSectionsArr = [];
            angular.forEach($scope.ck.resp.sections, function (section, index) {
                loadsaveSection(section);
            });

            if (sectionsArray.length) {
                //self.pNotifySuccessMsg = updatedSectionsArr.join(', ') + ' saved.';
                updateSections(sectionsArray, null, null, null, null, messageText);
            } else {
                HelperService.showPNotifyMessage('Everything is up to date.', 'We couldn\'t find any changes to save.', 'info');
            }
        }
        
        var reportGuid = $scope.$parent.reportGuid;
        var promise = VariableReplacerAPI.getVariableReplacerKeywords(reportGuid);        
        promise.then(function (replacerResp) {
            $scope.$parent.VRContents = replacerResp;            
            init();
        }, function (error) {
            console.log("error");
        });
        
    }

    function loadsaveSection(section) {

        if (section.sectionData && section.sectionData.contentValues) {

            var oldSectionData = $filter('filter')($scope.ck.copyOfAllSections, {
                sectionGUID: section.sectionGUID
            }, true);
            if (!HelperService.compareObjFunction(oldSectionData[0].sectionData.contentValues, section.sectionData.contentValues)) {
                var obj = {
                    "sectionGUID": section.sectionGUID,
                    "sectionData": {
                        "contentValues": section.sectionData.contentValues
                    }
                }
                sectionsArray.push(obj);
                isUpdate = true;
            }

        }
        for (var childIndex = 0; section.sections.length > childIndex; childIndex++) {
            loadsaveSection(section.sections[childIndex]);
        }

    }


    function updateSections(sectionsArray, sectionName, sectionNumber, changedContentValues, sectionID, messageText) {
        var data = {};
        data["formSectionData"] = sectionsArray;
        //$scope.rigthSectionForm.$setPristine();
        self.isCkDirty = false;
        var promise = ReportAuthoringAPI.updateSection($scope.ck.reportId, null, data);
        promise.then(function (resp) {
            if (resp.report && resp.report.reportData && resp.report.reportData.formSectionData.length) {
                var updatedSections = resp.report.reportData.formSectionData;
                $scope.$broadcast('disable-save-button');
                var title = self.pNotifySuccessTitle ? self.pNotifySuccessTitle : 'Success';
                var text = self.pNotifySuccessMsg ? self.pNotifySuccessMsg : messageText;
                var type = 'success';
                HelperService.showPNotifyMessage(title, text, type);
                self.isCkDirty = false;
                $scope.ck.lastUpdatedSectionDetails(updatedSections); //set lastupdated details
                //setUpdatedSectionsToOldSections(sectionsArray, changedContentValues, sectionID);
                return true;
            } else {
                var msg = 'Failed to update your information. Please try again';
                if (resp.message)
                    msg = resp.message.userMessage;

                var title = self.pNotifySuccessTitle ? self.pNotifySuccessTitle : "Error";
                var text = self.pNotifyErrorMsg ? self.pNotifyErrorMsg + " " + msg : msg;
                var type = 'error';
                HelperService.showPNotifyMessage(title, text, type);
                return false;
            }
        }, function (error) {
            var msg = 'Failed to update your information. Please try again';
            if (error.message)
                msg = error.message.userMessage;

            var title = self.pNotifySuccessTitle ? self.pNotifySuccessTitle : "Error";
            var text = self.pNotifyErrorMsg ? self.pNotifyErrorMsg + " " + msg : msg;
            var type = 'error';
            HelperService.showPNotifyMessage(title, text, type);
        });
    } 
    
}]);
