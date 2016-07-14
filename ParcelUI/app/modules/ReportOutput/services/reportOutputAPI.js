var reportOutputModule = angular.module('ReportOutput');
reportOutputModule.service('ReportOutputAPI', ['APIFactory', '$q', 'ReportOutputUrl', function(APIFactory, $q, ReportOutputUrl) {
    this.get = function() {
        var url = "app/modules/ReportOutput/sampleJson/sample.json";
        return APIFactory.get(url).then(function(result) {
            return result.data;
        }, function(error) {

        });
    }

    this.html = "";
    this.saveReportSetup = function(html) { 
        this.html = html;
        var defer = $q.defer();
        defer.resolve(true);        
        return defer.promise;
    }

    this.getReportSetup = function() {
        var defer = $q.defer();
        defer.resolve(this.html);
        return defer.promise;
    }
    
    this.getSection = function(reportId, sectionId) {
        var url = ReportOutputUrl.GETAPI_SECTION;
        var params = {
            reportID: reportId,
            sectionID: sectionId
        };
        return APIFactory.get(url, params).then(function(response) {
            return response.Section;
        });
    }
}]);