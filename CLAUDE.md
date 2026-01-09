# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based 2D platformer game built with Three.js and React Three Fiber. The project uses an Express.js backend with Vite for development and includes a clean boilerplate version for new game development.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server (backend + frontend with HMR)
npm run build        # Build for production (client and server)
npm start            # Run production build
```

### Database Operations
```bash
npm run db:push      # Push schema changes to database using Drizzle
```

### Type Checking
```bash
npm run check        # Run TypeScript type checking
```

### Development Server Details
- **Default Port**: 5111 (changed from 5000)
- **Hot Module Replacement**: Enabled via Vite in development
- **Server serves both**: API endpoints and client application
- **Environment**: Development mode enables Vite middleware; production serves static files

## Architecture Overview

### Frontend Architecture

The game uses a component-based architecture with React Three Fiber for 3D rendering in a 2D perspective:

**State Management**:
- **Zustand** stores with `subscribeWithSelector` middleware for game state
- `useGame.tsx`: Core game state (player position/velocity, platforms, score, level, game state)
- `useAudio.tsx`: Audio state management (background music, sound effects, mute state)

**Physics System** (`client/src/lib/physics.ts`):
- Custom AABB (Axis-Aligned Bounding Box) collision detection
- Collision resolution prioritizes smallest overlap axis
- Ground detection with tolerance-based vertical alignment checks
- Physics constants: gravity (-25), jump force (12), move speed (8), friction (0.85)

**Game Components**:
- `SimpleGame.tsx`: Scene management, camera following, platform rendering
- `SimplePlayer.tsx`: Player character with physics simulation and input handling
- `SimplePlatform.tsx`: Individual platform rendering
- `SimpleGameUI.tsx`: Overlay UI with game state transitions
- `SoundManager.tsx`: Browser Audio API integration

**Rendering**:
- Orthographic camera for 2D perspective in 3D space
- Camera follows player smoothly with interpolation
- Platform generation via `generatePlatforms()` function in useGame store

### Backend Architecture

**Express.js Server** (`server/index.ts`):
- Single server handles both API routes and client serving
- Request logging middleware for API endpoints
- Vite integration in development mode
- Static file serving in production

**Database**:
- **Drizzle ORM** for type-safe database operations
- PostgreSQL (Neon) via `@neondatabase/serverless`
- Schema defined in `shared/schema.ts`
- Migrations in `./migrations` directory

**Project Structure**:
- `server/routes.ts`: API route registration
- `server/vite.ts`: Vite dev server setup and static file serving
- `server/storage.ts`: Database storage layer
- `shared/`: Shared types and schemas between client and server

### Build Configuration

**Vite** (`vite.config.ts`):
- Path aliases: `@/` → `client/src/`, `@shared/` → `shared/`
- GLSL shader support via `vite-plugin-glsl`
- Root: `client/` directory
- Build output: `dist/public/`
- Asset support: `.gltf`, `.glb`, `.mp3`, `.ogg`, `.wav`

**TypeScript**:
- Strict type checking enabled
- Shared types between client and server via `shared/` directory

## Game Development Patterns

### Adding New Platforms
Modify `generatePlatforms()` in `client/src/lib/stores/useGame.tsx`:
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
  GRAVITY: -25,        // Vertical acceleration
  JUMP_FORCE: 12,      // Initial jump velocity
  MOVE_SPEED: 8,       // Horizontal acceleration
  FRICTION: 0.85,      // Velocity decay per frame
  MAX_FALL_SPEED: -20, // Terminal velocity
  MAX_MOVE_SPEED: 15   // Max horizontal speed
};
```

### Collision Detection Flow
1. Player movement updates position based on velocity
2. `checkCollisions()` tests AABB overlap with all platforms
3. If collision detected, resolves on axis with smallest overlap
4. Vertical collisions from above set `isGrounded = true`
5. Ground state enables jumping via jump input

### Game State Transitions
- `"ready"` → User clicks start button → `"playing"`
- `"playing"` → Player falls below threshold → `"ended"`
- `"ended"` → User clicks restart → `"playing"`
- Level progression via `nextLevel()` increments level and regenerates platforms

## UI Component Library

The project includes shadcn/ui components in `client/src/components/ui/`:
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Full TypeScript support
- Use `@/` alias to import from `client/src/`

## Audio System

Place audio files in `client/public/sounds/`:
- `background.mp3`: Background music (loops during gameplay)
- `hit.mp3`: Collision sound effect
- `success.mp3`: Success/scoring sound effect

The game handles missing audio files gracefully without errors.

## Important Implementation Details

### Collision Resolution Logic
The physics system resolves collisions on the axis with the smallest overlap to prevent tunneling. This means:
- If horizontal overlap is smallest → resolve X-axis collision
- If vertical overlap is smallest → resolve Y-axis collision
- Small epsilon (0.01) added to prevent floating point errors

### Player Update Loop
Player physics run in `useFrame()` hook at 60fps:
1. Apply gravity to Y velocity
2. Apply friction to X velocity
3. Handle keyboard input (acceleration-based movement)
4. Update position based on velocity
5. Check collisions and resolve
6. Update Zustand store with new position/velocity/grounded state

### Camera Following
Camera smoothly interpolates toward player position using lerp:
```typescript
camera.position.lerp(targetPosition, 0.1);
```

## Two App Versions

The project contains two versions:
1. **Boilerplate** (`BoilerplateApp.tsx` + `main-boilerplate.tsx`): Clean starting point
2. **Full Game** (`App.tsx` + `main.tsx`): Complete implementation with additional features

Switch between versions by changing the import in the active `main.tsx` file.

## Common Gotchas

- **Port changed from 5000 → 5111**: See server/index.ts:61
- **Database required**: `DATABASE_URL` environment variable must be set
- **3D coordinates for 2D game**: Z-axis mostly unused but required for Three.js
- **Player size**: Default is `{width: 1, height: 2, depth: 1}` - affects collision detection
- **Platform generation**: Called on game init, reset, and level progression
- **Zustand subscriptions**: Use `subscribeWithSelector` middleware for selective re-renders
