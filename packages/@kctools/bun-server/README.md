# @kctools/bun-server

Command line server for plain HTML websites, powered by [Bun](https://bun.com/).
Bundles and serves plain HTML entrypoints in development, builds them for
production, and previews the build output.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Plugins](#plugins)
- [Modes](#modes)
  - [Single page (spa)](#single-page-spa)
  - [Multiple pages (mpa)](#multiple-pages-mpa)
- [Commands](#commands)
  - [Server options](#server-options)
  - [dev](#dev)
  - [build](#build)
  - [preview](#preview)
- [References](#references)

## Prerequisites

- **Bun**: 1.3.0 or higher
- **Node.js**: 14 or higher

## Installation

```bash
pnpm add --save-dev @kctools/bun-server
```

## Usage

```bash
## start the development server
bun-server dev
## build for production into dist/
bun-server build
## serve the production build
bun-server preview
```

## Plugins

`dev` and `build` take their bundler plugins from the `[serve.static]` section
of `bunfig.toml`, the file Bun's own development server reads. Declaring a
plugin there is all it takes for both commands to use it, and removing it is how
you turn one off:

```toml
[serve.static]
plugins = ["bun-plugin-tailwind"]
```

That is also how [Tailwind CSS](https://tailwindcss.com/) is enabled: install
`bun-plugin-tailwind` and list it. Without a `bunfig.toml`, or with an empty
list, neither command loads any plugin.

Both commands report what they are about to run, so the active set is visible
before the first page is bundled:

```text
Plugins from bunfig.toml: bun-plugin-tailwind
```

`dev` only reports them — Bun's development server loads them itself. `build`
loads them and passes them to the bundler; a plugin that fails to load is
reported and skipped, and the build continues without it.

## Modes

`dev` and `build` accept `--mode` to select how many HTML entrypoints the
website has. The positional argument overrides the default input of the mode,
and its meaning follows the mode: a file in `spa`, a directory in `mpa`.

| Mode  | Default input         | Input is                                |
| ----- | --------------------- | --------------------------------------- |
| `spa` | `./public/index.html` | the single HTML document                |
| `mpa` | `./src/routes`        | a directory holding the HTML documents  |

### Single page (spa)

The default. One HTML document answers every request, so client side routers
keep working on a page reload:

```bash
bun-server dev
bun-server dev ./public/app.html
```

### Multiple pages (mpa)

Every `.html` document below the directory, at any depth, becomes its own
route. The URL is the document's path under that directory without the
extension, and a document named `index.html` answers the route of its own
directory. Each route also answers its sub-paths:

```text
src/routes/index.html            ->  /          and  /*
src/routes/about.html            ->  /about     and  /about/*
src/routes/about/index.html      ->  /about     and  /about/*
src/routes/blog/post.html        ->  /blog/post and  /blog/post/*
src/routes/blog/post/index.html  ->  /blog/post and  /blog/post/*
```

```bash
bun-server dev --mode mpa
bun-server dev --mode mpa ./src/pages
```

As the table shows, `about.html` and `about/index.html` are two ways to write
the same route. A directory holding both is ambiguous: the command reports the
colliding route and exits instead of silently dropping one.

## Commands

### Server options

`dev` and `preview` both bind a socket, and take the same options for it:

| Option                  | Default     | Description                                       |
| ----------------------- | ----------- | ------------------------------------------------- |
| `-h, --hostname <host>` | `127.0.0.1` | hostname to bind to                               |
| `-p, --port <number>`   | `3000`      | port to listen on                                 |
| `-P, --next-port`       | `false`     | try the next ports when the requested one is busy |

### dev

Start the development server with hot reloading.

```bash
bun-server dev [input] [options]
```

| Option              | Default | Description    |
| ------------------- | ------- | -------------- |
| `-m, --mode <mode>` | `spa`   | `spa` or `mpa` |

Plus the [server options](#server-options).

### build

Bundle the website for production.

```bash
bun-server build [input] [options]
```

| Option                   | Default | Description                          |
| ------------------------ | ------- | ------------------------------------ |
| `-m, --mode <mode>`      | `spa`   | `spa` or `mpa`                       |
| `-M, --no-minify`        | —       | disable minification                 |
| `-O, --out <directory>`  | `dist`  | output directory                     |

In `mpa` mode every matched document is an entrypoint, and the output keeps the
source directory layout:

```bash
bun-server build --mode mpa
## dist/index.html, dist/about/index.html, dist/blog/post/index.html
```

Every bundler message is reported on the console channel of its level, and a
successful build lists what it wrote.

```text
Build output:

  dist/index.html            1.21 KB  entry
  dist/chunk-a1b2c3.js     142.40 KB  chunk
  dist/index-d4e5f6.css     12.02 KB  asset
  dist/chunk-a1b2c3.js.map 380.11 KB  sourcemap

  4 files, 535.74 KB in 231ms
```

### preview

Serve a directory of already built static files. Useful to check a production
build before deploying it.

```bash
bun-server preview [directory] [options]
```

Takes the [server options](#server-options). The directory defaults to `dist`:

```bash
bun-server preview
bun-server preview build-output
```

A request resolves in this order:

1. the file itself, such as `/app.js`
2. `index.html` inside the requested directory: `/docs` → `docs/index.html`
3. the same path with an `.html` extension: `/about` → `about.html`
4. `index.html` of the closest parent directory, walking up to the root

Steps 2 and 3 mirror the two `mpa` spellings of a route, so a built multi page
site is served exactly as `dev` serves it. Step 4 keeps deep links working:
`/about/deep` falls back to `about/index.html` when it exists, and to the root
`index.html` when it does not.

Requests that escape the served directory are rejected with `403`, and requests
whose path cannot become a file name with `400`. The containment check is
lexical: it stops `../` traversal, but a symlink inside the served directory
that points outside is still followed. This is a local preview server, not a
sandbox.

Unlike `dev`, `preview` does no bundling, so build first.

## References

- [Bun HTTP server](https://bun.com/docs/api/http)
- [Bun bundler](https://bun.com/docs/bundler)
- [Bun HTML and static sites](https://bun.com/docs/bundler/html)
- [Commander](https://github.com/tj/commander.js)
