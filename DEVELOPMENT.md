# Development

If you are not a core developer of this library (you almost certainly aren't, unless you work for Hardenize Limited), you probably don't need to look at any of the options here as they are not relevant to you.

## Changing the API URL

To change the API URL from `https://www.hardenize.com/org/demo/api/v1/something` to
`https://www.example.com:8443/org/demo/api/v1/something`, manually a `base_url` option to your configuration:

```shell
$ hardenize config set base_url https://example.com:8443
```

If there is a self signed certificate involved, you can disable TLS validation by adding the
following to your configuration:

```shell
$ hardenize config set disable_tls_validation
```

DO NOT LET THIS CODE FIND IT'S WAY INTO PRODUCTION!!!