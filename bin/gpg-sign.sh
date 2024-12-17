#!/usr/bin/env bash
set -u

export cName=gpg-sign.sh
export cBin
export cgGpgOpt=${cgGpgOpt:-""}
export gpSign=0
export gpKey=""
export gpFile=""

# ========================================
# Functions

# --------------------------------
fUsage() {
    local pStyle="$1"
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
    cat $cBin/$cName | $tProg | less
    exit 1
    
    cat <<\EOF >/dev/null
=pod

=for text ========================================

=for html <hr/>

=head1 NAME gpg-sign.sh

Sign or verify a file's signature with gpg keys.

=head1 SYNOPSIS

    gpg-sign.sh -f FILE [-s] [-c] [-k KEY] [-h] [-H pStyle]

=head1 DESCRIPTION

With the -s or -c option, sign the FILE, with the -k KEY, and output
signature or signed file to FILE.sig. The private KEY needs to be in
youru gnupg keychain file.

If no -s or -c option, verify FILE, with the signature file FILE.sig.
The public KEY needs to be in your gnupg keychain file.

=head1 OPTIONS

=over 4

=item B<-f FILE>

File to be signed or verified.

If the -c option was used, the FILE can be FILE.sig.

=item B<-s>

Sign the FILE with KEY, and output FILE.sig.

-k KEY is required.

=item B<-c>

Sign the FILE with KEY, and output FILE.sig which is a copy of the
file with the signature wrapped around the file.

-k KEY is required.

=item B<-k KEY>

The private KEY for signing. This is required for the -s or -c options.

The private KEY needs to be in your gnupg keychain file.

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

=back

=for comment =head2 Globals

=for comment =head1 RETURN VALUE

=for comment =head1 ERRORS

=head1 EXAMPLES

=head2 Separate signature file

  $ gpg-sign.sh -s -k example@gmail.com -f example.txt
    gpg --default-key example@gmail.com --detach-sign --armor -o example.txt.sig example.txt
    gpg: using "example@gmail.com" as default secret key for signing
    File 'example.txt.sig' exists. Overwrite? (y/N) y
    Signature file: example.txt.sig

Keep the example.txt.sig with the example.txt file. This form will
work for binary files.

  $ gpg-sign.sh -f example.txt
    gpg --verify example.txt.sig example.txt
    gpg: Signature made Thu 12 Dec 2024 09:14:08 PM PST
    gpg:                using RSA key 62AAFB8F3F51623373AD4E1F17DF4FFFFF8E92
    gpg:                issuer "example@gmail.com"
    gpg: Good signature from "First Last (personal) <example@gmail.com>" [ultimate]

The file matches what was signed.

  $ gpg-sign.sh -f example.txt
    gpg --verify example.txt.sig example.txt
    gpg: Signature made Thu 12 Dec 2024 09:24:15 PM PST
    gpg:                using RSA key 62AAFB8F3F51623373AD4E1F17DF4FFFFF8E92
    gpg:                issuer "example@gmail.com"
    gpg: BAD signature from "First Last (personal) <example@gmail.com>" [ultimate]

This is what you'll see if the file does not match what was signed.

=head2 Append signature to file

  $ gpg-sign.sh -c -k example@gmail.com -f example.txt
    gpg --default-key example@gmail.com --clear-sign -o example.txt.sig example.txt
    gpg: using "example@gmail.com" as default secret key for signing
    File 'example.txt.sig' exists. Overwrite? (y/N) y
    Signed file: example.txt.sig

The example.txt.sig contains all of example.txt and the signature is
added to the end. Text can be added before and after the signed sections
of the file.

Text can be put before the line:

    -----BEGIN PGP

And text can be put after the line:

    -----END PGP

The signature is only valid for the text between those lines.

  $ gpg-sign.sh -f example.txt.sig 
    gpg --decrypt example.txt.sig
    File 'example.txt' exists. Overwrite? (y/N) y
    gpg: Signature made Thu 12 Dec 2024 09:12:44 PM PST
    gpg:                using RSA key 62AAFB8F3F51623373AD4E1F17DF4FFFFF8E92
    gpg:                issuer "example@gmail.com"
    gpg: Good signature from "First Last (personal) <example@gmail.com>" [ultimate]

The file matches the signature at the end of the file. And example.txt
is created without the signature in the file.

=head1 ENVIRONMENT

cgGpgOpt

This varible defines more gpg options. It is mainly used by
gpg-sign-test.sh so it can be run with not prompts.

=for comment =head1 FILES

=head1 SEE ALSO

gpg

=for comment =head1 NOTES

=for comment =head1 CAVEATS

=for comment =head1 DIAGNOSTICS

=for comment =head1 BUGS

=for comment =head1 RESTRICTIONS

=for comment =head1 AUTHOR

=head1 HISTORY

GPLv2 (c) Copyright

$Revision: 1.2 $ $Date: 2024/12/17 05:23:41 $ GMT

=cut
EOF
    exit 1
} # fUsage

