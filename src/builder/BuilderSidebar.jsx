import { useEffect, useRef, useState } from "react";
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
  const scrollRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const [showColumnIndicators, setShowColumnIndicators] = useState(false);
  const [scrollbar, setScrollbar] = useState({
    visible: false,
    thumbHeight: 0,
    thumbTop: 0
  });

  useEffect(() => {
    const scrollNode = scrollRef.current;
    if (!scrollNode) return undefined;

    const updateScrollbar = (isVisible = false) => {
      const { clientHeight, scrollHeight, scrollTop } = scrollNode;
      const canScroll = scrollHeight > clientHeight;
      const trackHeight = Math.max(0, clientHeight - 20);
      const thumbHeight = canScroll ? Math.max(34, (clientHeight / scrollHeight) * trackHeight) : 0;
      const maxScrollTop = Math.max(1, scrollHeight - clientHeight);
      const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
      const thumbTop = canScroll ? 10 + (scrollTop / maxScrollTop) * maxThumbTop : 0;

      setScrollbar({
        visible: Boolean(isVisible && canScroll),
        thumbHeight,
        thumbTop
      });
    };

    const handleScroll = () => {
      setShowColumnIndicators(true);
      updateScrollbar(true);
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = window.setTimeout(() => {
        setShowColumnIndicators(false);
        updateScrollbar(false);
      }, 850);
    };

    updateScrollbar(false);
    scrollNode.addEventListener("scroll", handleScroll, { passive: true });
    const observer = new ResizeObserver(() => updateScrollbar(false));
    observer.observe(scrollNode);

    return () => {
      scrollNode.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

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
      <div ref={scrollRef} className="builder-sidebar-scroll configure-compact p-4">
        <FloatingColumnIndicators visible={showColumnIndicators} />
        <div className="configure-board">
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
      <EditorScrollThumb scrollbar={scrollbar} />
    </aside>
  );
}

function EditorScrollThumb({ scrollbar }) {
  return (
    <div className={`builder-editor-scrollbar ${scrollbar.visible ? "builder-editor-scrollbar-visible" : ""}`}>
      <div
        className="builder-editor-scrollbar-thumb"
        style={{
          height: `${scrollbar.thumbHeight}px`,
          transform: `translateY(${scrollbar.thumbTop}px)`
        }}
      />
    </div>
  );
}

function FloatingColumnIndicators({ visible }) {
  return (
    <div className={`configure-floating-legend ${visible ? "configure-floating-legend-visible" : ""}`}>
      {Object.entries(columnMeta).map(([key, meta]) => (
        <div key={key} className="configure-floating-legend-cell">
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
    <Card padding="sm" className="min-w-0 overflow-hidden">
      <CardHeader className="mb-2">
        <div>
          <CardTitle className="text-sm">{group.title}</CardTitle>
          <CardDescription className="text-xs leading-5">{group.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 space-y-2">
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
