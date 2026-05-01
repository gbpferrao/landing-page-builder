import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import SegmentedControl from "../design-system/SegmentedControl.jsx";

export function PreviewCanvas({ previewHtml }) {
  const [previewMode, setPreviewMode] = useState("desktop");
  const isMobile = previewMode === "mobile";

  return (
    <section className="builder-preview p-4">
      <div className="builder-preview-stage">
        <iframe
          className={`builder-preview-frame ${isMobile ? "builder-preview-frame-mobile" : "builder-preview-frame-desktop"}`}
          title="Preview da landing page"
          srcDoc={previewHtml}
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
