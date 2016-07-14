'use strict';

angular.module('SRFModule').directive('sectionalfieldDirective', ['$http', '$compile', 'shareDataService', 'SetMarker', '$parse', function ($http, $compile, shareDataService, SetMarker, $parse) {

    var getTemplateUrl = function (field) {

        var type = field.fieldType;
        var templateUrl = '';

        switch (type) {
            case 'text':
                templateUrl = 'modules/SRF/views/directive-templates/field/textfield.html';
                break;
            case 'email':
                templateUrl = 'modules/SRF/views/directive-templates/field/email.html';
                break;
            case 'textarea':
                templateUrl = 'modules/SRF/views/directive-templates/field/textarea.html';
                break;
            case 'checkbox':
                templateUrl = 'modules/SRF/views/directive-templates/field/checkbox.html';
                break;
            case 'date':
                templateUrl = 'modules/SRF/views/directive-templates/field/date.html';
                break;
            case 'dropDown':
                templateUrl = 'modules/SRF/views/directive-templates/field/dropdown.html';
                break;
            case 'hidden':
                templateUrl = 'modules/SRF/views/directive-templates/field/hidden.html';
                break;
            case 'password':
                templateUrl = 'modules/SRF/views/directive-templates/field/password.html';
                break;
            case 'radioButton':
                templateUrl = 'modules/SRF/views/directive-templates/field/radio.html';
                break;
            case 'modifiedbuildingfield':
                templateUrl = 'modules/SRF/views/directive-templates/field/custombuildingfield.html';
                break;
            case 'modifiedlandfield':
                templateUrl = 'modules/SRF/views/directive-templates/field/customlandfield.html';
                break;
        }
        return templateUrl;

    }

    var linker = function (scope, element, attr, controllers) {

        // GET template content from path
        scope.attr = attr;
        scope.element = element;
       
        
        


        var templateUrl = getTemplateUrl(scope.field);
        if (templateUrl != undefined) {
            $http.get(templateUrl).success(function (data) {
                //console.log("fieldName" + scope.field.fieldName);
                element.html(data);
                scope.element = element.contents();
                $compile(element.contents())(scope);

            });

        
        }







    }

    return {

        restrict: 'A',
        require: '?^form',


        scope: {
            field: '=',
            parenttabindex: '=',
            parentrowindex: '=',
            parentcolumnindex: '=',
            parentsectionindex: '='


        },
        controller: function ($scope, $element, $http) {
            $scope.selectedOption = "";
            $scope.subPropertyTypeVisible = false;

            
            

            

            //This event gets fired when user selects any option from the dropdown
            $scope.showHideOptions = function (fieldID,option) {
                
                console.log("hghgh " + option);
                //As fieldID is the only identifier of the field
                //It gives hint as to which dropdown was interacted upon by user. 
                           
                switch (fieldID) {
                    case 34422:
                        //This case is for 'Purpose of request'
                        //As for fieldValue goes. It was not provided in JSON so 
                        //had put it dynamically into every field object through code.
                        
                        
                        if ($scope.field.fieldValue != null) {
                           //Get the field option object which has been selected
                           //Extract rules array of it
                           var rulesArray = $scope.field.fieldValue.rules;
                           //As there can be more than one rule
                            angular.forEach(rulesArray,function(rule){
                                if(rule.ruleType == "show"){
                                    // A single rule to "show" can have more than one element to show
                                    angular.forEach(rule.fields,function(field){
                                        angular.element('#' + field.fieldName).removeClass('ng-hide');
                                    })
                                    
                                    
                                }
                                else if(rule.ruleType == "hide"){
                                    // A single rule to "hide" can have more than one element to show
                                    angular.forEach(rule.fields,function(field){
                                        angular.element('#' + field.fieldName).addClass('ng-hide');
                                    })
                                }
                            })
                            
                        } else {
                            $scope.selectedOption = "";
                        }
                        
                        

                        break;
                    case 34424:

                        $scope.selectedOption = $scope.field.fieldValue.option_name;
                        var onChangeFunction = JSON.parse($scope.field.uiOptions).onchange;

                        var x2 = eval(onChangeFunction);
                        break;

                    case 34447:
                        if (!$scope.drpDwnVisible) {
                            $http.get('views/directive-templates/field/customdropdown.html').
                            success(function (data) {


                                a_input = angular.element($compile(data)($scope));

                                $($element[0]).after(a_input);
                                $scope.drpDwnVisible = true;



                            });
                        }
                    default:
                        console.log("dsugvsdgcfdgsh");
                }




            }



        },
        link: linker
    };
}]);