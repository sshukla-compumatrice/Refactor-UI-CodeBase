angular.module('ParcelUI').constant('ParcelUI.Resources', {
    validationExpression: {
        email: /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/
    },
    messagesResources: {       
        saved_Success: "Record has been saved successfully.",
               deleted_Success: "Record has been deleted successfully.",
               updated_Success: "Record has been updated successfully."   
    },
    waitingProcessResources: {
        promise: null,
        templateUrl: '',
        message: 'Please Wait...',
        backdrop: true,
        delay: 0,
        minDuration: 0,
        wrapperClass: 'loadercenter'
    },
    waitingHistoryResources: {
        promise: null,
        templateUrl: '',
        message: 'Please Wait While History Is Loading...',
        backdrop: true,
        delay: 0,
        minDuration: 0
    },
    waitingLibraryResources: {
        promise: null,
        templateUrl: '',
        message: 'Please Wait While Languages are Loading...',
        backdrop: true,
        delay: 0,
        minDuration: 0
    },
    waitingCommentsResources: {
        promise: null,
        templateUrl: '',
        message: 'Please Wait While Comments are Loading...',
        backdrop: true,
        delay: 0,
        minDuration: 0
    },
     waitingPDFResources: {
        promise: null,
        templateUrl: '',
        message: 'Please Wait...',
        backdrop: true,
        delay: 0,
        minDuration: 0
    },
    activityServiceLoader: {
        promise: null,
        templateUrl: '',
        message: 'Please Wait...',
        backdrop: true,
        delay: 0,
        minDuration: 0
    },
    reportPhasesResources: [{
        key: 'WO',
        value: 'The work order has been created.'
    }, {
        key: 'DE',
        value: 'The report is currently undergoing data entry.'
    }, {
        key: 'SR',
        value: 'The report is currently in senior review.'
    }, {
        key: 'DR',
        value: 'The report is draft.'
    }, {
        key: 'EAI',
        value: 'The environmental analysis is incomplete.'
    }, {
        key: 'FIN',
        value: 'This report is final.'
    }],

    reportPhases: [{
        key: 'WO',
        value: 'Work Order Created'
    }, {
        key: 'DE',
        value: 'Data Entry'
    }, {
        key: 'SR',
        value: 'Senior Review'
    }, {
        key: 'DR',
        value: 'Draft Report'
    }, {
        key: 'EAI',
        value: 'Env. Analysis Incomplete'
    }],
    formInvalidMessage:"There is a problem with one or more of the form inputs below. Please scroll down and look for specific messages, make any necessary changes and re-submit the form."


});
