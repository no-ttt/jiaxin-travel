export type MeianTrip = {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
};

export const MEIAN_TRIPS: MeianTrip[] = [
  {
    id: "meian-hokkaido-winter",
    image: "/images/guaranteed-hero.png",
    title: "北海道冬日雪國・札幌小樽",
    description: "小樽運河、札幌夜景與溫泉旅宿，冬季出發日期已確認。",
    price: "48,000",
  },
  {
    id: "meian-kyoto-autumn",
    image: "/images/search-result-kyoto.png",
    title: "京都紅葉・古寺慢旅",
    description: "金閣寺、嵐山與茶道體驗，秋季限定保證出團。",
    price: "38,500",
  },
  {
    id: "meian-kyushu-onsen",
    image: "/images/guaranteed-kyushu.png",
    title: "九州鐵道・溫泉巡遊",
    description: "由布院之森與別府溫泉，適合秋冬小團旅行。",
    price: "46,500",
  },
  {
    id: "meian-fuji-art",
    image: "/images/search-result-fuji.png",
    title: "富士五湖・藝術巡禮",
    description: "山中湖與箱根景觀旅宿，賞景路線出發確認。",
    price: "42,000",
  },
  {
    id: "meian-setouchi-art",
    image: "/images/search-result-setouchi.png",
    title: "瀨戶內海・藝術島嶼",
    description: "直島、豐島與海上移動，精選文化旅程。",
    price: "95,000",
  },
  {
    id: "meian-okinawa-coral",
    image: "/images/guaranteed-okinawa.png",
    title: "沖繩海島・珊瑚假期",
    description: "海景度假與島嶼慢旅，適合輕鬆小團安排。",
    price: "35,200",
  },
];
