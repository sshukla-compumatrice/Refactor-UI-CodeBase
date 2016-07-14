#!/bin/bash
# By KE - ver. 1.0 on 12/21/2015
# The following will trap any non-zero exit status.
trap catch_errors ERR;
#
function catch_errors {
    echo "`date`:script aborted, because of errors" >> /tmp/codedeploy.log 2>&1
    exit -1
}
##### Main #####
if [[ ! -d "/var/www/www.parcelplatform.com/app" ]]; then
    catch_errors
fi
chmod 755 /tmp/Devops/ParcelReplaceSed.sh
/tmp/Devops/ParcelReplaceSed.sh >> /tmp/codedeploy.log 2>&1
ret=$?
if (($ret != 0)); then
    echo "`date` /tmp/Devops/ParcelReplaceSed.sh:script aborted, because of errors, $@ - $ret"
    exit -1
fi
find /var/www/www.parcelplatform.com/app -exec chown www-data:www-data {} \;

service apache2 start >> /tmp/codedeploy.log 2>&1

exit 0
