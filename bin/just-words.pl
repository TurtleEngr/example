#!/usr/bin/perl

=pod

=head1 NAME just-words.pl

Remove all tags and duplicate white space

=head1 SYNOPSIS

    just-words.pl <FILE.html >FILE.txt

=head1 DESCRIPTION

Remove all tags and duplicate white space, but leave href links.

Text before '--BEGIN TEXT--' will be ignored.

Text after '--END TEXT--' will be ignored.

=for comment =head1 OPTIONS
=for comment =head1 RETURN VALUE
=for comment =head1 ERRORS

=head1 EXAMPLES

input.html file

<html>
<head><title>Test</title></head>
<body>
<h1>Test</h1>
<p>Not signed part.</p>
<p>-----BEGIN TEXT-----</p>
Text body line 1.
Line 2
End.
<p>-----END TEXT-----</p>
<p>Not signed part.</p>
</body>
</html>
 
Create output.txt file from input.html file

    just-words.pl <input.html >output.txt

output.txt file


=for comment =head1 ENVIRONMENT
=for comment =head1 FILES
=for comment =head1 SEE ALSO
=for comment =head1 NOTES
=for comment =head1 CAVEATS
=for comment =head1 DIAGNOSTICS
=for comment =head1 BUGS
=for comment =head1 RESTRICTIONS
=for comment =head1 AUTHOR
=for comment =head1 HISTORY

=cut

use strict;
use warnings;

# Read input as a single string
my $content = join('', <>);

# Replace multiple whitespace (including newlines) with a single space
$content =~ s/\s+/ /g;

# Remove leading and trailing whitespace from all lines
$content =~ s/^\s+|\s+$//g;

# Replace <a> tags with their href links inline
$content =~ s/<a\s+[^>]*href\s*=\s*["']([^"'>]+)["'][^>]*>([^<]*)<\/a>/$1 $2/ig;

# Remove all remaining HTML tags, leaving only the text
$content =~ s/<[^>]+>//g;

# Remove all text before "-+BEGIN TEXT--+".
$content =~ s/.*-+BEGIN TEXT-+//;

# Remove all text after "--+END TEXT--+".
$content =~ s/-+END TEXT-+.*//;

# Replace multiple whitespace (including newlines) with a single space
$content =~ s/\s+/ /g;

# Remove leading and trailing whitespace
$content =~ s/^\s+|\s+$//g;

# Print the text only content
print "$content\n";
