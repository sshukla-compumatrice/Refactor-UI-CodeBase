{
    "tabs": [{
        "tabID": 101,
        "tabTitle": "Transacational",
        "orderIndex": 1,
        "isDefault": 1,
        "isVisible": 1,
        "isEditable": 0,
        "rows": [{
            "rowID": 301,
            "isEditable": 1,
            "columns": [{
                "isEditable": 1,
                "sectionID": 201,
                "orderIndex": 1,
                "isVisible": 1,
                "sections": [{
                    "fields": [{
                            "fieldValidator": "",
                            "mappedField": "projectName",
                            "fieldLabel": "Project Type",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LocationLoanInfo",
                            "handleFunction": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 1,
                            "isVisible": 1,
                            "fieldName": "ProjectName",
                            "defaultLabel": "Project Type",
                            "fieldID": 34414,
                            "uiOptions": null,
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "loanBorrower",
                            "fieldLabel": "Borrowers Name",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LocationLoanInfo",
                            "handleFunction": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 2,
                            "isVisible": 1,
                            "fieldName": "BorrowerName",
                            "defaultLabel": "Borrowers Name",
                            "fieldID": 34418,
                            "uiOptions": null,
                            "tooltip": null,
                            "fieldValue": ""
					},
                        {
                            "fieldValidator": "",
                            "handleFunction": null,
                            "fieldLabel": "Loan Type",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LocationLoanInfo",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                    "option_name": "Purchase",
                                    "subOption": [],
                                    "option_value": "Purchase",
                                    "orderIndex": 1,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Renewal with new money",
                                    "subOption": [],
                                    "option_value": "Renewal with new money",
                                    "orderIndex": 2,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Renewal with no new money",
                                    "subOption": [],
                                    "option_value": "Renewal with no new money",
                                    "orderIndex": 3,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Construction Loan",
                                    "subOption": [],
                                    "option_value": "Construction Loan",
                                    "orderIndex": 4,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Line of Credit",
                                    "subOption": [],
                                    "option_value": "Line of Credit",
                                    "orderIndex": 5,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Foreclosure",
                                    "subOption": [],
                                    "option_value": "Foreclosure",
                                    "orderIndex": 6,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "SBA",
                                    "subOption": [],
                                    "option_value": "SBA",
                                    "orderIndex": 7,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Government Lending",
                                    "subOption": [],
                                    "option_value": "Government Lending",
                                    "orderIndex": 8,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "VA Lending",
                                    "subOption": [],
                                    "option_value": "VA Lending",
                                    "orderIndex": 9,
                                    "isDefault": 0
						}],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "fieldName": "loanType",
                            "fieldType": "dropDown",
                            "orderIndex": 3,
                            "displayFunction": "",
                            "mappedField": "loanType",
                            "defaultLabel": "Loan Type",
                            "fieldID": 34415,
                            "uiOptions": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "loanAmount",
                            "fieldLabel": "Loan Amount",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LocationLoanInfo",
                            "handleFunction": null,
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 4,
                            "isVisible": 1,
                            "fieldName": "LoanAmount",
                            "defaultLabel": "Loan Amount",
                            "fieldID": 34416,
                            "uiOptions": "{\"inputStyle\" : \"width:10em;\"}",
                            "tooltip": null,
                            "fieldValue": ""
					},
                        {
                            "fieldValidator": "",
                            "handleFunction": null,
                            "fieldLabel": "Borrower Type",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                    "option_name": "Individual",
                                    "subOption": [],
                                    "option_value": "Individual",
                                    "orderIndex": 1,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Legal Entity",
                                    "subOption": [],
                                    "option_value": "Legal Entity",
                                    "orderIndex": 2,
                                    "isDefault": 0
						}],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "BorrowerType",
                            "fieldType": "dropDown",
                            "orderIndex": 5,
                            "displayFunction": "",
                            "mappedField": "borrowerType",
                            "defaultLabel": "Borrower Type",
                            "fieldID": 34417,
                            "uiOptions": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "loanNumber",
                            "fieldLabel": "Obligation # / Loan Number",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LocationLoanInfo",
                            "handleFunction": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 6,
                            "isVisible": 1,
                            "fieldName": "LoanNumber",
                            "defaultLabel": "Obligation # / Loan Number",
                            "fieldID": 34419,
                            "uiOptions": null,
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "desiredReviewDate",
                            "fieldLabel": "Desired Review Delivery Date",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "LenderDataFieldsBusiness::handleSimpleDate",
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "date",
                            "orderIndex": 7,
                            "isVisible": 1,
                            "fieldName": "DesiredReviewDate",
                            "defaultLabel": "Desired Review Delivery Date",
                            "fieldID": 34420,
                            "uiOptions": "{\"date\" : 1, \"inputStyle\" : \"width:10em\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "closingDate",
                            "fieldLabel": "Anticipated Closing Date",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "LenderDataFieldsBusiness::handleSimpleDate",
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "date",
                            "orderIndex": 8,
                            "isVisible": 1,
                            "fieldName": "ClosingDate",
                            "defaultLabel": "Anticipated Closing Date",
                            "fieldID": 34421,
                            "uiOptions": "{\"date\" : 1, \"inputStyle\" : \"width:10em\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "handleFunction": null,
                            "fieldLabel": "Purpose of the Request",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                    "option_name": "Loan Underwriting",
                                    "subOption": [],
                                    "option_value": "Loan Underwriting",
                                    "orderIndex": 1,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Loan Monitoring1",
                                    "subOption": [],
                                    "option_value": "Loan Monitoring1",
                                    "orderIndex": 2,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Loan Monitoring",
                                    "subOption": [],
                                    "option_value": "Loan Monitoring",
                                    "orderIndex": 2,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Foreclosure",
                                    "subOption": [],
                                    "option_value": "Foreclosure",
                                    "orderIndex": 3,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "OREO",
                                    "subOption": [],
                                    "option_value": "OREO",
                                    "orderIndex": 4,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Other",
                                    "subOption": [],
                                    "option_value": "Other",
                                    "orderIndex": 5,
                                    "isDefault": 0
						}],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "Purpose",
                            "fieldType": "dropDown",
                            "orderIndex": 9,
                            "displayFunction": "",
                            "mappedField": "purpose",
                            "defaultLabel": "Purpose of the Request",
                            "fieldID": 34422,
                            "uiOptions": "{\"onchange\" : \"selectShowHide('Purpose', ['Other'], ['PurposeOther'],['xyz'],['abc']);\"}",
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "purposeOther",
                            "fieldLabel": "Please Describe",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handlePurposeOther",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 10,
                            "isVisible": 1,
                            "fieldName": "PurposeOther",
                            "defaultLabel": "Please Describe",
                            "fieldID": 34423,
                            "uiOptions": null,
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "handleFunction": "ServiceRequestBusiness::handleTransactionType",
                            "fieldLabel": "Credit Transaction Type",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                    "option_name": "NewLoan",
                                    "subOption": [],
                                    "option_value": "New Loan to the Bank",
                                    "orderIndex": 1,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "ModificationWithoutNewMoney",
                                    "subOption": [],
                                    "option_value": "Renewal/Modification of existing loan without new money over existing Loan Balance",
                                    "orderIndex": 2,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "ModificationWithNewMoney",
                                    "subOption": [],
                                    "option_value": "Renewal/Modification of existing loan with new money over existing Loan Balance",
                                    "orderIndex": 3,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Other",
                                    "subOption": [],
                                    "option_value": "Other",
                                    "orderIndex": 4,
                                    "isDefault": 0
						}],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "TransactionType",
                            "fieldType": "dropDown",
                            "orderIndex": 11,
                            "displayFunction": "",
                            "mappedField": "transactionType",
                            "defaultLabel": "Credit Transaction Type",
                            "fieldID": 34424,
                            "uiOptions": "{\"onchange\" : \"selectShowHide('TransactionType', ['ModificationWithNewMoney'], ['LoanCurrentBalance','LoanNewMoney']);\"}",
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "loanCurrentBalance",
                            "fieldLabel": "Current Loan Balance",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 12,
                            "isVisible": 1,
                            "fieldName": "LoanCurrentBalance",
                            "defaultLabel": "Current Loan Balance",
                            "fieldID": 34425,
                            "uiOptions": "{\"style\" : \"display:none\", \"inputStyle\" : \"width:10em;\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "proposedNewMoney",
                            "fieldLabel": "Proposed New Money",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 13,
                            "isVisible": 1,
                            "fieldName": "LoanNewMoney",
                            "defaultLabel": "Proposed New Money",
                            "fieldID": 34426,
                            "uiOptions": "{\"style\" : \"display:none\", \"inputStyle\" : \"width:10em;\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "handleFunction": null,
                            "fieldLabel": "Loan Purpose",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                    "option_name": "Business",
                                    "subOption": [],
                                    "option_value": "Business",
                                    "orderIndex": 10,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "Consumer",
                                    "subOption": [],
                                    "option_value": "Consumer",
                                    "orderIndex": 20,
                                    "isDefault": 0
						}],
                            "tooltip": "businessLoan",
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "loanPurpose",
                            "fieldType": "dropDown",
                            "orderIndex": 14,
                            "displayFunction": "",
                            "mappedField": "loanPurpose",
                            "defaultLabel": "Loan Purpose",
                            "fieldID": 34427,
                            "uiOptions": "{\"class\" : \"singleToggle\", \"data-toggle\" : \"IsBorrowerPrimary1\",\"data-toggle-on\":\"Consumer\"}",
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "handleFunction": "ServiceRequestBusiness::handleIsBorrowerPrimary",
                            "fieldLabel": "Borrower's Primary Residence?",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "IsBorrowerPrimary",
                            "fieldType": "radioButton",
                            "orderIndex": 15,
                            "displayFunction": "",
                            "mappedField": "isBorrowerPrimary",
                            "defaultLabel": "Borrower's Primary Residence?",
                            "fieldID": 34428,
                            "uiOptions": "{\"style\" : \"display:none\"}",
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "handleFunction": null,
                            "fieldLabel": "SBA Involvement?",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "IsSbaLoan",
                            "fieldType": "radioButton",
                            "orderIndex": 16,
                            "displayFunction": "",
                            "mappedField": "isSbaLoan",
                            "defaultLabel": "SBA Involvement?",
                            "fieldID": 34429,
                            "uiOptions": "{\"onchange\" : \"yesnoSbaShowHide('IsSbaLoan',['sbaType'],[],'table-row');\"}",
                            "fieldValue": ""
                        
					}, {
                            "fieldValidator": "",
                            "handleFunction": null,
                            "fieldLabel": "SBA Type",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                    "option_name": "7(a)",
                                    "subOption": [],
                                    "option_value": "7(a)",
                                    "orderIndex": 1,
                                    "isDefault": 0
						},
                                {
                                    "option_name": "504(c)",
                                    "subOption": [],
                                    "option_value": "504(c)",
                                    "orderIndex": 2,
                                    "isDefault": 0
						}],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "sbaType",
                            "fieldType": "dropDown",
                            "orderIndex": 17,
                            "displayFunction": "",
                            "mappedField": "sbaType",
                            "defaultLabel": "SBA Type",
                            "fieldID": 34430,
                            "uiOptions": "{\"style\" : \"display:none\", \"onchange\" : \"selectSbaTypeShowHide();\"}",
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "partnerBusinessName",
                            "fieldLabel": "Identify Intended Users:",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleSbaExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 18,
                            "isVisible": 1,
                            "fieldName": "PartnerBusinessName",
                            "defaultLabel": "Identify Intended Users:",
                            "fieldID": 34431,
                            "uiOptions": "{\"style\" : \"display:none\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "altPartnerBusinessName",
                            "fieldLabel": "Name(s) of CDC Partner(s)",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleSbaExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 19,
                            "isVisible": 1,
                            "fieldName": "AltPartnerBusinessName",
                            "defaultLabel": "Name(s) of CDC Partner(s)",
                            "fieldID": 34432,
                            "uiOptions": "{\"style\" : \"display:none\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "altAddresseeContact",
                            "fieldLabel": "Contact Name",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleSbaExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 20,
                            "isVisible": 1,
                            "fieldName": "AltAddresseeContact",
                            "defaultLabel": "Contact Name",
                            "fieldID": 34433,
                            "uiOptions": "{\"style\" : \"display:none\", \"instruction\" : \"Provide the following if the CDC or others need to be named as an Addressee:\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "altAddresseeBusinessName",
                            "fieldLabel": "Business Name",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleSbaExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 21,
                            "isVisible": 1,
                            "fieldName": "AltAddresseeBusinessName",
                            "defaultLabel": "Business Name",
                            "fieldID": 34434,
                            "uiOptions": "{\"style\" : \"display:none\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "altAddresseeAddress",
                            "fieldLabel": "Address",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleSbaExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 22,
                            "isVisible": 1,
                            "fieldName": "AltAddresseeAddress",
                            "defaultLabel": "Address",
                            "fieldID": 34435,
                            "uiOptions": "{\"style\" : \"display:none\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "altAddresseeAddressLine2",
                            "fieldLabel": "City, State, Zip",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleSbaExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 23,
                            "isVisible": 1,
                            "fieldName": "AltAddresseeAddressLine2",
                            "defaultLabel": "City, State, Zip",
                            "fieldID": 34436,
                            "uiOptions": "{\"style\" : \"display:none\"}",
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "handleFunction": null,
                            "fieldLabel": "Participation/Syndication/SNC loan?",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "fieldName": "IsParticipationLoan",
                            "fieldType": "radioButton",
                            "orderIndex": 24,
                            "displayFunction": "",
                            "mappedField": "isParticipationLoan",
                            "defaultLabel": "Participation/Syndication/SNC loan?",
                            "fieldID": 34437,
                            "uiOptions": "{\"onchange\" : \"yesnoParticipationShowHide('IsParticipationLoan',['ParticipationLoanAmount','ParticipationLenderShare','IsAgentBank1'],[],'table-row');\"}",
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "participationLoanAmount",
                            "fieldLabel": "Aggregate Loan Amount",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleParticipationExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 25,
                            "isVisible": 1,
                            "fieldName": "ParticipationLoanAmount",
                            "defaultLabel": "Aggregate Loan Amount",
                            "fieldID": 34438,
                            "uiOptions": null,
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "participationLenderShare",
                            "fieldLabel": "Bank's Share",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": "ServiceRequestBusiness::handleParticipationExtras",
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 26,
                            "isVisible": 1,
                            "fieldName": "ParticipationLenderShare",
                            "defaultLabel": "Bank's Share",
                            "fieldID": 34440,
                            "uiOptions": null,
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "mappedField": "rifNumber",
                            "fieldLabel": "RIF # or Prospect",
                            "isEditable": 1,
                            "displayFunction": "",
                            "defaultValue": null,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "handleFunction": null,
                            "fieldGroup": "Loan",
                            "isRequired": 0,
                            "field_Option": [],
                            "fieldType": "text",
                            "orderIndex": 27,
                            "isVisible": 1,
                            "fieldName": "RifNumber",
                            "defaultLabel": "RIF # or Prospect",
                            "fieldID": 34439,
                            "uiOptions": null,
                            "tooltip": null,
                            "fieldValue": ""
					}, {
                            "fieldValidator": "",
                            "handleFunction": "ServiceRequestBusiness::handleParticipationExtras",
                            "fieldLabel": "Are we the administrative agent?",
                            "isEditable": 1,
                            "mappedTable": "AssetMgmt.LoanDetail",
                            "defaultValue": null,
                            "isVisible": 1,
                            "fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
                            "tooltip": null,
                            "fieldGroup": "Loan",
                            "isRequired": 1,
                            "fieldName": "IsAgentBank",
                            "fieldType": "radioButton",
                            "orderIndex": 28,
                            "displayFunction": "",
                            "mappedField": "isAgentBank",
                            "defaultLabel": "Are we the administrative agent?",
                            "fieldID": 34441,
                            "uiOptions": null,
                            "fieldValue": ""
					}],
                    "isEditable": 1,
                    "sectionID": 1500,
                    "sectionTitle": "TRANSACTION INFORMATION",
                    "isVisible": 1,
                    "displayFunction": null,
                    "uiOptions": null,
                    "sectionType": "Property"
				}],
                "uiOptions": null,
                "isDefault": 1
			}],
            "orderIndex": 1,
            "isVisible": 1,
            "uiOptions": null,
            "isDefault": 1
		}, {
			"rowID": 330,
			"isEditable": 1,
			"columns": [{
				"isEditable": 1,
				"sectionID": 230,
				"orderIndex": 1,
				"isVisible": 1,
				"sections": [{
					"fields": [{
						"fieldValidator": "",
						"mappedField": "requestor",
						"fieldLabel": "Requester",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LoanDetail",
						"handleFunction": null,
						"fieldGroup": "Loan",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 1,
						"isVisible": 1,
						"fieldName": "Requester",
						"defaultLabel": "Requester",
						"fieldID": 34442,
						"uiOptions": null,
						"tooltip": null
					},
					{
						"fieldValidator": "",
						"mappedField": "lendingSpecialist",
						"fieldLabel": "Lending Specialist",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LoanDetail",
						"handleFunction": null,
						"fieldGroup": "Loan",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 2,
						"isVisible": 0,
						"fieldName": "LendingSpecialist",
						"defaultLabel": "Lending Specialist",
						"fieldID": 56133,
						"uiOptions": null,
						"tooltip": null
					},
					{
						"fieldValidator": "",
						"mappedField": "notifyEmails",
						"fieldLabel": "Email Address(es)",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationLoanInfo",
						"handleFunction": "ServiceRequestBusiness::handleNotifyEmails",
						"fieldGroup": "Loan",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 3,
						"isVisible": 1,
						"fieldName": "NotifyEmails",
						"defaultLabel": "Email Address(es)",
						"fieldID": 34443,
						"uiOptions": "{\"instruction\" : \"Notify Additional Users when Request is Setup (separate multiple email addresses by ','):\"}",
						"tooltip": null
					}],
					"isEditable": 1,
					"sectionID": 1501,
					"sectionTitle": "RELATIONSHIP MANAGER INFO",
					"isVisible": 1,
					"displayFunction": null,
					"uiOptions": null,
					"sectionType": "Property"
				}],
				"uiOptions": null,
				"isDefault": 1
			}],
			"orderIndex": 3,
			"isVisible": 1,
			"uiOptions": null,
			"isDefault": 1
		},{
			"rowID": 333,
			"isEditable": 1,
			"columns": [{
				"isEditable": 1,
				"sectionID": 233,
				"orderIndex": 1,
				"isVisible": 1,
				"sections": [{
					"fields": [{
						"fieldValidator": "",
						"mappedField": "costCenterNumber",
						"fieldLabel": "Billing Cost Center #",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LoanDetail",
						"handleFunction": null,
						"fieldGroup": "Loan",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 2,
						"isVisible": 1,
						"fieldName": "CostCenterNumber",
						"defaultLabel": "Billing Cost Center #",
						"fieldID": 34444,
						"uiOptions": "{\"inputStyle\" : \"width:5em\"}",
						"tooltip": null
					},
					{
						"fieldValidator": "",
						"mappedField": "ledgerNumber",
						"fieldLabel": "General Ledger #",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LoanDetail",
						"handleFunction": null,
						"fieldGroup": "Loan",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 3,
						"isVisible": 1,
						"fieldName": "LedgerNumber",
						"defaultLabel": "General Ledger #",
						"fieldID": 34445,
						"uiOptions": null,
						"tooltip": null
					}],
					"isEditable": 1,
					"sectionID": 1502,
					"sectionTitle": "INVOICING",
					"isVisible": 1,
					"displayFunction": null,
					"uiOptions": null,
					"sectionType": "Property"
				}],
				"uiOptions": null,
				"isDefault": 1
			}],
			"orderIndex": 4,
			"isVisible": 1,
			"uiOptions": null,
			"isDefault": 1
		}]
	},{
		"tabID": 202,
		"tabTitle": "Collateral",
		"orderIndex": 2,
		"isDefault": 1,
		"isVisible": 1,
		"isEditable": 0,
		"rows": [{
			"rowID": 501,
			"isEditable": 1,
			"columns": [{
				"columnID": 701,
				"isEditable": 1,
				"orderIndex": 1,
				"isVisible": 1,
				"sections": [{
					"fields": [{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Property Category",
						"isEditable": 0,
						"mappedTable": "Reports.Locations",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
							"option_name": "Residential",
							"option_value": "Residential",
							"orderIndex": 1,
							"isDefault": 0
						},
						{
							"option_name": "Commercial",
							"option_value": "Commercial",
							"orderIndex": 2,
							"isDefault": 0
						}],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "CommercialResidential",
						"fieldType": "dropDown",
						"orderIndex": 1,
						"displayFunction": "",
						"mappedField": "commercialResidential",
						"defaultLabel": "Property Category",
						"fieldID": 34446,
						"uiOptions": null,
                        "fieldValue": ""
					},{
                                            "fieldValidator": "", 
                                            "handleFunction": "LenderDataFieldsBusiness::handlePropertyType", 
                                            "fieldLabel": "Property Type", 
                                            "isEditable": 1, 
                                            "mappedTable": "Reports.Locations", 
                                            "defaultValue": null, 
                                            "isVisible": 1, 
                                            "fieldOption": [
                                                {
                                                    "option_name": "Agricultural", 
                                                    "subOption": [{
                                                                "optionValue": "Agribusiness - Dairy, Hog, Poultry, Fish, etc.", 
                                                                "optionName": "Agribusiness - Dairy, Hog, Poultry, Fish, etc.", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Farms/Row Crops/Hobby Farms", 
                                                                "optionName": "Farms/Row Crops/Hobby Farms", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Agricultural Zoned - vacant and not farmed", 
                                                                "optionName": "Land - Agricultural Zoned - vacant and not farmed", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Pasture/Ranch", 
                                                                "optionName": "Land - Pasture/Ranch", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Permanent Crops (Vineyard/Orchard/Grove)", 
                                                                "optionName": "Land - Permanent Crops (Vineyard/Orchard/Grove)", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Timberland", 
                                                                "optionName": "Land - Timberland", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Agricultural", 
                                                    "orderIndex": 1, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Health Care", 
                                                    "subOption": [ {
                                                                "optionValue": "Ambulatory Surgery Center", 
                                                                "optionName": "Ambulatory Surgery Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Hospital/Medical Center", 
                                                                "optionName": "Hospital/Medical Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Commercial", 
                                                                "optionName": "Land - Commercial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Rehabilitation Center", 
                                                                "optionName": "Rehabilitation Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Health Care", 
                                                    "orderIndex": 2, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Industrial", 
                                                    "subOption": [{
                                                                "optionValue": "Condominium Unit(s)", 
                                                                "optionName": "Condominium Unit(s)", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Flex/Tech Building", 
                                                                "optionName": "Flex/Tech Building", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Food Processing/Production", 
                                                                "optionName": "Food Processing/Production", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Industrial- Business Park Subdivision", 
                                                                "optionName": "Industrial- Business Park Subdivision", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Industrial - Office/Retail Showroom", 
                                                                "optionName": "Industrial - Office/Retail Showroom", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Industrial", 
                                                                "optionName": "Land - Industrial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Manufacturing", 
                                                                "optionName": "Manufacturing", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 8, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 9, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Research and Development", 
                                                                "optionName": "Research and Development", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 10, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Salvage yard", 
                                                                "optionName": "Salvage yard", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 11, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Saw Mill", 
                                                                "optionName": "Saw Mill", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 12, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Self/Public/Mini-Storage", 
                                                                "optionName": "Self/Public/Mini-Storage", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 13, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Storage Yard", 
                                                                "optionName": "Storage Yard", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 14, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Tank Farm/Petroleum Storage/Refinery", 
                                                                "optionName": "Tank Farm/Petroleum Storage/Refinery", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 15, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Truck Terminal/Hub/Transit Facility", 
                                                                "optionName": "Truck Terminal/Hub/Transit Facility", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 16, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Underground/Cave Storage", 
                                                                "optionName": "Underground/Cave Storage", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 17, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Warehouse-Distribution Warehouse", 
                                                                "optionName": "Warehouse-Distribution Warehouse", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 18, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Warehouse-Refrigerated/Cold Storage", 
                                                                "optionName": "Warehouse-Refrigerated/Cold Storage", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 19, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Warehouse-Storage Warehouse", 
                                                                "optionName": "Warehouse-Storage Warehouse", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 20, 
                                                                "subOption": []
                                                            }] 
                                                                                                    
                                                }, 
                                                {
                                                    "option_name": "Land", 
                                                    "subOption": [{
                                                                "optionValue": "Land - Agricultural Zoned - vacant and not farmed", 
                                                                "optionName": "Land - Agricultural Zoned - vacant and not farmed", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Commercial", 
                                                                "optionName": "Land - Commercial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Industrial", 
                                                                "optionName": "Land - Industrial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Office", 
                                                                "optionName": "Land - Office", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Other - Provide details in property description", 
                                                                "optionName": "Land - Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Pasture/Ranch", 
                                                                "optionName": "Land - Pasture/Ranch", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Permanent Crops (Vineyard/Orchard/Grove)", 
                                                                "optionName": "Land - Permanent Crops (Vineyard/Orchard/Grove)", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Residential Subdivision (5 or more lots)", 
                                                                "optionName": "Land - Residential Subdivision (5 or more lots)", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 8, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Retail", 
                                                                "optionName": "Land - Retail", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 9, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Timberland", 
                                                                "optionName": "Land - Timberland", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 10, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Wilderness/Recreational", 
                                                                "optionName": "Land - Wilderness/Recreational", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 11, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Land", 
                                                    "orderIndex": 4, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Lodging/Hospitality", 
                                                    "subOption": [{
                                                                "optionValue": "Bed & Breakfast ", 
                                                                "optionName": "Bed & Breakfast ", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Campground/RV-Trailer Camp", 
                                                                "optionName": "Campground/RV-Trailer Camp", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Economy/Limited Service", 
                                                                "optionName": "Economy/Limited Service", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Full Service", 
                                                                "optionName": "Full Service", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Commercial", 
                                                                "optionName": "Land - Commercial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Lodging/Hospitality", 
                                                    "orderIndex": 5, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Multi-family", 
                                                    "subOption": [{
                                                                "optionValue": "Apartments -Market Rent", 
                                                                "optionName": "Apartments -Market Rent", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Apartments - Government Subsidized", 
                                                                "optionName": "Apartments - Government Subsidized", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Apartments - LIHTC Tax Credits", 
                                                                "optionName": "Apartments - LIHTC Tax Credits", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Manufactured Home Park", 
                                                                "optionName": "Manufactured Home Park", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Residential Subdivision (5 or more lots)", 
                                                                "optionName": "Land - Residential Subdivision (5 or more lots)", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Student Housing", 
                                                                "optionName": "Student Housing", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Multi-family", 
                                                    "orderIndex": 6, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Office", 
                                                    "subOption": [{
                                                                "optionValue": "Condominium Unit", 
                                                                "optionName": "Condominium Unit", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Institutional/Governmental", 
                                                                "optionName": "Institutional/Governmental", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Office", 
                                                                "optionName": "Land - Office", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Medical Office", 
                                                                "optionName": "Medical Office", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Office Building", 
                                                                "optionName": "Office Building", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Office - R&D/Laboratoy", 
                                                                "optionName": "Office - R&D/Laboratoy", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Office", 
                                                    "orderIndex": 7, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Residential", 
                                                    "subOption": [{
                                                                "optionValue": "Single Family Home", 
                                                                "optionName": "Single Family Home", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 10, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "2-4 Family Home", 
                                                                "optionName": "2-4 Family Home", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 20, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Individual Condominium Unit", 
                                                                "optionName": "Individual Condominium Unit", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 30, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Individual Cooperative Apartment", 
                                                                "optionName": "Individual Cooperative Apartment", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 40, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Manufactured Home", 
                                                                "optionName": "Manufactured Home", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 50, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Vacant Land", 
                                                                "optionName": "Vacant Land", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 60, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Residential Subdivision", 
                                                                "optionName": "Residential Subdivision", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 70, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 80, 
                                                                "subOption": []
                                                            }], 
                                                                                                    
                                                    "orderIndex": 8, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Retail", 
                                                    "subOption": [{
                                                                "optionValue": "Car Wash", 
                                                                "optionName": "Car Wash", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Condominium Unit(s)", 
                                                                "optionName": "Condominium Unit(s)", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Convenience Store - no gasoline", 
                                                                "optionName": "Convenience Store - no gasoline", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Day Care Facility/Nursery", 
                                                                "optionName": "Day Care Facility/Nursery", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Free Standing Building-Bank Branch", 
                                                                "optionName": "Free Standing Building-Bank Branch", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Free Standing Building-Big Box", 
                                                                "optionName": "Free Standing Building-Big Box", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Free Standing Building-Dept Store", 
                                                                "optionName": "Free Standing Building-Dept Store", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Free Standing Building-Free Standing", 
                                                                "optionName": "Free Standing Building-Free Standing", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 8, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Free Standing Building", 
                                                                "optionName": "Free Standing Building", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 9, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Garden Center", 
                                                                "optionName": "Garden Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 10, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Retail", 
                                                                "optionName": "Land - Retail", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 11, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Laundromat-Self Serve ", 
                                                                "optionName": "Laundromat-Self Serve ", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 12, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 13, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Parking Garage", 
                                                                "optionName": "Parking Garage", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 14, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Parking Lot", 
                                                                "optionName": "Parking Lot", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 15, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Restaurant-Fast Food", 
                                                                "optionName": "Restaurant-Fast Food", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 16, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Restaurant-Sit Down", 
                                                                "optionName": "Restaurant-Sit Down", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 17, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Lumberyard", 
                                                                "optionName": "Lumberyard", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 18, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Service Station/Gas Station", 
                                                                "optionName": "Service Station/Gas Station", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 19, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Shopping Center: Community Center", 
                                                                "optionName": "Shopping Center: Community Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 20, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Shopping Center: Convenience/Strip Center", 
                                                                "optionName": "Shopping Center: Convenience/Strip Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 21, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Shopping Center: Neighborhood Center", 
                                                                "optionName": "Shopping Center: Neighborhood Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 22, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Shopping Center:  Other", 
                                                                "optionName": "Shopping Center:  Other", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 23, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Shopping Center: Outlet/Power/Lifestyle Center", 
                                                                "optionName": "Shopping Center: Outlet/Power/Lifestyle Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 24, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Shopping Center: Regional/Super Regional Center", 
                                                                "optionName": "Shopping Center: Regional/Super Regional Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 25, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Street Retail/Storefront", 
                                                                "optionName": "Street Retail/Storefront", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 26, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Tavern, Bar, Nightclub, Micro-Brewery", 
                                                                "optionName": "Tavern, Bar, Nightclub, Micro-Brewery", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 27, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Vehicle Related-Dealership", 
                                                                "optionName": "Vehicle Related-Dealership", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 28, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Vehicle Related-Lube Shop", 
                                                                "optionName": "Vehicle Related-Lube Shop", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 29, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Vehicle Related-Service & Repair", 
                                                                "optionName": "Vehicle Related-Service & Repair", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 30, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Vehicle Related-Truck Stop", 
                                                                "optionName": "Vehicle Related-Truck Stop", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 31, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Retail", 
                                                    "orderIndex": 9, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Senior Housing", 
                                                    "subOption": [{
                                                                "optionValue": "Assisted Living Residences", 
                                                                "optionName": "Assisted Living Residences", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Congregate Seniors Housing", 
                                                                "optionName": "Congregate Seniors Housing", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Continuing Care Retirement Communities", 
                                                                "optionName": "Continuing Care Retirement Communities", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Commercial", 
                                                                "optionName": "Land - Commercial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Skilled Nursing Facility", 
                                                                "optionName": "Skilled Nursing Facility", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Senior Housing", 
                                                    "orderIndex": 10, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Special Purpose", 
                                                    "subOption": [{
                                                                "optionValue": "Airplane Hanger", 
                                                                "optionName": "Airplane Hanger", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Armory/Club/Lodge Facility", 
                                                                "optionName": "Armory/Club/Lodge Facility", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Cement/Rock/Gravel Plant", 
                                                                "optionName": "Cement/Rock/Gravel Plant", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Funeral Home/Mortuary", 
                                                                "optionName": "Funeral Home/Mortuary", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Commercial", 
                                                                "optionName": "Land - Commercial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Marina/Marine-Repair/Service", 
                                                                "optionName": "Marina/Marine-Repair/Service", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Meeting/Banquet Facility", 
                                                                "optionName": "Meeting/Banquet Facility", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Mine/Quarry", 
                                                                "optionName": "Mine/Quarry", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 8, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 9, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Religious Facility", 
                                                                "optionName": "Religious Facility", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 10, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "School/University", 
                                                                "optionName": "School/University", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 11, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Veterinarian Facility/Kennel", 
                                                                "optionName": "Veterinarian Facility/Kennel", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 12, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Special Purpose", 
                                                    "orderIndex": 11, 
                                                    "isDefault": 0
                                                }, 
                                                {
                                                    "option_name": "Sport/Entertainment", 
                                                    "subOption": [{
                                                                "optionValue": "Amusement Park", 
                                                                "optionName": "Amusement Park", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 1, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Aquatic Facility/Swimming Pool", 
                                                                "optionName": "Aquatic Facility/Swimming Pool", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 2, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Bowling Alley", 
                                                                "optionName": "Bowling Alley", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 3, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Golf Course/Driving Range", 
                                                                "optionName": "Golf Course/Driving Range", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 4, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Health & Fitness Center/Sports Club/Gym", 
                                                                "optionName": "Health & Fitness Center/Sports Club/Gym", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 5, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Horse Farms/Stables/Equestrian Center", 
                                                                "optionName": "Horse Farms/Stables/Equestrian Center", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 6, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Land - Commercial", 
                                                                "optionName": "Land - Commercial", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 7, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Other - Provide details in property description", 
                                                                "optionName": "Other - Provide details in property description", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 8, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Skating Rink", 
                                                                "optionName": "Skating Rink", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 9, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Ski Resort", 
                                                                "optionName": "Ski Resort", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 10, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Sports Arena/Stadiums", 
                                                                "optionName": "Sports Arena/Stadiums", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 11, 
                                                                "subOption": []
                                                            }, 
                                                            {
                                                                "optionValue": "Theatre/Concert Hall", 
                                                                "optionName": "Theatre/Concert Hall", 
                                                                "isDefault": 0, 
                                                                "orderIndex": 12, 
                                                                "subOption": []
                                                            }], 
                                                    "option_value": "Sport/Entertainment", 
                                                    "orderIndex": 12, 
                                                    "isDefault": 0
                                                }
                                            ], 
                                            "tooltip": null, 
                                            "fieldGroup": "Property", 
                                            "isRequired": 1, 
                                            "fieldName": "PropertyType", 
                                            "fieldType": "dropDown", 
                                            "orderIndex": 2, 
                                            "displayFunction": "", 
                                            "mappedField": "propertyType", 
                                            "defaultLabel": "Property Type", 
                                            "fieldID": 34447, 
                                            "uiOptions": null
                                        }
					
					,{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Business Operations Risk Level",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
							"option_name": "Low Risk",
							"subOption": [],
							"option_value": "Low Risk",
							"orderIndex": 1,
							"isDefault": 0
						},
						{
							"option_name": "Elevated Risk",
							"subOption": [],
							"option_value": "Elevated Risk",
							"orderIndex": 2,
							"isDefault": 0
						}],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"fieldName": "riskLevel",
						"fieldType": "dropDown",
						"orderIndex": 3,
						"displayFunction": "",
						"mappedField": "riskLevel",
						"defaultLabel": "Business Operations Risk Level",
						"fieldID": 34448,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "address1",
						"fieldLabel": "Property Address",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 4,
						"isVisible": 1,
						"fieldName": "PropAddress",
						"defaultLabel": "Property Address",
						"fieldID": 34449,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "address2",
						"fieldLabel": "Suite / Floor / Unit",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 5,
						"isVisible": 1,
						"fieldName": "PropUnit",
						"defaultLabel": "Suite / Floor / Unit",
						"fieldID": 34450,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "city",
						"fieldLabel": "City",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 6,
						"isVisible": 1,
						"fieldName": "PropCity",
						"defaultLabel": "City",
						"fieldID": 34451,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "State/Province",
						"isEditable": 0,
						"mappedTable": "Reports.Locations",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"fieldName": "PropState",
						"fieldType": "dropDown",
						"orderIndex": 7,
						"displayFunction": "",
						"mappedField": "state",
						"defaultLabel": "State/Province",
						"fieldID": 34452,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "zip",
						"fieldLabel": "Zip/Postal Code",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 8,
						"isVisible": 1,
						"fieldName": "PropZip",
						"defaultLabel": "Zip/Postal Code",
						"fieldID": 34453,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "country",
						"fieldLabel": "Country",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 9,
						"isVisible": 1,
						"fieldName": "PropCountry",
						"defaultLabel": "Country",
						"fieldID": 34454,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "county",
						"fieldLabel": "County",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 10,
						"isVisible": 1,
						"fieldName": "PropCounty",
						"defaultLabel": "County",
						"fieldID": 34455,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "latitude",
						"fieldLabel": "Latitude",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 11,
						"isVisible": 1,
						"fieldName": "PropLatitude",
						"defaultLabel": "Latitude",
						"fieldID": 34456,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "longitude",
						"fieldLabel": "Longitude",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 12,
						"isVisible": 1,
						"fieldName": "PropLongitude",
						"defaultLabel": "Longitude",
						"fieldID": 34457,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "collateralID",
						"fieldLabel": "Collateral ID",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 15,
						"isVisible": 1,
						"fieldName": "CollateralID",
						"defaultLabel": "Collateral ID",
						"fieldID": 34458,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "APN",
						"fieldLabel": "APN / Property Numbers",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 16,
						"isVisible": 1,
						"fieldName": "PropertyNumbers",
						"defaultLabel": "APN / Property Numbers",
						"fieldID": 34459,
						"uiOptions": "{\"multiline\" : 1}",
						"tooltip": null,
                        "fieldValue": ""
					}],
					"isEditable": 1,
					"sectionID": 1503,
					"sectionTitle": "PROPERTY DESCRIPTION",
					"isVisible": 1,
					"displayFunction": null,
					"uiOptions": null,
					"sectionType": "Loan"
				}],
				"uiOptions": null,
				"isDefault": 1
			}],
			"orderIndex": 1,
			"isVisible": 1,
			"uiOptions": null,
			"isDefault": 1
		},{
			"rowID": 516,
			"isEditable": 1,
			"columns": [{
				"columnID": 716,
				"isEditable": 1,
				"orderIndex": 1,
				"isVisible": 1,
				"sections": [{
					"fields": [{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Property Contact",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
							"option_name": "Owner",
							"option_value": "Owner",
							"orderIndex": 1,
							"isDefault": 0
						},
						{
							"option_name": "Property Manager",
							"option_value": "Property Manager",
							"orderIndex": 2,
							"isDefault": 0
						},
						{
							"option_name": "Tenant",
							"option_value": "Tenant",
							"orderIndex": 3,
							"isDefault": 0
						}],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "ContactType",
						"fieldType": "dropDown",
						"orderIndex": 1,
						"displayFunction": "",
						"mappedField": "contactType",
						"defaultLabel": "Property Contact",
						"fieldID": 34461,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "contact",
						"fieldLabel": "Name",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 2,
						"isVisible": 1,
						"fieldName": "ContactName",
						"defaultLabel": "Name",
						"fieldID": 34462,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "phone",
						"fieldLabel": "Phone",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 3,
						"isVisible": 1,
						"fieldName": "ContactPhone",
						"defaultLabel": "Phone",
						"fieldID": 34463,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "email",
						"fieldLabel": "Email",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 4,
						"isVisible": 1,
						"fieldName": "ContactEmail",
						"defaultLabel": "Email",
						"fieldID": 34464,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "altPhone",
						"fieldLabel": "AltPhone",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 5,
						"isVisible": 1,
						"fieldName": "ContactAltPhone",
						"defaultLabel": "AltPhone",
						"fieldID": 34465,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "fax",
						"fieldLabel": "Fax",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 6,
						"isVisible": 1,
						"fieldName": "ContactFax",
						"defaultLabel": "Fax",
						"fieldID": 34466,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "naics",
						"fieldLabel": "NAICS #",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 7,
						"isVisible": 1,
						"fieldName": "PropNaics",
						"defaultLabel": "NAICS #",
						"fieldID": 34467,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": "ServiceRequestBusiness::handlePropertyInterest",
						"fieldLabel": "Property Interest Appraised (check all that apply)",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
							"option_name": "FeeSimple",
							"subOption": [],
							"option_value": "Fee Simple",
							"orderIndex": 1,
							"isDefault": 0
						},
						{
							"option_name": "LeasedFee",
							"subOption": [],
							"option_value": "Leased Fee",
							"orderIndex": 2,
							"isDefault": 0
						},
						{
							"option_name": "Leasehold",
							"subOption": [],
							"option_value": "Leasehold",
							"orderIndex": 3,
							"isDefault": 0
						},
						{
							"option_name": "NotSure",
							"subOption": [],
							"option_value": "Not Sure",
							"orderIndex": 4,
							"isDefault": 0
						},
						{
							"option_name": "Other",
							"subOption": [],
							"option_value": "Other",
							"orderIndex": 5,
							"isDefault": 0
						}],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "PropInterest",
						"fieldType": "text",
						"orderIndex": 8,
						"displayFunction": "",
						"mappedField": "propInterest",
						"defaultLabel": "Property Interest Appraised (check all that apply)",
						"fieldID": 34468,
						"uiOptions": "{\"copyAcross\" : \"1\", \"onchange\" : \"checkboxPropInterestShowHide();\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "",
						"fieldLabel": "Other Property Interest Appraised",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "",
						"handleFunction": "ServiceRequestBusiness::handlePropertyInterestOther",
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 9,
						"isVisible": 1,
						"fieldName": "PropInterestOther",
						"defaultLabel": "Other Property Interest Appraised",
						"fieldID": 34469,
						"uiOptions": "{\"copyAcross\" : \"1\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": "ServiceRequestBusiness::handleValueNeeded",
						"fieldLabel": "Value(s) Needed (check all that apply)",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
							"option_name": "AsIs",
							"subOption": [],
							"option_value": "As Is",
							"orderIndex": 1,
							"isDefault": 0
						},
						{
							"option_name": "AsCompleted",
							"subOption": [],
							"option_value": "As Completed",
							"orderIndex": 2,
							"isDefault": 0
						},
						{
							"option_name": "AsStabilized",
							"subOption": [],
							"option_value": "As Stabilized",
							"orderIndex": 3,
							"isDefault": 0
						},
						{
							"option_name": "Market Value",
							"subOption": [],
							"option_value": "Market Value",
							"orderIndex": 4,
							"isDefault": 0
						},
						{
							"option_name": "Prospective Market Value",
							"subOption": [],
							"option_value": "Prospective Market Value",
							"orderIndex": 5,
							"isDefault": 0
						},
						{
							"option_name": "Liquidation Value (90 days)",
							"subOption": [],
							"option_value": "Liquidation Value (90 days)",
							"orderIndex": 6,
							"isDefault": 0
						},
						{
							"option_name": "Other",
							"subOption": [],
							"option_value": "Other",
							"orderIndex": 7,
							"isDefault": 0
						}],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "ValuationPremise",
						"fieldType": "text",
						"orderIndex": 10,
						"displayFunction": "",
						"mappedField": "valuationPremise",
						"defaultLabel": "Value(s) Needed (check all that apply)",
						"fieldID": 34470,
						"uiOptions": "{\"copyAcross\" : \"1\", \"onchange\" : \"checkboxValuationPremiseShowHide();\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "",
						"fieldLabel": "Other Value Needed",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "",
						"handleFunction": "ServiceRequestBusiness::handleValuationPremiseOther",
						"fieldGroup": "Property",
						"isRequired": 1,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 11,
						"isVisible": 1,
						"fieldName": "ValuationPremiseOther",
						"defaultLabel": "Other Value Needed",
						"fieldID": 34471,
						"uiOptions": "{\"copyAcross\" : \"1\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "numberOfBuildings",
						"fieldLabel": "Number of Buildings",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 13,
						"isVisible": 1,
						"fieldName": "NumBuildings",
						"defaultLabel": "Number of Buildings",
						"fieldID": 34472,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": "ServiceRequestBusiness::handleLocationsDetailUnits",
						"fieldLabel": "Improvement Size As Is",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "BuildingSize",
						"fieldType": "text",
						"orderIndex": 14,
						"displayFunction": "",
						"mappedField": "improvementsizeAsIs",
						"defaultLabel": "Improvement Size As Is",
						"fieldID": 34473,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": "ServiceRequestBusiness::handleLocationsDetailUnits",
						"fieldLabel": "Improvement Size As Complete",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "BuildingSizeCompleted",
						"fieldType": "text",
						"orderIndex": 15,
						"displayFunction": "",
						"mappedField": "improvementsizeAsCompleted",
						"defaultLabel": "Improvement Size As Complete",
						"fieldID": 34474,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": "ServiceRequestBusiness::handleLocationsDetailUnits",
						"fieldLabel": "Land Area",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "LandSize",
						"fieldType": "text",
						"orderIndex": 16,
						"displayFunction": "",
						"mappedField": "landSize",
						"defaultLabel": "Land Area",
						"fieldID": 34475,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": "ServiceRequestBusiness::handleLocationsDetailUnits",
						"fieldLabel": "Excess Land",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "ExcessLand",
						"fieldType": "text",
						"orderIndex": 17,
						"displayFunction": "",
						"mappedField": "excessLand",
						"defaultLabel": "Excess Land",
						"fieldID": 34476,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "yearBuilt",
						"fieldLabel": "Year Built",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 18,
						"isVisible": 1,
						"fieldName": "YearBuilt",
						"defaultLabel": "Year Built",
						"fieldID": 34477,
						"uiOptions": "{\"inputStyle\" : \"width:5em\"}",
						"tooltip": null
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Property Tenancy",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "Tenancy",
						"fieldType": "dropDown",
						"orderIndex": 19,
						"displayFunction": "",
						"mappedField": "propertyTenancy",
						"defaultLabel": "Property Tenancy",
						"fieldID": 34478,
						"uiOptions": "{\"onchange\" : \"selectShowHide('Tenancy',['Multi-Tenant Investor'],['Occupancy','Tenants']);\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "occupancy",
						"fieldLabel": "Current Occupancy %",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 20,
						"isVisible": 1,
						"fieldName": "Occupancy",
						"defaultLabel": "Current Occupancy %",
						"fieldID": 34479,
						"uiOptions": "{\"style\" : \"display:none\", \"inputStyle\" : \"width:5em\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "numberOfTenants",
						"fieldLabel": "Number of Tenants",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 21,
						"isVisible": 1,
						"fieldName": "Tenants",
						"defaultLabel": "Number of Tenants",
						"fieldID": 34480,
						"uiOptions": "{\"style\" : \"display:none\", \"inputStyle\" : \"width:5em\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Proposed Renovation?",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "HasRenovation",
						"fieldType": "radioButton",
						"orderIndex": 22,
						"displayFunction": "",
						"mappedField": "hasProposedRenovation",
						"defaultLabel": "Proposed Renovation?",
						"fieldID": 34481,
						"uiOptions": "{\"onchange\" : \"yesnoShowHide('HasRenovation',['RenevationDesc'],[],'table-row');\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "proposedRenovationDescription",
						"fieldLabel": "Proposed Renovation Description",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": "ServiceRequestBusiness::handleRenevationDesc",
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 23,
						"isVisible": 1,
						"fieldName": "RenevationDesc",
						"defaultLabel": "Proposed Renovation Description",
						"fieldID": 34482,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "zoning",
						"fieldLabel": "Zoning",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 24,
						"isVisible": 1,
						"fieldName": "Zoning",
						"defaultLabel": "Zoning",
						"fieldID": 34483,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Property Status",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
							"option_name": "Existing",
							"subOption": [],
							"option_value": "Existing",
							"orderIndex": 1,
							"isDefault": 0
						},
						{
							"option_name": "Vacant Land",
							"subOption": [],
							"option_value": "Vacant Land",
							"orderIndex": 2,
							"isDefault": 0
						},
						{
							"option_name": "Proposed",
							"subOption": [],
							"option_value": "Proposed",
							"orderIndex": 3,
							"isDefault": 0
						},
						{
							"option_name": "Under Construction",
							"subOption": [],
							"option_value": "Under Construction",
							"orderIndex": 4,
							"isDefault": 0
						},
						{
							"option_name": "Under Renovation",
							"subOption": [],
							"option_value": "Under Renovation",
							"orderIndex": 5,
							"isDefault": 0
						},
						{
							"option_name": "New Addition",
							"subOption": [],
							"option_value": "New Addition",
							"orderIndex": 6,
							"isDefault": 0
						}],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "PropertyStatus",
						"fieldType": "dropDown",
						"orderIndex": 25,
						"displayFunction": "",
						"mappedField": "propertyStatus",
						"defaultLabel": "Property Status",
						"fieldID": 34484,
						"uiOptions": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Proposed Change in Use?",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "HasUseChange",
						"fieldType": "radioButton",
						"orderIndex": 26,
						"displayFunction": "",
						"mappedField": "hasChangeInUse",
						"defaultLabel": "Proposed Change in Use?",
						"fieldID": 34485,
						"uiOptions": "{\"onchange\" : \"yesnoShowHide('HasUseChange',['ProposedUse'],[],'table-row');\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "proposedUse",
						"fieldLabel": "Proposed Use",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": "ServiceRequestBusiness::handleProposedUse",
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 27,
						"isVisible": 1,
						"fieldName": "ProposedUse",
						"defaultLabel": "Proposed Use",
						"fieldID": 34486,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Ground Lease?",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "HasGroundLease",
						"fieldType": "radioButton",
						"orderIndex": 28,
						"displayFunction": "",
						"mappedField": "hasGroundLease",
						"defaultLabel": "Ground Lease?",
						"fieldID": 34487,
						"uiOptions": "{\"onchange\" : \"yesnoShowHide('HasGroundLease',['GroundLeaseDesc'],[],'table-row');\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "groundLeaseDescription",
						"fieldLabel": "Ground Lease Description",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": "ServiceRequestBusiness::handleGroundLeaseDesc",
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 29,
						"isVisible": 1,
						"fieldName": "GroundLeaseDesc",
						"defaultLabel": "Ground Lease Description",
						"fieldID": 34488,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Currently Listed for Sale?",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "IsForSale",
						"fieldType": "radioButton",
						"orderIndex": 30,
						"displayFunction": "",
						"mappedField": "listedForSale",
						"defaultLabel": "Currently Listed for Sale?",
						"fieldID": 34489,
						"uiOptions": "{\"onchange\" : \"yesnoShowHide('IsForSale',['ListPrice'],[],'table-row');\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "listPrice",
						"fieldLabel": "List Price",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": "ServiceRequestBusiness::handleListPrice",
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 31,
						"isVisible": 1,
						"fieldName": "ListPrice",
						"defaultLabel": "List Price",
						"fieldID": 34490,
						"uiOptions": null,
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"handleFunction": null,
						"fieldLabel": "Pending or Recent Sale?",
						"isEditable": 1,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"defaultValue": null,
						"isVisible": 1,
						"fieldOption": [{
                                "option_name": "Yes",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            },{
                                "option_name": "No",
                                
                                    "option_value": "",
                                    "orderIndex": 1
                                   
                                
                            }],
						"tooltip": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"fieldName": "HasRecentSale",
						"fieldType": "radioButton",
						"orderIndex": 32,
						"displayFunction": "",
						"mappedField": "pendingOrRecentSale",
						"defaultLabel": "Pending or Recent Sale?",
						"fieldID": 34491,
						"uiOptions": "{\"onchange\" : \"yesnoShowHide('HasRecentSale',['SalePrice','SaleDate'],[],'table-row');\"}",
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "salePrice",
						"fieldLabel": "Sale Price",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 33,
						"isVisible": 1,
						"fieldName": "SalePrice",
						"defaultLabel": "Sale Price",
						"fieldID": 34492,
						"uiOptions": "{\"inputStyle\" : \"width:10em;\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "pendingOrRecentClosingDate",
						"fieldLabel": "Date Sold or Closing Date",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": "LenderDataFieldsBusiness::handleSimpleDate",
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 34,
						"isVisible": 1,
						"fieldName": "SaleDate",
						"defaultLabel": "Date Sold or Closing Date",
						"fieldID": 34493,
						"uiOptions": "{\"dateall\" : 1, \"inputStyle\" : \"width:10em\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "propertyDescription",
						"fieldLabel": "Property Description",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 35,
						"isVisible": 1,
						"fieldName": "PropertyDescription",
						"defaultLabel": "Property Description",
						"fieldID": 34494,
						"uiOptions": "{\"multiline\" : 1, \"multilineRows\" : 7, \"topLabel\" : 1, \"inputStyle\" : \"width:600px;margin-left:1em;\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "legalDescription",
						"fieldLabel": "Legal Description",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "AssetMgmt.LocationsDetail",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 36,
						"isVisible": 1,
						"fieldName": "LegalDescription",
						"defaultLabel": "Legal Description",
						"fieldID": 34495,
						"uiOptions": "{\"multiline\" : 1, \"multilineRows\" : 7, \"topLabel\" : 1, \"inputStyle\" : \"width:600px;margin-left:1em;\"}",
						"tooltip": null,
                        "fieldValue": ""
					},
					{
						"fieldValidator": "",
						"mappedField": "comments",
						"fieldLabel": "Requester Comments",
						"isEditable": 1,
						"displayFunction": "",
						"defaultValue": null,
						"mappedTable": "Reports.Locations",
						"handleFunction": null,
						"fieldGroup": "Property",
						"isRequired": 0,
						"field_Option": [],
						"fieldType": "text",
						"orderIndex": 37,
						"isVisible": 1,
						"fieldName": "Comments",
						"defaultLabel": "Requester Comments",
						"fieldID": 34496,
						"uiOptions": "{\"multiline\" : 1, \"multilineRows\" : 7, \"topLabel\" : 1, \"inputStyle\" : \"width:600px;margin-left:1em;\"}",
						"tooltip": null,
                        "fieldValue": ""
					}],
					"isEditable": 1,
					"sectionID": 1505,
					"sectionTitle": "",
					"isVisible": 1,
					"displayFunction": null,
					"uiOptions": null,
					"sectionType": "Loan"
				}],
				"uiOptions": null,
				"isDefault": 1
			}],
			"orderIndex": 3,
			"isVisible": 1,
			"uiOptions": null,
			"isDefault": 1
		}
               
                ]
	}]
}