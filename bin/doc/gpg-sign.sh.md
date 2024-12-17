<div>
    <hr/>
</div>

# NAME gpg-sign.sh

Sign or verify a file's signature with gpg keys.

# SYNOPSIS

    gpg-sign.sh -f FILE [-s] [-c] [-k KEY] [-h] [-H pStyle]

# DESCRIPTION

With the -s or -c option, sign the FILE, with the -k KEY, and output
signature or signed file to FILE.sig. The private KEY needs to be in
youru gnupg keychain file.

If no -s or -c option, verify FILE, with the signature file FILE.sig.
The public KEY needs to be in your gnupg keychain file.

# OPTIONS

- **-f FILE**

    File to be signed or verified.

    If the -c option was used, the FILE can be FILE.sig.

- **-s**

    Sign the FILE with KEY, and output FILE.sig.

    \-k KEY is required.

- **-c**

    Sign the FILE with KEY, and output FILE.sig which is a copy of the
    file with the signature wrapped around the file.

    \-k KEY is required.

- **-k KEY**

    The private KEY for signing. This is required for the -s or -c options.

    The private KEY needs to be in your gnupg keychain file.

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

# EXAMPLES

## Separate signature file

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

## Append signature to file

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

# ENVIRONMENT

cgGpgOpt

This varible defines more gpg options. It is mainly used by
gpg-sign-test.sh so it can be run with not prompts.

# SEE ALSO

gpg

# HISTORY

GPLv2 (c) Copyright

$Revision: 1.1 $ $Date: 2024/12/13 05:39:04 $ GMT
