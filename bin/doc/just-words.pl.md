# NAME just-words.pl

Remove all tags and duplicate white space

# SYNOPSIS

    just-words.pl <FILE.html >FILE.txt

# DESCRIPTION

Remove all tags and duplicate white space, but leave href links.

Text before '--BEGIN TEXT--' will be ignored.

Text after '--END TEXT--' will be ignored.

# EXAMPLES

input.html file:

       <html>
       <head><title>Test</title></head>
       <body>
       <h1>Test</h1>
       <p>Not signed part.</p>
       <p>-----BEGIN TEXT-----</p>
       <p>Text body line 1.</p>
       <p>Line 2</p>
       <p><a href="https://github.com/TurtleEngr/example/blob/photographic-evidence-is-dead/bin/just-words.pl">
       just-words.pl</a></p>
       <p>-----END TEXT-----</p>
       <p>Not signed part.</p>
       </body>
       </html>
    

Create output.txt file from input.html file:

    just-words.pl <input.html >output.txt

output.txt file:

    Text body line 1. Line 2 End. https://github.com/TurtleEngr/example/blob/photographic-evidence-is-dead/bin/just-words.pl just-words.pl
