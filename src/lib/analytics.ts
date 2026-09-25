export type AnalyticsEventName =
  | "page_view"
  | "lead_form_start"
  | "lead_submit"
  | "contact_form_submit"
  | "whatsapp_click"
  | "phone_click"
  | "site_visit_click"
  | "property_view"
  | "property_enquiry_submit"
  | "project_view"
  | "seller_lead_submit"
  | "buyer_requirement_submit";

export type TrafficAttribution = Partial<Record<
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_term"
  | "utm_content"
  | "gclid"
  | "gbraid"
  | "wbraid"
  | "fbclid"
  | "landing_page"
  | "referrer",
  string
>>;

type PixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: PixelFunction;
  }
}

const ATTRIBUTION_KEY = "anantha_traffic_attribution";
const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

const getStorage = () => {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
};

export const captureAttribution = (): TrafficAttribution => {
  if (typeof window === "undefined") return {};

  const storage = getStorage();
  const current: TrafficAttribution = {};
  const searchParams = new URLSearchParams(window.location.search);
  for (const key of ATTRIBUTION_PARAMS) {
    const value = searchParams.get(key)?.trim();
    if (value) current[key] = value;
  }

  let stored: TrafficAttribution = {};
  try {
    stored = JSON.parse(storage?.getItem(ATTRIBUTION_KEY) || "{}");
  } catch {
    stored = {};
  }

  const attribution: TrafficAttribution = {
    ...stored,
    ...current,
    landing_page: stored.landing_page || `${window.location.pathname}${window.location.search}`,
    referrer: stored.referrer || document.referrer || undefined,
  };

  try {
    storage?.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Measurement must never interrupt the lead flow.
  }

  return attribution;
};

export const getAttribution = (): TrafficAttribution => captureAttribution();

const isLeadEvent = (event: AnalyticsEventName) =>
  [
    "lead_submit",
    "contact_form_submit",
    "seller_lead_submit",
    "buyer_requirement_submit",
  ].includes(event);

export const trackEvent = (
  event: AnalyticsEventName,
  params: Record<string, string | number | boolean | undefined> = {},
) => {
  if (typeof window === "undefined") return;

  const cleanParams = Object.fromEntries(
    Object.entries({ ...getAttribution(), ...params }).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag === "function") {
    window.gtag("event", event, cleanParams);
  } else {
    window.dataLayer.push({ event, ...cleanParams });
  }

  if (typeof window.fbq === "function") {
    if (event === "page_view") {
      window.fbq("track", "PageView", cleanParams);
    } else if (isLeadEvent(event)) {
      window.fbq("track", "Lead", cleanParams);
    } else {
      window.fbq("trackCustom", event, cleanParams);
    }
  }

  const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID?.trim();
  const googleAdsLeadLabel = import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL?.trim();
  if (
    isLeadEvent(event) &&
    googleAdsId &&
    googleAdsLeadLabel &&
    typeof window.gtag === "function"
  ) {
    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${googleAdsLeadLabel}`,
      value: 1,
      currency: "INR",
    });
  }
};
