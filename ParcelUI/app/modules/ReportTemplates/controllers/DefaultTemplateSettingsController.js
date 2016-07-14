angular.module('ReportTemplates').controller('DefaultTemplateSettingsController', ['$scope', '$timeout', '$filter', '$q', '$http', 'ReportTemplatesAPI', 'ReportOutputSetupAPI', 'DefaultLanguageLibraryAPI', '$modal','BASEURL','AuthFactory','ReportAuthoringAPI', function($scope, $timeout, $filter, $q, $http, ReportTemplatesAPI, ReportOutputSetupAPI, DefaultLanguageLibraryAPI, $modal,BASEURL,AuthFactory,ReportAuthoringAPI) {


        $scope.templateArr = [];
        $scope.defLangLibArr = [];
        $scope.tocArr = [];
        $scope.repSetupArr = [];
        $scope.transLetterArr = [];
        $scope.defaultTemplates = [];
        $scope.templateArr = [];
        //var companyId = 12;
        $scope.companyID = AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID');

        init();
        function init()
        {
             getTemplateLists($scope.companyID);
        }

        /*var init = function () {
            getTemplateLists();
        }

        init();*/

        $scope.companySelectionChanged = function() {
          
            getTemplateLists($scope.companyID);
        };

        //value of default templates with their respective report/dll/toc etc values.
        /*$scope.defaultTemplates = [{
            "templateID": 2638,
            "languageLibraryID": 1,
            "reportOutputSetupID": 22,
            "tocSetupID": 33,
            "transmittalSetupID": 44,
            "coverPageID": 1
        }, {
            "templateID": 2641,
            "languageLibraryID": 2,
            "reportOutputSetupID": 22,
            "tocSetupID": 33,
            "transmittalSetupID": 44,
            "coverPageID": 1
        }]*/
        $scope.defaultTemplates = [];


        $scope.showDisplayMsg = function(msg, type) {
            $scope.serviceResponseAlert = true;
            $scope.serviceResponseText = msg;
            $scope.msgType = 'alert-' + (type || 'danger');
        }

        function mergeDefaultValuesWithTemplate(templates) {


            for (var j = 0; j < templates.length; j++) {
                var templateStructure = {
                    templateID: templates[j].templateID,
                    templateGUID: templates[j].templateGUID,
                    name: templates[j].name
                };
                $scope.templateArr.push(templateStructure);
                
                if ($scope.defaultTemplates) {
                    for (var i = 0; i < $scope.defaultTemplates.length; i++) {
                        if ($scope.defaultTemplates[i].templateID == templates[j].templateID) {
                            templateStructure.languageLibraryID = $scope.defaultTemplates[i].languageLibraryGUID;
                            templateStructure.reportOutputSetupID = $scope.defaultTemplates[i].reportOutputSetupGUID;
                            templateStructure.tocSetupID = $scope.defaultTemplates[i].tocSetupGUID;
                            templateStructure.transmittalSetupID = $scope.defaultTemplates[i].transmittalSetupGUID;
                            templateStructure.coverPageID = $scope.defaultTemplates[i].coverPageGUID;
                        }

                    }
                }
            }
        }

        function getTemplateList_withPromise(companyId) {
            //get templates lists
            return ReportTemplatesAPI.getTemplateList(companyId).then(function(templates) {
                return templates.templates;
            }, function(error) {

            });
        }

        function getTemplateDefaults_withPromise(companyID, templateID, templates) {
            return ReportTemplatesAPI.getTemplateDefaults(companyID, templateID);
        }

        function getTemplateLists(companyId) {
            getTemplateList_withPromise(companyId)
                .then(function(templates) {
                    var promiseArr = [];
                    angular.forEach(templates, function(templateItem) {
                        promiseArr.push(getTemplateDefaults_withPromise(companyId, templateItem.templateGUID)
                            .then(function(defaults) {
                                if (defaults) {
                                    if (!defaults.templateID) {
                                        defaults.templateID = templateItem.templateID;
                                    }
                                    if (!defaults.templateGUID) {
                                        defaults.templateGUID = templateItem.templateGUID;
                                    }
                                    $scope.defaultTemplates.push(defaults);
                                }
                            }, function(error) {
                                // suppress exception for single GET template default call
                            }));
                    });
                    return $q.all(promiseArr).then(function(resultSet) {
                        return templates;
                    });
                })
                .then(function(templates) {
                    mergeDefaultValuesWithTemplate(templates);
                });


           //get report setup list
            ReportAuthoringAPI.getReportOutputList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID'), 'ROS_SET').then(function(reportsData) {
                for (var i = 0; i < reportsData.length; i++) {
                    var reportStructure = {
                        value: reportsData[i].reportOutputSetupGUID,
                        text: reportsData[i].name
                    }
                    $scope.repSetupArr.push(reportStructure);
                }


            }, function(error) {

            });

            //get report toc list
            ReportAuthoringAPI.getReportOutputList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID'), 'TOC_SET').then(function(tocData) {


                for (var i = 0; i < tocData.length; i++) {
                    var tocStructure = {
                        value: tocData[i].reportOutputSetupGUID,
                        text: tocData[i].name
                    }
                    $scope.tocArr.push(tocStructure);
                }


            }, function(error) {

            });

            //get report tl list
            ReportAuthoringAPI.getReportOutputList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID'), 'TRANS_SET').then(function(transData) {



                for (var i = 0; i < transData.length; i++) {
                    var transStructure = {
                        value: transData[i].reportOutputSetupGUID,
                        text: transData[i].name
                    }
                    $scope.transLetterArr.push(transStructure);
                }


            }, function(error) {

            });

            //get report dll list
            DefaultLanguageLibraryAPI.getDLLList(companyId).then(function(dllData) {

                for (var i = 0; i < dllData.libraries.length; i++) {
                    var dllStructure = {
                        value: dllData.libraries[i].libraryGUID,
                        text: dllData.libraries[i].name
                    }
                    $scope.defLangLibArr.push(dllStructure);
                }


            }, function(error) {

            });

         //get report cover list
            ReportAuthoringAPI.getCoverPageList(AuthFactory.getUserDetailsFromStorage('EFF_COMPANYGUID')).then(function                     (coverData) {
                for (var i = 0; i < coverData.length; i++) {
                    var coverStructure = {
                        value: coverData[i].coverPageGuid,
                        text: coverData[i].name
                    }
                    $scope.coverPageArr.push(coverStructure);
                }


            }, function (error) {

            });


        }


        //Default Language Library starts
        //        $scope.defLangLibArr = [
        //            {
        //                value: 1,
        //                text: '2015 RM Project Simplified PCA'
        //            },
        //            {
        //                value: 2,
        //                text: 'ASTM PCA - PARCEL Default'
        //            },
        //            {
        //                value: 3,
        //                text: 'EDR Mobile - PCA Site Reconnaissance'
        //            }
        //    ];

        $scope.showdefLangLib = function(template) {
            var selected = [];
            if (template.languageLibraryID) {
                selected = $filter('filter')($scope.defLangLibArr, {
                    value: template.languageLibraryID
                });
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.showtoc = function(template) {
            var selected = [];
            //            if (template.tocVal) {
            //                selected = $filter('filter')($scope.tocArr, {
            //                    value: template.tocVal
            //                });
            //            }
            //            return selected.length ? selected[0].text : 'Not set';

            if (template.tocSetupID) {
                selected = $filter('filter')($scope.tocArr, {
                    value: template.tocSetupID
                });
            }

            return selected.length ? selected[0].text : 'Not set';
        };

        //table of contents ends


        //report setup starts

        //        $scope.repSetupArr = [
        //            {
        //                value: 1,
        //                text: 'First Parcel Report'
        //            },
        //            {
        //                value: 2,
        //                text: '2013 RM PARCEL Simplified'
        //            },
        //            {
        //                value: 3,
        //                text: 'EDR Default Phase I'
        //            },
        //            {
        //                value: 4,
        //                text: 'Parcel Default DB Review'
        //            }
        //
        //    ];

        $scope.showrepSetup = function(template) {

            var selected = [];
            if (template.reportOutputSetupID) {
                selected = $filter('filter')($scope.repSetupArr, {
                    value: template.reportOutputSetupID
                });
            }

            return selected.length ? selected[0].text : 'Not set';
        };


        //report setup ends


        //transmittal letter starts

        //        $scope.transLetterArr = [
        //            {
        //                value: 1,
        //                text: 'Parcel Default'
        //            },
        //            {
        //                value: 2,
        //                text: 'Parcel Default Phase I'
        //            }
        //
        //    ];

        $scope.showtranLetter = function(template) {
            var selected = [];
            if (template.transmittalSetupID) {
                selected = $filter('filter')($scope.transLetterArr, {
                    value: template.transmittalSetupID
                });
            }
            return selected.length ? selected[0].text : 'Not set';
        };


        //transmittal letter ends

        //cover page starts


        $scope.coverPageArr = [{
                value: "e58e292b-1eb2-4fdb-b1fa-56abfe01b288",
                text: 'Parcel Default'
            }, {
                value: "e58e292b-1eb2-4fdb-b1fa-56abfe01b297",
                text: 'Parcel Cover Page w Photo'
            }

        ];

        $scope.showcoverPage = function(template) {
            var selected = [];
            if (template.coverPageVal) {
                selected = $filter('filter')($scope.coverPageArr, {
                    value: template.coverPageVal
                });
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        //cover page ends



        $scope.checkName = function(data, id) {
            if (id === 2 && data !== 'awesome') {
                return "Username 2 should be `awesome`";
            }
        };

        $scope.saveUser = function(data, id) {
            //$scope.user not updated yet
            angular.extend(data, {
                id: id
            });
            //return $http.post('/saveUser', data);
        };

        // remove user
        $scope.removeUser = function(index) {
            $scope.templateArr.splice(index, 1);
        };
      $scope.saveDefaultTemplate = function (template,data) {
           var templateDefaultsObj={
           "languageLibraryGUID": data.languageLibraryID,
            "reportOutputSetupGUID": data.reportOutputSetupID,
            "tocSetupGUID": data.tocSetupID,
            "transmittalSetupGUID": data.transmittalSetupID,
            "coverPageGUID": data.coverPageVal

           };
            var companyId = $scope.companyID;
            ReportTemplatesAPI.putDefaultTemplates(template.templateGUID, templateDefaultsObj, companyId).then(function(response) {
                $scope.showDisplayMsg('Template updated successfully', 'success');


            }, function(error) {
                $scope.showDisplayMsg(error);

            });
        };
      

        $scope.openDelete = function(template) {

            var val = {
                template: template
            }

            var modalInstance = $modal.open({
                templateUrl: "dllDeleteTemplate.html",
                scope: $scope,
                controller: deleteDefaultLanguageController,
                size: 0,
                resolve: {
                    parameters: function() {
                        return val;
                    }
                }
            })

        }

        var deleteDefaultLanguageController = function($scope, $modalInstance, parameters) {
            $scope.deleteDefaultTemplate = function() {

                ReportTemplatesAPI.deleteDefaultTemplates(parameters.template.templateID, parameters.template).then(function(response) {

                    $scope.showDisplayMsg('Template deleted successfully', 'success');
                    for (var i = 0; i < $scope.templateArr.length; i++) {

                        if (parameters.template.templateID == $scope.templateArr[i].templateID) {

                            $scope.templateArr.splice(i, 1);
                            $modalInstance.close();
                        }
                    }


                }, function(error) {
                    $scope.showDisplayMsg(error);
                });
            }

            $scope.CancelDelete = function() {

                $modalInstance.close();
            }
        }

    }

]);