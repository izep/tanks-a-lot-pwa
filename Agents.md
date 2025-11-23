# Agents Guidelines (Stage.js PWA)

**Purpose**: Define technical constraints and non-functional requirements an AI coding agent must follow when making changes to this repository. These rules focus on a Stage.js-based Progressive Web App (PWA) game project and are written for autonomous or semi-autonomous coding agents (assistants, CI bots) and for human reviewers to understand expectations.

---

## Technology Stack

### Core Framework & Language
- **Game Engine**: Stage.js (latest stable version from npm)
- **Primary Language**: TypeScript (strict mode enabled)
- **Runtime**: Browser-based (ES2020+ target)
- **Package Manager**: npm (lockfile: `package-lock.json`)
- **Build Tool**: Vite (for fast development and optimized production builds)
- **PWA Support**: Vite PWA plugin with Workbox for service worker generation

### Testing & Quality
- **Test Framework**: Vitest (unit and integration tests)
- **Test Coverage**: c8 or Istanbul (minimum 80% coverage for core game logic)
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier (configuration in `.prettierrc`)
- **Type Checking**: TypeScript compiler (`tsc --noEmit`)

### Deployment
- **Hosting**: GitHub Pages
- **Build Output**: `dist/` directory
- **Base Path**: Configure Vite base path for repository name
- **CI/CD**: GitHub Actions for automated build and deployment

---

## Project Structure

```
/
├── src/
│   ├── main.ts              # Application entry point
│   ├── game/                # Game logic modules
│   │   ├── core/            # Core game engine integration
│   │   ├── entities/        # Tanks, projectiles, terrain
│   │   ├── physics/         # Ballistics, collision, gravity
│   │   ├── weapons/         # Weapon systems
│   │   ├── ai/              # AI opponents
│   │   └── state/           # Game state management
│   ├── ui/                  # UI components and screens
│   ├── assets/              # Images, sounds, sprites
│   ├── utils/               # Helper functions
│   └── types/               # TypeScript type definitions
├── tests/
│   ├── unit/                # Unit tests
│   └── integration/         # Integration tests
├── public/                  # Static assets (manifest, icons)
├── dist/                    # Build output (gitignored)
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions CI/CD
└── README.md                # Project documentation
```

---

## Code Quality & Style

### TypeScript Standards
- **Strict Mode**: All strict TypeScript compiler options enabled
- **No `any`**: Avoid `any` type; use `unknown` or proper types
- **Explicit Types**: Function parameters and return types must be explicitly typed
- **JSDoc Comments**: Document all public classes, methods, and complex functions
- **Null Safety**: Use strict null checks; prefer optional chaining and nullish coalescing

### Code Organization
- **Single Responsibility**: Each module/class should have one clear purpose
- **Functional Decomposition**: Prefer pure functions where possible
- **Immutability**: Use `const` by default; minimize mutable state
- **Naming Conventions**:
  - Classes: PascalCase
  - Functions/Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: kebab-case.ts
  - Interfaces: Prefix with `I` or use descriptive names

### Formatting
- **Prettier**: Auto-format all code (2-space indentation, single quotes, trailing commas)
- **ESLint**: Enforce TypeScript best practices and code quality rules
- **Import Order**: Group and sort imports (external, internal, types)

### Agent Communication
- AI agents must NOT use temporary files or console statements to communicate task status
- Use the reporting tools provided by the agent framework
- Build scripts intended for end-users MAY use console output

---

## Testing Requirements

### Unit Tests
- **Framework**: Vitest with TypeScript support
- **Coverage**: Minimum 80% coverage for game logic, physics, and AI
- **Scope**: Test individual classes, functions, and modules in isolation
- **Mocking**: Use Vitest mocks for dependencies (e.g., Stage.js rendering)
- **File Naming**: `*.test.ts` or `*.spec.ts`

