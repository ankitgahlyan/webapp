# AGENTS.md - Development Guidelines

## Agent Guidance

- Use `acton` skill for Acton CLI, Tolk, wrappers, tests, scripts, deployment, and `Acton.toml` tasks.
- Treat `phosphate/contracts/fossFi/fossFi.tolk` and `contracts/src/types.tolk` as the source of truth for contract behavior and ABI shape.
- Treat `wrappers-ts/FossFi.gen.ts` as generated output. Prefer regenerating it from the contract ABI instead of hand-editing it when the ABI changes.
- Keep `phosphate/tests/`, `wrappers/FossFi.gen.tolk`, `phosphate/scripts/deploy.tolk`, `wrappers-ts/FossFi.gen.ts`, and the frontend code in `app/` aligned with contract changes.
- Prefer this validation loop when feasible: `acton build`, `acton test`, `npm run typecheck`, `npm run build`.
- Before proposing broadcast deployment changes, verify the contract flow with `acton run deploy-emulation` first.
- When command syntax or flags are unclear, verify them with `acton --help`, `acton <command> --help`, `npm run`, or the existing project config.


## Project Overview

This is a monorepo with two workspaces:

- **Root** (`/`) - React + Vite + TypeScript frontend application
- **Phosphate** (`/phosphate`) - TON blockchain smart contracts

## MCP Servers

If you are unsure how to do something, use `gh_grep` to search code examples from GitHub.

### Context7 MCP

Always use Context7 MCP when needing library/API documentation, code generation, or setup/configuration steps.
When you need to search docs, use `context7` tools.

## Code Style Guidelines

### TypeScript Configuration

- **Frontend** (`tsconfig.json`): Strict mode enabled, ESNext modules, no unused locals/parameters
- **Phosphate** (`phosphate/tsconfig.json`): CommonJS modules, strict mode, Jest types

### ESLint Configuration

- Extends: `eslint:recommended`, `@typescript-eslint/strict-type-checked`, `@typescript-eslint/stylistic-type-checked`, `react-hooks/recommended`, `react/recommended`
- Uses `react-refresh` plugin for HMR compatibility
- Parser options require explicit project references

### Prettier Formatting

```json
{
    "printWidth": 120,
    "tabWidth": 4,
    "semi": false,
    "singleQuote": true,
    "jsxSingleQuote": true,
    "trailingComma": "all"
}
```

### Imports

- Use explicit relative imports (`./Component` not `Component`)
- Group imports: external libs → internal components → hooks/stores → types
- Use path aliases if configured (check `tsconfig.json` `paths`)

### Naming Conventions

- **Components**: PascalCase filenames matching component name (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Stores**: camelCase (`cartStore.ts`)
- **Types/Interfaces**: PascalCase (`UserData.ts`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Files**: kebab-case for non-component files (`user-profile.tsx`)

### React Patterns

- Use functional components with TypeScript
- Prefer composition over inheritance
- Use `mobx-react-lite` for MobX stores with `observer()`
- Use `zustand` for simple global state
- Use `react-query` patterns if data fetching needed
- Avoid `any` - use proper types or `unknown`

### Error Handling

- Use try/catch with proper error typing
- Create custom error classes for domain-specific errors
- Display user-friendly error messages in UI
- Log errors with context for debugging
- Never expose internal error details to users

### State Management

- **Local state**: `useState` for component-level state
- **Global state**: MobX for complex state, Zustand for simple state
- **Server state**: Consider React Query patterns
- Use computed values in MobX with getters

### Styling

- Use TailwindCSS utility classes
- Custom colors defined in `tailwind.config.ts`
- Dark mode support via `darkMode: 'class'`
- Custom fonts: Poppins (body), Eczar (logo)

### Git Conventions

- Use meaningful commit messages
- Create feature branches for new features
- Run lint before committing
- Keep commits atomic and focused

## Self-Correcting Rules Engine

This file contains a growing ruleset that improves over time. **At session start, read the entire "Learned Rules" section before doing anything.**

### How it works

1. When the user corrects you or you make a mistake, **immediately append a new rule** to the "Learned Rules" section at the bottom of this file.
2. Rules are numbered sequentially and written as clear, imperative instructions.
3. Format: `N. [CATEGORY] Never/Always do X — because Y.`
4. Categories: `[STYLE]`, `[CODE]`, `[ARCH]`, `[TOOL]`, `[PROCESS]`, `[DATA]`, `[UX]`, `[OTHER]`
5. Before starting any task, scan all rules below for relevant constraints.
6. If two rules conflict, the higher-numbered (newer) rule wins.
7. Never delete rules. If a rule becomes obsolete, append a new rule that supersedes it.

### When to add a rule

- User explicitly corrects your output ("no, do it this way")
- User rejects a file, approach, or pattern
- You hit a bug caused by a wrong assumption about this codebase
- User states a preference ("always use X", "never do Y")

### Rule format example

```
14. [CODE] Always use `bun` instead of `npm` — user preference, bun is installed globally.
15. [STYLE] Never add emojis to commit messages — project convention.
16. [ARCH] API routes live in `src/server/routes/`, not `src/api/` — existing codebase pattern.
```

---

## Learned Rules

<!-- New rules are appended below this line. Do not edit above this section. -->

<!-- Leave the start & end comments to automatically receive updates. -->
