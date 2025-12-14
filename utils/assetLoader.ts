
// utils/assetLoader.ts

export interface GameAssets {
    player: HTMLImageElement;
    npc: HTMLImageElement;
    bg1: HTMLImageElement;
    bg2: HTMLImageElement;
    bg3: HTMLImageElement;
}

const ASSET_PATHS = {
    // 這裡原本是 player_girl.png (找不到)，先改用 npc1.png 頂替！
    player: './assets/npc1.png', 
    
    npc1: './assets/npc1.png',
    
    // 這裡原本是 npc_sprite.png (找不到)，先用 npc1.png 頂替！
    npc2: './assets/npc1.png', 
    npc3: './assets/npc1.png', 
    
    bg1: './assets/bg1.png',
    
    // 這裡原本是 level2/3 (找不到)，先用 bg1.png 頂替！
    bg2: './assets/bg1.png', 
    bg3: './assets/bg1.png', 
};
};

export const loadAllAssets = async (): Promise<GameAssets> => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            // If image is missing (404), we still resolve to prevent game from hanging
            // The canvas will just draw a broken image or nothing, which is handled in canvasEffects
            img.onerror = () => {
                console.warn(`Failed to load asset: ${src}`);
                resolve(img); 
            };
        });
    };

    const [player, npc, bg1, bg2, bg3] = await Promise.all([
        loadImage(ASSET_PATHS.player),
        loadImage(ASSET_PATHS.npc),
        loadImage(ASSET_PATHS.bg1),
        loadImage(ASSET_PATHS.bg2),
        loadImage(ASSET_PATHS.bg3),
    ]);

    return { player, npc, bg1, bg2, bg3 };
};
