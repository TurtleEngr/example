# General Makefile for managing example code.
# This should only be modified on the develop branch.
# See the template/Makefile for the other branches.

# --------------------
# Vars

SHELL = /bin/bash
mBranch = develop

# --------------------
# Main targets

clean :
	find . -name '*~' -exec rm {} \;

save ci :
	git pull origin $(mBranch)
	git ci -am Updated

publish release push :
	git push origin $(mBranch)

# --------------------
# Rules

%.html : %.org
	org2html.sh $< $@
