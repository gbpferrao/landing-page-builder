import { useState } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Tabs({
  items = [],
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Abas",
  className = "",
  listClassName = "",
  panelClassName = ""
}) {
  const firstValue = items.find((item) => !item.disabled)?.value ?? items[0]?.value;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstValue);
  const activeValue = value ?? internalValue;
  const activeItem = items.find((item) => item.value === activeValue) ?? items.find((item) => !item.disabled) ?? items[0];

  const selectTab = (nextValue, disabled) => {
    if (disabled) return;
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className={cx("w-full", className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cx("flex gap-1 border-b border-line", listClassName)}
      >
        {items.map(({ value: itemValue, label, disabled, icon: Icon }) => {
          const selected = itemValue === activeItem?.value;
          return (
            <button
              key={itemValue}
              type="button"
              role="tab"
              id={`tab-${itemValue}`}
              aria-selected={selected}
              aria-controls={`tabpanel-${itemValue}`}
              disabled={disabled}
              className={cx(
                "inline-flex min-h-10 items-center gap-2 rounded-t-md border border-transparent px-3 text-sm font-medium text-muted transition",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                selected && "border-line border-b-surface bg-surface text-ink-950 shadow-sm",
                !selected && !disabled && "hover:bg-white hover:text-ink-800",
                disabled && "cursor-not-allowed opacity-45"
              )}
              onClick={() => selectTab(itemValue, disabled)}
            >
              {Icon ? <Icon size={16} aria-hidden="true" /> : null}
              {label}
            </button>
          );
        })}
      </div>
      {activeItem ? (
        <div
          role="tabpanel"
          id={`tabpanel-${activeItem.value}`}
          aria-labelledby={`tab-${activeItem.value}`}
          tabIndex={0}
          className={cx("pt-4 outline-none focus-visible:ring-2 focus-visible:ring-gold-500", panelClassName)}
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}

export default Tabs;
