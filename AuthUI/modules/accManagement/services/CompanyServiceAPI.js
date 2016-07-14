angular.module('AccountMgmtModule').service('CompanyServiceAPI', ['AccessMgmtFactory', 'AccountManagementUrlCollection', 'BASEURL', function (AccMgmtFactory, AccountManagementUrlCollection, BASEURL) {

    this.createCompany = function (data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANY_REAL;
        return AccMgmtFactory.post(url, data, null).then(function (response) {
            return response;
        });
    };

    this.updateCompany = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANY_REAL;
        var params = {
            companyguid: companyGUID
        };
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    };

    this.getCompany = function (companyGUID, parentCompanyGUID, detail, name, hasParent) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANY_REAL;
        var params = {
            companyguid: companyGUID ? companyGUID : '',
            detail: detail ? detail : 'none',
            name: name ? name :  '',
            parentcompanyguid: parentCompanyGUID ? parentCompanyGUID : '',
            hasparent: hasParent ? hasParent : ''
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }
    
    this.deleteCompany = function (companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPANY_REAL;
        var params = {
            companyguid: companyGUID
        };
        return AccMgmtFactory.delete(url, null, params);
    };

    this.createCompCertificate = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANYCERTIFICATE_REAL;
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.createCompAppComponentItems = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPAPPCOMPONENTITEMS_REAL
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompCertificate = function (companyGUID, certificationGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANYCERTIFICATE_REAL;
        var params = {
            companyguid: companyGUID,
            certificationguid: certificationGUID
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompAppComponentItems = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPAPPCOMPONENTITEMS_REAL;
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.getAppComponentItems = function (appComponentTypeGUID, limit, offset) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_APPCOMPONENTITEMS_REAL;
        var params = {
            appcomponenttypeguid: appComponentTypeGUID,
            limit: limit == undefined ? 0 : limit,
            offset: offset == undefined ? 0 : offset
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addSetupFees = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANYSETUPFEES_REAL;
        var params = {
            companyguid: companyGUID
        };
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.getSetupFees = function (companyGUID, setupFeeGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYSETUPFEES_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: setupFeeGUID == undefined ? '' : setupFeeGUID
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.lenderDeleteSetupFees = function (companyGUID, setupFeeGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPANYSETUPFEES_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: setupFeeGUID
        };
        return AccMgmtFactory.delete(url, null, params).then(function (response) {
            return response;
        })
    }

    this.addCompanyAssociation = function (companyGUID, detail, data, companyAssociationGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPANYASSOCIATION_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID == undefined ? '' : companyAssociationGUID,
            detail: detail == undefined ? 'none' : detail
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.getCompanyAssociations = function (companyGUID, detail, companyAssociationGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYASSOCIATIONS_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID == undefined ? '' : companyAssociationGUID,
            detail: detail == undefined ? 'none' : detail
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.deleteCompAssociation = function (companyGUID, companyAssociationGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPANYASSOCIATION_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID
        };
        return AccMgmtFactory.delete(url, null, params).then(function (response) {
            return response;
        })
    }

    this.getCompanyAssoUsers = function (companyGUID, companyAssociationGUID, detail, companyAssociationUserGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPASSOUSERS_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID,
            companyassociationuserguid: companyAssociationUserGUID ? companyAssociationUserGUID : "",
            detail: detail == undefined ? 'none' : detail
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.createCompAssociationUser = function (companyGUID, companyAssociationGUID, data, companyAssociationUserGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_COMPASSOUSER_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID,
            companyassociationuserguid: companyAssociationUserGUID ? companyAssociationUserGUID : ""
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.deleteCompAssoUser = function (companyGUID, companyAssociationGUID, companyAssociationUserGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_COMPASSOUSER_REAL;
        var params = {
            companyguid: companyGUID,
            companyassociationguid: companyAssociationGUID,
            companyassociationuserguid: companyAssociationUserGUID
        }
        return AccMgmtFactory.delete(url, null, params).then(function (response) {
            return response;
        });
    }

    this.updateReportSettings = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANYREPORTSETTING_REAL;
        var params = {
            companyguid: companyGUID
        };

        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.getCompReportSettings = function (companyGUID, detail, reportSettingGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYREPORTSETTINGS_REAL;
        var params = {
            companyguid: companyGUID,
            reportsettingguid: reportSettingGUID ? reportSettingGUID : '',
            detail: detail ? detail : 'none'
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.getCompReportVendors = function (companyGUID, reportSettingGUID, detail, reportVendorGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_COMPANYREPORTVENDORS_REAL;
        var params = {
            companyguid: companyGUID,
            reportsettingguid: reportSettingGUID,
            reportvendorguid: reportVendorGUID ? reportVendorGUID : '',
            detail: detail ? detail : 'none'
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        })
    }

    this.updateReportVendors = function (companyGUID, reportSettingGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_COMPANYREPORTVENDORS_REAL;
        var params = {
            companyguid: companyGUID,
            reportsettingguid: reportSettingGUID
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        })
    }

    this.sendInvoice = function (companyGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_SENDFEESTOABS_REAL;
        var params = {
            companyguid: companyGUID
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    //******* PARCEL company view services *******//
    // SetUp items services
    this.getSetupTypes = function (types) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_SETUPTYPES_REAL;
        var params = {
            types: types
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addSetupItem = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_UPDATESETUPTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: ""
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateSetupItems = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATESETUPTABLE_REAL;
        var params = {
            companyguid: companyGUID,

        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.deleteSetupFee = function (setupID, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_SETUPFEES_REAL;
        var params = {
            companyguid: companyGUID,
            setupfeeguid: setupID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    // SetUp items services End


    // Current Pricing services
    this.getCompanyRates = function (companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_CURRENTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            rateguid: ""
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addCompanyRate = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.POSTAPI_ADDCURRENTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            rateguid: ""
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompanyRates = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.PUTAPI_UPDATECURRENTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            rateguid: ""
        }
        return AccMgmtFactory.put(url, data, params).then(function (response) {
            return response;
        });
    }

    this.deleteCompanyRate = function (rateGUID, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_CURRENTRATETABLE_REAL;
        var params = {
            rateguid: rateGUID,
            companyguid: companyGUID
        };

        return AccMgmtFactory.delete(url, null, params);
    };
    // Current Pricing services end


    // Discount services
    this.getCompanyDiscount = function (companyGUID, discountguid) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_DISCOUNTTABLE_REAL; //GETAPI_DISCOUNTTABLE_MOCK
        var params = {
            companyguid: companyGUID,
            discountguid: discountguid ? discountguid : ""
        };
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.addCompanyDiscount = function (data, companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.GETAPI_DISCOUNTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.updateCompanyDiscounts = function (data, companyGUID) {
        var url = AccountManagementUrlCollection.POSTAPI_ADDDISCOUNTTABLE_MOCK;
        var params = {
            companyguid: companyGUID,
        }
        return AccMgmtFactory.post(url, data, params).then(function (response) {
            return response;
        });
    }

    this.deleteCompanyDiscount = function (companyGUID, discountGUID) {
        var url = BASEURL.ACCOUNT_MGMT + AccountManagementUrlCollection.DELETEAPI_DISCOUNTTABLE_REAL;
        var params = {
            companyguid: companyGUID,
            discountguid: discountGUID
        };
        return AccMgmtFactory.delete(url, null, params);
    };

    this.getDiscountTypes = function (types) {
        var url = AccountManagementUrlCollection.GETAPI_DISCOUNTTYPES;
        var params = {
            types: types
        }
        return AccMgmtFactory.get(url, params).then(function (response) {
            return response;
        });
    }

    this.getCurrentYearStatusTable = function () {
            var url = AccountManagementUrlCollection.GETAPI_CURRENTYEARSTATUSTABLE;

            return AccMgmtFactory.get(url, null).then(function (response) {
                return response;
            });
        }
        //******* PARCEL company view services end *******//

}]);