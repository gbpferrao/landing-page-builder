import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Button from "../../design-system/Button.jsx";
import Field from "../../design-system/Field.jsx";
import AssetPicker from "../AssetPicker.jsx";
import ItemGroupCarousel from "../ItemGroupCarousel.jsx";

export function RepeaterField({ slot, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((currentIndex) => {
      if (!items.length) return 0;
      return Math.min(currentIndex, items.length - 1);
    });
  }, [items.length]);

  const updateItem = (index, key, nextValue) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: nextValue } : item)));
  };

  const addItem = () => {
    const nextItems = [...items, inferBlankItem(items[0])];
    onChange(nextItems);
    setActiveIndex(nextItems.length - 1);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
    setActiveIndex((currentIndex) => {
      if (currentIndex > index) return currentIndex - 1;
      if (currentIndex === index) return Math.max(0, currentIndex - 1);
      return currentIndex;
    });
  };

  const reorderItems = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    onChange(nextItems);
    setActiveIndex((currentIndex) => {
      if (currentIndex === fromIndex) return toIndex;
      if (fromIndex < currentIndex && currentIndex <= toIndex) return currentIndex - 1;
      if (toIndex <= currentIndex && currentIndex < fromIndex) return currentIndex + 1;
      return currentIndex;
    });
  };

  return (
    <ItemGroupCarousel
      activeIndex={activeIndex}
      emptyLabel="Nenhum item cadastrado."
      items={items}
      label={slot.label}
      onActiveIndexChange={setActiveIndex}
      onAdd={addItem}
      onReorder={reorderItems}
    >
      {(item, index) => (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted">Item {index + 1}</p>
            <Button size="sm" variant="ghost" icon={Trash2} onClick={() => removeItem(index)}>Remover</Button>
          </div>
          {Object.entries(item).map(([key, itemValue]) => (
            <RepeaterValue
              key={key}
              name={key}
              value={itemValue}
              onChange={(nextValue) => updateItem(index, key, nextValue)}
            />
          ))}
        </div>
      )}
    </ItemGroupCarousel>
  );
}

function RepeaterValue({ name, value, onChange }) {
  if (name === "image") {
    return (
      <div className="space-y-2">
        <Field
          label={labelFor(name)}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
        <AssetPicker label="Enviar imagem" value={value} onChange={onChange} />
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <Field
        as="textarea"
        label={labelFor(name)}
        value={value.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        {labelFor(name)}
      </label>
    );
  }

  return (
    <Field
      as={String(value ?? "").length > 80 ? "textarea" : "input"}
      label={labelFor(name)}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function inferBlankItem(sample) {
  if (!sample || typeof sample !== "object") return { title: "", description: "" };
  return Object.fromEntries(Object.entries(sample).map(([key, value]) => [key, Array.isArray(value) ? [] : typeof value === "boolean" ? false : ""]));
}

function labelFor(key) {
  const labels = {
    title: "Titulo",
    description: "Descricao",
    text: "Texto",
    name: "Nome",
    date: "Data",
    rating: "Nota",
    image: "Imagem",
    credential: "Credencial",
    question: "Pergunta",
    answer: "Resposta",
    icon: "Icone",
    items: "Itens",
    highlight: "Destacar"
  };

  return labels[key] || key;
}

export default RepeaterField;
