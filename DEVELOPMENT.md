# Development

If you are not a core developer of this library (you almost certainly aren't, unless you work for Hardenize Limited), you probably don't need to look at any of the options here as they are not relevant to you.

## Changing the API URL

For local development, you need to change the API URL hostname, port and path, and also disable TLS validation:

```shell
$ hardenize config set base_url https://local.hardenizer.com:8443/org/{org}/api/
$ hardenize config set disable_tls_validation
```