import { Image } from "lucide-react";
import Field from "../../design-system/Field.jsx";
import { previewAsset } from "../../preview/previewUtils.js";
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
      {value ? (
        <div className="flex items-center gap-3 rounded-md border border-line bg-paper p-2">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-white">
            <img src={String(value).startsWith("blob:") ? value : previewAsset(value)} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 text-xs text-muted">
            <div className="mb-1 flex items-center gap-1 font-medium text-ink-800">
              <Image size={13} />
              Asset atual
            </div>
            <p className="truncate">{value}</p>
          </div>
        </div>
      ) : null}
      <AssetPicker label="Enviar imagem" value={value} onChange={onChange} />
    </div>
  );
}

export default ImageField;
