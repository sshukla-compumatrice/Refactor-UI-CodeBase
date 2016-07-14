angular.module('FilingCabinet').constant('FilingCabinetAPIUrlCollection', {
    
    //GETAPIMOCK_FOLDER : 'http://private-569d7-edrcorefilemanagementapi.apiary-mock.com/folders/folderguidorid?folders={folderguidsorids}',
    GETAPIJSON_FOLDER : 'app/modules/FilingCabinet/sampleJSON/Folders.js',
    
    GETAPIPOC_FILE : '{fileguid}?limit=10&offset=0',
    
    //GETAPIJSON_FILESBYFOLDER : 'app/modules/FilingCabinet/sampleJSON/Files.js',
    GETAPIPOC_FILESBYFOLDER : '?folder={folderGUID}',
  
    UPLOADAPIPOC_FILE: '{fileguid}?fileRequestJson={fileRequestJson}', 

    DELETEAPI_FILE: ''

});
