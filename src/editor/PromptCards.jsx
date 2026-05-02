import { Clipboard, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../design-system/Button.jsx";
import Field from "../design-system/Field.jsx";
import { getPath, setPath } from "../domain/projectPaths.js";

export function PromptCards({ copySlots, onProjectChange, project }) {
  const [draft, setDraft] = useState("");
  const [instruction, setInstruction] = useState("");
  const [status, setStatus] = useState("");
  const promptSlots = useMemo(() => copySlots.filter(isPromptCopySlot), [copySlots]);
  const copywritingJson = useMemo(() => buildCopywritingPayload(project, promptSlots), [promptSlots, project]);
  const formattedCopy = useMemo(() => JSON.stringify(copywritingJson, null, 2), [copywritingJson]);
  const prompts = useMemo(
    () => [
      {
        id: "institutional",
        title: "Landing institucional",
        description: "Tom serio, confiavel e consultivo.",
        body: buildPrompt({
          formattedCopy,
          instruction,
          direction:
            "Crie uma versao um pouco mais institucional, seria e consultiva, com autoridade profissional, clareza juridica e tom acolhedor sem parecer agressivo."
        })
      },
      {
        id: "conversion",
        title: "Otimizar conversao",
        description: "Mais direta, persuasiva e orientada a CTA.",
        body: buildPrompt({
          formattedCopy,
          instruction,
          direction:
            "Crie uma versao mais focada em conversao, com beneficios concretos, reducao de friccao, chamadas para acao mais fortes e urgencia moderada sem prometer resultado."
        })
      }
    ],
    [formattedCopy, instruction]
  );

  const copyPrompt = async (prompt) => {
    await navigator.clipboard?.writeText(prompt);
    setStatus("Prompt copiado.");
  };

  const applyDraft = () => {
    try {
      const parsed = JSON.parse(cleanJsonDraft(draft));
      const nextProject = applyCopywritingPayload(project, parsed, promptSlots);
      onProjectChange(nextProject);
      setStatus("Copy e icones aplicados aos campos da coluna central.");
    } catch (error) {
      setStatus(`JSON invalido: ${error.message}`);
    }
  };

  return (
    <section className="slot-subsection prompt-subsection">
      <div className="slot-subsection-header">
        <h4>Fluxo JSON de copywriting</h4>
      </div>
      <div className="slot-subsection-body">
        <div className="prompt-flow">
          <PromptStep title="1. Instrucao">
            <Field
              as="textarea"
              aria-label="Instrucao geral"
              value={instruction}
              inputClassName="min-h-14"
              placeholder="Ex.: foco em inventario, tom acolhedor, publico de alto patrimonio, CTA para WhatsApp."
              onChange={(event) => setInstruction(event.target.value)}
            />
          </PromptStep>

          <PromptStep title="2. Copiar uma direcao">
            <div className="prompt-options-row">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="prompt-option">
                  <Button size="sm" variant="secondary" icon={Clipboard} onClick={() => copyPrompt(prompt.body)}>
                    {prompt.id === "institutional" ? "Institucional" : "Conversao"}
                  </Button>
                </div>
              ))}
            </div>
          </PromptStep>

          <PromptStep title="3. Colar JSON">
            <Field
              as="textarea"
              aria-label="Colar JSON"
              value={draft}
              inputClassName="min-h-16 font-mono text-xs"
              help={status}
              onChange={(event) => setDraft(event.target.value)}
            />
          </PromptStep>

          <PromptStep title="4. Aplicar">
            <div className="prompt-apply-row">
              <Button icon={Wand2} className="w-full" onClick={applyDraft}>
                Aplicar copywriting
              </Button>
            </div>
          </PromptStep>
        </div>
      </div>
    </section>
  );
}

function PromptStep({ children, title }) {
  return (
    <section className="prompt-step">
      <h3>{title}</h3>
      <div className="prompt-step-body">{children}</div>
    </section>
  );
}

export function buildCopywritingPayload(project, copySlots) {
  return copySlots.reduce((payload, slot) => {
    const compactPath = getCompactCopyPath(slot);
    return compactPath ? setPath(payload, compactPath, getCopywritingSlotValue(project, slot)) : payload;
  }, {});
}

