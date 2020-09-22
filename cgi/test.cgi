#!/bin/sh
STAMP=`date +"%d.%m.%g %H:%M:%S"`

# First line of a CGI response is the HTTP header "Content-Type"
# Next line must be empty by design!
echo -e "Content-type: text/html\n\n"
#echo -e "Content-type: text/plain\n\n"

/bin/cat << EOM
<HTML>
<HEAD><TITLE>HTML CGI Test</TITLE>
</HEAD>
<BODY bgcolor="#cccccc" text="#000000">
<P>
<SMALL>
<PRE>
EOM

echo "========================== HTML CGI TEST ==========================="
echo "CALLED AT $STAMP"
echo "CALLED AS $0 $1 $2 $3 $4 $5 $6 $7 ${8} ${9} ${10} ${11} ${12}"
echo "CALLED WITH $# PARAMETERS"
echo ""
echo "PATH=$PATH"
echo ""
echo "SCRIPT_NAME=$SCRIPT_NAME"
echo "SCRIPT_PATH=$SCRIPT_PATH"
echo "SCRIPT_PARAM=$SCRIPT_PARAM"
echo ""
echo "HTTP_USER_AGENT=$HTTP_USER_AGENT"
echo "HTTP_ACCEPT=$HTTP_ACCEPT"
echo "HTTP_ACCEPT_ENCODING=$HTTP_ACCEPT_ENCODING"
echo "HTTP_ACCEPT_LANGUAGE=$HTTP_ACCEPT_LANGUAGE"
echo "HTTP_AUTHORIZATION=$HTTP_AUTHORIZATION"
echo "HTTP_CONNECTION=$HTTP_CONNECTION"
echo "HTTP_COOKIE=$HTTP_COOKIE"
echo "HTTP_HOST=$HTTP_HOST"
echo "HTTP_REFERER=$HTTP_REFERER"
echo "HTTP_USER_AGENT=$HTTP_USER_AGENT"
echo ""
echo "REQUEST_METHOD=$REQUEST_METHOD"
echo ""
echo ""

echo "=========================== ENVIRONMENT ============================"
echo ""
/usr/bin/env | sort
echo ""
echo ""

echo "========================== PROCESS LIST ============================"
echo ""
ps -AFa
echo ""

/bin/cat << EOM
</PRE>
</SMALL>
<P>
</BODY>
</HTML>
EOM

exit 123
