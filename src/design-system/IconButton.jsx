import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const variantClasses = {
  primary: "border-transparent bg-ink-950 text-white shadow-sm hover:bg-ink-800 focus-visible:ring-ink-950",
  secondary: "border-line bg-white text-ink-800 shadow-sm hover:bg-paper focus-visible:ring-ink-950",
  ghost: "border-transparent bg-transparent text-ink-800 hover:bg-paper focus-visible:ring-ink-950",
  danger: "border-transparent bg-red-700 text-white shadow-sm hover:bg-red-800 focus-visible:ring-red-700"
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-11 w-11"
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const IconButton = forwardRef(
  (
    {
      as: Component = "button",
      type,
      icon: Icon,
      label,
      title,
      variant = "secondary",
      size = "md",
      loading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const sharedProps = Component === "button" ? { type: type || "button", disabled: isDisabled } : {};
    const VisualIcon = loading ? Loader2 : Icon;

    return (
      <Component
        ref={ref}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-55",
          sizeClasses[size] || sizeClasses.md,
          variantClasses[variant] || variantClasses.secondary,
          isDisabled && "pointer-events-none opacity-55",
          className
        )}
        aria-label={label}
        title={title || label}
        aria-busy={loading || undefined}
        aria-disabled={Component === "button" ? undefined : isDisabled || undefined}
        {...sharedProps}
        {...props}
      >
        {VisualIcon ? (
          <VisualIcon className={cn("h-4 w-4", loading && "animate-spin")} aria-hidden="true" />
        ) : null}
      </Component>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
export default IconButton;
