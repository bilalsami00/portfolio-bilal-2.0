import type { VisitorDeviceType } from "./schemas/visitor";

export type ParsedUserAgent = {
  deviceType: VisitorDeviceType;
  deviceBrand: string | null;
  deviceModel: string | null;
  browser: string;
  operatingSystem: string;
};

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|whatsapp|telegrambot|discordbot|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python-requests|axios|node-fetch/i;
const TABLET_PATTERN = /ipad|tablet|playbook|silk|kindle|(android(?!.*mobi))/i;
const MOBILE_PATTERN = /mobi|iphone|ipod|windows phone|blackberry|opera mini/i;

const ANDROID_BRAND_PREFIXES: [RegExp, string][] = [
  [/^(SM-|GT-|SAMSUNG)/i, "Samsung"],
  [/^Pixel/i, "Google"],
  [/^(Redmi|POCO|Mi |MI |M2|2201|2210|2211|Xiaomi)/i, "Xiaomi"],
  [/^(ONEPLUS|IN20|KB20|LE21|NE22|CPH25)/i, "OnePlus"],
  [/^(CPH|OPPO)/i, "OPPO"],
  [/^(RMX|realme)/i, "realme"],
  [/^(vivo|V2\d{3})/i, "vivo"],
  [/^(HUAWEI|ELE-|VOG-|ANA-|NOH-)/i, "Huawei"],
  [/^(Infinix)/i, "Infinix"],
  [/^(TECNO)/i, "TECNO"],
  [/^(moto|Motorola|XT\d)/i, "Motorola"],
  [/^(Nokia)/i, "Nokia"],
  [/^(LM-|LG-)/i, "LG"],
  [/^(SO-|XQ-|Xperia)/i, "Sony"],
];

export const brandFromModel = (model: string | null): string | null => {
  if (!model) return null;
  const match = ANDROID_BRAND_PREFIXES.find(([pattern]) => pattern.test(model));
  return match ? match[1] : null;
};

const detectBrowser = (ua: string): string => {
  const rules: [RegExp, string][] = [
    [/Edg(?:A|iOS)?\/(\d+)/, "Edge"],
    [/OPR\/(\d+)/, "Opera"],
    [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
    [/(?:Firefox|FxiOS)\/(\d+)/, "Firefox"],
    [/(?:Chrome|CriOS)\/(\d+)/, "Chrome"],
    [/Version\/(\d+)[\d.]*\s.*Safari/, "Safari"],
  ];
  const hit = rules.find(([pattern]) => pattern.test(ua));
  if (!hit) return "unknown";
  const version = ua.match(hit[0])?.[1];
  return version ? `${hit[1]} ${version}` : hit[1];
};

const detectOperatingSystem = (ua: string): string => {
  const ios = ua.match(/(?:iPhone|iPad|iPod).*?OS (\d+)[_.]?(\d+)?/);
  if (ios) {
    const name = /iPad/.test(ua) ? "iPadOS" : "iOS";
    return `${name} ${ios[1]}${ios[2] ? `.${ios[2]}` : ""}`;
  }
  const android = ua.match(/Android (\d+(?:\.\d+)?)/);
  if (android) return `Android ${android[1]}`;
  if (/Windows NT 10/.test(ua)) return "Windows 10/11";
  const windows = ua.match(/Windows NT (\d+\.\d+)/);
  if (windows) return `Windows NT ${windows[1]}`;
  if (/CrOS/.test(ua)) return "ChromeOS";
  const mac = ua.match(/Mac OS X (\d+)[_.](\d+)/);
  if (mac) return `macOS ${mac[1]}.${mac[2]}`;
  if (/Linux/.test(ua)) return "Linux";
  return "unknown";
};

const detectDeviceType = (ua: string): VisitorDeviceType => {
  if (BOT_PATTERN.test(ua)) return "Bot";
  if (TABLET_PATTERN.test(ua)) return "Tablet";
  if (MOBILE_PATTERN.test(ua) || /Android/.test(ua)) return "Mobile";
  return "Desktop";
};

const detectBrandAndModel = (
  ua: string
): { brand: string | null; model: string | null } => {
  if (/iPhone/.test(ua)) return { brand: "Apple", model: "iPhone" };
  if (/iPad/.test(ua)) return { brand: "Apple", model: "iPad" };
  if (/Macintosh/.test(ua)) return { brand: "Apple", model: null };

  const android = ua.match(
    /Android [\d.]+;\s*(?:[a-z]{2}[-_][a-z]{2};\s*)?([^;)]+?)(?:\sBuild\/|\)|;)/i
  );
  const rawModel = android?.[1]?.trim() ?? null;
  // Reduced Chrome UAs send a single letter ("K") instead of the model.
  const model = rawModel && rawModel.length > 1 ? rawModel : null;
  return { brand: brandFromModel(model), model };
};

/** Best-effort parse of a User-Agent string. Unknown values stay explicit. */
export const parseUserAgent = (
  userAgent: string | undefined
): ParsedUserAgent => {
  const ua = userAgent || "";
  if (!ua) {
    return {
      deviceType: "Desktop",
      deviceBrand: null,
      deviceModel: null,
      browser: "unknown",
      operatingSystem: "unknown",
    };
  }
  const { brand, model } = detectBrandAndModel(ua);
  return {
    deviceType: detectDeviceType(ua),
    deviceBrand: brand,
    deviceModel: model,
    browser: detectBrowser(ua),
    operatingSystem: detectOperatingSystem(ua),
  };
};
