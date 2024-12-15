#!/bin/bash
set -u

# --------------------
# Globals
export cgCurDir
export cgName=gpg-sign-test.sh
export cgTestDir=~/.cache/gpg-sign-test
export cgScript
export cgTestOpt
export cgTestPass
export gErr=0
export gpDebug=0
export gpTest=""

export cgEnvFile

# --------------------
# Var prefix key
#    cgVar - global constant
#    gVar  - global var
#    gpVar - global parameter. Usually a CLI option, or predefined
#    pVar  - a function parameter (local)
#    tVar  - a local variable

# --------------------
fUsageTest() {
    # Quick help, run this:
    # gpg-sign-test.sh -h

    local pStyle=$1
    local tProg=""

        case $pStyle in
        short | usage)
            tProg=pod2usage
            ;;
        long | text)
            tProg=pod2text
            ;;
        html)
            tProg="pod2html --title=$cName"
            ;;
        html)
            tProg=pod2html
            ;;
        md)
            tProg=pod2markdown
            ;;
        man)
            tProg=pod2man
            ;;
        *)
            tProg=pod2text
            ;;
    esac

    # Default to pod2text if tProg does not exist
    if ! which ${tProg%% *} >/dev/null; then
        tProg=pod2text
    fi
    cat $cgName | $tProg | more
    exit 1

    cat <<EOF
=pod

=for text ========================================

=for html <hr/>

=head1 NAME gpg-sign-test.sh

Test the sshagent script.

=head1 SYNOPSIS

    gpg-sign-test.sh -T all
    gpg-sign-test.sh -T list
    gpg-sign-test.sh [-h] [-H pStyle] [-T pTest]

=head1 DESCRIPTION

This script is used to test gpg-sign.sh and 
See the Notes section
for how to set it up and the dependent scipts.

=head1 OPTIONS

=over 4

=item B<-h>

Output this "long" usage help. See "-H long"

=item B<-H pStyle>

pStyle is used to select the type of help and how it is formatted.

Styles:

    short|usage - Output short usage help as text.
    long|text   - Output long usage help as text.
    man         - Output long usage help as a man page.
    html        - Output long usage help as html.
    md          - Output long usage help as markdown.

=item B<-T "pTest">

"B<-T all>" will run all of the functions that begin with "test".

"B<-T list>" will list all of the test functions.

Otherwise, B<pTest> should be a space separated list of test function
names, between the quotes.

=back

=for comment =head1 RETURN VALUE
=for comment =head1 ERRORS
=for comment =head1 EXAMPLES

=head1 ENVIRONMENT

HOME, USER

=head1 SEE ALSO

gpg-sign.sh, just-words.pl, gpg, shunit2.1, shellcheck

=head1 NOTES

=head2 Dependencies

=over 4

=item *

The latest versions of gpg-sign.sh, gpg-sign-test.sh, just-words.pl,
and shunit2.1 can be found at:

L<github TurtleEngr|https://github.com/TurtleEngr/my-utility-scripts/tree/main/bin>
or at
L<github TurtleEngr|https://github.com/TurtleEngr/example/tree/photographic-evidence-is-dead/bin>

=item *

For more details about shunit2 (shunit2.1) see
shunit2/shunit2-manual.html
L<Source|https://github.com/kward/shunit2>

shunit2.1 has a minor change to fix up colors when background is not
black.

=back

=head2 Test Outline

=over 4

=item *

If ~/.cache/gpg-sign-test (with the test sample files) is not found
then it will be created by this script. Also a test gpg homedir and
test key will be created.

To be sure everything is up-to-date with the tests, you can remove all
of ~/.cache/gpg-sign-test so it will be rebuilt.

=item *

Test just-words.pl

Test gpg-sign.sh -c

  c-result-test-page.txt.sig

Test gpg-sign.sh -s

  s-result-test-page.txt.sig

=back

+ bin/
  + gpg-sign.sh
  + gpg-sign-test.sh
+ test/
  + test.pri
  + test.pub
  + test-page.html
  + test-page.txt


=for comment =head1 CAVEATS
=for comment =head1 DIAGNOSTICS
=for comment =head1 BUGS
=for comment =head1 RESTRICTIONS

=head1 AUTHOR

TurtleEngr

=head1 HISTORY

$Revision: 1.13 $ $Date: 2024/11/22 20:28:18 $ GMT

=cut
EOF

} # fUsageTest

# --------------------
fCreateTestPage() {
    cat <<EOF >$cgTestDir/test-page.html
<html>
<body>
<p>Foo bar.</p>
</body>
</html>
EOF

    ./justwords.pl <$cgTestDir/test-page.html >$cgTestDir/test-page.txt
}

