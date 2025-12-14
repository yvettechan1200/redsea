
import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, GameState, Stance, LevelData, Hotspot } from './types';
import { LEVELS } from './constants';
import GameScene from './components/GameScene';
import Typewriter from './components/Typewriter';
import { initAudio, playAmbient, playThornSFX, playVoidSFX, playMaskSFX } from './utils/audioEngine';
import { loadAllAssets, GameAssets } from './utils/assetLoader';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevelIndex: 0,
    currentDialogIndex: 0,
    phase: GamePhase.START,
    history: [],
    isDialogueOpen: false,
    isLevelComplete: false,
    isTransitioning: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<GameAssets | null>(null);

  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  // UI States
  const [dialogReady, setDialogReady] = useState(false);
  const [forceFinishTyping, setForceFinishTyping] = useState(false);
  
  const currentLevel: LevelData = LEVELS[gameState.currentLevelIndex];
  const currentDialog = currentLevel ? currentLevel.dialogs[gameState.currentDialogIndex] : null;

  // --- ASSET LOADING ---
  useEffect(() => {
    loadAllAssets().then((loadedAssets) => {
        setAssets(loadedAssets);
        setIsLoading(false);
    });
  }, []);

  // --- AUDIO & LEVEL EFFECT ---
  // Trigger ambient sound when level changes or game starts
  useEffect(() => {
    if (gameState.phase === GamePhase.PLAYING || 
        gameState.phase === GamePhase.ENDING_BAD || 
        gameState.phase === GamePhase.ENDING_NEUTRAL || 
        gameState.phase === GamePhase.ENDING_TRUE) {
            
        // Map phases/indices to audio IDs
        let audioId = 0;
        if (gameState.phase === GamePhase.PLAYING) {
            audioId = currentLevel.id;
        } else if (gameState.phase === GamePhase.ENDING_NEUTRAL) {
            audioId = 3; // Keep Red Sea sounds
        } else {
            // Silence for bad/true endings or specific SFX handled there
            playAmbient(0); 
            return; 
        }

        playAmbient(audioId);
    }
  }, [gameState.phase, currentLevel?.id, gameState.currentLevelIndex]);

  // --- SCORE CALCULATION (Numerical Tracking) ---
  const calculateScores = useCallback(() => {
      let mask = 0;
      let thorn = 0;
      let voidScore = 0;
      gameState.history.forEach(stance => {
          if (stance === Stance.MASK) mask += 1.0;
          if (stance === Stance.THORN) thorn += 1.0;
          if (stance === Stance.VOID) voidScore += 1.0;
      });
      return { mask, thorn, voidScore };
  }, [gameState.history]);

  const scores = calculateScores();

  const handleStart = () => {
    // Initialize Audio Context on user interaction
    initAudio();
    setGameState(prev => ({ ...prev, phase: GamePhase.PLAYING }));
  };

  const handleBackgroundClick = () => {
      if (activeHotspot) {
          setActiveHotspot(null);
      }
  };

  const handleHotspotClick = (hotspot: Hotspot, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState.isDialogueOpen) return;
    
    playMaskSFX(); // Gentle click sound for inspection

    let finalText = "";
    let foundCondition = false;

    // 1. Check Conditionals
    if (hotspot.conditionalDescriptions) {
        for (const cond of hotspot.conditionalDescriptions) {
            const { stat, value } = cond.threshold;
            
            if (stat === Stance.MASK && scores.mask >= value) {
                finalText = cond.text;
                foundCondition = true;
                break;
            }
            if (stat === Stance.THORN && scores.thorn >= value) {
                finalText = cond.text;
                foundCondition = true;
                break;
            }
            if (stat === Stance.VOID && scores.voidScore >= value) {
                finalText = cond.text;
                foundCondition = true;
                break;
            }
        }
    }

    // 2. Random Selection (if no condition met)
    if (!foundCondition) {
        const randomIndex = Math.floor(Math.random() * hotspot.baseDescriptions.length);
        finalText = hotspot.baseDescriptions[randomIndex];
    }

    setActiveHotspot(finalText);
  };

  const handleNpcClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState.isLevelComplete) return;
    if (gameState.isDialogueOpen) return;

    setActiveHotspot(null); // Clear any active hotspot text
    playMaskSFX();
    setDialogReady(false);
    setForceFinishTyping(false);

    setGameState(prev => ({
        ...prev,
        isDialogueOpen: true
    }));
  };

  const handleTypingComplete = useCallback(() => {
      setDialogReady(true);
  }, []);

  const handleDialogBoxClick = () => {
      if (!dialogReady) {
          setForceFinishTyping(true);
      }
  };

  const handleExitClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playMaskSFX();
    setGameState(prev => ({ ...prev, isTransitioning: true }));

    setTimeout(() => {
        if (gameState.currentLevelIndex < LEVELS.length - 1) {
             setGameState(prev => ({
                ...prev,
                currentLevelIndex: prev.currentLevelIndex + 1,
                currentDialogIndex: 0,
                isDialogueOpen: false,
                isLevelComplete: false,
                isTransitioning: false
            }));
        } else {
             setGameState(prev => ({ ...prev, phase: GamePhase.ENDING_NEUTRAL, isTransitioning: false }));
        }
    }, 2000);
  };

  const handleOptionSelect = (stance: Stance, text: string) => {
    // Play sound based on stance
    if (stance === Stance.THORN) {
        playThornSFX();
    } else if (stance === Stance.VOID) {
        playVoidSFX();
    } else {
        playMaskSFX();
    }

    const newHistory = [...gameState.history, stance];
    
    setDialogReady(false);
    setForceFinishTyping(false);

    // Endings Logic (Level 3, Round 5)
    if (gameState.currentLevelIndex === 2 && gameState.currentDialogIndex === 4) {
        if (stance === Stance.MASK) {
            setGameState({ ...gameState, phase: GamePhase.ENDING_BAD, history: newHistory });
        } else if (stance === Stance.THORN) {
            setGameState({ ...gameState, phase: GamePhase.ENDING_TRUE, history: newHistory });
        } else {
            setGameState({ ...gameState, phase: GamePhase.ENDING_NEUTRAL, history: newHistory });
        }
        return;
    }

    // Progression
    if (currentLevel && gameState.currentDialogIndex < currentLevel.dialogs.length - 1) {
        setGameState(prev => ({
            ...prev,
            currentDialogIndex: prev.currentDialogIndex + 1,
            history: newHistory
        }));
    } else {
        setGameState(prev => ({
            ...prev,
            history: newHistory,
            isDialogueOpen: false,
            isLevelComplete: true
        }));
    }
  };

  // --- RENDER: LOADING ---
  if (isLoading || !assets) {
      return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center font-mono text-white">
              <h1 className="text-2xl animate-pulse">LOADING ASSETS...</h1>
              <p className="text-xs mt-4 text-gray-500">Retrieving memories.</p>
          </div>
      );
  }

  // --- RENDER PHASES ---

  if (gameState.phase === GamePhase.ENDING_BAD) {
      return (
          <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-gray-500 font-mono">
              <h1 className="text-4xl mb-4 animate-pulse">LOOP DETECTED</h1>
              <p>明天還要上課。</p>
              <div className="mt-8 text-sm">
                  Final Scores: M:{scores.mask} | T:{scores.thorn} | V:{scores.voidScore}
              </div>
              <button onClick={() => window.location.reload()} className="mt-8 border border-gray-700 px-4 py-2 hover:bg-gray-900 text-white">RESTART SYSTEM</button>
          </div>
      )
  }

  if (gameState.phase === GamePhase.ENDING_TRUE) {
      return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-red-600 font-mono">
             <div className="scanline"></div>
             <h1 className="text-6xl mb-4" style={{textShadow: '2px 2px 0px #fff'}}>LOGGED OUT</h1>
             <p className="text-white">系統連線中斷...</p>
             <p className="text-sm mt-4 text-gray-600">你睡著了。夢裡沒有紅色。</p>
        </div>
      )
  }
  
  if (gameState.phase === GamePhase.ENDING_NEUTRAL) {
      return (
          <div className="w-full h-screen bg-[#300000] flex flex-col items-center justify-center text-blue-300 font-mono relative overflow-hidden">
             <div className="absolute inset-0 bg-red-900 opacity-50 mix-blend-overlay"></div>
             <h1 className="text-4xl mb-4 z-10">滯留</h1>
             <p className="z-10">再抽一根。</p>
             <p className="z-10 text-xs mt-2">海浪聲很好聽。</p>
          </div>
      )
  }

  if (gameState.phase === GamePhase.START) {
    return (
      <div className="relative w-full h-screen bg-black text-white flex flex-col items-center justify-center font-mono overflow-hidden">
        <div className="crt-overlay absolute inset-0 z-20"></div>
        <div className="scanline"></div>
        
        <h1 className="text-6xl mb-2 text-red-500 font-bold tracking-widest" style={{textShadow: '4px 0 #00ffff'}}>THE RED SEA</h1>
        <h2 className="text-xl mb-8 text-gray-400">紅海</h2>
        
        <div className="max-w-md text-center mb-8 text-sm text-gray-300">
            <p className="mb-2">⚠️ 警告：包含強烈閃爍、消極情緒與存在主義恐懼。</p>
            <p>這不是遊戲。這是週二下午三點的感覺。</p>
        </div>

        <button 
            onClick={handleStart}
            className="px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors z-30 uppercase tracking-widest cursor-pointer"
        >
            Login
        </button>
      </div>
    );
  }

  const fadeOpacity = gameState.isTransitioning ? 1 : 0;

  return (
    <div 
        className="relative w-full h-screen bg-black overflow-hidden font-mono select-none"
        onClick={handleBackgroundClick}
    >
      <GameScene levelId={currentLevel.id} assets={assets} />
      
      <div className="crt-overlay absolute inset-0 z-40 pointer-events-none"></div>
      <div className="scanline"></div>

       <div 
         className="absolute inset-0 z-[60] bg-black transition-opacity duration-[2000ms] pointer-events-none"
         style={{ opacity: fadeOpacity }}
       ></div>
      
      {/* HUD & Status Bar */}
      <div className="absolute top-4 left-4 z-30 text-xs text-white opacity-80 border-l-2 border-red-500 pl-2 bg-black/50 p-2">
          <p className="text-red-400 font-bold mb-1">LOCATION: {currentLevel.title}</p>
          <p>ENTITY: {currentLevel.npcName}</p>
          <div className="mt-2 text-[10px] grid grid-cols-3 gap-2 border-t border-gray-600 pt-1">
              <span className="text-gray-400">MASK: {scores.mask.toFixed(1)}</span>
              <span className="text-red-400">THORN: {scores.thorn.toFixed(1)}</span>
              <span className="text-blue-400">VOID: {scores.voidScore.toFixed(1)}</span>
          </div>
      </div>

      {!gameState.isDialogueOpen && !gameState.isTransitioning && (
          <div className="absolute inset-0 z-20">
              {currentLevel.hotspots.map(hs => (
                  <button
                    key={hs.id}
                    onClick={(e) => handleHotspotClick(hs, e)}
                    className="absolute w-6 h-6 border border-white rounded-full hover:bg-white hover:opacity-50 transition-all flex items-center justify-center cursor-pointer"
                    style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    aria-label={hs.label}
                  >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
                      <span className="w-1 h-1 bg-white rounded-full"></span>
                  </button>
              ))}

              {!gameState.isLevelComplete && (
                  <button
                    onClick={handleNpcClick}
                    className="absolute border border-transparent hover:border-red-500/50 group cursor-pointer"
                    style={{ 
                        left: `${currentLevel.npcPosition.x}%`, 
                        top: `${currentLevel.npcPosition.y}%`,
                        width: `${currentLevel.npcPosition.w}%`,
                        height: `${currentLevel.npcPosition.h}%`,
                    }}
                    aria-label="Interact with NPC"
                  >
                       <div className="w-full h-full opacity-0 group-hover:opacity-20 bg-white animate-pulse"></div>
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap bg-black px-1 border border-white">
                           {currentLevel.npcName}
                       </div>
                  </button>
              )}

              {gameState.isLevelComplete && (
                   <button
                   onClick={handleExitClick}
                   className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white bg-black text-white px-8 py-4 z-50 animate-pulse hover:bg-white hover:text-black transition-colors cursor-pointer"
                 >
                   EXIT &gt;&gt;
                 </button>
              )}
          </div>
      )}

      {activeHotspot && (
          <div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-[80%] max-w-lg bg-black border border-white text-white px-4 py-2 text-center text-sm shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
              <span className="text-green-400 mr-2 font-bold">{'>'}</span>
              <span>{activeHotspot}</span>
          </div>
      )}

      {/* Dialog Overlay */}
      {gameState.isDialogueOpen && (
          <div className="absolute bottom-0 w-full z-50 flex flex-col items-center pb-8 bg-gradient-to-t from-black via-black to-transparent pt-10">
              
              <div 
                className="w-[90%] max-w-3xl bg-black border-2 border-white p-6 mb-4 relative shadow-[0_0_15px_rgba(255,255,255,0.3)] min-h-[200px] flex flex-col justify-between cursor-pointer"
                onClick={handleDialogBoxClick}
              >
                  <div className="absolute -top-3 left-4 bg-black px-2 text-white border border-white text-sm font-bold">
                      {currentLevel.npcName}
                  </div>
                  
                  <div className="text-white text-xl md:text-2xl leading-relaxed tracking-wide font-vt323">
                      {currentDialog && (
                          <Typewriter 
                            key={`${gameState.currentLevelIndex}-${currentDialog.id}`}
                            text={currentDialog.npcText} 
                            speed={30} 
                            forceFinish={forceFinishTyping}
                            onComplete={handleTypingComplete}
                          />
                      )}
                  </div>

                  {/* Options: Rendered ONLY if dialogReady is true */}
                  {dialogReady && currentDialog && (
                      <div className="flex flex-col md:flex-row gap-4 w-full mt-6 animate-[fadeIn_0.5s_ease-in-out]">
                          {currentDialog.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent clicking the dialog box underneath
                                    handleOptionSelect(opt.stance, opt.text);
                                }}
                                className="flex-1 py-3 px-2 font-bold shadow-lg relative group cursor-pointer hover:bg-opacity-80 active:translate-y-1 transition-all"
                                style={{
                                    backgroundColor: 
                                        opt.stance === Stance.MASK ? '#333333' : // Dark Gray
                                        opt.stance === Stance.THORN ? '#8b0000' : // Dark Red
                                        '#00008b', // Dark Blue
                                    color: '#FFFFFF',
                                    border: `2px solid ${
                                        opt.stance === Stance.MASK ? '#808080' : 
                                        opt.stance === Stance.THORN ? '#ff0000' : 
                                        '#0000ff'
                                    }`,
                                    textShadow: '1px 1px 0 #000'
                                }}
                              >
                                  {opt.text}
                              </button>
                          ))}
                      </div>
                  )}
                  
                  {/* Skip Hint */}
                  {!dialogReady && (
                      <div className="absolute bottom-2 right-2 text-gray-600 text-xs animate-pulse">
                          CLICK TO SKIP
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
