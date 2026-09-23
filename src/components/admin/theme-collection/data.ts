export type ThemeCollectionTrip = {
  id: string;
  code: string;
  title: string;
  priceFrom: string;
  thumbnail: string;
};

export type ThemeCollectionPage = {
  id: string;
  themeName: string;
  title: string;
  subtitle: string;
  badgeText: string;
  themeColor: string;
  buttonColor: string;
  heroImage: string | null;
  heroImageName: string;
  trips: ThemeCollectionTrip[];
};

export const THEME_COLOR_PRESETS = ["#14111A", "#0A1F3A", "#0B251B", "#370B16", "#1B1B1F"];
export const BUTTON_COLOR_PRESETS = ["#FF5C00", "#0053E0", "#0B9980", "#C99D28", "#BA1B6A"];

export const INITIAL_THEME_COLLECTIONS: Record<string, ThemeCollectionPage> = {
  "theme-1": {
    id: "theme-1",
    themeName: "賽車",
    title: "極限賽道・狂飆之旅",
    subtitle:
      "直擊世界級 F1 與 MotoGP 賽事，感受引擎轟鳴與輪胎摩擦的極限熱血。我們將速度、激情與奢華探索安排進同一段深度旅程。",
    badgeText: "精選賽事 × 深度旅行",
    themeColor: "#14111A",
    buttonColor: "#FF5C00",
    heroImage: null,
    heroImageName: "hero-sportsenergy.jpg",
    trips: [
      {
        id: "trip-1",
        code: "JP-F1-2601",
        title: "鈴鹿 F1・日本大獎賽熱血極速",
        priceFrom: "TWD 68,800 元起",
        thumbnail: "",
      },
      {
        id: "trip-2",
        code: "JP-FSW-2603",
        title: "富士 Speedway・日式賽道巡禮",
        priceFrom: "TWD 58,000 元起",
        thumbnail: "",
      },
    ],
  },
};

export const SEARCHABLE_TRIPS: ThemeCollectionTrip[] = [
  {
    id: "search-1",
    code: "EU-MC-2609",
    title: "摩納哥街道賽・地中海奢華蔚藍",
    priceFrom: "TWD 118,000 元起",
    thumbnail: "",
  },
];
