// utils/assetLoader.ts

export interface GameAssets {
    player: HTMLImageElement;
    npc: HTMLImageElement;
    bg1: HTMLImageElement;
    bg2: HTMLImageElement;
    bg3: HTMLImageElement;
}

const ASSET_PATHS = {
    // 為了測試，全部先指向你現有的 npc1.png 和 bg1.png
    player: './assets/npc1.png', 
    
    // 修正：這裡改成 'npc'，才能跟下面的 loadAllAssets 對應
    npc: './assets/npc1.png', 
    
    bg1: './assets/bg1.png',
    bg2: './assets/bg1.png', 
    bg3: './assets/bg1.png', 
};

export const loadAllAssets = async (): Promise<GameAssets> => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            // 即使圖片找不到 (404)，也強制 resolve，避免遊戲卡死
            img.onerror = () => {
                console.warn(`Failed to load asset: ${src}`);
                resolve(img); 
            };
        });
    };

    const [player, npc, bg1, bg2, bg3] = await Promise.all([
        loadImage(ASSET_PATHS.player),
        loadImage(ASSET_PATHS.npc), // 現在這裡找得到了
        loadImage(ASSET_PATHS.bg1),
        loadImage(ASSET_PATHS.bg2),
        loadImage(ASSET_PATHS.bg3),
    ]);

    return { player, npc, bg1, bg2, bg3 };
};
