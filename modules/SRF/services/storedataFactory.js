angular.module('SRFModule').factory('shareDataService',[function(){

    var sharedData = {};

    var objSelectServices = {};


    var objPropInterest = [];
    var objValuationPremise = [];
    var collateralObj = [];
    var subTypeObj = [];

    var cabinets = [];

    var emails = [];

    var cabinetObj;

    var propertyTypes = [];

    var mapObject ;
    
    var editMode = false;

    sharedData.createSeperateJsonforReports = function(reportKeys){

        for(var i = 0 ; i < reportKeys.length ; i ++){


            objSelectServices[reportKeys[i]] = [];

        }

    }

    sharedData.storeSharedData = function(data){


           for(var key in objSelectServices){
               if (key == data.featureName){
                   if(data.value){
                   objSelectServices[key].push(data);
                   }
                   else{
                       for(var i = 0 ; i < objSelectServices[key].length ; i ++){
                        if(objSelectServices[key][i].displayName == data.displayName){

                            objSelectServices[key].splice(i,1);
                        }

                    }
                   }

               }
           }







    };

    sharedData.getStoredData = function(){

        return objSelectServices;
    };



    sharedData.storePropInterest = function(data){
        if(data.value == 1){
            objPropInterest.push(data);
        }
        else{
            for(var i = 0 ; i < objPropInterest.length ; i ++){
                if(objPropInterest[i].name == data.name){

                    objPropInterest.splice(i,1);
                }

            }
        }
    }

    sharedData.getPropInterest = function (){
        return objPropInterest;
    }


    sharedData.storeValuationPremise = function(data){
        if(data.value == 1){
            objValuationPremise.push(data);
        }
        else{
            for(var i = 0 ; i < objValuationPremise.length ; i ++){
                if(objValuationPremise[i].name == data.name){

                    objValuationPremise.splice(i,1);
                }

            }
        }
    }

    sharedData.getValuationPremise = function (){
        return objValuationPremise;
    }

    sharedData.storeCollateralData = function(collateralsections,formCollateral){

        for(var i = 1 ; i <= collateralsections ; i ++  ){
            collateralObj[i] = [];
            collateralObj[i].arr = [];
            for (var j = 0; j < formCollateral.length; j++) {

                if (formCollateral[j].orderIndex.startsWith("2." + i)) {
                    collateralObj[i].arr.push(formCollateral[j]);
                }
            }

    }




    }

    sharedData.getCollateralData = function (){
        return collateralObj;
    }

    sharedData.storeSubTypesData = function(data){
        subTypeObj = data;
    }

    sharedData.getSubTypesData = function(){
        return subTypeObj;
    }

    sharedData.storeCabinets = function(data){


        cabinets = data;


    }

    sharedData.getCabinets = function(){

        return cabinets;
    }

    sharedData.setCabinet = function(data){

        cabinetObj = data;

    }

    sharedData.getCabinet = function(){

        return cabinetObj;

    }

    sharedData.setEmails = function(data){
       emails =  data;
    }

    sharedData.getEmails = function(){
        return emails;
    }

    sharedData.setPropertyType = function(data){
        propertyTypes = data;
    }

    sharedData.getPropertyType = function(){
       return propertyTypes;
    }

    sharedData.setMapObject = function(map){
        mapObject = map;
    }

    sharedData.getMapObject = function(){
        return mapObject;
    }
    
    sharedData.setEditMode = function(bool){
        editMode = bool;
    }
    sharedData.getEditMode = function(){
        return editMode;
    }


    return sharedData;

}]);
