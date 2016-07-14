{
	"fields": [
    {
		"fieldName": "loanAmount",
		"fieldType": "Currency",
		"fieldLabel": "Loan Amount"
	},
    {
		"fieldName": "loanType",
		"fieldType": "select",
		"fieldLabel": "Loan Type"
	},
    {
		"fieldName": "location",
		"fieldType": "String",
		"fieldLabel": "Location"
	},
	{
		"fieldName": "PropertyValue",
		"fieldType": "Currency",
		"fieldLabel": "Property Value"
	},
	{
		"fieldName": "latitude",
		"fieldType": "Number",
		"fieldLabel": "Latitude"
	},
	{
		"fieldName": "longitude",
		"fieldType": "Number",
		"fieldLabel": "Longitude"
	},
	{
		"fieldName": "PropertyAddress",
		"fieldType": "String",
		"fieldLabel": "Property Address"
	},
	{
		"fieldName": "LandValue",
		"fieldType": "Number",
		"fieldLabel": "Land Value"
	},
	{
		"fieldName": "FieldName1",
		"fieldType": "Number",
		"fieldLabel": "Field Name1"
	},
	{
		"fieldName": "FieldName2",
		"fieldType": "String",
		"fieldLabel": "Field Name2"
	}],
	"policies": [{
		"versionStatus": "DRAFT",
		"version": 1.2,
		"policyType": "Environmental",
		"matrix": false,
		"actions": ["LoanCheck Plus",
		"Desktop Review",
		"ASTM Transaction Screen",
		"Phase I",
		"Phase II"]
	},
	{
		"policyType": "Appraisal",
		"matrix": true,
		"actions": ["American Commercial Evaluation",
		"Clear Capital Commercial Evaluation",
		"Commercial Appraisal Report",
		"Commercial Appraisal Review",
		"Commercial Evaluation",
		"Residential Appraisal",
		"Residential Appraisal Review",
		"Agricultural land Appraisal",
		"Equipment Appraisal"]
	},
    {
		"versionStatus": "DRAFT",
		"version": 1.2,
		"policyType": "Flood",
		"matrix": false,
		"actions": ["Flood commercial life of loan",
		"Flood residential life of loan"]
	}]
}