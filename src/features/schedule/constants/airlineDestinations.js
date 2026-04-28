import DESTINATIONS from "./destinations";

export const DEFAULT_AIRLINE_CODE = "default";

const CATHAY_PACIFIC_DESTINATIONS = {
  Australia: {
    flag: "AU",
    cities: [
      "Adelaide (ADL)",
      "Brisbane (BNE)",
      "Cairns (CNS)",
      "Melbourne (MEL)",
      "Perth (PER)",
      "Sydney (SYD)",
    ],
  },
  Cambodia: {
    flag: "KH",
    cities: ["Phnom Penh (KTI)"],
  },
  Canada: {
    flag: "CA",
    cities: ["Toronto (YYZ)", "Vancouver (YVR)"],
  },
  "Chinese Mainland": {
    flag: "CN",
    cities: [
      "Beijing (PEK)",
      "Chengdu (TFU)",
      "Chongqing (CKG)",
      "Fuzhou (FOC)",
      "Guangzhou (CAN)",
      "Hangzhou (HGH)",
      "Nanjing (NKG)",
      "Qingdao (TAO)",
      "Shanghai Pudong (PVG)",
      "Wuhan (WUH)",
      "Xi'an (XIY)",
      "Xiamen (XMN)",
      "Zhengzhou (CGO)",
    ],
  },
  France: {
    flag: "FR",
    cities: ["Paris (CDG)"],
  },
  Germany: {
    flag: "DE",
    cities: ["Frankfurt (FRA)", "Munich (MUC)"],
  },
  India: {
    flag: "IN",
    cities: [
      "Bengaluru (BLR)",
      "Chennai (MAA)",
      "Delhi (DEL)",
      "Hyderabad (HYD)",
      "Mumbai (BOM)",
    ],
  },
  Indonesia: {
    flag: "ID",
    cities: ["Denpasar (DPS)", "Jakarta (CGK)", "Surabaya (SUB)"],
  },
  Italy: {
    flag: "IT",
    cities: ["Milan (MXP)", "Rome (FCO)"],
  },
  Japan: {
    flag: "JP",
    cities: [
      "Fukuoka (FUK)",
      "Nagoya (NGO)",
      "Osaka (KIX)",
      "Sapporo (CTS)",
      "Tokyo Haneda (HND)",
      "Tokyo Narita (NRT)",
    ],
  },
  Malaysia: {
    flag: "MY",
    cities: ["Kuala Lumpur (KUL)", "Penang (PEN)"],
  },
  Maldives: {
    flag: "MV",
    cities: ["Male (MLE)"],
  },
  Myanmar: {
    flag: "MM",
    cities: ["Yangon (RGN)"],
  },
  Nepal: {
    flag: "NP",
    cities: ["Kathmandu (KTM)"],
  },
  Netherlands: {
    flag: "NL",
    cities: ["Amsterdam (AMS)"],
  },
  Philippines: {
    flag: "PH",
    cities: ["Cebu (CEB)", "Manila (MNL)"],
  },
  "Saudi Arabia": {
    flag: "SA",
    cities: ["Riyadh (RUH)"],
  },
  Singapore: {
    flag: "SG",
    cities: ["Singapore (SIN)"],
  },
  "South Africa": {
    flag: "ZA",
    cities: ["Johannesburg (JNB)"],
  },
  "South Korea": {
    flag: "KR",
    cities: ["Seoul (ICN)"],
  },
  Spain: {
    flag: "ES",
    cities: ["Barcelona (BCN)", "Madrid (MAD)"],
  },
  "Sri Lanka": {
    flag: "LK",
    cities: ["Colombo (CMB)"],
  },
  Switzerland: {
    flag: "CH",
    cities: ["Zurich (ZRH)"],
  },
  Taiwan: {
    flag: "TW",
    cities: ["Kaohsiung (KHH)", "Taichung (RMQ)", "Taipei (TPE)"],
  },
  Thailand: {
    flag: "TH",
    cities: ["Bangkok (BKK)", "Phuket (HKT)"],
  },
  "United Arab Emirates": {
    flag: "AE",
    cities: ["Dubai (DXB)"],
  },
  "United Kingdom": {
    flag: "GB",
    cities: [
      "London Gatwick (LGW)",
      "London Heathrow (LHR)",
      "Manchester (MAN)",
    ],
  },
  "United States": {
    flag: "US",
    cities: [
      "Boston (BOS)",
      "Chicago (ORD)",
      "Dallas (DFW)",
      "Los Angeles (LAX)",
      "New York (JFK)",
      "San Francisco (SFO)",
      "Seattle (SEA)",
    ],
  },
  Vietnam: {
    flag: "VN",
    cities: ["Hanoi (HAN)", "Ho Chi Minh City (SGN)"],
  },
};

