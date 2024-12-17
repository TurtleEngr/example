#!/usr/bin/perl
# Remove all tags and duplicate white space, but leave href links.
# Text before "--BEGIN TEXT--" and after "--END TEXT--" will removed.
# Now only the text content remains.

# Usage:
#     just-words.pl <FILE.html >FILE.txt

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
$content =~ s/.*_+BEGIN TEXT_+//;

# Remove all text after "--+END TEXT--+".
$content =~ s/_+END TEXT_+.*//;

# Replace multiple whitespace (including newlines) with a single space
$content =~ s/\s+/ /g;

# Remove leading and trailing whitespace
$content =~ s/^\s+|\s+$//g;

# Print the text only content
print "$content\n";