### Integration Tests
- **Scope**: Test interactions between game systems (physics + collision, AI + weapons)
- **Canvas Testing**: Use jsdom or canvas-mock for rendering tests
- **State Management**: Verify game state transitions and side effects

### Test Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/game/physics/ballistics.test.ts
```

### Test Execution Policy
- All tests must pass before committing
- New features require accompanying tests
- Bug fixes must include regression tests
- Tests are run automatically in CI pipeline

---

## Build & Development Workflow

### Development
```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Build Output
- **Target Directory**: `dist/`
- **Assets**: Hashed filenames for cache busting
- **PWA Manifest**: Generated service worker and web app manifest
- **Optimization**: Minification, tree-shaking, code splitting

---

## Continuous Integration (CI/CD)

### GitHub Actions Workflow
**File**: `.github/workflows/deploy.yml`

**Pipeline Steps**:
1. **Setup**: Checkout code, setup Node.js (LTS version)
2. **Install**: `npm ci` (clean install from lockfile)
3. **Type Check**: `npm run type-check`
4. **Lint**: `npm run lint`
5. **Test**: `npm test` (with coverage reporting)
6. **Build**: `npm run build`
7. **Deploy**: Deploy `dist/` to GitHub Pages (on `main` branch only)

**Triggers**:
- Push to `main` branch: Full pipeline + deployment
- Pull requests: Build and test only (no deployment)

**Environment**:
- Node.js version: LTS (currently 20.x)
- Cache npm dependencies for faster builds

---

## Agent Behavior & Constraints

### Human Approval Required
The AI agent must NOT make changes that:
- Upgrade or change major dependencies (Stage.js, Vite, TypeScript major versions)
- Add third-party libraries without security review (check npm audit, licenses)
- Modify CI/CD configuration (`.github/workflows/**`)
- Change deployment settings or GitHub Pages configuration
- Add secrets, API keys, or credentials in code
- Change project license or introduce incompatible-license code
- Perform large refactors affecting multiple systems simultaneously
- Modify TypeScript strict compiler options to be less strict

### Autonomous Edits Allowed
The agent MAY make small, self-contained changes such as:
- Fixing typos and improving documentation
- Adding or updating tests for existing code
- Refactoring internal functions while preserving behavior and tests
- Bug fixes with appropriate tests
- UI polish and improvements that don't change game logic
- Adding utility functions with tests
- Updating dependencies (patch versions only, after audit)

### Change Granularity
- Keep changes small and focused on a single concern
- Split large features into multiple commits
- Each commit should be self-contained and pass all checks

### Commit Messages
Use Conventional Commits format:
- `feat:` New feature
- `fix:` Bug fix
- `chore:` Maintenance (dependencies, config)
- `test:` Test additions or updates
- `docs:` Documentation changes
- `refactor:` Code refactoring without behavior change
- `style:` Code formatting changes

Include issue references when applicable: `feat: implement tank movement (#12)`

---

## Security & Secrets

- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for configuration (prefix with `VITE_` for client access)
- Store sensitive values in GitHub Secrets for CI/CD
- Run `npm audit` before adding new dependencies
- Review licenses of all dependencies (must be permissive: MIT, Apache, BSD)

---

## Dependencies & Vulnerability Management

### Adding Dependencies
1. Document the purpose and justification
2. Check license compatibility (prefer MIT, Apache 2.0, BSD)
3. Run `npm audit` to check for known vulnerabilities
4. Add to `package.json` with exact version or caret range
5. Update documentation if the dependency affects architecture

### Current Dependencies (Approximate)
- **Production**:
  - `stage-js`: Game rendering engine
  - `vite-plugin-pwa`: PWA support with Workbox
- **Development**:
  - `vite`: Build tool
  - `typescript`: Language
  - `vitest`: Testing framework
  - `eslint`: Linting
  - `prettier`: Formatting
  - `@types/*`: Type definitions

