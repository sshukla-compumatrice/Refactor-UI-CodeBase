[{
    "form_id": "1",
    "form_name": "Lender Portal SRF Form",
    "form_fields": [{
            "fieldName": "ProjectName",
            "fieldLabel": "Project Name",
            "orderIndex": "1.1.1",
            "required": 0,
            "viewStatus": 1,
            "options": null,
            "tooltip": null,
            "fieldType": "textfield",
            "fieldValue": ""


	},
        {
            "fieldName": "ApplicationNumber",
            "fieldLabel": "Application #",
            "orderIndex": "1.1.2",
            "required": 0,
            "viewStatus": 1,
            "options": null,
            "tooltip": null,
            "fieldType": "textfield",
            "fieldValue": ""

	},
        {
            "fieldName": "LoanNumber",
            "fieldLabel": "Loan Number",
            "orderIndex": "1.1.3",
            "required": 1,
            "viewStatus": 1,
            "options": null,
            "tooltip": null,
            "fieldType": "textfield",
            "fieldValue": ""

	},
        {
            "fieldName": "Collateral Type",
            "fieldLabel": "Collateral Type",
            "orderIndex": "1.1.4",
            "required": 0,
            "viewStatus": 1,
            "fieldValue": "",
            "options": [{
                    "name": "Collateral Type1",
                    "value": "Collateral Type1",
                    "orderIndex": 1,
                    "parent": ""
		},
                {
                    "name": "Collateral Type2",
                    "value": "Collateral Type2",
                    "orderIndex": 2,
                    "parent": ""
		},
                {
                    "name": "Collateral Type3",
                    "value": "Collateral Type3",
                    "orderIndex": 3,
                    "parent": ""
		}],
            "tooltip": null,
            "fieldType": "dropdown" 
	},
        {
            "fieldName": "LoanAmount",
            "fieldLabel": "Loan Amount",
            "orderIndex": "1.1.5",
            "required": 1,
            "viewStatus": 1,
            "options": null,
            "tooltip": null,
            "fieldType": "textfield",
            "validation": "Number",
            "fieldValue": ""

	},
        {
            "fieldName": "BorrowerName",
            "fieldLabel": "Borrower Name",
            "orderIndex": "1.1.6",
            "required": 0,
            "viewStatus": 1,
            "options": null,
            "tooltip": null,
            "fieldType": "textfield",
            "fieldValue": ""



	},
        {
            "fieldName": "Co-Borrowers Name",
            "fieldLabel": "Co-Borrowers Name",
            "orderIndex": "1.1.7",
            "required": 0,
            "viewStatus": 1,
            "options": null,
            "tooltip": null,
            "fieldType": "textfield",
            "fieldValue": ""

	},
        {
            "fieldName": "Property Name",
            "fieldLabel": "Choose the property to manage",
            "orderIndex": "1.4.1",
            "required": 0,
            "viewStatus": 1,
            "options": null,
            "tooltip": null,
            "fieldType": "dropdown",
            "fieldValue": "",
            "options": [{
                    "name": "Property Type1",
                    "value": "Property Type1",
                    "orderIndex": 1,
                    "parent": ""
		},
                {
                    "name": "Property Type2",
                    "value": "Property Type2",
                    "orderIndex": 2,
                    "parent": ""
		},
                {
                    "name": "Property Type3",
                    "value": "Property Type3",
                    "orderIndex": 3,
                    "parent": ""
		}]

	},
                    {
	"fieldName": "CommercialResidential",
	"fieldLabel": "What type of loan is this?",
	"orderIndex": "2.1.1",
	"required": 0,
	"viewStatus": "1",
    "required": 0,
    "fieldType": "dropdown",                   
	"options": [{
		"name": "Residential",
		"value": "Residential",
		"orderIndex": 1,
		"parent": ""
	},
	{
		"name": "Commercial",
		"value": "Commercial",
		"orderIndex": 2,
		"parent": ""
	}],
	"tooltip": null,
   "fieldValue": ""
},
                    {
	"fieldName": "riskLevel",
	"fieldLabel": "Risk Level",
	"orderIndex": "2.1.2",
	"required": 1,
	"viewStatus": "1",
    "fieldType": "dropdown",                   
	"options": [{
		"name": "Low Risk",
		"value": "Low Risk",
		"orderIndex": 1,
		"parent": ""
	},
	{
		"name": "Elevated Risk",
		"value": "Elevated Risk",
		"orderIndex": 2,
		"parent": ""
	}],
	"tooltip": null,
    "fieldValue": ""
},
                    {
	"fieldName": "LocationName",
	"fieldLabel": "Location Name",
	"orderIndex": "2.1.3",
	"required": 0,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldValue": "",
    "fieldType": "textfield"
},
                    {
	"fieldName": "PropAddress",
	"fieldLabel": "Address",
	"orderIndex": "2.1.4",
	"required": 1,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldValue": "",                   
    "fieldType": "textfield"
},
                    {
	"fieldName": "PropCity",
	"fieldLabel": "City",
	"orderIndex": "2.1.5",
	"required": 1,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldValue": "",                   
    "fieldType": "textfield"                    
},
{
	"fieldName": "PropState",
	"fieldLabel": "State",
	"orderIndex": "2.1.6",
	"required": 1,
	"viewStatus": "1",
     "fieldValue": "",
    "fieldType": "dropdown",      
	"options": [{
		"name": "Alabama",
		"value": "AL",
		"orderIndex": 1,
		"parent": ""
	},
	{
		"name": "Alaska",
		"value": "AK",
		"orderIndex": 2,
		"parent": ""
	},
	{
		"name": "Arizona",
		"value": "AZ",
		"orderIndex": 3,
		"parent": ""
	},
	{
		"name": "Arkansas",
		"value": "AR",
		"orderIndex": 4,
		"parent": ""
	},
	{
		"name": "California",
		"value": "CA",
		"orderIndex": 5,
		"parent": ""
	},
	{
		"name": "Colorado",
		"value": "CO",
		"orderIndex": 6,
		"parent": ""
	},
	{
		"name": "Connecticut",
		"value": "CT",
		"orderIndex": 7,
		"parent": ""
	},
	{
		"name": "Delaware",
		"value": "DE",
		"orderIndex": 8,
		"parent": ""
	},
	{
		"name": "District of Columbia",
		"value": "DC",
		"orderIndex": 9,
		"parent": ""
	},
	{
		"name": "Florida",
		"value": "FL",
		"orderIndex": 10,
		"parent": ""
	},
	{
		"name": "Georgia",
		"value": "GA",
		"orderIndex": 11,
		"parent": ""
	},
	{
		"name": "Hawaii",
		"value": "HI",
		"orderIndex": 12,
		"parent": ""
	},
	{
		"name": "Idaho",
		"value": "ID",
		"orderIndex": 13,
		"parent": ""
	},
	{
		"name": "Illinois",
		"value": "IL",
		"orderIndex": 14,
		"parent": ""
	},
	{
		"name": "Indiana",
		"value": "IN",
		"orderIndex": 15,
		"parent": ""
	},
	{
		"name": "Iowa",
		"value": "IA",
		"orderIndex": 16,
		"parent": ""
	},
	{
		"name": "Kansas",
		"value": "KS",
		"orderIndex": 17,
		"parent": ""
	},
	{
		"name": "Kentucky",
		"value": "KY",
		"orderIndex": 18,
		"parent": ""
	},
	{
		"name": "Louisiana",
		"value": "LA",
		"orderIndex": 19,
		"parent": ""
	},
	{
		"name": "Maine",
		"value": "ME",
		"orderIndex": 20,
		"parent": ""
	},
	{
		"name": "Maryland",
		"value": "MD",
		"orderIndex": 21,
		"parent": ""
	},
	{
		"name": "Massachusetts",
		"value": "MA",
		"orderIndex": 22,
		"parent": ""
	},
	{
		"name": "Michigan",
		"value": "MI",
		"orderIndex": 23,
		"parent": ""
	},
	{
		"name": "Minnesota",
		"value": "MN",
		"orderIndex": 24,
		"parent": ""
	},
	{
		"name": "Mississippi",
		"value": "MS",
		"orderIndex": 25,
		"parent": ""
	},
	{
		"name": "Missouri",
		"value": "MO",
		"orderIndex": 26,
		"parent": ""
	},
	{
		"name": "Montana",
		"value": "MT",
		"orderIndex": 27,
		"parent": ""
	},
	{
		"name": "Nebraska",
		"value": "NE",
		"orderIndex": 28,
		"parent": ""
	},
	{
		"name": "Nevada",
		"value": "NV",
		"orderIndex": 29,
		"parent": ""
	},
	{
		"name": "New Hampshire",
		"value": "NH",
		"orderIndex": 30,
		"parent": ""
	},
	{
		"name": "New Jersey",
		"value": "NJ",
		"orderIndex": 31,
		"parent": ""
	},
	{
		"name": "New Mexico",
		"value": "NM",
		"orderIndex": 32,
		"parent": ""
	},
	{
		"name": "New York",
		"value": "NY",
		"orderIndex": 33,
		"parent": ""
	},
	{
		"name": "North Carolina",
		"value": "NC",
		"orderIndex": 34,
		"parent": ""
	},
	{
		"name": "North Dakota",
		"value": "ND",
		"orderIndex": 35,
		"parent": ""
	},
	{
		"name": "Ohio",
		"value": "OH",
		"orderIndex": 36,
		"parent": ""
	},
	{
		"name": "Oklahoma",
		"value": "OK",
		"orderIndex": 37,
		"parent": ""
	},
	{
		"name": "Oregon",
		"value": "OR",
		"orderIndex": 38,
		"parent": ""
	},
	{
		"name": "Pennsylvania",
		"value": "PA",
		"orderIndex": 39,
		"parent": ""
	},
	{
		"name": "Puerto Rico",
		"value": "PR",
		"orderIndex": 40,
		"parent": ""
	},
	{
		"name": "Rhode Island",
		"value": "RI",
		"orderIndex": 41,
		"parent": ""
	},
	{
		"name": "South Carolina",
		"value": "SC",
		"orderIndex": 42,
		"parent": ""
	},
	{
		"name": "South Dakota",
		"value": "SD",
		"orderIndex": 43,
		"parent": ""
	},
	{
		"name": "Tennessee",
		"value": "TN",
		"orderIndex": 44,
		"parent": ""
	},
	{
		"name": "Texas",
		"value": "TX",
		"orderIndex": 45,
		"parent": ""
	},
	{
		"name": "Utah",
		"value": "UT",
		"orderIndex": 46,
		"parent": ""
	},
	{
		"name": "Vermont",
		"value": "VT",
		"orderIndex": 47,
		"parent": ""
	},
	{
		"name": "Virginia",
		"value": "VA",
		"orderIndex": 48,
		"parent": ""
	},
	{
		"name": "Washington",
		"value": "WA",
		"orderIndex": 49,
		"parent": ""
	},
	{
		"name": "West Virginia",
		"value": "WV",
		"orderIndex": 50,
		"parent": ""
	},
	{
		"name": "Wisconsin",
		"value": "WI",
		"orderIndex": 51,
		"parent": ""
	},
	{
		"name": "Wyoming",
		"value": "WY",
		"orderIndex": 52,
		"parent": ""
	}],
	"tooltip": null
},
                    {
	"fieldName": "PropZip",
	"fieldLabel": "Zip",
	"orderIndex": "2.1.7",
	"required": 1,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldType": "textfield",
    "fieldValue": ""                    
},
{
	"fieldName": "PropCountry",
	"fieldLabel": "Country",
	"orderIndex": "2.1.8",
	"required": 0,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldType": "textfield",
    "fieldValue": "" 
},
{
	"fieldName": "PropCounty",
	"fieldLabel": "County",
	"orderIndex": "2.1.9",
	"required": 0,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldType": "textfield",
    "fieldValue": "" 
},
{
	"fieldName": "PropLatitude",
	"fieldLabel": "Latitude",
	"orderIndex": "2.1.10",
	"required": 0,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldType": "textfield",
    "fieldValue": "" 
},
{
	"fieldName": "PropLongitude",
	"fieldLabel": "Longitude",
	"orderIndex": "2.1.11",
	"required": 0,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldType": "textfield",
    "fieldValue": "" 
},
                    {
	"fieldName": "PropertyNumbers",
	"fieldLabel": "APN",
	"orderIndex": "2.1.12",
	"required": 0,
	"viewStatus": "1",
	"options": null,
	"tooltip": null,
    "fieldType": "textarea",
    "fieldValue": ""                    
}
	]
}]