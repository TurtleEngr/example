#!/bin/bash
set -u

# Var prefix key
#    cgVar - global constant
#    gVar  - global var
#    gpVar - global parameter. Usually a CLI option, or predefined
#    pVar  - a function parameter (local)
#    tVar  - a local variable

# Globals
export cgCurDir
export cgName
export cgScript
export cgTestDir
export cgTmp
export cgEnvFile
export gErr=0
export gpDebug=0
export gpTest=""

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

ssh-agent, ssh, ssh-askpass, shunit2.1, shellcheck

=head1 NOTES

=head2 Dependencies

=over 4

=item The latest versions of gpg-sign.sh, gpg-sign-test.sh, just-words.pl,
and shunit2.1 can be found at:
L<github TurtleEngr|https://github.com/TurtleEngr/my-utility-scripts/tree/main/bin>
or at
L<github TurtleEngr|https://github.com/TurtleEngr/example/tree/photographic-evidence-is-dead/bin>

=item For more details about shunit2 (shunit2.1)
see shunit2/shunit2-manual.html
L<Source|https://github.com/kward/shunit2>

shunit2.1 has a minor change to fix up colors when background is not
black.

=back

=head2 Test Outline

=over 4

=item If bin/test/ (with the test sample files) is not found

then bin/test/ will be created by this script. Also a test gpg homedir
and test key will be created.

To be sure everything is up-to-date with the tests, you can remove all
of bin/test so it will be rebuilt.

=back

+ one-time test setup
  + if test key is not found
    + --import test.pri test.pub
    + verify import
  + export cTestOpt="--batch --no-tty --yes --passphrase test --no-permission-warning --homedir $cgCurDir/test"

+ bin/
  + gpg-sign.sh
  + gpg-sign-test.sh
  + just-words.pl
+ test/
  + test.pri
  + test.pub
  + test-page.html
  + test-page.txt
  + c-result-test-page.txt.sig
  + s-result-test-page.txt.sig


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
fSetLoc() {
    local tLoc

    return
} # fSetLoc

fCreate() {
???
}

# ========================================
# Tests

# --------------------------------
oneTimeSetUp() {
    # Unset gpTest to prevent infinite loop
    gpTest=''

    pkill -u $USER ssh-agent &>/dev/null

    mkdir -p $cgTestDir &>/dev/null
    chmod go= $cgTestDir

    rm $cgTestDir/id.test* &>/dev/null
    ssh-keygen -t rsa -f $cgTestDir/id.test1 -N foobar -C "id.test1" &>/dev/null
    ssh-keygen -t rsa -f $cgTestDir/id.test2 -N foobar -C "id.test2" &>/dev/null

    cgEnvFile=$cgTestDir/sshagent.env
    touch $cgEnvFile
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

cgName=gpg-sign-test.sh

if [ $# -eq 0 ]; then
    echo "Error: Missing options. [$LINENO]"
    fUsageTest short
fi

# Set current directory location
if [ -z "$PWD" ]; then
    PWD=$(pwd)
fi
cgCurDir=$PWD
if [[ -x gpg-sign.sh ]]; then
    echo "Error: You need to be cd'ed bin/ where gpg-sign.sh is located."
    exit 1
fi

cgTestDir=~/.cache/gpg-sign-test
if [ ! -d $cgTmp ]; then
    mkdir -p $cgTestDir
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

# -------------------
if [ -n "$gpTest" ]; then
    fRunTests
fi

echo "Error: Missing options [$LINENO]"
fUsageTest short

exit 1
