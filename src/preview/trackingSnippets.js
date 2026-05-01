const TRACKING_SCRIPT_ID = "landing-tracking-runtime";

export function buildTrackingHead(project) {
  const tracking = project.site?.tracking || {};
  const providers = tracking.providers || {};
  const tags = [];

  if (providers.ga4?.enabled && providers.ga4.measurementId) {
    tags.push(gtagLoader(providers.ga4.measurementId));
    tags.push(inlineScript(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${jsString(providers.ga4.measurementId)}',{send_page_view:false});`));
  }

  if (providers.googleAds?.enabled && providers.googleAds.conversionId) {
    if (!providers.ga4?.enabled || !providers.ga4.measurementId) {
      tags.push(gtagLoader(providers.googleAds.conversionId));
      tags.push(inlineScript("window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());"));
    }
    tags.push(inlineScript(`gtag('config','${jsString(providers.googleAds.conversionId)}');`));
  }

  if (providers.meta?.enabled && providers.meta.pixelId) {
    tags.push(inlineScript(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${jsString(providers.meta.pixelId)}');`));
  }

  return tags.join("\n");
}

export function buildTrackingRuntime(project) {
  const config = buildTrackingConfig(project);
  if (!config.providers.ga4.enabled && !config.providers.googleAds.enabled && !config.providers.meta.enabled) {
    return "";
  }

  return inlineScript(`(function(){var cfg=${safeJson(config)};function has(value){return value!==undefined&&value!==null&&String(value).trim()!=='';}function params(event){var out={};if(event.parameters){Object.keys(event.parameters).forEach(function(key){if(has(event.parameters[key]))out[key]=event.parameters[key];});}return out;}function fire(event,extra){if(!event||event.enabled===false)return;var payload=Object.assign(params(event),extra||{});if(cfg.providers.ga4.enabled&&has(event.ga4Event)&&window.gtag){window.gtag('event',event.ga4Event,payload);}if(cfg.providers.googleAds.enabled&&has(event.googleAdsLabel)&&window.gtag){window.gtag('event','conversion',Object.assign({},payload,{send_to:cfg.providers.googleAds.conversionId+'/'+event.googleAdsLabel}));}if(cfg.providers.meta.enabled&&has(event.metaEvent)&&window.fbq){window.fbq('track',event.metaEvent,payload);}}function isWhatsappLink(el){var href=String(el.getAttribute('href')||'').toLowerCase();return href.indexOf('whatsapp')!==-1||href.indexOf('wa.me')!==-1;}function wireWhatsapp(){document.querySelectorAll('a[href]').forEach(function(el){if(isWhatsappLink(el)){el.addEventListener('click',function(){fire(cfg.events.whatsappClick,{link_url:el.href});});}});}function wireVideos(){document.querySelectorAll('[data-track-video], iframe[src*="youtube.com"], iframe[src*="youtu.be"]').forEach(function(el){var watched=false;el.addEventListener('pointerdown',function(){fire(cfg.events.videoClick,{video_url:el.src||''});if(!watched){watched=true;var seconds=Number(cfg.events.videoWatch&&cfg.events.videoWatch.seconds)||0;if(seconds>0){window.setTimeout(function(){fire(cfg.events.videoWatch,{video_url:el.src||'',watch_seconds:seconds});},seconds*1000);}}});});}function pageView(){var page=cfg.pageView;if(!page||page.enabled===false)return;if(cfg.providers.ga4.enabled&&has(page.ga4Event)&&window.gtag){window.gtag('event',page.ga4Event,{page_title:document.title,page_location:location.href});}if(cfg.providers.meta.enabled&&has(page.metaEvent)&&window.fbq){window.fbq('track',page.metaEvent);}}document.addEventListener('DOMContentLoaded',function(){pageView();wireWhatsapp();wireVideos();});})();`, TRACKING_SCRIPT_ID);
}

export function buildTrackingConfig(project) {
  const tracking = project.site?.tracking || {};
  const providers = tracking.providers || {};

  return {
    providers: {
      ga4: {
        enabled: Boolean(providers.ga4?.enabled && providers.ga4.measurementId),
        measurementId: providers.ga4?.measurementId || ""
      },
      googleAds: {
        enabled: Boolean(providers.googleAds?.enabled && providers.googleAds.conversionId),
        conversionId: providers.googleAds?.conversionId || ""
      },
      meta: {
        enabled: Boolean(providers.meta?.enabled && providers.meta.pixelId),
        pixelId: providers.meta?.pixelId || ""
      }
    },
    pageView: tracking.pageView || {},
    events: {
      videoClick: tracking.videoClick || {},
      videoWatch: tracking.videoWatch || {},
      whatsappClick: tracking.whatsappClick || {}
    }
  };
}

function gtagLoader(id) {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeAttribute(id)}"></script>`;
}

function inlineScript(content, id = "") {
  const idAttribute = id ? ` id="${escapeAttribute(id)}"` : "";
  return `<script${idAttribute}>${content}</script>`;
}

function jsString(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
