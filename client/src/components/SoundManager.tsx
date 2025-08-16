import { useEffect } from 'react';
import { useAudio } from '../lib/stores/useAudio';
import { usePlatformer } from '../lib/stores/usePlatformer';

export function SoundManager() {
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    isMuted 
  } = useAudio();
  
  const { gameState } = usePlatformer();

  // Load and setup audio files
  useEffect(() => {
    const loadAudio = async () => {
      try {
        // Load background music
        const bgMusic = new Audio('/sounds/background.mp3');
        bgMusic.loop = true;
        bgMusic.volume = 0.3;
        setBackgroundMusic(bgMusic);

        // Load hit sound
        const hitSound = new Audio('/sounds/hit.mp3');
        hitSound.volume = 0.5;
        setHitSound(hitSound);

        // Load success sound  
        const successSound = new Audio('/sounds/success.mp3');
        successSound.volume = 0.7;
        setSuccessSound(successSound);

        console.log('Audio files loaded successfully');
      } catch (error) {
        console.log('Error loading audio files:', error);
      }
    };

    loadAudio();
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Handle background music based on game state and mute status
  useEffect(() => {
    const handleBackgroundMusic = async () => {
      const bgMusic = document.querySelector('audio[src="/sounds/background.mp3"]') as HTMLAudioElement;
      
      if (bgMusic) {
        if (gameState === 'playing' && !isMuted) {
          try {
            await bgMusic.play();
            console.log('Background music started');
          } catch (error) {
            console.log('Background music play prevented:', error);
          }
        } else {
          bgMusic.pause();
          console.log('Background music paused');
        }
      }
    };

    handleBackgroundMusic();
  }, [gameState, isMuted]);

  return null;
}
