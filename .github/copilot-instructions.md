# GitHub Copilot Instructions

This is a Stage.js-based Progressive Web App (PWA) game project - a modern recreation of the classic Scorched Earth artillery game.

## Project Overview

- **Game Engine**: Stage.js (canvas-based 2D rendering)
- **Language**: TypeScript (strict mode enabled)
- **Build Tool**: Vite (fast development and optimized builds)
- **Testing**: Vitest (unit and integration tests)
- **Target**: Browser-based PWA with offline support

## Key Guidelines

For complete technical constraints and development guidelines, see [`Agents.md`](../Agents.md) in the root directory.

### Code Quality Standards

- **TypeScript**: Use strict mode, avoid `any`, explicitly type all function parameters and return values
- **Formatting**: Follow Prettier configuration (2-space indentation, single quotes)
- **Naming**: PascalCase for classes, camelCase for functions/variables, UPPER_SNAKE_CASE for constants
- **Testing**: Minimum 80% coverage for core game logic; all new features require tests

### Development Workflow

```bash
# Setup
npm install              # Install dependencies

# Development
npm run dev              # Start dev server with hot reload
npm run type-check       # TypeScript type checking
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Testing
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage

# Build
npm run build            # Production build
npm run preview          # Preview production build
```

### Pre-commit Checklist

Before committing, ensure:
- ✅ References updated: `npm update --save`
- ✅ References Audited: `npm audit fix`
- ✅ TypeScript compiles: `npm run type-check`
- ✅ Linting passes: `npm run lint`
- ✅ Code is formatted: `npm run format`
- ✅ All tests pass: `npm test`
- ✅ Build succeeds: `npm run build`

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` New feature
- `fix:` Bug fix
- `test:` Test additions or updates
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring without behavior change

### Human Approval Required

Do NOT make changes that:
- Add third-party libraries without security review
- Modify CI/CD configuration (`.github/workflows/**`)
- Add secrets, API keys, or credentials in code
- Perform large refactors affecting multiple systems simultaneously
- Modify TypeScript strict compiler options to be less strict

### Allowed Autonomous Edits

You MAY make small, self-contained changes such as:
- Upgrade dependencies as long as all breaking changes are accounted for
- Fixing typos and improving documentation
- Adding or updating tests for existing code
- Bug fixes with appropriate tests
- UI polish and improvements that don't change game logic
- Adding utility functions with tests

## Project Structure

```
src/
├── main.ts              # Application entry point
├── game/                # Game logic
│   ├── core/            # Core engine integration
│   ├── entities/        # Tanks, projectiles, terrain
│   ├── physics/         # Ballistics, collision, gravity
│   ├── weapons/         # Weapon systems
│   ├── ai/              # AI opponents
│   └── state/           # Game state management
├── ui/                  # UI components and screens
├── assets/              # Images, sounds, sprites
├── utils/               # Helper functions
└── types/               # TypeScript type definitions

tests/
├── unit/                # Unit tests
└── integration/         # Integration tests
```

## Additional Context

- **Browser Support**: Modern browsers with ES2020+ support
- **Mobile Support**: Responsive design with touch controls
- **Performance**: Target 60 FPS gameplay
- **PWA**: Offline support via service worker (Workbox)
- **Deployment**: GitHub Pages (automated via GitHub Actions)

For detailed specifications, testing requirements, and architecture patterns, refer to:
- [`Agents.md`](../Agents.md) - Complete technical guidelines
- [`README.md`](../README.md) - Project documentation
- [`Requirements.md`](../Requirements.md) - Technical specifications
