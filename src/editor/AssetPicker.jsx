import { Upload } from "lucide-react";
import Button from "../design-system/Button.jsx";
import { registerPersistedAsset } from "../lib/objectUrls.js";
import { makeAssetRef, saveAssetFile } from "../lib/projectStore.js";
import { previewAsset } from "../preview/previewUtils.js";

export function AssetPicker({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      {value ? (
        <div className="grid h-28 place-items-center overflow-hidden rounded-md border border-line bg-paper">
          <img src={String(value).startsWith("blob:") ? value : previewAsset(value)} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <label className="block">
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const asset = await saveAssetFile(file);
            const assetRef = makeAssetRef(asset.id);
            registerPersistedAsset(assetRef, file);
            onChange(assetRef);
            event.target.value = "";
          }}
        />
        <Button as="span" variant="secondary" icon={Upload} className="w-full cursor-pointer">
          {label || "Substituir imagem"}
        </Button>
      </label>
    </div>
  );
}

export default AssetPicker;
