export type JourneyMedia = {
  id: string;
  caption: string;
  isVideo: boolean;
};

export type JourneyCard = {
  id: string;
  name: string;
  visible: boolean;
  coverLabel: string;
  review: string;
  rating: string;
  albumTitle: string;
  media: JourneyMedia[];
};

export function createJourneyCard(id: string): JourneyCard {
  return {
    id,
    name: "",
    visible: true,
    coverLabel: "",
    review: "",
    rating: "",
    albumTitle: "",
    media: [],
  };
}

export const INITIAL_JOURNEY_CARDS: JourneyCard[] = [
  {
    id: "journey-czech",
    name: "2026/04 捷克蜜月團",
    visible: true,
    coverLabel: "",
    review: "「領隊一路照顧得很細心，整團像朋友一起旅行。」",
    rating: "★★★★★",
    albumTitle: "",
    media: [
      { id: "journey-czech-media-1", caption: "抵達後的第一張全團合照", isVideo: false },
      { id: "journey-czech-media-2", caption: "", isVideo: false },
      { id: "journey-czech-media-3", caption: "夕陽下的薰衣草田", isVideo: false },
      { id: "journey-czech-media-4", caption: "", isVideo: false },
      { id: "journey-czech-media-5", caption: "無人機空拍海岸線", isVideo: true },
      { id: "journey-czech-media-6", caption: "", isVideo: false },
      { id: "journey-czech-media-7", caption: "登船儀式精華片段", isVideo: true },
      { id: "journey-czech-media-8", caption: "峽灣遊船合影", isVideo: false },
      { id: "journey-czech-media-9", caption: "", isVideo: false },
      { id: "journey-czech-media-10", caption: "", isVideo: false },
      { id: "journey-czech-media-11", caption: "火車車廂內合照", isVideo: false },
      { id: "journey-czech-media-12", caption: "郵輪甲板夕陽", isVideo: false },
    ],
  },
  { id: "journey-nordic", name: "2026/03 北歐極光團", visible: true, coverLabel: "", review: "", rating: "", albumTitle: "", media: [] },
  { id: "journey-kyushu", name: "2026/02 九州溫泉團", visible: true, coverLabel: "", review: "", rating: "", albumTitle: "", media: [] },
  { id: "journey-australia", name: "2026/01 澳洲慢旅團", visible: true, coverLabel: "", review: "", rating: "", albumTitle: "", media: [] },
  { id: "journey-switzerland", name: "2025/12 瑞士聖誕團", visible: true, coverLabel: "", review: "", rating: "", albumTitle: "", media: [] },
  { id: "journey-kansai", name: "2025/11 關西賞楓團", visible: true, coverLabel: "", review: "", rating: "", albumTitle: "", media: [] },
  { id: "journey-turkey", name: "2025/10 土耳其深度團", visible: true, coverLabel: "", review: "", rating: "", albumTitle: "", media: [] },
  { id: "journey-iceland", name: "2025/09 冰島環島團", visible: true, coverLabel: "", review: "", rating: "", albumTitle: "", media: [] },
];