const HONG_KONG_EXPRESS_DESTINATIONS = {
  "South Korea": {
    flag: "KR",
    cities: ["Busan (PUS)", "Daegu (TAE)", "Jeju (CJU)", "Seoul (ICN)"],
  },
  "Chinese Mainland": {
    flag: "CN",
    cities: ["Beijing Daxing (PKX)", "Ningbo (NGB)", "Sanya (SYX)"],
  },
  Taiwan: {
    flag: "TW",
    cities: [
      "Hualien (HUN)",
      "Kaohsiung (KHH)",
      "Taichung (RMQ)",
      "Taipei (TPE)",
    ],
  },
  Japan: {
    flag: "JP",
    cities: [
      "Fukuoka (FUK)",
      "Hiroshima (HIJ)",
      "Ishigaki (ISG)",
      "Kagoshima (KOJ)",
      "Komatsu (KMQ)",
      "Miyakojima Shimojishima (SHI)",
      "Nagoya (NGO)",
      "Osaka (KIX)",
      "Takamatsu (TAK)",
      "Tokyo Haneda (HND)",
      "Tokyo Narita (NRT)",
    ],
  },
  Vietnam: {
    flag: "VN",
    cities: ["Da Nang (DAD)", "Hanoi (HAN)", "Phu Quoc (PQC)"],
  },
  Philippines: {
    flag: "PH",
    cities: ["Clark (CRK)", "Manila (MNL)"],
  },
  Thailand: {
    flag: "TH",
    cities: [
      "Bangkok Don Mueang (DMK)",
      "Bangkok Suvarnabhumi (BKK)",
      "Chiang Mai (CNX)",
      "Phuket (HKT)",
    ],
  },
  Malaysia: {
    flag: "MY",
    cities: ["Penang (PEN)"],
  },
};

const GREATER_BAY_AIRLINES_DESTINATIONS = {
  Japan: {
    flag: "JP",
    cities: [
      "Osaka (KIX)",
      "Sendai (SDJ)",
      "Sapporo (CTS)",
      "Tokyo Narita (NRT)",
    ],
  },
  "Chinese Mainland": {
    flag: "CN",
    cities: [
      "Changsha (CSX)",
      "Huangshan (TXN)",
      "Quanzhou (JJN)",
      "Yichang (YIH)",
      "Zhoushan (HSN)",
    ],
  },
  Taiwan: {
    flag: "TW",
    cities: ["Taipei (TPE)"],
  },
  Thailand: {
    flag: "TH",
    cities: ["Bangkok Suvarnabhumi (BKK)"],
  },
  Philippines: {
    flag: "PH",
    cities: ["Manila (MNL)"],
  },
  Vietnam: {
    flag: "VN",
    cities: ["Phu Quoc (PQC)"],
  },
};

