# Hardenize CLI Tool

This tool provides easy access to the [Hardenize](https://www.hardenize.com) API.

## Install

```shell
$ npm i -g @hardenize/cli
```

Or:

```shell
$ git clone https://github.com/hardenize/hardenize-cli
$ cd hardenize-cli
$ npm i -g
```

## Usage

Run without arguments or with --help/-h to see the list of options:

```shell
$ hardenize

  Usage: hardenize [options] [command]

  Options:

    -v, --version                output the version number
    -c, --config [config-path]   Path to config. Default is ~/.hardenize
    -h, --help                   output usage information

  Commands:

    config                         Create / edit configuration
    get-config [key]               Display configuration. If key is supplied, will only output that item
    get-certs [options]            List all certificates
    get-cert [options] <sha256>    Get a certificate
    add-cert [options]             Add a certificate (reads as PEM from stdin)
    add-dns-zone [options] <root>  Add DNS zone file (reads bind compatible zone from stdin)
```

You can also get additional help on a per-command basis. E.g: run `hardenize get-certs --help`

### Command: config

Before you can run most commands, you will need to configure your credentials

```shell
$ hardenize config
* API Username: Enter your API username
* API Password: Enter your API password
  Default organization: Optionally enter the default organization you wish to operate on
Configuration saved
```

Details will be saved to `~/.hardenize` by default. Unless you specify the `--config`
command line option to indicate a different path.

Many commands take an optional "--org" option. If you do not supply that arg, it will
use the configured default org instead, or fail if there is none.

### Command: get-config

This will print out your configuration.

```shell
$ hardenize get-config
{
  "username": "my-api-username",
  "password": "my-api-password",
  "default_org": "demo",
  "base_url": "https://www.hardenize.com",
  "cli_version": "0.1.0"
}
$ hardenize get-config username
my-api-username
```

You can override any of the configuration options by setting an environment variable of
the same name, prefixed with `HZ_`. For example, to override `default_org`:

```shell
$ HZ_DEFAULT_ORG="test" hardenize get-config
{
  "username": "my-api-username",
  "password": "my-api-password",
  "default_org": "test",
  "base_url": "https://www.hardenize.com",
  "cli_version": "0.1.0"
}
```

### Command: get-certs

This allows you to view a list of all of the certificates for your organization:

```shell
$ hardenize get-certs --org demo
[
  {
    "sha256": "5b620957f0f13c8d57d5a0131c6aa5d5686cf935a762ec3ab33efc8f02903fca",
    "subject": "CN=ssl760679.cloudflaressl.com, OU=PositiveSSL Multi-Domain, OU=Domain Control Validated",
    "serial": "466faa6847d37284e5daadbc6f1c0519",
    "issuer": "CN=COMODO RSA Domain Validation Secure Server CA 2, O=COMODO CA Limited, L=Salford, ST=Greater Manchester, C=GB",
    "notBefore": "2018-08-09T00:00:00.000Z",
    "notAfter": "2019-02-15T23:59:59.000Z",
    "effectiveNotAfter": "2019-02-15T23:59:59.000Z",
    "hosts": [
        ".hardenize.com",
        "hardenize.com",
        "ssl760679.cloudflaressl.com"
    ],
    "firstSeen": "2018-08-09T05:32:23.000Z",
    "lastSeen": "2018-08-15T12:09:47.000Z",
    ...etc
```

There are a number of methods for filtering which certificates are retrieved. Run `hardenize get-certs --help` to see them.

### Command: get-cert <sha256>

This allows you to fetch information about a specific cert, given its SHA256:

```shell
$ hardenize get-cert 5b620957f0f13c8d57d5a0131c6aa5d5686cf935a762ec3ab33efc8f02903fca --org demo
{
  "sha256": "5b620957f0f13c8d57d5a0131c6aa5d5686cf935a762ec3ab33efc8f02903fca",
  "subject": "CN=ssl760679.cloudflaressl.com, OU=PositiveSSL Multi-Domain, OU=Domain Control Validated",
  "serial": "466faa6847d37284e5daadbc6f1c0519",
  "issuer": "CN=COMODO RSA Domain Validation Secure Server CA 2, O=COMODO CA Limited, L=Salford, ST=Greater Manchester, C=GB",
  "notBefore": "2018-08-09T00:00:00.000Z",
  "notAfter": "2019-02-15T23:59:59.000Z",
  "effectiveNotAfter": "2019-02-15T23:59:59.000Z",
  "hosts": [
    ".hardenize.com",
    "hardenize.com",
    "ssl760679.cloudflaressl.com"
  ],
  "firstSeen": "2018-08-09T05:32:23.000Z",
  "lastSeen": "2018-08-15T12:09:47.000Z",
  ...etc
```

### Command: add-cert

This allows you to add a certificate.

```shell
$ hardenize add-cert --org demo < ./file-containing-cert.pem 
Certificate successfully created
$ hardenize add-cert --org demo < ./file-containing-cert.pem 
Certificate already exists
```

### Command: add-dns-zone

This allows you to upload a bind compatible DNS zone

```shell
$ hardenize add-dns-zone --org demo < ./file-containing-zone
Certificate successfully created
$ hardenize add-dns-zone --org demo < ./file-containing-zone
Certificate already exists
```

## Development

If you are a core developer of this library (you almost certainly aren't, unless you work for
Hardenize Limited), you should check out [./DEVELOPMENT.md](DEVELOPMENT.md)