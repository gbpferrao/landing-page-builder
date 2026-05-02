import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, GripVertical, Plus } from "lucide-react";
import Button from "../design-system/Button.jsx";
import IconButton from "../design-system/IconButton.jsx";

const TAB_WIDTH = 92;
const TAB_GAP = 4;
const TAB_STEP = TAB_WIDTH + TAB_GAP;
const SWAP_THRESHOLD = TAB_STEP / 2;

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function ItemGroupCarousel({
  activeIndex,
  children,
  emptyLabel = "Sem itens cadastrados.",
  items = [],
  label,
  onActiveIndexChange,
  onAdd,
  onReorder
}) {
  const railRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const didDragRef = useRef(false);
  const activeItem = items[activeIndex];

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex == null || toIndex == null) return;
    onReorder?.(fromIndex, toIndex);
  };

  useEffect(() => {
    if (!dragState) return undefined;

    const handlePointerMove = (event) => {
      const deltaX = event.clientX - dragState.startX;
      didDragRef.current = didDragRef.current || Math.abs(deltaX) > 4;

      if (deltaX >= SWAP_THRESHOLD && dragState.index < items.length - 1) {
        moveItem(dragState.index, dragState.index + 1);
        setDragState({
          pointerId: dragState.pointerId,
          index: dragState.index + 1,
          startX: dragState.startX + TAB_STEP,
          currentX: event.clientX
        });
        return;
      }

      if (deltaX <= -SWAP_THRESHOLD && dragState.index > 0) {
        moveItem(dragState.index, dragState.index - 1);
        setDragState({
          pointerId: dragState.pointerId,
          index: dragState.index - 1,
          startX: dragState.startX - TAB_STEP,
          currentX: event.clientX
        });
        return;
      }

      setDragState((current) => current ? { ...current, currentX: event.clientX } : current);
    };

    const handlePointerEnd = () => {
      setDragState(null);
      window.setTimeout(() => {
        didDragRef.current = false;
      }, 0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [dragState, items.length, onReorder]);

  const scrollTabs = (direction) => {
    railRef.current?.scrollBy({
      left: direction * TAB_STEP * 2,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-w-0 max-w-full space-y-2 overflow-hidden">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <label className="min-w-0 text-sm font-medium text-ink-800">{label}</label>
        <Button size="sm" variant="secondary" icon={Plus} onClick={onAdd}>Adicionar</Button>
      </div>

      {items.length ? (
        <div className="min-w-0 max-w-full space-y-3 overflow-hidden">
          <div className="group/carousel relative min-w-0 rounded-md border border-line/80 bg-white/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <IconButton
              label="Itens anteriores"
              icon={ChevronLeft}
              size="sm"
              variant="ghost"
              className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full border-line/80 bg-white/92 opacity-0 shadow-sm backdrop-blur transition-opacity hover:bg-white group-hover/carousel:opacity-100 focus:opacity-100 focus-visible:opacity-100"
              onClick={() => scrollTabs(-1)}
            />
            <div
              ref={railRef}
              className="flex min-w-0 max-w-full gap-1 overflow-hidden"
              role="tablist"
              aria-label={label}
            >
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                const tabLabel = getItemTabLabel(item, index);
                const isDragging = dragState?.index === index;
                const dragOffset = isDragging ? dragState.currentX - dragState.startX : 0;

                return (
                  <button
                    key={`${index}-${tabLabel}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    title={tabLabel}
                    className={cn(
                      "group flex h-9 shrink-0 touch-none select-none items-center gap-1 rounded-md border px-2 text-left text-xs font-semibold transition",
                      isActive
                        ? "border-ink-950 bg-ink-950 text-white shadow-sm"
                        : "border-line bg-white text-ink-800 hover:bg-paper",
                      isDragging && "relative z-10 shadow-soft transition-none"
                    )}
                    style={{
                      width: TAB_WIDTH,
                      transform: isDragging ? `translateX(${dragOffset}px)` : undefined
                    }}
                    onClick={() => {
                      if (didDragRef.current) return;
                      onActiveIndexChange(index);
                    }}
                    onPointerDown={(event) => {
                      if (event.button !== 0) return;
                      didDragRef.current = false;
                      event.currentTarget.setPointerCapture?.(event.pointerId);
                      setDragState({
                        pointerId: event.pointerId,
                        index,
                        startX: event.clientX,
                        currentX: event.clientX
                      });
                    }}
                  >
                    <GripVertical className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
                    <span className="min-w-0 truncate">{tabLabel}</span>
                  </button>
                );
              })}
            </div>
            <IconButton
              label="Proximos itens"
              icon={ChevronRight}
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border-line/80 bg-white/92 opacity-0 shadow-sm backdrop-blur transition-opacity hover:bg-white group-hover/carousel:opacity-100 focus:opacity-100 focus-visible:opacity-100"
              onClick={() => scrollTabs(1)}
            />
          </div>

          <div className="min-w-0 rounded-md border border-line bg-paper p-3">
            {activeItem ? children(activeItem, activeIndex) : null}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-line bg-white/60 p-3 text-sm text-muted">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}

function getItemTabLabel(item, index) {
  const mainValue = getMainItemValue(item);
  if (!mainValue) return `Item ${index + 1}`;
  return truncateLabel(mainValue, 8);
}

function getMainItemValue(item) {
  if (!item || typeof item !== "object") return "";

  const priorityKeys = ["title", "name", "text", "question", "label", "description", "credential", "icon"];
  for (const key of priorityKeys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  const firstTextValue = Object.values(item).find((value) => typeof value === "string" && value.trim());
  return firstTextValue?.trim() || "";
}

function truncateLabel(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}

export default ItemGroupCarousel;
