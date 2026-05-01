import { landingTrackingDefaults } from "./trackingSchema.js";

const whatsappUrl = "https://api.whatsapp.com/send/?phone=5522998793244&text=Ol%C3%A1%2C+estou+navegando+no+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es...&type=phone_number&app_absent=0";

export const defaultProject = {
  site: {
    meta: {
      title: "Advocacia Especializada em Revisao de Juros Abusivos",
      description: "Landing page reutilizavel para campanhas juridicas.",
      language: "pt-BR"
    },
    brand: {
      name: "Andrade & Andrade Advogados Associados",
      logo: "assets/defaults/logo.png",
      whatsappUrl
    },
    footer: {
      menu: [
        { label: "Inicio", url: "#top" },
        { label: "Como ajudamos", url: "#solucoes" },
        { label: "Equipe", url: "#equipe" },
        { label: "Duvidas", url: "#faq" }
      ],
      address: "Praca Demerval Barbosa Moreira, n. 28, Cobertura, Centro - Nova Friburgo/RJ - CEP 28610-160",
      phone: "(22) 9 9879-3244",
      email: "contato@andradeandradeadv.com.br",
      instagram: "https://www.instagram.com/andradesadv",
      instagramHandle: "@andradesadv",
      copyright: "Todos os Direitos Reservados 2026"
    },
    tracking: landingTrackingDefaults
  },
  sections: {
    hero: {
      content: {
        eyebrow: "Advocacia especializada",
        title: "Revisao de juros abusivos em contratos bancarios",
        subtitle: "Mesmo que voce nao saiba se ha irregularidade, podemos avaliar seus documentos e orientar os proximos passos com clareza.",
        bullets: [
          "Atendimento direto por WhatsApp",
          "Analise inicial do seu caso",
          "Atuacao em contratos, financiamentos e cartoes"
        ],
        reassurance: "Atendimento inicial pelo WhatsApp com orientacao sobre os documentos necessarios.",
        button: {
          label: "Enviar meu contrato para analise",
          url: "{{brand.whatsappUrl}}",
          color: "green",
          rounding: "square"
        },
        media: {
          type: "youtube",
          url: "https://www.youtube.com/shorts/PASTE_VIDEO_ID_HERE",
          title: "Advogado explicando a area de atuacao",
          fallbackImage: "assets/defaults/logo.png"
        }
      },
      assets: {}
    },
    problems: {
      content: {
        eyebrow: "Entenda se voce esta pagando juros abusivos?",
        title: "Voce esta enfrentando algum desses problemas?",
        intro: "Se alguma dessas situacoes se aplica ao seu caso, saiba que e possivel realizar uma analise juridica do seu contrato e verificar alternativas para melhorar suas condicoes financeiras.",
        cards: [
          { icon: "credit-card", title: "Possiveis irregularidades em financiamentos de veiculos ou imoveis?", items: ["Seu saldo devedor continua elevado, mesmo apos anos pagando?", "Parcelas reajustadas sem explicacao detalhada no contrato?"] },
          { icon: "percent", title: "Emprestimos bancarios ou consignados com encargos elevados?", items: ["O valor do desconto aplicado esta diferente do informado no contrato?", "Voce identificou tarifas que nao foram claramente especificadas na contratacao?"] },
          { icon: "file-text", title: "Cartao de credito e cheque especial com altos encargos?", items: ["Divida aumentando rapidamente, mesmo mantendo os pagamentos?", "Encargos adicionais que nao estavam claros no momento da adesao?"] },
          { icon: "triangle-alert", title: "Empresas com necessidade de melhorar condicoes contratuais?", highlight: true, items: ["Financiamentos empresariais impactando o fluxo de caixa?", "Condicoes bancarias que poderiam ser analisadas para ajustes mais vantajosos?"] }
        ]
      },
      assets: {}
    },
    solutions: {
      content: {
        eyebrow: "Entenda como um advogado revisional pode atuar",
        title: "Como podemos te ajudar?",
        items: [
          { title: "Analise juridica de contratos financeiros", description: "Avaliamos clausulas contratuais e buscamos melhores condicoes de pagamento." },
          { title: "Revisao de contratos", description: "Identificamos oportunidades de ajustes em encargos e condicoes contratuais." },
          { title: "Assessoria especializada em direito bancario", description: "Oferecemos suporte para analisar cobrancas e buscar solucoes financeiras mais justas." },
          { title: "Negociacao direta com bancos", description: "Atuamos estrategicamente para buscar condicoes mais vantajosas para voce." },
          { title: "Protecao contra inadimplencia", description: "Reduza riscos financeiros e evite restricoes ao seu nome ou empresa." },
          { title: "Atuacao personalizada e transparente", description: "Atendimento especializado, com etica e comprometimento total com seu caso." }
        ]
      },
      assets: {}
    },
    value: {
      content: {
        title: "Solicite uma analise de um advogado especialista em dividas bancarias.",
        subtitle: "Entenda se seu contrato esta dentro das condicoes ideais e evite cobrancas indevidas",
        highlights: ["Analise do contrato e dos pagamentos", "Identificacao de cobrancas questionaveis", "Orientacao sobre negociacao ou medida cabivel"],
        paragraphs: [
          "Voce sabe se as condicoes do seu financiamento sao justas?",
          "Muitos contratos bancarios e de credito podem conter taxas indevidas ou encargos questionaveis.",
          "O Andrade & Andrade Advogados conta com uma equipe especializada na revisao de financiamentos, contratos bancarios e renegociacao de dividas, garantindo que seus direitos sejam preservados.",
          "Fale com um advogado especialista e veja como podemos ajudar!"
        ],
        button: {
          label: "Enviar meu contrato para analise",
          url: "{{brand.whatsappUrl}}",
          color: "black",
          rounding: "square"
        }
      },
      assets: {
        image: { src: "assets/defaults/hero-bg.png", alt: "Analise de documentos financeiros" }
      }
    },
    team: {
      content: {
        title: "Nossa equipe",
        subtitle: "Advogados especialistas em dividas bancarias e juros de financiamento",
        profiles: [
          { name: "Dr. Erick Jose Guimaraes de Andrade", credential: "Direito Bancario e Revisional", image: "assets/defaults/team/team-01.png" },
          { name: "Dr. Erick Jose Guimaraes de Andrade Junior", credential: "Contratos e Dividas Bancarias", image: "assets/defaults/team/team-02.png" },
          { name: "Dr. Joao Francisco Goncalves de Andrade", credential: "Financiamentos e Renegociacao", image: "assets/defaults/team/team-03.png" }
        ]
      },
      assets: {}
    },
    testimonials: {
      content: {
        title: "Depoimentos dos nossos clientes",
        readMoreLabel: "Consulte mais informacao",
        readMoreUrl: "https://share.google/ht8uWHLPhla3a8RU3",
        disclaimer: "Os resultados podem variar de acordo com cada caso. Nao garantimos resultados especificos.",
        reviews: [
          { name: "", date: "", rating: 5, image: "", text: "Atendimento claro e objetivo desde o primeiro contato." },
          { name: "", date: "", rating: 5, image: "", text: "Consegui entender melhor meu contrato e o que poderia ser feito." },
          { name: "", date: "", rating: 5, image: "", text: "Equipe organizada, com retornos sempre dentro do combinado." },
          { name: "", date: "", rating: 5, image: "", text: "As orientações foram diretas e ajudaram bastante na decisão." },
          { name: "", date: "", rating: 5, image: "", text: "Gostei da seriedade no atendimento e da forma como conduziram o caso." },
          { name: "", date: "", rating: 5, image: "", text: "Fui bem atendido e tive uma visão mais clara sobre as alternativas." },
          { name: "", date: "", rating: 5, image: "", text: "O processo foi conduzido com atenção e comunicação simples." }
        ]
      },
      assets: {
        googleLogo: "assets/defaults/google-logo.png"
      }
    },
    cta: {
      content: {
        title: "Quer saber se ha algo abusivo no seu contrato?",
        text: "Envie uma mensagem e receba orientacao sobre os documentos necessarios.",
        button: {
          label: "Enviar meu contrato para analise",
          url: "{{brand.whatsappUrl}}",
          color: "black",
          rounding: "square"
        }
      },
      assets: {}
    },
    faq: {
      content: {
        eyebrow: "Duvidas frequentes",
        title: "Antes de iniciar a analise",
        questionsText: "Q1: Todo contrato pode ser revisado?\nR1: Todo contrato pode ser analisado, mas a viabilidade depende dos documentos, das taxas aplicadas e do contexto do caso.\n\nQ2: Preciso estar com parcelas em atraso?\nR2: Nao necessariamente. A avaliacao pode ocorrer com contrato em dia, atrasado ou encerrado.\n\nQ3: Quais documentos devo enviar?\nR3: Normalmente sao uteis contrato, extratos, boletos, comprovantes de pagamento e comunicacoes com a instituicao.\n\nQ4: A analise garante reducao da divida?\nR4: Nao. A analise serve para identificar possibilidades reais e evitar promessas sem base.",
        closing: "Substitua este texto por uma observacao final ou chamada de confianca.",
        checklistEyebrow: "O que avaliar",
        checklistTitle: "Pontos importantes",
        checklistText: "I1: Contrato - Taxas, prazos e condicoes principais.\nI2: Pagamentos - Historico de parcelas e comprovantes.\nI3: Comunicacoes - Mensagens, notificacoes e propostas do banco.\nI4: Objetivo - Reducao, renegociacao, defesa ou prevencao de risco.\nI5: Viabilidade - Analise tecnica antes de qualquer medida.",
        button: {
          label: "Enviar meu contrato para analise",
          url: "{{brand.whatsappUrl}}",
          color: "black",
          rounding: "square"
        }
      },
      assets: {}
    },
    footer: {
      content: {},
      assets: {}
    }
  },
  reviews: {}
};
