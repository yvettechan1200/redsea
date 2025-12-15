// utils/assetLoader.ts

// 1. 定義這兩個名字都有，防止 TypeScript 報錯
export interface GameAssets {
    player: HTMLImageElement;
    npc: HTMLImageElement;  // 新名字
    npc1: HTMLImageElement; // 舊名字 (保留著以免報錯)
    bg1: HTMLImageElement;
    bg2: HTMLImageElement;
    bg3: HTMLImageElement;
}

const ASSET_PATHS = {
    // 2. 加上 ?v=999 強制瀏覽器抓新圖
    player: './assets/npc1.png?v=999', 
    npc:    './assets/npc1.png?v=999',
    bg1:    './assets/bg1.png?v=999',
    bg2:    './assets/bg1.png?v=999', 
    bg3:    './assets/bg1.png?v=999', 
};

export const loadAllAssets = async (): Promise<GameAssets> => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`Failed to load asset: ${src}`); // 這裡會印出網址，方便我們除錯
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

    // 3. 回傳時，讓 npc 和 npc1 指向同一張圖，確保萬無一失
    return { 
        player, 
        npc, 
        npc1: npc, // 關鍵：把 npc 的圖也分給 npc1 用
        bg1, 
        bg2, 
        bg3 
    };
};
