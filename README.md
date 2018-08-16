# Hardenize CLI Tool

This tool provides easy access to the [Hardenize](https://www.hardenize.com) API.

## Setup

```shell
git clone https://github.com/hardenize/hardenize-cli
cd hardenize-cli
npm i -g
```

## Usage

Run without arguments in order to see the list of options:

```shell
$ hardenize 

  Usage: hardenize [options] [command]

  Options:

    -v, --version                output the version number
    -c, --config [config-path]   Path to config. Default is ~/.hardenize
    -h, --help                   output usage information

  Commands:

    config                       Create / edit configuration
    get-config                   Display configuration
    ls-certs [options]           List all certificates for an organization
    get-cert [options] <sha256>  Get certificates for an organization
    upload-cert [options]        Get certificates for an organization
```

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
  "cli_version": "0.0.2"
}
```

### Command: ls-certs

This allows you to view a list of all of the certificates for your organization:

```shell
$ hardenize ls-certs --org demo
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

### Command: upload-cert

This allows you to upload a certificate.

```shell
$ hardenize upload-cert --org demo < ./file-containing-cert.pem 
Certificate successfully created
$ hardenize upload-cert --org demo < ./file-containing-cert.pem 
Certificate already exists
```

## Development / Contributing

Inside the `openapi` directory we have a file named `hardenize-org-api-v0.openapi.yml` which describes our API in a standard format. Inside the same directory is a shell script named `build.sh` which when run, will download [openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator), and use it to build a javascript client library in the `dist` directory. It then merges in some additional source code and applies some patches. To trigger this process, run `npm run build-openapi` from the root of the repository. You will not need to do this unless you intend to upgrade the API client library.

If you wish to point the tool at a different URL, for testing purposes. Just add a "base_url" option to the root of your config, which looks like for example:

```json
{
    "base_url": "https://example.com"
}
```

Then when using that configuration, the API end-points will look like `https://example.com/org/orgLabel/v0`

If you wish to disable TLS validation because you're testing against a dev machine with a self signed certificate, you can manually add the following to your configuration file:

```json
{
    "disable_tls_validation": true
}
```