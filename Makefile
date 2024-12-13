# Makefile for clean-code

# --------------------
# Vars

SHELL = /bin/bash
mBranch = clean-code

mBinList = \
	bin/doc-fmt \
	bin/shunit2.1

# --------------------
# Main targets

clean :
	-find . -name '*~' -exec rm {} \;
	-find . -name 'pod2htmd.tmp' -exec rm {} \;

save ci : clean
	git pull origin $(mBranch)
	git ci -am Updated

publish release push : save
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
