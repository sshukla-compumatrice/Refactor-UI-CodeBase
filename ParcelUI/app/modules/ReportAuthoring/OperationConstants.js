angular.module('ReportAuthoring').constant('PerformedOperation', {
    ADD: 'ADD',
    EDIT: 'EDIT',
    REORDER: 'REORDER',
    DEFAULTINSERT: 'DEFAULT INSERT',
    DELETE: 'DELETE',
    DELETETABLE:'DELETE TABLE',
    APPENDTABLE: 'APPEND',
    OVERWRITETABLE: 'OVERWRITE'
});

angular.module('ReportAuthoring').constant('ImportEDRDataTypes', {	 
	DBREVIEW:'dbreview',
	ENVORPHANS:'envorphans',
	ENVDBDETAILS:'envdbdetails',
	STATEENVDBDETAILS:'stateenvdbdetails',
	HISTORICALAERIALS:'historicalaerials',
	HISTORICALTOPOS:'historicaltopos',
	CITYDIRECTORY:'citydirectory',
	SANBORNS:'sanborns',
    HISTORICALSUMMARY:'historicalsummary'
});