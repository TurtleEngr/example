#!/bin/bash
# $Id: sshagent-test,v 1.13 2024/11/22 20:28:18 bruce Exp $
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
    # SCRIPTNAME -h

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

=head1 NAME sshagent-test

Test the sshagent script.

=head1 SYNOPSIS

    sshagent-test -T all
    sshagent-test -T list
    sshagent-test [-h] [-H pStyle] [-T pTest]

=head1 DESCRIPTION

This script is used to test the sshagent script. See the Notes section
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

=over 4

=item *

For more details about shunit2 (or shunit2.1), see
shunit2/shunit2-manual.html L<Source|https://github.com/kward/shunit2>

shunit2.1 has a minor change to fix up colors when background is not black.

=item *

The latest versions of sshagent, sshagent-test, and shunit2.1 can be
found at:
L<github TurtleEngr|https://github.com/TurtleEngr/my-utility-scripts/tree/main/bin>

=item *

sshagent-test will kill all of your running ssh-agent processes before
and after running.

=item *

sshagent-test requires a non X11 /bin/ssh-askpass

Create this substitute:

    cat <<EOF >~/bin/ssh-askpass
    #!/bin/bash
    read -t 5 -p "ssh password? "
    echo $REPLY
    EOF
    chmod a+rx,go-w ~/bin/ssh-askpass

You can replace the system's ssh-askpass, or you can change your path
so it finds ssh-askpass in your bin dir.

=over 4

=item 1. Replace the system's ssh-askpass. As root:

   sudo -s
   mv -i /usr/bin/ssh-askpass /usr/bin/ssh-askpass.sav
   cp /home/$SUDO_USER/bin/ssh-askpass /usr/bin
   chmod a+rx,go-w /usr/bin/ssh-askpass
   exit

=item 2. Change your path so ~/bin is look in first:

   ed ~/.bash_profile
   PATH=$HOME/bin:$PATH

If you still get the ssh-askass popup, you'll need to use option 1, or
you can give the test key's password 'foobar' at every prompt.

=back

=back

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

    if [ -f ./sshagent ]; then
        echo "$PWD/sshagent"
        return
    fi

    tLoc=$(which sshagent)
    if [ -z "$tLoc" ]; then
        echo "Error: could not find sshagent" 1>&2
        exit 1
    fi
    if [ ! -x $tLoc ]; then
        echo "Error: could not find sshagent" 1>&2
        exit 1
    fi

    echo $tLoc
    return
} # fSetLoc

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

cgName=sshagent-test

# Set current directory location in PWD and cgCurDir, because with cron
# jobs PWD is not set.
if [ -z "$PWD" ]; then
    PWD=$(pwd)
fi
cgCurDir=$PWD

# This is the location of sshagent script
cgScript=$(fSetLoc)

cgTmp=~/tmp
if [ ! -d $cgTmp ]; then
    mkdir -p $cgTmp
fi
cgTestDir=$cgTmp/ssh

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

# -------------------
if [ -n "$gpTest" ]; then
    fRunTests
fi

echo "Error: Missing options [$LINENO]"
fUsageTest short

exit 1
