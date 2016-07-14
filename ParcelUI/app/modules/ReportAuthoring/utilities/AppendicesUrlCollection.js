angular.module('ReportAuthoring').constant('AppendicesUrlCollection', {
    //GETAPI_ALLAPPENDICES: '{reportID}',
	GETAPI_ALLAPPENDICES: 'tableofcontents?reportGUID={reportID}&depth=SHALLOW',	
	
	GETAPI_APPENDIXFILES: 'appendices/{reportID}/{sectionGUID}/files',    
	
	//PUTAPI_APPENDIXFILES: 'appendices/{reportID}/{sectionGuid}/files',    
	
	PUTAPI_APPENDIXFILES: 'appendices/{reportID}/files',    
	
	PUTAPI_APPENDIXFILE: 'appendices/{reportGuid}/{sectionGUID}/files/{fileGuid}',   
	
	//DELETEAPI_APPENDIXFILE: 'appendices/{reportGuid}/{sectionGuid}/files/{fileGuid}',							
	DELETEAPI_APPENDIXFILE: 'appendices/{reportGuid}/{sectionGuid}/files/{fileGuid}',							
	
	GETAPI_APPENDIXPHOTOS: 'photos/{reportID}/{sectionGUID}',
    
	PUTAPI_APPENDIXPHOTOS: 'photos/{reportID}/{sectionGuid}',
	
	PUTAPI_APPENDIXPHOTO: 'photos/{reportID}/{sectionGuid}/photo/{fileGuid}',	
	
    POSTAPI_APPENDIXFILE: 'appendices/{reportID}/{sectionGuid}/upload?fileName={filename}&orderIndex=1',
	 //POSTAPI_APPENDIXFILE: 'appendices/{reportID}/{sectionGuid}/upload',
	
	POSTAPI_APPENDIXPHOTO: 'photos/{reportID}/{sectionGuid}/upload?fileName={filename}&orderIndex=1&caption={caption}',
	
	DELETEAPI_APPENDIXPHOTO: 'photo/{reportGuid}/{fileGuid}',	
	
	GETAPI_APPENDIXDRAWINGTOOLORDERS: 'drawingtools/{reportGuid}',
	
	GETAPI_APPENDIXDRAWINGTOOLURL: 'drawingtools/{reportGuid}/{edrPropertyGuid}',
	
	DELETEAPI_APPENDIXPHOTOS: 'photos/{reportID}/{sectionGuid}'
	
});