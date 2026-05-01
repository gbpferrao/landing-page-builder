import { useMemo, useState } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "../design-system/Card.jsx";
import SegmentedControl from "../design-system/SegmentedControl.jsx";
import { globalSlots, sectionSchemas } from "../domain/projectSchema.js";
import { getPath, setPath } from "../domain/projectPaths.js";
import TrackingEditor from "./TrackingEditor.jsx";
import ImageField from "./field-renderers/ImageField.jsx";
import ListField from "./field-renderers/ListField.jsx";
import ObjectField from "./field-renderers/ObjectField.jsx";
import RepeaterField from "./field-renderers/RepeaterField.jsx";
import TextAreaField from "./field-renderers/TextAreaField.jsx";
import TextField from "./field-renderers/TextField.jsx";
import SelectField from "./field-renderers/SelectField.jsx";
import UrlField from "./field-renderers/UrlField.jsx";

const groupLabels = {
  site: "Geral",
  content: "Conteudo",
  assets: "Assets",
  tracking: "Tracking"
};

export function SlotEditor({ project, onProjectChange }) {
  const sectionOptions = useMemo(
    () => [
      { value: "general", label: "Geral" },
      ...sectionSchemas.map((section) => ({ value: section.id, label: section.label }))
    ],
    []
  );
  const [activeSection, setActiveSection] = useState("general");
  const slots = activeSection === "general"
    ? globalSlots
    : sectionSchemas.find((section) => section.id === activeSection)?.slots || [];
  const groupedSlots = groupSlots(slots);

  const updateSlot = (path, value) => {
    onProjectChange(setPath(project, path, value));
  };

  return (
    <div className="space-y-4">
      <SegmentedControl
        ariaLabel="Secao editada"
        className="flex w-full flex-wrap"
        size="sm"
        value={activeSection}
        onValueChange={setActiveSection}
        options={sectionOptions}
      />

      {Object.entries(groupedSlots).map(([group, groupSlots]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle>{groupLabels[group] || group}</CardTitle>
          </CardHeader>
          <CardContent>
            {groupSlots.map((slot) => (
              <SlotField
                key={slot.path}
                slot={slot}
                value={getPath(project, slot.path)}
                onChange={(value) => updateSlot(slot.path, value)}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SlotField({ slot, value, onChange }) {
  if (slot.type === "textarea") return <TextAreaField slot={slot} value={value} onChange={onChange} />;
  if (slot.type === "url" || slot.type === "email") return <UrlField slot={slot} value={value} onChange={onChange} />;
  if (slot.type === "image") return <ImageField slot={slot} value={value} onChange={onChange} />;
  if (slot.type === "list") return <ListField slot={slot} value={value} onChange={onChange} />;
  if (slot.type === "repeater") return <RepeaterField slot={slot} value={value} onChange={onChange} />;
  if (slot.type === "object") return <ObjectField slot={slot} value={value} onChange={onChange} />;
  if (slot.type === "select") return <SelectField slot={slot} value={value} onChange={onChange} />;
  if (slot.type === "tracking-event") return <TrackingEditor slot={slot} value={value} onChange={onChange} />;

  if (slot.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-ink-800">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        {slot.label}
      </label>
    );
  }

  return <TextField slot={slot} value={value} onChange={onChange} />;
}

function groupSlots(slots) {
  return slots.reduce((groups, slot) => {
    const group = slot.group || "content";
    groups[group] = groups[group] || [];
    groups[group].push(slot);
    return groups;
  }, {});
}

export default SlotEditor;