const KOREAN_AIR_DESTINATIONS = {
  "South Korea": {
    flag: "KR",
    cities: [
      "Busan (PUS)",
      "Cheongju (CJJ)",
      "Daegu (TAE)",
      "Gwangju (KWJ)",
      "Jeju (CJU)",
      "Jinju Sacheon (HIN)",
      "Seoul Gimpo (GMP)",
      "Seoul Incheon (ICN)",
      "Ulsan (USN)",
      "Yeosu (RSU)",
    ],
  },
  Japan: {
    flag: "JP",
    cities: [
      "Aomori (AOJ)",
      "Fukuoka (FUK)",
      "Kagoshima (KOJ)",
      "Komatsu (KMQ)",
      "Kumamoto (KMJ)",
      "Nagasaki (NGS)",
      "Nagoya (NGO)",
      "Niigata (KIJ)",
      "Okayama (OKJ)",
      "Okinawa Naha (OKA)",
      "Osaka Kansai (KIX)",
      "Osaka Kobe (UKB)",
      "Sapporo (CTS)",
      "Tokyo Haneda (HND)",
      "Tokyo Narita (NRT)",
    ],
  },
  "Chinese Mainland": {
    flag: "CN",
    cities: [
      "Beijing (PEK)",
      "Changsha (CSX)",
      "Dalian (DLC)",
      "Fuzhou (FOC)",
      "Guangzhou (CAN)",
      "Hangzhou (HGH)",
      "Hefei (HFE)",
      "Kunming (KMG)",
      "Nanjing (NKG)",
      "Qingdao (TAO)",
      "Shanghai Hongqiao (SHA)",
      "Shanghai Pudong (PVG)",
      "Shenyang (SHE)",
      "Shenzhen (SZX)",
      "Tianjin (TSN)",
      "Wuhan (WUH)",
      "Xi'an (XIY)",
      "Xiamen (XMN)",
      "Yanji (YNJ)",
      "Zhangjiajie (DYG)",
      "Zhengzhou (CGO)",
    ],
  },
  "Hong Kong SAR": {
    flag: "HK",
    cities: ["Hong Kong (HKG)"],
  },
  Macau: {
    flag: "MO",
    cities: ["Macau (MFM)"],
  },
  Taiwan: {
    flag: "TW",
    cities: ["Taichung (RMQ)", "Taipei (TPE)"],
  },
  Thailand: {
    flag: "TH",
    cities: [
      "Bangkok Suvarnabhumi (BKK)",
      "Chiang Mai (CNX)",
      "Phuket (HKT)",
    ],
  },
  Philippines: {
    flag: "PH",
    cities: ["Cebu (CEB)", "Manila (MNL)"],
  },
  Nepal: {
    flag: "NP",
    cities: ["Kathmandu (KTM)"],
  },
  Malaysia: {
    flag: "MY",
    cities: ["Kuala Lumpur (KUL)"],
  },
  India: {
    flag: "IN",
    cities: ["Delhi (DEL)"],
  },
  Cambodia: {
    flag: "KH",
    cities: ["Phnom Penh (KTI)"],
  },
  Singapore: {
    flag: "SG",
    cities: ["Singapore (SIN)"],
  },
  Myanmar: {
    flag: "MM",
    cities: ["Yangon (RGN)"],
  },
  Vietnam: {
    flag: "VN",
    cities: [
      "Da Nang (DAD)",
      "Hanoi (HAN)",
      "Ho Chi Minh City (SGN)",
      "Nha Trang Cam Ranh (CXR)",
      "Phu Quoc (PQC)",
    ],
  },
  Indonesia: {
    flag: "ID",
    cities: ["Bali Denpasar (DPS)", "Jakarta (CGK)"],
  },
  "United States": {
    flag: "US",
    cities: [
      "Atlanta (ATL)",
      "Boston (BOS)",
      "Chicago (ORD)",
      "Dallas (DFW)",
      "Guam (GUM)",
      "Honolulu (HNL)",
      "Las Vegas (LAS)",
      "Los Angeles (LAX)",
      "New York (JFK)",
      "San Francisco (SFO)",
      "Seattle (SEA)",
      "Washington Dulles (IAD)",
    ],
  },
  Canada: {
    flag: "CA",
    cities: ["Toronto (YYZ)", "Vancouver (YVR)"],
  },
  France: {
    flag: "FR",
    cities: ["Paris (CDG)"],
  },
  "United Kingdom": {
    flag: "GB",
    cities: ["London Heathrow (LHR)"],
  },
  Spain: {
    flag: "ES",
    cities: ["Madrid (MAD)"],
  },
  Czechia: {
    flag: "CZ",
    cities: ["Prague (PRG)"],
  },
  Switzerland: {
    flag: "CH",
    cities: ["Zurich (ZRH)"],
  },
  Portugal: {
    flag: "PT",
    cities: ["Lisbon (LIS)"],
  },
  Netherlands: {
    flag: "NL",
    cities: ["Amsterdam (AMS)"],
  },
  Italy: {
    flag: "IT",
    cities: ["Milan (MXP)", "Rome (FCO)"],
  },
  Austria: {
    flag: "AT",
    cities: ["Vienna (VIE)"],
  },
  Germany: {
    flag: "DE",
    cities: ["Frankfurt (FRA)"],
  },
  Turkiye: {
    flag: "TR",
    cities: ["Istanbul (IST)"],
  },
  Hungary: {
    flag: "HU",
    cities: ["Budapest (BUD)"],
  },
  Mongolia: {
    flag: "MN",
    cities: ["Ulaanbaatar (UBN)"],
  },
  "United Arab Emirates": {
    flag: "AE",
    cities: ["Dubai (DXB)"],
  },
  Australia: {
    flag: "AU",
    cities: ["Brisbane (BNE)", "Sydney (SYD)"],
  },
  "New Zealand": {
    flag: "NZ",
    cities: ["Auckland (AKL)"],
  },
};

const AIRLINE_DESTINATIONS = {
  [DEFAULT_AIRLINE_CODE]: {
    names: {
      ko: "홍콩항공",
      en: "Hong Kong Airlines",
    },
    destinations: DESTINATIONS,
  },
  cathayPacific: {
    names: {
      ko: "케세이퍼시픽",
      en: "Cathay Pacific",
    },
    destinations: CATHAY_PACIFIC_DESTINATIONS,
  },
  hongKongExpress: {
    names: {
      ko: "홍콩 익스프레스",
      en: "HK Express",
    },
    destinations: HONG_KONG_EXPRESS_DESTINATIONS,
  },
  greaterBayAirlines: {
    names: {
      ko: "그레이터베이항공",
      en: "Greater Bay Airlines",
    },
    destinations: GREATER_BAY_AIRLINES_DESTINATIONS,
  },
  koreanAir: {
    names: {
      ko: "대한항공",
      en: "Korean Air",
    },
    destinations: KOREAN_AIR_DESTINATIONS,
  },
};

export const getAirlineDestinationGroups = (airlineCode) =>
  AIRLINE_DESTINATIONS[airlineCode]?.destinations ??
  AIRLINE_DESTINATIONS[DEFAULT_AIRLINE_CODE].destinations;

export default AIRLINE_DESTINATIONS;
