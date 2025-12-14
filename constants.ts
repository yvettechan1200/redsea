
import { LevelData, Stance } from './types';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "Level 1: 擁擠的舊公寓 (The Cramped Apartment)",
    themeColor: "orange", // Dirty yellow/orange vibe
    npcName: "疲憊的母親",
    // Converted from x:430, y:220, w:110, h:160 (Reference: 640x480)
    npcPosition: { x: 67, y: 46, w: 17, h: 33 }, 
    hotspots: [
      { 
        id: 'h1-1', x: 17, y: 21, label: '舊電扇', 
        baseDescriptions: [
          '扇葉上積滿了灰塵...', 
          '它發出快要壞掉的聲音，但沒人想去修它。',
          '轉動的時候像是在嘆氣。'
        ]
      },
      { 
        id: 'h1-2', x: 34, y: 42, label: '雜物餐桌', 
        baseDescriptions: [
          '桌上都是沒吃完的便當和藥袋。', 
          '那是... 過期的折價券嗎？',
          '這張桌子很久沒有乾淨過了，就像我的心情。'
        ]
      },
      { 
        id: 'h1-3', x: 72, y: 8, label: '神桌', 
        baseDescriptions: [
          '紅色的燈光在昏暗的房間裡顯得很刺眼。', 
          '神明真的有在看嗎？',
          '供品上的橘子好像發霉了。'
        ],
        conditionalDescriptions: [
          {
            text: '連神明都被困在這個家裡出不去。 (Thorn > 1.0)',
            threshold: { stat: Stance.THORN, value: 1.0 }
          }
        ]
      },
      { 
        id: 'h1-4', x: 55, y: 58, label: '手機', 
        baseDescriptions: [
          '螢幕亮著，有未讀訊息。', 
          '『記得去繳費』... 是媽媽傳來的，明明她就坐在旁邊。',
          '它在桌上震動，像一隻焦慮的蟲。'
        ],
        conditionalDescriptions: [
          {
            text: '我想把它摔爛。切斷所有連結。 (Void > 1.0)',
            threshold: { stat: Stance.VOID, value: 1.0 }
          }
        ]
      },
      { 
        id: 'h1-5', x: 20, y: 48, label: '菸灰缸', 
        baseDescriptions: [
          '菸蒂已經堆成一座小山了。', 
          '空氣中瀰漫著散不去的焦油味。',
          '這是父親燃燒生命剩下的灰燼。'
        ]
      },
      { 
        id: 'h1-6', x: 8, y: 79, label: '父親', 
        baseDescriptions: [
          '他背對著你蜷縮在床上...', 
          '無論你說什麼，他都不會回頭。',
          '他看起來像是一堆舊衣服，而不是一個人。'
        ]
      },
      { 
        id: 'h1-7', x: 12, y: 46, label: '電視機', 
        baseDescriptions: [
          '這裡沒有訊號。', 
          '就像這個家一樣，只有雜訊。',
          '以前我們會在電視前一起笑，那是什麼時候的事了？'
        ]
      },
      { 
        id: 'h1-8', x: 90, y: 60, label: '舊門', 
        baseDescriptions: [
          '門外傳來鄰居的吵架聲。', 
          '這扇門擋不住任何東西。',
          '把手生鏽了，有一股鐵腥味。'
        ]
      },
      { 
        id: 'h1-9', x: 16, y: 62, label: '黃色襯衫', 
        baseDescriptions: [
          '掛在椅背上的制服。', 
          '看起來很久沒洗了。',
          '那是我的「乖孩子」戲服。'
        ],
        conditionalDescriptions: [
          {
            text: '我不想再穿上它了。 (Thorn > 2.0)',
            threshold: { stat: Stance.THORN, value: 2.0 }
          }
        ]
      },
      { 
        id: 'h1-10', x: 25, y: 20, label: '牆上的鏡子', 
        baseDescriptions: [
          '鏡子裡映照出這個擁擠的房間。',
          '我看不到我自己，只看到家具的倒影。'
        ]
      },
    ],
    dialogs: [
      {
        id: '1-1',
        npcText: '回來了？桌上有魚，市場快收攤時買的，比較便宜，趁熱吃。我有把刺挑乾淨了... 應該吧。唉，今天腰好痛。',
        options: [
          { text: '謝謝媽。', stance: Stance.MASK },
          { text: '又是魚？', stance: Stance.THORN },
          { text: '(默默坐下)', stance: Stance.VOID },
        ]
      },
      {
        id: '1-2',
        npcText: '隔壁陳阿姨說她兒子畢業後一個月給家裡三萬。我沒有要你給錢，我只希望你爭氣一點。我們家不像人家有背景，你只能靠自己，知道嗎？',
        options: [
          { text: '我知道，我會努力。', stance: Stance.MASK },
          { text: '別拿我跟別人比。', stance: Stance.THORN },
          { text: '三萬... 好遙遠。', stance: Stance.VOID },
        ]
      },
      {
        id: '1-3',
        npcText: '你看你爸，整天只知道對著電腦，家裡的事都要我一個人扛。我為了這個家，連一件新衣服都不敢買，牙齒痛也不敢去看醫生...',
        options: [
          { text: '媽妳辛苦了...', stance: Stance.MASK },
          { text: '那妳去跟他說啊！', stance: Stance.THORN },
          { text: '......', stance: Stance.VOID },
        ]
      },
      {
        id: '1-4',
        npcText: '你那是什麼表情？覺得我很煩是不是？媽媽這麼努力是為了誰？我這輩子都毀在你們父女手裡了，你為什麼還要這樣對我？',
        options: [
          { text: '我沒有覺得妳煩...', stance: Stance.MASK },
          { text: '不要把氣出在我身上！', stance: Stance.THORN },
          { text: '毀了就毀了吧。', stance: Stance.VOID },
        ]
      },
      {
        id: '1-5',
        npcText: '算了... 反正我就是命苦。沒人懂我，連自己生的小孩都看不起我。你去睡覺吧，別管我死活。',
        options: [
          { text: '...', stance: Stance.MASK }, 
          { text: '...', stance: Stance.THORN }, 
          { text: '...', stance: Stance.VOID }, 
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Level 2: 數位垃圾迷宮 (The Glitch Maze)",
    themeColor: "magenta",
    npcName: "黃牛怪人",
    npcPosition: { x: 75, y: 45, w: 15, h: 20 }, // Right side
    hotspots: [
      { 
        id: 'h2-1', x: 20, y: 50, label: '擋路看板', 
        baseDescriptions: [
          '『我要做愛！』口號寫得很大，但擋住了唯一的路。',
          '『一鍵致富！』、『快速瘦身！』... 這些字體大到像在對我吼叫。',
          '它在閃爍。每閃一次，我的偏頭痛就加重一點。'
        ]
      },
      { 
        id: 'h2-2', x: 50, y: 80, label: '心碎按鈕', 
        baseDescriptions: [
          '地上一堆碎掉的紅色愛心。踩過去會有碎玻璃的聲音。',
          '這些愛心原本是用來點讚的嗎？現在看起來像血漬。',
          '撿起來會割傷手。廉價的愛也會傷人。'
        ]
      },
      { 
        id: 'h2-3', x: 80, y: 20, label: '驗證碼牆', 
        baseDescriptions: [
          '牆上寫著『請選出含有紅綠燈的圖片』。我看不懂。我是機器人嗎？',
          '我點了消防栓，但它說我錯了。我也覺得我錯了，我不該在這裡。',
          '永遠都在驗證。驗證我是不是人類，驗證我有沒有資格活著。'
        ]
      },
      { 
        id: 'h2-4', x: 30, y: 40, label: '網紅屍體', 
        baseDescriptions: [
          '一具像素屍體，手裡還握著自拍棒。旁邊有幾個讚。',
          '他的濾鏡還沒關掉，所以臉色看起來還是粉紅色的。',
          '直到死前一刻，他都在擔心鏡頭角度好不好看。'
        ]
      },
      { 
        id: 'h2-5', x: 60, y: 60, label: '限量空盒', 
        baseDescriptions: [
          '包裝很精美，裡面是空氣。上面印著『環保材質』。',
          '買櫝還珠。現代版。',
          '只要貼上「限量」兩個字，垃圾也能變成黃金。'
        ],
        conditionalDescriptions: [
          {
            text: '我曾經也排隊買過這種東西。那時候我覺得自己擁有了世界。 (Mask > 2.0)',
            threshold: { stat: Stance.MASK, value: 2.0 }
          }
        ]
      },
      { 
        id: 'h2-6', x: 10, y: 70, label: '斷掉坡道', 
        baseDescriptions: [
          '坡道蓋到一半就斷了。下面是懸崖。這就是所謂的友善空間。',
          '這是一個無障礙坡道，通往地獄。',
          '看起來像是一個未完成的專案，被開發者遺棄了。'
        ]
      },
      { 
        id: 'h2-7', x: 90, y: 80, label: 'Loading圈', 
        baseDescriptions: [
          '轉啊轉。我看著它轉了三分鐘，什麼都沒發生。',
          '它在緩衝我的人生嗎？',
          '這是世界上最令人焦慮的幾何圖形。'
        ]
      },
      { 
        id: 'h2-8', x: 40, y: 20, label: '社交面具', 
        baseDescriptions: [
          '掛在牆上。笑得很僵硬。戴上去就不用解釋為什麼不開心了。',
          '有很多種款式：「積極向上」、「感恩惜福」、「歲月靜好」。',
          '背面全是汗漬和淚痕。'
        ],
        conditionalDescriptions: [
          {
            text: '這不就是我的臉嗎？我已經拔不下來了。 (Mask > 3.0)',
            threshold: { stat: Stance.MASK, value: 3.0 }
          }
        ]
      },
      { 
        id: 'h2-9', x: 70, y: 90, label: '垃圾山', 
        baseDescriptions: [
          '外送留下的。堆得比人還高。生活便利的代價。',
          '裡面混著沒吃完的沙拉和過期的夢想。',
          '塑膠吸管插在一隻死掉的海龜圖片上。多麼諷刺。'
        ]
      },
      { 
        id: 'h2-10', x: 85, y: 40, label: '付費電子欄', 
        baseDescriptions: [
          '上面跑馬燈寫著『非會員請勿進入』、『付費解鎖更多劇情』。',
          '連同情心都需要訂閱制了嗎？',
          '我不想解鎖。我只想登出。'
        ]
      },
    ],
    dialogs: [
      {
        id: '2-1',
        npcText: '欸欸！看這邊！青春限定版小卡！雖然裡面只是空氣，但包裝是全像雷射的喔！現在網路上炒到兩千了，你要不要？',
        options: [
          { text: '好像很厲害...', stance: Stance.MASK },
          { text: '這是垃圾。', stance: Stance.THORN },
          { text: '我沒錢。', stance: Stance.VOID },
        ]
      },
      {
        id: '2-2',
        npcText: '大家都有欸！隔壁那個誰買了三組！如果你沒有，去學校或是上網怎麼跟人家搭話？你會變成邊緣人喔？你是邊緣人嗎？',
        options: [
          { text: '幫我留一組...', stance: Stance.MASK },
          { text: '邊緣人又怎樣。', stance: Stance.THORN },
          { text: '我本來就是。', stance: Stance.VOID },
        ]
      },
      {
        id: '2-3',
        npcText: '你不是說你愛他嗎？愛就要花錢啊！不花錢算什麼愛？你的愛就這麼廉價嗎？刷卡！快點刷卡證明你的信仰！',
        options: [
          { text: '(掏出信用卡)', stance: Stance.MASK },
          { text: '愛不是交易！', stance: Stance.THORN },
          { text: '什麼是愛？', stance: Stance.VOID },
        ]
      },
      {
        id: '2-4',
        npcText: '不買這個... 那你還剩下什麼？你的塗鴉牆要發什麼？你有什麼價值？你只是一個沒有流量的數據！買了它，你才會發光啊！',
        options: [
          { text: '我想發光...', stance: Stance.MASK },
          { text: '我不想發光。', stance: Stance.THORN },
          { text: '數據也會死嗎？', stance: Stance.VOID },
        ]
      },
      {
        id: '2-5',
        npcText: '（臉部開始融化，流出黑水）買吧... 拜託你買吧... 如果你不買，我就沒有業績... 我就會被系統刪除... 救救我... 我不想消失...',
        options: [
          { text: '...', stance: Stance.MASK }, 
          { text: '...', stance: Stance.THORN }, 
          { text: '...', stance: Stance.VOID }, 
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Level 3: 紅海 (The Red Sea)",
    themeColor: "red",
    npcName: "黑影 (你自己)",
    npcPosition: { x: 50, y: 55, w: 10, h: 20 }, // Center, below the eye
    hotspots: [
      { 
        id: 'h3-1', x: 20, y: 60, label: '摩斯紅茶', 
        baseDescriptions: [
          '裡面剩一口。苦的。網路上說抽菸會讓味覺變鈍，看來是真的。',
          '杯子上的水珠流下來，像眼淚。',
          '這是今天唯一的熱量來源。'
        ]
      },
      { 
        id: 'h3-2', x: 40, y: 75, label: '驗光單', 
        baseDescriptions: [
          '揉成一團丟在地上。上面的數字在嘲笑我對醫生說謊。',
          '散光加重了。世界越來越模糊，也許這樣比較好。',
          '這張紙證明了我的眼睛壞了，還是心壞了？'
        ]
      },
      { 
        id: 'h3-3', x: 50, y: 20, label: '巨大的眼睛', 
        baseDescriptions: [
          '別再看了。我知道我很渺小。不要用那種上帝的視角看我。',
          '它沒有眼皮，不會眨眼。它看盡了一切醜陋。',
          '那是誰的眼睛？是社會？是父母？還是未來的我？'
        ]
      },
      { 
        id: 'h3-4', x: 80, y: 50, label: '紅色海浪', 
        baseDescriptions: [
          '像湯。像血。像羊水。跳下去應該很溫暖吧。',
          '它在呼吸。起伏。像一個巨大的肺。',
          '這不是水。這是所有無法被消化的情緒。'
        ],
        conditionalDescriptions: [
          {
            text: '來吧。回到最原始的狀態。溶解吧。 (Void > 3.0)',
            threshold: { stat: Stance.VOID, value: 3.0 }
          }
        ]
      },
      { 
        id: 'h3-5', x: 30, y: 85, label: '熄滅的菸蒂', 
        baseDescriptions: [
          '這是我留下的痕跡嗎？真噁心。',
          '濾嘴被咬扁了。焦慮的形狀。',
          '它已經濕透了，點不起來了。'
        ],
        conditionalDescriptions: [
          {
            text: '再抽一根吧。反正肺已經黑了，心也是。 (Void > 2.0)',
            threshold: { stat: Stance.VOID, value: 2.0 }
          }
        ]
      },
      { 
        id: 'h3-6', x: 60, y: 80, label: '岸邊的石頭', 
        baseDescriptions: [
          '很尖銳。坐起來不舒服。但比家裡的沙發真實。',
          '上面有紅色的苔蘚。看起來像是受傷結痂。',
          '摸起來冰冷。沒有溫度。'
        ]
      },
      { 
        id: 'h3-7', x: 15, y: 40, label: '塑膠椅', 
        baseDescriptions: [
          '第一場景的椅子漂過來了。連這裡都逃不掉物質的追殺。',
          '它浮浮沉沉，像是不甘心沉下去。',
          '紅色的海配紅色的塑膠椅。絕配。'
        ]
      },
      { 
        id: 'h3-8', x: 85, y: 25, label: '遠方的閃電', 
        baseDescriptions: [
          '要下雨了。台北的雨，又濕又黏。',
          '只有光，沒有聲音。這是默劇嗎？',
          '那道光把天空撕裂了。我也想被撕裂。'
        ],
        conditionalDescriptions: [
          {
            text: '劈死我吧。拜託。 (Thorn > 3.0)',
            threshold: { stat: Stance.THORN, value: 3.0 }
          }
        ]
      },
      { 
        id: 'h3-9', x: 90, y: 70, label: '登出鍵', 
        baseDescriptions: [
          '懸崖邊有個實體的按鈕。上面寫著『LOGOUT』。',
          '真的可以離開嗎？還是這只是另一個陷阱？',
          '按下去，就不用再演戲了。'
        ]
      },
      { 
        id: 'h3-10', x: 50, y: 90, label: '你的手', 
        baseDescriptions: [
          '看著自己的像素手掌。正在慢慢溶解。',
          '握不住任何東西。連自己都握不住。',
          '這雙手做過什麼有意義的事嗎？我想不起來。'
        ]
      },
    ],
    dialogs: [
      {
        id: '3-1',
        npcText: '摩斯紅茶好苦。網路上說抽菸會讓味覺變鈍，看來是真的。左眼的隱形眼鏡好像乾掉了，好痛。你有感覺嗎？',
        options: [
          { text: '有點痛。', stance: Stance.MASK },
          { text: '痛才代表活著。', stance: Stance.THORN },
          { text: '麻痺了。', stance: Stance.VOID },
        ]
      },
      {
        id: '3-2',
        npcText: '剛剛驗光的時候，醫生問我缺口在哪，我說右邊。其實我什麼都看不到，我只是不想讓他覺得我度數又加深了。我們是不是一直在說謊？',
        options: [
          { text: '為了生存。', stance: Stance.MASK },
          { text: '我不想再說謊了。', stance: Stance.THORN },
          { text: '謊言比較溫柔。', stance: Stance.VOID },
        ]
      },
      {
        id: '3-3',
        npcText: '這裡訊號很差 (No Service)。沒有媽媽的訊息，沒有信用卡的帳單，沒有限量小卡。沒有人找得到我們。你會害怕這種安靜嗎？',
        options: [
          { text: '有點不習慣。', stance: Stance.MASK },
          { text: '這是我要的。', stance: Stance.THORN },
          { text: '安靜很好。', stance: Stance.VOID },
        ]
      },
      {
        id: '3-4',
        npcText: '還要繼續演嗎？演一個乖孩子，演一個合群的粉絲，演一個對未來有希望的大學生？劇本好長，我好累。我的腳好重。',
        options: [
          { text: '再撐一下吧。', stance: Stance.MASK },
          { text: '劇本爛透了。', stance: Stance.THORN },
          { text: '睡著就不累了。', stance: Stance.VOID },
        ]
      },
      {
        id: '3-5',
        npcText: '你看這海。紅色的，像羊水。跳下去可能會很冷，也可能很溫暖。懸崖邊有個按鈕... 這是最後一次選擇了。',
        options: [
          { text: '回去吧，明天還要上課。', stance: Stance.MASK },
          { text: '不演了。我去睡覺。', stance: Stance.THORN },
          { text: '再抽一根就好。', stance: Stance.VOID },
        ]
      }
    ]
  }
];
