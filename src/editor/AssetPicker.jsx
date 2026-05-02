import { Image, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "../design-system/Button.jsx";
import Dialog from "../design-system/Dialog.jsx";
import { registerPersistedAsset } from "../lib/objectUrls.js";
import { getAssetIdFromRef, isIndexedDbAssetRef, makeAssetRef, saveAssetFile } from "../lib/projectStore.js";
import { previewAsset } from "../preview/previewUtils.js";

export function AssetPicker({ label, value, onChange }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inputRef = useRef(null);
  const hasAsset = Boolean(value);
  const detail = getAssetDetail(value);
  const previewUrl = hasAsset ? previewAsset(value) : "";

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const asset = await saveAssetFile(file);
    const assetRef = makeAssetRef(asset.id);
    registerPersistedAsset(assetRef, file);
    onChange(assetRef);
    event.target.value = "";
  };

  const clearAsset = () => {
    onChange("");
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="asset-chip">
        <div className="asset-chip-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="" />
          ) : (
            <Image size={22} aria-hidden="true" />
          )}
        </div>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/*"
          onChange={handleUpload}
        />
        <div className="asset-chip-main">
          <div className="asset-chip-copy">
            <p>{hasAsset ? detail.title : "Nenhuma imagem selecionada"}</p>
            <span>{hasAsset ? detail.subtitle : "Envie uma imagem ou mantenha o campo vazio."}</span>
          </div>
          <button type="button" className="asset-chip-upload" onClick={() => inputRef.current?.click()}>
            <Upload size={18} aria-hidden="true" />
            <span>Upload</span>
          </button>
        </div>
        {hasAsset ? (
          <button
            type="button"
          className="asset-chip-delete"
          aria-label="Remover imagem"
          onClick={() => setConfirmOpen(true)}
        >
            <X size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover imagem?"
        description="A imagem sera removida deste campo. Arquivos ja exportados nao sao alterados."
        footer={(
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button variant="danger" icon={X} onClick={clearAsset}>Remover</Button>
          </div>
        )}
      >
        <p className="text-sm leading-6 text-muted">
          O campo volta para o estado vazio e a landing nao renderiza esta imagem ate voce enviar outra ou informar um caminho.
        </p>
      </Dialog>
    </>
  );
}

function getAssetDetail(value) {
  const rawValue = String(value || "");

  if (isIndexedDbAssetRef(rawValue)) {
    const id = getAssetIdFromRef(rawValue);
    return {
      title: "Imagem enviada",
      subtitle: id ? `Asset salvo: ${id}` : "Asset salvo no navegador"
    };
  }

  const cleanValue = rawValue.split(/[?#]/)[0];
  const name = cleanValue.split("/").filter(Boolean).at(-1) || rawValue;
  return {
    title: name,
    subtitle: rawValue
  };
}

export default AssetPicker;
