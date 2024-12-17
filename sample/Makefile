
SHELL=/bin/bash

# --------------------
build : clean sample-1.txt.sig sample-2.txt.sig

clean :
	-rm *~

sample-1.txt.sig : sample-1.txt
	gpg-sign.sh -c -k test@example.com -f $?

sample-2.txt.sig : sample-2.txt
	gpg-sign.sh -s -k test@example.com -f $?

# --------------------

sample-2.txt : sample-2.html
	../bin/just-words.pl <$? >$@

sample-2.html : sample-2.org
	../bin/org2html.sh $? $@

