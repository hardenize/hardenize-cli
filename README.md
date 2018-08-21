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

Run without arguments or with help/--help/-h to see the list of options:

```shell
$ hardenize help
hardenize <command>

Commands:
  hardenize certs <command>     Manage certificates
  hardenize config <command>    Manage configuration
  hardenize dns-zone <command>  Manage dns zones

Options:
  --version     Show version number                                     [boolean]
  --config, -c  Path to configuration file   [default: "/home/picard/.hardenize"]
  --help        Show help                                               [boolean]
```

You can also get additional help on a per-command basis. E.g:

```shell
$ hardenize certs help
hardenize certs <command>

Manage certificates

Commands:
  hardenize certs add           Add a certificate. (Reads PEM from stdin)
  hardenize certs get <sha256>  Get a certificate
  hardenize certs ls            List certificates

Options:
  --version     Show version number                                     [boolean]
  --config, -c  Path to configuration file   [default: "/home/picard/.hardenize"]
  --help        Show help                                               [boolean]
$ hardenize certs add help
hardenize certs add

Add a certificate. (Reads PEM from stdin)

Options:
  --version     Show version number                                     [boolean]
  --config, -c  Path to configuration file   [default: "/home/picard/.hardenize"]
  --help        Show help                                               [boolean]
  --file, -f    Read cert from disk instead of stdin
```

### Command: config

Before you can run most commands, you will need to configure your credentials and
a few other things by running `hardenize config init`

```shell
$ hardenize config init
* API Username: your api username
* API Password: your api password
  Default organization: your default org
Configuration saved
```

Details will be saved to `~/.hardenize` by default. Unless you specify the `--config`
command line option to indicate a different path.

Many commands take an optional "--org" option. If you do not supply that arg, it will
use the configured default org instead, or fail if there is none.

## Development

If you are a core developer of this library (you almost certainly aren't, unless you work for
Hardenize Limited), you should check out [./DEVELOPMENT.md](DEVELOPMENT.md)