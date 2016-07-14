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
service apache2 stop >> /tmp/codedeploy.log 2>&1
if [ -d "/tmp/Devops" ]; then
        rm -rf /tmp/Devops
fi
if [[ -e "/usr/bin/zip" && -d "/var/www/www.parcelplatform.com/app" ]]; then
    /usr/bin/zip -r /var/www/www.parcelplatform.com.zip /var/www/www.parcelplatform.com/app >> /tmp/codedeploy.log 2>&1
    rm -rf /var/www/www.parcelplatform.com/app >> /tmp/codedeploy.log 2>&1
else
    catch_errors
fi

exit 0
