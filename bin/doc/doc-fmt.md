<div>
    <hr/>
</div>

# NAME doc-fmt

    doc-fmt outputs a script's documentaion to doc/

# SYNOPSIS

    doc-fmt [-h] [-H pStyle] [-T pTest] pScript...

# DESCRIPTION

Output each pScript's documentation to doc/ directory. If the pScript
file is older than doc/pScript.txt, then nothing is output.

If a pScript contains '=pod', then output: doc/pScript.man,
doc/pScript.txt, doc/pScript.html, and doc/pScript.md

If a pScript contains '=internal-pod', then output:
doc/pScript.int.txt, doc/pScript.int.html, and doc/pScript.int.md

If a pScript does not contain '=pod', then execute:

    ./pScript -h >doc/pScript.txt

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

    Run the unit test functions in this script.

    "**-T all**" will run all of the functions that begin with "test".

    "**-T list**" will list all of the test functions.

    Otherwise, "**pTest**" should match the test function names separated
    with spaces (between quotes).

    For more help, see template.sh

# SEE ALSO

shunit2.1
bash-com.inc

# DIAGNOSTICS

To verify the script is internally OK, run: doc-fmt -T all

# HISTORY

GPLv3 (c) Copyright 2023

$Revision: 1.7 $ $Date: 2024/11/09 20:12:18 $ GMT
