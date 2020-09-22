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

echo "====================== File content of $SCRIPT_PARAM ========================="
echo ""
cat $SCRIPT_PARAM

/bin/cat << EOM
</PRE>
</SMALL>
<P>
</BODY>
</HTML>
EOM

exit 0
