angular.module('logEnhancingModule', []).provider('logEnhancer', function () {





    this.$get = function () {
        return this;
    };

    this.$get = function () {
        var loggingPattern = this.loggingPattern;
        return {
            enhanceAngularLog: function (applicationInfoObject, environmentInfoObject, SRFUrls, loggingSessionGUID, $log, $http) {

                $log.enabledContexts = [];

                $log.getInstance = function (context) {
                    return {
                        log: enhanceLogging($log.log, context, loggingPattern, "log"),
                        info: enhanceLogging($log.info, context, loggingPattern, "info"),
                        warn: enhanceLogging($log.warn, context, loggingPattern, "warn"),
                        debug: enhanceLogging($log.debug, context, loggingPattern, "debug"),
                        error: enhanceLogging($log.error, context, loggingPattern, "error"),

                        enableLogging: function (enable) {
                            $log.enabledContexts[context] = enable;
                        }
                    };
                };

                function enhanceLogging(loggingFunc, context, loggingPattern, type) {
                    return function () {
                        var errorObj;
                        var contextEnabled = $log.enabledContexts[context];

                        if (contextEnabled === undefined || contextEnabled) {
                            var modifiedArguments = [].slice.call(arguments);

                            if (modifiedArguments != undefined && modifiedArguments != null &&
                                modifiedArguments instanceof Object) {
                                errorObj = {
                                    "stack": type === "error" || type === "warn" ?
                                    modifiedArguments[0].data : "",
                                    "message": type === "error" || type === "warn" ?
                                        modifiedArguments[0].statusText : modifiedArguments[0],
                                    "data" : type === "error" || type === "warn" ?
                                          modifiedArguments[0].config : "",


                                }
                            } else {
                                errorObj = {
                                    "stack": type === "error" || type === "warn" ?
                                    modifiedArguments[0].stack : "",
                                    "message": type === "error" || type === "warn" ?
                                        modifiedArguments[0].message : modifiedArguments[0],
                                    "data" : ""

                                }
                            }



                            modifiedArguments[0] = [sprintf(loggingPattern, moment().format("dddd h:mm:ss  a"), context)] + modifiedArguments[0];


                            var timestamp = sprintf(loggingPattern, moment().format("dddd h:mm:ss a"));



                            loginServer(timestamp.split('::[')[0], type, context, errorObj, "", "");

                            loggingFunc.apply(null, modifiedArguments);
                        }
                    };
                }

                function loginServer(timestamp, level, controller, modifiedArguments, uriparams, requestid) {


                    var obj = new Object();
                    obj.logItem = {};
                    obj.logItem.logModuleUsed = controller;
                    obj.logItem.authenticatedEntity = '';
                    obj.logItem.authenticatedType = '';
                    obj.logItem.applicationInfo = applicationInfoObject;
                    obj.logItem.environmentInfo = environmentInfoObject;
                    obj.logItem.events = [];

                    var logEvents = {};
                    logEvents.eventType = level;
                    logEvents.startTS = timestamp;
                    logEvents.elapsedInMS = '',
                    logEvents.eventDetail = {};
                    logEvents.eventDetail.severityLevel = '';
                    logEvents.eventDetail.edrExceptionID = '';
                    logEvents.eventDetail.assertionFailure = '';
                    logEvents.eventDetail.message = modifiedArguments.message;
                    logEvents.eventDetail.stackTrace = modifiedArguments.stack;
                    logEvents.eventDetail.nativeExceptionType = '';
                    logEvents.eventDetail.exceptionData = modifiedArguments.data;
                    logEvents.eventDetail.additionalInfo = [{
                        "key": "",
                        "value": ""
                }];

                    obj.logItem.events.push(logEvents);

                    if (level != "debug") {
                        var staticPath = SRFUrls.postLogJSON;

                        $http({
                                method: 'POST',
                                url: staticPath,
                                data: obj,
                                headers: {
                                    'id': loggingSessionGUID == undefined ? '' : loggingSessionGUID
                                }
                            })
                            .success(function (data) {

                            })
                            .error(function (data) {

                            });


                    }


                }
            }


        }



    };
});

angular.module('logEnhancingModule').config(['logEnhancerProvider', function (logEnhancerProvider) {

    logEnhancerProvider.loggingPattern = '%s::[%s]> ';
}]);

