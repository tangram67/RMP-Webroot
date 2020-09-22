# RMP-Webroot

Webroot for the **Reference Media Player**, or in short **RMP**

This repository is meant to use with the **Reference Music Player** project https://github.com/tangram67/RMP

Clone an setup the **RMP** project first and after that install the webroot files from this repository. Please note that the webroot files must be accessible for the user the **RMP** server is running under, e.g. install or clone this repository to the home directory of the given user.

# Setup webroot of RMP

Open the configuration folder of the **RMP** service. Usually this folder should be **/etc/dbApps/rmp/**

1. Shut down the **RMP** service
2. Edit /etc/dbApps/rmp/webserver.conf
3. Set the webroot entry "DocumentRoot = /path/to/the/webroot/" to the real webroot path in your system

Restart the **RMP** service and the webinterface should be fully functional. By defaut the URL of the **RMP** will be http://localhost:8099 on the local PC.
