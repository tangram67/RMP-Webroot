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

JAVA="/usr/bin/java"
YUI_CURRENT="/data/Projekte/HTML_Base_Project/yuicompressor-2.4.8.jar"
MINIMIZER="/usr/bin/yui-compressor"
DEBUG=0
CLEANUP=0


function abspath ()
{
  if [[ -d "$1" ]]; then
    pushd "$1" >/dev/null
    pwd
    popd >/dev/null
  elif [[ -e $1 ]]; then
    pushd "$(dirname "$1")" >/dev/null
    echo "$(pwd)/$(basename "$1")"
    popd >/dev/null
  else
    echo "$1" does not exist! >&2
    return 127
  fi
}


SAVEIFS=$IFS
IFS=$(echo -en "\n\b")

if [[ $1 == *debug* ]]; then
  DEBUG=1
fi

if [[ $1 == *clean* ]]; then
  CLEANUP=1
  echo "Cleanup files..."
fi

# Work from app/... folder
if [ ! -d "dist" ]; then
  echo "Distribution folder \"dist\" does not exists, exiting now."
  exit 1
fi
cd dist

# Remove all minified java scripts
for f in `find . -name '*.min.js'`
do
  echo -e "${RED}Remove file : $f ${NONE}"
  rm "$f"
done
for f in `find . -name '*.min.css'`
do
  echo -e "${PURPLE}Remove file : $f ${NONE}"
  rm "$f"
done
for f in `find . -name '*.*~'`
do
  echo -e "${YELLOW}Remove file : $f ${NONE}"
  rm "$f"
done
echo ""

if [ $CLEANUP -gt 0 ]; then
	exit 0
fi

for EXT in "js" "css"
do
  for f in `find . -name "*.${EXT}"`
  do
    BASE=$(basename "$f" ".$EXT")
    DIR=$(dirname "$f")
    ABSDIR=$(abspath $DIR)

	VERBOSE=""    
    if [ $DEBUG -gt 0 ]; then
      VERBOSE="--verbose"
      echo -e "${CYAN}Filename : $f ${NONE}"
      echo -e "${CYAN}Basename : $BASE ${NONE}"
      echo -e "${CYAN}Folder   : $DIR --> $ABSDIR ${NONE}"
      echo -e "${CYAN}Minimize : $ABSDIR/$BASE.$EXT ${NONE}"
    else
      echo -e "${GREEN}Minimize [$ABSDIR/$BASE.$EXT] ${NONE}"
	fi
    echo ""
    
    echo "$MINIMIZER $VERBOSE --type $EXT -o $ABSDIR/$BASE.min.$EXT $ABSDIR/$BASE.$EXT"
    $MINIMIZER $VERBOSE --type $EXT --line-break 120 -o "$ABSDIR/$BASE.min.$EXT" "$ABSDIR/$BASE.$EXT"
    echo ""

  done
done

# Restore $IFS
IFS=$SAVEIFS

