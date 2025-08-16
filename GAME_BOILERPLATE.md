# 2D Platformer Game Boilerplate

A complete React-based 2D platformer game built with Three.js and React Three Fiber. This boilerplate provides all the essential components for creating a functional platformer game with modern web technologies.

## 🎮 Features

- **Player Movement**: Smooth WASD/arrow key controls with physics-based movement
- **Jump Mechanics**: Realistic jumping with gravity and ground detection
- **Platform System**: Multi-level platforms with collision detection
- **Physics Engine**: Custom AABB collision detection and response
- **Game States**: Ready, playing, paused, and ended states
- **Scoring System**: Points for jumping and level progression
- **Audio Support**: Background music and sound effects management
- **Responsive UI**: Clean overlay interface with game controls
- **Level System**: Multiple levels with increasing difficulty

## 🚀 Quick Start

### Using the Boilerplate

To switch to the clean boilerplate version:

1. Update `main.tsx` to import `main-boilerplate.tsx`
2. The boilerplate uses these core components:
   - `BoilerplateApp.tsx` - Main application component
   - `SimpleGame.tsx` - Game scene and camera management
   - `SimplePlayer.tsx` - Player movement and physics
   - `SimplePlatform.tsx` - Platform rendering
   - `SimpleGameUI.tsx` - User interface overlay

### Game Controls

- **A / ←** - Move left
- **D / →** - Move right  
- **W / ↑ / Space** - Jump
- **R** - Restart game

## 🏗️ Architecture

### Core Components

#### BoilerplateApp.tsx
Main application wrapper that sets up:
- Three.js Canvas with orthographic camera for 2D perspective
- Keyboard controls configuration
- Game scene, UI, and audio management

#### SimpleGame.tsx  
Game world management:
- Camera following player smoothly
- Platform rendering from game state
- Environmental lighting and background
- Level initialization and resets

#### SimplePlayer.tsx
Player character logic:
- Keyboard input handling
- Physics simulation (gravity, movement, jumping)
- Collision detection with platforms
- Game state integration

#### Game State Management (useGame.tsx)
Centralized state using Zustand:
- Player position and velocity
- Platform data for each level
- Score and level tracking
- Game state transitions

#### Physics System (physics.ts)
Custom physics engine:
- AABB collision detection
- Collision response and resolution
- Ground detection
- Physics constants (gravity, jump force, etc.)

### Key Files Structure

```
client/src/
├── BoilerplateApp.tsx          # Main app entry point
├── main-boilerplate.tsx        # React DOM root setup
├── components/
│   ├── SimpleGame.tsx          # Game scene
│   ├── SimplePlayer.tsx        # Player character
│   ├── SimplePlatform.tsx      # Platform components
│   ├── SimpleGameUI.tsx        # UI overlay
│   └── SoundManager.tsx        # Audio management
├── lib/
│   ├── stores/
│   │   ├── useGame.tsx         # Game state management
│   │   └── useAudio.tsx        # Audio state management
│   └── physics.ts              # Collision detection & physics
```

## 🎯 Game Mechanics

### Movement System
- **Horizontal Movement**: Acceleration-based with friction
- **Jumping**: Fixed jump force with gravity simulation
- **Collision**: AABB-based platform collision detection
- **Ground Detection**: Automatic grounding when landing on platforms

### Platform System
- **Static Platforms**: Fixed position platforms with different colors
- **Multi-Level**: Platforms arranged in increasing difficulty
- **Collision Response**: Proper collision resolution on all axes

### Scoring & Progression
- **Jump Points**: Small score increase for each jump
- **Level Progression**: Advance through increasingly difficult levels
- **Game States**: Clean transitions between ready/playing/ended states

## 🛠️ Customization

### Adding New Platforms
Edit `generatePlatforms()` in `useGame.tsx`:

```typescript
// Add new platform
platforms.push({
  position: { x: 5, y: 3, z: 0 },
  size: { width: 3, height: 1, depth: 2 },
  color: "#FF5722"
});
```

### Adjusting Physics
Modify constants in `physics.ts`:

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
Update styles in `SimpleGameUI.tsx` for custom appearance:

```typescript
// Example: Change button colors
backgroundColor: '#your-color',
color: 'white',
```

## 🎵 Audio Integration

The boilerplate includes audio management through `SoundManager.tsx`:

- **Background Music**: Loops during gameplay
- **Sound Effects**: Jump sounds, collision sounds
- **Mute Toggle**: User can disable audio
- **Audio Loading**: Handles missing audio files gracefully

### Adding Sound Files

Place audio files in `client/public/sounds/`:
- `background.mp3` - Background music
- `hit.mp3` - Collision sound
- `success.mp3` - Success/scoring sound

## 📱 Responsive Design

The game UI adapts to different screen sizes:
- **Mobile**: Touch-friendly controls can be added
- **Desktop**: Keyboard controls optimized
- **Scaling**: Three.js canvas scales automatically

## 🐛 Debugging

### Console Logging
Key actions log to console:
- Player movement (`"Moving left"`, `"Moving right"`)
- Jumping (`"Jump!"`)
- Game events (`"Restarting game..."`)

### Physics Debugging
Monitor player state in browser dev tools:
- Position: `playerPosition`
- Velocity: `playerVelocity`
- Grounded: `isGrounded`

## 🚀 Performance Tips

- **Platform Count**: Keep platforms under 50 for smooth performance
- **Collision Checks**: Optimized AABB detection, but consider spatial partitioning for large levels
- **Rendering**: Uses Three.js instancing for efficient platform rendering
- **State Updates**: Zustand provides efficient state subscriptions

## 📈 Next Steps

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

This boilerplate gives you everything needed to start building your own 2D platformer game!