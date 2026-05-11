# Commit Message Instructions

## Format
Use [Conventional Commits](https://www.conventionalcommits.org/) with the following format:

```
<type>(scope): <short description>

<detailed description>
```

## Type
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: Other changes that don't modify src or test files

## Scope
**REQUIRED** - Use one of the following:
- `action` - Changes to the action runtime (`src/`, `dist/`)
- `action-yml` - Changes to `action.yml` (inputs, metadata, entrypoint)
- `ci` - Changes under `.github/workflows/`
- `deps` - Dependency changes (`package.json`, lockfile)
- `build` - Build configuration (`tsconfig.json`, esbuild script)
- `docs` - README and other documentation
- `root` - Other root-level config files

## Title (First Line)
- **Keep it short** (50 characters or less)
- Use imperative mood ("add feature" not "added feature")
- Don't end with a period
- Lowercase after the colon

## Description (Body)
- **Add details here** - explain what and why, not how
- Wrap at 72 characters
- Use bullet points for multiple changes
- Reference issues if applicable

## Examples

### Feature
```
feat(action): support custom resolver URLs via input

- Parse comma- and newline-separated resolver list
- Append each resolver via `regolith config resolvers --append`
```

### Fix
```
fix(action): use correct binary name on Windows

Append `.exe` suffix when resolving the cached binary path so
`core.addPath` exposes the executable to subsequent steps.
```

### Build
```
build(build): replace ncc with esbuild for ESM-only @actions packages

ncc 0.38.4 cannot bundle @actions/core v3+ since it dropped CommonJS.
Switch to esbuild and emit dist/index.mjs.
```

### Deps
```
build(deps): bump @actions/tool-cache to 4.0.0
```

### CI
```
ci(ci): bump pinned regolith-version in smoke test to 1.7.0
```

### Docs
```
docs(docs): document the resolvers input in README
```

### Action metadata
```
feat(action-yml): add `working-directory` input

Allow users to point the resolver config step at a non-root project.
```
