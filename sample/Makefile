# First run: make requirements import-key
# Next: make build

# --------------------
# Macros

SHELL=/bin/bash
mTestDir = ~/tmp/gpg-sign-test
mGpgOpt = --batch --no-tty --yes --no-permission-warning --homedir $(mTestDir)
mGpgPass = --pinentry-mode loopback --passphrase test
mKey = test@example.com

mReqProg = \
	gpg \
	pandoc \
	perl \
	pod2html \
	pod2man \
	pod2markdown \
	pod2text \
	pod2usage \
	sed \
	tidy

# --------------------
build : clean $(mTestDir) import-keys sign-clear sign-detached unit-test

requirements :
	@for i in $(mReqProg); do \
		if ! which $$i &>/dev/null; then \
			echo "Missing $$i"; \
		fi; \
	done

clean :
	-find .. -name '*~' -exec rm {} \;

# --------------------
$(mTestDir) :
	mkdir -p $@
	chmod go= $@

# --------------------
import-keys : $(mTestDir) test.pri test.pub
	gpg $(mGpgOpt) $(mGpgPass) --import test.pri test.pub

# --------------------
sign-clear : sample-1.txt.sig
	@echo "$? has the signature embedded in the file."

sample-1.txt.sig : sample-1.txt
	gpg-sign.sh -c -k test@example.com -f $?

# --------------------
sign-detached : sample-2.txt.sig
	@echo "$? is the detached signature file."

sample-2.txt.sig : sample-2.txt
	gpg-sign.sh -s -k test@example.com -f $?

sample-2.txt : sample-2.html
	../bin/just-words.pl <$? >$@

sample-2.html : sample-2.org
	../bin/org2html.sh $? $@

# --------------------
unit-test :
	cd ../bin; ./gpg-sign-test.sh -T all

# --------------------
create-key : $(mTestDir)
	@echo "Create $(mKey) with this command. For the password used 'test'"
	@echo "gpg --homedir $(mTestDir) --full-generate-key"
	@echo "When done run: make export-key"

# --------------------
export-key : test.pri test.pub
	@echo "If you have other keys you can import them. See import-keys"

test.pri :
	gpg $(mGpgOpt) $(mGpgPass) --armor --export-secret-key  $(mKey) >$@

test.pub :
	gpg $(mGpgOpt) $(mGpgPass) --armor --export $(mKey) >$@

