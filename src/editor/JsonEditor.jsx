import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../design-system/Button.jsx";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "../design-system/Card.jsx";
import { normalizeProject, serializeProject } from "../domain/normalizeProject.js";
import { validateProjectShape } from "../domain/projectSchema.js";
import { debounce } from "../lib/debounce.js";

export function JsonEditor({ project, onProjectChange }) {
  const externalJson = useMemo(() => serializeProject(project), [project]);
  const [draft, setDraft] = useState(externalJson);
  const [status, setStatus] = useState({ type: "valid", message: "JSON V2 valido." });
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (!isFocusedRef.current) {
      setDraft(externalJson);
      setStatus({ type: "valid", message: "JSON V2 valido." });
    }
  }, [externalJson]);

  const applyDraft = useMemo(
    () => debounce((nextDraft) => {
      try {
        const parsed = JSON.parse(nextDraft);
        const normalized = normalizeProject(parsed);
        const shape = validateProjectShape(normalized);
        if (!shape.valid) {
          setStatus({ type: "error", message: `Campos obrigatorios ausentes: ${shape.missing.join(", ")}` });
          return;
        }

        onProjectChange(normalized);
        setStatus({ type: "valid", message: "Aplicado ao preview e aos slots." });
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      }
    }, 350),
    [onProjectChange]
  );

  useEffect(() => () => applyDraft.cancel(), [applyDraft]);

  const handleChange = (event) => {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    setStatus({ type: "pending", message: "Validando..." });
    applyDraft(nextDraft);
  };

  const formatDraft = () => {
    try {
      const normalized = normalizeProject(JSON.parse(draft));
      const formatted = serializeProject(normalized);
      setDraft(formatted);
      onProjectChange(normalized);
      setStatus({ type: "valid", message: "JSON formatado e aplicado." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const resetDraft = () => {
    setDraft(externalJson);
    setStatus({ type: "valid", message: "Rascunho restaurado para o ultimo estado valido." });
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>JSON V2 canonico</CardTitle>
          <CardDescription>
            Cole ou edite um projeto V2 completo. JSON invalido nao substitui o ultimo estado valido.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <textarea
          className="h-[52vh] min-h-96 w-full resize-y rounded-md border border-line bg-ink-950 p-3 font-mono text-xs leading-5 text-white outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          spellCheck={false}
          value={draft}
          onFocus={() => {
            isFocusedRef.current = true;
          }}
          onBlur={() => {
            isFocusedRef.current = false;
          }}
          onChange={handleChange}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`text-sm ${status.type === "error" ? "text-red-700" : status.type === "pending" ? "text-gold-600" : "text-muted"}`}>
            {status.message}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={resetDraft}>Restaurar</Button>
            <Button size="sm" onClick={formatDraft}>Formatar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JsonEditor;
