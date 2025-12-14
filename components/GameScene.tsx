
import React, { useRef, useEffect } from 'react';
import { renderLevel1, renderLevel2, renderLevel3 } from '../utils/canvasEffects';
import { GameAssets } from '../utils/assetLoader';

interface GameSceneProps {
  levelId: number;
  assets: GameAssets;
}

const GameScene: React.FC<GameSceneProps> = ({ levelId, assets }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ------------------------------------------------
  // 1. Canvas Render Loop: Atmosphere & Background
  // ------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = Date.now();

    const render = () => {
      const time = Date.now() - startTime;
      const width = canvas.width;
      const height = canvas.height;

      // CLEAR CANVAS (Crucial for ensuring no artifacts between levels)
      ctx.clearRect(0, 0, width, height);

      // STRICT SWITCH FOR ATMOSPHERE
      if (levelId === 1) {
          renderLevel1(ctx, width, height, time, assets);
      } else if (levelId === 2) {
          renderLevel2(ctx, width, height, time, assets);
      } else if (levelId === 3) {
          renderLevel3(ctx, width, height, time, assets);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);
    handleResize(); 

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [levelId, assets]);

  // ------------------------------------------------
  // 2. DOM Render Logic: Physical Obstacles & Walls
  // ------------------------------------------------
  const renderWalls = () => {
    // Level 1: 窒息溫室 
    // Removed old CSS block placeholders because we are now using a detailed pixel art background image.
    if (levelId === 1) {
      return null;
    }

    // Level 2: 數位垃圾迷宮 - 霓虹彈窗與混亂線條
    else if (levelId === 2) {
      return (
        <>
          {/* 彈出視窗 1: 擋住視線 */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '12%',
            width: '220px',
            height: '100px',
            backgroundColor: '#FF00FF',
            border: '2px dotted #00FF00',
            animation: 'blink 0.2s infinite alternate',
            boxShadow: '0 0 15px #FF00FF',
            zIndex: 20,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }}>
             System_Failure
          </div>

          {/* 彈出視窗 2: 旋轉 */}
          <div style={{
            position: 'absolute',
            bottom: '40%',
            right: '20%',
            width: '180px',
            height: '120px',
            backgroundColor: 'black',
            border: '3px solid #00FF00',
            transform: 'rotate(-5deg)',
            boxShadow: '5px 5px 0px rgba(0,255,0,0.5)',
            zIndex: 15
          }}>
             <div style={{ backgroundColor: '#00FF00', color: 'black', padding: '2px', fontSize: '10px' }}>ADVERTISEMENT</div>
          </div>
        </>
      );
    }

    // Level 3: 紅海 - 虛無 (無牆壁)
    else if (levelId === 3) {
      return (
        <>
          {/* 懸崖邊界 */}
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '0',
            width: '100%',
            height: '20%',
            background: 'linear-gradient(to top, #000 0%, transparent 100%)',
            borderTop: '3px solid #500000',
            zIndex: 5,
            pointerEvents: 'none'
          }} />

          {/* 漂浮的殘骸 */}
          <div style={{
            position: 'absolute',
            bottom: '35%',
            left: '25%',
            width: '40px',
            height: '40px',
            border: '2px solid #6b0000',
            transform: 'rotate(25deg)',
            opacity: 0.6,
            zIndex: 4
          }} />
        </>
      );
    }

    return null;
  };

  return (
    <div className="absolute inset-0 w-full h-full">
        {/* Background Canvas (Atmosphere) */}
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />
        
        {/* DOM Walls Overlay (Interactive/Visual Obstacles) */}
        <div className="absolute inset-0 pointer-events-none z-10">
            {renderWalls()}
        </div>
    </div>
  );
};

export default GameScene;
