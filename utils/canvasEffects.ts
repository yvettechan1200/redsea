
import { GameAssets } from './assetLoader';

// Utility to safely draw image or fallback if missing
const drawSprite = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, fallbackColor: string) => {
    if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, x, y, w, h);
    } else {
        // Fallback for when assets are not yet uploaded
        ctx.fillStyle = fallbackColor;
        ctx.fillRect(x, y, w, h);
    }
};

const drawBackground = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number, fallbackColor: string) => {
    if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, width, height);
    } else {
        // Fallback
        ctx.fillStyle = fallbackColor;
        ctx.fillRect(0, 0, width, height);
    }
}

export const drawStatic = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number = 0.05) => {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + intensity + ')';
    for (let i = 0; i < width * height * 0.005; i++) { 
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillRect(x, y, 2, 2);
    }
};

// ----------------------
// LEVEL 1: THE MOLDY HOME
// ----------------------
export const renderLevel1 = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, assets: GameAssets) => {
    // 1. Background Image
    drawBackground(ctx, assets.bg1, width, height, '#2b2626');

    // Overlay: Dark Gradient to keep the "oppressive" feel even with image
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(43, 38, 38, 0.3)'); 
    grad.addColorStop(1, 'rgba(26, 24, 24, 0.8)'); 
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. NPC: Mom
    const momX = width * 0.35;
    const momY = height * 0.45;
    const momW = width * 0.15; // Slightly wider for sprite aspect ratio
    const momH = height * 0.45;
    
    // Draw NPC Sprite
    drawSprite(ctx, assets.npc, momX, momY, momW, momH, '#0d0d0d');
    
    // Static overlay (Keep the grit)
    drawStatic(ctx, width, height, 0.08);
};

// ----------------------
// LEVEL 2: THE GLITCH MAZE
// ----------------------
export const renderLevel2 = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, assets: GameAssets) => {
    // 1. Background Image
    drawBackground(ctx, assets.bg2, width, height, '#000000');

    // 2. NPC: Scalper Monster (Using generic NPC sprite but glitched)
    const npcX = width * 0.75;
    const npcY = height * 0.45;
    const npcW = width * 0.15;
    const npcH = height * 0.20;

    const offset = Math.sin(time * 0.2) * 5;
    
    // Glitch Effect: Draw sprite multiple times with offset
    ctx.globalAlpha = 0.5;
    ctx.save();
    ctx.translate(offset, 0);
    // Tint red for glitch
    drawSprite(ctx, assets.npc, npcX, npcY, npcW, npcH, 'rgba(255,0,0,0.5)');
    ctx.restore();

    ctx.save();
    ctx.translate(-offset, 0);
    // Tint blue for glitch
    drawSprite(ctx, assets.npc, npcX, npcY, npcW, npcH, 'rgba(0,0,255,0.5)');
    ctx.restore();
    ctx.globalAlpha = 1.0;

    // Main NPC Body
    drawSprite(ctx, assets.npc, npcX, npcY, npcW, npcH, '#FF00FF');
    
    // Digital Scanline overlay
    ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
    for(let y=0; y<height; y+=4) {
        ctx.fillRect(0, y, width, 1);
    }
};

// ----------------------
// LEVEL 3: THE RED SEA
// ----------------------
export const renderLevel3 = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, assets: GameAssets) => {
    // 1. Background Image
    drawBackground(ctx, assets.bg3, width, height, '#300000');

    // Overlay: Red Filter
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(0,0,0,0.2)'); 
    grad.addColorStop(1, 'rgba(139, 0, 0, 0.5)'); 
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. The Eye (Keep this procedural as it animates specifically)
    const eyeY = height * 0.25;
    const eyeOpen = 0.5 + Math.sin(time * 0.001) * 0.2; 
    
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FF0000';
    
    ctx.beginPath();
    ctx.ellipse(width/2, eyeY, 120, 60 * eyeOpen, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#550000';
    ctx.beginPath();
    ctx.arc(width/2, eyeY, 25, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3. NPC: Shadow Self (Uses Player Sprite)
    const npcX = width * 0.5 - (width * 0.05);
    const npcY = height * 0.55; 
    const npcW = width * 0.1;
    const npcH = height * 0.2;

    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 10;
    // Draw player sprite as silhouette (Shadow Self)
    // We assume the player sprite is loaded.
    drawSprite(ctx, assets.player, npcX, npcY + Math.sin(time*0.002)*10, npcW, npcH, '#000');
    
    ctx.shadowBlur = 0;
};
