import Field from "../design-system/Field.jsx";

export function TrackingEditor({ slot, value, onChange }) {
  const eventValue = value || {};

  const patch = (key, nextValue) => {
    onChange({ ...eventValue, [key]: nextValue });
  };

  return (
    <div className="space-y-2 rounded-md border border-line bg-paper p-3">
      <div className="tracking-event-header">
        <label className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink-800">
          <input
            type="checkbox"
            checked={Boolean(eventValue.enabled)}
            onChange={(event) => patch("enabled", event.target.checked)}
          />
          <span className="truncate">{slot.label}</span>
        </label>
        {"seconds" in eventValue ? (
          <label className="tracking-event-seconds" title="Segundos para disparar o evento">
            <input
              type="text"
              inputMode="numeric"
              value={eventValue.seconds ?? ""}
              aria-label="Segundos"
              onChange={(event) => patch("seconds", event.target.value)}
            />
            <span>sec</span>
          </label>
        ) : null}
      </div>
      <div className="tracking-event-tag-grid">
        <Field label="Evento GA4" value={eventValue.ga4Event ?? ""} onChange={(event) => patch("ga4Event", event.target.value)} />
        <Field label="Label Google Ads" value={eventValue.googleAdsLabel ?? ""} onChange={(event) => patch("googleAdsLabel", event.target.value)} />
        <Field label="Evento Meta" value={eventValue.metaEvent ?? ""} onChange={(event) => patch("metaEvent", event.target.value)} />
      </div>
    </div>
  );
}

export default TrackingEditor;
