import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
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
      updateScrollbar(true);
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = window.setTimeout(() => {
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
        id: "global-brand",
        title: "Marca e canal",
        description: "Identidade visual e link principal de contato.",
        slots: pickSlots(globalSlots, [
          "site.brand.name",
          "site.brand.logo",
          "site.brand.whatsappUrl"
        ])
      },
      {
        id: "global-tracking-providers",
        title: "Provedores de tracking",
        description: "IDs de Google e Meta com ativacao direta.",
        slots: pickSlots(globalSlots, [
          "site.tracking.providers.ga4.enabled",
          "site.tracking.providers.ga4.measurementId",
          "site.tracking.providers.googleAds.enabled",
          "site.tracking.providers.googleAds.conversionId",
          "site.tracking.providers.meta.enabled",
          "site.tracking.providers.meta.pixelId"
        ])
      },
      {
        id: "global-tracking-events",
        title: "Eventos",
        description: "Tags unicas da landing: pageview e clique em WhatsApp.",
        slots: pickSlots(globalSlots, [
          "site.tracking.pageView",
          "site.tracking.whatsappClick"
        ])
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
        general: makeSectionGroups(section.id, "general", generalSlots),
        copy: makeSectionGroups(section.id, "copy", copySlots)
      }
    };
  });

  const copySlots = [
    ...globalGroups.copy.flatMap((group) => group.slots),
    ...sectionRows.flatMap((row) => row.columns.copy.flatMap((group) => group.slots))
  ];

  return (
    <aside className="builder-sidebar">
      <div ref={scrollRef} className="builder-sidebar-scroll configure-compact p-4">
        <div className="configure-board">
          <ConfigureLegend />
          <ConfigureSection
            hideDescription
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

function ConfigureLegend() {
  return (
    <div className="configure-legend">
      {Object.entries(columnMeta).map(([key, meta]) => (
        <div key={key} className="configure-legend-cell">
          <h2>
            {meta.title}
            <ArrowDown aria-hidden="true" />
          </h2>
        </div>
      ))}
    </div>
  );
}

function ConfigureSection({ columns, copyLead, description, hideDescription = false, onProjectChange, project, title }) {
  return (
    <section className="configure-section">
      <div className="configure-section-header">
        <h3>{title}</h3>
        {description && !hideDescription ? <p>{description}</p> : null}
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

  const updateTrackingProvider = (provider, idKey, nextValue, nextEnabled) => {
    const withId = setPath(project, `site.tracking.providers.${provider}.${idKey}`, nextValue);
    onProjectChange(setPath(withId, `site.tracking.providers.${provider}.enabled`, nextEnabled));
  };

  const renderSlot = (slot) => {
    const providerConfig = getTrackingProviderConfig(slot.path);
    if (isTrackingProviderEnabledSlot(slot.path)) return null;

    if (providerConfig) {
      const { provider, enabledPath, idKey } = providerConfig;
      const enabled = Boolean(getPath(project, enabledPath));
      const value = getPath(project, slot.path) ?? "";

      return (
        <TrackingProviderField
          key={slot.path}
          enabled={enabled}
          label={slot.label}
          value={value}
          onChange={(nextValue) => updateTrackingProvider(provider, idKey, nextValue, enabled)}
          onToggle={() => updateTrackingProvider(provider, idKey, value, !enabled)}
        />
      );
    }

    return (
      <SlotField
        key={slot.path}
        slot={slot}
        value={getPath(project, slot.path)}
        onChange={(value) => updateSlot(slot.path, value)}
      />
    );
  };

  const providerSlots = group.slots.filter((slot) => getTrackingProviderConfig(slot.path));
  const nonProviderSlots = group.slots.filter((slot) =>
    !getTrackingProviderConfig(slot.path) && !isTrackingProviderEnabledSlot(slot.path)
  );

  return (
    <section className="slot-subsection">
      <div className="slot-subsection-header">
        <h4>{group.title}</h4>
        {group.description ? <p>{group.description}</p> : null}
      </div>
      <div className="slot-subsection-body">
        {providerSlots.length ? (
          <div className="tracking-provider-grid">
            {providerSlots.map(renderSlot)}
          </div>
        ) : null}
        {nonProviderSlots.map(renderSlot)}
      </div>
    </section>
  );
}

function TrackingProviderField({ enabled, label, onChange, onToggle, value }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink-800">{label}</label>
      <div className="tracking-provider-control">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className={enabled ? "tracking-provider-toggle tracking-provider-toggle-on" : "tracking-provider-toggle"}
          aria-pressed={enabled}
          onClick={onToggle}
        >
          {enabled ? "Ativo" : "Off"}
        </button>
      </div>
    </div>
  );
}

function makeGroup(id, title, description, slots) {
  return { id, title, description, slots };
}

function makeSectionGroups(sectionId, column, slots) {
  const groups = sectionGroupBlueprints[sectionId]?.[column] || [
    {
      id: `${sectionId}-${column}`,
      title: column === "general" ? "Dados da secao" : "Conteudo da secao",
      description: column === "general" ? "Campos fixos desta area." : "Textos e chamadas exibidos nesta area.",
      paths: slots.map((slot) => slot.path)
    }
  ];

  const usedPaths = new Set();
  const builtGroups = groups.map((group) => {
    const groupSlots = pickSlots(slots, group.paths);
    groupSlots.forEach((slot) => usedPaths.add(slot.path));
    return makeGroup(group.id, group.title, group.description, groupSlots);
  });
  const remainingSlots = slots.filter((slot) => !usedPaths.has(slot.path));

  if (remainingSlots.length) {
    builtGroups.push(makeGroup(
      `${sectionId}-${column}-more`,
      column === "general" ? "Outros dados" : "Outros campos",
      "Campos complementares desta secao.",
      remainingSlots
    ));
  }

  return builtGroups.filter((group) => group.slots.length);
}

function pickSlots(slots, paths) {
  const pathSet = new Set(paths);
  return slots.filter((slot) => pathSet.has(slot.path));
}

function isGeneralSectionSlot(section, slot) {
  return slot.group !== "tracking" && ["team", "testimonials", "footer"].includes(section.id);
}

const sectionGroupBlueprints = {
  hero: {
    copy: [
      {
        id: "hero-message",
        title: "Mensagem principal",
        description: "Primeira dobra, promessa e reforcos de confianca.",
        paths: [
          "sections.hero.content.eyebrow",
          "sections.hero.content.title",
          "sections.hero.content.subtitle",
          "sections.hero.content.bullets",
          "sections.hero.content.reassurance"
        ]
      },
      {
        id: "hero-action-media",
        title: "CTA e midia",
        description: "Botao principal e video do topo.",
        paths: [
          "sections.hero.content.button.label",
          "sections.hero.content.button.url",
          "sections.hero.content.media.url"
        ]
      }
    ]
  },
  problems: {
    copy: [
      {
        id: "problems-context",
        title: "Abertura",
        description: "Titulo, chamada e contexto antes dos cards.",
        paths: [
          "sections.problems.content.eyebrow",
          "sections.problems.content.title",
          "sections.problems.content.intro"
        ]
      },
      {
        id: "problems-cards",
        title: "Cards de dor",
        description: "Situacoes que o visitante reconhece no proprio caso.",
        paths: ["sections.problems.content.cards"]
      }
    ]
  },
  solutions: {
    copy: [
      {
        id: "solutions-context",
        title: "Abertura",
        description: "Titulo e chamada da area de solucoes.",
        paths: [
          "sections.solutions.content.eyebrow",
          "sections.solutions.content.title"
        ]
      },
      {
        id: "solutions-items",
        title: "Itens de solucao",
        description: "Blocos de atuacao e beneficios.",
        paths: ["sections.solutions.content.items"]
      }
    ]
  },
  value: {
    copy: [
      {
        id: "value-message",
        title: "Mensagem de valor",
        description: "Texto central, destaques e paragrafo de apoio.",
        paths: [
          "sections.value.content.title",
          "sections.value.content.subtitle",
          "sections.value.content.highlights",
          "sections.value.content.paragraphs"
        ]
      },
      {
        id: "value-action-asset",
        title: "CTA e imagem",
        description: "Chamada do botao e imagem lateral da secao.",
        paths: [
          "sections.value.content.button.label",
          "sections.value.assets.image.src",
          "sections.value.assets.image.alt"
        ]
      }
    ]
  },
  team: {
    general: [
      {
        id: "team-intro",
        title: "Cabecalho da equipe",
        description: "Titulo e subtitulo da area institucional.",
        paths: [
          "sections.team.content.title",
          "sections.team.content.subtitle"
        ]
      },
      {
        id: "team-profiles",
        title: "Perfis",
        description: "Advogados, credenciais e fotos.",
        paths: ["sections.team.content.profiles"]
      }
    ]
  },
  testimonials: {
    general: [
      {
        id: "testimonials-context",
        title: "Prova social",
        description: "Titulo, link externo e aviso legal.",
        paths: [
          "sections.testimonials.content.title",
          "sections.testimonials.content.readMoreUrl",
          "sections.testimonials.content.readMoreLabel",
          "sections.testimonials.content.disclaimer"
        ]
      },
      {
        id: "testimonials-reviews",
        title: "Reviews",
        description: "Depoimentos exibidos no carrossel.",
        paths: ["sections.testimonials.content.reviews"]
      },
      {
        id: "testimonials-assets",
        title: "Selo Google",
        description: "Marca visual usada nos cards.",
        paths: ["sections.testimonials.assets.googleLogo"]
      }
    ]
  },
  cta: {
    copy: [
      {
        id: "cta-message",
        title: "Chamada final",
        description: "Ultima oferta antes do rodape.",
        paths: [
          "sections.cta.content.title",
          "sections.cta.content.text",
          "sections.cta.content.button.label"
        ]
      }
    ]
  },
  faq: {
    copy: [
      {
        id: "faq-questions",
        title: "Perguntas",
        description: "Cabecalho, perguntas e fechamento.",
        paths: [
          "sections.faq.content.eyebrow",
          "sections.faq.content.title",
          "sections.faq.content.questionsText",
          "sections.faq.content.closing"
        ]
      },
      {
        id: "faq-checklist",
        title: "Checklist",
        description: "Lista lateral de pontos importantes.",
        paths: [
          "sections.faq.content.checklistEyebrow",
          "sections.faq.content.checklistTitle",
          "sections.faq.content.checklistText"
        ]
      },
      {
        id: "faq-action",
        title: "CTA final",
        description: "Texto do botao abaixo do FAQ.",
        paths: ["sections.faq.content.button.label"]
      }
    ]
  },
  footer: {
    general: [
      {
        id: "footer-contact",
        title: "Contato",
        description: "Endereco, telefone e email do rodape.",
        paths: [
          "site.footer.address",
          "site.footer.phone",
          "site.footer.email"
        ]
      },
      {
        id: "footer-social",
        title: "Redes sociais",
        description: "Link e usuario do Instagram.",
        paths: [
          "site.footer.instagram",
          "site.footer.instagramHandle"
        ]
      }
    ]
  }
};

function getTrackingProviderConfig(path) {
  const configs = {
    "site.tracking.providers.ga4.measurementId": {
      provider: "ga4",
      idKey: "measurementId",
      enabledPath: "site.tracking.providers.ga4.enabled"
    },
    "site.tracking.providers.googleAds.conversionId": {
      provider: "googleAds",
      idKey: "conversionId",
      enabledPath: "site.tracking.providers.googleAds.enabled"
    },
    "site.tracking.providers.meta.pixelId": {
      provider: "meta",
      idKey: "pixelId",
      enabledPath: "site.tracking.providers.meta.enabled"
    }
  };

  return configs[path] || null;
}

function isTrackingProviderEnabledSlot(path) {
  return [
    "site.tracking.providers.ga4.enabled",
    "site.tracking.providers.googleAds.enabled",
    "site.tracking.providers.meta.enabled"
  ].includes(path);
}

export default BuilderSidebar;
