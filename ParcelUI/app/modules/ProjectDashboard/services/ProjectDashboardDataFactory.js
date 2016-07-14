angular.module('ProjectDashboard').factory('projectDashboardOperations', ['$http', '$log', 'getProjectDashboardUrls', '$modal', 'BASEURL', 'APIFactory', function ($http, $log, getProjectDashboardUrls, $modal, BASEURL, APIFactory) {

        var factory = {};

        var searchTerm = "";
        var reportStatus = [];


        function formatUrl(url, queryParams) {
            if (!queryParams) return url;

            for (var param in queryParams) {
                url = url.replace("{" + param + "}", queryParams[param]);
            }
            return url;
        };
        var getDashboardDataUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetProjectDetails;
        var updateProjectInformationUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationUpdateProjectDetails;
        var getAddReportsDataUrl = BASEURL.parcelPOC + getProjectDashboardUrls.getDataForAddingReports;
        var getProjectListUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationProjectList;
        var addReportsToProject = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationAddReportsToProject;
        var getProjectSearchUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetProjectSearchList;
        var getPDFUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetPdfList;
        var getProjectInPorfolioUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetPortfolioProjects;
        var getSearchedPortfolioProjectsUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationSearchedPortfolioProjects;
        var getProjectReports = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetProjectReports;
        var getTOCData = BASEURL.reportWritingPOC + getProjectDashboardUrls.realImplementationGetTOC;
        var localStorageObjectUrl = getProjectDashboardUrls.portfolioLocalStorageObject;
        var getReportOrderListUrl = BASEURL.EDR_ORDER + getProjectDashboardUrls.realImplementationGetReportOrdersList;
        var getProjectOrderListUrl = BASEURL.EDR_ORDER + getProjectDashboardUrls.realImplementationGetProjectOrdersList;
        var getEDRStatusPageUrl = BASEURL.BASE_EDRORDERING_SERVICE + getProjectDashboardUrls.realImplementationGetEDRStatusPage;
        var getSpecificCountryUrl = BASEURL.REPORTAUTHORING_GEODEV + getProjectDashboardUrls.realImpemenationSpecificCountryUrl;
        var getLatLongFromGeocodeUrl = BASEURL.REPORTAUTHORING_GEODEV + getProjectDashboardUrls.realImplementationGetLatLongUrl;
        var getProjectSignOffUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetProjectSignoff;
        var deleteProjectSignOffUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationDeleteReportSignOff;
        var updateProjectSignOffUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationUpdateSignatures;
        var addProjectSignOffUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationAddSignatures;
        var searchProjectReports = BASEURL.REPORTAUTHORING + getProjectDashboardUrls.realImplementationSearchProjectReports;
        var getProjectInformationUrl = BASEURL.parcelPOC + getProjectDashboardUrls.realImplementationGetProjectsInfo;

        factory.getCountryObject = function (countryCode) {
            var params = {
                code: countryCode
            }
            var uri = formatUrl(getSpecificCountryUrl, params);
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }

        factory.getLatLongFromGeocode = function (addressObject) {
            var params = {
                sitename: addressObject.sitename,
                address1: addressObject.address,
                city: addressObject.city,
                state: addressObject.state,
                country: addressObject.country,
                zipcode: addressObject.zipcode
            }
            var uri = formatUrl(getLatLongFromGeocodeUrl, params);
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {

                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }

        factory.geEDRStatusPage = function (orderGuid) {
            var params = {
                orderGuid: orderGuid
            };

            var uri = formatUrl(getEDRStatusPageUrl, params);

            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {
                return error;
            });
        }


        factory.getReportOrderList = function (reportGuid) {

            var params = {
                reportGuid: reportGuid
                    //reportGuid: '984F87C2-9FE9-4C99-9055-C7E308A477EA'
                    //reportGuid: 'B0FCB7AE-CBF6-11E5-B5C1-0E29ED3D2A45'
            }
            var uri = formatUrl(getReportOrderListUrl, params);

            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {

                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }

        factory.getProjectOrderList = function (projectGuid) {

            var params = {
                projectGuid: projectGuid
            }
            var uri = formatUrl(getProjectOrderListUrl, params);
            /*var uri = "http://apidev.edrcore.com/edrorderingservice/edrorders/project/0DB016E2-92A4-11E5-8226-0E29ED3D2A45"*/

            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {

                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }


        factory.getTOC = function (reportGuid) {
            var params = {
                reportGuid: 'A560B5D0-8CEF-11E5-8226-0E29ED3D2A45'
            }
            var uri = formatUrl(getTOCData, params);
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {

                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });
        }

        factory.getLocalStorageObject = function () {
            return $http.get(localStorageObjectUrl).then(function (response) {
                return response;
            })
        }

        factory.getProjectReports = function (projectGuid) {
            var params = {
                projectGuid: projectGuid
            }
            var uri = formatUrl(getProjectReports, params);
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });
        }

        factory.getProjectReportsWithPagination = function (obj) {
            var params = {
                projectGuid: obj.projectGuid,
                limit: obj.limit,
                offset: obj.offset,
                query: ''
            }

            if (obj.term != null) {
                params.query = obj.term
            }

            var uri = formatUrl(searchProjectReports, params);
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {
                return error;
            });
        }

        factory.geCountriesData = function () {


            var uri = 'app/modules/SharedModules/countrySelect/geoLocationCountries.json';
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }

        factory.getStatesData = function (countryObject) {

            if (countryObject.code === 'US')
                var uri = 'app/modules/SharedModules/countrySelect/states/states_US.json';
            else if (countryObject.code === 'CA')
                var uri = 'app/modules/SharedModules/countrySelect/states/states_Canada.json';
            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {


                if(response)
                return response.data;
                else return null;

            }, function (error) {

                return error;
            });

        }


        factory.getProjectListData = function (obj) {

            if (obj) {
                var params = {
                    limit: obj.limit,
                    offset: obj.offset
                }
                var uri = formatUrl(getProjectListUrl, params);
            } else {
                var uri = getProjectListUrl.split('?')[0];
            }

            return $http.get(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }


        factory.getProjectsForPortfolio = function (obj) {

            try {
                var params = {
                    limit: obj.limit,
                    offset: obj.offset,

                    filter: obj.filterText
                }
                var uri = formatUrl(getProjectInPorfolioUrl, params);

                return $http.get(uri, {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    /*var time = response.config.responseTimestamp - response.config.requestTimestamp;
                    console.log('The request took ' + (time / 1000) + ' seconds.');*/

                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        }


        factory.getProjectSearchData = function (obj) {
            try {
                var params = {
                    projectname: obj.projectName,
                    limit: obj.limit,
                    offset: obj.offset
                }

                var uri = formatUrl(getProjectSearchUrl, params);

                return $http.get(uri, {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    

                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };

        factory.getSearchedPortfolioProjects = function (obj) {
            try {
                var params = {
                    limit: obj.limit,
                    offset: obj.offset,
                    projectname: obj.projectName,
                    filter: obj.filterText

                }
                var uri = formatUrl(getSearchedPortfolioProjectsUrl, params);

                return $http.get(uri, {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    

                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };

        factory.updateProjectData = function (projectGuid, object) {
            return $http.put(updateProjectInformationUrl + projectGuid, object, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }

        factory.updateReportStatus = function (object, reportGuid) {

            var status = [];
            status.push({
                'reportGuid': reportGuid,
                'statusGuid': object[0].reportStatusGuid,
                'isLocked': 0
            });
            var obj = {};
            obj.status = status;

            return $http.put('http://private-9f95d-parcelreportsapi.apiary-mock.com/reportstatus', obj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }
        factory.deleteReport = function (reportGuid) {



            return $http.delete('http://private-9f95d-parcelreportsapi.apiary-mock.com/reports/' + reportGuid, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response;
                else return null;
            }, function (error) {

                return error;
            });

        }



        factory.getData = function (projectGuid, accountGuid) {
            try {
                var params = {
                    projectGuid: projectGuid,
                    accountGuid: accountGuid
                }
                var uri = formatUrl(getDashboardDataUrl, params);

                return $http.get(uri, {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    
                    reportStatus = response.data.dashboard.desc.reportStatusList;
                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };

        factory.getReportStatusArray = function () {
            return reportStatus;
        }

        factory.setTerm = function (term) {
            searchTerm = term;
        }

        factory.getTerm = function (term) {
            return term;
        }


        factory.getAppendixFiles = function (reportID, sectionID) {
            try {

                return $http.get('http://private-2a2be-parcelappendixapi.apiary-mock.com/appendices/' + reportID + '/' + sectionID + '/files', {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {

                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };


        factory.getAppendixPhoto = function (reportID, sectionID) {
            try {

                return $http.get('http://private-2a2be-parcelappendixapi.apiary-mock.com/photos/' + self.reportID + '/' + self.sectionID, {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {

                    if(response)
                return response;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };


        factory.getLatitudeLongitude = function (address, callback) {

            geocoder = new google.maps.Geocoder();

            var coordinates;


            geocoder.geocode({
                address: address
            }, function (result, status) {
                console.log("API stats " + status)
                if (result != null && result.length != 0) {
                    coordinates = [result[0].geometry.location.lat(), result[0].geometry.location.lng()]
                    callback(coordinates, status);
                } else {
                    callback(["", ""], "Invalid Address");
                }

            })
        }

        factory.mapGlobalSettings = function (lat, lng, zoomlevel, mapType, elmentId) {

            var latlng = new google.maps.LatLng(lat, lng);
            var mapOptions = {
                zoom: zoomlevel,
                center: latlng,
                mapTypeId: mapType
            }
            var obj = {
                geocoder: new google.maps.Geocoder(),
                map: new google.maps.Map($("#mapCanvas")[0], mapOptions),
                bounds: new google.maps.LatLngBounds(),
                infowindow: new google.maps.InfoWindow({})
            }


            return obj;

        }


        factory.openPopUp = function ($scope, size, resolve, module, backdrop, parentscope) {
            var obj = {
                templateUrl: getTemplate(module),
                controller: getController(module),
                size: size,
                resolve: resolve,
                backdrop: backdrop
            }
            if (parentscope) obj.scope = $scope;
            var modalInstance = $modal.open(obj);
            modalInstance.result.then(function (result) {
                if (result)
                    $scope.$broadcast('event:data-updated', {
                        obj: result
                    });
            });
        }

        function getTemplate(module) {
            switch (module) {
                case "openSiteDetails":
                    return 'app/modules/ProjectDashboard/views/siteDetails.html'
                    break;
                case "sendEmail":
                    break;
                case "reportStatus":
                    return 'app/modules/ProjectDashboard/views/reportStatus.html'
                    break;
                case "deleteReport":
                    return 'app/modules/ProjectDashboard/views/deleteReport.html'
                    break;
                case "reportSignOff":
                    return 'app/modules/ProjectDashboard/views/reportSignOff.html'
                    break;
                case "findContact":
                    return 'app/modules/ProjectDashboard/views/findContact.html'
                    break;
                case "createTeam":
                    return 'app/modules/ProjectDashboard/views/createTeam.html'
                    break;
                case "showKeywords":
                    return 'app/modules/ParcelWriter/views/showKeywords.html'
                    break;
                case "parcelWriterAlert":
                    return 'notification.html'
                    break;
                case "languageSelectionAlert":
                    return 'languageSelectionAlert.html'
                    break;

            }
        }

        function getController(module) {
            switch (module) {

                case "openSiteDetails":
                    return 'SiteDetailsController as siteDetails'
                    break;
                case "sendEmail":
                    break;
                case "reportStatus":
                    return 'ReportStatusController as reportStatus'
                    break;
                case "deleteReport":
                    return 'DeleteReportController as deleteReport'
                    break;
                case "reportSignOff":
                    return 'ReportSignOffController as reportSignOff'
                    break;
                case "findContact":
                    return 'FindContact as findContact'
                    break;
                case "createTeam":
                    return 'CreateTeam as createTeam'
                    break;
                case "showKeywords":
                    return 'ShowKeywords as showKeyword'
                    break;
                case "parcelWriterAlert":
                    return 'ParcelWriterAlert as parcelWriterAlert'
                    break;
                case "languageSelectionAlert":
                    return 'LanguageSelectionAlert as languageSelectionAlert'
                    break;

            }
        }

        factory.getPDF = function (projectGuid, accountGuid) {
            try {

                var params = {
                    projectGuid: projectGuid,
                    accountGuid: accountGuid
                }
                var uri = formatUrl(getPDFUrl, params);
                return $http.get(uri, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {

                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };



        factory.getDataForAddingReports = function (companyGuid, userGuid) {
            try {
                var params = {
                    companyGUID: companyGuid,
                    userGUID: userGuid
                }
                var uri = formatUrl(getAddReportsDataUrl, params);

                return $http.get(uri, {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    
                    //reportStatus = response.data.dashboard.desc.reportStatusList;
                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };

        factory.addReportsToProperty = function (object) {
            return $http.post(addReportsToProject, object, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            }).then(function (response) {
                if(response)
                return response.data;
                else return null;
            }, function (error) {

                return error;
            });

        }

        //Project SignOff
        factory.getProjectSignOffData = function (projectGuid, accountGuid) {
            try {
                var params = {
                    projectGuid: projectGuid
                        //accountGuid: accountGuid
                }
                var uri = formatUrl(getProjectSignOffUrl, params);

                return $http.get(uri, {
                    headers: {
                        'Content-Type': undefined,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    
                    //reportStatus = response.data.dashboard.desc.reportStatusList;
                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        };

        factory.createProjectSignoffs = function (requestData) {
            try {

                var uri = formatUrl(addProjectSignOffUrl);
                return $http.post(uri, requestData, {
                    //data: requestData,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        }

        factory.updateProjectSignoffs = function (requestData) {
            try {

                var uri = formatUrl(updateProjectSignOffUrl);
                return $http.put(uri, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {


                    if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        }

        factory.deleteProjectSignoffs = function (requestData) {
            try {
                var uri = formatUrl(deleteProjectSignOffUrl);
                return $http.delete(uri, {
                    data: requestData,
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                }).then(function (response) {
                   if(response)
                return response.data;
                else return null;
                }, function (error) {

                    return error;
                });
            } catch (e) {

            }
        }

        factory.getProjectData = function (projectGuid) {

                var queryParams = {};
                queryParams.projectGuid = projectGuid;

                return APIFactory.get(getProjectInformationUrl, queryParams).then(function (response) {
                    if(response)
                return response;
                else return null;
                }, function (error) {
                    throw error;
                });
            }
            //End Project SignOff

        return factory;
}
]);