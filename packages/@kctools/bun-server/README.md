# @kctools/bun-server

Command line server for plain HTML websites, powered by [Bun](https://bun.com/).
Serves HTML entrypoints in development, builds them for production, and
previews the build output.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Plugins](#plugins)
- [Static files](#static-files)
- [Commands](#commands)
  - [Server options](#server-options)
  - [dev](#dev)
  - [build](#build)
  - [preview](#preview)
- [Logging](#logging)
- [References](#references)

## Prerequisites

- **Bun**: 1.3.0 or higher

## Installation

```bash
bun add --dev @kctools/bun-server
```

## Usage

```bash
bun-server dev       # dev server on ./src/routes
bun-server build     # build into ./dist
bun-server preview   # serve ./dist
```

## Routes

`dev` and `build` take any number of inputs: an HTML file, a directory (scanned
for `**/*.html`), or a glob. Default is `./src/routes`.

The route is the file path under its root without `.html`, and `index.html`
answers its directory. A single file is rooted at its own directory, and a glob
at the part before its first glob character.

```text
src/routes/index.html        ->  /
src/routes/about.html        ->  /about
src/routes/about/index.html  ->  /about
```

- In `dev`, each route also answers its sub-paths (`/about/*`).
- Dotfiles are not matched.
- Two files producing the same route, across all inputs, fail with
  `Found duplicated routes: /about`.

## Plugins

`build` loads bundler plugins from `bunfig.toml` in the working directory, the
same section Bun's dev server reads:

```toml
[serve.static]
plugins = ["bun-plugin-tailwind"]
```

A missing file or `plugins` array loads nothing. A plugin that fails to load is
logged and skipped. `dev` leaves this to `Bun.serve()`.

## Static files

The bundler only outputs files an HTML document references. Use
`--statics <source>[:<target>]` (repeatable, `dev` and `build`) for anything
else, such as `favicon.ico` or `robots.txt`.

```bash
bun-server build --statics public:.
```

**Source** is a path or glob, relative to the working directory or absolute. It
is split into a root and a pattern:

| Source              | Root          | Pattern      |
| ------------------- | ------------- | ------------ |
| `public`            | `public`      | `**/*`       |
| `assets/**/*.png`   | `assets`      | `**/*.png`   |
| `**/*.txt`          | working dir   | `**/*.txt`   |
| `public/robots.txt` | `public`      | `robots.txt` |

**Target** is a directory inside the output directory; `.` is the output root.
Default is the source root. The layout below the root is kept:

| Specification            | `public/img/logo.png` is written to |
| ------------------------ | ----------------------------------- |
| `--statics public`       | `dist/public/img/logo.png`          |
| `--statics public:.`     | `dist/img/logo.png`                 |
| `--statics public:icons` | `dist/icons/img/logo.png`           |

Rules:

- The value is split at the last `:`.
- An absolute source requires a target (`/shared/icons:icons`).
- A target outside the output directory (`..`, `/`, `/etc`) is an error.
- Dotfiles are matched, so `.well-known/` works.
- HTML files are copied too. A static file that overwrites bundler output
  stops the build before anything is copied.
- Two static files with the same output path fail with
  `Found duplicated static files: ...`.

`build` copies the files after bundling. `dev` copies nothing and serves each
file from the URL it would have in the build, read on every request.

## Commands

Every command takes `-C, --cwd <directory>` (default: process working
directory). All paths resolve against it.

### Server options

`dev` and `preview` take:

| Option                  | Default                        | Description                           |
| ----------------------- | ------------------------------ | ------------------------------------- |
| `-h, --hostname <host>` | `127.0.0.1`                    | hostname to bind                      |
| `-p, --port <number>`   | `3000` (dev), `4000` (preview) | port, `0` picks a free one            |
| `-P, --next-port`       | enabled                        | try next port if busy, up to 10 times |
| `-N, --no-next-port`    | —                              | fail if the port is busy              |

### dev

```bash
bun-server dev [input...] [options]
```

Serves [routes](#routes) as HTML bundles through `Bun.serve()` in development
mode, with hot reloading. Takes `-s, --statics` and the
[server options](#server-options).

### build

```bash
bun-server build [input...] [options]
```

| Option                             | Default | Description                   |
| ---------------------------------- | ------- | ----------------------------- |
| `-M, --minify` / `-N, --no-minify` | enabled | toggle minification           |
| `-O, --out <directory>`            | `dist`  | output directory              |
| `-s, --statics <source[:target]>`  | —       | [static files](#static-files) |

Runs `Bun.build()` with every route as an entrypoint: browser target, ESM, code
splitting, linked source maps, and only `BUN_PUBLIC_*` env vars inlined. Logs
each output file with its size and kind, then a total.

### preview

```bash
bun-server preview [directory] [options]
```

Serves a built directory (default `dist`) without bundling. Takes the
[server options](#server-options). A request `/x` resolves to the first that
exists:

1. `x`
2. `x/index.html`
3. `x.html`

Anything else is `404`. There is no sub-path fallback. Paths that leave the
directory return `403`, and paths that cannot be decoded return `400`. The check
is lexical, so symlinks are followed. Use it for local preview only.

## Logging

Set `DEBUG=true` (also `1`, `yes`, `on`) to print debug logs, such as resolved
routes, static files, and server configuration.

## References

- [Bun HTTP server](https://bun.com/docs/api/http)
- [Bun bundler](https://bun.com/docs/bundler)
- [Bun HTML and static sites](https://bun.com/docs/bundler/html)
