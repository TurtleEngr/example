# NAME

gpgagent - setup the gpg and ssh agent process

# SYNOPSIS

    . gpgagent [-h] [-a] [-s] [-k] [key ...]

# DESCRIPTION

gpgagent is a wrapper for gpg-agent, ssh-add, and gpg.  Notice that
the script is "sourced" (.) so that the env. var. are defined.

If there are no option flags, any running agents owned by you (or the
$cgAgentOwner) are killed, and a new agent is started, adding any of
the keys passed.

For the best use of gpgagent, put your public keys in the
~/.ssh/authorized\_keys file on all the systems that you have login
access to.

If the directory /home/$cgAgentOwner/.gnupg is group or other read or
writable, gpgagent will exit with an error

# OPTIONS

- **-h**

    This help.

- **-a**

    Connect to the existing agent, and add the passed keys.

- **-s**

    Only set env. var. (don't run a new agent).  Fails if there is no
    .gpg-agent-info file.

- **-k**

    Kill all agents owned by you, and remove the .gpg-agent-info file.

- **key...**

    A list of key file names and/or gpg keys.  Keys with a '@' in them
    will be treated as gpg keys.  All other keys will be treated as ssh
    private key files.

# RETURN VALUE

# ERRORS

# EXAMPLES

In a profile script:

        . gpgagent ~/.ssh/id.home ~/.ssh/id.work

In a script run by the 'root' user:

        export $cgAgentOwner=george
        . gpgagent -s

You ran gpgagent manually to create an agent, but you forgot to
"source" the script so that the SSH\_\* env. are set.  Fix this by just
running gpgagent with the -s option:

        . gpgagent -s

Add another ssh key to a running agent:

        gpgagent -a ~/.ssh/id_foo_dsa

Add another gpg key to a running agent:

        gpgagent -a joe@yahoo.com

List agent and added keys:

        ssh-add -l

Kill all agents:

        gpgagent -k

# ENVIRONMENT

    $cgAgentOwner - user name.  Set to $LOGNAME if empty.

    $GPG_AGENT_INFO - set by gpgagent
    $SSH_AUTH_SOCK - set by gpgagent
    $SSH_AGENT_PID - set by gpgagent

# FILES

    /home/$cgAgentOwner/.gnupg/.gpg-agent-info
    $HOME/.gnupg/gpg-agent.conf

# SEE ALSO

    gpg-agent, gpg, ssh-add, pinentry-qt

# NOTES

Because this script is usually sourced, exits and functions are not
used.  So that is why the "if" logic in this script is so messy with
the pExit flag.

# CAVEATS

# DIAGNOSTICS

# BUGS

# RESTRICTIONS

gpgagent only works well with bash.

# AUTHOR

# HISTORY

(c) Copyright 2009 by TrustedID

$Revision: 1.5 $ GMT
