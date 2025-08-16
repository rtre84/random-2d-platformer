# 2D Platformer Game Boilerplate

A complete React-based 2D platformer game built with Three.js and React Three Fiber. This project provides both a working game implementation and clean boilerplate code for new game development.

![Game Preview](https://via.placeholder.com/800x400/87CEEB/000000?text=2D+Platformer+Game)

## 🎮 Features

- **Player Movement**: Smooth WASD/arrow key controls with physics-based movement
- **Jump Mechanics**: Realistic jumping with gravity and ground detection
- **Platform System**: Multi-level platforms with AABB collision detection
- **Physics Engine**: Custom collision detection and response system
- **Game States**: Ready, playing, paused, and ended states with UI transitions
- **Scoring System**: Points for jumping and level progression
- **Audio Support**: Background music and sound effects management
- **Responsive UI**: Clean overlay interface with game controls
- **Level System**: Multiple levels with increasing difficulty
- **Clean Architecture**: Modular, extensible codebase structure

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rtre84/random-2d-platformer.git
cd 2d-platformer-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Game Controls

- **A / ←** - Move left
- **D / →** - Move right  
- **W / ↑ / Space** - Jump
- **R** - Restart game

## 🏗️ Project Structure

```
├── client/src/
│   ├── BoilerplateApp.tsx          # Main app entry point
│   ├── components/
│   │   ├── SimpleGame.tsx          # Game scene management
│   │   ├── SimplePlayer.tsx        # Player character logic
│   │   ├── SimplePlatform.tsx      # Platform components
│   │   ├── SimpleGameUI.tsx        # UI overlay
│   │   └── SoundManager.tsx        # Audio management
│   └── lib/
│       ├── stores/
│       │   ├── useGame.tsx         # Game state management
│       │   └── useAudio.tsx        # Audio state management
│       └── physics.ts              # Collision detection & physics
├── server/                         # Express.js backend
├── shared/                         # Shared types and schemas
└── GAME_BOILERPLATE.md            # Detailed documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework with functional components and hooks
- **React Three Fiber** - 3D rendering engine wrapper for Three.js
- **Three.js** - Core 3D graphics library for game rendering
- **Zustand** - Lightweight state management
- **TypeScript** - Static type checking
- **Vite** - Fast development server and build tool

### Backend
- **Express.js** - RESTful API server
- **TypeScript** - Full-stack type safety
- **Drizzle ORM** - Type-safe database toolkit

### Game Engine
- **Custom Physics** - AABB collision detection system
- **Component Architecture** - Modular game object system
- **Audio Management** - Browser-native Audio API integration

## 🎨 Customization

### Adding New Platforms

Edit `generatePlatforms()` in `client/src/lib/stores/useGame.tsx`:

```typescript
platforms.push({
  position: { x: 5, y: 3, z: 0 },
  size: { width: 3, height: 1, depth: 2 },
  color: "#FF5722"
});
```

### Adjusting Physics

Modify constants in `client/src/lib/physics.ts`:

```typescript
export const PHYSICS_CONSTANTS = {
  GRAVITY: -25,        // How fast player falls
  JUMP_FORCE: 12,      // Jump strength
  MOVE_SPEED: 8,       // Horizontal movement speed
  FRICTION: 0.85,      // Sliding friction
  MAX_FALL_SPEED: -20, // Terminal velocity
  MAX_MOVE_SPEED: 15   // Max horizontal speed
};
```

### Styling the UI

Update styles in `client/src/components/SimpleGameUI.tsx` for custom appearance.

## 🎵 Audio Setup

Place audio files in `client/public/sounds/`:
- `background.mp3` - Background music
- `hit.mp3` - Collision sound
- `success.mp3` - Success/scoring sound

The game handles missing audio files gracefully.

## 🚀 Deployment

### Replit Deployment

This project is optimized for Replit deployment:

1. Import the project to Replit
2. The project will auto-configure
3. Click "Run" to start the development server
4. Use the "Deploy" button for production deployment

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist/` directory
3. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

## 📚 Documentation

- [Complete Game Documentation](GAME_BOILERPLATE.md) - Detailed guide for customization and extension
- [Physics System](client/src/lib/physics.ts) - Collision detection implementation
- [State Management](client/src/lib/stores/) - Game and audio state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Next Steps

This boilerplate provides a solid foundation. Consider adding:

### Game Features
- **Enemies**: Moving obstacles or AI characters
- **Collectibles**: Coins, power-ups, or items
- **Moving Platforms**: Elevators or sliding platforms
- **Checkpoints**: Save points in longer levels
- **Lives System**: Multiple attempts before game over

### Technical Enhancements
- **Mobile Controls**: Touch/swipe controls for mobile devices
- **Level Editor**: In-game platform placement tool
- **Save System**: LocalStorage for progress persistence
- **Multiplayer**: WebSocket-based multiplayer support
- **Better Graphics**: Textures, animations, particle effects

## 📞 Support

If you have questions or need help:

1. Check the [documentation](GAME_BOILERPLATE.md)
2. Look through existing [issues](https://github.com/yourusername/2d-platformer-boilerplate/issues)
3. Create a new issue with detailed information

---

**Happy Coding!** 🎮✨

Built with ❤️ using React Three Fiber and TypeScript
