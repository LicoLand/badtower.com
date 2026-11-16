# badtower.com

Updated: 2026-11-16

Public product website for BadTower, a protocol-neutral communication Station
that stays untrusted by design. This repository owns only the website. Product
facts remain owned by the [BadTower](https://github.com/LicoLand/BadTower) and
[BadTower.js](https://github.com/LicoLand/BadTower.js) repositories; the site
summarizes and links to them.

## Current state

One static home page and seven documentation pages: Station, Contract, Trust,
Run, Plugins, Status, and FAQ. They describe BadTower according to its product
definition; the Status page reports implementation, verification, and release
separately, and says where they have not caught up with the definition. This
source tree, its `CNAME`, and a passing validation do not prove publication,
product release, support, or operation of any Station.

## Run

The site is static HTML, CSS, and dependency-free JavaScript with self-hosted
fonts and artwork; there is no build step. Serve this directory with any
static HTTP server:

    python3 -m http.server 4173

Navigation, links, and copy work without JavaScript. The field of towers on
the home page is drawn by script; its motion follows the reduced-motion
preference and the page's pause control.

## Verify

    python3 tools/check_site.py

The check validates local targets, fragments, symbol references, canonical
metadata, crawler files, and the custom-domain binding.

## Documentation

Start at [docs/README.md](docs/README.md).
