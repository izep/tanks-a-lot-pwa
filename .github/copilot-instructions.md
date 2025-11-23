# GitHub Copilot Instructions

This is a Stage.js-based Progressive Web App (PWA) game project - a modern recreation of the classic Scorched Earth artillery game. The repository uses TypeScript with strict mode, Vite for building, and Vitest for testing. It targets modern browsers with ES2020+ support and includes PWA functionality for offline play.

## Technology Stack

- **Game Engine**: Stage.js (canvas-based 2D rendering)
- **Language**: TypeScript (strict mode enabled)
- **Build Tool**: Vite (fast development and optimized builds)
- **Testing**: Vitest (unit and integration tests)
- **Target**: Browser-based PWA with offline support
- **Deployment**: GitHub Pages (automated via GitHub Actions)

## Code Standards

For complete technical constraints and development guidelines, see [`Agents.md`](../Agents.md) in the root directory.

### Required Before Each Commit

- Run `npm run format` to ensure proper code formatting
- Run `npm run lint` to check for linting issues
- Run `npm run type-check` to ensure TypeScript compiles without errors
- Run `npm test` to ensure all tests pass
- Run `npm run build` to verify production build succeeds
- Run `npm update --save` to update dependencies
- Run `npm audit fix` to address security vulnerabilities

### Code Quality Standards

- **TypeScript**: Use strict mode, avoid `any`, explicitly type all function parameters and return values
- **Formatting**: Follow Prettier configuration (2-space indentation, single quotes)
- **Naming**: PascalCase for classes, camelCase for functions/variables, UPPER_SNAKE_CASE for constants
- **Testing**: Minimum 80% coverage for core game logic; all new features require tests
- **Documentation**: Use JSDoc comments for public classes, methods, and complex functions

### Development Workflow

```bash
# Setup
npm install              # Install dependencies

# Development
npm run dev              # Start dev server with hot reload (http://localhost:5173)
npm run type-check       # TypeScript type checking
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier

# Testing
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage report
npm run test:watch       # Watch mode for TDD
npm run test:ui          # Open Vitest UI

# Build and Deploy
npm run build            # Production build
npm run preview          # Preview production build locally
```

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` New feature (e.g., `feat: add MIRV weapon implementation`)
- `fix:` Bug fix (e.g., `fix: correct ballistic trajectory calculation`)
- `test:` Test additions or updates
- `docs:` Documentation changes
- `chore:` Maintenance tasks (e.g., `chore: update dependencies`)
- `refactor:` Code refactoring without behavior change

## Repository Structure

```
src/
├── main.ts              # Application entry point
├── game/                # Game logic modules
│   ├── core/            # Core game engine integration with Stage.js
│   ├── entities/        # Game entities (tanks, projectiles, terrain)
│   ├── physics/         # Physics systems (ballistics, collision, gravity)
│   ├── weapons/         # Weapon systems (30+ weapon types)
│   ├── ai/              # AI opponents (multiple difficulty levels)
│   └── state/           # Game state management
├── ui/                  # UI components and screens
├── assets/              # Images, sounds, sprites
├── utils/               # Helper functions and utilities
└── types/               # TypeScript type definitions

tests/
├── unit/                # Unit tests for individual modules
└── integration/         # Integration tests for system interactions

public/                  # Static assets (manifest.json, icons)
```

## Key Guidelines

1. **Follow TypeScript best practices**: Use strict mode, avoid `any`, explicitly type all parameters
2. **Maintain existing code structure**: Keep game logic separated from rendering
3. **Use dependency injection**: Where appropriate for testability
4. **Write comprehensive tests**: Use table-driven tests when possible, maintain 80% coverage for core logic
5. **Document public APIs**: Use JSDoc comments for classes, methods, and complex logic
6. **Keep Stage.js rendering separated**: Mock Stage.js in tests for unit testing game logic
7. **Follow Prettier formatting**: 2-space indentation, single quotes, trailing commas
8. **Security first**: Run `npm audit` before adding dependencies, never commit secrets

## Autonomy Guidelines

### Human Approval Required

Do NOT make changes that:
- Add third-party libraries without security review (`npm audit`)
- Modify CI/CD configuration (`.github/workflows/**`)
- Add secrets, API keys, or credentials in code
- Perform large refactors affecting multiple systems simultaneously
- Modify TypeScript strict compiler options to be less strict
- Change project license or introduce incompatible-license code

### Allowed Autonomous Edits

You MAY make small, self-contained changes such as:
- Upgrade dependencies (patch/minor versions) after running `npm audit`
- Fix typos and improve documentation
- Add or update tests for existing code
- Bug fixes with appropriate regression tests
- UI polish and improvements that don't change game logic
- Add utility functions with comprehensive tests
- Refactor internal functions while preserving behavior and tests

## Additional Context

- **Browser Support**: Modern browsers with ES2020+ support (Chrome, Firefox, Safari, Edge)
- **Mobile Support**: Responsive design with touch controls, portrait/landscape modes
- **Performance**: Target 60 FPS gameplay, optimize physics calculations
- **PWA**: Offline support via service worker (Workbox), web app manifest
- **Deployment**: GitHub Pages (automated via GitHub Actions on push to `main`)

## Related Documentation

For detailed specifications, testing requirements, and architecture patterns, refer to:
- [`Agents.md`](../Agents.md) - Complete technical guidelines and agent behavior constraints
- [`README.md`](../README.md) - Project documentation and getting started guide
- [`Requirements.md`](../Requirements.md) - Technical specifications and game mechanics
