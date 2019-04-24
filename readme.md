# Redmine Timey

> TBD

## Usage

### With Build Artifacts

```shell
$ node index.js start --redmine https://redmine.company.com
```

### With Docker

Environment variables:
* `REDMINE_HOST` - redmine instance address

```shell
$ docker run -p 8080:80 -e REDMINE_HOST=https://redmine.company.com nbatrakov/redmine-timey
```

## Development

To run `npm start` you must set environment variable `REDMINE_HOST` to your redmine instance address.

For example (on linux):

```shell
$ export REDMINE_HOST=https://redmine.company.com
```

> You may also use [VS Code Integrated Terminal Environment Variables](http://serkanh.github.io/vscode,terminal,/2018/10/15/set-up-vscode-terminal-env-var.html)