export type FlightLeg = {
  direction: "去程" | "回程";
  date: string;
  airline: string;
  flightNumber: string;
  departTime: string;
  departCity: string;
  arriveTime: string;
  arriveCity: string;
  nextDay?: boolean;
};

export type FeatureBlock = {
  id: string;
  title: string;
  paragraphs: string[];
  images: string[];
  caption: string;
};

export type SpecItem = {
  id: string;
  title: string;
  description: string;
};

export type StopType = "visit" | "photo" | "pass";

export type Stop = {
  name: string;
  type: StopType;
};

export type DayPlan = {
  date: string;
  day: number;
  weekday: string;
  stops: Stop[];
  meals: { breakfast: string; lunch: string; dinner: string };
  hotelOptions: string[];
  description: string;
  image: string;
};

export type NoticeTab = {
  id: string;
  label: string;
};

export type TripDetail = {
  id: string;
  title: string;
  groupCode: string;
  heroImage: string;
  durationDays: number;
  departureCity: string;
  tags: string[];
  startDate: string;
  deposit: string;
  guaranteedDeparture: boolean;
  highlights: string[];
  price: string;
  flights: FlightLeg[];
  featureBlocks: FeatureBlock[];
  moreFeatures: string[];
  specs: SpecItem[];
  specGalleryImages: string[];
  days: DayPlan[];
  tipNotice: string;
  reminders: string[];
  ageReminderItems: string[];
};
