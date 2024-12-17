# NAME just-words.pl

Remove all tags and duplicate white space

# SYNOPSIS

    just-words.pl <FILE.html >FILE.txt

# DESCRIPTION

Remove all tags and duplicate white space, but leave href links.

Text before '--BEGIN TEXT--' will be ignored.

Text after '--END TEXT--' will be ignored.

# EXAMPLES

input.html file

&lt;html>
&lt;head>&lt;title>Test&lt;/title>&lt;/head>
&lt;body>
&lt;h1>Test&lt;/h1>
&lt;p>Not signed part.&lt;/p>
&lt;p>-----BEGIN TEXT-----&lt;/p>
Text body line 1.
Line 2
End.
&lt;p>-----END TEXT-----&lt;/p>
&lt;p>Not signed part.&lt;/p>
&lt;/body>
&lt;/html>

Create output.txt file from input.html file

    just-words.pl <input.html >output.txt

output.txt file
