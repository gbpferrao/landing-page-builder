import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const toastStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
    iconClassName: "text-emerald-700"
  },
  error: {
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-950",
    iconClassName: "text-red-700"
  },
  warning: {
    icon: AlertCircle,
    className: "border-amber-200 bg-amber-50 text-amber-950",
    iconClassName: "text-amber-700"
  },
  info: {
    icon: Info,
    className: "border-line bg-surface text-ink-950",
    iconClassName: "text-gold-600"
  }
};

export function Toast({
  open = true,
  type = "info",
  title,
  description,
  action,
  onClose,
  duration = 0,
  closeLabel = "Fechar notificacao",
  className = ""
}) {
  const style = toastStyles[type] ?? toastStyles.info;
  const Icon = style.icon;

  useEffect(() => {
    if (!open || !duration || !onClose) return undefined;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose, open]);

  if (!open) return null;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={cx(
        "flex w-full max-w-md items-start gap-3 rounded-md border px-4 py-3 shadow-soft",
        style.className,
        className
      )}
    >
      <Icon size={18} className={cx("mt-0.5 shrink-0", style.iconClassName)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-medium leading-5">{title}</p> : null}
        {description ? <p className="mt-1 text-sm leading-5 opacity-80">{description}</p> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          aria-label={closeLabel}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-current opacity-70 transition hover:bg-white/70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          onClick={onClose}
        >
          <X size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export function ToastViewport({ children, position = "bottom-right", className = "" }) {
  const positions = {
    "top-right": "right-4 top-4",
    "top-left": "left-4 top-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4"
  };

  return (
    <div className={cx("fixed z-50 flex max-w-[calc(100vw-32px)] flex-col gap-3", positions[position], className)}>
      {children}
    </div>
  );
}

export default Toast;
