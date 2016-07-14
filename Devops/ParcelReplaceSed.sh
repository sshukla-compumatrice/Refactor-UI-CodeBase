#!/bin/bash -x
# Ver 1.0, by KE 12/26/2015
# Ver 1.1, by KE 01/18/2016 - added upport for Devops folder.
#
trap 'catch_errors "Line: $LINENO, Error: $LASTERR"' ERR;

function catch_errors {
        ret=$?
        if (($ret == 0)) || (($ret == 1)) ; then
                return
        else
                echo "`date` $0:script aborted, because of errors, $@ - $status"
                exit -1
        fi  
}       
#
if [[ -z "$DEPLOYMENT" && -z "$DEPLOYMENT_GROUP_NAME" ]]; then
        echo "`date` $0:script aborted, missing DEPLOYMENT/DEPLOYMENT_GROUP_NAME environment variable"
        exit -1
fi
#
if [[ ! -z "$DEPLOYMENT_GROUP_NAME" ]]; then
        export DEPLOYMENT=$DEPLOYMENT_GROUP_NAME
        if [[ ! -d "/var/www/www.parcelplatform.com/app" ]]; then
                echo "`date` $0:script aborted, missing /var/www/www.parcelplatform.com/app folder"
                exit -1
        fi
        cd /var/www/www.parcelplatform.com/app
fi
#echo "Deployment: $DEPLOYMENT"
if [ "$DEPLOYMENT" == "dev" ]; then
        v1=apidev
        v2=wwwdev
        v3=dev_team
        v4=PARCELDBDEV
        v5=refactoring
        v6="/tmp/Devops/app.urlResources.js.dev"
fi
if [ "$DEPLOYMENT" == "qa" ]; then
        v1=apiqa
        v2=wwwqa
        v3=qa_team
        v4=PARCELDBQA
        v5=qa_refactoring
        v6="/tmp/Devops/app.urlResources.js.qa"
fi
if [ "$DEPLOYMENT" == "stg" ]; then
        v1=apistg
        v2=wwwstg
        v3=stg_team
        v4=PARCELDBSTG.parcelplatform.com
        v5=stg_refactoring
        v6="/tmp/Devops/app.urlResources.js.stg"
fi
if [ "$DEPLOYMENT" == "prod" ]; then
        v1=api
        v2=www
        v3=prod_team
        v4=PARCELDB.parcelplatform.com
        v5=prod_refactoring
        v6="/tmp/Devops/app.urlResources.js.prod"
fi
#
if [ "$DEPLOYMENT" == "demo" ]; then
        v1=api
        v2=www
        v3=demo_team
        v4=PARCELDBDemo.parcelplatform.com
        v5=demo_refactoring
        v6="/tmp/Devops/app.urlResources.js.demo"
fi
#
if [ -d "/tmp/Devops" ]; then
        if [[ ! -f "$v6" ]]; then
                echo "`date` $0:script aborted, missing app.urlResources.js template files or missing app folder"
                exit -1
        fi
        cp -f "$v6" "app/app.urlResources.js"
fi
#
exit 0
