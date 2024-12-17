# Makefile for photographic-evidence-is-dead code and sample files
# This Makefile is for managment of the repository.
# Users should cd to sample/ and use that Makefile to run things.

# --------------------
# Vars

SHELL = /bin/bash
mBranch = photographic-evidence-is-dead

mBinList = \
	bin/doc-fmt \
	bin/shunit2.1 \
	bin/gpg-sign.sh \
	bin/gpg-sign.sh \
	bin/just-words.pl \
	bin/org2html.sh

#	bin/gpg-sign-test.sh

# --------------------
# Main

clean :
	-find . -name '*~' -exec rm {} \;
	-find . -name 'pod2htmd.tmp' -exec rm {} \;

save ci : clean
	-git pull origin $(mBranch)
	-git ci -am Updated

publish release push : clean ci
	-git push origin $(mBranch)

# --------------------

diff-from-bin : $(mBinList)
	@for i in $(mBinList); do \
		diff -q $$i ~/$$i; \
	done

update-from-bin : $(mBinList)
	cd bin; doc-fmt $$(find * -prune -type f -executable)

# --------------------
# Rules

%.html : %.org
	org2html.sh $< $@

bin/% : ~/bin/%
	if diff -q $< $@; then \
		touch $@; \
	else \
		cp $< $@; \
	fi
