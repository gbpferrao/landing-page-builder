import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, GripVertical, Plus, X } from "lucide-react";
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
  onRemove,
  onReorder
}) {
  const railRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const didDragRef = useRef(false);
  const activeItem = items[activeIndex];
  const hasItems = items.length > 0;

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
    <div className="min-w-0 max-w-full overflow-x-hidden overflow-y-visible">
      <div className="min-w-0 max-w-full overflow-x-hidden overflow-y-visible">
        <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)_44px] items-stretch gap-0">
          <IconButton
            label="Itens anteriores"
            icon={ChevronLeft}
            size="sm"
            variant="ghost"
            className="item-carousel-arrow item-carousel-arrow-left"
            onClick={() => scrollTabs(-1)}
          />
          <div
            ref={railRef}
            className="item-carousel-rail"
            role="tablist"
            aria-label={label}
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const tabLabel = getItemTabLabel(item, index);
              const isDragging = dragState?.index === index;
              const dragOffset = isDragging ? dragState.currentX - dragState.startX : 0;

              return (
                <div
                  key={`${index}-${tabLabel}`}
                  className="relative shrink-0"
                  style={{
                    width: TAB_WIDTH,
                    transform: isDragging ? `translateX(${dragOffset}px)` : undefined
                  }}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    title={tabLabel}
                    className={cn(
                      "item-carousel-tab",
                      isActive && "item-carousel-tab-active",
                      isDragging && "relative z-10 shadow-soft transition-none"
                    )}
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
                  {isActive && onRemove ? (
                    <button
                      type="button"
                      className="carousel-tab-remove"
                      aria-label={`Remover ${tabLabel}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemove(index);
                      }}
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              );
            })}
            <button
              type="button"
              className="item-carousel-tab item-carousel-tab-add"
              onClick={onAdd}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Adicionar</span>
            </button>
          </div>
          <IconButton
            label="Proximos itens"
            icon={ChevronRight}
            size="sm"
            variant="ghost"
            className="item-carousel-arrow item-carousel-arrow-right"
            onClick={() => scrollTabs(1)}
          />
        </div>

        <div className="item-carousel-panel">
          {hasItems && activeItem ? children(activeItem, activeIndex) : <p>{emptyLabel}</p>}
        </div>
      </div>
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
