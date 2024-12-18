# Makefile for clean-code

# --------------------
# Vars

SHELL = /bin/bash
mBranch = clean-code

mBinList = \
	bin/doc-fmt \
	bin/shunit2.1

mGsUnitList = gsunit.js

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

update : update-bin update-sample

update-bin : $(mBinList)
	cd bin; doc-fmt $$(find * -prune -type f -executable)

update-sample :
	rsync -Ca ~/ver/public/app/gsunit-test/src/* sample/
	cd sample; rm -rf authorize Makefile gsunit.js
	rsync ~/ver/public/app/gsunit-test/github/gsunit.js sample/

# ~/ver/public/app/gsunit-test/src/
# From: https://moria.whyayh.com/cgi-bin/cvsweb-public/app/gsunit-test/src

# ~/ver/public/app/gsunit-test/github/
# From: git@github.com:TurtleEngr/gsunit-test.git

# --------------------
# Rules

%.html : %.org
	org2html.sh $< $@

bin/% : ~/bin/%
	cp $< $@