# ========================================
# Main

export cName=gpg-sign.sh
export cBin=${0%/*}
if [[ "$cBin" = "." ]]; then
    cBin=$PWD
fi
cd $cBin >/dev/null 2>&1
cBin=$PWD
cd - >/dev/null 2>&1

# --------------------
# Get options

if [ $# -lt 0 ]; then
    fUsage usage
fi

gpSign=0
gpKey=""
gpFile=""
while getopts :sck:f:hH: tArg; do
    case $tArg in
        # Script arguments
        s) gpSign=1 ;;
        c) gpSign=2 ;;
        k) gpKey=$OPTARG ;;
        f) gpFile=$OPTARG ;;
        # Common arguments
        h) fUsage long ;;
        H) fUsage $OPTARG ;;
        # Problem arguments
        :) echo "Error: Value required for option: -$OPTARG [$LINENO]"
           fUsage usage
        ;;
        \?) echo "Error: Unknown option: -$OPTARG [$LINENO]"
            fUsage usage
        ;;
    esac
done
((--OPTIND))
shift $OPTIND
if [ $# -ne 0 ]; then
    echo "Error: Unknown option: $* [$LINENO]"
    fUsage usage
fi

if [[ -z $gpFile ]]; then
    echo "Error: -f FILE option is required [$LINENO]"
    fUsage usage
fi
if [[ ! -r $gpFile ]]; then
    echo "Error: Cannot find or read: $gpFile [$LINENO]"
    fUsage usage
fi

tSig=${gpFile}.sig

# Signing checks
if [[ $gpSign -ne 0 ]]; then
    if [[ -z $gpKey ]]; then
        echo "Error: -k KEY option is required [$LINENO]"
        fUsage usage
    fi
    if [[ ! -w . ]]; then
        echo "Error: Cannot write to current directory [$LINENO]"
        fUsage usage
    fi
    if ! gpg $cgGpgOpt --list-secret-key $gpKey &>/dev/null; then
        echo "Error: $gpKey private key was not found, or passphrase was bad. [$LINENO]"
        exit 1
    fi
fi

# Verify checks
if [[ $gpSign -eq 0 ]]; then
    if [[ "${gpFile}" = "${gpFile%.sig}" ]]; then
        tVerify=1
        if [[ ! -r $tSig ]]; then
            echo "Error: Cannot verify. Missing signature file: $tSig [$LINENO]"
            fUsage usage
        fi
    else
        tVerify=2
    fi
fi

# --------------------
# Functional section

if [[ $gpSign -eq 1 ]]; then
    echo "gpg $cgGpgOpt --default-key $gpKey --detach-sign --armor -o $tSig $gpFile"
    gpg $cgGpgOpt --default-key $gpKey --detach-sign --armor -o $tSig $gpFile
    echo "Signature file: $tSig"
    exit
fi

if [[ $gpSign -eq 2 ]]; then
    echo "gpg $cgGpgOpt --default-key $gpKey --clear-sign -o $tSig $gpFile"
    gpg $cgGpgOpt --default-key $gpKey --clear-sign -o $tSig $gpFile
    echo "Signed file: $tSig"
    exit
fi

if [[ $tVerify -eq 1 ]]; then
    echo "gpg $cgGpgOpt --verify $tSig $gpFile"
    if ! gpg $cgGpgOpt --verify $tSig $gpFile; then
        echo "Do you have the public key for the signing user? [$LINENO]"
    fi
    exit
fi

if [[ $tVerify -eq 2 ]]; then
    echo "gpg $cgGpgOpt $gpFile"
    if ! gpg $cgGpgOpt $gpFile; then
        echo "Do you have the public key for the signing user? [$LINENO]"
    exit
fi
