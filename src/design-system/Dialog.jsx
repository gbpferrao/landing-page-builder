import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  ariaLabel,
  closeLabel = "Fechar dialog",
  className = "",
  panelClassName = ""
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousFocus = document.activeElement;
    panelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange?.(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [onOpenChange, open]);

  if (!open) return null;

  const labelledBy = title ? titleId : undefined;
  const describedBy = description ? descriptionId : undefined;

  return createPortal(
    <div
      className={cx("fixed inset-0 z-50 flex items-center justify-center bg-ink-950/45 p-4", className)}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange?.(false);
      }}
    >
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ? undefined : ariaLabel ?? "Dialog"}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cx(
          "flex max-h-[min(760px,calc(100vh-32px))] w-full max-w-xl flex-col overflow-hidden rounded-md border border-line bg-surface text-ink-950 shadow-soft outline-none",
          "focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
          panelClassName
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2 id={titleId} className="text-base font-medium leading-6 text-ink-950">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm leading-5 text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={closeLabel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-white text-muted shadow-sm transition hover:text-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            onClick={() => onOpenChange?.(false)}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {footer ? <div className="shrink-0 border-t border-line bg-paper px-5 py-4">{footer}</div> : null}
      </section>
    </div>,
    document.body
  );
}

export default Dialog;
