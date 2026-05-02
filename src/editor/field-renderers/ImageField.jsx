import Field from "../../design-system/Field.jsx";
import AssetPicker from "../AssetPicker.jsx";

export function ImageField({ slot, value, onChange }) {
  return (
    <div className="space-y-2">
      <Field
        label={slot.label}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        help="Informe um caminho em assets/ ou envie uma imagem."
      />
      <AssetPicker label="Enviar imagem" value={value} onChange={onChange} />
    </div>
  );
}

export default ImageField;
