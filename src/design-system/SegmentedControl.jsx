import { useState } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function SegmentedControl({
  options = [],
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Selecionar opcao",
  size = "md",
  className = ""
}) {
  const firstValue = options.find((option) => !option.disabled)?.value ?? options[0]?.value;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstValue);
  const activeValue = value ?? internalValue;
  const sizeClass = size === "sm" ? "min-h-8 px-2 text-xs" : "min-h-10 px-3 text-sm";

  const selectOption = (nextValue, disabled) => {
    if (disabled) return;
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx("inline-flex rounded-md border border-line bg-paper p-1", className)}
    >
      {options.map(({ value: optionValue, label, disabled, icon: Icon }) => {
        const selected = optionValue === activeValue;
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            className={cx(
              "inline-flex box-border items-center justify-center gap-2 rounded-[5px] border border-transparent font-medium outline outline-2 outline-transparent transition-colors focus:outline-none focus-visible:outline-ink-950",
              sizeClass,
              selected ? "bg-ink-950 text-white shadow-sm" : "text-muted hover:bg-white hover:text-ink-800",
              disabled && "cursor-not-allowed opacity-45"
            )}
            onClick={() => selectOption(optionValue, disabled)}
          >
            {Icon ? <Icon size={15} aria-hidden="true" /> : null}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
