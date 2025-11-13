# setup-regolith

GitHub Action to download the Regolith CLI and add it to `PATH` so you can run `regolith` in your workflow steps.

## Usage

```yaml
name: Example Workflow
on: [push]

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Regolith
        uses: bedrock-core/setup-regolith@v1
        with:
          regolith-version: '1.6.1' # or 'latest'
          resolvers: |
            github.com/bedrock-core/regolith-filters

      - name: Run Regolith profile
        run: regolith run release
```

## Inputs

- `regolith-version` (optional)
  - Version of Regolith to install from GitHub releases (e.g. `latest`, `1.6.1`).
  - Default: `latest`.

- `resolvers` (optional)
  - Newline- or comma-separated list of resolver URLs to append via:
    - `regolith config resolvers --append <resolver-url>`
  - Example: `github.com/bedrock-core/regolith-filters`.

After the `setup-regolith` step completes, `regolith` is available on `PATH` for all subsequent steps in the same job.

## Behavior

- Downloads the appropriate Regolith binary for the runner OS from the Regolith GitHub releases.
- Extracts and caches it using the GitHub Actions tool cache.
- Adds the binary directory to `PATH`.
- Optionally appends any provided resolver URLs to the Regolith configuration.
- Does **not** run any Regolith profiles itself; you stay in control and run `regolith` as needed.

## Development

### Setup

```bash
yarn install
```

### Build

```bash
yarn build
```

### Package for Distribution

```bash
yarn package
```

This project uses Yarn 4 with the `node-modules` linker.

## License

MIT
