angular.module('PortfolioCreation').service('PortfolioCreationAPI', ['APIFactory', 'PortfolioCreationUrlColl', function(APIFactory, PortfolioCreationUrlColl) {

    var self = this;
    self.apiType = {
        type: 'real', //'mock',
        get: {
            mock: PortfolioCreationUrlColl.MockGETAPI,
            real: PortfolioCreationUrlColl.GETAPI
        },
        post: {
            mock: PortfolioCreationUrlColl.POSTAPI,
            real: PortfolioCreationUrlColl.POSTAPI
        },
        put: {
            mock: PortfolioCreationUrlColl.PUTAPI,
            real: PortfolioCreationUrlColl.PUTAPI
        }
    };

    self.samplePOSTResponse = null;
    var loadSamplePOST = function() {
        var url = PortfolioCreationUrlColl.MockPOSTAPI;
        APIFactory.get(url).then(function(results) {
            self.samplePOSTResponse = results.project;
        })
    }
    if (self.apiType.type == 'mock') {
        loadSamplePOST();
    }

    var parseResponse = function(result) {
        if (self.apiType.type == 'mock') {
            return self.samplePOSTResponse;
        } else {
            return result.project;
        }
    }

    var parseError = function(error) {
        if (self.apiType.type == 'mock') {
            return self.samplePOSTResponse;
        } else {
            throw error;
        }
    }




    this.get = function(companyId) {
        var url = this.apiType.get[this.apiType.type];
        var queryParams = {
            companyID: companyId
        }
        return APIFactory.get(url, queryParams);
    };

    // POST data to create Project
    // response should return Id    
    this.post = function(companyId, project) {
        var url = this.apiType.post[this.apiType.type];
        var queryParams = {
            companyID: companyId
        }

        var postData = {
            project: project
        };

        return APIFactory.post(url, postData, queryParams).then(function(result) {
            return parseResponse(result);
        }, function(error) {
            return parseError(error);
        });
    }

    // incremental PUT to update Project (identified via ProjectId)
    // response should contain Project data to display, if required on view
    this.put = function(projectId, projectData) {
        var url = this.apiType.put[this.apiType.type];
        var queryParams = {
            projectID: projectId
        }

        var putData = {
            project: projectData
        };

        return APIFactory.put(url, putData, queryParams).then(function(result) {
            return parseResponse(result);
        }, function(error) {
            return parseError(error);
        });
    }
}]);