{
    "formID": 123,
    "formName": "My Company's SRF Form",
    "formType": "SRF",
    "companyID": 1218,
    "officeID": 5825,
    "createdAID": 5272,
    "createdTS": "2015-07-17 11:58:06",
    "modifiedAID": 1234,
    "modifiedTS": "2015-08-04 14:58:06",
    "deletedAID": 1234,
    "deletedTS": "2015-09-02 22:58:06",
    "isDefault": 0,
    "isEnabled": 1,
    "tabs": [
        {
            "tabID": "Tab-A",
            "tabTitle": "Transactional",
            "orderIndex": 1,
            "isDefault": 1,
            "isVisible": 1,
            "isEditable": 0,
            "rows": [
                {
                    "rowID": "Tab-A_Row-A",
                    "orderIndex": 1,
                    "isDefault": 1,
                    "isVisible": 1,
                    "isEditable": 0,
                    "columns": [
                        {
                            "columnID": "Tab-A_Row-A_Col-A",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-A_Col-A_Sec-A",
                                    "sectionTitle": "Transaction Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "TRANSACTIONAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "text",
                                            "fieldName": "project_name",
                                            "fieldLabel": "Project Type",
                                            "defaultLabel": "project",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidProjectType",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "EDRLP"
                                        },
                                        {
                                            "fieldID": 502,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "borrower_name",
                                            "fieldLabel": "BorrowersName",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 702,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "User One"
                                        },
                                        {
                                            "fieldID": 504,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "loan_type",
                                            "fieldLabel": "loan Type",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Commercial",
                                                    "value": "Commercial",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "Foreclosure",
                                                    "value": "Foreclosure",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "EnvironmentallySensitiveIndustry",
                                                    "value": "EnvironmentallySensitiveIndustry",
                                                    "orderIndex": 3,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 704,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                "name": "Foreclosure",
                                                "value": "Foreclosure",
                                                "orderIndex": 2,
                                                "parent": ""
                                            }
                                        },
                                        {
                                            "fieldID": 505,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "Number",
                                            "fieldName": "loan_amount",
                                            "fieldLabel": "LoanAmount",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 705,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "123321"
                                        },
                                        {
                                            "fieldID": 506,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "borrower_type",
                                            "fieldLabel": "BorrowerType",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Individual",
                                                    "value": "Individual",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "LegalEntity",
                                                    "value": "LegalEntity",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 706,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                "name": "LegalEntity",
                                                "value": "LegalEntity",
                                                "orderIndex": 2,
                                                "parent": ""
                                            }
                                        },
                                        {
                                            "fieldID": 507,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "loan_number",
                                            "fieldLabel": "LoanNumber",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 707,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "123"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "radio",
                                            "fieldValidator": "",
                                            "fieldName": "is_sba_loan One",
                                            "fieldLabel": "SBAInvolvement One?",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Yess",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "Noo",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                },
                                {
                                    "sectionID": "Tab-A_Row-A_Col-A_Sec-B",
                                    "sectionTitle": "Relation Manager Info",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "TRANSACTIONAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "Requester",
                                            "fieldLabel": "Requester",
                                            "defaultLabel": "project",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "Requester",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidProjectType",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "User two"
                                        },
                                        {
                                            "fieldID": 502,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "NotifyEmails",
                                            "fieldLabel": "Email Address(es)",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 702,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "usertwo@email.com"
                                        }
                                    ]
                                },
                                {
                                    "sectionID": "Tab-A_Row-A_Col-A_Sec-C",
                                    "sectionTitle": "INVOICING",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "TRANSACTIONAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "CostCenterNumber",
                                            "fieldLabel": "Billing Cost Center #",
                                            "defaultLabel": "project",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "Requester",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidProjectType",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "456"
                                        },
                                        {
                                            "fieldID": 502,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "LedgerNumber",
                                            "fieldLabel": "General Ledger #",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 702,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "121"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "columnID": "Tab-A_Row-A_Col-B",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-A_Col-B_Sec-A",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "COLLATERAL",
                                            "fieldType": "text",
                                            "fieldValidator": "Phone",
                                            "fieldName": "contact_phone",
                                            "fieldLabel": "Contact's Phone",
                                            "defaultLabel": "Phone",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "9096438831"
                                        }
                                    ]
                                },
                                {
                                    "sectionID": "Tab-A_Row-A_Col-B_Sec-B",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 506,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "borrower_type",
                                            "fieldLabel": "BorrowerType",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Individual",
                                                    "value": "Individual",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "LegalEntity",
                                                    "value": "LegalEntity",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 706,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "LegalEntity",
                                                    "value": "LegalEntity",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "columnID": "Tab-A_Row-A_Col-C",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-A_Col-C_Sec-A",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 507,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "loan_number",
                                            "fieldLabel": "LoanNumber",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 707,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "121"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "radio",
                                            "fieldValidator": "",
                                            "fieldName": "is_sba_loan two",
                                            "fieldLabel": "SBAInvolvement two?",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue":{
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "rowID": "TabA_RowB",
                    "orderIndex": 1,
                    "isDefault": 1,
                    "isVisible": 1,
                    "isEditable": 0,
                    "columns": [
                        {
                            "columnID": "Tab-A_Row-B_Col-A",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-B_Col-A_Sec-A",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 507,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "loan_number",
                                            "fieldLabel": "LoanNumber",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 707,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "21"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "radio",
                                            "fieldValidator": "",
                                            "fieldName": "is_sba_loan",
                                            "fieldLabel": "SBAInvolvement?",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "tabID": "Tab-B",
            "tabTitle": "Collateral",
            "orderIndex": 1,
            "isDefault": 1,
            "isVisible": 1,
            "isEditable": 0,
            "rows": [
                {
                    "rowID": "Tab-B_Row-A",
                    "orderIndex": 1,
                    "isDefault": 1,
                    "isVisible": 1,
                    "isEditable": 0,
                    "columns": [
                        {
                            "columnID": "Tab-B_Row-A_Col-A",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-B_Row-A_Col-A_Sec-A",
                                    "sectionTitle": "PROPERTY DESCRIPTION",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "What_type_of_loan_is_this?",
                                            "fieldLabel": "What type of loan is this?",
                                            "defaultLabel": "project",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [{
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
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidProjectType",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                "name": "Commercial",
                                                "value": "Commercial",
                                                "orderIndex": 2,
                                                "parent": ""
                                            }
                                        },
                                        {
                                            "fieldID": 502,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "Risk_Level",
                                            "fieldLabel": "Risk Level",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [{
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
                                            "tooltip": {
                                                "tooltipID": 702,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                "name": "Elevated Risk",
                                                "value": "Elevated Risk",
                                                "orderIndex": 2,
                                                "parent": ""
                                            }
                                        },
                                        {
                                            "fieldID": 503,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "Locatio_name",
                                            "fieldLabel": "Location Name",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 703,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "USA"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "columnID": "Tab-A_Row-A_Col-B",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-A_Col-B_Sec-A",
                                    "sectionTitle": "PROPERTY ADDRESS",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "COLLATERAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "Address",
                                            "fieldLabel": "Address",
                                            "defaultLabel": "Phone",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "12/32 NEW York"
                                        },
                                          {
                                            "fieldID": 502,
                                            "fieldGroup": "COLLATERAL",
                                            "fieldType": "text",
                                            "fieldValidator": "text",
                                            "fieldName": "City",
                                            "fieldLabel": "City",
                                            "defaultLabel": "Phone",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "New York"
                                        },
                                          {
                                            "fieldID": 503,
                                            "fieldGroup": "COLLATERAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "Zip",
                                            "fieldLabel": "Zip",
                                            "defaultLabel": "Phone",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "232145"
                                        }
                                    ]
                                },
                                {
                                    "sectionID": "Tab-A_Row-A_Col-B_Sec-B",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 506,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "borrower_type",
                                            "fieldLabel": "BorrowerType",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Individual",
                                                    "value": "Individual",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "LegalEntity",
                                                    "value": "LegalEntity",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 706,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "Individual",
                                                    "value": "Individual",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "rowID": "TabB_RowB",
                    "orderIndex": 1,
                    "isDefault": 1,
                    "isVisible": 1,
                    "isEditable": 0,
                    "columns": [
                        {
                            "columnID": "Tab-B_Row-B_Col-A",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-B_Row-B_Col-A_Sec-A",
                                    "sectionTitle": "Map Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 507,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "Latitude",
                                            "fieldLabel": "Latitude",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 707,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "12.432"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "Longitude",
                                            "fieldLabel": "Longitude?",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],

                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "32.234"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "APN/Property Numbers",
                                            "fieldLabel": "APN / Property Numbers?",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],

                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "21"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "columnID": "Tab-B_Row-B_Col-A",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-B_Row-B_Col-A_Sec-A",
                                    "sectionTitle": "MAP",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "tabID": "Tab-A",
            "tabTitle": "TAB3",
            "orderIndex": 1,
            "isDefault": 1,
            "isVisible": 1,
            "isEditable": 0,
            "rows": [
                {
                    "rowID": "Tab-A_Row-A",
                    "orderIndex": 1,
                    "isDefault": 1,
                    "isVisible": 1,
                    "isEditable": 0,
                    "columns": [
                        {
                            "columnID": "Tab-A_Row-A_Col-A",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-A_Col-A_Sec-A",
                                    "sectionTitle": "Transaction Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "TRANSACTIONAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "project_name",
                                            "fieldLabel": "Project Type",
                                            "defaultLabel": "project",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidProjectType",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "EDR Parcel"
                                        },
                                        {
                                            "fieldID": 502,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "borrower_name",
                                            "fieldLabel": "BorrowersName",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 702,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "User Three"
                                        },
                                        {
                                            "fieldID": 503,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "loan_type",
                                            "fieldLabel": "Loan Type",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 703,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "Loan One"
                                        },
                                        {
                                            "fieldID": 504,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "loan_type",
                                            "fieldLabel": "loan Type",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Commercial",
                                                    "value": "Commercial",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "Foreclosure",
                                                    "value": "Foreclosure",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "EnvironmentallySensitiveIndustry",
                                                    "value": "EnvironmentallySensitiveIndustry",
                                                    "orderIndex": 3,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 704,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "EnvironmentallySensitiveIndustry",
                                                    "value": "EnvironmentallySensitiveIndustry",
                                                    "orderIndex": 3,
                                                    "parent": ""
                                                }
                                        },
                                        {
                                            "fieldID": 505,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "Number",
                                            "fieldName": "loan_amount",
                                            "fieldLabel": "LoanAmount",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 705,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "54321"
                                        },
                                        {
                                            "fieldID": 506,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "borrower_type",
                                            "fieldLabel": "BorrowerType",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Individual",
                                                    "value": "Individual",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "LegalEntity",
                                                    "value": "LegalEntity",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 706,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "Individual",
                                                    "value": "Individual",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                }
                                        },
                                        {
                                            "fieldID": 507,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "loan_number",
                                            "fieldLabel": "LoanNumber",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 707,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "12321"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "radio",
                                            "fieldValidator": "",
                                            "fieldName": "is_sba_loan",
                                            "fieldLabel": "SBAInvolvement?",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                },
                                {
                                    "sectionID": "Tab-A_Row-A_Col-A_Sec-B",
                                    "sectionTitle": "Relation Manager Info",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "TRANSACTIONAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "Requester",
                                            "fieldLabel": "Requester",
                                            "defaultLabel": "project",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "Requester",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidProjectType",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "User Four"
                                        },
                                        {
                                            "fieldID": 502,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "NotifyEmails",
                                            "fieldLabel": "Email Address(es)",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 702,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "UserFive@email.com"
                                        }
                                    ]
                                },
                                {
                                    "sectionID": "Tab-A_Row-A_Col-A_Sec-C",
                                    "sectionTitle": "INVOICING",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "TRANSACTIONAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "CostCenterNumber",
                                            "fieldLabel": "Billing Cost Center #",
                                            "defaultLabel": "project",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "Requester",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidProjectType",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "111"
                                        },
                                        {
                                            "fieldID": 502,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "LedgerNumber",
                                            "fieldLabel": "General Ledger #",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 702,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "435"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "columnID": "Tab-A_Row-A_Col-B",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-A_Col-B_Sec-A",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 501,
                                            "fieldGroup": "COLLATERAL",
                                            "fieldType": "text",
                                            "fieldValidator": "Phone",
                                            "fieldName": "contact_phone",
                                            "fieldLabel": "Contact's Phone",
                                            "defaultLabel": "Phone",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "phone",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 701,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "9096438831"
                                        }
                                    ]
                                },
                                {
                                    "sectionID": "Tab-A_Row-A_Col-B_Sec-B",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 506,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "dropdown",
                                            "fieldValidator": "",
                                            "fieldName": "borrower_type",
                                            "fieldLabel": "BorrowerType",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Individual",
                                                    "value": "Individual",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "LegalEntity",
                                                    "value": "LegalEntity",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 706,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "LegalEntity",
                                                    "value": "LegalEntity",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "columnID": "Tab-A_Row-A_Col-C",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-A_Col-C_Sec-A",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 507,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "loan_number",
                                            "fieldLabel": "LoanNumber",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 707,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "1232"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "radio",
                                            "fieldValidator": "",
                                            "fieldName": "is_sba_loan",
                                            "fieldLabel": "SBAInvolvement?",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "rowID": "TabA_RowB",
                    "orderIndex": 1,
                    "isDefault": 1,
                    "isVisible": 1,
                    "isEditable": 0,
                    "columns": [
                        {
                            "columnID": "Tab-A_Row-B_Col-A",
                            "orderIndex": 1,
                            "isDefault": 1,
                            "isVisible": 1,
                            "isEditable": 0,
                            "sections": [
                                {
                                    "sectionID": "Tab-A_Row-B_Col-A_Sec-A",
                                    "sectionTitle": "Location Information",
                                    "sectionDescription": "Please enter the propery info below:",
                                    "sectionType": "COLLATERAL",
                                    "displayFunction": "NULL",
                                    "isVisible": 1,
                                    "isEditable": 0,
                                    "uiOptions": "NULL",
                                    "fields": [
                                        {
                                            "fieldID": 507,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "text",
                                            "fieldValidator": "",
                                            "fieldName": "loan_number",
                                            "fieldLabel": "LoanNumber",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 0,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness::handlePhone",
                                            "fieldOptions": [],
                                            "tooltip": {
                                                "tooltipID": 707,
                                                "tooltipTitle": "NeedHelp?",
                                                "tooltipContent": "EnterinavalidUSphonenumber",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": "12"
                                        },
                                        {
                                            "fieldID": 508,
                                            "fieldGroup": "TRANSACTIONAL",
                                            "fieldType": "radio",
                                            "fieldValidator": "",
                                            "fieldName": "is_sba_loan",
                                            "fieldLabel": "SBAInvolvement???",
                                            "defaultLabel": "",
                                            "mappedTable": "AssetMgmt.LoanDetail",
                                            "mappedField": "",
                                            "orderIndex": 1,
                                            "isRequired": 1,
                                            "displayFunction": "",
                                            "handleFunction": "SRFBusiness: : handlePhone",
                                            "fieldOptions": [
                                                {
                                                    "name": "Yes",
                                                    "value": "1",
                                                    "orderIndex": 1,
                                                    "parent": ""
                                                },
                                                {
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                            ],
                                            "tooltip": {
                                                "tooltipID": 708,
                                                "tooltipTitle": "Need Help?",
                                                "tooltipContent": "Enter in a valid US phone number",
                                                "displayEvent": "MOUSE_OVER",
                                                "displayPosition": "LABEL_TOP"
                                            },
                                            "isVisible": 1,
                                            "isEditable": 0,
                                            "uiOptions": "NULL",
                                            "fieldValue": {
                                                    "name": "No",
                                                    "value": "0",
                                                    "orderIndex": 2,
                                                    "parent": ""
                                                }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
