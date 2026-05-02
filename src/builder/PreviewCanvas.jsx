import { useCallback, useEffect, useRef, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import SegmentedControl from "../design-system/SegmentedControl.jsx";

export function PreviewCanvas({ previewHtml }) {
  const [previewMode, setPreviewMode] = useState("desktop");
  const iframeRef = useRef(null);
  const previewScrollRef = useRef({ x: 0, y: 0, ratio: 0 });
  const cleanupScrollListenerRef = useRef(null);
  const isMobile = previewMode === "mobile";

  useEffect(() => () => cleanupScrollListenerRef.current?.(), []);

  const rememberScroll = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    const doc = iframeRef.current?.contentDocument;
    if (!win || !doc) return;

    const maxScroll = Math.max(1, doc.documentElement.scrollHeight - win.innerHeight);
    previewScrollRef.current = {
      x: win.scrollX || 0,
      y: win.scrollY || 0,
      ratio: (win.scrollY || 0) / maxScroll
    };
  }, []);

  const restoreScroll = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    const doc = iframeRef.current?.contentDocument;
    if (!win || !doc) return;

    const saved = previewScrollRef.current;
    const maxScroll = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight);
    const absoluteY = Math.min(maxScroll, Math.max(0, saved.y));
    const ratioY = Math.min(maxScroll, Math.max(0, Math.round(maxScroll * saved.ratio)));
    const nextY = saved.y > 0 ? absoluteY : ratioY;

    win.scrollTo(saved.x, nextY);
  }, []);

  const handlePreviewLoad = useCallback(() => {
    cleanupScrollListenerRef.current?.();

    const win = iframeRef.current?.contentWindow;
    if (!win) return;

    const onScroll = () => rememberScroll();
    win.addEventListener("scroll", onScroll, { passive: true });
    cleanupScrollListenerRef.current = () => win.removeEventListener("scroll", onScroll);

    requestAnimationFrame(() => {
      restoreScroll();
      requestAnimationFrame(restoreScroll);
    });
  }, [rememberScroll, restoreScroll]);

  return (
    <section className="builder-preview p-4">
      <div className="builder-preview-stage">
        <iframe
          ref={iframeRef}
          className={`builder-preview-frame ${isMobile ? "builder-preview-frame-mobile" : "builder-preview-frame-desktop"}`}
          title="Preview da landing page"
          srcDoc={previewHtml}
          onLoad={handlePreviewLoad}
        />
        <div className="builder-preview-floating-toggle">
          <SegmentedControl
            ariaLabel="Tamanho do preview"
            value={previewMode}
            onValueChange={setPreviewMode}
            size="sm"
            className="bg-surface/95 shadow-soft backdrop-blur"
            options={[
              { value: "desktop", label: "Desktop", icon: Monitor },
              { value: "mobile", label: "Mobile", icon: Smartphone }
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default PreviewCanvas;
