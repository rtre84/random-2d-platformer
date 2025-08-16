# Overview

This is a 2D platformer game built with React Three Fiber and Three.js. The project now includes both a working game implementation and clean boilerplate code for new game development. Players control a character that can move left/right and jump between platforms in a 2D perspective using an orthographic camera. The game features physics-based movement, AABB collision detection, scoring, level progression, and audio feedback. The application uses a full-stack architecture with Express.js backend, Vite for development, and Drizzle ORM for database management.

## Recent Changes (January 2025)
- Created complete 2D platformer game boilerplate with simplified, clean code structure
- Added new boilerplate components: SimpleGame, SimplePlayer, SimplePlatform, SimpleGameUI
- Implemented new game state management system (useGame.tsx) with level progression
- Created comprehensive physics system with AABB collision detection
- Added game documentation (GAME_BOILERPLATE.md) with usage instructions
- Main app now uses clean boilerplate version by default

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Core UI framework using functional components and hooks
- **React Three Fiber**: 3D rendering engine wrapper for Three.js, handling the game's 3D graphics
- **Zustand**: State management for game state, audio controls, and player data
- **Radix UI + Tailwind CSS**: Component library and styling system for UI elements
- **Vite**: Development server and build tool with hot module replacement

## Backend Architecture
- **Express.js**: RESTful API server with TypeScript support
- **In-memory Storage**: Temporary data storage using Map-based implementation
- **Modular Route System**: Centralized route registration with /api prefix
- **Error Handling**: Centralized error middleware for consistent responses

## Game Engine Design
- **Component-based 3D System**: Separate components for Player, Platform, Game logic, and UI
- **Physics Engine**: Custom AABB collision detection and gravity simulation
- **Camera System**: Smooth-following orthographic camera with lerped movement
- **Audio Management**: Centralized audio state with mute controls and sound effects

## Data Storage
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Schema Management**: Centralized database schema in shared directory
- **Migration System**: Automated database schema updates via Drizzle Kit

## State Management Pattern
- **Game State**: Centralized platformer state using Zustand with subscriptions
- **Audio State**: Separate store for sound management and mute controls
- **React Query**: Server state management for API interactions (configured but minimal usage)

## Development Workflow
- **TypeScript**: Full type safety across client, server, and shared code
- **Path Aliases**: Simplified imports using @ for client and @shared for common code
- **Hot Reload**: Vite development server with runtime error overlays
- **Build Process**: Separate client (Vite) and server (esbuild) build pipelines

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Drizzle Kit**: CLI for schema management and migrations

## 3D Graphics & Game Engine
- **Three.js**: Core 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Helper components and utilities for R3F
- **React Three Postprocessing**: Visual effects and post-processing pipeline

## UI & Styling
- **Radix UI**: Accessible component primitives (dialogs, buttons, forms, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Type-safe component variant management
- **Lucide React**: Icon library

## State & Data Management
- **Zustand**: Lightweight state management with subscriptions
- **React Query (TanStack)**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime type validation and schema parsing

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for server builds
- **PostCSS**: CSS processing with Autoprefixer

## Audio & Assets
- **Custom Audio System**: Browser-native Audio API for sound effects
- **Font Loading**: Inter font family via Fontsource
- **Asset Pipeline**: Support for GLTF models and audio files

## Utilities
- **Date-fns**: Date manipulation library
- **clsx**: Conditional className utility
- **Nanoid**: Unique ID generation