### Updating Dependencies
- Patch updates: Agent may update automatically after audit
- Minor updates: Suggest in PR, require human approval
- Major updates: Open issue for discussion, require human approval

---

## Acceptance Criteria for Agent Changes

Before committing, verify:
- [x] TypeScript compiles without errors (`npm run type-check`)
- [x] All linting rules pass (`npm run lint`)
- [x] Code is formatted (`npm run format`)
- [x] All tests pass (`npm test`)
- [x] Test coverage meets minimums for modified code
- [x] No new security vulnerabilities (`npm audit`)
- [x] Build succeeds (`npm run build`)
- [x] `README.md` and documentation are updated if needed
- [x] Commit message follows Conventional Commits format
- [x] No secrets or credentials introduced

---

## PWA Requirements

### Manifest
- **File**: `public/manifest.json`
- **Fields**: name, short_name, description, icons (192x192, 512x512), theme_color, background_color, display: "standalone"

### Service Worker
- **Generation**: Vite PWA plugin with Workbox
- **Strategy**: Network-first for HTML, cache-first for assets
- **Offline Support**: Cache critical game assets for offline play

### Icons
- Provide multiple sizes: 192x192, 512x512 (PNG)
- Maskable icons for adaptive display

---

## Stage.js Integration

### Rendering
- Use Stage.js for canvas-based 2D rendering
- Organize game objects as Stage.js nodes/layers
- Implement game loop with requestAnimationFrame via Stage.js

### Best Practices
- Keep Stage.js rendering separated from game logic
- Use TypeScript interfaces for Stage.js entities
- Mock Stage.js in tests for unit testing game logic
- Leverage Stage.js built-in features (sprite sheets, textures, tweening)

---

## Deployment (GitHub Pages)

### Configuration
- **Repository Settings**: Enable GitHub Pages from `gh-pages` branch
- **Vite Base Path**: Set `base: '/Tanks-a-lot-web/'` in `vite.config.ts`
- **GitHub Actions**: Automatically build and deploy on push to `main`

### Deployment Process
1. CI builds the project (`npm run build`)
2. Artifacts in `dist/` are deployed to `gh-pages` branch
3. GitHub Pages serves the site at `https://<username>.github.io/Tanks-a-lot-web/`

### Testing Deployment
- Preview production build locally: `npm run preview`
- Verify all assets load correctly with base path
- Test PWA installation and offline functionality

---

## Escalation & Communication

### High-Risk Changes
For the following, open an issue and draft PR describing the change, risks, and approvals needed:
- Major dependency upgrades (Stage.js, Vite, TypeScript)
- New third-party libraries
- CI/CD configuration changes
- Architecture refactors affecting multiple systems
- Performance optimization requiring profiling

### Documentation Updates
- Keep `README.md` synchronized with project changes
- Update this file if development workflow changes
- Document new architecture patterns in code comments

---

## Example Commands

```bash
# Setup and development
npm install                 # Install dependencies
npm run dev                 # Start dev server (http://localhost:5173)

# Code quality
npm run type-check          # TypeScript type checking
npm run lint                # Run ESLint
npm run lint:fix            # Auto-fix linting issues
npm run format              # Format code with Prettier

# Testing
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
npm run test:watch          # Watch mode for TDD
npm run test:ui             # Open Vitest UI

# Build and preview
npm run build               # Production build
npm run preview             # Preview production build

# Deployment (automated via GitHub Actions)
# Manual deployment (if needed):
npm run build && gh-pages -d dist
```

---

## Additional Notes

- **Browser Support**: Modern browsers with ES2020 support (Chrome, Firefox, Safari, Edge)
- **Mobile Support**: Responsive design, touch controls, portrait/landscape modes
- **Performance**: Target 60 FPS gameplay, optimize physics calculations
- **Accessibility**: Keyboard navigation, ARIA labels, colorblind-friendly palettes
- **Localization**: Structure code for future i18n support (externalize strings)

---

**End of Guidelines**
