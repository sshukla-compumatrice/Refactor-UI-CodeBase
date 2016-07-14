{
    "project": {
        "projectID": 1,
        "name": "sample project - project name",
		"companyID": 1218,
		"finalDueDate": "",
		"draftDueDate": "",
		"outToBid": 0,
		"bidDeadline": "",
		"bidCompanyIDs": [1111,2222],
		"spreadsheet": "base64-encoded string",
		"attachments": [{
		    "filename": "sample-file.pdf",
		    "base64": "base64-encoded string"
		}],
		"client": {
		    "companyName": "GE Capital",
			"contactName": "sample project - client contact name",
			"address": "sample project - client address",
			"city": "sample project - city",
			"state": "sample project - state",
			"zip": "sample project - zip"
		},
		"locations": [{
		    "propertyNumber": "sample project - property number",
		    "name": "sample project - location name",
		    "address1": "sample project - location address1",
		    "address2": "sample project - location address2",
		    "city": "sample project - city",
		    "state": "sample project - state",
		    "zip": "sample project - zip",
		    "propertyType": "sample project - property type",
		    "county": "sample project - county",
		    "latitude": 45.7,
		    "longitude": -72.1,
		    "acreage": "3 Acres",
		    "numBuildings": "Four",
		    "transactionType": "",
		    "reports": [{
		        "templateID": 1,
		        "libraryID": 129,
		        "companyID": 1111,
		        "projectNumber": "sample project - report project number",
		        "poNumber": "sample project - po number",
		        "fee": "sample project - fee"
		    }, {
		        "templateID": 2,
		        "libraryID": 234,
		        "companyID": 2222,
		        "projectNumber": "sample project - report project number 2",
		        "poNumber": "sample project - po number 2",
		        "fee": "sample project - fee 2"
		    }],
		    "siteContact": {
		        "name": "sample project - location site contact",
		        "phone": "",
		        "fax": "",
		        "email": "contact email"
		    }
		}, {
		    "propertyNumber": "XYZ - 1",
		    "name": "XYZ Rnd Facility",
		    "address1": "somewhere in US",
		    "address2": "hidden behind that tree",
		    "city": "Shelton",
		    "state": "Connecticut",
		    "zip": "06484",
		    "propertyType": "Apartment Complex",
		    "county": "Connecticut",
		    "latitude": 12.3,
		    "longitude": -45.6,
		    "acreage": "1 Acres",
		    "numBuildings": "3",
		    "transactionType": "Origination",
		    "reports": [{
		        "templateID": 1,
		        "libraryID": 129,
		        "companyID": 1111,
		        "projectNumber": "sample project - report project number",
		        "poNumber": "sample project - po number",
		        "fee": "sample project - fee"
		    }, {
		        "templateID": 2,
		        "libraryID": 2334,
		        "companyID": 1111,
		        "projectNumber": "sample project - report project number 2",
		        "poNumber": "sample project - po number 2",
		        "fee": "sample project - fee 2"
		    }],
		    "siteContact": {
		        "name": "sample project - location site contact",
		        "phone": "",
		        "fax": "",
		        "email": "contact email"
		    }
		}],
		"accessParties": [{
		    "accessType": "team",
		    "teamID": 101
		},{
		    "accessType": "office",
		    "officeID": 100
		}],
		"notifications": {
		    "sendEmailNotification": 1,
			"emailTo": "",
			"emailCC": "",
			"emailBody": ""
		}
    }
}