function buildPrompt({ direction, formattedCopy, instruction }) {
  return [
    "Reescreva somente a copy e os ícones deste JSON compacto para uma landing page jurídica.",
    direction,
    "Preserve apenas as mesmas chaves compactas, objetos, arrays e tipos de campo que aparecem no JSON abaixo.",
    "Devolva somente títulos, subtítulos, parágrafos, bullets, reviews, FAQs, CTAs, metadados SEO e ícones temáticos quando já existirem no JSON.",
    "Use português do Brasil com acentuação correta. Não remova acentos de palavras como análise, jurídico, crédito, veículos, imóveis, dívida, orientação e contratação; corrija para a forma acentuada quando fizer sentido.",
    "Quando houver campo icon, escolha um nome real do pacote Lucide que você sabe que existe, em kebab-case, coerente com o contexto jurídico, financeiro ou institucional do texto.",
    "Não invente nomes de ícones, não use emoji e não mantenha um ícone genérico se houver uma opção Lucide mais específica e confiável.",
    "Em testimonials.reviews, gere exatamente 7 comentários positivos. Não crie nomes, fotos, datas ou dados pessoais; escreva apenas os textos dos comentários.",
    "Os comentários devem ser pessoais, diretos e sóbrios, com ângulos variados como clareza, organização, acompanhamento, orientação, segurança para decidir e comunicação. Não exagere elogios, não force prova social e não tente parecer institucional demais.",
    "Em faq.questionsText, responda como texto simples no formato Q1: pergunta, R1: resposta, Q2: pergunta, R2: resposta, e assim por diante. A quantidade de perguntas pode variar conforme o caso, mas mantenha o formato fácil de editar.",
    "Em faq.checklistText, responda como texto simples no formato I1: Título - descrição curta, I2: Título - descrição curta, e assim por diante. Seja objetivo e escaneavel.",
    "Não adicione novos assuntos, seções ou campos fora desse escopo de copy e ícones.",
    "Retorne somente o JSON válido dentro de um único bloco copiável ```json, sem explicações antes ou depois.",
    instruction.trim() ? `\nInstrução geral do editor:\n${instruction.trim()}` : "",
    `\nEstrutura atual de copywriting:\n${formattedCopy}`
  ].filter(Boolean).join("\n");
}

function applyCopywritingPayload(project, payload, copySlots) {
  return copySlots.reduce((nextProject, slot) => {
    const compactPath = getCompactCopyPath(slot);
    const value = compactPath ? getPath(payload, compactPath) : undefined;
    const currentValue = getPath(nextProject, slot.path);
    return value === undefined ? nextProject : setPath(nextProject, slot.path, applyCopywritingSlotValue(slot, currentValue, value));
  }, project);
}

function getCopywritingSlotValue(project, slot) {
  const value = getPath(project, slot.path);

  if (slot.path === "sections.testimonials.content.reviews") {
    return normalizeReviewTextList(value);
  }

  return value;
}

function applyCopywritingSlotValue(slot, currentValue, nextValue) {
  if (slot.path === "sections.testimonials.content.reviews") {
    return mergeReviewTexts(currentValue, nextValue);
  }

  return preserveAccentOnlyChanges(currentValue, nextValue);
}

function normalizeReviewTextList(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 7).map((item) => typeof item === "string" ? item : item?.text || "");
}

function mergeReviewTexts(currentValue, nextValue) {
  const texts = Array.isArray(nextValue) ? nextValue : [];
  const currentReviews = Array.isArray(currentValue) ? currentValue : [];
  return Array.from({ length: 7 }, (_, index) => ({
    name: currentReviews[index]?.name || "",
    date: currentReviews[index]?.date || "",
    rating: currentReviews[index]?.rating || 5,
    image: currentReviews[index]?.image || "",
    text: preserveAccentOnlyChanges(currentReviews[index]?.text || "", texts[index] || "")
  }));
}

function preserveAccentOnlyChanges(currentValue, nextValue) {
  if (typeof currentValue === "string" && typeof nextValue === "string") {
    const currentHasAccent = hasDiacritics(currentValue);
    const nextLostAccent = currentHasAccent && !hasDiacritics(nextValue);
    return nextLostAccent && stripDiacritics(currentValue) === stripDiacritics(nextValue) ? currentValue : nextValue;
  }

  if (Array.isArray(currentValue) && Array.isArray(nextValue)) {
    return nextValue.map((item, index) => preserveAccentOnlyChanges(currentValue[index], item));
  }

  if (isPlainObject(currentValue) && isPlainObject(nextValue)) {
    return Object.fromEntries(
      Object.entries(nextValue).map(([key, value]) => [key, preserveAccentOnlyChanges(currentValue[key], value)])
    );
  }

  return nextValue;
}

function hasDiacritics(value) {
  return stripDiacritics(value) !== value;
}

function stripDiacritics(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanJsonDraft(value) {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function isPromptCopySlot(slot) {
  if (slot.path.startsWith("site.meta")) return true;
  if (slot.group !== "content") return false;
  if (["url", "email", "image", "tracking-event"].includes(slot.type)) return false;
  if (slot.path.includes(".media.") || slot.path.endsWith(".url")) return false;
  return true;
}

function getCompactCopyPath(slot) {
  if (slot.path.startsWith("site.meta.")) {
    return `seo.${slot.path.replace("site.meta.", "")}`;
  }

  const sectionMatch = slot.path.match(/^sections\.([^.]+)\.content\.(.+)$/);
  if (sectionMatch) {
    return `${sectionMatch[1]}.${sectionMatch[2]}`;
  }

  return null;
}

export default PromptCards;
