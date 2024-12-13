# Makefile for passwordless-ssh-keys

# --------------------
# Vars

SHELL = /bin/bash
mBranch = passwordless-ssh-keys

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
