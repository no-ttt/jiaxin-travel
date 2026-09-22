export type RacingTrip = {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
};

export const RACING_TRIPS: RacingTrip[] = [
  {
    id: "racing-suzuka-f1",
    image: "/images/racing/card-1.png",
    title: "鈴鹿 F1・日本大獎賽熱血極速",
    description: "極限賽事現場觀戰結合名古屋城市經典體驗，特別安排賽道VIP日與日本工藝自由探索。",
    price: "68,800",
  },
  {
    id: "racing-fuji-speedway",
    image: "/images/racing/card-2.png",
    title: "富士 Speedway・日式賽道巡禮",
    description: "富士國際賽道經典駕馭體驗搭配山中湖溫泉與箱根美景，極致速度與靜謐風景一次完美收藏。",
    price: "58,000",
  },
  {
    id: "racing-monaco-gp",
    image: "/images/racing/card-3.png",
    title: "摩納哥街道賽・地中海奢華蔚藍",
    description: "從傳奇蒙地卡羅街道賽延伸至南法蔚藍海岸，頂級私人遊艇派對，享受賽事與法式度假節奏。",
    price: "118,000",
  },
  {
    id: "racing-monza-f1",
    image: "/images/racing/card-4.png",
    title: "蒙札 F1・米蘭經典設計美學之旅",
    description: "義大利速度殿堂超跑狂飆搭配米蘭時尚城市探索，探訪法拉利故鄉，適合初次賽車旅行家。",
    price: "96,000",
  },
  {
    id: "racing-spa-classic",
    image: "/images/racing/card-5.png",
    title: "斯帕經典賽・比利時小鎮慢活時光",
    description: "森林賽道大膽探險、布魯塞爾與中古世紀修道院城鎮，展開一場兼具歐洲古典與狂熱的賽事之旅。",
    price: "92,500",
  },
  {
    id: "racing-motogp-motegi",
    image: "/images/racing/card-6.png",
    title: "MotoGP 日本站・茂木雙輪巔峰決戰",
    description: "直擊傳奇茂木賽道感受雙輪極限傾角決戰，結合東京近郊散策，專為摩托賽事熱愛者量身打造。",
    price: "62,000",
  },
];