# --------------------
fCreateKey() {
    cat <<EOF >$cgTestDir/gnupg/test.pri
-----BEGIN PGP PRIVATE KEY BLOCK-----

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
t/PfoEtiNwVk1qOr1Ea8/S0Bj72PELMCQQ==
=PzAm
-----END PGP PRIVATE KEY BLOCK-----

EOF
    cat <<EOF >$cgTestDir/gnupg/test.pub
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
j72PELMCQQ==
=dQKf
-----END PGP PUBLIC KEY BLOCK-----
EOF

    gpg $cgTestOpt $cgTestPass --import $cgTestDir/gnupg/test.pri $cgTestDir/gnupg/test.pub

    if ! gpg --list-key test@example.com &>/dev/null; then
        echo "Error: test.pub key could not be defined. [$LINENO]"
        exit 1
    fi
    if ! gpg --list-secret-key test@example.com &>/dev/null; then
        echo "Error: test.pri key could not be defined. [$LINENO]"
        exit 1
    fi
}

# ========================================
# Tests

# --------------------------------
oneTimeSetUp() {
    # Unset gpTest to prevent infinite loop
    gpTest=''

    cgTestPass="--passphrase test"
    cgTestOpt="--batch --no-tty --yes --no-permission-warning --homedir $cgTestDir/gnupg"
    
    mkdir -p $cgTestDir/gnupg &>/dev/null
    chmod -R go= $cgTestDir
    fCreateTestPage
    fCreateKey

    chmod -R go= $cgTestDir

    return 0
} # oneTimeSetUp

# --------------------------------
oneTimeTearDown() {
    rm -rf $cgTestDir
    return 0
} # oneTearDown

# --------------------------------
setUp() {
    pkill -u $USER ssh-agent &>/dev/null
    gpDebug=0

    return 0
} # setUp

# --------------------------------
tearDown() {
    pkill -u $USER ssh-agent &>/dev/null
    rm ~/tmp/result.tmp &>/dev/null

    return 0
} # tearDown

# ========================================

testSetup() {
    assertTrue "[$LINENO]" "[ -f $cgEnvFile ]"
    assertTrue "[$LINENO]" "[ -f $cgTestDir/id.test1 ]"
    assertTrue "[$LINENO]" "[ -f $cgTestDir/id.test1.pub ]"
    assertTrue "[$LINENO]" "[ -f $cgTestDir/id.test2 ]"
    assertTrue "[$LINENO]" "[ -f $cgTestDir/id.test2.pub ]"
    assertFalse "[$LINENO]" "pgrep -u $USER ssh-agent"

    return 0
} # testSetup

# --------------------------------
testUsageOK() {
    local tResult

    tResult=$($cgScript -h 2>&1)
    assertContains "[$LINENO] $tResult" "$tResult" "DESCRIPTION"

    return 0
} # testUsageOK

# --------------------------------
testUsageError() {
    local tResult

    tResult=$($cgScript 2>&1)
    assertContains "[$LINENO] $tResult" "$tResult" "Error: No options were found"
    assertContains "[$LINENO] $tResult" "$tResult" "Usage:"

    gpDebug=1
    tResult=$(. $cgScript 2>&1)
    assertContains "[$LINENO] $tResult" "$tResult" "Error: No options were found"
    assertContains "[$LINENO] $tResult" "$tResult" "Usage:"
    gpDebug=0

    tResult=$($cgScript -U 2>&1)
    assertContains "[$LINENO] $tResult" "$tResult" "Error: Unknown option: -U"
    assertContains "[$LINENO] $tResult" "$tResult" "Usage:"

    gpDebug=1
    tResult=$(. $cgScript -U 2>&1)
    assertContains "[$LINENO] $tResult" "$tResult" "Error: Unknown option: -U"
    assertContains "[$LINENO] $tResult" "$tResult" "Usage:"
    gpDebug=0

    tResult=$($cgScript -s 2>&1)
    assertContains "[$LINENO] $tResult" "$tResult" "Error: sshagent is not 'sourced'"
    assertContains "[$LINENO] $tResult" "$tResult" "Usage:"

    return 0
} # testUsageError

testCreateOK() {
    local tResult

    assertTrue "[$LINENO]" "[ -f $cgTestDir/id.test1 ]"

    . $cgScript "$cgTestDir/id.test1" >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertTrue "[$LINENO]" "pgrep -u $USER ssh-agent"
    assertNotContains "[$LINENO] $tResult" "$tResult" "Error"
    assertContains "[$LINENO] $tResult" "$tResult" "id.test1 (RSA)"
    assertContains "[$LINENO] $tResult" "$tResult" "3072 SHA256"
    assertTrue "[$LINENO]" "[ -f $cgEnvFile ]"
    assertTrue "[$LINENO]" "grep -q '^SSH_AGENT_PID' $cgEnvFile"
    assertTrue "[$LINENO]" "grep -q '^SSH_AUTH_SOCK' $cgEnvFile"
    assertTrue "[$LINENO]" "[ -n \"$SSH_AGENT_PID\" ]"
    assertTrue "[$LINENO]" "[ -n \"$SSH_AUTH_SOCK\" ]"

    . $cgScript -s >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertContains "[$LINENO] $tResult" "$tResult" "id.test1 (RSA)"
    assertContains "[$LINENO] $tResult" "$tResult" "3072 SHA256"

    return 0
} # testCreateOK

