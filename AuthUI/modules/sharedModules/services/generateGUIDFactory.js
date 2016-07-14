AccessManagement.factory('GUID',[function(){

    var guid = {};

    var guidStorageVar;

    guid.create = function(){
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
             return v.toString(16);
        });
        guidStorageVar = guid;

        return guid;
    }

    guid.get = function(){

        return guidStorageVar;
    }

    return guid;

}]);
