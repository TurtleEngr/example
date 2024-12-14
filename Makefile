# Makefile for photographic-evidence-is-dead

# --------------------
# Vars

SHELL = /bin/bash
mBranch = photographic-evidence-is-dead

mBinList = \
	bin/doc-fmt \
	bin/shunit2.1 \
	bin/gpg-sign.sh \
	bin/gpg-sign.sh \
	bin/just-words.pl

#	bin/gpg-sign-test.sh

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

update-from-bin : $(mBinList)
	cd bin; doc-fmt $$(find * -prune -type f -executable)

# --------------------
# Rules

%.html : %.org
	org2html.sh $< $@

bin/% : ~/bin/%
	cp $< $@
