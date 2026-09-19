import type { TripDetail } from "./types";

export const NORDIC_TRIP: TripDetail = {
  id: "nordic-4",
  title: "北歐四國超值選～挪威峽灣區、縮影高山火車、波羅的海遊輪、峽灣精選飯店13日",
  groupCode: "ENB062013EK6",
  heroImage: "/images/trip-detail/trip-hero-56586a.png",
  durationDays: 13,
  departureCity: "台北",
  tags: ["含稅", "含導覽耳機", "無自費", "贈多項好禮", "含上網卡"],
  startDate: "2026/06/20",
  deposit: "50,000",
  guaranteedDeparture: true,
  highlights: [
    "峽灣雙遊船+波羅的海遊輪+卑爾根纜車",
    "挪威雙峽灣:松恩峽灣+蓋倫格峽灣",
    "中段飛機+縮影高山火車",
  ],
  price: "159,900",
  flights: [
    {
      direction: "去程",
      date: "2026 / 06 / 20（六）",
      airline: "阿聯酋航空",
      flightNumber: "EK367",
      departTime: "23:50",
      departCity: "台北（桃園）",
      arriveTime: "04:35",
      arriveCity: "杜拜",
      nextDay: true,
    },
    {
      direction: "去程",
      date: "2026 / 06 / 21（日）",
      airline: "阿聯酋航空",
      flightNumber: "EK157",
      departTime: "08:45",
      departCity: "杜拜",
      arriveTime: "13:45",
      arriveCity: "斯德哥爾摩",
    },
    {
      direction: "去程",
      date: "2026 / 06 / 21（日）",
      airline: "芬蘭航空",
      flightNumber: "AY805",
      departTime: "08:05",
      departCity: "赫爾辛基",
      arriveTime: "10:05",
      arriveCity: "卑爾根",
    },
    {
      direction: "回程",
      date: "2026 / 06 / 21（日）",
      airline: "阿聯酋航空",
      flightNumber: "EK152",
      departTime: "15:15",
      departCity: "哥本哈根",
      arriveTime: "23:45",
      arriveCity: "杜拜",
    },
    {
      direction: "回程",
      date: "2026 / 06 / 21（日）",
      airline: "阿聯酋航空",
      flightNumber: "EK366",
      departTime: "03:45",
      departCity: "杜拜",
      arriveTime: "16:15",
      arriveCity: "台北（桃園）",
    },
  ],
  featureBlocks: [
    {
      id: "hotel",
      title: "帛琉飯店(經典大床/雅致雙床/仨人客房；全館免費WIFI)",
      paragraphs: [
        "現場打卡即可獲得專屬好禮-帛琉限定帆布袋乙個(價值台幣400元)，數量有限送完為止。\n註：飯店保留變更、修改、取消本活動內容之權利。",
        "Palau Hotel 座落於享有世界七大潛點盛名的美麗海島國家「帛琉 Palau」的心臟地區：克羅市中心。在這個碧水藍天與細沙茂林的自然環境裡，Palau Hotel還兼具著得天獨厚的人為地理優勢：酒店高層眺望海天相接，洛克群島盡收眼底；下樓正面與帛琉最大的百貨WTCT隔街相望；與羅曼墨圖國際機場也僅有15分鐘的車距。交通便利，景色宜人，絕對是旅遊觀光住宿的不二選擇。",
      ],
      images: ["/images/trip-detail/hotel-single.png"],
      caption: "詩麗雅號遊輪／圖片僅供行程內容說明。",
    },
    {
      id: "transport",
      title: "交通說明",
      paragraphs: [
        "詩麗雅號遊輪｜斯德哥爾摩～赫爾新基；兩人一室・面海外艙\n1990年建造的巨大遊輪，進水量5萬8千4百噸，全長203公尺，內有各種商店、餐廳、咖啡廳等。",
        "挪威縮影高山火車｜麥道爾＋佛萊姆\n1940年八月一日正式通車，通車後立刻躍升為歐洲頂級景觀鐵路。",
      ],
      images: [
        "/images/trip-detail/transport-1.png",
        "/images/trip-detail/transport-2.png",
        "/images/trip-detail/transport-3.png",
      ],
      caption: "含導覽耳機／圖片僅供行程內容說明。",
    },
  ],
  moreFeatures: [
    "挪威鮮魚風味餐",
    "丹麥BBQ自助餐（含一杯軟飲）",
    "北歐雞肉風味餐",
    "北歐豬肉風味餐",
    "中西式自助餐",
    "中式七菜一湯＋水果",
  ],
  specs: [
    {
      id: "headset",
      title: "含導覽耳機",
      description:
        "1. 全程導覽耳機每人一副，保證使用全新耳塞式耳機，不重覆使用，無衛生的疑慮；行程結束後，您可帶回家繼續使用。\n2. 耳機主機體及隨身收納袋請於返國時交還給導遊人員。\n3. 如有遺失之狀況，需賠償每台機器費用 NT2000 元。",
    },
    {
      id: "gifts",
      title: "贈多項好禮",
      description: "1. 行李束帶每人一條（恕不挑色）。\n2. 轉接插頭每人一個（視旅遊目的地贈送雙孔／三孔插頭）。",
    },
    {
      id: "sim",
      title: "含上網卡",
      description:
        "贈送每人一張網卡：\n1. 提供歐洲地區 4G 高速上網，每日 1G 流量。\n2. 每日 1G 流量使用完畢則降速，僅可文字傳輸。\n3. 網卡僅提供上網功能，不可撥打電話。\n4. 插卡後台灣時間 00:00 計算為隔日。\n5. 部分手機無法使用（如美國 iphone、2019 之前機型、各國電信商鎖卡機）。\n6. 網卡為贈送性質，如無法使用恕不退費。",
    },
  ],
  specGalleryImages: [
    "/images/trip-detail/transport-2.png",
    "/images/trip-detail/spec-2.png",
    "/images/trip-detail/transport-1.png",
  ],
  days: [
    {
      date: "05/29",
      day: 1,
      weekday: "Fri",
      stops: [
        { name: "杜拜／斯德哥爾摩", type: "pass" },
        { name: "斯德哥爾摩 Stockholm", type: "pass" },
        { name: "現代藝術地下鐵 Stockholm metro", type: "photo" },
        { name: "老鷹公路 Ørnesvingen", type: "photo" },
        { name: "市政廳(金廳、藍廳) Stockholm City Hall (含門票)", type: "visit" },
      ],
      meals: { breakfast: "機上", lunch: "風味餐", dinner: "方便遊玩，敬請自理" },
      hotelOptions: ["Quality Hotel Globe", "Quality Hotel Strawberry Arena", "Silja Line面海外艙", "同級旅館"],
      description:
        "被譽為世界最美的都市。此地建於波羅的海和梅拉倫湖之間的島上，市區由二萬多個大大小小的島嶼組成，這種特殊的水上景致，為它贏得北歐威尼斯的美譽。斯德哥爾摩建於十三世紀，後來幾經戰火摧毀，十九世紀後期開始重新整頓，以不破壞自然景觀為原則，此地又以諾貝爾頒獎典禮舉辦地而聞名，加上許多國際性的會議在此舉行，使其成為一座國際性的大都市。",
      image: "/images/trip-detail/day1-stockholm-56586a2.png",
    },
    {
      date: "05/30",
      day: 2,
      weekday: "Sat",
      stops: [
        { name: "斯德哥爾摩／卑爾根", type: "pass" },
        { name: "詩麗雅號遊輪", type: "visit" },
        { name: "峽灣觀光遊船", type: "visit" },
      ],
      meals: { breakfast: "飯店內用", lunch: "遊輪自助餐", dinner: "風味餐" },
      hotelOptions: ["Scandic Bergen City", "Clarion Hotel Bergen", "同級旅館"],
      description:
        "卑爾根是挪威第二大城市，也是通往峽灣地區的門戶。城市周圍環繞著七座山丘，木造彩色房屋沿著港口排列，散發濃厚的漢薩同盟時期風情，是探索挪威峽灣風光的最佳起點。",
      image: "/images/trip-detail/transport-2.png",
    },
  ],
  tipNotice:
    "給予服務人員小費是全世界通行的社會習慣之一，在國外旅行大多有付小費的習慣，是一種風度的表現。本行程不包含領隊、導遊、司機服務費：每位貴賓每日12元（歐元）×天數。例如：10天團體共計120歐元，以此類推。",
  reminders: [
    "房間小費：每房1~2歐元。",
    "行李由專人搬運至房門口，房內擺放需自理。",
    "團體遊覽車以40人座車為主，若人數未達，將以較小型車輛安排。",
  ],
  ageReminderItems: [
    "年滿70歲或行動不便之貴賓，且無親友陪同者。",
    "未滿18歲，且未與法定代理人一同報名參加旅遊行程者：須將旅遊定型化契約書，提供給法定代理人簽名，報名始為有效。",
    "攜嬰幼兒同行者。",
    "特殊餐食者（如素食餐）：海外團體餐食之安排，無法如同在台灣般豐富且多變化，建議自行準備罐頭或泡麵等，以備不時之需。",
    "役男：須向相關主管機關申請出境許可。",
  ],
};

export function getTripDetail(id: string): TripDetail {
  return { ...NORDIC_TRIP, id };
}
