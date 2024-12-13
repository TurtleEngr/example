# Makefile for passwordless-ssh-keys

# --------------------
# Vars

SHELL = /bin/bash
mBranch = passwordless-ssh-keys

mBinList = \
	bin/doc-fmt \
	bin/shunit2.1 \
	bin/gpgagent \
	bin/gpgagent \
	bin/ssh-askpass \
	bin/sshagent \
	bin/sshagent-test

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
