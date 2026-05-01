export const landingTrackingDefaults = {
  providers: {
    ga4: { enabled: false, measurementId: "" },
    googleAds: { enabled: false, conversionId: "" },
    meta: { enabled: false, pixelId: "" }
  },
  pageView: {
    enabled: true,
    ga4Event: "page_view",
    metaEvent: "PageView"
  },
  videoClick: {
    enabled: false,
    ga4Event: "video_click",
    googleAdsLabel: "",
    metaEvent: "ViewContent"
  },
  videoWatch: {
    enabled: false,
    ga4Event: "video_watch",
    googleAdsLabel: "",
    metaEvent: "ViewContent",
    seconds: 10
  },
  whatsappClick: {
    enabled: true,
    ga4Event: "generate_lead",
    googleAdsLabel: "",
    metaEvent: "Lead",
    parameters: {
      content_name: "",
      content_category: ""
    }
  }
};

export function viewEvent(ga4Event, metaEvent = "") {
  return {
    enabled: true,
    ga4Event,
    metaEvent,
    googleAdsLabel: ""
  };
}

export function leadEvent(ga4Event = "generate_lead", metaEvent = "Lead") {
  return {
    enabled: true,
    ga4Event,
    googleAdsLabel: "",
    metaEvent,
    parameters: {
      content_name: "",
      content_category: ""
    }
  };
}

export function optionalEvent(ga4Event, metaEvent = "") {
  return {
    enabled: false,
    ga4Event,
    googleAdsLabel: "",
    metaEvent
  };
}
