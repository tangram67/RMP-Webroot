#!/bin/bash

NONE='\033[00m'
RED='\033[01;31m'
GREEN='\033[01;32m'
YELLOW='\033[01;33m'
PURPLE='\033[01;35m'
CYAN='\033[01;36m'
WHITE='\033[01;37m'
BOLD='\033[1m'
UNDERLINE='\033[4m'

PWD="/bin/pwd"
ROOT=`${PWD}`
DIST="dist"
FLAGFILE="/tmp/.minimizer"

function fileage()
{
  local filename=$1
  if [ -f $filename ]; then
    ### local changed=`stat -c %Y "$filename"`
    local changed=`date -r "$filename" +%s`
    local now=`date +%s`
    local elapsed
    let elapsed=now-changed
    echo "$elapsed"
  else
    echo "9999"
  fi
}

# Create flag file for duration calculation
touch $FLAGFILE

for FOLDER in "app" "comp/bootstrap-checkbox" "comp/bootstrap-combobox" "comp/bootstrap-radiobutton" "comp/bootstrap-table-contextmenu" "comp/bootstrap-table/custom" "comp/bootstrap-spinner" "comp/lightbox" "comp/websocket"
do

  cd "${ROOT}"

  if [ ! -d "${ROOT}/${FOLDER}" ]; then
    echo "Application folder \"${ROOT}/${FOLDER}\" does not exists, exiting now."
    exit 1
  fi
  cd "${FOLDER}"

  if [ ! -d "${ROOT}/${FOLDER}/${DIST}" ]; then
    echo "Distribution folder \"${ROOT}/${FOLDER}/${DIST}\" does not exists, exiting now."
    exit 1
  fi

  ${ROOT}/minimize.sh $1

done

/var/sr-lost+found

DURATION_S=$(fileage $FLAGFILE)
DURATION_M=$[DURATION_S / 60]
rm $FLAGFILE
echo ""
echo -e "${YELLOW}Completed in $DURATION_S seconds / $DURATION_M minutes. ${NONE}"
