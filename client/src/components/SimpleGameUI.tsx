import { useGame } from '../lib/stores/useGame';
import { useAudio } from '../lib/stores/useAudio';

export function SimpleGameUI() {
  const { gameState, score, level, resetGame, setGameState } = useGame();
  const { toggleMute, isMuted } = useAudio();

  const startGame = () => {
    setGameState('playing');
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1000,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Game Stats - Top Left */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '15px 20px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: '500'
      }}>
        <div>Score: {score}</div>
        <div>Level: {level}</div>
        <div>Status: {gameState}</div>
      </div>

      {/* Controls Help - Top Right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '15px 20px',
        borderRadius: '10px',
        fontSize: '14px'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Controls:</div>
        <div>← → A D - Move</div>
        <div>↑ W Space - Jump</div>
        <div>R - Restart</div>
        
        <button 
          onClick={toggleMute}
          style={{
            marginTop: '12px',
            padding: '6px 12px',
            backgroundColor: isMuted ? '#ff4444' : '#44ff44',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            pointerEvents: 'auto'
          }}
        >
          Sound: {isMuted ? 'OFF' : 'ON'}
        </button>
      </div>

      {/* Welcome Screen */}
      {gameState === 'ready' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '40px 50px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '36px',
            fontWeight: 'bold' 
          }}>
            2D Platformer
          </h1>
          <p style={{ 
            margin: '0 0 30px 0', 
            fontSize: '18px',
            lineHeight: '1.5',
            color: '#ccc'
          }}>
            Jump on platforms and explore!<br />
            Use WASD or arrow keys to move.
          </p>
          <button 
            onClick={startGame}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#4ECDC4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              pointerEvents: 'auto'
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'ended' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '40px 50px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '32px',
            color: '#ff6b6b' 
          }}>
            Game Over!
          </h2>
          <p style={{ 
            margin: '0 0 15px 0', 
            fontSize: '20px' 
          }}>
            Final Score: {score}
          </p>
          <p style={{ 
            margin: '0 0 30px 0', 
            fontSize: '16px',
            color: '#ccc' 
          }}>
            Level Reached: {level}
          </p>
          <button 
            onClick={resetGame}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#4ECDC4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              pointerEvents: 'auto'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Pause Screen */}
      {gameState === 'paused' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '30px 40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            fontSize: '28px' 
          }}>
            Paused
          </h2>
          <button 
            onClick={() => setGameState('playing')}
            style={{
              padding: '12px 25px',
              fontSize: '16px',
              backgroundColor: '#4ECDC4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              pointerEvents: 'auto'
            }}
          >
            Resume
          </button>
        </div>
      )}
    </div>
  );
}