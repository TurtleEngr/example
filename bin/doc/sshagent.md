# NAME

sshagent - setup the ssh agent process

# SYNOPSIS

    . sshagent [-h] [-s] [-k] [-x] [pKey ...]

    cgAgentOwner - user name. Default: $USER

    For online help page, go to:
    https://github.com/TurtleEngr/my-utility-scripts/blob/develop/doc/sshagent.md

# DESCRIPTION

Using ssh-agent is a lot more secure than using a passwordless ssh
key. If you use passwordless keys, you are following a very bad
pattern, which could lead to large security issues.

This sshagent script is a wrapper for ssh-agent and ssh-add to make it
easier to setup and use a ssh-agent. It only starts an agent process
if one isn't already running, and it saves the PID env. var. values
for use by scripts.

See the EXAMPLES section for how to use this script.

If an agent is found, then the env. var. are set, the pKeys are added,
then listed.  If an agent is not found, all other agents are killed,
and a new agent is initialized, the pKeys are added, and the
env. var. are set.

If -s is used (no pKeys) and an agent is running, then env. vars. are
set to use the agent. If an agent is not running, then the agent
related env. vars. are unset. -s is commonly used in cron job scripts.

If -k is used (no pKeys), then all ssh-agent will be killed.

If cgAgentOwner env. is set, then that will be used instead of $USER,
to find the sshagent.env file.  This is only useful for scripts that
are run with the "root" user. This is only useful with the -s option,
after agent is started as a regular user.

If root user and cgAgentOwner is not set, cgAgentOwner will be set
to SUDO\_USER if SUDO\_USER is defined.

If any Errors messages are output, that means the script has done
nothing. Correct the error and try again.

# OPTIONS

- **-h**

    Output full help.

- **-s**

    Set env. var. to use an already running agent, and list the keys.
    If an agent is not running an Error message will be output.

- **-k**

    Kill all agents owned by the current cgAgentOwner, i.e. $USER.

- **-x**

    Increment gpDebug level. Default: 0

- **pKey ...**

    Start a new ssh-agent if one is not running. Add one or more keys to
    the agent.

    If a pKey is not found, the script will try prepending the key with
    "$HOME/.ssh/". If that is not found, the script will stop with an
    error.

# ERRORS

## Env and option Errors

    Error: sshagent is not 'sourced' [LINENO]
    Error: No options were found [LINENO]"
    Error: Unknown option: OPTARG [LINENO]
    Error: Missing USER env. var. [LINENO]
    Error: Missing HOME env. var. [LINENO]
    Error: Missing program: PROG [LINENO]

## Directory Errors

    Error: HOME dir is not writable [LINENO]

This could be caused by cgAgentOwner being set to an unknown user.

    Error: $cgEnvDir is not writable or is missing [LINENO]

This could be caused by cgAgentOwner being set to a user that has no
~/.ssh/ dir.

    Error: with chown [LINENO]"
    Error: with chmod [LINENO]"

The attempt to change the owner and permissions on the cgEnvDir
failed. The dir and files should ONLY have "user" read/write
permissions.

    Error: Not found: KEY [LINENO]"

A KEY was not found, even after prepending with "$HOME/.ssh/"

## -s Errors

    Error: agent is not running [LINENO]"
    Error: not found: $cgEnvFile [LINENO]"

## Key add errors or warnings

    Error: cgAgentOwner override cannot be used to add keys [LINENO]
    Warning: KEY has no password!!! [LINENO]"

# EXAMPLES

For these examples the private keys are located in ~/.ssh/.  For
better security put your private keys on a USB drive which would only
be mounted when you add a key to your ssh-agent.

- The first time you login to your computer, run sshagent to authenticate
your ssh keys for the agent. Or put this in your profile. That way
You will only need to do this when the computer started or rebooted.

        if ! pgrep ssh-agent &>/dev/null; then
            . sshagent ~/.ssh/id.home ~/.ssh/id.work
        else
            . sshagent -s
        fi

- You ran sshagent to create an agent, but you forgot to "source" the
script so that the SSH\_\* env. are not set.  Just run '. sshagent -s'
- In a profile script add this line. That way when you start a new
terminal it will use any keys from the agent. This can also be
put in a script if it needs the keys saved on the agent.

        . sshagent -s

- In a script run by the 'root' user:

        export $cgAgentOwner=george
        . sshagent -s

    If you used sudo to change to root user, cgAgentOwner will be set to
    $SUDO\_USER

- Add another key to a running agent:

        . sshagent ~/.ssh/id_foo_rsa

- Kill all your agents. This would be a good practice if you don't want
your keys "active" on the computer.

        . sshagent -k

# ENVIRONMENT

    cgAgentOwner - user name. Default: $USER
    cgEnvFile - sshagent env. file. Default: /home/$USER/.ssh/.sshagent.env
    gpDebug - set to debug level (use before getops -x option)
    SSH_AGENT_PID - set by ssh-agent
    SSH_AUTH_SOCK - set by ssh-agent
    HOME - set by OS. The usual default: /home/$USER
    USER - set by OS

# FILES

    /home/$cgAgentOwner/.ssh/.sshagent.env

# SEE ALSO

    ssh-agent, ssh-add, sshagent-test, ssh-askpass, shunit2.1

# NOTES

## Security

- **DO NOT USE PASSWORDLESS KEYS for ssh or gpg!** The ONLY exception
might be for a production server that might be rebooted when no one
would be around to authenticate the keys. If you do use passwordless
keys, then make sure the keys are ONLY used on production, the
permissions prevent copying the keys, and the keys are
"managed". I.e. the keys are not in any non-production user's account,
AND they are regularly rotated. Of course, with passwordless keys
there is no need for ssh-agent.
- If the account of the root user or the owner of the ssh-agent is
"cracked", then all of the keys on the agent will be compromised.
- Tip: if ssh keys are "shared", each user should change the password,
on their copy of the key, to one that only they know.

## Help Text Format

You can output this help text in different formats, if you have these
other pod programs. For example:

    pod2html --title="sshagent" sshagent >sshagent.html
    pod2markdown sshagent >sshagent.md
    pod2man sshagent >sshagent.man
    pod2pdf --margins=36 --outlines sshagent >sshagent.pdf

## Test Driven Development

For TDD you can find the latest versions of sshagent and sshagent-test
at:
[github](https://github.com/TurtleEngr/my-utility-scripts/tree/main/bin)

# CAVEATS

- There could be conflicts with an ssh-agent that started by an X11
session manager. This script is designed to work on headless services
or workstations, _across sessions._ So if an ssh-agent process
already exists, before using this script, you'll need to track down
where it is being started, and prevent it from starting. For example,
on my Linux laptop I removed "use-ssh-agent" from file
/etc/X11/Xsession.options
- The $cgAgentOwner option for using another user's agent will only work
for the root user, because ssh will only work if the ~/.ssh/ directory
is only readable by its owner. If non-root users need to share the
ssh-agent, then put put the .sshagent.env in a location that only
those users can read, using "group" permissions. See the cgEnvFile
variable.
- The weird coding style of using functions, gErr, and returns, is done
to avoid using "exit," which would exit the active process (i.e. the
terminal or a calling script).

# BUGS

When ssh-agent is active it will send each of the keys to a ssh
command, until one works. This could cause problems. For example what
if you have a rate limit of only 3 login attempts over a one minute
period.  If the "correct" key is not one of the first 3 on the agent,
then ssh will always fail.

# RESTRICTIONS

sshagent only works well with bash.

# AUTHOR

TurtleEngr

# HISTORY

$Revision: 1.91 $
