{
	"fields": [    
    {
		"fieldName": "loanType",
		"fieldType": "select",
		"fieldLabel": "Loan Type",
        "fieldOptions": ["Purchase", "Renewal with new money", "Renewal with no new money", "Construction Loan", "Line of Credit", "Foreclosure", "SBA", "Government Lending", "VA Lending"]
	},
    {
		"fieldName": "loanAmount",
		"fieldType": "Currency",
		"fieldLabel": "Loan Amount"
	},
    {
		"fieldName": "propertyType",
		"fieldType": "select",
		"fieldLabel": "Property Type",
        "fieldOptions": ["Agricultural", "Health Care", "Industrial", "Land", "Lodging/Hospitality", "Multi-family", "Office", "Residential", "Retail", "Senior Housing", "Special Purpose", "Sport/Entertainment"]
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
		"policyName": "Environmental Policy",
		"actions": ["LoanCheck Plus",
		"Desktop Review",
		"ASTM Transaction Screen",
		"Phase I",
		"Phase II"],
		"rawMatrix": [{
			"fieldOrder": ["PropertyAddress",
			"LandValue",
			"FieldName1",
			"FieldName2"],
			"rows": [{
				"columns": [{
					"fieldName": "LandValue",
					"upperBound": "$100,000",
					"lowerBound": "$150,000",
					"ruleType": "Range"
				},
				{
					"fieldName": "PropertyAddress",
					"ruleValue": "2 Test Street",
					"ruleType": "Value"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": "",
					"lowerBound": "",
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "",
					"ruleType": "Value"
				},
				{
					"decisions": ["LoanCheck Plus",
					"Desktop Review"]
				}]
			},
			{
				"columns": [{
					"fieldName": "LandValue",
					"upperBound": "infinity",
					"lowerBound": "$150,001",
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "Test Value1",
					"ruleType": "Value"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": "",
					"lowerBound": "",
					"ruleType": "Range"
				},
				{
					"fieldName": "PropertyAddress",
					"ruleValue": "1 Test Street",
					"ruleType": "Value"
				},
				{
					"decisions": ["ASTM Transaction Screen"]
				}]
			},
			{
				"columns": [{
					"fieldName": "PropertyAddress",
					"ruleValue": "3 Test Street",
					"ruleType": "Value"
				},
				{
					"fieldName": "LandValue",
					"upperBound": "$100,000",
					"lowerBound": "$160,000",
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": 31,
					"lowerBound": 35,
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "Test Value1",
					"ruleType": "Value"
				},
				{
					"decisions": ["Loan CheckPlus II"]
				}]
			},
			{
				"columns": [{
					"fieldName": "LandValue",
					"upperBound": "$100,000",
					"lowerBound": "$170,000",
					"ruleType": "Range"
				},
				{
					"fieldName": "PropertyAddress",
					"ruleValue": "4 Test Street",
					"ruleType": "Value"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": 31,
					"lowerBound": 35,
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "Test Value2",
					"ruleType": "Value"
				},
				{
					"decisions": ["Loan CheckPlus II"]
				}]
			}]
		}]
	},
	{
		"policyType": "flood",
		"policyName": "",
		"actions": ["Flood Residential Life of Loan",
		"Flood Commercial Life of Loan"]
	},
	{
		"policyType": "Appraisal",
		"policyName": "My Appraisal Policy",
		"actions": ["American Commercial Evaluation",
		"Clear Capital Commercial Evaluation",
		"Commercial Appraisal Report",
		"Commercial Appraisal Review",
		"Commercial Evaluation",
		"Residential Appraisal",
		"Residential Appraisal Review",
		"Agricultural land Appraisal",
		"Equipment Appraisal"],
		"rawMatrix": [{
			"fieldOrder": ["PropertyAddress",
			"LandValue",
			"FieldName1",
			"FieldName2"],
			"rows": [{
				"columns": [{
					"fieldName": "LandValue",
					"upperBound": "$100,000",
					"lowerBound": "$150,000",
					"ruleType": "Range"
				},
				{
					"fieldName": "PropertyAddress",
					"ruleValue": "2 Test Street",
					"ruleType": "Value"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": "",
					"lowerBound": "",
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "",
					"ruleType": "Value"
				},
				{
					"decisions": ["Commercial Appraisal Report",
					"Residential Appraisal Review"]
				}]
			},
			{
				"columns": [{
					"fieldName": "LandValue",
					"upperBound": "infinity",
					"lowerBound": "$150,001",
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "Test Value1",
					"ruleType": "Value"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": "",
					"lowerBound": "",
					"ruleType": "Range"
				},
				{
					"fieldName": "PropertyAddress",
					"ruleValue": "1 Test Street",
					"ruleType": "Value"
				},
				{
					"decisions": ["Clear Capital Commercial Evaluation"]
				}]
			},
			{
				"columns": [{
					"fieldName": "PropertyAddress",
					"ruleValue": "3 Test Street",
					"ruleType": "Value"
				},
				{
					"fieldName": "LandValue",
					"upperBound": "$100,000",
					"lowerBound": "$160,000",
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": 31,
					"lowerBound": 35,
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "Test Value1",
					"ruleType": "Value"
				},
				{
					"decisions": ["Equipment Appraisal"]
				}]
			},
			{
				"columns": [{
					"fieldName": "LandValue",
					"upperBound": "$100,000",
					"lowerBound": "$170,000",
					"ruleType": "Range"
				},
				{
					"fieldName": "PropertyAddress",
					"ruleValue": "4 Test Street",
					"ruleType": "Value"
				},
				{
					"fieldName": "FieldName1",
					"upperBound": 31,
					"lowerBound": 35,
					"ruleType": "Range"
				},
				{
					"fieldName": "FieldName2",
					"ruleValue": "Test Value2",
					"ruleType": "Value"
				},
				{
					"decisions": ["Residential Appraisal"]
				}]
			}]
		}]
	}]
}