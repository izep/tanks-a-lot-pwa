# Tanks-a-Lot: A Modern Scorched Earth Clone

A browser-based Progressive Web App (PWA) recreation of the classic artillery game Scorched Earth, built with Stage.js and TypeScript.

[![Deploy to GitHub Pages](https://github.com/izep/Tanks-a-lot-web/workflows/Deploy/badge.svg)](https://github.com/izep/Tanks-a-lot-web/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🎮 Play Now

**[Play Tanks-a-Lot](https://izep.github.io/Tanks-a-lot-web/)** - Works on desktop and mobile!

## ✨ Features

- 🎯 **Classic Artillery Gameplay**: Turn-based tank combat with destructible terrain
- 🌐 **Progressive Web App**: Install and play offline on any device
- 🎨 **Modern Graphics**: Retro-inspired pixel art with smooth animations
- 🤖 **AI Opponents**: Multiple difficulty levels from Moron to Cyborg
- 💣 **30+ Weapons**: Missiles, nukes, rollers, diggers, and more
- 🌬️ **Physics Simulation**: Realistic ballistics with wind and gravity
- 👥 **Multiplayer**: Hotseat mode for up to 10 players
- 📱 **Responsive Design**: Seamless experience on desktop, tablet, and mobile
- ⚙️ **Highly Configurable**: Customize physics, economics, AI, and visuals

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later (LTS recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/izep/Tanks-a-lot-web.git
cd Tanks-a-lot-web

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Open your browser to http://localhost:5173
```

The development server will automatically reload when you make changes to the code.

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch

# Open Vitest UI
npm run test:ui
```

### Coverage Requirements

- Minimum 80% coverage for core game logic
- All new features must include tests
- Bug fixes must include regression tests

## 🛠️ Development Workflow

### Code Quality

```bash
# Type check TypeScript
npm run type-check

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Pre-commit Checklist

Before committing, ensure:
- ✅ TypeScript compiles: `npm run type-check`
- ✅ Linting passes: `npm run lint`
- ✅ Code is formatted: `npm run format`
- ✅ All tests pass: `npm test`
- ✅ Build succeeds: `npm run build`

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add MIRV weapon implementation
fix: correct ballistic trajectory calculation
docs: update API documentation for physics module
test: add integration tests for weapon systems
chore: update dependencies
```

## 📦 Technology Stack

### Core
- **Game Engine**: [Stage.js](https://github.com/shakiba/stage.js) - Canvas-based 2D rendering
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite - Fast development and optimized builds
- **PWA**: Vite PWA Plugin with Workbox

### Quality & Testing
- **Testing**: Vitest - Fast unit and integration tests
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier
- **Type Checking**: TypeScript compiler

### Deployment
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🏗️ Project Structure

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

public/                  # Static assets (manifest, icons)
```

## 🎯 Game Overview

Tanks-a-Lot is a faithful recreation of Scorched Earth, the "Mother of all games" (as it called itself). Players control tanks on a destructible 2D landscape, taking turns to aim and fire weapons at opponents while accounting for wind, gravity, and terrain.

### Core Mechanics

- **Turn-Based Combat**: Sequential gameplay where each player aims, selects weapons, and fires
- **Destructible Terrain**: Every explosion reshapes the battlefield
- **Ballistic Physics**: Realistic projectile trajectories affected by wind and gravity
- **Economic System**: Earn money by dealing damage, spend it on weapons and accessories
- **Strategic Depth**: 30+ unique weapons with different tactical applications

### Weapons Categories

- **Standard Explosives**: Missiles, Baby Nukes, Nukes
- **Multi-Warhead**: MIRVs, Death's Head
- **Rolling**: Baby Roller, Roller, Heavy Roller
- **Tunneling**: Diggers, Sandhogs
- **Terrain Modification**: Riot Charges, Dirt Clods, Earth Disrupter
- **Energy Weapons**: Lasers, Plasma Blasts
- **Special**: Napalm, Funky Bombs, Leap Frogs

See [Requirements.md](Requirements.md) for complete technical specifications.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/amazing-feature`
3. **Follow** the code quality standards (see [Agents.md](Agents.md))
4. **Write** tests for new features
5. **Ensure** all tests pass: `npm test`
6. **Commit** with conventional commit messages
7. **Push** to your branch: `git push origin feat/amazing-feature`
8. **Open** a Pull Request

### Development Guidelines

See [Agents.md](Agents.md) for detailed guidelines including:
- TypeScript standards and best practices
- Testing requirements
- Code organization and style
- CI/CD pipeline
- Security and dependency management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Scorched Earth** by Wendell Hicken - The original inspiration
- **Stage.js** community - Excellent 2D canvas library
- All contributors and testers

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/izep/Tanks-a-lot-web/issues)
- 💡 **Feature Requests**: [Discuss in issues](https://github.com/izep/Tanks-a-lot-web/issues)
- 📖 **Documentation**: See [Requirements.md](Requirements.md) and [Agents.md](Agents.md)

## 🗺️ Roadmap

### Phase 1: Foundation (Current)
- [x] Project setup with TypeScript + Vite + Stage.js
- [ ] Basic terrain generation and rendering
- [ ] Tank entities and positioning
- [ ] Simple projectile physics
- [ ] Basic UI framework

### Phase 2: Core Gameplay
- [ ] Destructible terrain implementation
- [ ] Complete ballistics system with wind/gravity
- [ ] Turn-based game loop
- [ ] Standard weapons (missiles, nukes)
- [ ] AI opponents (basic difficulty levels)

### Phase 3: Weapons & Features
- [ ] All 30+ weapon types
- [ ] Accessories and defense items
- [ ] Economic system and shop
- [ ] Advanced AI (Cyborg, Poolshark, Spoiler)
- [ ] Sound effects and music

### Phase 4: Polish & Multiplayer
- [ ] Hotseat multiplayer (up to 10 players)
- [ ] Complete UI/UX polish
- [ ] Mobile controls optimization
- [ ] PWA offline support
- [ ] Settings and customization

### Phase 5: Future Enhancements
- [ ] Online multiplayer
- [ ] Custom maps and mod support
- [ ] Achievements and statistics
- [ ] Spectator mode
- [ ] Replay system

---

**Made with ❤️ for fans of classic artillery games**