testCreateError() {
    local tResult

    . $cgScript "$cgTestDir/id.xxx" >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertFalse "[$LINENO]" "pgrep -u $USER ssh-agent"
    assertContains "[$LINENO] $tResult" "$tResult" "Error: Not found: "

    return 0
} # testCreateError

testAddOK() {
    local tResult

    . $cgScript "$cgTestDir/id.test1" >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertTrue "[$LINENO]" "pgrep -u $USER ssh-agent"

    . $cgScript "$cgTestDir/id.test2" >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertContains "[$LINENO] $tResult" "$tResult" "Identity added: "
    assertContains "[$LINENO] $tResult" "$tResult" "id.test2 (RSA)"
    assertContains "[$LINENO] $tResult" "$tResult" "id.test1 (RSA)"
    assertNotContains "[$LINENO] $tResult" "$tResult" "Error"

    return 0
} # testAdd()

testCreateWarn() {
    local tResult

    ssh-keygen -t rsa -f $cgTestDir/id.test3 -N "" -C "id.test3" &>/dev/null
    assertTrue "[$LINENO]" "[ -f $cgTestDir/id.test3 ]"

    . $cgScript "$cgTestDir/id.test3" >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertTrue "[$LINENO]" "pgrep -u $USER ssh-agent"
    assertNotContains "[$LINENO] $tResult" "$tResult" "Error: Not found: "
    assertContains "[$LINENO] $tResult" "$tResult" " has no password"
    assertContains "[$LINENO] $tResult" "$tResult" "id.test3 (RSA)"

    return 0
} # testCreateError2

testError() {
    local tResult

    assertFalse "[$LINENO]" "pgrep -u $USER ssh-agent"

    . $cgScript -s >~/tmp/result.tmp 2>&1
    tResult=$(cat ~/tmp/result.tmp)
    assertContains "[$LINENO] $tResult" "$tResult" "Error: agent is not running"
    assertFalse "[$LINENO]" "pgrep -u $USER ssh-agent"

    return 0
}

testKill() {
    local tResult

    . $cgScript "$cgTestDir/id.test1" >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertTrue "[$LINENO]" "pgrep -u $USER ssh-agent"

    . $cgScript -k >~/tmp/result.tmp 2>&1 < <(echo foobar)
    tResult=$(cat ~/tmp/result.tmp)
    assertFalse "[$LINENO]" "pgrep -u $USER ssh-agent"
    assertContains "[$LINENO] $tResult" "$tResult" "Notice: Killing all of your ssh-agents"

    return 0
} # testKill

# -------------------
# This should be the last defined function
fRunTests() {
    if [ "$gpTest" = "list" ]; then
        grep 'test.*()' $0 | grep -v grep | sed 's/()//g'
        exit $?
    fi
    SHUNIT_COLOR=always
    if [ "$gpTest" = "all" ]; then
        gpTest=""
        # shellcheck disable=SC1091
        . shunit2.1
        exit $?
    fi
    # shellcheck disable=SC1091
    . shunit2.1 -- $gpTest

    exit $?
} # fRunTests

# ========================================
# Main

if [ $# -eq 0 ]; then
    echo "Error: Missing options. [$LINENO]"
    fUsageTest short
fi

while getopts :hH:T: tArg; do
    case $tArg in
        h) fUsageTest long ;;
        H) fUsageTest "$OPTARG" ;;
        T) gpTest="$OPTARG" ;;
        # Problem arguments
        :)
            echo "Error: Value required for option: -$OPTARG [$LINENO]"
            fUsageTest short
            ;;
        \?)
            echo "Error: Unknown option: $OPTARG [$LINENO]"
            fUsageTest short
            ;;
    esac
done
shift $((OPTIND - 1))
if [ $# -ne 0 ]; then
    echo "Unknown option: $OPTARG [$LINENO]"
    fUsageTest short
fi

# Set current directory location
if [ -z "$PWD" ]; then
    PWD=$(pwd)
fi
cgCurDir=$PWD

cgScript=$PWD/gpg-sign.sh
if [[ -x ${cgScript%/*} ]]; then
    echo "Error: You need to be cd'ed to bin/ where $cgScript is located. [$LINENO]"
    fUsageTest short
fi

# -------------------
if [ -n "$gpTest" ]; then
    fRunTests
fi

echo "Error: Missing options [$LINENO]"
fUsageTest short

exit 1
