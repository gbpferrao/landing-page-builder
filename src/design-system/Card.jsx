import { forwardRef } from "react";

const toneClasses = {
  default: "border-line bg-white text-ink-950 shadow-sm",
  muted: "border-line bg-paper text-ink-950",
  elevated: "border-line bg-white text-ink-950 shadow-soft"
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Card = forwardRef(({ as: Component = "section", tone = "default", padding = "md", className = "", ...props }, ref) => {
  const paddingClass = padding === "none" ? "" : padding === "sm" ? "p-3" : padding === "lg" ? "p-5" : "p-4";

  return (
    <Component
      ref={ref}
      className={cn("rounded-md border", toneClasses[tone] || toneClasses.default, paddingClass, className)}
      {...props}
    />
  );
});

Card.displayName = "Card";

function CardHeader({ className = "", ...props }) {
  return <div className={cn("mb-3 flex items-start justify-between gap-3", className)} {...props} />;
}

function CardTitle({ as: Component = "h2", className = "", ...props }) {
  return <Component className={cn("text-base font-medium text-ink-950", className)} {...props} />;
}

function CardDescription({ className = "", ...props }) {
  return <p className={cn("text-sm leading-6 text-muted", className)} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

function CardFooter({ className = "", ...props }) {
  return <div className={cn("mt-4 flex items-center justify-end gap-2", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
