# Makefile for photographic-evidence-is-dead

# --------------------
# Vars

SHELL = /bin/bash
mBranch = photographic-evidence-is-dead

# --------------------
# Main targets

clean :
	-find . -name '*~' -exec rm {} \;
	-find . -name 'pod2htmd.tmp' -exec rm {} \;

save ci :
	git pull origin $(mBranch)
	git ci -am Updated

publish release push :
	git push origin $(mBranch)

# --------------------
# Rules

%.html : %.org
	org2html.sh $< $@
