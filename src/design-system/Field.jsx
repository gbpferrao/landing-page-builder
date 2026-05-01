import { forwardRef, useId } from "react";

const inputClasses =
  "block w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink-950 shadow-sm outline-none transition placeholder:text-muted/70 focus:border-ink-800 focus:ring-2 focus:ring-ink-950/15 disabled:cursor-not-allowed disabled:bg-paper disabled:text-muted";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Field = forwardRef(
  (
    {
      as: Component = "input",
      id,
      label,
      help,
      error,
      required = false,
      disabled = false,
      className = "",
      inputClassName = "",
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const fieldId = id || generatedId;
    const helpId = help ? `${fieldId}-help` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;
    const isInput = Component === "input";

    return (
      <div className={cn("space-y-1.5", className)}>
        {label ? (
          <label className="block text-sm font-medium text-ink-800" htmlFor={fieldId}>
            {label}
            {required ? <span className="ml-1 text-gold-600">*</span> : null}
          </label>
        ) : null}

        <Component
          ref={ref}
          id={fieldId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={cn(inputClasses, Component === "textarea" && "min-h-28 resize-y leading-6", inputClassName)}
          {...props}
        >
          {isInput ? undefined : children}
        </Component>

        {error ? (
          <p id={errorId} className="text-sm font-medium text-red-700">
            {error}
          </p>
        ) : help ? (
          <p id={helpId} className="text-sm leading-5 text-muted">
            {help}
          </p>
        ) : null}
      </div>
    );
  }
);

Field.displayName = "Field";

export { Field, inputClasses };
export default Field;
