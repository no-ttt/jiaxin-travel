export type JourneyLayout = "hero" | "tall" | "small" | "wide";

export type JourneyAlbumPhoto = {
  image: string;
  title: string;
  description: string;
};

export type JourneyStory = {
  id: string;
  title: string;
  quote: string;
  image: string;
  layout: JourneyLayout;
  hasVideo?: boolean;
  album?: JourneyAlbumPhoto[];
};

export const JOURNEY_STORIES: JourneyStory[] = [
  {
    id: "czech-2026-04",
    title: "2026/04 捷克蜜月團",
    quote: "「領隊一路照顧得很細心，整團像朋友一起旅行。」",
    image: "/images/journey-1-czech.png",
    layout: "hero",
    album: [
      {
        image: "/images/journey-1-czech.png",
        title: "抵達後的第一張全團合照",
        description: "旅程才剛開始，大家已經很自然地靠在一起。領隊在第一天就替全團留下了這張最有「出發感」的照片。",
      },
      {
        image: "/images/journey-2-nordic.png",
        title: "布拉格查理大橋日落",
        description: "傍晚時分走上查理大橋，夕陽灑落在伏爾塔瓦河上，為蜜月旅程增添了浪漫的一刻。",
      },
      {
        image: "/images/journey-3-kyushu.png",
        title: "克倫洛夫小鎮街景",
        description: "彩色屋頂與蜿蜒石板路交織成童話般的畫面，全團在此留下最悠閒的午後時光。",
      },
    ],
  },
  {
    id: "nordic-2026-03",
    title: "2026/03 北歐極光團",
    quote: "「每天都有驚喜，最難忘的是大家一起等極光的晚上。」",
    image: "/images/journey-2-nordic.png",
    layout: "tall",
    hasVideo: true,
  },
  {
    id: "kyushu-2026-02",
    title: "2026/02 九州溫泉團",
    quote: "「行程步調剛剛好，長輩也玩得很開心。」",
    image: "/images/journey-3-kyushu.png",
    layout: "small",
  },
  {
    id: "australia-2026-01",
    title: "2026/01 澳洲慢旅團",
    quote: "「第一次跟團也很自在，很多細節都替我們想到了。」",
    image: "/images/journey-4-australia.png",
    layout: "wide",
  },
  {
    id: "swiss-2025-12",
    title: "2025/12 瑞士聖誕團",
    quote: "「照片拍得很美，回家後還一直在群組分享回憶。」",
    image: "/images/journey-5-swiss.png",
    layout: "wide",
  },
  {
    id: "kansai-2025-11",
    title: "2025/11 關西賞楓團",
    quote: "「大家從陌生到最後一起約下次旅行，真的很難得。」",
    image: "/images/journey-6-kansai.png",
    layout: "small",
    hasVideo: true,
  },
  {
    id: "turkey-2025-10",
    title: "2025/10 土耳其深度團",
    quote: "「領隊很會帶氣氛，每張大合照都看得出大家有多開心。」",
    image: "/images/journey-7-turkey.png",
    layout: "tall",
  },
  {
    id: "iceland-2025-09",
    title: "2025/09 冰島環島團",
    quote: "「旅途中遇到的小狀況都有被好好處理，玩得很安心。」",
    image: "/images/journey-8-iceland.png",
    layout: "hero",
  },
  {
    id: "hokkaido-2025-08",
    title: "2025/08 北海道花季團",
    quote: "「大家一路聊天拍照，回來後群組還是很熱鬧。」",
    image: "/images/journey-9-hokkaido.png",
    layout: "hero",
  },
  {
    id: "nordic-fjord-2025-07",
    title: "2025/07 北歐峽灣團",
    quote: "「景色很震撼，領隊安排的節奏也很舒服。」",
    image: "/images/journey-10-nordic-fjord.png",
    layout: "tall",
  },
  {
    id: "france-2025-06",
    title: "2025/06 法國南部慢旅",
    quote: "「每天都留有自由時間，旅行起來很有餘裕。」",
    image: "/images/journey-11-france.png",
    layout: "small",
  },
  {
    id: "setouchi-2025-05",
    title: "2025/05 日本瀨戶內團",
    quote: "「小團移動很輕鬆，同行長輩也覺得自在。」",
    image: "/images/journey-12-setouchi.png",
    layout: "wide",
  },
  {
    id: "kyushu-rail-2025-03",
    title: "2025/03 九州鐵道團",
    quote: "「搭車與換宿都有人協助，整趟旅程很安心。」",
    image: "/images/journey-13-kyushu-rail.png",
    layout: "hero",
  },
  {
    id: "spain-2025-04",
    title: "2025/04 西班牙春日團",
    quote: "「城市和小鎮的比例剛剛好，照片每張都很喜歡。」",
    image: "/images/journey-14-spain.png",
    layout: "tall",
  },
];
