# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Twemoji (`@twemoji/api`) is a library that converts Unicode emoji characters into `<img>` tags pointing to Twitter-style emoji images. It supports both DOM element parsing and string parsing, with assets served via jsDelivr CDN.

## Commands

```bash
# Install dependencies
yarn install

# Build all distribution formats (JS bundles + copies assets to dist/)
yarn build

# Run tests (requires phantomjs)
yarn test

# Build, test, and deploy to gh-pages
yarn prepublishOnly
```

There is no single-test runner; all 90 tests run together via `phantomjs ./src/test/testrunner.js`.

## Architecture

### Build Pipeline

The build is template-based, not a standard bundler setup:

1. `scripts/build.js` generates `dist/twemoji.js` by embedding the core library as a function string template, injecting the emoji detection regex from `@twemoji/parser`
2. `scripts/create-dist` (called by build.js) produces multiple module formats from that output:
   - `twemoji.npm.js` (CommonJS, `main` in package.json)
   - `twemoji.esm.js` (ESM, `module` in package.json)
   - `twemoji.amd.js` (AMD)
   - `twemoji.min.js` (minified via UglifyJS, `unpkg` in package.json)
3. `scripts/preview` generates HTML preview galleries

### Key Dependency

`@twemoji/parser` provides the regex used for emoji detection. The regex is injected at build time into the distribution files—it is not imported at runtime.

### Source Layout

- `assets/72x72/` — PNG emoji images keyed by codepoint hex
- `assets/svg/` — SVG emoji images keyed by codepoint hex
- `src/test/test.js` — All tests (WRU framework, runs in PhantomJS)
- `scripts/` — Build, preview, and deploy scripts
- `index.d.ts` — TypeScript type definitions
- `svgo.config.js` — SVG optimization config (used by GitHub Actions workflow)

### Public API

The library exposes: `parse()` (main entry—accepts string or DOM element), `replace()`, `test()`, `convert.fromCodePoint()`, `convert.toCodePoint()`, and `onerror` handler.

### Image URL Pattern

Default CDN pattern: `https://cdn.jsdelivr.net/gh/jdecked/twemoji@{VERSION}/assets/{SIZE}/{CODEPOINT}.{EXT}`

## gh-pages Publishing Workflow

The `yarn deploy` (or `yarn prepublishOnly` which runs build → test → deploy) publishes built assets to the `gh-pages` branch:

1. `scripts/deploy.sh` checks out the `gh-pages` branch
2. Copies `dist/` into `v/{VERSION}/` (e.g. `v/17.0.2/`)
3. Updates the `v/latest` symlink to point to the new version directory
4. Commits and pushes if there are changes, then returns to the original branch

The gh-pages branch structure is:
```
v/
  17.0.0/          # Each version folder contains the full dist/ output
  17.0.1/
  17.0.2/
  latest → 17.0.2  # Symlink to current version
```

Each version folder contains all JS bundles, `svg/` and `72x72/` asset directories, plus `preview.html` and `preview-svg.html` galleries.

### Preview Pages

`scripts/preview` generates `dist/preview.html` (PNG) and `dist/preview-svg.html` (SVG) from `src/templates/preview.html`. These pages load twemoji from jsDelivr CDN, call `twemoji.parse()` on a list of all emoji, and display the rendered images in a grid with performance stats and click-to-copy.

## End-to-End Testing of Emoji Rendering

When adding new emoji or editing existing images, the easiest way to verify rendering end-to-end is to use Playwright to open a browser and inspect the actual rendered emoji on the gh-pages preview pages. After building (`yarn build`), open `dist/preview.html` or `dist/preview-svg.html` locally, or the deployed gh-pages URL, and visually confirm the emoji render correctly.

## PR Workflow

Run `yarn build` and `yarn test` before submitting PRs. SVGs pushed to main are auto-optimized via a GitHub Actions workflow.
