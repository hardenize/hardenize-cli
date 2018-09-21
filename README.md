# Hardenize CLI Tool

This tool provides easy access to the [Hardenize](https://www.hardenize.com) API.

## Install

```shell
$ sudo npm i -g @hardenize/cli
```

Or:

```shell
$ git clone https://github.com/hardenize/hardenize-cli
$ cd hardenize-cli
$ sudo npm i -g
```

## Updating

To see if there is a newer version (no output means you are):

```shell
$ sudo npm outdated -g @hardenize/cli
```

To upgrade to the latest version if you're not:

```shell
$ sudo npm i -g @hardenize/cli
```

## Usage

Run without arguments or with help/--help/-h to see the list of options:

```shell
$ hardenize help
hardenize <command>

Commands:
  hardenize certs <command>      Manage certificates
  hardenize config <command>     Manage configuration
  hardenize dns-zones <command>  Manage dns zones
  hardenize groups <command>     Manage groups
  hardenize hosts <command>      Manage hosts
  hardenize reports0 <command>   Manage reports (unstable)
  hardenize suborgs <command>    Manage organizations

Options:
  --version     Show version number                                     [boolean]
  --config, -c  Path to configuration file
                                    [string] [default: "/home/picard/.hardenize"]
  --org         Organization (falls back to config default_org)          [string]
  --format      Output format (falls back to config "default_format", otherwise
                "table")                [choices: "table", "yaml", "json", "csv"]
  --debug, -d   Displays debug information about API requests and responses
                                                                        [boolean]
  --help        Show help                                               [boolean]

Find our API documentation at https://www.hardenize.com/docs/api/v1/
```

You can also get additional help on a per-command basis. E.g:

```shell
hardenize certs <command>

Manage certificates

Commands:
  hardenize certs create        Create a certificate. (Reads PEM from stdin)
  hardenize certs get <sha256>  Get a certificate
  hardenize certs ls [host]     List certificates

Options:
  --version     Show version number                                     [boolean]
  --config, -c  Path to configuration file
                                    [string] [default: "/home/picard/.hardenize"]
  --org         Organization (falls back to config default_org)          [string]
  --format      Output format (falls back to config "default_format", otherwise
                "table")                [choices: "table", "yaml", "json", "csv"]
  --debug, -d   Displays debug information about API requests and responses
                                                                        [boolean]
  --help        Show help                                               [boolean]
$ hardenize certs create help
hardenize certs create

Create a certificate. (Reads PEM from stdin)

Options:
  --version     Show version number                                     [boolean]
  --config, -c  Path to configuration file
                                    [string] [default: "/home/picard/.hardenize"]
  --org         Organization (falls back to config default_org)          [string]
  --format      Output format (falls back to config "default_format", otherwise
                "table")                [choices: "table", "yaml", "json", "csv"]
  --debug, -d   Displays debug information about API requests and responses
                                                                        [boolean]
  --help        Show help                                               [boolean]
  --file, -f    Read cert from disk instead of stdin                     [string]
```

### Configuration

Before you can run most commands, you will need to configure your credentials and
a few other things by running `hardenize config init`

```shell
$ hardenize config init
* API Username: your api username
* API Password: your api password
  Default organization: your default org
  Default output format [table]: json
Configuration saved
```

Details will be saved to `~/.hardenize` by default. Unless you specify the `--config`
command line option to indicate a different path.

Many commands take an optional "--org" option. If you do not supply that arg, it will
use the configured default org instead, or fail if there is none.

You can override configuration values using environment variables prefixed with `HZ_`.
For example, to override a configuration item named "username", you would set the
environment variable `HZ_USERNAME`

Most command simply display the results as returned from the API. By specifying
`--format` on the command line, you can choose for them to be displayed in either
`table`, `yaml`, `json` or `csv` format. The output defaults to your configs
`default_format` option, or `table` if that does not exist.

## Development

If you are a core developer of this library (you almost certainly aren't, unless you work for
Hardenize Limited), you should check out [DEVELOPMENT.md](https://github.com/hardenize/hardenize-cli/blob/master/DEVELOPMENT.md)