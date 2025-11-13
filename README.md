# Regolith Action

A reusable GitHub Action built with TypeScript.

## Usage

```yaml
name: Example Workflow
on: [push]

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: your-username/regolith-action@v1
        with:
          example-input: 'custom value'
```

## Inputs

- `example-input`: An example input (optional, default: 'default value')

## Outputs

- `example-output`: An example output

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

This project uses Yarn 4 with node_modules linker.

## License

MIT
