angular.module("ParcelUI").service("accountMgmtAPI", ['accountMgmtUrlCollection', 'APIFactory', 'BASEURL', function (accountMgmtUrlCollection, APIFactory, BASEURL) {

    var self = this;

    this.getCompany = function (companyGUID, parentCompanyGUID, detail, name, hasParent) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.GETAPI_COMPANY_REAL;
        var params = {

            companyguid: companyGUID ? companyGUID : '',
            detail: detail ? detail : 'none',
            name: name ? name : '',
            parentcompanyguid: parentCompanyGUID ? parentCompanyGUID : '',
            hasparent: hasParent ? hasParent : ''

        };
        return APIFactory.get(url, params).then(function (response) {
            return response;
        }, function (error) {
            throw error;
        });
    }

    this.getOffice = function (companyGUID, officeGUID, detail, name) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.GETAPI_OFFICE_REAL;
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";
        queryParams.detail = detail ? detail : "";
        queryParams.name = name ? name : "none";

        return APIFactory.get(url, queryParams).then(function (response) {
            return response;
        }, function (error) {
            throw error;
        });
    };

    this.getUser = function (userGUID, userGUIDs, companyGUID, officeGUID, firstName, lastName, email, search, detail) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.GETAPI_GETUSER_REAL;
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";
        queryParams.userguids = userGUIDs ? userGUIDs : "";
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";
        queryParams.firstname = firstName ? firstName : "";
        queryParams.lastname = lastName ? lastName : "";
        queryParams.email = email ? email : "";
        queryParams.search = search ? search : "";
        queryParams.detail = detail ? detail : "";

        return APIFactory.get(url, queryParams).then(function (response) {
            return response;
        }, function (error) {
            throw error;
        });
    };

    this.updateOffice = function (companyGUID, officeGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.PUTAPI_OFFICEUPDATE_REAL;
        var queryParams = {};
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";

        return APIFactory.put(url, data, queryParams).then(function (response) {
            return response;
        });
    };

    this.updateUser = function (userGUID, data) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.PUTAPI_UPDATEUSER_REAL;
        var queryParams = {};
        queryParams.userguid = userGUID ? userGUID : "";

        return APIFactory.put(url, data, queryParams).then(function (response) {
            return response;
        });
    };

    this.createTeam = function (data) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.CREATE_TEAM;

        return APIFactory.post(url, data).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });

    };

    this.assignUsersToTeam = function (teamGuid, data, operation) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.MODIFY_TEAM;
        var queryParams = {
            teamguid: teamGuid
        }

        if (operation === 'POST') {
            return APIFactory.post(url, data, queryParams).then(function (data) {
                return data;
            }, function (error) {
                throw error;
            });
        } else if (operation === 'PUT') {
            return APIFactory.put(url, data, queryParams).then(function (data) {
                return data;
            }, function (error) {
                throw error;
            });
        }


    };

    this.getTeams = function (companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.GET_TEAMS;
        var queryParams = {};
        queryParams.companyGUID = companyGUID ? companyGUID : "";

        return APIFactory.get(url, queryParams).then(function (response) {
            return response;
        }, function (error) {
            throw error;
        });
    };

    this.getPreconfiguredTeams = function (companyGUID) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.GET_PRECONFIGURED_TEAMS;
        var queryParams = {};
        queryParams.companyGUID = companyGUID ? companyGUID : "";

        return APIFactory.get(url, queryParams).then(function (response) {
            return response;
        }, function (error) {
            throw error;
        });
    };

    this.getTeamUsers = function (teamGUID, companyGUID, officeGUID, userGUID, detail) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.GET_USERS_BYTEAM;
        var queryParams = {};
        queryParams.teamGUID = teamGUID ? teamGUID : "";
        queryParams.companyguid = companyGUID ? companyGUID : "";
        queryParams.officeguid = officeGUID ? officeGUID : "";
        queryParams.userguid = userGUID ? userGUID : "";
        queryParams.detail = detail ? detail : "";

        return APIFactory.get(url, queryParams).then(function (response) {
            return response;
        }, function (error) {
            throw error;
        });
    };

    this.getPreconfiguredTeamUsers = function (url) {

        return APIFactory.get(url, null).then(function (response) {
            return response;
        }, function (error) {
            throw error;
        });
    };

    this.deleteUserFromTeam = function (teamGuid, assignmentGuid) {
        var url = BASEURL.ACCOUNT_MGMT_API + accountMgmtUrlCollection.DELETE_USERFROMTEAM;
        var params = {
            teamGUID: teamGuid,
            assignmentGUID: assignmentGuid

        };
        return APIFactory.delete(url, null, params).then(function (data) {
            return data;
        }, function (error) {
            throw error;
        });
    }

    this.updateEdrCredentials = function (userGuid, edrAccountNumber, edrAccountPassword, userDetails) {
        var userDetails, editUserObj;
        if (!userDetails) {
            this.getUser(userGuid, "", "", "", "", "", "", "", "office").then(function (resp) {
                if (resp.users && resp.users.length) {
                    userDetails = angular.copy(resp.users[0]);
                    editUserObj = prepareEditUserObj(userDetails);
                    editUserObj.user.edrAccountNumber = edrAccountNumber;
                    editUserObj.user.edrAccountPassword = edrAccountPassword;
                    self.updateUser(userGuid, editUserObj).then(function (response) {
                        console.log("EDR credentials updated for " + userGuid);
                    }, function (error) {
                        console.log("Failed to update EDR credentials for " + userGuid);
                    });
                }
            });
        } else {
            userDetails.user.edrAccountNumber = edrAccountNumber;
            userDetails.user.edrAccountPassword = edrAccountPassword;
            self.updateUser(userGuid, userDetails).then(function (response) {
                console.log("EDR credentials updated for " + userGuid);
            }, function (error) {
                console.log("Failed to update EDR credentials for " + userGuid);
            });
        }
    }

    this.prepareEditUserObj = function (userDetailsCopy) {
        if (userDetailsCopy) {
            return {
                "user": {
                    "userName": userDetailsCopy.userName,
                    "title": userDetailsCopy.title,
                    "firstName": userDetailsCopy.firstName,
                    "middleInitial": userDetailsCopy.middleInitial,
                    "lastName": userDetailsCopy.lastName,
                    "isEnabled": userDetailsCopy.isEnabled,
                    "email": userDetailsCopy.email,
                    "officeEmail": userDetailsCopy.officeEmail,
                    "emailClosing": userDetailsCopy.emailClosing,
                    "directPhone": userDetailsCopy.directPhone,
                    "cellPhone": userDetailsCopy.cellPhone,
                    "qualificationsFileDisplayName": userDetailsCopy.qualificationsFileDisplayName,
                    "qualificationsFileCoreFileGUID": userDetailsCopy.qualificationsFileCoreFileGUID,
                    "signatureFileDisplayName": userDetailsCopy.signatureFileDisplayName,
                    "signatureFileCoreFileGUID": userDetailsCopy.signatureFileCoreFileGUID,
                    "isEnvProfessional": userDetailsCopy.isEnvProfessional,
                    "allowAdminsToSign": userDetailsCopy.allowAdminsToSign,
                    "allowFeeAssignments": userDetailsCopy.allowFeeAssignments,
                    "allowAppraisalReviews": userDetailsCopy.allowAppraisalReviews,
                    "allowEvaluations": userDetailsCopy.allowEvaluations,
                    "certifiedHUDFHA": userDetailsCopy.certifiedHUDFHA,
                    "certifiedVA": userDetailsCopy.certifiedVA,
                    "designations": userDetailsCopy.designations,
                    "expertise": userDetailsCopy.expertise,
                    "edrDefaultUserRole": userDetailsCopy.edrDefaultUserRole,
                    "officeGUID": userDetailsCopy.officeGUID,
                    "companyGUID": userDetailsCopy.companyGUID,
                    "employeeNumber": userDetailsCopy.employeeNumber,
                    "edrAccountNumber": userDetailsCopy.edrAccountNumber,
                    "edrAccountPassword": userDetailsCopy.edrAccountPassword
                }
            }
        }
        return false;
    }
}]);