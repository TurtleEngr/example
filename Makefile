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

save ci : clean
	git pull origin $(mBranch)
	git ci -am Updated

publish release push : save
	git push origin $(mBranch)

# --------------------

update-from-bin : $(mBinList)
	cd bin; doc-fmt $$(find * -prune -type f -executable)

force-update :
	for i in $(mBinList); do \
		cp -a ~/bin/$$(basename $$i) $$i; \
	done
	cd bin; doc-fmt $$(find * -prune -type f -executable)

# --------------------
# Rules

%.html : %.org
	org2html.sh $< $@

bin/% : ~/bin/%
	cp -a $< $@
