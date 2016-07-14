
{
    "style": "worksheet",
    "fields": [
        {
            "fieldName": "Location",
            "fieldType": "String"
        },
        {
            "fieldName": "PropertyValue",
            "fieldType": "Currency"
        },
        {
            "fieldName": "latitude",
            "fieldType": "Number"
        },
        {
            "fieldName": "longitude",
            "fieldType": "Number"
        }
    ],
    "rawMatrix": [
        {
            "policyType": "Environmental",
            "versionStatus": "DRAFT",
            "version": 1.2,
            "actions": [
                "LoanCheck Plus",
                "Desktop Review",
                "ASTM Transaction Screen",
                "Phase I",
                "Phase II"
            ],
            "fieldOrder": [
                "PropertyAddress",
                "LandValue",
                "FieldName1",
                "FieldName2"
            ],
            "rows": [
				{
                    "columns": [
                        {
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
                            "upperBound":"",
                            "lowerBound":"",
							"ruleType": "Range"
                        },
                        {
                            "fieldName": "FieldName2",
                            "ruleValue": "",
                            "ruleType": "Value"
                        },
                        {
                            "decisions": [
                                "LoanCheck Plus",
                                "Desktop Review"
                            ]
                        }
                    ]
                },
                {
                    "columns": [                        
                        {
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
                            "upperBound":"",
                            "lowerBound":"",
							"ruleType": "Range"
                        },
                        {
                            "fieldName": "PropertyAddress",
                            "ruleValue": "1 Test Street",
                            "ruleType": "Value"
                        },
                        {
                            "decisions": [
                                "ASTM Transaction Screen"
                            ]
                        }
                        
                    ]
                },
                {
                    "columns": [
                        {
                            "fieldName": "PropertyAddress",
                            "ruleValue": "3 Test Street",
                            "ruleType": "Value"
                        },
                        {
                            "fieldName": "LandValue",
                            "upperBound": "$100,000",
                            "lowerBound": "$150,000",
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
                            "decisions": [
                                "Loan CheckPlus II"
                            ]
                        }
                    ]
                },
                {
                    "columns": [
                        
                        {
                            "fieldName": "LandValue",
                            "upperBound": "$100,000",
                            "lowerBound": "$150,000",
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
                            "decisions": [
                                "Loan CheckPlus II"
                            ]
                        }
                    ]
                }
			]
        }
    ]
}