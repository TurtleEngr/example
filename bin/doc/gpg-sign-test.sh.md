<div>
    <hr/>
</div>

# NAME gpg-sign-test.sh

Test the sshagent script.

# SYNOPSIS

    gpg-sign-test.sh -T all
    gpg-sign-test.sh -T list
    gpg-sign-test.sh [-h] [-H pStyle] [-T pTest]

# DESCRIPTION

This script is used to test gpg-sign.sh and 
See the Notes section
for how to set it up and the dependent scipts.

# OPTIONS

- **-h**

    Output this "long" usage help. See "-H long"

- **-H pStyle**

    pStyle is used to select the type of help and how it is formatted.

    Styles:

        short|usage - Output short usage help as text.
        long|text   - Output long usage help as text.
        man         - Output long usage help as a man page.
        html        - Output long usage help as html.
        md          - Output long usage help as markdown.

- **-T "pTest"**

    "**-T all**" will run all of the functions that begin with "test".

    "**-T list**" will list all of the test functions.

    Otherwise, **pTest** should be a space separated list of test function
    names, between the quotes.

# ENVIRONMENT

HOME, USER

# SEE ALSO

gpg-sign.sh, just-words.pl, gpg, shunit2.1, shellcheck

# NOTES

## Dependencies

- The latest versions of gpg-sign.sh, gpg-sign-test.sh, just-words.pl,
and shunit2.1 can be found at:

    [github TurtleEngr](https://github.com/TurtleEngr/my-utility-scripts/tree/main/bin)
    or at
    [github TurtleEngr](https://github.com/TurtleEngr/example/tree/photographic-evidence-is-dead/bin)

- For more details about shunit2 (shunit2.1) see
shunit2/shunit2-manual.html
[Source](https://github.com/kward/shunit2)

    shunit2.1 has a minor change to fix up colors when background is not
    black.

## Test Outline

- If ~/.cache/gpg-sign-test (with the test sample files) is not found
then it will be created by this script. Also a test gpg homedir and
test key will be created.

    To be sure everything is up-to-date with the tests, you can remove all
    of ~/.cache/gpg-sign-test so it will be rebuilt.

- Test just-words.pl

    Test gpg-sign.sh -c

        c-result-test-page.txt.sig

    Test gpg-sign.sh -s

        s-result-test-page.txt.sig

\+ bin/
  + gpg-sign.sh
  + gpg-sign-test.sh
\+ test/
  + test.pri
  + test.pub
  + test-page.html
  + test-page.txt

# AUTHOR

TurtleEngr

# HISTORY

$Revision: 1.13 $ $Date: 2024/11/22 20:28:18 $ GMT