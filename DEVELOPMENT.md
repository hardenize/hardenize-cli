# Development

If you are not a core developer of this library (you almost certainly aren't, unless you work for Hardenize Limited),
you probably don't need to look at any of the options here as they are not relevant to you.

## Changing the API URL

To change the API URL from `https://www.hardenize.com/org/demo/api/v0/something` to
`https://www.example.com:8443/org/demo/api/v0/something`, manually add a `base_url` option to your configuration
file:

```json
{
    "base_url": "https://example.com:8443"
}
```

If there is a self signed certificate involved, you will need to disable TLS validation by adding the
following to your configuration file:

```json
{
    "disable_tls_validation": true
}
```

DO NOT LET THIS CODE FIND IT'S WAY INTO PRODUCTION!!!

## Dev-mode

If you add `--dev-mode` to your command line arguments, there will be additional commands
and options available to you. These will usually only work against a hardenize app server
in development mode so are useless to people other than Hardenize Limited developers. To
see the additional commands, just run `hardenize --dev-mode` and look for the commands
marked `(DEV-MODE)`