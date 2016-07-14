angular.module('ReportTemplates').controller('EditTemplatesController', ['$scope', '$timeout', '$filter', '$q', '$http', 'ReportTemplatesAPI', 'ReportOutputSetupAPI', 'DefaultLanguageLibraryAPI', '$modal', '$stateParams','BASEURL', function($scope, $timeout, $filter, $q, $http, ReportTemplatesAPI, ReportOutputSetupAPI, DefaultLanguageLibraryAPI, $modal, $stateParams,BASEURL) {

        $scope.companyList = BASEURL.companies;


        $scope.sections = [];

        $scope.templates = [];
        $scope.Dashboards = [];

        $scope.EditTemplateCompanyID = $stateParams.companyID;
        $scope.template = parseInt($stateParams.SelectedTemplateID);

        function getObjectFromArray(list, field, value) {
            if (!list || !list.length) return null;

            for (var i = 0; i < list.length; i++) {
                var local = list[i];
                if (local[field] == value) {
                    return local;
                }
            }
        }
        var init = function(selectedCompanyID) {
            $scope.selectedCompany = getObjectFromArray($scope.companyList, "companyGUID", selectedCompanyID);
            var promise = getTemplateLists(selectedCompanyID);
            promise.then(function(result) {
                setDefaultTemplateSelected();
            });
            getDashboard();


        }

        function setDefaultTemplateSelected() {
            if ($scope.template && $scope.templates && $scope.templates.length) {
                var selected = getTemplateObjByID($scope.template);
                if (selected) {
                    $scope.selectedTemplate = selected;
                }
            }
        }

        function getTemplateObjByID(id) {
            if (!id || !$scope.templates) return;

            for (var i = 0; i < $scope.templates.length; i++) {
                var local = $scope.templates[i];
                if (local.templateID == id) {
                    return local;
                }
            }
        }

        init($scope.EditTemplateCompanyID);

        $scope.companySelectionChanged = function() {
            clearErrorMsg();
            $scope.Cancel();
            $scope.selectedTemplate = null;
            $scope.template = 0;

            $scope.EditTemplateCompanyID = $scope.selectedCompany.companyGUID;
            getTemplateLists($scope.EditTemplateCompanyID);
            setValueForSetAction();
        };

        function getTemplateName(templateId) {
            for (var i = 0; i < $scope.templates.length; i++) {

                if ($scope.templates[i].templateID == templateId) {

                    return $scope.templates[i].name;
                }
            }
        }

        function getTemplateObj(templateId) {

            for (var i = 0; i < $scope.templates.length; i++) {

                if ($scope.templates[i].templateID == templateId) {
                    /*var templateObj = {
                        "templateID": $scope.templates[i].templateID,
                        "reportType": $scope.templates[i].reportType,
                        "name": $scope.templates[i].name,
                        "ownerCompanyID": $scope.templates[i].ownerCompanyID,
                        "shortName": $scope.templates[i].shortName,
                        "description": $scope.templates[i].description,
                        "dashboard": $scope.templates[i].dashboard,
                        "isMobile": $scope.templates[i].isMobile,
                        "templateVersion": $scope.templates[i].templateVersion

                    }*/
                    var templateObj = angular.copy($scope.templates[i]);
                    return templateObj;
                }
            }
        }

        function getTemplateLists(companyId) {

            //get templates lists
            return ReportTemplatesAPI.getTemplateList(companyId).then(function(result) {

                $scope.templates = result.templates;

            }, function(error) {

            });


        }



        function getTemplateSections() {

            ReportTemplatesAPI.getTemplateSections($scope.selectedTemplate.templateGUID).then(function(sections) {
                $scope.sections = sections;
                // console.log(JSON.stringify($scope.sections));
            }, function(error) {
                $scope.sections = null;
            });


        }

        function getDashboard() {

            ReportTemplatesAPI.getDashboard().then(function(result) {
                $scope.Dashboards = result.dashboardOptions;
            });

        }

        function setValueForSetAction() {
            var action = $scope.action;
            if (action) {
                setDefaultForAction(action);
            }
        }

        function setDefaultForAction(action) {
            switch (action) {
                case 'showRename':
                    if ($scope.template) {
                        var tempName = getTemplateName($scope.template);
                        $scope.renameVal = tempName;
                    }
                    break;
                case 'showCopy':
                    if ($scope.template) {
                        var tempName = getTemplateName($scope.template);
                        $scope.copyVal = tempName;
                    }
                    break;
                case 'showStructure':
                    if ($scope.selectedTemplate) {
                        getTemplateSections();
                    }
                    break;
                case "showShortName":
                    $scope.shortNameVal = $scope.selectedTemplate.shortName;
                    break;
                case "showDefault":
                    templateDefault();
                    break;

                case 'showRules':

                    break;
                case 'showMove':

                    break;
            }
        }

        $scope.actionSelected = function() {
            clearErrorMsg();

            var action = $scope.action;
            setDefaultForAction(action);
        }
        $scope.showDisplayMsg = function(msg, type) {
            $scope.serviceResponseAlert = true;
            $scope.serviceResponseText = msg;
            $scope.msgType = 'alert-' + (type || 'danger');
        }
        $scope.templateChange = function() {
            clearErrorMsg();
            $scope.Cancel();
            
            var action = $scope.action;
            $scope.template = $scope.selectedTemplate.templateID;
            setDefaultForAction(action);
        }
        $scope.Save = function(form) {
            if (!form || form.$invalid) {
                $scope.showDisplayMsg('Invalid Form Submission');
                return;
            }
            var action = $scope.action;
            switch (action) {
                case 'showRename':
                    templateRename();
                    break;
                case 'showCopy':
                    templateCopy();
                    break;
                case 'showStructure':
                    templateStructure();
                    break;
                case 'showRules':
                    templateRules();
                    break;
                case 'showMove':
                    templateMove();
                    break;

                case 'showShortName':
                    templateShortName();
                    break;
                case 'showDashboard':
                    templateDashboard();
                    break;
                    /*case 'showDefault':
                        templateDefault();
                        break;*/

            }

        }
        $scope.Cancel = function() {
            $scope.serviceResponseAlert = false;
            $scope.action = "";
        }

        function templateRename() {


            if ($scope.template) {
                //$scope.template.name = $scope.renameVal;
                var templateObj = getTemplateObj($scope.template);
                templateObj.name = $scope.renameVal;
                ReportTemplatesAPI.putTemplates(templateObj.templateGUID, templateObj).then(function(updatedTemplate) {
                    $scope.showDisplayMsg('Template renamed successfully', 'success');

                    for (var i = 0; i < $scope.templates.length; i++) {

                        if ($scope.templates[i].templateID == $scope.template) {
                            $scope.templates[i] = updatedTemplate;
                            $scope.template = updatedTemplate.templateID;
                            $scope.selectedTemplate = updatedTemplate;
                            return;
                        }
                    }


                }, function(error) {
                    $scope.showDisplayMsg(error);
                });
            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }



        }

        function templateCopy() {
            if ($scope.selectedTemplate) {
                var data = {
                    templateID: $scope.selectedTemplate.templateID,
                    templateGUID: $scope.selectedTemplate.templateGUID,
                    ownerCompanyID: $scope.selectedTemplate.ownerCompanyID,
                    ownerCompanyGUID: $scope.selectedTemplate.ownerCompanyGUID,
                    name: $scope.copyVal
                };
                var promise = ReportTemplatesAPI.copyTemplate(data);
                promise.then(function(newTemplate) {
                    $scope.templates.push(newTemplate);
                    $scope.Cancel();
                }, function(error) {

                });
            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }
        }

        function templateStructure() {
            if ($scope.template != undefined && $scope.template != "" && $scope.template != null) {

            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }
        }

        function templateRules() {
            if ($scope.template != undefined && $scope.template != "" && $scope.template != null) {} else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }
        }

        function templateMove() {
            if ($scope.selectedTemplate) {

                var templateObj = $scope.selectedTemplate; //getTemplateObj($scope.template);
                var otherCompany = $scope.company_move;
                templateObj.ownerCompanyGUID = otherCompany.companyGUID;
                templateObj.ownerCompanyID = otherCompany.companyID;
                ReportTemplatesAPI.putTemplates($scope.selectedTemplate.templateGUID, templateObj).then(function(response) {

                    $scope.showDisplayMsg('Template moved successfully', 'success');

                }, function(error) {
                    $scope.showDisplayMsg(error);
                });
            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }
        }
        $scope.openDelete = function() {
            if ($scope.template != undefined && $scope.template != "" && $scope.template != null) {
                var modalInstance = $modal.open({
                    templateUrl: "DeleteTemplate.html",
                    scope: $scope,
                    controller: deleteTemplateController,
                    size: 0
                })

            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }


        }

        var deleteTemplateController = function($scope, $modalInstance) {
            $scope.deleteTemplate = function() {

                var templateObj = {
                    "templateID": $scope.template,
                    "reportType": $scope.template.reportType,
                    "name": $scope.template.name,
                    "ownerCompanyID": $scope.template.ownerCompanyID,
                    "shortName": $scope.template.shortName,
                    "description": $scope.template.description,
                    "dashboard": $scope.template.dashboard,
                    "isMobile": $scope.template.isMobile,
                    "templateVersion": $scope.template.templateVersion,
                    "isDeleted": 1
                }

                ReportTemplatesAPI.deleteTemplates($scope.selectedTemplate.templateGUID, templateObj).then(function(response) {


                    for (var i = 0; i < $scope.templates.length; i++) {

                        if ($scope.template == $scope.templates[i].templateID) {

                            $scope.templates.splice(i, 1);
                        }
                    }
                    $modalInstance.close();
                    $scope.action = "";
                    $scope.showDisplayMsg('Template deleted successfully', 'success');

                }, function(error) {
                    $scope.showDisplayMsg(error);
                });
            }

            $scope.CancelDelete = function() {

                $modalInstance.close();
            }
        }


        function templateShortName() {
            //  console.log("short name");
            if ($scope.template != undefined && $scope.template != "" && $scope.template != null) {
                var templateObj = angular.copy($scope.selectedTemplate); //getTemplateObj($scope.template);
                templateObj.shortName = $scope.shortNameVal;

                ReportTemplatesAPI.putTemplates($scope.selectedTemplate.templateGUID, templateObj).then(function(updatedTemplate) {
                    $scope.selectedTemplate.shortName = $scope.shortNameVal;
                    $scope.showDisplayMsg('Template(s) short name saved successfully', 'success');

                }, function(error) {
                    $scope.showDisplayMsg(error);
                });
            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }
        }

        function templateDashboard() {
            // console.log("dashboard");
            if ($scope.selectedTemplate) {

                var templateObj = $scope.selectedTemplate; //getTemplateObj($scope.template);
                templateObj.dashboard = $scope.dashboardVal;
                ReportTemplatesAPI.putTemplates($scope.selectedTemplate.templateGUID, templateObj).then(function(response) {

                    $scope.showDisplayMsg('Dashboard defined successfully', 'success');

                }, function(error) {
                    $scope.showDisplayMsg(error);
                });
            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }
        }

        function templateDefault() {
            if ($scope.template != undefined && $scope.template != "" && $scope.template != null) {
                var templateObj = {
                    templateGUID: $scope.selectedTemplate.templateGUID,
                    templateID: $scope.selectedTemplate.templateID
                };
                // If I have templateGUID, I don't need to pass 'companyID', 'reportType', 'clientCompanyID'
                ReportTemplatesAPI.setDefaultReportTemplate(templateObj, $scope.selectedTemplate.ownerCompanyGUID, $scope.selectedTemplate.reportTypeValue, '').then(function(response) {
                    $scope.showDisplayMsg('The default template has been updated.', 'success');
                }, function(error) {
                    $scope.showDisplayMsg(error);
                });
            } else {
                $scope.showDisplayMsg('Please select template', 'danger');
            }
        }


        function clearErrorMsg() {
            $scope.serviceResponseAlert = false;
            $scope.serviceResponseText = "";
        }

    }

]);