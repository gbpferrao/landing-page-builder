import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const variantClasses = {
  primary: "border-transparent bg-ink-950 text-white shadow-sm hover:bg-ink-800 focus-visible:ring-ink-950",
  secondary: "border-line bg-white text-ink-800 shadow-sm hover:bg-paper focus-visible:ring-ink-950",
  ghost: "border-transparent bg-transparent text-ink-800 hover:bg-paper focus-visible:ring-ink-950",
  danger: "border-transparent bg-red-700 text-white shadow-sm hover:bg-red-800 focus-visible:ring-red-700"
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base"
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Button = forwardRef(
  (
    {
      as: Component = "button",
      type,
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      className = "",
      children,
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
          "inline-flex max-w-full items-center justify-center gap-2 rounded-md border font-medium leading-none transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-55",
          sizeClasses[size] || sizeClasses.md,
          variantClasses[variant] || variantClasses.primary,
          isDisabled && "pointer-events-none opacity-55",
          className
        )}
        aria-busy={loading || undefined}
        aria-disabled={Component === "button" ? undefined : isDisabled || undefined}
        {...sharedProps}
        {...props}
      >
        {VisualIcon && iconPosition === "left" ? (
          <VisualIcon className={cn("h-4 w-4 shrink-0", loading && "animate-spin")} aria-hidden="true" />
        ) : null}
        {children ? <span className="min-w-0 truncate">{children}</span> : null}
        {VisualIcon && iconPosition === "right" ? (
          <VisualIcon className={cn("h-4 w-4 shrink-0", loading && "animate-spin")} aria-hidden="true" />
        ) : null}
      </Component>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
