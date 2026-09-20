export type GuaranteedTrip = {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  destination: string;
  departureMonth: string;
  durationDays: number;
};

export const GUARANTEED_TRIPS: GuaranteedTrip[] = [
  {
    id: "hokkaido-winter",
    image: "/images/search-result-hokkaido.png",
    title: "北海道冬日雪國・札幌小樽",
    description: "小樽運河、札幌夜景與溫泉旅宿，冬季出發日期已確認。",
    price: "48,000",
    priceValue: 48000,
    destination: "日本",
    departureMonth: "12 月",
    durationDays: 6,
  },
  {
    id: "kyoto-autumn",
    image: "/images/search-result-kyoto.png",
    title: "京都紅葉・古寺慢旅",
    description: "金閣寺、嵐山與茶道體驗，秋季限定保證出團。",
    price: "38,500",
    priceValue: 38500,
    destination: "日本",
    departureMonth: "11 月",
    durationDays: 5,
  },
  {
    id: "kyushu-onsen",
    image: "/images/guaranteed-kyushu.png",
    title: "九州鐵道・溫泉巡遊",
    description: "由布院之森與別府溫泉，適合秋冬小團旅行。",
    price: "46,500",
    priceValue: 46500,
    destination: "日本",
    departureMonth: "11 月",
    durationDays: 6,
  },
  {
    id: "fuji-art",
    image: "/images/search-result-fuji.png",
    title: "富士五湖・藝術巡禮",
    description: "山中湖與箱根景觀旅宿，賞景路線出發確認。",
    price: "42,000",
    priceValue: 42000,
    destination: "日本",
    departureMonth: "10 月",
    durationDays: 5,
  },
  {
    id: "setouchi-art",
    image: "/images/search-result-setouchi.png",
    title: "瀨戶內海・藝術島嶼",
    description: "直島、豐島與海上移動，精選文化旅程。",
    price: "95,000",
    priceValue: 95000,
    destination: "日本",
    departureMonth: "10 月",
    durationDays: 8,
  },
  {
    id: "okinawa-coral",
    image: "/images/guaranteed-okinawa.png",
    title: "沖繩海島・珊瑚假期",
    description: "海景度假與島嶼慢旅，適合輕鬆小團安排。",
    price: "35,200",
    priceValue: 35200,
    destination: "日本",
    departureMonth: "9 月",
    durationDays: 4,
  },
];
