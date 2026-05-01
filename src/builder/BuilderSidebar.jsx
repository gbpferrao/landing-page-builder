import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "../design-system/Card.jsx";
import { globalSlots, sectionSchemas } from "../domain/projectSchema.js";
import { getPath, setPath } from "../domain/projectPaths.js";
import PromptCards from "../editor/PromptCards.jsx";
import { SlotField } from "../editor/SlotEditor.jsx";

const columnMeta = {
  general: {
    title: "Geral",
    description: "Dados fixos, escritorio, equipe, contatos e tags globais."
  },
  copy: {
    title: "Copywriting",
    description: "Tema, textos, listas, FAQ, CTAs, imagens e icones."
  }
};

export function BuilderSidebar({ project, onProjectChange }) {
  const globalGroups = {
    general: [
      {
        id: "global-general",
        title: "Escritorio",
        description: "Marca, logo e canal principal.",
        slots: globalSlots.filter((slot) => slot.group !== "tracking" && !slot.path.startsWith("site.meta"))
      },
      {
        id: "global-tracking",
        title: "Tags globais",
        description: "Google, Meta, pageview, video e cliques em WhatsApp.",
        slots: globalSlots.filter((slot) => slot.group === "tracking")
      }
    ],
    copy: [
      {
        id: "global-copy",
        title: "SEO e tema",
        description: "Metadados gerais da pagina.",
        slots: globalSlots.filter((slot) => slot.path.startsWith("site.meta"))
      }
    ]
  };

  const sectionRows = sectionSchemas.map((section) => {
    const generalSlots = section.slots.filter((slot) => isGeneralSectionSlot(section, slot));
    const copySlots = section.slots.filter((slot) => slot.group !== "tracking" && !isGeneralSectionSlot(section, slot));

    return {
      id: section.id,
      title: section.label,
      columns: {
        general: makeGroup(`${section.id}-general`, "Geral da secao", "Campos institucionais desta secao.", generalSlots),
        copy: makeGroup(`${section.id}-copy`, "Copy da secao", "Conteudo tematico exibido nesta area.", copySlots)
      }
    };
  });

  const copySlots = [
    ...globalGroups.copy.flatMap((group) => group.slots),
    ...sectionRows.flatMap((row) => row.columns.copy.slots)
  ];

  return (
    <aside className="builder-sidebar">
      <div className="builder-sidebar-scroll configure-compact p-4">
        <div className="configure-board">
          <ConfigureLegend />
          <ConfigureSection
            title="Config geral"
            description="Itens amplos que valem para a landing inteira, antes de entrar nas secoes."
            columns={globalGroups}
            project={project}
            onProjectChange={onProjectChange}
            copyLead={<PromptCards copySlots={copySlots} project={project} onProjectChange={onProjectChange} />}
          />

          {sectionRows.map((row) => (
            <ConfigureSection
              key={row.id}
              title={row.title}
              columns={row.columns}
              project={project}
              onProjectChange={onProjectChange}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function ConfigureLegend() {
  return (
    <div className="configure-legend">
      {Object.entries(columnMeta).map(([key, meta]) => (
        <div key={key} className="configure-legend-cell">
          <h2>{meta.title}</h2>
          <p>{meta.description}</p>
        </div>
      ))}
    </div>
  );
}

function ConfigureSection({ columns, copyLead, description, onProjectChange, project, title }) {
  return (
    <section className="configure-section">
      <div className="configure-section-header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="configure-section-grid">
        <ConfigureCell groups={columns.general} project={project} onProjectChange={onProjectChange} />
        <ConfigureCell groups={columns.copy} project={project} onProjectChange={onProjectChange} lead={copyLead} />
      </div>
    </section>
  );
}

function ConfigureCell({ groups, lead, project, onProjectChange }) {
  const groupList = Array.isArray(groups) ? groups : [groups].filter(Boolean);
  const visibleGroups = groupList.filter((group) => group.slots.length);

  return (
    <div className="configure-cell">
      {lead}
      {visibleGroups.length ? (
        visibleGroups.map((group) => (
          <SlotGroup key={group.id} group={group} project={project} onProjectChange={onProjectChange} />
        ))
      ) : (
        <div className="configure-empty">Sem campos nesta coluna.</div>
      )}
    </div>
  );
}

function SlotGroup({ group, project, onProjectChange }) {
  const updateSlot = (path, value) => {
    onProjectChange(setPath(project, path, value));
  };

  return (
    <Card padding="sm">
      <CardHeader className="mb-2">
        <div>
          <CardTitle className="text-sm">{group.title}</CardTitle>
          <CardDescription className="text-xs leading-5">{group.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {group.slots.map((slot) => (
          <SlotField
            key={slot.path}
            slot={slot}
            value={getPath(project, slot.path)}
            onChange={(value) => updateSlot(slot.path, value)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function makeGroup(id, title, description, slots) {
  return { id, title, description, slots };
}

function isGeneralSectionSlot(section, slot) {
  return slot.group !== "tracking" && ["team", "testimonials", "footer"].includes(section.id);
}

export default BuilderSidebar;
