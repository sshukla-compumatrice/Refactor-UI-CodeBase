angular.module("ReportAuthoring").constant("AppendixTools", {
    'appendixtools/questionnaire': {
        templateUrl: "app/modules/ReportAuthoring/views/llpQuestionnaire.html",
        controller: "llpQuestionnaireController as appendixTool",
        openAsPage: true
    },
    'appendixtools/addADAChecklist': {
        templateUrl: "app/modules/ReportAuthoring/views/AddADAChecklist.html",
        controller: "addADAChecklistController as appendixTool",
        openAsPage: true
    },
    'appendixtools/addCommunicationRecord': {
        templateUrl: "app/modules/ReportAuthoring/views/AddCommunicationRecord.html",
        controller: "addCommunicationRecordController as appendixTool",
        openAsPage: false
    }
});




