import { usePlatformer } from '../lib/stores/usePlatformer';
import { useAudio } from '../lib/stores/useAudio';

export function GameUI() {
  const { gameState, score, resetGame } = usePlatformer();
  const { toggleMute, isMuted } = useAudio();

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1000
    }}>
      {/* Top UI */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 15px',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px'
      }}>
        <div>Score: {score}</div>
        <div>State: {gameState}</div>
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 15px',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px'
      }}>
        <div>Controls:</div>
        <div>A/D or ←/→ - Move</div>
        <div>W/Space or ↑ - Jump</div>
        <div>R - Restart</div>
        <button 
          onClick={toggleMute}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: isMuted ? '#ff4444' : '#44ff44',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
        >
          Sound: {isMuted ? 'OFF' : 'ON'}
        </button>
      </div>

      {/* Game Over Screen */}
      {gameState === 'ended' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '32px' }}>Game Over!</h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Final Score: {score}</p>
          <button 
            onClick={resetGame}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#4ECDC4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              pointerEvents: 'auto'
            }}
          >
            Play Again (R)
          </button>
        </div>
      )}

      {/* Instructions for new players */}
      {gameState === 'ready' && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px'
        }}>
          <div>Welcome to the 2D Platformer!</div>
          <div>Use WASD or arrow keys to move and jump on platforms.</div>
          <div>Try not to fall off the map!</div>
        </div>
      )}
    </div>
  );
}
