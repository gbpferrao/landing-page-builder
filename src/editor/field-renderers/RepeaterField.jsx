import Button from "../../design-system/Button.jsx";
import Field from "../../design-system/Field.jsx";
import AssetPicker from "../AssetPicker.jsx";

export function RepeaterField({ slot, value, onChange }) {
  const items = Array.isArray(value) ? value : [];

  const updateItem = (index, key, nextValue) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: nextValue } : item)));
  };

  const addItem = () => {
    onChange([...items, inferBlankItem(items[0])]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-ink-800">{slot.label}</label>
        <Button size="sm" variant="secondary" onClick={addItem}>Adicionar</Button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="space-y-2 rounded-md border border-line bg-paper p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted">Item {index + 1}</p>
              <Button size="sm" variant="ghost" onClick={() => removeItem(index)}>Remover</Button>
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
        ))}
      </div>
    </div>
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
