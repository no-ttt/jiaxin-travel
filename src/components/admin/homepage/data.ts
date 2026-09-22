export type BannerItem = {
  id: string;
  title: string;
  subtitle: string;
  linkUrl: string;
};

export const INITIAL_HOMEPAGE_BANNERS: BannerItem[] = [
  {
    id: "banner-1",
    title: "無限延展的地平線，最完美的出發。",
    subtitle: "專為追求完美的您，打造每一場獨一無二的奢華回憶。",
    linkUrl: "https://www.chiahsintravel.com.tw/promotions/summer-sale",
  },
  {
    id: "banner-2",
    title: "無限延展的地平線，最完美的出發。",
    subtitle: "專為追求完美的您，打造每一場獨一無二的奢華回憶。",
    linkUrl: "https://www.chiahsintravel.com.tw/promotions/summer-sale",
  },
  {
    id: "banner-3",
    title: "無限延展的地平線，最完美的出發。",
    subtitle: "專為追求完美的您，打造每一場獨一無二的奢華回憶。",
    linkUrl: "https://www.chiahsintravel.com.tw/promotions/summer-sale",
  },
];

export type StoryVideo = {
  id: string;
  title: string;
  sourceType: "url" | "upload";
  videoUrl?: string;
};

export const INITIAL_HOMEPAGE_VIDEOS: StoryVideo[] = [
  {
    id: "video-1",
    title: "熱氣球空中探索之旅",
    sourceType: "url",
    videoUrl: "https://www.youtube.com/watch?v=xxxxxxxx",
  },
  {
    id: "video-2",
    title: "合掌村雪景紀行",
    sourceType: "upload",
  },
];

export type FeatureCard = {
  id: string;
  title: string;
  description: string;
};

export const HOMEPAGE_FEATURES: FeatureCard[] = [
  {
    id: "feature-1",
    title: "專屬客製",
    description: "專屬顧問 1 對 1 量身打造，無論家族聚會或企業包團，彈性滿足您的多元需求。",
  },
  {
    id: "feature-2",
    title: "嚴選特色主題",
    description: "精選文化、美食與深度私房特色路線，跳脫傳統走馬看花，帶您玩出不一樣的主題體驗。",
  },
  {
    id: "feature-3",
    title: "全程即時支援",
    description: "旅程中隨時有專人為您排憂解難，突發狀況即時回應，讓您出遊全程踏實又安心。",
  },
];

export type TestimonialItem = {
  id: string;
  name: string;
  tripInfo: string;
  rating: number;
  content: string;
};

export const INITIAL_HOMEPAGE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testimonial-1",
    name: "呂小姐",
    tripInfo: "沖繩三日｜2025 年 9 月",
    rating: 5,
    content: "嘉新服務超好～滑雪之旅，挑戰自己的極限！行程規劃很細心，領隊也很照顧大家。",
  },
  {
    id: "testimonial-2",
    name: "陳小姐",
    tripInfo: "北海道九日｜2025 年 2 月",
    rating: 5,
    content: "人生最難忘的一次北海道之旅～雪景美到炸，行程安排鬆緊適中，非常推薦！",
  },
];

export type AvailableTrip = {
  id: string;
  label: string;
};

// TODO: 待「行程產品管理」模組串接後，改為讀取實際行程產品清單
export const AVAILABLE_TRIPS: AvailableTrip[] = [
  { id: "trip-fuji-art", label: "富士之巔・藝術巡禮　－　NT$42,000 起" },
  { id: "trip-tea-temple", label: "茶道古寺・寧靜漫遊　－　NT$38,500 起" },
  { id: "trip-hokkaido-flower", label: "北海道・花海牧場行　－　NT$45,800 起" },
  { id: "trip-kyushu-onsen", label: "九州鐵道・溫泉巡遊　－　NT$46,500 起" },
  { id: "trip-setouchi-art", label: "瀨戶內海・藝術島嶼　－　NT$95,000 起" },
  { id: "trip-okinawa-coral", label: "沖繩海島・珊瑚假期　－　NT$35,200 起" },
  { id: "trip-czech", label: "布拉格經典・中歐建築巡禮　－　NT$68,000 起" },
  { id: "trip-swiss", label: "瑞士深度・阿爾卑斯山旅　－　NT$88,000 起" },
];

export type CategoryTrip = {
  id: string;
  tripId: string;
};

export type CategoryTab = {
  id: string;
  label: string;
  visible: boolean;
  eyebrow: string;
  trips: CategoryTrip[];
};

export const INITIAL_HOMEPAGE_CATEGORY_TABS: CategoryTab[] = [
  {
    id: "guaranteed-departure",
    label: "保證出團",
    visible: true,
    eyebrow: "GUARANTEED DEPARTURE",
    trips: [
      { id: "trip-1", tripId: "trip-fuji-art" },
      { id: "trip-2", tripId: "trip-tea-temple" },
      { id: "trip-3", tripId: "trip-hokkaido-flower" },
    ],
  },
  {
    id: "curated",
    label: "精緻嚴選",
    visible: true,
    eyebrow: "CURATED SELECTION",
    trips: [],
  },
  {
    id: "theme",
    label: "主題旅遊",
    visible: true,
    eyebrow: "THEME JOURNEY",
    trips: [],
  },
];

export const INITIAL_HOMEPAGE_SEARCH_KEYWORDS = [
  "日本", "韓國", "泰國", "馬來西亞", "美國", "香港澳門",
  "新加坡", "杜拜", "越南", "印尼", "土耳其", "紐西蘭",
];
